import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { allWeeks, CURRENT_WEEK, currentReadings } from "../app/data/readings.ts";
const base = "/EveryWeekAIRead";
const htmlFiles = ["index.html", "archive/index.html", ...allWeeks.map(w => `week/${w.replaceAll(".", "-")}/index.html`)];
test("Pages export has all weekly routes, base-path-safe navigation and assets", () => {
  for (const file of htmlFiles) {
    const html = readFileSync(path.join("out", file), "utf8");
    const canonical = html.match(/rel="canonical" href="([^"]+)"/)?.[1];
    assert.equal(canonical, `https://chinchiang.github.io${base}/${file.replace(/index\.html$/, "")}`);
    for (const [, url] of html.matchAll(/(?:href|src)="([^"#]+)"/g)) {
      if (!url.startsWith("/")) continue;
      assert.ok(url.startsWith(`${base}/`), `${file}: escaped project base: ${url}`);
      const target = path.join("out", decodeURIComponent(url.slice(base.length).split(/[?#]/)[0]));
      assert.ok(existsSync(target) || existsSync(path.join(target, "index.html")), `${file}: missing ${url}`);
    }
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
test("export excludes source files and the private WORK document identifier", () => {
  const walk = dir => readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir,e.name)]);
  for (const file of walk("out")) {
    assert.ok(!/\.(?:env|tsx?|map)$/.test(file), file);
    if (/\.(?:html|js|txt|json)$/.test(file)) assert.ok(!readFileSync(file, "utf8").includes("1r77GDSHTt-wk2dIcLDJLrR-mw0wK9uHBr8hFsYXqAPs"), file);
  }
  assert.ok(existsSync("out/.nojekyll"));
});
