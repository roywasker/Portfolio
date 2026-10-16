import { expect, test } from "@playwright/test";
import { profile, projects } from "../src/data/portfolio";
import { setQuantity, cartTotal, money } from '../src/data/trendy-demo';

test('removed engineering articles are absent from navigation, sitemap and production routes', async ({ request }) => {
  const home = await (await request.get('/')).text();
  const sitemap = await (await request.get('/sitemap.xml')).text();
  expect(home).not.toMatch(/id="notes"|href="#notes"|href="\/notes\//);
  expect(sitemap).not.toContain('/notes/');
  for (const slug of ['state-and-commands', 'focus-and-visibility', 'reactive-cart']) {
    expect((await request.get(`/notes/${slug}/`)).status()).toBe(404);
  }
  // Removing the articles must not remove the earlier professional story.
  expect(home).toContain('id="engineering-story-title"');
});

test('Trendy case study and original screenshots are served without JavaScript', async ({ request }) => {
  const response = await request.get('/work/trendy/');
  expect(response.status()).toBe(200);
  const html = await response.text();
  for (const text of ['Three decisions.', 'What this enables', 'The tradeoff', 'Browser recreation', 'No sign-in or payment', '/#work', '<noscript>']) expect(html).toContain(text);
  expect(html).toContain('https://www.roywasker.com/work/trendy/');
  for (const name of ['homepage', 'categories', 'cart']) {
    const image = await request.get(`/images/trendy/${name}.jpg`);
    expect(image.status()).toBe(200);
    expect(image.headers()['content-type']).toContain('image/jpeg');
  }
});

test('demo cart keeps integer currency totals and enforces quantity limits', () => {
  let cart = setQuantity({}, 'earbuds', 2);
  cart = setQuantity(cart, 'speaker', 3);
  expect(cartTotal(cart)).toBe(25500);
  expect(money(cartTotal(cart))).toBe('$255.00');
  const unchanged = { ...cart };
  expect(setQuantity(cart, 'unknown', 2)).toEqual(unchanged);
  expect(setQuantity(cart, 'earbuds', NaN)).toEqual(unchanged);
  expect(setQuantity(cart, 'earbuds', 20).earbuds).toBe(10);
  expect(cart).toEqual(unchanged);
  expect(setQuantity(cart, 'earbuds', 0)).toEqual({ speaker: 3 });
  expect(cartTotal({})).toBe(0);
});

test("production document serves successfully with the expected landmarks", async ({ request }) => {
  const response = await request.get("/");
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("text/html");
  const html = await response.text();
  for (const id of ["main", "top", "about", "work", "skills", "contact"]) {
    expect(html).toContain(`id="${id}"`);
  }
  expect(html).not.toContain('class="all-work-link"');
  expect((html.match(/class="project-card project-featured"/g) ?? []).length).toBe(2);
  expect((html.match(/Explore project/g) ?? []).length).toBe(2);
  const projectSection = html.split('id="work"')[1].split('id="skills"')[0];
  expect([...projectSection.matchAll(/<h3[^>]*>([^<]+)<\/h3>/g)].map(match => match[1]))
    .toEqual(projects.map(project => project.title));
  expect(html).toContain(profile.name);
  expect(html).toContain(`mailto:${profile.email}`);
  expect(html).not.toContain("/@vite/client");
  const aboutSection = html.split('id="about"')[1].split('id="work"')[0];
  expect(aboutSection).toContain('id="engineering-story-title"');
  expect(aboutSection).toContain('Three principles that shape how I approach Android engineering');
  for (const route of ['/work/trendy/', '/work/my-passwords/']) {
    expect(aboutSection).toContain(`href="${route}"`);
    expect((await request.get(route)).status()).toBe(200);
  }
});

test("project posters and their mobile variants are served as real images", async ({ request }) => {
  expect(new Set(projects.map(project => project.href)).size).toBe(projects.length);
  for (const project of projects) {
    expect(new URL(project.href).protocol).toBe("https:");
    for (const path of [project.poster, project.poster.replace(/\.avif$/, "-320.avif")]) {
      const response = await request.get(path);
      expect(response.status(), path).toBe(200);
      expect(response.headers()["content-type"], path).toContain("image/avif");
      expect((await response.body()).length, path).toBeGreaterThan(100);
    }
  }
});

test("crawler files, favicon and social preview are available", async ({ request }) => {
  const robots = await request.get("/robots.txt");
  expect(robots.status()).toBe(200);
  expect(await robots.text()).toContain("Sitemap: https://www.roywasker.com/sitemap.xml");
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  expect(await sitemap.text()).toContain("<loc>https://www.roywasker.com/</loc>");
  for (const [path, type] of [["/favicon.svg", "image/svg+xml"], ["/social-card.png", "image/png"]]) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
    expect(response.headers()["content-type"], path).toContain(type);
  }
});

test('MyPasswords case study serves its source-based narrative and original UI renders', async ({ request }) => {
  const response = await request.get('/work/my-passwords/');
  expect(response.status()).toBe(200);
  const html = await response.text();
  for (const text of ['Three decisions.', 'VaultSession', 'SQLCipher', 'The tradeoff', 'UI simulation', 'No biometric authentication', '<noscript>', 'Robolectric', 'https://www.roywasker.com/work/my-passwords/']) expect(html).toContain(text);
  expect(projects[1].caseStudy).toBe('/work/my-passwords/');
  expect(await (await request.get('/sitemap.xml')).text()).toContain('https://www.roywasker.com/work/my-passwords/');
  for (const name of ['welcome', 'passwords', 'add-password']) {
    const image = await request.get(`/images/my-passwords/${name}.png`);
    expect(image.status()).toBe(200);
    expect(image.headers()['content-type']).toContain('image/png');
    expect((await image.body()).length).toBeGreaterThan(1000);
  }
});

test('vault demo keeps filtering, favorites and reversible deletion consistent without mutating fixtures', async () => {
  const { initialCredentials, filterCredentials, addSampleAccount, updateCredential } = await import('../src/data/passwords-demo');
  const initial = initialCredentials();
  expect(filterCredentials(initial, 'GITHUB DEVELOPER').map(item => item.id)).toEqual(['github']);
  expect(filterCredentials(initial, 'github missing')).toEqual([]);
  expect(filterCredentials(initial, '', 'work', true).map(item => item.id)).toEqual(['github']);
  expect(filterCredentials(initial, '', 'personal', true)).toEqual([]);
  let entries = addSampleAccount(initial, 'notion');
  expect(entries).toHaveLength(4);
  expect(addSampleAccount(entries, 'notion')).toEqual(entries);
  expect(addSampleAccount(entries, 'untrusted')).toEqual(entries);
  entries = updateCredential(entries, 'notion', { favorite: true, deleted: true });
  expect(filterCredentials(entries)).toHaveLength(3);
  expect(filterCredentials(entries, '', 'all', false, true).map(item => item.id)).toEqual(['notion']);
  expect(addSampleAccount(entries, 'notion')).toHaveLength(4);
  entries = updateCredential(entries, 'notion', { deleted: false });
  expect(filterCredentials(entries, '', 'work', true).map(item => item.id)).toEqual(['github', 'notion']);
  expect(initial).toEqual(initialCredentials());
  expect(initialCredentials()).not.toBe(initial);
});
