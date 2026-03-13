import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-800 bg-black/95">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
        <div className="grid gap-8 sm:grid-cols-3 sm:gap-10">
          <div className="sm:col-span-1">
            <p className="heading-font text-base tracking-[0.18em] text-white sm:text-lg">
              Azzurri
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-zinc-400">
              A premium dining destination in Kigali where bold African flavors meet Asian craftsmanship in a luxurious rooftop setting.
            </p>
          </div>

          <div className="sm:col-span-1 sm:flex sm:flex-col sm:items-center sm:text-center">
            <p className="text-sm font-semibold text-[#D4AF37]">Quick Links</p>
            <ul className="mt-3 space-y-2 text-sm text-zinc-300">
              <li>
                <Link href="/" className="hover:text-[#D4AF37]">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/menu" className="hover:text-[#D4AF37]">
                  Menus
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-[#D4AF37]">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#D4AF37]">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div className="sm:col-span-1 sm:text-right">
            <p className="text-sm font-semibold text-[#D4AF37]">Our Social Media Platforms</p>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-zinc-300 sm:justify-end">
              <a
                href="https://www.instagram.com/lacreola_kigali?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                target="_blank"
                rel="noreferrer"
                className="inline-flex py-2 hover:text-[#D4AF37] transition-colors"
                aria-label="Follow us on Instagram"
              >
                Instagram
              </a>
              <span className="h-1 w-1 rounded-full bg-zinc-600" />
              <a
                href="https://web.facebook.com/p/La-Creola-Restaurant-and-Lounge-61550407251686/?_rdc=1&_rdr#"
                target="_blank"
                rel="noreferrer"
                className="inline-flex py-2 hover:text-[#D4AF37] transition-colors"
                aria-label="Follow us on Facebook"
              >
                Facebook
              </a>
              <span className="h-1 w-1 rounded-full bg-zinc-600" />
              <a
                href="https://www.tiktok.com/@lacreolakigali"
                target="_blank"
                rel="noreferrer"
                className="inline-flex py-2 hover:text-[#D4AF37] transition-colors"
                aria-label="Follow us on TikTok"
              >
                TikTok
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-zinc-800 pt-4 text-center text-xs text-zinc-400">
          © {new Date().getFullYear()} Azzurri Rooftop Restaurant.
        </div>
      </div>
    </footer>
  );
}
