import assert from "node:assert/strict";
import test from "node:test";
import { existsSync, readFileSync } from "node:fs";
import { pagesConfig } from "../scripts/pages-config.mjs";
import { FEED_WEEKS, allWeeks, readings } from "../app/data/readings.ts";

// These tests read the GitHub Pages export in out/ (npm run build:pages).
const { site } = pagesConfig();
const read = (file) => readFileSync(`out/${file}`, "utf8");
const canonicalOf = (html) => html.match(/rel=["']canonical["'][^>]*href=["']([^"']*)["']/)?.[1] ?? null;
const slug = (week) => week.replaceAll(".", "-");

test("export exists and the homepage carries no development-preview metadata", () => {
  assert.ok(existsSync("out/index.html"), "run npm run build:pages first");
  assert.doesNotMatch(read("index.html"), /name=["']codex-preview["']/i);
});

test("404 page is not indexable and declares no canonical", () => {
  const html = read("404.html");
  assert.equal(canonicalOf(html), null, "404 頁不得宣告自我 canonical");
  assert.match(html, /<meta name="robots" content="noindex[^"]*"/);
});

test("the feed covers the most recent weeks and links each entry to its own week", () => {
  const body = read("feed.xml");
  const weeks = allWeeks.slice(-FEED_WEEKS);
  const expected = readings.filter((reading) => weeks.includes(reading.week));

  assert.ok(weeks.length > 1, "測試資料應涵蓋多於一週，否則此測試無法區分行為");
  assert.equal((body.match(/<entry>/g) ?? []).length, expected.length);
  for (const reading of expected) {
    const permalink = `${site}/week/${slug(reading.week)}#reading-${reading.id}`;
    assert.ok(body.includes(permalink), `feed 缺少 ${reading.id} 指向自身週次的連結：${permalink}`);
  }
  for (const reading of readings.filter((item) => !weeks.includes(item.week))) {
    assert.ok(!body.includes(`#reading-${reading.id}<`), `feed 不應包含 ${FEED_WEEKS} 週以外的 ${reading.id}`);
  }
  for (const text of body.matchAll(/<(?:title|summary|subtitle)>([\s\S]*?)<\//g)) {
    assert.doesNotMatch(text[1], /[<>]/, "feed 文字節點含未轉義字元");
    assert.doesNotMatch(text[1], /&(?!amp;|lt;|gt;|quot;|#\d+;)/, "feed 文字節點含未轉義的 &");
  }
});

test("robots.txt and sitemap point at the configured site and list every week", () => {
  assert.ok(read("robots.txt").includes(`Sitemap: ${site}/sitemap.xml`));
  const sitemap = read("sitemap.xml");
  for (const loc of [site, `${site}/archive`, ...allWeeks.map((week) => `${site}/week/${slug(week)}`)]) {
    assert.ok(sitemap.includes(`<loc>${loc}</loc>`), `sitemap 缺少 ${loc}`);
  }
});
