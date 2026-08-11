import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const socialDir = path.join(root, "public", "social-content");
const dataDir = path.join(socialDir, "data");
const postsDir = path.join(socialDir, "posts");
const weekPattern = /^\d{4}-\d{2}-\d{2}$/;

const dataWeeks = () =>
  readdirSync(dataDir)
    .filter((name) => /^\d{4}-\d{2}-\d{2}\.json$/.test(name))
    .map((name) => name.replace(/\.json$/, ""))
    .sort();

const postWeeks = () =>
  readdirSync(postsDir)
    .filter((name) => weekPattern.test(name) && statSync(path.join(postsDir, name)).isDirectory())
    .sort();

const editionEntries = (edition) => edition.items ?? edition.ideas ?? [];

// Source lists exist in two historical shapes: a flat array of URLs and an
// array of {url, publisher, ...} provenance objects. Both are accepted; the
// point of the check is that every link is an HTTPS URL.
const editionUrls = (edition) =>
  editionEntries(edition).flatMap((entry) =>
    (entry.sources ?? []).map((source) => (typeof source === "string" ? source : source?.url)),
  );

test("every social edition has both structured data and posts", () => {
  assert.equal(existsSync(path.join(root, "social-content")), false, "舊的 social-content/ 目錄應已移除");

  const data = dataWeeks();
  const posts = postWeeks();

  assert.ok(data.length > 0, "public/social-content/data 應至少有一期");
  assert.deepEqual(
    data,
    posts,
    `每一期都必須同時有 data/<week>.json 與 posts/<week>/；只有資料的週次：${data.filter((week) => !posts.includes(week))}；只有貼文的週次：${posts.filter((week) => !data.includes(week))}`,
  );
});

test("each social edition parses and every source link is HTTPS", () => {
  for (const week of dataWeeks()) {
    const edition = JSON.parse(readFileSync(path.join(dataDir, `${week}.json`), "utf8"));
    const entries = editionEntries(edition);

    assert.ok(entries.length > 0, `${week}: 應至少有一個選題`);
    for (const entry of entries) {
      assert.equal(typeof entry.title, "string", `${week}: 選題缺少 title`);
      assert.ok(entry.title.trim().length > 0, `${week}: title 不得為空`);
    }
    for (const url of editionUrls(edition)) {
      assert.equal(typeof url, "string", `${week}: 來源缺少 url`);
      assert.equal(new URL(url).protocol, "https:", `${week}: 來源必須是 HTTPS — ${url}`);
    }
  }
});

test("the generated manifest covers every edition and points at the newest one", () => {
  const manifest = JSON.parse(readFileSync(path.join(dataDir, "latest.json"), "utf8"));
  const weeks = dataWeeks();

  assert.equal(manifest.latest.week, weeks.at(-1), "latest 應為最新一期；未重新產生 manifest？");
  assert.deepEqual(
    manifest.editions.map((edition) => edition.week).sort(),
    weeks,
    "manifest 的 editions 必須涵蓋每一期",
  );
});

test("latest social edition is derived instead of hard-coded in the homepage", () => {
  const homepage = readFileSync(path.join(root, "app", "page.tsx"), "utf8");

  assert.match(homepage, /latestSocialEdition\.readyCount/);
  assert.doesNotMatch(homepage, /social-content\/data\/\d{4}-\d{2}-\d{2}\.json/);
});

test("unknown week slugs are rejected before any metadata is produced", () => {
  const weekLayout = readFileSync(path.join(root, "app", "week", "[week]", "layout.tsx"), "utf8");

  assert.match(weekLayout, /notFound\(\)/);
  assert.match(weekLayout, /weekSlugs\.has\(decodedWeek\)/);
});

test("archive priority order is week-first", () => {
  const archive = readFileSync(path.join(root, "app", "archive", "page.tsx"), "utf8");

  assert.match(
    archive,
    /b\.week\.localeCompare\(a\.week\)\s*\|\|\s*a\.rank\s*-\s*b\.rank/,
  );
  assert.doesNotMatch(archive, /a\.id\s*-\s*b\.id/);
});

test("both modals lock background scrolling and restore the previous value", () => {
  // Written to accept either a direct assignment or setProperty(), so that
  // satisfying the react-hooks/immutability lint rule does not break the test.
  const setsHidden = /overflow["']?(?:\s*=\s*|["']?,\s*)["']hidden["']/;
  const restores = /overflow["']?(?:\s*=\s*|["']?,\s*)previousOverflow/;

  for (const page of [["app", "page.tsx"], ["app", "archive", "page.tsx"]]) {
    const source = readFileSync(path.join(root, ...page), "utf8");
    const label = page.join("/");

    assert.match(source, /const previousOverflow = document\.body\.style\.overflow/, label);
    assert.match(source, setsHidden, label);
    assert.match(source, restores, label);
  }
});
