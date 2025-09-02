"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { initGSAP } from "@lib/gsap";
import { useReducedMotion } from "@lib/hooks/useReducedMotion";
import type { Project } from "@lib/types";
import Lightbox from "@components/media/Lightbox";
import VideoPlayer from "@components/media/VideoPlayer";
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
      <section className="border-b border-neutral-200/70">
        <div className="py-25 px-4 sm:px-8 lg:px-12">
          {/* Kicker + back link row */}
          <div className="mb-6 flex items-center justify-between gap-6">
            <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Addis Ababa · EAT</p>
            <Link
              href="/work"
              className="group inline-flex items-center gap-2 text-sm text-neutral-900 hover:opacity-80"
            >
              <span className="h-px w-8 bg-current transition-all duration-300 group-hover:w-12" />
              Back to work
            </Link>
          </div>

          {/* Title + excerpt + meta chips */}
          <header className="max-w-5xl">
            <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-neutral-900">
              {project.title}
            </h1>
            {project.excerpt && (
              <p className="mt-3 text-base md:text-lg text-neutral-600">{project.excerpt}</p>
            )}

            <div className="mt-5 flex flex-wrap items-center gap-2">
              {/* Roles */}
              {project.roles?.slice(0, 3).map((r) => (
                <span
                  key={r}
                  className="rounded-full border border-neutral-200 px-3 py-1 text-xs text-neutral-700"
                >
                  {r}
                </span>
              ))}
              {/* Tools (first 2) */}
              {(project.tools ?? []).slice(0, 2).map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-neutral-200 px-3 py-1 text-xs text-neutral-500"
                >
                  {t}
                </span>
              ))}
            </div>
          </header>

          {/* Hero media */}
          <figure className="relative mt-8 aspect-[16/9] w-full overflow-hidden border border-neutral-200 bg-neutral-50">
            {/* Display video if available, otherwise show image */}
            {project.video || (project.thumb && project.thumb.endsWith(".mp4")) ? (
              <div className="absolute inset-0 p-4">
                <div className="relative w-full h-full overflow-hidden rounded-lg">
                  <VideoPlayer
                    src={project.video || project.thumb}
                    className="absolute inset-0 w-full h-full object-cover"
                    withGradient={false}
                  />
                </div>
              </div>
            ) : (
              <Image
                src={project.thumb}
                alt={project.alt ?? project.title}
                fill
                sizes="100vw"
                className="object-cover"
                priority
              />
            )}
          </figure>
        </div>
      </section>

      {/* ===== Body ===== */}
      <section ref={sectionsRef}>
        <div className="py-16 px-4 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            {/* Main narrative */}
            <article className="lg:col-span-8 space-y-12">
              <section data-reveal>
                <h2 className="text-xl md:text-2xl font-medium text-neutral-900">Brief</h2>
                <p className="mt-3 text-neutral-700">
                  Objective, constraints, and the core design challenge.
                </p>
              </section>

              <section data-reveal>
                <h2 className="text-xl md:text-2xl font-medium text-neutral-900">Process</h2>
                <p className="mt-3 text-neutral-700">
                  Highlights from exploration, iterations, and rationale behind key decisions.
                </p>
              </section>

              <section data-reveal>
                <h2 className="text-xl md:text-2xl font-medium text-neutral-900">Outcome</h2>
                <p className="mt-3 text-neutral-700">
                  Impact, metrics (where possible), and final delivery.
                </p>
              </section>

              {/* Gallery */}
              {project.gallery && project.gallery.length > 0 && (
                <section data-reveal className="mt-4">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {project.gallery.map((g, i) => (
                      <button
                        key={g.src}
                        className="group relative overflow-hidden border border-neutral-200 bg-neutral-50"
                        onClick={() => setLbIndex(i)}
                        aria-label={`Open image: ${g.alt}`}
                      >
                        <div className="aspect-[4/3]">
                          <Image
                            src={g.src}
                            alt={g.alt}
                            fill
                            className="object-cover transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)] group-hover:scale-[1.03]"
                            sizes="(min-width: 1024px) 50vw, 100vw"
                          />
                        </div>
                        <figcaption className="pointer-events-none absolute inset-x-3 bottom-3 translate-y-2 rounded-xl bg-white/80 px-3 py-1.5 text-xs text-neutral-700 opacity-0 backdrop-blur-sm ring-1 ring-black/5 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                          {g.alt}
                        </figcaption>
                      </button>
                    ))}
                  </div>
                </section>
              )}
            </article>

            {/* Sticky info rail */}
            <aside className="lg:col-span-4 lg:pl-8">
              <div className="lg:sticky lg:top-24 space-y-6 text-sm text-neutral-600">
                <div data-reveal>
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
                    Tools
                  </h3>
                  <p className="mt-1">{(project.tools ?? ["Figma"]).join(", ")}</p>
                </div>

                <div data-reveal>
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
                    Role
                  </h3>
                  <p className="mt-1">{project.roles.join(", ")}</p>
                </div>

                {project.credits && (
                  <div data-reveal>
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
                      Credits
                    </h3>
                    <p className="mt-1">{project.credits}</p>
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
