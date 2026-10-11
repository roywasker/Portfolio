import { spawn } from "node:child_process";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const executable = path.join(projectRoot, "node_modules", ".bin", process.platform === "win32" ? "astro.cmd" : "astro");
const outputDirectory = path.join(projectRoot, "image");
const host = "127.0.0.1";
const port = Number(process.env.SCREENSHOT_PORT ?? 4174);
const url = `http://${host}:${port}/`;

const waitForServer = async (server) => {
  const deadline = Date.now() + 120_000;
  while (Date.now() < deadline) {
    if (server.exitCode !== null) throw new Error(`Preview server exited with code ${server.exitCode}`);
    try {
      if ((await fetch(url)).ok) return;
    } catch {}
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  throw new Error(`Preview server did not become ready at ${url}`);
};

await mkdir(outputDirectory, { recursive: true });
// Refuse an occupied port so screenshots cannot silently capture stale code.
try {
  await fetch(url);
  throw new Error(`Screenshot port ${port} is occupied. Stop its server or set SCREENSHOT_PORT.`);
} catch (error) {
  if (error.message.includes("occupied")) throw error;
}

const server = spawn(executable, ["preview", "--host", host, "--port", String(port), "--ignore-lock"], {
  cwd: projectRoot,
  env: { ...process.env, ASTRO_TELEMETRY_DISABLED: "1" },
  stdio: "inherit",
});
let browser;
try {
  await waitForServer(server);
  browser = await chromium.launch(process.env.CI ? {} : { channel: "chrome" });
  for (const theme of ["dark", "light"]) {
    for (const [device, viewport] of [
      ["desktop", { width: 1440, height: 900 }],
      ["mobile", { width: 320, height: 568 }],
    ]) {
      const context = await browser.newContext({ viewport, colorScheme: theme, reducedMotion: "reduce", deviceScaleFactor: 1 });
      try {
        const page = await context.newPage();
        await page.goto(`${url}?theme=${theme}`, { waitUntil: "networkidle" });
        await page.evaluate(async () => {
          await document.fonts.ready;
          await Promise.all([...document.images].map(async image => {
            image.loading = "eager";
            await image.decode();
          }));
        });
        if (await page.locator("html").getAttribute("data-theme") !== theme) throw new Error(`Wrong screenshot theme: ${theme}`);
        await page.locator("#top").screenshot({
          path: path.join(outputDirectory, `hero-${theme}-${device}.png`),
          animations: "disabled",
        });
        if (device === "desktop") {
          for (const section of ["about", "work", "skills", "contact"]) {
            await page.locator(`#${section}`).screenshot({
              path: path.join(outputDirectory, `${section}-${theme}-desktop.png`),
              animations: "disabled",
              style: ".site-header, .skip-link { visibility: hidden !important; }",
            });
          }
        }
      } finally {
        await context.close();
      }
    }
  }
  console.log(`Updated dark/light desktop/mobile screenshots in ${outputDirectory}`);
} finally {
  if (browser) await browser.close();
  if (server.exitCode === null) server.kill("SIGTERM");
}
