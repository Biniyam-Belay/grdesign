"use client";
import Image from "next/image";
import Container from "@components/layout/Container";
import { useEffect, useRef } from "react";
import { initGSAP } from "@lib/gsap";
import { useReducedMotion } from "@lib/hooks/useReducedMotion";
import type { Project } from "@lib/types";
import Lightbox from "@components/media/Lightbox";
import Link from "next/link";
import { useCallback, useState } from "react";

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
    const q = sectionsRef.current.querySelectorAll("h2, p, aside, img, video");
    const ctx = gsap.context(() => {
      gsap.set(q, { opacity: 0, y: 14 });
      gsap.utils.toArray(q).forEach((node) => {
        const el = node as HTMLElement;
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
          },
        });
      });
    }, sectionsRef);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <main className="bg-white">
      <section className="border-b border-neutral-200/70">
        <Container className="py-16">
          <h1 className="text-4xl font-semibold tracking-tight">{project.title}</h1>
          <p className="mt-2 text-neutral-600 max-w-2xl">{project.excerpt}</p>
          <p className="mt-3 text-sm text-neutral-500">{project.roles.join(" · ")}</p>
          <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-lg bg-neutral-100">
            <Image
              src={project.thumb}
              alt={project.title}
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </Container>
      </section>
      <section ref={sectionsRef}>
        <Container className="py-16 grid grid-cols-1 gap-10 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <h2 className="text-2xl font-medium">Brief</h2>
            <p className="text-neutral-700">
              Objective, constraints, and the design challenge summary.
            </p>
            <h2 className="text-2xl font-medium mt-10">Process</h2>
            <p className="text-neutral-700">
              Highlights from exploration, iterations, and rationale behind key decisions.
            </p>
            <h2 className="text-2xl font-medium mt-10">Outcome</h2>
            <p className="text-neutral-700">Impact, metrics (if any), and final delivery.</p>
            {project.gallery && project.gallery.length > 0 && (
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {project.gallery.map((g, i) => (
                  <button
                    key={g.src}
                    className="group relative aspect-[4/3] overflow-hidden rounded-md bg-neutral-100"
                    onClick={() => setLbIndex(i)}
                    aria-label={`Open image: ${g.alt}`}
                  >
                    <Image
                      src={g.src}
                      alt={g.alt}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          <aside className="space-y-4 text-sm text-neutral-600">
            <div>
              <div className="font-medium text-neutral-800">Tools</div>
              <div>{(project.tools ?? ["Figma"]).join(", ")}</div>
            </div>
            <div>
              <div className="font-medium text-neutral-800">Role</div>
              <div>{project.roles.join(", ")}</div>
            </div>
            <div className="pt-6 border-t border-neutral-200/70">
              <div className="font-medium text-neutral-800 mb-2">More projects</div>
              <div className="flex gap-3">
                {prev && (
                  <Link href={`/work/${prev.slug}`} className="text-neutral-700 hover:underline">
                    ← {prev.title}
                  </Link>
                )}
                {next && (
                  <Link
                    href={`/work/${next.slug}`}
                    className="ml-auto text-neutral-700 hover:underline"
                  >
                    {next.title} →
                  </Link>
                )}
              </div>
            </div>
          </aside>
        </Container>
      </section>
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
