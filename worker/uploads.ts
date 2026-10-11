import { Env, body, fail, json, limitedBody } from "./types";
import { integer, text } from "./projects";
export const CHUNK = 8 * 1024 * 1024;
const TYPES: Record<string, string> = {
  "video/mp4": "mp4",
  "video/webm": "webm",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};
interface Upload {
  id: string;
  owner: string;
  object_key: string;
  r2_upload_id: string;
  filename: string;
  content_type: string;
  size: number;
  fingerprint: string;
  status: string;
  expires_at: number;
  validated: number;
}
interface Part {
  part: number;
  etag: string;
  sha256: string;
  size: number;
}
export async function digest(bytes: Uint8Array) {
  return [
    ...new Uint8Array(
      await crypto.subtle.digest("SHA-256", bytes as Uint8Array<ArrayBuffer>),
    ),
  ]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
function signature(bytes: Uint8Array, type: string) {
  const ascii = (start: number, len: number) =>
    new TextDecoder().decode(bytes.slice(start, start + len));
  if (type === "video/mp4") return bytes.length >= 12 && ascii(4, 4) === "ftyp";
  if (type === "video/webm")
    return (
      bytes[0] === 0x1a &&
      bytes[1] === 0x45 &&
      bytes[2] === 0xdf &&
      bytes[3] === 0xa3
    );
  if (type === "image/jpeg")
    return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (type === "image/png")
    return [137, 80, 78, 71, 13, 10, 26, 10].every((b, i) => bytes[i] === b);
  return (
    type === "image/webp" && ascii(0, 4) === "RIFF" && ascii(8, 4) === "WEBP"
  );
}
export async function cleanup(env: Env) {
  const rows = (
    await env.DB.prepare(
      "SELECT * FROM uploads WHERE status IN ('uploading','completing') AND expires_at<? LIMIT 100",
    )
      .bind(Date.now())
      .all<Upload>()
  ).results;
  for (const row of rows) {
    // Recover completion before expiring: an R2 success may have preceded a D1 failure.
    const object = await env.MEDIA.head(row.object_key);
    if (
      object?.size === row.size &&
      object.customMetadata?.upload_id === row.id
    ) {
      await env.DB.prepare("UPDATE uploads SET status='complete' WHERE id=?")
        .bind(row.id)
        .run();
      continue;
    }
    await env.MEDIA.resumeMultipartUpload(
      row.object_key,
      row.r2_upload_id,
    ).abort();
    await env.DB.prepare("UPDATE uploads SET status='aborted' WHERE id=?")
      .bind(row.id)
      .run();
    await env.DB.prepare("DELETE FROM upload_parts WHERE upload_id=?")
      .bind(row.id)
      .run();
  }
}
export async function uploadAPI(
  request: Request,
  env: Env,
  path: string,
  email: string,
): Promise<Response | null> {
  if (path === "/api/admin/uploads" && request.method === "POST") {
    const input = await body(request),
      type = text(input.content_type, "file type", 80),
      filename = text(input.filename, "filename", 255),
      fingerprint = text(input.fingerprint, "file fingerprint", 64);
    if (!TYPES[type] || !/^[a-f0-9]{64}$/.test(fingerprint))
      fail(400, "unsupported_file", "Choose MP4, WebM, JPEG, PNG or WebP.");
    const limit = type.startsWith("video/") ? 2 * 1024 ** 3 : 20 * 1024 ** 2;
    if (Number(input.size) > limit)
      fail(413, "too_large", "The file exceeds the upload size limit.");
    const size = integer(input.size, "file size", 1, limit);
    const active = await env.DB.prepare(
      "SELECT COUNT(*) AS total FROM uploads WHERE owner=? AND status IN ('uploading','completing') AND expires_at>?",
    )
      .bind(email, Date.now())
      .first<{ total: number }>();
    if (active!.total >= 10)
      fail(429, "upload_limit", "Resume or cancel an existing upload first.");
    const id = crypto.randomUUID(),
      key = `cms/${id}.${TYPES[type]}`;
    const upload = await env.MEDIA.createMultipartUpload(key, {
      httpMetadata: { contentType: type, cacheControl: "private, no-store" },
      customMetadata: { upload_id: id },
    });
    try {
      await env.DB.prepare(
        "INSERT INTO uploads(id,owner,object_key,r2_upload_id,filename,content_type,size,fingerprint,status,created_at,expires_at) VALUES (?,?,?,?,?,?,?,?,'uploading',?,?)",
      )
        .bind(
          id,
          email,
          key,
          upload.uploadId,
          filename,
          type,
          size,
          fingerprint,
          Date.now(),
          Date.now() + 86400000,
        )
        .run();
    } catch (error) {
      await upload.abort();
      throw error;
    }
    return json(
      { id, chunk_size: CHUNK, expires_at: Date.now() + 86400000 },
      201,
    );
  }
  const match = path.match(
    /^\/api\/admin\/uploads\/([a-f0-9-]{36})(?:\/(parts\/(\d+)|complete))?$/,
  );
  if (!match) return null;
  const row = await env.DB.prepare(
    "SELECT * FROM uploads WHERE id=? AND owner=?",
  )
    .bind(match[1], email)
    .first<Upload>();
  if (!row) fail(404, "not_found", "Upload not found.");
  const upload = row!;
  if (request.method === "GET" && !match[2]) {
    const parts = (
      await env.DB.prepare(
        "SELECT part,etag,sha256,size FROM upload_parts WHERE upload_id=? ORDER BY part",
      )
        .bind(upload.id)
        .all()
    ).results;
    return json({
      id: upload.id,
      size: upload.size,
      filename: upload.filename,
      fingerprint: upload.fingerprint,
      status: upload.status,
      expires_at: upload.expires_at,
      chunk_size: CHUNK,
      parts,
      url: upload.status === "complete" ? `/media/${upload.id}` : null,
    });
  }
  if (upload.status === "complete") {
    if (match[2] === "complete" && request.method === "POST")
      return json({ url: `/media/${upload.id}` });
    fail(409, "upload_complete", "This upload is already complete.");
  }
  if (upload.status === "aborted" || upload.expires_at < Date.now())
    fail(
      410,
      "upload_expired",
      "This upload expired or was cancelled. Start a new upload.",
    );
  if (request.method === "DELETE" && !match[2]) {
    if (upload.status === "completing")
      fail(
        409,
        "upload_busy",
        "The upload is being completed. Check its status before cancelling.",
      );
    await env.MEDIA.resumeMultipartUpload(
      upload.object_key,
      upload.r2_upload_id,
    ).abort();
    await env.DB.prepare("UPDATE uploads SET status='aborted' WHERE id=?")
      .bind(upload.id)
      .run();
    return json({ cancelled: true });
  }
  if (request.method === "PUT" && match[3]) {
    const part = integer(
      Number(match[3]),
      "part",
      1,
      Math.ceil(upload.size / CHUNK),
    );
    const bytes = await limitedBody(request, CHUNK),
      expected = Math.min(CHUNK, upload.size - (part - 1) * CHUNK);
    if (bytes.length !== expected)
      fail(400, "part_size", "This upload chunk has the wrong size.");
    const hash = await digest(bytes);
    if (request.headers.get("X-Part-SHA256") !== hash)
      fail(
        400,
        "checksum",
        "The upload chunk failed its integrity check. Retry it.",
      );
    const existing = await env.DB.prepare(
      "SELECT * FROM upload_parts WHERE upload_id=? AND part=?",
    )
      .bind(upload.id, part)
      .first<Part>();
    if (existing) {
      if (existing.sha256 !== hash)
        fail(
          409,
          "file_changed",
          "Reselect the original file or start a new upload.",
        );
      return json(existing);
    }
    if (upload.status !== "uploading")
      fail(409, "upload_busy", "The upload is being completed.");
    if (part === 1 && !signature(bytes, upload.content_type))
      fail(
        400,
        "unsupported_file",
        "The file contents do not match the selected file type.",
      );
    const receipt = await env.MEDIA.resumeMultipartUpload(
      upload.object_key,
      upload.r2_upload_id,
    ).uploadPart(part, bytes as Uint8Array<ArrayBuffer>);
    await env.DB.prepare(
      "INSERT INTO upload_parts(upload_id,part,etag,sha256,size) VALUES (?,?,?,?,?) ON CONFLICT(upload_id,part) DO NOTHING",
    )
      .bind(upload.id, part, receipt.etag, hash, bytes.length)
      .run();
    if (part === 1)
      await env.DB.prepare("UPDATE uploads SET validated=1 WHERE id=?")
        .bind(upload.id)
        .run();
    return json({ part, etag: receipt.etag, sha256: hash, size: bytes.length });
  }
  if (request.method === "POST" && match[2] === "complete") {
    const object = await env.MEDIA.head(upload.object_key);
    if (
      object &&
      object.size === upload.size &&
      object.customMetadata?.upload_id === upload.id
    ) {
      await env.DB.prepare("UPDATE uploads SET status='complete' WHERE id=?")
        .bind(upload.id)
        .run();
      return json({ url: `/media/${upload.id}` });
    }
    // A prior request may have stopped after taking the lock but before completing R2.
    // Keep active completion exclusive; reclaim only its expired two-minute lease.
    await env.DB.prepare(
      "UPDATE uploads SET status='uploading' WHERE id=? AND status='completing' AND EXISTS (SELECT 1 FROM upload_completion_leases WHERE upload_id=? AND started_at<?)",
    )
      .bind(upload.id, upload.id, Date.now() - 120000)
      .run();
    const parts = (
      await env.DB.prepare(
        "SELECT * FROM upload_parts WHERE upload_id=? ORDER BY part",
      )
        .bind(upload.id)
        .all<Part>()
    ).results;
    if (
      !upload.validated ||
      parts.length !== Math.ceil(upload.size / CHUNK) ||
      parts.reduce((sum, p) => sum + p.size, 0) !== upload.size ||
      parts.some(
        (p, i) =>
          p.part !== i + 1 ||
          p.size !== Math.min(CHUNK, upload.size - i * CHUNK),
      )
    )
      fail(
        400,
        "incomplete_upload",
        "Some upload chunks are missing. Resume the upload before completing.",
      );
    const [, locked] = await env.DB.batch([
      env.DB.prepare(
        "INSERT INTO upload_completion_leases(upload_id,started_at) SELECT id,? FROM uploads WHERE id=? AND status='uploading' ON CONFLICT(upload_id) DO UPDATE SET started_at=excluded.started_at",
      ).bind(Date.now(), upload.id),
      env.DB.prepare(
        "UPDATE uploads SET status='completing' WHERE id=? AND status='uploading'",
      ).bind(upload.id),
    ]);
    if (!locked.meta.changes)
      fail(409, "upload_busy", "The upload is being completed. Retry shortly.");
    try {
      await env.MEDIA.resumeMultipartUpload(
        upload.object_key,
        upload.r2_upload_id,
      ).complete(parts.map((p) => ({ partNumber: p.part, etag: p.etag })));
      await env.DB.prepare("UPDATE uploads SET status='complete' WHERE id=?")
        .bind(upload.id)
        .run();
    } catch (error) {
      await env.DB.prepare(
        "UPDATE uploads SET status='uploading' WHERE id=? AND status='completing'",
      )
        .bind(upload.id)
        .run();
      throw error;
    }
    return json({ url: `/media/${upload.id}` });
  }
  return null;
}
export async function serveMedia(
  request: Request,
  env: Env,
  id: string,
  admin = false,
) {
  const row = await env.DB.prepare(
    "SELECT object_key,content_type,size FROM uploads WHERE id=? AND status='complete'",
  )
    .bind(id)
    .first<{ object_key: string; content_type: string; size: number }>();
  if (!row) fail(404, "not_found", "Media not found.");
  if (!admin) {
    const reference = await env.DB.prepare(
      "SELECT id FROM projects WHERE published=1 AND (poster_url=? OR media_url=?) LIMIT 1",
    )
      .bind(`/media/${id}`, `/media/${id}`)
      .first();
    if (!reference) fail(404, "not_found", "Media not found.");
  }
  const headers = new Headers({
    "Content-Type": row!.content_type,
    "Accept-Ranges": "bytes",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
    "Content-Security-Policy": "default-src 'none'; sandbox",
  });
  const range = request.headers.get("range");
  let options: { offset: number; length: number } | undefined;
  if (range) {
    const m = range.match(/^bytes=(\d*)-(\d*)$/);
    if (!m || (!m[1] && !m[2]))
      return new Response(null, {
        status: 416,
        headers: {
          "Content-Range": `bytes */${row!.size}`,
          "Cache-Control": "no-store",
        },
      });
    const start = m[1] ? Number(m[1]) : Math.max(0, row!.size - Number(m[2])),
      end = m[1]
        ? m[2]
          ? Math.min(Number(m[2]), row!.size - 1)
          : row!.size - 1
        : row!.size - 1;
    if (
      !Number.isSafeInteger(start) ||
      !Number.isSafeInteger(end) ||
      start > end ||
      start >= row!.size
    )
      return new Response(null, {
        status: 416,
        headers: {
          "Content-Range": `bytes */${row!.size}`,
          "Cache-Control": "no-store",
        },
      });
    options = { offset: start, length: end - start + 1 };
    headers.set("Content-Range", `bytes ${start}-${end}/${row!.size}`);
  }
  headers.set("Content-Length", String(options?.length ?? row!.size));
  if (request.method === "HEAD")
    return new Response(null, { status: options ? 206 : 200, headers });
  const object = await env.MEDIA.get(
    row!.object_key,
    options ? { range: options } : undefined,
  );
  if (!object) fail(404, "not_found", "Media not found.");
  headers.set("ETag", object!.httpEtag);
  return new Response(object!.body, { status: options ? 206 : 200, headers });
}
