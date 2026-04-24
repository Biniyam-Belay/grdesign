"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { X, ArrowRight } from "lucide-react";
import { getHeroSettings, HeroSettings } from "@lib/data/settings";

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [settings, setSettings] = useState<HeroSettings | null>(null);

  // Parse banner text into phrases separated by ✦ or newline
  const rawBannerText = settings?.banner?.text || "";
  const marqueePhrases = rawBannerText
    .split(/[\n✦]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  const isBannerEnabled = !!(settings?.banner?.enabled && rawBannerText.trim());

  useEffect(() => {
    setIsMounted(true);
    const fetchSettings = async () => {
      const fetchedSettings = await getHeroSettings();
      setSettings(fetchedSettings);
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "auto";
  }, [isMenuOpen]);

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId?: string) => {
    if (pathname === "/") {
      e.preventDefault();
      setIsMenuOpen(false);

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

  if (!isMounted) return null;
  if (pathname?.startsWith("/studio")) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex flex-col">
      {/* Sliding Marquee Top Banner — Admin Controllable */}
      <AnimatePresence mode="wait">
        {isBannerEnabled && (
          <motion.div
            key={rawBannerText}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white overflow-hidden py-4 border-b border-[#0B132B]/5 flex items-center h-[56px] relative"
          >
            <motion.div
              className="flex whitespace-nowrap items-center will-change-transform"
              animate={{ x: ["0%", "-50%"] }}
              transition={{
                duration: 45, // Slightly slower for even more premium feel
                ease: "linear",
                repeat: Infinity,
              }}
            >
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center text-[10px] font-semibold uppercase tracking-[0.2em] text-[#0B132B]/80"
                >
                  {marqueePhrases.map((phrase, idx) => (
                    <div key={idx} className="flex items-center">
                      <span className="mx-12 md:mx-20 text-[#FF0033]/70 text-xs shadow-sm">✦</span>
                      <span>{phrase}</span>
                    </div>
                  ))}
                </div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navbar */}
      <header
        className={`transition-all duration-500 relative z-50 ${
          scrolled
            ? "bg-[#F5F5F0]/80 backdrop-blur-xl shadow-[0_2px_30px_rgba(11,19,43,0.07)]"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-[72px] items-center justify-between px-6 lg:px-12 max-w-8xl">
          {/* LEFT — Logo */}
          <Link
            href="/"
            onClick={(e) => handleSmoothScroll(e)}
            className="group flex items-baseline gap-0.5 flex-1"
          >
            <span className="text-[#0B132B] font-bold text-xl tracking-tight group-hover:text-[#0B132B]/60 transition-colors">
              Ilaala
            </span>
            <span className="text-[#FF0033] text-xl font-bold">.Studio</span>
          </Link>

          {/* RIGHT — Minimal Nav + Contact Pill */}
          <div className="hidden md:flex items-center gap-10 ml-auto mr-2">
            {/* Nav Links */}
            <nav className="flex items-center gap-8">
              <Link
                href="/work"
                className={`text-sm font-semibold uppercase tracking-[0.18em] transition-colors duration-300 relative group flex items-center gap-2 ${
                  pathname === "/work" ? "text-[#FF0033]" : "text-[#0B132B]/60 hover:text-[#0B132B]"
                }`}
              >
                Work
                {pathname === "/work" ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF0033]" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF0033] scale-0 group-hover:scale-100 transition-transform duration-300" />
                )}
              </Link>

              <Link
                href="/#services"
                onClick={(e) => handleSmoothScroll(e, "services")}
                className={`text-sm font-semibold uppercase tracking-[0.18em] transition-colors duration-300 relative group flex items-center gap-2 ${
                  pathname === "/#services"
                    ? "text-[#FF0033]"
                    : "text-[#0B132B]/60 hover:text-[#0B132B]"
                }`}
              >
                Services
                {pathname === "/#services" ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF0033]" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF0033] scale-0 group-hover:scale-100 transition-transform duration-300" />
                )}
              </Link>
            </nav>

            {/* 'Awesome' Dual-Slide CTA */}
            <Link
              href="https://calendar.app.google/1RTjShD5sgqBmm3K7"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center justify-center h-11 px-8 bg-[#0B132B] rounded-full overflow-hidden transition-all duration-500 hover:shadow-[0_10px_40px_rgba(11,19,43,0.3)] hover:scale-[1.02] ml-6 active:scale-95"
            >
              {/* Perfectly Centered Text Roll */}
              <div className="relative overflow-hidden h-[16px] w-[90px] flex items-center justify-center pointer-events-none">
                <div className="absolute top-0 left-0 w-full flex flex-col transition-transform duration-500 ease-[0.22,1,0.36,1] group-hover:-translate-y-1/2">
                  <span className="h-[16px] flex items-center justify-center text-[11px] font-bold uppercase tracking-[0.25em] text-white">
                    Let's Talk
                  </span>
                  <span className="h-[16px] flex items-center justify-center text-[11px] font-bold uppercase tracking-[0.25em] text-[#FF0033]">
                    Let's Talk
                  </span>
                </div>
              </div>

              {/* Pulsing signal dot inside button */}
              <div className="ml-3 flex h-2 w-2 relative shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF0033] opacity-60"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF0033]"></span>
              </div>

              {/* Internal Refractive Shine */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden flex flex-col gap-[5px] p-2 ml-auto"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <motion.span
              className="h-[1.5px] w-6 bg-[#0B132B] block origin-center"
              animate={isMenuOpen ? { rotate: 45, y: 6.5 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3 }}
            />
            <motion.span
              className="h-[1.5px] w-6 bg-[#0B132B] block"
              animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
            <motion.span
              className="h-[1.5px] w-6 bg-[#0B132B] block origin-center"
              animate={isMenuOpen ? { rotate: -45, y: -6.5 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3 }}
            />
          </button>
        </div>

        {/* Awesome Animated Bottom Line */}
        <div className="absolute bottom-0 left-0 right-0 h-px flex justify-center overflow-hidden">
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="w-full h-full bg-[#0B132B]/10 origin-center relative overflow-hidden flex"
          >
            {/* Highlight sweep effect */}
            <motion.div
              animate={{ x: ["-100%", "300%"] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
              className="absolute top-0 bottom-0 w-1/2 md:w-1/4 bg-gradient-to-r from-transparent via-[#FF0033]/70 to-transparent"
            />
          </motion.div>
        </div>
      </header>

      {/* Premium Full-Screen Mobile Menu Takeover */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: "10%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "10%" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[100] bg-[#0B132B] text-white md:hidden flex flex-col overflow-hidden"
          >
            {/* Ambient Background Glow */}
            <div className="absolute top-[-10%] right-[-10%] w-[70vw] h-[70vw] rounded-full bg-[#0055FF]/20 blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-[#FF0033]/15 blur-[80px] pointer-events-none" />

            {/* Mobile Header (Dark Mode) */}
            <div className="flex items-center justify-between px-6 py-6 border-b border-white/5 relative z-10">
              <Link
                href="/"
                onClick={(e) => {
                  handleSmoothScroll(e);
                  setIsMenuOpen(false);
                }}
                className="flex items-baseline gap-0.5"
              >
                <span className="text-white font-bold text-xl tracking-tight">Ilaala</span>
                <span className="text-[#FF0033] text-xl font-bold">.Studio</span>
              </Link>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:bg-white hover:text-[#0B132B] transition-all"
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            {/* Nav Links Container */}
            <div className="flex-1 flex flex-col justify-center px-8 relative z-10">
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-[10px] text-[#FF0033] uppercase tracking-[0.4em] font-bold mb-8 flex items-center gap-4"
              >
                <span className="w-8 h-[1px] bg-[#FF0033]/50" /> Navigation
              </motion.span>
              <nav className="flex flex-col gap-6">
                {[
                  { label: "Home", href: "/" },
                  { label: "Work Archive", href: "/work" },
                  { label: "Services", href: "/#services" },
                ].map((item, idx) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.15 + idx * 0.1,
                      duration: 0.7,
                      ease: [0.76, 0, 0.24, 1],
                    }}
                  >
                    <Link
                      href={item.href}
                      onClick={(e) => {
                        if (item.href === "/#services" || item.href === "/") {
                          handleSmoothScroll(e, item.href === "/" ? undefined : "services");
                        } else {
                          setIsMenuOpen(false);
                        }
                        // Slight delay so the user feels the click before it snaps shut
                        setTimeout(() => setIsMenuOpen(false), 200);
                      }}
                      className={`group flex items-center justify-between py-2 text-4xl sm:text-5xl font-light tracking-[-0.04em] transition-all duration-500 ${
                        pathname === item.href && item.href === "/work"
                          ? "text-white"
                          : "text-white/40 hover:text-white"
                      }`}
                    >
                      <span className="group-hover:translate-x-4 transition-transform duration-500">
                        {item.label}
                      </span>
                      {pathname === item.href && item.href === "/work" && (
                        <span className="w-2 h-2 rounded-full bg-[#FF0033] shadow-[0_0_15px_rgba(255,0,51,0.5)]" />
                      )}
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </div>

            {/* Mobile Footer Area */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="px-8 pb-10 flex flex-col gap-8 relative z-10"
            >
              <div className="flex gap-8 text-white/30 pt-8 border-t border-white/5">
                <a
                  href="https://www.instagram.com/bini.b.g?igsh=enp4OTM1NDU5YjNj"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors duration-300 uppercase text-[10px] tracking-[0.2em] font-bold"
                >
                  Instagram
                </a>
                <a
                  href="https://www.linkedin.com/in/biniyam-belay-147673270/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors duration-300 uppercase text-[10px] tracking-[0.2em] font-bold"
                >
                  LinkedIn
                </a>
                <a
                  href="https://dribbble.com/bini-yam"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors duration-300 uppercase text-[10px] tracking-[0.2em] font-bold"
                >
                  Dribbble
                </a>
              </div>

              <a
                href="https://calendar.app.google/1RTjShD5sgqBmm3K7"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMenuOpen(false)}
                className="group flex items-center justify-between w-full px-8 py-5 bg-[#FF0033] text-white font-bold text-xs uppercase tracking-[0.2em] rounded-full shadow-[0_10px_30px_rgba(255,0,51,0.25)] hover:bg-[#0055FF] hover:shadow-[0_10px_30px_rgba(0,85,255,0.3)] transition-all duration-500"
              >
                Start a Project
                <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:rotate-45 transition-transform duration-500">
                  <ArrowRight size={16} strokeWidth={2.5} />
                </span>
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
