"use client";

import React, { memo } from "react";
import { useCachedVideo } from "@lib/hooks/useVideoCache";

interface VideoPlayerProps {
  src: string;
  className?: string;
  withGradient?: boolean;
  showPlaceholder?: boolean;
}

const VideoPlayer = memo(
  ({ src, className = "", withGradient = false, showPlaceholder = true }: VideoPlayerProps) => {
    const { videoSrc, isLoaded, videoRef } = useCachedVideo(src);

    // If no video source, return nothing
    if (!videoSrc) return null;

    return (
      <>
        <video
          ref={videoRef}
          className={`${className}`}
          autoPlay
          muted
          loop
          playsInline
          disablePictureInPicture
          disableRemotePlayback
        >
          <source src={videoSrc} type="video/mp4" />
          {showPlaceholder && (
            <div className="absolute inset-0 grid place-items-center bg-neutral-50 text-neutral-400">
              <span className="text-xs uppercase tracking-widest">Video Not Supported</span>
            </div>
          )}
        </video>

        {/* Optional gradient overlay */}
        {withGradient && (
          <div className="absolute inset-0 bg-gradient-to-b from-black/15 to-transparent z-10"></div>
        )}
      </>
    );
  },
);

// Add display name for React DevTools
VideoPlayer.displayName = "VideoPlayer";

export default VideoPlayer;
