import type { Reading } from "../data/readings";

export function ArchitectureReview({ reading }: { reading: Reading }) {
  if (!reading.spotlight) return null;
  return <div className="spotlight-detail">
    <h3>Enterprise Security Architecture Spotlight</h3>
    {reading.spotlight.map(({ heading, text }) => <section key={heading}>
      <h4>{heading}</h4>
      <p>{text.split(/(https:\/\/[^\s；。]+)/g).map((part, index) => part.startsWith("https://") ? <a key={index} href={part} target="_blank" rel="noreferrer">{part}</a> : part)}</p>
    </section>)}
  </div>;
}
