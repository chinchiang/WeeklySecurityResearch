import type { NextConfig } from "next";
const pages = process.env.GITHUB_PAGES === "true";
const nextConfig: NextConfig = pages ? {
  output: "export",
  basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? "/WeeklySecurityReaseach",
  trailingSlash: true,
  images: { unoptimized: true },
} : {};
export default nextConfig;
