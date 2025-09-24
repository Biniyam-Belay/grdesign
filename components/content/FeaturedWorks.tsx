"use client";

import { useMemo } from "react";
import Image from "next/image";
import type { Project } from "@lib/types";

type TileVariant = "square" | "portrait45" | "portrait916"; // 1:1, 4:5, 9:16

type FeaturedWorksProps = {
  projects: Project[];
  title?: string;
  layout?: TileVariant[]; // optional per-card layout control
  secondaryTitle?: string; // e.g., "Selected Work"
  subtitle?: string; // e.g., "A focused slice of recent projects."
};

// A static, responsive grid that visually matches ProjectsSection.
// No horizontal scrolling, no arrows – clean vertical flow and spacing.
export default function FeaturedWorks({
  projects,
  title = "Featured Works",
  layout,
  subtitle = "A focused slice of recent works.",
}: FeaturedWorksProps) {
  const featured = useMemo(() => {
    // Only include explicitly featured items; cap to max two rows (6)
    return projects.filter((p) => p.featured).slice(0, 6);
  }, [projects]);

  // default layout pattern if none provided
  const pattern: TileVariant[] = layout?.length
    ? layout
    : ["portrait45", "square", "portrait916", "square", "portrait45", "square"];

  const aspectClass = (variant: TileVariant) =>
    variant === "square"
      ? "aspect-[1/1]"
      : variant === "portrait45"
        ? "aspect-[4/5]"
        : "aspect-[9/16]";

  // (old wide/standard/tall pattern removed in favor of explicit aspect variants)

  if (featured.length === 0) return null;

  return (
    <section className="bg-white pt-14 pb-6 px-4 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-8xl">
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-neutral-900">
            {title}
          </h2>
          {subtitle && <p className="mt-2 text-sm text-neutral-500">{subtitle}</p>}
        </div>

        {/* 3-column collage on larger screens, vertical stack on mobile; tighter gaps */}
        <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-1.5">
          {featured.map((p, i) => {
            const variant =
              (p.featuredAspect as TileVariant) || (pattern[i % pattern.length] as TileVariant);
            const img = p.featuredSrc || p.gallery?.[0]?.src || p.thumb!;
            const alt = p.featuredAlt || p.gallery?.[0]?.alt || p.alt || p.title;
            return (
              <div key={`${p.slug}-${i}`} className="block relative">
                <div
                  className={`group relative w-full ${aspectClass(variant)} overflow-hidden border border-neutral-200 bg-white rounded-md transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform hover:scale-[1.06] hover:z-30 shadow-sm hover:shadow-xl`}
                >
                  <Image
                    src={img}
                    alt={alt}
                    fill
                    className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 33vw, 100vw"
                    priority={false}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
