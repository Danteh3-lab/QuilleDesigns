// Bridge an MCP-created asset session to Cloudflare's short-lived upload-token API.
// This helper does not deploy a Worker and never needs an account API token.
import {
  readFile,
  writeFile,
  mkdir,
  readdir,
  lstat,
  rm,
} from "node:fs/promises";
import { resolve, join, extname } from "node:path";
import { hash } from "blake3-wasm";

const root = resolve(".");
const publicDir = join(root, "build/public");
const stateDir = join(root, ".wrangler");
const manifestPath = join(stateDir, "cms-asset-manifest.json");
const sessionPath = join(stateDir, "cms-asset-session.json");
const completionPath = join(stateDir, "cms-asset-completion.json");
const config = JSON.parse(
  (await readFile("wrangler.production.jsonc", "utf8")).replace(
    /^\s*\/\/.*$/gm,
    "",
  ),
);
await mkdir(stateDir, { recursive: true });
const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
};

async function buildManifest(dir, prefix = "") {
  const manifest = {};
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if ((await lstat(path)).isSymbolicLink()) throw new Error("Linked asset");
    const relative = `${prefix}/${entry.name}`;
    if (entry.isDirectory())
      Object.assign(manifest, await buildManifest(path, relative));
    else {
      const extension = extname(entry.name);
      if (!mime[extension.toLowerCase()])
        throw new Error("Unexpected asset type");
      const data = await readFile(path);
      manifest[relative] = {
        hash: hash(data.toString("base64") + extension.substring(1))
          .toString("hex")
          .slice(0, 32),
        size: data.length,
      };
    }
  }
  return manifest;
}

if (process.argv[2] === "manifest") {
  const manifest = await buildManifest(publicDir);
  await writeFile(manifestPath, JSON.stringify(manifest), { mode: 0o600 });
  console.log(`Prepared ${Object.keys(manifest).length} public assets.`);
} else if (process.argv[2] === "upload") {
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  const session = JSON.parse(await readFile(sessionPath, "utf8"));
  const claims = JSON.parse(
    Buffer.from(session.jwt.split(".")[1], "base64url").toString(),
  );
  const single = claims.wrangler_single_asset_uploads === true;
  const buckets = single
    ? session.buckets.flat().map((h) => [h])
    : session.buckets;
  let completion = buckets.length ? null : session.jwt;
  let uploaded = 0;
  try {
    for (const bucket of buckets) {
      let result;
      for (let attempt = 0; attempt < 4; attempt++) {
        let body, url, headers;
        headers = { Authorization: `Bearer ${session.jwt}` };
        const entries = bucket.map((h) => {
          const entry = Object.entries(manifest).find(([, v]) => v.hash === h);
          if (!entry) throw new Error("Requested asset missing from manifest");
          return entry;
        });
        const form = new FormData();
        for (const [path, meta] of entries) {
          const fullPath = resolve(publicDir, `.${path}`);
          if (
            !fullPath.startsWith(publicDir + "\\") &&
            !fullPath.startsWith(publicDir + "/")
          )
            throw new Error("Unsafe asset path");
          const data = await readFile(fullPath);
          const extension = extname(path);
          if (
            data.length !== meta.size ||
            hash(data.toString("base64") + extension.substring(1))
              .toString("hex")
              .slice(0, 32) !== meta.hash
          )
            throw new Error("Asset changed after manifest creation");
          const type = mime[extension.toLowerCase()];
          if (single) {
            body = data;
            headers["Content-Type"] = type;
          } else
            form.append(
              meta.hash,
              new Blob([data.toString("base64")], { type }),
              meta.hash,
            );
        }
        const api = `https://api.cloudflare.com/client/v4/accounts/${config.account_id}/workers/assets/upload`;
        url = single ? `${api}/${bucket[0]}` : `${api}?base64=true`;
        if (!single) body = form;
        const response = await fetch(url, { method: "POST", headers, body });
        result = await response.json();
        if (response.ok && result.success !== false) break;
        if (attempt === 3 || (response.status < 500 && response.status !== 429))
          throw new Error(
            `Asset upload failed (${response.status}): ${result.errors?.map((e) => e.code).join(",")}`,
          );
        await new Promise((r) =>
          setTimeout(r, Math.min(1000 * 2 ** attempt, 5000)),
        );
      }
      if (result?.result?.jwt) completion = result.result.jwt;
      uploaded += bucket.length;
      console.log(
        `Uploaded ${uploaded}/${session.buckets.flat().length} changed assets.`,
      );
    }
    if (!completion) throw new Error("Missing asset completion token");
    await writeFile(completionPath, JSON.stringify({ jwt: completion }), {
      mode: 0o600,
    });
    console.log(
      "Assets prepared; completion token stored locally without logging it.",
    );
  } finally {
    await rm(sessionPath, { force: true });
  }
} else throw new Error("Use manifest or upload; this helper does not deploy.");
