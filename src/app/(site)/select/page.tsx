import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Choose Your Experience | Azzurri',
  description: 'Select your preferred experience at Azzurri: Rooftop Restaurant or Club & Lounge.',
};

export default function SelectExperiencePage({
  searchParams,
}: {
  searchParams: { dest?: string };
}) {
  const dest = searchParams.dest || 'book';

  return (
    <main className="min-h-screen bg-black">
      <section className="relative flex min-h-screen items-center justify-center pt-20 pb-12 sm:pt-24 sm:pb-16 bg-black/95">
        <div className="absolute inset-0 bg-[url('/bgImage2.jpg')] bg-cover bg-center bg-no-repeat opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black/95" />

        <div className="relative z-10 mx-auto w-full max-w-5xl px-4 text-center">
          <h1 className="heading-font text-4xl font-bold uppercase text-[#D4AF37] sm:text-5xl md:text-6xl mb-6">
            Choose Your Experience
          </h1>
          <p className="mx-auto max-w-2xl text-base text-zinc-300 sm:text-lg mb-12">
            Select your preferred destination to access the {dest}.
          </p>

          <div className="grid gap-6 sm:grid-cols-2 max-w-3xl mx-auto">
            <Link 
              href={`/restaurant/${dest}`}
              className="group relative flex flex-col items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900/40 p-12 text-center transition-all hover:border-[#D4AF37]/50 hover:bg-zinc-800/60 backdrop-blur-sm overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-80" />
              <div className="relative z-10 flex flex-col items-center">
                <h3 className="heading-font text-2xl font-bold text-white mb-2 group-hover:text-[#D4AF37] transition-colors">
                  Rooftop Restaurant
                </h3>
                <p className="text-sm text-zinc-400 group-hover:text-zinc-300">
                  Elegant dining with spectacular views
                </p>
              </div>
            </Link>

            <Link 
              href={`/club/${dest}`}
              className="group relative flex flex-col items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900/40 p-12 text-center transition-all hover:border-azzurri-blue/50 hover:bg-zinc-800/60 backdrop-blur-sm overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-80" />
              <div className="relative z-10 flex flex-col items-center">
                <h3 className="heading-font text-2xl font-bold text-white mb-2 group-hover:text-azzurri-blue transition-colors">
                  Club & Lounge
                </h3>
                <p className="text-sm text-zinc-400 group-hover:text-zinc-300">
                  Premium nightlife and entertainment
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
