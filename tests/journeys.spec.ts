import { expect, test } from "@playwright/test";
import { navigation, profile } from "../src/data/portfolio";

test.use({ reducedMotion: "reduce" });

test("visitor explores work, reaches contact, and returns to the hero", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /Explore my work/ }).click();
  await expect(page).toHaveURL(/#work$/);
  await expect(page.locator("#work-title")).toBeInViewport();
  for (const item of navigation) {
    if ((page.viewportSize()?.width ?? 0) <= 768) {
      const menuToggle = page.locator(".mobile-menu > summary");
      await expect(menuToggle).toHaveAccessibleName("Open navigation");
      await expect(menuToggle).toHaveAttribute("aria-expanded", "false");
      await menuToggle.click();
      await expect(menuToggle).toHaveAttribute("aria-expanded", "true");
      await page.getByRole("navigation", { name: "Mobile navigation" }).getByRole("link", { name: new RegExp(item.label) }).click();
      await expect(menuToggle).toHaveAttribute("aria-expanded", "false");
      await expect(page.locator("html")).not.toHaveClass(/menu-open/);
    } else {
      await page.getByRole("navigation", { name: "Primary navigation" }).getByRole("link", { name: item.label }).click();
    }
    await expect(page).toHaveURL(new RegExp(`${item.href}$`));
    await expect(page.locator(item.href)).toBeInViewport();
  }
  await expect(page.getByRole("link", { name: "Send an email" })).toHaveAttribute("href", `mailto:${profile.email}`);
  await page.locator("#contact").getByRole("link", { name: "Back to top" }).click();
  await expect(page).toHaveURL(/#top$/);
  await expect(page.locator("#hero-title")).toBeInViewport();
});

test("keyboard users can skip navigation and reach the main content", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#main$/);
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: /Explore my work/ })).toBeFocused();
});

test("mobile menu releases scrolling after outside click and desktop resize", async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 0) > 768, "Mobile menu only");
  await page.goto("/");
  const open = page.locator(".mobile-menu summary");
  await open.click();
  await expect(page.locator("html")).toHaveClass(/menu-open/);
  await page.locator(".wordmark").click();
  await expect(page.locator("html")).not.toHaveClass(/menu-open/);
  await open.click();
  await expect(open).toHaveAttribute("aria-expanded", "true");
  await page.setViewportSize({ width: 1024, height: 768 });
  await expect(page.locator(".mobile-menu")).not.toHaveAttribute("open");
  await expect(page.locator("html")).not.toHaveClass(/menu-open/);
  await expect(page.getByRole("navigation", { name: "Primary navigation" })).toBeVisible();
});
