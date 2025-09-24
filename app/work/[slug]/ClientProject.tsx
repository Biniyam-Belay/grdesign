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
  const galleryRef = useRef<HTMLElement | null>(null);
  const [lbIndex, setLbIndex] = useState<number | null>(null);

  useEffect(() => {
    if (reduced) return;
    const gsap = initGSAP();
    const containers = [sectionsRef.current, galleryRef.current].filter(
      (el): el is HTMLElement => !!el,
    );
    if (containers.length === 0) return;

    const contexts = containers.map((container) =>
      gsap.context(() => {
        const q = container.querySelectorAll<HTMLElement>("[data-reveal]");
        const groups = container.querySelectorAll<HTMLElement>("[data-reveal-stagger]");

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
      }, container),
    );

    return () => contexts.forEach((c) => c.revert());
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

      {/* ===== Body (two-column, distilled) ===== */}
      <section ref={sectionsRef} className="relative z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-12">
            {/* Sticky Overview / Meta */}
            <aside
              className="lg:col-span-4 space-y-8 lg:space-y-10 lg:sticky lg:top-24 self-start"
              data-reveal
            >
              <div>
                <p className="text-base md:text-lg text-neutral-800 leading-relaxed">
                  {project.excerpt ||
                    "A concise overview describing the project’s purpose and success criteria."}
                </p>
              </div>
              <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                <div>
                  <dt className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">Year</dt>
                  <dd className="mt-1 text-neutral-900">{project.year ?? "-"}</dd>
                </div>
                <div>
                  <dt className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">
                    Client
                  </dt>
                  <dd className="mt-1 text-neutral-900">{project.client ?? "-"}</dd>
                </div>
                <div>
                  <dt className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">Role</dt>
                  <dd className="mt-1 text-neutral-900">{project.roles?.[0] ?? "-"}</dd>
                </div>
                <div>
                  <dt className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">
                    Tools
                  </dt>
                  <dd className="mt-1 text-neutral-900">
                    {(project.tools ?? []).slice(0, 2).join(", ") || "-"}
                  </dd>
                </div>
              </dl>

              {hasDeliverables && (
                <div>
                  <h3 className="mt-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-600">
                    Deliverables
                  </h3>
                  <ul
                    className="mt-2 list-disc pl-5 space-y-1 text-sm text-neutral-800"
                    data-reveal-stagger
                  >
                    {project.deliverables!.map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                </div>
              )}

              {project.credits && (
                <div>
                  <h3 className="mt-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-600">
                    Credits
                  </h3>
                  <p className="mt-2 text-neutral-800 leading-relaxed">{project.credits}</p>
                </div>
              )}
            </aside>

            {/* Content Flow */}
            <div className="lg:col-span-8 space-y-12 md:space-y-16">
              {(hasProblem || hasSolution) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8" data-reveal-stagger>
                  {hasProblem && (
                    <div className="rounded-2xl border border-neutral-200 p-5" data-reveal>
                      <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                        Problem
                      </h3>
                      <p className="mt-2 text-neutral-800 leading-relaxed">{project.problem}</p>
                    </div>
                  )}
                  {hasSolution && (
                    <div className="rounded-2xl border border-neutral-200 p-5" data-reveal>
                      <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                        Solution
                      </h3>
                      <p className="mt-2 text-neutral-800 leading-relaxed">{project.solution}</p>
                    </div>
                  )}
                </div>
              )}

              {hasHighlights && (
                <div data-reveal>
                  <h3 className="text-base md:text-lg font-medium tracking-tight text-neutral-900">
                    Highlights
                  </h3>
                  <ul
                    className="mt-3 list-disc pl-5 space-y-2 text-neutral-700"
                    data-reveal-stagger
                  >
                    {project.highlights!.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {hasApproach && (
                <div
                  className="rounded-2xl bg-neutral-50 border border-neutral-200 p-6"
                  data-reveal
                >
                  <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-600">
                    Approach
                  </h3>
                  <p className="mt-2 text-neutral-800 leading-relaxed">{project.approach}</p>
                </div>
              )}

              {hasProcess && (
                <div data-reveal>
                  <h3 className="text-base md:text-lg font-medium tracking-tight text-neutral-900">
                    Process
                  </h3>
                  <ol className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4" data-reveal-stagger>
                    {project.process!.map((step, idx) => (
                      <li key={idx} className="rounded-xl border border-neutral-200 p-4">
                        <div className="text-xs uppercase tracking-[0.18em] text-neutral-500">
                          Step {idx + 1}
                        </div>
                        <div className="mt-1 font-medium text-neutral-900">{step.title}</div>
                        <p className="mt-1 text-sm text-neutral-700">{step.body}</p>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {hasOutcome && (
                <div className="rounded-2xl border border-neutral-200 p-6" data-reveal>
                  <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-600">
                    Outcome
                  </h3>
                  <p className="mt-2 text-neutral-800 leading-relaxed">{project.outcome}</p>
                </div>
              )}

              {/* Deliverables and Credits moved to left column */}

              {/* Gallery moved to its own block below */}
            </div>
          </div>
        </div>
      </section>

      {/* ===== Gallery (own block, larger visuals) ===== */}
      {project.gallery && project.gallery.length > 0 && (
        <section ref={galleryRef} className="border-t border-neutral-200/70">
          <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 py-16 md:py-24">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6" data-reveal-stagger>
              {project.gallery.map((g, i) => (
                <button
                  key={g.src}
                  className="group relative overflow-hidden aspect-[4/3] will-change-transform"
                  onClick={() => setLbIndex(i)}
                  aria-label={`Open image: ${g.alt || project.title}`}
                  data-reveal
                >
                  <Image
                    src={g.src}
                    alt={g.alt || project.title}
                    fill
                    className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02]"
                    sizes="(min-width: 1024px) 50vw, 100vw"
                  />
                  <span className="pointer-events-none absolute inset-0 ring-0 ring-black/0 transition-[ring-color,ring-width] duration-300 group-hover:ring-2 group-hover:ring-black/10" />
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

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
