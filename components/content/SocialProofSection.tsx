"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { createSupabaseClient } from "@/lib/supabase/client";

interface Testimonial {
  content: string;
  name: string;
  role: string;
  company: string;
  result: string;
}

const fallbackTestimonials: Testimonial[] = [
  {
    content:
      "They completely rearchitected how we communicate with our market. The results were immediate and undeniable.",
    name: "Sarah Jenkins",
    role: "Marketing Director",
    company: "Apex Global",
    result: "2X Lead Conversion",
  },
  {
    content:
      "The level of strategic clarity and visual precision was beyond comparison. True creative partners.",
    name: "Marcus Thorne",
    role: "Founder & CEO",
    company: "Nova Tech",
    result: "Successful $5M Raise",
  },
  {
    content:
      "Working with this team felt like having an unfair advantage. Every deliverable was sharper and faster.",
    name: "Lena Abera",
    role: "Head of Brand",
    company: "Zemen Capital",
    result: "3X Social Growth",
  },
  {
    content:
      "From the first call to final handoff, the process was flawless. They understood constraints without compromising ambition.",
    name: "Daniel Mekonnen",
    role: "Creative Director",
    company: "Orbit Studio",
    result: "40% Revenue Lift",
  },
  {
    content:
      "Their ability to transform complex ideas into simple, beautiful experiences is unmatched in the industry.",
    name: "Emma Wilson",
    role: "Product Lead",
    company: "Flow State",
    result: "Top 10 App Store",
  },
  {
    content:
      "We saw an immediate shift in brand perception after launching the new identity. A masterclass in design.",
    name: "James Chen",
    role: "CMO",
    company: "Lumina",
    result: "Brand of the Year",
  },
];

const getFontSize = (text: string) => {
  const charCount = text.length;
  if (charCount < 80) return "text-2xl sm:text-3xl md:text-4xl lg:text-[42px] xl:text-[48px]";
  if (charCount < 120) return "text-xl sm:text-2xl md:text-3xl lg:text-[32px] xl:text-[38px]";
  if (charCount < 160) return "text-lg sm:text-xl md:text-2xl lg:text-[26px] xl:text-[30px]";
  return "text-base sm:text-lg md:text-xl lg:text-[22px] xl:text-[24px]";
};

export default function SocialProofSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [activePairIdx, setActivePairIdx] = useState(0); // Index for the pair (0, 1, 2...)
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    const fetchTestimonials = async () => {
      const supabase = createSupabaseClient();
      const { data } = await supabase.from("testimonials").select("*");
      if (data && data.length > 0) {
        setTestimonials(data);
      } else {
        setTestimonials(fallbackTestimonials);
      }
    };
    fetchTestimonials();
  }, []);

  // Calculate pairs (e.g., [T0, T1], [T2, T3], [T4, T5])
  const pairs: Testimonial[][] = [];
  for (let i = 0; i < testimonials.length; i += 2) {
    const pair = testimonials.slice(i, i + 2);
    // If odd number, we could potentially loop or just keep as single
    if (pair.length > 0) pairs.push(pair);
  }

  useEffect(() => {
    if (pairs.length <= 1) return;
    const interval = setInterval(() => {
      setActivePairIdx((prev) => (prev + 1) % pairs.length);
    }, 8000); // 8 seconds per pair
    return () => clearInterval(interval);
  }, [pairs.length]);

  const currentPair = pairs[activePairIdx] || [];

  return (
    <section className="w-full bg-[#F5F5F0] px-4 sm:px-6 lg:px-12 pt-20 lg:pt-28 pb-32 lg:pb-48 border-t border-[#0B132B]/8">
      <div ref={ref} className="w-full max-w-8xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-12">
          {/* LEFT: Intro Typography (4 cols) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-4 flex flex-col pt-6"
          >
            <div className="flex flex-col gap-6 lg:sticky lg:top-48">
              <div className="flex items-center gap-4">
                <div className="w-12 h-[2px] bg-gradient-to-r from-[#0055FF] to-[#01BBFF]" />
                <span className="text-[12px] text-[#0B132B] uppercase tracking-[0.55em] font-black">
                  Testimonials
                </span>
              </div>

              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl font-light tracking-[-0.05em] leading-[1.05] text-[#0B132B]">
                Partnerships <br />
                <span className="font-semibold text-[#0B132B]">
                  Built in Truth<span className="text-[#0055FF]">.</span>
                </span>
              </h2>

              <p className="text-base lg:text-lg font-light text-[#0B132B]/50 leading-relaxed max-w-sm mt-4">
                Strategic design is measured by its capacity to drive objective growth. Discover the
                direct outcomes of our creative partnerships as told by the leaders who trust us.
              </p>

              {/* Progress Tracker */}
              <div className="flex flex-col gap-6 mt-14">
                <div className="w-full h-[1.5px] bg-[#0B132B]/8 relative overflow-hidden">
                  <motion.div
                    key={activePairIdx}
                    initial={{ x: "-100%" }}
                    animate={{ x: "0%" }}
                    transition={{ duration: 8, ease: "linear" }}
                    className="absolute inset-0 h-full bg-gradient-to-r from-[#0055FF] to-[#01BBFF]"
                  />
                </div>
                <div className="flex justify-end items-center text-[10px] uppercase tracking-[0.3em] font-bold text-[#0B132B]/25">
                  <span>
                    {String(activePairIdx + 1).padStart(2, "0")}&nbsp;/&nbsp;
                    {String(pairs.length).padStart(2, "0")}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT: Unified Row Slider (8 cols) */}
          <div className="lg:col-span-8 relative md:h-[560px] md:overflow-hidden mt-8 lg:mt-0">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={activePairIdx}
                // UNIFIED ROW MOTION (S-Curve: Slow-Fast-Slow)
                initial={{ x: "105%" }}
                animate={{ x: 0 }}
                exit={{ x: "-105%" }}
                transition={{
                  duration: 1.6,
                  ease: [0.76, 0, 0.24, 1],
                }}
                className="md:absolute md:inset-0 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10"
              >
                {currentPair.map((t, i) => (
                  <div
                    key={`${activePairIdx}-${i}`}
                    className="flex flex-col justify-between p-8 sm:p-10 lg:p-14 border border-[#0B132B]/8 bg-white/40 shadow-[0_45px_100px_-30px_rgba(0,0,0,0.05)] group relative overflow-hidden"
                  >
                    {/* Corner Glow */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[#0055FF]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-[40px] z-0" />

                    <div className="flex flex-col gap-6 relative z-10">
                      <span className="text-[#FF0033] text-6xl font-serif leading-none select-none opacity-40">
                        “
                      </span>
                      <h3
                        className={`${getFontSize(t.content)} font-medium leading-[1.25] tracking-[-0.04em] text-[#0B132B] md:max-h-[320px] md:overflow-hidden`}
                      >
                        {t.content}
                      </h3>
                    </div>

                    <div className="flex flex-col gap-6 pt-10 border-t border-[#0B132B]/6 relative z-10">
                      <div className="flex flex-col gap-1">
                        <span className="text-base font-bold uppercase tracking-[0.1em] text-[#0B132B]">
                          {t.name}
                        </span>
                        <span className="text-[11px] font-light text-[#0B132B]/45 uppercase tracking-[0.15em]">
                          {t.role} / {t.company}
                        </span>
                      </div>

                      {t.result && (
                        <div className="self-start px-4 py-1.5 bg-gradient-to-r from-[#0055FF] to-[#01BBFF] shadow-[0_5px_15px_rgba(0,85,255,0.2)]">
                          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white">
                            {t.result}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
