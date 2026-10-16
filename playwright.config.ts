import { defineConfig } from "@playwright/test";

const localBrowser = process.env.CI ? {} : { channel: "chrome" as const };
const qaPort = Number(process.env.QA_PORT ?? 4173);
if (!Number.isInteger(qaPort) || qaPort < 1024 || qaPort > 65535) throw new Error('QA_PORT must be an integer between 1024 and 65535');
const baseURL = `http://127.0.0.1:${qaPort}`;

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  workers: 1,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : [["list"], ["html", { open: "never" }]],
  use: {
    baseURL,
    colorScheme: "dark",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    ...localBrowser,
  },
  projects: [
    { name: "contracts", testMatch: /contracts\.spec\.ts/ },
    ...[
    { name: "mobile-small", use: { viewport: { width: 320, height: 568 } } },
    { name: "mobile-android", use: { viewport: { width: 360, height: 800 } } },
    { name: "mobile", use: { viewport: { width: 390, height: 844 } } },
    { name: "mobile-large", use: { viewport: { width: 430, height: 932 } } },
    { name: "mobile-landscape", use: { viewport: { width: 844, height: 390 } } },
    { name: "tablet-small", use: { viewport: { width: 768, height: 1024 } } },
    { name: "navigation-breakpoint", use: { viewport: { width: 769, height: 1024 } } },
    { name: "tablet", use: { viewport: { width: 820, height: 1180 } } },
    { name: "hero-stacked-boundary", use: { viewport: { width: 928, height: 1024 } } },
    { name: "hero-columns-boundary", use: { viewport: { width: 929, height: 1024 } } },
    { name: "tablet-landscape", use: { viewport: { width: 1024, height: 768 } } },
    { name: "laptop", use: { viewport: { width: 1280, height: 720 } } },
    { name: "desktop", use: { viewport: { width: 1440, height: 900 } } },
    { name: "desktop-full-hd", use: { viewport: { width: 1920, height: 1080 } } },
    { name: "desktop-wide", use: { viewport: { width: 2560, height: 1440 } } },
    ].map(project => ({ ...project, testIgnore: /contracts\.spec\.ts/ })),
  ],
  webServer: {
    command: `npm run preview -- --host 127.0.0.1 --port ${qaPort} --ignore-lock`,
    url: baseURL,
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
