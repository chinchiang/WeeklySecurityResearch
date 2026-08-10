import type { Metadata } from "next";

type WeekLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ week: string }>;
};

export async function generateMetadata({ params }: Omit<WeekLayoutProps, "children">): Promise<Metadata> {
  const { week } = await params;
  const decodedWeek = decodeURIComponent(week);
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
