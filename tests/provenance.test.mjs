import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { readings } from "../app/data/readings.ts";
import { originsFor, matchesOrigin, provenanceText, sourceLabels, studyKey } from "../app/data/provenance.ts";
import { pagesConfig } from "../scripts/pages-config.mjs";

test("known import provenance matches research receipts, not article topics", () => {
  for (const flow of ["ai", "enterprise"]) {
    const receipt = JSON.parse(readFileSync(`public/reading-runs/2026-09-12-${flow}.json`, "utf8"));
    for (const id of receipt.added_reading_ids) {
      const r = readings.find(r => r.id === id);
      assert.equal(r.provenance.reviewedBy, `chatgpt-${flow}`);
      assert.deepEqual(originsFor(r), [`chatgpt-${flow}`]);
    }
    assert.equal(receipt.scheduled_trigger_verified, false);
  }
  const legacy = readings.find(r => r.id === 64);
  assert.deepEqual(originsFor(legacy), ["legacy-unknown"]);
  assert.equal(matchesOrigin(legacy, "claude-report"), false);
  assert.ok(provenanceText(legacy).includes("待確認"));
});
test("cross-source filtering retains one article and unknown remains distinct", () => {
  const r = {...readings[0], provenance:{...readings[0].provenance,origins:["claude-report", "chatgpt-enterprise"],inputReportId:"EXAMPLE-W38"}};
  assert.equal([r].filter(r=>matchesOrigin(r,"claude-report")).length, 1);
  assert.equal(matchesOrigin(r,"chatgpt-enterprise"),true);
  assert.equal(matchesOrigin(r,"legacy-unknown"),false);
  assert.equal(matchesOrigin(r,"all"),true);
});
test("new readings require attributable provenance; all supplied records are valid", () => {
  for (const r of readings) {
    if (r.id > 73) assert.ok(r.provenance, `${r.id}: new reading missing provenance`);
    const p = r.provenance;
    if (!p) continue;
    assert.ok(p.origins.length > 0);
    assert.equal(new Set(p.origins).size,p.origins.length);
    for (const origin of p.origins) assert.ok(origin in sourceLabels && origin !== "legacy-unknown");
    assert.ok(["chatgpt-ai","chatgpt-enterprise"].includes(p.reviewedBy));
    assert.match(p.checkedAt,/^\d{4}-\d{2}-\d{2}$/);
    assert.match(p.evidence,/^https:\/\/github.com\/chinchiang\/WeeklySecurityReaseach\//);
    if (p.origins.includes("claude-report")) assert.ok(p.inputReportId);
  }
});
test("study identity collapses arXiv versions, PDFs and DOI case", () => {
  assert.equal(studyKey("https://arxiv.org/pdf/2609.07783v2.pdf"),studyKey("https://arxiv.org/abs/2609.07783v1"));
  assert.equal(studyKey("https://doi.org/10.1000/ABC"),studyKey("https://dx.doi.org/10.1000/abc"));
  assert.equal(studyKey("https://example.com/a?utm_source=x#section"),"https://example.com/a");
  const keys = readings.map(r=>`${r.week}:${studyKey(r.source)}`);
  assert.equal(new Set(keys).size,keys.length,"one study per issue");
});
test("Pages paths follow repo rename and explicit local configuration", () => {
  assert.deepEqual(pagesConfig({}),{base:"/WeeklySecurityReaseach",site:"https://chinchiang.github.io/WeeklySecurityReaseach"});
  assert.deepEqual(pagesConfig({GITHUB_REPOSITORY:"team/Renamed"}),{base:"/Renamed",site:"https://team.github.io/Renamed"});
  assert.equal(pagesConfig({GITHUB_REPOSITORY:"team/team.github.io"}).base,"");
  assert.deepEqual(pagesConfig({NEXT_PUBLIC_BASE_PATH:"/preview",NEXT_PUBLIC_SITE_URL:"https://example.com/preview/"}),{base:"/preview",site:"https://example.com/preview"});
});
