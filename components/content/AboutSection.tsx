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
      <div className="w-[80%] px-4 sm:px-8 lg:px-12">
        <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-normal text-neutral-800 text-left leading-tight">
          Crafting unique{" "}
          <RotatingText
            words={["brand identities", "design systems", "component libraries"]}
            intervalMs={3000}
            highlightClassName="text-blue-800"
          />{" "}
          and{" "}
          <RotatingText
            words={["calm digital interfaces", "modern web apps", "responsive websites"]}
            intervalMs={3200}
            highlightClassName="text-blue-800"
          />{" "}
          that stand the test of time.
        </p>
      </div>
    </section>
  );
};

export default AboutSection;
