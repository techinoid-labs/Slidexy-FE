/**
 * 05 — Marketing Strategy
 *
 * Saturated and playful: gradient cover, pill radii, venn positioning and a
 * donut budget split. Uses the venn block nothing else does.
 */

import { marketingMagenta } from "../themes";
import type { SlideTemplate } from "../types";
import {
  chart,
  checklist,
  contactFooter,
  cta,
  device,
  donut,
  heading,
  iconBullets,
  iconGrid,
  image,
  imageGrid,
  comparisonTable,
  slide,
  statCards,
  timeline,
  venn,
} from "./helpers";

export const marketingStrategy: SlideTemplate = {
  id: "marketing-strategy",
  number: 5,
  name: "Marketing Strategy",
  category: "Marketing",
  archetype: "marketing",
  description: "Plan, promote and grow your brand.",
  theme: marketingMagenta,
  coverPrompt: "bold magenta and violet gradient with abstract 3D shapes, studio lighting, no text",
  slides: [
    slide({
      id: "cover",
      name: "Cover",
      layout: "cover",
      background: {
        prompt: "vivid magenta and violet gradient with floating abstract 3D geometric shapes, studio lighting, no text, no logos",
        scrim: 0.45,
      },
      blocks: [
        heading({
          kicker: "Annual Plan",
          title: "Bold ideas. Bigger brands.",
          subtitle: "A data-driven strategy for awareness, engagement and measurable growth.",
        }),
        contactFooter({ slot: "footer", items: [{ icon: "megaphone", label: "YOUR LOGO" }] }),
      ],
    }),

    slide({
      id: "market",
      name: "Market Overview",
      layout: "splitRight",
      split: 0.5,
      blocks: [
        heading({ slot: "full", title: "Market Overview", subtitle: "The landscape and the opportunity." }),
        statCards({
          slot: "main",
          style: { columns: 2 },
          items: [
            { icon: "dollar", value: "$500B", label: "Total market size" },
            { icon: "trendingUp", value: "8.5%", label: "Annual growth" },
            { icon: "users", value: "3.2B", label: "Potential customers" },
            { icon: "smartphone", value: "25%", label: "Digital adoption" },
          ],
        }),
        image({
          slot: "aside",
          prompt: "abstract data visualisation with magenta and violet gradients, glass shapes, dark background, no text",
        }),
      ],
    }),

    slide({
      id: "audience",
      name: "Target Audience",
      layout: "stack",
      blocks: [
        heading({ title: "Target Audience", subtitle: "Reaching the right people with the right message." }),
        imageGrid({
          grow: 1,
          style: { columns: 3 },
          items: [
            { icon: "user", title: "Gen Z · 18–24", body: "Trendy, digital-first, values authenticity.", prompt: "portrait of a young woman in casual streetwear, soft studio light, no text" },
            { icon: "users", title: "Millennials · 25–40", body: "Career-focused, values quality and experience.", prompt: "portrait of a young professional man with glasses, soft studio light, no text" },
            { icon: "briefcase", title: "Professionals · 40+", body: "Seeks reliable solutions and long-term value.", prompt: "portrait of a confident professional woman, soft studio light, no text" },
          ],
        }),
      ],
    }),

    slide({
      id: "positioning",
      name: "Brand Positioning",
      layout: "splitRight",
      split: 0.46,
      blocks: [
        heading({ slot: "full", title: "Brand Positioning", subtitle: "What makes us different." }),
        venn({
          slot: "main",
          centerLabel: "Our brand",
          items: [
            { label: "Quality", body: "You can trust" },
            { label: "Innovation", body: "For tomorrow" },
            { label: "People", body: "First, always" },
          ],
        }),
        iconGrid({
          slot: "aside",
          style: { columns: 2 },
          items: [
            { icon: "shield", title: "Reliable" },
            { icon: "bolt", title: "Modern" },
            { icon: "heart", title: "Customer centric" },
            { icon: "leaf", title: "Sustainable" },
          ],
        }),
      ],
    }),

    slide({
      id: "goals",
      name: "Marketing Goals",
      layout: "stack",
      blocks: [
        heading({ title: "Marketing Goals", subtitle: "Clear goals for measurable success." }),
        iconBullets({
          grow: 1,
          style: { columns: 2 },
          items: [
            { icon: "megaphone", label: "Increase brand awareness", body: "Reach 10M+ people across priority channels." },
            { icon: "globe", label: "Drive website traffic", body: "Grow organic sessions by 50%." },
            { icon: "target", label: "Generate qualified leads", body: "10K+ new leads at a lower cost per lead." },
            { icon: "trendingUp", label: "Boost sales", body: "30% revenue growth year on year." },
          ],
        }),
      ],
    }),

    slide({
      id: "strategies",
      name: "Key Strategies",
      layout: "stack",
      blocks: [
        heading({ title: "Key Strategies", subtitle: "Our approach to achieving growth." }),
        iconGrid({
          grow: 1,
          style: { columns: 2 },
          items: [
            { icon: "document", title: "Content marketing", body: "Create valuable, relevant content that earns attention." },
            { icon: "users", title: "Social media", body: "Build engagement across the platforms that matter." },
            { icon: "megaphone", title: "Paid campaigns", body: "Targeted advertising for efficient reach." },
            { icon: "star", title: "Influencer partnerships", body: "Partner with trusted voices in the category." },
          ],
        }),
      ],
    }),

    slide({
      id: "channels",
      name: "Marketing Channels",
      layout: "stack",
      blocks: [
        heading({ title: "Marketing Channels", subtitle: "A multi-channel approach for greater impact." }),
        iconGrid({
          grow: 1,
          style: { columns: 3 },
          items: [
            { icon: "users", title: "Social", body: "Instagram, TikTok, LinkedIn, YouTube" },
            { icon: "search", title: "Search", body: "Google Ads and organic SEO" },
            { icon: "mail", title: "Email", body: "Newsletters and lifecycle campaigns" },
            { icon: "document", title: "Content", body: "Blog, guides and thought leadership" },
            { icon: "star", title: "Influencers", body: "Category partners and creators" },
            { icon: "calendar", title: "Events", body: "Webinars and industry conferences" },
          ],
        }),
      ],
    }),

    slide({
      id: "campaigns",
      name: "Campaign Plan",
      layout: "stack",
      blocks: [
        heading({ title: "Campaign Plan", subtitle: "Key campaigns to drive results." }),
        imageGrid({
          grow: 1,
          style: { columns: 3 },
          items: [
            { icon: "megaphone", title: "Brand awareness", body: "Q1 · social and video ads", prompt: "mountain landscape at dawn, moody cinematic colour grade, no text" },
            { icon: "rocket", title: "Product launch", body: "Q2 · influencers and paid ads", prompt: "sleek modern laptop on a dark reflective surface, product photography, no text" },
            { icon: "heart", title: "Customer engagement", body: "Q3 · email and community", prompt: "smiling customer using a phone in a bright cafe, candid, no text" },
          ],
        }),
      ],
    }),

    slide({
      id: "content",
      name: "Content Strategy",
      layout: "splitRight",
      split: 0.55,
      blocks: [
        heading({ slot: "full", title: "Content Strategy", subtitle: "Delivering the right content at the right time." }),
        iconBullets({
          slot: "main",
          items: [
            { icon: "book", label: "Educational", body: "How-to guides, tips and industry insight." },
            { icon: "play", label: "Entertaining", body: "Short-form video and behind the scenes." },
            { icon: "star", label: "Inspirational", body: "Customer stories and success journeys." },
            { icon: "megaphone", label: "Promotional", body: "Product highlights and special offers." },
          ],
        }),
        device({ slot: "aside", device: "phone", prompt: "social media feed UI on a phone, vibrant imagery, no text" }),
      ],
    }),

    slide({
      id: "social",
      name: "Social Media Strategy",
      layout: "splitRight",
      split: 0.5,
      blocks: [
        heading({ slot: "full", title: "Social Media Strategy", subtitle: "Building a strong community." }),
        iconGrid({
          slot: "main",
          style: { columns: 2 },
          items: [
            { icon: "camera", title: "Instagram", body: "Visual storytelling and reels." },
            { icon: "play", title: "TikTok", body: "Short-form, trend-led video." },
            { icon: "briefcase", title: "LinkedIn", body: "Thought leadership and B2B." },
            { icon: "users", title: "YouTube", body: "Long-form education and demos." },
          ],
        }),
        statCards({
          slot: "aside",
          style: { columns: 1 },
          items: [
            { icon: "globe", value: "10M+", label: "Total reach" },
            { icon: "heart", value: "250K", label: "Engagements" },
            { icon: "trendingUp", value: "+120%", label: "Follower growth" },
          ],
        }),
      ],
    }),

    slide({
      id: "metrics",
      name: "Performance Metrics",
      layout: "splitRight",
      split: 0.6,
      blocks: [
        heading({ slot: "full", title: "Performance Metrics", subtitle: "Tracking progress and impact." }),
        chart({
          slot: "main",
          kind: "comboChart",
          categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
          series: [
            { name: "Website traffic", values: [52, 68, 81, 96, 128, 170], accent: 2, kind: "bar" },
            { name: "Conversions", values: [8, 11, 15, 19, 26, 36], accent: 1, kind: "line" },
          ],
          yFormat: "compact",
        }),
        statCards({
          slot: "aside",
          style: { columns: 1 },
          items: [
            { icon: "globe", value: "+68%", label: "Website traffic" },
            { icon: "target", value: "+45%", label: "Lead generation" },
            { icon: "trendingUp", value: "+32%", label: "Sales growth" },
          ],
        }),
      ],
    }),

    slide({
      id: "budget",
      name: "Budget Allocation",
      layout: "splitRight",
      split: 0.52,
      blocks: [
        heading({ slot: "full", title: "Budget Allocation", subtitle: "Optimising investment for maximum ROI." }),
        donut({
          slot: "main",
          centerValue: "$500K",
          centerLabel: "Total budget",
          items: [
            { label: "Paid advertising", value: 35 },
            { label: "Content creation", value: 25 },
            { label: "Influencer marketing", value: 15 },
            { label: "Events and webinars", value: 15 },
            { label: "Tools and software", value: 10 },
          ],
        }),
        checklist({
          slot: "aside",
          items: [
            "Reviewed quarterly against performance",
            "20% held back for opportunistic spend",
            "Reallocated toward the best CAC channels",
          ],
        }),
      ],
    }),

    slide({
      id: "competitors",
      name: "Competitor Analysis",
      layout: "fullBleed",
      blocks: [
        heading({ title: "Competitor Analysis", subtitle: "Understanding the competitive landscape." }),
        comparisonTable({
          grow: 1,
          columns: [{ label: "Our brand", highlight: true }, { label: "Competitor A" }, { label: "Competitor B" }],
          rows: [
            { label: "Pricing", cells: ["yes", "partial", "no"] },
            { label: "Product quality", cells: ["yes", "no", "no"] },
            { label: "Brand awareness", cells: ["yes", "yes", "partial"] },
            { label: "Customer support", cells: ["yes", "partial", "no"] },
            { label: "Innovation", cells: ["yes", "no", "partial"] },
          ],
        }),
      ],
    }),

    slide({
      id: "timeline",
      name: "Timeline & Roadmap",
      layout: "stack",
      blocks: [
        heading({ title: "Timeline & Roadmap", subtitle: "Our marketing journey ahead." }),
        timeline({
          grow: 1,
          items: [
            { icon: "megaphone", date: "Q1", title: "Build awareness", body: "Launch brand campaign." },
            { icon: "heart", date: "Q2", title: "Drive engagement", body: "Community and content push." },
            { icon: "rocket", date: "Q3", title: "Scale campaigns", body: "Double down on what works." },
            { icon: "target", date: "Q4", title: "Optimise and grow", body: "Refine spend against CAC." },
          ],
        }),
      ],
    }),

    slide({
      id: "next-steps",
      name: "Next Steps",
      layout: "closing",
      background: {
        prompt: "person standing on a hilltop looking at a vivid magenta and violet sunset, cinematic, no text, no logos",
        scrim: 0.58,
      },
      blocks: [
        heading({ title: "Let's turn strategy into impact", subtitle: "Here is what happens next." }),
        checklist({
          style: { columns: 2 },
          items: [
            "Finalise campaign plans",
            "Align budget and resources",
            "Launch Q1 initiatives",
            "Monitor, report and optimise",
          ],
        }),
        cta({ label: "Let's Grow Together" }),
        contactFooter({ slot: "footer", items: [{ icon: "mail", label: "marketing@yourcompany.com" }] }),
      ],
    }),
  ],
};
