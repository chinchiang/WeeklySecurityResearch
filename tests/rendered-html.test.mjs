import assert from "node:assert/strict";
import test from "node:test";

const developmentPreviewMeta =
  /<meta(?=[^>]*\bname=["']codex-preview["'])(?=[^>]*\bcontent=["']development["'])[^>]*>/i;

const workerUrl = new URL("../dist/server/index.js", import.meta.url);
workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
const { default: worker } = await import(workerUrl.href);

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

test("renders development preview metadata", async () => {
  const response = await request("/");

  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  assert.match(await response.text(), developmentPreviewMeta);
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
    assert.equal(new URL(canonical).pathname.replace(/\/$/, "") || "/", expectedSuffix, pathname);
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
