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

          // Dynamic Viewer / App State Routes (No SEO value)
          "/infographic",
          "/linkedin",
          "/presentation",
          "/text-to-template",
          "/waiting-list",
          "/proposal",
          "/reports",

          // Internal logic paths
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

