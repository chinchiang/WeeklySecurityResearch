import { sitePath } from "./site-config";

import { SourcesOverview } from "./components/sources-overview";
import { OpenReadingButton, ProgressConsole, ReadingRoom } from "./components/reading-room";
import { ReadingLibrary } from "./components/reading-library";
import {
  CURRENT_WEEK,
  archiveReadings,
  currentArchitectureReading,
  currentTopicFilters,
  correctionLog,
  currentEditorial,
  currentReadings,
  currentStats,
  editorialMethod,
  isRetracted,
  priorityReading,
  weeklyReportIntegration,
} from "./data/readings";
function Mark({ children }: { children: React.ReactNode }) {
  return <span className="mark">{children}</span>;
}

// A shared /#reading-<id> link outlives its week: once the issue changes, send it to that week's permanent page.
const elsewhere = Object.fromEntries(archiveReadings.map((reading) => [reading.id, sitePath(`/week/${reading.week.replaceAll(".", "-")}/#reading-${reading.id}`)]));
const nextActions = [...currentReadings].filter((reading) => !isRetracted(reading)).sort((a, b) => a.rank - b.rank).slice(0, 5);

export default function Home() {
  return (
    <div className="site">
      <a className="skip-link" href="#main">跳到主要內容</a>
<header className="topbar">
        <a className="brand" href="#top" aria-label="回到頁首">
          <span className="brand-mark">研</span>
          <span>
            <strong>科技・資安・架構週讀</strong>
            <small>READING INTELLIGENCE HUB</small>
          </span>
        </a>
        <a className="mobile-history-link" href={sitePath("/archive/")} >過去必讀</a>
        <nav aria-label="主要導覽">
          <a href="#weekly">本週精選</a>
          <a href="#index">主題索引</a><a href="#sources">來源分工</a>
          <a href="#progress">閱讀進度</a>
          <a href={sitePath("/archive/")} >歷史資料</a>
        </nav>
        <a className="live-state" href="#verification"><i /> VERIFIED SOURCES · 定義</a>
      </header>

      <aside className="side-nav" aria-label="閱讀導覽">
        <p>研究閱讀室</p><a href="#top">本期總覽</a><a href="#index">精選閱讀</a>{currentArchitectureReading && <a href="#spotlight">架構長文</a>}<a href={sitePath("/archive/")} >歷史清單</a><a href="#progress">閱讀進度</a><a href="#verification">查核方法</a>
        <div className="sister-sites"><p>相關情報站</p><a href="https://chinchiang.github.io/DailySOCVitamin/">Daily SOC Vitamin ↗</a><a href="https://chinchiang.github.io/CyberRegulationWatch/">Cyber Regulation Watch ↗</a></div>
      </aside>
      <ReadingRoom readings={currentReadings} elsewhere={elsewhere} titleId="detail-title" dialogContext="batch">
      <main id="main">
      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">WEEKLY RESEARCH · {CURRENT_WEEK}</p>
          <h1>科技・資安・架構<span>週讀</span></h1>
          <p className="hero-subtitle">製造業 AI Security、企業架構、OT／ICS、資料保護與產品安全。從研究證據，走到可驗證的控制。</p>
          <div className="kpi-row" role="group" aria-label="本週清單統計">
            <div className="kpi"><b>{currentStats.total}</b><span>本期入選</span></div>
            <div className="kpi purple"><b>{currentStats.deep}</b><span>深入審閱</span></div>
            <div className="kpi blue"><b>{currentStats.selective}</b><span>選讀</span></div>
          </div>
          <p className="edition-note">{currentEditorial.note}</p>
          <a className="text-link" href={sitePath(`/reports/${CURRENT_WEEK.replaceAll(".", "-")}.html`)}>本期完整報告／下載保存 ↗</a>
        </div>
      </section>

      <SourcesOverview />
      <section className="featured" id="weekly">
        <div className="section-heading">
          <div>
            <p className="eyebrow">START HERE · #01</p>
            <h2>本週最高優先閱讀</h2>
          </div>
          <span className="verified-badge">✓ 原始來源已確認</span>
        </div>
        <article className="featured-card">
          <div className="rank-panel"><b>#01</b><small>FIRST READ</small></div>
          <div className="featured-copy">
            <div className="meta-line"><span>{priorityReading.evidenceLevel}</span><i />{priorityReading.date}<i />{priorityReading.sourceLabel}</div>
            <h3>{priorityReading.title}</h3>
            <p className="featured-subtitle">{priorityReading.subtitle}</p>
            <p className="featured-summary">{priorityReading.summary}</p>
            <div className="featured-actions">
              <OpenReadingButton id={priorityReading.id} className="primary-button">
                閱讀摘要 <span>→</span>
              </OpenReadingButton>
              <a className="secondary-button" href={priorityReading.source} target="_blank" rel="noreferrer">
                原始來源 ↗
              </a>
              {priorityReading.pdf && <a className="text-link" href={priorityReading.pdf} target="_blank" rel="noreferrer">PDF ↓</a>}
            </div>
          </div>
        </article>
      </section>

      <section className="library" id="index">
        <ReadingLibrary variant="home" topicFilters={currentTopicFilters}>
        {currentEditorial.skipped.length > 0 && (
          <div className="method-note">
            <Mark>本週略過</Mark>{" "}
            {currentEditorial.skipped.map((item, index) => <span key={item.title}>{index > 0 && "；"}<a href={item.source} target="_blank" rel="noreferrer">{item.title}</a>：{item.reason}</span>)}
          </div>
        )}
        </ReadingLibrary>
      </section>

      {currentArchitectureReading && (
        <section id="spotlight" className="spotlight-section"><div className="section-heading"><div><p className="eyebrow">ENTERPRISE SECURITY ARCHITECTURE</p><h2>架構長文</h2></div></div><p>架構研究與 AI、產品安全共用同一份清單；本週的架構類讀物是〈{currentArchitectureReading.title}〉。</p><OpenReadingButton id={currentArchitectureReading.id} className="secondary-button">閱讀架構評述 →</OpenReadingButton></section>
      )}

      <section className="report-integration" id="report-integration">
        <div className="report-heading">
          <div>
            <p className="eyebrow">GOOGLE DRIVE · VERIFIED REPORT INPUT</p>
            <h2>Claude 週報整合紀錄</h2>
          </div>
          <span>Weekly Security Reports · 私人歸檔不公開連結</span>
        </div>
        {weeklyReportIntegration ? (
          <div className="report-grid">
            <article className="report-source-card">
              <Mark>本期曾讀取的報告</Mark>
              <h3>{weeklyReportIntegration.title}</h3>
              <p>最後修改：{weeklyReportIntegration.modifiedAt}</p>
              <div className="report-counts">
                <span><b>{weeklyReportIntegration.candidates}</b> 報告候選</span>
                <span><b>{weeklyReportIntegration.selected}</b> 納入補遺</span>
                <span><b>{currentStats.total}</b> 合併清單</span>
              </div>
            </article>
            <article>
              <Mark>採用內容</Mark>
              <ul>{weeklyReportIntegration.adopted.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
            <article>
              <Mark>查核修正</Mark>
              <ul>{weeklyReportIntegration.corrections.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
          </div>
        ) : (
          <p className="method-note">本期沒有 Claude 週報整合紀錄：上游週報未取得或未讀取，本期內容僅來自公開研究查核，不虛構缺少的上游輸入。</p>
        )}
      </section>

      <section className="progress-section" id="progress">
        <div>
          <p className="eyebrow">READING OPERATIONS</p>
          <h2>本週閱讀進度</h2>
          <p>進度只儲存在目前瀏覽器，不會傳送到外部服務。</p>
        </div>
        <ProgressConsole goalLabel="閱讀目標" />
        <div className="next-actions">
          <h3>建議下一步</h3>
          {/* 已撤稿的項目仍保留在清單中供追溯，但不再作為行動依據。 */}
          <ol>{nextActions.map((reading, index) => <li key={reading.id}><b>{String(index + 1).padStart(2, "0")}</b><span>{reading.action}<small className="next-action-source">出自〈{reading.title}〉</small></span></li>)}</ol>
        </div>
      </section>

      <section className="about" id="verification">
        <div>
          <p className="eyebrow">EDITORIAL & VERIFICATION POLICY</p>
          <h2>篩選與查核原則</h2>
        </div>
        <div className="method-grid">
          <article><span>01</span><h3>原始來源優先</h3><p>優先採用原始論文、官方報告、權威機構與可查核的技術研究。</p></article>
          <article><span>02</span><h3>證據與限制並陳</h3><p>區分實證結果、作者主張與推論；明列樣本偏差及未經同儕審查等限制。</p></article>
          <article><span>03</span><h3>製造業實務映射</h3><p>對應 IP、BOM、PLM、ERP、韌體、OT、供應鏈與跨國資料治理情境。</p></article>
          <article><span>04</span><h3>排除行銷雜訊</h3><p>不以產品排行、無方法論的廠商文章或重複轉述填補閱讀清單。</p></article>
        </div>
        <div className="rubric-panel">
          <div className="rubric-heading"><div><Mark>公開評鑑 Rubric</Mark><h3>三軸判定與排序規則</h3></div><p>{editorialMethod.decisionRule}</p></div>
          <p className="score-scale">{editorialMethod.scoreScale}</p>
          <div className="rubric-table" role="table" aria-label="深入審閱與選讀判定準則">
            <div className="rubric-row rubric-head" role="row"><span role="columnheader">評鑑軸</span><span role="columnheader">權重</span><span role="columnheader">深入審閱</span><span role="columnheader">選讀</span></div>
            {editorialMethod.rubric.map((item) => <div className="rubric-row" role="row" key={item.axis}><b role="rowheader">{item.axis}</b><strong role="cell">{item.weight}</strong><p role="cell">{item.deep}</p><p role="cell">{item.selective}</p></div>)}
          </div>
          <div className="ranking-rule"><b>排名邏輯</b><p>{editorialMethod.rankingRule}</p></div>
          <div className="ranking-rule"><b>更正與撤稿</b><p>{editorialMethod.correctionRule}</p></div>
        </div>
        <div className="verification-grid">
          <article><Mark>VERIFIED SOURCES 定義</Mark><h3>五項查核清單</h3><ul>{editorialMethod.verifiedChecklist.map((item) => <li key={item}>{item}</li>)}</ul></article>
          <article><Mark>候選來源範圍</Mark><h3>固定掃描範圍</h3><ul>{editorialMethod.sourceScope.map((item) => <li key={item}>{item}</li>)}</ul></article>
          <article><Mark>本週入選漏斗</Mark><h3><span>{currentEditorial.scanned ?? "未留存"}</span> 掃描 → <span>{currentEditorial.shortlisted ?? "未留存"}</span> 初篩 → <span>{currentStats.new}</span> 新發 + <span>{currentStats.catchUp}</span> 補遺</h3><p>{currentEditorial.note}</p></article>
        </div>
        <div className="correction-log" id="corrections">
          <div className="correction-head"><Mark>更正紀錄</Mark><h3>已發佈項目的修訂軌跡</h3></div>
          {correctionLog.length === 0 ? (
            <p className="correction-empty">目前沒有已發佈項目被撤稿、更正或取代。若日後發生，該筆不會被刪除，而是在此列出並於卡片標示。</p>
          ) : (
            <ol>
              {correctionLog.map(({ reading, correction }) => (
                <li key={`${reading.id}-${correction.date}-${correction.type}`}>
                  <b>{correction.type}</b>
                  <span>{correction.date}</span>
                  <a href={sitePath(`/week/${reading.week.replaceAll(".", "-")}/#reading-${reading.id}`)}>{reading.title}</a>
                  <p>{correction.note}</p>
                </li>
              ))}
            </ol>
          )}
        </div>
        <div className="method-note"><Mark>判讀提醒</Mark> Preprint 的攻擊成功率尚未經獨立重現；廠商遙測僅代表其可見範圍，不能直接外推整體產業。</div>
      </section>

      </main>
      </ReadingRoom>
      <footer>
        <div className="brand footer-brand"><span className="brand-mark">研</span><span><strong>科技・資安・架構週讀</strong><small>RESEARCH · SECURITY · ARCHITECTURE</small></span></div>
        <p>本週更新：{CURRENT_WEEK} · 正體中文／臺灣慣用語</p>
        <a href={sitePath("/archive/")} >歷史資料庫 →</a>
      </footer>
    </div>
  );
}
