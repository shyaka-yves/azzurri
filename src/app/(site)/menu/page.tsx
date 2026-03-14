import { getSiteContent } from "@/lib/siteContent";
import { Metadata } from "next";
import { MenuView } from "@/components/MenuView";

export const metadata: Metadata = {
  title: "Our Menu | Azzurri",
  description: "Browse the exquisite culinary offerings and signature dishes at Azzurri.",
};

export const dynamic = "force-dynamic";

export default async function MenuPage({ searchParams }: { searchParams: { zone?: string } }) {
  const content = await getSiteContent();

  return <MenuView content={content} zone={searchParams.zone as 'restaurant' | 'club'} />;
}

