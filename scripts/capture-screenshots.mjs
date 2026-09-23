import { spawn } from "node:child_process";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const executable = (name) => path.join(
  projectRoot,
  "node_modules",
  ".bin",
  `${name}${process.platform === "win32" ? ".cmd" : ""}`,
);
const outputDirectory = path.join(projectRoot, "image");
const host = "127.0.0.1";
const port = Number(process.env.SCREENSHOT_PORT ?? 4174);
const url = `http://${host}:${port}/`;

const waitForServer = async (server) => {
  const deadline = Date.now() + 120_000;
  while (Date.now() < deadline) {
    if (server.exitCode !== null) throw new Error(`Preview server exited with code ${server.exitCode}`);
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`Preview server did not become ready at ${url}`);
};

await mkdir(outputDirectory, { recursive: true });

const server = spawn(executable("astro"), [
  "preview",
  "--host", host,
  "--port", String(port),
  "--ignore-lock",
], {
  cwd: projectRoot,
  env: { ...process.env, ASTRO_TELEMETRY_DISABLED: "1" },
  stdio: "inherit",
});

let browser;

try {
  await waitForServer(server);
  browser = await chromium.launch(process.env.CI ? {} : { channel: "chrome" });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    colorScheme: "dark",
    reducedMotion: "reduce",
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  await page.addInitScript(() => localStorage.setItem("theme", "dark"));
  await page.goto(url, { waitUntil: "networkidle" });
  await page.addStyleTag({ content: "html { scroll-behavior: auto !important; }" });
  await page.evaluate(async () => {
    const images = [...document.images];
    images.forEach((image) => { image.loading = "eager"; });
    await Promise.all(images.map((image) => (
      image.complete ? Promise.resolve() : image.decode().catch(() => undefined)
    )));
  });

  const capture = async (filename, selector, progress = 0) => {
    await page.evaluate(({ selector: targetSelector, progress: targetProgress }) => {
      const target = document.querySelector(targetSelector);
      if (!(target instanceof HTMLElement)) throw new Error(`Missing screenshot target: ${targetSelector}`);
      const availableTravel = Math.max(0, target.offsetHeight - window.innerHeight);
      window.scrollTo(0, target.offsetTop + availableTravel * targetProgress);
    }, { selector, progress });
    await page.waitForTimeout(150);
    await page.screenshot({
      path: path.join(outputDirectory, filename),
      type: "png",
      animations: "disabled",
    });
  };

  await capture("home.png", "#top");
  await capture("work.png", "#about", .42);
  await capture("project.png", "#work", .18);
  await capture("skill.png", "#skills", .38);

  await context.close();
  console.log(`Updated screenshots in ${outputDirectory}`);
} finally {
  if (browser) await browser.close();
  if (server.exitCode === null) server.kill("SIGTERM");
}
