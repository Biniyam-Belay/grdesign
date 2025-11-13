"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Work } from "@lib/types";
import { getWorks } from "@lib/data/works";

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

      // Animate each work card on scroll with ultra-smooth morphing effect
      gsap.utils.toArray<HTMLElement>(".work-card").forEach((card) => {
        // Initial state - more subtle
        gsap.set(card, {
          opacity: 0,
          scale: 0.85,
          rotateY: -10,
          z: -50,
        });

        // Scroll-triggered morph animation with smoother settings
        gsap.to(card, {
          opacity: 1,
          scale: 1,
          rotateY: 0,
          z: 0,
          duration: 1.8,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: card,
            start: "top 90%",
            end: "top 40%",
            scrub: 2,
            toggleActions: "play none none reverse",
          },
        });

        // Smoother focus effect on center card when in viewport
        ScrollTrigger.create({
          trigger: card,
          start: "top 65%",
          end: "bottom 35%",
          onEnter: () => {
            gsap.to(card, {
              scale: 1.03,
              zIndex: 10,
              duration: 0.8,
              ease: "power1.inOut",
            });
          },
          onLeave: () => {
            gsap.to(card, {
              scale: 1,
              zIndex: 1,
              duration: 0.8,
              ease: "power1.inOut",
            });
          },
          onEnterBack: () => {
            gsap.to(card, {
              scale: 1.03,
              zIndex: 10,
              duration: 0.8,
              ease: "power1.inOut",
            });
          },
          onLeaveBack: () => {
            gsap.to(card, {
              scale: 1,
              zIndex: 1,
              duration: 0.8,
              ease: "power1.inOut",
            });
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
        <div
          className="relative grid grid-cols-1 sm:grid-cols-3 gap-0"
          style={{ perspective: "1000px" }}
        >
          {works.map((work, i) => {
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
    </section>
  );
}
