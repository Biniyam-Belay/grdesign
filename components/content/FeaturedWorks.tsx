"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { createSupabaseClient } from "@/lib/supabase/client";
import type { Project } from "@/lib/types";

const metrics = [
  {
    target: 4,
    suffix: "+",
    label: "Years in the Game",
    desc: "Sharpening our craft across branding, digital, and print since day one.",
  },
  {
    target: 8,
    suffix: "+",
    label: "Sectors Transformed",
    desc: "Deep domain expertise elevating brands across tech, medical, beauty, and education.",
  },
  {
    target: 97,
    suffix: "%",
    label: "Client Retention",
    desc: "Our partners come back — because the work speaks and the results compound.",
  },
];

function CountUp({
  target,
  suffix,
  isActive,
}: {
  target: number;
  suffix: string;
  isActive: boolean;
}) {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isActive || hasAnimated.current) return;
    hasAnimated.current = true;

    const duration = 2000;
    const startTime = performance.now();
    const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutQuart(progress);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [isActive, target]);

  return (
    <span>
      {count}
      {suffix && <span className="text-[#FF0033]">{suffix}</span>}
    </span>
  );
}

export default function FeaturedWorks() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const supabase = createSupabaseClient();
        const { data, error } = await supabase
          .from("projects")
          .select("id, slug, title, excerpt, thumb, featured_src, roles, year, client")
          .order("position", { ascending: true })
          .limit(6);

        if (!error && data) {
          setProjects(data as Project[]);
        }
      } catch (err) {
        console.error("Failed to fetch projects:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const display = projects.slice(0, 6);

  return (
    <section className="w-full bg-[#F5F5F0] px-4 sm:px-6 lg:px-12 pb-20 lg:pb-28">
      <div ref={ref} className="w-full max-w-8xl mx-auto">
        {/* ── Impact Stats Strip ── */}
        <div className="w-full mb-20 lg:mb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {metrics.map((metric, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 + i * 0.15 }}
                className="flex flex-col items-start text-left p-8 lg:p-10 border border-[#0B132B]/8 bg-white/30"
              >
                <span className="text-6xl sm:text-7xl md:text-8xl lg:text-[110px] font-extralight tracking-[-0.06em] leading-none mb-4 sm:mb-6 text-[#0B132B]">
                  <CountUp target={metric.target} suffix={metric.suffix} isActive={isInView} />
                </span>
                <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#0B132B] mb-2">
                  {metric.label}
                </span>
                <p className="text-sm font-light text-[#0B132B]/40 leading-relaxed max-w-[260px]">
                  {metric.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Boast Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14"
        >
          {/* Left — bold boast */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF0033]" />
              <span className="text-[9px] text-[#FF0033] uppercase tracking-[0.35em] font-bold">
                Selected Work
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-[-0.03em] leading-[1.05] text-[#0B132B] max-w-2xl">
              Work that <span className="font-semibold">moves</span> markets
              <br className="hidden md:block" /> and{" "}
              <span className="font-semibold text-[#FF0033]">defines</span> brands.
            </h2>
          </div>

          {/* Right — archive link */}
          <Link
            href="/work"
            className="group hidden md:flex items-center gap-2 self-end mb-1 transition-all duration-300 hover:opacity-80"
          >
            <span className="text-[13px] font-bold uppercase tracking-[0.25em] bg-clip-text text-transparent bg-gradient-to-r from-[#0B132B] to-[#0055FF]">
              View All Projects
            </span>
            <ArrowUpRight
              size={18}
              className="text-[#0055FF] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300"
            />
          </Link>
        </motion.div>

        {/* ── Horizontal rule ── */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.1 }}
          className="w-full h-px bg-[#0B132B]/10 mb-3 origin-left"
        />

        {/* ── Skeleton ── */}
        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-[4/3] bg-[#0B132B]/6 animate-pulse" />
            ))}
          </div>
        ) : display.length === 0 ? (
          <p className="text-[#0B132B]/30 text-sm py-12">
            No projects yet — add them in the admin panel.
          </p>
        ) : (
          /* ── 2-Col × 3-Row Grid ── */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {display.map((project, i) => (
              <motion.div
                key={project.slug}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.75, ease: "easeOut", delay: 0.15 + i * 0.08 }}
              >
                <Link
                  href={`/work/${project.slug}`}
                  className="group block relative overflow-hidden aspect-[4/3] cursor-pointer"
                >
                  {/* Image */}
                  {project.featuredSrc || project.thumb ? (
                    <Image
                      src={project.featuredSrc || project.thumb}
                      alt={project.title}
                      fill
                      priority={i < 2}
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-[#0B132B]/8 flex items-center justify-center">
                      <span className="text-[#0B132B]/10 text-5xl font-light">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                  )}

                  {/* Index number — always visible, top-left */}
                  <span className="absolute top-5 left-5 text-[10px] font-bold tracking-widest text-white/25 z-10">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  {/* Hover overlay — slides up */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] z-10" />

                  {/* Hover content */}
                  <div className="absolute inset-x-0 bottom-0 p-6 z-20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] delay-[30ms]">
                    {/* Category */}
                    <span className="text-[9px] text-[#FF0033] uppercase tracking-[0.35em] font-bold block mb-2">
                      {project.roles?.[0] ?? "Work"}
                    </span>
                    {/* Title */}
                    <h3 className="text-xl font-medium text-white tracking-tight leading-tight mb-3">
                      {project.title}
                    </h3>
                    {/* Tags (remaining roles) */}
                    {project.roles && project.roles.length > 1 && (
                      <div className="flex flex-wrap gap-1.5">
                        {project.roles.slice(1, 4).map((role) => (
                          <span
                            key={role}
                            className="text-[9px] font-bold uppercase tracking-[0.15em] text-white/40 border border-white/15 px-2.5 py-1 rounded-full"
                          >
                            {role}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Arrow — top right, hover reveal */}
                  <div className="absolute top-5 right-5 w-9 h-9 rounded-full bg-[#FF0033] flex items-center justify-center shadow-[0_0_20px_rgba(255,0,51,0.5)] z-20 scale-75 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500">
                    <ArrowUpRight size={14} strokeWidth={2.5} color="white" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* ── Brag Strip ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
          className="mt-12 lg:mt-16 pt-10 lg:pt-14 border-t border-[#0B132B]/8 flex flex-col lg:flex-row lg:items-end justify-between gap-8"
        >
          <div className="flex flex-col gap-3 max-w-2xl">
            <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light tracking-[-0.03em] leading-[1.1] text-[#0B132B]">
              This is just the <span className="font-semibold">surface.</span>
            </h3>
            <p className="text-base font-light text-[#0B132B]/40 leading-relaxed max-w-lg">
              Every project in our archive began as a challenge and ended as a case study. Explore
              the full body of work.
            </p>
          </div>
          <Link
            href="/work"
            className="group flex items-center gap-3 shrink-0 transition-all duration-300 hover:gap-4"
          >
            <span className="text-base md:text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#0B132B] to-[#0055FF]">
              Explore the Full Archive
            </span>
            <ArrowUpRight
              size={22}
              className="text-[#0055FF] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300"
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
