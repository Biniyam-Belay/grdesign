"use client";

import React from "react";
import { AnimatePresence, motion, cubicBezier } from "framer-motion";
import { useReducedMotion } from "@lib/hooks/useReducedMotion";

type RotatingTextProps = {
  words: string[];
  intervalMs?: number;
  className?: string;
  highlightClassName?: string;
  color?: string; // optional inline color override (hex/rgb)
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
  color,
}: RotatingTextProps) {
  const [index, setIndex] = React.useState(0);
  const reduced = useReducedMotion();
  const containerRef = React.useRef<HTMLSpanElement>(null);
  const measureRef = React.useRef<HTMLSpanElement>(null);
  const [currentWidth, setCurrentWidth] = React.useState<number | undefined>(undefined);

  React.useEffect(() => {
    if (!words?.length || reduced) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % words.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [words, intervalMs, reduced]);

  // Measure current word width and animate container to that width
  React.useEffect(() => {
    if (!measureRef.current) return;
    const el = measureRef.current;
    const compute = () => {
      el.textContent = words?.[index] ?? "";
      const wpx = el.getBoundingClientRect().width;
      setCurrentWidth(Math.ceil(wpx));
    };
    const raf = requestAnimationFrame(compute);
    const onResize = () => compute();
    window.addEventListener("resize", onResize);
    const ro = containerRef.current ? new ResizeObserver(() => compute()) : undefined;
    if (containerRef.current && ro) ro.observe(containerRef.current);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      ro?.disconnect();
    };
  }, [index, words]);

  const current = words?.[index] ?? "";

  return (
    <motion.span
      ref={containerRef}
      className={[
        "inline-flex items-center align-baseline overflow-hidden",
        "[perspective:800px]", // 3D perspective for flip
        className,
      ].join(" ")}
      animate={reduced ? undefined : { width: currentWidth ?? "auto" }}
      transition={{ duration: 0.35, ease: cubicBezier(0.22, 1, 0.36, 1) }}
      style={{ whiteSpace: "nowrap" }}
    >
      <span className="relative inline-block">
        {reduced ? (
          <span
            className={["inline-block", highlightClassName].join(" ")}
            style={color ? { color } : undefined}
          >
            {current}
          </span>
        ) : (
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={current}
              variants={flipVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className={["inline-block", highlightClassName].join(" ")}
              style={{ willChange: "transform, opacity", ...(color ? { color } : {}) }}
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
    </motion.span>
  );
}
