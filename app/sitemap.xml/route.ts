import { allWeeks, readings } from "../data/readings";

import { SITE_URL as SITE } from "../site-config";
export const dynamic = "force-static";

export async function GET() {
  const latest = [...readings].sort((a, b) => b.dateValue.localeCompare(a.dateValue))[0]?.dateValue;
  const urls = ["", "/archive", "/feed.xml", ...allWeeks.map((week) => `/week/${week.replaceAll(".", "-")}`)];
  const body = urls.map((path) => `<url><loc>${SITE}${path}</loc>${latest ? `<lastmod>${latest}</lastmod>` : ""}</url>`).join("");
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</urlset>`, { headers: { "content-type": "application/xml; charset=utf-8" } });
}
