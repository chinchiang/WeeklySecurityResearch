"use client";

import { useMemo, useState } from "react";
import { matchesOrigin } from "../data/provenance";
import { isRetracted, readingSearchText } from "../data/rubric";
import { sitePath } from "../site-config";
import { CorrectionNotice, ScoreBreakdown } from "./reading-meta";
import { useReadingRoom } from "./reading-room";
import { SourceFilter, SourceMeta } from "./source-meta";

const ALL_WEEKS = "全部週次";

/**
 * 首頁「完整必讀名單」與歷史頁「歷史必讀名單」：搜尋、篩選、排序與讀物卡片。
 * 讀物來自外層 <ReadingRoom>；歷史頁另有週次選擇。
 */
export function ReadingLibrary({
  variant,
  topicFilters,
  weeks = [],
  dateRange = "",
  children,
}: {
  variant: "home" | "archive";
  topicFilters: readonly string[];
  /** 歷史頁的週次，新到舊。 */
  weeks?: readonly string[];
  dateRange?: string;
  /** 列在清單之後的內容，例如首頁的本週略過。 */
  children?: React.ReactNode;
}) {
  const archive = variant === "archive";
  const { readings, completed, toggleComplete, openReading } = useReadingRoom();
  const [week, setWeek] = useState(ALL_WEEKS);
  const [origin, setOrigin] = useState("all");
  const [topic, setTopic] = useState("全部");
  const [decision, setDecision] = useState("全部判定");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState(archive ? "newest" : "priority");

  const visibleReadings = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return readings
      .filter((reading) =>
        (week === ALL_WEEKS || reading.week === week) &&
        matchesOrigin(reading, origin) &&
        (topic === "全部" || reading.topics.includes(topic)) &&
        (decision === "全部判定" || reading.decision === decision) &&
        readingSearchText(reading).includes(normalized))
      .sort((a, b) =>
        sort === "newest"
          ? b.dateValue.localeCompare(a.dateValue)
          : b.week.localeCompare(a.week) || a.rank - b.rank);
  }, [readings, origin, decision, query, sort, topic, week]);

  return (
    <>
      <div className="section-heading">
        <div>
          <p className="eyebrow">{archive ? "HISTORICAL RESEARCH LIBRARY" : "CURATED RESEARCH LIBRARY"}</p>
          <h2>{archive ? "歷史必讀名單" : "完整必讀名單"}</h2>
        </div>
        <p className="result-count">
          顯示 <b>{visibleReadings.length}</b> / {readings.length} 項
          {!archive && <> · <a href={sitePath("/archive/")}>查看歷史資料 →</a></>}
        </p>
      </div>

      {archive && (
        <div className="week-selector" role="group" aria-label="選擇歷史週次">
          <button className={week === ALL_WEEKS ? "active" : ""} onClick={() => setWeek(ALL_WEEKS)} aria-pressed={week === ALL_WEEKS}>{ALL_WEEKS}</button>
          {weeks.map((archiveWeek) => (
            <span className="week-choice" key={archiveWeek}><button className={week === archiveWeek ? "active" : ""} onClick={() => setWeek(archiveWeek)} aria-pressed={week === archiveWeek}>{archiveWeek}</button><a href={sitePath(`/week/${archiveWeek.replaceAll(".", "-")}/`)} aria-label={`開啟 ${archiveWeek} 固定網址`}>↗</a></span>
          ))}
        </div>
      )}

      <div className={`control-panel ${archive ? "archive-controls" : ""}`}>
        <label className="search-box">
          <span aria-hidden="true">⌕</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={archive ? "搜尋歷史論文、作者、控制或風險…" : "搜尋論文、作者、控制或風險…"}
            aria-label={archive ? "搜尋歷史閱讀資料" : "搜尋閱讀清單"}
          />
          {query && <button onClick={() => setQuery("")} aria-label="清除搜尋">×</button>}
        </label>
        <div className="filter-row" role="group" aria-label="主題篩選">
          {topicFilters.map((filter) => (
            <button key={filter} className={topic === filter ? "active" : ""} onClick={() => setTopic(filter)} aria-pressed={topic === filter}>
              {filter}
            </button>
          ))}
        </div>
        <SourceFilter value={origin} onChange={setOrigin} />
        <select value={decision} onChange={(event) => setDecision(event.target.value)} aria-label="判定篩選">
          <option>全部判定</option>
          <option>深入審閱</option>
          <option>選讀</option>
        </select>
        <select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="排序方式">
          {archive
            ? <><option value="newest">依發布日期</option><option value="priority">依原始優先順序</option></>
            : <><option value="priority">依優先順序</option><option value="newest">依發布日期</option></>}
        </select>
      </div>

      {archive && (
        <div className="archive-period">
          <span>週次</span>
          <b>{week === ALL_WEEKS ? dateRange : week}</b>
          <i />
          <small>{visibleReadings.length} 項符合條件</small>
        </div>
      )}

      <div className="reading-grid">
        {visibleReadings.map((reading) => {
          const isDone = completed.includes(reading.id);
          return (
            <article className={`reading-card ${isDone ? "completed" : ""} ${isRetracted(reading) ? "retracted" : ""}`} key={reading.id} id={`reading-${reading.id}-card`}>
              <div className="card-topline">
                <span className="card-rank">#{String(reading.rank).padStart(2, "0")}</span>
                <span className={`decision ${reading.decision === "深入審閱" ? "deep" : "select"}`}>
                  {reading.decision === "深入審閱" ? "◇" : "▢"} {reading.decision}
                </span>
              </div>
              <div className="card-kind"><span>{reading.kind}</span><i />{reading.date}<i />{archive ? `週次 ${reading.week}` : reading.batch}</div>
              <span className={`evidence-badge evidence-${reading.evidenceLevel}`}>{reading.evidenceLevel}</span>
              <h3>{reading.title}</h3>
              <p className="card-subtitle">{reading.subtitle}</p>
              <SourceMeta reading={reading} /><CorrectionNotice reading={reading} />
              <p className="card-summary">{reading.summary}</p>
              <ScoreBreakdown reading={reading} />
              {reading.metric && <div className="metric">{reading.metric}</div>}
              <div className="topic-list">
                {reading.topics.map((item) => <span key={item}>{item}</span>)}
              </div>
              <div className="card-actions">
                <button onClick={(event) => openReading(reading, event.currentTarget)}>摘要與查核 <span>→</span></button>
                <a href={reading.source} target="_blank" rel="noreferrer" aria-label={`開啟 ${reading.title} 原始來源`}>來源 ↗</a>
                {reading.pdf && <a href={reading.pdf} target="_blank" rel="noreferrer" aria-label={`下載 ${reading.title} PDF`}>PDF ↓</a>}
              </div>
              <button
                className={`progress-toggle ${isDone ? "done" : ""}`}
                onClick={() => toggleComplete(reading.id)}
                aria-pressed={isDone}
                aria-label={`${isDone ? "已閱讀" : "標記為已閱讀"}：${reading.title}`}
              >
                <span aria-hidden="true">{isDone ? "✓" : ""}</span>{isDone ? "已閱讀" : "標記為已閱讀"}
              </button>
            </article>
          );
        })}
      </div>
      {visibleReadings.length === 0 && (
        archive
          ? <div className="empty-state"><b>NO MATCHING ARCHIVE</b><p>沒有符合目前條件的歷史資料，請調整搜尋或篩選條件。</p></div>
          : <div className="empty-state"><b>NO MATCHING INTELLIGENCE</b><p>沒有符合目前條件的資料，請調整搜尋或篩選條件。</p></div>
      )}
      {children}
    </>
  );
}
