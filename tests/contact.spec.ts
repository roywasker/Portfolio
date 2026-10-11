import { expect, test } from "@playwright/test";
import { profile } from "../src/data/portfolio";

test.use({ reducedMotion: "reduce" });

test("copies the exact email and clears the success announcement", async ({ page }) => {
  // Deterministic clipboard boundary: no OS clipboard or permission prompt.
  await page.addInitScript(() => Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText: async (text: string) => { document.documentElement.dataset.copiedEmail = text; } },
  }));
  await page.goto("/#contact");
  await page.clock.install();
  const copy = page.locator("[data-copy-email]");
  await copy.click();
  await expect(page.locator("html")).toHaveAttribute("data-copied-email", profile.email);
  await expect(copy).toHaveText("Copied ✓");
  await expect(copy).toBeEnabled();
  await expect(copy).toBeFocused();
  await expect(page.getByRole("status")).toHaveText("Email address copied to clipboard.");
  await page.clock.fastForward(4001);
  await expect(copy).toHaveText("Copy email");
  await expect(page.getByRole("status")).toBeEmpty();
});

test("clipboard rejection shows a manual option and permits retry", async ({ page }) => {
  await page.addInitScript(() => {
    let attempt = 0;
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: async () => { if (++attempt === 1) throw new Error("Permission denied"); } },
    });
  });
  await page.goto("/#contact");
  const copy = page.getByRole("button", { name: "Copy email", exact: true });
  await copy.click();
  await expect(page.getByRole("status")).toContainText("copy it manually");
  await expect(copy).toBeEnabled();
  await expect(page.locator(".email-address")).toHaveAttribute("href", `mailto:${profile.email}`);
  await copy.click();
  await expect(page.getByRole("status")).toHaveText("Email address copied to clipboard.");
});

for (const succeeds of [true, false]) {
  test(`clipboard fallback handles ${succeeds ? "success" : "failure"} and removes its temporary field`, async ({ page }) => {
    await page.addInitScript((success) => {
      Object.defineProperty(navigator, "clipboard", { configurable: true, value: undefined });
      document.execCommand = (command: string) => {
        const field = document.activeElement;
        if (command === "copy" && field instanceof HTMLTextAreaElement) {
          document.documentElement.dataset.fallbackEmail = field.value;
        }
        return success;
      };
    }, succeeds);
    await page.goto("/#contact");
    const copy = page.locator("[data-copy-email]");
    await copy.click();
    await expect(page.locator("html")).toHaveAttribute("data-fallback-email", profile.email);
    await expect(page.locator("textarea")).toHaveCount(0);
    await expect(copy).toBeFocused();
    await expect(copy).toBeEnabled();
    await expect(page.getByRole("status")).toContainText(succeeds ? "copied to clipboard" : "copy it manually");
  });
}
