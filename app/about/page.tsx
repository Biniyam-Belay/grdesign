"use client";

import { useRef } from "react";
import Image from "next/image";
import { usePageTransition } from "@lib/gsapPageTransition";
import SplitText from "@components/motion/SplitText";
import Link from "next/link";

export default function AboutPage() {
  const pageRef = useRef<HTMLElement>(null!);
  usePageTransition(pageRef);

  return (
    <main ref={pageRef} className="min-h-[70svh] bg-white">
      {/* Full-width with slim gutters (consistent site language) */}
      <div className="py-25 px-4 sm:px-8 lg:px-12">
        {/* ===== Hero ===== */}
        <section className="grid grid-cols-1 gap-12 md:grid-cols-12 md:items-end">
          {/* Left: intro copy */}
          <div className="md:col-span-7">
            <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Addis Ababa · EAT</p>

            <SplitText
              as="h1"
              className="mt-3 text-3xl sm:text-5xl font-semibold tracking-tight text-neutral-900"
              trigger
            >
              About the designer
            </SplitText>

            <p className="mt-4 text-base sm:text-lg text-neutral-600 max-w-2xl">
              I build thoughtful identities and calm interfaces. My practice blends typographic
              clarity with disciplined whitespace—work that feels simple, not simplistic.
            </p>

            {/* Meta chips */}
            <div className="mt-6 flex flex-wrap items-center gap-2">
              {["Brand Identity", "Editorial", "Packaging", "Digital"].map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-neutral-200 px-3 py-1 text-xs text-neutral-700"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Right: portrait / stage */}
          <figure className="md:col-span-5">
            <div className="relative overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-50">
              <div className="aspect-[4/5]">
                {/* Replace src with your portrait */}
                <Image
                  src="/portrait-placeholder.jpg"
                  alt="Portrait"
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                  priority
                />
              </div>
              {/* Soft accent ring */}
              <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-black/5 blur-2xl" />
            </div>
            <figcaption className="mt-3 text-xs text-neutral-500">
              Based in Bole/Kazanchis · Available worldwide
            </figcaption>
          </figure>
        </section>

        {/* Divider */}
        <div className="mt-16 h-px w-24 bg-neutral-200" />

        {/* ===== Values ===== */}
        <section className="mt-12">
          <h2 className="text-2xl md:text-3xl font-semibold text-neutral-900">Design values</h2>
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
                className="rounded-2xl border border-neutral-200 p-6 hover:border-neutral-300 transition-colors"
              >
                <h3 className="text-lg font-medium text-neutral-900">{title}</h3>
                <p className="mt-2 text-neutral-600">{body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ===== Experience (vertical rail) ===== */}
        <section className="mt-16">
          <h2 className="text-2xl md:text-3xl font-semibold text-neutral-900">Experience</h2>

          <ol className="relative mt-8 space-y-10 before:absolute before:left-3 before:top-0 before:h-full before:w-px before:bg-neutral-200 sm:before:left-4">
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
            ].map(({ period, title, body }) => (
              <li key={title} className="grid grid-cols-1 gap-3 sm:grid-cols-12">
                {/* Bullet */}
                <span
                  className="row-span-2 h-2 w-2 translate-x-[3px] translate-y-[10px] rounded-full bg-neutral-900 sm:col-span-1 sm:translate-x-[15px]"
                  aria-hidden
                />
                {/* Period */}
                <div className="text-xs uppercase tracking-widest text-neutral-500 sm:col-span-3">
                  {period}
                </div>
                {/* Content */}
                <div className="sm:col-span-8">
                  <h3 className="text-lg font-medium text-neutral-900">{title}</h3>
                  <p className="mt-2 text-neutral-600">{body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* ===== CTA row ===== */}
        <section className="mt-16 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Let’s talk</p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="mailto:hello@grdesign.studio"
              className="group inline-flex items-center gap-3 rounded-xl border border-neutral-900 px-6 py-3 text-sm text-neutral-900 transition-colors hover:bg-neutral-900 hover:text-white"
            >
              Email
              <span className="h-px w-8 bg-current transition-all duration-300 group-hover:w-12" />
            </Link>
            <Link
              href="https://calendar.app.google/1RTjShD5sgqBmm3K7"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 rounded-xl border border-neutral-200 px-6 py-3 text-sm text-neutral-900 transition-colors hover:bg-neutral-900 hover:text-white"
            >
              Book a meeting
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
