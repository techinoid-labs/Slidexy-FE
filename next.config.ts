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
      {
        protocol: "https",
        hostname: "slidexy.sfo3.digitaloceanspaces.com",
        pathname: "/**", // allow all paths
      },
    ],
    domains: [
      "source.unsplash.com",
      "placehold.co",
      "dev.slidexy.net",
      "slidexy.sfo3.digitaloceanspaces.com",
    ],
  },
};

export default nextConfig;
