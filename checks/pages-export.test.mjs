import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { allWeeks, archiveReadings, CURRENT_WEEK, currentReadings, readings, weeklyEditorials } from "../app/data/readings.ts";
import { provenanceText } from "../app/data/provenance.ts";
import { pagesConfig } from "../scripts/pages-config.mjs";
import { findPrivate } from "../scripts/private-patterns.mjs";
const { base, site } = pagesConfig();
const htmlFiles = ["index.html", "archive/index.html", ...allWeeks.map(w => `week/${w.replaceAll(".", "-")}/index.html`)];
test("Pages export has all weekly routes, base-path-safe navigation and assets", () => {
  for (const file of htmlFiles) {
    const html = readFileSync(path.join("out", file), "utf8");
    const canonical = html.match(/rel="canonical" href="([^"]+)"/)?.[1];
    assert.equal(canonical, `${site}/${file.replace(/index\.html$/, "")}`);
    // Links with a fragment are checked too, down to the element they point at.
    const hasId = (page, id) => page.includes(` id="${decodeURIComponent(id)}"`);
    for (const [, url] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      const fragment = url.split("#")[1];
      if (url.startsWith("#")) {
        if (fragment) assert.ok(hasId(html, fragment), `${file}: no element for ${url}`);
        continue;
      }
      if (!url.startsWith("/")) continue;
      assert.ok(url.startsWith(`${base}/`), `${file}: escaped project base: ${url}`);
      const target = path.join("out", decodeURIComponent(url.slice(base.length).split(/[?#]/)[0]));
      assert.ok(existsSync(target) || existsSync(path.join(target, "index.html")), `${file}: missing ${url}`);
      if (fragment && !/\.\w+$/.test(target)) {
        assert.ok(hasId(readFileSync(path.join(target, "index.html"), "utf8"), fragment), `${file}: no element for ${url}`);
      }
    }
  }
});
// Next.js replaces a parent's openGraph/twitter object instead of merging it, so a
// sub-page that sets its own title silently loses the share image and site name.
test("every page carries complete Open Graph and Twitter metadata with the share image", () => {
  const meta = (html, key) => html.match(new RegExp(`<meta (?:property|name)="${key}" content="([^"]*)"`))?.[1];
  assert.ok(existsSync("out/og-image.png"));
  for (const file of htmlFiles) {
    const html = readFileSync(path.join("out", file), "utf8");
    const url = `${site}/${file.replace(/index\.html$/, "")}`;
    assert.equal(meta(html, "og:url"), url, file);
    assert.equal(meta(html, "og:image"), `${site}/og-image.png`, file);
    for (const [key, value] of [["og:type", "website"], ["og:locale", "zh_TW"], ["og:site_name", "科技・資安・架構週讀"], ["twitter:card", "summary_large_image"], ["twitter:image", `${site}/og-image.png`]]) {
      assert.equal(meta(html, key), value, `${file}: ${key}`);
    }
    const title = html.match(/<title>([^<]*)<\/title>/)?.[1];
    assert.equal(meta(html, "og:title"), title, `${file}: og:title`);
    assert.equal(meta(html, "twitter:title"), title, `${file}: twitter:title`);
  }
});
// Toggle buttons must expose their state to assistive technology, not only by colour.
test("filter, week and read-progress toggles expose aria-pressed; anchors do not claim to copy", () => {
  for (const file of ["index.html", "archive/index.html"]) {
    const html = readFileSync(path.join("out", file), "utf8");
    const groups = [...html.matchAll(/<div class="(?:filter-row|week-selector)"[^>]*>([\s\S]*?)<\/div>/g)].map((m) => m[1]);
    assert.ok(groups.length > 0, `${file}: no filter group`);
    for (const group of groups) {
      const buttons = [...group.matchAll(/<button[^>]*>/g)].map((m) => m[0]);
      assert.ok(buttons.length > 1, `${file}: filter group without buttons`);
      for (const button of buttons) assert.match(button, /aria-pressed="(?:true|false)"/, `${file}: ${button}`);
      assert.equal(buttons.filter((button) => button.includes('aria-pressed="true"')).length, 1, `${file}: exactly one active filter`);
    }
    const toggles = [...html.matchAll(/<button class="progress-toggle[^"]*"[^>]*>/g)].map((m) => m[0]);
    assert.ok(toggles.length > 0, `${file}: no read-progress toggle`);
    for (const toggle of toggles) assert.match(toggle, /aria-pressed="(?:true|false)"/, `${file}: ${toggle}`);
    // Every card has the same visible text, so the name must say which reading it marks.
    const unescape = (text) => text.replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
    const labels = toggles.map((toggle) => unescape(toggle.match(/aria-label="([^"]*)"/)?.[1] ?? ""));
    const expected = (file === "index.html" ? currentReadings : archiveReadings).map((r) => `標記為已閱讀：${r.title}`);
    assert.deepEqual([...labels].sort(), [...expected].sort(), `${file}: read-progress toggle labels`);
  }
  for (const week of allWeeks) {
    const html = readFileSync(`out/week/${week.replaceAll(".", "-")}/index.html`, "utf8");
    assert.doesNotMatch(html, /aria-label="複製/, `${week}: a plain anchor must not be labelled as copying`);
  }
});

test("current report contains every selected item and the complete Spotlight", () => {
  const html = readFileSync(`out/reports/${CURRENT_WEEK.replaceAll(".", "-")}.html`, "utf8");
  for (const r of currentReadings) {
    assert.ok(html.includes(`id="reading-${r.id}"`));
    for (const s of r.spotlight ?? []) assert.ok(html.includes(s.heading));
  }
  assert.ok(!html.includes('src="http'), "self-contained report must not require remote scripts");
});
test("every report links only to real sources, with a PDF link only when the reading has one", () => {
  for (const week of allWeeks) {
    const html = readFileSync(`out/reports/${week.replaceAll(".", "-")}.html`, "utf8");
    for (const [, url] of html.matchAll(/(?:href|src)="([^"]*)"/g)) {
      assert.ok(url.startsWith("https://") || url.startsWith("#"), `${week}: invalid link ${url}`);
    }
    const withPdf = readings.filter(r => r.week === week && r.pdf).length;
    assert.equal((html.match(/>PDF ↗</g) ?? []).length, withPdf, `${week}: PDF link count`);
  }
});

test("week pages and reports show each week's presentation note, such as a missing workflow", () => {
  for (const week of allWeeks) {
    const note = weeklyEditorials[week]?.presentationNote;
    if (!note) continue;
    const slug = week.replaceAll(".", "-");
    for (const file of [`week/${slug}/index.html`, `reports/${slug}.html`]) {
      assert.ok(readFileSync(path.join("out", file), "utf8").includes(note), `${file}: presentation note`);
    }
  }
});

test("public pages expose provenance and the new brand without private Drive links", () => {
  for (const file of [...htmlFiles, `reports/${CURRENT_WEEK.replaceAll(".", "-")}.html`]) {
    const html = readFileSync(path.join("out",file),"utf8");
    assert.ok(html.includes("科技・資安・架構"),file);
    // Home and archive offer the legacy label as a source filter; a week page or report
    // shows each of its readings' own provenance, which is legacy only for old readings.
    const week = file.match(/(\d{4})-(\d{2})-(\d{2})/)?.slice(1).join(".");
    const expected = week ? readings.filter(r => r.week === week).map(provenanceText) : ["歷史來源待確認"];
    for (const text of expected) assert.ok(html.includes(text), `${file}: missing provenance "${text}"`);
    assert.ok(!html.includes("docs.google.com/document/"),file);
    assert.ok(!html.includes("EveryWeekAIRead"),file);
  }
  const home = readFileSync("out/index.html","utf8");
  assert.ok(readFileSync("out/archive/index.html","utf8").includes("產製來源篩選"));
  for (const text of ["三個內容來源", "週二 15:00", "週五 08:00", "週六 01:00", "產製來源篩選"]) assert.ok(home.includes(text),text);
  const feed = readFileSync("out/feed.xml","utf8");
  assert.ok(feed.includes("科技・資安・架構週讀"));
  assert.ok(feed.includes("查核：ChatGPT"));
  assert.ok(feed.includes(site), "feed must reference the configured Pages site");
});
test("export excludes source files and private WORK identifiers", () => {
  const walk = dir => readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir,e.name)]);
  for (const file of walk("out")) {
    assert.ok(!/\.(?:env|tsx?|map)$/.test(file), file);
    if (!/\.(?:html|js|txt|json|xml)$/.test(file)) continue;
    const text = readFileSync(file, "utf8");
    assert.equal(findPrivate(text), null, file);
  }
  assert.ok(existsSync("out/.nojekyll"));
  assert.ok(!existsSync("out/social-content"), "social content must not ship on the public Pages site");
  for (const file of htmlFiles) assert.ok(!readFileSync(path.join("out", file), "utf8").includes("/social-content/"), `${file}: links to unpublished social content`);
});
