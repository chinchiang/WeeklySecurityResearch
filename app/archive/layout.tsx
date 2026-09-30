import type { Metadata } from "next";
import { SITE_NAME, socialMetadata } from "../site-metadata";

const title = `歷史必讀清單｜${SITE_NAME}`;
const description = "瀏覽與搜尋各週製造業科技、資安與架構精選內容。";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/archive" },
  ...socialMetadata({ url: "/archive", title, description }),
};

export default function ArchiveLayout({ children }: { children: React.ReactNode }) {
  return children;
}
