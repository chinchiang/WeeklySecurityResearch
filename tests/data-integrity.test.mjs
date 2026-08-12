import assert from "node:assert/strict";
import test from "node:test";
import {
  CURRENT_WEEK,
  DEEP_REVIEW_THRESHOLD,
  RUBRIC_WEIGHTS,
  correctionLog,
  currentReadings,
  currentStats,
  deriveDecision,
  editorialFor,
  editorialMethod,
  evidenceOrder,
  hasCorrections,
  isRetracted,
  readings,
  weeklyEditorials,
  weightedScore,
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

test("rubric weights sum to one and every axis is published", () => {
  const total = RUBRIC_WEIGHTS.evidence + RUBRIC_WEIGHTS.relevance + RUBRIC_WEIGHTS.actionability;
  assert.equal(Math.round(total * 100) / 100, 1);

  assert.deepEqual(
    editorialMethod.rubric.map((axis) => axis.key),
    ["evidence", "relevance", "actionability"],
  );
  for (const axis of editorialMethod.rubric) {
    assert.equal(axis.weight, `${Math.round(RUBRIC_WEIGHTS[axis.key] * 100)}%`, axis.axis);
  }
});

test("every reading scores 1-3 on each axis", () => {
  for (const reading of readings) {
    for (const axis of ["evidence", "relevance", "actionability"]) {
      const score = reading.scores?.[axis];
      assert.ok([1, 2, 3].includes(score), `${reading.id}: ${axis} 必須是 1、2 或 3，實際為 ${score}`);
    }
  }
});

// The published decision must stay reproducible from the published scores.
// Editing scores without meaning to reclassify a reading fails here, which
// forces a decision change to be a deliberate edit rather than a side effect.
test("stored decisions are reproducible from the rubric scores", () => {
  for (const reading of readings) {
    assert.equal(
      deriveDecision(reading.scores),
      reading.decision,
      `${reading.id} ${reading.title}: 分數 ${JSON.stringify(reading.scores)} 推導為 ${deriveDecision(reading.scores)}，但資料記為 ${reading.decision}`,
    );
  }
});

test("the decision threshold behaves as documented", () => {
  assert.equal(weightedScore({ evidence: 3, relevance: 3, actionability: 3 }), 3);
  assert.equal(weightedScore({ evidence: 1, relevance: 1, actionability: 1 }), 1);
  assert.equal(weightedScore({ evidence: 2, relevance: 3, actionability: 3 }), 2.65);

  assert.equal(deriveDecision({ evidence: 2, relevance: 3, actionability: 3 }), "深入審閱");
  assert.equal(deriveDecision({ evidence: 2, relevance: 3, actionability: 2 }), "選讀");
  // A single failing axis blocks 深入審閱 even when the weighted score clears
  // the threshold on the strength of the other two.
  assert.ok(weightedScore({ evidence: 1, relevance: 3, actionability: 3 }) < DEEP_REVIEW_THRESHOLD);
  assert.equal(deriveDecision({ evidence: 1, relevance: 3, actionability: 3 }), "選讀");
  assert.equal(deriveDecision({ evidence: 3, relevance: 3, actionability: 1 }), "選讀");
});

test("every week keeps its own editorial record", () => {
  for (const week of new Set(readings.map((reading) => reading.week))) {
    const record = editorialFor(week);
    assert.equal(record.week, week);
    assert.equal(record.selected, readings.filter((reading) => reading.week === week).length, week);
    assert.ok(record.note.trim().length > 0, `${week}: 缺少漏斗說明`);
    assert.ok(Array.isArray(record.skipped), `${week}: skipped 必須是陣列`);
    for (const skipped of record.skipped) {
      assert.equal(new URL(skipped.source).protocol, "https:", `${week}: 略過項目來源必須是 HTTPS`);
    }
  }
  // Adding a week must not overwrite an earlier week's funnel.
  assert.ok(Object.keys(weeklyEditorials).length >= new Set(readings.map((reading) => reading.week)).size);
});

test("corrections keep retracted readings visible but out of the action list", () => {
  for (const reading of readings) {
    for (const correction of reading.corrections ?? []) {
      assert.ok(["更正", "撤稿", "取代"].includes(correction.type), `${reading.id}: 未知的修訂類型`);
      assert.match(correction.date, /^\d{4}\.\d{2}\.\d{2}$/, `${reading.id}: 修訂日期格式`);
      assert.ok(correction.note.trim().length > 0, `${reading.id}: 修訂說明不得為空`);
      if (correction.source) assert.equal(new URL(correction.source).protocol, "https:", `${reading.id}: 修訂來源必須是 HTTPS`);
      if (correction.type === "取代") {
        assert.ok(
          readings.some((other) => other.id === correction.supersededBy),
          `${reading.id}: supersededBy 必須指向存在的 reading`,
        );
      }
    }
    assert.equal(hasCorrections(reading), (reading.corrections ?? []).length > 0);
  }

  assert.equal(correctionLog.length, readings.reduce((total, reading) => total + (reading.corrections ?? []).length, 0));
  // Newest first.
  const dates = correctionLog.map((entry) => entry.correction.date);
  assert.deepEqual(dates, [...dates].sort((a, b) => b.localeCompare(a)));

  const retracted = { ...readings[0], corrections: [{ date: "2026.08.12", type: "撤稿", note: "測試用" }] };
  assert.equal(isRetracted(retracted), true);
  assert.equal(isRetracted(readings[0]), (readings[0].corrections ?? []).some((c) => c.type === "撤稿"));
});
