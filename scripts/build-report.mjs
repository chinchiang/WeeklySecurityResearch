import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { CURRENT_WEEK, currentReadings, currentEditorial, currentStats, weeklyReportIntegration } from "../app/data/readings.ts";

const esc = (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const linked = (value) => esc(value).replace(/https:\/\/[^\s；。<]+/g, (url) => `<a href="${url}" rel="noreferrer">${url}</a>`);
const slug = CURRENT_WEEK.replaceAll(".", "-");
const date = new Date(`${slug}T00:00:00Z`);
const thursday = new Date(date);
thursday.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
const isoYear = thursday.getUTCFullYear();
const isoWeek = Math.ceil((((thursday - new Date(Date.UTC(isoYear, 0, 1))) / 86400000) + 1) / 7);
const reportId = `AISEC-ARCH-${isoYear}-W${String(isoWeek).padStart(2, "0")}-${slug.replaceAll("-", "")}`;
const revision = slug === "2026-09-11" ? 2 : 1;
const verifiedAt = slug === "2026-09-11" ? "2026-09-12" : slug;
const css = readFileSync("app/globals.css", "utf8").replace('@import "tailwindcss";', "");
const list = (items) => `<ul>${items.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>`;
const cards = [...currentReadings].sort((a, b) => a.rank - b.rank).map((r) => `<article class="reading-card" id="reading-${r.id}">
  <div class="card-topline"><span class="card-rank">#${r.rank}</span><span class="decision ${r.decision === "深入審閱" ? "deep" : "select"}">${esc(r.decision)}</span></div>
  <h3>${esc(r.title)}</h3><p class="card-subtitle">${esc(r.subtitle)}</p>
  <p class="card-kind">${esc(r.dateValue)} · ${esc(r.authors)} · ${esc(r.evidenceLevel)}</p>
  <div class="topic-list">${r.topics.map(t => `<span>${esc(t)}</span>`).join("")}</div>
  ${(r.corrections ?? []).map(c => `<p class="correction-notice"><b>${esc(c.date)} 更正</b> ${esc(c.note)}</p>`).join("")}
  <div class="detail-section"><h4>核心發現</h4><p>${esc(r.summary)}</p>${list(r.findings)}</div>
  <div class="detail-grid"><article><h4>製造業實務關聯</h4><p>${esc(r.relevance)}</p></article><article><h4>最小驗證行動</h4><p>${esc(r.action)}</p></article></div>
  <div class="cross-check"><b>查核與判定</b><p>${esc(r.crossCheck ?? "")}</p><p>證據 ${r.scores.evidence}/3；關聯 ${r.scores.relevance}/3；可行動 ${r.scores.actionability}/3。${esc(r.decision)}。</p></div>
  <div class="caveat"><b>限制與利益關係</b><p>${esc(r.caveat)}</p></div>
  ${r.spotlight ? `<div class="spotlight-detail">${r.spotlight.map(s => `<section><h4>${esc(s.heading)}</h4><p>${linked(s.text)}</p></section>`).join("")}</div>` : ""}
  <p class="detail-section"><a href="${esc(r.source)}">原始來源 ↗</a> · <a href="${esc(r.pdf)}">PDF ↗</a> · <a href="#reading-${r.id}">本篇連結</a></p>
</article>`).join("");
mkdirSync("public/reports", { recursive: true });
writeFileSync(`public/reports/${slug}.html`, `<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${slug} AI Security 與架構閱讀清單 · r${revision}</title><meta name="description" content="本期完整研究評述、查核限制與製造業行動建議"><style>${css}</style></head><body><main>
<section class="hero"><p class="eyebrow">WEEKLY RESEARCH · REVISION ${revision}</p><h1>${slug}<br>AI Security 與架構閱讀清單</h1><p class="hero-subtitle">${esc(currentEditorial.note)}</p><p class="edition-note">${reportId} · 查證與修訂日期 ${verifiedAt}</p><div class="kpi-row"><div class="kpi"><b>${currentStats.total}</b><span>入選</span></div><div class="kpi purple"><b>${currentStats.deep}</b><span>深入審閱</span></div><div class="kpi blue"><b>${currentStats.selective}</b><span>選讀</span></div></div></section>
<section><nav aria-label="本期目錄"><ol>${currentReadings.map(r => `<li><a href="#reading-${r.id}">${esc(r.title)}</a></li>`).join("")}</ol></nav></section>
<section class="library"><div class="reading-grid week-reading-grid">${cards}</div></section>
<section class="about"><h2>Weekly AI Report 整合</h2><p><a href="${esc(weeklyReportIntegration.url)}">${esc(weeklyReportIntegration.title)}</a></p><p>Drive 修改時間：${esc(weeklyReportIntegration.modifiedAt)}</p>${list(weeklyReportIntegration.adopted)}${list(weeklyReportIntegration.corrections)}<p>公開原始來源的核實紀錄見各篇；內部 WORK 責任、期限與完成證據不列入公開版。</p></section>
<section class="about"><h2>本期略過</h2><ul>${currentEditorial.skipped.map(s => `<li><a href="${esc(s.source)}">${esc(s.title)}</a>：${esc(s.reason)}</li>`).join("")}</ul>${slug === "2026-09-11" ? "<p>本次搜尋未找到方法透明且適合入選的新 DSPM／DDR 專題實證研究。外部 Cowork 歷史全文未取得，跨平台去重覆蓋有限。未以推估值補填掃描或初篩數量。</p>" : ""}</section>
<section class="about"><h2>版本與交付辨識</h2><p>本檔為閱讀結果完成的 r${revision} 公開保存版。取得此檔表示可讀取這一版內容；GitHub commit、索引與 Pages 部署結果另由版本紀錄和部署頁確認，不能由報告完成推定網站已發布。</p></section>
</main></body></html>`);
console.log(`Report generated: public/reports/${slug}.html`);
