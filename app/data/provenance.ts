import type { Reading, WeeklyReportIntegration } from "./readings";

export const sourceLabels = {
  "claude-report": "Claude 週報供稿",
  "chatgpt-ai": "ChatGPT AI 研究",
  "chatgpt-enterprise": "ChatGPT 企業資安研究",
  "legacy-unknown": "歷史來源待確認",
} as const;
export type ContentSource = keyof typeof sourceLabels;
export type ResearchWorkflow = "chatgpt-ai" | "chatgpt-enterprise";
export type Provenance = {
  origins: ContentSource[];
  reviewedBy: ResearchWorkflow;
  checkedAt: string;
  evidence: string;
  inputReportId?: string;
};

export function originsFor(reading: Reading): ContentSource[] {
  return reading.provenance?.origins ?? ["legacy-unknown"];
}
export function matchesOrigin(reading: Reading, origin: string) {
  return origin === "all" || originsFor(reading).some(value => value === origin);
}
export function provenanceText(reading: Reading) {
  const origins = originsFor(reading).map(id => sourceLabels[id]).join("、");
  const p = reading.provenance;
  return p ? `供稿／發現：${origins}；查核：${sourceLabels[p.reviewedBy]}；查核日期：${p.checkedAt}${p.inputReportId ? `；輸入報告：${p.inputReportId}` : ""}` : "歷史來源待確認；未以文章主題推定產製平台。";
}

// Schedule intent is distinct from proof of a completed run.
export const sourceWorkflows = [
  { id: "claude-report", title: "Claude｜製造業資安觀測週報", schedule: "週二 15:00 · 臺北", role: "AI Security＋企業資安架構／產品安全兩部分各自選件、排序。Google Doc 歸檔於 Weekly Security Reports，PDF 在 Claude 對話交付。", handoff: "提供候選與分析 → 週五／週六依主題接手查核", caveat: "文件存在不等同排程觸發證明。" },
  { id: "chatgpt-ai", title: "ChatGPT｜AI Security 技術研究簡報", schedule: "週五 08:00 · 臺北", role: "讀取 Claude 週報第一部分，查核原始研究並補充本週新證據；負責模型、Agent、AI 平台、AI 資料／IP 與評估方法。", handoff: "查核與去重 → AI 主題網站更新", caveat: "未取得可公開的排程觸發稽核證據，不標到點觸發已驗證。" },
  { id: "chatgpt-enterprise", title: "ChatGPT｜企業資安綜合閱讀清單", schedule: "週六 01:00 · 臺北", role: "讀取 Claude 週報第二部分，查核並補充企業架構、OT／ICS、產品安全、非 AI 專屬資料保護、AppSec、供應鏈與治理。", handoff: "查核與去重 → 企業資安主題網站更新", caveat: "scheduled execution_mode 不等於取得獨立觸發稽核證據。" },
] as const;
export type SourceWorkflowId = (typeof sourceWorkflows)[number]["id"];

/**
 * 首頁「來源分工」的本期證據由該週資料推導，不寫死週次：
 * Claude 週報看該週整合紀錄，兩個 ChatGPT 流程看該週由它查核的讀物與收據。
 */
export function workflowEvidence(id: SourceWorkflowId, week: string, weekReadings: readonly Reading[], integration: WeeklyReportIntegration | undefined) {
  if (id === "claude-report") {
    return integration
      ? `${week} 期整合 ${integration.title}；來源修改時間 ${integration.modifiedAt}。`
      : `${week} 期沒有 Claude 週報整合紀錄。`;
  }
  const checked = weekReadings.filter(reading => reading.provenance?.reviewedBy === id);
  if (checked.length === 0) return `${week} 期沒有由此流程查核新增的讀物。`;
  const checkedAt = checked.map(reading => reading.provenance!.checkedAt).sort().at(-1);
  const receipts = [...new Set(checked.map(reading => reading.provenance!.evidence.match(/\/(public\/reading-runs\/[\w.-]+\.json)$/)?.[1]).filter(Boolean))];
  return `${checkedAt} 完成 ${week} 期查核，收錄 ${checked.length} 篇${receipts.length > 0 ? `；研究／發布分開記錄於 ${receipts.join("、")}` : ""}。`;
}

/** Versions are revisions of one study, not additional recommendations. */
export function studyKey(url: string) {
  const u = new URL(url);
  const arxiv = u.hostname.endsWith("arxiv.org") && u.pathname.match(/^\/(?:abs|pdf|html)\/(.+?)(?:v\d+)?(?:\.pdf)?$/);
  if (arxiv) return `arxiv:${arxiv[1].toLowerCase()}`;
  if (["doi.org", "dx.doi.org"].includes(u.hostname)) return `doi:${decodeURIComponent(u.pathname.slice(1)).toLowerCase()}`;
  for (const key of [...u.searchParams.keys()]) if (/^utm_|^(fbclid|gclid)$/.test(key)) u.searchParams.delete(key);
  u.hash = "";
  return u.href.replace(/\/$/, "");
}
