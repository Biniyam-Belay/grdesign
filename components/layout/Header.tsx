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
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-black/10">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-center px-4 sm:px-6">
          <nav aria-label="Primary" className="hidden md:flex items-center gap-x-8 text-black">
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
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-black/10">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-center px-4 sm:px-6">
        {/* Centered nav (desktop) */}
        <motion.nav
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="hidden md:flex items-center gap-x-8 text-sm font-medium text-black"
        >
          {NAV_ITEMS.map((item) => {
            const isExternal = item.href.startsWith("http");
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-1 transition-colors duration-200 ${
                  isActive ? "text-black" : "text-black/70 hover:text-black"
                }`}
                {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {item.label}
                <span
                  className={`pointer-events-none absolute -bottom-1 left-0 h-0.5 w-full origin-left scale-x-0 bg-current transition-transform duration-200 ease-out ${
                    isActive ? "scale-x-100" : ""
                  }`}
                />
              </Link>
            );
          })}
        </motion.nav>

        {/* Hamburger Button (mobile) */}
        <div className="md:hidden flex-1 flex justify-end">
          <button
            className="hamburger-button relative z-50 flex h-8 w-8 flex-col items-center justify-center gap-[5px]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
          >
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="h-0.5 w-6 rounded-full bg-black"
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
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
              className="fixed inset-0 z-40 bg-white flex flex-col items-center justify-center space-y-10"
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
                      className="text-3xl font-semibold tracking-tight text-black transition-transform duration-200 ease-out hover:opacity-80 hover:scale-[1.02]"
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
