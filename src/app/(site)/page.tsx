import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { FadeIn } from "@/components/FadeIn";
import { Testimonials } from "@/components/Testimonials";
import { BlogSection } from "@/components/BlogSection";
import { listEvents } from "@/lib/eventsDb";
import { listGalleryImages } from "@/lib/galleryDb";
import { getSiteContent } from "@/lib/siteContent";

export const metadata: Metadata = {
  title: "Azzurri | Rooftop Restaurant, Club & Lounge",
  description: "Experience the ultimate fusion of African and Asian flavors at Azzurri, Kigali's premier rooftop dining and nightlife destination.",
};

export const dynamic = "force-dynamic";



export default async function Home() {
  const [content, events, gallery] = await Promise.all([
    getSiteContent(),
    listEvents(),
    listGalleryImages()
  ]);

  const upcomingEvent = events.length > 0 ? events[0] : null;

  const displayGallery = gallery.length > 0
    ? gallery.slice(0, 6)
    : content.gallery.items.slice(0, 6).map((item, idx) => ({ id: idx, imageUrl: item.imageSrc, label: item.alt }));

  // Combine and standardize events for display
  const displayEvents = (events.length > 0
    ? events.map(e => ({
      title: e.title,
      description: e.description,
      date: e.date,
      imageSrc: e.imageUrl,
      href: "/events"
    }))
    : content.events.items.map(e => ({
      title: e.title,
      description: e.description,
      date: e.date,
      imageSrc: e.imageSrc,
      href: "/events"
    }))).slice(0, 3);

  return (
    <div className="relative overflow-hidden bg-black">
      {/* Hero */}
      <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden lg:min-h-[90vh]">
        <div className="absolute inset-0 z-0">
          {content.hero.mediaType === "video" && content.hero.mediaSrc && content.hero.mediaSrc.match(/\.(mp4|webm|ogg|mov)(\?.*)?$/i) ? (
            <video
              src={content.hero.mediaSrc}
              autoPlay
              loop
              muted
              playsInline
              className="h-full w-full object-cover opacity-60"
            />
          ) : (<Image
            src={content.hero.mediaSrc || "/uploads/FRIDAYYY.png"}
            alt="Azzurri Restaurant Ambiance"
            fill
            priority
            className="h-full w-full object-cover opacity-60"
            sizes="100vw"
          />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/80" />
        </div>

        <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-4 text-center">
          <FadeIn>
            <div className="mb-10 lg:mb-14">
              <Image
                src="/logo.png"
                alt={content.hero.brand}
                width={450}
                height={150}
                className="h-auto w-40 md:w-56 lg:w-[280px]"
                priority
              />
            </div>
          </FadeIn>

          <FadeIn delay={120}>
            <p className="max-w-3xl text-sm font-light uppercase tracking-[0.4em] text-zinc-400 md:text-base lg:text-lg">
              {content.hero.tagline}
            </p>
          </FadeIn>

          <FadeIn delay={220}>
            <div className="mt-14 flex flex-col gap-8 sm:flex-row">
              <a
                href={content.hero.primaryCtaHref}
                className="inline-flex items-center justify-center rounded-lg bg-[#FDE68A] px-14 py-4 text-xs font-bold uppercase tracking-[0.3em] text-black transition-all hover:brightness-110 active:scale-95 shadow-2xl shadow-yellow-500/10"
              >
                {content.hero.primaryCtaLabel}
              </a>
              <Link
                href={content.hero.secondaryCtaHref}
                className="inline-flex items-center justify-center rounded-lg border border-white/30 px-14 py-4 text-xs font-bold uppercase tracking-[0.4em] text-white transition-all hover:bg-white/5 active:scale-95"
              >
                {content.hero.secondaryCtaLabel}
              </Link>
            </div>
          </FadeIn>
        </div>
      </section >

      <section className="bg-black py-16">
        <div className="mx-auto max-w-6xl px-4">
          <FadeIn className="text-center mb-16">
            {upcomingEvent && (
              <div className="mb-6 flex justify-center">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#EFD077]/30 bg-[#EFD077]/5 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#EFD077]">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#EFD077] opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[#EFD077]"></span>
                  </span>
                  Upcoming Highlight
                </span>
              </div>
            )}
            <h2 className="heading-font text-5xl font-medium tracking-tight text-[#EFD077] md:text-6xl">
              {content.events.title}
            </h2>
            <p className="mt-4 text-[12px] uppercase tracking-[0.4em] text-zinc-400">
              {content.events.description}
            </p>
            <div className="h-0.5 w-12 bg-[#EFD077] mx-auto mt-8" />
          </FadeIn>

          <div className="mt-10 grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {displayEvents.map((event, index) => (
              <FadeIn key={index} delay={80 * index}>
                <article className="card-glass flex h-full flex-col overflow-hidden rounded-2xl border-white/5 transition hover:-translate-y-1">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={event.imageSrc}
                      alt={event.title}
                      fill
                      className="object-contain transition-transform duration-700 hover:scale-105 bg-black/40"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  </div>
                  <div className="flex flex-1 flex-col px-6 pb-10 pt-8">
                    <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#D4AF37]">
                      {event.date}
                    </p>
                    <h3 className="mt-4 text-2xl font-medium tracking-tight text-white group-hover:text-[#EFD077] transition-colors">
                      {event.title}
                    </h3>
                    <p className="mt-4 text-sm leading-relaxed text-zinc-400 font-light lg:text-base">{event.description}</p>
                    <Link
                      href={event.href}
                      className="mt-10 inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-[#EFD077] to-[#D4AF37] px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] text-black shadow-xl shadow-yellow-500/10 hover:brightness-110 active:scale-95 transition-all"
                      aria-label={`Learn more about ${event.title}`}
                    >
                      Learn More
                    </Link>
                  </div>
                </article>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding py-12 lg:py-16">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-16 px-6 lg:flex-row lg:gap-24">
          <FadeIn className="w-full lg:w-1/2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-zinc-900 shadow-2xl border border-white/5">
              <img
                src={content.about.imageSrc}
                alt={content.about.title}
                className="absolute inset-0 h-full w-full object-cover opacity-90"
              />
            </div>
          </FadeIn>

          <FadeIn delay={120} className="w-full lg:w-1/2">
            <div className="space-y-12">
              <div className="space-y-4">
                <div className="h-0.5 w-16 bg-[#EFD077]" />
              </div>

              <div className="space-y-10">
                {content.about.paragraphs.map((p, i) => (
                  <p key={i} className={`leading-relaxed font-light ${i === 0 ? "text-xl lg:text-2xl text-zinc-300" : "text-base lg:text-lg text-zinc-400"} ${p.includes("meaning") ? "italic" : ""}`}>
                    {p}
                  </p>
                ))}
              </div>

              <div className="flex gap-16 pt-10 border-t border-white/10">
                <div>
                  <p className="heading-font text-5xl font-semibold text-[#EFD077]">25+</p>
                  <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-400 mt-2 font-bold">Years of Excellence</p>
                </div>
                <div>
                  <p className="heading-font text-5xl font-semibold text-[#EFD077]">100+</p>
                  <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-500 mt-2 font-bold">Signature Dishes</p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="py-12 lg:py-16 bg-black">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-16 px-6 lg:flex-row-reverse lg:gap-24">
          <FadeIn className="w-full lg:w-1/2">
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-zinc-900 shadow-2xl border border-white/5 max-w-md mx-auto lg:mx-0 lg:ml-auto">
              <img
                src={content.excellence.imageSrc}
                alt={content.excellence.title}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          </FadeIn>

          <FadeIn delay={120} className="w-full lg:w-1/2">
            <div className="space-y-10">
              <div className="space-y-4">
                <h2 className="heading-font text-5xl font-medium tracking-tight text-[#EFD077] md:text-7xl">
                  {content.excellence.title}
                </h2>
                <div className="h-0.5 w-16 bg-[#EFD077]" />
              </div>

              <div className="space-y-8 text-base leading-relaxed text-zinc-400 font-light lg:text-lg">
                <p>{content.excellence.description}</p>
                {content.excellence.quote && (
                  <p className="italic text-zinc-500 text-sm lg:text-base">
                    {content.excellence.quote}
                  </p>
                )}
              </div>

              <div className="flex gap-16 pt-8">
                {content.excellence.stats.map((stat, i) => (
                  <div key={i} className="border-l-2 border-[#EFD077] pl-8 py-1">
                    <p className="heading-font text-5xl font-semibold text-[#EFD077]">{stat.value}</p>
                    <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-400 mt-2 font-bold">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <FadeIn>
            <h2 className="heading-font text-[10px] uppercase tracking-[0.4em] text-[#D4AF37]">
              {content.descriptionSection.heading}
            </h2>
            <div className="h-0.5 w-12 bg-[#EFD077] mx-auto mt-6" />
            <div className="mt-10 space-y-6">
              {content.descriptionSection.paragraphs.map((p, i) => (
                <p key={i} className="text-lg leading-relaxed text-zinc-300 font-light">
                  {p}
                </p>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="pt-0 pb-16">
        <div className="mx-auto max-w-6xl px-4">
          <FadeIn className="mb-14 text-center">
            <h2 className="heading-font text-4xl font-medium tracking-tight text-[#EFD077]">
              {content.testimonials.title}
            </h2>
            <p className="mt-4 text-[10px] uppercase tracking-[0.3em] text-zinc-400">
              {content.testimonials.eyebrow}
            </p>
          </FadeIn>
          <Testimonials items={content.testimonials.items} />
        </div>
      </section>

      <section className="bg-[#030712] py-16">
        <div className="mx-auto max-w-7xl px-6">
          <BlogSection eyebrow={content.blog.eyebrow} title={content.blog.title} items={content.blog.items} />
        </div>
      </section>

      <section className="bg-black py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <FadeIn className="text-center mb-12">
            <h2 className="heading-font text-5xl font-medium tracking-tight text-[#EFD077] md:text-6xl">
              Gallery
            </h2>
            <p className="mt-4 text-[12px] uppercase tracking-[0.4em] text-zinc-400">
              Visualizing the Azzurri Experience
            </p>
            <div className="h-0.5 w-12 bg-[#EFD077] mx-auto mt-8" />
          </FadeIn>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {displayGallery.map((img, idx) => (
              <FadeIn key={img.id} delay={idx * 50}>
                <div className="group relative aspect-square overflow-hidden rounded-2xl border border-white/5 bg-zinc-900/50">
                  <Image
                    src={img.imageUrl}
                    alt={img.label}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    unoptimized={img.imageUrl.startsWith("http")}
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center">
                    <Link
                      href="/gallery"
                      className="h-10 w-10 rounded-full bg-[#EFD077] flex items-center justify-center text-black"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn className="mt-12 text-center">
            <Link
              href="/gallery"
              className="inline-flex items-center justify-center rounded-lg border border-[#EFD077] px-12 py-4 text-xs font-bold uppercase tracking-[0.2em] text-[#EFD077] transition-all hover:bg-[#EFD077] hover:text-black active:scale-95"
            >
              View Full Gallery
            </Link>
          </FadeIn>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-20 lg:grid-cols-2 lg:items-start">
            <FadeIn className="space-y-12">
              <div className="space-y-6">
                <h2 className="heading-font text-6xl font-medium tracking-tight text-[#EFD077]">
                  {content.contact.title}
                </h2>
                <p className="text-zinc-400 text-[15px] max-w-md leading-relaxed">
                  {content.contact.addressNote}
                </p>
              </div>

              <div className="space-y-10">
                <div className="space-y-2">
                  <p className="text-[12px] uppercase tracking-[0.3em] text-[#D4AF37] font-bold">Address</p>
                  <div className="text-zinc-300 space-y-1">
                    {content.contact.addressLines.map((line, i) => (
                      <p key={i} className={i === 0 ? "text-xl" : "text-base font-light"}>{line}</p>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[12px] uppercase tracking-[0.3em] text-[#D4AF37] font-bold">Opening Hours</p>
                  {content.contact.hoursLines.map((line, i) => (
                    <p key={i} className="text-zinc-300 text-xl font-light">{line}</p>
                  ))}
                </div>

                <div className="space-y-2">
                  <p className="text-[12px] uppercase tracking-[0.3em] text-[#D4AF37] font-bold">Contact</p>
                  <div className="text-zinc-300 space-y-1 text-xl">
                    <p>{content.contact.phone}</p>
                    <p className="text-base font-light">{content.contact.email}</p>
                  </div>
                </div>
              </div>

              <a
                href="https://maps.google.com/?q=Azzurri+Kigali+Kimihurura"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-lg bg-[#FDE68A] px-14 py-4 text-xs font-bold uppercase tracking-[0.3em] text-black transition-all hover:scale-105 active:scale-95"
              >
                GET DIRECTION
              </a>
            </FadeIn>

            <FadeIn delay={120} className="relative aspect-square overflow-hidden rounded-2xl border border-white/5 shadow-2xl">
              <iframe
                src={content.contact.mapEmbedSrc}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className=""
              />
            </FadeIn>
          </div>
        </div>
      </section>
    </div >
  );
}

