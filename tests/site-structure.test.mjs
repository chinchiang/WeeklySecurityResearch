import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { SOCIAL_PAGES, canonicalItems, findEmbeddedItems, readEditions } from "../scripts/social-content-lib.mjs";

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

const CANONICAL_ITEM_KEYS = [
  "id",
  "week",
  "topic",
  "status",
  "title",
  "hook",
  "tags",
  "linkedin",
  "twitter",
  "blog",
  "newsletter",
  "evidence",
  "sources",
];
const STATUSES = new Set(["Ready", "Draft", "Hold"]);

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

test("every social edition uses the canonical schema with structured sources", () => {
  for (const week of dataWeeks()) {
    const edition = JSON.parse(readFileSync(path.join(dataDir, `${week}.json`), "utf8"));

    assert.equal(edition.week, week, `${week}: week 欄位須與檔名一致`);
    assert.match(edition.range, /^\d{4}-\d{2}-\d{2}–\d{4}-\d{2}-\d{2}$/, `${week}: range 格式`);
    assert.ok(Array.isArray(edition.items) && edition.items.length > 0, `${week}: 應至少有一個選題`);
    assert.equal(
      edition.qualified,
      edition.items.filter((item) => item.status === "Ready").length,
      `${week}: qualified 必須等於 Ready 選題數`,
    );

    for (const item of edition.items) {
      for (const key of CANONICAL_ITEM_KEYS) {
        assert.ok(key in item, `${week} / ${item.id ?? "?"}: 缺少欄位 ${key}`);
      }
      assert.equal(item.week, week, `${week} / ${item.id}: 選題 week 不一致`);
      assert.ok(STATUSES.has(item.status), `${week} / ${item.id}: 未知的 status ${item.status}`);
      assert.ok(item.title.trim().length > 0, `${week} / ${item.id}: title 不得為空`);
      assert.ok(Array.isArray(item.tags) && item.tags.length > 0, `${week} / ${item.id}: 缺少 tags`);

      // Sources are always objects, never bare strings.
      assert.ok(Array.isArray(item.sources) && item.sources.length > 0, `${week} / ${item.id}: 缺少 sources`);
      for (const source of item.sources) {
        assert.equal(typeof source, "object", `${week} / ${item.id}: 來源必須是物件而非字串`);
        assert.equal(new URL(source.url).protocol, "https:", `${week} / ${item.id}: 來源必須是 HTTPS — ${source.url}`);
        assert.ok(source.publisher?.trim().length > 0, `${week} / ${item.id}: 來源缺少 publisher`);
      }
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

test("the social pages embed exactly what the JSON says", () => {
  // The pages keep their item list inline so they open straight from disk, but
  // the JSON is the source of truth. Editing a page's ITEMS by hand, or adding
  // an edition without re-running the generator, fails here rather than
  // shipping two versions of the same week.
  const editions = readEditions(dataDir);
  const expected = canonicalItems(editions);
  const latestWeek = editions.at(-1).week;

  for (const page of SOCIAL_PAGES) {
    const embedded = findEmbeddedItems(readFileSync(path.join(socialDir, page), "utf8"));

    assert.equal(embedded.latest, latestWeek, `${page}: LATEST 與最新一期不符`);
    assert.equal(embedded.items.length, expected.length, `${page}: 內嵌選題數與 data/ 不符`);
    assert.deepEqual(embedded.items, expected, `${page}: 內嵌 ITEMS 與 data/ 內容不一致，請重新執行 scripts/generate-social-content.mjs`);
  }
});

test("social pages render sources from data and refuse non-HTTPS links", () => {
  for (const page of SOCIAL_PAGES) {
    const html = readFileSync(path.join(socialDir, page), "utf8");

    assert.match(html, /esc\(safeUrl\(s\.url\)\)/, `${page}: 來源連結未經 safeUrl 過濾`);
    assert.match(html, /esc\(s\.publisher\)/, `${page}: 未使用資料中的 publisher`);
    // The old domain lookup table is gone; publisher names come from the data.
    assert.doesNotMatch(html, /function sourceName\(/, `${page}: sourceName 應已移除`);
  }
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
