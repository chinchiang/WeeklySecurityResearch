import assert from "node:assert/strict";
import test from "node:test";
import {
  CURRENT_WEEK,
  currentReadings,
  currentStats,
  evidenceOrder,
  readings,
} from "../app/data/readings.ts";

const decisions = new Set(["深入審閱", "選讀"]);
const kinds = new Set(["學術論文", "政策研究", "產業報告"]);
const batches = new Set(["本週新發", "補遺"]);
const requiredText = ["week", "title", "subtitle", "date", "dateValue", "authors", "source", "sourceLabel", "decision", "kind", "summary", "relevance", "action", "caveat", "evidenceLevel"];

test("reading ids are unique and required fields are complete", () => {
  assert.equal(new Set(readings.map((reading) => reading.id)).size, readings.length);
  for (const reading of readings) {
    for (const field of requiredText) assert.equal(typeof reading[field], "string", `${reading.id}: ${field}`);
    for (const field of requiredText) assert.ok(reading[field].trim().length > 0, `${reading.id}: ${field} is blank`);
    assert.ok(Number.isInteger(reading.rank) && reading.rank > 0, `${reading.id}: rank`);
    assert.ok(Array.isArray(reading.findings) && reading.findings.length > 0, `${reading.id}: findings`);
    assert.ok(Array.isArray(reading.topics) && reading.topics.length > 0, `${reading.id}: topics`);
    assert.ok(decisions.has(reading.decision), `${reading.id}: decision`);
    assert.ok(kinds.has(reading.kind), `${reading.id}: kind`);
    assert.ok(batches.has(reading.batch), `${reading.id}: batch`);
    assert.ok(reading.evidenceLevel in evidenceOrder, `${reading.id}: evidenceLevel`);
    assert.equal(new URL(reading.source).protocol, "https:", `${reading.id}: source must be HTTPS`);
    if (reading.pdf) assert.equal(new URL(reading.pdf).protocol, "https:", `${reading.id}: pdf must be HTTPS`);
  }
});

test("ranks are unique and contiguous within every week", () => {
  for (const week of new Set(readings.map((reading) => reading.week))) {
    const ranks = readings.filter((reading) => reading.week === week).map((reading) => reading.rank).sort((a, b) => a - b);
    assert.deepEqual(ranks, Array.from({ length: ranks.length }, (_, index) => index + 1), week);
  }
});

test("current week and KPI values are derived from the data", () => {
  assert.equal(CURRENT_WEEK, [...new Set(readings.map((reading) => reading.week))].sort().at(-1));
  assert.equal(currentStats.total, currentReadings.length);
  assert.equal(currentStats.deep, currentReadings.filter((reading) => reading.decision === "深入審閱").length);
  assert.equal(currentStats.selective, currentReadings.filter((reading) => reading.decision === "選讀").length);
  assert.equal(currentStats.total, currentStats.deep + currentStats.selective);
});
