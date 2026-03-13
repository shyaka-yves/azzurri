'use client';

import { useState } from "react";
import { FadeIn } from "@/components/FadeIn";
import { ZoneSelector } from "@/components/ZoneSelector";
import type { SiteContent } from "@/lib/siteContent";

interface MenuViewProps {
  content: SiteContent;
}

export function MenuView({ content }: MenuViewProps) {
  const [activeZone, setActiveZone] = useState<'restaurant' | 'club'>('restaurant');

  const activePdf = activeZone === 'restaurant' 
    ? content.menu.restaurantPdfUrl 
    : content.menu.clubPdfUrl;

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
          <ZoneSelector activeZone={activeZone} onZoneChange={setActiveZone} />

          {activePdf ? (
            <FadeIn key={activeZone}>
              <div className="rounded-2xl border border-zinc-700/70 bg-zinc-800/20 p-2 sm:p-4 md:p-6 backdrop-blur-sm">
                <div className="relative mx-auto w-full overflow-hidden rounded-lg border border-zinc-600/30 bg-white shadow-2xl">
                  <iframe
                    src={`${activePdf}#view=Fit`}
                    className="h-[50vh] min-h-[500px] w-full rounded-lg md:h-[80vh] md:min-h-[600px]"
                    title={`${activeZone} Menu PDF`}
                  />
                </div>
                <div className="mt-8 flex justify-center">
                  <a
                    href={activePdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-azzurri-blue px-8 py-3 text-xs font-bold uppercase tracking-wider text-black transition-transform hover:scale-105 active:scale-95 shadow-xl shadow-blue-500/20"
                  >
                    Download {activeZone === 'restaurant' ? 'Restaurant' : 'Club'} Menu (PDF)
                  </a>
                </div>
              </div>
            </FadeIn>
          ) : (
            <FadeIn key={activeZone + '-empty'}>
              <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/30 p-16 text-center backdrop-blur-sm">
                <p className="text-zinc-500 italic">
                  The {activeZone === 'restaurant' ? 'Rooftop Restaurant' : 'Club & Lounge'} menu will be available soon.
                </p>
              </div>
            </FadeIn>
          )}
        </div>
      </section>
    </div>
  );
}
