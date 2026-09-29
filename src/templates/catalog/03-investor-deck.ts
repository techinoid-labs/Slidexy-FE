/**
 * 03 — Investor & Fundraising
 *
 * Dark, high-contrast counterpart to the startup pitch: same narrative beats,
 * deliberately different identity (midnight palette, grotesk display face,
 * kicker rules, topographic motif).
 */

import { investorMidnight } from "../themes";
import type { SlideTemplate } from "../types";
import {
  chart,
  contactFooter,
  cta,
  device,
  donut,
  heading,
  iconBullets,
  iconGrid,
  nestedCircles,
  processFlow,
  scatter,
  slide,
  statCards,
  teamCards,
  timeline,
} from "./helpers";

export const investorDeck: SlideTemplate = {
  id: "investor-deck",
  number: 3,
  name: "Investor & Fundraising",
  category: "Business",
  archetype: "pitch",
  description: "Attract investors with a compelling story.",
  theme: investorMidnight,
  coverPrompt:
    "climber silhouetted on a dark mountain ridge under a star-filled sky, deep blue and violet, cinematic, no text",
  slides: [
    slide({
      id: "cover",
      name: "Cover",
      layout: "cover",
      background: {
        prompt:
          "climber silhouetted on a dark mountain ridge beneath a star-filled sky, deep blue and violet tones, cinematic wide shot, no text, no logos",
        scrim: 0.55,
      },
      blocks: [
        heading({
          kicker: "Series A",
          title: "Big ideas. Real impact.",
          subtitle: "A scalable solution to a global problem.",
        }),
        contactFooter({ slot: "footer", items: [{ icon: "star", label: "YOUR LOGO" }] }),
      ],
    }),

    slide({
      id: "problem",
      name: "The Problem",
      layout: "splitRight",
      split: 0.55,
      blocks: [
        heading({ slot: "full", title: "The Problem", subtitle: "A massive problem that needs a better solution." }),
        statCards({
          slot: "main",
          style: { columns: 1 },
          items: [
            { icon: "dollar", value: "$12T", label: "Lost annually to market inefficiency" },
            { icon: "users", value: "2.5B", label: "People affected worldwide" },
            { icon: "close", value: "70%", label: "Say current solutions are inadequate" },
          ],
        }),
        chart({
          slot: "aside",
          kind: "lineChart",
          categories: ["2020", "2021", "2022", "2023", "2024"],
          series: [{ name: "Cost of inaction", values: [6, 7.4, 9.1, 10.6, 12], accent: 3 }],
          yFormat: "currency",
        }),
      ],
    }),

    slide({
      id: "solution",
      name: "Our Solution",
      layout: "splitRight",
      split: 0.54,
      blocks: [
        heading({ slot: "full", title: "Our Solution", subtitle: "A simpler, smarter and more effective approach." }),
        iconBullets({
          slot: "main",
          items: [
            { icon: "cpu", label: "AI at the core", body: "Automation and intelligence built into every workflow." },
            { icon: "checkCircle", label: "Easy to adopt", body: "Value in the first session, not the first quarter." },
            { icon: "dollar", label: "Cost effective", body: "Delivers more value at a materially lower cost." },
          ],
        }),
        device({ slot: "aside", device: "phone", prompt: "dark-mode mobile app interface with charts, violet and cyan accents, no text" }),
      ],
    }),

    slide({
      id: "market",
      name: "Market Opportunity",
      layout: "splitRight",
      split: 0.48,
      blocks: [
        heading({ slot: "full", title: "Market Opportunity", subtitle: "A large and growing market with real headroom." }),
        nestedCircles({
          slot: "main",
          items: [
            { value: "$3.2T", label: "Total addressable market" },
            { value: "$680B", label: "Serviceable market" },
            { value: "$45B", label: "Obtainable market" },
          ],
        }),
        statCards({
          slot: "aside",
          style: { columns: 1 },
          items: [
            { icon: "trendingUp", value: "25%", label: "Annual market growth 2024–2030" },
            { icon: "globe", value: "40+", label: "Markets we can serve today" },
          ],
        }),
      ],
    }),

    slide({
      id: "why-now",
      name: "Why Now",
      layout: "stack",
      blocks: [
        heading({ title: "Why Now?", subtitle: "The right combination of timing, technology and readiness." }),
        iconGrid({
          grow: 1,
          style: { columns: 2 },
          items: [
            { icon: "trendingUp", title: "Market shift", body: "Demand has moved decisively toward our category." },
            { icon: "cpu", title: "Tech advances", body: "Model costs fell far enough to make this viable." },
            { icon: "scale", title: "Favourable regulation", body: "New rules actively support adoption." },
            { icon: "users", title: "Growing awareness", body: "Buyers now understand the problem we solve." },
          ],
        }),
      ],
    }),

    slide({
      id: "product",
      name: "Product Overview",
      layout: "splitLeft",
      split: 0.44,
      blocks: [
        heading({ slot: "full", title: "Product Overview", subtitle: "A powerful product designed for real-world problems." }),
        iconBullets({
          slot: "main",
          style: { compact: true },
          items: [
            { icon: "layers", label: "Core features", body: "Solves the key job end to end." },
            { icon: "palette", label: "Intuitive design", body: "Simple and seamless for every role." },
            { icon: "cloud", label: "Scalable platform", body: "Built for global growth from day one." },
          ],
        }),
        device({ slot: "aside", device: "laptop", prompt: "dark analytics dashboard on a laptop screen, cyan and violet data visualisation, no text" }),
      ],
    }),

    slide({
      id: "traction",
      name: "Traction",
      layout: "splitRight",
      split: 0.58,
      blocks: [
        heading({ slot: "full", title: "Traction", subtitle: "Real progress. Real customers. Real impact." }),
        chart({
          slot: "main",
          kind: "barChart",
          categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
          series: [{ name: "Active users", values: [8, 12, 19, 27, 38, 52], accent: 1 }],
          yFormat: "compact",
          caption: "+320% user growth in six months.",
        }),
        statCards({
          slot: "aside",
          style: { columns: 1 },
          items: [
            { icon: "users", value: "100K+", label: "Active users" },
            { icon: "trendingUp", value: "+250%", label: "Revenue growth" },
            { icon: "userCheck", value: "95%", label: "Customer retention" },
          ],
        }),
      ],
    }),

    slide({
      id: "business-model",
      name: "Business Model",
      layout: "stack",
      blocks: [
        heading({ title: "Business Model", subtitle: "A clear and scalable path to revenue." }),
        iconGrid({
          grow: 1,
          style: { columns: 3 },
          items: [
            { icon: "refresh", title: "Subscription", body: "Recurring revenue from individuals and teams." },
            { icon: "building", title: "Enterprise", body: "Custom solutions for large organisations." },
            { icon: "cart", title: "Marketplace", body: "Commission-based revenue from partners." },
          ],
        }),
      ],
    }),

    slide({
      id: "gtm",
      name: "Go-to-Market Strategy",
      layout: "stack",
      blocks: [
        heading({ title: "Go-to-Market Strategy", subtitle: "A focused plan to acquire, activate and scale." }),
        processFlow({
          grow: 1,
          numbered: true,
          items: [
            { title: "Acquire", body: "Targeted marketing and channel partnerships." },
            { title: "Activate", body: "Strong onboarding and early engagement." },
            { title: "Scale", body: "Expand to new markets and segments." },
          ],
        }),
      ],
    }),

    slide({
      id: "competition",
      name: "Competitive Landscape",
      layout: "fullBleed",
      blocks: [
        heading({ title: "Competitive Landscape", subtitle: "A clear advantage in a growing market." }),
        scatter({
          grow: 1,
          xAxis: { low: "Low cost", high: "High cost" },
          yAxis: { low: "Low value", high: "High value" },
          points: [
            { label: "Our solution", x: 0.74, y: 0.86, highlight: true },
            { label: "Competitor A", x: 0.22, y: 0.7 },
            { label: "Competitor B", x: 0.2, y: 0.26 },
            { label: "Competitor C", x: 0.78, y: 0.3 },
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
        heading({ slot: "full", title: "Financial Projections", subtitle: "A strong path to significant returns." }),
        chart({
          slot: "main",
          kind: "comboChart",
          categories: ["2024", "2025", "2026", "2027", "2028"],
          series: [
            { name: "Revenue", values: [5, 11, 18, 26, 38], accent: 1, kind: "bar" },
            { name: "Profit", values: [-2, 1, 5, 11, 19], accent: 2, kind: "line" },
          ],
          yFormat: "currency",
        }),
        statCards({
          slot: "aside",
          style: { columns: 1 },
          items: [
            { icon: "dollar", value: "$5M", label: "Revenue in 2024" },
            { icon: "trendingUp", value: "$28M", label: "Revenue in 2027" },
            { icon: "barChart", value: "45%", label: "CAGR 2024–2028" },
          ],
        }),
      ],
    }),

    slide({
      id: "team",
      name: "The Team",
      layout: "stack",
      blocks: [
        heading({ title: "The Team", subtitle: "A world-class team with the vision and expertise to execute." }),
        teamCards({
          grow: 1,
          style: { columns: 3 },
          items: [
            {
              name: "Sarah Khan",
              role: "CEO & Co-founder",
              bio: "Ten years in product and technology innovation.",
              photoPrompt: "professional headshot of a woman founder, dark studio background, dramatic lighting",
            },
            {
              name: "Ali Raza",
              role: "CTO & Co-founder",
              bio: "Expert in AI and scalable systems.",
              photoPrompt: "professional headshot of a man in a dark shirt, dark studio background, dramatic lighting",
            },
            {
              name: "Ayesha Malik",
              role: "COO",
              bio: "Operations and growth strategy specialist.",
              photoPrompt: "professional headshot of a woman executive, dark studio background, dramatic lighting",
            },
          ],
        }),
      ],
    }),

    slide({
      id: "ask",
      name: "Funding Ask",
      layout: "splitRight",
      split: 0.46,
      blocks: [
        heading({ slot: "full", title: "Funding Ask", subtitle: "We are raising $10M to accelerate growth and impact." }),
        statCards({
          slot: "main",
          style: { columns: 1 },
          items: [
            { icon: "dollar", value: "$10M", label: "Series A round" },
            { icon: "clock", value: "24 mo", label: "Runway this provides" },
          ],
        }),
        donut({
          slot: "aside",
          centerValue: "$10M",
          centerLabel: "Allocation",
          items: [
            { label: "Product development", value: 40 },
            { label: "Market expansion", value: 30 },
            { label: "Team growth", value: 20 },
            { label: "Strategic partnerships", value: 10 },
          ],
        }),
      ],
    }),

    slide({
      id: "use-of-funds",
      name: "Use of Funds",
      layout: "stack",
      blocks: [
        heading({ title: "Use of Funds", subtitle: "Investing in the areas that drive scale." }),
        iconGrid({
          grow: 1,
          style: { columns: 2 },
          items: [
            { icon: "cpu", title: "Product & technology", body: "Ship the roadmap faster and deepen the platform." },
            { icon: "megaphone", title: "Sales & marketing", body: "Build repeatable demand generation." },
            { icon: "users", title: "Team & operations", body: "Hire senior engineering and customer leadership." },
            { icon: "handshake", title: "Strategic initiatives", body: "Partnerships and selective acquisitions." },
          ],
        }),
      ],
    }),

    slide({
      id: "future",
      name: "The Future",
      layout: "closing",
      background: {
        prompt:
          "mountain summit with a flag at dawn, dramatic clouds below, deep blue and violet palette, cinematic, no text, no logos",
        scrim: 0.58,
      },
      blocks: [
        heading({ title: "A bigger, brighter tomorrow", subtitle: "Join us on this journey." }),
        timeline({
          items: [
            { icon: "flag", date: "2024", title: "Build & validate" },
            { icon: "trendingUp", date: "2025", title: "Scale & expand" },
            { icon: "globe", date: "2026+", title: "Global leader" },
          ],
        }),
        cta({ label: "Join Us on This Journey" }),
        contactFooter({
          slot: "footer",
          items: [
            { icon: "globe", label: "yourcompany.com" },
            { icon: "mail", label: "invest@yourcompany.com" },
          ],
        }),
      ],
    }),
  ],
};
