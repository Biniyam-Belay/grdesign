"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { usePageTransition } from "@lib/gsapPageTransition";
import ProjectCard from "@components/content/ProjectCard";
import { getProjectsAsync } from "@lib/data/projects";
import type { Project, ProjectType } from "@lib/types";
import { motion, AnimatePresence } from "framer-motion";

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
  // Sequence: wide, standard, standard, repeat
  type Variant = "wide" | "standard";
  const variantFor = (i: number): Variant => (i % 3 === 0 ? "wide" : "standard");

  return (
    <main ref={pageRef} className="min-h-screen bg-[#F5F5F0] pt-32 pb-24">
      <div className="mx-auto max-w-8xl px-6 lg:px-12 w-full">
        {/* Editorial header */}
        <header className="mb-16 md:mb-24 flex flex-col pt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-[2px] bg-gradient-to-r from-[#0055FF] to-[#01BBFF]" />
              <span className="text-[12px] text-[#0B132B] uppercase tracking-[0.55em] font-black">
                Archive
              </span>
            </div>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
              <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-[80px] font-light tracking-[-0.05em] leading-[1] text-[#0B132B]">
                Selected <br />
                <span className="font-semibold">
                  Work<span className="text-[#0055FF]">.</span>
                </span>
              </h1>

              <div className="flex flex-col gap-6 md:max-w-md pb-2">
                <p className="text-lg lg:text-xl font-light text-[#0B132B]/60 leading-relaxed">
                  Identity, editorial, packaging, and digital projects—crafted with intention and
                  shipped worldwide.
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-8 h-[1px] bg-[#FF0033]" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF0033]">
                    Always Creating
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="mt-12 w-full h-px bg-[#0B132B]/8" />

          {/* Type filter */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            {types.map((t) => (
              <button
                key={t}
                onClick={() => setActive(t)}
                className={`inline-flex items-center gap-2 rounded-none border px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.25em] transition-all duration-300 ${
                  active === t
                    ? "border-[#FF0033] bg-[#FF0033] text-white shadow-[0_5px_15px_rgba(255,0,51,0.2)]"
                    : "border-[#0B132B]/10 text-[#0B132B]/50 hover:border-[#0B132B]/30 hover:text-[#0B132B]"
                }`}
                aria-pressed={active === t}
              >
                {t === "all" ? "All Projects" : t.replace("-", " ")}
              </button>
            ))}
          </div>
        </header>

        {/* Bigger, stylish grid (12 cols) */}
        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-12 min-h-[40vh]">
          <AnimatePresence mode="popLayout">
            {all.length === 0 ? (
              <motion.div
                key="loading-archive"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="col-span-full py-20 flex flex-col justify-center items-center opacity-50"
              >
                <span className="text-[#0B132B]/50 font-light text-xl">Loading Archive...</span>
              </motion.div>
            ) : projects.length > 0 ? (
              projects.map((p: Project, i) => {
                const variant = variantFor(i);
                const span =
                  variant === "wide"
                    ? "lg:col-span-8 sm:col-span-2 col-span-1"
                    : "lg:col-span-4 sm:col-span-1 col-span-1";

                return (
                  <motion.div
                    key={p.slug || i}
                    layout="position"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className={span}
                  >
                    <ProjectCard project={p} variant={variant} />
                  </motion.div>
                );
              })
            ) : (
              <motion.div
                key="empty-archive"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="col-span-full py-20 flex flex-col justify-center items-center opacity-50"
              >
                <span className="text-[#0B132B]/50 font-light text-xl mb-4">
                  No projects match this filter.
                </span>
                <button
                  onClick={() => setActive("all")}
                  className="text-[10px] uppercase tracking-[0.25em] text-[#FF0033] hover:text-[#0055FF] transition-colors font-bold"
                >
                  Clear Filter
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Page footnote */}
        <div className="mt-24 pt-8 border-t border-[#0B132B]/8 flex items-center justify-between">
          <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#0B132B]/30">
            Updated {new Date().toLocaleDateString("en-ET", { year: "numeric", month: "short" })}
          </span>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#0B132B]/50 hover:text-[#FF0033] transition-colors"
          >
            Back to Top ↑
          </button>
        </div>
      </div>
    </main>
  );
}
