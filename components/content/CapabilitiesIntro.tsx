"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function CapabilitiesIntro() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="w-full bg-[#F5F5F0] px-4 sm:px-6 lg:px-12 py-10 sm:py-14 lg:py-20 mb-4">
      <div
        ref={ref}
        className="mx-auto max-w-8xl w-full flex flex-col lg:flex-row gap-10 lg:gap-24 items-start"
      >
        {/* LEFT — Massive 1-Paragraph Intro */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="lg:w-[65%]"
        >
          <h2 className="text-[2rem] sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-medium text-[#0B132B]/90 tracking-[-0.03em] leading-[1.15]">
            We architect complete <span className="font-bold">visual systems</span>,{" "}
            <span className="font-bold">digital products</span>, and{" "}
            <span className="font-bold">brand narratives</span> for those who{" "}
            <span className="text-[#FF0033] font-bold">refuse to be ordinary.</span>
          </h2>
        </motion.div>

        {/* RIGHT — Small Supporting Paragraph (Under 200 chars) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
          className="lg:w-[35%] flex flex-col lg:pt-3"
        >
          <div className="flex items-center gap-3 mb-8">
            <span className="w-2 h-2 rounded-full bg-[#FF0033]" />
            <span className="text-[11px] uppercase tracking-[0.3em] font-bold text-[#FF0033]">
              Capabilities
            </span>
          </div>
          <p className="text-lg lg:text-xl font-light text-[#0B132B]/60 leading-relaxed max-w-sm">
            Merging strategic rigor with relentless art direction. We deliver cohesive branding and
            high-performance digital experiences that command attention.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
