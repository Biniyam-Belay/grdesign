// app/components/content/ProjectCard.tsx
"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { initGSAP } from "@lib/gsap";
import { useReducedMotion } from "@lib/hooks/useReducedMotion";
import type { Project } from "@lib/types";
// We intentionally no longer autoplay/show inline video in the card thumbnail.
// If a project has a video, we still show the image thumbnail (thumb) and can indicate playability.
// Any actual video playback should occur on the project detail page or via an explicit interaction.

// import VideoPlayer from "@components/media/VideoPlayer"; // Removed from thumbnail usage

type Variant = "wide" | "standard" | "tall";

export default function ProjectCard({
  project,
  variant = "standard",
}: {
  project: Project;
  variant?: Variant;
}) {
  const reduced = useReducedMotion();
  const cardRef = useRef<HTMLAnchorElement>(null!);

  useEffect(() => {
    if (reduced || !cardRef.current) return;
    const gsap = initGSAP();
    const el = cardRef.current;

    const ctx = gsap.context(() => {
      gsap.set(el, { opacity: 0, y: 18 });
      const ob = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              gsap.to(el, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" });
              ob.disconnect();
            }
          });
        },
        { rootMargin: "-10% 0px -10% 0px", threshold: 0.2 },
      );
      ob.observe(el);
    }, cardRef);

    return () => ctx.revert();
  }, [reduced]);

  const ratio =
    variant === "wide" ? "aspect-[16/10]" : variant === "tall" ? "aspect-[3/4]" : "aspect-[4/3]";

  return (
    <Link
      ref={cardRef}
      href={`/work/${project.slug}`}
      className="group block focus:outline-none"
      data-type={project.type}
    >
      {/* media */}
      <div
        className={`relative ${ratio} w-full overflow-hidden border border-neutral-200 bg-white`}
      >
        <div className="absolute inset-0 p-4">
          <div className="relative w-full h-full overflow-hidden">
            <Image
              src={project.thumb}
              alt={project.alt ?? project.title}
              fill
              className="object-cover transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)] group-hover:scale-[1.05]"
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              priority={false}
            />
            {project.type && (
              <span className="absolute top-3 left-3 z-10 rounded-full bg-black/60 text-white text-[10px] uppercase tracking-wide px-2 py-0.5">
                {project.type.replace("-", " ")}
              </span>
            )}

            {project.video && (
              <span
                className="pointer-events-none absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-md bg-black/60 px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-white backdrop-blur-sm opacity-80 group-hover:opacity-100 transition-opacity"
                aria-label="Video available"
              >
                {/* Simple play triangle */}
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                  className="drop-shadow"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
                Video
              </span>
            )}
          </div>
        </div>

        {/* subtle focus ring for a11y */}
        <span className="pointer-events-none absolute inset-0 rounded-3xl ring-0 transition-shadow group-focus-visible:ring-2 group-focus-visible:ring-black/60" />
      </div>

      {/* title row under card (for no-hover devices) */}
      <div className="mt-3">
        <h3 className="text-[0.95rem] leading-tight text-neutral-900">
          <span className="font-semibold">{project.title}</span>
          <span className="text-neutral-500"> - {project.roles[0]}</span>
        </h3>
      </div>
    </Link>
  );
}
