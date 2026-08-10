import { allWeeks, readings } from "../data/readings";

const SITE = "https://ai-security-reading-hub.c7126b9d-e01d-4117-8141-f9231c5a6686.chatgpt.site";

export async function GET() {
  const latest = [...readings].sort((a, b) => b.dateValue.localeCompare(a.dateValue))[0]?.dateValue;
  const urls = ["", "/archive", "/feed.xml", ...allWeeks.map((week) => `/week/${week.replaceAll(".", "-")}`)];
  const body = urls.map((path) => `<url><loc>${SITE}${path}</loc>${latest ? `<lastmod>${latest}</lastmod>` : ""}</url>`).join("");
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</urlset>`, { headers: { "content-type": "application/xml; charset=utf-8" } });
}
