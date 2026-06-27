'use client';

import { useState, useEffect } from "react";
import { FadeIn } from "@/components/FadeIn";
import { ZoneSelector } from "@/components/ZoneSelector";
import type { SiteContent } from "@/lib/siteContent";

interface MenuViewProps {
  content: SiteContent;
  zone?: 'restaurant' | 'club';
}

function getCloudinaryPdfPageUrl(pdfUrl: string, page: number): string | null {
  if (!pdfUrl) return null;
  if (!pdfUrl.includes("res.cloudinary.com")) return null;
  const pdfRegex = /\.pdf$/i;
  if (!pdfRegex.test(pdfUrl)) return null;

  let url = pdfUrl.replace(pdfRegex, ".jpg");
  if (url.includes("/upload/")) {
    url = url.replace("/upload/", `/upload/f_auto,q_auto,pg_${page}/`);
  }
  return url;
}

export function MenuView({ content, zone = 'restaurant' }: MenuViewProps) {
  const activePdf = zone === 'restaurant' 
    ? content.menu.restaurantPdfUrl 
    : content.menu.clubPdfUrl;

  const [loadedPages, setLoadedPages] = useState<Record<number, boolean>>({});
  const [failedPages, setFailedPages] = useState<Record<number, boolean>>({});

  useEffect(() => {
    setLoadedPages({});
    setFailedPages({});
  }, [activePdf]);

  const isCloudinary = activePdf ? (activePdf.includes("res.cloudinary.com") && /\.pdf$/i.test(activePdf)) : false;
  const isImage = activePdf ? /\.(png|jpe?g|webp)$/i.test(activePdf) : false;

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
                  {isCloudinary ? (
                    <div className="flex flex-col gap-4">
                      {Array.from({ length: 40 }, (_, i) => i + 1).map((pageNum) => {
                        const shouldRender = pageNum === 1 || loadedPages[pageNum - 1];
                        if (!shouldRender) return null;

                        const imgUrl = getCloudinaryPdfPageUrl(activePdf, pageNum);
                        if (!imgUrl) return null;

                        return (
                          <div key={pageNum} className="relative w-full border border-zinc-800/80 rounded-lg overflow-hidden bg-black">
                            <img
                              src={imgUrl}
                              alt={`${zone === 'restaurant' ? 'Restaurant' : 'Club'} Menu Page ${pageNum}`}
                              className="w-full h-auto object-contain block"
                              onLoad={() => setLoadedPages(prev => ({ ...prev, [pageNum]: true }))}
                              onError={() => setFailedPages(prev => ({ ...prev, [pageNum]: true }))}
                            />
                            {!loadedPages[pageNum] && !failedPages[pageNum] && (
                              <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/90 text-sm text-zinc-400 py-12">
                                Loading Page {pageNum}...
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : isImage ? (
                    <div className="relative w-full border border-zinc-800/80 rounded-lg overflow-hidden bg-black">
                      <img
                        src={activePdf}
                        alt={`${zone === 'restaurant' ? 'Restaurant' : 'Club'} Menu`}
                        className="w-full h-auto object-contain block"
                      />
                    </div>
                  ) : (
                    <>
                      <div className="hidden md:block">
                        <iframe
                          src={`${activePdf}#view=Fit`}
                          className="h-[50vh] min-h-[500px] w-full rounded-lg md:h-[80vh] md:min-h-[600px]"
                          title={`${zone} Menu PDF`}
                        />
                      </div>
                      <div className="block md:hidden text-center p-8">
                        <p className="text-zinc-300 text-sm mb-4">
                          The menu is available as a PDF document.
                        </p>
                        <a
                          href={activePdf}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-full bg-azzurri-blue px-6 py-3 text-xs font-bold uppercase tracking-wider text-black transition-transform hover:scale-105 active:scale-95 shadow-xl shadow-blue-500/20"
                        >
                          Open Menu (PDF)
                        </a>
                      </div>
                    </>
                  )}
                </div>
                <div className="mt-8 flex justify-center">
                  <a
                    href={activePdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-azzurri-blue px-8 py-3 text-xs font-bold uppercase tracking-wider text-black transition-transform hover:scale-105 active:scale-95 shadow-xl shadow-blue-500/20"
                  >
                    Download {zone === 'restaurant' ? 'Restaurant' : 'Club'} Menu (PDF)
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

