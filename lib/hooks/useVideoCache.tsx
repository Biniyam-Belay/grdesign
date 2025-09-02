"use client";

import React, { createContext, useContext, useRef, useState, useEffect } from "react";

// Types for our video cache context
interface VideoCacheContextType {
  getVideo: (src: string) => string;
  preloadVideo: (src: string) => void;
  isLoaded: (src: string) => boolean;
}

// Create the context
const VideoCacheContext = createContext<VideoCacheContextType | null>(null);

// Cache size limits
const MAX_CACHE_SIZE = 10;

/**
 * Provider component to wrap around parts of the app that need video caching
 */
export function VideoCacheProvider({ children }: { children: React.ReactNode }) {
  // Use ref to persist cache between renders
  const videoCache = useRef<Map<string, string>>(new Map());
  const loadingVideos = useRef<Set<string>>(new Set());
  const loadedVideos = useRef<Set<string>>(new Set());

  // For re-rendering when videos are loaded
  const [, forceUpdate] = useState({});

  // Helper function to clean cache if it gets too large
  const cleanCache = () => {
    if (videoCache.current.size > MAX_CACHE_SIZE) {
      // Convert to array for easier manipulation
      const entries = Array.from(videoCache.current.entries());
      // Remove oldest entries (first ones added)
      const toDelete = entries.slice(0, Math.floor(entries.length / 2));
      toDelete.forEach(([key]) => {
        videoCache.current.delete(key);
        loadedVideos.current.delete(key);
      });
    }
  };

  // Get video URL - either from cache or original
  const getVideo = (src: string): string => {
    return videoCache.current.get(src) || src;
  };

  // Check if a video is already loaded
  const isLoaded = (src: string): boolean => {
    return loadedVideos.current.has(src);
  };

  // Preload a video
  const preloadVideo = (src: string) => {
    if (loadedVideos.current.has(src) || loadingVideos.current.has(src)) {
      return; // Already loaded or loading
    }

    loadingVideos.current.add(src);

    // Create a video element for preloading
    const video = document.createElement("video");
    video.preload = "auto";

    // When loaded, add to cache
    video.onloadeddata = () => {
      // Store the original URL in cache
      videoCache.current.set(src, src);
      loadedVideos.current.add(src);
      loadingVideos.current.delete(src);
      cleanCache();
      // Force a re-render
      forceUpdate({});
    };

    // Handle errors
    video.onerror = () => {
      console.warn(`Failed to preload video: ${src}`);
      loadingVideos.current.delete(src);
    };

    // Start loading
    video.src = src;
  };

  return (
    <VideoCacheContext.Provider value={{ getVideo, preloadVideo, isLoaded }}>
      {children}
    </VideoCacheContext.Provider>
  );
}

/**
 * Hook to access the video cache functionality
 */
export function useVideoCache() {
  const context = useContext(VideoCacheContext);
  if (!context) {
    throw new Error("useVideoCache must be used within a VideoCacheProvider");
  }
  return context;
}

/**
 * Hook for a video component with caching built in
 * @param src Video source URL
 */
export function useCachedVideo(src?: string) {
  const { getVideo, preloadVideo, isLoaded } = useVideoCache();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (src) {
      preloadVideo(src);
    }
  }, [src]);

  // Return video source and loaded state
  return {
    videoSrc: src ? getVideo(src) : undefined,
    isLoaded: src ? isLoaded(src) : false,
    videoRef,
  };
}
