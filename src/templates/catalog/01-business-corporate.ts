/**
 * 01. Business & Corporate
 *
 * DEVICE: structural objects, lattice frames and columns, in one blue.
 * A corporate deck earns trust by looking built rather than styled.
 * 
 * DENSITY: measured. Wide margins, a receding plane behind, and figures
 * carrying every column.
 *
 * COMPOSITIONS: hero, band, split, chart, statement, table, people, timeline.
 * Every template shares the frame, and draws a different sequence from
 * it, so no two decks run the same shapes in the same order.
 */

import { corporateNavy } from "../themes";
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
  slide,
  teamCards,
  timeline,
} from "./helpers";

export const businessCorporate: SlideTemplate = {
  id: "business-corporate",
  number: 1,
  name: "Business & Corporate",
  category: "Business",
  archetype: "corporate",
  description: "Boardroom blue, structural objects, nothing raised above the facts.",
  theme: corporateNavy,
  slides: [
    slide({
      id: "cover",
      name: "Cover",
      layout: "hero",
      motif: "meshPlane",
      split: 0.5,
      blocks: [
        heading({ slot: "full", kicker: "Annual Briefing", title: "Built to hold" }),
        paragraph({ slot: "main", body: "Where the business stands, what it costs to run, and the three decisions this year turns on." }),
        metricRow({
          slot: "main",
          items: [
            { value: "£412M", label: "Revenue" },
            { value: "38", label: "Markets" },
            { value: "9,400", label: "People" },
          ],
        }),
        iso3d({ slot: "aside", scale: 380, items: [{ asset: "lattice", title: "", accent: 1 }] }),
        contactFooter({ slot: "footer", items: [{ label: "YOUR COMPANY" }, { label: "2026" }] }),
      ],
    }),

    slide({
      id: "contents",
      name: "Contents",
      layout: "band",
      motif: "meshBands",
      blocks: [
        heading({ slot: "full", kicker: "Contents", title: "What follows" }),
        iso3d({
          slot: "main",
          divided: true,
          scale: 56,
          style: { columns: 4 },
          items: [
            {
              asset: "cube",
              value: "01",
              title: "Where we stand",
              body: "Position, scale and the markets that carried the year",
              accent: 1,
            },
            {
              asset: "lattice",
              value: "02",
              title: "How we are built",
              body: "The operating model and the costs underneath it",
              accent: 1,
            },
            {
              asset: "tower",
              value: "03",
              title: "What we proved",
              body: "Performance against the targets set last spring",
              accent: 1,
            },
            {
              asset: "arch",
              value: "04",
              title: "What comes next",
              body: "Three decisions and the capital they need",
              accent: 1,
            },
          ],
        }),
        contactFooter({ slot: "footer", items: [{ label: "02" }] }),
      ],
    }),

    slide({
      id: "about",
      name: "About",
      layout: "band",
      motif: "none",
      invert: true,
      blocks: [
        heading({ slot: "full", kicker: "The business", title: "Who we are" }),
        iso3d({
          slot: "main",
          divided: true,
          scale: 66,
          items: [
            {
              asset: "slab",
              value: "32",
              title: "Years trading",
              body: "Through four recessions and two changes of ownership",
              accent: 1,
            },
            {
              asset: "tower",
              value: "38",
              title: "Markets",
              body: "Twelve direct, the rest through long-standing partners",
              accent: 1,
            },
            {
              asset: "cubeStack",
              value: "4",
              title: "Divisions",
              body: "Each with its own balance sheet and its own board",
              accent: 1,
            },
          ],
        }),
        contactFooter({ slot: "footer", items: [{ label: "03" }] }),
      ],
    }),

    slide({
      id: "problem",
      name: "The challenge",
      layout: "band",
      motif: "meshBands",
      blocks: [
        heading({ slot: "full", kicker: "The challenge", title: "Three pressures on the model" }),
        iso3d({
          slot: "main",
          divided: true,
          scale: 66,
          items: [
            {
              asset: "wedge",
              value: "19%",
              title: "Cost of supply",
              body: "Up year on year, and not expected to fall before 2028",
              accent: 1,
            },
            {
              asset: "shards",
              value: "3",
              title: "New entrants",
              body: "Each funded well enough to buy share for a while",
              accent: 1,
            },
            {
              asset: "torus",
              value: "11mo",
              title: "Decision cycle",
              body: "From board approval to anything reaching a customer",
              accent: 1,
            },
          ],
        }),
        contactFooter({ slot: "footer", items: [{ label: "04" }] }),
      ],
    }),

    slide({
      id: "solution",
      name: "The plan",
      layout: "split",
      motif: "meshLattice",
      split: 0.54,
      blocks: [
        heading({ slot: "full", kicker: "The plan", title: "Fewer things, done properly" }),
        paragraph({ slot: "main", body: "Consolidating four operating models into one, retiring the systems that no longer earn their maintenance, and moving decisions closer to the markets that live with them." }),
        checklist({
          slot: "main",
          items: [
            "One operating model across all four divisions",
            "Nine systems retired, three retained and extended",
            "Spending authority devolved to market leads",
          ],
        }),
        iso3d({ slot: "aside", scale: 360, items: [{ asset: "arch", title: "", accent: 1 }] }),
        contactFooter({ slot: "footer", items: [{ label: "05" }] }),
      ],
    }),

    slide({
      id: "proof",
      name: "Performance",
      layout: "stack",
      motif: "none",
      invert: true,
      blocks: [
        heading({ kicker: "Performance", title: "Revenue by division" }),
        chart({
          grow: 1,
          kind: "barChart",
          categories: ["Industrial","Consumer","Services","Licensing"],
          series: [
            { name: "2025", values: [148,96,71,24], accent: 3 },
            { name: "2026", values: [161,102,88,31], accent: 1 },
          ],
          yFormat: "currency",
          caption: "Growth in every division but Consumer, which held flat.",
        }),
        contactFooter({ slot: "footer", items: [{ label: "06" }] }),
      ],
    }),

    slide({
      id: "market",
      name: "Market",
      layout: "statement",
      motif: "meshPlane",
      blocks: [
        heading({ slot: "full", kicker: "Market", title: "Where the growth is" }),
        paragraph({ slot: "main", body: "Two thirds of the addressable market sits outside the regions we serve directly today, and the partners covering it take a margin we can no longer justify." }),
        metricRow({
          slot: "main",
          items: [
            { value: "£6.4B", label: "Addressable" },
            { value: "31%", label: "Served direct" },
            { value: "2", label: "Regions to enter" },
          ],
        }),
        contactFooter({ slot: "footer", items: [{ label: "07" }] }),
      ],
    }),

    slide({
      id: "model",
      name: "Operating model",
      layout: "stack",
      motif: "meshBands",
      blocks: [
        heading({ kicker: "Operating model", title: "How the business makes money" }),
        comparisonTable({
          grow: 1,
          columns: [
            { label: "Contracted", highlight: true },
            { label: "Transactional" },
            { label: "Licensing" },
          ],
          rows: [
            { label: "Share of revenue", cells: ["64%","27%","9%"] },
            { label: "Gross margin", cells: ["41%","58%","92%"] },
            { label: "Repricing", cells: ["Annual, indexed","Per order","Fixed term"] },
            { label: "Falls first in a downturn", cells: ["no","yes","partial"] },
          ],
        }),
        contactFooter({ slot: "footer", items: [{ label: "08" }] }),
      ],
    }),

    slide({
      id: "people",
      name: "Leadership",
      layout: "band",
      motif: "none",
      blocks: [
        heading({ slot: "full", kicker: "Leadership", title: "Who runs it" }),
        teamCards({
          slot: "main",
          style: { columns: 3 },
          items: [
            {
              name: "Margaret Hale",
              role: "Chief Executive",
              bio: "Eleven years with the business, four in the chair",
              photoPrompt: "professional headshot of a woman executive in a dark suit, soft studio lighting, neutral background",
            },
            {
              name: "Daniel Okonjo",
              role: "Chief Financial Officer",
              bio: "Joined from the audit side, which shows in the forecasts",
              photoPrompt: "professional headshot of a man in a navy suit, soft studio lighting, neutral background",
            },
            {
              name: "Priya Raman",
              role: "Chief Operating Officer",
              bio: "Runs the consolidation programme and the three plants",
              photoPrompt: "professional headshot of a woman in business attire, soft studio lighting, neutral background",
            },
          ],
        }),
        contactFooter({ slot: "footer", items: [{ label: "09" }] }),
      ],
    }),

    slide({
      id: "next",
      name: "What is next",
      layout: "stack",
      motif: "none",
      invert: true,
      blocks: [
        heading({ kicker: "What is next", title: "The year ahead" }),
        timeline({
          grow: 1,
          items: [
            { date: "Q1", title: "One model", body: "Divisions move onto shared planning and reporting" },
            { date: "Q2", title: "Two regions", body: "Direct operations open in the Nordics and Iberia" },
            { date: "Q3", title: "Systems retired", body: "Nine legacy platforms switched off for good" },
            { date: "Q4", title: "Repricing", body: "The contracted book moves onto the new index" },
          ],
        }),
        contactFooter({ slot: "footer", items: [{ label: "10" }] }),
      ],
    }),

    slide({
      id: "close",
      name: "Close",
      layout: "hero",
      motif: "meshPlane",
      split: 0.54,
      blocks: [
        heading({ slot: "full", kicker: "The ask", title: "Approve the plan" }),
        paragraph({ slot: "main", body: "Three decisions are in front of the board: the consolidation budget, the two market entries, and the authority to retire the legacy estate." }),
        iso3d({ slot: "aside", scale: 300, items: [{ asset: "twist", title: "", accent: 1 }] }),
        contactFooter({
          slot: "footer",
          items: [
            { icon: "globe", label: "yourcompany.com" },
            { icon: "mail", label: "board@yourcompany.com" },
          ],
        }),
      ],
    }),
  ],
};
