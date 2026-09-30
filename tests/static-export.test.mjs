import assert from "node:assert/strict";
import test from "node:test";
import { existsSync, readFileSync } from "node:fs";
import { pagesConfig } from "../scripts/pages-config.mjs";
import { FEED_WEEKS, allWeeks, readings, weeklyEditorials } from "../app/data/readings.ts";

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
  assert.match(body, /<feed[^>]*>[\s\S]*?<author><name>[^<]+<\/name>/, "Atom feed 必須有 author（RFC 4287）");
  for (const reading of expected) {
    const id = `<id>${site}/week/${slug(reading.week)}#reading-${reading.id}</id>`;
    const permalink = `href="${site}/week/${slug(reading.week)}/#reading-${reading.id}"`;
    assert.ok(body.includes(id), `feed entry id 不得變動：${id}`);
    assert.ok(body.includes(permalink), `feed 缺少 ${reading.id} 指向自身週次的連結：${permalink}`);
  }
  for (const reading of readings.filter((item) => !weeks.includes(item.week))) {
    assert.ok(!body.includes(`#reading-${reading.id}<`), `feed 不應包含 ${FEED_WEEKS} 週以外的 ${reading.id}`);
  }
  for (const reading of expected) {
    const updated = [slug(reading.week), ...(reading.corrections ?? []).map((c) => slug(c.date))].sort().at(-1);
    const entry = body.split("<entry>").find((part) => part.includes(`#reading-${reading.id}</id>`));
    assert.equal(entry?.match(/<updated>([^<]+)<\/updated>/)?.[1], `${updated}T00:00:00+08:00`, `${reading.id}: updated`);
  }
  for (const text of body.matchAll(/<(?:title|summary|subtitle)>([\s\S]*?)<\//g)) {
    assert.doesNotMatch(text[1], /[<>]/, "feed 文字節點含未轉義字元");
    assert.doesNotMatch(text[1], /&(?!amp;|lt;|gt;|quot;|#\d+;)/, "feed 文字節點含未轉義的 &");
  }
});

test("robots.txt and sitemap point at the configured site and list every week", () => {
  assert.ok(read("robots.txt").includes(`Sitemap: ${site}/sitemap.xml`));
  const sitemap = read("sitemap.xml");
  // Locations must equal the canonical URLs (trailing slash), not redirect to them.
  const expected = [`${site}/`, `${site}/archive/`, ...allWeeks.map((week) => `${site}/week/${slug(week)}/`)];
  assert.deepEqual([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]), expected);
  // lastmod is when the page changed (publication, verification, correction), never
  // the research's own date, which predates the page.
  const lastmods = allWeeks.map((week) => [slug(week), weeklyEditorials[week]?.verifiedAt,
    ...readings.filter((r) => r.week === week).flatMap((r) => (r.corrections ?? []).map((c) => slug(c.date)))]
    .filter(Boolean).sort().at(-1));
  allWeeks.forEach((week, i) => {
    assert.ok(sitemap.includes(`<loc>${site}/week/${slug(week)}/</loc><lastmod>${lastmods[i]}</lastmod>`), `${week} lastmod 應為 ${lastmods[i]}`);
    assert.ok(lastmods[i] >= slug(week), `${week} lastmod 不得早於週次`);
  });
  const latest = [...lastmods].sort().at(-1);
  assert.ok(sitemap.includes(`<loc>${site}/</loc><lastmod>${latest}</lastmod>`), "首頁 lastmod 應為所有週次中最新的");
});
