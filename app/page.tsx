"use client";

import { useEffect, useRef } from "react";
import Hero from "@/components/content/Hero";
import SocialProofSection from "@/components/content/SocialProofSection";
import AboutSection from "@/components/content/AboutSection";
import FeaturedWorks from "@/components/content/FeaturedWorks";
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
        <SocialProofSection />
        <FeaturedWorks />
        <div className="about-section">
          <AboutSection />
        </div>
      </div>
    </main>
  );
}
