import { FadeIn } from "@/components/FadeIn";

export default function AdminHome() {
  return (
    <div className="space-y-6">
      <FadeIn>
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-[#D4AF37]">
            Admin Overview
          </p>
          <h1 className="mt-3 text-2xl font-semibold text-white">
            Manage your website content
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Upload images/videos, update page content, and review reservation
            requests.
          </p>
        </div>
      </FadeIn>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card
          title="Media Library"
          description="Upload and organize images/videos."
          href="/admin/media"
        />
        <Card
          title="Gallery"
          description="Manage images displayed on the gallery page."
          href="/admin/gallery"
        />
        <Card
          title="Events"
          description="Manage upcoming events and parties."
          href="/admin/events"
        />
        <Card
          title="Content"
          description="Edit hero, about, blog, and more."
          href="/admin/content"
        />
        <Card
          title="Reservations"
          description="View and manage booking requests."
          href="/admin/reservations"
        />
      </div>
    </div>
  );
}

function Card({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="card-glass block rounded-3xl p-6 transition hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-black/60"
    >
      <p className="text-sm font-semibold text-white">{title}</p>
      <p className="mt-2 text-sm text-zinc-300">{description}</p>
      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#D4AF37]">
        Open →
      </p>
    </a>
  );
}

