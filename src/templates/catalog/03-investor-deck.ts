/**
 * 03. Investor & Fundraising
 *
 * DEVICE: objects that count things, terrain, stacked discs, fanned
 * cards. An investor deck is an argument made of figures.
 * 
 * DENSITY: dense in the band, empty above it. A lattice fogs out behind,
 * so the slides read as a model rather than a brochure.
 *
 * COMPOSITIONS: hero, band, quote, split, chart, showcase, table, people, statement.
 * Every template shares the frame, and draws a different sequence from
 * it, so no two decks run the same shapes in the same order.
 */

import { investorMidnight } from "../themes";
import type { SlideTemplate } from "../types";
import {
  chart,
  checklist,
  comparisonTable,
  contactFooter,
  heading,
  iso3d,
  metricRow,
  paragraph,
  quote,
  slide,
  teamCards,
} from "./helpers";

export const investorDeck: SlideTemplate = {
  id: "investor-deck",
  number: 3,
  name: "Investor & Fundraising",
  category: "Business",
  archetype: "pitch",
  description: "Capital green on ink, every slide led by a number.",
  theme: investorMidnight,
  slides: [
    slide({
      id: "cover",
      name: "Cover",
      layout: "hero",
      motif: "meshLattice",
      split: 0.5,
      blocks: [
        heading({ slot: "full", kicker: "Series B", title: "The case for capital" }),
        paragraph({ slot: "main", body: "Three years of compounding revenue, a model that gets cheaper to run at scale, and the reason the next round is the last one we need." }),
        metricRow({
          slot: "main",
          items: [
            { value: "$18.4M", label: "ARR" },
            { value: "141%", label: "Net retention" },
            { value: "28mo", label: "Payback" },
          ],
        }),
        iso3d({ slot: "aside", scale: 400, items: [{ asset: "terrain", title: "", accent: 1 }] }),
        contactFooter({ slot: "footer", items: [{ label: "YOUR COMPANY" }, { label: "SERIES B" }] }),
      ],
    }),

    slide({
      id: "contents",
      name: "Contents",
      layout: "band",
      motif: "meshBands",
      blocks: [
        heading({ slot: "full", kicker: "Contents", title: "The argument" }),
        iso3d({
          slot: "main",
          divided: true,
          scale: 56,
          style: { columns: 4 },
          items: [
            {
              asset: "coinStack",
              value: "01",
              title: "The numbers",
              body: "Revenue, retention and what each costs to produce",
              accent: 1,
            },
            {
              asset: "terrain",
              value: "02",
              title: "The market",
              body: "Who is buying, and the part of it nobody serves",
              accent: 1,
            },
            {
              asset: "lattice",
              value: "03",
              title: "The model",
              body: "Why unit economics improve rather than erode",
              accent: 1,
            },
            {
              asset: "arrow",
              value: "04",
              title: "The round",
              body: "The amount, the runway and the milestone it buys",
              accent: 1,
            },
          ],
        }),
        contactFooter({ slot: "footer", items: [{ label: "02" }] }),
      ],
    }),

    slide({
      id: "about",
      name: "The company",
      layout: "fullBleed",
      motif: "meshLattice",
      blocks: [
        quote({
          grow: 1,
          slot: "full",
          quote: "We replaced a system that took four months to implement with one that was running before the invoice cleared. That is the whole argument.",
          author: "Head of Operations",
          role: "A customer since 2024",
        }),
        contactFooter({ slot: "footer", items: [{ label: "03" }] }),
      ],
    }),

    slide({
      id: "problem",
      name: "The problem",
      layout: "band",
      motif: "meshBands",
      blocks: [
        heading({ slot: "full", kicker: "The problem", title: "What the incumbents cannot price" }),
        iso3d({
          slot: "main",
          divided: true,
          scale: 66,
          items: [
            {
              asset: "torus",
              value: "$240k",
              title: "Entry price",
              body: "What the incumbent charges before a line is configured",
              accent: 1,
            },
            {
              asset: "shards",
              value: "14wk",
              title: "Implementation",
              body: "Billed separately, and the reason most pilots stall",
              accent: 1,
            },
            {
              asset: "blob",
              value: "62%",
              title: "Never deploy",
              body: "Of licences bought in this category, by the vendors' own numbers",
              accent: 1,
            },
          ],
        }),
        contactFooter({ slot: "footer", items: [{ label: "04" }] }),
      ],
    }),

    slide({
      id: "solution",
      name: "The product",
      layout: "split",
      motif: "meshField",
      split: 0.54,
      blocks: [
        heading({ slot: "full", kicker: "The product", title: "Priced to be bought" }),
        paragraph({ slot: "main", body: "The same capability, delivered in a fortnight and priced per outcome, so a buyer can start without a committee and expand without a renegotiation." }),
        checklist({
          slot: "main",
          items: [
            "Live in fourteen days, not fourteen weeks",
            "Priced per outcome, expanding with usage",
            "No implementation fee, ever",
          ],
        }),
        iso3d({ slot: "aside", scale: 350, items: [{ asset: "vortex", title: "", accent: 1 }] }),
        contactFooter({ slot: "footer", items: [{ label: "05" }] }),
      ],
    }),

    slide({
      id: "proof",
      name: "Traction",
      layout: "stack",
      motif: "none",
      invert: true,
      blocks: [
        heading({ kicker: "Traction", title: "Three years of compounding" }),
        chart({
          grow: 1,
          kind: "barChart",
          categories: ["2023","2024","2025","2026"],
          series: [
            { name: "ARR", values: [2.1,5.8,11.4,18.4], accent: 1 },
          ],
          yFormat: "currency",
          caption: "No change of pricing model across the period.",
        }),
        contactFooter({ slot: "footer", items: [{ label: "06" }] }),
      ],
    }),

    slide({
      id: "market",
      name: "Market",
      layout: "showcase",
      motif: "meshLattice",
      split: 0.52,
      blocks: [
        heading({ slot: "full", kicker: "Market", title: "Where the money is" }),
        paragraph({ slot: "main", body: "The enterprise tier is well served and slow. The mid-market below it spends almost as much in aggregate and has no credible vendor built for it." }),
        metricRow({
          slot: "main",
          items: [
            { value: "$22B", label: "Addressable" },
            { value: "68%", label: "Unserved" },
            { value: "17%", label: "CAGR" },
          ],
        }),
        iso3d({ slot: "aside", scale: 236, items: [{ asset: "coinStack", title: "", accent: 1 }] }),
        contactFooter({ slot: "footer", items: [{ label: "07" }] }),
      ],
    }),

    slide({
      id: "model",
      name: "Unit economics",
      layout: "stack",
      motif: "meshBands",
      blocks: [
        heading({ kicker: "Unit economics", title: "Why this improves with scale" }),
        comparisonTable({
          grow: 1,
          columns: [
            { label: "2024" },
            { label: "2025" },
            { label: "2026", highlight: true },
          ],
          rows: [
            { label: "Average contract", cells: ["$21k","$26k","$31k"] },
            { label: "CAC payback", cells: ["41mo","34mo","28mo"] },
            { label: "Net retention", cells: ["118%","129%","141%"] },
            { label: "Gross margin", cells: ["88%","91%","94%"] },
          ],
        }),
        contactFooter({ slot: "footer", items: [{ label: "08" }] }),
      ],
    }),

    slide({
      id: "people",
      name: "Team",
      layout: "band",
      motif: "none",
      blocks: [
        heading({ slot: "full", kicker: "Team", title: "Who you are backing" }),
        teamCards({
          slot: "main",
          style: { columns: 3 },
          items: [
            {
              name: "Amara Diallo",
              role: "Co-founder, CEO",
              bio: "Sold her last company to the incumbent in this category",
              photoPrompt: "professional headshot of a woman founder in a dark blazer, soft studio lighting, neutral background",
            },
            {
              name: "Tom Lindqvist",
              role: "Co-founder, CTO",
              bio: "Built the pricing engine the whole model depends on",
              photoPrompt: "professional headshot of a man with glasses, soft studio lighting, neutral background",
            },
            {
              name: "Ruth Mensah",
              role: "Chief Revenue Officer",
              bio: "Took the previous business from $4M to $60M",
              photoPrompt: "professional headshot of a woman in business attire, soft studio lighting, neutral background",
            },
          ],
        }),
        contactFooter({ slot: "footer", items: [{ label: "09" }] }),
      ],
    }),

    slide({
      id: "next",
      name: "Use of funds",
      layout: "band",
      motif: "none",
      invert: true,
      blocks: [
        heading({ slot: "full", kicker: "Use of funds", title: "Where the round goes" }),
        iso3d({
          slot: "main",
          divided: true,
          scale: 56,
          style: { columns: 4 },
          items: [
            {
              asset: "tower",
              value: "46%",
              title: "Engineering",
              body: "Twenty hires against a roadmap already sold",
              accent: 1,
            },
            {
              asset: "arrow",
              value: "31%",
              title: "Go to market",
              body: "Two regions where the channel already asks for us",
              accent: 1,
            },
            {
              asset: "cylinder",
              value: "15%",
              title: "Infrastructure",
              body: "The margin improvement that funds the year after",
              accent: 1,
            },
            {
              asset: "cube",
              value: "8%",
              title: "Reserve",
              body: "Because the plan has never survived first contact",
              accent: 1,
            },
          ],
        }),
        contactFooter({ slot: "footer", items: [{ label: "10" }] }),
      ],
    }),

    slide({
      id: "close",
      name: "The round",
      layout: "statement",
      motif: "meshLattice",
      blocks: [
        heading({ slot: "full", kicker: "The round", title: "$24M, Series B" }),
        paragraph({ slot: "main", body: "Twenty four months of runway to $60M of recurring revenue, at which point the business funds itself." }),
        contactFooter({
          slot: "footer",
          items: [
            { icon: "globe", label: "yourcompany.com" },
            { icon: "mail", label: "investors@yourcompany.com" },
          ],
        }),
      ],
    }),
  ],
};
