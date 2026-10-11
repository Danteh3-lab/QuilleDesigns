export interface Env {
  DB: D1Database;
  MEDIA: R2Bucket;
  ASSETS: Fetcher;
  PUBLIC_ORIGIN: string;
  ACCESS_TEAM_DOMAIN: string;
  ACCESS_AUD: string;
  ADMIN_EMAILS: string;
}
export interface Project {
  id: string;
  title: string;
  category: "logo" | "video";
  orientation: "landscape" | "portrait";
  poster_url: string;
  media_url: string;
  alt_text: string;
  caption: string;
  description: string;
  width: number;
  height: number;
  display_order: number;
  published: number;
  revision: number;
}
export class HttpError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
  ) {
    super(message);
  }
}
export const fail = (status: number, code: string, message: string): never => {
  throw new HttpError(status, code, message);
};
export const json = (value: unknown, status = 200) =>
  Response.json(value, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
export async function limitedBody(
  request: Request,
  limit: number,
): Promise<Uint8Array> {
  if (!request.body) return new Uint8Array();
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let length = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > limit) {
        await reader.cancel();
        fail(413, "too_large", "The upload or request is too large.");
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const result = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }
  return result;
}
export async function body(request: Request): Promise<Record<string, unknown>> {
  if (!request.headers.get("content-type")?.startsWith("application/json"))
    fail(415, "json_required", "Send JSON for this request.");
  try {
    const value = JSON.parse(
      new TextDecoder().decode(await limitedBody(request, 32768)),
    );
    if (!value || typeof value !== "object" || Array.isArray(value))
      fail(400, "invalid_json", "Invalid request.");
    return value;
  } catch (error) {
    if (error instanceof HttpError) throw error;
    return fail(400, "invalid_json", "Invalid JSON.");
  }
}
