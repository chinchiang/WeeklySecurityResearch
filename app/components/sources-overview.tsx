import { CURRENT_WEEK, currentReadings, weeklyReportIntegration } from "../data/readings";
import { sourceWorkflows, workflowEvidence } from "../data/provenance";

// Server-rendered only: it reads the whole data module, which must stay out of the client bundle.
export function SourcesOverview() {
  return <section className="report-integration" id="sources"><div className="section-heading"><div><p className="eyebrow">SOURCES & EDITORIAL RESPONSIBILITY</p><h2>三個內容來源・兩個網站更新流程</h2></div></div><p>Claude 提供兩部分候選週報，ChatGPT 依主題查核、補充與發布。供稿來源與原始研究出處分開記錄；同一篇跨來源只計一次。</p><div className="source-grid">{sourceWorkflows.map(flow => <article key={flow.id}><span className="mark">{flow.schedule}</span><h3>{flow.title}</h3><p>{flow.role}</p><p><b>{flow.handoff}</b></p><small>{workflowEvidence(flow.id, CURRENT_WEEK, currentReadings, weeklyReportIntegration)}{flow.caveat}</small></article>)}</div><p className="method-note">排程時間代表預定分工，不代表本週已執行成功。歷史文章沒有逐篇產製證據時標示「歷史來源待確認」；原始研究仍可從文章來源連結查閱。</p></section>;
}
