"use client";

import { FaInstagram, FaTiktok, FaLinkedin, FaTwitter, FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";

export default function AboutMeSection() {
  return (
    <section className="relative py-24 px-4 sm:px-8 lg:px-12">
      {/* Full width grid with only side gutters */}
      <div className="grid grid-cols-1 gap-12 md:grid-cols-3 w-full">
        {/* ===== Left: Video / Portrait Stage ===== */}
        <div className="w-full">
          <div className="relative aspect-[3/4] md:h-[540px] overflow-hidden rounded-3xl border border-border bg-gradient-to-b from-neutral-50 to-neutral-100">
            {/* Replace with your video/player */}
            <div className="absolute inset-0 grid place-items-center text-neutral-400">
              <span className="text-xs uppercase tracking-widest">Intro Reel</span>
            </div>

            {/* Minimal play control */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="absolute bottom-5 left-5 inline-flex items-center gap-3 rounded-full bg-black px-4 py-2 text-xs text-white"
              aria-label="Play video"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path
                  d="M8 5v14l11-7-11-7z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="currentColor"
                />
              </svg>
              <span>Play</span>
            </motion.button>
          </div>
        </div>

        {/* ===== Right: Content ===== */}
        <div className="md:col-span-2 flex flex-col justify-between gap-12 md:h-[540px]">
          {/* Headline */}
          <div>
            <h2 className="text-4xl md:text-5xl font-semibold leading-tight text-foreground">
              A bit more about me, the person behind the pixels.
            </h2>
          </div>

          {/* Copy rows */}
          <div className="md:ml-auto md:w-[92%]">
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
              <div>
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-widest text-neutral-700">
                  Personal
                </h3>
                <p className="text-[0.98rem] leading-relaxed text-neutral-600">
                  Placeholder for your personal background. Share your journey, interests beyond
                  design, and the principles that anchor your work and life.
                </p>
              </div>

              <div>
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-widest text-neutral-700">
                  Professional
                </h3>
                <p className="text-[0.98rem] leading-relaxed text-neutral-600">
                  Placeholder for your professional background. Mention the kinds of problems you
                  solve, industries you’ve touched, and the value clients feel when collaborating
                  with you.
                </p>
              </div>
            </div>

            {/* Slim divider + tiny meta row */}
            <div className="mt-10 flex items-center gap-4">
              <span className="h-px w-24 bg-border" />
              <p className="text-xs uppercase tracking-widest text-neutral-500">
                Currently open for one project
              </p>
            </div>
          </div>

          {/* Socials + Contact */}
          <div className="mt-4 flex flex-col gap-6 md:flex-row md:items-center md:justify-between md:ml-auto md:w-[92%]">
            {/* Socials */}
            <div className="flex items-center gap-5">
              {[
                { Icon: FaInstagram, label: "Instagram", href: "#" },
                { Icon: FaTiktok, label: "TikTok", href: "#" },
                { Icon: FaLinkedin, label: "LinkedIn", href: "#" },
                { Icon: FaTwitter, label: "Twitter", href: "#" },
              ].map(({ Icon, label, href }) => (
                <motion.a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="rounded-full p-2 text-foreground/60 transition-colors hover:text-foreground"
                  whileHover={{ y: -2 }}
                >
                  <Icon size={22} />
                </motion.a>
              ))}
            </div>

            {/* Contact button (flip + arrow nudge) */}
            <a
              href="https://calendar.app.google/1RTjShD5sgqBmm3K7"
              className="group relative flex h-14 w-56 items-center justify-center overflow-hidden rounded-xl bg-black pr-10 text-white"
              target="_blank"
              rel="noopener noreferrer"
            >
              <motion.div
                className="relative"
                whileHover={{ y: "-100%" }}
                transition={{ duration: 0.3 }}
              >
                <span className="block py-4">Contact Me</span>
                <span className="absolute left-0 top-full w-full py-4">Let's Talk!</span>
              </motion.div>
              <motion.span
                className="absolute right-4 top-1/2 -translate-y-1/2"
                whileHover={{ x: 4 }}
                transition={{ duration: 0.3 }}
              >
                <FaArrowRight size={18} />
              </motion.span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
