'use client';

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FadeIn } from "./FadeIn";

type Zone = 'restaurant' | 'club';

interface ZoneSelectorProps {
  defaultZone?: Zone;
  onZoneChange?: (zone: Zone) => void;
}

export function ZoneSelector({ defaultZone = 'restaurant', onZoneChange }: ZoneSelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeZone, setActiveZone] = useState<Zone>(defaultZone);

  // Sync internal state with URL param on mount / param change
  useEffect(() => {
    const zoneParam = searchParams.get('zone');
    if (zoneParam === 'restaurant' || zoneParam === 'club') {
      setActiveZone(zoneParam);
      onZoneChange?.(zoneParam);
    }
  }, [searchParams, onZoneChange]);

  const handleZoneChange = (zone: Zone) => {
    setActiveZone(zone);
    onZoneChange?.(zone);
    // Update the URL without a full page reload or scrolling
    const params = new URLSearchParams(searchParams.toString());
    params.set('zone', zone);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  return (
    <FadeIn className="mb-12">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
        <button
          onClick={() => handleZoneChange('restaurant')}
          className={`group relative overflow-hidden rounded-2xl border transition-all duration-500 ${
            activeZone === 'restaurant'
              ? 'border-azzurri-blue bg-azzurri-blue/10 px-6 py-4 w-full sm:w-56'
              : 'border-white/10 bg-black/40 px-4 py-3 w-full sm:w-48 hover:border-white/30'
          }`}
        >
          <div className="relative z-10 text-center">
            <p className={`text-[10px] font-bold uppercase tracking-[0.2em] transition-colors ${
              activeZone === 'restaurant' ? 'text-azzurri-blue' : 'text-zinc-500 group-hover:text-zinc-300'
            }`}>
              Experience
            </p>
            <h3 className={`mt-1 text-lg font-semibold transition-colors ${
              activeZone === 'restaurant' ? 'text-white' : 'text-zinc-400 group-hover:text-white'
            }`}>
              Rooftop Restaurant
            </h3>
          </div>
          {activeZone === 'restaurant' && (
            <div className="absolute inset-0 bg-gradient-to-br from-azzurri-blue/20 via-transparent to-transparent opacity-50" />
          )}
        </button>

        <div className="h-px w-8 bg-white/10 sm:h-8 sm:w-px" />

        <button
          onClick={() => handleZoneChange('club')}
          className={`group relative overflow-hidden rounded-2xl border transition-all duration-500 ${
            activeZone === 'club'
              ? 'border-azzurri-blue bg-azzurri-blue/10 px-6 py-4 w-full sm:w-56'
              : 'border-white/10 bg-black/40 px-4 py-3 w-full sm:w-48 hover:border-white/30'
          }`}
        >
          <div className="relative z-10 text-center">
            <p className={`text-[10px] font-bold uppercase tracking-[0.2em] transition-colors ${
              activeZone === 'club' ? 'text-azzurri-blue' : 'text-zinc-500 group-hover:text-zinc-300'
            }`}>
              Nightlife
            </p>
            <h3 className={`mt-1 text-lg font-semibold transition-colors ${
              activeZone === 'club' ? 'text-white' : 'text-zinc-400 group-hover:text-white'
            }`}>
              Club & Lounge
            </h3>
          </div>
          {activeZone === 'club' && (
            <div className="absolute inset-0 bg-gradient-to-br from-azzurri-blue/20 via-transparent to-transparent opacity-50" />
          )}
        </button>
      </div>
    </FadeIn>
  );
}
