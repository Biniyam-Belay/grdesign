"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { initGSAP } from "@lib/gsap";
import { useReducedMotion } from "@lib/hooks/useReducedMotion";
import type { Project } from "@lib/types";
import Lightbox from "@components/media/Lightbox";
import Link from "next/link";

export default function ClientProject({
  project,
  prev,
  next,
}: {
  project: Project;
  prev?: { slug: string; title: string };
  next?: { slug: string; title: string };
}) {
  const reduced = useReducedMotion();
  const sectionsRef = useRef<HTMLElement | null>(null);
  const [lbIndex, setLbIndex] = useState<number | null>(null);

  useEffect(() => {
    if (reduced || !sectionsRef.current) return;
    const gsap = initGSAP();

    const q = sectionsRef.current.querySelectorAll<HTMLElement>("[data-reveal]");
    const groups = sectionsRef.current.querySelectorAll<HTMLElement>("[data-reveal-stagger]");

    const ctx = gsap.context(() => {
      // ultra-smooth, low-distance motion
      gsap.set(q, { opacity: 0, y: 10 });
      q.forEach((el) => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
        });
      });

      groups.forEach((group) => {
        const children = Array.from(group.children) as HTMLElement[];
        gsap.set(children, { opacity: 0, y: 12 });
        gsap.to(children, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.06,
          ease: "power3.out",
          scrollTrigger: { trigger: group, start: "top 82%" },
        });
      });
    }, sectionsRef);
    return () => ctx.revert();
  }, [reduced]);

  // Flags
  const hasProblem = !!project.problem && project.problem.trim().length > 0;
  const hasSolution = !!project.solution && project.solution.trim().length > 0;
  const hasHighlights = Array.isArray(project.highlights) && project.highlights.length > 0;
  const hasApproach = !!project.approach && project.approach.trim().length > 0;
  const hasProcess = Array.isArray(project.process) && project.process.length > 0;
  const hasOutcome = !!project.outcome && project.outcome.trim().length > 0;
  const hasDeliverables = Array.isArray(project.deliverables) && project.deliverables.length > 0;

  // Static hero image: first from gallery if available, else fallback to thumb
  const heroImg = project.gallery && project.gallery.length > 0 ? project.gallery[0] : null;
  const heroAlt = heroImg?.alt ?? project.alt ?? project.title;
  // Desktop uses the wide hero, mobile can use a separate crop if provided
  const desktopHeroSrc = heroImg ? heroImg.src : project.thumb;
  const mobileHeroSrc = project.mobileHeroSrc || desktopHeroSrc;

  return (
    <main className="bg-white">
      {/* ===== Hero (static, art-directed) ===== */}
      <section className="relative isolate overflow-hidden min-h-screen flex items-end">
        <div className="absolute inset-0 -z-10">
          {/* Desktop (md+) */}
          <Image
            src={desktopHeroSrc}
            alt={heroAlt}
            fill
            priority
            fetchPriority="high"
            quality={78}
            sizes="(min-width: 768px) 100vw"
            className="hidden md:block object-cover object-center"
          />
          {/* Mobile */}
          <Image
            src={mobileHeroSrc}
            alt={heroAlt}
            fill
            priority
            fetchPriority="high"
            quality={78}
            sizes="100vw"
            className="md:hidden object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/75" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-8 lg:px-12 pt-16 md:pt-24 pb-24 md:pb-32 w-full">
          <div className="mb-6 flex items-center justify-between gap-6" data-reveal>
            <p className="text-xs uppercase tracking-[0.2em] text-white/70">Addis Ababa · EAT</p>
            <Link
              href="/work"
              className="group inline-flex items-center gap-2 text-sm text-white hover:opacity-80"
            >
              <span className="h-px w-8 bg-current transition-all duration-300 group-hover:w-12" />
              Back to work
            </Link>
          </div>

          <header className="max-w-4xl" data-reveal>
            <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-white">
              {project.title}
            </h1>
            {project.excerpt && (
              <p className="mt-3 text-base md:text-lg text-white/80">{project.excerpt}</p>
            )}
            <div className="mt-5 flex flex-wrap items-center gap-2">
              {project.roles?.slice(0, 3).map((r) => (
                <span
                  key={r}
                  className="rounded-full border border-white/30 bg-white/10 backdrop-blur px-3 py-1 text-xs text-white/90"
                >
                  {r}
                </span>
              ))}
              {(project.tools ?? []).slice(0, 2).map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-white/20 bg-white/5 backdrop-blur px-3 py-1 text-xs text-white/70"
                >
                  {t}
                </span>
              ))}
            </div>
          </header>
        </div>
      </section>

      {/* ===== Body (minimal, no cards) ===== */}
      <section ref={sectionsRef} className="relative z-10">
        <div className="w-full max-w-none px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 py-16 md:py-24">
          <div className="grid grid-cols-1 gap-14 lg:gap-20 lg:grid-cols-12">
            {/* Main narrative */}
            <article className="lg:col-span-8 space-y-12">
              {/* Overview */}
              <section data-reveal>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                  Overview
                </p>
                <p className="mt-3 text-lg md:text-xl text-neutral-800 leading-relaxed">
                  {project.excerpt ||
                    "A concise overview describing the project’s purpose, audience, and success criteria."}
                </p>

                {/* Inline metrics */}
                <div className="mt-6 grid grid-cols-3 gap-6 text-sm" data-reveal-stagger>
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">
                      Assets
                    </div>
                    <div className="mt-1 text-neutral-900 tabular-nums">
                      {project.gallery?.length ?? 0}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">
                      Responsibilities
                    </div>
                    <div className="mt-1 text-neutral-900 tabular-nums">{project.roles.length}</div>
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">
                      Tools
                    </div>
                    <div className="mt-1 text-neutral-900 tabular-nums">
                      {(project.tools ?? []).length}
                    </div>
                  </div>
                </div>
              </section>

              {/* Divider */}
              <div className="h-px bg-neutral-200/70" />

              {/* Problem / Solution */}
              {(hasProblem || hasSolution) && (
                <section
                  data-reveal
                  className="grid grid-cols-1 md:grid-cols-2 gap-8"
                  data-reveal-stagger
                >
                  {hasProblem && (
                    <div>
                      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                        Problem
                      </div>
                      <p className="mt-2 text-neutral-800 leading-relaxed">{project.problem}</p>
                    </div>
                  )}
                  {hasSolution && (
                    <div>
                      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                        Solution
                      </div>
                      <p className="mt-2 text-neutral-800 leading-relaxed">{project.solution}</p>
                    </div>
                  )}
                </section>
              )}

              {hasHighlights && (
                <>
                  <div className="h-px bg-neutral-200/70" />
                  <section data-reveal>
                    <h2 className="text-xl md:text-2xl font-medium tracking-tight text-neutral-900">
                      Highlights
                    </h2>
                    <ul
                      className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4"
                      data-reveal-stagger
                    >
                      {project.highlights!.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-neutral-900 text-white text-[11px]">
                            ✓
                          </span>
                          <span className="text-neutral-700 leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                </>
              )}

              {hasApproach && (
                <>
                  <div className="h-px bg-neutral-200/70" />
                  <section data-reveal>
                    <h2 className="text-xl md:text-2xl font-medium tracking-tight text-neutral-900">
                      Approach
                    </h2>
                    <p className="mt-2 text-neutral-700 leading-relaxed">{project.approach}</p>
                  </section>
                </>
              )}

              {hasProcess && (
                <>
                  <div className="h-px bg-neutral-200/70" />
                  <section data-reveal>
                    <h3 className="text-base md:text-lg font-medium tracking-tight text-neutral-900 mb-2">
                      Process
                    </h3>
                    <ol className="space-y-5" data-reveal-stagger>
                      {project.process!.map((step, idx) => (
                        <li key={idx} className="flex gap-3">
                          <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-[11px] tabular-nums">
                            {idx + 1}
                          </span>
                          <div>
                            <div className="text-sm font-medium leading-tight text-neutral-900">
                              {step.title}
                            </div>
                            <p className="mt-1 text-sm text-neutral-700 leading-relaxed">
                              {step.body}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </section>
                </>
              )}

              {hasOutcome && (
                <>
                  <div className="h-px bg-neutral-200/70" />
                  <section data-reveal>
                    <h2 className="text-xl md:text-2xl font-medium tracking-tight text-neutral-900">
                      Outcome
                    </h2>
                    <p className="mt-2 text-neutral-700 leading-relaxed">{project.outcome}</p>
                  </section>
                </>
              )}

              {hasDeliverables && (
                <section data-reveal>
                  <h3 className="text-base md:text-lg font-medium tracking-tight text-neutral-900">
                    Deliverables
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-2" data-reveal-stagger>
                    {project.deliverables!.map((d) => (
                      <span
                        key={d}
                        className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-700"
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {project.credits && (
                <section data-reveal>
                  <p className="text-neutral-800 italic leading-relaxed">“{project.credits}”</p>
                </section>
              )}
            </article>

            {/* Info rail (ultra minimal) */}
            <aside className="lg:col-span-4 lg:pl-10">
              <div className="lg:sticky lg:top-28 space-y-8 text-sm">
                <div data-reveal>
                  <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                    Project
                  </h3>
                  <div className="mt-2 grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-[11px] uppercase tracking-widest text-neutral-500">
                        Year
                      </div>
                      <div className="text-neutral-900">{project.year ?? "—"}</div>
                    </div>
                    <div>
                      <div className="text-[11px] uppercase tracking-widest text-neutral-500">
                        Client
                      </div>
                      <div className="text-neutral-900">{project.client ?? "—"}</div>
                    </div>
                  </div>
                </div>

                <div data-reveal>
                  <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                    Responsibilities
                  </h3>
                  <div className="mt-2 flex flex-wrap gap-2" data-reveal-stagger>
                    {project.roles.map((r) => (
                      <span
                        key={r}
                        className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-800"
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                </div>

                <div data-reveal>
                  <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                    Tools
                  </h3>
                  <div className="mt-2 flex flex-wrap gap-2" data-reveal-stagger>
                    {(project.tools ?? ["Figma"]).map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-neutral-50 px-3 py-1 text-xs text-neutral-700"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {project.credits && (
                  <div data-reveal>
                    <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                      Credits
                    </h3>
                    <p className="mt-1 text-neutral-700 leading-relaxed">{project.credits}</p>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>

        {/* ===== Gallery (same grid, curved corners, no chrome) ===== */}
        {project.gallery && project.gallery.length > 0 && (
          <div className="w-full max-w-none px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 pb-16 md:pb-24">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4" data-reveal-stagger>
              {project.gallery.map((g, i) => (
                <button
                  key={g.src}
                  className="group relative overflow-hidden aspect-[16/9] will-change-transform"
                  onClick={() => setLbIndex(i)}
                  aria-label={`Open image: ${g.alt || project.title}`}
                  data-reveal
                >
                  <Image
                    src={g.src}
                    alt={g.alt || project.title}
                    fill
                    className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.015]"
                    sizes="(min-width: 1024px) 50vw, 100vw"
                  />
                  <span className="pointer-events-none absolute inset-0 ring-0 ring-black/0 transition-[ring-color,ring-width] duration-300 group-hover:ring-2 group-hover:ring-black/10" />
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ===== Prev / Next strip (unchanged) ===== */}
      <section className="border-t border-neutral-200/70">
        <div className="px-4 sm:px-8 lg:px-12 py-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-xs uppercase tracking-widest text-neutral-500">
              Browse more work
            </div>
            <div className="flex flex-wrap items-center gap-4">
              {prev && (
                <Link
                  href={`/work/${prev.slug}`}
                  className="group inline-flex items-center gap-2 rounded-full border border-neutral-200 px-4 py-2 text-sm text-neutral-900 hover:bg-neutral-900 hover:text-white transition-colors"
                >
                  ← {prev.title}
                </Link>
              )}
              {next && (
                <Link
                  href={`/work/${next.slug}`}
                  className="group inline-flex items-center gap-2 rounded-full border border-neutral-200 px-4 py-2 text-sm text-neutral-900 hover:bg-neutral-900 hover:text-white transition-colors"
                >
                  {next.title} →
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {typeof lbIndex === "number" && project.gallery && project.gallery[lbIndex] && (
        <Lightbox
          src={project.gallery[lbIndex].src}
          alt={project.gallery[lbIndex].alt}
          onClose={() => setLbIndex(null)}
          onPrev={
            project.gallery.length > 1
              ? () =>
                  setLbIndex((i) =>
                    i === null ? 0 : (i - 1 + project.gallery!.length) % project.gallery!.length,
                  )
              : undefined
          }
          onNext={
            project.gallery.length > 1
              ? () => setLbIndex((i) => (i === null ? 0 : (i + 1) % project.gallery!.length))
              : undefined
          }
        />
      )}
    </main>
  );
}
