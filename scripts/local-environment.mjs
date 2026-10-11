import { createServer } from "node:http";
import { readFile, readdir } from "node:fs/promises";
import { generateKeyPair, exportJWK, SignJWT } from "jose";
import { Miniflare, convertV4MiniflareOptions } from "miniflare";
export async function createLocal({
  persist = false,
  persistencePath = ".local-state",
  port = 0,
  issuerPort = 0,
  origin = "http://127.0.0.1:8788",
  bindingOverrides = {},
} = {}) {
  const keys = await generateKeyPair("RS256", { extractable: true });
  const jwk = await exportJWK(keys.publicKey);
  jwk.kid = "local-fixture";
  jwk.alg = "RS256";
  jwk.use = "sig";
  const identity = createServer((req, res) => {
    res.setHeader("content-type", "application/json");
    res.end(JSON.stringify({ keys: [jwk] }));
  });
  await new Promise((resolve) =>
    identity.listen(issuerPort, "127.0.0.1", resolve),
  );
  const issuer = `http://127.0.0.1:${identity.address().port}`;
  let mf;
  const close = async () => {
    try {
      await mf?.dispose();
    } finally {
      await new Promise((resolve) => identity.close(resolve));
    }
  };
  try {
    mf = new Miniflare(
      convertV4MiniflareOptions({
        host: "127.0.0.1",
        port,
        ...(persist ? { resourcePersistencePath: persistencePath } : {}),
        workers: [
          {
            name: "cms",
            modules: true,
            scriptPath: "build/worker.mjs",
            compatibilityDate: "2026-10-04",
            assets: {
              directory: "build/public",
              binding: "ASSETS",
              routerConfig: {
                has_user_worker: true,
                invoke_user_worker_ahead_of_assets: true,
              },
              assetConfig: { html_handling: "none" },
            },
            d1Databases: { DB: "portfolio-local" },
            r2Buckets: { MEDIA: "media-local" },
            bindings: {
              PUBLIC_ORIGIN: origin,
              ACCESS_TEAM_DOMAIN: issuer,
              ACCESS_AUD: "local-audience",
              ADMIN_EMAILS: "client@example.test",
              ...bindingOverrides,
            },
          },
        ],
      }),
    );
    await mf.ready;
    const db = await mf.getD1Database("DB");
    // D1.exec expects statements on separate lines. Statements inside triggers stay intact.
    const migration = await readFile("migrations/0001_initial.sql", "utf8");
    for (const filename of (await readdir("migrations"))
      .filter((name) => name.endsWith(".sql"))
      .sort()) {
      const source = await readFile(`migrations/${filename}`, "utf8");
      const statements = source
        .split(/;\s*(?:\r?\n|$)/)
        .map((s) => s.trim())
        .filter(Boolean);
      await db.batch(statements.map((s) => db.prepare(s)));
    }
    const sign = async (claims = {}) =>
      new SignJWT({ email: "client@example.test", ...claims })
        .setProtectedHeader({ alg: "RS256", kid: "local-fixture" })
        .setIssuedAt()
        .setSubject("local-client")
        .setIssuer(issuer)
        .setAudience("local-audience")
        .setExpirationTime("1h")
        .sign(keys.privateKey);
    return {
      mf,
      db,
      migration,
      sign,
      keys,
      issuer,
      origin,
      close,
    };
  } catch (error) {
    await close();
    throw error;
  }
}
