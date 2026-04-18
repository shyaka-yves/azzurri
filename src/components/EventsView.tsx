'use client';

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { FadeIn } from "@/components/FadeIn";
import { ZoneSelector } from "@/components/ZoneSelector";
import { EventCard } from "@/components/EventCard";
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
                  <EventCard
                    title={event.title}
                    description={event.description}
                    date={event.date}
                    imageUrl={event.imageUrl}
                  />
                </FadeIn>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
