'use client';

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { FadeIn } from "@/components/FadeIn";
import { ZoneSelector } from "@/components/ZoneSelector";
import type { Event } from "@/lib/eventsDb";

interface EventsViewProps {
  events: Event[];
  zone?: 'restaurant' | 'club';
  hideZoneSelector?: boolean;
}

export function EventsView({ events, zone = 'restaurant', hideZoneSelector = false }: EventsViewProps) {
  const searchParams = useSearchParams();
  const [activeZone, setActiveZone] = useState<'restaurant' | 'club'>(zone);

  useEffect(() => {
    const zoneParam = searchParams.get('zone');
    if (zoneParam === 'restaurant' || zoneParam === 'club') {
      setActiveZone(zoneParam);
    }
  }, [searchParams]);

  const filteredEvents = events.filter(event => event.zone === activeZone || event.zone === 'both'); 

  return (
    <div className="relative overflow-hidden">
      <section className="py-8 sm:py-12 bg-black/95 pt-24">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <FadeIn>
            <p className="text-xs uppercase tracking-[0.3em] text-[#D4AF37]">
              Evenings at Azzurri
            </p>
            <h1 className="heading-font mt-4 text-3xl font-semibold text-white sm:text-4xl">
              Upcoming Events
            </h1>
          </FadeIn>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-gradient-to-b from-black via-slate-950 to-black">
        <div className="mx-auto max-w-6xl px-4">
          {!hideZoneSelector && (
            <ZoneSelector defaultZone={activeZone} onZoneChange={setActiveZone} />
          )}

          {filteredEvents.length === 0 ? (
            <div className="text-center py-24">
              <FadeIn>
                <p className="text-sm text-zinc-500 italic">No events scheduled for the {activeZone === 'restaurant' ? 'Rooftop Restaurant' : 'Club & Lounge'} yet.</p>
              </FadeIn>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredEvents.map((event, index) => (
                <FadeIn key={event.id} delay={80 * index}>
                  <article className="card-glass mx-auto flex h-full w-full sm:w-auto sm:max-w-[280px] flex-col overflow-hidden rounded-3xl transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/80">
                    <div className="relative w-full aspect-[4/5] overflow-hidden">
                      <Image
                        src={event.imageUrl}
                        alt={event.title}
                        fill
                        className="object-contain transition-transform duration-700 hover:scale-105 bg-black/20"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    </div>
                    <div className="flex flex-1 flex-col px-5 pb-6 pt-4">
                      <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#D4AF37]">
                        {event.date}
                      </p>
                      <h2 className="mt-2 text-base font-semibold text-white">{event.title}</h2>
                      <p className="mt-2 text-xs text-zinc-400 line-clamp-2 leading-relaxed">{event.description}</p>
                      <button
                        className="bg-azzurri-blue mt-5 inline-flex items-center justify-center rounded-full px-6 py-2 text-[11px] font-bold uppercase tracking-[0.15em] text-black shadow-lg shadow-blue-500/10 transition hover:brightness-110 active:scale-95"
                        aria-label={`Learn more about ${event.title}`}
                      >
                        Learn More
                      </button>
                    </div>
                  </article>
                </FadeIn>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
