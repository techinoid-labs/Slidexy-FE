import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/_next/static/",   // allow JS/CSS needed for rendering
          "/_next/image/",    // allow optimised images
        ],
        disallow: [
          // Auth & account pages
          "/account",
          "/auth",
          "/editor",
          "/onboarding",
          "/success",

          // API routes
          "/api/",

          // Internal / low-value pages
          "/slice",
          "/store",
          "/waiting-list",
          "/proposal",
          "/reports",
        ],
      },
    ],
    sitemap: "https://slidexy.ai/sitemap.xml",
  };
}

