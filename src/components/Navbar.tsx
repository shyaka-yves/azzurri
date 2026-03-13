"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

const RESTAURANT_DROPDOWN = [
  { href: "/menu", label: "Menu" },
  { href: "/special-offers", label: "Special offers" },
  { href: "/speciality", label: "Speciality" },

];

const NAV_ITEMS = [
  { href: "/", label: "HOME" },
  { href: "/about", label: "ABOUT US" },
  { href: "/events", label: "EVENTS" },
  { href: "/gallery", label: "GALLERY" },
  { href: "/contact", label: "CONTACT" },
];

export function Navbar() {
  const [logoError, setLogoError] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [restaurantOpen, setRestaurantOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setRestaurantOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-black">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        <Link href="/" className="flex shrink-0 items-center">
          {logoError ? (
            <p className="heading-font text-base tracking-[0.18em] text-white sm:text-lg">
              Azzurri
            </p>
          ) : (
            <Image
              src="/logo.png"
              alt="Azzurri"
              width={140}
              height={44}
              className="h-9 w-auto object-contain sm:h-11"
              onError={() => setLogoError(true)}
            />
          )}
        </Link>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 text-[13px] uppercase tracking-widest text-zinc-400 lg:flex xl:gap-10">
          <Link href="/" className="whitespace-nowrap transition-colors hover:text-azzurri-blue">HOME</Link>
          <Link href="/about" className="whitespace-nowrap transition-colors hover:text-azzurri-blue">ABOUT US</Link>

          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setRestaurantOpen((o) => !o)}
              className="flex items-center gap-1 transition-colors hover:text-azzurri-blue"
              aria-expanded={restaurantOpen}
              aria-haspopup="true"
            >
              RESTAURANT
            </button>
            {restaurantOpen && (
              <div className="absolute left-1/2 top-full z-50 mt-1 min-w-[180px] -translate-x-1/2 rounded border border-zinc-700 bg-black py-2 shadow-xl">
                {RESTAURANT_DROPDOWN.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block px-4 py-2 text-left text-sm capitalize text-white hover:bg-zinc-800 hover:text-azzurri-blue"
                    onClick={() => setRestaurantOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/events" className="whitespace-nowrap transition-colors hover:text-azzurri-blue">EVENTS</Link>
          <Link href="/gallery" className="whitespace-nowrap transition-colors hover:text-azzurri-blue">GALLERY</Link>
          <Link href="/contact" className="whitespace-nowrap transition-colors hover:text-azzurri-blue">CONTACT</Link>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="/book"
            className="hidden border border-azzurri-blue bg-transparent px-8 py-3 text-[11px] uppercase tracking-[0.2em] text-azzurri-blue transition-all hover:bg-azzurri-blue hover:text-black lg:inline-flex"
          >
            BOOK A TABLE
          </a>

          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className="flex h-10 w-10 items-center justify-center rounded border border-zinc-600 text-white lg:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <span className="text-xl">×</span>
            ) : (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`fixed inset-x-0 top-[52px] z-40 overflow-y-auto bg-black transition-all duration-300 lg:hidden ${mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        style={{ height: mobileOpen ? "calc(100vh - 52px)" : 0 }}
      >
        <nav className="flex flex-col px-4 py-6">
          <Link href="/" onClick={() => setMobileOpen(false)} className="border-b border-zinc-800 py-4 text-sm uppercase tracking-wide text-white transition-colors hover:text-[#D4AF37]">HOME</Link>
          <Link href="/about" onClick={() => setMobileOpen(false)} className="border-b border-zinc-800 py-4 text-sm uppercase tracking-wide text-white transition-colors hover:text-[#D4AF37]">ABOUT US</Link>
          <Link href="/" onClick={() => setMobileOpen(false)} className="border-b border-zinc-800 py-4 text-sm uppercase tracking-wide text-white transition-colors hover:text-azzurri-blue">HOME</Link>
          <Link href="/about" onClick={() => setMobileOpen(false)} className="border-b border-zinc-800 py-4 text-sm uppercase tracking-wide text-white transition-colors hover:text-azzurri-blue">ABOUT US</Link>

          <div className="border-b border-zinc-800 py-2">
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-zinc-400">
              A premium dining destination in Kigali where bold African flavors meet Asian craftsmanship in a luxurious rooftop setting.
            </p>
            {RESTAURANT_DROPDOWN.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className="block py-2 pl-4 text-sm capitalize text-white transition-colors hover:text-azzurri-blue">{item.label}</Link>
            ))}
          </div>

          <Link href="/events" onClick={() => setMobileOpen(false)} className="border-b border-zinc-800 py-4 text-sm uppercase tracking-wide text-white transition-colors hover:text-azzurri-blue">EVENTS</Link>
          <Link href="/gallery" onClick={() => setMobileOpen(false)} className="border-b border-zinc-800 py-4 text-sm uppercase tracking-wide text-white transition-colors hover:text-azzurri-blue">GALLERY</Link>
          <Link href="/contact" onClick={() => setMobileOpen(false)} className="border-b border-zinc-800 py-4 text-sm uppercase tracking-wide text-white transition-colors hover:text-azzurri-blue">CONTACT</Link>

          <a href="/book" onClick={() => setMobileOpen(false)} className="mt-4 flex items-center justify-center border border-azzurri-blue bg-transparent py-3 text-sm uppercase tracking-widest text-white">
            BOOK A TABLE
          </a>
        </nav>
      </div>
    </header>
  );
}

