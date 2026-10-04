'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ArrowLeftIcon, ArrowRightIcon, XMarkIcon } from '@heroicons/react/24/solid';

export interface CarouselItem {
  title: string;
  description: string;
  date: string;
  imageSrc: string;
  href: string;
}

export function EventCarousel({ items }: { items: CarouselItem[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(3);
  const [paused, setPaused] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CarouselItem | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const updateItemsToShow = () => {
    const w = window.innerWidth;
    if (w < 480) setItemsToShow(1.1);
    else if (w < 768) setItemsToShow(1.5);
    else if (w < 1024) setItemsToShow(2.2);
    else setItemsToShow(3);
  };

  useEffect(() => {
    updateItemsToShow();
    window.addEventListener('resize', updateItemsToShow);
    return () => window.removeEventListener('resize', updateItemsToShow);
  }, []);

  // Auto-play
  useEffect(() => {
    if (paused || selectedEvent !== null) return;
    const id = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % items.length);
    }, 5000);
    return () => clearInterval(id);
  }, [paused, items.length, selectedEvent]);

  const goPrev = () => {
    setCurrentIndex((i) => (i - 1 + items.length) % items.length);
  };
  const goNext = () => {
    setCurrentIndex((i) => (i + 1) % items.length);
  };

  const handleMouseEnter = () => setPaused(true);
  const handleMouseLeave = () => setPaused(false);

  const translate = () => {
    const percent = 100 / itemsToShow;
    if (itemsToShow < 3) {
      // Center active card using calc
      const offset = (currentIndex + 0.5) * percent;
      return `calc(50% - ${offset}%)`;
    }
    // Desktop left slide
    return `-${currentIndex * percent}%`;
  };

  return (
    <>
      <div
        className="mx-auto max-w-[1400px] overflow-hidden relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        ref={containerRef}
      >
        <div
          className="flex transition-transform duration-700 ease-out"
          style={{ transform: `translateX(${translate()})` }}
        >
          {items.map((item, idx) => {
            const distance = Math.abs(idx - currentIndex);
            const opacity = distance > 1 ? 0.3 : 1;
            return (
              <div
                key={idx}
                className="flex-shrink-0 pb-12"
                style={{ width: `${100 / itemsToShow}%` }}
              >
                <div
                  className="mx-2 rounded-3xl bg-black/30 backdrop-blur-md border border-white/10 overflow-hidden shadow-lg hover:shadow-2xl transition-shadow flex flex-col h-full"
                  style={{ opacity }}
                >
                  <a href={item.href} className="relative aspect-[4/5] block flex-shrink-0">
                    <Image
                      src={item.imageSrc}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                  </a>
                  <div className="p-4 flex flex-col flex-grow">
                    <p className="text-xs uppercase tracking-wide text-azzurri-blue mb-1">
                      {item.date}
                    </p>
                    <h3 className="text-white font-semibold mb-1 line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-2 mb-4 flex-grow">
                      {item.description}
                    </p>
                    <button
                      onClick={() => setSelectedEvent(item)}
                      className="mt-auto w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-semibold transition-colors"
                    >
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {/* Navigation */}
        <button
          onClick={goPrev}
          className="absolute inset-y-0 left-4 my-auto flex items-center justify-center w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/20 hover:border-azzurri-blue transition-colors"
          aria-label="Previous"
        >
          <ArrowLeftIcon className="w-5 h-5 text-white" />
        </button>
        <button
          onClick={goNext}
          className="absolute inset-y-0 right-4 my-auto flex items-center justify-center w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/20 hover:border-azzurri-blue transition-colors"
          aria-label="Next"
        >
          <ArrowRightIcon className="w-5 h-5 text-white" />
        </button>
        {/* Pagination */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {items.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                idx === currentIndex ? 'w-8 bg-azzurri-blue' : 'w-1.5 bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl max-h-full bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
            <button
              onClick={() => setSelectedEvent(null)}
              className="absolute top-4 right-4 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors backdrop-blur-md"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
            <div className="relative w-full h-64 md:h-auto md:w-1/2 flex-shrink-0 md:min-h-[400px] bg-black/40">
              <Image
                src={selectedEvent.imageSrc}
                alt={selectedEvent.title}
                fill
                className="object-contain p-2 md:p-4"
              />
            </div>
            <div className="p-6 md:p-8 flex flex-col overflow-y-auto max-h-[60vh] md:max-h-[80vh]">
              <p className="text-sm uppercase tracking-widest text-azzurri-blue mb-2 font-medium">
                {selectedEvent.date}
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                {selectedEvent.title}
              </h2>
              <div className="text-gray-300 text-base leading-relaxed whitespace-pre-wrap">
                {selectedEvent.description}
              </div>
              <div className="mt-8 pt-6 border-t border-white/10 mt-auto">
                <a
                  href={selectedEvent.href}
                  className="inline-block w-full text-center px-8 py-3 bg-azzurri-blue text-black font-semibold rounded-xl hover:bg-white transition-colors"
                >
                  View All Events
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
