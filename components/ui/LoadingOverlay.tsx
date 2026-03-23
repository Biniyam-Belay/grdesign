"use client";

import { motion } from "framer-motion";

export default function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-[9999] bg-[#0B132B] flex flex-col items-center justify-center overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-[50vh] h-[50vh] bg-[#FF0033]/10 blur-[120px] rounded-full pointer-events-none animate-pulse" />
      <div
        className="absolute bottom-1/4 right-1/4 w-[50vh] h-[50vh] bg-[#0055FF]/10 blur-[120px] rounded-full pointer-events-none animate-pulse"
        style={{ animationDelay: "1s" }}
      />

      {/* Main Core Content */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Brand Reveal */}
        <div className="flex items-baseline gap-0.5 overflow-hidden">
          <motion.span
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="text-white font-bold text-4xl md:text-5xl tracking-tight"
          >
            Ilaala
          </motion.span>
          <motion.span
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.76, 0, 0.24, 1] }}
            className="text-[#FF0033] text-4xl md:text-5xl font-bold"
          >
            .Studio
          </motion.span>
        </div>

        {/* Loading Progress Bar Indicator */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative w-48 md:w-64 h-[1px] bg-white/10 overflow-hidden"
        >
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              repeat: Infinity,
              duration: 1.2,
              ease: "easeInOut",
            }}
            className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-[#FF0033] to-transparent shadow-[0_0_15px_rgba(255,0,51,0.8)]"
          />
        </motion.div>

        {/* Status Text */}
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-[9px] uppercase tracking-[0.4em] font-bold text-white/30"
        >
          Authenticating Resources
        </motion.span>
      </div>
    </div>
  );
}
