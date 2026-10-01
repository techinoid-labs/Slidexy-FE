/**
 * 01 — Business & Corporate
 *
 * Reference template for content density and visual range. Each content slide
 * carries roughly 80–120 words rather than three short bullets, and leans on
 * the visual blocks — oversized figures, accent bands, overlapping spotlight
 * cards, ghost numerals — so no two slides are built the same way.
 *
 * Image prompts are written for the backend pipeline: subject, then
 * treatment, then a no-text qualifier, since generators render type badly.
 */

import { corporateNavy } from "../themes";
import type { SlideTemplate } from "../types";
import {
  bigStat,
  callout,
  chart,
  checklist,
  contactFooter,
  cta,
  heading,
  iconBullets,
  iconGrid,
  image,
  metricRow,
  numbered,
  paragraph,
  pillars,
  processFlow,
  roadmapPhases,
  scatter,
  slide,
  spotlight,
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
        scrim: 0.64,
      },
      blocks: [
        heading({
          kicker: "Company Overview 2026",
          title: "Building what the next decade runs on",
          subtitle:
            "Ten years of compounding work, 1.2 million customers, and a plan for the three markets we enter next.",
        }),
        contactFooter({
          slot: "footer",
          items: [
            { icon: "building", label: "YOUR COMPANY" },
            { icon: "calendar", label: "October 2026" },
          ],
        }),
      ],
    }),

    // 02 ─ At a glance
    slide({
      id: "at-a-glance",
      name: "Company at a Glance",
      layout: "splitRight",
      split: 0.54,
      blocks: [
        heading({
          slot: "full",
          kicker: "Who we are",
          title: "Company at a Glance",
          subtitle:
            "Founded in 2016 to solve one operational problem, now serving customers in twenty countries across four industries.",
        }),
        statCards({
          slot: "main",
          style: { columns: 2 },
          items: [
            { icon: "calendar", value: "10+", label: "Years in operation", delta: "profitable since 2021" },
            { icon: "users", value: "640", label: "People across 19 countries", delta: "+180 this year" },
            { icon: "globe", value: "20+", label: "Markets served", delta: "6 added in 2026" },
            { icon: "heart", value: "1.2M", label: "Customers using us weekly", delta: "+31% YoY" },
          ],
        }),
        spotlight({
          slot: "aside",
          prompt:
            "bright modern open-plan office interior with glass partitions and daylight, people out of focus, architectural photography, no text",
          stat: { value: "94%", label: "Would recommend us" },
          cardTitle: "Built on retention",
          cardBody: "Nine in ten customers from our first three years are still with us today.",
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
        heading({ slot: "main", kicker: "Our story", title: "Why we exist" }),
        paragraph({
          slot: "main",
          body:
            "We started because the tools our founders needed did not exist. Every option was either built for enterprises with implementation teams, or so simple it fell over in the second month. We built the middle.",
        }),
        iconBullets({
          slot: "main",
          style: { compact: true },
          items: [
            {
              icon: "target",
              label: "Problem first, always",
              body: "Every product line started from a customer problem we could describe in one sentence.",
            },
            {
              icon: "globe",
              label: "Local, not translated",
              body: "Teams on the ground in every region we sell into, not a localisation layer.",
            },
            {
              icon: "shield",
              label: "Built to be relied on",
              body: "99.97% uptime over the last three years, with no unplanned data loss.",
            },
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
        heading({
          kicker: "What we stand for",
          title: "Mission · Vision · Values",
          subtitle: "Three statements we actually use to settle arguments.",
        }),
        iconGrid({
          grow: 1,
          style: { columns: 3 },
          items: [
            {
              icon: "target",
              title: "Our Mission",
              body: "Make operational software that a team can adopt in a week and still be using in a decade — without a consultant in the room.",
            },
            {
              icon: "lightbulb",
              title: "Our Vision",
              body: "A market where buying good infrastructure is not a privilege reserved for the largest companies in the sector.",
            },
            {
              icon: "award",
              title: "Our Values",
              body: "Integrity before growth, collaboration before heroics, invention before imitation, and people before any of it.",
            },
          ],
        }),
        callout({
          icon: "users",
          statement: "Decisions get made by the people closest to the work",
          detail:
            "Every value above is enforced by one rule: if you are accountable for an outcome, you choose how it is delivered.",
        }),
      ],
    }),

    // 05 ─ Snapshot
    slide({
      id: "snapshot",
      name: "Business Snapshot",
      layout: "splitRight",
      split: 0.46,
      blocks: [
        heading({
          slot: "full",
          kicker: "Performance",
          title: "Business Snapshot",
          subtitle:
            "Revenue grew 46% while operating margin improved five points — the first year we have done both at once.",
        }),
        bigStat({
          slot: "main",
          value: "$152M",
          label: "Annual recurring revenue",
          body:
            "Up from $104M last year, with 64% of growth coming from existing customers expanding rather than new logos.",
        }),
        chart({
          slot: "aside",
          kind: "comboChart",
          categories: ["2022", "2023", "2024", "2025", "2026"],
          series: [
            { name: "Revenue", values: [34, 52, 78, 104, 152], accent: 1, kind: "bar" },
            { name: "Gross profit", values: [18, 29, 46, 64, 98], accent: 3, kind: "line" },
          ],
          yFormat: "currency",
        }),
        metricRow({
          slot: "footer",
          items: [
            { value: "24%", label: "Operating margin" },
            { value: "118%", label: "Net revenue retention" },
            { value: "64%", label: "Gross margin" },
            { value: "$27M", label: "Free cash flow" },
          ],
        }),
      ],
    }),

    // 06 ─ What we do
    slide({
      id: "what-we-do",
      name: "What We Do",
      layout: "splitLeft",
      split: 0.58,
      blocks: [
        heading({
          slot: "full",
          kicker: "Our offering",
          title: "What We Do",
          subtitle: "Four practices that are sold separately and almost always bought together.",
        }),
        iconBullets({
          slot: "main",
          style: { columns: 2 },
          items: [
            {
              icon: "briefcase",
              label: "Consulting",
              body: "Operating model and process design, delivered by people who have run the function themselves.",
            },
            {
              icon: "cpu",
              label: "Technology",
              body: "Implementation and integration against your existing stack — no rip and replace.",
            },
            {
              icon: "settings",
              label: "Operations",
              body: "Managed running of the processes we build, with published service levels.",
            },
            {
              icon: "shield",
              label: "Support",
              body: "Named engineers, four-hour response, and a quarterly review that is not a sales call.",
            },
          ],
        }),
        image({
          slot: "aside",
          prompt:
            "minimal desk scene with laptop, notebook and a plant beside a bright window, soft natural light, top-down, no text",
        }),
      ],
    }),

    // 07 ─ Pillars
    slide({
      id: "pillars",
      name: "Our Strategic Pillars",
      layout: "stack",
      blocks: [
        heading({
          kicker: "Strategy",
          title: "Our Strategic Pillars",
          subtitle: "Where the next three years of investment goes, in priority order.",
        }),
        pillars({
          grow: 1,
          items: [
            { icon: "lightbulb", title: "Innovation", body: "Twenty per cent of engineering on problems no customer has asked for yet." },
            { icon: "trendingUp", title: "Growth", body: "Two new markets a year, entered properly rather than tested." },
            { icon: "users", title: "Customers", body: "Expansion revenue as the primary growth engine, not new logos." },
            { icon: "settings", title: "Excellence", body: "Cost to serve falling every quarter while volume rises." },
          ],
        }),
      ],
    }),

    // 08 ─ Business model
    slide({
      id: "business-model",
      name: "Our Business Model",
      layout: "fullBleed",
      blocks: [
        heading({
          kicker: "How it works",
          title: "Our Business Model",
          subtitle: "How we create, deliver and capture value — and why the loop compounds.",
        }),
        processFlow({
          grow: 1,
          loopLabel: "Every cycle lowers the cost of the next one",
          items: [
            { icon: "database", title: "Inputs", body: "Domain expertise and operational data" },
            { icon: "settings", title: "Activities", body: "Design, build and run" },
            { icon: "award", title: "Value", body: "Measurable cost and cycle-time reduction" },
            { icon: "users", title: "Customers", body: "Operators who renew and expand" },
            { icon: "trendingUp", title: "Revenue", body: "Recurring, with 118% net retention" },
          ],
        }),
      ],
    }),

    // 09 ─ Market position
    slide({
      id: "market-position",
      name: "Market Position",
      layout: "splitRight",
      split: 0.4,
      blocks: [
        heading({
          slot: "full",
          kicker: "The market",
          title: "Market Position",
          subtitle: "A twelve-billion-dollar market where the top four vendors still hold under half of it.",
        }),
        bigStat({
          slot: "main",
          value: "25%",
          label: "Share of our serviceable market",
          body: "Up from 14% three years ago, taken almost entirely from incumbents rather than from market growth.",
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
        heading({
          kicker: "Milestones",
          title: "Our Growth Story",
          subtitle: "Six moments that changed the shape of the business.",
        }),
        timeline({
          grow: 1,
          items: [
            { icon: "flag", date: "2018", title: "Founded", body: "Three people, one product idea, one customer." },
            { icon: "rocket", date: "2019", title: "First launch", body: "Shipped to the first hundred paying customers." },
            { icon: "globe", date: "2021", title: "Global expansion", body: "Offices opened on three continents." },
            { icon: "users", date: "2023", title: "One million users", body: "Crossed a million weekly active accounts." },
            { icon: "award", date: "2026", title: "Category leader", body: "Ranked first on both capability and support." },
          ],
        }),
      ],
    }),

    // 11 ─ Performance
    slide({
      id: "performance",
      name: "Performance & Analytics",
      layout: "splitRight",
      split: 0.58,
      blocks: [
        heading({
          slot: "full",
          kicker: "The numbers",
          title: "Performance & Analytics",
          subtitle: "Growth and efficiency moved in the same direction for the first time.",
        }),
        chart({
          slot: "main",
          kind: "comboChart",
          categories: ["2022", "2023", "2024", "2025", "2026"],
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
            { icon: "trendingUp", value: "+68%", label: "Revenue growth", delta: "third year above 40%" },
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
      layout: "splitLeft",
      split: 0.52,
      blocks: [
        heading({
          slot: "full",
          kicker: "Where we operate",
          title: "Global Presence",
          subtitle: "Twenty markets, entered one at a time, each with local people before local customers.",
        }),
        numbered({
          slot: "main",
          items: [
            { title: "North America", body: "Our largest region at 44% of revenue, and still growing 38% a year." },
            { title: "Europe", body: "Fastest growing at 52%, driven almost entirely by regulated industries." },
            { title: "Asia Pacific", body: "Newest region, profitable within eleven months of opening." },
          ],
        }),
        image({
          slot: "aside",
          prompt:
            "flat minimal world map illustration in soft blue tones on a light background, simple silhouette continents, no labels, no text",
        }),
      ],
    }),

    // 13 ─ Leadership
    slide({
      id: "leadership",
      name: "Our Leadership Team",
      layout: "stack",
      blocks: [
        heading({
          kicker: "The people",
          title: "Our Leadership Team",
          subtitle: "Operators first. Between them, four decades of running the functions we now sell into.",
        }),
        teamCards({
          grow: 1,
          style: { columns: 3 },
          items: [
            {
              name: "Ahmed Khan",
              role: "CEO & Founder",
              bio: "Twenty years building technology businesses across three continents. Previously founded and sold a logistics platform.",
              photoPrompt: "professional corporate headshot of a man in a navy suit, neutral studio background, soft lighting",
            },
            {
              name: "Sara Ahmed",
              role: "Chief Technology Officer",
              bio: "Leads product and engineering. Scaled two platform businesses past a million users before joining.",
              photoPrompt: "professional corporate headshot of a woman in business attire, neutral studio background, soft lighting",
            },
            {
              name: "Usman Raza",
              role: "Chief Operating Officer",
              bio: "Runs global operations and expansion. Opened eleven of our twenty markets personally.",
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
        heading({
          kicker: "What's next",
          title: "Our Roadmap",
          subtitle: "Committed work, likely work, and the direction beyond it.",
        }),
        roadmapPhases({
          grow: 1,
          items: [
            {
              icon: "flag",
              phase: "Now",
              period: "2026",
              points: [
                "Ship the platform rebuild to all regions",
                "Hold operating margin at 24% through the migration",
                "Close the two renewals worth 31% of revenue",
              ],
            },
            {
              icon: "rocket",
              phase: "Next",
              period: "2027",
              points: [
                "Enter two new markets with local teams first",
                "Launch the adjacent product line already in beta",
                "Take cost to serve down a further 15%",
              ],
            },
            {
              icon: "target",
              phase: "Future",
              period: "2028+",
              points: ["Category leadership on capability and support", "Expansion revenue as the primary growth engine"],
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
        scrim: 0.68,
      },
      blocks: [
        heading({
          kicker: "Where we go from here",
          title: "Let's build the next decade together",
          subtitle: "Three ways to start, none of which require a procurement process.",
        }),
        checklist({
          style: { columns: 1 },
          items: [
            "A ninety-minute discovery session with your operations lead",
            "A baseline review of your current cost to serve, at no cost",
            "A scoped pilot in one region, live inside a quarter",
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
