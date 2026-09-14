import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { allWeeks } from "../../data/readings";

type WeekLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ week: string }>;
};

const weekSlugs = new Set(allWeeks.map((week) => week.replaceAll(".", "-")));

export function generateStaticParams() {
  return allWeeks.map((week) => ({ week: week.replaceAll(".", "-") }));
}

export async function generateMetadata({ params }: Omit<WeekLayoutProps, "children">): Promise<Metadata> {
  const { week } = await params;
  const decodedWeek = decodeURIComponent(week);
  // Unknown slugs are rejected by WeekLayout below. Next.js streams metadata,
  // so a notFound() thrown here would not reliably become a 404; it only has
  // to avoid reflecting the slug or declaring a canonical for a page that
  // does not exist.
  if (!weekSlugs.has(decodedWeek)) {
    return { title: "找不到週次", robots: { index: false, follow: false }, alternates: { canonical: null } };
  }
  const canonicalWeek = encodeURIComponent(decodedWeek);
  const displayWeek = decodedWeek.replaceAll("-", ".");
  const title = `${displayWeek} 必讀清單｜科技・資安・架構週讀`;
  const description = `${displayWeek} 製造業科技、資安與架構固定週次精選、查核摘要與原始來源。`;

  return {
    title,
    description,
    alternates: { canonical: `/week/${canonicalWeek}` },
    openGraph: {
      url: `/week/${canonicalWeek}`,
      title,
      description,
    },
  };
}

export default async function WeekLayout({ children, params }: WeekLayoutProps) {
  const { week } = await params;
  // Unknown slugs must 404 instead of rendering reflected text under a
  // self-referencing canonical, which would let arbitrary strings be indexed
  // as pages of this site. Throwing from the layout (a server component)
  // is what yields the HTTP 404 status; see generateMetadata above.
  if (!weekSlugs.has(decodeURIComponent(week))) notFound();
  return children;
}
