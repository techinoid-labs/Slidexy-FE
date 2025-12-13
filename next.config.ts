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
        protocol: "http",
        hostname: "localhost",
        port: "5001",
        pathname: "/**", // Allow all paths from 5001 (uploads, images)
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
      {
        protocol: "https",
        hostname: "assets.slidexy.net",
        pathname: "/**", // allow all paths
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**", // allow all paths
      },
    ],
    domains: [
      "source.unsplash.com",
      "images.unsplash.com",
      "placehold.co",
      "dev.slidexy.net",
      "slidexy.sfo3.digitaloceanspaces.com",
      "assets.slidexy.net",
    ],
  },
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: 'http://localhost:5001/uploads/:path*', // Proxy to backend
      },
    ];
  },
};

export default nextConfig;
