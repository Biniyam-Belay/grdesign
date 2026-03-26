"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getHeroSettings, type HeroSettings } from "@/lib/data/settings";

export default function Footer() {
  const year = new Date().getFullYear();
  const pathname = usePathname();
  const [settings, setSettings] = useState<HeroSettings | null>(null);

  useEffect(() => {
    getHeroSettings().then(setSettings).catch(console.error);
  }, []);

  if (pathname?.startsWith("/admin")) return null;

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId?: string) => {
    if (pathname === "/") {
      e.preventDefault();

      let targetPosition = 0;
      if (targetId) {
        const element = document.getElementById(targetId);
        if (!element) return;
        targetPosition = element.getBoundingClientRect().top + window.scrollY;
      }

      const startPosition = window.scrollY;
      const distance = targetPosition - startPosition;

      if (distance === 0) {
        if (targetId) window.history.pushState(null, "", `/#${targetId}`);
        else window.history.pushState(null, "", "/");
        return;
      }

      const duration = 1200; // ms
      let start: number | null = null;

      const easeInOutQuint = (t: number) =>
        t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2;

      const animation = (currentTime: number) => {
        if (start === null) start = currentTime;
        const timeElapsed = currentTime - start;
        const progress = Math.min(timeElapsed / duration, 1);

        window.scrollTo(0, startPosition + distance * easeInOutQuint(progress));

        if (timeElapsed < duration) {
          requestAnimationFrame(animation);
        } else {
          if (targetId) window.history.pushState(null, "", `/#${targetId}`);
          else window.history.pushState(null, "", "/");
        }
      };

      requestAnimationFrame(animation);
    }
  };

  const scrollToTop = () => {
    const startPosition = window.scrollY;
    if (startPosition === 0) return;

    const duration = 1200; // 1.2 seconds for cinematic feel
    let start: number | null = null;

    // S-curve: Slow start, fast middle, slow end
    const easeInOutQuint = (t: number) =>
      t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2;

    const animation = (currentTime: number) => {
      if (start === null) start = currentTime;
      const timeElapsed = currentTime - start;
      const progress = Math.min(timeElapsed / duration, 1);

      // We are going from startPosition down to 0, so distance is -startPosition
      window.scrollTo(0, startPosition - startPosition * easeInOutQuint(progress));

      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    };

    requestAnimationFrame(animation);
  };

  return (
    <footer className="bg-[#F5F5F0] border-t border-[#0B132B]/8">
      <div className="mx-auto max-w-8xl px-6 lg:px-12 py-16 lg:py-24 w-full">
        <div className="grid w-full grid-cols-1 gap-16 md:grid-cols-12">
          {/* Brand + short bio */}
          <div className="md:col-span-6 flex flex-col items-start">
            <Link
              href="/"
              onClick={(e) => handleSmoothScroll(e)}
              className="group inline-flex items-baseline gap-0.5 flex-1"
              aria-label="Ilaala.Studio home"
            >
              <span className="text-[#0B132B] font-bold text-4xl tracking-tight group-hover:text-[#0B132B]/60 transition-colors duration-300">
                Ilaala
              </span>
              <span className="text-[#FF0033] text-4xl font-bold">.Studio</span>
            </Link>
            <p className="mt-6 max-w-sm text-lg font-light text-[#0B132B]/60 leading-relaxed">
              Strategic design and digital products for those who refuse to be ordinary. Crafting
              clear, effective brands and interfaces.
            </p>

            {/* Socials */}
            <div className="mt-8 flex flex-wrap items-center gap-6">
              {[
                {
                  label: "Instagram",
                  href:
                    settings?.socialLinks?.instagram ||
                    "https://www.instagram.com/bini.b.g?igsh=enp4OTM1NDU5YjNj",
                },
                {
                  label: "Dribbble",
                  href: settings?.socialLinks?.dribbble || "https://dribbble.com/bini-yam",
                },
                {
                  label: "LinkedIn",
                  href:
                    settings?.socialLinks?.linkedin ||
                    "https://www.linkedin.com/in/biniyam-belay-147673270/",
                },
                {
                  label: "Behance",
                  href: settings?.socialLinks?.behance || "https://www.behance.net/biniyambelay",
                },
              ]
                .filter((item) => item.href.trim().length > 0)
                .map(({ label, href }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#0B132B]/50 hover:text-[#FF0033] transition-colors duration-300 relative group"
                  >
                    {label}
                    <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#FF0033] transition-all duration-300 group-hover:w-full"></span>
                  </a>
                ))}
            </div>
          </div>

          {/* Nav + contact */}
          <div className="md:col-span-6 lg:col-span-5 md:ml-auto flex flex-col gap-12 pt-2 md:pt-0">
            <nav aria-label="Footer Navigation">
              <ul className="flex flex-wrap gap-8">
                {["Work", "Services", "Contact"].map((item) => (
                  <li key={item}>
                    {item === "Contact" ? (
                      <Link
                        href={
                          settings?.contactInfo?.bookingLink ||
                          "https://calendar.app.google/1RTjShD5sgqBmm3K7"
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold uppercase tracking-[0.15em] text-[#0B132B]/80 hover:text-[#FF0033] transition-colors duration-300 flex items-center gap-2 group"
                      >
                        {item}
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF0033] scale-0 group-hover:scale-100 transition-transform duration-300" />
                      </Link>
                    ) : (
                      <Link
                        href={item === "Services" ? "/#services" : `/${item.toLowerCase()}`}
                        onClick={
                          item === "Services" ? (e) => handleSmoothScroll(e, "services") : undefined
                        }
                        className="text-sm font-semibold uppercase tracking-[0.15em] text-[#0B132B]/80 hover:text-[#FF0033] transition-colors duration-300 flex items-center gap-2 group"
                      >
                        {item}
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF0033] scale-0 group-hover:scale-100 transition-transform duration-300" />
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            <div className="text-sm flex flex-col gap-3">
              <a
                href={`mailto:${settings?.contactInfo?.email || "biniyam.be.go@gmail.com"}`}
                className="text-xl md:text-2xl font-light text-[#0B132B] hover:text-[#FF0033] transition-colors duration-300 tracking-tight"
              >
                {settings?.contactInfo?.email || "biniyam.be.go@gmail.com"}
              </a>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#0B132B]/40">
                Remote-First · Working Worldwide
              </p>
            </div>
          </div>
        </div>

        {/* Bottom edge */}
        <div className="mt-20 border-t border-[#0B132B]/8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#0B132B]/30">
            © {year} Ilaala.Studio — All Rights Reserved
          </div>

          <button
            onClick={scrollToTop}
            className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#0B132B]/30 hover:text-[#FF0033] transition-colors flex items-center gap-1"
          >
            Back to Top ↑
          </button>
        </div>
      </div>
    </footer>
  );
}
