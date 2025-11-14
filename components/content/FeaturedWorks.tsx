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

  return (
    <section ref={sectionRef} className="bg-white pt-14 pb-6 px-4 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-8xl">
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-neutral-900">
            {title}
          </h2>
          {subtitle && <p className="mt-2 text-sm text-neutral-500">{subtitle}</p>}
        </div>

        {/* 3-column collage on larger screens, vertical stack on mobile; tighter gaps */}
        <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-0">
          {works.map((work, i) => {
            const variant = work.aspect_ratio || "square";
            return (
              <div key={`${work.slug}-${i}`} className="work-card block relative">
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

        {/* "View full case study" button */}
        <div className="text-right mt-12">
          <Link
            href="/work"
            className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-neutral-700 bg-transparent rounded-lg hover:bg-neutral-100 hover:text-neutral-900 transition-colors duration-200"
          >
            View full case study{" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4 ml-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
