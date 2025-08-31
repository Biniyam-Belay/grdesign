// app/components/content/ProjectCard.tsx
"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { initGSAP } from "@lib/gsap";
import { useReducedMotion } from "@lib/hooks/useReducedMotion";
import type { Project } from "@lib/types";

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
    <Link ref={cardRef} href={`/work/${project.slug}`} className="group block focus:outline-none">
      {/* media */}
      <div
        className={`relative ${ratio} w-full overflow-hidden rounded-3xl border border-neutral-200 bg-white`}
      >
        <Image
          src={project.thumb}
          alt={project.alt ?? project.title}
          fill
          className="object-cover transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)] group-hover:scale-[1.03]"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          priority={false}
        />

        {/* bottom meta strip (slides in on hover) */}
        <div className="pointer-events-none absolute inset-x-3 bottom-3 translate-y-3 rounded-2xl bg-white/85 backdrop-blur-sm px-4 py-2 opacity-0 ring-1 ring-black/5 transition-all duration-300 ease-[cubic-bezier(.2,.8,.2,1)] group-hover:translate-y-0 group-hover:opacity-100">
          <div className="flex items-center justify-between gap-4">
            <p className="truncate text-sm font-medium text-neutral-900">{project.title}</p>
            <span className="hidden text-xs uppercase tracking-widest text-neutral-500 sm:block">
              {project.roles[0]}
            </span>
          </div>
        </div>

        {/* subtle focus ring for a11y */}
        <span className="pointer-events-none absolute inset-0 rounded-3xl ring-0 transition-shadow group-focus-visible:ring-2 group-focus-visible:ring-black/60" />
      </div>

      {/* title row under card (for no-hover devices) */}
      <div className="mt-3">
        <h3 className="text-[0.95rem] leading-tight text-neutral-900">
          <span className="font-semibold">{project.title}</span>
          <span className="text-neutral-500"> — {project.roles[0]}</span>
        </h3>
      </div>
    </Link>
  );
}
