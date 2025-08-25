"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { initGSAP } from "@lib/gsap";
import { useReducedMotion } from "@lib/hooks/useReducedMotion";

type NavItem = { href: string; label: string };
const NAV: NavItem[] = [
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
];

function isActive(pathname: string | null, href: string) {
  if (!pathname) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export function Header() {
  const pathname = usePathname();
  const rootRef = useRef<HTMLElement | null>(null);
  const navbarRef = useRef<HTMLDivElement | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();

  // Subtle reveal animation on mount with staggered nav links (GSAP)
  useEffect(() => {
    if (reduced) return;

    const gsap = initGSAP();
    if (!rootRef.current || !navbarRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Animate the header container
      tl.fromTo(rootRef.current, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.6 });

      // Staggered animation for nav links
      if (navbarRef.current) {
        const navLinks = navbarRef.current.querySelectorAll(".nav-link");
        tl.fromTo(
          navLinks,
          { opacity: 0, y: -8 },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.05,
          },
          "-=0.3", // Start slightly before the previous animation finishes
        );

        // Animate the CTA button
        const cta = navbarRef.current.querySelector(".cta-button");
        if (cta) {
          tl.fromTo(
            cta,
            { opacity: 0, scale: 0.95 },
            { opacity: 1, scale: 1, duration: 0.4 },
            "-=0.2",
          );
        }
      }
    });

    return () => ctx.revert();
  }, [reduced]);

  // Enhanced scroll effect
  useEffect(() => {
    const onScroll = () => {
      const scrollPosition = window.scrollY;
      setScrolled(scrollPosition > 20);
    };

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
        className={`
          nav-link relative inline-flex items-center px-3 py-2 text-sm tracking-wide 
          font-medium transition-all duration-200 no-underline transform
          ${active ? "text-neutral-900" : "text-neutral-500"}
          hover:text-neutral-900 hover:no-underline hover:scale-105
          
          /* Focus styles */
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/30
          focus-visible:ring-offset-2 focus-visible:ring-offset-white
        `}
        style={{ textDecoration: "none" }}
      >
        {label}
      </Link>
    );
  };

  return (
    <header
      ref={rootRef}
      className={`
        sticky top-0 z-50 py-1 transition-all duration-300 bg-white
        ${scrolled ? "py-2 shadow-[0_1px_3px_rgba(0,0,0,0.05)]" : "py-4"}
      `}
    >
      <div ref={navbarRef} className="mx-auto max-w-6xl px-4 sm:px-6">
        <nav className="flex items-center justify-between" aria-label="Main">
          {/* Logo */}
          <Link
            href="/"
            className="group relative font-serif text-2xl tracking-tight text-neutral-900
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/30
                      focus-visible:ring-offset-2 focus-visible:ring-offset-white px-2 py-1 rounded-md
                      transition-all duration-300 transform hover:scale-105"
          >
            <span className="font-medium">GR</span>
            <span className="text-neutral-300 group-hover:text-neutral-400 transition-colors">
              .
            </span>
          </Link>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center gap-2">
            {NAV.map((item) => (
              <NavLink key={item.href} {...item} />
            ))}
          </div>

          {/* Availability badge (desktop) */}
          <div className="hidden md:block">
            <Link
              href="/contact"
              className={`
                cta-button inline-flex items-center gap-1.5 rounded-full 
                bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700
                transition-all duration-200 no-underline transform
                hover:bg-emerald-100 hover:no-underline hover:scale-105
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40
                focus-visible:ring-offset-2 focus-visible:ring-offset-white
              `}
              style={{ textDecoration: "none" }}
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              <span>Available for projects</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className={`
              md:hidden relative inline-flex h-10 w-10 items-center justify-center
              rounded-full text-neutral-900 transition-all duration-300
              hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 
              focus-visible:ring-neutral-900/30 focus-visible:ring-offset-2 
              focus-visible:ring-offset-white overflow-hidden
              ${open ? "bg-neutral-100" : ""}
            `}
          >
            <span className="sr-only">Menu</span>
            <span
              className={`
              absolute block h-0.5 w-5 rounded-sm bg-current transition-transform duration-300
              ${open ? "rotate-45" : "-translate-y-1.5"}
            `}
            ></span>
            <span
              className={`
              absolute block h-0.5 w-5 rounded-sm bg-current transition-opacity duration-300
              ${open ? "opacity-0" : "opacity-100"}
            `}
            ></span>
            <span
              className={`
              absolute block h-0.5 w-5 rounded-sm bg-current transition-transform duration-300
              ${open ? "-rotate-45" : "translate-y-1.5"}
            `}
            ></span>
          </button>
        </nav>
      </div>

      {/* Mobile navigation panel with enhanced animation */}
      <div
        className={`
          md:hidden overflow-hidden transition-all duration-500 ease-in-out bg-white
          ${open ? "max-h-[300px] opacity-100 shadow-[0_2px_4px_rgba(0,0,0,0.03)]" : "max-h-0 opacity-0"}
        `}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4 space-y-4">
          <div className="grid gap-1 border-t border-neutral-100 pt-4">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                data-active={isActive(pathname, item.href)}
                className={`
                  px-4 py-2.5 text-sm font-medium transition-all 
                  duration-200 relative group no-underline transform
                  ${
                    isActive(pathname, item.href)
                      ? "text-neutral-900"
                      : "text-neutral-600 hover:text-neutral-900 hover:scale-105"
                  }
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/30
                  focus-visible:ring-offset-2 focus-visible:ring-offset-white
                `}
              >
                {item.label}
                {isActive(pathname, item.href) && (
                  <span className="absolute top-0 right-0 h-full w-1 bg-neutral-200"></span>
                )}
              </Link>
            ))}

            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="mt-3 inline-flex items-center gap-1.5 justify-center 
                        bg-emerald-50 text-emerald-700 px-4 py-2 text-sm font-medium 
                        rounded-full transition-all duration-200 hover:bg-emerald-100
                        no-underline hover:no-underline transform hover:scale-105
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40
                        focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              style={{ textDecoration: "none" }}
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              Available for projects
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
