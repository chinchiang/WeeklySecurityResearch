import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const dataDir = path.join(root, "public", "social-content", "data");

test("social content has synchronized source and deployment mirrors with complete history", () => {
  assert.equal(existsSync(path.join(root, "social-content")), true);
  assert.deepEqual(
    readdirSync(dataDir).filter((name) => /^\d{4}-\d{2}-\d{2}\.json$/.test(name)).sort(),
    ["2026-07-27.json", "2026-08-03.json", "2026-08-09.json", "2026-08-10.json", "2026-08-17.json"],
  );
  for (const week of ["2026-07-27", "2026-08-03", "2026-08-09", "2026-08-10", "2026-08-17"]) {
    assert.equal(existsSync(path.join(root, "public", "social-content", "posts", week)), true);
  }
  for (const relative of ["index.html", "archive.html", "data/hosts.json", "data/latest.json", "assets/neon-host.webp", "assets/ukami-host.webp", "assets/sindy-analyst.webp"]) {
    assert.deepEqual(
      readFileSync(path.join(root, "social-content", relative)),
      readFileSync(path.join(root, "public", "social-content", relative)),
      `${relative} drifted between mirrors`,
    );
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

  assert.doesNotMatch(homepage, /latestSocialEdition|social-content-cta|每週社群內容創意|\\/social-content\\//);
  assert.doesNotMatch(archive, /\\/social-content\\//);
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
