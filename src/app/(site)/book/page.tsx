import { Suspense } from 'react';
import { getSiteContent } from '@/lib/siteContent';
import { BookingContent } from './BookingContent';

export const dynamic = 'force-dynamic';

export default async function BookPage() {
  const content = await getSiteContent();

  return (
    <Suspense fallback={
      <main className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-[#D4AF37] animate-pulse">Loading Booking Form...</div>
      </main>
    }>
      <BookingContent content={content} />
    </Suspense>
  );
}