import { test, expect } from "@playwright/test";
import { resolve } from "node:path";
test.beforeEach(async ({ page }) => {
  await page.route("https://pub-*.r2.dev/**", (route) => route.abort());
});
test("admin CRUD, featured guard, localization, upload error and mobile layout", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/admin");
  await expect(page.locator(".project-row")).toHaveCount(12);
  await expect(page.locator(".project-row img").first()).toHaveJSProperty(
    "naturalWidth",
    2560,
  );
  await page.locator("#languageButton").click();
  await expect(
    page.getByRole("heading", { name: "Portfolio manager" }),
  ).toBeVisible();
  const smartwigi = page.locator(".project-row").filter({
    has: page.getByRole("heading", { name: "Smartwigi", exact: true }),
  });
  await smartwigi
    .getByRole("button", { name: "Unpublish", exact: true })
    .click();
  await expect(page.locator("#errorText")).toContainText(
    "Choose a replacement",
  );
  await page.locator("#newProject").click();
  await page.locator("#saveProject").click();
  await expect(page.locator("[name=title]")).toBeFocused();
  await page.locator("[name=title]").fill("Browser test identity");
  await page.locator("[name=category]").selectOption("logo");
  await page
    .locator("#posterFile")
    .setInputFiles(resolve("assets/Material/logo 1.jpeg"));
  await expect(page.locator("#uploadMessage")).toContainText(
    "Upload complete",
    { timeout: 30000 },
  );
  await page.locator("[name=alt_text]").fill("Complete identity artwork");
  await page.locator("[name=published]").check();
  await page.locator("#saveProject").click();
  await expect(
    page.locator(".project-row").filter({ hasText: "Browser test identity" }),
  ).toBeVisible();
  const identity = page
    .locator(".project-row")
    .filter({ hasText: "Browser test identity" });
  await identity.getByRole("button", { name: "Edit", exact: true }).click();
  await page.locator("[name=title]").fill("Edited identity");
  await page.locator("#saveProject").click();
  await expect(
    page.locator(".project-row").filter({ hasText: "Edited identity" }),
  ).toBeVisible();
  await page.goto("/portfolio.html");
  await expect(page.locator("#project-smartwigi")).toBeVisible();
  await expect(
    page.locator(".project-card").filter({ hasText: "Edited identity" }),
  ).toBeVisible();
  await page.goto("/admin");
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator(".project-row")).toHaveCount(13);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: "test-results/admin-mobile.png",
    fullPage: true,
  });
  await page
    .locator(".project-row")
    .filter({ hasText: "Edited identity" })
    .getByRole("button", { name: "Delete", exact: true })
    .click();
  await expect(page.locator("#confirmDialog")).toBeVisible();
  await expect(page.locator("#confirmCancel")).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.locator("#confirmDialog")).not.toBeVisible();
  await page
    .locator(".project-row")
    .filter({ hasText: "Edited identity" })
    .getByRole("button", { name: "Delete", exact: true })
    .click();
  await page.locator("#confirmAction").click();
  await expect(page.locator(".project-row")).toHaveCount(12);
  await page.locator("#newProject").click();
  await page.locator("#posterFile").setInputFiles({
    name: "broken.png",
    mimeType: "image/png",
    buffer: Buffer.from("not a png"),
  });
  await expect(page.locator("#uploadMessage")).toContainText("Upload failed");
  await page.locator("#cancelUpload").click();
  await page.locator("#discardProject").click();
  if (await page.locator("#confirmDialog").isVisible())
    await page.locator("#confirmAction").click();
  expect(errors).toEqual([]);
});
test("public portfolio and homepage retain controls and media behavior", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/portfolio.html");
  await expect(page.locator(".project-card")).toHaveCount(12);
  await expect(page.locator(".film-preview[src]")).toHaveCount(0);
  for (const artwork of await page.locator(".project-image").all()) {
    await artwork.scrollIntoViewIfNeeded();
    await expect
      .poll(() => artwork.evaluate((image) => image.naturalWidth))
      .toBeGreaterThan(0);
  }
  await page.evaluate(() => scrollTo(0, 0));
  await page.locator("[data-filter=logo]").click();
  await expect(page.locator(".project-card:visible")).toHaveCount(7);
  await page
    .locator(".project-link")
    .filter({ has: page.locator('img[alt*="Yuchel"]') })
    .click();
  await expect(page.locator("#mediaViewer")).toBeVisible();
  await expect(page.locator("#viewerMedia img")).toHaveJSProperty(
    "naturalWidth",
    1280,
  );
  await page.keyboard.press("Escape");
  await page.locator("[data-filter=video]").click();
  await expect(page.locator(".project-card:visible")).toHaveCount(5);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator("#menuBtn").click();
  await expect(page.locator("#mobileMenu")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator("#menuBtn")).toBeFocused();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: "test-results/portfolio-mobile.png",
    fullPage: true,
  });
  await page.goto("/");
  await expect(page.locator(".showcase-card")).toHaveCount(2);
  await expect(page.locator(".showcase-video")).toHaveCount(0);
  await expect(
    page.locator('#heroVideo source[src*="LandingpageQuille"]'),
  ).toHaveCount(1);
  await expect(page.locator(".process-background-still")).toHaveCount(1);
  await page.locator("[data-showcase-play]").first().click();
  await expect(page.locator(".showcase-video")).toHaveCount(1);
  await expect(page.locator(".showcase-video")).toHaveJSProperty(
    "controls",
    true,
  );
  // The homepage contact band routes to the separate contact page.
  await expect(page.locator("#contact form")).toHaveCount(0);
  await expect(
    page.locator('#contact a[href="contact.html#booking"]'),
  ).toHaveCount(1);
  await expect(
    page.locator('#contact a[href="contact.html#enquiry"]'),
  ).toHaveCount(1);
  expect(errors).toEqual([]);
});
test("large real video retries, resumes after reload, and plays in the selected homepage card", async ({
  page,
}) => {
  test.setTimeout(120000);
  await page.goto("/admin");
  await page.locator("#languageButton").click();
  await page.locator("#newProject").click();
  await page.locator("[name=title]").fill("Resumable film");
  await page
    .locator("[name=poster_url]")
    .fill("/assets/portfolio/video-fake-alexa.jpg");
  await page
    .locator("[name=alt_text]")
    .fill("Technician inspecting an indoor unit");
  await page.locator("[name=width]").fill("960");
  await page.locator("[name=height]").fill("1707");
  await page.locator("[name=orientation]").selectOption("portrait");
  await page.locator("[name=published]").check();
  let blocked = true,
    retried = false;
  await page.route("**/api/admin/uploads/*/parts/*", async (route) => {
    const part = Number(
      new URL(route.request().url()).pathname.split("/").pop(),
    );
    if (part === 2 && !retried) {
      retried = true;
      await route.fulfill({
        status: 503,
        contentType: "application/json",
        body: JSON.stringify({ error: "service_unavailable" }),
      });
    } else if (blocked && part >= 3) await route.abort();
    else await route.continue();
  });
  const video = resolve("assets/Material/fakee alexa (1).mp4");
  await page.locator("#mediaFile").setInputFiles(video);
  await expect
    .poll(
      async () => {
        const checkpoint = await page.evaluate(() =>
          JSON.parse(sessionStorage.getItem("cms-upload") || "null"),
        );
        if (!checkpoint) return 0;
        const state = await (
          await page.request.get(`/api/admin/uploads/${checkpoint.id}`)
        ).json();
        return state.parts.length;
      },
      { timeout: 30000 },
    )
    .toBe(2);
  page.on("dialog", (dialog) => dialog.accept());
  await page.reload();
  blocked = false;
  await expect(page.locator("[name=title]")).toHaveValue("Resumable film");
  await page.locator("#mediaFile").setInputFiles(video);
  await expect(page.locator("#uploadMessage")).toContainText(
    "Upload complete",
    { timeout: 60000 },
  );
  expect(retried).toBe(true);
  await page.locator("#saveProject").click();
  await expect(
    page.locator(".project-row").filter({ hasText: "Resumable film" }),
  ).toBeVisible();
  const projects = await (
    await page.request.get("/api/admin/video-options")
  ).json();
  const id = projects.find((p) => p.title === "Resumable film").id;
  await page.locator("#featuredOne").selectOption(id);
  await page.locator("#saveFeatured").click();
  await expect(page.locator("#status")).toContainText("Saved.");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(
    page.locator('[data-video-title="Resumable film"]'),
  ).toBeVisible();
  await page.locator('[data-video-title="Resumable film"]').click();
  await expect
    .poll(
      () =>
        page.locator(".showcase-video").evaluate((video) => video.currentTime),
      { timeout: 20000 },
    )
    .toBeGreaterThan(0);
});
test("video covers default automatically, retry without reuploading video, and preserve custom artwork", async ({
  page,
}) => {
  test.setTimeout(120000);
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/admin");
  await page.locator("#languageButton").click();
  await expect(page.locator("#newProject")).toBeEnabled();
  await expect(page.locator(".project-row").first()).toBeVisible();
  const initialCount = await page.locator(".project-row").count();
  await page.locator("#newProject").click();
  await expect(page.locator("#useVideoCover")).toBeDisabled();
  await page.locator("[name=title]").fill("Automatic cover film");
  await page.locator("[name=alt_text]").fill("A frame from the uploaded film");
  await page.locator("[name=published]").check();
  let videoCreates = 0,
    coverCreates = 0,
    coverID,
    failCover = true;
  await page.route("**/api/admin/uploads", async (route) => {
    const data = route.request().postDataJSON();
    if (data.content_type === "image/jpeg") coverCreates++;
    else videoCreates++;
    const response = await route.fetch();
    if (data.content_type === "image/jpeg")
      coverID = (await response.json()).id;
    await route.fulfill({ response });
  });
  await page.route("**/api/admin/uploads/*/complete", async (route) => {
    if (failCover && route.request().url().includes(coverID)) {
      failCover = false;
      await route.fulfill({
        status: 503,
        contentType: "application/json",
        body: JSON.stringify({ error: "service_unavailable" }),
      });
    } else await route.continue();
  });
  await page
    .locator("#mediaFile")
    .setInputFiles(resolve("assets/Landingpage/LandingpageQuille.mp4"));
  await expect(page.locator("#uploadMessage")).toContainText(
    "Cover upload failed",
    { timeout: 60000 },
  );
  const mediaURL = await page.locator("#mediaURL").inputValue();
  expect(mediaURL).toMatch(/^\/media\//);
  await expect(page.locator("#posterURL")).toHaveValue("");
  page.on("dialog", (dialog) => dialog.accept());
  await page.reload();
  await expect(page.locator("[name=title]")).toHaveValue(
    "Automatic cover film",
  );
  await page.locator("#retryUpload").click();
  await expect(page.locator("#posterURL")).toHaveValue(/^\/media\//, {
    timeout: 30000,
  });
  await expect(page.locator("#posterPreview")).toHaveJSProperty(
    "naturalWidth",
    1280,
  );
  await expect(page.locator("#errorBanner")).toBeHidden();
  expect(videoCreates).toBe(1);
  expect(coverCreates).toBe(1);
  await expect(page.locator("#mediaURL")).toHaveValue(mediaURL);
  const posterURL = await page.locator("#posterURL").inputValue();
  expect(posterURL).not.toBe(mediaURL);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator("#posterURL").scrollIntoViewIfNeeded();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  expect(
    await page.locator("#posterURL").evaluate((input) => {
      const rect = input.getBoundingClientRect();
      const formRect = input.closest("form").getBoundingClientRect();
      return rect.left >= formRect.left && rect.right <= formRect.right + 1;
    }),
  ).toBe(true);
  await page.screenshot({ path: "test-results/automatic-cover-mobile.png" });
  await page.locator("#saveProject").click();
  const project = (
    await (await page.request.get("/api/portfolio")).json()
  ).projects.find((p) => p.title === "Automatic cover film");
  expect(project.poster_url).toBe(posterURL);
  expect((await page.request.head(posterURL)).headers()["content-type"]).toBe(
    "image/jpeg",
  );
  const row = page.locator(".project-row").filter({
    has: page.getByRole("heading", {
      name: "Automatic cover film",
      exact: true,
    }),
  });
  await row.getByRole("button", { name: "Edit", exact: true }).click();
  const custom = "/assets/portfolio/video-fake-alexa.jpg";
  await page.locator("#posterURL").fill(custom);
  await page
    .locator("#mediaFile")
    .setInputFiles(resolve("assets/Landingpage/LandingpageQuille.mp4"));
  await expect.poll(() => videoCreates).toBe(2);
  await expect(page.locator("#uploadMessage")).toContainText(
    "Upload complete",
    { timeout: 60000 },
  );
  await expect(page.locator("#posterURL")).toHaveValue(custom);
  expect(coverCreates).toBe(1);
  await page.locator("#useVideoCover").press("Enter");
  await expect(page.locator("#posterURL")).toHaveValue(/^\/media\//, {
    timeout: 30000,
  });
  await expect(page.locator("#useVideoCover")).toBeFocused();
  expect(coverCreates).toBe(2);
  const explicitPoster = await page.locator("#posterURL").inputValue();
  await page.locator("#mediaURL").fill(custom);
  await page.locator("#useVideoCover").click();
  await expect(page.locator("#errorText")).toContainText(
    "Could not create a video cover",
  );
  await expect(page.locator("#posterURL")).toHaveValue(explicitPoster);
  await expect(page.locator("#saveProject")).toBeEnabled();
  await page.locator("#discardProject").click();
  await page.locator("#confirmAction").click();
  await row.getByRole("button", { name: "Delete", exact: true }).click();
  await page.locator("#confirmAction").click();
  await expect(page.locator(".project-row")).toHaveCount(initialCount);
  expect(errors).toEqual([]);
});

