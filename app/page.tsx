"use client";

import { useEffect, useRef } from "react";
import Hero from "@/components/content/Hero";
import AboutSection from "@/components/content/AboutSection";
import ProjectsSection from "@/components/content/ProjectsSection";
import AboutMeSection from "@/components/content/AboutMeSection";
import FeaturedWorks from "@/components/content/FeaturedWorks";
import projectsData from "@/data/projects.json";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Pin the hero section and transform it while about section slides over it
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".content-wrapper",
          start: "top bottom",
          end: "top top",
          scrub: 1,
          pin: ".hero-section",
          pinSpacing: false,
        },
      });

      // Gradually change hero background color as we scroll
      tl.to(".hero-background", {
        backgroundColor: "hsl(0, 0%, 95%)",
        ease: "power1.inOut",
      });

      // Slightly scale down hero content as we scroll
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
      <div className="content-wrapper relative z-10 bg-white">
        <div className="about-section">
          <AboutSection />
        </div>
        <FeaturedWorks projects={projectsData} title="Featured Works" />
        <ProjectsSection />
        <AboutMeSection />
      </div>
    </main>
  );
}
