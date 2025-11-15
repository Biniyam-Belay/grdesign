"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Work } from "@lib/types";
import { getWorks } from "@lib/data/works";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

type FeaturedWorksProps = {
  title?: string;
  subtitle?: string;
};

// Group works by category
function groupWorksByCategory(works: Work[]): { category: string; works: Work[] }[] {
  const grouped = works.reduce(
    (acc, work) => {
      const category = work.category || "Uncategorized";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(work);
      return acc;
    },
    {} as Record<string, Work[]>,
  );

  return Object.entries(grouped)
    .map(([category, works]) => ({ category, works }))
    .sort((a, b) => {
      // Sort categories: put "Uncategorized" last
      if (a.category === "Uncategorized") return 1;
      if (b.category === "Uncategorized") return -1;
      return a.category.localeCompare(b.category);
    });
}

// A static, responsive grid for featured works
export default function FeaturedWorks({
  title = "Featured Works",
  subtitle = "A focused slice of recent works.",
}: FeaturedWorksProps) {
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    getWorks()
      .then((data) => {
        setWorks(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!sectionRef.current || loading || works.length === 0) return;

    const ctx = gsap.context(() => {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReduced) return;

      // Animate each work card on scroll with a fade-in and slide-up effect
      gsap.utils.toArray<HTMLElement>(".work-card").forEach((card) => {
        gsap.set(card, {
          opacity: 0,
          y: 100, // Start lower
        });

        gsap.to(card, {
          opacity: 1,
          y: 0, // Move to original position
          ease: "power3.out",
          duration: 1.2, // Keep duration similar for smooth transition
          scrollTrigger: {
            trigger: card,
            start: "top 90%", // Start animation earlier
            end: "top 60%", // End animation when card is higher up
            scrub: 1,
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [loading, works]);

  const aspectClass = (variant?: string) =>
    variant === "square"
      ? "aspect-[1/1]"
      : variant === "portrait45"
        ? "aspect-[4/5]"
        : variant === "portrait916"
          ? "aspect-[9/16]"
          : "aspect-[1/1]"; // default

  if (loading || works.length === 0) return null;

  const groupedWorks = groupWorksByCategory(works);

  return (
    <section ref={sectionRef} className="bg-white pt-14 pb-6 px-4 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-8xl">
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-neutral-900">
            {title}
          </h2>
          {subtitle && <p className="mt-2 text-sm text-neutral-500">{subtitle}</p>}
        </div>

        {/* Render works grouped by category */}
        {groupedWorks.map((group, groupIndex) => (
          <div key={group.category} className="mb-8 last:mb-0">
            {/* Category separator with minimal design */}
            <div className="mb-4 flex items-center gap-3">
              <div className="h-px flex-grow bg-neutral-200"></div>
              <h3 className="text-xs uppercase tracking-widest text-neutral-400 font-medium">
                {group.category}
              </h3>
              <div className="h-px flex-grow bg-neutral-200"></div>
            </div>

            {/* 3-column collage on larger screens, vertical stack on mobile; tighter gaps */}
            <div
              className="relative grid grid-cols-1 sm:grid-cols-3 gap-0"
              style={{ perspective: "1000px" }}
            >
              {group.works.map((work, i) => {
                const variant = work.aspect_ratio || "square";
                return (
                  <div
                    key={`${work.slug}-${i}`}
                    className="work-card block relative"
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <div
                      className={`relative w-full ${aspectClass(variant)} overflow-hidden border border-neutral-200 bg-white`}
                    >
                      <Image
                        src={work.image}
                        alt={work.title}
                        fill
                        className="object-cover"
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 33vw, 100vw"
                        priority={false}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