test("anonymous admin is rejected, offline edits survive, and unpublished groups stay empty", async ({
  page,
  context,
}) => {
  await context.addCookies([
    { name: "cms-dev-anonymous", value: "1", url: "http://127.0.0.1:8788" },
  ]);
  const response = await page.goto("/admin");
  expect(response.status()).toBe(401);
  await context.clearCookies();
  await page.goto("/admin");
  await page.locator("#languageButton").click();
  await page.locator("#newProject").click();
  await page.locator("[name=title]").fill("Preserved draft");
  await page.locator("[name=poster_url]").fill("https://example.com/image.png");
  await page.locator("[name=media_url]").fill("https://example.com/image.png");
  await page.locator("[name=alt_text]").fill("Alt text");
  await context.setOffline(true);
  await page.locator("#saveProject").click();
  await expect(page.locator("#errorBanner")).toBeVisible();
  await expect(page.locator("[name=title]")).toHaveValue("Preserved draft");
  await context.setOffline(false);
  await page.locator("#discardProject").click();
  await page.locator("#confirmAction").click();
  const all = await (await page.request.get("/api/admin/projects")).json();
  for (const p of all.projects.filter((p) => p.category === "logo"))
    await page.request.put(`/api/admin/projects/${p.id}`, {
      headers: { Origin: "http://127.0.0.1:8788", "X-CMS-Request": "1" },
      data: { ...p, published: false },
    });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/portfolio.html");
  await page.locator("[data-filter=logo]").click();
  await expect(page.locator(".project-card:visible")).toHaveCount(0);
  expect(errors).toEqual([]);
});

