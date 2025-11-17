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

type Variant = "wide" | "standard";

export default function ProjectCard({
  project,
  variant = "standard",
  className,
}: {
  project: Project;
  variant?: Variant;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const cardRef = useRef<HTMLAnchorElement>(null!);

  useEffect(() => {
    if (reduced || !cardRef.current) {
      if (cardRef.current) {
        const gsap = initGSAP();
        gsap.set(cardRef.current, { opacity: 1, y: 0 });
      }
      return;
    }

    const gsap = initGSAP();
    const el = cardRef.current;

    const ctx = gsap.context(() => {
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

  const ratio = variant === "wide" ? "aspect-[16/10]" : "aspect-[4/3]";

  const sizes =
    variant === "wide"
      ? "(min-width: 1024px) 67vw, 100vw"
      : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw";

  return (
    <Link
      ref={cardRef}
      href={`/work/${project.slug}`}
      className={`group relative block w-full overflow-hidden rounded-lg bg-neutral-100 focus:outline-none ${ratio} ${className}`}
      data-type={project.type}
    >
      <Image
        src={project.thumb}
        alt={project.alt ?? project.title}
        fill
        quality={90}
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        sizes={sizes}
      />

      {/* Type badge */}
      {project.type && (
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-neutral-700 text-xs px-2 py-1 rounded-md font-medium">
          {project.type.replace("-", " ")}
        </span>
      )}

      {/* Video indicator */}
      {/* {project.video && (
        <span className="absolute top-3 right-3 bg-neutral-900/80 text-white text-xs px-2 py-1 rounded-md font-medium flex items-center gap-1">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
          Video
        </span>
      )} */}

      {/* Gradient overlay for text */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-4 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <h3 className="font-semibold text-sm mb-1">{project.title}</h3>
        <p className="text-xs">{project.roles[0]}</p>
      </div>
    </Link>
  );
}
