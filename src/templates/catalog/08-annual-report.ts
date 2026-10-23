/**
 * 08. Annual Report
 *
 * DEVICE: objects that measure. Terrain, columns, pie wedges and
 * stacked discs, in one teal, on paper.
 * 
 * DENSITY: editorial. A serif display against a plain text face, very
 * quiet bands behind, and nothing on a slide that is not a figure or the
 * sentence explaining it.
 *
 * COMPOSITIONS: hero, band, chart, split, quote, people.
 * Every template shares the frame, and draws a different sequence from
 * it, so no two decks run the same shapes in the same order.
 */

import { reportGraphite } from "../themes";
import type { SlideTemplate } from "../types";
import {
  chart,
  contactFooter,
  heading,
  iso3d,
  metricRow,
  paragraph,
  quote,
  slide,
  teamCards,
} from "./helpers";

export const annualReport: SlideTemplate = {
  id: "annual-report",
  number: 8,
  name: "Annual Report",
  category: "Reports",
  archetype: "report",
  description: "Paper white and a serif display, figures given room to be read.",
  theme: reportGraphite,
  slides: [
    slide({
      id: "cover",
      name: "Cover",
      layout: "hero",
      motif: "meshBands",
      split: 0.5,
      blocks: [
        heading({ slot: "full", kicker: "Annual Report", title: "The year in figures" }),
        paragraph({ slot: "main", body: "Twelve months of trading, the decisions behind the numbers, and an honest account of the two that did not work." }),
        metricRow({
          slot: "main",
          items: [
            { value: "£1.21B", label: "Revenue" },
            { value: "18.9%", label: "Margin" },
            { value: "11,200", label: "People" },
          ],
        }),
        iso3d({ slot: "aside", scale: 400, items: [{ asset: "terrain", title: "", accent: 1 }] }),
        contactFooter({ slot: "footer", items: [{ label: "ANNUAL REPORT" }, { label: "2026" }] }),
      ],
    }),

    slide({
      id: "contents",
      name: "Contents",
      layout: "band",
      motif: "meshBands",
      blocks: [
        heading({ slot: "full", kicker: "Contents", title: "In this report" }),
        iso3d({
          slot: "main",
          divided: true,
          scale: 56,
          style: { columns: 4 },
          items: [
            {
              asset: "tower",
              value: "01",
              title: "Performance",
              body: "Revenue, margin and cash across the four divisions",
              accent: 1,
            },
            {
              asset: "pieWedge",
              value: "02",
              title: "Where it came from",
              body: "The mix by region, product and channel",
              accent: 1,
            },
            {
              asset: "coinStack",
              value: "03",
              title: "Where it went",
              body: "Cost, capital expenditure and what we returned",
              accent: 1,
            },
            {
              asset: "arrow",
              value: "04",
              title: "The year ahead",
              body: "Guidance, and the assumptions it depends on",
              accent: 1,
            },
          ],
        }),
        contactFooter({ slot: "footer", items: [{ label: "02" }] }),
      ],
    }),

    slide({
      id: "headline",
      name: "Headline",
      layout: "stack",
      motif: "none",
      invert: true,
      blocks: [
        heading({ kicker: "Headline", title: "Five years of trading" }),
        chart({
          grow: 1,
          kind: "comboChart",
          categories: ["2022","2023","2024","2025","2026"],
          series: [
            { name: "Revenue", values: [0.94,1.01,1.06,1.13,1.21], accent: 1 },
            { name: "Operating margin", values: [14.1,15.2,16.8,17.5,18.9], accent: 3 },
          ],
          yFormat: "currency",
          caption: "Audited, prepared under IFRS, twelve months to 31 December.",
        }),
        contactFooter({ slot: "footer", items: [{ label: "03" }] }),
      ],
    }),

    slide({
      id: "mix",
      name: "Revenue mix",
      layout: "stack",
      motif: "meshBands",
      blocks: [
        heading({ kicker: "Revenue mix", title: "Where the money came from" }),
        chart({
          grow: 1,
          kind: "barChart",
          categories: ["Europe","Americas","Rest of world"],
          series: [
            { name: "2025", values: [612,318,197], accent: 3 },
            { name: "2026", values: [629,379,206], accent: 1 },
          ],
          yFormat: "currency",
          caption: "The Americas carried the year; rest of world is under review.",
        }),
        contactFooter({ slot: "footer", items: [{ label: "04" }] }),
      ],
    }),

    slide({
      id: "capital",
      name: "Capital",
      layout: "split",
      motif: "meshBands",
      split: 0.52,
      blocks: [
        heading({ slot: "full", kicker: "Capital", title: "What we spent it on" }),
        paragraph({ slot: "main", body: "Ninety six million of capital expenditure, two thirds of it on the three plants, and the first dividend increase since 2021." }),
        metricRow({
          slot: "main",
          items: [
            { value: "£96M", label: "Capex" },
            { value: "£64M", label: "Dividend" },
            { value: "1.4x", label: "Net debt" },
          ],
        }),
        iso3d({ slot: "aside", scale: 330, items: [{ asset: "coinStack", title: "", accent: 1 }] }),
        contactFooter({ slot: "footer", items: [{ label: "05" }] }),
      ],
    }),

    slide({
      id: "proof",
      name: "Operations",
      layout: "band",
      motif: "none",
      invert: true,
      blocks: [
        heading({ slot: "full", kicker: "Operations", title: "What the programmes delivered" }),
        iso3d({
          slot: "main",
          divided: true,
          scale: 66,
          items: [
            {
              asset: "arrow",
              value: "£41M",
              title: "Supply savings",
              body: "Against a target of thirty eight, a year ahead of plan",
              accent: 1,
            },
            {
              asset: "lattice",
              value: "9",
              title: "Sites consolidated",
              body: "Into four, with no interruption to customer supply",
              accent: 1,
            },
            {
              asset: "gem",
              value: "22%",
              title: "Energy reduction",
              body: "Per unit produced, which also took cost out",
              accent: 1,
            },
          ],
        }),
        contactFooter({ slot: "footer", items: [{ label: "06" }] }),
      ],
    }),

    slide({
      id: "candour",
      name: "What did not work",
      layout: "fullBleed",
      motif: "meshBands",
      blocks: [
        quote({
          grow: 1,
          slot: "full",
          quote: "We cancelled the platform programme in September and wrote off eighteen million. It was the right decision a year later than it should have been taken.",
          author: "Samuel Addo",
          role: "Chief Executive",
        }),
        contactFooter({ slot: "footer", items: [{ label: "07" }] }),
      ],
    }),

    slide({
      id: "people",
      name: "Board",
      layout: "band",
      motif: "none",
      blocks: [
        heading({ slot: "full", kicker: "Board", title: "Who is accountable" }),
        teamCards({
          slot: "main",
          style: { columns: 3 },
          items: [
            {
              name: "Eleanor Whitfield",
              role: "Chair",
              bio: "Appointed 2019, and chairs the remuneration committee",
              photoPrompt: "professional headshot of an older woman in a dark suit, soft studio lighting, neutral background",
            },
            {
              name: "Samuel Addo",
              role: "Chief Executive",
              bio: "Six years in post, and the author of the supply programme",
              photoPrompt: "professional headshot of a man in a dark suit, soft studio lighting, neutral background",
            },
            {
              name: "Greta Lindholm",
              role: "Chief Financial Officer",
              bio: "Joined in 2024 from the audit practice",
              photoPrompt: "professional headshot of a woman in business attire, soft studio lighting, neutral background",
            },
          ],
        }),
        contactFooter({ slot: "footer", items: [{ label: "08" }] }),
      ],
    }),

    slide({
      id: "guidance",
      name: "Guidance",
      layout: "band",
      motif: "none",
      invert: true,
      blocks: [
        heading({ slot: "full", kicker: "Guidance", title: "What we expect" }),
        iso3d({
          slot: "main",
          divided: true,
          scale: 56,
          style: { columns: 4 },
          items: [
            {
              asset: "arrow",
              value: "4 to 6%",
              title: "Revenue growth",
              body: "Organic, excluding any contribution from acquisitions",
              accent: 1,
            },
            {
              asset: "tower",
              value: "19.5%",
              title: "Margin target",
              body: "Assuming input costs hold within the hedged range",
              accent: 1,
            },
            {
              asset: "cylinder",
              value: "£80M",
              title: "Capex",
              body: "Lower than this year, with the plant programme complete",
              accent: 1,
            },
            {
              asset: "coinStack",
              value: "+5%",
              title: "Dividend",
              body: "Subject to the usual approval at the annual meeting",
              accent: 1,
            },
          ],
        }),
        contactFooter({ slot: "footer", items: [{ label: "09" }] }),
      ],
    }),

    slide({
      id: "next",
      name: "Priorities",
      layout: "band",
      motif: "meshBands",
      blocks: [
        heading({ slot: "full", kicker: "Priorities", title: "Three for the year" }),
        iso3d({
          slot: "main",
          divided: true,
          scale: 66,
          items: [
            {
              asset: "cube",
              value: "01",
              title: "Finish the plants",
              body: "The last two sites, on the schedule published in March",
              accent: 1,
            },
            {
              asset: "arch",
              value: "02",
              title: "Fix the Americas",
              body: "New leadership, and the warehouse live by midsummer",
              accent: 1,
            },
            {
              asset: "lattice",
              value: "03",
              title: "Simplify",
              body: "Four divisions reporting on one set of numbers",
              accent: 1,
            },
          ],
        }),
        contactFooter({ slot: "footer", items: [{ label: "10" }] }),
      ],
    }),

    slide({
      id: "close",
      name: "Close",
      layout: "hero",
      motif: "meshBands",
      split: 0.54,
      blocks: [
        heading({ slot: "full", kicker: "Thank you", title: "The full accounts" }),
        paragraph({ slot: "main", body: "The audited statements, the notes and the remuneration report are published in full on the investor site." }),
        iso3d({ slot: "aside", scale: 290, items: [{ asset: "tower", title: "", accent: 1 }] }),
        contactFooter({
          slot: "footer",
          items: [
            { icon: "globe", label: "yourcompany.com/investors" },
            { icon: "mail", label: "ir@yourcompany.com" },
          ],
        }),
      ],
    }),
  ],
};
