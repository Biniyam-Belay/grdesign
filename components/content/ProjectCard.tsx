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
    <Link ref={cardRef} href={`/work/${project.slug}`} className="group block">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-white">
        <Image
          src={project.thumb}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-300 ease-[var(--ease-standard)] group-hover:scale-[1.03]"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        />
      </div>
      <div className="mt-4">
        <h3 className="text-lg">
          <span className="font-bold">{project.title}</span> - <span>{project.roles[0]}</span>
        </h3>
      </div>
    </Link>
  );
}
