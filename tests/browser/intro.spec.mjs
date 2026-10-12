import { test, expect } from "@playwright/test";

// Automated browsers skip the intro by default; ?intro forces it for testing.
test("logo intro plays once per session, can be skipped and reveals the page", async ({
  page,
}) => {
  await page.goto("/services.html?intro");
  const intro = page.locator(".qd-intro");
  await expect(intro).toBeVisible();
  await expect(intro.locator(".qd-intro-ring").first()).toBeAttached();
  await expect(page.locator("html")).toHaveClass(/qd-intro-active/);
  // The counter runs from 0% up to 100% before the curtain lifts.
  const count = intro.locator(".qd-intro-count");
  await expect(count).toHaveText(/^\d{1,3}%$/);
  await expect(count).toHaveText("100%", { timeout: 6000 });
  await expect(intro).toHaveCount(0, { timeout: 8000 });
  await expect(page.locator("html")).not.toHaveClass(/qd-intro/);
  expect(
    await page.evaluate(() => sessionStorage.getItem("qd-intro-seen")),
  ).toBe("1");

  // A click skips it straight away.
  await page.evaluate(() => sessionStorage.removeItem("qd-intro-seen"));
  await page.goto("/contact.html?intro");
  await expect(intro).toBeVisible();
  await intro.click();
  await expect(intro).toHaveCount(0, { timeout: 2000 });
});

test("reduced motion never shows the intro", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".qd-intro")).toHaveCount(0);
  await expect(page.locator("html")).not.toHaveClass(/qd-intro-pending/);
});

test("the homepage hero starts only after loading reaches 100%", async ({
  page,
}) => {
  await page.goto("/?intro");
  const intro = page.locator(".qd-intro");
  await expect(intro).toBeVisible();
  // While the intro is loading, the moving background has not started yet.
  await expect(page.locator("[data-hero-band] canvas")).toHaveCount(0);
  await expect(page.locator("[data-hero-dots] canvas")).toHaveCount(0);
  await expect(intro.locator(".qd-intro-count")).toHaveText("100%", {
    timeout: 6000,
  });
  await expect(page.locator("[data-hero-band] canvas")).toHaveCount(1);
  await expect(page.locator("[data-hero-dots] canvas")).toHaveCount(1);
  await expect(intro).toHaveCount(0, { timeout: 8000 });
});
