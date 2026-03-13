"use client";

import { useState } from "react";
import { FadeIn } from "./FadeIn";

const TESTIMONIALS = [
  {
    quote:
      "Great dinner at Azzurri from the starters to the mains. And service on another level.",
    name: "Ismael R.",
    rating: 5,
  },
  {
    quote:
      "A beautiful balance of comfort and sophistication. The tasting menu was a journey through flavors I didn't know I loved.",
    name: "Rachel K.",
    rating: 5,
  },
  {
    quote:
      "Cocktails that would impress any global bar, in a setting that still feels intimately Rwandan.",
    name: "David M.",
    rating: 5,
  },
];

export function Testimonials({
  items,
}: {
  items?: Array<{ quote: string; name: string; rating: number }>;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const data = items && items.length > 0 ? items : TESTIMONIALS;
  const active = data[activeIndex];

  return (
    <FadeIn>
      <div className="relative mx-auto max-w-4xl px-4">
        <div className="card-glass overflow-hidden rounded-3xl bg-[#030712] px-10 py-16 text-center shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] border-white/[0.03]">
          <div className="relative">
            <div className="flex justify-center mb-8">
              <span className="text-4xl text-[#EFD077] opacity-60 italic font-serif">“</span>
            </div>

            <p className="mx-auto max-w-2xl text-[18px] leading-[1.8] text-zinc-300 font-light italic tracking-wide md:text-xl">
              {active.quote}
            </p>

            <div className="mt-12 flex flex-col items-center gap-4">
              <div className="flex items-center gap-2 text-[#EFD077] text-sm mb-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={i < active.rating ? "text-[#EFD077]" : "text-zinc-800"}>
                    ★
                  </span>
                ))}
              </div>
              <div className="space-y-1">
                <p className="text-base font-semibold tracking-[0.15em] text-white uppercase">{active.name}</p>
                <p className="text-[11px] uppercase tracking-[0.5em] text-zinc-400 font-bold">Visited Azzurri</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <div className="absolute top-1/2 -translate-y-1/2 flex w-full justify-between left-0 px-2 lg:-px-8 pointer-events-none">
          <button
            type="button"
            onClick={() => setActiveIndex((prev) => (prev - 1 + data.length) % data.length)}
            className="pointer-events-auto inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/5 bg-black/40 text-zinc-400 hover:border-[#EFD077] hover:text-[#EFD077] hover:bg-black/60 transition-all duration-300 backdrop-blur-sm"
            aria-label="Previous testimonial"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => setActiveIndex((prev) => (prev + 1) % data.length)}
            className="pointer-events-auto inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/5 bg-black/40 text-zinc-400 hover:border-[#EFD077] hover:text-[#EFD077] hover:bg-black/60 transition-all duration-300 backdrop-blur-sm"
            aria-label="Next testimonial"
          >
            ›
          </button>
        </div>

        {/* Pagination Dots */}
        <div className="mt-10 flex justify-center gap-4">
          {data.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`h-0.5 transition-all duration-500 ${index === activeIndex ? "w-10 bg-[#EFD077]" : "w-4 bg-zinc-800"
                }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </FadeIn>
  );
}

