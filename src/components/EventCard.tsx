import Image from "next/image";

interface EventCardProps {
  title: string;
  description: string;
  date: string;
  imageUrl: string;
}

export function EventCard({ title, description, date, imageUrl }: EventCardProps) {
  return (
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
        <p className="mt-2 text-xs text-zinc-400 line-clamp-2 leading-relaxed">{description}</p>
      </div>
    </article>
  );
}
