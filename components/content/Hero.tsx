"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
          {/* Mobile Layout - Completely New Design */}
          <div
            className="md:hidden flex flex-col -mt-25"
            style={{ minHeight: "calc(100dvh - 64px)", paddingTop: "1rem", paddingBottom: "1rem" }}
          >
            {/* Top: Simple Header with Kicker */}
            <div className="pt-4 pb-2 flex items-center justify-center">
              <p
                data-anim="kicker"
                className="text-xs tracking-[0.2em] uppercase text-muted-foreground text-center"
              >
                {settings.heroText.kicker} - {new Date().getFullYear()}
              </p>
            </div>

            {/* Center: Main Content Card */}
            <div className="flex-1 flex items-center justify-center px-4 py-6">
              <div className="w-full max-w-sm space-y-6">
                {/* Profile Section */}
                <div className="flex flex-col items-center text-center space-y-4">
                  <Image
                    data-anim="avatar"
                    src="/assets/avatarmob.png"
                    alt="Profile photo"
                    width={120}
                    height={120}
                    className="w-24 h-24 rounded-full object-cover border-2 border-neutral-200 shadow-sm"
                    style={{ opacity: 1 }}
                    priority
                  />

                  <div className="space-y-2">
                    <h2
                      className="text-4xl sm:text-5xl font-bold text-foreground leading-none tracking-tight"
                      style={{ opacity: 1 }}
                      aria-label="Bini"
                    >
                      {Array.from("Bini").map((char, idx) => (
                        <span key={idx} aria-hidden="true" data-anim-brand className="inline-block">
                          {char}
                        </span>
                      ))}
                      <span className="text-neutral-400">.B</span>
                    </h2>

                    {/* Availability Badge */}
                    <div
                      data-anim="availability-mobile"
                      className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-full bg-neutral-100/80 backdrop-blur-sm"
                      style={{ opacity: 1 }}
                    >
                      <div className="relative flex items-center justify-center">
                        <span
                          className={`absolute inline-flex h-3 w-3 rounded-full ${
                            settings.availability.status === "available"
                              ? "bg-green-400"
                              : settings.availability.status === "limited"
                                ? "bg-amber-400"
                                : "bg-red-400"
                          } opacity-75 animate-ping`}
                        />
                        <span
                          className={`relative inline-flex h-2 w-2 rounded-full ${
                            settings.availability.status === "available"
                              ? "bg-green-500"
                              : settings.availability.status === "limited"
                                ? "bg-amber-500"
                                : "bg-red-500"
                          }`}
                        />
                      </div>
                      <span className="text-neutral-700 font-medium">
                        {settings.availability.label}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Titles */}
                <div className="space-y-3 text-center">
                  <h1
                    className="text-2xl sm:text-3xl font-semibold leading-tight text-foreground"
                    style={{ opacity: 1 }}
                  >
                    <span data-anim="title-line" className="block">
                      {settings.heroText.title1}
                    </span>
                    <span className="text-neutral-400">&</span>
                    <span data-anim="title-line" className="block">
                      {settings.heroText.title2}
                    </span>
                  </h1>

                  <p
                    data-anim="subcopy"
                    className="text-sm sm:text-base text-neutral-500 leading-relaxed max-w-xs mx-auto"
                    style={{ opacity: 1 }}
                  >
                    {settings.heroText.subtitle}
                  </p>
                </div>

                {/* CTA Button */}
                <div className="pt-2">
                  <Link
                    data-anim="cta"
                    href="https://calendar.app.google/1RTjShD5sgqBmm3K7"
                    className="group w-full flex items-center justify-center gap-2 rounded-full bg-neutral-900 text-white px-8 py-3.5 text-sm font-medium transition-all hover:bg-neutral-800 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                    style={{ opacity: 1 }}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>Let's work together</span>
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
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>

            {/* Bottom: Footer info */}
            <div data-anim="footer" className="pt-4 pb-6 text-center flex-shrink-0">
              <p className="text-xs text-neutral-500 font-medium">
                Based in Ethiopia, working worldwide
              </p>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:block mt-20">
            {/* Top row with left-aligned content and right contact button */}
            <div className="relative flex items-center justify-between">
              {/* Left Content */}
              <div className="text-left max-w-2xl">
                {/* Kicker and Availability Badge on same line */}
                <div className="flex items-center gap-4 mb-4">
                  <p
                    data-anim="kicker"
                    className="text-xs tracking-[0.2em] uppercase text-muted-foreground"
                  >
                    {settings.heroText.kicker} - {new Date().getFullYear()}
                  </p>

                  {/* Availability Badge - To the right of kicker */}
                  <div
                    data-anim="availability-desktop"
                    className="flex items-center gap-2 text-sm"
                    style={{ opacity: 1 }}
                  >
                    {/* Status Indicator with Pulse Animation */}
                    <div className="relative flex items-center justify-center">
                      {/* Outer pulse ring */}
                      <span
                        className={`absolute inline-flex h-3 w-3 rounded-full ${
                          settings.availability.status === "available"
                            ? "bg-green-400"
                            : settings.availability.status === "limited"
                              ? "bg-amber-400"
                              : "bg-red-400"
                        } opacity-75 animate-ping`}
                      />
                      {/* Inner dot */}
                      <span
                        className={`relative inline-flex h-2 w-2 rounded-full ${
                          settings.availability.status === "available"
                            ? "bg-green-500"
                            : settings.availability.status === "limited"
                              ? "bg-amber-500"
                              : "bg-red-500"
                        }`}
                      />
                    </div>

                    <span className="text-muted-foreground">{settings.availability.label}</span>
                  </div>
                </div>

                <h1 className="text-3xl md:text-5xl font-semibold leading-[1.15] text-foreground">
                  <span data-anim="title-line" className="block">
                    {settings.heroText.title1}
                  </span>
                  <span data-anim="title-line" className="block">
                    {settings.heroText.title2}
                  </span>
                </h1>

                <p
                  data-anim="subcopy"
                  className="mt-4 text-base md:text-lg text-neutral-400 max-w-md"
                >
                  {settings.heroText.subtitle}
                </p>
              </div>

              {/* Right - Contact Button (vertically centered) */}
              <Link
                data-anim="cta-contact"
                href="https://calendar.app.google/1RTjShD5sgqBmm3K7"
                className="opacity-100 group inline-flex items-center gap-3 rounded-full border border-border px-6 py-2.5 text-sm transition-all duration-300 hover:bg-foreground hover:text-background hover:scale-105"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="font-medium">Contact</span>
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

            {/* "Bini" Section - Bottom Aligned */}
            <div className="absolute bottom-8 left-[-140] right-[-120] px-6 pointer-events-none">
              <div className="w-full flex items-end justify-between">
                <div data-anim="brand-text">
                  <h2
                    className="text-[50px] md:text-[350px] font-bold text-left text-foreground leading-none -mb-4 md:-mb-12 uppercase"
                    aria-label="Bini"
                  >
                    {Array.from("Bini").map((char, idx) => (
                      <span key={idx} aria-hidden="true" data-anim-brand className="inline-block">
                        {char}
                      </span>
                    ))}
                  </h2>
                </div>
                <div
                  className="pointer-events-none border border-1 border-neutral-200 rounded-full"
                  data-anim="brand-avatar"
                >
                  <Image
                    src="/assets/avatardesk.png"
                    alt="Profile photo"
                    width={192}
                    height={192}
                    className="w-40 h-40 md:w-48 md:h-48 rounded-full object-cover transform transition-transform duration-300 ease-out will-change-transform hover:scale-[1.08] hover:-translate-x-2"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
