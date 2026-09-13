import type { Metadata } from "next";
import Link from "next/link";

// A 404 must not inherit the homepage canonical from the root layout, or
// arbitrary unknown URLs would all claim to be canonical pages of this site.
export const metadata: Metadata = {
  title: "找不到頁面｜科技・資安・架構週讀",
  robots: { index: false, follow: false },
  alternates: { canonical: null },
};

export default function NotFound() {
  return (
    <main className="not-found">
      <h1>找不到頁面</h1>
      <p>這個網址不存在，或該週次尚未發布。</p>
      <p><Link href="/">回到最新一期</Link> · <Link href="/archive">全部歷史</Link></p>
    </main>
  );
}
