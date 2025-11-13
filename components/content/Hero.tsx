"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import GridHoverSquares from "@components/motion/GridHoverSquares";
import { getHeroSettings, type HeroSettings } from "@/lib/data/settings";

gsap.registerPlugin(ScrollTrigger);

type Props = {
  // Optional: space to offset a fixed header height
  offsetTop?: number; // e.g., 96 -> 96px top padding
};

export default function Hero({ offsetTop = 80 }: Props) {
  const rootRef = useRef<HTMLElement | null>(null);
  const [settings, setSettings] = useState<HeroSettings | null>(null);

  useEffect(() => {
    getHeroSettings().then(setSettings).catch(console.error);
  }, []);

  useEffect(() => {
    const el = rootRef.current;
    if (!el || !settings) return; // Only run animations when settings are loaded

    // Respect reduced motion
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      // Instantly show without animation
      el.querySelectorAll<HTMLElement>("[data-anim]").forEach((n) => {
        n.style.opacity = "1";
        n.style.transform = "none";
      });
      el.querySelectorAll<HTMLElement>("[data-anim-brand]").forEach((n) => {
        n.style.opacity = "1";
        n.style.transform = "none";
      });
      return;
    }

    const ctx = gsap.context(() => {
      // Use matchMedia for responsive animations
      const mm = gsap.matchMedia();

      // Desktop animation
      mm.add("(min-width: 768px)", () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        // Scene 1: Brand entrance
        // Prepare title line masking
        gsap.set("[data-anim='title-line']", { clipPath: "inset(0 0 100% 0)" });

        tl.fromTo(
          "[data-anim='brand-text']",
          { y: 100, x: "30vw", scale: 0.8, opacity: 0 },
          { y: 0, x: 0, scale: 1, opacity: 1, duration: 1.2 },
        )
          .fromTo(
            "[data-anim='brand-avatar']",
            { y: 100, x: "-30vw", scale: 0.8, opacity: 0 },
            { y: 0, x: 0, scale: 1, opacity: 1, duration: 1.2 },
            "<", // Start at the same time as the previous animation
          )
          .from(
            "[data-anim-brand]",
            {
              yPercent: 120,
              rotate: () => gsap.utils.random(-40, 40),
              opacity: 0,
              duration: 1,
              stagger: 0.06,
              ease: "back.out(1.7)",
            },
            "-=0.8",
          )
          // Scene 2: Content reveal
          .fromTo(
            "[data-anim='cta-contact']",
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6 },
            "-=0.5",
          )
          .fromTo(
            "[data-anim='availability-desktop']",
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6 },
            "-=0.4",
          )
          .fromTo(
            "[data-anim='kicker']",
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.6 },
            "-=0.2",
          )
          .fromTo(
            "[data-anim='title-line']",
            { y: 24, opacity: 0, clipPath: "inset(0 0 100% 0)" },
            {
              y: 0,
              opacity: 1,
              clipPath: "inset(0 0 0% 0)",
              duration: 0.85,
              stagger: 0.1,
              ease: "power3.out",
            },
            "-=0.2",
          )
          .from("[data-anim='subcopy']", { y: 16, opacity: 0, duration: 0.6 }, "-=0.2");
      });

      // Mobile animation
      mm.add("(max-width: 767px)", () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        gsap.set("[data-anim='title-line']", { clipPath: "inset(0 0 100% 0)" });

        // Start all elements visible by default, then animate from hidden
        tl.fromTo(
          "[data-anim='kicker']",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.6 },
        )
          .fromTo(
            "[data-anim='avatar']",
            { opacity: 0, scale: 0.8 },
            { opacity: 1, scale: 1, duration: 0.7 },
            "-=0.3",
          )
          .fromTo(
            "[data-anim-brand]",
            {
              yPercent: 120,
              rotate: () => gsap.utils.random(-40, 40),
              opacity: 0,
            },
            {
              yPercent: 0,
              rotate: 0,
              opacity: 1,
              duration: 1,
              stagger: 0.1,
              ease: "back.out(1.7)",
            },
            "-=0.4",
          )
          .fromTo(
            "[data-anim='availability-mobile']",
            { opacity: 0, scale: 0.9 },
            { opacity: 1, scale: 1, duration: 0.5 },
            "-=0.3",
          )
          .fromTo(
            "[data-anim='title-line']",
            { y: 24, opacity: 0, clipPath: "inset(0 0 100% 0)" },
            {
              y: 0,
              opacity: 1,
              clipPath: "inset(0 0 0% 0)",
              duration: 0.85,
              stagger: 0.12,
              ease: "power3.out",
            },
            "-=0.2",
          )
          .fromTo(
            "[data-anim='subcopy']",
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.6 },
            "-=0.2",
          )
          .fromTo(
            "[data-anim='cta']",
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6 },
            "-=0.3",
          )
          .fromTo(
            "[data-anim='footer']",
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.5 },
            "-=0.4",
          );
      });
    }, rootRef);

    return () => ctx.revert();
  }, [settings]); // Re-run when settings load

  return (
    <section
      ref={rootRef}
      style={{ paddingTop: offsetTop }}
      className="hero-background relative isolate min-h-[100svh] px-6 flex overflow-hidden"
    >
      {/* Cursor squares overlay (desktop only) */}
      {/* Hover grid overlay (desktop only) */}
      <div className="pointer-events-none absolute inset-0 z-10 hidden md:block">
        <GridHoverSquares
          targetRef={rootRef}
          cellSize={34}
          gap={8}
          color="#000000ff"
          baseAlpha={0.16}
          fadeMs={650}
          composite="soft-light"
        />
      </div>
      {/* Subtle background tint + grid */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-1000">
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

      {/* Show skeleton loading state or content */}
      {!settings ? (
        <div className="hero-content relative z-20 mx-auto w-full max-w-7xl">
          {/* Mobile Skeleton */}
          <div
            className="md:hidden flex flex-col animate-pulse -mt-25"
            style={{ minHeight: "calc(100dvh - 64px)", paddingTop: "1rem", paddingBottom: "1rem" }}
          >
            {/* Top */}
            <div className="pt-4 pb-2">
              <div className="h-3 bg-neutral-200 rounded w-32"></div>
            </div>

            {/* Center */}
            <div className="flex-1 flex items-center justify-center px-4 py-6">
              <div className="w-full max-w-sm space-y-6">
                {/* Avatar */}
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-24 h-24 rounded-full bg-neutral-200"></div>
                  <div className="space-y-2 w-full">
                    <div className="h-10 bg-neutral-200 rounded w-32 mx-auto"></div>
                    <div className="h-6 bg-neutral-200 rounded-full w-40 mx-auto"></div>
                  </div>
                </div>

                {/* Titles */}
                <div className="space-y-3 text-center">
                  <div className="space-y-2">
                    <div className="h-8 bg-neutral-200 rounded w-48 mx-auto"></div>
                    <div className="h-8 bg-neutral-200 rounded w-40 mx-auto"></div>
                  </div>
                  <div className="h-4 bg-neutral-200 rounded w-56 mx-auto"></div>
                </div>

                {/* CTA Button */}
                <div className="pt-2">
                  <div className="h-12 bg-neutral-200 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Bottom */}
            <div className="pt-4 pb-6 text-center flex-shrink-0">
              <div className="h-3 bg-neutral-200 rounded w-40 mx-auto"></div>
            </div>
          </div>

          {/* Desktop Skeleton */}
          <div className="hidden md:block mt-20 animate-pulse">
            {/* Top row */}
            <div className="relative flex items-center justify-between mb-20">
              {/* Left Content */}
              <div className="text-left max-w-2xl space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-3 bg-neutral-200 rounded w-32"></div>
                  <div className="h-6 bg-neutral-200 rounded-full w-40"></div>
                </div>
                <div className="space-y-3">
                  <div className="h-12 bg-neutral-200 rounded w-96"></div>
                  <div className="h-12 bg-neutral-200 rounded w-80"></div>
                </div>
                <div className="h-5 bg-neutral-200 rounded w-72"></div>
              </div>

              {/* Right - Contact Button */}
              <div className="h-10 bg-neutral-200 rounded-full w-32"></div>
            </div>

            {/* "Bini" Section */}
            <div className="absolute bottom-8 left-[-140] right-[-120] px-6">
              <div className="w-full flex items-end justify-between">
                <div className="h-32 md:h-64 bg-neutral-200 rounded w-96"></div>
                <div className="w-40 h-40 md:w-48 md:h-48 rounded-full bg-neutral-200"></div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="hero-content relative z-20 mx-auto w-full max-w-7xl">
          {/* Mobile Layout - Clean & Confident */}
          <div
            className="md:hidden flex flex-col justify-center"
            style={{ minHeight: "calc(100dvh - 64px)", paddingTop: "2rem", paddingBottom: "2rem" }}
          >
            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center px-4 py-6">
              <div className="w-full max-w-md space-y-8">
                {/* Status & Credentials */}
                <div className="text-center space-y-3">
                  <div className="inline-flex items-center gap-3 text-xs text-neutral-600">
                    <div className="flex items-center gap-1">
                      <div className="relative">
                        {/* Outer blinking ring */}
                        <div className="absolute inset-0 w-2 h-2 bg-emerald-500 rounded-full animate-ping opacity-75"></div>
                        {/* Inner pulsing dot */}
                        <div className="relative w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      </div>
                      <span className="font-medium">Available on Upwork</span>
                    </div>
                    <span className="w-px h-3 bg-neutral-300"></span>
                    <span className="font-medium">Top Rated • Fast Delivery</span>
                  </div>
                </div>

                {/* Headlines - Confident & Direct */}
                <div className="space-y-6 text-center">
                  <h1
                    className="text-3xl sm:text-4xl font-bold leading-tight text-neutral-900"
                    style={{ opacity: 1 }}
                  >
                    <span data-anim="title-line" className="block">
                      Design That Wins
                    </span>
                    <span data-anim="title-line" className="block text-neutral-700">
                      Clients & Projects
                    </span>
                  </h1>

                  <p
                    data-anim="subcopy"
                    className="text-base text-neutral-600 leading-relaxed max-w-sm mx-auto"
                    style={{ opacity: 1 }}
                  >
                    Professional designer delivering{" "}
                    <span className="text-neutral-900 font-medium">graphic design</span>,{" "}
                    <span className="text-neutral-900 font-medium">branding</span>,{" "}
                    <span className="text-neutral-900 font-medium">social media content</span>, and{" "}
                    <span className="text-neutral-900 font-medium">web solutions</span> — perfect
                    for agencies, startups, and HR teams hiring top talent.
                  </p>

                  {/* Value Propositions - Services Focused */}
                  <div className="grid grid-cols-1 gap-4 mt-8" data-anim="value-props">
                    <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-neutral-600">
                      <span className="font-medium">Graphic & Visual Design</span>
                      <span className="w-px h-4 bg-neutral-300"></span>
                      <span className="font-medium">Brand Systems & Identity</span>
                      <span className="w-px h-4 bg-neutral-300"></span>
                      <span className="font-medium">Social Media Design & Growth</span>
                      <span className="w-px h-4 bg-neutral-300"></span>
                      <span className="font-medium">Web Development & Platforms</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-6 space-y-4">
                  <Link
                    data-anim="cta-primary"
                    href="https://calendar.app.google/1RTjShD5sgqBmm3K7"
                    className="group w-full flex items-center justify-center gap-3 rounded-lg bg-neutral-900 text-white px-6 py-4 text-sm font-medium transition-all hover:bg-neutral-800"
                    style={{ opacity: 1 }}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>Book Free Consultation</span>
                    <svg
                      className="transition-transform group-hover:translate-x-1"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M5 12h14M12 5l7 7-7 7"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </Link>

                  <Link
                    data-anim="cta-secondary"
                    href="/work"
                    className="w-full flex items-center justify-center gap-2 rounded-lg border border-neutral-300 bg-white text-neutral-700 px-6 py-4 text-sm font-medium transition-all hover:border-neutral-400"
                    style={{ opacity: 1 }}
                  >
                    <span>View Portfolio</span>
                  </Link>

                  <p className="text-xs text-center text-neutral-500 mt-3" data-anim="urgency">
                    Perfect for agencies & startups •{" "}
                    <span className="text-neutral-700 font-medium">Same-day response</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Layout - Elite & Clean */}
          <div className="hidden md:block pt-24 pb-16">
            <div className="flex items-center justify-between min-h-[60vh]">
              {/* Main Content - Full Width Elegance */}
              <div className="flex-1">
                {/* Status & Social Proof */}
                <div className="flex items-center gap-8 mb-8">
                  <div className="flex items-center gap-2 text-sm text-neutral-600">
                    <div className="relative">
                      {/* Outer blinking ring */}
                      <div className="absolute inset-0 w-2 h-2 bg-emerald-500 rounded-full animate-ping opacity-75"></div>
                      {/* Inner pulsing dot */}
                      <div className="relative w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    </div>
                    <span className="font-medium">Available Now</span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-neutral-500">
                    <span className="font-medium">Rated Designer</span>
                    <div className="w-px h-4 bg-neutral-300"></div>
                    <span>Fast 7-14 Day Turnaround</span>
                  </div>
                </div>

                {/* Headlines - Confident */}
                <div className="mb-10">
                  <h1 className="text-5xl md:text-7xl font-bold leading-[0.9] text-neutral-900 mb-8">
                    <span data-anim="title-line" className="block">
                      Hire Expert Design
                    </span>
                    <span data-anim="title-line" className="block text-neutral-600">
                      That Delivers Results
                    </span>
                  </h1>

                  <p
                    data-anim="subcopy"
                    className="text-xl md:text-2xl text-neutral-600 leading-relaxed font-light"
                  >
                    Professional{" "}
                    <span className="text-neutral-900 font-medium">graphic designer</span>{" "}
                    specializing in <span className="text-neutral-900 font-medium">branding</span>,{" "}
                    <span className="text-neutral-900 font-medium">social media</span>, and{" "}
                    <span className="text-neutral-900 font-medium">web design</span> — trusted by
                    agencies, startups, and organizations for fast, quality delivery.
                  </p>
                </div>

                {/* Core Capabilities - Refined */}
                <div
                  className="flex flex-wrap items-center gap-8 mb-12 text-sm text-neutral-600"
                  data-anim="capabilities"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-1 h-1 bg-neutral-400 rounded-full"></span>
                    <span className="font-medium">Graphic Design</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1 h-1 bg-neutral-400 rounded-full"></span>
                    <span className="font-medium">Brand Systems</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1 h-1 bg-neutral-400 rounded-full"></span>
                    <span className="font-medium">Social Media Design</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1 h-1 bg-neutral-400 rounded-full"></span>
                    <span className="font-medium">Web Development</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-6" data-anim="cta-buttons">
                  <Link
                    href="https://calendar.app.google/1RTjShD5sgqBmm3K7"
                    className="group inline-flex items-center gap-3 rounded-lg bg-neutral-900 text-white px-8 py-4 text-base font-medium transition-all duration-300 hover:bg-neutral-800"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>Book Free Consultation</span>
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
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </Link>

                  <Link
                    href="/work"
                    className="group inline-flex items-center gap-3 rounded-lg border border-neutral-300 bg-white text-neutral-700 px-8 py-4 text-base font-medium transition-all duration-300 hover:border-neutral-400"
                  >
                    <span>View Portfolio</span>
                  </Link>
                </div>

                {/* Trust Elements */}
                <div
                  className="mt-8 flex items-center gap-8 text-sm text-neutral-500"
                  data-anim="trust-signals"
                >
                  <div className="flex items-center gap-2">
                    <span>—</span>
                    <span>Quality guarantee</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>—</span>
                    <span>Same-day response</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>—</span>
                    <span>Revision-friendly</span>
                  </div>
                </div>
              </div>

              {/* Right Side - Minimal Status */}
              <div className="text-right" data-anim="cta-contact">
                <div className="border border-neutral-200 rounded-lg p-6 bg-neutral-50 max-w-xs">
                  <div className="text-sm font-medium text-neutral-800 mb-3">Limited Capacity</div>
                  <div className="text-xs text-neutral-600 mb-4">
                    <span className="font-medium">3 project slots</span> available this month
                  </div>
                  <Link
                    href="https://calendar.app.google/1RTjShD5sgqBmm3K7"
                    className="inline-flex items-center gap-2 bg-neutral-800 text-white px-4 py-2 rounded text-sm font-medium hover:bg-neutral-900 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Reserve Consultation
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
