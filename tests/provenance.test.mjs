import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { CURRENT_WEEK, currentReadings, readings, weeklyEditorials, weeklyReportIntegration } from "../app/data/readings.ts";
import { originsFor, matchesOrigin, provenanceText, sourceLabels, sourceWorkflows, studyKey, workflowEvidence } from "../app/data/provenance.ts";
import { pagesConfig } from "../scripts/pages-config.mjs";
import { findPrivate } from "../scripts/private-patterns.mjs";
// Messages are read by the scheduled ChatGPT runs; say what to fix and where the rule lives.
const RULES = "規則見 docs/run-instructions.md";
// Written before the receipt format existed (docs/source-workflow.md); provenance links point at these names.
const LEGACY_RECEIPTS = new Set(["2026-09-12-ai.json", "2026-09-12-enterprise.json"]);
const SITE_URL = pagesConfig({}).site;

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
    // The exact receipt or PR URL is checked in "provenance evidence points at a receipt…" below.
    assert.match(p.evidence,/^https:\/\/github\.com\/chinchiang\/WeeklySecurityResearch\//);
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
  assert.deepEqual(pagesConfig({}),{base:"/WeeklySecurityResearch",site:"https://chinchiang.github.io/WeeklySecurityResearch"});
  assert.deepEqual(pagesConfig({GITHUB_REPOSITORY:"team/Renamed"}),{base:"/Renamed",site:"https://team.github.io/Renamed"});
  assert.equal(pagesConfig({GITHUB_REPOSITORY:"team/team.github.io"}).base,"");
  assert.deepEqual(pagesConfig({NEXT_PUBLIC_BASE_PATH:"/preview",NEXT_PUBLIC_SITE_URL:"https://example.com/preview/"}),{base:"/preview",site:"https://example.com/preview"});
});

