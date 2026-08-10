import type { Metadata } from "next";
import { Geist, Noto_Sans_TC } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const notoSansTC = Noto_Sans_TC({
  variable: "--font-noto-sans-tc",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ai-security-reading-hub.c7126b9d-e01d-4117-8141-f9231c5a6686.chatgpt.site"),
  title: "Manufacturing AI Security 必讀清單",
  description: "製造業 AI Security 每週精選與歷史閱讀資料庫。",
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
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
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
        className={`${geistSans.variable} ${notoSansTC.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
