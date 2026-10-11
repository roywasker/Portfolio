import { expect, test } from "@playwright/test";
import { profile, projects } from "../src/data/portfolio";

test("production document serves successfully with the expected landmarks", async ({ request }) => {
  const response = await request.get("/");
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("text/html");
  const html = await response.text();
  for (const id of ["main", "top", "about", "work", "skills", "contact"]) {
    expect(html).toContain(`id="${id}"`);
  }
  expect(html).toContain(profile.name);
  expect(html).toContain(`mailto:${profile.email}`);
  expect(html).not.toContain("/@vite/client");
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
