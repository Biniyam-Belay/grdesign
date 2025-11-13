// app/components/sections/ProjectsSection.tsx
"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { initGSAP } from "@lib/gsap";
import { useReducedMotion } from "@lib/hooks/useReducedMotion";
import type { Project } from "@/lib/types";

interface ProjectsSectionProps {
  projects: Project[];
}

export default function ProjectsSection({ projects: allProjects }: ProjectsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  // Show only projects marked as featured for homepage display
  const projects = allProjects.filter((p) => p.featured);
  const maxProjectCount = 6;

  // Project results mapping
  const getProjectResult = (slug: string): string => {
    const results: Record<string, string> = {
      "sirtona-agency":
        "340% increase in lead generation and secured 2 major clients within first month of launch.",
      "biruh-tutors":
        "280% growth in student enrollments and successful expansion to 3 new cities within 6 months.",
      "sage-barbershop":
        "200% increase in booking rate while attracting a younger, premium clientele demographic.",
      awib: "Reached 15K+ women across Ethiopia and built the largest women's professional network in East Africa.",
      "awib-meri":
        "Achieved 85% job placement rate for graduates, becoming the #1 youth employability program.",
      "awib-haset":
        "Successfully trained 300+ women leaders and created sustainable leadership development pipeline.",
    };
    return (
      results[slug] ||
      "Delivered exceptional design solution that exceeded client expectations and improved user engagement."
    );
  };

  useEffect(() => {
    if (reduced || !sectionRef.current) {
      // Set initial visible state for reduced motion
      if (sectionRef.current) {
        const items = sectionRef.current.querySelectorAll(".bento-item");
        items.forEach((item) => {
          (item as HTMLElement).style.opacity = "1";
          (item as HTMLElement).style.transform = "none";
        });
      }
      return;
    }

    const gsap = initGSAP();

    const ctx = gsap.context(() => {
      // Set initial state
      gsap.set(".bento-item", { opacity: 1, y: 0 });

      // Elegant staggered reveal for project rows
      gsap.from(".project-row", {
        opacity: 0,
        y: 40,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom-=150",
          toggleActions: "play none none none",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={sectionRef}
      id="work"
      className="py-24 md:py-32 px-4 sm:px-8 lg:px-12 bg-white"
      data-reveal
    >
      {/* Modern CSS for folder showcase */}
      <style jsx>{`
        .folder-container {
          perspective: 1200px;
          transform-style: preserve-3d;
        }

        /* Smooth folder opening effect */
        .project-row:hover .folder-container .absolute:last-child ~ div {
          transform: rotateY(-20deg) rotateX(10deg) translateY(-12px) translateZ(30px);
        }

        /* Enhanced card spreading */
        .project-row:hover .folder-container .absolute:nth-child(2) > div:nth-child(1) {
          transform: rotate(8deg) translateY(-20px) translateX(8px) scale(1.02);
        }

        .project-row:hover .folder-container .absolute:nth-child(2) > div:nth-child(2) {
          transform: rotate(2deg) translateY(-24px) translateX(-16px) scale(1.01);
        }

        .project-row:hover .folder-container .absolute:nth-child(2) > div:nth-child(3) {
          transform: rotate(-3deg) translateY(-28px) translateX(-24px) scale(1);
        }

        /* Backdrop blur support */
        @supports (backdrop-filter: blur(10px)) {
          .backdrop-blur-sm {
            backdrop-filter: blur(4px);
          }
          .backdrop-blur-md {
            backdrop-filter: blur(12px);
          }
        }

        /* Responsive adjustments */
        @media (max-width: 1024px) {
          .folder-container {
            height: 280px !important;
            perspective: 800px;
          }

          .project-row .grid {
            gap: 1.5rem !important;
          }

          .project-row h3 {
            font-size: 1.5rem !important;
          }
        }

        @media (max-width: 768px) {
          .folder-container {
            height: 240px !important;
          }

          .project-row .space-y-8 {
            gap: 2rem !important;
          }

          .project-row .py-8 {
            padding-top: 1.5rem !important;
            padding-bottom: 1.5rem !important;
          }

          .project-row .grid-cols-3 {
            grid-template-columns: 1fr !important;
            gap: 1rem !important;
          }

          /* Simplified mobile interactions */
          .project-row:hover .folder-container .absolute:last-child ~ div {
            transform: rotateY(-10deg) rotateX(5deg) translateY(-6px);
          }
        }

        /* Performance optimizations */
        .folder-container * {
          backface-visibility: hidden;
          will-change: transform;
        }

        /* Smooth shadow transitions */
        .project-row:hover .folder-container > div:last-child {
          filter: blur(6px);
        }
      `}</style>
      {/* Minimal section header */}
      <div className="mb-16 text-center" data-reveal>
        <div className="inline-flex items-center gap-2 border border-neutral-200 bg-neutral-50 text-neutral-700 px-3 py-1.5 rounded-full text-sm mb-6">
          Creative Showcase
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">Amazing Work</h2>
        <p className="text-neutral-600 max-w-2xl mx-auto">
          A curated selection of standout creative work. Click any piece to explore the full case
          study and process behind it.
        </p>
      </div>

      {/* Breathtaking Row-Based Showcase */}
      <div className="relative space-y-8 md:space-y-12">
        {projects.slice(0, 6).map((project, i) => (
          <Link
            key={`${project.slug}-${i}`}
            href={`/work/${project.slug}`}
            className="project-row group block"
            data-reveal
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center py-8 lg:py-12 border-b border-neutral-100 last:border-b-0 transition-all duration-500 group-hover:border-neutral-200">
              {/* Realistic Folder Design - Left Side */}
              <div className="lg:col-span-5 relative">
                <div className="folder-container relative h-[360px] lg:h-[400px] flex items-center justify-center">
                  {/* Container for folder and cards */}
                  <div className="relative w-full max-w-md">
                    {/* Project Card - Inside folder */}
                    <div className="absolute top-24 left-1/2 -translate-x-1/2 w-full max-w-xs h-64 z-10">
                      {/* Single Card - Emerging from folder */}
                      <div className="w-full h-full bg-white rounded-lg shadow-2xl border border-neutral-200 overflow-hidden transform transition-all duration-700 group-hover:-translate-y-12 group-hover:scale-105">
                        <Image
                          src={project.thumb}
                          alt={project.alt ?? project.title}
                          className="w-full h-full object-cover"
                          width={384}
                          height={256}
                        />

                        {/* Project type badge */}
                        {project.type && (
                          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm text-neutral-700 text-xs px-2.5 py-1.5 rounded font-medium shadow-sm">
                            {project.type.replace("-", " ").toUpperCase()}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actual Folder Structure */}
                    <div className="relative mt-28">
                      {/* Folder Back Wall */}
                      <div className="relative w-full h-52 bg-gradient-to-b from-amber-50 to-amber-100 border-2 border-amber-200 rounded-sm shadow-inner">
                        <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,rgba(0,0,0,0.02)_2px,rgba(0,0,0,0.02)_4px)]"></div>
                      </div>

                      {/* Folder Tab */}
                      <div
                        className="absolute -top-4 left-8 w-24 h-8 bg-gradient-to-b from-amber-100 to-amber-50 border-2 border-amber-200 border-b-0 rounded-t-sm shadow-sm"
                        style={{
                          clipPath: "polygon(0 50%, 8% 0, 92% 0, 100% 50%, 100% 100%, 0 100%)",
                        }}
                      ></div>

                      {/* Folder Front Flap - Half Open */}
                      <div
                        className="absolute top-8 left-0 right-0 h-44 bg-gradient-to-b from-amber-100 via-amber-50 to-amber-100 border-2 border-amber-200 border-t-0 rounded-b-sm shadow-2xl origin-top transition-all duration-700 group-hover:-rotate-x-8 group-hover:-translate-y-2"
                        style={{
                          transformStyle: "preserve-3d",
                          boxShadow:
                            "0 4px 20px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.5)",
                        }}
                      >
                        {/* Paper texture */}
                        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_1px,rgba(0,0,0,0.01)_1px,rgba(0,0,0,0.01)_2px)] rounded-b-sm"></div>

                        {/* Inner shadow for depth */}
                        <div className="absolute inset-0 shadow-[inset_0_2px_8px_rgba(0,0,0,0.08)] rounded-b-sm"></div>

                        {/* Folder edge highlight */}
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent"></div>

                        {/* Action indicator */}
                        <div className="absolute bottom-6 right-6 w-10 h-10 bg-neutral-900 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 shadow-lg">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="white"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                          >
                            <path d="M7 17L17 7M17 7H7M17 7V17" />
                          </svg>
                        </div>
                      </div>

                      {/* Folder shadow */}
                      <div className="absolute inset-0 bg-gradient-radial from-black/20 to-transparent rounded-sm blur-xl translate-y-6 -z-10 transition-all duration-500 group-hover:translate-y-8"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Project Details - Right Side */}
              <div className="lg:col-span-7 space-y-6">
                {/* Project Title & Index */}
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <span className="text-neutral-400 font-mono text-sm">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="h-px bg-neutral-200 flex-1 group-hover:bg-neutral-300 transition-colors duration-300" />
                  </div>

                  <h3 className="text-2xl lg:text-3xl font-light text-neutral-900 leading-tight group-hover:text-black transition-colors duration-300">
                    {project.title}
                  </h3>
                </div>

                {/* Project Meta Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Timeline */}
                  <div className="space-y-2">
                    <div className="text-xs uppercase tracking-wider text-neutral-500 font-medium">
                      Timeline
                    </div>
                    <div className="text-sm text-neutral-700">
                      {project.year || "2024"} • 2-3 weeks
                    </div>
                  </div>

                  {/* Role */}
                  <div className="space-y-2">
                    <div className="text-xs uppercase tracking-wider text-neutral-500 font-medium">
                      Role
                    </div>
                    <div className="text-sm text-neutral-700">{project.roles[0]}</div>
                  </div>

                  {/* Tools/Technologies */}
                  <div className="space-y-2">
                    <div className="text-xs uppercase tracking-wider text-neutral-500 font-medium">
                      Tools
                    </div>
                    <div className="text-sm text-neutral-700">
                      {Array.isArray(project.tools) && project.tools.length
                        ? project.tools.slice(0, 2).join(", ")
                        : "Figma, Adobe"}
                    </div>
                  </div>
                </div>

                {/* Results/Impact */}
                <div className="space-y-3">
                  <div className="text-xs uppercase tracking-wider text-neutral-500 font-medium">
                    Key Results
                  </div>
                  <div className="text-neutral-600 leading-relaxed max-w-xl">
                    {getProjectResult(project.slug) ||
                      "Delivered exceptional design solution that exceeded client expectations and improved user engagement."}
                  </div>
                </div>

                {/* Action Indicator */}
                <div className="flex items-center gap-3 pt-2">
                  <span className="text-sm text-neutral-500 group-hover:text-neutral-700 transition-colors duration-300">
                    View Case Study
                  </span>
                  <div className="w-6 h-px bg-neutral-300 group-hover:bg-neutral-600 group-hover:w-8 transition-all duration-300" />
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="text-neutral-400 group-hover:text-neutral-600 group-hover:translate-x-1 transition-all duration-300"
                  >
                    <path d="M7 17L17 7M17 7H7M17 7V17" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Simple CTA section */}
      <div className="mt-16 text-center">
        <div className="bg-neutral-50 rounded-lg p-8 border border-neutral-200 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-neutral-900 mb-4">Let's Work Together</h3>
          <p className="text-neutral-600 mb-8 max-w-lg mx-auto">
            Interested in working together? Let's discuss your project.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="https://calendar.app.google/1RTjShD5sgqBmm3K7"
              className="inline-flex items-center justify-center gap-2 bg-neutral-900 text-white px-6 py-3 rounded-lg font-medium transition-all hover:bg-neutral-800"
              target="_blank"
              rel="noopener noreferrer"
            >
              Book a Call
              <svg
                className="transition-transform group-hover:translate-x-1"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M5 12h14M12 5l7 7-7 7"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </Link>

            <Link
              href="/work"
              className="inline-flex items-center justify-center gap-2 border border-neutral-300 text-neutral-700 px-6 py-3 rounded-lg font-medium transition-all hover:border-neutral-400 bg-white"
            >
              View All Work
            </Link>
          </div>
        </div>
      </div>

      {/* See more projects - only if there are more */}
      {projects.length > maxProjectCount && (
        <div className="mt-8 flex justify-center">
          <Link
            href="/work"
            className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-6 py-3 text-sm text-neutral-900 hover:bg-neutral-900 hover:text-white transition-colors"
          >
            See more success stories
          </Link>
        </div>
      )}
    </section>
  );
}
