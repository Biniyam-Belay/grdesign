"use client";

import { useEffect, useRef, ReactNode } from "react";
import { initGSAP } from "@lib/gsap";
import { useReducedMotion } from "@lib/hooks/useReducedMotion";

type SplitTextProps = {
  children: ReactNode;
  as?: React.ElementType;
  className?: string;
  staggerDelay?: number;
  animationDelay?: number;
  trigger?: boolean | HTMLElement;
};

/**
 * SplitText - Animates text by splitting it into lines and revealing each line with a stagger.
 * Useful for headings or statements that need elegant reveals.
 */
export default function SplitText({
  children,
  as: Component = "div",
  className = "",
  staggerDelay = 0.08,
  animationDelay = 0,
  trigger = false,
}: SplitTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<HTMLSpanElement[]>([]);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !containerRef.current) return;

    const gsap = initGSAP();
    const container = containerRef.current;
    const lines = linesRef.current;

    // Initial setup - hide lines
    gsap.set(lines, { opacity: 0, y: 24 });

    const animate = () => {
      gsap.to(lines, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power2.out",
        stagger: staggerDelay,
        delay: animationDelay,
      });
    };

    // Either animate immediately or use intersection observer
    if (!trigger) {
      animate();
    } else {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            animate();
            observer.disconnect();
          }
        },
        { threshold: 0.15 },
      );
      observer.observe(container);
      return () => observer.disconnect();
    }
  }, [reduced, staggerDelay, animationDelay, trigger]);

  // Convert children to array of ReactNodes
  const content = Array.isArray(children) ? children : [children];

  return (
    <Component className={className}>
      <div ref={containerRef} className="overflow-hidden">
        {content.map((item, i) => (
          <span
            key={i}
            ref={(el) => {
              if (el) linesRef.current[i] = el;
            }}
            className="block"
          >
            {item}
          </span>
        ))}
      </div>
    </Component>
  );
}
