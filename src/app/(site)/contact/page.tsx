import { FadeIn } from "@/components/FadeIn";
import { getSiteContent } from "@/lib/siteContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Azzurri",
  description: "Get in touch or find the Azzurri location in Kigali.",
};

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  return (
    <div className="relative overflow-hidden">
      <section className="bg-black/95 pt-20 pb-12 sm:pt-24 sm:pb-16">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 md:flex-row md:items-start md:gap-14">
          <FadeIn className="w-full md:w-1/2">
            <div className="space-y-9">
              <div>
                <h1 className="heading-font whitespace-nowrap text-4xl font-medium tracking-[0.12em] text-[#D4AF37] sm:text-5xl md:text-6xl">
                  Visit Us
                </h1>
                <div className="mt-4 h-px w-20 bg-[#D4AF37]/70" />
                <p className="mt-6 w-full max-w-none text-sm leading-relaxed text-zinc-300 sm:text-base">
                  Located in the heart of Kimihurura with breathtaking views of the hills of Kigali.
                </p>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium text-[#D4AF37]">Address</p>
                <p className="text-sm text-zinc-300">Kigali/ Kimihurura</p>
                <p className="text-sm text-zinc-300">
                  KG 28 Avenue, Kigali closer Adventist Church
                </p>
              </div>

              <div className="space-y-3 text-sm text-zinc-300 sm:text-base">
                <p className="text-sm font-medium text-[#D4AF37]">Hours</p>
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                  <span className="whitespace-nowrap">Tuesday - Thursday</span>
                  <span className="whitespace-nowrap text-zinc-400">10:00 AM - 1:00 AM</span>
                </div>
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                  <span className="whitespace-nowrap">Friday - Saturday</span>
                  <span className="whitespace-nowrap text-zinc-400">10:00 AM - 1:00 AM</span>
                </div>
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                  <span className="whitespace-nowrap">Sunday</span>
                  <span className="whitespace-nowrap text-zinc-400">10:00 AM - 1:00 AM</span>
                </div>
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                  <span className="whitespace-nowrap">Monday</span>
                  <span className="whitespace-nowrap text-zinc-400">10:00 AM - 1:00 AM</span>
                </div>
              </div>

              <div className="space-y-1 text-sm text-zinc-300 sm:text-base">
                <p className="text-sm font-medium text-[#D4AF37]">Contact</p>
                <p className="whitespace-nowrap">+250 793 084 995</p>
                <p className="whitespace-nowrap">reservations@azzurri.com</p>
              </div>

              <div className="pt-2">
                <div className="flex flex-col gap-4">
                  <a
                    href="/book"
                    className="gold-gradient inline-flex h-11 w-[280px] items-center justify-center whitespace-nowrap rounded-md px-8 text-xs font-semibold uppercase tracking-[0.18em] text-black shadow-md shadow-yellow-500/25 hover:shadow-yellow-400/40"
                  >
                    Make Reservation
                  </a>
                  <a
                    href="https://maps.google.com/?q=Azzurri+Kigali+Kimihurura"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-11 w-[280px] items-center justify-center whitespace-nowrap rounded-md border border-[#D4AF37] px-8 text-xs font-semibold uppercase tracking-[0.18em] text-[#D4AF37] hover:bg-[#D4AF37]/10"
                  >
                    Get Directions
                  </a>
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={120} className="w-full md:w-[55%] lg:w-[60%] md:flex md:justify-end">
            <div className="h-[350px] w-full overflow-hidden rounded-3xl border border-zinc-700/70 bg-black/40 shadow-[0_25px_80px_rgba(0,0,0,0.85)] sm:h-[450px] md:h-[480px] lg:h-[500px] md:w-[95%] lg:w-full max-w-none">
              <iframe
                title="Azzurri Kigali"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d390.110208989431!2d30.085970473208192!3d-1.9614453068728352!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19dca777ef43544b%3A0xb1c95bbfefb7ff00!2sLa%20Creola!5e0!3m2!1sen!2srw!4v1771455504152!5m2!1sen!2srw"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
