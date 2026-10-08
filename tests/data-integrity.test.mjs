import assert from "node:assert/strict";
import test from "node:test";
import {
  ARCHITECTURE_TOPICS,
  CURRENT_WEEK,
  LEGACY_TOPICS,
  TOPICS,
  archiveReadings,
  archiveTopicFilters,
  currentArchitectureReading,
  currentTopicFilters,
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
  topicFiltersFor,
  weeklyEditorials,
  weightedScore,
} from "../app/data/readings.ts";
// Messages are read by the scheduled ChatGPT runs; say what to fix and where the rule lives.
const RULES = "規則見 docs/run-instructions.md";

const decisions = new Set(["深入審閱", "選讀"]);
// Rules added on 2026-10-08 apply from week 41 on; published weeks keep what they had.
const STRICT_FROM = "2026.10.09";
const strictReadings = readings.filter((reading) => reading.week >= STRICT_FROM);
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

// CURRENT_WEEK, report file names and the week URLs all sort and slice these strings,
// so a malformed week would silently pick the wrong current issue.
test("weeks are Fridays written YYYY.MM.DD and dates match dateValue", () => {
  assert.ok(readings.length > 0, "readings 不可為空：首頁、feed 與報告都假設至少有一期");
  for (const reading of readings) {
    assert.match(reading.week, /^\d{4}\.\d{2}\.\d{2}$/, `#${reading.id}：week「${reading.week}」必須是 YYYY.MM.DD。${RULES}`);
    const friday = new Date(`${reading.week.replaceAll(".", "-")}T00:00:00Z`);
    assert.equal(friday.getUTCDay(), 5, `#${reading.id}：week「${reading.week}」必須是該週週五的日期，不是執行日期。${RULES}`);
    assert.match(reading.dateValue, /^\d{4}-\d{2}-\d{2}$/, `#${reading.id}：dateValue「${reading.dateValue}」必須是 YYYY-MM-DD。`);
    assert.ok(!Number.isNaN(Date.parse(`${reading.dateValue}T00:00:00Z`)), `#${reading.id}：dateValue「${reading.dateValue}」不是有效日期。`);
    // date may append a version label, e.g. "2026.09.29 · v1".
    assert.ok(reading.date.startsWith(reading.dateValue.replaceAll("-", ".")), `#${reading.id}：date「${reading.date}」必須以 dateValue 的同一天開頭。`);
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

test("every reading uses topics from the shared vocabulary", () => {
  assert.equal(new Set(TOPICS).size, TOPICS.length, "duplicate topic in vocabulary");
  for (const r of readings) {
    assert.ok(r.topics.length > 0, `#${r.id}：topics 不可為空。${RULES}`);
    assert.equal(new Set(r.topics).size, r.topics.length, `#${r.id}：topics 有重複的標籤。${RULES}`);
    for (const t of r.topics) assert.ok(TOPICS.includes(t), `#${r.id}：標籤「${t}」不在 app/data/readings.ts 的 TOPICS；請改用詞彙表中的拼法，確實是新主題才加進 TOPICS。${RULES}`);
  }
  for (const t of TOPICS) assert.ok(readings.some(r => r.topics.includes(t)), `TOPICS 中的「${t}」沒有任何讀物使用；新增標籤時要同時用在讀物上。${RULES}`);
});

test("new readings use the preferred topic instead of a legacy synonym", () => {
  for (const [legacy, preferred] of Object.entries(LEGACY_TOPICS)) {
    assert.ok(TOPICS.includes(legacy), `LEGACY_TOPICS 的「${legacy}」不在 TOPICS。`);
    for (const t of preferred) assert.ok(TOPICS.includes(t) && !(t in LEGACY_TOPICS), `「${legacy}」的替代標籤「${t}」必須是 TOPICS 中的現行標籤。`);
  }
  for (const r of strictReadings) {
    for (const t of r.topics) {
      assert.ok(!(t in LEGACY_TOPICS), `#${r.id}：「${t}」是只保留給舊讀物的近義標籤，請改用 ${LEGACY_TOPICS[t]?.join("、")}。${RULES}`);
    }
  }
});

// Readings from W38 on already carry the version; new ones must keep doing so, since a later vN is a revision.
test("new arXiv readings state the version they were read at", () => {
  for (const r of strictReadings.filter((x) => /arxiv\.org\//.test(x.source))) {
    assert.match(r.date, / · v\d+$/, `#${r.id}：arXiv 讀物的 date 必須標出閱讀的版本，例如「2026.10.06 · v1」。${RULES}`);
  }
});

test("selection funnels are consistent, or say why the counts were not kept", () => {
  for (const [week, e] of Object.entries(weeklyEditorials)) {
    const selected = readings.filter((r) => r.week === week).length;
    if (e.scanned !== null && e.shortlisted !== null) {
      assert.ok(e.scanned >= e.shortlisted && e.shortlisted >= selected, `${week}：入選漏斗必須是 scanned（${e.scanned}）≥ shortlisted（${e.shortlisted}）≥ 入選篇數（${selected}）。${RULES}`);
    } else if (week >= STRICT_FROM) {
      // Unknown counts stay null rather than being estimated, but the week must say so.
      assert.match(e.reportSkipNote ?? "", /scanned|shortlisted|掃描|初篩/, `${week}：scanned／shortlisted 未填時，reportSkipNote 必須說明為什麼沒有留存（不要推估數字）。${RULES}`);
    }
  }
});

test("topic filters only offer topics that return readings on that page", () => {
  for (const [filters, list] of [[currentTopicFilters, currentReadings], [archiveTopicFilters, archiveReadings]]) {
    assert.equal(filters[0], "全部");
    for (const t of filters.slice(1)) assert.ok(list.filter(r => r.topics.includes(t)).length >= 2, t);
  }
  const sample = [{ topics: ["Evaluation", "RAG"] }, { topics: ["Evaluation", "RAG"] }, { topics: ["Evaluation"] }, { topics: ["MCP"] }];
  assert.deepEqual(topicFiltersFor(sample), ["全部", "Evaluation", "RAG"]);
});

test("architecture spotlight opens a current-week architecture reading, or is hidden", () => {
  for (const t of ARCHITECTURE_TOPICS) assert.ok(TOPICS.includes(t), `ARCHITECTURE_TOPICS 的「${t}」不在 TOPICS。`);
  const candidates = currentReadings.filter(r => r.topics.some(t => ARCHITECTURE_TOPICS.includes(t)));
  if (candidates.length === 0) {
    assert.equal(currentArchitectureReading, undefined);
    return;
  }
  assert.equal(currentArchitectureReading?.week, CURRENT_WEEK);
  assert.equal(currentArchitectureReading?.rank, Math.min(...candidates.map(r => r.rank)));
});
