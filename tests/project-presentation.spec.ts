import { expect, test } from '@playwright/test';

test.use({ reducedMotion: 'reduce' });

test('featured projects lead the collection with larger previews and working calls to action', async ({ page }) => {
  await page.goto('/#work');
  const featured = page.locator('.project-featured');
  await expect(featured.locator('h3')).toHaveText(['Trendy', 'MyPasswords']);
  await expect(page.locator('.more-projects-label')).toHaveText('More projects & experiments');
  const listWidth = await page.locator('.project-list').evaluate(el => el.getBoundingClientRect().width);
  const sizes: number[] = [];
  for (const card of await featured.all()) {
    await card.scrollIntoViewIfNeeded();
    await expect(card.locator('.case-study-cta')).toContainText('Explore project');
    await expect(card.locator('.case-study-cta')).toBeVisible();
    const bounds = await card.boundingBox();
    expect(Math.abs(bounds!.width - listWidth)).toBeLessThanOrEqual(1);
    sizes.push(await card.locator('.project-visual').evaluate(el => el.getBoundingClientRect().height));
    expect(await card.locator('a a, a button').count()).toBe(0);
  }
  const compact = page.locator('.project-card:not(.project-featured)').first();
  await compact.scrollIntoViewIfNeeded();
  const compactHeight = await compact.locator('.project-visual').evaluate(el => el.getBoundingClientRect().height);
  for (const height of sizes) expect(height).toBeGreaterThan(compactHeight);
  for (const route of ['/work/trendy/', '/work/my-passwords/']) {
    await page.goto('/#work');
    const link = page.locator(`.project-featured > a[href="${route}"]`);
    await link.focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(new URL(route, page.url()).href);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  }
});

test('project feedback supports hover, keyboard focus and reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/#work');
  const card = page.locator('.project-featured').first();
  const arrow = card.locator('.project-link');
  await card.hover();
  await expect.poll(() => arrow.evaluate(el => getComputedStyle(el).transform)).not.toBe('none');
  await page.mouse.move(0, 0);
  await card.getByRole('link').focus();
  await expect(card.getByRole('link')).toBeFocused();
  await expect.poll(() => arrow.evaluate(el => getComputedStyle(el).transform)).not.toBe('none');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(arrow).toHaveCSS('transform', 'none');
  await expect(card.locator('.project-poster-image')).toHaveCSS('transform', 'none');
  await expect(card.locator('.case-study-cta')).toBeVisible();
});

test('section bands and chapter markers remain consistent in both themes', async ({ page }) => {
  for (const theme of ['dark', 'light']) {
    await page.goto(`/?theme=${theme}`);
    const bands: string[] = [];
    for (const id of ['about', 'work', 'skills', 'contact']) {
      const section = page.locator(`#${id}`);
      await section.scrollIntoViewIfNeeded();
      const marker = section.locator('.eyebrow > span').first();
      await expect(marker).toBeVisible();
      const geometry = await marker.boundingBox();
      expect(geometry!.width).toBe(geometry!.height);
      const styles = await section.evaluate(el => {
        const s = getComputedStyle(el);
        return { padding: parseFloat(s.paddingTop), background: s.backgroundColor };
      });
      expect(styles.padding).toBeGreaterThanOrEqual(56);
      if (id === 'about' || id === 'skills') bands.push(styles.background);
    }
    expect(bands[0]).toBe(bands[1]);
    expect(bands[0]).not.toBe('rgba(0, 0, 0, 0)');
  }
});
