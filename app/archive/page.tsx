"use client";

import { sitePath } from "../site-config";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { SourceMeta, SourceFilter } from "../components/source-meta";
import { matchesOrigin } from "../data/provenance";
import { ArchitectureReview } from "../components/architecture-review";
import { CorrectionNotice, ScoreBreakdown } from "../components/reading-meta";
import {
  TOPIC_FILTERS,
  allWeeks,
  archiveDateRange,
  archiveReadings,
  archiveWeeks,
  readingSearchText,
  type Reading,
} from "../data/readings";

export default function ArchivePage() {
  const [week, setWeek] = useState("全部週次");
  const [origin, setOrigin] = useState("all");
  const [topic, setTopic] = useState("全部");
  const [decision, setDecision] = useState("全部判定");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("newest");
  const [selected, setSelected] = useState<Reading | null>(null);
  const [completed, setCompleted] = useState<number[]>([]);
  const modalRef = useRef<HTMLElement>(null);
  const lastTriggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem("ai-security-reading-progress");
    if (!saved) return;
    const frame = window.requestAnimationFrame(() => {
      try {
        const parsed = JSON.parse(saved);
        setCompleted(Array.isArray(parsed) ? parsed.filter(Number.isInteger) : []);
      } catch {
        setCompleted([]);
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      "ai-security-reading-progress",
      JSON.stringify(completed),
    );
  }, [completed]);

  function openReading(reading: Reading, trigger?: HTMLElement) {
    lastTriggerRef.current = trigger ?? document.activeElement as HTMLElement;
    setSelected(reading);
    window.history.replaceState(null, "", `#reading-${reading.id}`);
  }

  function closeReading() {
    setSelected(null);
    if (window.location.hash.startsWith("#reading-")) window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    window.requestAnimationFrame(() => lastTriggerRef.current?.focus());
  }

  useEffect(() => {
    const syncFromHash = () => {
      const match = window.location.hash.match(/^#reading-(\d+)$/);
      if (!match) return;
      const reading = archiveReadings.find((item) => item.id === Number(match[1]));
      if (reading) setSelected(reading);
    };
    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, []);

  useEffect(() => {
    if (!selected || !modalRef.current) return;
    const dialog = modalRef.current;
    const focusable = () => Array.from(dialog.querySelectorAll<HTMLElement>('button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])')).filter((element) => !element.hasAttribute("disabled"));
    focusable()[0]?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.setProperty("overflow", "hidden");
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); closeReading(); return; }
      if (event.key !== "Tab") return;
      const items = focusable();
      if (!items.length) return;
      const first = items[0]; const last = items.at(-1)!;
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    dialog.addEventListener("keydown", onKeyDown);
    return () => {
      dialog.removeEventListener("keydown", onKeyDown);
      document.body.style.setProperty("overflow", previousOverflow);
    };
  }, [selected]);

  const visibleReadings = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return archiveReadings
      .filter((reading) => {
        const matchesWeek = week === "全部週次" || reading.week === week;
        const matchesSource = matchesOrigin(reading, origin);
      const matchesTopic =
          topic === "全部" || reading.topics.includes(topic);
        const matchesDecision =
          decision === "全部判定" || reading.decision === decision;
        return (
          matchesSource && matchesWeek &&
          matchesTopic &&
          matchesDecision &&
          readingSearchText(reading).includes(normalized)
        );
      })
      .sort((a, b) =>
        sort === "newest"
          ? b.dateValue.localeCompare(a.dateValue)
          : b.week.localeCompare(a.week) || a.rank - b.rank,
      );
  }, [origin, decision, query, sort, topic, week]);

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
        <Link className="brand" href="/" aria-label="返回最新一期">
          <span className="brand-mark">研</span>
          <span>
            <strong>科技・資安・架構週讀</strong>
            <small>READING INTELLIGENCE HUB</small>
          </span>
        </Link>
        <Link className="mobile-history-link" href="/">最新一期</Link>
        <nav aria-label="歷史資料導覽">
          <Link href="/">最新一期</Link>
          <a href="#archive-index">歷史索引</a>
          <a href="#archive-progress">閱讀進度</a>
        </nav>
        <div className="live-state"><i /> ARCHIVE VERIFIED</div>
      </header>

      <nav className="mobile-dock" aria-label="手機快捷導覽">
        <Link href="/"><span>⌂</span>最新一期</Link>
        <a href="#archive-index"><span>◆</span>歷史清單</a>
        <a href="#archive-progress"><span>✓</span>閱讀進度</a>
      </nav>

      <section className="archive-hero" id="top">
        <div className="grid-noise" aria-hidden="true" />
        <div>
          <p className="eyebrow">RESEARCH ARCHIVE · SINCE {allWeeks[0]}</p>
          <h1>歷史<span>閱讀資料庫</span></h1>
          <p>
            保存過往每週入選內容，與最新一期分開管理。可依主題、判定與關鍵字查詢，
            並直接開啟原始來源或 PDF。
          </p>
          <Link className="secondary-button" href="/">← 返回最新一期</Link>
        </div>
        <div className="archive-stat" aria-label="歷史資料統計">
          <b>{String(archiveReadings.length).padStart(2, "0")}</b>
          <span>ARCHIVED READINGS</span>
          <p>{archiveDateRange}</p>
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
            <span className="week-choice" key={archiveWeek}><button className={week === archiveWeek ? "active" : ""} onClick={() => setWeek(archiveWeek)} aria-pressed={week === archiveWeek}>{archiveWeek}</button><a href={sitePath(`/week/${archiveWeek.replaceAll(".", "-")}/`)} aria-label={`開啟 ${archiveWeek} 固定網址`}>↗</a></span>
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
            {TOPIC_FILTERS.map((filter) => (
              <button
                key={filter}
                className={topic === filter ? "active" : ""}
                onClick={() => setTopic(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
          <SourceFilter value={origin} onChange={setOrigin} />
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
          <b>{week === "全部週次" ? archiveDateRange : week}</b>
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
                    #{String(reading.rank).padStart(2, "0")}
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
                  <span>{reading.kind}</span><i />{reading.date}<i />週次 {reading.week}
                </div>
                <span className={`evidence-badge evidence-${reading.evidenceLevel}`}>{reading.evidenceLevel}</span>
                <h3>{reading.title}</h3>
                <p className="card-subtitle">{reading.subtitle}</p>
                <SourceMeta reading={reading} /><CorrectionNotice reading={reading} />
                <p className="card-summary">{reading.summary}</p>
                <ScoreBreakdown reading={reading} />
                {reading.metric && (
                  <div className="metric">{reading.metric}</div>
                )}
                <div className="topic-list">
                  {reading.topics.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
                <div className="card-actions">
                  <button onClick={(event) => openReading(reading, event.currentTarget)}>
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
              {archiveCompleted.length} / {archiveReadings.length} 已完成
            </span>
          </div>
          <div className="progress-track">
            <i style={{ width: `${progress}%` }} />
          </div>
          <div className="progress-labels">
            <span>0%</span><span>歷史清單閱讀目標</span><span>100%</span>
          </div>
        </div>
      </section>

      <footer>
        <div className="brand footer-brand">
          <span className="brand-mark">研</span>
          <span>
            <strong>科技・資安・架構週讀</strong>
            <small>RESEARCH ARCHIVE</small>
          </span>
        </div>
        <p>歷史資料獨立保存 · 正體中文／臺灣慣用語</p>
        <Link href="/">返回最新一期 →</Link>
      </footer>

      {selected && (
        <div
          className="modal-backdrop"
          onMouseDown={(event) =>
            event.target === event.currentTarget && closeReading()
          }
        >
          <section
            ref={modalRef}
            className="detail-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="archive-detail-title"
          >
            <button
              className="modal-close"
              onClick={closeReading}
              aria-label="關閉摘要"
            >
              ×
            </button>
            <div className="modal-rank">
              #{String(selected.rank).padStart(2, "0")} · {selected.kind} · {selected.week}
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
              <span className={`evidence-badge evidence-${selected.evidenceLevel}`}>{selected.evidenceLevel}</span>
              {selected.topics.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
            <SourceMeta reading={selected} /><CorrectionNotice reading={selected} />
            <div className="detail-section">
              <h3>判定依據</h3>
              <ScoreBreakdown reading={selected} />
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
            <ArchitectureReview reading={selected} /><div className="modal-actions">
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
