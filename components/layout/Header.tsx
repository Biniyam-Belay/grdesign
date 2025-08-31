"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const NAV_ITEMS = [
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    const { style } = document.body;
    const prev = style.overflow;
    style.overflow = isMenuOpen ? "hidden" : prev || "";
    return () => {
      style.overflow = prev || "";
    };
  }, [isMenuOpen]);

  // Check if the current path matches the link
  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname?.startsWith(`${href}/`);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[9999] w-full bg-white transition-all duration-300 ease-in-out ${
          isScrolled ? "py-2.5 shadow-sm" : "py-4"
        }`}
      >
        <div className="mx-auto flex w-full max-w-8xl items-center justify-between px-5">
          {/* Logo */}
          <div>
            <Link href="/" className="flex items-center font-serif text-2xl font-medium text-black">
              Bini
              <span className="text-gray-300 transition-colors duration-300 group-hover:text-gray-400">
                .
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 md:flex">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative py-2 text-sm font-medium uppercase tracking-wider transition-colors ${
                    active ? "text-black" : "text-gray-500 hover:text-black"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                  {active && (
                    <span className="absolute left-1/2 bottom-0 h-1 w-1 -translate-x-1/2 rounded-full bg-black" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            onClick={() => setIsMenuOpen((v) => !v)}
            className="flex items-center justify-center p-2 md:hidden"
          >
            <div className="relative h-5 w-6">
              <span
                className={`absolute left-0 h-0.5 w-full bg-black transition-all duration-300 ease-in-out ${
                  isMenuOpen ? "top-2 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 top-2 h-0.5 w-full bg-black transition-opacity duration-300 ease-in-out ${
                  isMenuOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 h-0.5 w-full bg-black transition-all duration-300 ease-in-out ${
                  isMenuOpen ? "top-2 -rotate-45" : "top-4"
                }`}
              />
            </div>
          </button>
        </div>
      </header>

      {/* Full Screen Mobile Menu */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 z-[9998] flex flex-col items-center justify-center bg-white transition-opacity duration-300 ease-in-out md:hidden ${
          isMenuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        role="dialog"
        aria-modal="true"
      >
        <nav className="flex w-full flex-col items-center justify-center space-y-8 p-5">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMenuOpen(false)}
              className={`text-2xl font-medium tracking-wider transition-colors ${
                isActive(item.href) ? "text-black" : "text-gray-500 hover:text-black"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
