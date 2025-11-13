"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Startup Founder",
    company: "TechStart",
    image: "/assets/testimonials/sarah.jpg", // You'll need to add these
    content:
      "Biniyam transformed our startup's brand from generic to premium. We saw a 340% increase in lead generation and closed 2 major clients within a month of launch.",
    result: "340% increase in leads",
    project: "Complete brand identity + landing page",
    rating: 5,
  },
  {
    id: 2,
    name: "Michael Rodriguez",
    role: "Marketing Director",
    company: "AWiB Ethiopia",
    image: "/assets/testimonials/michael.jpg",
    content:
      "The social media designs Biniyam created increased our engagement by 280% and helped us reach 15,000+ young women across Ethiopia. Exceptional quality and fast delivery.",
    result: "280% engagement boost",
    project: "Social media design system",
    rating: 5,
  },
  {
    id: 3,
    name: "Dr. Alemayehu Teshome",
    role: "Director",
    company: "AAU Alumni Office",
    image: "/assets/testimonials/alemayehu.jpg",
    content:
      "Biniyam delivered our first-ever homecoming event branding on time and budget. The merchandise sold out completely and alumni loved the professional look.",
    result: "100% merchandise sold out",
    project: "Event branding & merchandise",
    rating: 5,
  },
];

const metrics = [
  { number: "15+", label: "Happy Clients", icon: "😊" },
  { number: "32", label: "Projects Delivered", icon: "🚀" },
  { number: "280%", label: "Avg. Engagement Boost", icon: "📈" },
  { number: "7-14", label: "Days Delivery", icon: "⚡" },
];

const clientLogos = [
  { name: "AWiB Ethiopia", logo: "/assets/clients/awib.png" },
  { name: "AAU", logo: "/assets/clients/aau.png" },
  { name: "Sirtona Agency", logo: "/assets/clients/sirtona.png" },
  { name: "Biruh Tutors", logo: "/assets/clients/biruh.png" },
  { name: "Sage Barbershop", logo: "/assets/clients/sage.png" },
];

export default function SocialProofSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [counts, setCounts] = useState({
    clients: 0,
    projects: 0,
    engagement: 0,
    delivery: 0,
  });

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
        delivery: Math.floor(14 * easeOut),
      });

      if (currentStep >= steps) {
        clearInterval(interval);
        // Set final values
        setCounts({
          clients: 15,
          projects: 32,
          engagement: 280,
          delivery: 14,
        });
      }
    }, stepDuration);
  };

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

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

          {/* Right Column: Metrics Grid */}
          <div className="metrics-grid grid grid-cols-2 lg:grid-cols-2 gap-4 lg:h-full">
            {metrics.map((metric) => {
              // Map metric to count value
              const getCountValue = () => {
                if (metric.label === "Happy Clients") return `${counts.clients}+`;
                if (metric.label === "Projects Delivered") return counts.projects;
                if (metric.label === "Avg. Engagement Boost") return `${counts.engagement}%`;
                if (metric.label === "Days Delivery") return `7-${counts.delivery}`;
                return metric.number;
              };

              return (
                <motion.div
                  key={metric.label}
                  className="metric-card group relative overflow-hidden bg-white border border-neutral-200 rounded-xl p-4 lg:p-6 hover:border-neutral-900 transition-all duration-300 flex flex-col items-center justify-center"
                  initial={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -2, transition: { duration: 0.2 } }}
                >
                  {/* Subtle gradient background on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-neutral-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Content */}
                  <div className="relative z-10 text-center">
                    <div className="text-2xl lg:text-4xl font-bold text-neutral-900 mb-1 lg:mb-3 tracking-tight">
                      {hasAnimated ? getCountValue() : "0"}
                    </div>
                    <div className="text-[10px] lg:text-xs text-neutral-600 font-medium uppercase tracking-wider">
                      {metric.label}
                    </div>
                  </div>

                  {/* Minimal bottom accent line */}
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neutral-900 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </motion.div>
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
                  className="flex-shrink-0 text-center min-w-[120px] group-hover:[animation-play-state:paused]"
                >
                  <div className="font-serif text-xl font-medium text-neutral-400 tracking-tight transition-colors duration-300 hover:text-neutral-900">
                    {client.name.split(" ")[0]}
                  </div>
                  {client.name.split(" ")[1] && (
                    <div className="text-xs text-neutral-300 font-light tracking-wider uppercase">
                      {client.name.split(" ")[1]}
                    </div>
                  )}
                </div>
              ))}

              {/* Duplicate set for seamless loop */}
              {clientLogos.map((client, index) => (
                <div
                  key={`logo-2-${index}`}
                  className="flex-shrink-0 text-center min-w-[120px] group-hover:[animation-play-state:paused]"
                >
                  <div className="font-serif text-xl font-medium text-neutral-400 tracking-tight transition-colors duration-300 hover:text-neutral-900">
                    {client.name.split(" ")[0]}
                  </div>
                  {client.name.split(" ")[1] && (
                    <div className="text-xs text-neutral-300 font-light tracking-wider uppercase">
                      {client.name.split(" ")[1]}
                    </div>
                  )}
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
