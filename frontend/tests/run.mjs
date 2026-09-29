// Frontend unit tests with no extra dependencies: esbuild (already part of Vite) bundles each
// tests/*.test.ts for Node, then Node's built-in test runner runs them.
//   npm test
import { build } from "esbuild";
import { readdirSync, mkdirSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const tests = readdirSync(here).filter((f) => f.endsWith(".test.ts"));
// Built inside node_modules/.cache so the bundles resolve packages from node_modules.
const out = join(root, "node_modules", ".cache", "vj-tests");
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

try {
  await build({
    entryPoints: tests.map((f) => join(here, f)),
    outdir: out,
    bundle: true,
    platform: "node",
    format: "esm",
    outExtension: { ".js": ".mjs" },
    alias: { "@": join(root, "src") },
    // npm packages (axios...) load from node_modules as Node expects, not bundled.
    packages: "external",
    // Vite's import.meta.env, with the values the tests expect.
    define: {
      "import.meta.env": JSON.stringify({ VITE_API_BASE_URL: "https://api.test/be", MODE: "test" }),
    },
    logLevel: "error",
  });
  const files = tests.map((f) => join(out, f.replace(/\.ts$/, ".mjs")));
  const run = spawnSync(process.execPath, ["--test", ...files], { stdio: "inherit" });
  process.exitCode = run.status ?? 1;
} finally {
  rmSync(out, { recursive: true, force: true });
}
