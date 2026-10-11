import { test, expect } from "@playwright/test";

test("services design stays readable in both languages at desktop, tablet and phone widths", async ({
  page,
}) => {
  test.setTimeout(120000);
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/services");
  await expect(page.locator("html")).toHaveAttribute("lang", "nl");
  for (const language of ["nl", "en"]) {
    if (language === "en")
      await page.locator(".site-header [data-language-toggle]").press("Enter");
    await expect(page.locator("html")).toHaveAttribute("lang", language);
    await expect(page.locator("h1")).toContainText(
      language === "nl" ? "Maak je merk" : "Make your brand",
    );
    await expect(
      page.locator(".site-primary-nav [data-nav-page=services]"),
    ).toHaveAttribute("aria-current", "page");
    for (const width of [1440, 900, 390, 320]) {
      await page.setViewportSize({ width, height: 900 });
      await page.evaluate(() => document.fonts.ready);
      const metrics = await page
        .locator(".services-page-grid")
        .evaluate((grid) => {
          const cards = [...grid.children].map((card) => {
            const r = card.getBoundingClientRect();
            return { left: r.left, right: r.right, width: r.width, top: r.top };
          });
          return {
            bodyWidth: document.body.getBoundingClientRect().width,
            bands: [...document.querySelectorAll(".services-page-band")].map(
              (band) => ({
                left: band.getBoundingClientRect().left,
                width: band.getBoundingClientRect().width,
                background: getComputedStyle(band).backgroundColor,
                opacity: getComputedStyle(band).opacity,
                animations: band.getAnimations().length,
              }),
            ),
            introLeft: document
              .querySelector(".services-page-intro")
              .getBoundingClientRect().left,
            contactLeft: document
              .querySelector(".services-page-contact")
              .getBoundingClientRect().left,
            columns:
              getComputedStyle(grid).gridTemplateColumns.split(" ").length,
            overflow: document.documentElement.scrollWidth > window.innerWidth,
            cards,
            imageLoaded: grid.querySelector("img").naturalWidth > 0,
            transition: getComputedStyle(grid.firstElementChild)
              .transitionDuration,
          };
        });
      expect(metrics.columns).toBe(width >= 1024 ? 3 : width >= 768 ? 2 : 1);
      expect(metrics.overflow, `${language} at ${width}`).toBe(false);
      expect(metrics.cards).toHaveLength(5);
      expect(metrics.imageLoaded).toBe(true);
      expect(metrics.transition).toBe("0s");
      expect(metrics.bands.map((band) => band.background)).toEqual([
        "rgb(0, 5, 13)",
        "rgb(230, 239, 247)",
        "rgb(0, 5, 13)",
      ]);
      for (const band of metrics.bands) {
        expect(Math.abs(band.width - metrics.bodyWidth)).toBeLessThan(1);
        expect(band.left).toBe(0);
        expect(band.opacity).toBe("1");
        expect(band.animations).toBe(0);
      }
      expect(Math.abs(metrics.introLeft - metrics.cards[0].left)).toBeLessThan(
        1,
      );
      expect(
        Math.abs(metrics.contactLeft - metrics.cards[0].left),
      ).toBeLessThan(1);
      for (const card of metrics.cards) {
        expect(card.left).toBeGreaterThanOrEqual(0);
        expect(card.right).toBeLessThanOrEqual(width);
      }
      if (width >= 1024) {
        expect(
          Math.abs(metrics.cards[0].width - metrics.cards[1].width * 2 - 16),
        ).toBeLessThan(1);
        expect(metrics.cards[0].top).toBe(metrics.cards[1].top);
      }
      if (language === "nl" && [1440, 900, 390].includes(width))
        await page.screenshot({
          path: `test-results/services-${width}-nl.png`,
          fullPage: true,
        });
    }
  }
  expect(errors).toEqual([]);
});

