"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { initGSAP } from "@lib/gsap";
import { useReducedMotion } from "@lib/hooks/useReducedMotion";
import type { Project, ProjectType } from "@lib/types";
import type { CSSProperties } from "react";
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

        gsap.set(q, { opacity: 0, y: 15 });
        q.forEach((el) => {
          gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%" },
          });
        });

        groups.forEach((group) => {
          const children = Array.from(group.children) as HTMLElement[];
          gsap.set(children, { opacity: 0, y: 20 });
          gsap.to(children, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: { trigger: group, start: "top 85%" },
          });
        });
      }, container),
    );

    return () => contexts.forEach((c) => c.revert());
  }, [reduced]);

  const hasProblem = !!project.problem && project.problem.trim().length > 0;
  const hasSolution = !!project.solution && project.solution.trim().length > 0;
  const hasHighlights = Array.isArray(project.highlights) && project.highlights.length > 0;
  const hasApproach = !!project.approach && project.approach.trim().length > 0;
  const hasProcess = Array.isArray(project.process) && project.process.length > 0;
  const hasOutcome = !!project.outcome && project.outcome.trim().length > 0;
  const hasDeliverables = Array.isArray(project.deliverables) && project.deliverables.length > 0;

  const heroAlt = project.alt ?? project.title;
  const desktopHeroSrc = project.thumb;
  const mobileHeroSrc = project.mobileHeroSrc || desktopHeroSrc;

  const type: ProjectType | undefined = project.type;
  // Let accents match the dark premium pop over the light #F5F5F0 base
  const accentByType: Partial<Record<ProjectType, string>> = {
    "web-dev": "#0055FF",
    "ui-ux": "#01BBFF",
    branding: "#FF0033",
    social: "#FF0033",
    print: "#0055FF",
  };
  const accent = type ? accentByType[type] : undefined;

  const style: CSSProperties | undefined = accent
    ? ({ ["--accent" as unknown as keyof CSSProperties]: accent } as CSSProperties)
    : undefined;

  return (
    <main className="bg-[#F5F5F0] text-[#0B132B]" data-type={type} style={style}>
      {/* ===== Hero (static, art-directed) ===== */}
      <section className="relative isolate overflow-hidden h-[100svh] flex items-end">
        <div className="absolute inset-0 -z-10 bg-[#0B132B]">
          <Image
            src={desktopHeroSrc}
            alt={heroAlt}
            fill
            priority
            fetchPriority="high"
            quality={90}
            sizes="(min-width: 768px) 100vw"
            className="hidden md:block object-cover object-center opacity-60"
          />
          <Image
            src={mobileHeroSrc}
            alt={heroAlt}
            fill
            priority
            fetchPriority="high"
            quality={90}
            sizes="100vw"
            className="md:hidden object-cover object-top opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B132B]/90 via-[#0B132B]/30 to-transparent mix-blend-multiply" />
        </div>

        <div className="relative mx-auto max-w-8xl px-6 lg:px-12 pt-16 md:pt-32 pb-24 md:pb-32 w-full">
          <div className="mb-10 flex items-center justify-between gap-6" data-reveal>
            <div className="flex items-center gap-4">
              <div className="w-8 h-[2px] bg-white opacity-80" />
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/90">
                Case Study
              </p>
            </div>
            <Link
              href="/work"
              className="group flex flex-col items-center justify-center w-12 h-12 rounded-full border border-white/20 hover:bg-white hover:text-[#0B132B] transition-colors text-white"
              aria-label="Back to work"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </Link>
          </div>

          <header className="max-w-5xl" data-reveal>
            <h1 className="text-5xl md:text-7xl lg:text-[80px] font-light tracking-[-0.05em] text-white leading-[1]">
              {project.title}
              <span className="text-[color:var(--accent,#FF0033)] font-bold">.</span>
            </h1>
            {project.excerpt && (
              <p className="mt-6 max-w-2xl text-lg md:text-xl text-white/70 font-light leading-relaxed">
                {project.excerpt}
              </p>
            )}
            <div className="mt-10 flex flex-wrap items-center gap-3">
              {type && (
                <span className="bg-[color:var(--accent,#FF0033)] px-4 py-2 text-[10px] uppercase font-bold tracking-[0.2em] text-white shadow-[0_5px_15px_rgba(255,0,51,0.2)]">
                  {type.replace("-", " ")}
                </span>
              )}
              {project.roles?.slice(0, 3).map((r) => (
                <span
                  key={r}
                  className="bg-white/10 backdrop-blur border border-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white"
                >
                  {r}
                </span>
              ))}
            </div>
          </header>
        </div>
      </section>

      {/* ===== Body (two-column, distilled) ===== */}
      <section ref={sectionsRef} className="relative z-10 border-t border-[#0B132B]/8">
        <div className="mx-auto max-w-8xl px-6 lg:px-12 py-24 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12">
            {/* Sticky Overview / Meta */}
            <aside className="lg:col-span-4 space-y-12 lg:sticky lg:top-32 self-start" data-reveal>
              <div>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-8 h-[2px] bg-[#0B132B]" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0B132B]/50">
                    Overview
                  </span>
                </div>
                <p className="text-xl lg:text-2xl font-light text-[#0B132B] leading-relaxed tracking-tight">
                  {project.excerpt ||
                    "A concise overview describing the project’s purpose and success criteria."}
                </p>
              </div>
              <dl className="grid grid-cols-2 gap-x-8 gap-y-6">
                <div>
                  <dt className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#0055FF] mb-2">
                    Year
                  </dt>
                  <dd className="text-lg font-medium text-[#0B132B]">{project.year ?? "-"}</dd>
                </div>
                <div>
                  <dt className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#0055FF] mb-2">
                    Client
                  </dt>
                  <dd className="text-lg font-medium text-[#0B132B]">{project.client ?? "-"}</dd>
                </div>
                <div>
                  <dt className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#0055FF] mb-2">
                    Role
                  </dt>
                  <dd className="text-lg font-medium text-[#0B132B]">
                    {project.roles?.[0] ?? "-"}
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#0055FF] mb-2">
                    Tools
                  </dt>
                  <dd className="text-[13px] uppercase tracking-widest font-bold text-[#0B132B]/60 leading-relaxed">
                    {(project.tools ?? []).slice(0, 3).join(" · ") || "-"}
                  </dd>
                </div>
              </dl>

              {hasDeliverables && (
                <div className="pt-8 border-t border-[#0B132B]/8">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#0B132B]/50 mb-4">
                    Deliverables
                  </h3>
                  <ul className="space-y-3" data-reveal-stagger>
                    {project.deliverables!.map((d) => (
                      <li key={d} className="flex items-center gap-3">
                        <span className="w-1.5 h-1.5 bg-[#FF0033]" />
                        <span className="text-[15px] font-medium text-[#0B132B]">{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {project.credits && (
                <div className="pt-8 border-t border-[#0B132B]/8">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#0B132B]/50 mb-4">
                    Credits
                  </h3>
                  <p className="text-sm uppercase tracking-widest font-bold text-[#0B132B]/60 leading-relaxed">
                    {project.credits}
                  </p>
                </div>
              )}
            </aside>

            {/* Content Flow */}
            <div className="lg:col-span-8 space-y-20 lg:space-y-32 lg:pl-12">
              {(hasProblem || hasSolution) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12" data-reveal-stagger>
                  {hasProblem && (
                    <div data-reveal>
                      <h3 className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.25em] text-[#0B132B]/40 mb-6">
                        <span className="w-4 h-[1px] bg-[#0B132B]/20" /> Problem
                      </h3>
                      <p className="text-lg text-[#0B132B]/80 font-light leading-relaxed">
                        {project.problem}
                      </p>
                    </div>
                  )}
                  {hasSolution && (
                    <div data-reveal>
                      <h3 className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.25em] text-[#0055FF] mb-6">
                        <span className="w-4 h-[1px] bg-[#0055FF]/40" /> Solution
                      </h3>
                      <p className="text-lg text-[#0B132B]/80 font-light leading-relaxed">
                        {project.solution}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {hasHighlights && (
                <div data-reveal className="bg-white border border-[#0B132B]/5 p-10 lg:p-16">
                  <h3 className="text-3xl font-light tracking-tight text-[#0B132B] mb-8">
                    Key <span className="font-semibold">Highlights.</span>
                  </h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6" data-reveal-stagger>
                    {project.highlights!.map((item, idx) => (
                      <li key={idx} className="flex gap-4">
                        <span className="text-[#FF0033] font-bold mt-1">✦</span>
                        <span className="text-base text-[#0B132B]/70 font-light leading-relaxed">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {hasApproach && (
                <div data-reveal>
                  <h3 className="text-3xl font-light tracking-tight text-[#0B132B] mb-8">
                    {type === "branding"
                      ? "Concept & Rationale."
                      : type === "print"
                        ? "Specs & Approach."
                        : "The Approach."}
                  </h3>
                  <p className="text-xl text-[#0B132B]/70 font-light leading-relaxed lg:max-w-3xl">
                    {project.approach}
                  </p>
                </div>
              )}

              {hasProcess && (
                <div data-reveal>
                  <div className="flex flex-col md:flex-row gap-12 md:gap-8 pt-8 border-t border-[#0B132B]/8">
                    <div className="md:w-1/3">
                      <h3 className="text-[12px] font-black uppercase tracking-[0.55em] text-[#0B132B] mb-4">
                        Process
                      </h3>
                      <h4 className="text-4xl font-light tracking-tight text-[#0B132B] mb-4">
                        Execution<span className="text-[#01BBFF] font-bold">.</span>
                      </h4>
                    </div>
                    <div
                      className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-10"
                      data-reveal-stagger
                    >
                      {project.process!.map((step, idx) => (
                        <div
                          key={idx}
                          className="pl-6 border-l border-[#0B132B]/10 hover:border-[#0055FF]/40 transition-colors"
                        >
                          <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#0055FF] mb-3">
                            Step 0{idx + 1}
                          </div>
                          <div className="text-2xl font-medium text-[#0B132B] mb-3">
                            {step.title}
                          </div>
                          <p className="text-sm font-light text-[#0B132B]/60 leading-relaxed">
                            {step.body}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {hasOutcome && (
                <div className="bg-[#0B132B] text-white p-10 lg:p-16" data-reveal>
                  <h3 className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.25em] text-[#FF0033] mb-8">
                    <span className="w-8 h-[1px] bg-[#FF0033]" /> Outcome
                  </h3>
                  <p className="text-2xl lg:text-3xl font-light leading-relaxed text-white/90 tracking-tight lg:max-w-2xl">
                    {project.outcome}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ===== Gallery (own block, larger visuals) ===== */}
      {project.gallery && project.gallery.length > 0 && (
        <section ref={galleryRef} className="bg-white border-t border-[#0B132B]/8">
          <div className="mx-auto max-w-8xl px-6 lg:px-12 py-16 md:py-32">
            <div className="flex items-center gap-4 mb-16">
              <div className="w-12 h-[2px] bg-[#0055FF]" />
              <span className="text-[12px] text-[#0B132B] uppercase tracking-[0.55em] font-black">
                Visuals
              </span>
            </div>
            <div
              className={`grid grid-cols-1 gap-6 md:gap-10 ${
                type === "social" ? "md:grid-cols-2 lg:grid-cols-3" : "md:grid-cols-2"
              }`}
              data-reveal-stagger
            >
              {project.gallery.map((g, i) => (
                <button
                  key={g.src}
                  className={`group relative overflow-hidden bg-[#F5F5F0] will-change-transform ${
                    type === "social" ? "aspect-square" : "aspect-[4/3]"
                  }`}
                  onClick={() => setLbIndex(i)}
                  aria-label={`Open image: ${g.alt || project.title}`}
                  data-reveal
                >
                  <Image
                    src={g.src}
                    alt={g.alt || project.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03] object-center"
                    sizes="(min-width: 1024px) 50vw, 100vw"
                  />
                  <div className="absolute inset-0 bg-[#0B132B]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== Prev / Next strip ===== */}
      <section className="border-t border-[#0B132B]/8 bg-[#F5F5F0]">
        <div className="mx-auto max-w-8xl px-6 lg:px-12 py-16">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#0B132B]/40">
              Browse more work
            </div>
            <div className="flex items-center gap-4 w-full sm:w-auto">
              {prev && (
                <Link
                  href={`/work/${prev.slug}`}
                  className="flex-1 sm:flex-none group flex items-center justify-center gap-3 bg-white border border-[#0B132B]/10 px-6 py-4 hover:border-[#0B132B]/40 hover:shadow-[0_10px_30px_rgba(11,19,43,0.05)] transition-all"
                >
                  <span className="text-[#FF0033] font-bold group-hover:-translate-x-1 transition-transform">
                    ←
                  </span>
                  <span className="text-xs uppercase tracking-widest font-bold text-[#0B132B]">
                    {prev.title}
                  </span>
                </Link>
              )}
              {next && (
                <Link
                  href={`/work/${next.slug}`}
                  className="flex-1 sm:flex-none group flex items-center justify-center gap-3 bg-[#0B132B] text-white px-6 py-4 hover:bg-[#0055FF] hover:shadow-[0_10px_30px_rgba(0,85,255,0.2)] transition-all border border-transparent"
                >
                  <span className="text-xs uppercase tracking-widest font-bold">{next.title}</span>
                  <span className="text-white font-bold group-hover:translate-x-1 transition-transform">
                    →
                  </span>
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
