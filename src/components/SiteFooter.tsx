import Link from "next/link";
import { getSiteContent } from "@/lib/siteContent";

export async function SiteFooter() {
  const content = await getSiteContent();
  const { socialLinks } = content;

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
                <Link href="/" className="hover:text-azzurri-blue">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/menu" className="hover:text-azzurri-blue">
                  Menus
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-azzurri-blue">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-azzurri-blue">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div className="sm:col-span-1 sm:text-right">
            <p className="text-sm font-semibold text-[#D4AF37]">Follow Us</p>
            <div className="mt-3 grid grid-cols-1 gap-2 text-sm text-zinc-300 sm:items-end">
              {socialLinks.instagramRestaurant && (
                <a
                  href={socialLinks.instagramRestaurant}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-azzurri-blue transition-colors"
                  aria-label="Follow Azzurri Restaurant on Instagram"
                >
                  IG: Restaurant
                </a>
              )}
              {socialLinks.instagramClub && (
                <a
                  href={socialLinks.instagramClub}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-azzurri-blue transition-colors"
                  aria-label="Follow Azzurri Club on Instagram"
                >
                  IG: Club & Lounge
                </a>
              )}
              {socialLinks.tikTok && (
                <a
                  href={socialLinks.tikTok}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#D4AF37] transition-colors"
                  aria-label="Follow us on TikTok"
                >
                  TikTok
                </a>
              )}
              {socialLinks.facebook && (
                <a
                  href={socialLinks.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#D4AF37] transition-colors"
                  aria-label="Follow us on Facebook"
                >
                  Facebook
                </a>
              )}
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
