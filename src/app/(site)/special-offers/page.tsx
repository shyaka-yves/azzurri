import { FadeIn } from "@/components/FadeIn";
import { getSiteContent } from "@/lib/siteContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Special Offers | Azzurri",
  description: "View our current dining specials, packages, and seasonal offers.",
};

export const dynamic = "force-dynamic";

export default async function SpecialOffersPage() {
  const content = await getSiteContent();

  return (
    <div className="relative overflow-hidden">
      <section className="relative flex min-h-[40vh] items-center justify-center bg-black/95">
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 via-zinc-950 to-black opacity-90" />
        <FadeIn className="relative z-10 px-4 text-center">
          <h1 className="heading-font text-3xl font-bold uppercase text-azzurri-blue sm:text-4xl md:text-5xl">
            {content.specialOffers.title || "Special offers"}
          </h1>
        </FadeIn>
      </section>

      <section className="py-20 sm:py-28 bg-black/90">
        <div className="mx-auto max-w-4xl px-4">
          <FadeIn>
            {content.specialOffers.content ? (
              <div
                className="prose prose-invert max-w-none text-zinc-300 prose-headings:text-azzurri-blue prose-p:leading-relaxed prose-a:text-azzurri-blue prose-a:no-underline hover:prose-a:underline"
                dangerouslySetInnerHTML={{ __html: content.specialOffers.content }}
              />
            ) : (
              <p className="text-center text-zinc-400">Check back soon for seasonal offers and promotions.</p>
            )}
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
