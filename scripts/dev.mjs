import { createServer } from "node:http";
import { spawnSync } from "node:child_process";
import { createLocal } from "./local-environment.mjs";
const built = spawnSync(process.execPath, ["scripts/build.mjs"], {
  stdio: "inherit",
});
if (built.status) process.exit(built.status);
const local = await createLocal({
  persist: process.env.CMS_TEST_FRESH !== "1",
  port: 8787,
  issuerPort: 8789,
});
// This loopback-only development proxy is not bundled into the Worker or public assets.
// The Worker always validates a real signed JWT; the proxy supplies a test identity.
const server = createServer(async (req, res) => {
  try {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers))
      if (value && !["host", "connection", "content-length"].includes(key))
        headers.set(key, Array.isArray(value) ? value.join(",") : value);
    if (!req.headers.cookie?.includes("cms-dev-anonymous=1"))
      headers.set("Cf-Access-Jwt-Assertion", await local.sign());
    const response = await local.mf.dispatchFetch(
      `http://127.0.0.1:8788${req.url}`,
      {
        method: req.method,
        headers,
        body: chunks.length ? Buffer.concat(chunks) : undefined,
        redirect: "manual",
      },
    );
    res.writeHead(response.status, Object.fromEntries(response.headers));
    if (response.body) {
      for await (const chunk of response.body) res.write(chunk);
    }
    res.end();
  } catch {
    res.writeHead(503);
    res.end("Local preview failed. Check the terminal.");
  }
});
server.listen(8788, "127.0.0.1", () =>
  console.log(
    "Local CMS: http://127.0.0.1:8788/admin\nPublic site: http://127.0.0.1:8788/\nTest identity: client@example.test (no Cloudflare account used)",
  ),
);
async function stop() {
  server.close();
  await local.close();
  process.exit(0);
}
process.on("SIGINT", stop);
process.on("SIGTERM", stop);
