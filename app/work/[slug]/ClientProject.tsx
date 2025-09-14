"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { initGSAP } from "@lib/gsap";
import { useReducedMotion } from "@lib/hooks/useReducedMotion";
import type { Project } from "@lib/types";
import Lightbox from "@components/media/Lightbox";
import VideoPlayer from "@components/media/VideoPlayer";
import ImageCarousel from "@components/media/ImageCarousel";
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
    const ctx = gsap.context(() => {
      gsap.set(q, { opacity: 0, y: 14 });
      q.forEach((el) => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
        });
      });
    }, sectionsRef);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <main className="bg-white">
      {/* ===== Hero ===== */}
      <section className="relative isolate overflow-hidden min-h-screen flex items-end">
        {/* Background media full-bleed */}
        <div className="absolute inset-0 -z-10">
          {project.gallery && project.gallery.length > 0 ? (
            <ImageCarousel
              images={project.gallery}
              thumbImage={project.gallery[0].src}
              thumbAlt={project.gallery[0].alt ?? project.alt ?? project.title}
              interval={5000}
              showIndicators={false}
              className="h-full"
            />
          ) : project.video ? (
            <VideoPlayer
              src={project.video}
              className="absolute inset-0 h-full w-full object-cover"
              withGradient={false}
              showPlaceholder={true}
            />
          ) : (
            <Image
              src={project.thumb}
              alt={project.alt ?? project.title}
              fill
              className="object-cover"
            />
          )}
          {/* Single dark gradient overlay (no radial, no white bottom fade) */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/75" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-8 lg:px-12 pt-16 md:pt-24 pb-24 md:pb-32 w-full">
          {/* Kicker + back link row */}
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

          {/* Title + excerpt + meta chips */}
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

      {/* ===== Body ===== */}
      <section ref={sectionsRef} className="relative -mt-16 z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12 py-24">
          <div className="grid grid-cols-1 gap-24 lg:grid-cols-12">
            {/* Main narrative */}
            <article className="lg:col-span-8 space-y-12">
              <section data-reveal className="space-y-4">
                <h2 className="text-xl md:text-2xl font-medium tracking-tight text-neutral-900">
                  Brief
                </h2>
                <p className="text-neutral-700 leading-relaxed">
                  Objective, constraints, and the core design challenge.
                </p>
              </section>

              <section data-reveal className="space-y-4">
                <h2 className="text-xl md:text-2xl font-medium tracking-tight text-neutral-900">
                  Process
                </h2>
                <p className="text-neutral-700 leading-relaxed">
                  Highlights from exploration, iterations, and rationale behind key decisions.
                </p>
              </section>

              <section data-reveal className="space-y-4">
                <h2 className="text-xl md:text-2xl font-medium tracking-tight text-neutral-900">
                  Outcome
                </h2>
                <p className="text-neutral-700 leading-relaxed">
                  Impact, metrics (where possible), and final delivery.
                </p>
              </section>

              {/* Gallery */}
              {project.gallery && project.gallery.length > 0 && (
                <section data-reveal className="mt-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    {project.gallery.map((g, i) => (
                      <button
                        key={g.src}
                        className="group relative overflow-hidden aspect-[4/3]"
                        onClick={() => setLbIndex(i)}
                        aria-label={`Open image: ${g.alt}`}
                      >
                        <Image
                          src={g.src}
                          alt={g.alt}
                          fill
                          className="object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(.22,.72,.17,1)] group-hover:scale-[1.05]"
                          sizes="(min-width: 1024px) 50vw, 100vw"
                        />
                        <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <span className="pointer-events-none absolute inset-0 ring-1 ring-white/10 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <figcaption className="pointer-events-none absolute left-3 bottom-3 translate-y-2 rounded-md bg-black/55 px-2.5 py-1 text-[11px] font-medium tracking-wide text-white opacity-0 backdrop-blur-sm transition-[opacity,transform] duration-400 group-hover:translate-y-0 group-hover:opacity-100">
                          {g.alt}
                        </figcaption>
                      </button>
                    ))}
                  </div>
                </section>
              )}
            </article>

            {/* Sticky info rail (minimal style) */}
            <aside className="lg:col-span-4 lg:pl-10">
              <div className="lg:sticky lg:top-32 space-y-10 text-sm text-neutral-700">
                <div data-reveal className="space-y-1">
                  <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                    Tools
                  </h3>
                  <p className="leading-relaxed">{(project.tools ?? ["Figma"]).join(", ")}</p>
                </div>
                <div data-reveal className="space-y-1">
                  <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                    Role
                  </h3>
                  <p className="leading-relaxed">{project.roles.join(", ")}</p>
                </div>
                {project.credits && (
                  <div data-reveal className="space-y-1">
                    <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                      Credits
                    </h3>
                    <p className="leading-relaxed">{project.credits}</p>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ===== Prev / Next strip (full width, quiet) ===== */}
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
