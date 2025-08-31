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
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-transparent mix-blend-difference">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-lg font-bold text-white">
            GR
          </Link>
        </div>
      </header>
    );
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-transparent mix-blend-difference">
      <div className="flex justify-between items-center">
        <Link href="/" className="text-lg font-bold text-white">
          GR
        </Link>

        {/* Desktop Navigation */}
        <div className="desktop-nav hidden md:flex items-center space-x-8">
          {NAV_ITEMS.map((item) => {
            const isExternal = item.href.startsWith("http");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative text-sm font-medium text-white transition-opacity hover:opacity-75 ${
                  pathname === item.href ? "opacity-100" : "opacity-60"
                }`}
                {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {item.label}
                {pathname === item.href && (
                  <motion.div
                    className="absolute bottom-[-4px] left-0 right-0 h-[2px] bg-white"
                    layoutId="underline"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Hamburger Button */}
        <button
          className="hamburger-button md:hidden z-50 flex flex-col justify-center items-center w-6 h-6 space-y-1"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <motion.div
            className="w-6 h-0.5 bg-white"
            animate={isMenuOpen ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
          ></motion.div>
          <motion.div
            className="w-6 h-0.5 bg-white"
            animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }}
          ></motion.div>
          <motion.div
            className="w-6 h-0.5 bg-white"
            animate={isMenuOpen ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }}
          ></motion.div>
        </button>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background z-40 flex flex-col items-center justify-center space-y-8"
            >
              {NAV_ITEMS.map((item) => {
                const isExternal = item.href.startsWith("http");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-3xl font-bold text-foreground"
                    {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
