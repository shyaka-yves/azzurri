import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[calc(100vh-6rem)] bg-black/95">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-6 md:grid-cols-[260px_1fr]">
          <aside className="rounded-3xl border border-zinc-800 bg-black/50 p-5 backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-[#D4AF37]">
                  Dashboard
                </p>
                <p className="mt-1 text-sm font-semibold text-white">Azzurri</p>
              </div>
              <Link
                href="/"
                className="rounded-full border border-zinc-700/80 px-3 py-1 text-xs text-zinc-300 hover:border-[#D4AF37] hover:text-[#D4AF37]"
              >
                View site
              </Link>
            </div>

            <nav className="mt-6 space-y-2 text-sm">
              <NavItem href="/admin" label="Overview" />
              <NavItem href="/admin/media" label="Media Library" />
              <NavItem href="/admin/gallery" label="Gallery" />
              <NavItem href="/admin/events" label="Events" />
              <NavItem href="/admin/content" label="Content" />
              <NavItem href="/admin/reservations" label="Reservations" />
              <div className="my-4 h-px bg-zinc-800" />
              <NavItem href="/admin/settings" label="Settings" />
              <form action="/api/admin/logout" method="post">
                <button
                  type="submit"
                  className="mt-2 inline-flex w-full items-center justify-between rounded-2xl border border-zinc-800 bg-black/40 px-4 py-2 text-left text-sm text-zinc-200 hover:border-[#D4AF37]/40"
                >
                  <span>Sign out</span>
                  <span className="text-xs text-zinc-500">↗</span>
                </button>
              </form>
            </nav>
          </aside>

          <section className="rounded-3xl border border-zinc-800 bg-black/40 p-6 backdrop-blur">
            {children}
          </section>
        </div>
      </div>
    </div>
  );
}

function NavItem({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-black/40 px-4 py-2 text-zinc-200 hover:border-[#D4AF37]/40 hover:text-[#D4AF37]"
    >
      <span>{label}</span>
      <span className="text-xs text-zinc-500">→</span>
    </Link>
  );
}

