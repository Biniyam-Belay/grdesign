"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import useIsomorphicLayoutEffect from "@lib/useIsomorphicLayoutEffect";

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    id: "branding",
    icon: "🎨",
    title: "Brand Identity Design",
    description:
      "Logo design, brand guidelines, and complete visual identity systems that make you memorable.",
    features: ["Logo & Mark Design", "Brand Guidelines", "Color Palette", "Typography System"],
    deliveryTime: "5-7 days",
    popular: false,
  },
  {
    id: "ui-ux",
    icon: "📱",
    title: "UI/UX Design",
    description:
      "User-centered interfaces that convert visitors into customers and increase engagement.",
    features: ["User Research", "Wireframing", "UI Design", "Prototyping"],
    deliveryTime: "7-10 days",
    popular: true,
  },
  {
    id: "web-dev",
    icon: "💻",
    title: "Web Development",
    description:
      "Fast, responsive websites built with modern tech that rank well and convert visitors.",
    features: ["Responsive Design", "SEO Optimized", "Fast Loading", "CMS Integration"],
    deliveryTime: "10-14 days",
    popular: false,
  },
  {
    id: "social",
    icon: "📈",
    title: "Social Media Design",
    description:
      "Scroll-stopping social content and campaigns that build your audience and drive engagement.",
    features: ["Social Templates", "Campaign Design", "Content Strategy", "Brand Consistency"],
    deliveryTime: "3-5 days",
    popular: false,
  },
];

const process = [
  {
    step: "01",
    title: "Discovery Call",
    description: "We discuss your goals, target audience, and project requirements in detail.",
    duration: "30-60 min",
  },
  {
    step: "02",
    title: "Strategy & Planning",
    description: "I create a custom strategy and timeline tailored to your specific needs.",
    duration: "1-2 days",
  },
  {
    step: "03",
    title: "Design & Development",
    description: "I bring your vision to life with regular updates and feedback loops.",
    duration: "5-14 days",
  },
  {
    step: "04",
    title: "Launch & Support",
    description: "Final delivery with all files, plus 30 days of free support and revisions.",
    duration: "Ongoing",
  },
];

