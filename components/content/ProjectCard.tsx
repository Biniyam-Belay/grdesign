"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { initGSAP } from "@lib/gsap";
import { useReducedMotion } from "@lib/hooks/useReducedMotion";
import type { Project } from "@lib/types";

export default function ProjectCard({ project }: { project: Project }) {
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

  return (
    <Link
      ref={cardRef}
      href={`/work/${project.slug}`}
      className="group block rounded-lg border bg-white p-3 shadow-sm transition-transform will-change-transform hover:-translate-y-0.5"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md bg-neutral-100">
        <Image
          src={project.thumb}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-300 ease-[var(--ease-standard)] group-hover:scale-[1.03]"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        />
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-medium text-neutral-900">{project.title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-neutral-600">{project.excerpt}</p>
        <p className="mt-2 text-xs text-neutral-500">{project.roles.join(" · ")}</p>
      </div>
    </Link>
  );
}
