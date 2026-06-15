import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Serve modern, smaller formats. AVIF is preferred (~20% smaller than
    // WebP); WebP is the fallback for browsers without AVIF support.
    formats: ["image/avif", "image/webp"],
    // Allow the optimizer to emit aggressively-compressed qualities.
    qualities: [25, 40, 50, 75],
    // Cache optimized images for 31 days.
    minimumCacheTTL: 2678400,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      { protocol: "https", hostname: "www.rayanesbhomes.com" },
      { protocol: "https", hostname: "rayanesbhomes.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
};

export default nextConfig;
