"use client";

import { useEffect, useRef } from "react";
import Hero from "@/components/content/Hero";
import AboutSection from "@/components/content/AboutSection";
import ProjectsSection from "@/components/content/ProjectsSection";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".about-section",
          start: "top bottom",
          end: "top top",
          scrub: 1,
          pin: ".hero-section",
          pinSpacing: false,
        },
      });
      tl.to(".hero-background", {
        backgroundColor: "hsl(0, 0%, 95%)",
        ease: "power1.inOut",
      });
      tl.to(
        ".hero-content",
        {
          scale: 0.9,
          ease: "power1.inOut",
        },
        "<",
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={containerRef}>
      <div className="hero-section">
        <Hero />
      </div>
      <div className="about-section relative z-10 bg-white">
        <AboutSection />
        <ProjectsSection />
      </div>
    </main>
  );
}
