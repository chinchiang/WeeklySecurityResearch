import { allWeeks, feedWeeks, readings, type Reading } from "../data/readings";

import { SITE_URL as SITE } from "../site-config";
export const dynamic = "force-static";

const xml = (value: string) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const slug = (week: string) => week.replaceAll(".", "-");
const stamp = (date: string) => `${date}T00:00:00+08:00`;

/**
 * 修訂發生時一併更新 entry 的 updated，讓已訂閱的讀者會再次看到該筆，
 * 而不是只有回到網站的人才知道它被撤稿或更正。
 */
function entryUpdated(reading: Reading) {
  const latestCorrection = (reading.corrections ?? [])
    .map((correction) => slug(correction.date))
    .sort()
    .at(-1);
  return latestCorrection && latestCorrection > reading.dateValue ? latestCorrection : reading.dateValue;
}

function entrySummary(reading: Reading) {
  const corrections = reading.corrections ?? [];
  const prefix = corrections.map((correction) => `【${correction.type}】${correction.note}`).join(" ");
  return `${prefix ? `${prefix} ` : ""}${reading.decision}｜${reading.summary}`;
}

export async function GET() {
  const weeks = feedWeeks;
  const feedReadings = weeks.flatMap((week) =>
    readings.filter((reading) => reading.week === week).sort((a, b) => a.rank - b.rank),
  );

  const entries = feedReadings.map((reading) => {
    // Each entry links to its own week, not to the current one.
    const permalink = `${SITE}/week/${slug(reading.week)}#reading-${reading.id}`;
    return `
    <entry>
      <id>${permalink}</id>
      <title>${xml(reading.title)}</title>
      <link href="${xml(reading.source)}" rel="alternate" />
      <link href="${permalink}" rel="related" />
      <updated>${stamp(entryUpdated(reading))}</updated>
      <summary>${xml(entrySummary(reading))}</summary>
    </entry>`;
  }).join("");

  const updated = stamp(
    feedReadings.map(entryUpdated).sort().at(-1) ?? slug(weeks[0] ?? allWeeks.at(-1) ?? ""),
  );

  return new Response(
    `<?xml version="1.0" encoding="utf-8"?><feed xmlns="http://www.w3.org/2005/Atom"><id>${SITE}/</id><title>Manufacturing AI Security 必讀清單</title><link href="${SITE}/feed.xml" rel="self"/><link href="${SITE}/"/><updated>${updated}</updated><subtitle>製造業 AI Security 每週精選與查核摘要（最近 ${weeks.length} 期）</subtitle>${entries}</feed>`,
    { headers: { "content-type": "application/atom+xml; charset=utf-8", "cache-control": "public, max-age=3600" } },
  );
}
