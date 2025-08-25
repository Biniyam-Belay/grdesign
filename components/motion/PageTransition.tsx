"use client";

import { useRef, useEffect, ReactNode } from "react";
import { initGSAP } from "@lib/gsap";
import { usePathname } from "next/navigation";
import { useReducedMotion } from "@lib/hooks/useReducedMotion";

/**
 * PageTransition - A wrapper that handles entry/exit animations between page navigations.
 * This is a higher level component that can be used around page content.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !containerRef.current) return;

    const gsap = initGSAP();
    const container = containerRef.current;

    // Entry animation
    const tl = gsap.timeline();
    tl.fromTo(
      container,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.65, ease: "power2.out" },
    );

    // Cleanup function for navigation away
    return () => {
      tl.kill(); // Ensure timeline doesn't continue on unmount
    };
  }, [pathname, reduced]);

  return (
    <div ref={containerRef} className="page-transition">
      {children}
    </div>
  );
}
