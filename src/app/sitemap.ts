import type { MetadataRoute } from "next";

const SITE_URL = "https://slidexy.ai";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  // ── Core public pages ──
  const corePages = [
    "",           // homepage
    "/tools",
    "/templates",
    "/pricing",
    "/faqs",
    "/blog",
    "/features",
    "/product",
    "/privacy-policy",
  ];

  // ── Individual tool pages ──
  const toolPages = [
    "/tools/prompt-to-deck",
    "/tools/prompt-to-template",
    "/tools/prompt-to-ebook",
    "/tools/prompt-to-pdf",
    "/tools/prompt-to-proposal",
    "/tools/prompt-to-video",
    "/tools/text-to-infographics",
    "/tools/url-to-website",
    "/tools/video-to-deck",
    "/tools/web-to-deck",
  ];

  const allPages = [...corePages, ...toolPages];

  return allPages.map((path) => ({
    url: `${SITE_URL}${path || "/"}`,
    lastModified: now,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1.0 : path.startsWith("/tools/") ? 0.7 : 0.8,
  }));
}
