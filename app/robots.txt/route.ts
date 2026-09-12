import { SITE_URL as SITE } from "../site-config";
export const dynamic = "force-static";

export async function GET() {
  return new Response(`User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`, { headers: { "content-type": "text/plain; charset=utf-8" } });
}
