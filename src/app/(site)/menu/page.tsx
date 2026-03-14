import { getSiteContent } from "@/lib/siteContent";
import { Metadata } from "next";
import { MenuView } from "@/components/MenuView";

export const metadata: Metadata = {
  title: "Our Menu | Azzurri",
  description: "Browse the exquisite culinary offerings and signature dishes at Azzurri.",
};

export const dynamic = "force-dynamic";

export default async function MenuPage({ searchParams }: { searchParams: Promise<{ zone?: string }> }) {
  const [content, { zone }] = await Promise.all([getSiteContent(), searchParams]);

  return <MenuView content={content} zone={zone as 'restaurant' | 'club'} />;
}

