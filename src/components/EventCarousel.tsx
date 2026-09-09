import { useState, useEffect, useRef, MouseEvent } from 'react';
import Image from 'next/image';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/solid';

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
    if (paused) return;
    const id = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % items.length);
    }, 5000);
    return () => clearInterval(id);
  }, [paused, items.length]);

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
            <a
              key={idx}
              href={item.href}
              className="flex-shrink-0"
              style={{ width: `${100 / itemsToShow}%` }}
            >
              <div
                className="mx-2 rounded-3xl bg-black/30 backdrop-blur-md border border-white/10 overflow-hidden shadow-lg hover:shadow-2xl transition-shadow"
                style={{ opacity }}
              >
                <div className="relative aspect-[4/5]">
                  <Image
                    src={item.imageSrc}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                </div>
                <div className="p-4">
                  <p className="text-xs uppercase tracking-wide text-azzurri-blue mb-1">
                    {item.date}
                  </p>
                  <h3 className="text-white font-semibold mb-1 line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 text-sm line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </div>
            </a>
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
  );
}