test("all reading receipts conform to the source-workflow specification schema", () => {
  const receiptFiles = readdirSync("public/reading-runs").filter(f => f.endsWith(".json"));
  assert.ok(receiptFiles.length > 0, "public/reading-runs/ 至少要有一份收據");

  for (const file of receiptFiles) {
    const raw = readFileSync(`public/reading-runs/${file}`, "utf8");
    const r = JSON.parse(raw);

    assert.match(r.report_id, /^AISEC-ARCH-\d{4}-W\d{2}-\d{8}$/, `${file}：report_id「${r.report_id}」格式錯誤，必須是 AISEC-ARCH-<ISO 年>-W<ISO 週>-<週五日期 YYYYMMDD>（例如 AISEC-ARCH-2026-W40-20261002），兩個任務共用，企業任務也不用 ENTSEC 前綴。${RULES}`);
    assert.ok(typeof r.revision === "number" && r.revision >= 1, `${file}：revision 必須是 1 以上的數字，等於寫入後 weeklyEditorials 該週的 revision。${RULES}`);
    assert.ok(typeof r.workflow === "string" && r.workflow.length > 0, `${file}：workflow 不可為空，請填 chatgpt-ai 或 chatgpt-enterprise。${RULES}`);
    assert.ok(
      ["scheduled", "manual_execution_of_saved_instructions"].includes(r.execution_mode),
      `${file}：execution_mode「${r.execution_mode}」無效，只能是 scheduled 或 manual_execution_of_saved_instructions。${RULES}`
    );
    assert.ok(!isNaN(Date.parse(r.checked_at)), `${file}：checked_at「${r.checked_at}」不是可解析的日期，請用 YYYY-MM-DD。${RULES}`);
    assert.ok(Array.isArray(r.added_reading_ids), `${file}：added_reading_ids 必須是陣列，沒有新增時填 []。${RULES}`);
    assert.ok(Array.isArray(r.revised_reading_ids), `${file}：revised_reading_ids 必須是陣列，沒有修改時填 []。${RULES}`);
    assert.ok(typeof r.issue_total === "number" && r.issue_total > 0, `${file}：issue_total 必須是大於 0 的數字（本期列出的總篇數）。${RULES}`);
    assert.ok(typeof r.research_status === "string" && r.research_status.length > 0, `${file}：research_status 不可為空（例如 completed）。${RULES}`);
    assert.ok(typeof r.scheduled_trigger_verified === "boolean", `${file}：scheduled_trigger_verified 必須是 true 或 false，只有取得實際排程觸發證據才可填 true。${RULES}`);
    assert.ok(
      r.input_report_id === null || typeof r.input_report_id === "string",
      `${file}：input_report_id 必須是字串或 null。${RULES}`
    );
    assert.ok(
      r.input_report_modified_at === null || typeof r.input_report_modified_at === "string",
      `${file}：input_report_modified_at 必須是字串或 null。${RULES}`
    );
    assert.ok(
      ["read", "background", "unavailable"].includes(r.input_status),
      `${file}：input_status「${r.input_status}」無效，只能是 read、background 或 unavailable。${RULES}`
    );
    assert.ok(typeof r.input_note === "string", `${file}：input_note 必須是字串，來源不可讀時寫明原因。${RULES}`);
    assert.ok(
      ["pending", "verified", "failed"].includes(r.publication_status),
      `${file}：publication_status「${r.publication_status}」無效，只能是 pending、verified 或 failed。${RULES}`
    );
    assert.ok(
      (typeof r.publication_evidence === "string" && r.publication_evidence.length > 0) ||
      (typeof r.publication_evidence === "object" && r.publication_evidence !== null),
      `${file}：publication_evidence 不可為空，填說明文字或含 PR、CI、部署連結的物件。${RULES}`
    );
    if (LEGACY_RECEIPTS.has(file)) continue;

    // Everything below was introduced after the 2026-09-12 receipts, which keep their original form.
    assert.match(file, /^\d{4}-\d{2}-\d{2}-(ai|enterprise)-[\w-]+\.json$/, `${file}：收據檔名必須是 <執行日期 YYYY-MM-DD>-<ai|enterprise>-<run 識別>.json，例如 2026-10-02-ai-w40.json。${RULES}`);
    assert.equal(`chatgpt-${file.split("-")[3]}`, r.workflow, `${file}：檔名的 ai／enterprise 必須與 workflow（${r.workflow}）一致。${RULES}`);
    for (const field of ["new_research_total", "background_total"]) {
      assert.ok(Number.isInteger(r[field]) && r[field] >= 0, `${file}：${field} 必須是 0 以上的整數，兩者相加等於 added_reading_ids 的篇數。${RULES}`);
    }
    if (r.publication_status === "verified") {
      // verified means the live site was fetched page by page; CI and a successful deployment alone stay pending.
      const checks = r.publication_evidence?.checks;
      assert.ok(Array.isArray(checks) && checks.length > 0, `${file}：publication_status 為 verified 時，publication_evidence.checks 必須列出正式站逐頁 GET 的結果；只有 CI 與部署成功、線上無法讀取時維持 pending。${RULES}`);
      for (const check of checks) {
        assert.ok(typeof check.url === "string" && check.url.startsWith(`${SITE_URL}/`), `${file}：checks 的 url 必須是正式站網址（${SITE_URL}/…），不是 artifact 內的路徑。${RULES}`);
        assert.equal(check.status, 200, `${file}：${check.url} 的 GET 狀態不是 200，不能標 verified。${RULES}`);
      }
    }
  }
});


// Everything a reader or a scheduled run can see: site data and components, every
// public file (reports, receipts, historical social content), docs and the repo guides.
test("public data, docs and every public file carry no private identifiers", () => {
  const walk = (dir) => readdirSync(dir, { withFileTypes: true })
    .flatMap((e) => e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]);
  const files = [...walk("app"), ...walk("public"), ...walk("docs"), "README.md", "CLAUDE.md", "AGENTS.md"]
    .filter((file) => /\.(?:tsx?|mjs|css|html|json|md|txt|xml|svg)$/.test(file));
  assert.ok(files.some((file) => file.includes("social-content")), "scan must cover public/social-content");
  for (const file of files) {
    const text = readFileSync(file, "utf8");
    assert.equal(findPrivate(text), null, file);
  }
});

