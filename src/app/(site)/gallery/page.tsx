import { listGalleryImages } from "@/lib/galleryDb";
import { getSiteContent } from "@/lib/siteContent";
import { Metadata } from "next";
import { GalleryView } from "@/components/GalleryView";

export const metadata: Metadata = {
  title: "Gallery | Azzurri",
  description: "Explore the ambiance, dishes, and environment of Azzurri.",
};

export const dynamic = "force-dynamic";

export default async function GalleryPage({ searchParams }: { searchParams: Promise<{ zone?: string }> }) {
  const [content, galleryImages, { zone }] = await Promise.all([
    getSiteContent(),
    listGalleryImages(),
    searchParams
  ]);

  return <GalleryView content={content} galleryImages={galleryImages} zone={zone as 'restaurant' | 'club'} />;
}
