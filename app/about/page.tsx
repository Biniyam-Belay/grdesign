"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePageTransition } from "@lib/gsapPageTransition";
import SplitText from "@components/motion/SplitText";
import { useReveal } from "@lib/hooks/useReveal";

export default function AboutPage() {
  const pageRef = useRef<HTMLElement>(null!);
  usePageTransition(pageRef);
  // Apply scroll reveal animations (opt-out for users with reduced motion handled inside hook)
  useReveal({ selector: "[data-reveal]" });

  return (
    <main ref={pageRef} className="bg-white">
      {/* Page container: slim gutters, controlled max width for ideal line-length */}
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-8 lg:px-12 mt-20">
        {/* ===== Hero (balanced grid, vertical alignment, tighter top) ===== */}
        <header
          className="grid grid-cols-1 gap-10 pt-12 md:grid-cols-2 md:items-center md:gap-16"
          aria-labelledby="about-hero-title"
          data-reveal
        >
          {/* Left: intro copy vertically centered to align with image */}
          <div className="flex flex-col justify-center">
            <p className="text-[11px] uppercase tracking-[0.22em] text-neutral-500">
              Addis Ababa · ET
            </p>

            <SplitText
              as="h1"
              className="mt-2 text-3xl font-semibold tracking-tight leading-normal text-neutral-900 sm:text-5xl"
              trigger
            >
              <span id="about-hero-title">About Me</span>
            </SplitText>

            <p className="mt-4 max-w-2xl text-base text-neutral-600 sm:text-lg">
              I build thoughtful identities and calm interfaces. My practice blends typographic
              clarity with disciplined whitespace—work that feels simple, not simplistic.
            </p>

            {/* Meta chips */}
            <ul className="mt-6 flex flex-wrap items-center gap-2" aria-label="Capabilities">
              {["Brand Identity", "Editorial", "Packaging", "Digital"].map((t) => (
                <li key={t}>
                  <span className="inline-flex items-center rounded-full border border-neutral-200 px-3 py-1 text-xs text-neutral-700 transition-colors hover:border-neutral-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/10">
                    {t}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: portrait/video area */}
          <figure className="relative" data-reveal>
            <div className="relative overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-50">
              <div className="aspect-[4/5] relative">
                {/* Autoplay looping video */}
                <video
                  className="absolute inset-0 w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                  disablePictureInPicture
                  disableRemotePlayback
                >
                  <source src="/assets/about-reel.mp4" type="video/mp4" />
                  Video preview
                </video>
              </div>

              {/* Soft accent ring (kept subtle; hidden for reduced-motion) */}
              <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-black/5 blur-2xl motion-reduce:hidden" />
            </div>
            <figcaption className="mt-3 text-xs text-neutral-500">
              Based in Addis Ababa | ET · Available worldwide
            </figcaption>
          </figure>
        </header>

        {/* Hairline divider with balanced whitespace */}
        <hr className="mx-0 my-14 h-px w-24 border-0 bg-neutral-200" />

        {/* ===== Values ===== */}
        <section className="pb-2" aria-labelledby="values-title" data-reveal>
          <h2
            id="values-title"
            className="text-2xl font-semibold text-neutral-900 md:text-3xl"
            data-reveal
          >
            Design values
          </h2>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Purposeful simplicity",
                body: "Reduce to the essential. Create room for meaning and make decisions legible.",
              },
              {
                title: "Typographic precision",
                body: "Hierarchy, rhythm, and contrast. Type is the spine of every experience.",
              },
              {
                title: "Thoughtful motion",
                body: "Motion clarifies, never distracts. Subtle transitions guide attention.",
              },
            ].map(({ title, body }) => (
              <article
                key={title}
                className="group rounded-2xl border border-neutral-200 p-6 transition-all hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-[0_6px_24px_-12px_rgba(0,0,0,0.15)] focus-within:border-neutral-300"
                data-reveal
              >
                <h3 className="text-lg font-medium text-neutral-900">{title}</h3>
                <p className="mt-2 text-neutral-600">{body}</p>
                <div className="mt-4 h-px w-10 bg-neutral-200 transition-all group-hover:w-16" />
              </article>
            ))}
          </div>
        </section>

        {/* ===== Experience (vertical rail) ===== */}
        <section className="mt-16" aria-labelledby="experience-title" data-reveal>
          <h2
            id="experience-title"
            className="text-2xl font-semibold text-neutral-900 md:text-3xl"
            data-reveal
          >
            Experience
          </h2>

          <ol className="relative mt-8 space-y-10 before:absolute before:left-[0rem] before:top-0 before:h-full before:w-px before:bg-neutral-200 sm:before:left-[0rem]">
            {[
              {
                period: "2020—Present",
                title: "Independent Designer",
                body: "Partnering with founders and teams to craft identities, systems, and product surfaces—from strategy to delivery.",
              },
              {
                period: "2017—2020",
                title: "Senior Designer, Studio Name",
                body: "Led identity and packaging programs across fashion, tech, and consumer goods.",
              },
              {
                period: "2015—2017",
                title: "Designer, Agency Name",
                body: "Developed visual systems for print and digital campaigns.",
              },
              {
                period: "2013—2015",
                title: "Designer, AWiB Ethiopia",
                body: "Developed visual systems for print and digital campaigns.",
              },
            ].map(({ period, title, body }) => (
              <li key={title} className="grid grid-cols-1 gap-3 sm:grid-cols-12" data-reveal>
                {/* Bullet */}
                <span
                  aria-hidden
                  className="absolute h-2.5 w-2.5 rounded-full bg-neutral-900 -translate-x-[0.3125rem] mt-[0.6875rem] sm:mt-[0.1875rem]"
                />
                {/* Period */}
                <div className="text-[11px] uppercase tracking-[0.22em] text-neutral-500 pl-4 sm:col-span-3 sm:pl-6">
                  {period}
                </div>
                {/* Content */}
                <div className="rounded-xl sm:col-span-8 pl-4 sm:pl-0">
                  <h3 className="text-lg font-medium text-neutral-900">{title}</h3>
                  <p className="mt-2 text-neutral-600">{body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* ===== CTA row ===== */}
        <section
          className="mt-16 flex flex-col gap-4 border-t border-neutral-200 py-8 sm:flex-row sm:items-center sm:justify-between"
          aria-labelledby="contact-title"
          data-reveal
        >
          <p
            id="contact-title"
            className="text-[11px] uppercase tracking-[0.22em] text-neutral-500"
          >
            Let’s talk
          </p>

          <div className="flex flex-wrap items-center gap-3" data-reveal>
            {/* Primary CTA */}
            <Link
              href="mailto:biniyam.be.go@gmail.com"
              className="group inline-flex items-center gap-3 rounded-xl border border-neutral-900 px-6 py-3 text-sm text-neutral-900 transition-colors hover:bg-neutral-900 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/20"
            >
              Email
              <span className="h-px w-8 bg-current transition-all duration-300 group-hover:w-12" />
            </Link>

            {/* Secondary CTA */}
            <Link
              href="https://calendar.app.google/1RTjShD5sgqBmm3K7"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-xl border border-neutral-200 px-6 py-3 text-sm text-neutral-900 transition-colors hover:border-neutral-900 hover:bg-neutral-900 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/10"
            >
              Book a meeting
            </Link>
          </div>
        </section>

        {/* Bottom breathing room */}
        <div className="pb-20" />
      </div>
    </main>
  );
}
