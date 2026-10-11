import { Env, body, fail, json } from "./types";
import { text } from "./projects";

/*
 * Booking system (small jobs) and enquiry form (larger jobs).
 * Times are Suriname local time (America/Paramaribo, UTC-3 all year, no DST).
 */
export const SERVICES = ["logo", "poster", "business-card"] as const;
export const INQUIRY_SERVICES = ["promo", "social", "other"] as const;
const METHODS = ["phone", "whatsapp", "video"] as const;
const OFFSET_MS = -3 * 60 * 60 * 1000;
const FIRST_SLOT = 9 * 60; // 09:00
const LAST_SLOT = 17 * 60 + 30; // 17:30, so the last appointment ends at 18:00
const SLOT_MINUTES = 30;
const LEAD_MS = 2 * 60 * 60 * 1000; // book at least two hours ahead
const HORIZON_DAYS = 28;
const MAX_ACTIVE_BOOKINGS_PER_EMAIL = 2;
const MAX_INQUIRIES_PER_EMAIL_PER_DAY = 3;
const MAX_INQUIRIES_PER_HOUR = 30;

export const SLOT_TIMES: string[] = [];
for (let m = FIRST_SLOT; m <= LAST_SLOT; m += SLOT_MINUTES)
  SLOT_TIMES.push(
    `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`,
  );

const pad = (n: number) => String(n).padStart(2, "0");
const localDate = (ms: number) => {
  const d = new Date(ms + OFFSET_MS);
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
};
/** UTC milliseconds for a Suriname local date and HH:MM. */
const slotInstant = (day: string, time: string) =>
  Date.parse(`${day}T${time}:00Z`) - OFFSET_MS;
