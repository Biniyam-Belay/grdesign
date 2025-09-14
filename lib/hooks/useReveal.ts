"use client";
import { useEffect } from "react";
import { initGSAP } from "@lib/gsap";
import { useReducedMotion } from "@lib/hooks/useReducedMotion";

interface UseRevealOptions {
  selector?: string;
  rootMargin?: string;
  threshold?: number;
  y?: number;
  duration?: number;
  stagger?: number;
  ease?: string;
}

/**
 * useReveal - Attach scroll reveal animation to elements matching selector.
 * Elements should start un-animated (will be set). Respects reduced motion.
 */
export function useReveal({
  selector = "[data-reveal]",
  rootMargin = "0px 0px -10% 0px",
  threshold = 0.15,
  y = 22,
  duration = 0.6,
  stagger = 0.08,
  ease = "power2.out",
}: UseRevealOptions = {}) {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return; // show immediately
    const gsap = initGSAP();
    const nodes = Array.from(document.querySelectorAll<HTMLElement>(selector));
    if (!nodes.length) return;

    nodes.forEach((el) => gsap.set(el, { opacity: 0, y }));

    const queue: HTMLElement[] = [];
    let flushing = false;
    function flush() {
      if (flushing || !queue.length) return;
      flushing = true;
      const batch = queue.splice(0, queue.length);
      gsap.to(batch, { opacity: 1, y: 0, duration, ease, stagger });
      flushing = false;
    }

    const ob = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            queue.push(entry.target as HTMLElement);
            ob.unobserve(entry.target);
          }
        });
        flush();
      },
      { rootMargin, threshold },
    );

    nodes.forEach((el) => ob.observe(el));

    return () => ob.disconnect();
  }, [selector, rootMargin, threshold, y, duration, stagger, ease, reduced]);
}
