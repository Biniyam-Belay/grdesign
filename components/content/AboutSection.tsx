"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const services = [
  {
    num: "01",
    title: "Brand Strategy & Identity",
    description:
      "Designing logos, complete visual systems, and comprehensive brand guidelines that position you exactly where you need to be.",
    tags: ["Logos", "Guidelines", "Color", "Typography"],
  },
  {
    num: "02",
    title: "Social Media Architecture",
    description:
      "Creating scroll-stopping social content, managing campaigns, and designing templates to ensure absolute brand consistency and growth.",
    tags: ["Content", "Campaigns", "Templates", "Management"],
  },
  {
    num: "03",
    title: "UI/UX & Web Development",
    description:
      "Architecting user-centered interfaces and developing fast, responsive applications that convert visitors into lasting clients.",
    tags: ["Wireframing", "Websites", "Interaction", "SEO"],
  },
  {
    num: "04",
    title: "Editorial & Print Design",
    description:
      "Crafting tangible experiences through posters, decks, packaging, and marketing materials with unapologetic clarity.",
    tags: ["Posters", "Pitch Decks", "Print", "Packaging"],
  },
];

const process = [
  {
    step: "Alignment",
    desc: "A focused strategy session to unearth your goals and map out the exact requirements for market dominance.",
    time: "Day 1",
  },
  {
    step: "Concept",
    desc: "Developing the creative direction and visual architecture tailored exclusively to your brand positioning.",
    time: "Week 1",
  },
  {
    step: "Execution",
    desc: "Refining the chosen direction into a pixel-perfect, cohesive system with structured feedback loops.",
    time: "Week 2–3",
  },
  {
    step: "Delivery",
    desc: "Handing over complete source files, documentation, and providing priority support post-launch.",
    time: "Week 4",
  },
];

export default function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="services"
      className="bg-[#F5F5F0] text-[#0B132B] py-20 lg:py-32 px-4 sm:px-6 lg:px-12 w-full border-t border-[#0B132B]/8"
    >
      <div ref={ref} className="w-full max-w-8xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 mb-40">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-4 max-w-sm lg:sticky lg:top-48 self-start mb-12 lg:mb-0"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-[2px] bg-gradient-to-r from-[#0055FF] to-[#01BBFF]" />
              <span className="text-[12px] text-[#0B132B] uppercase tracking-[0.55em] font-black">
                Expertise
              </span>
            </div>

            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl font-light tracking-[-0.05em] leading-[1.05] text-[#0B132B] mb-6 sm:mb-8">
              Expertise <br />
              <span className="font-semibold">
                Distilled<span className="text-[#0055FF]">.</span>
              </span>
            </h2>
            <p className="text-[#0B132B]/60 font-light leading-relaxed text-base sm:text-lg mb-10 sm:mb-12">
              Every discipline required to launch, scale, and define your brand in the digital
              landscape. We execute with precision and intent.
            </p>
            <Link
              href="https://calendar.app.google/1RTjShD5sgqBmm3K7"
              className="inline-flex items-center gap-3 uppercase text-[10px] font-bold tracking-[0.25em] text-white bg-gradient-to-r from-[#0055FF] to-[#01BBFF] px-8 py-5 hover:shadow-[0_10px_30px_rgba(0,85,255,0.3)] transition-all duration-300"
              target="_blank"
              rel="noopener noreferrer"
            >
              Initiate Project
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>

          <div className="lg:col-span-8 flex flex-col w-full border-t border-[#0B132B]/8">
            {services.map((svc, i) => (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                key={svc.num}
                className="group flex flex-col md:flex-row gap-6 md:gap-12 py-10 md:py-16 border-b border-[#0B132B]/8 hover:bg-white/40 transition-colors px-6 -mx-6 md:px-8 md:-mx-8"
              >
                <div className="text-[#0B132B]/30 font-light text-xl md:text-2xl pt-1">
                  {svc.num}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl md:text-3xl font-medium tracking-tight mb-4 text-[#0B132B]">
                    {svc.title}
                  </h3>
                  <p className="text-[#0B132B]/60 font-light text-lg md:text-xl leading-relaxed mb-6 max-w-2xl">
                    {svc.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {svc.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0B132B]/60 bg-[#0B132B]/5 px-3 py-1.5 border border-[#0B132B]/10"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="w-full flex flex-col md:flex-row gap-16 lg:gap-32 pt-32 border-t border-[#0B132B]/8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="md:w-1/3"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-[2px] bg-[#FF0033]" />
              <span className="text-[12px] text-[#0B132B] uppercase tracking-[0.55em] font-black">
                Process
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-[-0.05em] leading-[1.05] text-[#0B132B] mb-6 sm:mb-8">
              The <br />
              <span className="font-semibold">
                Framework<span className="text-[#FF0033]">.</span>
              </span>
            </h2>
            <p className="text-[#0B132B]/60 font-light text-base sm:text-lg md:text-xl max-w-sm mb-12 md:mb-0">
              A battle-tested methodology designed for speed, clarity, and uncompromising
              excellence.
            </p>
          </motion.div>

          <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-12 sm:gap-16 pt-4 lg:pt-0">
            {process.map((step, i) => (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 + i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                key={i}
                className="flex flex-col border-l border-[#0B132B]/10 pl-6 lg:pl-8 group hover:border-[#0055FF]/50 transition-colors duration-300"
              >
                <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#0B132B]/40 mb-4 group-hover:text-[#0055FF] transition-colors">
                  {step.time}
                </span>
                <h4 className="text-2xl md:text-3xl font-medium tracking-tight mb-4 text-[#0B132B]">
                  {step.step}
                </h4>
                <p className="text-[#0B132B]/60 font-light leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
