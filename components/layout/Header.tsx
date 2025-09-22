"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "https://calendar.app.google/1RTjShD5sgqBmm3K7", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isMenuOpen]);

  if (!isMounted) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-3 md:py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-center">
          <nav
            aria-label="Primary"
            className="hidden md:flex w-[50vw] max-w-3xl items-center justify-between rounded-full border border-white/15 bg-white/0 px-6 py-2 text-sm shadow-[0_8px_24px_rgba(0,0,0,0.08)] backdrop-blur-xl backdrop-saturate-150 backdrop-contrast-125 supports-[backdrop-filter]:bg-white/0 text-black dark:text-white"
          >
            {NAV_ITEMS.map((item) => (
              <span key={item.href} className="px-2 py-1">
                {item.label}
              </span>
            ))}
          </nav>

          {/* Mobile keeps hamburger only while mounting */}
          <div className="md:hidden h-8" />
        </div>
      </header>
    );
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-3 md:py-4">
      <div className="mx-auto flex max-w-7xl items-center justify-center">
        {/* Centered glass nav (desktop) */}
        <motion.nav
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, y: -8 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { staggerChildren: 0.08, delayChildren: 0.1 },
            },
          }}
          aria-label="Primary"
          className="hidden md:flex w-[50vw] max-w-3xl items-center justify-between rounded-full border border-white/15 bg-white/0 px-6 py-2 text-sm shadow-[0_10px_30px_rgba(0,0,0,0.12)] backdrop-blur-xl backdrop-saturate-150 backdrop-contrast-125 supports-[backdrop-filter]:bg-white/0 relative overflow-hidden text-black dark:text-white"
        >
          {/* Glass layers */}
          {/* Light @ -45deg (diagonal highlight) */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(-45deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.08) 35%, rgba(255,255,255,0.04) 60%, rgba(255,255,255,0.0) 100%)",
            }}
          />
          {/* Depth (inner highlights) */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -1px 0 rgba(255,255,255,0.10)",
            }}
          />
          {/* Dispersion (subtle chroma tint along diagonal) */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 mix-blend-overlay blur-[2px] opacity-20"
            style={{
              background:
                "linear-gradient(-45deg, rgba(255,80,150,0.14) 0%, rgba(0,200,255,0.14) 100%)",
            }}
          />
          {/* Frost (fine grain) */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.7) 1px, transparent 1px)",
              backgroundSize: "4px 4px",
            }}
          />

          {NAV_ITEMS.map((item) => {
            const isExternal = item.href.startsWith("http");
            const isActive = pathname === item.href;
            return (
              <motion.div
                key={item.href}
                variants={{ hidden: { opacity: 0, y: -6 }, visible: { opacity: 1, y: 0 } }}
                className="flex-1 text-center"
              >
                <Link
                  href={item.href}
                  className={`group relative inline-flex items-center justify-center rounded-full px-3 py-1.5 font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 ${
                    isActive ? "text-current" : "text-current/70 hover:text-current"
                  }`}
                  {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  {/* active pill background */}
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-black/5 dark:bg-white/15"
                      transition={{ type: "spring", stiffness: 300, damping: 28, mass: 0.6 }}
                    />
                  )}
                  {item.label}
                </Link>
              </motion.div>
            );
          })}
        </motion.nav>

        {/* Hamburger Button (mobile) */}
        <button
          className="hamburger-button relative z-50 flex h-8 w-8 flex-col items-center justify-center gap-[5px] md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
        >
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="h-0.5 w-6 rounded-full bg-black dark:bg-white"
              animate={
                isMenuOpen
                  ? i === 0
                    ? { rotate: 45, y: 7 }
                    : i === 1
                      ? { opacity: 0 }
                      : { rotate: -45, y: -7 }
                  : { rotate: 0, y: 0, opacity: 1 }
              }
              transition={{ duration: 0.4, ease: [0.65, 0, 0.35, 1] }}
            />
          ))}
        </button>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
              className="fixed inset-0 z-40 flex flex-col items-center justify-center space-y-10 bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/70 text-black dark:bg-black/80 dark:text-white dark:backdrop-blur-md dark:supports-[backdrop-filter]:bg-black/70"
            >
              {NAV_ITEMS.map((item, idx) => {
                const isExternal = item.href.startsWith("http");
                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08 * idx, duration: 0.45, ease: [0.22, 0.72, 0, 1] }}
                  >
                    <Link
                      href={item.href}
                      className="text-3xl font-semibold tracking-tight text-black hover:text-black/70 dark:text-white dark:hover:text-white/70"
                      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
