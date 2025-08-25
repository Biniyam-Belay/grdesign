"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { initGSAP } from "@lib/gsap";
import { useReducedMotion } from "@lib/hooks/useReducedMotion";
import { usePageTransition } from "@lib/gsapPageTransition";
import Container from "@components/layout/Container";
import ProjectCard from "@components/content/ProjectCard";
import SplitText from "@components/motion/SplitText";
import { getProjects } from "@lib/data/projects";
import type { Project } from "@lib/types";

// Define a minimal interface for GSAP to satisfy the type checker
interface GSAPInterface {
  timeline: () => {
    fromTo: <T>(target: T, fromVars: object, toVars: object, position?: string | number) => T;
    to: <T>(target: T, vars: object, position?: string | number) => T;
  };
  to: <T>(target: T, vars: object, position?: string | number) => T;
}

export default function Page() {
  const reduced: boolean = useReducedMotion();
  const heroRef = useRef<HTMLDivElement | null>(null);
  const pageRef = useRef<HTMLElement>(null!);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const subtitleRef = useRef<HTMLParagraphElement | null>(null);
  const timelineRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!heroRef.current || reduced) return;
    const gsap = initGSAP();
    const heroElement = heroRef.current;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      // Animate hero section elements
      tl.from(heroElement, { opacity: 0, duration: 0.6 });

      // Badge animation
      const badgeElement = heroElement.querySelector(".inline-block");
      if (badgeElement) {
        tl.from(badgeElement, { y: -20, opacity: 0, duration: 0.5 }, "<0.1");
      }

      // Title and subtitle animations
      if (titleRef.current) {
        tl.from(titleRef.current, { y: 30, opacity: 0, duration: 0.8 }, "<0.2");
      }
      if (subtitleRef.current) {
        tl.from(subtitleRef.current, { y: 20, opacity: 0, duration: 0.7 }, "<0.3");
      }

      // Button animations
      const buttonElements = heroElement.querySelectorAll(".cta-buttons a");
      if (buttonElements.length) {
        tl.from(
          buttonElements,
          {
            y: 15,
            opacity: 0,
            stagger: 0.15,
            duration: 0.5,
            clearProps: "all", // Important: Ensures props are cleared after animation
          },
          "<0.4",
        );
      }

      // Categories animation
      const categoriesElement = heroElement.querySelector(".mt-16");
      if (categoriesElement) {
        tl.from(
          categoriesElement,
          {
            opacity: 0,
            duration: 0.6,
          },
          "<0.5",
        );
      }
    });

    return () => ctx.revert();
  }, [reduced]);

  // Get featured projects (limiting to 3 for homepage)
  const projects = getProjects().slice(0, 3);

  // Grid animation with sticky scroll effect
  useEffect(() => {
    if (!timelineRef.current || reduced) return;

    let ctx: gsap.Context;

    const setupAnimation = async () => {
      const gsap = initGSAP();
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      return gsap.context(() => {
        const stickyContainer = timelineRef.current?.querySelector(
          '[data-timeline="sticky-container"]',
        );
        const projectElements = timelineRef.current?.querySelectorAll(
          '[data-timeline="project"] [data-timeline="project-content"]',
        );

        if (!stickyContainer || !projectElements) return;

        // Initial fade in animation
        gsap.fromTo(
          projectElements,
          {
            opacity: 0,
            y: 30,
            scale: 0.95,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            ease: "power2.out",
            stagger: 0.2,
            scrollTrigger: {
              trigger: timelineRef.current,
              start: "top center",
              toggleActions: "play none none reverse",
            },
          },
        );

        // Create main scroll trigger for pinning
        ScrollTrigger.create({
          trigger: timelineRef.current,
          start: "top top",
          end: "bottom bottom",
          pin: stickyContainer,
          anticipatePin: 1,
          pinSpacing: true,
        });

        // Create individual animations for each project
        projectElements.forEach((project, index) => {
          const direction = index % 2 === 0 ? -1 : 1;
          const startY = 0;
          const endY = direction * 40;

          gsap.to(project, {
            y: endY,
            scale: 0.95,
            opacity: 0.7,
            ease: "none",
            scrollTrigger: {
              trigger: timelineRef.current,
              start: "top top",
              end: "bottom bottom",
              scrub: 1,
              toggleActions: "play none none reverse",
            },
          });
        });
      });
    };

    // Setup and cleanup
    setupAnimation()
      .then((newContext) => {
        ctx = newContext;
      })
      .catch(console.error);

    return () => {
      if (ctx) {
        ctx.revert();
      }
    };
  }, [reduced]);

  usePageTransition(pageRef);
  return (
    <main ref={pageRef} className="min-h-[80svh] bg-white">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="pt-32 pb-40 px-6 relative overflow-hidden bg-gradient-to-b from-white via-white to-neutral-50"
      >
        <Container>
          <div className="text-center max-w-4xl mx-auto relative z-20">
            <div className="inline-block mb-6">
              <span
                className="inline-flex items-center gap-1.5 rounded-full 
                bg-gradient-to-r from-emerald-100 to-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-800 shadow-sm"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                </span>
                Creative Designer
              </span>
            </div>

            <h1
              ref={titleRef}
              className="text-6xl sm:text-6xl md:text-7xl font-semibold tracking-tight mb-6 text-neutral-900"
            >
              Elevating brands through{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">
                thoughtful
              </span>{" "}
              design
            </h1>

            <p
              ref={subtitleRef}
              className="text-balance text-lg md:text-xl text-neutral-800 max-w-3xl mx-auto mb-8"
            >
              Creating distinctive visual identities and immersive experiences that captivate
              audiences and drive meaningful connections.
            </p>

            <div className="mt-10 z-20 relative cta-buttons">
              <Link
                href="/work"
                className="group relative inline-flex items-center overflow-hidden font-medium text-lg text-neutral-900 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/30 focus-visible:ring-offset-2"
              >
                <div className="relative overflow-hidden mr-8">
                  {/* Initial text that folds away */}
                  <span className="inline-block transform transition-transform duration-500 ease-in-out group-hover:translate-y-full group-hover:opacity-0">
                    Explore My Work
                  </span>

                  {/* Text that folds in */}
                  <span className="absolute inset-0 transform -translate-y-full opacity-0 transition-all duration-500 ease-in-out group-hover:translate-y-0 group-hover:opacity-100 text-emerald-600">
                    Explore My Work
                  </span>
                </div>

                <span className="relative flex items-center justify-center transition-all duration-300 transform group-hover:translate-x-1">
                  {/* Arrow icon that rotates on hover */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="transition-all duration-500 ease-in-out transform group-hover:rotate-45"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </span>
              </Link>
            </div>

            {/* Decorative elements */}
            <div className="flex items-center gap-4 justify-center mt-16">
              <span className="w-12 h-px bg-neutral-300"></span>
              <div className="flex gap-6">
                <span className="text-neutral-600 font-medium hover:text-emerald-600 transition-colors cursor-pointer relative group">
                  Branding
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-emerald-600/0 group-hover:bg-emerald-600/100 transition-colors duration-300"></span>
                </span>
                <span className="text-neutral-600 font-medium hover:text-emerald-600 transition-colors cursor-pointer relative group">
                  UI/UX
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-emerald-600/0 group-hover:bg-emerald-600/100 transition-colors duration-300"></span>
                </span>
                <span className="text-neutral-600 font-medium hover:text-emerald-600 transition-colors cursor-pointer relative group">
                  Typography
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-emerald-600/0 group-hover:bg-emerald-600/100 transition-colors duration-300"></span>
                </span>
              </div>
              <span className="w-12 h-px bg-neutral-300"></span>
            </div>
          </div>
        </Container>

        {/* Background accents */}
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-gradient-to-br from-emerald-100 via-emerald-50 to-transparent rounded-full opacity-80 blur-3xl z-0"></div>
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-gradient-to-tl from-amber-100 via-amber-50 to-transparent rounded-full opacity-80 blur-3xl z-0"></div>
        <div className="absolute top-40 right-10 w-64 h-64 bg-gradient-to-br from-blue-50 to-transparent rounded-full opacity-60 blur-3xl z-0"></div>
        <div className="absolute bottom-40 left-10 w-52 h-52 bg-gradient-to-br from-purple-50 to-transparent rounded-full opacity-40 blur-3xl z-0"></div>

        {/* Subtle grain texture overlay */}
        <div
          className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none z-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.1'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            width: "100%",
            height: "100%",
          }}
        ></div>
      </section>

      {/* Selected Work Grid */}
      <section className="py-24 bg-neutral-50 border-y border-neutral-100">
        <Container>
          <div className="flex items-baseline justify-between mb-16">
            <h2 className="text-2xl font-medium">Selected Work</h2>
            <Link
              href="/work"
              className="text-sm font-medium hover:text-neutral-900 transition-colors duration-200 text-neutral-700 group flex items-center gap-1"
            >
              View All{" "}
              <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>

          {/* Grid Structure with Sticky Scroll */}
          <div className="relative h-[300vh]" ref={timelineRef}>
            {/* Sticky container for the grid */}
            <div
              data-timeline="sticky-container"
              className="sticky top-0 min-h-screen flex items-center justify-center py-24 bg-neutral-50"
            >
              <div className="max-w-6xl mx-auto px-6 w-full">
                {/* Two-column grid layout */}
                <div className="grid grid-cols-2 gap-8">
                  {/* Grid Item 1 */}
                  <div data-timeline="project" className="relative">
                    <div data-timeline="project-content" className="transform origin-center">
                      <Link href="/work/minimal-brand-identity" className="group block">
                        <div className="relative aspect-square w-full overflow-hidden bg-white border border-neutral-200 shadow-sm rounded-lg transition-all duration-300 group-hover:shadow-md">
                          <Image
                            src="/assets/projects/brand-identity.svg"
                            alt="Minimal Brand Identity"
                            fill
                            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
                            sizes="(min-width: 1024px) 35vw, 80vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                        </div>

                        <div className="mt-4">
                          <h3 className="text-xl font-medium text-neutral-900 group-hover:text-emerald-700 transition-colors duration-300 flex items-center">
                            Minimal Brand Identity
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="ml-1 opacity-0 transform translate-x-[-8px] transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0"
                            >
                              <path d="M7 17l9.2-9.2M17 17V7H7"></path>
                            </svg>
                          </h3>
                          <p className="mt-2 text-sm text-neutral-600">
                            Brand identity system for a minimalist fashion label
                          </p>
                          <p className="mt-2 text-xs text-neutral-500">
                            Branding · Typography · Identity
                          </p>
                        </div>
                      </Link>
                    </div>
                  </div>

                  {/* Grid Item 2 */}
                  <div data-timeline="project" className="relative">
                    <div data-timeline="project-content" className="transform origin-center">
                      <Link href="/work/editorial-layout-study" className="group block">
                        <div className="relative aspect-square w-full overflow-hidden bg-white border border-neutral-200 shadow-sm rounded-lg transition-all duration-300 group-hover:shadow-md">
                          <Image
                            src="/assets/projects/editorial-layout.svg"
                            alt="Editorial Layout Study"
                            fill
                            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
                            sizes="(min-width: 1024px) 35vw, 80vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                        </div>

                        <div className="mt-4">
                          <h3 className="text-xl font-medium text-neutral-900 group-hover:text-emerald-700 transition-colors duration-300 flex items-center">
                            Editorial Layout Study
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="ml-1 opacity-0 transform translate-x-[-8px] transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0"
                            >
                              <path d="M7 17l9.2-9.2M17 17V7H7"></path>
                            </svg>
                          </h3>
                          <p className="mt-2 text-sm text-neutral-600">
                            Exploration of grid systems and typographic layouts for print
                          </p>
                          <p className="mt-2 text-xs text-neutral-500">
                            Editorial · Typography · Layout
                          </p>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Spacer divs to create scrolling space for the sticky effect */}
            <div className="h-[100vh] relative">
              <div className="absolute bottom-[25%] left-1/2 transform -translate-x-1/2 text-center opacity-20 text-neutral-400">
                <div className="mb-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="animate-bounce"
                  >
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <polyline points="19 12 12 19 5 12"></polyline>
                  </svg>
                </div>
                <p className="text-sm font-medium">Scroll to explore</p>
              </div>
            </div>
            <div className="h-[100vh]"></div>
          </div>
        </Container>
      </section>

      {/* Statement Section */}
      <section className="py-28">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <SplitText
              as="h2"
              className="text-3xl sm:text-4xl font-medium tracking-tight mb-10"
              trigger={true}
              staggerDelay={0.1}
            >
              <span>Design is not just what it looks like.</span>
              <span>Design is how it works.</span>
            </SplitText>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              My approach balances aesthetic refinement with functional clarity, creating designs
              that communicate effectively while maintaining visual elegance.
            </p>
          </div>
        </Container>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-neutral-900 text-white">
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-medium mb-4">Ready to work together?</h2>
            <p className="mb-8 text-neutral-300">
              Let's create something exceptional that elevates your brand.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center rounded-lg border border-white/20 bg-white/10 hover:bg-white/20 px-6 py-3 text-sm font-medium text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900"
            >
              Get in touch
            </Link>
          </div>
        </Container>
      </section>
    </main>
  );
}
