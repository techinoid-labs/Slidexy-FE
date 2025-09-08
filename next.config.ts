import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.externals = [...config.externals, { canvas: "canvas" }];
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "dev.slidexy.net",
        port: "5000",
        pathname: "/images/**",
      },
    ],
    domains: ["source.unsplash.com", "placehold.co", "dev.slidexy.net"],
  },
};

export default nextConfig;
