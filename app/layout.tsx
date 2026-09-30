import type { Metadata } from "next";
import { SITE_URL, sitePath } from "./site-config";
import { SITE_NAME, socialMetadata } from "./site-metadata";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL + "/"),
  title: SITE_NAME,
  description: "製造業科技、資安與架構每週精選與歷史閱讀資料庫。",
  // Route segments that need their own canonical (/archive, /week/[week])
  // override these; the values here apply to the homepage.
  alternates: {
    canonical: "/",
    types: { "application/atom+xml": "/feed.xml" },
  },
  ...socialMetadata({
    url: "/",
    title: SITE_NAME,
    description: "具證據等級、查核限制與製造業實務映射的 AI Security 每週精選。",
  }),
  robots: { index: true, follow: true },
  icons: {
    icon: sitePath("/favicon.svg"),
    shortcut: sitePath("/favicon.svg"),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant">
      <body
        className="antialiased"
      >
        {children}
      </body>
    </html>
  );
}
