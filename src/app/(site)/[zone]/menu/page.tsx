import { getSiteContent } from "@/lib/siteContent";
import { Metadata } from "next";
import { MenuView } from "@/components/MenuView";

export const metadata: Metadata = {
  title: "Our Menu | Azzurri",
  description: "Browse the exquisite culinary offerings and signature dishes at Azzurri.",
};

export const dynamic = "force-dynamic";

export default async function MenuPage({ params }: { params: { zone: string } }) {
  const content = await getSiteContent();

  return <MenuView content={content} zone={params.zone as 'restaurant' | 'club'} />;
}

