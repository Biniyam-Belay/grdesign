"use client";

import { useRef } from "react";
import { usePageTransition } from "@lib/gsapPageTransition";
import ProjectCard from "@components/content/ProjectCard";
import { getProjects } from "@lib/data/projects";
import type { Project } from "@lib/types";
import Link from "next/link";

export default function WorkPage() {
  const pageRef = useRef<HTMLElement>(null!);
  usePageTransition(pageRef);

  // Exclude featured items as they are only for decoration and should not appear as real projects
  const projects = getProjects().filter((p) => !p.featured);

  // Same rhythm as before: editorial cadence across 12 cols
  type Variant = "wide" | "standard" | "tall";
  const variantFor = (i: number): Variant =>
    i % 5 === 0 ? "wide" : i % 5 === 2 ? "tall" : "standard";

  return (
    <main ref={pageRef} className="min-h-[70svh] bg-white">
      {/* Full-bleed with slim side gutters (match Footer spacing) */}
      <div className="py-25 px-4 sm:px-8 lg:px-12">
        {/* Editorial header */}
        <header className="mb-12 md:mb-16">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Addis Ababa · EAT</p>
          <div className="mt-3 flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between">
            <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-neutral-900">
              Selected Work
            </h1>
            <Link
              href="https://calendar.app.google/1RTjShD5sgqBmm3K7"
              className="group inline-flex items-center gap-3 rounded-xl border border-neutral-900 px-6 py-3 text-sm text-neutral-900 hover:bg-neutral-900 hover:text-white transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Start a project
              <span className="h-px w-8 bg-current transition-all duration-300 group-hover:w-12" />
            </Link>
          </div>
          <div className="mt-6 h-px w-24 bg-neutral-200" />
          <p className="mt-6 max-w-2xl text-sm text-neutral-600">
            Identity, editorial, packaging, and digital projects-created from Addis Ababa and
            shipped worldwide.
          </p>
        </header>

        {/* Bigger, stylish grid (12 cols) */}
        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-12">
          {projects.map((p: Project, i) => {
            const variant = variantFor(i);
            const span =
              variant === "wide"
                ? "lg:col-span-8 sm:col-span-2 col-span-1"
                : "lg:col-span-4 sm:col-span-1 col-span-1";

            return (
              <div key={`${p.slug}-${i}`} className={span}>
                {/* If your ProjectCard supports variant, pass it; otherwise it will ignore the prop */}
                <ProjectCard project={p} variant={variant} />
              </div>
            );
          })}
        </section>

        {/* Page footnote */}
        <div className="mt-16 flex items-center justify-between">
          <span className="text-xs uppercase tracking-widest text-neutral-500">
            Updated {new Date().toLocaleDateString("en-ET", { year: "numeric", month: "short" })}
          </span>
          <Link href="/work" className="text-sm text-neutral-900 hover:opacity-80">
            View all projects →
          </Link>
        </div>
      </div>
    </main>
  );
}
