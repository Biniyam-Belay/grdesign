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
  },
};

export default nextConfig;
