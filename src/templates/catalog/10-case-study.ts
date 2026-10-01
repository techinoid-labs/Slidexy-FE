/**
 * 10 — Case Study
 *
 * Narrative arc: situation, intervention, result. Green/impact palette,
 * kicker rules, full-bleed quote and before/after comparison.
 */

import { impactGreen } from "../themes";
import type { SlideTemplate } from "../types";
import {
  bigStat,
  callout,
  chart,
  checklist,
  comparisonTable,
  contactFooter,
  cta,
  heading,
  iconBullets,
  iconGrid,
  image,
  imageGrid,
  metricRow,
  numbered,
  paragraph,
  processFlow,
  quote,
  slide,
  spotlight,
  statCards,
  timeline,
} from "./helpers";

export const caseStudy: SlideTemplate = {
  id: "case-study",
  number: 10,
  name: "Case Study",
  category: "Business",
  archetype: "casestudy",
  description: "Show real-world success stories.",
  theme: impactGreen,
  coverPrompt: "person reaching a summit at sunrise, green valley below, cinematic, no text",
  slides: [
    slide({
      id: "cover",
      name: "Cover",
      layout: "cover",
      background: {
        prompt: "hiker reaching a green mountain summit at sunrise, valley below, cinematic wide shot, no text, no logos",
        scrim: 0.6,
      },
      blocks: [
        heading({ kicker: "Case Study", title: "How Northwind cut delivery time by a third", subtitle: "A twelve-month transformation, in their words and ours." }),
        contactFooter({ slot: "footer", items: [{ icon: "leaf", label: "YOUR COMPANY" }] }),
      ],
    }),

    slide({
      id: "client",
      name: "The Client",
      layout: "splitRight",
      split: 0.54,
      blocks: [
        heading({
          slot: "full",
          kicker: "The client",
          title: "A 240-vehicle operator with an invisible problem",
          subtitle: "Profitable, growing, well run — and quietly losing a fifth of its margin to something no single report showed.",
        }),
        paragraph({ slot: "main", body: "Northwind is a mid-market logistics operator running 240 vehicles across four regions, serving retail and industrial customers." }),
        statCards({
          slot: "main",
          style: { columns: 2 },
          items: [
            { icon: "building", value: "240", label: "Vehicles" },
            { icon: "users", value: "1,100", label: "Employees" },
            { icon: "globe", value: "4", label: "Regions" },
            { icon: "calendar", value: "18 yrs", label: "In operation" },
          ],
        }),
        image({ slot: "aside", prompt: "logistics warehouse interior with racking and daylight, wide shot, no text" }),
      ],
    }),

    slide({
      id: "challenge",
      name: "The Challenge",
      layout: "splitLeft",
      split: 0.55,
      blocks: [
        heading({
          slot: "full",
          kicker: "The challenge",
          title: "One in five deliveries missed its window",
          subtitle: "Each depot had a plausible explanation. None of them was wrong, and none of them explained the whole number.",
        }),
        iconBullets({
          slot: "main",
          items: [
            { icon: "clock", label: "Missed delivery windows", body: "One in five arrived outside the promised slot." },
            { icon: "database", label: "No shared visibility", body: "Four systems, none of them agreeing." },
            { icon: "dollar", label: "Rising cost per drop", body: "Up 14% over two years with flat volume." },
          ],
        }),
        image({ slot: "aside", prompt: "delivery trucks queued at a depot in grey overcast light, slightly desaturated, no text" }),
      ],
    }),

    slide({
      id: "stakes",
      name: "What Was at Stake",
      layout: "stack",
      blocks: [
        heading({
          kicker: "The stakes",
          title: "Two contracts worth a third of revenue were up",
          subtitle: "Both renewals had on-time performance written into them. Twelve months was not a preference, it was the deadline.",
        }),
        iconGrid({
          grow: 1,
          style: { columns: 3 },
          items: [
            { icon: "handshake", title: "Two contracts up for renewal", body: "Worth 31% of annual revenue." },
            { icon: "trendingUp", title: "Margin compression", body: "Cost per drop rising faster than price." },
            { icon: "users", title: "Driver retention", body: "Churn at 28% and climbing." },
          ],
        }),
        callout({
          slot: "footer",
          icon: "flag",
          solid: true,
          statement: "Two renewals worth 31% of revenue, both with on-time clauses",
          detail: "Twelve months was not a preference. It was written into the contracts.",
        }),
      ],
    }),

    slide({
      id: "approach",
      name: "Our Approach",
      layout: "stack",
      blocks: [
        heading({ kicker: "Intervention", title: "Our Approach", subtitle: "Four phases over twelve months." }),
        processFlow({
          grow: 1,
          numbered: true,
          items: [
            { title: "Baseline", body: "Instrument every drop, honestly." },
            { title: "Consolidate", body: "One system of record for routing." },
            { title: "Automate", body: "Dynamic routing replacing manual plans." },
            { title: "Embed", body: "Train dispatch and hand over." },
          ],
        }),
      ],
    }),

    slide({
      id: "solution",
      name: "What We Built",
      layout: "splitRight",
      split: 0.52,
      blocks: [
        heading({ slot: "full", title: "What We Built" }),
        iconBullets({
          slot: "main",
          items: [
            { icon: "database", label: "Unified operations data", body: "Telematics, orders and dispatch in one model." },
            { icon: "bolt", label: "Dynamic routing", body: "Re-planned continuously, not once each morning." },
            { icon: "barChart", label: "Live performance view", body: "Window adherence visible to every depot." },
          ],
        }),
        image({ slot: "aside", prompt: "logistics control room with large screens showing maps and routes, no readable text" }),
      ],
    }),

    slide({
      id: "timeline",
      name: "Timeline",
      layout: "stack",
      blocks: [
        heading({
          kicker: "Timeline",
          title: "Twelve months, four phases, two false starts",
          subtitle: "The dates below are what happened, including the month we spent rebuilding a baseline we got wrong the first time.",
        }),
        timeline({
          grow: 1,
          items: [
            { icon: "search", date: "Month 1", title: "Baseline", body: "Instrumented every drop." },
            { icon: "database", date: "Month 3", title: "Consolidated", body: "One system of record live." },
            { icon: "bolt", date: "Month 7", title: "Automated", body: "Dynamic routing in two regions." },
            { icon: "globe", date: "Month 10", title: "Scaled", body: "All four regions." },
            { icon: "graduation", date: "Month 12", title: "Handover", body: "Run entirely in-house." },
          ],
        }),
      ],
    }),

    slide({
      id: "before-after",
      name: "Before & After",
      layout: "fullBleed",
      blocks: [
        heading({ title: "Before & After", subtitle: "Measured against the month-one baseline." }),
        comparisonTable({
          grow: 1,
          columns: [{ label: "Before" }, { label: "After", highlight: true }, { label: "Change" }],
          rows: [
            { label: "On-time delivery", cells: ["79%", "94%", "+15 pts"] },
            { label: "Average cycle time", cells: ["4.2 days", "2.8 days", "-33%"] },
            { label: "Cost per drop", cells: ["$18.40", "$14.10", "-23%"] },
            { label: "Driver churn", cells: ["28%", "16%", "-12 pts"] },
            { label: "Dispatch headcount", cells: ["22", "22", "unchanged"] },
          ],
        }),
      ],
    }),

    slide({
      id: "results",
      name: "The Results",
      layout: "stack",
      blocks: [
        heading({ kicker: "Outcome", title: "The Results", subtitle: "Twelve months after kickoff." }),
        statCards({
          grow: 1,
          style: { columns: 4 },
          items: [
            { icon: "clock", value: "-33%", label: "Delivery cycle time" },
            { icon: "checkCircle", value: "94%", label: "On-time rate", delta: "from 79%" },
            { icon: "dollar", value: "$2.1M", label: "Annual saving" },
            { icon: "users", value: "-12 pts", label: "Driver churn" },
          ],
        }),
      ],
    }),

    slide({
      id: "trend",
      name: "Performance Over Time",
      layout: "splitRight",
      split: 0.62,
      blocks: [
        heading({ slot: "full", title: "Performance Over Time" }),
        chart({
          slot: "main",
          kind: "comboChart",
          categories: ["M1", "M3", "M5", "M7", "M9", "M12"],
          series: [
            { name: "On-time %", values: [79, 82, 86, 89, 92, 94], accent: 1, kind: "line" },
            { name: "Cost per drop", values: [18.4, 18.0, 17.1, 16.0, 15.0, 14.1], accent: 4, kind: "bar" },
          ],
        }),
        checklist({
          slot: "aside",
          items: ["Improvement held for six months", "No increase in headcount", "Both renewals secured"],
        }),
      ],
    }),

    slide({
      id: "quote",
      name: "In Their Words",
      layout: "fullBleed",
      blocks: [
        heading({ title: "In Their Words" }),
        quote({
          grow: 1,
          quote: "We had tried to fix this twice before with new software. What was different this time was starting with an honest baseline — it showed us the problem was not the routing tool at all.",
          author: "Daniel Okafor",
          role: "Operations Director, Northwind",
          avatarPrompt: "professional headshot of a man in business casual, soft natural lighting, neutral background",
        }),
      ],
    }),

    slide({
      id: "why-worked",
      name: "Why It Worked",
      layout: "stack",
      blocks: [
        heading({
          kicker: "What worked",
          title: "Three decisions that made the difference",
          subtitle: "None of them were technical. The technology was the easy part of this engagement.",
        }),
        iconGrid({
          grow: 1,
          style: { columns: 3 },
          items: [
            { icon: "search", title: "Honest baseline first", body: "Nothing was changed until the numbers were trusted." },
            { icon: "users", title: "Dispatch led the design", body: "The people doing the work set the rules." },
            { icon: "refresh", title: "Shipped in increments", body: "Two regions proved it before all four." },
          ],
        }),
        callout({
          slot: "footer",
          icon: "search",
          statement: "The honest baseline was the whole engagement",
          detail: "Two previous attempts failed because they started by buying software instead of measuring the problem.",
        }),
      ],
    }),

    slide({
      id: "lessons",
      name: "Lessons",
      layout: "stack",
      blocks: [
        heading({ title: "What We Would Do Differently", subtitle: "Being straight about the hard parts." }),
        iconBullets({
          grow: 1,
          style: { columns: 2 },
          items: [
            { icon: "clock", label: "Baseline took longer", body: "Six weeks, not three. Data access was the bottleneck." },
            { icon: "users", label: "Training started late", body: "Dispatch should have been involved from month one." },
          ],
        }),
        callout({
          slot: "footer",
          icon: "clock",
          statement: "We got the baseline wrong the first time",
          detail: "Six weeks instead of three, and we rebuilt it. Reporting that is more useful to you than a clean story.",
        }),
      ],
    }),

    slide({
      id: "applicability",
      name: "Could This Work for You?",
      layout: "stack",
      blocks: [
        heading({
          kicker: "Applicability",
          title: "Three conditions that made this work",
          subtitle: "If you have all three, this is repeatable. If you are missing one, we would tell you before taking the engagement.",
        }),
        imageGrid({
          grow: 1,
          style: { columns: 3 },
          items: [
            { icon: "database", title: "You have the data", body: "Even messy data is enough to baseline.", prompt: "abstract data visualisation in green tones, clean, no text" },
            { icon: "users", title: "Operations will engage", body: "The people doing the work must shape it.", prompt: "team in discussion in an operations office, candid, no text" },
            { icon: "calendar", title: "You have two quarters", body: "Enough time to prove it before scaling.", prompt: "wall calendar and planning board, soft light, no readable text" },
          ],
        }),
      ],
    }),

    slide({
      id: "cta",
      name: "Talk to Us",
      layout: "closing",
      background: {
        prompt: "wide green valley at sunrise with soft mist, hopeful and calm, cinematic, no text, no logos",
        scrim: 0.58,
      },
      blocks: [
        heading({ title: "Let's look at your numbers", subtitle: "We start every engagement with a baseline, not a pitch." }),
        cta({ label: "Request a Baseline Review" }),
        contactFooter({
          slot: "footer",
          items: [
            { icon: "mail", label: "hello@yourcompany.com" },
            { icon: "globe", label: "yourcompany.com/case-studies" },
          ],
        }),
      ],
    }),
  ],
};
