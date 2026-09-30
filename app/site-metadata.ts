import type { Metadata } from "next";

export const SITE_NAME = "科技・資安・架構週讀";

// Next.js replaces a parent's openGraph/twitter object instead of merging it,
// so every route builds both from here to keep type, locale, site name and the
// share image. The image path resolves against metadataBase (the Pages base).
const OG_IMAGE = { url: "/og-image.png", width: 1200, height: 630, alt: SITE_NAME };

export function socialMetadata({ url, title, description }: { url: string; title: string; description: string }): Pick<Metadata, "openGraph" | "twitter"> {
  return {
    openGraph: { type: "website", locale: "zh_TW", siteName: SITE_NAME, url, title, description, images: [OG_IMAGE] },
    twitter: { card: "summary_large_image", title, description, images: [OG_IMAGE.url] },
  };
}
