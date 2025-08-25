"use client";

import { useEffect, useRef } from "react";
import { initGSAP } from "@lib/gsap";
import { useReducedMotion } from "@lib/hooks/useReducedMotion";
import { usePageTransition } from "@lib/gsapPageTransition";

export default function Page() {
  const reduced = useReducedMotion();
  const heroRef = useRef<HTMLDivElement | null>(null);
  const pageRef = useRef<HTMLElement>(null!);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const subtitleRef = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    if (!heroRef.current || reduced) return;
    const gsap = initGSAP();
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
      tl.from(heroRef.current, { opacity: 0, duration: 0.6 })
        .from(titleRef.current, { y: 20, opacity: 0, duration: 0.6 }, "<0.1")
        .from(subtitleRef.current, { y: 12, opacity: 0, duration: 0.5 }, "<0.1");
    });
    return () => ctx.revert();
  }, [reduced]);

  usePageTransition(pageRef);
  return (
    <main ref={pageRef} className="min-h-[80svh] bg-white">
      <section ref={heroRef} className="mx-auto max-w-5xl px-6 py-28">
        <h1 ref={titleRef} className="text-5xl sm:text-6xl font-medium tracking-tight">
          Graphic design, refined.
        </h1>
        <p ref={subtitleRef} className="mt-4 max-w-2xl text-balance text-lg text-neutral-600">
          A sleek, modern portfolio with elegant motion. White space, clear hierarchy, and subtle
          GSAP transitions.
        </p>
      </section>
    </main>
  );
}
