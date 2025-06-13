import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@sparticuz/chromium-min'],
  },
};

export default nextConfig;
