"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

interface ImageCarouselProps {
  images: Array<{ src: string; alt: string }>;
  interval?: number; // Time between slides in ms
  className?: string;
  thumbImage?: string; // Fallback image if no gallery images
  thumbAlt?: string; // Alt text for the fallback image
  showIndicators?: boolean; // Show pagination dots
}

export default function ImageCarousel({
  images,
  interval = 5000,
  className = "",
  thumbImage,
  thumbAlt = "Project thumbnail",
  showIndicators = true,
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0); // logical index (0..displayImages.length-1)
  const trackRef = useRef<HTMLDivElement | null>(null);
  const transitioningRef = useRef(false);

  // Use gallery images if available, otherwise use the thumb
  const displayImages =
    images && images.length > 0 ? images : thumbImage ? [{ src: thumbImage, alt: thumbAlt }] : [];

  // Don't rotate if there's only one image
  const shouldAutoRotate = displayImages.length > 1;

  // We create a seamless loop by appending a clone of the first slide at the end.
  // When we move from last logical slide to the clone, we then snap back to the real first slide without animation.
  const loopImages = shouldAutoRotate ? [...displayImages, displayImages[0]] : displayImages;

  useEffect(() => {
    if (!shouldAutoRotate) return;
    const id = setInterval(() => {
      transitioningRef.current = true;
      setCurrentIndex((prev) => prev + 1);
    }, interval);
    return () => clearInterval(id);
  }, [interval, shouldAutoRotate]);

  // Handle the jump from clone back to real first slide
  useEffect(() => {
    const track = trackRef.current;
    if (!track || !shouldAutoRotate) return;
    const total = displayImages.length;

    if (currentIndex === total) {
      // We are on the clone (last element); after transition ends, snap back
      const handle = () => {
        // Disable transition, snap to 0, then re-enable
        track.style.transition = "none";
        track.style.transform = `translateX(0%)`;
        // Force reflow
        void track.offsetWidth;
        transitioningRef.current = false;
        setCurrentIndex(0);
      };
      // Wait for the CSS transition to finish (~same duration we set below)
      const timeout = setTimeout(handle, 700);
      return () => clearTimeout(timeout);
    } else {
      // Normal slide movement
      const pct = -(currentIndex * 100);
      track.style.transition = transitioningRef.current
        ? "transform 0.7s cubic-bezier(.22,.72,.17,1)"
        : "none";
      track.style.transform = `translateX(${pct}%)`;
      transitioningRef.current = false;
    }
  }, [currentIndex, shouldAutoRotate, displayImages.length]);

  // No images to display
  if (displayImages.length === 0) {
    return (
      <div
        className={`relative w-full h-full flex items-center justify-center bg-neutral-100 ${className}`}
      >
        <span className="text-neutral-500 text-sm">No images available</span>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      <div ref={trackRef} className="absolute inset-0 flex h-full w-full will-change-transform">
        {loopImages.map((img, i) => (
          <div key={img.src + i} className="relative h-full w-full shrink-0 grow-0 basis-full">
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="100vw"
              className="object-cover"
              priority={i === 0}
            />
          </div>
        ))}
      </div>
      {showIndicators && shouldAutoRotate && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
          {displayImages.map((_, index) => {
            const active = currentIndex % displayImages.length === index;
            return (
              <div
                key={index}
                className={`h-1.5 rounded-full ${active ? "w-6 bg-white" : "w-1.5 bg-white/50"} transition-all duration-300`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
