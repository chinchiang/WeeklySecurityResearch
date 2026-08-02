"use client";

import { useEffect, useMemo, useState } from "react";
import { readings, type Reading } from "../page";

const filters = [
  "全部",
  "Agent Security",
  "DSPM / DLP",
  "Data Lineage",
  "DDR",
  "Threat Modeling",
];

const CURRENT_WEEK = "2026.07.31";
const archiveReadings = readings.filter(
  (reading) => reading.week !== CURRENT_WEEK,
);
const archiveWeeks = Array.from(
  new Set(archiveReadings.map((reading) => reading.week ?? "2026.07.17")),
).sort((a, b) => b.localeCompare(a));

export default function ArchivePage() {
  const [week, setWeek] = useState("全部週次");
  const [topic, setTopic] = useState("全部");
  const [decision, setDecision] = useState("全部判定");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("newest");
  const [selected, setSelected] = useState<Reading | null>(null);
  const [completed, setCompleted] = useState<number[]>([]);

  useEffect(() => {
    const saved = window.localStorage.getItem("ai-security-reading-progress");
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) setCompleted(parsed);
    } catch {
      setCompleted([]);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      "ai-security-reading-progress",
      JSON.stringify(completed),
    );
  }, [completed]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const visibleReadings = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return archiveReadings
      .filter((reading) => {
        const readingWeek = reading.week ?? "2026.07.17";
        const matchesWeek = week === "全部週次" || readingWeek === week;
        const matchesTopic =
          topic === "全部" || reading.topics.includes(topic);
        const matchesDecision =
          decision === "全部判定" || reading.decision === decision;
        const haystack = [
          reading.title,
          reading.subtitle,
          reading.authors,
          reading.summary,
          reading.relevance,
          ...reading.topics,
        ]
          .join(" ")
          .toLowerCase();
        return (
          matchesWeek &&
          matchesTopic &&
          matchesDecision &&
          haystack.includes(normalized)
        );
      })
      .sort((a, b) =>
        sort === "newest"
          ? b.dateValue.localeCompare(a.dateValue)
          : a.id - b.id,
      );
  }, [decision, query, sort, topic, week]);

  const toggleComplete = (id: number) => {
    setCompleted((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  };

  const archiveCompleted = completed.filter((id) =>
    archiveReadings.some((reading) => reading.id === id),
  );
  const progress = Math.round(
    (archiveCompleted.length / archiveReadings.length) * 100,
  );

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="/" aria-label="返回最新一期">
          <span className="brand-mark">AI</span>
          <span>
            <strong>Manufacturing AI Security</strong>
            <small>READING INTELLIGENCE HUB</small>
          </span>
        </a>
        <a className="mobile-history-link" href="/">最新一期</a>
        <nav aria-label="歷史資料導覽">
          <a href="/">最新一期</a>
          <a href="#archive-index">歷史索引</a>
          <a href="#archive-progress">閱讀進度</a>
          <a href="/social-content/index.html">社群內容</a>
        </nav>
        <div className="live-state"><i /> ARCHIVE VERIFIED</div>
      </header>

      <nav className="mobile-dock" aria-label="手機快捷導覽">
        <a href="/"><span>⌂</span>最新一期</a>
        <a href="#archive-index"><span>◆</span>歷史清單</a>
        <a href="#archive-progress"><span>✓</span>閱讀進度</a>
      </nav>

      <section className="archive-hero" id="top">
        <div className="grid-noise" aria-hidden="true" />
        <div>
          <p className="eyebrow">RESEARCH ARCHIVE · SINCE 2026.07.17</p>
          <h1>歷史<span>閱讀資料庫</span></h1>
          <p>
            保存過往每週入選內容，與最新一期分開管理。可依主題、判定與關鍵字查詢，
            並直接開啟原始來源或 PDF。
          </p>
          <a className="secondary-button" href="/">← 返回最新一期</a>
        </div>
        <div className="archive-stat" aria-label="歷史資料統計">
          <b>{String(archiveReadings.length).padStart(2, "0")}</b>
          <span>ARCHIVED READINGS</span>
          <p>2026.07.17—2026.07.24</p>
        </div>
      </section>

      <section className="library archive-library" id="archive-index">
        <div className="section-heading">
          <div>
            <p className="eyebrow">HISTORICAL RESEARCH LIBRARY</p>
            <h2>歷史必讀名單</h2>
          </div>
          <p className="result-count">
            顯示 <b>{visibleReadings.length}</b> / {archiveReadings.length} 項
          </p>
        </div>

        <div className="week-selector" role="group" aria-label="選擇歷史週次">
          <button className={week === "全部週次" ? "active" : ""} onClick={() => setWeek("全部週次")} aria-pressed={week === "全部週次"}>全部週次</button>
          {archiveWeeks.map((archiveWeek) => (
            <button key={archiveWeek} className={week === archiveWeek ? "active" : ""} onClick={() => setWeek(archiveWeek)} aria-pressed={week === archiveWeek}>{archiveWeek}</button>
          ))}
        </div>

        <div className="control-panel archive-controls">
          <label className="search-box">
            <span>⌕</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="搜尋歷史論文、作者、控制或風險…"
              aria-label="搜尋歷史閱讀資料"
            />
            {query && (
              <button onClick={() => setQuery("")} aria-label="清除搜尋">
                ×
              </button>
            )}
          </label>
          <div className="filter-row" role="group" aria-label="主題篩選">
            {filters.map((filter) => (
              <button
                key={filter}
                className={topic === filter ? "active" : ""}
                onClick={() => setTopic(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
          <select
            value={decision}
            onChange={(event) => setDecision(event.target.value)}
            aria-label="判定篩選"
          >
            <option>全部判定</option>
            <option>深入審閱</option>
            <option>選讀</option>
          </select>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            aria-label="排序方式"
          >
            <option value="newest">依發布日期</option>
            <option value="priority">依原始優先順序</option>
          </select>
        </div>

        <div className="archive-period">
          <span>週次</span>
          <b>{week === "全部週次" ? "2026.07.17—2026.07.24" : week}</b>
          <i />
          <small>{visibleReadings.length} 項符合條件</small>
        </div>

        <div className="reading-grid">
          {visibleReadings.map((reading) => {
            const isDone = completed.includes(reading.id);
            return (
              <article
                className={`reading-card ${isDone ? "completed" : ""}`}
                key={reading.id}
              >
                <div className="card-topline">
                  <span className="card-rank">
                    #{String(reading.id).padStart(2, "0")}
                  </span>
                  <span
                    className={`decision ${
                      reading.decision === "深入審閱" ? "deep" : "select"
                    }`}
                  >
                    {reading.decision === "深入審閱" ? "◇" : "▢"}{" "}
                    {reading.decision}
                  </span>
                </div>
                <div className="card-kind">
                  <span>{reading.kind}</span><i />{reading.date}<i />週次 {reading.week ?? "2026.07.17"}
                </div>
                <h3>{reading.title}</h3>
                <p className="card-subtitle">{reading.subtitle}</p>
                <p className="card-summary">{reading.summary}</p>
                {reading.metric && (
                  <div className="metric">{reading.metric}</div>
                )}
                <div className="topic-list">
                  {reading.topics.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
                <div className="card-actions">
                  <button onClick={() => setSelected(reading)}>
                    摘要與查核 <span>→</span>
                  </button>
                  <a
                    href={reading.source}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`開啟 ${reading.title} 原始來源`}
                  >
                    來源 ↗
                  </a>
                  {reading.pdf && (
                    <a
                      href={reading.pdf}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`下載 ${reading.title} PDF`}
                    >
                      PDF ↓
                    </a>
                  )}
                </div>
                <button
                  className={`progress-toggle ${isDone ? "done" : ""}`}
                  onClick={() => toggleComplete(reading.id)}
                >
                  <span>{isDone ? "✓" : ""}</span>
                  {isDone ? "已閱讀" : "標記為已閱讀"}
                </button>
              </article>
            );
          })}
        </div>

        {visibleReadings.length === 0 && (
          <div className="empty-state">
            <b>NO MATCHING ARCHIVE</b>
            <p>沒有符合目前條件的歷史資料，請調整搜尋或篩選條件。</p>
          </div>
        )}
      </section>

      <section className="archive-progress" id="archive-progress">
        <div>
          <p className="eyebrow">ARCHIVE READING PROGRESS</p>
          <h2>歷史資料閱讀進度</h2>
          <p>閱讀狀態與最新一期共用，僅儲存在目前瀏覽器。</p>
        </div>
        <div className="progress-console">
          <div className="progress-value">
            <b>{progress}%</b>
            <span>
              {archiveCompleted.length} / {archiveReadings.length} COMPLETED
            </span>
          </div>
          <div className="progress-track">
            <i style={{ width: `${progress}%` }} />
          </div>
          <div className="progress-labels">
            <span>0</span><span>ARCHIVE TARGET</span><span>100</span>
          </div>
        </div>
      </section>

      <footer>
        <div className="brand footer-brand">
          <span className="brand-mark">AI</span>
          <span>
            <strong>Manufacturing AI Security</strong>
            <small>RESEARCH ARCHIVE</small>
          </span>
        </div>
        <p>歷史資料獨立保存 · 正體中文／臺灣慣用語</p>
        <a href="/">返回最新一期 →</a>
      </footer>

      {selected && (
        <div
          className="modal-backdrop"
          onMouseDown={(event) =>
            event.target === event.currentTarget && setSelected(null)
          }
        >
          <section
            className="detail-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="archive-detail-title"
          >
            <button
              className="modal-close"
              onClick={() => setSelected(null)}
              aria-label="關閉摘要"
            >
              ×
            </button>
            <div className="modal-rank">
              #{String(selected.rank ?? selected.id).padStart(2, "0")} · {selected.kind} ·
              {selected.week ?? "2026.07.17"}
            </div>
            <h2 id="archive-detail-title">{selected.title}</h2>
            <p className="modal-subtitle">{selected.subtitle}</p>
            <div className="modal-meta">
              <span>{selected.date}</span><i />{selected.authors}
            </div>
            <div className="modal-tags">
              <span
                className={
                  selected.decision === "深入審閱" ? "deep" : "select"
                }
              >
                {selected.decision}
              </span>
              {selected.topics.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
            <div className="detail-section">
              <h3>核心摘要</h3>
              <p>{selected.summary}</p>
            </div>
            <div className="detail-section">
              <h3>主要發現</h3>
              <ul>
                {selected.findings.map((finding) => (
                  <li key={finding}>{finding}</li>
                ))}
              </ul>
            </div>
            <div className="detail-grid">
              <article>
                <h3>製造業實務關聯</h3>
                <p>{selected.relevance}</p>
              </article>
              <article>
                <h3>建議控制／行動</h3>
                <p>{selected.action}</p>
              </article>
            </div>
            {selected.crossCheck && (
              <div className="cross-check">
                <b>交叉核實</b><p>{selected.crossCheck}</p>
              </div>
            )}
            <div className="caveat">
              <b>查核注意事項</b><p>{selected.caveat}</p>
            </div>
            <div className="modal-actions">
              <a
                className="primary-button"
                href={selected.source}
                target="_blank"
                rel="noreferrer"
              >
                開啟原始來源 ↗
              </a>
              {selected.pdf && (
                <a
                  className="secondary-button"
                  href={selected.pdf}
                  target="_blank"
                  rel="noreferrer"
                >
                  下載／開啟 PDF ↓
                </a>
              )}
              <button
                className={`reading-button ${
                  completed.includes(selected.id) ? "done" : ""
                }`}
                onClick={() => toggleComplete(selected.id)}
              >
                {completed.includes(selected.id)
                  ? "✓ 已完成閱讀"
                  : "標記為已閱讀"}
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
