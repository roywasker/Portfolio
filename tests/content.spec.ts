import { expect, test } from "@playwright/test";
import { profile, projects, skillGroups } from "../src/data/portfolio";

test.use({ reducedMotion: "reduce" });

test("all projects render their content and decode their responsive images", async ({ page }) => {
  await page.goto("/");
  const cards = page.locator(".project-card");
  await expect(cards).toHaveCount(projects.length);
  for (const project of projects) {
    const card = cards.filter({ has: page.getByRole("heading", { name: project.title, exact: true }) });
    await card.scrollIntoViewIfNeeded();
    await expect(card).toContainText(project.description);
    await expect(card.locator("li")).toHaveText(project.stack);
    await expect(card.getByRole("link")).toHaveAttribute("href", project.caseStudy ?? project.href);
    const image = card.getByRole("img", { name: `${project.title} project preview` });
    await expect(image).toBeVisible();
    expect(await image.evaluate(async (element: HTMLImageElement) => {
      await element.decode();
      return element.naturalWidth > 0 && element.naturalHeight > 0;
    })).toBe(true);
  }
});

test("project and resume actions open the intended destinations in a new tab", async ({ page, context }) => {
  // Fulfill external navigation locally: do not rely on GitHub/Drive or user accounts.
  for (const destination of [...projects.map(project => project.href), profile.resume]) {
    await context.route(destination, route => route.fulfill({ contentType: "text/html", body: "<title>Destination</title>" }));
  }
  await page.goto("/");
  for (const selector of [".app-project", ".project-card a[target=\"_blank\"]", ".resume-link"]) {
    if (selector === ".app-project" && (page.viewportSize()?.width ?? 0) <= 768) {
      await expect(page.locator(selector).first()).toBeHidden();
      continue;
    }
    const link = page.locator(selector).first();
    const destination = await link.getAttribute("href");
    const popupPromise = page.waitForEvent("popup");
    await link.click();
    const popup = await popupPromise;
    await expect(popup).toHaveURL(destination!);
    await popup.close();
    await expect(page.locator("#hero-title")).toBeAttached();
  }
});

test("skills use one consistent visual treatment in both themes", async ({ page }) => {
  for (const theme of ["dark", "light"]) {
    await page.goto(`/?theme=${theme}#skills`);
    await expect(page.locator("#skills h3")).toHaveText(skillGroups.map(group => group.title));
    await expect(page.locator("#skills li")).toHaveText(skillGroups.flatMap(group => [...group.skills]));
    const styles = await page.locator("#skills li").evaluateAll(elements => elements.map(element => {
      const s = getComputedStyle(element);
      return [s.fontSize, s.fontWeight, s.color, s.backgroundColor, s.border, s.borderRadius, s.padding];
    }));
    for (const style of styles) expect(style).toEqual(styles[0]);
  }
});

test("search and sharing metadata identify the site consistently", async ({ page, request }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(`${profile.name} — ${profile.role}`);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("h1")).toContainText("Mobile");
  await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /Android.*Kotlin/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://www.roywasker.com/");
  const data = JSON.parse(await page.locator('script[type="application/ld+json"]').innerText());
  expect(data).toMatchObject({ "@type": "Person", name: profile.name, email: `mailto:${profile.email}`, jobTitle: profile.role });
  expect(data.sameAs).toEqual(profile.socials.map(social => social.href));
  for (const selector of ['meta[property="og:image"]', 'meta[name="twitter:image"]']) {
    const url = new URL((await page.locator(selector).getAttribute("content"))!);
    const response = await request.get(url.pathname);
    expect(response.ok()).toBe(true);
    expect(response.headers()["content-type"]).toContain("image/png");
  }
  for (const link of await page.locator('a[target="_blank"]').all()) {
    await expect(link).toHaveAttribute("rel", /noreferrer|noopener/);
    await expect(link).toHaveAttribute("href", /^https:\/\//);
  }
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  test("content, navigation and direct contact remain available", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#hero-title")).toBeVisible();
    await page.getByRole("link", { name: /Explore my work/ }).click();
    await expect(page.locator("#work-title")).toBeInViewport();
    await expect(page.locator(".project-card")).toHaveCount(projects.length);
    await page.locator("#contact").scrollIntoViewIfNeeded();
    await expect(page.getByRole("link", { name: "Send an email" })).toHaveAttribute("href", `mailto:${profile.email}`);
    await expect(page.locator("[data-copy-email]")).toBeHidden();
  });
});

test("all internal anchors and contact destinations are valid", async ({ page }) => {
  await page.goto("/");
  const targets = await page.locator('a[href^="#"]').evaluateAll(links =>
    [...new Set(links.map(link => (link as HTMLAnchorElement).hash))],
  );
  for (const hash of targets) {
    expect(hash.length).toBeGreaterThan(1);
    await expect(page.locator(hash)).toHaveCount(1);
  }
  for (const link of await page.locator('a[href^="mailto:"]').all()) {
    await expect(link).toHaveAttribute("href", `mailto:${profile.email}`);
  }
  for (const social of profile.socials) {
    await expect(page.locator(`#contact a[href="${social.href}"]`)).toHaveCount(1);
  }
  await expect(page.locator(".resume-link")).toHaveAttribute("href", profile.resume);
});

test("direct section links leave their titles below the fixed navigation", async ({ page }) => {
  for (const [id, title] of [["about", "#about-title"], ["work", "#work-title"], ["skills", "#skills-title"], ["contact", ".eyebrow"]]) {
    await page.goto(`/#${id}`);
    const heading = page.locator(`#${id}`).locator(title);
    await expect(heading).toBeInViewport();
    await expect.poll(async () => {
      const titleBounds = await heading.boundingBox();
      const headerBounds = await page.locator(".site-header").boundingBox();
      return titleBounds && headerBounds ? titleBounds.y - headerBounds.y - headerBounds.height : -1;
    }).toBeGreaterThanOrEqual(0);
  }
});

for (const javaScriptEnabled of [true, false]) {
  test.describe(`fresh fragment entry with JavaScript ${javaScriptEnabled ? "enabled" : "disabled"}`, () => {
    test.use({ javaScriptEnabled });

    test("section headings remain below navigation after layout settles", async ({ page }) => {
      for (const id of ["about", "work", "skills", "contact"]) {
        // Leave the document so each URL exercises an initial fragment load.
        await page.goto("about:blank");
        await page.goto(`/#${id}`);
        await page.evaluate(async (javaScriptEnabled) => {
          await document.fonts.ready;
          // Animation frame callbacks do not run when JavaScript is disabled.
          if (javaScriptEnabled) {
            await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
          }
        }, javaScriptEnabled);
        const heading = page.locator(`#${id}`).locator(id === "contact" ? ".eyebrow" : `#${id}-title`);
        await expect(heading).toBeInViewport();
        await expect.poll(async () => {
          const bounds = await heading.boundingBox();
          const header = await page.locator(".site-header").boundingBox();
          return bounds && header ? bounds.y - header.y - header.height : -1;
        }, { message: `#${id} heading must clear the fixed header` }).toBeGreaterThanOrEqual(0);
      }
    });
  });
}
