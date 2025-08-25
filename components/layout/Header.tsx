"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { initGSAP } from "@lib/gsap";

type NavItem = { href: string; label: string };
const NAV: NavItem[] = [
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export function Header() {
  const pathname = usePathname();
  const rootRef = useRef<HTMLElement | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // Subtle drop-in on mount (GSAP)
  useEffect(() => {
    const gsap = initGSAP();
    if (!rootRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(rootRef.current, {
        y: -12,
        opacity: 0,
        duration: 0.45,
        ease: "power2.out",
      });
    });
    return () => ctx.revert();
  }, []);

  // Shadow + border on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const NavLink = ({ href, label }: NavItem) => {
    const active = isActive(pathname, href);
    return (
      <Link
        href={href}
        data-active={active}
        aria-current={active ? "page" : undefined}
        className={[
          "group relative inline-flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
          active ? "text-neutral-900" : "text-neutral-500 hover:text-neutral-900",
          // underline accent on active/hover
          "before:absolute before:-bottom-1 before:left-3 before:right-3 before:h-[2px] before:rounded-full",
          "before:scale-x-0 before:transition-transform before:duration-200 before:origin-center",
          "before:bg-neutral-900",
          "hover:before:scale-x-100 data-[active=true]:before:scale-x-100",
          // focus ring
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
        ].join(" ")}
      >
        {label}
      </Link>
    );
  };

  return (
    <header
      ref={rootRef}
      className={[
        "sticky top-0 z-50",
        // white background with gentle translucency + blur (only when supported)
        "bg-white/90 supports-[backdrop-filter]:bg-white/70 supports-[backdrop-filter]:backdrop-blur",
        // border & shadow when scrolled
        scrolled ? "border-b border-neutral-200/70 shadow-sm" : "border-b border-transparent",
        "transition-colors",
      ].join(" ")}
    >
      <nav
        className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 py-3"
        aria-label="Main"
      >
        <Link
          href="/"
          className="font-semibold tracking-tight text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-md px-1"
        >
          GR<span className="text-neutral-400">.</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
        </div>

        {/* Contact CTA (desktop) */}
        <div className="hidden md:block">
          <Link
            href="/contact"
            className="inline-flex items-center rounded-lg border border-neutral-200 px-3 py-2 text-sm font-medium text-neutral-900 hover:border-neutral-900 hover:bg-neutral-900 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            Let’s work
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-md border border-neutral-200 text-neutral-900 hover:bg-neutral-50 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        >
          <span className="sr-only">Menu</span>
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            className="transition-transform"
            style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)" }}
          >
            <path
              d="M4 7h16M4 12h16M4 17h16"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </nav>

      {/* Mobile sheet */}
      <div
        className={[
          "md:hidden overflow-hidden transition-[max-height,opacity]",
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
        ].join(" ")}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 pb-4">
          <div className="grid gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                data-active={isActive(pathname, item.href)}
                className={[
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive(pathname, item.href)
                    ? "text-neutral-900 bg-neutral-50"
                    : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
                ].join(" ")}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="mt-1 inline-flex items-center justify-center rounded-lg border border-neutral-200 px-3 py-2 text-sm font-medium text-neutral-900 hover:border-neutral-900 hover:bg-neutral-900 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              Let’s work
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
