"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Work } from "@lib/types";
import { getWorks } from "@lib/data/works";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

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
  const [visibleWorksCount, setVisibleWorksCount] = useState(6); // Changed from showAllWorks
  const [isMobile, setIsMobile] = useState(false); // New state for mobile detection
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Assuming 768px as mobile breakpoint
    };

    handleResize(); // Set initial value
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
            start: "top bottom", // Animation starts when the top of the card enters the bottom of the viewport
            end: "top 50%", // Animation ends when the top of the card reaches 50% of the viewport height
            toggleActions: "play none none reverse",
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
        {groupedWorks.map((group) => (
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
              {(isMobile ? group.works.slice(0, visibleWorksCount) : group.works).map((work, i) => {
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

            {/* Conditional buttons section */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center sm:justify-end gap-4">
              {isMobile && visibleWorksCount < group.works.length && (
                <button
                  onClick={() => setVisibleWorksCount((prevCount) => prevCount + 6)}
                  className="text-neutral-600 hover:text-neutral-900 font-medium text-sm px-4 py-2"
                >
                  See More
                </button>
              )}
              <Link
                href="/work" // Assuming a generic link for now
                className="group flex items-center gap-1 text-neutral-600 hover:text-neutral-900 font-medium text-sm px-4 py-2 transition-all"
              >
                See Full Case Study
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>{" "}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
