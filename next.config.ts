import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Картинки промтов лежат в Supabase Storage
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
};

export default nextConfig;
