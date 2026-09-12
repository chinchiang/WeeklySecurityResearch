import type { Metadata } from "next";
import { SITE_URL, sitePath } from "./site-config";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL + "/"),
  title: "Manufacturing AI Security 必讀清單",
  description: "製造業 AI Security 每週精選與歷史閱讀資料庫。",
  // Route segments that need their own canonical (/archive, /week/[week])
  // override these; the values here apply to the homepage.
  alternates: {
    canonical: "/",
    types: { "application/atom+xml": "/feed.xml" },
  },
  openGraph: {
    type: "website",
    locale: "zh_TW",
    url: "/",
    siteName: "Manufacturing AI Security 必讀清單",
    title: "Manufacturing AI Security 必讀清單",
    description: "具證據等級、查核限制與製造業實務映射的 AI Security 每週精選。",
  },
  twitter: {
    card: "summary_large_image",
    title: "Manufacturing AI Security 必讀清單",
    description: "製造業 AI Security 每週精選、查核摘要與固定週次資料庫。",
  },
  robots: { index: true, follow: true },
  other: {
    "codex-preview": "development",
  },
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
