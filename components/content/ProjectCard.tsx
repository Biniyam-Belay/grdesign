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
    if (reduced || !cardRef.current) {
      // Set initial visible state for reduced motion
      if (cardRef.current) {
        const gsap = initGSAP();
        gsap.set(cardRef.current, { opacity: 1, y: 0 });
      }
      return;
    }

    const gsap = initGSAP();
    const el = cardRef.current;

    const ctx = gsap.context(() => {
      // Set initial state
      gsap.set(el, { opacity: 1, y: 0 });

      // Simple reveal animation
      gsap.from(el, {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top bottom-=100",
          toggleActions: "play none none none",
        },
      });
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
      {/* Clean card container */}
      <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        {/* Media container */}
        <div className={`relative ${ratio} w-full overflow-hidden bg-neutral-100`}>
          <Image
            src={project.thumb}
            alt={project.alt ?? project.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          />

          {/* Type badge */}
          {project.type && (
            <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-neutral-700 text-xs px-2 py-1 rounded-md font-medium">
              {project.type.replace("-", " ")}
            </span>
          )}

          {/* Video indicator */}
          {project.video && (
            <span className="absolute bottom-3 right-3 bg-neutral-900/80 text-white text-xs px-2 py-1 rounded-md font-medium flex items-center gap-1">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
              Video
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-neutral-900 text-sm mb-1">{project.title}</h3>
          <p className="text-xs text-neutral-600">{project.roles[0]}</p>
        </div>
      </div>
    </Link>
  );
}
