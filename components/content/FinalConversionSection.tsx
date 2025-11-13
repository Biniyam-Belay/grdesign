"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const guarantees = [
  {
    title: "Performance Guarantee",
    description: "Strategic outcomes delivered within agreed timeframes",
    icon: "—",
  },
  {
    title: "Unlimited Refinements",
    description: "Collaborative process until excellence is achieved",
    icon: "—",
  },
  {
    title: "Strategic Partnership",
    description: "Ongoing support and consultation included",
    icon: "—",
  },
];

const processSteps = [
  {
    number: "01",
    title: "Strategic Discovery",
    description: "Comprehensive analysis of objectives and market position",
  },
  {
    number: "02",
    title: "Solution Architecture",
    description: "Custom strategy development and execution planning",
  },
  {
    number: "03",
    title: "Excellence Delivery",
    description: "Iterative execution with continuous optimization",
  },
  {
    number: "04",
    title: "Performance Validation",
    description: "Results measurement and strategic refinement",
  },
];

export default function FinalConversionSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(".process-step", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".process-grid",
          start: "top 80%",
        },
      });

      gsap.from(".guarantee-card", {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".guarantees-grid",
          start: "top 85%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 md:py-32 bg-neutral-50">
      <div className="px-4 sm:px-8 lg:px-12">
        {/* Main CTA Section */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-bold text-neutral-900 mb-6">
            Partner with
            <span className="text-neutral-600"> Strategic Excellence</span>
          </h2>
          <p className="text-xl text-neutral-600 mx-auto mb-12 font-light leading-relaxed">
            Exceptional organizations recognize the value of strategic design partnerships.
            Experience the difference that meticulous attention to detail and performance-driven
            execution makes.
          </p>

          {/* Primary CTA */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Link
              href="https://calendar.app.google/1RTjShD5sgqBmm3K7"
              className="group inline-flex items-center justify-center gap-3 bg-neutral-900 text-white px-10 py-5 rounded-lg text-lg font-medium transition-all hover:bg-neutral-800 hover:shadow-lg"
              target="_blank"
              rel="noopener noreferrer"
            >
              Initiate Strategic Discussion
              <svg
                className="transition-transform group-hover:translate-x-1"
                width="18"
                height="18"
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
              className="inline-flex items-center justify-center gap-2 border border-neutral-300 text-neutral-700 px-10 py-5 rounded-lg text-lg font-medium transition-all hover:border-neutral-400 bg-white"
            >
              Review Strategic Portfolio
            </Link>
          </div>

          {/* Urgency Element - Subtle */}
          <div className="inline-flex items-center gap-2 border border-neutral-200 bg-white text-neutral-700 px-6 py-3 rounded-full text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Limited engagement capacity — Strategic partnerships prioritized</span>
          </div>
        </div>

        {/* Strategic Process */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 border border-neutral-200 bg-white text-neutral-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              Strategic Methodology
            </div>
            <h3 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Excellence Through Process
            </h3>
            <p className="text-lg text-neutral-600 mx-auto font-light">
              Every strategic engagement follows a proven methodology designed to deliver
              exceptional outcomes and sustainable value.
            </p>
          </div>

          <div className="process-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step) => (
              <div key={step.number} className="process-step text-center">
                <div className="w-16 h-16 bg-neutral-900 text-white rounded-lg flex items-center justify-center text-lg font-bold mb-6 mx-auto">
                  {step.number}
                </div>
                <h4 className="text-xl font-semibold text-neutral-900 mb-3">{step.title}</h4>
                <p className="text-neutral-600 font-light leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Guarantees */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Strategic Assurances
            </h3>
            <p className="text-lg text-neutral-600 mx-auto font-light">
              Our commitment to excellence extends beyond delivery to ensure sustainable strategic
              value.
            </p>
          </div>

          <div className="guarantees-grid grid grid-cols-1 md:grid-cols-3 gap-8">
            {guarantees.map((guarantee) => (
              <div
                key={guarantee.title}
                className="guarantee-card text-center p-8 bg-white border border-neutral-200 rounded-lg hover:shadow-lg transition-all duration-300"
              >
                <div className="text-2xl font-light text-neutral-400 mb-4">{guarantee.icon}</div>
                <h4 className="text-xl font-semibold text-neutral-900 mb-3">{guarantee.title}</h4>
                <p className="text-neutral-600 font-light leading-relaxed">
                  {guarantee.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Final Contact Section */}
        <div className="text-center bg-white border border-neutral-200 rounded-lg p-12 md:p-16">
          <h3 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">
            Ready to Elevate Your Strategic Position?
          </h3>
          <p className="text-lg text-neutral-600 mb-10 mx-auto font-light leading-relaxed">
            Strategic partnerships begin with meaningful conversations. Connect with us to explore
            how we can contribute to your organizational excellence.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              href="https://calendar.app.google/1RTjShD5sgqBmm3K7"
              className="group inline-flex items-center justify-center gap-3 bg-neutral-900 text-white px-8 py-4 rounded-lg font-medium transition-all hover:bg-neutral-800"
              target="_blank"
              rel="noopener noreferrer"
            >
              Schedule Strategic Call
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
              href="mailto:biniyam.be.go@gmail.com"
              className="inline-flex items-center justify-center gap-2 border border-neutral-300 text-neutral-700 px-8 py-4 rounded-lg font-medium transition-all hover:border-neutral-400"
            >
              Direct Communication
            </Link>
          </div>

          <div className="text-sm text-neutral-500">
            Based in Addis Ababa, Ethiopia — Strategic partnerships worldwide
          </div>
        </div>
      </div>
    </section>
  );
}