test("initial API errors recover through Reload and keyboard controls", async ({
  page,
}) => {
  let failed = false;
  await page.route("**/api/admin/session", async (route) => {
    if (!failed) {
      failed = true;
      await route.fulfill({
        status: 503,
        contentType: "application/json",
        body: JSON.stringify({ error: "service_unavailable" }),
      });
    } else await route.continue();
  });
  await page.goto("/admin");
  await expect(page.locator("#errorBanner")).toBeVisible();
  await expect(page.locator("#newProject")).toBeDisabled();
  await page.locator("#retryButton").focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#errorBanner")).toBeHidden();
  await expect(page.locator("#newProject")).toBeEnabled();
  await page.locator("#newProject").focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("[name=title]")).toBeFocused();
  await page.locator("#discardProject").click();
});

test("server-rendered portfolio and featured media links work without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    baseURL: "http://127.0.0.1:8788",
  });
  try {
    await context.route("https://pub-*.r2.dev/**", (route) => route.abort());
    const page = await context.newPage();
    const data = await (await page.request.get("/api/portfolio")).json();
    await page.goto("/portfolio.html");
    await expect(page.locator(".project-card")).toHaveCount(
      data.projects.length,
    );
    await expect(page.locator("#project-smartwigi")).toBeVisible();
    await expect(
      page.locator("#project-smartwigi .project-link"),
    ).toHaveAttribute(
      "href",
      data.projects.find((p) => p.id === "smartwigi").media_url,
    );
    await expect(page.locator(".portfolio-filters")).toBeHidden();
    await page.goto("/");
    await expect(page.locator(".showcase-card")).toHaveCount(2);
    await expect(page.locator("[data-showcase-play]").first()).toHaveAttribute(
      "href",
      data.featured[0].media_url,
    );
  } finally {
    await context.close();
  }
});

