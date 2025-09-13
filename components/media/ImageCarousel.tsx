"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface ImageCarouselProps {
  images: Array<{ src: string; alt: string }>;
  interval?: number; // Time between slides in ms
  className?: string;
  thumbImage?: string; // Fallback image if no gallery images
  thumbAlt?: string; // Alt text for the fallback image
}

export default function ImageCarousel({
  images,
  interval = 5000,
  className = "",
  thumbImage,
  thumbAlt = "Project thumbnail",
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Use gallery images if available, otherwise use the thumb
  const displayImages =
    images && images.length > 0 ? images : thumbImage ? [{ src: thumbImage, alt: thumbAlt }] : [];

  // Don't rotate if there's only one image
  const shouldAutoRotate = displayImages.length > 1;

  useEffect(() => {
    if (!shouldAutoRotate) return;

    // Set up interval for auto-rotation
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % displayImages.length);
        setIsTransitioning(false);
      }, 500); // Match this to your transition duration
    }, interval);

    return () => clearInterval(timer);
  }, [displayImages.length, interval, shouldAutoRotate]);

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
      {/* Current image with fade transition */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
          isTransitioning ? "opacity-0" : "opacity-100"
        }`}
      >
        <Image
          src={displayImages[currentIndex].src}
          alt={displayImages[currentIndex].alt}
          fill
          sizes="100vw"
          className="object-contain"
          priority
        />
      </div>

      {/* Progress indicators */}
      {shouldAutoRotate && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {displayImages.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 rounded-full ${
                index === currentIndex ? "w-6 bg-white" : "w-1.5 bg-white/50"
              } transition-all duration-300`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
