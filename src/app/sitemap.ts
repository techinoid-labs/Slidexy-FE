import type { MetadataRoute } from "next";

const SITE_URL = "https://slidexy.ai";

/**
 * Dynamic XML Sitemap — Phase 3
 *
 * Includes only public, indexable pages with real standalone value.
 * Low-value pages (/waiting-list, /proposal, /reports, /account, etc.)
 * are excluded here and disallowed in robots.ts.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  // ── Core public pages ──
  const corePages: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/templates`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/pricing`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/faqs`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/features`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/product`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/privacy-policy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // ── Individual tool pages (feature-specific action intent) ──
  // Only the deck flow ships now; the other tool pages were removed, and
  // listing dead URLs in a sitemap is actively harmful for indexing.
  const toolSlugs = ["prompt-to-deck"];

  const toolPages: MetadataRoute.Sitemap = toolSlugs.map((slug) => ({
    url: `${SITE_URL}/tools/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...corePages, ...toolPages];
}