test("private-name matching ignores case and finds CJK names without word boundaries", () => {
  const sha256 = (text) => createHash("sha256").update(text).digest("hex");
  const nameHashes = new Set([sha256("alice")]);
  const cjkNameHashes = new Set([sha256("王小明")]);
  for (const text of ["Alice", "ALICE", "by alice."]) assert.equal(findPrivate(text, { nameHashes }), "private name", text);
  assert.equal(findPrivate("Malice", { nameHashes }), null);
  assert.equal(findPrivate("本週由王小明整理", { cjkNameHashes }), "private name");
  assert.equal(findPrivate("本週由王小整理", { cjkNameHashes }), null);
  for (const text of ["work-12", "https://DRIVE.google.com/x", "https://drive.usercontent.google.com/download?id=1",
    "https://sites.google.com/view/x", "https://mail.google.com/mail/u/0", "https://forms.gle/abc"]) {
    assert.notEqual(findPrivate(text), null, text);
  }
});

// Receipts and readings are written by different runs; keep the two sides pointing at each other.
const RECEIPT_URL = /^https:\/\/github\.com\/chinchiang\/WeeklySecurityResearch\/blob\/main\/public\/reading-runs\/([\w.-]+\.json)$/;
const PR_URL = /^https:\/\/github\.com\/chinchiang\/WeeklySecurityResearch\/pull\/\d+$/;
const receipts = Object.fromEntries(readdirSync("public/reading-runs").filter(f => f.endsWith(".json"))
  .map(f => [f, JSON.parse(readFileSync(`public/reading-runs/${f}`, "utf8"))]));
// 2026-09-12 receipts predate the id format and name the workflow by its title.
const workflowId = name => sourceWorkflows.find(f => f.id === name || f.title.endsWith(`｜${name}`))?.id;
const isoWeek = week => {
  const d = new Date(`${week.replaceAll(".", "-")}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  return `${d.getUTCFullYear()}-W${String(Math.ceil(((d - Date.UTC(d.getUTCFullYear(), 0, 1)) / 86400000 + 1) / 7)).padStart(2, "0")}`;
};

test("receipts only list existing readings of one week and match its report ID", () => {
  const added = new Map();
  const revisions = new Map();
  for (const [file, r] of Object.entries(receipts)) {
    const flow = workflowId(r.workflow);
    assert.ok(["chatgpt-ai", "chatgpt-enterprise"].includes(flow), `${file}：workflow「${r.workflow}」無法辨識，請填 chatgpt-ai 或 chatgpt-enterprise。${RULES}`);
    const listed = [...r.added_reading_ids, ...r.revised_reading_ids].map(id => readings.find(x => x.id === id));
    assert.ok(listed.every(Boolean), `${file}：added_reading_ids／revised_reading_ids 列了不存在的讀物 ID。${RULES}`);
    const weeks = new Set(listed.map(x => x.week));
    assert.ok(weeks.size <= 1, `${file}：列出的讀物分屬多個週次（${[...weeks]}），一份收據只能對應一週。${RULES}`);
    for (const id of r.added_reading_ids) {
      assert.ok(!added.has(id), `#${id} 同時被 ${added.get(id)} 與 ${file} 列為新增；已發布的讀物再次修改請列在 revised_reading_ids。${RULES}`);
      added.set(id, file);
      assert.equal(readings.find(x => x.id === id).provenance?.reviewedBy, flow, `${file}：#${id} 的 provenance.reviewedBy 必須等於收據的 workflow（${flow}）。${RULES}`);
    }
    if (r.new_research_total !== undefined) {
      assert.equal(r.new_research_total + r.background_total, r.added_reading_ids.length, `${file}：new_research_total（${r.new_research_total}）加 background_total（${r.background_total}）必須等於 added_reading_ids 的篇數（${r.added_reading_ids.length}）。${RULES}`);
    }
    const [week] = weeks;
    if (!week) continue;
    // Both workflows of a week share the week's report ID and bump its revision.
    assert.equal(r.report_id, `AISEC-ARCH-${isoWeek(week)}-${week.replaceAll(".", "")}`, `${file}：report_id 必須用該週週五日期（week ${week}），同週兩個任務共用，不可用執行日期。${RULES}`);
    const revision = `${r.report_id} r${r.revision}`;
    assert.ok(!revisions.has(revision), `${file}：${revision} 已被 ${revisions.get(revision)} 使用；後寫入的任務請把 editorial 與收據的 revision 加 1。${RULES}`);
    revisions.set(revision, file);
    const weekTotal = readings.filter(x => x.week === week).length;
    assert.ok(r.issue_total >= r.added_reading_ids.length && r.issue_total <= weekTotal, `${file}：issue_total（${r.issue_total}）必須介於新增篇數（${r.added_reading_ids.length}）與該週總篇數（${weekTotal}）之間。${RULES}`);
  }
});

