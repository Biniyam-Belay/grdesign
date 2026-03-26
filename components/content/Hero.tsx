"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Instagram, Linkedin, Dribbble } from "lucide-react";
import { SiBehance } from "react-icons/si";
import { AnimatePresence, motion } from "framer-motion";
import { getHeroSettings, type HeroSettings } from "@/lib/data/settings";

const KICKER_PHRASES = ["New Brand?", "Brand Evolution?", "Market Leader?", "Future Legacy?"];

export default function Hero() {
  const [settings, setSettings] = useState<HeroSettings | null>(null);
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    getHeroSettings().then(setSettings).catch(console.error);

    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % KICKER_PHRASES.length);
    }, 4000); // Slightly slower for readability

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-[#F5F5F0] text-[#0B132B] w-full flex flex-col font-sans relative overflow-hidden">
      <div
        className="w-full max-w-8xl mx-auto flex flex-col px-6 lg:px-12 pt-[calc(72px+10vh)] pb-8 transition-opacity duration-700 ease-out"
        style={{ opacity: settings ? 1 : 0 }}
      >
        {/* TOP 30% — 3 Columns (50 / 25 / 25), no dividers */}
        <div className="flex-none lg:h-[30%] w-full grid grid-cols-1 lg:grid-cols-4 gap-0 mb-4 pt-4">
          {/* Column 1: 50% width — headline + CTA at 80% */}
          <div className="col-span-1 lg:col-span-2 flex flex-col justify-center h-full pr-0 lg:pr-16">
            <div className="w-full lg:w-4/5 flex flex-col gap-10">
              <h2 className="text-[2.6rem] md:text-5xl lg:text-6xl xl:text-7xl font-light tracking-[-0.03em] leading-[1.05] text-[#0B132B]/80">
                <div className="relative h-[1.1em] overflow-hidden mb-1">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={phraseIndex}
                      initial={{ y: "100%" }}
                      animate={{ y: 0 }}
                      exit={{ y: "-100%" }}
                      transition={{
                        duration: 1.2,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="absolute left-0 top-0 block w-full whitespace-nowrap"
                    >
                      {KICKER_PHRASES[phraseIndex]}
                    </motion.span>
                  </AnimatePresence>
                </div>
                <span className="font-semibold text-[#0B132B]">Let's collaborate.</span>
              </h2>

              {/* CTA */}
              <Link
                href={
                  settings?.contactInfo?.bookingLink ||
                  "https://calendar.app.google/1RTjShD5sgqBmm3K7"
                }
                target="_blank"
                rel="noopener noreferrer"
                className="group w-max flex items-center gap-5 mt-2"
              >
                {/* Glowing red circle with arrow */}
                <div className="relative w-16 h-16 shrink-0">
                  <div className="absolute inset-0 rounded-full border border-[#FF0033]/30 scale-100 group-hover:scale-125 group-hover:opacity-0 transition-all duration-700" />
                  <div className="absolute inset-0 rounded-full bg-[#FF0033] flex items-center justify-center shadow-[0_0_25px_rgba(255,0,51,0.35)] group-hover:shadow-[0_0_45px_rgba(255,0,51,0.6)] transition-shadow duration-500">
                    <svg
                      className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M7 17L17 7M7 7h10v10" />
                    </svg>
                  </div>
                </div>

                {/* Text */}
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#0B132B]/40 mb-0.5">
                    Commission
                  </span>
                  <span className="text-xl font-semibold text-[#0B132B] group-hover:text-[#FF0033] transition-colors duration-300 tracking-tight leading-none">
                    Start a Project
                  </span>
                </div>
              </Link>
            </div>
          </div>

          {/* Column 2: 25% — creative focus + inquiries, left-aligned */}
          <div className="hidden lg:flex col-span-1 lg:col-span-1 flex-col justify-between h-full text-left py-2">
            <div className="flex flex-col gap-3">
              <span className="text-[9px] text-[#FF0033] uppercase tracking-[0.3em] font-bold">
                What we do
              </span>
              <ul className="flex flex-col gap-1.5">
                <li className="text-lg font-semibold text-[#0B132B] tracking-tight">
                  Brand Identity
                </li>
                <li className="text-lg font-semibold text-[#0B132B] tracking-tight">
                  Social Campaigns
                </li>
                <li className="text-lg font-semibold text-[#0B132B] tracking-tight">
                  Web & Digital
                </li>
                <li className="text-lg font-semibold text-[#0B132B] tracking-tight">
                  Art Direction
                </li>
              </ul>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-[9px] text-[#FF0033] uppercase tracking-[0.3em] font-bold mb-1">
                Get in touch
              </span>
              <a
                href={`mailto:${settings?.contactInfo?.email || "biniyam.be.go@gmail.com"}`}
                className="text-base font-medium text-[#0B132B]/80 hover:text-[#FF0033] transition-colors"
              >
                {settings?.contactInfo?.email || "biniyam.be.go@gmail.com"}
              </a>
              {settings?.contactInfo?.phone && (
                <a
                  href={`tel:${settings.contactInfo.phone.replace(/\s/g, "")}`}
                  className="text-sm font-light text-[#0B132B]/40 hover:text-[#0B132B]/80 transition-colors"
                >
                  {settings.contactInfo.phone}
                </a>
              )}
            </div>
          </div>

          {/* Column 3: 25% — socials + status, right-aligned */}
          <div className="hidden lg:flex col-span-1 lg:col-span-1 flex-col justify-between h-full text-right py-2">
            <div className="flex flex-col items-end gap-3">
              <span className="text-[9px] text-[#FF0033] uppercase tracking-[0.3em] font-bold">
                Follow Along
              </span>
              <div className="flex gap-6 text-[#0B132B]/30">
                {settings?.socialLinks?.instagram && (
                  <a
                    href={settings.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="hover:text-[#FF0033] transition-all duration-300"
                  >
                    <Instagram size={22} strokeWidth={1.5} />
                  </a>
                )}
                {settings?.socialLinks?.linkedin && (
                  <a
                    href={settings.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="hover:text-[#FF0033] transition-all duration-300"
                  >
                    <Linkedin size={22} strokeWidth={1.5} />
                  </a>
                )}
                {settings?.socialLinks?.dribbble && (
                  <a
                    href={settings.socialLinks.dribbble}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Dribbble"
                    className="hover:text-[#FF0033] transition-all duration-300"
                  >
                    <Dribbble size={22} strokeWidth={1.5} />
                  </a>
                )}
                {settings?.socialLinks?.behance && (
                  <a
                    href={settings.socialLinks.behance}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Behance"
                    className="hover:text-[#FF0033] transition-all duration-300"
                  >
                    <SiBehance size={22} />
                  </a>
                )}
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="text-[9px] text-[#FF0033] uppercase tracking-[0.3em] font-bold">
                Current Status
              </span>
              <div className="flex items-center gap-3">
                <span className="text-base font-medium text-[#0B132B]/80">
                  {settings?.availability?.label || "Accepting Clients"}
                </span>
                <span className="relative flex h-2.5 w-2.5 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF0033] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FF0033]"></span>
                </span>
              </div>
              <span className="text-xs text-[#0B132B]/30 font-light">
                Est. Ilaala Studio — 2022
              </span>
            </div>
          </div>
        </div>

        {/* IMAGE BANNER — extends to 110vh total, gap above */}
        <div className="w-full overflow-hidden relative h-[80vh] md:h-[110vh] mt-[6vh]">
          {/* Desktop Image */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-[3000ms] hover:scale-[1.03] hidden md:block"
            style={{
              backgroundImage: `url('${settings?.heroBanner?.desktopImage || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"}')`,
            }}
          />
          {/* Mobile Image */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-[3000ms] hover:scale-[1.03] block md:hidden"
            style={{
              backgroundImage: `url('${settings?.heroBanner?.mobileImage || settings?.heroBanner?.desktopImage || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"}')`,
            }}
          />
          {/* Bottom vignette — fades into light bg now */}
        </div>
      </div>
    </section>
  );
}
