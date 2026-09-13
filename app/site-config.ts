export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
// GitHub Pages is the canonical home. The Worker build keeps serving its own
// routes at "/", but its canonical, feed and sitemap URLs point here so search
// engines and subscribers converge on one address.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://chinchiang.github.io/WeeklySecurityReaseach";
export const sitePath = (path: string) => `${BASE_PATH}${path}`;
