"use client";
import { useEffect, useRef } from "react";
import { initGSAP } from "@lib/gsap";
import { useReducedMotion } from "@lib/hooks/useReducedMotion";

type LightboxProps = {
  src: string;
  alt: string;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
};

export default function Lightbox({ src, alt, onClose, onPrev, onNext }: LightboxProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev?.();
      if (e.key === "ArrowRight") onNext?.();
    };
    window.addEventListener("keydown", onKey);
    dialogRef.current?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onPrev, onNext]);

  useEffect(() => {
    if (reduced) return;
    const gsap = initGSAP();
    if (dialogRef.current && contentRef.current) {
      gsap.fromTo(
        dialogRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.35, ease: "power2.out" },
      );
      gsap.fromTo(
        contentRef.current,
        { y: 20, scale: 0.96, opacity: 0 },
        { y: 0, scale: 1, opacity: 1, duration: 0.45, ease: "power3.out" },
      );
    }
  }, [reduced]);

  return (
    <div
      ref={dialogRef}
      tabIndex={-1}
      aria-modal="true"
      role="dialog"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-[2px] p-4"
      onClick={onClose}
    >
      <div
        ref={contentRef}
        className="relative max-h-[90vh] w-auto max-w-[90vw]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close lightbox"
          className="absolute -top-10 right-0 rounded-md bg-white/90 px-3 py-1 text-sm text-neutral-800 shadow hover:bg-white"
        >
          Close
        </button>
        {/* Prev */}
        {onPrev && (
          <button
            onClick={onPrev}
            aria-label="Previous image"
            className="absolute left-[-48px] top-1/2 -translate-y-1/2 rounded-md bg-white/90 px-3 py-1 text-sm text-neutral-800 shadow hover:bg-white"
          >
            ←
          </button>
        )}
        {/* Next */}
        {onNext && (
          <button
            onClick={onNext}
            aria-label="Next image"
            className="absolute right-[-48px] top-1/2 -translate-y-1/2 rounded-md bg-white/90 px-3 py-1 text-sm text-neutral-800 shadow hover:bg-white"
          >
            →
          </button>
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="max-h-[90vh] w-auto rounded-md shadow-xl transition-transform duration-500"
        />
      </div>
    </div>
  );
}
