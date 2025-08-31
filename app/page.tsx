"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";

type Props = {
  // Optional: space to offset a fixed header height
  offsetTop?: number; // e.g., 96 -> 96px top padding
};

export default function Hero({ offsetTop = 120 }: Props) {
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    // Respect reduced motion
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      // Instantly show without animation
      el.querySelectorAll<HTMLElement>("[data-anim]").forEach((n) => {
        n.style.opacity = "1";
        n.style.transform = "none";
      });
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from("[data-anim='kicker']", { y: 16, opacity: 0, duration: 0.6 })
        .from(
          "[data-anim='title-line']",
          { y: 24, opacity: 0, duration: 0.7, stagger: 0.08 },
          "-=0.2",
        )
        .from("[data-anim='subcopy']", { y: 16, opacity: 0, duration: 0.6 }, "-=0.2")
        .from("[data-anim='cta']", { y: 20, opacity: 0, duration: 0.6, stagger: 0.06 }, "-=0.15")
        .from(
          "[data-anim='divider']",
          { scaleX: 0, opacity: 0, transformOrigin: "left", duration: 0.5 },
          "-=0.25",
        )
        .from("[data-anim='brand']", { y: 30, opacity: 0, duration: 0.8 }, "-=0.1");
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      style={{ paddingTop: offsetTop }}
      className="relative isolate min-h-[100svh] px-6 flex items-start"
    >
      {/* Subtle background tint + grid */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/0" />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
            backgroundSize: "28px 28px",
            maskImage: "radial-gradient(1200px 600px at 50% 20%, black 55%, transparent 70%)",
          }}
        />
      </div>

      <div className="mx-auto w-full max-w-7xl">
        {/* Mobile Layout */}
        <div
          className="md:hidden flex flex-col justify-between"
          style={{ minHeight: "calc(100svh - 120px)" }}
        >
          <div>
            <h2 className="text-[28vw] font-bold text-left text-foreground leading-none">Bini</h2>
          </div>
          <div className="pb-8">
            <h1 className="text-3xl font-semibold leading-[1.15] text-foreground text-left">
              <span data-anim="title-line" className="block">
                Graphic Designer
              </span>
              <span data-anim="title-line" className="block">
                Web Developer
              </span>
            </h1>
            <p data-anim="subcopy" className="mt-4 text-base text-neutral-400 text-left">
              Thoughtful identities & calm interfaces. Available for select work.
            </p>
            <div className="mt-8 flex justify-between items-center">
              <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
              <Link
                data-anim="cta"
                href="/contact"
                className="group inline-flex items-center gap-3 rounded-full border border-border px-5 py-2 text-sm transition-colors hover:bg-foreground hover:text-background"
              >
                <span>Contact</span>
                <svg
                  className="transition-transform group-hover:translate-x-1"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M5 12h14M12 5l7 7-7 7"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:block mt-20">
          {/* Top row: left spacer, center stack, right contact on md+ */}
          <div className="relative flex items-end justify-between">
            <div className="hidden w-[140px] md:block" />
            <div className="text-left">
              <p
                data-anim="kicker"
                className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4"
              >
                Portfolio — 2025
              </p>

              <h1 className="text-3xl md:text-5xl font-semibold leading-[1.15] text-foreground">
                <span data-anim="title-line" className="block">
                  Graphic Designer
                </span>
                <span data-anim="title-line" className="block">
                  Web Developer
                </span>
              </h1>

              <p data-anim="subcopy" className="mt-4 text-base md:text-lg text-neutral-400">
                Thoughtful identities & calm interfaces. Available for select work.
              </p>
            </div>

            <div className="hidden md:block">
              <Link
                data-anim="cta"
                href="/contact"
                className="group inline-flex items-center gap-3 rounded-full border border-border px-5 py-2 text-sm transition-colors hover:bg-foreground hover:text-background"
              >
                <span>Contact</span>
                <svg
                  className="transition-transform group-hover:translate-x-1"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M5 12h14M12 5l7 7-7 7"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </Link>
            </div>
          </div>

          {/* "Bini" Section - Bottom Aligned */}
          <div className="absolute bottom-8 left-0 right-0 px-6 pointer-events-none">
            <div className="w-full flex items-end justify-between">
              <div>
                <h2 className="text-[50px] md:text-[350px] font-bold text-left text-foreground leading-none -mb-4 md:-mb-12 uppercase">
                  Bini
                </h2>
              </div>
              <div className="pointer-events-auto">
                <div className="w-40 h-40 md:w-48 md:h-48 bg-gray-200 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
