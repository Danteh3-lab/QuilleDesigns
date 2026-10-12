import { Brand, Env, Project, body, fail, json } from "./types";
export function text(
  value: unknown,
  name: string,
  max: number,
  required = true,
): string {
  if (
    typeof value !== "string" ||
    value.length > max ||
    (required && !value.trim()) ||
    /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(value)
  )
    fail(400, "validation", `Check ${name}.`);
  return (value as string).trim();
}
export function integer(
  value: unknown,
  name: string,
  min = 0,
  max = 1000000,
): number {
  if (!Number.isInteger(value) || Number(value) < min || Number(value) > max)
    fail(400, "validation", `Check ${name}.`);
  return Number(value);
}
export function mediaURL(value: unknown): string {
  const url = text(value, "media URL", 2048);
  try {
    if (
      /^(?:\/)?assets\/[a-z0-9% _./()-]+$/i.test(url) &&
      !decodeURIComponent(url).split("/").includes("..") &&
      !/%(?:2f|5c)/i.test(url)
    )
      return url;
  } catch {
    return fail(400, "validation", "Use a valid media URL.");
  }
  if (/^\/media\/[a-f0-9-]{36}$/.test(url)) return url;
  try {
    const parsed = new URL(url);
    if (
      parsed.protocol === "https:" &&
      !parsed.username &&
      !parsed.password &&
      !/[\r\n\s]/.test(url)
    )
      return url;
  } catch {
    /* Invalid URL. */
  }
  return fail(
    400,
    "validation",
    "Use a direct HTTPS media URL or a completed upload.",
  );
}
export function validateProject(
  input: Record<string, unknown>,
): Omit<Project, "id" | "revision"> {
  if (
    !["logo", "video"].includes(String(input.category)) ||
    !["landscape", "portrait"].includes(String(input.orientation)) ||
    typeof input.published !== "boolean"
  )
    fail(400, "validation", "Check category, format and publication status.");
  return {
    title: text(input.title, "title", 160),
    category: input.category as Project["category"],
    orientation:
      input.category === "logo"
        ? "landscape"
        : (input.orientation as Project["orientation"]),
    poster_url: mediaURL(input.poster_url),
    media_url: mediaURL(input.media_url),
    alt_text: text(input.alt_text, "alt text", 600),
    caption: text(input.caption ?? "", "caption", 160, false),
    description: text(input.description ?? "", "description", 1000, false),
    // Films are grouped under their brand on the portfolio; logos have none.
    brand:
      input.category === "video"
        ? text(input.brand ?? "", "brand", 120, false)
        : "",
    width: integer(input.width, "width", 1, 20000),
    height: integer(input.height, "height", 1, 20000),
    display_order: integer(input.display_order, "display order"),
    published: input.published ? 1 : 0,
  };
}
export const brandSlug = (value: string) =>
  value
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "brand";
// Saving a film adds its brand to the brand list; a logo given with it becomes that brand's logo.
async function brandStatements(
  env: Env,
  p: Omit<Project, "id" | "revision">,
  logo: unknown,
) {
  if (!p.brand) return [];
  const logoURL = String(logo ?? "").trim() ? mediaURL(logo) : "";
  if (logoURL.startsWith("/media/")) {
    const asset = await env.DB.prepare(
      "SELECT content_type FROM uploads WHERE id=? AND status='complete'",
    )
      .bind(logoURL.slice(7))
      .first<{ content_type: string }>();
    if (!asset?.content_type.startsWith("image/"))
      fail(400, "validation", "Choose a completed image upload for the logo.");
  }
  // A new name whose slug is already used by another brand ("Terzol" vs "Terzol Vastgoed")
  // gets a numbered id, so the insert is not silently ignored.
  const slug = brandSlug(p.brand);
  const taken = new Set(
    (
      await env.DB.prepare("SELECT id FROM brands WHERE id=? OR id LIKE ?")
        .bind(slug, `${slug}-%`)
        .all<{ id: string }>()
    ).results.map((row) => row.id),
  );
  let id = slug;
  for (let n = 2; taken.has(id); n++) id = `${slug}-${n}`;
  return [
    env.DB.prepare(
      "INSERT OR IGNORE INTO brands(id,name,logo_url,display_order) SELECT ?,?,?,COALESCE(MAX(display_order),-10)+10 FROM brands",
    ).bind(id, p.brand, logoURL),
    ...(logoURL
      ? [
          env.DB.prepare(
            "UPDATE brands SET logo_url=? WHERE name=? COLLATE NOCASE",
          ).bind(logoURL, p.brand),
        ]
      : []),
  ];
}
export async function guardBatch(
  env: Env,
  condition: string,
  bindings: unknown[],
  statements: D1PreparedStatement[],
) {
  await env.DB.batch([
    env.DB.prepare(
      `INSERT INTO mutation_guard(valid) SELECT CASE WHEN ${condition} THEN 1 ELSE 0 END`,
    ).bind(...bindings),
    ...statements,
    env.DB.prepare("DELETE FROM mutation_guard"),
  ]);
}
export async function publicData(env: Env) {
  const [projects, featured, brands] = await env.DB.batch([
    env.DB.prepare(
      "SELECT * FROM projects WHERE published=1 ORDER BY category DESC,orientation,display_order,id",
    ),
    env.DB.prepare(
      "SELECT p.*,f.slot FROM featured_slots f JOIN projects p ON p.id=f.project_id WHERE p.published=1 AND p.category='video' ORDER BY f.slot",
    ),
    env.DB.prepare("SELECT * FROM brands ORDER BY display_order,name"),
  ]);
  return {
    projects: projects.results as unknown as Project[],
    featured: featured.results as unknown as (Project & { slot: number })[],
    brands: brands.results as unknown as Brand[],
  };
}
export async function projectAPI(
  request: Request,
  env: Env,
  path: string,
): Promise<Response | null> {
  const method = request.method;
  if (path === "/api/admin/featured") {
    if (method === "GET")
      return json(
        (
          await env.DB.prepare(
            "SELECT f.*,p.title FROM featured_slots f JOIN projects p ON p.id=f.project_id ORDER BY slot",
          ).all()
        ).results,
      );
    if (method === "PUT") {
      const data = await body(request);
      const slots = data.slots as {
        slot: number;
        project_id: string;
        revision: number;
      }[];
      if (
        !Array.isArray(slots) ||
        slots.length !== 2 ||
        slots[0]?.slot !== 1 ||
        slots[1]?.slot !== 2 ||
        slots[0].project_id === slots[1].project_id
      )
        fail(
          400,
          "validation",
          "Choose two different published video projects.",
        );
      slots.forEach((s) => {
        text(s.project_id, "project", 80);
        integer(s.revision, "revision", 1);
      });
      await guardBatch(
        env,
        "(SELECT COUNT(*) FROM featured_slots WHERE (slot=1 AND revision=?) OR (slot=2 AND revision=?))=2",
        [slots[0].revision, slots[1].revision],
        [
          env.DB.prepare("DELETE FROM featured_slots"),
          ...slots.map((s) =>
            env.DB.prepare(
              "INSERT INTO featured_slots(slot,project_id,revision) VALUES (?,?,?)",
            ).bind(s.slot, s.project_id, s.revision + 1),
          ),
        ],
      );
      return json({ saved: true });
    }
  }
  if (path === "/api/admin/video-options" && method === "GET")
    return json(
      (
        await env.DB.prepare(
          "SELECT id,title FROM projects WHERE published=1 AND category='video' ORDER BY display_order,id",
        ).all()
      ).results,
    );
  if (path === "/api/admin/brands" && method === "GET")
    return json(
      (
        await env.DB.prepare(
          "SELECT * FROM brands ORDER BY display_order,name",
        ).all()
      ).results,
    );
  if (path === "/api/admin/projects") {
    if (method === "GET") {
      const url = new URL(request.url);
      const page = integer(
        Number(url.searchParams.get("page") || 1),
        "page",
        1,
        100000,
      );
      const group = url.searchParams.get("group") || "all";
      const clauses: Record<string, string> = {
        all: "1=1",
        logo: "category='logo'",
        landscape: "category='video' AND orientation='landscape'",
        portrait: "category='video' AND orientation='portrait'",
      };
      if (!clauses[group]) fail(400, "validation", "Invalid project group.");
      const where = clauses[group];
      const count = await env.DB.prepare(
        `SELECT COUNT(*) AS total FROM projects WHERE ${where}`,
      ).first<{ total: number }>();
      const actualPage = Math.min(
        page,
        Math.max(1, Math.ceil(count!.total / 24)),
      );
      const projects = await env.DB.prepare(
        `SELECT * FROM projects WHERE ${where} ORDER BY category DESC,orientation,display_order,id LIMIT 24 OFFSET ?`,
      )
        .bind((actualPage - 1) * 24)
        .all();
      return json({
        projects: projects.results,
        total: count!.total,
        page: actualPage,
        page_size: 24,
      });
    }
    if (method === "POST") {
      const input = await body(request);
      const p = validateProject(input);
      await checkUploads(env, p);
      const brand = await brandStatements(env, p, input.brand_logo_url);
      const id = crypto.randomUUID();
      const keys = Object.keys(p);
      await env.DB.batch([
        env.DB.prepare(
          `INSERT INTO projects(id,${keys.join(",")}) VALUES (?,${keys.map(() => "?").join(",")})`,
        ).bind(id, ...Object.values(p)),
        ...brand,
      ]);
      return json({ id, revision: 1 }, 201);
    }
  }
  const match = path.match(/^\/api\/admin\/projects\/([a-z0-9-]+)(\/move)?$/);
  if (match) {
    const id = match[1];
    const current = await env.DB.prepare("SELECT * FROM projects WHERE id=?")
      .bind(id)
      .first<Project>();
    if (!current) fail(404, "not_found", "Project not found.");
    if (method === "GET" && !match[2]) return json(current);
    const input = await body(request);
    const revision = integer(input.revision, "revision", 1);
    if (current!.revision !== revision)
      fail(
        409,
        "stale_revision",
        "This project changed in another tab. Reload before saving.",
      );
    if (match[2] && method === "POST") {
      if (!["up", "down"].includes(String(input.direction)))
        fail(400, "validation", "Invalid direction.");
      const state = await env.DB.prepare(
        "SELECT revision FROM cms_state WHERE id=1",
      ).first<{ revision: number }>();
      const rows = (
        await env.DB.prepare(
          "SELECT id FROM projects WHERE category=? AND orientation=? ORDER BY display_order,id",
        )
          .bind(current!.category, current!.orientation)
          .all<{ id: string }>()
      ).results;
      const index = rows.findIndex((p) => p.id === id),
        neighbor = index + (input.direction === "up" ? -1 : 1);
      if (neighbor < 0 || neighbor >= rows.length) return json({ saved: true });
      [rows[index], rows[neighbor]] = [rows[neighbor], rows[index]];
      const orders = JSON.stringify(
        rows.map((p, i) => ({ id: p.id, order: i * 10 })),
      );
      await guardBatch(
        env,
        "(SELECT revision FROM cms_state WHERE id=1)=? AND EXISTS(SELECT 1 FROM projects WHERE id=? AND revision=?)",
        [state!.revision, id, revision],
        [
          env.DB.prepare(
            "UPDATE projects SET display_order=(SELECT json_extract(value,'$.order') FROM json_each(?) WHERE json_extract(value,'$.id')=projects.id),revision=revision+1 WHERE category=? AND orientation=?",
          ).bind(orders, current!.category, current!.orientation),
        ],
      );
      return json({ saved: true });
    }
    if (method === "PUT" && !match[2]) {
      const p = validateProject(input);
      await checkUploads(env, p);
      const brand = await brandStatements(env, p, input.brand_logo_url);
      const keys = Object.keys(p);
      // The guard aborts the whole batch, brand changes included, if the project changed meanwhile.
      await guardBatch(
        env,
        "EXISTS(SELECT 1 FROM projects WHERE id=? AND revision=?)",
        [id, revision],
        [
          env.DB.prepare(
            `UPDATE projects SET ${keys.map((k) => `${k}=?`).join(",")},revision=revision+1 WHERE id=? AND revision=?`,
          ).bind(...Object.values(p), id, revision),
          ...brand,
        ],
      );
      return json({ saved: true });
    }
    if (method === "DELETE" && !match[2]) {
      const result = await env.DB.prepare(
        "DELETE FROM projects WHERE id=? AND revision=?",
      )
        .bind(id, revision)
        .run();
      if (!result.meta.changes)
        fail(
          409,
          "stale_revision",
          "This project changed. Reload before deleting.",
        );
      return json({ deleted: true });
    }
  }
  return null;
}
async function checkUploads(env: Env, p: Omit<Project, "id" | "revision">) {
  for (const [url, video] of [
    [p.poster_url, false],
    [p.media_url, p.category === "video"],
  ] as const) {
    if (!url.startsWith("/media/")) continue;
    const asset = await env.DB.prepare(
      "SELECT content_type FROM uploads WHERE id=? AND status='complete'",
    )
      .bind(url.slice(7))
      .first<{ content_type: string }>();
    if (!asset || asset.content_type.startsWith("video/") !== video)
      fail(
        400,
        "validation",
        "Choose a completed upload of the correct media type.",
      );
  }
}
