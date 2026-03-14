'use client';

import { useSearchParams } from 'next/navigation';
import { useMemo, useState, useEffect, Suspense } from 'react';
import { ZoneSelector } from '@/components/ZoneSelector';
import { FadeIn } from '@/components/FadeIn';

function getMinDateTimeValue(): string {
  const now = new Date();
  now.setHours(now.getHours() + 2);
  const minutes = now.getMinutes();
  const rounded = Math.ceil(minutes / 5) * 5;
  now.setMinutes(rounded, 0, 0);
  const iso = now.toISOString();
  return iso.slice(0, 16); // yyyy-MM-ddTHH:mm
}

export default function BookPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-[#D4AF37] animate-pulse">Loading Booking Form...</div>
      </main>
    }>
      <BookingContent />
    </Suspense>
  );
}

function BookingContent() {
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
              
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { id: 'cigar', label: 'Cigar Lounge', pax: '15 pax', minSpend: '2,500,000 RWF' },
                  { id: 'top-vvip', label: 'Top VVIP', pax: '6-8 pax', minSpend: '1,500,000 RWF' },
                  { id: 'vvip', label: 'VVIP', pax: '10-12 pax', minSpend: '1,000,000 RWF' },
                  { id: 'vip', label: 'VIP', pax: '5-10 pax', minSpend: '800,000 RWF' },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTableType(t.label)}
                    className={`flex flex-col items-center justify-center gap-2 rounded-2xl border p-6 transition-all ${
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
              className="bg-azzurri-blue inline-flex items-center justify-center rounded-full px-8 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-black shadow-md shadow-blue-500/40 transition hover:shadow-blue-400/60 disabled:cursor-not-allowed disabled:opacity-70"
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
    </main>
  );
}