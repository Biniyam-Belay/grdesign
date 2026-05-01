// app/components/content/ProjectCard.tsx
"use client";
import Image from "next/image";
import Link from "next/link";
import type { Project } from "@lib/types";

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
  const ratio = variant === "wide" ? "aspect-[16/10]" : "aspect-[4/3]";
  const sizes =
    variant === "wide"
      ? "(min-width: 1024px) 67vw, 100vw"
      : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw";

  return (
    <Link
      href={`/work/${project.slug}`}
      className={`group flex flex-col gap-5 w-full focus:outline-none transform-gpu ${className}`}
      data-type={project.type}
    >
      <div
        className={`relative w-full overflow-hidden bg-[#0B132B]/5 border border-[#0B132B]/8 ${ratio}`}
      >
        {project.thumb ? (
          <Image
            src={project.thumb}
            alt={project.alt ?? project.title}
            fill
            quality={90}
            className="object-cover transform-gpu will-change-transform transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02] motion-reduce:transition-none"
            sizes={sizes}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#0B132B]/20 text-xs uppercase tracking-widest font-bold">
            No specific thumbnail
          </div>
        )}

        {/* Dynamic Overlay that darkens slightly on hover */}
        <div className="absolute inset-0 bg-[#0B132B]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out pointer-events-none motion-reduce:transition-none" />

        {/* Type Badge overlays on hover matching the exact overall aesthetic */}
        {project.type && (
          <div className="absolute top-4 right-4 z-10 opacity-0 translate-y-2 transform-gpu transition-[opacity,transform] duration-300 ease-out group-hover:opacity-100 group-hover:translate-y-0 motion-reduce:transition-none">
            <span className="bg-white text-[#0B132B] text-[10px] font-bold uppercase tracking-[0.25em] px-4 py-2 shadow-[0_6px_16px_rgba(11,19,43,0.12)]">
              {project.type.replace("-", " ")}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1.5 px-1 relative">
        <div className="w-8 h-[1px] bg-[#0055FF] origin-left scale-x-0 transform-gpu transition-transform duration-300 ease-out group-hover:scale-x-100 absolute -top-3 left-1 motion-reduce:transition-none" />
        <h3 className="text-xl md:text-2xl lg:text-3xl font-medium tracking-tight text-[#0B132B] transition-colors duration-500 group-hover:text-[#0055FF]">
          {project.title}
        </h3>
        {project.roles && project.roles.length > 0 && (
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#0B132B]/40">
            {project.roles[0]}
          </p>
        )}
      </div>
    </Link>
  );
}
