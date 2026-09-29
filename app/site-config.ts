export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
// GitHub Pages is the only deployment. For Pages builds next.config.ts sets both
// values from scripts/pages-config.mjs; the fallbacks only serve `next dev`.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://chinchiang.github.io/WeeklySecurityResearch";
export const sitePath = (path: string) => `${BASE_PATH}${path}`;
