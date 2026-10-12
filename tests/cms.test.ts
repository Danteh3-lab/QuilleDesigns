import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile, mkdir, mkdtemp, rm } from "node:fs/promises";
import { resolve, sep } from "node:path";
import { SignJWT } from "jose";
import { createLocal } from "../scripts/local-environment.mjs";
import { cleanup } from "../worker/uploads";
const fixture = JSON.parse(
  await readFile("tests/legacy-projects.json", "utf8"),
);
test("local Worker, D1 and R2 integration", async (t) => {
  const local = await createLocal();
  t.after(() => local.close());
  const { mf, db } = local;
  const probe = await mf.dispatchFetch(`${local.origin}/api/portfolio`);
  assert.equal(probe.status, 200, await probe.text());
  const call = async (
    path: string,
    method = "GET",
    data?: unknown,
    token?: string,
    origin = local.origin,
  ) =>
    mf.dispatchFetch(`${local.origin}${path}`, {
      method,
      headers: {
        "Cf-Access-Jwt-Assertion": token ?? (await local.sign()),
        Origin: origin,
        "X-CMS-Request": "1",
        "Content-Type": "application/json",
      },
      body: data === undefined ? undefined : JSON.stringify(data),
    });
  const project = async (id: string) =>
    (await call(`/api/admin/projects/${id}`)).json();
  await t.test(
    "services routes serve public static content without admin access",
    async () => {
      for (const path of ["/services", "/services.html"]) {
        const response = await mf.dispatchFetch(`${local.origin}${path}`);
        assert.equal(response.status, 200, path);
        const html = await response.text();
        assert.ok(html.includes('data-site-page="services"'));
        for (const id of [
          "promo-production",
          "poster-design",
          "logo-design",
          "business-card-design",
          "social-media-management",
        ])
          assert.ok(html.includes(`id="${id}"`));
        assert.ok(!html.includes("SHARED HEADER"));
        assert.ok(!html.includes("/api/admin"));
        const head = await mf.dispatchFetch(`${local.origin}${path}`, {
          method: "HEAD",
        });
        assert.equal(head.status, 200);
        assert.equal(await head.text(), "");
      }
      const redirect = await mf.dispatchFetch(`${local.origin}/services/`, {
        redirect: "manual",
      });
      assert.equal(redirect.status, 301);
      assert.equal(redirect.headers.get("Location"), "/services.html");
      const post = await mf.dispatchFetch(`${local.origin}/services`, {
        method: "POST",
      });
      assert.equal(post.status, 405);
    },
  );
  await t.test(
    "all legacy records, links, captions and featured slots survive import",
    async () => {
      const data = await (await call("/api/portfolio")).json();
      assert.equal(data.projects.length, 12);
      for (const original of fixture) {
        const { brand, brand_logo_url, ...imported } = data.projects.find(
          (p: any) => p.id === original.id,
        );
        assert.deepEqual(imported, original);
      }
      assert.deepEqual(
        data.featured.map((p: any) => p.id),
        ["smartwigi", "terzol"],
      );
      const html = await (await call("/portfolio.html")).text();
      assert.equal((html.match(/class="project-card /g) || []).length, 12);
      assert.ok(html.includes("project-smartwigi"));
      assert.ok(html.includes("project-yuchel"));
    },
  );
  await t.test("films are grouped under one card per brand", async () => {
    const data = await (await call("/api/portfolio")).json();
    const brandOf = (id: string) =>
      data.projects.find((p: any) => p.id === id).brand;
    assert.deepEqual(
      ["smartwigi", "fake-alexa", "baby", "terzol", "mage-ev"].map(brandOf),
      [
        "Smartwigi",
        "Smartwigi",
        "Smartwigi",
        "Terzol Vastgoed",
        "Sansoers Imports",
      ],
    );
    assert.equal(brandOf("yuchel"), "");
    assert.deepEqual(
      data.brands.map((b: any) => b.id),
      [
        "smartwigi",
        "terzol",
        "sansoers-imports",
        "ingrediently",
        "xus-super-store",
      ],
    );
    const html = await (await call("/portfolio.html")).text();
    const cards = [
      ...html.matchAll(
        /<(details|article) class="brand-card[^"]*" id="brand-([\w-]+)"/g,
      ),
    ].map((m) => `${m[1]}:${m[2]}`);
    assert.deepEqual(cards, [
      "details:smartwigi",
      "details:terzol",
      "details:sansoers-imports",
      "article:ingrediently",
      "article:xus-super-store",
    ]);
    const smartwigi = html.slice(
      html.indexOf('id="brand-smartwigi"'),
      html.indexOf('id="brand-terzol"'),
    );
    for (const id of ["smartwigi", "fake-alexa", "baby"])
      assert.ok(smartwigi.includes(`id="project-${id}"`), id);
    assert.ok(smartwigi.includes('src="assets/partners/smartwigi%20OG.jpg"'));
    assert.ok(smartwigi.includes("<b>03</b> <span>films</span>"));
    assert.ok(html.includes('src="assets/partners/Sansoer%20Partner.png"'));
    assert.ok(html.includes("Films coming soon"));
    assert.equal(
      (html.match(/data-media="video"/g) || []).length,
      5,
      "every film keeps its direct link",
    );
    const baby = await project("baby");
    assert.equal(
      (
        await call("/api/admin/projects", "POST", {
          ...baby,
          published: false,
          brand_logo_url: "javascript:alert(1)",
        })
      ).status,
      400,
    );
    // A new brand name on a film adds that brand, with the logo given alongside.
    const created = await call("/api/admin/projects", "POST", {
      ...baby,
      published: true,
      brand: "  New Client  ",
      brand_logo_url: "assets/partners/smartwigi%20OG.jpg",
    });
    assert.equal(created.status, 201);
    const saved = await project((await created.json()).id);
    assert.equal(saved.brand, "New Client");
    const brands = await (await call("/api/admin/brands")).json();
    assert.deepEqual(brands.at(-1), {
      id: "new-client",
      name: "New Client",
      logo_url: "assets/partners/smartwigi%20OG.jpg",
      display_order: 50,
    });
    const withNew = await (await call("/portfolio.html")).text();
    assert.ok(
      withNew.includes('<details class="brand-card" id="brand-new-client"'),
    );
    // Saving an existing brand with a new logo replaces that brand's logo.
    const renamed = await call(`/api/admin/projects/${saved.id}`, "PUT", {
      ...saved,
      published: true,
      brand: "new client",
      brand_logo_url: "assets/partners/Sansoer%20Partner.png",
    });
    assert.equal(renamed.status, 200);
    assert.equal(
      (await (await call("/api/admin/brands")).json()).at(-1).logo_url,
      "assets/partners/Sansoer%20Partner.png",
    );
    const logo = await project("yuchel");
    const updated = await call("/api/admin/projects/yuchel", "PUT", {
      ...logo,
      published: true,
      brand: "Ignored",
    });
    assert.equal(updated.status, 200);
    assert.equal((await project("yuchel")).brand, "", "logos have no brand");
    const current = await project(saved.id);
    assert.equal(
      (
        await call(`/api/admin/projects/${saved.id}`, "DELETE", {
          revision: current.revision,
        })
      ).status,
      200,
    );
    await db.prepare("DELETE FROM brands WHERE id='new-client'").run();
  });
  await t.test(
    "authorization fails closed on every admin entry path",
    async () => {
      for (const path of [
        "/admin",
        "/admin/index.html",
        "/admin/admin.js",
        "/admin/admin.css",
        "/api/admin/projects",
        "/admin%2Findex.html",
        "//admin/index.html",
      ]) {
        const r = await mf.dispatchFetch(`${local.origin}${path}`);
        assert.equal(r.status, 401, path);
      }
      assert.equal(
        (await call("/api/admin/session", "GET", undefined, "forged")).status,
        401,
      );
      assert.equal(
        (
          await call(
            "/api/admin/session",
            "GET",
            undefined,
            await local.sign({ email: "outsider@example.test" }),
          )
        ).status,
        403,
      );
      const signed = async (aud: string, exp: number) =>
        new SignJWT({ email: "client@example.test" })
          .setProtectedHeader({ alg: "RS256", kid: "local-fixture" })
          .setSubject("x")
          .setIssuedAt()
          .setIssuer(local.issuer)
          .setAudience(aud)
          .setExpirationTime(exp)
          .sign(local.keys.privateKey);
      assert.equal(
        (
          await call(
            "/api/admin/session",
            "GET",
            undefined,
            await signed("wrong", Math.floor(Date.now() / 1000) + 1000),
          )
        ).status,
        401,
      );
      assert.equal(
        (
          await call(
            "/api/admin/session",
            "GET",
            undefined,
            await signed("local-audience", Math.floor(Date.now() / 1000) - 20),
          )
        ).status,
        401,
      );
      assert.equal(
        (
          await call(
            "/api/admin/projects",
            "POST",
            {},
            undefined,
            "https://attacker.example",
          )
        ).status,
        403,
      );
      assert.equal((await call("/api/portfolio")).status, 200);
    },
  );
  await t.test(
    "featured lifecycle, updates, conflicts, ordering and safe HTML",
    async () => {
      let p = await project("smartwigi");
      assert.equal(
        (await call("/api/admin/featured", "PUT", { slots: [null, null] }))
          .status,
        400,
      );
      assert.equal(
        (
          await call("/api/admin/projects/smartwigi", "PUT", {
            ...p,
            category: "logo",
            published: true,
          })
        ).status,
        409,
      );
      assert.equal(
        (
          await call("/api/admin/projects/smartwigi", "PUT", {
            ...p,
            published: false,
          })
        ).status,
        409,
      );
      assert.equal(
        (
          await call("/api/admin/projects/smartwigi", "DELETE", {
            revision: p.revision,
          })
        ).status,
        409,
      );
      let slots = await (await call("/api/admin/featured")).json();
      const replacement = slots.map((s: any) => ({
        ...s,
        project_id: s.slot === 1 ? "mage-ev" : "terzol",
      }));
      assert.equal(
        (await call("/api/admin/featured", "PUT", { slots: replacement }))
          .status,
        200,
      );
      assert.equal(
        (await call("/api/admin/featured", "PUT", { slots: replacement }))
          .status,
        409,
      );
      assert.equal(
        (
          await call("/api/admin/projects/smartwigi", "PUT", {
            ...p,
            published: false,
          })
        ).status,
        200,
      );
      assert.equal(
        (
          await call("/api/admin/projects/smartwigi", "PUT", {
            ...p,
            published: true,
          })
        ).status,
        409,
      );
      const publicHTML = await (await call("/portfolio.html")).text();
      assert.ok(!publicHTML.includes('id="project-smartwigi"'));
      const conditional = await mf.dispatchFetch(
        `${local.origin}/portfolio.html`,
        { headers: { "If-None-Match": "*" } },
      );
      assert.equal(conditional.status, 200);
      assert.equal(conditional.headers.get("cache-control"), "no-store");
      assert.equal(conditional.headers.get("etag"), null);
      assert.ok(!(await conditional.text()).includes('id="project-smartwigi"'));
      const home = await (await call("/")).text();
      assert.ok(home.includes('data-video-title="Mage EV"'));
      assert.ok(home.includes("data-hero-band"));
      // Scroll motion (headings, image curtains, sliding sections, marquee lean).
      assert.ok(home.includes("motion.js") && home.includes("motion.css"));
      // One shared horizon background wraps partners, testimonials and contact.
      assert.ok(
        home.includes("data-horizon") &&
          home.includes("horizon.js") &&
          home.indexOf("data-horizon") < home.indexOf('id="brands"') &&
          home.indexOf('id="brands"') < home.indexOf('id="contact"'),
      );
      // About us: Threads background instead of the Mage EV frame sequence.
      assert.ok(
        home.includes("data-process-threads") &&
          home.includes("about-threads.js") &&
          !home.includes("mage-ev-sequence"),
      );
      // The logo intro plays on every homepage visit, not once per session.
      assert.ok(
        home.includes("qd-intro-pending") && !home.includes("qd-intro-seen"),
      );
      assert.ok(!home.includes("LandingpageQuille.mp4"));
      p = await project("baby");
      const created = await call("/api/admin/projects", "POST", {
        ...p,
        title: "<img src=x onerror=alert(1)>",
        published: true,
        poster_url: "https://example.com/poster.jpg",
      });
      assert.equal(created.status, 201);
      const id = (await created.json()).id;
      const html = await (await call("/portfolio.html")).text();
      assert.ok(html.includes("&lt;img src=x onerror=alert(1)&gt;"));
      assert.ok(!html.includes("<h3 data-client-content><img"));
      assert.equal(
        (
          await call("/api/admin/projects", "POST", {
            ...p,
            published: true,
            media_url: "javascript:alert(1)",
          })
        ).status,
        400,
      );
      assert.equal(
        (
          await call("/api/admin/projects", "POST", {
            ...p,
            published: true,
            poster_url: "assets/%2e%2e/admin/index.html",
          })
        ).status,
        400,
      );
      p = await project("fake-alexa");
      assert.equal(
        (
          await call("/api/admin/projects/fake-alexa/move", "POST", {
            revision: p.revision,
            direction: "up",
          })
        ).status,
        200,
      );
      const rows = await db
        .prepare(
          "SELECT id FROM projects WHERE category='video' AND orientation='portrait' ORDER BY display_order,id",
        )
        .all();
      assert.equal(rows.results[0].id, "fake-alexa");
      const added = await project(id);
      assert.equal(
        (
          await call(`/api/admin/projects/${id}`, "DELETE", {
            revision: added.revision,
          })
        ).status,
        200,
      );
      // A deleted seed must not reappear when the migration file is rerun manually.
      p = await project("yuchel");
      await call("/api/admin/projects/yuchel", "DELETE", {
        revision: p.revision,
      });
      await db.batch(
        local.migration
          .split(/;\s*(?:\r?\n|$)/)
          .map((s: string) => s.trim())
          .filter(Boolean)
          .map((s: string) => db.prepare(s)),
      );
      assert.equal((await call("/api/admin/projects/yuchel")).status, 404);
    },
  );
  await t.test(
    "112 MiB multipart, resume, integrity, completion, retention and range requests",
    async () => {
      const size = 112 * 1024 * 1024 + 17,
        chunk = 8 * 1024 * 1024;
      const initial = await call("/api/admin/uploads", "POST", {
        filename: "large.mp4",
        content_type: "video/mp4",
        size,
        fingerprint: "a".repeat(64),
      });
      assert.equal(initial.status, 201);
      const id = (await initial.json()).id;
      assert.equal(
        (await call(`/api/admin/uploads/${id}/complete`, "POST", {})).status,
        400,
      );
      const token = await local.sign();
      for (let part = 1; part <= Math.ceil(size / chunk); part++) {
        const bytes = new Uint8Array(
          Math.min(chunk, size - (part - 1) * chunk),
        );
        if (part === 1) bytes.set(new TextEncoder().encode("ftyp"), 4);
        const sha = [
          ...new Uint8Array(await crypto.subtle.digest("SHA-256", bytes)),
        ]
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("");
        const send = (hash = sha) =>
          mf.dispatchFetch(
            `${local.origin}/api/admin/uploads/${id}/parts/${part}`,
            {
              method: "PUT",
              headers: {
                "Cf-Access-Jwt-Assertion": token,
                Origin: local.origin,
                "X-CMS-Request": "1",
                "X-Part-SHA256": hash,
              },
              body: bytes,
            },
          );
        if (part === 1) assert.equal((await send("wrong")).status, 400);
        assert.equal((await send()).status, 200);
        if (part === 2) {
          assert.equal((await send()).status, 200);
          const state = await (await call(`/api/admin/uploads/${id}`)).json();
          assert.equal(state.parts.length, 2);
        }
      }
      // Simulate interruption after taking the completion lock, then reclaim its expired lease.
      await db
        .prepare(
          "INSERT INTO upload_completion_leases(upload_id,started_at) VALUES (?,?)",
        )
        .bind(id, Date.now())
        .run();
      await db
        .prepare("UPDATE uploads SET status='completing' WHERE id=?")
        .bind(id)
        .run();
      assert.equal(
        (await call(`/api/admin/uploads/${id}/complete`, "POST", {})).status,
        409,
      );
      await db
        .prepare(
          "UPDATE upload_completion_leases SET started_at=0 WHERE upload_id=?",
        )
        .bind(id)
        .run();
      assert.equal(
        (await call(`/api/admin/uploads/${id}/complete`, "POST", {})).status,
        200,
      );
      assert.equal(
        (await call(`/api/admin/uploads/${id}/complete`, "POST", {})).status,
        200,
      );
      assert.equal((await call(`/media/${id}`)).status, 404);
      const p = await project("baby");
      const created = await (
        await call("/api/admin/projects", "POST", {
          ...p,
          title: "Uploaded film",
          published: true,
          media_url: `/media/${id}`,
        })
      ).json();
      const range = await mf.dispatchFetch(`${local.origin}/media/${id}`, {
        headers: { Range: "bytes=0-15" },
      });
      assert.equal(range.status, 206);
      assert.equal(range.headers.get("content-range"), `bytes 0-15/${size}`);
      assert.equal((await range.arrayBuffer()).byteLength, 16);
      assert.equal(
        (
          await mf.dispatchFetch(`${local.origin}/media/${id}`, {
            method: "HEAD",
          })
        ).headers.get("content-length"),
        String(size),
      );
      assert.equal(
        (
          await mf.dispatchFetch(`${local.origin}/media/${id}`, {
            headers: { Range: `bytes=${size}-` },
          })
        ).status,
        416,
      );
      await call(`/api/admin/projects/${created.id}`, "DELETE", {
        revision: 1,
      });
      assert.equal((await call(`/media/${id}`)).status, 404);
      assert.equal((await call(`/api/admin/media/${id}`, "HEAD")).status, 200);
      const cancelled = await (
        await call("/api/admin/uploads", "POST", {
          filename: "cancel.png",
          content_type: "image/png",
          size: 20,
          fingerprint: "b".repeat(64),
        })
      ).json();
      assert.equal(
        (await call(`/api/admin/uploads/${cancelled.id}`, "DELETE", {})).status,
        200,
      );
      assert.equal(
        (await call(`/api/admin/uploads/${cancelled.id}/complete`, "POST", {}))
          .status,
        410,
      );
      assert.equal(
        (
          await call("/api/admin/uploads", "POST", {
            filename: "bad.svg",
            content_type: "image/svg+xml",
            size: 20,
            fingerprint: "c".repeat(64),
          })
        ).status,
        400,
      );
    },
  );
  await t.test(
    "empty groups and outages never restore hardcoded public content",
    async () => {
      await db.prepare("DELETE FROM featured_slots").run();
      await db.prepare("UPDATE projects SET published=0").run();
      // Brands from the brand list keep their cards, without any films.
      const brandsOnly = await (await call("/portfolio")).text();
      assert.equal(
        (brandsOnly.match(/class="brand-card is-empty"/g) || []).length,
        5,
      );
      assert.equal((brandsOnly.match(/class="project-card /g) || []).length, 0);
      await db.prepare("DELETE FROM brands").run();
      const html = await (await call("/portfolio")).text();
      assert.ok(html.includes("No projects are currently published."));
      assert.equal((html.match(/class="project-card /g) || []).length, 0);
      await db.prepare("DROP TABLE projects").run();
      const response = await call("/portfolio");
      assert.equal(response.status, 503);
      assert.ok(!(await response.text()).includes('class="project-card '));
    },
  );
});
test("missing authentication configuration fails closed", async (t) => {
  const local = await createLocal({ bindingOverrides: { ADMIN_EMAILS: "" } });
  t.after(() => local.close());
  for (const path of ["/admin", "/admin/admin.js", "/api/admin/projects"]) {
    const response = await local.mf.dispatchFetch(`${local.origin}${path}`, {
      headers: { "Cf-Access-Jwt-Assertion": await local.sign() },
    });
    assert.equal(response.status, 503);
    assert.equal((await response.json()).error, "auth_configuration");
  }
  assert.equal(
    (await local.mf.dispatchFetch(`${local.origin}/api/portfolio`)).status,
    200,
  );
});
test("expired-upload cleanup and pagination", async (t) => {
  const local = await createLocal();
  t.after(() => local.close());
  const { db, mf } = local;
  const token = await local.sign();
  const request = (path: string, method = "GET", data?: unknown) =>
    mf.dispatchFetch(`${local.origin}${path}`, {
      method,
      headers: {
        "Cf-Access-Jwt-Assertion": token,
        Origin: local.origin,
        "X-CMS-Request": "1",
        "Content-Type": "application/json",
      },
      body: data === undefined ? undefined : JSON.stringify(data),
    });
  const init = await (
    await request("/api/admin/uploads", "POST", {
      filename: "expired.png",
      size: 20,
      content_type: "image/png",
      fingerprint: "d".repeat(64),
    })
  ).json();
  await db
    .prepare("UPDATE uploads SET expires_at=0 WHERE id=?")
    .bind(init.id)
    .run();
  await cleanup({ DB: db, MEDIA: await mf.getR2Bucket("MEDIA") } as any);
  assert.equal(
    (await (await request(`/api/admin/uploads/${init.id}`)).json()).status,
    "aborted",
  );
  const p = await (await request("/api/admin/projects/baby")).json();
  for (let i = 0; i < 25; i++)
    assert.equal(
      (
        await request("/api/admin/projects", "POST", {
          ...p,
          title: `Pagination ${i}`,
          published: false,
        })
      ).status,
      201,
    );
  const first = await (await request("/api/admin/projects?page=1")).json(),
    last = await (await request("/api/admin/projects?page=999")).json();
  assert.equal(first.projects.length, 24);
  assert.equal(first.total, 37);
  assert.equal(last.page, 2);
  assert.equal(last.projects.length, 13);
  const noOrigin = await mf.dispatchFetch(
    `${local.origin}/api/admin/projects`,
    {
      method: "POST",
      headers: {
        "Cf-Access-Jwt-Assertion": token,
        "Content-Type": "application/json",
      },
      body: "{}",
    },
  );
  assert.equal(noOrigin.status, 403);
});

test("D1 edits, deletions and R2 data survive local development restart", async (t) => {
  const root = resolve(".local-state");
  await mkdir(root, { recursive: true });
  const persistencePath = await mkdtemp(resolve(root, "verification-"));
  assert.ok(persistencePath.startsWith(root + sep));
  t.after(() => rm(persistencePath, { recursive: true, force: true }));
  let local = await createLocal({ persist: true, persistencePath });
  try {
    await local.db
      .prepare("UPDATE projects SET title='Retained edit' WHERE id='baby'")
      .run();
    await local.db.prepare("DELETE FROM projects WHERE id='yuchel'").run();
    await (
      await local.mf.getR2Bucket("MEDIA")
    ).put("cms/test-persistence", "Retained media");
  } finally {
    await local.close();
  }
  local = await createLocal({ persist: true, persistencePath });
  try {
    const rows = await local.db
      .prepare("SELECT title FROM projects WHERE id IN ('baby','yuchel')")
      .all();
    assert.deepEqual(rows.results, [{ title: "Retained edit" }]);
    const media = await (
      await local.mf.getR2Bucket("MEDIA")
    ).get("cms/test-persistence");
    assert.equal(await media?.text(), "Retained media");
  } finally {
    await local.close();
  }
});
test("contact page: booking system for small jobs and enquiries for bigger projects", async (t) => {
  const local = await createLocal();
  t.after(() => local.close());
  const { mf, db } = local;
  const publicPost = (path: string, data: unknown, origin = local.origin) =>
    mf.dispatchFetch(`${local.origin}${path}`, {
      method: "POST",
      headers: { Origin: origin, "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  const admin = async (path: string, method = "GET", data?: unknown) =>
    mf.dispatchFetch(`${local.origin}/api/admin/${path}`, {
      method,
      headers: {
        "Cf-Access-Jwt-Assertion": await local.sign(),
        Origin: local.origin,
        "X-CMS-Request": "1",
        "Content-Type": "application/json",
      },
      body: data === undefined ? undefined : JSON.stringify(data),
    });
  const slots = async () =>
    (await (
      await mf.dispatchFetch(`${local.origin}/api/booking/slots`)
    ).json()) as {
      days: { date: string; closed: boolean; slots: string[] }[];
    };
  const person = {
    name: "Test Klant",
    email: "klant@example.test",
    phone: "+597 892 0000",
    method: "whatsapp",
    notes: "",
    language: "nl",
    website: "",
  };

  await t.test("contact routes serve the static page", async () => {
    for (const path of ["/contact", "/contact.html"]) {
      const response = await mf.dispatchFetch(`${local.origin}${path}`);
      assert.equal(response.status, 200, path);
      const html = await response.text();
      assert.ok(html.includes('data-site-page="contact"'));
      assert.ok(html.includes('id="booking"') && html.includes('id="enquiry"'));
    }
    const redirect = await mf.dispatchFetch(`${local.origin}/contact/`, {
      redirect: "manual",
    });
    assert.equal(redirect.status, 301);
    assert.equal(redirect.headers.get("Location"), "/contact.html");
    const home = await (await mf.dispatchFetch(`${local.origin}/`)).text();
    assert.ok(home.includes('href="contact.html#booking"'));
    assert.ok(!home.includes('id="contactForm"'));
  });

  await t.test(
    "slots are weekdays 09:00-17:30 in 30 minute steps",
    async () => {
      const data = await slots();
      assert.ok(data.days.length >= 19 && data.days.length <= 20);
      for (const day of data.days) {
        const weekday = new Date(`${day.date}T12:00:00Z`).getUTCDay();
        assert.ok(weekday >= 1 && weekday <= 5, day.date);
        for (const time of day.slots)
          assert.match(time, /^(0[9]|1[0-7]):(00|30)$/);
      }
      const later = data.days.slice(2);
      assert.ok(later.every((d) => d.slots.length === 18));
    },
  );

  const open = (await slots()).days.find((d) => d.slots.length >= 3)!;
  const [first, second, third] = open.slots;

  await t.test("a slot can be booked once and disappears", async () => {
    const response = await publicPost("/api/booking", {
      ...person,
      service: "logo",
      date: open.date,
      time: first,
    });
    assert.equal(response.status, 201, await response.clone().text());
    const booked = await response.json();
    assert.equal(booked.service, "logo");
    assert.equal(booked.minutes, 30);
    assert.equal(
      new Date(booked.start).getTime(),
      Date.parse(`${open.date}T${first}:00Z`) + 3 * 3600 * 1000,
    );
    const again = await publicPost("/api/booking", {
      ...person,
      email: "ander@example.test",
      service: "poster",
      date: open.date,
      time: first,
    });
    assert.equal(again.status, 409);
    assert.equal((await again.json()).error, "slot_unavailable");
    const after = (await slots()).days.find((d) => d.date === open.date)!;
    assert.ok(!after.slots.includes(first));
  });

  await t.test(
    "the database rejects a double booking even without the check",
    async () => {
      await assert.rejects(
        db
          .prepare(
            "INSERT INTO appointments (id,service,slot_date,slot_time,name,email,phone,contact_method,notes,language,status,created_at,updated_at) VALUES ('x','logo',?,?,'a','b@c.de','123456','phone','','nl','booked',0,0)",
          )
          .bind(open.date, first)
          .run(),
      );
    },
  );

  await t.test("booking input is validated", async () => {
    const bad = [
      { service: "promo", date: open.date, time: second },
      { service: "logo", date: open.date, time: "08:30" },
      { service: "logo", date: open.date, time: "18:00" },
      { service: "logo", date: "2020-01-06", time: "10:00" },
      { service: "logo", date: open.date, time: second, email: "geen-email" },
      { service: "logo", date: open.date, time: second, phone: "" },
      { service: "logo", date: open.date, time: second, method: "fax" },
      { service: "logo", date: open.date, time: second, website: "spam" },
    ];
    for (const extra of bad) {
      const response = await publicPost("/api/booking", {
        ...person,
        ...extra,
      });
      assert.ok([400, 409].includes(response.status), JSON.stringify(extra));
    }
    const weekend = new Date(`${open.date}T12:00:00Z`);
    while (![0, 6].includes(weekend.getUTCDay()))
      weekend.setUTCDate(weekend.getUTCDate() + 1);
    const saturday = await publicPost("/api/booking", {
      ...person,
      service: "logo",
      date: weekend.toISOString().slice(0, 10),
      time: "10:00",
    });
    assert.equal(saturday.status, 409);
    const foreign = await publicPost(
      "/api/booking",
      { ...person, service: "logo", date: open.date, time: second },
      "https://evil.example",
    );
    assert.equal(foreign.status, 403);
    const get = await mf.dispatchFetch(`${local.origin}/api/booking`);
    assert.equal(get.status, 405);
  });

  await t.test(
    "one email can hold at most two upcoming appointments",
    async () => {
      const two = await publicPost("/api/booking", {
        ...person,
        service: "business-card",
        date: open.date,
        time: second,
      });
      assert.equal(two.status, 201);
      const three = await publicPost("/api/booking", {
        ...person,
        service: "poster",
        date: open.date,
        time: third,
      });
      assert.equal(three.status, 429);
    },
  );

  await t.test("enquiries are validated, stored and limited", async () => {
    const enquiry = {
      services: ["promo", "social"],
      name: "Groot Bedrijf",
      email: "groot@example.test",
      phone: "",
      company: "Groot NV",
      message: "We willen een reclame en maandelijks social media beheer.",
      language: "nl",
      website: "",
    };
    for (const extra of [
      { services: [] },
      { services: ["logo"] },
      { message: "" },
      { email: "x" },
      { phone: "abc" },
      { website: "bot" },
    ]) {
      const response = await publicPost("/api/inquiry", {
        ...enquiry,
        ...extra,
      });
      assert.equal(response.status, 400, JSON.stringify(extra));
    }
    for (let i = 0; i < 3; i++)
      assert.equal((await publicPost("/api/inquiry", enquiry)).status, 201);
    assert.equal((await publicPost("/api/inquiry", enquiry)).status, 429);
  });

  await t.test(
    "admin inbox lists, cancels and closes days; public cannot",
    async () => {
      const anonymous = await mf.dispatchFetch(
        `${local.origin}/api/admin/bookings`,
      );
      assert.equal(anonymous.status, 401);
      const page = await mf.dispatchFetch(`${local.origin}/admin/bookings`);
      assert.equal(page.status, 401);
      const inbox = await (await admin("bookings")).json();
      assert.equal(
        inbox.upcoming.filter((a: any) => a.status === "booked").length,
        2,
      );
      assert.equal(inbox.inquiries.length, 3);
      assert.deepEqual(inbox.inquiries[0].services, ["promo", "social"]);
      const appointment = inbox.upcoming[0];
      assert.equal(
        (await admin(`appointments/${appointment.id}/cancel`, "POST")).status,
        200,
      );
      assert.equal(
        (await admin(`appointments/${appointment.id}/cancel`, "POST")).status,
        404,
      );
      const reopened = (await slots()).days.find((d) => d.date === open.date)!;
      assert.ok(reopened.slots.includes(appointment.slot_time));
      const enquiry = inbox.inquiries[0];
      assert.equal(
        (
          await admin(`inquiries/${enquiry.id}/status`, "POST", {
            status: "handled",
          })
        ).status,
        200,
      );
      const closed = await (
        await admin("closed-days", "POST", { day: open.date })
      ).json();
      assert.equal(closed.existingAppointments, 1);
      const closedDay = (await slots()).days.find((d) => d.date === open.date)!;
      assert.equal(closedDay.closed, true);
      assert.equal(closedDay.slots.length, 0);
      const blocked = await publicPost("/api/booking", {
        ...person,
        email: "nieuw@example.test",
        service: "logo",
        date: open.date,
        time: third,
      });
      assert.equal(blocked.status, 409);
      assert.equal(
        (await admin(`closed-days/${open.date}`, "DELETE")).status,
        200,
      );
      assert.ok(
        (await slots()).days.find((d) => d.date === open.date)!.slots.length >
          0,
      );
      assert.equal(
        (await admin("closed-days", "POST", { day: "2020-01-01" })).status,
        400,
      );
      const noHeader = await mf.dispatchFetch(
        `${local.origin}/api/admin/appointments/${appointment.id}/cancel`,
        {
          method: "POST",
          headers: {
            "Cf-Access-Jwt-Assertion": await local.sign(),
            Origin: local.origin,
          },
        },
      );
      assert.equal(noHeader.status, 403);
    },
  );
});
