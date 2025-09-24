"use client";

import React from "react";
import { AnimatePresence, motion, cubicBezier } from "framer-motion";
import { useReducedMotion } from "@lib/hooks/useReducedMotion";

type RotatingTextProps = {
  words: string[];
  intervalMs?: number;
  className?: string;
  highlightClassName?: string;
};

const flipVariants = {
  enter: {
    rotateX: -90,
    opacity: 0,
    y: "0.1em",
  },
  center: {
    rotateX: 0,
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: cubicBezier(0.22, 1, 0.36, 1) },
  },
  exit: {
    rotateX: 90,
    opacity: 0,
    y: "-0.1em",
    transition: { duration: 0.65, ease: cubicBezier(0.22, 1, 0.36, 1) },
  },
};

// Keep internal state isolated per instance
export default function RotatingText({
  words,
  intervalMs = 50000,
  className = "",
  highlightClassName = "",
}: RotatingTextProps) {
  const [index, setIndex] = React.useState(0);
  const reduced = useReducedMotion();
  const containerRef = React.useRef<HTMLSpanElement>(null);
  const measureRef = React.useRef<HTMLSpanElement>(null);
  const [maxWidth, setMaxWidth] = React.useState<number | undefined>(undefined);

  React.useEffect(() => {
    if (!words?.length || reduced) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % words.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [words, intervalMs, reduced]);

  // Measure the maximum width among words to avoid layout shift
  React.useEffect(() => {
    if (!words?.length || !measureRef.current) return;
    const el = measureRef.current;
    let max = 0;
    const compute = () => {
      max = 0;
      for (const w of words) {
        el.textContent = w;
        const wpx = el.getBoundingClientRect().width;
        if (wpx > max) max = wpx;
      }
      setMaxWidth(Math.ceil(max));
    };
    // Initial compute after paint
    const raf = requestAnimationFrame(compute);

    // Recompute on resize and container size changes
    const onResize = () => compute();
    window.addEventListener("resize", onResize);
    const ro = containerRef.current ? new ResizeObserver(() => compute()) : undefined;
    if (containerRef.current && ro) ro.observe(containerRef.current);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      ro?.disconnect();
    };
  }, [words]);

  const current = words?.[index] ?? "";

  return (
    <span
      ref={containerRef}
      className={[
        "inline-flex items-center align-baseline",
        "[perspective:800px]", // 3D perspective for flip
        className,
      ].join(" ")}
      style={{ width: maxWidth ? `${maxWidth}px` : undefined }}
    >
      <span className="relative inline-block">
        {reduced ? (
          <span className={["inline-block", highlightClassName].join(" ")}>{current}</span>
        ) : (
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={current}
              variants={flipVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className={["inline-block", highlightClassName].join(" ")}
              style={{ willChange: "transform, opacity" }}
            >
              {current}
            </motion.span>
          </AnimatePresence>
        )}
      </span>
      {/* Hidden measurer for width calculation */}
      <span
        ref={measureRef}
        aria-hidden
        className={["absolute invisible whitespace-nowrap", highlightClassName].join(" ")}
        style={{
          position: "absolute",
          visibility: "hidden",
          whiteSpace: "nowrap",
          left: -9999,
          top: 0,
        }}
      />
    </span>
  );
}
