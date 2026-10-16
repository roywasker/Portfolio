import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Locator } from '@playwright/test';

test.use({ reducedMotion: 'reduce' });
const unlock = async (demo: Locator) => {
  const start = demo.locator('[data-vault-action="start"]');
  if (await start.isVisible()) await start.click();
  await demo.getByRole('button', { name: 'פתח את כספת ההדגמה', exact: true }).click();
};

test('MyPasswords card opens its case study with Work selected', async ({ page }) => {
  await page.goto('/');
  await page.locator('.project-card').nth(1).getByRole('link').click();
  await expect(page).toHaveURL(/\/work\/my-passwords\/$/);
  await expect(page.locator('.decision')).toHaveCount(3);
  for (const link of await page.locator('.site-header a[href="/#work"]').all()) {
    await expect(link).toHaveAttribute('aria-current', 'location');
  }
  await page.getByRole('link', { name: 'Back to selected work' }).click();
  await expect(page).toHaveURL(/\/#work$/);
});

test('vault demo supports search, favorites, reveal, add, trash, restore and reset in a fixed device', async ({ page }) => {
  await page.goto('/work/my-passwords/');
  const demo = page.locator('[data-passwords-demo]');
  await expect(demo).toBeVisible();
  const original = await demo.boundingBox();
  const fixed = async () => {
    const size = await demo.boundingBox();
    expect(size?.width).toBe(original?.width);
    expect(size?.height).toBe(original?.height);
  };
  await demo.getByRole('button', { name: /התחל תהליך אימות/ }).click();
  await fixed();
  await unlock(demo);
  await fixed();
  const search = demo.getByRole('searchbox');
  await search.fill('missing account');
  await expect(demo.locator('[data-vault-empty]')).toBeVisible();
  await search.fill('github developer');
  await expect(demo.locator('[data-vault-list] [data-entry]')).toHaveCount(1);
  await search.fill('');
  await demo.getByRole('button', { name: 'עבודה', exact: true }).click();
  await expect(demo.locator('[data-vault-list] [data-entry]')).toHaveCount(1);
  await demo.getByRole('button', { name: 'הכל', exact: true }).click();
  await demo.getByRole('button', { name: 'מועדפים', exact: true }).click();
  await expect(demo.locator('[data-vault-list] [data-entry]')).toHaveCount(1);
  await demo.getByRole('button', { name: 'מועדפים', exact: true }).click();
  await demo.getByRole('button', { name: 'פתח Google', exact: true }).click();
  await fixed();
  await demo.getByRole('button', { name: 'הצג סיסמה לדוגמה', exact: true }).click();
  await expect(demo.locator('[data-detail-password]')).toHaveText('Example-only!2026');
  await demo.getByRole('button', { name: 'נעילה', exact: true }).click();
  await expect(demo.locator('[data-detail-password]')).not.toHaveText('Example-only!2026');
  await expect(demo.locator('[data-detail-user]')).toBeEmpty();
  await fixed();
  await unlock(demo);
  await demo.getByRole('button', { name: 'הוסף חשבון לדוגמה', exact: true }).click();
  await fixed();
  await expect(demo.locator('[data-sample-user]')).toHaveAttribute('readonly', '');
  await demo.getByRole('button', { name: 'שמור כעת', exact: true }).click();
  await expect(demo.getByRole('button', { name: 'פתח Notion', exact: true })).toBeVisible();
  await demo.getByRole('button', { name: 'הוסף חשבון לדוגמה', exact: true }).click();
  await demo.getByRole('button', { name: 'שמור כעת', exact: true }).click();
  await expect(demo.getByRole('status')).toContainText('כבר קיים');
  await demo.locator('.vault-header [data-vault-action="home"]').click();
  await demo.getByRole('button', { name: 'פתח Notion', exact: true }).click();
  await demo.getByRole('button', { name: 'הוסף למועדפים', exact: true }).click();
  await demo.getByRole('button', { name: 'העבר לסל המחזור', exact: true }).click();
  await expect(demo.getByRole('button', { name: 'פתח Notion', exact: true })).toHaveCount(0);
  await demo.getByRole('button', { name: 'סל מחזור', exact: true }).click();
  await fixed();
  await demo.getByRole('button', { name: 'שחזר Notion', exact: true }).click();
  await expect(demo.locator('[data-trash-empty]')).toBeVisible();
  await demo.locator('.vault-header [data-vault-action="home"]').click();
  await expect(demo.getByRole('button', { name: 'הסר ממועדפים Notion', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await demo.getByRole('button', { name: /איפוס ההדגמה/ }).click();
  await fixed();
  await unlock(demo);
  await expect(demo.locator('[data-vault-list] [data-entry]')).toHaveCount(3);
  await expect(demo.getByRole('button', { name: 'פתח Notion', exact: true })).toHaveCount(0);
});

for (const theme of ['light', 'dark']) {
  test(`MyPasswords fits the screen and has accessible demo states in ${theme}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`/work/my-passwords/?theme=${theme}`);
    for (const id of ['top', 'demo', 'decisions', 'screenshots']) {
      await page.locator(`#${id}`).scrollIntoViewIfNeeded();
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
    }
    for (const image of await page.locator('.screenshots img').all()) {
      await image.scrollIntoViewIfNeeded();
      expect(await image.evaluate(async (img: HTMLImageElement) => { await img.decode(); return img.naturalWidth; })).toBeGreaterThan(0);
    }
    const scan = async () => expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations).toEqual([]);
    await scan();
    const demo = page.locator('[data-passwords-demo]');
    await unlock(demo);
    await scan();
    await demo.getByRole('button', { name: 'פתח Google', exact: true }).focus();
    await page.keyboard.press('Enter');
    await expect(demo.locator('#vault-detail-title')).toBeFocused();
    await scan();
    await demo.locator('.vault-header [data-vault-action="home"]').click();
    await demo.getByRole('button', { name: 'הוסף חשבון לדוגמה', exact: true }).click();
    await scan();
    expect(errors).toEqual([]);
  });
}
