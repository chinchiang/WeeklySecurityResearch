"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { latestSocialEdition } from "./data/social-latest.generated";

import { CorrectionNotice, ScoreBreakdown } from "./components/reading-meta";
import {
  CURRENT_WEEK,
  TOPIC_FILTERS,
  correctionLog,
  currentEditorial,
  currentReadings,
  currentStats,
  editorialMethod,
  isRetracted,
  priorityReading,
  readingSearchText,
  type Reading,
} from "./data/readings";
function Mark({ children }: { children: React.ReactNode }) {
  return <span className="mark">{children}</span>;
}

export default function Home() {
  const [topic, setTopic] = useState("全部");
  const [decision, setDecision] = useState("全部判定");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("priority");
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
    if (window.location.hash.startsWith("#reading-")) {
      window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    }
    window.requestAnimationFrame(() => lastTriggerRef.current?.focus());
  }

  useEffect(() => {
    const syncFromHash = () => {
      const match = window.location.hash.match(/^#reading-(\d+)$/);
      if (!match) return;
      const reading = currentReadings.find((item) => item.id === Number(match[1]));
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
      if (event.key === "Escape") {
        event.preventDefault();
        closeReading();
        return;
      }
      if (event.key !== "Tab") return;
      const items = focusable();
      if (!items.length) return;
      const first = items[0];
      const last = items.at(-1)!;
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
    const result = currentReadings.filter((reading) => {
      const matchesTopic = topic === "全部" || reading.topics.includes(topic);
      const matchesDecision =
        decision === "全部判定" || reading.decision === decision;
      return matchesTopic && matchesDecision && readingSearchText(reading).includes(normalized);
    });

    return result.sort((a, b) =>
      sort === "newest"
        ? b.dateValue.localeCompare(a.dateValue)
        : a.rank - b.rank,
    );
  }, [decision, query, sort, topic]);

  const toggleComplete = (id: number) => {
    setCompleted((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  };

  const currentCompleted = completed.filter((id) =>
    currentReadings.some((reading) => reading.id === id),
  );
  const progress = currentReadings.length ? Math.round((currentCompleted.length / currentReadings.length) * 100) : 0;
  const deepRate = currentStats.total ? Math.round((currentStats.deep / currentStats.total) * 100) : 0;
  const evidenceCount = new Set(currentReadings.map((reading) => reading.evidenceLevel)).size;
  const topicCounts = TOPIC_FILTERS.slice(1).map((item) => ({
    topic: item,
    count: currentReadings.filter((reading) => reading.topics.includes(item)).length,
  })).filter((item) => item.count > 0).sort((a, b) => b.count - a.count);
  const socialReadyCount = latestSocialEdition.readyCount;

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="回到頁首">
          <span className="brand-mark">AI</span>
          <span>
            <strong>Manufacturing AI Security</strong>
            <small>READING INTELLIGENCE HUB</small>
          </span>
        </a>
        <a className="mobile-history-link" href="/archive">過去必讀</a>
        <nav aria-label="主要導覽">
          <a href="#weekly">本週精選</a>
          <a href="#index">主題索引</a>
          <a href="#progress">閱讀進度</a>
          <a href="/archive">歷史資料</a>
          <a href="/social-content/index.html">社群內容</a>
        </nav>
        <a className="live-state" href="#verification"><i /> VERIFIED SOURCES · 定義</a>
      </header>

      <nav className="mobile-dock" aria-label="手機快捷導覽">
        <a href="#top"><span>⌂</span>首頁</a>
        <a href="#weekly"><span>◆</span>本週必讀</a>
        <a href="/archive"><span>▤</span>歷史清單</a>
      </nav>

      <section className="hero" id="top">
        <div className="grid-noise" aria-hidden="true" />
        <div className="hero-copy">
          <p className="eyebrow">WEEKLY INTELLIGENCE · {CURRENT_WEEK}</p>
          <h1>AI Security <span>必讀清單</span></h1>
          <p className="hero-subtitle">
            聚焦製造業 AI Security、DSPM、DLP、Data Lineage、DDR
            與 AI System Threat Modeling
          </p>
          <figure className="hero-character mobile-sindy" aria-label="AI 資安分析師 Sindy">
            <img
              src="/assets/sindy-analyst-v2.png"
              alt="Sindy，成年漫畫風 AI 資安分析師，身穿黑藍科技服裝與盾徽披風"
              fetchPriority="high"
            />
            <figcaption>
              <i />
              <span><b>Sindy</b><small>AI Security Analyst</small></span>
            </figcaption>
          </figure>
          <div className="kpi-row" aria-label="本週清單統計">
            <div className="kpi"><b>{String(currentStats.total).padStart(2, "0")}</b><span>本週入選</span><i>{currentStats.new} NEW · {currentStats.catchUp} CATCH-UP</i></div>
            <div className="kpi purple"><b>{String(currentStats.deep).padStart(2, "0")}</b><span>深入審閱</span><i>HIGH PRIORITY</i></div>
            <div className="kpi blue"><b>{String(currentStats.selective).padStart(2, "0")}</b><span>選讀</span><i>SELECTIVE</i></div>
          </div>
          <a className="social-content-cta" href="/social-content/index.html">
            <span><b>每週社群內容創意</b><small>AI Governance · AI Security · Electronic Manufacturing</small></span>
            <i>{socialReadyCount} READY POSTS</i>
            <strong>→</strong>
          </a>
        </div>

        <figure className="hero-character desktop-sindy" aria-label="AI 資安分析師 Sindy">
          <img
            src="/assets/sindy-analyst-v2.png"
            alt="Sindy，成年漫畫風 AI 資安分析師，身穿黑藍科技服裝與盾徽披風"
            fetchPriority="high"
          />
          <figcaption>
            <i />
            <span><b>Sindy</b><small>AI Security Analyst</small></span>
          </figcaption>
        </figure>

        <div className="hero-intel" aria-label="由本週資料計算的統計摘要">
          <div className="intel-head"><span>DATA-DERIVED SNAPSHOT</span><i /></div>
          <div className="posture-row">
            <div className="donut" style={{ "--deep-rate": `${deepRate}%` } as React.CSSProperties}><span>{deepRate}%</span><small>深入審閱</small></div>
            <div className="posture-stats">
              <p><span>本週入選</span><b>{currentStats.total}</b></p>
              <p><span>證據類型</span><b>{evidenceCount}</b></p>
              <p><span>涵蓋主題</span><b>{topicCounts.length}</b></p>
            </div>
          </div>
          <div className="trend-head"><span>TOPIC DISTRIBUTION</span><b>{currentStats.total} READINGS</b></div>
          <div className="topic-signal">
            {topicCounts.slice(0, 4).map((item) => <p key={item.topic}><span>{item.topic}</span><i><b style={{ width: `${Math.round(item.count / currentStats.total * 100)}%` }} /></i><strong>{item.count}</strong></p>)}
          </div>
        </div>

        <div className="threat-route" aria-hidden="true">
          <span className="route-node n1" />
          <span className="route-node n2" />
          <span className="route-node n3" />
          <span className="route-node n4" />
          <i className="route-line l1" />
          <i className="route-line l2" />
          <i className="route-line l3" />
        </div>
      </section>

      <section className="featured" id="weekly">
        <div className="section-heading">
          <div>
            <p className="eyebrow">PRIORITY TARGET · #01</p>
            <h2>本週最高優先閱讀</h2>
          </div>
          <span className="verified-badge">✓ 原始來源已確認</span>
        </div>
        <article className="featured-card">
          <div className="rank-panel"><b>#01</b><small>CRITICAL READ</small></div>
          <div className="featured-copy">
            <div className="meta-line"><span>{priorityReading.evidenceLevel}</span><i />{priorityReading.date}<i />{priorityReading.sourceLabel}</div>
            <h3>{priorityReading.title}</h3>
            <p className="featured-subtitle">{priorityReading.subtitle}</p>
            <p className="featured-summary">{priorityReading.summary}</p>
            <div className="featured-actions">
              <button className="primary-button" onClick={(event) => openReading(priorityReading, event.currentTarget)}>
                閱讀摘要 <span>→</span>
              </button>
              <a className="secondary-button" href={priorityReading.source} target="_blank" rel="noreferrer">
                原始論文 ↗
              </a>
              {priorityReading.pdf && <a className="text-link" href={priorityReading.pdf} target="_blank" rel="noreferrer">PDF ↓</a>}
            </div>
          </div>
          <div className="lifecycle-map" aria-label="搜尋代理證據鏈劫持生命週期">
            <div className="risk-core"><span>!</span><small>RISK</small></div>
            <div className="stage-row">
              {[
                ["01", "Query"],
                ["02", "Rank"],
                ["03", "Retrieve"],
                ["04", "Corroborate"],
                ["05", "Decide"],
              ].map(([num, label], index) => (
                <div className="stage" key={label}>
                  <span>{num}</span><small>{label}</small>{index < 4 && <i>→</i>}
                </div>
              ))}
            </div>
            <div className="map-caption">COORDINATED EVIDENCE-CHAIN HIJACK</div>
          </div>
        </article>
      </section>

      <section className="library" id="index">
        <div className="section-heading">
          <div>
            <p className="eyebrow">CURATED RESEARCH LIBRARY</p>
            <h2>完整必讀名單</h2>
          </div>
          <p className="result-count">顯示 <b>{visibleReadings.length}</b> / {currentReadings.length} 項 · <a href="/archive">查看歷史資料 →</a></p>
        </div>

        <div className="control-panel">
          <label className="search-box">
            <span>⌕</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="搜尋論文、作者、控制或風險…"
              aria-label="搜尋閱讀清單"
            />
            {query && <button onClick={() => setQuery("")} aria-label="清除搜尋">×</button>}
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
          <select value={decision} onChange={(event) => setDecision(event.target.value)} aria-label="判定篩選">
            <option>全部判定</option>
            <option>深入審閱</option>
            <option>選讀</option>
          </select>
          <select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="排序方式">
            <option value="priority">依優先順序</option>
            <option value="newest">依發布日期</option>
          </select>
        </div>

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
                <div className="card-kind"><span>{reading.kind}</span><i />{reading.date}<i />{reading.batch}</div>
                <span className={`evidence-badge evidence-${reading.evidenceLevel}`}>{reading.evidenceLevel}</span>
                <h3>{reading.title}</h3>
                <p className="card-subtitle">{reading.subtitle}</p>
                <CorrectionNotice reading={reading} />
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
                >
                  <span>{isDone ? "✓" : ""}</span>{isDone ? "已閱讀" : "標記為已閱讀"}
                </button>
              </article>
            );
          })}
        </div>
        {visibleReadings.length === 0 && (
          <div className="empty-state"><b>NO MATCHING INTELLIGENCE</b><p>沒有符合目前條件的資料，請調整搜尋或篩選條件。</p></div>
        )}
        {currentEditorial.skipped.length > 0 && (
          <div className="method-note">
            <Mark>本週略過</Mark>{" "}
            {currentEditorial.skipped.map((item, index) => <span key={item.title}>{index > 0 && "；"}<a href={item.source} target="_blank" rel="noreferrer">{item.title}</a>：{item.reason}</span>)}
          </div>
        )}
      </section>

      <section className="progress-section" id="progress">
        <div>
          <p className="eyebrow">READING OPERATIONS</p>
          <h2>本週閱讀進度</h2>
          <p>進度只儲存在目前瀏覽器，不會傳送到外部服務。</p>
        </div>
        <div className="progress-console">
          <div className="progress-value"><b>{progress}%</b><span>{currentCompleted.length} / {currentReadings.length} 已完成</span></div>
          <div className="progress-track"><i style={{ width: `${progress}%` }} /></div>
          <div className="progress-labels"><span>0%</span><span>閱讀目標</span><span>100%</span></div>
        </div>
        <div className="next-actions">
          <h3>建議下一步</h3>
          {/* 已撤稿的項目仍保留在清單中供追溯，但不再作為行動依據。 */}
          <ol>{[...currentReadings].filter((reading) => !isRetracted(reading)).sort((a, b) => a.rank - b.rank).slice(0, 5).map((reading, index) => <li key={reading.id}><b>{String(index + 1).padStart(2, "0")}</b><span>{reading.action}</span></li>)}</ol>
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
            <div className="rubric-row rubric-head" role="row"><span>評鑑軸</span><span>權重</span><span>深入審閱</span><span>選讀</span></div>
            {editorialMethod.rubric.map((item) => <div className="rubric-row" role="row" key={item.axis}><b>{item.axis}</b><strong>{item.weight}</strong><p>{item.deep}</p><p>{item.selective}</p></div>)}
          </div>
          <div className="ranking-rule"><b>排名邏輯</b><p>{editorialMethod.rankingRule}</p></div>
          <div className="ranking-rule"><b>更正與撤稿</b><p>{editorialMethod.correctionRule}</p></div>
        </div>
        <div className="verification-grid">
          <article><Mark>VERIFIED SOURCES 定義</Mark><h3>五項查核清單</h3><ul>{editorialMethod.verifiedChecklist.map((item) => <li key={item}>{item}</li>)}</ul></article>
          <article><Mark>候選來源範圍</Mark><h3>固定掃描範圍</h3><ul>{editorialMethod.sourceScope.map((item) => <li key={item}>{item}</li>)}</ul></article>
          <article><Mark>本週入選漏斗</Mark><h3><span>{currentEditorial.scanned ?? "未留存"}</span> 掃描 → <span>{currentEditorial.shortlisted ?? "未留存"}</span> 初篩 → <span>{currentEditorial.selected}</span> 入選</h3><p>{currentEditorial.note}</p></article>
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
                  <a href={`#reading-${reading.id}`}>{reading.title}</a>
                  <p>{correction.note}</p>
                </li>
              ))}
            </ol>
          )}
        </div>
        <div className="method-note"><Mark>判讀提醒</Mark> Preprint 的攻擊成功率尚未經獨立重現；廠商遙測僅代表其可見範圍，不能直接外推整體產業。</div>
      </section>

      <footer>
        <div className="brand footer-brand"><span className="brand-mark">AI</span><span><strong>Manufacturing AI Security</strong><small>SECURE · RELIABLE · RESPONSIBLE AI</small></span></div>
        <p>本週更新：{CURRENT_WEEK} · 正體中文／臺灣慣用語</p>
        <a href="/archive">歷史資料庫 →</a>
      </footer>

      {selected && (
        <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && closeReading()}>
          <section ref={modalRef} className="detail-modal" role="dialog" aria-modal="true" aria-labelledby="detail-title">
            <button className="modal-close" onClick={closeReading} aria-label="關閉摘要">×</button>
            <div className="modal-rank">#{String(selected.rank).padStart(2, "0")} · {selected.kind} · {selected.batch}</div>
            <h2 id="detail-title">{selected.title}</h2>
            <p className="modal-subtitle">{selected.subtitle}</p>
            <div className="modal-meta"><span>{selected.date}</span><i />{selected.authors}</div>
            <div className="modal-tags">
              <span className={selected.decision === "深入審閱" ? "deep" : "select"}>{selected.decision}</span>
              <span className={`evidence-badge evidence-${selected.evidenceLevel}`}>{selected.evidenceLevel}</span>
              {selected.topics.map((item) => <span key={item}>{item}</span>)}
            </div>
            <CorrectionNotice reading={selected} />
            <div className="detail-section">
              <h3>判定依據</h3>
              <ScoreBreakdown reading={selected} />
              <p className="score-note">{editorialMethod.decisionRule}</p>
            </div>
            <div className="detail-section">
              <h3>核心摘要</h3><p>{selected.summary}</p>
            </div>
            <div className="detail-section">
              <h3>主要發現</h3>
              <ul>{selected.findings.map((finding) => <li key={finding}>{finding}</li>)}</ul>
            </div>
            <div className="detail-grid">
              <article><h3>製造業實務關聯</h3><p>{selected.relevance}</p></article>
              <article><h3>建議控制／行動</h3><p>{selected.action}</p></article>
            </div>
            {selected.crossCheck && <div className="cross-check"><b>交叉核實</b><p>{selected.crossCheck}</p></div>}
            <div className="caveat"><b>查核注意事項</b><p>{selected.caveat}</p></div>
            <div className="modal-actions">
              <a className="primary-button" href={selected.source} target="_blank" rel="noreferrer">開啟原始來源 ↗</a>
              {selected.pdf && <a className="secondary-button" href={selected.pdf} target="_blank" rel="noreferrer">下載／開啟 PDF ↓</a>}
              <button className={`reading-button ${completed.includes(selected.id) ? "done" : ""}`} onClick={() => toggleComplete(selected.id)}>
                {completed.includes(selected.id) ? "✓ 已完成閱讀" : "標記為已閱讀"}
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
