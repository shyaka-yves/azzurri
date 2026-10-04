'use client';
import { useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { XMarkIcon } from "@heroicons/react/24/solid";

interface EventCardProps {
  title: string;
  description: string;
  date: string;
  imageUrl: string;
}

export function EventCard({ title, description, date, imageUrl }: EventCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <article className="card-glass mx-auto flex h-full w-full sm:w-auto sm:max-w-[280px] flex-col overflow-hidden rounded-3xl transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/80">
        <div className="relative w-full aspect-[4/5] overflow-hidden">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-contain transition-transform duration-700 hover:scale-105 bg-black/20"
            unoptimized={imageUrl.startsWith("http")}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        </div>
        <div className="flex flex-1 flex-col px-5 pb-6 pt-4">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#D4AF37]">
            {date}
          </p>
          <h2 className="mt-2 text-base font-semibold text-white line-clamp-1">{title}</h2>
          <p className="mt-2 text-xs text-zinc-400 line-clamp-2 leading-relaxed flex-grow">{description}</p>
          <button
            onClick={() => setIsOpen(true)}
            className="mt-4 w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold transition-colors uppercase tracking-wider"
          >
            Learn More
          </button>
        </div>
      </article>

      {isOpen && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm text-left">
          <div className="relative w-full max-w-4xl max-h-full bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors backdrop-blur-md"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
            <div className="relative w-full h-64 md:h-auto md:w-1/2 flex-shrink-0 md:min-h-[400px] bg-black/40">
              <Image
                src={imageUrl}
                alt={title}
                fill
                className="object-contain p-2 md:p-4"
                unoptimized={imageUrl.startsWith("http")}
              />
            </div>
            <div className="p-6 md:p-8 flex flex-col overflow-y-auto max-h-[60vh] md:max-h-[80vh]">
              <p className="text-sm uppercase tracking-widest text-[#D4AF37] mb-2 font-medium">
                {date}
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                {title}
              </h2>
              <div className="text-gray-300 text-base leading-relaxed whitespace-pre-wrap">
                {description}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
