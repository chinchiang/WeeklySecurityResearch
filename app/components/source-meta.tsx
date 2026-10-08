import type { Reading } from "../data/readings";
import { provenanceText, sourceLabels } from "../data/provenance";

export function SourceMeta({ reading }: { reading: Reading }) {
  return <div className="source-meta"><p>{provenanceText(reading)}</p>{reading.provenance && <a href={reading.provenance.evidence} target="_blank" rel="noreferrer">來源紀錄 ↗</a>}</div>;
}
export function SourceFilter({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return <select value={value} onChange={event => onChange(event.target.value)} aria-label="產製來源篩選"><option value="all">全部產製來源</option>{Object.entries(sourceLabels).map(([id, label]) => <option value={id} key={id}>{label}</option>)}</select>;
}
