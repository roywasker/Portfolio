import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { profile } from '../src/data/portfolio';

test.use({ reducedMotion: 'reduce' });

for (const theme of ['dark', 'light'] as const) {
  test(`professional story stays readable and accessible in ${theme}`, async ({ page }) => {
    await page.goto(`/?theme=${theme}#about`);
    const story = page.locator('.engineering-story');
    const examples = story.locator('.engineering-examples > li');
    await expect(examples).toHaveCount(3);
    await expect(story.getByRole('heading', { level: 3 })).toHaveCount(1);
    // Company information belongs in the employment facts, not this narrative.
    await expect(story).not.toContainText(/Cellcom|Cassandra/i);
    await expect(page.locator('.about-copy')).not.toContainText(/Cellcom|Cassandra/i);
    await expect(page.locator('.about-experience')).toContainText(profile.company);

    for (const example of await examples.all()) {
      await example.scrollIntoViewIfNeeded();
      await expect(example.getByRole('heading', { level: 4 })).toBeVisible();
      await expect(example.locator('.example-description')).toBeVisible();
      await expect(example.locator('.example-takeaway')).toBeVisible();
      const fits = await example.evaluate(element => {
        const bounds = element.getBoundingClientRect();
        return bounds.left >= 0 && bounds.right <= innerWidth + 1 && element.scrollWidth <= element.clientWidth + 1;
      });
      expect(fits, 'Each example must fit without horizontal clipping').toBe(true);
    }
    await story.locator('.story-next').scrollIntoViewIfNeeded();
    for (const link of await story.getByRole('link').all()) {
      await expect(link).toBeVisible();
      expect(await link.evaluate(element => element.getBoundingClientRect().height)).toBeGreaterThanOrEqual(44);
    }
    expect((await new AxeBuilder({ page }).include('#about')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze()).violations).toEqual([]);
    await expect(page.locator('#notes, a[href="#notes"], a[href^="/notes/"]')).toHaveCount(0);
  });
}

test('story case study links work with the keyboard and return to selected work', async ({ page }) => {
  for (const route of ['/work/trendy/', '/work/my-passwords/']) {
    await page.goto('/#about');
    const link = page.locator(`.story-next a[href="${route}"]`);
    await link.focus();
    await expect(link).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(new URL(route, page.url()).href);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    const back = page.getByRole('link', { name: 'Back to selected work' });
    await back.focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/#work$/);
    await expect(page.locator('#work-title')).toBeInViewport();
  }
});

test.describe('professional story without JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('examples and case study navigation remain available', async ({ page }) => {
    await page.goto('/#about');
    const examples = page.locator('.engineering-examples > li');
    await expect(examples).toHaveCount(3);
    for (const example of await examples.all()) {
      await example.scrollIntoViewIfNeeded();
      await expect(example.getByRole('heading')).toBeVisible();
      await expect(example.locator('.example-description')).toBeVisible();
    }
    for (const route of ['/work/trendy/', '/work/my-passwords/']) {
      await page.locator(`.story-next a[href="${route}"]`).click();
      await expect(page).toHaveURL(new URL(route, page.url()).href);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await page.goto('/#about');
    }
  });
});
