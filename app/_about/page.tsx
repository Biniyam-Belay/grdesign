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
              clarity with disciplined whitespace-work that feels simple, not simplistic.
            </p>

            {/* Meta chips */}
            <ul className="mt-6 flex flex-wrap items-center gap-2" aria-label="Capabilities">
              {[
                "Brand Identity",
                "Editorial",
                "Packaging",
                "Social Media Design",
                "Web Design",
                "Website Development",
              ].map((t) => (
                <li key={t}>
                  <span className="inline-flex items-center rounded-full border border-neutral-200 px-3 py-1 text-xs text-neutral-700 transition-colors hover:border-neutral-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/10">
                    {t}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: portrait area */}
          <figure className="relative" data-reveal>
            <div className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50">
              <div className="aspect-[4/5] relative">
                <Image
                  src="/assets/aboutbgremoved.webp"
                  alt="Portrait of Biniyam Belay"
                  fill
                  priority
                  className="object-cover pointer-events-none object-top transform origin-top translate-y-[2%] scale-[1.08]"
                  sizes="(min-width: 1024px) 560px, (min-width: 768px) 50vw, 100vw"
                />
              </div>

              {/* Soft accent ring (kept subtle; hidden for reduced-motion) */}
              <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-black/5 blur-2xl motion-reduce:hidden" />
            </div>
            <figcaption className="mt-3 text-xs text-neutral-500">
              Based in Addis Ababa · ET · Available worldwide
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

          <div className="relative mt-8">
            <div className="absolute left-0 top-0 h-full w-px bg-neutral-200" data-reveal />
            <ol className="relative space-y-8">
              {[
                {
                  period: "2023-Present",
                  title: "Independent Designer",
                  body: "Partnering with founders and teams to craft identities, systems, and product surfaces-from strategy to delivery.",
                },
                {
                  period: "2025 - Present",
                  title: "Graphic Designer, AMCO Furniture, Design and Interiors",
                  body: "Creating cohesive brand experiences through print and digital media, enhancing AMCO's market presence and customer engagement.",
                },
                {
                  period: "2025",
                  title: "Branding, Sage Barbershop",
                  body: "A sharp and confident identity system for a modern barbershop, blending timeless craft with contemporary style.",
                },
                {
                  period: "2025",
                  title: "Branding, Sirtona Ventures",
                  body: "A bold yet disciplined identity system for a digital-creative agency, balancing premium feel with accessibility.",
                },
                {
                  period: "2024",
                  title: "Branding, Biruh Tutors",
                  body: "A bright and trustworthy identity system designed for an online tutoring platform, balancing professionalism with warmth.",
                },
                {
                  period: "2023-2025",
                  title: "Social Media Designer, AWiB Ethiopia",
                  body: "Unified social media presence and content design for AWiB Ethiopia, enhancing storytelling across leadership, mentorship, and community.",
                },
                {
                  period: "2023-2025",
                  title: "Social Media Designer, Meri",
                  body: "Social Media Content design for Meri - a youth, employability, and life-skills focused programme under AWiB.",
                },
                {
                  period: "2023-2025",
                  title: "Social Media Designer, Haset",
                  body: "Social Media content design for Haset - AWiB’s women leadership programme, focusing on building leadership capacity, community, and networks.",
                },
                {
                  period: "2024",
                  title: "Print Design, Addis Ababa University, AAU Alumni Homecoming",
                  body: "Led the merchandise design for Addis Ababa University’s first-ever Alumni Homecoming, bringing together legacy, school pride, and community through wearable and print assets.",
                },
              ].map(({ period, title, body }) => (
                <li key={title} className="relative pl-8" data-reveal>
                  <div className="absolute left-0 top-1 h-2 w-2 rounded-full bg-neutral-400 ring-4 ring-white" />
                  <div className="text-sm font-medium text-neutral-600">{period}</div>
                  <h3 className="mt-2 text-lg font-semibold text-neutral-900">{title}</h3>
                  <p className="mt-1 text-base text-neutral-600">{body}</p>
                </li>
              ))}
            </ol>
          </div>
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
