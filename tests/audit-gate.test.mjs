import assert from "node:assert/strict";
import test from "node:test";
import { evaluate } from "../scripts/audit-gate.mjs";

// Shapes follow `npm audit --json` (auditReportVersion 2).
const advisory = (id, severity = "high") => ({ url: `https://github.com/advisories/${id}`, title: `${id} title`, severity });
const report = (vulnerabilities) => ({
  vulnerabilities: Object.fromEntries(Object.entries(vulnerabilities).map(([name, via]) => [name, { name, via }])),
});
const ids = (list) => list.map((a) => a.id ?? a.advisory);

test("production advisories block, dev-only advisories are warnings", () => {
  const all = report({ next: [advisory("GHSA-prod-0001")], "brace-expansion": [advisory("GHSA-dev0-0001")] });
  const production = report({ next: [advisory("GHSA-prod-0001")] });
  const result = evaluate({ all, production, allow: [], today: "2026-09-30" });
  assert.deepEqual(ids(result.blocking), ["GHSA-prod-0001"]);
  assert.deepEqual(ids(result.devOnly), ["GHSA-dev0-0001"]);
});

test("moderate advisories and parent-package references are ignored", () => {
  const all = report({ minimatch: ["brace-expansion"], "brace-expansion": [advisory("GHSA-mod0-0001", "moderate")] });
  const result = evaluate({ all, production: report({}), allow: [], today: "2026-09-30" });
  assert.equal(result.blocking.length + result.devOnly.length, 0);
});

test("allowlist entries tolerate advisories, expire and go stale", () => {
  const all = report({ next: [advisory("GHSA-prod-0001")] });
  const entry = (advisoryId, reviewBy) => ({ advisory: advisoryId, reason: "r", blockedOn: "b", reviewBy });
  const current = evaluate({ all, production: all, allow: [entry("GHSA-prod-0001", "2026-12-31")], today: "2026-09-30" });
  assert.deepEqual(ids(current.tolerated), ["GHSA-prod-0001"]);
  assert.equal(current.blocking.length, 0);
  assert.equal(current.expired.length, 0);
  const expired = evaluate({ all, production: all, allow: [entry("GHSA-prod-0001", "2026-09-29")], today: "2026-09-30" });
  assert.deepEqual(ids(expired.expired), ["GHSA-prod-0001"]);
  const stale = evaluate({ all: report({}), production: report({}), allow: [entry("GHSA-gone-0001", "2026-12-31")], today: "2026-09-30" });
  assert.deepEqual(ids(stale.unused), ["GHSA-gone-0001"]);
});
