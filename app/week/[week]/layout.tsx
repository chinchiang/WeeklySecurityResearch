import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { allWeeks } from "../../data/readings";

type WeekLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ week: string }>;
};

const weekSlugs = new Set(allWeeks.map((week) => week.replaceAll(".", "-")));

export async function generateMetadata({ params }: Omit<WeekLayoutProps, "children">): Promise<Metadata> {
  const { week } = await params;
  const decodedWeek = decodeURIComponent(week);
  // Unknown slugs must 404 instead of rendering reflected text under a
  // self-referencing canonical, which would let arbitrary strings be indexed
  // as pages of this site.
  if (!weekSlugs.has(decodedWeek)) notFound();
  const canonicalWeek = encodeURIComponent(decodedWeek);
  const displayWeek = decodedWeek.replaceAll("-", ".");
  const title = `${displayWeek} 必讀清單｜Manufacturing AI Security`;
  const description = `${displayWeek} 製造業 AI Security 固定週次精選、查核摘要與原始來源。`;

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

export default function WeekLayout({ children }: WeekLayoutProps) {
  return children;
}
