import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const dataDir = path.join(root, "public", "social-content", "data");

test("social content keeps its complete history under public/", () => {
  assert.equal(existsSync(path.join(root, "social-content")), false, "the root social-content mirror was removed; public/social-content is the only copy");
  assert.deepEqual(
    readdirSync(dataDir).filter((name) => /^\d{4}-\d{2}-\d{2}\.json$/.test(name)).sort(),
    ["2026-07-27.json", "2026-08-03.json", "2026-08-09.json", "2026-08-10.json", "2026-08-17.json"],
  );
  for (const week of ["2026-07-27", "2026-08-03", "2026-08-09", "2026-08-10", "2026-08-17"]) {
    assert.equal(existsSync(path.join(root, "public", "social-content", "posts", week)), true);
  }
  for (const relative of ["index.html", "archive.html", "data/hosts.json", "data/latest.json", "assets/neon-host.webp", "assets/ukami-host.webp", "assets/sindy-analyst.webp"]) {
    assert.equal(existsSync(path.join(root, "public", "social-content", relative)), true, `${relative} missing`);
  }
});

test("social content is retained as data but has no homepage or archive entry point", () => {
  const datedFiles = readdirSync(dataDir)
    .filter((name) => /^\d{4}-\d{2}-\d{2}\.json$/.test(name))
    .sort();
  const latestWeek = datedFiles.at(-1).replace(/\.json$/, "");
  const manifest = JSON.parse(readFileSync(path.join(dataDir, "latest.json"), "utf8"));
  const homepage = readFileSync(path.join(root, "app", "page.tsx"), "utf8");

  assert.equal(manifest.latest.week, latestWeek);
  const archive = readFileSync(path.join(root, "app", "archive", "page.tsx"), "utf8");

  assert.doesNotMatch(homepage, /latestSocialEdition|social-content-cta|每週社群內容創意|\/social-content\//);
  assert.doesNotMatch(archive, /\/social-content\//);
  assert.doesNotMatch(homepage, /social-content\/data\/\d{4}-\d{2}-\d{2}\.json/);
});

test("canonical metadata is route-specific", () => {
  const rootLayout = readFileSync(path.join(root, "app", "layout.tsx"), "utf8");
  const archiveLayout = readFileSync(path.join(root, "app", "archive", "layout.tsx"), "utf8");
  const weekLayout = readFileSync(path.join(root, "app", "week", "[week]", "layout.tsx"), "utf8");

  assert.match(rootLayout, /canonical:\s*["']\/["']/);
  assert.match(archiveLayout, /canonical:\s*["']\/archive["']/);
  assert.match(weekLayout, /canonical:\s*`\/week\/\$\{canonicalWeek\}`/);
});

// CLAUDE.md and AGENTS.md are the same guide for two agents; only the title and the
// opening paragraph that names the agent and points at the other file may differ.
test("AGENTS.md stays in sync with CLAUDE.md", () => {
  const normalize = (text, name, agent, other) => text
    .replace(`# ${name}`, "# GUIDE")
    .replace(`給在這個 repo 工作的 ${agent} session`, "給在這個 repo 工作的 AGENT session")
    .replace(`\`${other}\` 是給`, "`OTHER` 是給")
    .replace(/是給 (?:Claude Code|Codex) 的同一份內容/, "是給 OTHER-AGENT 的同一份內容");
  assert.equal(
    normalize(readFileSync(path.join(root, "AGENTS.md"), "utf8"), "AGENTS.md", "Codex", "CLAUDE.md"),
    normalize(readFileSync(path.join(root, "CLAUDE.md"), "utf8"), "CLAUDE.md", "Claude Code", "AGENTS.md"),
    "CLAUDE.md 改了就要同步改 AGENTS.md",
  );
});

// Anything a "use client" module imports ends up in the browser bundle. readings.ts holds every
// reading, so client components take readings as props and import helpers from app/data/rubric.ts.
test("client components do not import the reading data module", () => {
  const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]);
  const clientFiles = walk(path.join(root, "app")).filter((file) => /\.tsx?$/.test(file) && /^\s*["']use client["']/.test(readFileSync(file, "utf8")));
  assert.ok(clientFiles.length > 0);
  for (const file of clientFiles) {
    for (const [statement] of readFileSync(file, "utf8").matchAll(/^import\s+(?!type\b)[^;]*?from\s+["'][^"']*data\/readings(?:\.ts)?["']/gm)) {
      assert.fail(`${path.relative(root, file)}：${statement} 會把全部讀物打包進 JavaScript；請改用 import type，或從 app/data/rubric.ts 引用工具函式。`);
    }
  }
});
