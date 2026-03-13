import { FadeIn } from "@/components/FadeIn";
import { getSiteContent } from "@/lib/siteContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Menu | Azzurri",
  description: "Browse the exquisite culinary offerings and signature dishes at Azzurri.",
};

export const dynamic = "force-dynamic";

export default async function MenuPage() {
  const content = await getSiteContent();

  return (
    <div className="relative overflow-hidden">
      <section className="relative flex pt-20 pb-12 sm:pt-24 sm:pb-16 items-center justify-center bg-black/95">
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 via-zinc-950 to-black opacity-90" />
        <FadeIn className="relative z-10 px-4 text-center">
          <h1 className="heading-font text-4xl font-bold uppercase text-[#D4AF37] sm:text-5xl md:text-6xl">
            Our Menu
          </h1>
          <p className="mt-4 text-sm text-zinc-300 sm:text-base">
            Explore our culinary offerings.
          </p>
        </FadeIn>
      </section>

      <section className="pb-16 sm:pb-24 bg-black/90">
        <div className="mx-auto max-w-4xl px-4">
          {content.menu.pdfUrl ? (
            <FadeIn>
              <div className="rounded-2xl border border-zinc-700/70 bg-zinc-800/80 p-2 sm:p-4 md:p-6">
                <div className="relative mx-auto w-full overflow-hidden rounded-lg border border-zinc-600/50 bg-white shadow-xl">
                  <iframe
                    src={`${content.menu.pdfUrl}#view=Fit`}
                    className="h-[50vh] min-h-[500px] w-full rounded-lg md:h-[80vh] md:min-h-[600px]"
                    title="Menu PDF"
                  />
                </div>
                <div className="mt-4 flex justify-center">
                  <a
                    href={content.menu.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded border border-[#D4AF37] bg-transparent px-6 py-2.5 text-sm font-medium uppercase tracking-wide text-[#D4AF37] transition-colors hover:bg-[#D4AF37] hover:text-black"
                  >
                    Download Menu PDF
                  </a>
                </div>
              </div>
            </FadeIn>
          ) : (
            <FadeIn>
              <div className="rounded-2xl border border-zinc-700/70 bg-zinc-900/50 p-8 text-center">
                <p className="text-zinc-400">Menu PDF will be available soon.</p>
              </div>
            </FadeIn>
          )}
        </div>
      </section>
    </div>
  );
}

