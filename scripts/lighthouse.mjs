import { spawn } from "node:child_process";
import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const executable = (name) => path.join(projectRoot, "node_modules", ".bin", `${name}${process.platform === "win32" ? ".cmd" : ""}`);
const host = "127.0.0.1";
const port = Number(process.env.QA_PORT ?? 4173);
const url = `http://${host}:${port}/`;
const reportDirectory = path.join(projectRoot, ".lighthouseci", "reports");
const reportPath = path.join(reportDirectory, "lighthouse.json");

const run = (command, args, options = {}) => new Promise((resolve, reject) => {
  const child = spawn(command, args, { cwd: projectRoot, stdio: "inherit", ...options });
  child.once("error", reject);
  child.once("exit", (code, signal) => {
    if (code === 0) resolve();
    else reject(new Error(`${path.basename(command)} exited with ${signal ?? `code ${code}`}`));
  });
});

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

await mkdir(reportDirectory, { recursive: true });

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

try {
  await waitForServer(server);
  await run(executable("lighthouse"), [
    url,
    "--only-categories=performance,accessibility,best-practices,seo",
    "--output=json",
    `--output-path=${reportPath}`,
    "--chrome-flags=--headless --no-sandbox --disable-dev-shm-usage",
    "--quiet",
  ]);

  const report = JSON.parse(await readFile(reportPath, "utf8"));
  const categories = Object.fromEntries(
    Object.entries(report.categories).map(([id, category]) => [id, Math.round(category.score * 100)]),
  );
  const metrics = {
    lcp: Math.round(report.audits["largest-contentful-paint"].numericValue),
    cls: report.audits["cumulative-layout-shift"].numericValue,
    tbt: Math.round(report.audits["total-blocking-time"].numericValue),
    bytes: Math.round(report.audits["total-byte-weight"].numericValue),
  };

  const failures = [
    ["Performance score", categories.performance, 90, ">="],
    ["Accessibility score", categories.accessibility, 100, ">="],
    ["Best practices score", categories["best-practices"], 95, ">="],
    ["SEO score", categories.seo, 100, ">="],
    ["Largest Contentful Paint", metrics.lcp, 2500, "<="],
    ["Cumulative Layout Shift", metrics.cls, 0.1, "<="],
    ["Total Blocking Time", metrics.tbt, 200, "<="],
    ["Total byte weight", metrics.bytes, 600000, "<="],
  ].filter(([, actual, limit, operator]) => operator === ">=" ? actual < limit : actual > limit);

  console.log("Lighthouse scores:", categories);
  console.log("Lighthouse metrics:", metrics);

  if (failures.length > 0) {
    const summary = failures.map(([name, actual, limit, operator]) => `${name}: ${actual} (expected ${operator} ${limit})`).join("\n");
    throw new Error(`Lighthouse budgets failed:\n${summary}`);
  }
} finally {
  if (server.exitCode === null) server.kill("SIGTERM");
}