test("existing homepage hero plays and the process sequence advances on scroll", async ({
  page,
}) => {
  test.setTimeout(90000);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.route("https://pub-*.r2.dev/LandingpageQuille.mp4", (route) =>
    route.fulfill({
      contentType: "video/mp4",
      path: resolve("assets/Landingpage/LandingpageQuille.mp4"),
    }),
  );
  await page.goto("/");
  await expect
    .poll(
      () => page.locator("#heroVideo").evaluate((video) => video.currentTime),
      { timeout: 20000 },
    )
    .toBeGreaterThan(0);
  await page.evaluate(() =>
    scrollTo(
      0,
      document.querySelector("#process").getBoundingClientRect().top + scrollY,
    ),
  );
  const canvas = page.locator("[data-process-canvas]");
  await expect(canvas).toHaveClass(/is-ready/, { timeout: 20000 });
  const frameHash = (element) => {
    const data = element
      .getContext("2d")
      .getImageData(0, 0, element.width, element.height).data;
    let value = 2166136261;
    for (let i = 0; i < data.length; i += 64)
      value = Math.imul(value ^ data[i], 16777619);
    return String(value);
  };
  const first = await canvas.evaluate(frameHash);
  await page.evaluate(() => {
    const process = document.querySelector("#process");
    scrollTo(0, process.getBoundingClientRect().bottom + scrollY - innerHeight);
  });
  await expect
    .poll(() => canvas.evaluate(frameHash), {
      timeout: 15000,
    })
    .not.toBe(first);
  await expect(page.locator("#processSequenceStatus")).toBeHidden();
});
