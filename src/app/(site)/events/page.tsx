import Image from "next/image";
import { FadeIn } from "@/components/FadeIn";
import { getSiteContent } from "@/lib/siteContent";
import { listEvents } from "@/lib/eventsDb";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Upcoming Events | Azzurri",
  description: "Discover upcoming nightlife and dining events at Azzurri.",
};

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const events = await listEvents();

  return (
    <div className="relative overflow-hidden">
      <section className="py-8 sm:py-12 bg-black/95">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <FadeIn>
            <p className="text-xs uppercase tracking-[0.3em] text-gold">
              Evenings at Azzurri
            </p>
            <h1 className="heading-font mt-4 text-3xl font-semibold text-white sm:text-4xl">
              Upcoming Party Events
            </h1>
            <p className="mt-4 text-sm text-zinc-300 sm:text-base">
              Experience unforgettable nights with curated DJs, live performances, and tasting menus
              crafted for celebration.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-gradient-to-b from-black via-slate-950 to-black">
        <div className="mx-auto max-w-6xl px-4">
          {events.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm text-zinc-400">No events scheduled yet.</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event, index) => (
                <FadeIn key={event.id} delay={80 * index}>
                  <article className="card-glass mx-auto flex h-full w-full sm:w-auto sm:max-w-[260px] flex-col overflow-hidden rounded-3xl transition hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-black/60">
                    <div className="relative w-full aspect-[4/5] overflow-hidden">
                      <Image
                        src={event.imageUrl}
                        alt={event.title}
                        fill
                        className="object-contain transition-transform duration-700 hover:scale-105 bg-black/20"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    </div>
                    <div className="flex flex-1 flex-col px-4 pb-4 pt-3">
                      <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold">
                        {event.date}
                      </p>
                      <h2 className="mt-1.5 text-sm font-semibold text-white">{event.title}</h2>
                      <p className="mt-1.5 text-xs text-zinc-300 line-clamp-2">{event.description}</p>
                      <button
                        className="gold-gradient mt-3 inline-flex items-center justify-center rounded-full px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-black shadow-md shadow-yellow-500/25 transition hover:shadow-yellow-400/40"
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
