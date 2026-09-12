"use client";

import { sitePath } from "../../site-config";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArchitectureReview } from "../../components/architecture-review";
import { CorrectionNotice, ScoreBreakdown } from "../../components/reading-meta";
import { editorialFor, readings } from "../../data/readings";

export default function WeekPage() {
  const params = useParams<{ week: string }>();
  const week = decodeURIComponent(params.week ?? "").replaceAll("-", ".");
  const items = readings.filter((reading) => reading.week === week).sort((a, b) => a.rank - b.rank);
  const editorial = editorialFor(week);

  return (
    <main>
      <header className="topbar">
        <Link className="brand" href="/" aria-label="返回最新一期"><span className="brand-mark">AI</span><span><strong>Manufacturing AI Security</strong><small>PERMANENT WEEKLY EDITION</small></span></Link>
        <a className="mobile-history-link" href={sitePath("/archive")} >歷史資料</a>
        <nav aria-label="週次頁導覽"><Link href="/">最新一期</Link><Link href="/archive">全部歷史</Link><a href={sitePath("/feed.xml")} >Atom Feed</a></nav>
      </header>
      <section className="archive-hero week-hero">
        <div className="grid-noise" aria-hidden="true" />
        <div><p className="eyebrow">PERMANENT WEEKLY EDITION</p><h1>{week || "無效週次"}<span>必讀清單</span></h1><p>此網址固定保存該週入選內容，適合引用、分享與稽核追溯。</p><a className="secondary-button" href={sitePath("/archive")} >← 返回歷史資料庫</a></div>
        <div className="archive-stat"><b>{String(items.length).padStart(2, "0")}</b><span>READINGS</span><p>{week}</p></div>
      </section>
      <section className="library archive-library">
        {items.length > 0 && (
          <div className="week-editorial">
            <b>本期入選漏斗</b>
            <p><span>{editorial.scanned ?? "未留存"}</span> 掃描 → <span>{editorial.shortlisted ?? "未留存"}</span> 初篩 → <span>{editorial.selected}</span> 入選</p>
            <small>{editorial.note}</small>
            {editorial.skipped.length > 0 && (
              <ul className="week-skipped">
                {editorial.skipped.map((item) => (
                  <li key={item.title}><a href={item.source} target="_blank" rel="noreferrer">{item.title}</a>：{item.reason}</li>
                ))}
              </ul>
            )}
          </div>
        )}
        {items.length ? <div className="reading-grid week-reading-grid">{items.map((reading) => <article className="reading-card" id={`reading-${reading.id}`} key={reading.id}>
          <div className="card-topline"><span className="card-rank">#{String(reading.rank).padStart(2, "0")}</span><span className={`decision ${reading.decision === "深入審閱" ? "deep" : "select"}`}>{reading.decision}</span></div>
          <div className="card-kind"><span>{reading.kind}</span><i />{reading.date}<i />{reading.batch}</div>
          <span className={`evidence-badge evidence-${reading.evidenceLevel}`}>{reading.evidenceLevel}</span>
          <h3>{reading.title}</h3><p className="card-subtitle">{reading.subtitle}</p>
          <CorrectionNotice reading={reading} />
          <p className="card-summary">{reading.summary}</p>
          <ScoreBreakdown reading={reading} />
          <div className="detail-section compact-detail"><h4>主要發現</h4><ul>{reading.findings.map((finding) => <li key={finding}>{finding}</li>)}</ul></div>
          <div className="detail-grid compact-detail"><article><h4>製造業實務關聯</h4><p>{reading.relevance}</p></article><article><h4>建議行動</h4><p>{reading.action}</p></article></div>
          <div className="caveat compact-detail"><b>查核注意事項</b><p>{reading.caveat}</p></div>
          <ArchitectureReview reading={reading} /><div className="card-actions"><a href={reading.source} target="_blank" rel="noreferrer">原始來源 ↗</a>{reading.pdf && <a href={reading.pdf} target="_blank" rel="noreferrer">PDF ↓</a>}<a href={`#reading-${reading.id}`} aria-label={`複製 ${reading.title} 深連結`}>單篇連結 #</a></div>
        </article>)}</div> : <div className="empty-state"><b>WEEK NOT FOUND</b><p>找不到這個週次；請回到歷史資料庫選擇有效週次。</p></div>}
      </section>
      <footer><div className="brand footer-brand"><span className="brand-mark">AI</span><span><strong>Manufacturing AI Security</strong><small>VERIFIABLE WEEKLY ARCHIVE</small></span></div><p>固定週次網址 · 正體中文／臺灣慣用語</p><a href={sitePath("/archive")} >歷史資料庫 →</a></footer>
    </main>
  );
}
