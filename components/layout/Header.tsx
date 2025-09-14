"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

const NAV_ITEMS = [
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
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-neutral-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85 px-4 sm:px-6 py-3 md:py-3">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-2 md:px-0">
          <Link href="/" className="text-lg font-bold tracking-tight text-neutral-900">
            GR
          </Link>
        </div>
      </header>
    );
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-neutral-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85 px-4 sm:px-6 py-3 md:py-3">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-2 md:px-0">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 0.72, 0, 1] }}
        >
          <Link href="/" className="text-lg font-bold tracking-tight text-neutral-900">
            GR
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <motion.nav
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, y: -8 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { staggerChildren: 0.08, delayChildren: 0.15 },
            },
          }}
          className="desktop-nav hidden md:flex items-center space-x-8"
        >
          {NAV_ITEMS.map((item) => {
            const isExternal = item.href.startsWith("http");
            return (
              <motion.div
                key={item.href}
                variants={{ hidden: { opacity: 0, y: -6 }, visible: { opacity: 1, y: 0 } }}
              >
                <Link
                  href={item.href}
                  className={`group relative text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/20 ${
                    pathname === item.href
                      ? "text-neutral-900"
                      : "text-neutral-500 hover:text-neutral-800"
                  }`}
                  {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  <span className="relative inline-block">
                    {item.label}
                    <span className="pointer-events-none absolute -bottom-1 left-0 h-px w-0 bg-neutral-400 transition-all duration-300 group-hover:w-full" />
                  </span>
                  {pathname === item.href && (
                    <motion.span
                      layoutId="underline-active"
                      className="pointer-events-none absolute -bottom-1 left-0 right-0 h-px bg-neutral-900"
                      transition={{ type: "spring", stiffness: 360, damping: 34, mass: 0.5 }}
                    />
                  )}
                </Link>
              </motion.div>
            );
          })}
        </motion.nav>

        {/* Hamburger Button */}
        <button
          className="hamburger-button relative z-50 flex h-8 w-8 flex-col items-center justify-center gap-[5px] md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
        >
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="h-0.5 w-6 rounded-full bg-neutral-900"
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
              className="fixed inset-0 z-40 flex flex-col items-center justify-center space-y-10 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90"
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
                      className="text-3xl font-semibold tracking-tight text-neutral-900 hover:text-neutral-600"
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
