// GSAP page transition manager for Next.js App Router
"use client";
import { useRef } from "react";
import { usePathname } from "next/navigation";
import { initGSAP } from "@lib/gsap";
import useIsomorphicLayoutEffect from "@lib/useIsomorphicLayoutEffect";
import { useReducedMotion } from "@lib/hooks/useReducedMotion";

export function usePageTransition(ref: React.RefObject<HTMLElement>) {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const hasAnimated = useRef(false);

  useIsomorphicLayoutEffect(() => {
    if (!ref.current || reduced) return;
    const gsap = initGSAP();
    const tl = gsap.timeline();
    tl.fromTo(
      ref.current,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
    );
    hasAnimated.current = true;
    return () => {
      // Optional cleanup/kill timelines if needed
    };
  }, [pathname, reduced]);
}
