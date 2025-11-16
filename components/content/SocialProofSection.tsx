"use client";

import { useEffect, useRef, useState } from "react";
// Note: framer-motion is imported elsewhere for potential future animation; currently unused.
import { Star } from "lucide-react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HappyClientsIcon from "./icons/HappyClientsIcon";
import ProjectsDeliveredIcon from "./icons/ProjectsDeliveredIcon";
import EngagementBoostIcon from "./icons/EngagementBoostIcon";
import { createSupabaseClient } from "@/lib/supabase/client";

import { Testimonial } from "@/lib/types";
gsap.registerPlugin(ScrollTrigger);

const metrics = [
  {
    number: "15+",
    label: "Happy Clients",
    icon: <HappyClientsIcon />,
  },
  {
    number: "32",
    label: "Projects Delivered",
    icon: <ProjectsDeliveredIcon />,
  },
  {
    number: "280%",
    label: "Avg. Engagement Boost",
    icon: <EngagementBoostIcon />,
  },
];

interface ClientLogo {
  name: string;
  url: string;
}

export default function SocialProofSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [clientLogos, setClientLogos] = useState<ClientLogo[]>([]);
  const [counts, setCounts] = useState({
    clients: 0,
    projects: 0,
    engagement: 0,
  });

  // Fetch data from Supabase
  useEffect(() => {
    const supabase = createSupabaseClient();

    const fetchClientLogos = async () => {
      try {
        const { data: files, error } = await supabase.storage.from("works").list("", {
          limit: 100,
          sortBy: { column: "name", order: "asc" },
        });
        if (error) throw error;

        const logos: ClientLogo[] = files
          .filter(
            (file: { name: string }) =>
              file.name.toLowerCase().startsWith("client-logo") &&
              file.name.match(/\.(jpg|jpeg|png|svg|webp)$/i),
          )
          .map((file: { name: string }) => {
            const { data } = supabase.storage.from("works").getPublicUrl(file.name);
            const name =
              file.name
                .replace(/^client-logo[-_]?/i, "")
                .replace(/\.(jpg|jpeg|png|svg|webp)$/i, "")
                .replace(/[-_]/g, " ")
                .split(" ")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ") || "Client";
            return { name, url: data.publicUrl };
          });
        setClientLogos(logos);
      } catch (error) {
        console.error("Error loading client logos:", error);
      }
    };

    const fetchTestimonials = async () => {
      try {
        const { data, error } = await supabase
          .from("testimonials")
          .select("*")
          .order("created_at", { ascending: false });
        if (error) throw error;
        setTestimonials(data || []);
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClientLogos();
    fetchTestimonials();
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Set initial states to ensure cards are visible
      gsap.set(".metric-card", { opacity: 1, y: 0 });
      gsap.set(".testimonials-container", { opacity: 1, y: 0 });

      // Only animate if user prefers motion
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReduced) return;

      // Animate metrics on scroll with better performance
      gsap.fromTo(
        ".metric-card",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".metrics-grid",
            start: "top 85%",
            toggleActions: "play none none none",
            onEnter: () => {
              if (!hasAnimated) {
                setHasAnimated(true);
                animateCounts();
              }
            },
          },
        },
      );

      // Animate testimonials with simpler approach
      gsap.fromTo(
        ".testimonials-container",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".testimonials-container",
            start: "top 80%",
            toggleActions: "play none none none",
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [hasAnimated]);

  // Number counting animation
  const animateCounts = () => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      // Easing function for smooth deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setCounts({
        clients: Math.floor(15 * easeOut),
        projects: Math.floor(32 * easeOut),
        engagement: Math.floor(280 * easeOut),
      });

      if (currentStep >= steps) {
        clearInterval(interval);
        // Set final values
        setCounts({
          clients: 15,
          projects: 32,
          engagement: 280,
        });
      }
    }, stepDuration);
  };

  // Auto-rotate testimonials
  useEffect(() => {
    if (testimonials.length > 1) {
      const interval = setInterval(() => {
        setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [testimonials]);

  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-white px-6">
      <div className="mx-auto w-full max-w-7xl">
        {/* Section Header - Minimal & Clean */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-neutral-100 text-neutral-600 px-4 py-2 rounded-full text-xs font-medium mb-6">
            <div className="w-1 h-1 bg-neutral-400 rounded-full"></div>
            Performance Record
          </div>

          <h2 className="text-3xl md:text-4xl font-light text-neutral-900 mb-4 leading-tight">
            Trusted by
            <span className="font-medium"> exceptional brands</span>
          </h2>

          <p className="text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            Strategic partnerships that deliver measurable results.
          </p>
        </div>

        {/* Two Column Layout: Testimonial + Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Left Column: Testimonial */}
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[480px]">
              <p>Loading testimonials...</p>
            </div>
          ) : testimonials.length > 0 ? (
            <div className="testimonials-container" style={{ opacity: 1 }}>
              <div className="bg-neutral-50 rounded-xl p-8 h-full flex flex-col justify-center min-h-[480px]">
                {/* Rating with Star Icons */}
                <div className="flex justify-center lg:justify-start mb-6">
                  <div className="flex items-center gap-0.5">
                    {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-neutral-900 text-neutral-900" />
                    ))}
                  </div>
                </div>

                {/* Quote */}
                <blockquote className="text-base md:text-lg text-neutral-700 mb-8 leading-relaxed text-center lg:text-left">
                  "{testimonials[activeTestimonial].content}"
                </blockquote>

                {/* Author & Results */}
                <div className="flex flex-col gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-neutral-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-neutral-700 font-medium text-sm">
                        {testimonials[activeTestimonial].name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-neutral-900 text-sm">
                        {testimonials[activeTestimonial].name}
                      </div>
                      <div className="text-xs text-neutral-500">
                        {testimonials[activeTestimonial].role},{" "}
                        {testimonials[activeTestimonial].company}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-neutral-200 rounded-lg px-4 py-2 self-start">
                    <div className="text-neutral-800 font-medium text-sm">
                      {testimonials[activeTestimonial].result}
                    </div>
                  </div>
                </div>

                <div className="text-xs text-neutral-500 mb-6 text-center lg:text-left">
                  {testimonials[activeTestimonial].project}
                </div>

                {/* Navigation */}
                <div className="flex justify-center lg:justify-start gap-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveTestimonial(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === activeTestimonial
                          ? "bg-neutral-900 w-6"
                          : "bg-neutral-300 hover:bg-neutral-400"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center min-h-[480px]">
              <p>No testimonials found.</p>
            </div>
          )}

          {/* Right Column: Metrics Grid */}
          <div className="metrics-grid grid grid-cols-2 grid-rows-2 gap-4 lg:h-full">
            {metrics.map((metric, index) => {
              // Map metric to count value
              const getCountValue = () => {
                if (metric.label === "Happy Clients") return `${counts.clients}+`;
                if (metric.label === "Projects Delivered") return counts.projects;
                if (metric.label === "Avg. Engagement Boost") return `${counts.engagement}%`;
                return metric.number;
              };

              return (
                <div
                  key={metric.label}
                  className={`metric-card bg-neutral-50/50 rounded-2xl p-6 flex items-center gap-4 group ${
                    index === 2 ? "col-span-2" : ""
                  }`}
                >
                  <div className="transform transition-transform duration-300 group-hover:scale-110">
                    {metric.icon}
                  </div>
                  <div>
                    <div className="text-3xl font-semibold text-neutral-900 tracking-tight">
                      {hasAnimated ? getCountValue() : "0"}
                    </div>
                    <div className="text-sm text-neutral-600">{metric.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Client Logos - Infinite Scroll */}
        <div className="text-center mt-12 overflow-hidden">
          <div className="text-sm font-medium text-neutral-400 mb-8 tracking-wide uppercase">
            Trusted by
          </div>

          <div className="relative w-full">
            {/* Gradient fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

            {/* Scrolling container */}
            <div className="flex gap-16 animate-scroll group">
              {/* First set of logos */}
              {clientLogos.map((client, index) => (
                <div
                  key={`logo-1-${index}`}
                  className="flex-shrink-0 flex items-center justify-center min-w-[140px] h-12 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                >
                  <Image
                    src={client.url}
                    alt={client.name}
                    width={140}
                    height={48}
                    className="object-contain w-auto h-full"
                  />
                </div>
              ))}

              {/* Duplicate set for seamless loop */}
              {clientLogos.map((client, index) => (
                <div
                  key={`logo-2-${index}`}
                  className="flex-shrink-0 flex items-center justify-center min-w-[140px] h-12 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                >
                  <Image
                    src={client.url}
                    alt={client.name}
                    width={140}
                    height={48}
                    className="object-contain w-auto h-full"
                  />
                </div>
              ))}
            </div>
          </div>

          <style jsx>{`
            @keyframes scroll {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(-50%);
              }
            }

            .animate-scroll {
              animation: scroll 30s linear infinite;
            }

            .animate-scroll:hover {
              animation-play-state: paused;
            }
          `}</style>
        </div>
      </div>
    </section>
  );
}
