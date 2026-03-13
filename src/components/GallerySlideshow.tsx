"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";

type ImageItem = {
    id: string;
    src: string;
    label: string;
};

type Props = {
    images: ImageItem[];
    isOpen: boolean;
    onClose: () => void;
    startIndex?: number;
};

export function GallerySlideshow({ images, isOpen, onClose, startIndex = 0 }: Props) {
    const [currentIndex, setCurrentIndex] = useState(startIndex);
    const [isPaused, setIsPaused] = useState(false);

    const next = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    }, [images.length]);

    const prev = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    }, [images.length]);

    // Sync index when opening
    useEffect(() => {
        if (isOpen) {
            setCurrentIndex(startIndex);
        }
    }, [isOpen, startIndex]);

    // Auto-slide logic
    useEffect(() => {
        if (isOpen && !isPaused) {
            const timer = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % images.length);
            }, 4000);
            return () => clearInterval(timer);
        }
    }, [isOpen, isPaused, images.length]);

    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") next();
            if (e.key === "ArrowLeft") prev();
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, next, prev, onClose]);

    if (!isOpen || images.length === 0) return null;

    const currentImage = images[currentIndex];

    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 backdrop-blur-sm transition-all duration-300">
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute right-6 top-6 z-[110] flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-all hover:bg-white/20 active:scale-90"
                aria-label="Close"
            >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            {/* Main Container */}
            <div
                className="relative flex h-full w-full flex-col items-center justify-center p-2"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                {/* Main Image */}
                <div className="relative h-[85vh] w-full max-w-7xl overflow-hidden rounded-2xl">
                    <Image
                        key={currentImage.id}
                        src={currentImage.src}
                        alt={currentImage.label}
                        fill
                        className="object-contain"
                        priority
                        unoptimized={currentImage.src.startsWith("http")}
                    />
                </div>

                {/* Controls */}
                <div className="absolute inset-y-0 left-4 right-4 flex items-center justify-between pointer-events-none">
                    <button
                        onClick={(e) => { e.stopPropagation(); prev(); }}
                        className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full bg-black/50 text-[#D4AF37] backdrop-blur-md border border-white/5 transition-all hover:bg-black/80 hover:scale-105 active:scale-95"
                        aria-label="Previous"
                    >
                        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); next(); }}
                        className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full bg-black/50 text-[#D4AF37] backdrop-blur-md border border-white/5 transition-all hover:bg-black/80 hover:scale-105 active:scale-95"
                        aria-label="Next"
                    >
                        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>

                {/* Info & Counter */}
                <div className="mt-8 flex flex-col items-center text-center space-y-2">
                    <p className="text-lg font-semibold tracking-wide text-white">{currentImage.label}</p>
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium uppercase tracking-[0.2em] text-[#D4AF37]">
                            {currentIndex + 1} / {images.length}
                        </span>
                        {isPaused && (
                            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] uppercase tracking-widest text-zinc-400">
                                Paused
                            </span>
                        )}
                    </div>
                </div>

                {/* Thumbnails (optional toggle - keeping for now but visible) */}
                <div className="mt-8 hidden space-x-3 overflow-x-auto pb-4 no-scrollbar lg:flex px-4 max-w-4xl">
                    {images.map((img, idx) => (
                        <button
                            key={img.id}
                            onClick={() => setCurrentIndex(idx)}
                            className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${currentIndex === idx ? "border-[#D4AF37] opacity-100" : "border-transparent opacity-40 hover:opacity-80"
                                }`}
                        >
                            <Image src={img.src} alt={img.label} fill className="object-cover" unoptimized={img.src.startsWith("http")} />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
