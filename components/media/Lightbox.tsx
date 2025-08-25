"use client";
import { useEffect, useRef } from "react";

type LightboxProps = {
  src: string;
  alt: string;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
};

export default function Lightbox({ src, alt, onClose, onPrev, onNext }: LightboxProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
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

  return (
    <div
      ref={dialogRef}
      tabIndex={-1}
      aria-modal="true"
      role="dialog"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
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
        <img src={src} alt={alt} className="max-h-[90vh] w-auto rounded-md shadow-xl" />
      </div>
    </div>
  );
}
