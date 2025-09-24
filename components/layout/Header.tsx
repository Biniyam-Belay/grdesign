"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
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
              className="fixed inset-0 z-40 bg-white flex flex-col items-center justify-center"
            >
              <div className="w-full max-w-sm px-6">
                {/* Top row: nav items */}
                <div className="mb-10 flex flex-wrap items-center justify-center gap-6 text-lg font-medium text-black">
                  {NAV_ITEMS.filter((i) => i.label !== "Contact").map((item, idx) => {
                    const isExternal = item.href.startsWith("http");
                    return (
                      <motion.div
                        key={item.href}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.06 * idx, duration: 0.35, ease: [0.22, 0.72, 0, 1] }}
                      >
                        <Link
                          href={item.href}
                          className="transition-colors hover:opacity-80"
                          {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {item.label}
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Second row: socials + contact button */}
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {/* Social icons */}
                  <a
                    href="https://www.instagram.com/bini.b.g?igsh=enp4OTM1NDU5YjNj"
                    aria-label="Instagram"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-black transition-colors hover:bg-black hover:text-white"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x="3"
                        y="3"
                        width="18"
                        height="18"
                        rx="5"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      />
                      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.8" />
                      <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
                    </svg>
                  </a>
                  <a
                    href="https://dribbble.com/bini-yam"
                    aria-label="Dribbble"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-black transition-colors hover:bg-black hover:text-white"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8" />
                      <path
                        d="M4 10.5c2.5 0 8.5-.5 12.5-6.5"
                        stroke="currentColor"
                        strokeWidth="1.2"
                      />
                      <path d="M6 18c2-4.5 5.5-7 12-6" stroke="currentColor" strokeWidth="1.2" />
                      <path
                        d="M9 3.8c3.5 4 5.8 9.5 6.8 16.5"
                        stroke="currentColor"
                        strokeWidth="1.2"
                      />
                    </svg>
                  </a>
                  <a
                    href="https://www.linkedin.com/in/biniyam-belay-147673270/"
                    aria-label="LinkedIn"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-black transition-colors hover:bg-black hover:text-white"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x="3"
                        y="3"
                        width="18"
                        height="18"
                        rx="2.5"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      />
                      <rect x="6" y="9" width="2.5" height="9" fill="currentColor" />
                      <circle cx="7.25" cy="6.75" r="1.25" fill="currentColor" />
                      <path
                        d="M12 18v-5.2c0-1.5 1.2-2.3 2.4-2.3s2.6.9 2.6 2.7V18h-2.5v-4.6c0-.7-.4-1.2-1.1-1.2-.7 0-1.4.5-1.4 1.2V18H12z"
                        fill="currentColor"
                      />
                    </svg>
                  </a>
                  <a
                    href="https://www.behance.net/biniyambelay"
                    aria-label="Behance"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-black transition-colors hover:bg-black hover:text-white"
                  >
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <text
                        x="5"
                        y="16"
                        fontSize="10"
                        fontFamily="sans-serif"
                        fill="currentColor"
                        fontWeight="700"
                      >
                        Be
                      </text>
                    </svg>
                  </a>

                  {/* Contact button */}
                  <a
                    href="https://calendar.app.google/1RTjShD5sgqBmm3K7"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 inline-flex h-10 items-center justify-center rounded-full bg-black px-4 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Contact
                  </a>
                </div>

                {/* Info row */}
                <div className="mt-6 text-center text-sm text-neutral-600">
                  <a href="mailto:biniyam.be.go@gmail.com" className="text-black hover:opacity-80">
                    biniyam.be.go@gmail.com
                  </a>
                  <span className="mx-2 text-neutral-400">•</span>
                  <span>Based in Addis Ababa · Working worldwide</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
