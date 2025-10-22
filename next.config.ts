import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
    // Allow local images in development
    unoptimized: process.env.NODE_ENV === "development",
    // Enable image optimization caching
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },
  // Enable experimental optimizations
  experimental: {
    optimizePackageImports: ["@supabase/supabase-js", "gsap", "framer-motion"],
  },
  // Configure caching headers
  async headers() {
    return [
      {
        source: "/assets/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/:all*(svg|jpg|jpeg|png|webp|gif|ico)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