test("services navigation, anchors, language persistence and mobile keyboard menu work across pages", async ({
  page,
}) => {
  await page.route("https://pub-*.r2.dev/**", (route) => route.abort());
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.locator(".site-primary-nav [data-nav-page=services]").click();
  await expect(page).toHaveURL(/\/services\.html$/);
  await expect(page.locator(".services-page-card")).toHaveCount(5);
  await expect(page.locator("h1")).toContainText("Maak je merk");
  await expect(page.locator("#nav")).toHaveClass(/chrome-ready/);
  await page.locator(".site-header [data-language-toggle]").press("Enter");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await page.locator(".site-primary-nav [data-nav-page=portfolio]").click();
  await expect(page).toHaveURL(/\/portfolio\.html$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await page.locator(".site-primary-nav [data-nav-page=services]").click();
  await page.locator(".site-footer-services a[href$='#logo-design']").click();
  await expect(page).toHaveURL(/#logo-design$/);
  expect(
    await page
      .locator("#logo-design")
      .evaluate((element) => element.getBoundingClientRect().top),
  ).toBeGreaterThanOrEqual(100);
  await page.locator(".services-page-contact-link").click();
  await expect(page).toHaveURL(/\/contact\.html#enquiry$/);
  await expect(page.locator("#tab-enquiry")).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await page.goto("/index.html#services");
  await expect(page.locator("#services .services-section-label")).toHaveText(
    "Our expertise",
  );
  await page.goto("/services.html");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator("#menuBtn").press("Enter");
  await expect(page.locator("#mobileMenu")).toBeVisible();
  await expect(page.locator("#menuClose")).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(
    page.locator("#mobileMenu [data-language-toggle]"),
  ).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(page.locator(".site-menu-email")).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(
    page.locator("#mobileMenu [data-language-toggle]"),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.locator("#mobileMenu")).not.toBeVisible();
  await expect(page.locator("#menuBtn")).toBeFocused();
  await page.locator("#menuBtn").press("Enter");
  await page.locator("#mobileMenu [data-nav-page=portfolio]").press("Enter");
  await expect(page).toHaveURL(/\/portfolio\.html$/);
});

test("services content and cross-page links are usable without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  try {
    await page.goto("http://127.0.0.1:8788/services.html");
    await expect(page.locator(".services-page-card")).toHaveCount(5);
    await expect(page.locator(".services-page-card").first()).toHaveCSS(
      "opacity",
      "1",
    );
    await expect(
      page.locator(".site-primary-nav [data-nav-page=services]"),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    await page.locator(".site-primary-nav [data-nav-page=portfolio]").click();
    await expect(page).toHaveURL(/\/portfolio\.html$/);
  } finally {
    await context.close();
  }
});

test("services reveal runs once, keeps hover independent and cancels for reduced motion", async ({
  page,
}) => {
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 700 });
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/services.html");
    const card = page.locator("#social-media-management");
    await expect(page.locator(".services-page-intro")).toHaveClass(
      /is-visible/,
    );
    expect(
      await page
        .locator(".services-page-band")
        .evaluateAll((bands) =>
          bands.every(
            (band) =>
              band.getAnimations().length === 0 &&
              getComputedStyle(band).opacity === "1",
          ),
        ),
    ).toBe(true);
    await expect(card).not.toHaveClass(/is-visible/);
    await expect(card).toHaveCSS("opacity", "1"); // Content is not pre-hidden.
    await card.evaluate((element) =>
      element.scrollIntoView({ block: "center", behavior: "instant" }),
    );
    await expect(card).toHaveClass(/is-visible/);
    const frames = await card.evaluate((element) =>
      element
        .getAnimations()
        .flatMap((animation) => animation.effect.getKeyframes()),
    );
    expect(
      frames.some(
        (frame) => Number(frame.opacity) === 0 && /24px/.test(frame.translate),
      ),
    ).toBe(true);
    expect(frames.some((frame) => "transform" in frame)).toBe(false);
    if (width === 390) await page.emulateMedia({ reducedMotion: "reduce" });
    await expect
      .poll(() => card.evaluate((element) => element.getAnimations().length))
      .toBe(0);
    await expect(card).toHaveCSS("opacity", "1");
    await expect(card).toHaveCSS("translate", "none");
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.evaluate(() => scrollTo(0, 0));
    await card.evaluate((element) =>
      element.scrollIntoView({ block: "center", behavior: "instant" }),
    );
    await expect
      .poll(() => card.evaluate((element) => element.getAnimations().length))
      .toBe(0);
    await page.goto("/services.html");
    const contact = page.locator(".services-page-contact");
    await expect(contact).not.toHaveClass(/is-visible/);
    await page.locator(".services-page-contact-link").focus();
    await expect(contact).toHaveClass(/is-visible/);
    await expect(contact).toHaveCSS("opacity", "1");
    expect(
      await contact.evaluate((element) => element.getAnimations().length),
    ).toBe(0);
  }
});

test("services stay visible with reduced motion or no reveal API", async ({
  browser,
}) => {
  for (const unsupported of [false, true]) {
    const context = await browser.newContext({
      reducedMotion: unsupported ? "no-preference" : "reduce",
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    try {
      if (unsupported)
        await page.addInitScript(() => {
          delete window.IntersectionObserver;
        });
      await page.goto("http://127.0.0.1:8788/services.html");
      const states = await page
        .locator("[data-reveal]")
        .evaluateAll((elements) =>
          elements.map((element) => ({
            opacity: getComputedStyle(element).opacity,
            animations: element.getAnimations().length,
          })),
        );
      expect(states).toHaveLength(7);
      expect(
        states.every(
          (state) => state.opacity === "1" && state.animations === 0,
        ),
      ).toBe(true);
      expect(errors).toEqual([]);
    } finally {
      await context.close();
    }
  }
});