test("provenance evidence points at a receipt that lists the reading, or at a repo PR", () => {
  for (const x of readings.filter(x => x.provenance)) {
    const { evidence, reviewedBy, checkedAt, inputReportId } = x.provenance;
    if (PR_URL.test(evidence)) continue;
    const file = evidence.match(RECEIPT_URL)?.[1];
    assert.ok(file, `#${x.id}：provenance.evidence 必須是 https://github.com/chinchiang/WeeklySecurityResearch/blob/main/public/reading-runs/<收據檔名> 或本 repo 的 PR 網址，目前是 ${evidence}。${RULES}`);
    const r = receipts[file];
    assert.ok(r, `#${x.id}：provenance.evidence 指向的收據 public/reading-runs/${file} 不存在，請確認檔名或一併提交收據。${RULES}`);
    assert.ok([...r.added_reading_ids, ...r.revised_reading_ids].includes(x.id), `#${x.id}：收據 ${file} 的 added_reading_ids／revised_reading_ids 沒有列出這篇。${RULES}`);
    assert.equal(workflowId(r.workflow), reviewedBy, `#${x.id}：provenance.reviewedBy 必須等於收據 ${file} 的 workflow。${RULES}`);
    assert.equal(checkedAt, r.checked_at.slice(0, 10), `#${x.id}：provenance.checkedAt 必須等於收據 ${file} 的 checked_at 日期。${RULES}`);
    if (inputReportId) assert.equal(inputReportId, r.input_report_id, `#${x.id}：provenance.inputReportId 必須等於收據 ${file} 的 input_report_id。${RULES}`);
  }
});

test("homepage workflow evidence is derived from the current week, not hard-coded", () => {
  const currentReceipts = new Set(currentReadings.map(r => r.provenance?.evidence.match(RECEIPT_URL)?.[1]).filter(Boolean));
  for (const flow of sourceWorkflows) {
    assert.equal("evidence" in flow, false, `sourceWorkflows.${flow.id} 不可再寫死 evidence；本期證據由 workflowEvidence() 從讀物與整合紀錄推導。`);
    const text = workflowEvidence(flow.id, CURRENT_WEEK, currentReadings, weeklyReportIntegration);
    assert.ok(text.includes(CURRENT_WEEK), `${flow.id}：來源分工證據沒有指向本期 ${CURRENT_WEEK}：${text}`);
    for (const file of Object.keys(receipts)) {
      if (text.includes(file)) assert.ok(currentReceipts.has(file), `${flow.id}：來源分工證據引用了非本期的收據 ${file}。`);
    }
  }
});

test("each week's editorial revision accounts for its latest receipt", () => {
  const latest = new Map();
  for (const [file, r] of Object.entries(receipts)) {
    const week = readings.find(x => [...r.added_reading_ids, ...r.revised_reading_ids].includes(x.id))?.week;
    if (week && (latest.get(week)?.revision ?? 0) < r.revision) latest.set(week, { file, revision: r.revision });
  }
  for (const [week, { file, revision }] of latest) {
    const editorial = weeklyEditorials[week];
    assert.ok(editorial?.revision, `${week}：有收據 ${file}，但 weeklyEditorials["${week}"] 沒有 revision。${RULES}`);
    assert.ok(editorial.revision >= revision, `${week}：收據 ${file} 是 r${revision}，但 weeklyEditorials["${week}"].revision 只有 ${editorial.revision}；寫入收據時要一起把 editorial 的 revision 加到相同值。${RULES}`);
    // Revisions without a research run (a rename, marking a workflow as missing) have no receipt; the week must say why.
    if (editorial.revision > revision) {
      assert.ok(editorial.presentationNote, `${week}：editorial 是 r${editorial.revision}，最新收據 ${file} 只到 r${revision}；沒有研究收據的修訂必須在 presentationNote 說明原因。${RULES}`);
    }
  }
});
