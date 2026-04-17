import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove standalone output for Vercel compatibility
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
};

export default nextConfig;
