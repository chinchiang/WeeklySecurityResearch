/**
 * 評鑑規則與只依單筆讀物計算的工具函式，不含任何讀物資料。
 * 互動元件（"use client"）只從這裡引用，避免把整份 readings.ts 打包進每一頁的 JavaScript；
 * readings.ts 會原樣轉出這些名稱，測試與腳本可以照舊從 readings.ts 引用。
 */
import type { EvidenceLevel, Reading, RubricScores } from "./readings";

export const evidenceOrder: Record<EvidenceLevel, number> = {
  "同儕審查": 5,
  "已接受": 4,
  "政策報告": 4,
  "Preprint": 2,
  "廠商遙測": 1,
};

export const RUBRIC_WEIGHTS = {
  evidence: 0.35,
  relevance: 0.35,
  actionability: 0.3,
} as const;

/** 加權總分達此門檻且無任一軸為 1 者列為深入審閱。 */
export const DEEP_REVIEW_THRESHOLD = 2.4;

/** 加權總分，範圍 1.00–3.00，四捨五入至小數兩位。 */
export function weightedScore(scores: RubricScores): number {
  const total =
    scores.evidence * RUBRIC_WEIGHTS.evidence +
    scores.relevance * RUBRIC_WEIGHTS.relevance +
    scores.actionability * RUBRIC_WEIGHTS.actionability;
  return Math.round(total * 100) / 100;
}

/**
 * 由三軸分數推導判定。資料中仍保留 decision 欄位作為編輯當下的紀錄，
 * 並以測試確保兩者一致；若日後調整分數而未同步判定，測試會失敗，
 * 迫使判定的改變成為明確決定而不是副作用。
 */
export function deriveDecision(scores: RubricScores): Reading["decision"] {
  const axes = [scores.evidence, scores.relevance, scores.actionability];
  if (axes.includes(1)) return "選讀";
  return weightedScore(scores) >= DEEP_REVIEW_THRESHOLD ? "深入審閱" : "選讀";
}

export function isRetracted(reading: Reading): boolean {
  return (reading.corrections ?? []).some((correction) => correction.type === "撤稿");
}

export function hasCorrections(reading: Reading): boolean {
  return (reading.corrections ?? []).length > 0;
}

export const editorialMethod = {
  scoreScale: "每軸 1–3 分：1 = 明顯不足，2 = 部分達成，3 = 完整達成。",
  rubric: [
    { axis: "證據等級", key: "evidence" as const, weight: "35%", deep: "原始研究、已接受／同儕審查，或方法透明的權威政策研究", selective: "Preprint 或廠商遙測，但限制清楚且可交叉核實" },
    { axis: "製造業關聯", key: "relevance" as const, weight: "35%", deep: "可直接映射 IP、BOM、PLM、ERP、韌體、OT 或跨境治理", selective: "方向相關，但需大量情境轉譯或企業重測" },
    { axis: "行動可落地性", key: "actionability" as const, weight: "30%", deep: "可轉換為 threat model、控制、驗收或偵測測試", selective: "主要用於趨勢理解或治理背景" },
  ],
  decisionRule: `加權總分 = 證據等級×0.35 ＋ 製造業關聯×0.35 ＋ 行動可落地性×0.30。總分達 ${DEEP_REVIEW_THRESHOLD.toFixed(2)} 且無任一軸為 1 分者列為深入審閱，其餘列為選讀。每一筆的三軸分數與總分都公開於卡片與詳細頁，可逐項覆核。`,
  rankingRule: "同一週先依製造業風險急迫性與可採取行動程度排序，再以證據等級、交叉核實完整度及發布日期作為同分決勝。",
  correctionRule: "已發佈項目不刪除。原始研究撤稿、數值更正或被後續研究取代時，於該筆加註修訂紀錄並在卡片與詳細頁顯示；撤稿項目不再進入「建議下一步」。",
  verifiedChecklist: ["原始連結可識別且使用 HTTPS", "作者／機構與發布日期已對照原始頁面", "摘要中的關鍵數字可回溯原文", "限制、樣本與不可外推範圍已揭露", "重要主張至少以獨立研究或權威框架交叉判讀"],
  sourceScope: ["arXiv 與已接受／同儕審查論文", "政府與權威政策研究", "具方法揭露的安全研究團隊報告", "製造業 AI Security、企業架構、OT／ICS、產品安全與資料保護主題來源"],
} as const;

export function readingSearchText(reading: Reading) {
  return [reading.title, reading.subtitle, reading.authors, reading.summary, reading.relevance, reading.action, reading.metric ?? "", ...reading.findings, ...reading.topics].join(" ").toLowerCase();
}
