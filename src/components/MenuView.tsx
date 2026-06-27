'use client';

import { FadeIn } from "@/components/FadeIn";
import { ZoneSelector } from "@/components/ZoneSelector";
import type { SiteContent } from "@/lib/siteContent";

interface MenuViewProps {
  content: SiteContent;
  zone?: 'restaurant' | 'club';
}

function isImageUrl(url: string): boolean {
  return /\.(png|jpe?g|webp|gif)($|\?|#)/i.test(url);
}

/** Cloudinary blocks direct PDF delivery; serve via same-origin proxy for iframe viewing. */
function getMenuPdfViewerUrl(pdfUrl: string): string {
  return `/api/menu-pdf?url=${encodeURIComponent(pdfUrl)}`;
}

export function MenuView({ content, zone = 'restaurant' }: MenuViewProps) {
  const activePdf = zone === 'restaurant'
    ? content.menu.restaurantPdfUrl
    : content.menu.clubPdfUrl;

  const zoneLabel = zone === 'restaurant' ? 'Restaurant' : 'Club';
  const isImage = activePdf ? isImageUrl(activePdf) : false;
  const viewerUrl = activePdf && !isImage ? getMenuPdfViewerUrl(activePdf) : activePdf;

  return (
    <div className="relative overflow-hidden">
      <section className="relative flex pt-20 pb-12 sm:pt-24 sm:pb-16 items-center justify-center bg-black/95">
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 via-zinc-950 to-black opacity-90" />
        <FadeIn className="relative z-10 px-4 text-center">
          <h1 className="heading-font text-4xl font-bold uppercase text-[#D4AF37] sm:text-5xl md:text-6xl">
            Our Menu
          </h1>
          <p className="mt-4 text-sm text-zinc-300 sm:text-base">
            Choose your experience at Azzurri.
          </p>
        </FadeIn>
      </section>

      <section className="pb-16 sm:pb-24 bg-black/90">
        <div className="mx-auto max-w-5xl px-4">
          <ZoneSelector defaultZone={zone} />

          {activePdf ? (
            <FadeIn key={zone}>
              <div className="rounded-2xl border border-zinc-700/70 bg-zinc-800/20 p-2 sm:p-4 md:p-6 backdrop-blur-sm">
                <div className="relative mx-auto w-full overflow-hidden rounded-lg border border-zinc-600/30 bg-zinc-950/80 shadow-2xl p-2 sm:p-4 animate-fade-in">
                  {isImage ? (
                    <div className="relative w-full border border-zinc-800/80 rounded-lg overflow-hidden bg-black">
                      <img
                        src={activePdf}
                        alt={`${zoneLabel} Menu`}
                        className="w-full h-auto object-contain block"
                      />
                    </div>
                  ) : (
                    <div className="relative w-full overflow-hidden rounded-lg bg-zinc-950">
                      <iframe
                        src={viewerUrl}
                        className="h-[75vh] min-h-[480px] w-full border-0 md:h-[85vh] md:min-h-[650px]"
                        title={`${zoneLabel} Menu PDF`}
                      />
                    </div>
                  )}
                </div>
                <div className="mt-8 flex justify-center">
                  <a
                    href={viewerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-azzurri-blue px-8 py-3 text-xs font-bold uppercase tracking-wider text-black transition-transform hover:scale-105 active:scale-95 shadow-xl shadow-blue-500/20"
                  >
                    Download {zoneLabel} Menu (PDF)
                  </a>
                </div>
              </div>
            </FadeIn>
          ) : (
            <FadeIn key={zone + '-empty'}>
              <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/30 p-16 text-center backdrop-blur-sm">
                <p className="text-zinc-500 italic">
                  The {zone === 'restaurant' ? 'Rooftop Restaurant' : 'Club & Lounge'} menu will be available soon.
                </p>
              </div>
            </FadeIn>
          )}
        </div>
      </section>
    </div>
  );
}
