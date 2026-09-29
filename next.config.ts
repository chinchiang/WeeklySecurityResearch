import type { NextConfig } from "next";
import { pagesConfig } from "./scripts/pages-config.mjs";
const pages = process.env.GITHUB_PAGES === "true";
// One source for the base path: Next's basePath and the NEXT_PUBLIC_* values
// read by app/site-config.ts must agree, or every sitePath() link breaks.
const { base, site } = pagesConfig();
const nextConfig: NextConfig = pages ? {
  output: "export",
  basePath: base,
  trailingSlash: true,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE_PATH: base, NEXT_PUBLIC_SITE_URL: site },
} : {};
export default nextConfig;
