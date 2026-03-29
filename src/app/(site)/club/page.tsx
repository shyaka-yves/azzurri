import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { FadeIn } from "@/components/FadeIn";
import { EventsView } from "@/components/EventsView";
import { listEvents } from "@/lib/eventsDb";
import { getSiteContent } from "@/lib/siteContent";

export const metadata: Metadata = {
  title: "Azzurri | Club & Lounge",
  description: "Experience the ultimate nightlife at Azzurri Club & Lounge in Kigali.",
};

export const dynamic = "force-dynamic";

export default async function ClubPage() {
  const [content, events] = await Promise.all([
    getSiteContent(),
    listEvents()
  ]);

  return (
    <div className="relative overflow-hidden bg-black">
      {/* Hero Section */}
      <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={content.hero.mediaSrc || "/uploads/FRIDAYYY.png"}
            alt="Azzurri Club & Lounge"
            fill
            priority
            className="h-full w-full object-cover opacity-40 mix-blend-overlay"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black" />
        </div>

        <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-4 text-center mt-20">
          <FadeIn>
            <h1 className="heading-font text-5xl font-medium tracking-tight text-[#EFD077] md:text-7xl">
              Azzurri Club & Lounge
            </h1>
          </FadeIn>
          <FadeIn delay={120}>
            <p className="mt-6 max-w-2xl text-sm font-light uppercase tracking-[0.3em] text-zinc-300 md:text-base">
              The rhythm of Kigali nights
            </p>
          </FadeIn>
          <FadeIn delay={220}>
            <div className="mt-12">
              <Link
                href="/book"
                className="inline-flex items-center justify-center rounded-lg bg-azzurri-blue px-10 py-3 text-xs font-bold uppercase tracking-[0.3em] text-black transition-all hover:brightness-110 active:scale-95 shadow-2xl shadow-blue-500/10"
              >
                Book a VIP Table
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 lg:py-24 bg-black">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-16 px-6 lg:flex-row lg:gap-24">
          <FadeIn className="w-full lg:w-1/2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-zinc-900 shadow-2xl border border-white/5">
              <Image
                src="/uploads/event-2.jpg"
                alt="Azzurri Club Experience"
                fill
                className="absolute inset-0 h-full w-full object-cover opacity-90"
              />
            </div>
          </FadeIn>

          <FadeIn delay={120} className="w-full lg:w-1/2">
            <div className="space-y-10">
              <div className="space-y-4">
                <h2 className="heading-font text-4xl font-medium tracking-tight text-[#EFD077] md:text-5xl">
                  Elevate Your Night
                </h2>
                <div className="h-0.5 w-16 bg-azzurri-blue" />
              </div>

              <div className="space-y-8">
                <p className="leading-relaxed font-light text-xl lg:text-2xl text-zinc-300">
                  Step into a world where premium nightlife meets unparalleled energy. Azzurri Club & Lounge is the ultimate destination for those who seek the extraordinary.
                </p>
                <p className="leading-relaxed font-light text-base lg:text-lg text-zinc-400">
                  With world-class DJs, exclusive VIP areas, and signature cocktails crafted by expert mixologists, every night is a celebration. Whether you're here for an after-party, a special celebration, or to dance until dawn, we provide the perfect ambiance under the Kigali sky.
                </p>
              </div>

              <div className="pt-6">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-lg border border-white/30 px-8 py-3 text-xs font-bold uppercase tracking-[0.3em] text-white transition-all hover:bg-white/5 active:scale-95"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Events Section */}
      {/* We use the EventsView component with hideZoneSelector=true and zone="club" */}
      <div className="-mt-16">
        <EventsView events={events} zone="club" hideZoneSelector={true} />
      </div>

    </div>
  );
}
