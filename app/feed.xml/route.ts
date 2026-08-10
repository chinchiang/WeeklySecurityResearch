import { CURRENT_WEEK, currentReadings } from "../data/readings";

const SITE = "https://ai-security-reading-hub.c7126b9d-e01d-4117-8141-f9231c5a6686.chatgpt.site";
const xml = (value: string) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");

export async function GET() {
  const updated = `${CURRENT_WEEK.replaceAll(".", "-")}T00:00:00+08:00`;
  const entries = [...currentReadings].sort((a, b) => a.rank - b.rank).map((reading) => `
    <entry>
      <id>${SITE}/week/${CURRENT_WEEK.replaceAll(".", "-")}#reading-${reading.id}</id>
      <title>${xml(reading.title)}</title>
      <link href="${xml(reading.source)}" rel="alternate" />
      <link href="${SITE}/week/${CURRENT_WEEK.replaceAll(".", "-")}#reading-${reading.id}" rel="related" />
      <updated>${reading.dateValue}T00:00:00+08:00</updated>
      <summary>${xml(`${reading.decision}｜${reading.summary}`)}</summary>
    </entry>`).join("");
  return new Response(`<?xml version="1.0" encoding="utf-8"?><feed xmlns="http://www.w3.org/2005/Atom"><id>${SITE}/</id><title>Manufacturing AI Security 必讀清單</title><link href="${SITE}/feed.xml" rel="self"/><link href="${SITE}/"/><updated>${updated}</updated><subtitle>製造業 AI Security 每週精選與查核摘要</subtitle>${entries}</feed>`, { headers: { "content-type": "application/atom+xml; charset=utf-8", "cache-control": "public, max-age=3600" } });
}
