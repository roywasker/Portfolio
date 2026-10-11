import { expect, test } from "@playwright/test";

for (const theme of ["dark", "light"] as const) {
  test(`responsive layout and visual captures — ${theme}`, async ({ page }, testInfo) => {
    test.setTimeout(60_000);
    await page.emulateMedia({ colorScheme: theme, reducedMotion: "reduce" });
    await page.goto(`/?theme=${theme}`);
    await page.waitForLoadState("networkidle");
    await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all([...document.images].map(async (image) => {
        image.loading = "eager";
        await image.decode();
      }));
    });

    // Capture before assertions so failed layouts still have reviewable evidence.
    for (const id of ["top", "about", "work", "skills", "contact"]) {
      const section = page.locator(`#${id}`);
      await section.scrollIntoViewIfNeeded();
      const path = testInfo.outputPath(`${theme}-${id}.png`);
      await section.screenshot({ path, animations: "disabled" });
      await testInfo.attach(`${theme}-${id}`, { path, contentType: "image/png" });
    }

    const shells = await page.locator(".section-shell").evaluateAll((elements) =>
      elements.map((element) => {
        const rect = element.getBoundingClientRect();
        return { left: rect.left, right: rect.right };
      }),
    );
    expect(shells.length).toBeGreaterThanOrEqual(5);
    for (const shell of shells) {
      expect(Math.abs(shell.left - shells[0].left)).toBeLessThanOrEqual(1);
      expect(Math.abs(shell.right - shells[0].right)).toBeLessThanOrEqual(1);
    }

    // Overflow-x: clip can conceal layout failures, so inspect content itself.
    const clipped = await page.locator([
      "#hero-title", ".hero-description", ".hero-actions", ".hero-stack",
      ".about-intro", ".about-copy", ".about-experience",
      ".section-heading h2", ".project-main", ".project-footer",
      ".skills-heading", ".skills-core", ".skill-group",
      ".contact-email", ".linkedin-contact", ".email-link", ".footer-meta",
    ].join(", ")).evaluateAll((elements) => elements.flatMap((element) => {
      const rect = element.getBoundingClientRect();
      if (rect.width === 0) return [];
      return rect.left < -1 || rect.right > innerWidth + 1 || element.scrollWidth > element.clientWidth + 1
        ? [`${element.className || element.id}: ${Math.round(rect.width)}px, content ${element.scrollWidth}px`]
        : [];
    }));
    expect(clipped, "Visible content must fit without clipping").toEqual([]);

    const header = await page.locator(".site-header").evaluate((element) => {
      const bounds = element.getBoundingClientRect();
      const controls = [...element.querySelectorAll<HTMLElement>(".wordmark, .desktop-nav, .header-actions")]
        .map((control) => control.getBoundingClientRect()).filter((rect) => rect.width > 0);
      return {
        contained: controls.every((rect) => rect.left >= bounds.left && rect.right <= bounds.right),
        separated: controls.every((rect, index) => index === 0 || rect.left >= controls[index - 1].right),
      };
    });
    expect(header, "Header controls must fit and must not overlap").toEqual({ contained: true, separated: true });

    if ((page.viewportSize()?.width ?? 0) <= 768) {
      const stageHeight = await page.locator(".hero-stage").evaluate((element) => element.getBoundingClientRect().height);
      expect(stageHeight).toBeLessThanOrEqual(420);
      const deviceBounds = await page.locator(".demo-phone").evaluate((element) => {
        const bounds = element.getBoundingClientRect();
        return { left: bounds.left, right: bounds.right, viewportWidth: innerWidth };
      });
      expect(deviceBounds.left, "The phone must remain fully inside the mobile viewport").toBeGreaterThanOrEqual(0);
      expect(deviceBounds.right).toBeLessThanOrEqual(deviceBounds.viewportWidth);
    }
    expect(await page.locator("#skills").evaluate((element) => getComputedStyle(element).position)).not.toBe("sticky");
    await expect(page.locator(".app-project")).toHaveCount(2);
    for (const link of await page.locator(".app-project").all()) {
      await expect(link).toHaveAttribute("href", /^https:\/\/github\.com\//);
    }
    await expect(page.getByRole("button", { name: "Copy email", exact: true })).toBeVisible();
    await expect(page.getByRole("link", { name: /Connect on LinkedIn/ })).toHaveAttribute("href", /^https:\/\/www\.linkedin\.com\//);
  });
}
