"use client";

import {
  DEEP_REVIEW_THRESHOLD,
  editorialMethod,
  isRetracted,
  weightedScore,
  type Reading,
} from "../data/readings";

/** 公開每一筆的三軸分數與加權總分，讓判定可逐項覆核。 */
export function ScoreBreakdown({ reading }: { reading: Reading }) {
  return (
    <dl className="score-breakdown" aria-label={`${reading.title} 的評鑑分數`}>
      {editorialMethod.rubric.map((axis) => (
        <div key={axis.key}>
          <dt>{axis.axis}</dt>
          <dd>{reading.scores[axis.key]}<small>/3</small></dd>
        </div>
      ))}
      <div className="score-total">
        <dt>加權總分</dt>
        <dd>{weightedScore(reading.scores).toFixed(2)}<small>／門檻 {DEEP_REVIEW_THRESHOLD.toFixed(2)}</small></dd>
      </div>
    </dl>
  );
}

/** 撤稿、更正或被取代時顯示；項目本身一律保留，不從清單移除。 */
export function CorrectionNotice({ reading }: { reading: Reading }) {
  const corrections = reading.corrections ?? [];
  if (!corrections.length) return null;

  return (
    <div className={`correction-notice ${isRetracted(reading) ? "retracted" : ""}`} role="note">
      {corrections.map((correction) => (
        <p key={`${correction.date}-${correction.type}`}>
          <b>{correction.type}</b>
          <span>{correction.date}</span>
          {correction.note}
          {correction.source && (
            <a href={correction.source} target="_blank" rel="noreferrer">說明 ↗</a>
          )}
        </p>
      ))}
    </div>
  );
}
