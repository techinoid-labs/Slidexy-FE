/**
 * 01 — Business & Corporate
 *
 * Structure follows the reference deck; typography, spacing and colour come
 * from the token system rather than the reference's per-slide values.
 *
 * Image prompts are written for the backend image pipeline: subject first,
 * then treatment, then a negative-ish qualifier. They avoid text-in-image,
 * which generators render badly and which would fight the real slide copy.
 */

import { corporateNavy } from "../themes";
import type { SlideTemplate } from "../types";
import {
  chart,
  checklist,
  contactFooter,
  cta,
  heading,
  iconBullets,
  iconGrid,
  image,
  paragraph,
  pillars,
  processFlow,
  roadmapPhases,
  scatter,
  slide,
  statCards,
  teamCards,
  timeline,
} from "./helpers";

export const businessCorporate: SlideTemplate = {
  id: "business-corporate",
  number: 1,
  name: "Business & Corporate",
  category: "Business",
  archetype: "corporate",
  description: "Professional decks for growth and success.",
  theme: corporateNavy,
  coverPrompt:
    "modern glass office towers photographed from below at blue hour, cool tones, no text, no logos",
  slides: [
    // 01 ─ Cover
    slide({
      id: "cover",
      name: "Cover",
      layout: "cover",
      background: {
        prompt:
          "modern glass corporate towers from below at blue hour, cool cinematic lighting, shallow depth of field, no text, no logos",
        scrim: 0.62,
      },
      blocks: [
        heading({
          kicker: "Company Overview",
          title: "Corporate Cover",
          subtitle: "A bold introduction to your company.",
        }),
        contactFooter({ slot: "footer", items: [{ icon: "building", label: "YOUR LOGO" }] }),
      ],
    }),

    // 02 ─ Company at a glance
    slide({
      id: "at-a-glance",
      name: "Company at a Glance",
      layout: "splitRight",
      split: 0.55,
      blocks: [
        heading({
          slot: "full",
          title: "Company at a Glance",
          subtitle: "Key facts that define who we are.",
        }),
        statCards({
          slot: "main",
          style: { columns: 2 },
          items: [
            { icon: "calendar", value: "10+", label: "Years of excellence" },
            { icon: "users", value: "500+", label: "Team members" },
            { icon: "globe", value: "20+", label: "Countries served" },
            { icon: "heart", value: "1M+", label: "Happy customers" },
          ],
        }),
        image({
          slot: "aside",
          prompt:
            "bright modern open-plan office interior with glass partitions and daylight, people out of focus, architectural photography, no text",
        }),
      ],
    }),

    // 03 ─ About
    slide({
      id: "about",
      name: "About Our Company",
      layout: "splitRight",
      split: 0.52,
      blocks: [
        heading({ slot: "main", title: "About Our Company" }),
        paragraph({
          slot: "main",
          body:
            "We are a global company creating innovative solutions that make a positive impact on people and businesses.",
        }),
        iconBullets({
          slot: "main",
          style: { compact: true },
          items: [
            { icon: "target", label: "Purpose-built", body: "Every product starts from a real customer problem." },
            { icon: "globe", label: "Global reach", body: "Teams and customers across twenty countries." },
          ],
        }),
        cta({ slot: "main", label: "Learn More" }),
        image({
          slot: "aside",
          prompt:
            "contemporary corporate lounge with warm wood, plants and soft daylight, wide angle, no people in focus, no text",
        }),
      ],
    }),

    // 04 ─ Mission / Vision / Values
    slide({
      id: "mission-vision-values",
      name: "Mission, Vision & Values",
      layout: "stack",
      blocks: [
        heading({ title: "Mission · Vision · Values", subtitle: "What we stand for and where we are going." }),
        iconGrid({
          grow: 1,
          style: { columns: 3 },
          items: [
            {
              icon: "target",
              title: "Our Mission",
              body: "Create meaningful solutions that leave people and businesses better off than we found them.",
            },
            {
              icon: "lightbulb",
              title: "Our Vision",
              body: "To be the global leader in sustainable, human-centred innovation.",
            },
            {
              icon: "award",
              title: "Our Values",
              body: "Integrity, collaboration, invention and putting people first — in that order.",
            },
          ],
        }),
      ],
    }),

    // 05 ─ Business snapshot
    slide({
      id: "snapshot",
      name: "Business Snapshot",
      layout: "splitRight",
      split: 0.5,
      blocks: [
        heading({
          slot: "full",
          title: "Business Snapshot",
          subtitle: "Key metrics and performance highlights.",
        }),
        statCards({
          slot: "main",
          style: { columns: 2 },
          items: [
            { icon: "barChart", value: "$120M", label: "Revenue", delta: "+18% YoY" },
            { icon: "pieChart", value: "25%", label: "Profit margin" },
            { icon: "users", value: "1M+", label: "Customers" },
            { icon: "star", value: "95%", label: "Customer satisfaction" },
          ],
        }),
        chart({
          slot: "aside",
          kind: "barChart",
          categories: ["2021", "2022", "2023", "2024"],
          series: [{ name: "Revenue", values: [52, 71, 96, 120], accent: 1 }],
          yFormat: "currency",
        }),
      ],
    }),

    // 06 ─ What we do
    slide({
      id: "what-we-do",
      name: "What We Do",
      layout: "splitRight",
      split: 0.56,
      blocks: [
        heading({
          slot: "full",
          title: "What We Do",
          subtitle: "A range of solutions to help businesses grow and succeed.",
        }),
        iconBullets({
          slot: "main",
          style: { columns: 2 },
          items: [
            { icon: "briefcase", label: "Consulting", body: "Strategic guidance for long-term growth." },
            { icon: "cpu", label: "Technology", body: "Innovative digital solutions built to last." },
            { icon: "settings", label: "Operations", body: "Efficient processes and dependable execution." },
            { icon: "shield", label: "Support", body: "Ongoing assistance for your success." },
          ],
        }),
        image({
          slot: "aside",
          prompt:
            "minimal desk scene with laptop, notebook and a plant beside a bright window, soft natural light, top-down, no text",
        }),
      ],
    }),

    // 07 ─ Strategic pillars
    slide({
      id: "pillars",
      name: "Our Strategic Pillars",
      layout: "stack",
      blocks: [
        heading({ title: "Our Strategic Pillars", subtitle: "The key areas driving our growth." }),
        pillars({
          grow: 1,
          items: [
            { icon: "lightbulb", title: "Innovation", body: "Building what comes next, before it is asked for." },
            { icon: "trendingUp", title: "Growth", body: "Expanding our impact in every market we enter." },
            { icon: "users", title: "Customers", body: "Delivering value people can measure." },
            { icon: "settings", title: "Excellence", body: "Driving efficiency and quality in equal measure." },
          ],
        }),
      ],
    }),

    // 08 ─ Business model
    slide({
      id: "business-model",
      name: "Our Business Model",
      layout: "stack",
      blocks: [
        heading({ title: "Our Business Model", subtitle: "How we create, deliver and capture value." }),
        processFlow({
          grow: 1,
          loopLabel: "Continuous Innovation",
          items: [
            { icon: "database", title: "Inputs", body: "Resources and expertise" },
            { icon: "settings", title: "Activities", body: "Develop, build and deliver" },
            { icon: "award", title: "Value", body: "Solutions customers rely on" },
            { icon: "users", title: "Customers", body: "Businesses and individuals" },
            { icon: "trendingUp", title: "Revenue", body: "Sustainable growth" },
          ],
        }),
      ],
    }),

    // 09 ─ Market position
    slide({
      id: "market-position",
      name: "Market Position",
      layout: "splitRight",
      split: 0.38,
      blocks: [
        heading({
          slot: "full",
          title: "Market Position",
          subtitle: "A strong position in a growing market.",
        }),
        statCards({
          slot: "main",
          style: { columns: 1 },
          items: [
            { icon: "globe", value: "$12B", label: "Total addressable market" },
            { icon: "pieChart", value: "25%", label: "Our market share" },
          ],
        }),
        scatter({
          slot: "aside",
          xAxis: { low: "Low cost", high: "High cost" },
          yAxis: { low: "Niche", high: "High quality" },
          points: [
            { label: "Our Company", x: 0.72, y: 0.82, highlight: true },
            { label: "Competitor A", x: 0.38, y: 0.55 },
            { label: "Competitor B", x: 0.24, y: 0.3 },
            { label: "Competitor C", x: 0.62, y: 0.42 },
            { label: "Competitor D", x: 0.45, y: 0.2 },
          ],
        }),
      ],
    }),

    // 10 ─ Growth story
    slide({
      id: "growth-story",
      name: "Our Growth Story",
      layout: "stack",
      blocks: [
        heading({ title: "Our Growth Story", subtitle: "Key milestones in our journey." }),
        timeline({
          grow: 1,
          items: [
            { icon: "flag", date: "2018", title: "Founded", body: "Three people and one product idea." },
            { icon: "rocket", date: "2019", title: "First launch", body: "Shipped to our first 100 customers." },
            { icon: "globe", date: "2021", title: "Global expansion", body: "Opened offices on three continents." },
            { icon: "users", date: "2023", title: "1M customers", body: "Crossed a million active accounts." },
            { icon: "award", date: "2024", title: "Industry leader", body: "Ranked first in category." },
          ],
        }),
      ],
    }),

    // 11 ─ Performance & analytics
    slide({
      id: "performance",
      name: "Performance & Analytics",
      layout: "splitRight",
      split: 0.6,
      blocks: [
        heading({
          slot: "full",
          title: "Performance & Analytics",
          subtitle: "The data behind our results.",
        }),
        chart({
          slot: "main",
          kind: "comboChart",
          categories: ["2020", "2021", "2022", "2023", "2024"],
          series: [
            { name: "Revenue", values: [48, 66, 88, 104, 152], accent: 1, kind: "bar" },
            { name: "Profit", values: [12, 21, 34, 46, 78], accent: 3, kind: "line" },
          ],
          yFormat: "currency",
        }),
        statCards({
          slot: "aside",
          style: { columns: 1 },
          items: [
            { icon: "trendingUp", value: "+68%", label: "Revenue growth" },
            { icon: "barChart", value: "+42%", label: "Profit increase" },
            { icon: "userCheck", value: "95%", label: "Customer retention" },
          ],
        }),
      ],
    }),

    // 12 ─ Global presence
    slide({
      id: "global-presence",
      name: "Global Presence",
      layout: "splitRight",
      split: 0.54,
      blocks: [
        heading({
          slot: "full",
          title: "Global Presence",
          subtitle: "Serving customers around the world.",
        }),
        image({
          slot: "main",
          prompt:
            "flat minimal world map illustration in soft blue tones on a light background, simple silhouette continents, no labels, no text",
        }),
        statCards({
          slot: "aside",
          style: { columns: 1 },
          items: [
            { icon: "globe", value: "50+", label: "Countries" },
            { icon: "building", value: "200+", label: "Global offices" },
            { icon: "users", value: "1M+", label: "Active users" },
          ],
        }),
      ],
    }),

    // 13 ─ Leadership team
    slide({
      id: "leadership",
      name: "Our Leadership Team",
      layout: "stack",
      blocks: [
        heading({ title: "Our Leadership Team", subtitle: "Experienced leaders driving our vision." }),
        teamCards({
          grow: 1,
          style: { columns: 3 },
          items: [
            {
              name: "Ahmed Khan",
              role: "CEO & Founder",
              bio: "Twenty years building technology businesses across three continents.",
              photoPrompt: "professional corporate headshot of a man in a navy suit, neutral studio background, soft lighting",
            },
            {
              name: "Sara Ahmed",
              role: "Chief Technology Officer",
              bio: "Leads product and engineering; previously scaled two platform businesses.",
              photoPrompt: "professional corporate headshot of a woman in business attire, neutral studio background, soft lighting",
            },
            {
              name: "Usman Raza",
              role: "Chief Operating Officer",
              bio: "Runs global operations and the company's expansion strategy.",
              photoPrompt: "professional corporate headshot of a man in a grey suit, neutral studio background, soft lighting",
            },
          ],
        }),
      ],
    }),

    // 14 ─ Roadmap
    slide({
      id: "roadmap",
      name: "Our Roadmap",
      layout: "stack",
      blocks: [
        heading({ title: "Our Roadmap", subtitle: "Key initiatives for the years ahead." }),
        roadmapPhases({
          grow: 1,
          items: [
            {
              icon: "flag",
              phase: "Now",
              period: "2024",
              points: ["Strengthen the core product", "Expand in key markets", "Deepen partnerships"],
            },
            {
              icon: "rocket",
              phase: "Next",
              period: "2025",
              points: ["Launch adjacent solutions", "Grow the customer base", "Improve operating efficiency"],
            },
            {
              icon: "target",
              phase: "Future",
              period: "2026+",
              points: ["Enter new regions", "Drive sustainable growth", "Become the category leader"],
            },
          ],
        }),
      ],
    }),

    // 15 ─ Next steps
    slide({
      id: "next-steps",
      name: "Next Steps",
      layout: "closing",
      background: {
        prompt:
          "modern corporate skyscraper against a clear sky at golden hour, upward perspective, warm light, no text, no logos",
        scrim: 0.66,
      },
      blocks: [
        heading({ title: "Next Steps", subtitle: "Let's build a stronger future together." }),
        checklist({
          items: [
            "Schedule a discovery call",
            "Explore tailored solutions",
            "Start your growth journey",
          ],
        }),
        cta({ label: "Get in Touch" }),
        contactFooter({
          slot: "footer",
          items: [
            { icon: "mail", label: "hello@company.com" },
            { icon: "phone", label: "+92 300 1234567" },
            { icon: "globe", label: "www.company.com" },
          ],
        }),
      ],
    }),
  ],
};
