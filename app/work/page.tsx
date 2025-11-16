"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { usePageTransition } from "@lib/gsapPageTransition";
import ProjectCard from "@components/content/ProjectCard";
import { getProjectsAsync } from "@lib/data/projects";
import type { Project, ProjectType } from "@lib/types";
import Link from "next/link";

export default function WorkPage() {
  const pageRef = useRef<HTMLElement>(null!);
  usePageTransition(pageRef);

  // Show all projects on the work page (both featured and non-featured)
  const [all, setAll] = useState<Project[]>([]);
  useEffect(() => {
    let mounted = true;
    getProjectsAsync().then((ps) => {
      if (mounted && ps && ps.length > 0) setAll(ps);
    });
    return () => {
      mounted = false;
    };
  }, []);
  const [active, setActive] = useState<ProjectType | "all">(() => {
    if (typeof window === "undefined") return "all";
    const url = new URL(window.location.href);
    const t = url.searchParams.get("type") as ProjectType | null;
    return t ?? "all";
  });

  useEffect(() => {
    const url = new URL(window.location.href);
    if (active === "all") url.searchParams.delete("type");
    else url.searchParams.set("type", active);
    window.history.replaceState(null, "", url.toString());
  }, [active]);

  const types: (ProjectType | "all")[] = ["all", "web-dev", "ui-ux", "branding", "social", "print"];
  const projects = useMemo(
    () => (active === "all" ? all : all.filter((p) => p.type === active)),
    [all, active],
  );

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
          {/* Type filter */}
          <div className="mt-6 flex flex-wrap items-center gap-2">
            {types.map((t) => (
              <button
                key={t}
                onClick={() => setActive(t)}
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs transition-colors ${active === t ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-200 hover:bg-neutral-100"}`}
                aria-pressed={active === t}
              >
                {t === "all" ? "All" : t.replace("-", " ")}
              </button>
            ))}
          </div>
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
              <ProjectCard key={`${p.slug}-${i}`} project={p} variant={variant} className={span} />
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