const ServicesAndProcessSection = () => {
  const rootRef = useRef<HTMLElement>(null!);

  useIsomorphicLayoutEffect(() => {
    if (!rootRef.current) return;
    const ctx = gsap.context(() => {
      // Set initial states to ensure cards are visible
      gsap.set(".service-card", { opacity: 1, y: 0 });
      gsap.set(".process-step", { opacity: 1, x: 0 });

      // Only animate if user prefers motion
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReduced) return;

      // Simple, reliable animations
      gsap.fromTo(
        ".service-card",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".services-grid",
            start: "top 85%",
            toggleActions: "play none none none",
          },
        },
      );

      gsap.fromTo(
        ".process-step",
        { opacity: 0, y: 15 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".process-timeline",
            start: "top 85%",
            toggleActions: "play none none none",
          },
        },
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="sticky top-0 z-10 bg-white py-24 md:py-32 px-6"
      style={{ marginTop: "-1px" }}
    >
      <div className="mx-auto w-full max-w-7xl">
        {/* Services Section */}
        <div className="mb-20">
          {/* Header - Minimal */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-neutral-100 text-neutral-600 px-4 py-2 rounded-full text-xs font-medium mb-6">
              <div className="w-1 h-1 bg-neutral-400 rounded-full"></div>
              Strategic Services
            </div>
            <h2 className="text-3xl md:text-4xl font-light text-neutral-900 mb-4">
              Services that
              <span className="font-medium"> deliver results</span>
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed">
              Comprehensive design and development solutions for ambitious brands.
            </p>
          </div>

          {/* Services Grid - Minimal */}
          <div className="services-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 px-6 md:px-0">
            {services.map((service) => (
              <div
                key={service.id}
                className="service-card relative bg-neutral-50 rounded-lg p-6 transition-all duration-200 hover:bg-neutral-100 max-w-sm mx-auto md:max-w-none"
                style={{ opacity: 1, transform: "translateY(0px)" }}
              >
                {service.popular && (
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                    <span className="bg-neutral-900 text-white px-3 py-1 rounded-full text-xs font-medium">
                      Popular
                    </span>
                  </div>
                )}

                <div className="text-center">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-3">{service.title}</h3>
                  <p className="text-neutral-600 text-sm mb-4 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Features - Left Aligned within Center Container */}
                  <ul className="text-xs text-neutral-500 mb-4 space-y-1.5 inline-block text-left">
                    {service.features.slice(0, 3).map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-1 h-1 bg-neutral-400 rounded-full flex-shrink-0"></span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Delivery Time - Minimal */}
                  <div className="border-t border-neutral-200 pt-4">
                    <div className="text-sm font-medium text-neutral-600">
                      <span className="text-neutral-500">Delivery:</span> {service.deliveryTime}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA for Services - Minimal */}
          <div className="text-center">
            <Link
              href="https://calendar.app.google/1RTjShD5sgqBmm3K7"
              className="inline-flex items-center gap-2 bg-neutral-900 text-white px-6 py-3 rounded-lg font-medium transition-all hover:bg-neutral-800"
              target="_blank"
              rel="noopener noreferrer"
            >
              Discuss Your Project
              <svg
                className="transition-transform group-hover:translate-x-1"
                width="14"
                height="14"
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
            <p className="text-xs text-neutral-500 mt-3">
              Free consultation • No commitment required
            </p>
          </div>
        </div>

        {/* Process Section */}
        <div>
          {/* Process Header - Minimal */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-neutral-100 text-neutral-600 px-4 py-2 rounded-full text-xs font-medium mb-6">
              <div className="w-1 h-1 bg-neutral-400 rounded-full"></div>
              Process
            </div>
            <h2 className="text-3xl md:text-4xl font-light text-neutral-900 mb-4">
              How we
              <span className="font-medium"> work together</span>
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed">
              A proven approach that ensures successful project outcomes.
            </p>
          </div>

          {/* Process Timeline - Horizontal with Connecting Line */}
          <div className="relative">
            {/* Connecting Line */}
            <div
              className="hidden lg:block absolute top-4 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-neutral-200 to-transparent"
              style={{ top: "16px" }}
            ></div>

            <div className="process-timeline grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {process.map((step) => (
                <div
                  key={step.step}
                  className="process-step relative"
                  style={{ opacity: 1, transform: "translateY(0px)" }}
                >
                  {/* Step Number Circle */}
                  <div className="relative z-10 w-8 h-8 border-2 border-neutral-900 bg-white text-neutral-900 rounded-full flex items-center justify-center text-sm font-bold mb-4 mx-auto">
                    {step.step}
                  </div>

                  {/* Content */}
                  <div className="text-center">
                    <h3 className="text-base font-semibold text-neutral-900 mb-2">{step.title}</h3>
                    <p className="text-neutral-600 text-sm mb-3 leading-relaxed">
                      {step.description}
                    </p>
                    <div className="text-xs text-neutral-500 bg-neutral-100 px-2 py-1 rounded-full inline-block">
                      {step.duration}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Process CTA - Minimal */}
          <div className="text-center mt-12">
            <div className="bg-neutral-900 rounded-xl p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-light text-white mb-4">Ready to start your project?</h3>
              <p className="text-neutral-300 mb-6">
                Schedule a consultation to discuss your requirements.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="https://calendar.app.google/1RTjShD5sgqBmm3K7"
                  className="inline-flex items-center justify-center gap-2 bg-white text-neutral-900 px-6 py-3 rounded-lg font-medium transition-all hover:shadow-lg"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Schedule Call
                </Link>
                <Link
                  href="/work"
                  className="inline-flex items-center justify-center gap-2 border border-neutral-700 text-neutral-300 px-6 py-3 rounded-lg font-medium transition-all hover:border-neutral-600"
                >
                  View Work
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesAndProcessSection;
