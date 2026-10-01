/**
 * 08 — Annual / Quarterly Report
 *
 * Data-forward and deliberately plain: graphite palette, mono numerals,
 * square corners, side-bar headings, charts on most slides.
 */

import { reportGraphite } from "../themes";
import type { SlideTemplate } from "../types";
import {
  bigStat,
  callout,
  chart,
  checklist,
  comparisonTable,
  contactFooter,
  donut,
  heading,
  iconBullets,
  iconGrid,
  metricRow,
  numbered,
  paragraph,
  quote,
  roadmapPhases,
  slide,
  spotlight,
  statCards,
  timeline,
} from "./helpers";

export const annualReport: SlideTemplate = {
  id: "annual-report",
  number: 8,
  name: "Annual Report",
  category: "Reports",
  archetype: "report",
  description: "Share progress and performance.",
  theme: reportGraphite,
  coverPrompt: "minimal architectural lines in grey and white, high key, no text",
  slides: [
    slide({
      id: "cover",
      name: "Cover",
      layout: "cover",
      blocks: [
        heading({ kicker: "Annual Report", title: "FY2026 in review", subtitle: "Performance, progress and priorities for the year ahead." }),
        contactFooter({
          slot: "footer",
          items: [
            { icon: "calendar", label: "Published October 2026" },
            { icon: "building", label: "YOUR COMPANY" },
          ],
        }),
      ],
    }),

    slide({
      id: "highlights",
      name: "Year Highlights",
      layout: "stack",
      blocks: [
        heading({
          kicker: "FY2026",
          title: "The year growth and discipline finally moved together",
          subtitle: "Revenue up 46% with margin up five points. Every prior year of growth cost us margin to buy.",
        }),
        statCards({
          grow: 1,
          style: { columns: 4 },
          items: [
            { icon: "dollar", value: "$152M", label: "Revenue", delta: "+46% YoY" },
            { icon: "trendingUp", value: "24%", label: "Operating margin", delta: "+5 pts" },
            { icon: "users", value: "1.2M", label: "Customers", delta: "+31%" },
            { icon: "globe", value: "28", label: "Markets", delta: "+6" },
          ],
        }),
        callout({
          slot: "footer",
          icon: "trendingUp",
          solid: true,
          statement: "First year we grew revenue and margin together",
          detail: "Every prior year of growth cost us margin to buy. This one did not.",
        }),
      ],
    }),

    slide({
      id: "letter",
      name: "Letter from the CEO",
      layout: "splitRight",
      split: 0.6,
      blocks: [
        heading({ slot: "full", title: "From the Chief Executive" }),
        paragraph({
          slot: "main",
          body: "This was the year the business moved from growth at any cost to growth with discipline. Revenue rose 46% while operating margin improved five points — the first time we have done both at once.",
        }),
        paragraph({
          slot: "main",
          body: "The priorities for the year ahead are unchanged: deepen the core product, enter two new markets, and keep cost of delivery falling as volume rises.",
        }),
        quote({
          slot: "aside",
          quote: "Discipline did not slow us down. It is what let us grow this fast without breaking anything.",
          author: "A. Khan",
          role: "Chief Executive",
          avatarPrompt: "professional corporate headshot, neutral grey studio background",
        }),
      ],
    }),

    slide({
      id: "revenue",
      name: "Revenue",
      layout: "splitRight",
      split: 0.62,
      blocks: [
        heading({ slot: "full", title: "Revenue", subtitle: "Five-year trajectory." }),
        chart({
          slot: "main",
          kind: "comboChart",
          categories: ["2022", "2023", "2024", "2025", "2026"],
          series: [
            { name: "Revenue", values: [34, 52, 78, 104, 152], accent: 2, kind: "bar" },
            { name: "Gross profit", values: [18, 29, 46, 64, 98], accent: 3, kind: "line" },
          ],
          yFormat: "currency",
        }),
        statCards({
          slot: "aside",
          style: { columns: 1 },
          items: [
            { icon: "trendingUp", value: "46%", label: "Revenue growth" },
            { icon: "pieChart", value: "64%", label: "Gross margin" },
            { icon: "refresh", value: "118%", label: "Net revenue retention" },
          ],
        }),
      ],
    }),

    slide({
      id: "segments",
      name: "Revenue by Segment",
      layout: "splitRight",
      split: 0.52,
      blocks: [
        heading({ slot: "full", title: "Revenue by Segment" }),
        donut({
          slot: "main",
          centerValue: "$152M",
          centerLabel: "Total",
          items: [
            { label: "Enterprise", value: 46 },
            { label: "Mid-market", value: 31 },
            { label: "Self-serve", value: 15 },
            { label: "Services", value: 8 },
          ],
        }),
        iconBullets({
          slot: "aside",
          style: { compact: true },
          items: [
            { icon: "building", label: "Enterprise led growth", body: "Up 58%, now the largest segment." },
            { icon: "users", label: "Self-serve stabilised", body: "Lower volume, materially better retention." },
          ],
        }),
      ],
    }),

    slide({
      id: "geography",
      name: "Performance by Region",
      layout: "stack",
      blocks: [
        heading({
          kicker: "Geography",
          title: "Every region grew, which is the point",
          subtitle: "Concentration risk was the board's main concern last year. No single region now accounts for more than 44% of revenue.",
        }),
        chart({
          grow: 1,
          kind: "barChart",
          categories: ["North America", "Europe", "Asia Pacific", "Middle East", "Latin America"],
          series: [
            { name: "FY2025", values: [48, 29, 16, 7, 4], accent: 1 },
            { name: "FY2026", values: [66, 44, 26, 11, 5], accent: 2 },
          ],
          yFormat: "currency",
        }),
      ],
    }),

    slide({
      id: "operations",
      name: "Operational Metrics",
      layout: "stack",
      blocks: [
        heading({
          kicker: "Operations",
          title: "Cost to serve fell 28% while volume rose 31%",
          subtitle: "The platform rebuild is the reason. It is also why capital expenditure was unusually high this year.",
        }),
        statCards({
          grow: 1,
          style: { columns: 3 },
          items: [
            { icon: "clock", value: "-28%", label: "Cost to serve per customer" },
            { icon: "checkCircle", value: "99.97%", label: "Platform uptime" },
            { icon: "users", value: "4.6", label: "Customer satisfaction (of 5)" },
          ],
        }),
        callout({
          slot: "footer",
          icon: "settings",
          statement: "Cost to serve fell 28% while volume rose 31%",
          detail: "The platform rebuild is the cause, and also why capital expenditure was unusually high this year.",
        }),
      ],
    }),

    slide({
      id: "customers",
      name: "Customer Growth",
      layout: "splitRight",
      split: 0.6,
      blocks: [
        heading({ slot: "full", title: "Customer Growth" }),
        chart({
          slot: "main",
          kind: "lineChart",
          categories: ["Q1", "Q2", "Q3", "Q4"],
          series: [
            { name: "New customers", values: [62, 78, 94, 121], accent: 2 },
            { name: "Churned", values: [11, 10, 9, 8], accent: 4 },
          ],
          yFormat: "compact",
        }),
        checklist({
          slot: "aside",
          items: ["Churn down four quarters running", "Expansion revenue up 2.1x", "Enterprise logos up 58%"],
        }),
      ],
    }),

    slide({
      id: "people",
      name: "Our People",
      layout: "stack",
      blocks: [
        heading({
          kicker: "People",
          title: "640 people, and attrition at a four-year low",
          subtitle: "We added 180 roles while voluntary attrition fell to 9%, which is the first time those two have moved in opposite directions.",
        }),
        statCards({
          grow: 1,
          style: { columns: 4 },
          items: [
            { icon: "users", value: "640", label: "Employees", delta: "+180" },
            { icon: "globe", value: "19", label: "Countries" },
            { icon: "heart", value: "88%", label: "Engagement score" },
            { icon: "refresh", value: "9%", label: "Voluntary attrition" },
          ],
        }),
      ],
    }),

    slide({
      id: "sustainability",
      name: "Sustainability",
      layout: "stack",
      blocks: [
        heading({
          kicker: "Sustainability",
          title: "On track for 2030, behind on one commitment",
          subtitle: "Emissions and renewables are ahead of plan. Supply-chain reporting is not, and we have moved its deadline rather than quietly dropped it.",
        }),
        iconGrid({
          grow: 1,
          style: { columns: 3 },
          items: [
            { icon: "leaf", title: "Emissions", body: "Scope 1 and 2 down 34% against the 2022 baseline." },
            { icon: "cloud", title: "Renewable energy", body: "81% of operations on renewable supply." },
            { icon: "users", title: "Community", body: "12,000 volunteer hours contributed." },
          ],
        }),
        callout({
          slot: "footer",
          icon: "leaf",
          statement: "On track for 2030, behind on supply-chain reporting",
          detail: "We have moved that deadline publicly rather than quietly dropping the commitment.",
        }),
      ],
    }),

    slide({
      id: "risks",
      name: "Risks",
      layout: "fullBleed",
      blocks: [
        heading({ title: "Principal Risks", subtitle: "What we are watching, and our response." }),
        comparisonTable({
          grow: 1,
          columns: [{ label: "Likelihood" }, { label: "Impact" }, { label: "Mitigated", highlight: true }],
          rows: [
            { label: "Market concentration", cells: ["Medium", "High", "partial"] },
            { label: "Regulatory change", cells: ["Medium", "Medium", "yes"] },
            { label: "Key talent retention", cells: ["Low", "High", "yes"] },
            { label: "Supply chain", cells: ["Low", "Medium", "yes"] },
            { label: "Cyber security", cells: ["Medium", "High", "partial"] },
          ],
        }),
      ],
    }),

    slide({
      id: "financials",
      name: "Financial Summary",
      layout: "stack",
      blocks: [
        heading({
          kicker: "Financials",
          title: "The full picture, year on year",
          subtitle: "Free cash flow tripled, which matters more than the revenue line for what we can fund next year without raising.",
        }),
        comparisonTable({
          grow: 1,
          columns: [{ label: "FY2025" }, { label: "FY2026", highlight: true }, { label: "Change" }],
          rows: [
            { label: "Revenue", cells: ["$104M", "$152M", "+46%"] },
            { label: "Gross profit", cells: ["$64M", "$98M", "+53%"] },
            { label: "Operating margin", cells: ["19%", "24%", "+5 pts"] },
            { label: "Free cash flow", cells: ["$9M", "$27M", "+200%"] },
            { label: "Cash position", cells: ["$68M", "$95M", "+40%"] },
          ],
        }),
      ],
    }),

    slide({
      id: "outlook",
      name: "Outlook",
      layout: "stack",
      blocks: [
        heading({
          kicker: "Outlook",
          title: "Two halves, four commitments",
          subtitle: "Deliberately short. We would rather commit to four things publicly than list twenty and report on none.",
        }),
        roadmapPhases({
          grow: 1,
          items: [
            { icon: "target", phase: "H1", period: "FY2027", points: ["Enter two new markets", "Ship the platform rebuild", "Hold margin at 24%"] },
            { icon: "trendingUp", phase: "H2", period: "FY2027", points: ["Scale enterprise motion", "Lower cost to serve a further 15%"] },
          ],
        }),
      ],
    }),

    slide({
      id: "guidance",
      name: "Guidance",
      layout: "splitRight",
      split: 0.55,
      blocks: [
        heading({ slot: "full", title: "FY2027 Guidance" }),
        chart({
          slot: "main",
          kind: "barChart",
          categories: ["FY2026 actual", "FY2027 low", "FY2027 high"],
          series: [{ name: "Revenue", values: [152, 196, 218], accent: 2 }],
          yFormat: "currency",
        }),
        statCards({
          slot: "aside",
          style: { columns: 1 },
          items: [
            { icon: "trendingUp", value: "29–43%", label: "Revenue growth" },
            { icon: "pieChart", value: "24–26%", label: "Operating margin" },
          ],
        }),
      ],
    }),

    slide({
      id: "close",
      name: "Thank You",
      layout: "closing",
      blocks: [
        heading({ title: "Thank you", subtitle: "To our customers, our people and our shareholders." }),
        timeline({
          items: [
            { icon: "flag", date: "FY2024", title: "Scaled" },
            { icon: "trendingUp", date: "FY2026", title: "Profitable growth" },
            { icon: "globe", date: "FY2027", title: "International" },
          ],
        }),
        contactFooter({
          slot: "footer",
          items: [
            { icon: "mail", label: "investors@yourcompany.com" },
            { icon: "globe", label: "yourcompany.com/investors" },
          ],
        }),
      ],
    }),
  ],
};
