import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "歷史必讀清單｜Manufacturing AI Security",
  description: "瀏覽與搜尋各週製造業 AI Security 精選內容。",
  alternates: { canonical: "/archive" },
  openGraph: {
    url: "/archive",
    title: "歷史必讀清單｜Manufacturing AI Security",
    description: "瀏覽與搜尋各週製造業 AI Security 精選內容。",
  },
};

export default function ArchiveLayout({ children }: { children: React.ReactNode }) {
  return children;
}
