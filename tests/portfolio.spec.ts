import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
});

test("renders without browser errors or horizontal overflow", async ({ page }) => {
  const browserErrors: string[] = [];
  page.on("pageerror", (error) => browserErrors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") browserErrors.push(message.text());
  });
  await page.reload();
  await page.waitForLoadState("networkidle");

  for (const id of ["top", "about", "work", "skills", "contact"]) {
    const section = page.locator(`#${id}`);
    await expect(section).toBeAttached();
    await section.scrollIntoViewIfNeeded();
  }

  const overflow = await page.evaluate(() => {
    const currentY = window.scrollY;
    window.scrollTo({ left: document.documentElement.scrollWidth, top: currentY });
    const result = {
      document: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      reachable: window.scrollX,
    };
    window.scrollTo({ left: 0, top: currentY });
    return result;
  });

  expect(overflow.document).toBeLessThanOrEqual(1);
  expect(overflow.reachable).toBe(0);
  expect(browserErrors).toEqual([]);

  const headerWidth = await page.locator(".site-header").evaluate((header) => header.getBoundingClientRect().width);
  const viewportWidth = page.viewportSize()?.width ?? 0;
  if (viewportWidth > 768) expect(headerWidth).toBeLessThanOrEqual(viewportWidth * .7);
  else expect(headerWidth).toBeGreaterThanOrEqual(viewportWidth * .9);
});

test("meets automated WCAG A and AA checks", async ({ page }) => {
  const scan = () => new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();

  expect((await scan()).violations).toEqual([]);
  await page.locator("[data-theme-toggle]").click();
  await page.waitForTimeout(700);
  expect((await scan()).violations).toEqual([]);
});

test("runs continuous scroll motion on CSS timelines", async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 0) <= 672, "Compact layouts intentionally disable orbit motion");
  expect(await page.evaluate(() => CSS.supports("animation-timeline: scroll()"))).toBe(true);

  const heroWord = page.locator(".hero-word-one");
  const startTransform = await heroWord.evaluate((element) => getComputedStyle(element).transform);
  await page.evaluate(() => window.scrollTo({ top: window.innerHeight * .65 }));
  await page.waitForTimeout(100);
  const scrolledTransform = await heroWord.evaluate((element) => getComputedStyle(element).transform);

  expect(scrolledTransform).not.toBe(startTransform);
});

test("keeps navigation targets valid and reports the active section", async ({ page }) => {
  const hashes = await page.locator("[data-section-link]").evaluateAll((links) =>
    [...new Set(links.map((link) => (link as HTMLAnchorElement).hash))],
  );

  for (const hash of hashes) {
    expect(await page.locator(hash).count()).toBe(1);
  }

  await page.locator("#work").scrollIntoViewIfNeeded();
  await expect(page.locator(`.desktop-nav a[href="#work"]`)).toHaveAttribute("aria-current", "location");
});

test("synchronizes the selected theme with browser chrome", async ({ page }) => {
  const root = page.locator("html");
  const themeColor = page.locator('meta[name="theme-color"]');
  const initialTheme = await root.getAttribute("data-theme");

  await page.locator("[data-theme-toggle]").click();

  const expectedTheme = initialTheme === "light" ? "dark" : "light";
  const expectedColor = expectedTheme === "light" ? "#ffffff" : "#10110f";
  await expect(root).toHaveAttribute("data-theme", expectedTheme);
  await expect(themeColor).toHaveAttribute("content", expectedColor);
  await expect(page.locator("[data-theme-toggle]")).toHaveAttribute(
    "aria-label",
    `Switch to ${expectedTheme === "light" ? "dark" : "light"} theme`,
  );
});

test("mobile navigation opens, closes and preserves usable controls", async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 1024) > 768, "Mobile-only behavior");

  const menu = page.locator(".mobile-menu");
  const menuButton = menu.locator("summary");
  await menuButton.click();
  await expect(menu).toHaveAttribute("open", "");
  await expect(menuButton).toHaveAttribute("aria-expanded", "true");

  const controlSizes = await page.locator(".theme-toggle, .mobile-menu summary").evaluateAll((elements) =>
    elements.map((element) => {
      const rect = element.getBoundingClientRect();
      return { width: rect.width, height: rect.height };
    }),
  );
  for (const size of controlSizes) {
    expect(size.width).toBeGreaterThanOrEqual(40);
    expect(size.height).toBeGreaterThanOrEqual(40);
  }

  await page.keyboard.press("Escape");
  await expect(menu).not.toHaveAttribute("open", "");
  await expect(menuButton).toBeFocused();
});
