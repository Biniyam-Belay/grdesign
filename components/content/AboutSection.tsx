"use client";

import React, { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import useIsomorphicLayoutEffect from "@lib/useIsomorphicLayoutEffect";
import RotatingText from "@components/motion/RotatingText";

gsap.registerPlugin(ScrollTrigger);

const AboutSection = () => {
  const rootRef = useRef<HTMLElement>(null!);

  // Keep the subtle slide-up on scroll for the whole block
  useIsomorphicLayoutEffect(() => {
    if (!rootRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        rootRef.current,
        { y: "15vh" },
        {
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top bottom",
            end: "top 35%",
            scrub: 1,
          },
        },
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="sticky top-0 z-10 bg-white py-16"
      style={{ marginTop: "-1px" }}
    >
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold tracking-normal text-slate-800 text-left leading-tight sm:leading-tight md:leading-tight all-small-caps">
          Crafting unique{" "}
          <span className="inline-block">
            <RotatingText
              words={["design languages", "interface systems", "brand ecosystems"]}
              intervalMs={6000}
              highlightClassName=""
              color="#351431"
            />
          </span>{" "}
          and{" "}
          <span className="inline-block">
            <RotatingText
              words={[
                "user-centered products",
                "omnichannel experiences",
                "conversion-optimized apps",
              ]}
              intervalMs={6400}
              highlightClassName=""
              color="#351431"
            />
          </span>{" "}
          that stand the test of time.
        </p>
      </div>
    </section>
  );
};

export default AboutSection;
