import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.use({ reducedMotion: 'reduce' });

test('Trendy case study is reachable and links back to the portfolio', async ({ page }) => {
  await page.goto('/');
  await page.locator('.project-card a[href="/work/trendy/"]').click();
  await expect(page).toHaveURL(/\/work\/trendy\/$/);
  await expect(page.locator('.decision')).toHaveCount(3);
  await expect(page.locator('.wordmark')).toHaveAttribute('href', '/#top');
  await page.getByRole('link', { name: 'Back to selected work' }).click();
  await expect(page).toHaveURL(/\/#work$/);
});

test('Trendy demo supports filtering, quantity bounds, cart editing and reset', async ({ page }) => {
  await page.goto('/work/trendy/');
  const demo = page.locator('[data-trendy-demo]');
  await expect(demo).toBeVisible();
  const initialSize = await demo.boundingBox();
  const assertFixedSize = async () => {
    const size = await demo.boundingBox();
    expect(size?.width).toBe(initialSize?.width);
    expect(size?.height).toBe(initialSize?.height);
  };
  await assertFixedSize();
  await demo.getByRole('button', { name: 'Categories', exact: true }).click();
  await assertFixedSize();
  await demo.getByRole('button', { name: 'Fashion & Style', exact: true }).click();
  await expect(demo.locator('[data-product]:visible')).toHaveCount(1);
  await demo.getByRole('button', { name: /Daily carry/ }).click();
  await assertFixedSize();
  await expect(demo.getByRole('button', { name: 'Decrease product quantity', exact: true })).toBeDisabled();
  await demo.getByRole('button', { name: 'Increase product quantity', exact: true }).click();
  await demo.getByRole('button', { name: 'Add to cart', exact: true }).click();
  await assertFixedSize();
  await expect(demo.locator('[data-total]')).toHaveText('$70.00');
  await page.clock.install();
  await demo.getByRole('button', { name: 'Increase Daily carry quantity', exact: true }).click();
  await expect(demo.locator('[data-total]')).toHaveText('$105.00');
  await expect(demo.locator('[data-total]')).toHaveAttribute('data-updated', '');
  await page.clock.fastForward(1101);
  await expect(demo.locator('[data-total]')).not.toHaveAttribute('data-updated');
  await demo.getByRole('button', { name: 'Review demo order' }).click();
  await assertFixedSize();
  await expect(demo.locator('[data-review-total]')).toHaveText('$105.00');
  await expect(demo.locator('[data-panel="review"]')).toContainText('no order is placed');
  await demo.getByRole('button', { name: 'Back to cart', exact: true }).click();
  await demo.getByRole('button', { name: 'Remove Daily carry', exact: true }).click();
  await expect(demo.locator('[data-total]')).toHaveText('$0.00');
  await expect(demo.getByRole('button', { name: 'Review demo order' })).toBeDisabled();
  await demo.getByRole('button', { name: 'Reset demo', exact: true }).click();
  await expect(demo.locator('[data-product]:visible')).toHaveCount(3);
  await demo.getByRole('button', { name: /Everyday earbuds/ }).click();
  for (let i = 0; i < 9; i++) await demo.getByRole('button', { name: 'Increase product quantity', exact: true }).click();
  await expect(demo.getByRole('button', { name: 'Increase product quantity', exact: true })).toBeDisabled();
  await demo.getByRole('button', { name: 'Add to cart', exact: true }).click();
  await expect(demo.locator('[data-total]')).toHaveText('$600.00');
  await demo.getByRole('button', { name: 'Reset demo', exact: true }).click();
  await expect(demo.locator('[data-count]')).toHaveText('0');
});

for (const theme of ['dark', 'light']) {
  test(`Trendy fits the viewport and passes accessibility checks in ${theme}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`/work/trendy/?theme=${theme}`);
    for (const id of ['top', 'demo', 'decisions', 'screenshots']) {
      await page.locator(`#${id}`).scrollIntoViewIfNeeded();
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
    }
    for (const image of await page.locator('.screenshots img').all()) {
      await image.scrollIntoViewIfNeeded();
      expect(await image.evaluate(async (img: HTMLImageElement) => { await img.decode(); return img.naturalWidth > 0; })).toBe(true);
    }
    const scan = () => new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect((await scan()).violations).toEqual([]);
    await page.locator('[data-product]').first().focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('#detail-title')).toBeFocused();
    await page.getByRole('button', { name: 'Add to cart', exact: true }).click();
    expect((await scan()).violations).toEqual([]);
    expect(errors).toEqual([]);
  });
}
