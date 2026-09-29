import { allWeeks, readings } from "../data/readings";

import { SITE_URL as SITE } from "../site-config";
export const dynamic = "force-static";

// Locations match each page's canonical (trailingSlash export), so crawlers
// are not sent through a redirect. Each week carries its own lastmod.
const latestDate = (items: typeof readings) => items.map((reading) => reading.dateValue).sort().at(-1);

export async function GET() {
  const latest = latestDate(readings);
  const pages = [
    { path: "/", lastmod: latest },
    { path: "/archive/", lastmod: latest },
    ...allWeeks.map((week) => ({
      path: `/week/${week.replaceAll(".", "-")}/`,
      lastmod: latestDate(readings.filter((reading) => reading.week === week)),
    })),
  ];
  const body = pages.map(({ path, lastmod }) => `<url><loc>${SITE}${path}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}</url>`).join("");
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</urlset>`, { headers: { "content-type": "application/xml; charset=utf-8" } });
}
