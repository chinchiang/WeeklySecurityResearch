import assert from "node:assert/strict";
import test from "node:test";


const workerUrl = new URL("../dist/server/index.js", import.meta.url);
workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
const { default: worker } = await import(workerUrl.href);
const { SITE_URL } = await import("../app/site-config.ts");

const env = {
  ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
};
const ctx = { waitUntil() {}, passThroughOnException() {} };

const request = (pathname) =>
  worker.fetch(
    new Request(`https://localhost${pathname}`, { headers: { accept: "text/html" } }),
    env,
    ctx,
  );

const canonicalOf = (html) => html.match(/rel=["']canonical["'][^>]*href=["']([^"']*)["']/)?.[1] ?? null;

test("renders the homepage without development-preview metadata", async () => {
  const response = await request("/");

  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  // The Codex preview marker was a leftover from the Sites template; the
  // production site must not advertise a development build.
  assert.doesNotMatch(await response.text(), /name=["']codex-preview["']/i);
});

test("every response carries the baseline security headers", async () => {
  const response = await request("/");

  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  assert.equal(response.headers.get("x-frame-options"), "DENY");
  assert.equal(response.headers.get("referrer-policy"), "strict-origin-when-cross-origin");
  assert.match(response.headers.get("content-security-policy") ?? "", /frame-ancestors 'none'/);
  assert.match(response.headers.get("content-security-policy") ?? "", /object-src 'none'/);
  assert.match(response.headers.get("strict-transport-security") ?? "", /max-age=\d+/);
  assert.match(response.headers.get("permissions-policy") ?? "", /geolocation=\(\)/);
});

test("the CSP never blocks the inline scripts the framework emits", async () => {
  const response = await request("/");
  const html = await response.text();
  const csp = response.headers.get("content-security-policy") ?? "";
  const directives = new Map(
    csp.split(";").map((part) => part.trim()).filter(Boolean).map((part) => {
      const [name, ...values] = part.split(/\s+/);
      return [name, values];
    }),
  );

  const inlineScripts = html.match(/<script(?![^>]*\bsrc=)[^>]*>/g) ?? [];
  assert.ok(inlineScripts.length > 0, "expected the RSC payload to be inline");

  // script-src falls back to default-src; whichever applies must allow the
  // inline scripts, either wholesale or via a nonce carried by every tag.
  const effective = directives.get("script-src") ?? directives.get("default-src");
  if (effective) {
    const nonce = effective.find((value) => value.startsWith("'nonce-"));
    if (nonce) {
      const token = nonce.slice("'nonce-".length, -1);
      for (const tag of inlineScripts) {
        assert.ok(tag.includes(`nonce="${token}"`), `inline script without nonce: ${tag}`);
      }
    } else {
      assert.ok(effective.includes("'unsafe-inline'"), `CSP "${csp}" blocks inline scripts`);
    }
  }
});

test("each HTML route declares its own canonical URL", async () => {
  const routes = [
    ["/", "/"],
    ["/archive", "/archive"],
    ["/week/2026-08-07", "/week/2026-08-07"],
  ];

  for (const [pathname, expectedSuffix] of routes) {
    const response = await request(pathname);
    assert.equal(response.status, 200, pathname);

    const canonical = canonicalOf(await response.text());
    assert.ok(canonical, `${pathname} 缺少 canonical`);
    // Canonicals point at the GitHub Pages site (SITE_URL carries its base
    // path), whatever host the Worker itself is served from.
    const expected = `${SITE_URL}${expectedSuffix === "/" ? "" : expectedSuffix}`;
    assert.equal(canonical.replace(/\/$/, ""), expected, pathname);
  }
});

test("the feed covers the most recent three weeks and links each entry to its own week", async () => {
  const { FEED_WEEKS, allWeeks, readings } = await import("../app/data/readings.ts");

  const response = await worker.fetch(new Request("https://localhost/feed.xml"), env, ctx);
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^application\/atom\+xml\b/);

  const body = await response.text();
  const weeks = allWeeks.slice(-FEED_WEEKS);
  const expected = readings.filter((reading) => weeks.includes(reading.week));

  assert.ok(weeks.length > 1, "測試資料應涵蓋多於一週，否則此測試無法區分行為");
  assert.equal((body.match(/<entry>/g) ?? []).length, expected.length);

  for (const reading of expected) {
    const permalink = `/week/${reading.week.replaceAll(".", "-")}#reading-${reading.id}`;
    assert.ok(body.includes(permalink), `feed 缺少 ${reading.id} 指向自身週次的連結：${permalink}`);
  }
  for (const reading of readings.filter((item) => !weeks.includes(item.week))) {
    assert.ok(!body.includes(`#reading-${reading.id}<`), `feed 不應包含 ${FEED_WEEKS} 週以外的 ${reading.id}`);
  }

  // Text nodes must not carry raw markup characters.
  for (const text of body.matchAll(/<(?:title|summary|subtitle)>([\s\S]*?)<\//g)) {
    assert.doesNotMatch(text[1], /[<>]/, "feed 文字節點含未轉義字元");
    assert.doesNotMatch(text[1], /&(?!amp;|lt;|gt;|quot;|#\d+;)/, "feed 文字節點含未轉義的 &");
  }
});

test("unknown week slugs return 404 instead of indexable reflected text", async () => {
  const response = await request("/week/BUY-CHEAP-WATCHES");

  assert.equal(response.status, 404);

  const body = await response.text();
  const canonical = canonicalOf(body);
  assert.equal(canonical, null, "404 頁不得宣告自我 canonical");
  assert.doesNotMatch(body, /<title>[^<]*BUY.CHEAP.WATCHES/i, "任意字串不得進入標題");
});
