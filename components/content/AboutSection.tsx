"use client";

import React, { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@lib/hooks/useReducedMotion";
import useIsomorphicLayoutEffect from "@lib/useIsomorphicLayoutEffect";

gsap.registerPlugin(ScrollTrigger);

const AboutSection = () => {
  const rootRef = useRef<HTMLElement>(null!);
  const textRef = useRef<HTMLParagraphElement>(null!);
  const reduced = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    if (reduced || !textRef.current) return;

    const el = textRef.current;
    const originalText = el.innerText;
    // Simple split by space to animate words instead of chars for a cleaner effect
    // Clear the element first
    el.innerHTML = "";

    // Store span elements to animate later
    const wordSpans: HTMLSpanElement[] = [];

    // Process each word separately to preserve spaces
    const words = originalText.split(" ");
    words.forEach((word, index) => {
      // Create span for the word
      const wordSpan = document.createElement("span");
      wordSpan.textContent = word;
      wordSpan.style.display = "inline-block";
      wordSpans.push(wordSpan);
      el.appendChild(wordSpan);

      // Add a space after each word except the last one
      if (index < words.length - 1) {
        const spaceSpan = document.createElement("span");
        spaceSpan.textContent = " ";
        spaceSpan.style.display = "inline-block";
        spaceSpan.style.width = "0.3em"; // A bit more space between words
        el.appendChild(spaceSpan);
      }
    });

    const ctx = gsap.context(() => {
      // Text animation on scroll
      gsap.fromTo(
        "span", // Target all spans within the context
        {
          color: "#a3a3a3", // neutral-400
          opacity: 0.5,
        },
        {
          color: "#171717", // neutral-900
          opacity: 1,
          duration: 0.8,
          ease: "power2.inOut",
          stagger: 0.05,
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 60%",
            end: "center center",
            scrub: 1,
          },
        },
      );

      // Create smooth slide-up effect
      gsap.fromTo(
        rootRef.current,
        {
          y: "15vh",
        },
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

    return () => {
      ctx.revert();
      if (textRef.current) {
        textRef.current.innerHTML = originalText;
      }
    };
  }, [reduced]);

  return (
    <section
      ref={rootRef}
      className="sticky top-0 z-10 bg-white py-16"
      style={{
        marginTop: "-1px", // Fix potential gap issues between sections
      }}
    >
      <div className="w-[80%] px-4 sm:px-8 lg:px-12">
        <p
          ref={textRef}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-normal text-neutral-400 text-left leading-tight"
        >
          Crafting unique brand identities and calm digital interfaces that stand the test of time.
        </p>
      </div>
    </section>
  );
};

export default AboutSection;