const weekday = (day: string) => new Date(`${day}T12:00:00Z`).getUTCDay();
const addDays = (day: string, n: number) => {
  const d = new Date(`${day}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};
const isDay = (value: unknown): value is string =>
  typeof value === "string" &&
  /^\d{4}-\d{2}-\d{2}$/.test(value) &&
  !Number.isNaN(Date.parse(`${value}T00:00:00Z`)) &&
  new Date(`${value}T00:00:00Z`).toISOString().startsWith(value);

function email(value: unknown) {
  const v = text(value, "email", 254).toLowerCase();
  if (!/^[^\s@<>()",;:]+@[^\s@<>()",;:]+\.[a-z]{2,}$/i.test(v))
    fail(400, "validation", "Check email.");
  return v;
}
function phone(value: unknown, required: boolean) {
  const v = text(value ?? "", "phone", 32, required);
  if (v && !/^\+?[0-9][0-9 ()./-]{5,30}$/.test(v))
    fail(400, "validation", "Check phone.");
  return v;
}
function pick<T extends readonly string[]>(
  value: unknown,
  options: T,
  name: string,
): T[number] {
  if (typeof value !== "string" || !options.includes(value))
    fail(400, "validation", `Check ${name}.`);
  return value as T[number];
}
function honeypot(input: Record<string, unknown>) {
  // Hidden "website" field: people never fill it in, simple bots do.
  if (input.website !== undefined && input.website !== "")
    fail(400, "validation", "Check the form.");
}
function sameOrigin(request: Request, env: Env) {
  if (!env.PUBLIC_ORIGIN || request.headers.get("Origin") !== env.PUBLIC_ORIGIN)
    fail(403, "origin_rejected", "Send this form from the website.");
}

export async function availability(env: Env, now = Date.now()) {
  const today = localDate(now);
  const last = addDays(today, HORIZON_DAYS - 1);
  const [booked, closed] = await Promise.all([
    env.DB.prepare(
      "SELECT slot_date,slot_time FROM appointments WHERE status='booked' AND slot_date BETWEEN ? AND ?",
    )
      .bind(today, last)
      .all<{ slot_date: string; slot_time: string }>(),
    env.DB.prepare("SELECT day FROM closed_days WHERE day BETWEEN ? AND ?")
      .bind(today, last)
      .all<{ day: string }>(),
  ]);
  const taken = new Set(
    booked.results.map((r) => `${r.slot_date} ${r.slot_time}`),
  );
  const closedDays = new Set(closed.results.map((r) => r.day));
  const days = [];
  for (let i = 0; i < HORIZON_DAYS; i++) {
    const day = addDays(today, i);
    const dow = weekday(day);
    if (dow === 0 || dow === 6) continue;
    const isClosed = closedDays.has(day);
    const slots = isClosed
      ? []
      : SLOT_TIMES.filter(
          (time) =>
            !taken.has(`${day} ${time}`) &&
            slotInstant(day, time) - now >= LEAD_MS,
        );
    days.push({ date: day, closed: isClosed, slots });
  }
  return {
    timezone: "America/Paramaribo",
    slotMinutes: SLOT_MINUTES,
    hours: { from: SLOT_TIMES[0], to: "18:00" },
    days,
  };
}

async function book(request: Request, env: Env, now = Date.now()) {
  sameOrigin(request, env);
  const input = await body(request);
  honeypot(input);
  const service = pick(input.service, SERVICES, "service");
  if (!isDay(input.date) || !SLOT_TIMES.includes(String(input.time)))
    fail(400, "validation", "Check date and time.");
  const day = input.date as string,
    time = input.time as string;
  const record = {
    name: text(input.name, "name", 120),
    email: email(input.email),
    phone: phone(input.phone, true),
    method: pick(input.method, METHODS, "contact method"),
    notes: text(input.notes ?? "", "notes", 1000, false),
    language: input.language === "en" ? "en" : "nl",
  };
  const open = await availability(env, now);
  const slotOpen = open.days.some(
    (d) => d.date === day && d.slots.includes(time),
  );
  if (!slotOpen)
    fail(
      409,
      "slot_unavailable",
      "This time is no longer available. Choose another time.",
    );
  const active = await env.DB.prepare(
    "SELECT COUNT(*) AS n FROM appointments WHERE email=? AND status='booked' AND slot_date>=?",
  )
    .bind(record.email, localDate(now))
    .first<{ n: number }>();
  if ((active?.n ?? 0) >= MAX_ACTIVE_BOOKINGS_PER_EMAIL)
    fail(
      429,
      "too_many_bookings",
      "You already have upcoming appointments. Contact us to change them.",
    );
  const id = crypto.randomUUID();
  try {
    await env.DB.prepare(
      "INSERT INTO appointments (id,service,slot_date,slot_time,name,email,phone,contact_method,notes,language,status,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,'booked',?,?)",
    )
      .bind(
        id,
        service,
        day,
        time,
        record.name,
        record.email,
        record.phone,
        record.method,
        record.notes,
        record.language,
        now,
        now,
      )
      .run();
  } catch (error) {
    // The partial unique index rejects a second booking for the same slot.
    if (
      /UNIQUE|constraint/i.test(
        String(error) + String((error as { cause?: unknown })?.cause),
      )
    )
      fail(
        409,
        "slot_unavailable",
        "This time is no longer available. Choose another time.",
      );
    throw error;
  }
  return json(
    {
      id,
      service,
      date: day,
      time,
      start: new Date(slotInstant(day, time)).toISOString(),
      minutes: SLOT_MINUTES,
    },
    201,
  );
}

async function inquire(request: Request, env: Env, now = Date.now()) {
  sameOrigin(request, env);
  const input = await body(request);
  honeypot(input);
  if (
    !Array.isArray(input.services) ||
    input.services.length < 1 ||
    input.services.length > INQUIRY_SERVICES.length
  )
    fail(400, "validation", "Check services.");
  const services = [
    ...new Set(
      (input.services as unknown[]).map((s) =>
        pick(s, INQUIRY_SERVICES, "services"),
      ),
    ),
  ];
  const record = {
    name: text(input.name, "name", 120),
    email: email(input.email),
    phone: phone(input.phone, false),
    company: text(input.company ?? "", "company", 160, false),
    message: text(input.message, "message", 4000),
    language: input.language === "en" ? "en" : "nl",
  };
  const [perEmail, recent] = await Promise.all([
    env.DB.prepare(
      "SELECT COUNT(*) AS n FROM inquiries WHERE email=? AND created_at>?",
    )
      .bind(record.email, now - 24 * 60 * 60 * 1000)
      .first<{ n: number }>(),
    env.DB.prepare("SELECT COUNT(*) AS n FROM inquiries WHERE created_at>?")
      .bind(now - 60 * 60 * 1000)
      .first<{ n: number }>(),
  ]);
  if (
    (perEmail?.n ?? 0) >= MAX_INQUIRIES_PER_EMAIL_PER_DAY ||
    (recent?.n ?? 0) >= MAX_INQUIRIES_PER_HOUR
  )
    fail(
      429,
      "too_many_requests",
      "We already received your request. Try again later or email us.",
    );
  const id = crypto.randomUUID();
  await env.DB.prepare(
    "INSERT INTO inquiries (id,services,name,email,phone,company,message,language,status,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,'new',?,?)",
  )
    .bind(
      id,
      JSON.stringify(services),
      record.name,
      record.email,
      record.phone,
      record.company,
      record.message,
      record.language,
      now,
      now,
    )
    .run();
  return json({ id }, 201);
}

/** Public endpoints. Returns null when the path is not a contact endpoint. */
export async function contactAPI(
  request: Request,
  env: Env,
  path: string,
): Promise<Response | null> {
  if (path === "/api/booking/slots") {
    if (request.method !== "GET")
      fail(405, "method_not_allowed", "This method is not available.");
    return json(await availability(env));
  }
  if (path === "/api/booking") {
    if (request.method !== "POST")
      fail(405, "method_not_allowed", "This method is not available.");
    return book(request, env);
  }
  if (path === "/api/inquiry") {
    if (request.method !== "POST")
      fail(405, "method_not_allowed", "This method is not available.");
    return inquire(request, env);
  }
  return null;
}

/** Administrator endpoints. Authorization runs before this is called. */
export async function bookingAdminAPI(
  request: Request,
  env: Env,
  path: string,
): Promise<Response | null> {
  const now = Date.now();
  const today = localDate(now);
  if (path === "/api/admin/bookings" && request.method === "GET") {
    const [upcoming, recent, inquiries, closed] = await Promise.all([
      env.DB.prepare(
        "SELECT * FROM appointments WHERE slot_date>=? ORDER BY slot_date,slot_time,created_at LIMIT 300",
      )
        .bind(today)
        .all(),
      env.DB.prepare(
        "SELECT * FROM appointments WHERE slot_date<? AND slot_date>=? ORDER BY slot_date DESC,slot_time DESC LIMIT 100",
      )
        .bind(today, addDays(today, -60))
        .all(),
      env.DB.prepare(
        "SELECT * FROM inquiries ORDER BY CASE status WHEN 'new' THEN 0 ELSE 1 END,created_at DESC LIMIT 300",
      ).all(),
      env.DB.prepare("SELECT day FROM closed_days WHERE day>=? ORDER BY day")
        .bind(today)
        .all<{ day: string }>(),
    ]);
    return json({
      today,
      timezone: "America/Paramaribo",
      upcoming: upcoming.results,
      recent: recent.results,
      inquiries: inquiries.results.map((row) => ({
        ...row,
        services: JSON.parse(String(row.services)),
      })),
      closedDays: closed.results.map((r) => r.day),
    });
  }
  const cancel = path.match(
    /^\/api\/admin\/appointments\/([a-f0-9-]{36})\/cancel$/,
  );
  if (cancel && request.method === "POST") {
    const result = await env.DB.prepare(
      "UPDATE appointments SET status='cancelled',updated_at=? WHERE id=? AND status='booked'",
    )
      .bind(now, cancel[1])
      .run();
    if (!result.meta.changes)
      fail(
        404,
        "not_found",
        "This appointment was not found or is already cancelled.",
      );
    return json({ ok: true });
  }
  const inquiry = path.match(
    /^\/api\/admin\/inquiries\/([a-f0-9-]{36})\/status$/,
  );
  if (inquiry && request.method === "POST") {
    const input = await body(request);
    const status = pick(input.status, ["new", "handled"] as const, "status");
    const result = await env.DB.prepare(
      "UPDATE inquiries SET status=?,updated_at=? WHERE id=?",
    )
      .bind(status, now, inquiry[1])
      .run();
    if (!result.meta.changes)
      fail(404, "not_found", "This enquiry was not found.");
    return json({ ok: true });
  }
  if (path === "/api/admin/closed-days" && request.method === "POST") {
    const input = await body(request);
    if (!isDay(input.day) || (input.day as string) < today)
      fail(400, "validation", "Choose today or a later date.");
    await env.DB.prepare(
      "INSERT OR IGNORE INTO closed_days (day,created_at) VALUES (?,?)",
    )
      .bind(input.day, now)
      .run();
    const existing = await env.DB.prepare(
      "SELECT COUNT(*) AS n FROM appointments WHERE slot_date=? AND status='booked'",
    )
      .bind(input.day)
      .first<{ n: number }>();
    return json({ ok: true, existingAppointments: existing?.n ?? 0 });
  }
  const closedDay = path.match(
    /^\/api\/admin\/closed-days\/(\d{4}-\d{2}-\d{2})$/,
  );
  if (closedDay && request.method === "DELETE") {
    await env.DB.prepare("DELETE FROM closed_days WHERE day=?")
      .bind(closedDay[1])
      .run();
    return json({ ok: true });
  }
  return null;
}
