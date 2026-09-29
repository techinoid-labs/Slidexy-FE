/**
 * 02 — Startup Pitch Deck
 *
 * Light, energetic counterpart to the investor deck: geometric display face,
 * outlined cards, filled-circle icons, split-image cover.
 */

import { startupViolet } from "../themes";
import type { SlideTemplate } from "../types";
import {
  chart,
  checklist,
  contactFooter,
  cta,
  device,
  heading,
  iconBullets,
  iconGrid,
  image,
  imageGrid,
  nestedCircles,
  processFlow,
  scatter,
  slide,
  statCards,
  teamCards,
  timeline,
} from "./helpers";

export const startupPitch: SlideTemplate = {
  id: "startup-pitch",
  number: 2,
  name: "Startup Pitch Deck",
  category: "Business",
  archetype: "pitch",
  description: "Turn your idea into an investment story.",
  theme: startupViolet,
  coverPrompt:
    "lone hiker on a mountain summit at sunrise, vast valley below, warm violet and orange sky, cinematic, no text",
  slides: [
    slide({
      id: "cover",
      name: "Cover",
      layout: "cover",
      background: {
        prompt:
          "lone figure standing on a mountain summit at sunrise, sweeping valley below, violet and amber sky, cinematic wide shot, no text, no logos",
        scrim: 0.6,
      },
      blocks: [
        heading({
          kicker: "Seed Round",
          title: "A bold idea for a brighter tomorrow",
          subtitle: "Building innovative solutions for a more connected, sustainable world.",
        }),
        contactFooter({ slot: "footer", items: [{ icon: "rocket", label: "YOUR LOGO" }] }),
      ],
    }),

    slide({
      id: "problem",
      name: "The Problem",
      layout: "splitRight",
      split: 0.56,
      blocks: [
        heading({ slot: "full", title: "The Problem", subtitle: "A big problem that needs a better solution." }),
        iconBullets({
          slot: "main",
          items: [
            { icon: "clock", label: "Time consuming", body: "Current solutions are slow and inefficient at every step." },
            { icon: "dollar", label: "Expensive", body: "High costs put good tooling out of reach for most teams." },
            { icon: "user", label: "One size fits all", body: "Generic products never match how a team actually works." },
          ],
        }),
        image({
          slot: "aside",
          prompt:
            "frustrated professional at a cluttered desk late at night, desaturated cool tones, documentary photography, no text",
        }),
      ],
    }),

    slide({
      id: "solution",
      name: "Our Solution",
      layout: "splitRight",
      split: 0.54,
      blocks: [
        heading({ slot: "full", title: "Our Solution", subtitle: "A smarter, simpler and more powerful way." }),
        iconBullets({
          slot: "main",
          items: [
            { icon: "bolt", label: "AI-powered", body: "Intelligent automation that removes the busywork." },
            { icon: "dollar", label: "Cost effective", body: "High value at a fraction of the incumbent price." },
            { icon: "heart", label: "Personalised", body: "Adapts to each team's goals instead of the reverse." },
          ],
        }),
        device({ slot: "aside", device: "phone", prompt: "clean mobile app dashboard UI, violet accent, light theme, no text" }),
      ],
    }),

    slide({
      id: "product",
      name: "Product Overview",
      layout: "splitLeft",
      split: 0.46,
      blocks: [
        heading({ slot: "full", title: "Product Overview", subtitle: "A clean and intuitive product experience." }),
        iconGrid({
          slot: "main",
          style: { columns: 1 },
          items: [
            { icon: "checkCircle", title: "Easy to use", body: "An interface people understand on first open." },
            { icon: "bolt", title: "Powerful features", body: "Built for real, everyday work — not demos." },
            { icon: "globe", title: "Accessible anywhere", body: "Web and mobile, wherever the team is." },
          ],
        }),
        device({ slot: "aside", device: "browser", prompt: "modern SaaS analytics dashboard UI with charts, violet accent, light theme, no text" }),
      ],
    }),

    slide({
      id: "market",
      name: "Market Opportunity",
      layout: "splitRight",
      split: 0.45,
      blocks: [
        heading({ slot: "full", title: "Market Opportunity", subtitle: "A massive and growing market." }),
        nestedCircles({
          slot: "main",
          items: [
            { value: "$500B", label: "Total addressable market" },
            { value: "$120B", label: "Serviceable market" },
            { value: "$25B", label: "Obtainable market" },
          ],
        }),
        chart({
          slot: "aside",
          kind: "barChart",
          categories: ["2024", "2025", "2026", "2027", "2028"],
          series: [{ name: "Market size", values: [120, 168, 232, 320, 430], accent: 2 }],
          yFormat: "currency",
          caption: "Growing 29% annually through 2028.",
        }),
      ],
    }),

    slide({
      id: "audience",
      name: "Target Audience",
      layout: "stack",
      blocks: [
        heading({ title: "Target Audience", subtitle: "Built for the people who need it most." }),
        imageGrid({
          grow: 1,
          style: { columns: 3 },
          items: [
            {
              icon: "user",
              title: "Individuals",
              body: "Save time and get more done on their own terms.",
              prompt: "young professional working on a laptop in a bright cafe, candid, warm light, no text",
            },
            {
              icon: "users",
              title: "Small businesses",
              body: "Access affordable, powerful tools without a big team.",
              prompt: "small business owner in a workshop reviewing orders on a tablet, natural light, no text",
            },
            {
              icon: "building",
              title: "Enterprises",
              body: "Scale efficiently with advanced controls and support.",
              prompt: "corporate team collaborating in a modern glass meeting room, no text",
            },
          ],
        }),
      ],
    }),

    slide({
      id: "business-model",
      name: "Business Model",
      layout: "stack",
      blocks: [
        heading({ title: "Business Model", subtitle: "A scalable and sustainable revenue model." }),
        iconGrid({
          grow: 1,
          style: { columns: 3 },
          items: [
            { icon: "refresh", title: "Subscription", body: "Recurring revenue from individual and team plans." },
            { icon: "cart", title: "Marketplace", body: "Commission on transactions between our customers." },
            { icon: "building", title: "Enterprise", body: "Tailored contracts for large organisations." },
          ],
        }),
      ],
    }),

    slide({
      id: "traction",
      name: "Traction",
      layout: "splitRight",
      split: 0.44,
      blocks: [
        heading({ slot: "full", title: "Traction", subtitle: "Strong early momentum and real results." }),
        statCards({
          slot: "main",
          style: { columns: 2 },
          items: [
            { icon: "users", value: "100K+", label: "Active users" },
            { icon: "trendingUp", value: "25%", label: "Monthly growth" },
            { icon: "dollar", value: "$1.2M", label: "Annual revenue" },
            { icon: "star", value: "95%", label: "User satisfaction" },
          ],
        }),
        chart({
          slot: "aside",
          kind: "barChart",
          categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
          series: [{ name: "Users", values: [18, 24, 33, 44, 58, 78], accent: 1 }],
          yFormat: "compact",
          caption: "+25% month on month.",
        }),
      ],
    }),

    slide({
      id: "gtm",
      name: "Go-to-Market Strategy",
      layout: "stack",
      blocks: [
        heading({ title: "Go-to-Market Strategy", subtitle: "A focused, multi-channel approach to growth." }),
        processFlow({
          grow: 1,
          numbered: true,
          items: [
            { title: "Acquire", body: "Targeted marketing and founder-led partnerships." },
            { title: "Activate", body: "Onboarding that reaches value in the first session." },
            { title: "Retain", body: "Habit-forming workflows and responsive support." },
            { title: "Scale", body: "Expand into new markets and customer segments." },
          ],
        }),
      ],
    }),

    slide({
      id: "competition",
      name: "Competitive Landscape",
      layout: "splitRight",
      split: 0.36,
      blocks: [
        heading({ slot: "full", title: "Competitive Landscape", subtitle: "A clear advantage in the market." }),
        iconBullets({
          slot: "main",
          style: { compact: true },
          items: [
            { icon: "award", label: "Better product", body: "Purpose-built where competitors are generic." },
            { icon: "dollar", label: "Better price", body: "A third of the cost of the incumbent." },
          ],
        }),
        scatter({
          slot: "aside",
          xAxis: { low: "High price", high: "Low price" },
          yAxis: { low: "Low features", high: "High features" },
          points: [
            { label: "Our product", x: 0.76, y: 0.84, highlight: true },
            { label: "Competitor A", x: 0.2, y: 0.66 },
            { label: "Competitor B", x: 0.18, y: 0.24 },
            { label: "Competitor C", x: 0.72, y: 0.3 },
          ],
        }),
      ],
    }),

    slide({
      id: "financials",
      name: "Financial Projections",
      layout: "splitRight",
      split: 0.62,
      blocks: [
        heading({ slot: "full", title: "Financial Projections", subtitle: "A clear path to strong, sustainable growth." }),
        chart({
          slot: "main",
          kind: "barChart",
          categories: ["2024", "2025", "2026", "2027", "2028"],
          series: [
            { name: "Revenue", values: [5, 9, 14, 19, 26], accent: 1 },
            { name: "Expenses", values: [6, 8, 11, 13, 16], accent: 2 },
            { name: "Profit", values: [-1, 1, 3, 6, 10], accent: 3 },
          ],
          yFormat: "currency",
        }),
        statCards({
          slot: "aside",
          style: { columns: 1 },
          items: [
            { icon: "dollar", value: "$5M", label: "Revenue in 2024" },
            { icon: "trendingUp", value: "$26M", label: "Projected 2028" },
            { icon: "barChart", value: "40%", label: "CAGR 2024–2028" },
          ],
        }),
      ],
    }),

    slide({
      id: "team",
      name: "Our Team",
      layout: "stack",
      blocks: [
        heading({ title: "Our Team", subtitle: "A team with the right mix of experience and vision." }),
        teamCards({
          grow: 1,
          style: { columns: 3 },
          items: [
            {
              name: "Sarah Khan",
              role: "CEO & Co-founder",
              bio: "Ten years in product and technology innovation.",
              photoPrompt: "professional headshot of a woman founder, soft studio lighting, neutral background",
            },
            {
              name: "Ali Raza",
              role: "CTO & Co-founder",
              bio: "Builds AI and scalable distributed systems.",
              photoPrompt: "professional headshot of a man in a casual shirt, soft studio lighting, neutral background",
            },
            {
              name: "Ayesha Malik",
              role: "COO",
              bio: "Operations and growth strategy specialist.",
              photoPrompt: "professional headshot of a woman in business casual, soft studio lighting, neutral background",
            },
          ],
        }),
      ],
    }),

    slide({
      id: "roadmap",
      name: "Roadmap",
      layout: "stack",
      blocks: [
        heading({ title: "Roadmap", subtitle: "Our journey ahead." }),
        timeline({
          grow: 1,
          items: [
            { icon: "rocket", date: "Q1 2024", title: "Product launch", body: "MVP release to early adopters." },
            { icon: "users", date: "Q2 2024", title: "User growth", body: "First 100K active users." },
            { icon: "layers", date: "Q3 2024", title: "New features", body: "Expand core product capabilities." },
            { icon: "globe", date: "Q4 2024", title: "Global expansion", body: "Enter three new regions." },
            { icon: "award", date: "2025+", title: "Scale", body: "Become the category leader." },
          ],
        }),
      ],
    }),

    slide({
      id: "impact",
      name: "Impact",
      layout: "stack",
      blocks: [
        heading({ title: "Impact", subtitle: "Creating meaningful impact for people, businesses and communities." }),
        imageGrid({
          grow: 1,
          style: { columns: 3 },
          items: [
            {
              icon: "user",
              title: "Empower people",
              body: "Give individuals more time and freedom.",
              prompt: "person with arms raised on a hilltop at sunrise, silhouette, hopeful, no text",
            },
            {
              icon: "briefcase",
              title: "Support businesses",
              body: "Help businesses grow and operate efficiently.",
              prompt: "small team celebrating around a laptop in a bright office, candid, no text",
            },
            {
              icon: "leaf",
              title: "Build a better future",
              body: "Contribute to a more connected, sustainable world.",
              prompt: "young green plant seedling in soil, macro, soft morning light, no text",
            },
          ],
        }),
      ],
    }),

    slide({
      id: "ask",
      name: "The Ask",
      layout: "closing",
      background: {
        prompt:
          "hiker reaching a mountain ridge at golden hour, expansive landscape, warm cinematic light, no text, no logos",
        scrim: 0.62,
      },
      blocks: [
        heading({ kicker: "Seed Round", title: "$5M to scale faster", subtitle: "We are looking for partners to help us grow." }),
        checklist({
          style: { columns: 2 },
          items: ["Product development", "Market expansion", "Team growth", "Strategic partnerships"],
        }),
        cta({ label: "Let's Build the Future Together" }),
        contactFooter({
          slot: "footer",
          items: [
            { icon: "globe", label: "yourcompany.com" },
            { icon: "mail", label: "hello@yourcompany.com" },
          ],
        }),
      ],
    }),
  ],
};
