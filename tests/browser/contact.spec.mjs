import { test, expect } from "@playwright/test";

test("small jobs book a free slot; a taken slot is refused and times reload", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.addInitScript(() => localStorage.setItem("quille-language", "en"));
  await page.goto("/contact");
  await expect(
    page.locator(".site-primary-nav [data-nav-page=contact]"),
  ).toHaveAttribute("aria-current", "page");
  await expect(page.locator("#booking")).toBeVisible();
  await expect(page.locator("#enquiry")).toBeHidden();
  await expect(page.locator(".date-chip").first()).toBeVisible();

  // Submitting empty shows inline errors.
  await page.locator("#bookingSubmit").click();
  await expect(page.locator('#bookingForm [data-error="service"]')).toHaveText(
    "Choose what you need.",
  );
  await expect(page.locator("#bookingStatus")).toHaveText(
    "Check the highlighted fields.",
  );

  await page.locator(".service-option").nth(1).click();
  const day = await page
    .locator(".date-chip input:not(:disabled)")
    .first()
    .inputValue();
  const time = page.locator(".time-chip").first();
  const slot = await time.locator("input").inputValue();
  await time.click();
  await expect(page.locator("#summaryService")).toHaveText("Poster design");
  await expect(page.locator("#summaryTime")).toContainText(slot);

  // Someone else takes the same slot first.
  const taken = await page.request.post("/api/booking", {
    headers: { Origin: "http://127.0.0.1:8788" },
    data: {
      service: "logo",
      date: day,
      time: slot,
      name: "Other",
      email: "other@example.test",
      phone: "+597 800 0000",
      method: "phone",
      notes: "",
      language: "en",
      website: "",
    },
  });
  expect(taken.status()).toBe(201);

  await page.fill("#bookingForm [name=name]", "Test Customer");
  await page.fill("#bookingForm [name=email]", "customer@example.test");
  await page.fill("#bookingForm [name=phone]", "+597 892 0000");
  await page.locator("#bookingSubmit").click();
  await expect(page.locator("#bookingStatus")).toHaveText(
    "Someone just booked this time. Choose another time.",
  );
  await expect(page.locator(`.time-chip input[value="${slot}"]`)).toHaveCount(
    0,
  );

  await page.locator(".time-chip").first().click();
  await page.locator("#bookingSubmit").click();
  await expect(page.locator("#bookingSuccess")).toBeVisible();
  await expect(page.locator("#bookingSuccess")).toBeFocused();
  await expect(page.locator("#bookingSuccessTitle")).toHaveText(
    "Your appointment is booked",
  );
  await expect(page.locator("#calendarLink")).toHaveAttribute("href", /^blob:/);

  // Switching language re-renders the confirmation.
  await page.evaluate(() => window.quilleLanguage.set("nl"));
  await expect(page.locator("#bookingSuccessTitle")).toHaveText(
    "Je afspraak staat vast",
  );
  expect(errors).toEqual([]);
});

test("bigger projects send an enquiry that appears in the admin inbox", async ({
  page,
}) => {
  await page.addInitScript(() => localStorage.setItem("quille-language", "nl"));
  await page.goto("/");
  await page.locator('#contact a[href="contact.html#enquiry"]').click();
  await expect(page).toHaveURL(/\/contact\.html#enquiry$/);
  await expect(page.locator("#tab-enquiry")).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await page.locator("#enquirySubmit").click();
  await expect(page.locator('#enquiryForm [data-error="services"]')).toHaveText(
    "Kies minstens één optie.",
  );
  await page
    .locator("#enquiryForm .pill-option", { hasText: "Socialmediabeheer" })
    .click();
  await page.fill(
    "#enquiryForm [name=message]",
    "Wij zoeken maandelijks beheer van Instagram en TikTok.",
  );
  await page.fill("#enquiryForm [name=name]", "Groot Bedrijf");
  await page.fill("#enquiryForm [name=email]", "groot@example.test");
  await page.locator("#enquirySubmit").click();
  await expect(page.locator("#enquirySuccessTitle")).toHaveText(
    "Bedankt, we hebben je aanvraag ontvangen",
  );

  await page.goto("/admin/bookings");
  const row = page.locator(".inbox-row--enquiry", { hasText: "Groot Bedrijf" });
  await expect(row).toBeVisible();
  await row.getByRole("button", { name: "Markeren als afgehandeld" }).click();
  await expect(row).toHaveCount(0);
  await page.locator('[data-filter="handled"]').click();
  await expect(
    page.locator(".inbox-row--enquiry", { hasText: "Groot Bedrijf" }),
  ).toBeVisible();
});

test("contact page works at phone width and without JavaScript", async ({
  page,
  browser,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/contact.html#booking");
  await expect(page.locator(".date-chip").first()).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  const context = await browser.newContext({ javaScriptEnabled: false });
  const noScript = await context.newPage();
  await noScript.goto("http://127.0.0.1:8788/contact.html");
  await expect(noScript.locator("#booking")).toBeVisible();
  await expect(noScript.locator("#enquiry")).toBeVisible();
  await expect(noScript.locator(".contact-notice")).toBeVisible();
  await context.close();
});
