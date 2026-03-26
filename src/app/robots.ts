import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/account",
          "/auth",
          "/editor",
          "/onboarding",
          "/success",
          "/api/",
          "/slice",
          "/store",
        ],
      },
    ],
    sitemap: "https://slidexy.ai/sitemap.xml",
  };
}
