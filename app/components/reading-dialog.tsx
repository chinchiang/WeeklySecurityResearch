"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArchitectureReview } from "./architecture-review";
import { CorrectionNotice, ScoreBreakdown } from "./reading-meta";
import { SourceMeta } from "./source-meta";
import type { Reading } from "../data/readings";

const FOCUSABLE = 'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * 摘要視窗的開關狀態，與網址的 #reading-<id> 同步：開啟時寫入，關閉時移除，
 * 直接帶 hash 進站或 hash 改變時開啟對應讀物。關閉後焦點回到開啟它的按鈕；
 * 以網址開啟、沒有觸發按鈕時回到該篇卡片（id 為 reading-<id>-card）。
 * `elsewhere` 對應不在本頁的讀物 ID 與其所在頁面，讓換期後的舊分享連結仍能開到該篇。
 */
export function useReadingDialog(readings: readonly Reading[], elsewhere?: Readonly<Record<number, string>>) {
  const [selected, setSelected] = useState<Reading | null>(null);
  const lastTriggerRef = useRef<HTMLElement | null>(null);
  const selectedIdRef = useRef<number | null>(null);

  const openReading = useCallback((reading: Reading, trigger?: HTMLElement) => {
    lastTriggerRef.current = trigger ?? document.activeElement as HTMLElement;
    selectedIdRef.current = reading.id;
    setSelected(reading);
    window.history.replaceState(null, "", `#reading-${reading.id}`);
  }, []);

  const closeReading = useCallback(() => {
    setSelected(null);
    if (window.location.hash.startsWith("#reading-")) {
      window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    }
    const trigger = lastTriggerRef.current;
    const card = document.getElementById(`reading-${selectedIdRef.current}-card`);
    window.requestAnimationFrame(() => (trigger?.isConnected ? trigger : card?.querySelector<HTMLElement>("button"))?.focus());
  }, []);

  useEffect(() => {
    const syncFromHash = () => {
      const match = window.location.hash.match(/^#reading-(\d+)$/);
      if (!match) return;
      const id = Number(match[1]);
      const reading = readings.find((item) => item.id === id);
      if (reading) {
        lastTriggerRef.current = null;
        selectedIdRef.current = id;
        setSelected(reading);
        return;
      }
      const target = elsewhere?.[id];
      if (target) window.location.replace(target);
    };
    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, [readings, elsewhere]);

  return { selected, openReading, closeReading };
}

/** 讀物摘要的強制回應視窗：焦點鎖在視窗內、Esc 或點背景關閉、開啟期間鎖住頁面捲動。 */
export function ReadingDialog({
  reading,
  titleId,
  context,
  scoreNote,
  isDone,
  onToggleComplete,
  onClose,
}: {
  reading: Reading;
  titleId: string;
  /** 編號後的第三段，例如首頁的批次或歷史資料庫的週次。 */
  context: string;
  scoreNote?: string;
  isDone: boolean;
  onToggleComplete: () => void;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const focusable = () => Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((element) => !element.hasAttribute("disabled"));
    focusable()[0]?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.setProperty("overflow", "hidden");
    // Listen on the document: clicking the dialog's text moves focus to <body>,
    // and keys pressed then never pass through the dialog element.
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      const items = focusable();
      if (!items.length) return;
      const first = items[0];
      const last = items.at(-1)!;
      if (!dialog.contains(document.activeElement)) { event.preventDefault(); (event.shiftKey ? last : first).focus(); return; }
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.setProperty("overflow", previousOverflow);
    };
  }, [reading, onClose]);

  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section ref={dialogRef} className="detail-modal" role="dialog" aria-modal="true" tabIndex={-1} aria-labelledby={titleId}>
        <button className="modal-close" onClick={onClose} aria-label="關閉摘要">×</button>
        <div className="modal-rank">#{String(reading.rank).padStart(2, "0")} · {reading.kind} · {context}</div>
        <h2 id={titleId}>{reading.title}</h2>
        <p className="modal-subtitle">{reading.subtitle}</p>
        <div className="modal-meta"><span>{reading.date}</span><i />{reading.authors}</div>
        <div className="modal-tags">
          <span className={reading.decision === "深入審閱" ? "deep" : "select"}>{reading.decision}</span>
          <span className={`evidence-badge evidence-${reading.evidenceLevel}`}>{reading.evidenceLevel}</span>
          {reading.topics.map((item) => <span key={item}>{item}</span>)}
        </div>
        <SourceMeta reading={reading} /><CorrectionNotice reading={reading} />
        <div className="detail-section">
          <h3>判定依據</h3>
          <ScoreBreakdown reading={reading} />
          {scoreNote && <p className="score-note">{scoreNote}</p>}
        </div>
        <div className="detail-section">
          <h3>核心摘要</h3><p>{reading.summary}</p>
        </div>
        <div className="detail-section">
          <h3>主要發現</h3>
          <ul>{reading.findings.map((finding) => <li key={finding}>{finding}</li>)}</ul>
        </div>
        <div className="detail-grid">
          <article><h3>製造業實務關聯</h3><p>{reading.relevance}</p></article>
          <article><h3>建議控制／行動</h3><p>{reading.action}</p></article>
        </div>
        {reading.crossCheck && <div className="cross-check"><b>交叉核實</b><p>{reading.crossCheck}</p></div>}
        <div className="caveat"><b>查核注意事項</b><p>{reading.caveat}</p></div>
        <ArchitectureReview reading={reading} /><div className="modal-actions">
          <a className="primary-button" href={reading.source} target="_blank" rel="noreferrer">開啟原始來源 ↗</a>
          {reading.pdf && <a className="secondary-button" href={reading.pdf} target="_blank" rel="noreferrer">下載／開啟 PDF ↓</a>}
          <button className={`reading-button ${isDone ? "done" : ""}`} onClick={onToggleComplete} aria-pressed={isDone}>
            {isDone ? "✓ 已完成閱讀" : "標記為已閱讀"}
          </button>
        </div>
      </section>
    </div>
  );
}
