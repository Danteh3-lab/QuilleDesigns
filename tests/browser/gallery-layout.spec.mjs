import { test, expect } from "@playwright/test";

test("CMS additions keep full rows aligned and incomplete rows centred at every breakpoint", async ({
  page,
}) => {
  test.setTimeout(120000);
  await page.route("https://pub-*.r2.dev/**", (route) => route.abort());
  await page.emulateMedia({ reducedMotion: "reduce" });
  const baseline = await (await page.request.get("/api/portfolio")).json();
  const sources = await (await page.request.get("/api/admin/projects")).json();
  const created = [];
  const headers = { Origin: "http://127.0.0.1:8788", "X-CMS-Request": "1" };
  const kinds = ["landscape", "portrait", "logo"];

  async function checkRows(viewportWidth) {
    const groups = await page.locator(".project-grid").evaluateAll((grids) =>
      grids.map((grid) => {
        const bounds = grid.getBoundingClientRect();
        return {
          kind: grid.classList.contains("project-grid-landscape")
            ? "landscape"
            : grid.classList.contains("project-grid-portrait")
              ? "portrait"
              : "logo",
          left: bounds.left,
          right: bounds.right,
          width: bounds.width,
          cards: Array.from(grid.children).map((card) => {
            const rect = card.getBoundingClientRect();
            return {
              id: card.id,
              left: rect.left,
              right: rect.right,
              top: rect.top,
              bottom: rect.bottom,
              width: rect.width,
            };
          }),
        };
      }),
    );
    for (const group of groups) {
      if (!group.width) continue; // Category filters remove whole groups from layout.
      const columns =
        group.kind === "landscape"
          ? viewportWidth <= 760
            ? 1
            : 2
          : group.kind === "portrait"
            ? viewportWidth <= 520
              ? 1
              : viewportWidth <= 1023
                ? 2
                : 3
            : viewportWidth <= 760
              ? 2
              : 3;
      const rows = [];
      for (const card of group.cards) {
        const row = rows.at(-1);
        if (!row || Math.abs(row[0].top - card.top) > 1) rows.push([card]);
        else row.push(card);
        expect(
          Math.abs(card.width - (group.width - 16 * (columns - 1)) / columns),
          `${group.kind} card width at ${viewportWidth}`,
        ).toBeLessThan(1);
      }
      for (const [index, row] of rows.entries()) {
        expect(row.length).toBe(
          index === rows.length - 1
            ? ((group.cards.length - 1) % columns) + 1
            : columns,
        );
        expect(
          Math.abs(
            (row[0].left + row.at(-1).right) / 2 -
              (group.left + group.right) / 2,
          ),
          `${group.kind} row centred at ${viewportWidth}`,
        ).toBeLessThan(1);
        for (let i = 1; i < row.length; i++)
          expect(Math.abs(row[i].left - row[i - 1].right - 16)).toBeLessThan(1);
        if (index)
          expect(row[0].top).toBeGreaterThanOrEqual(
            Math.max(...rows[index - 1].map((card) => card.bottom)) + 15,
          );
      }
      const expected = baseline.projects
        .filter(
          (project) =>
            (project.category === "logo" ? "logo" : project.orientation) ===
            group.kind,
        )
        .map((project) => `project-${project.id}`);
      expect(
        group.cards.slice(0, expected.length).map((card) => card.id),
      ).toEqual(expected);
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }

  try {
    for (let addition = 0; addition <= 3; addition++) {
      if (addition)
        for (const kind of kinds) {
          const source = sources.projects.find((project) =>
            kind === "logo"
              ? project.category === "logo"
              : project.category === "video" && project.orientation === kind,
          );
          const response = await page.request.post("/api/admin/projects", {
            headers,
            data: {
              ...source,
              title: `Layout ${kind} ${addition}`,
              display_order: 10000 + addition,
              published: true,
            },
          });
          expect(response.status(), await response.text()).toBe(201);
          created.push(await response.json());
        }
      for (const width of [1440, 900, 650, 390]) {
        await page.setViewportSize({ width, height: 900 });
        await page.goto("/portfolio.html");
        await expect(page.locator(".project-card")).toHaveCount(
          baseline.projects.length + addition * 3,
        );
        await checkRows(width);
        if (addition === 1 && width === 1440) {
          await page.setViewportSize({ width, height: 1200 });
          for (const artwork of await page
            .locator(".project-grid-landscape .project-image")
            .all()) {
            await artwork.scrollIntoViewIfNeeded();
            await expect
              .poll(() => artwork.evaluate((image) => image.naturalWidth))
              .toBeGreaterThan(0);
          }
          await page
            .locator(".project-grid-landscape")
            .screenshot({ path: "test-results/gallery-centred-desktop.png" });
          await page.locator("[data-filter=logo]").click();
          await checkRows(width);
          await page.locator("[data-filter=all]").click();
          const orphan = page
            .locator(".project-grid-landscape .project-link")
            .last();
          await orphan.focus();
          await page.keyboard.press("Enter");
          await expect(page.locator("#mediaViewer")).toBeVisible();
          await page.keyboard.press("Escape");
          await expect(orphan).toBeFocused();
        }
        if (addition === 1 && width === 390)
          await page
            .locator(".project-grid-identities")
            .screenshot({ path: "test-results/gallery-centred-mobile.png" });
      }
    }
  } finally {
    for (const project of created) {
      const response = await page.request.delete(
        `/api/admin/projects/${project.id}`,
        { headers, data: { revision: project.revision } },
      );
      expect(response.status(), await response.text()).toBe(200);
    }
  }
});
