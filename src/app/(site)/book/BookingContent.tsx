'use client';

import { useSearchParams } from 'next/navigation';
import { useMemo, useState, useEffect } from 'react';
import { ZoneSelector } from '@/components/ZoneSelector';
import { FadeIn } from '@/components/FadeIn';
import type { SiteContent } from '@/lib/siteContent';

function getMinDateTimeValue(): string {
  const now = new Date();
  now.setHours(now.getHours() + 2);
  const minutes = now.getMinutes();
  const rounded = Math.ceil(minutes / 5) * 5;
  now.setMinutes(rounded, 0, 0);
  const iso = now.toISOString();
  return iso.slice(0, 16);
}

export function BookingContent({ content }: { content: SiteContent }) {
  const minDateTime = useMemo(getMinDateTimeValue, []);
  const searchParams = useSearchParams();

  const [zone, setZone] = useState<'restaurant' | 'club'>('restaurant');

  useEffect(() => {
    const zoneParam = searchParams.get('zone');
    if (zoneParam === 'restaurant' || zoneParam === 'club') {
      setZone(zoneParam);
    }
  }, [searchParams]);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [guests, setGuests] = useState('');
  const [notes, setNotes] = useState('');
  const [tableType, setTableType] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const [selectedTableDetail, setSelectedTableDetail] = useState<any>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (!name.trim() || !email.trim()) {
      setError('Name and email are required.');
      return;
    }

    if (!dateTime) {
      setError('Please choose a date and time.');
      return;
    }

    if (new Date(dateTime).getTime() < new Date(minDateTime).getTime()) {
      setError('Reservations must be made at least 2 hours in advance. Please select a later time.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          date: dateTime,
          guests: guests ? Number(guests) : undefined,
          notes,
          zone,
          tableType: zone === 'club' ? tableType : undefined,
        }),
      });

      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };

      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'Something went wrong. Please try again.');
      }

      setMessage('Thank you. Your booking request has been sent.');
      setName('');
      setEmail('');
      setPhone('');
      setDateTime('');
      setGuests('');
      setNotes('');
      setTableType('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-black">
      <div className="mx-auto flex max-w-4xl flex-col gap-10 px-4 py-16 sm:py-20">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-[#D4AF37]">Book a Table</p>
          <h1 className="heading-font mt-3 text-3xl font-semibold text-white sm:text-4xl">
            Reserve your evening at Azzurri
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-zinc-300 sm:text-base">
            Share a few details and we&apos;ll confirm your reservation as soon as possible.
            Bookings must be at least{' '}
            <span className="font-semibold text-[#D4AF37]">2 hours</span> from the current time.
          </p>
        </div>

        <ZoneSelector onZoneChange={setZone} />

        {zone === 'club' && (
          <FadeIn className="mb-8">
            <div className="card-glass overflow-hidden rounded-3xl border border-zinc-800 bg-black/60 p-6 shadow-xl">
              <h2 className="heading-font mb-4 text-xl font-semibold text-[#D4AF37]">
                Club Seat Selection
              </h2>
              <p className="mb-6 text-xs text-zinc-400 uppercase tracking-widest">
                Please select your preferred area (Minimum spend applies)
              </p>

              {content.reservations?.clubFloorPlanUrl ? (
                <div 
                  className="group relative mb-8 cursor-zoom-in overflow-hidden rounded-2xl border border-zinc-700/50 bg-black/40 transition-all hover:border-azzurri-blue/50"
                  onClick={() => setExpandedImage(content.reservations.clubFloorPlanUrl)}
                >
                  <div className="relative aspect-[16/9] w-full">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={content.reservations.clubFloorPlanUrl}
                      alt="Club Floor Plan"
                      className="h-full w-full object-contain p-2 transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/20">
                      <span className="rounded-full bg-black/60 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-white opacity-0 transition-opacity group-hover:opacity-100">
                        Click to enlarge
                      </span>
                    </div>
                  </div>
                  <div className="bg-zinc-800/30 px-4 py-2 text-center text-[10px] text-zinc-500 uppercase tracking-wider">
                    Club Floor Plan Reference
                  </div>
                </div>
              ) : (
                <div className="mb-8 flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-zinc-700/60 bg-black/20 py-10 text-center">
                  <svg className="h-8 w-8 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  <p className="text-xs text-zinc-500">Floor plan coming soon.</p>
                  <p className="text-[10px] text-zinc-600">Upload one via Admin → Content Management → Reservation Floor Plans.</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {(content.reservations?.clubTableDetails || [
                  { id: 'cigar', label: 'Cigar Lounge', pax: '15 pax', minSpend: '2,500,000 RWF' },
                  { id: 'top-vvip', label: 'Top VVIP', pax: '6-8 pax', minSpend: '1,500,000 RWF' },
                  { id: 'vvip', label: 'VVIP', pax: '10-12 pax', minSpend: '1,000,000 RWF' },
                  { id: 'vip', label: 'VIP', pax: '5-10 pax', minSpend: '800,000 RWF' },
                ]).map((t: any) => (
                  <div key={t.id} className="relative group">
                    <button
                      type="button"
                      onClick={() => setTableType(t.label)}
                      className={`flex w-full flex-col items-center justify-center gap-1 rounded-2xl border p-4 transition-all ${
                        tableType === t.label
                          ? 'border-azzurri-blue bg-azzurri-blue/10'
                          : 'border-zinc-800 bg-black/40 hover:border-zinc-700'
                      }`}
                    >
                      <span className={`text-sm font-bold ${tableType === t.label ? 'text-white' : 'text-zinc-300'}`}>
                        {t.label}
                      </span>
                      <span className="text-[10px] text-zinc-500">{t.pax}</span>
                      <div className="mt-2 h-px w-8 bg-zinc-800" />
                      <span className="mt-1 text-[11px] font-medium text-[#D4AF37]">
                        {t.minSpend}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTableDetail(t);
                      }}
                      className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-zinc-800/50 text-zinc-400 opacity-0 transition-opacity hover:bg-[#D4AF37]/20 hover:text-[#D4AF37] group-hover:opacity-100"
                      title="View Details"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 18 18 0 0118 0z" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              {tableType && (
                <p className="mt-6 text-center text-xs text-zinc-400">
                  You have selected <span className="text-white font-semibold">{tableType}</span>.
                </p>
              )}
            </div>
          </FadeIn>
        )}

        <form
          onSubmit={handleSubmit}
          className="card-glass grid gap-6 rounded-3xl border border-zinc-800 bg-black/60 p-6 shadow-xl shadow-black/60 sm:p-8 md:grid-cols-2"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
                Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 w-full rounded-full border border-zinc-700 bg-black/60 px-4 py-2.5 text-sm text-white outline-none ring-0 transition focus:border-gold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
                Email *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full rounded-full border border-zinc-700 bg-black/60 px-4 py-2.5 text-sm text-white outline-none ring-0 transition focus:border-gold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
                Phone
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-2 w-full rounded-full border border-zinc-700 bg-black/60 px-4 py-2.5 text-sm text-white outline-none ring-0 transition focus:border-gold"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
                Date &amp; Time *
              </label>
              <div className="relative mt-2">
                <input
                  type="datetime-local"
                  value={dateTime}
                  onChange={(e) => setDateTime(e.target.value)}
                  min={minDateTime}
                  style={{ colorScheme: 'dark' }}
                  className="w-full rounded-full border border-zinc-700 bg-black/60 px-4 py-2.5 text-sm text-white outline-none ring-0 transition focus:border-gold [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                  required
                />
              </div>
              <p className="mt-1 text-[11px] text-zinc-500">
                You can&apos;t select past times; minimum is 2 hours from now.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
                Guests
              </label>
              <input
                type="number"
                min={1}
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="mt-2 w-full rounded-full border border-zinc-700 bg-black/60 px-4 py-2.5 text-sm text-white outline-none ring-0 transition focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
                Notes
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-zinc-700 bg-black/60 px-4 py-2.5 text-sm text-white outline-none ring-0 transition focus:border-azzurri-blue"
                placeholder="Allergies, special occasions, or seating preferences"
              />
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3 md:col-span-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1 text-xs text-zinc-400">
              <p>
                By submitting this form, you&apos;re requesting a reservation at Azzurri. We&apos;ll
                confirm by email or phone.
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="bg-azzurri-blue inline-flex items-center justify-center rounded-full px-6 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-black shadow-md shadow-blue-500/40 transition hover:shadow-blue-400/60 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? 'Sending...' : 'Submit Booking'}
            </button>
          </div>

          {error && (
            <p className="md:col-span-2 text-sm font-medium text-red-400">
              {error}
            </p>
          )}
          {message && (
            <p className="md:col-span-2 text-sm font-medium text-emerald-400">
              {message}
            </p>
          )}
        </form>
      </div>

      {/* Lightbox for Floor Plan */}
      {expandedImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={() => setExpandedImage(null)}
        >
          <button className="absolute right-6 top-6 text-white/50 hover:text-white transition-colors">
            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <div 
            className="relative h-full w-full max-w-6xl max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={expandedImage}
              alt="Expanded Floor Plan"
              className="h-full w-full object-contain"
            />
          </div>
        </div>
      )}

      {/* Table Detail Modal */}
      {selectedTableDetail && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in zoom-in duration-300"
          onClick={() => setSelectedTableDetail(null)}
        >
          <div 
            className="w-full max-w-lg overflow-hidden rounded-[2.5rem] border border-zinc-800 bg-zinc-950 p-8 shadow-2xl lg:p-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37]">Table Details</p>
                <h3 className="heading-font mt-2 text-3xl font-bold text-white">{selectedTableDetail.label}</h3>
              </div>
              <button 
                onClick={() => setSelectedTableDetail(null)}
                className="rounded-full border border-zinc-800 p-2 text-zinc-500 transition-colors hover:bg-white/5 hover:text-white"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-zinc-800/50 bg-white/5 p-4">
                <p className="text-[10px] uppercase tracking-wider text-zinc-500">Capacity</p>
                <p className="mt-1 text-sm font-semibold text-white">{selectedTableDetail.pax}</p>
              </div>
              <div className="rounded-2xl border border-zinc-800/50 bg-white/5 p-4">
                <p className="text-[10px] uppercase tracking-wider text-zinc-500">Min. Spend</p>
                <p className="mt-1 text-sm font-semibold text-[#D4AF37]">{selectedTableDetail.minSpend}</p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <p className="text-sm font-light leading-relaxed text-zinc-300">
                {selectedTableDetail.description || 'Exclusive seating area with premium views and dedicated service.'}
              </p>
            </div>

            <div className="mt-10">
              <button
                onClick={() => {
                  setTableType(selectedTableDetail.label);
                  setSelectedTableDetail(null);
                }}
                className={`w-full rounded-2xl py-4 text-xs font-bold uppercase tracking-[0.2em] transition-all ${
                  tableType === selectedTableDetail.label
                    ? 'bg-zinc-800 text-zinc-400 cursor-default'
                    : 'bg-[#D4AF37] text-black hover:brightness-110 active:scale-[0.98]'
                }`}
              >
                {tableType === selectedTableDetail.label ? 'Selected' : 'Select this area'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
