"use client";

import { useState } from "react";
import Image from "next/image";
import { FadeIn } from "@/components/FadeIn";
import { GallerySlideshow } from "@/components/GallerySlideshow";
import { ZoneSelector } from "@/components/ZoneSelector";
import { GalleryImage } from "@/lib/galleryDb";
import { SiteContent } from "@/lib/siteContent";

type ImageItem = { id: string; src: string; label: string; zone?: string };

export function GalleryView({
    content,
    galleryImages,
    zone = 'restaurant'
}: {
    content: SiteContent;
    galleryImages: GalleryImage[];
    zone?: 'restaurant' | 'club';
}) {
    const [slideshow, setSlideshow] = useState<{ isOpen: boolean; index: number }>({
        isOpen: false,
        index: 0
    });
    const [activeZone, setActiveZone] = useState<'restaurant' | 'club'>(zone);

    const allImages: ImageItem[] = galleryImages.length > 0
        ? galleryImages.map(img => ({ id: img.id, src: img.imageUrl, label: img.label, zone: img.zone || 'restaurant' }))
        : (content.gallery.items || []).map((img, idx) => ({ id: `content-${idx}`, src: img.imageSrc, label: img.alt, zone: img.zone || 'restaurant' }));
        
    const filteredImages = allImages.filter(img => img.zone === activeZone || img.zone === 'both');

    return (
        <div className="relative min-h-screen bg-black overflow-x-hidden">
            <section className="bg-black/95 pt-16 pb-6 sm:pt-20 sm:pb-10">
                <div className="mx-auto max-w-4xl px-4 text-center">
                    <FadeIn>
                        <h1 className="heading-font text-4xl font-semibold text-[#D4AF37] sm:text-5xl lg:text-6xl tracking-tight">
                            {content.gallery.title || "Our Gallery"}
                        </h1>
                        <div className="h-0.5 w-16 bg-[#D4AF37]/70 mx-auto mt-6" />
                    </FadeIn>
                </div>
            </section>

            <section className="bg-black/95 pb-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6">
                    <ZoneSelector defaultZone={zone} onZoneChange={setActiveZone} />
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mt-8">
                        {filteredImages.length === 0 ? (
                            <div className="col-span-full py-12 text-center text-zinc-500">
                                No images available for {activeZone === 'restaurant' ? 'Rooftop Restaurant' : 'Club & Lounge'} yet.
                            </div>
                        ) : (
                            filteredImages.map((img, idx) => (
                            <FadeIn key={img.id} delay={idx * 30}>
                                <button
                                    onClick={() => setSlideshow({ isOpen: true, index: idx })}
                                    className="group relative aspect-square w-full overflow-hidden rounded-2xl border border-white/5 bg-zinc-900/50 transition-all hover:border-[#D4AF37]/30 hover:shadow-2xl hover:shadow-yellow-900/10"
                                >
                                    <Image
                                        src={img.src}
                                        alt={img.label}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        unoptimized={img.src.startsWith("http")}
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center">
                                        <svg className="h-8 w-8 text-[#D4AF37] transform scale-75 group-hover:scale-100 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                        </svg>
                                    </div>
                                </button>
                            </FadeIn>
                        )))}
                    </div>
                </div>
            </section>

            <GallerySlideshow
                images={filteredImages}
                isOpen={slideshow.isOpen}
                onClose={() => setSlideshow({ ...slideshow, isOpen: false })}
                startIndex={slideshow.index}
            />
        </div>
    );
}
