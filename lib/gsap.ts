"use client";

// Centralized GSAP init to avoid duplicate plugin registration and SSR breakage.
// Import this in client components that animate.
import { gsap } from "gsap";

// Import plugins selectively; add others as needed
let scrollTriggerRegistered = false;

export function initGSAP() {
  if (typeof window === "undefined") return gsap; // SSR guard

  // Lazy import ScrollTrigger only in the browser
  if (!scrollTriggerRegistered) {
    // Dynamic import to support tree-shaking and avoid SSR issues
    import("gsap/ScrollTrigger")
      .then((mod) => {
        // Register plugin once
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const ScrollTrigger = (mod as any).ScrollTrigger ?? mod.default;
        if (ScrollTrigger) {
          gsap.registerPlugin(ScrollTrigger);
          scrollTriggerRegistered = true;
        }
      })
      .catch(() => {
        // no-op in case dynamic import fails during SSR or other edge cases
      });
  }
  return gsap;
}

export { gsap };
