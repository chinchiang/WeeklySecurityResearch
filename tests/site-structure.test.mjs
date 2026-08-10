import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const dataDir = path.join(root, "public", "social-content", "data");

test("social content has one canonical storage location and complete history", () => {
  assert.equal(existsSync(path.join(root, "social-content")), false);
  assert.deepEqual(
    readdirSync(dataDir).filter((name) => /^\d{4}-\d{2}-\d{2}\.json$/.test(name)).sort(),
    ["2026-07-27.json", "2026-08-03.json", "2026-08-10.json"],
  );
  for (const week of ["2026-07-27", "2026-08-03", "2026-08-10"]) {
    assert.equal(existsSync(path.join(root, "public", "social-content", "posts", week)), true);
  }
});

test("latest social edition is derived instead of hard-coded in the homepage", () => {
  const datedFiles = readdirSync(dataDir)
    .filter((name) => /^\d{4}-\d{2}-\d{2}\.json$/.test(name))
    .sort();
  const latestWeek = datedFiles.at(-1).replace(/\.json$/, "");
  const manifest = JSON.parse(readFileSync(path.join(dataDir, "latest.json"), "utf8"));
  const homepage = readFileSync(path.join(root, "app", "page.tsx"), "utf8");

  assert.equal(manifest.latest.week, latestWeek);
  assert.match(homepage, /latestSocialEdition\.readyCount/);
  assert.doesNotMatch(homepage, /social-content\/data\/\d{4}-\d{2}-\d{2}\.json/);
});

test("canonical metadata is route-specific", () => {
  const rootLayout = readFileSync(path.join(root, "app", "layout.tsx"), "utf8");
  const archiveLayout = readFileSync(path.join(root, "app", "archive", "layout.tsx"), "utf8");
  const weekLayout = readFileSync(path.join(root, "app", "week", "[week]", "layout.tsx"), "utf8");

  assert.doesNotMatch(rootLayout, /canonical:\s*["']\/["']/);
  assert.match(archiveLayout, /canonical:\s*["']\/archive["']/);
  assert.match(weekLayout, /canonical:\s*`\/week\/\$\{canonicalWeek\}`/);
});
