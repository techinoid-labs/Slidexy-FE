/**
 * 10. Case Study
 *
 * DEVICE: movement over time. Arrows, climbs and fanned cards on a
 * receding plane, because a case study is a before and an after with the
 * work in between.
 * 
 * DENSITY: narrative. A serif display, a sidebar rule on every heading,
 * and each band reading as a chapter rather than a list.
 *
 * COMPOSITIONS: hero, band, chart, showcase, split, quote, people, statement.
 * Every template shares the frame, and draws a different sequence from
 * it, so no two decks run the same shapes in the same order.
 */

import { impactGreen } from "../themes";
import type { SlideTemplate } from "../types";
import {
  chart,
  checklist,
  contactFooter,
  heading,
  iso3d,
  metricRow,
  paragraph,
  quote,
  slide,
  teamCards,
} from "./helpers";

export const caseStudy: SlideTemplate = {
  id: "case-study",
  number: 10,
  name: "Case Study",
  category: "Business",
  archetype: "casestudy",
  description: "Forest green and a serif display, one story told in order.",
  theme: impactGreen,
  slides: [
    slide({
      id: "cover",
      name: "Cover",
      layout: "hero",
      motif: "meshPlane",
      split: 0.52,
      blocks: [
        heading({ slot: "full", kicker: "Case Study", title: "Nine months, one number" }),
        paragraph({ slot: "main", body: "How a two hundred person logistics business took eleven days out of its order cycle without hiring anyone." }),
        metricRow({
          slot: "main",
          items: [
            { value: "11d", label: "Removed" },
            { value: "£2.4M", label: "Released" },
            { value: "9mo", label: "Elapsed" },
          ],
        }),
        iso3d({ slot: "aside", scale: 340, items: [{ asset: "arrow", title: "", accent: 1 }] }),
        contactFooter({ slot: "footer", items: [{ label: "CLIENT STORY" }, { label: "2026" }] }),
      ],
    }),

    slide({
      id: "contents",
      name: "Contents",
      layout: "band",
      motif: "meshBands",
      blocks: [
        heading({ slot: "full", kicker: "Contents", title: "The story" }),
        iso3d({
          slot: "main",
          divided: true,
          scale: 56,
          style: { columns: 4 },
          items: [
            {
              asset: "cube",
              value: "01",
              title: "Before",
              body: "What the order cycle looked like and what it was costing",
              accent: 1,
            },
            {
              asset: "shards",
              value: "02",
              title: "The problem",
              body: "The three places the eleven days were actually hiding",
              accent: 1,
            },
            {
              asset: "steps",
              value: "03",
              title: "The work",
              body: "What we changed, in the order we changed it",
              accent: 1,
            },
            {
              asset: "gem",
              value: "04",
              title: "After",
              body: "Where the numbers landed, and what has held since",
              accent: 1,
            },
          ],
        }),
        contactFooter({ slot: "footer", items: [{ label: "02" }] }),
      ],
    }),

    slide({
      id: "before",
      name: "Before",
      layout: "stack",
      motif: "none",
      invert: true,
      blocks: [
        heading({ kicker: "Before", title: "Where the nineteen days went" }),
        chart({
          grow: 1,
          kind: "barChart",
          categories: ["Approvals","Re-keying","Picking","In the yard","Transit"],
          series: [
            { name: "Days", values: [6,3,2,2,6], accent: 1 },
          ],
          caption: "Measured across a full quarter before anything changed.",
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
        heading({ slot: "full", kicker: "The problem", title: "Where the days were hiding" }),
        iso3d({
          slot: "main",
          divided: true,
          scale: 66,
          items: [
            {
              asset: "wedge",
              value: "6d",
              title: "In approvals",
              body: "Orders waiting for a signature nobody was chasing",
              accent: 1,
            },
            {
              asset: "shards",
              value: "3d",
              title: "In re-keying",
              body: "The same order typed into three systems by three people",
              accent: 1,
            },
            {
              asset: "cylinder",
              value: "2d",
              title: "In the yard",
              body: "Picked stock waiting for a carrier slot already booked",
              accent: 1,
            },
          ],
        }),
        contactFooter({ slot: "footer", items: [{ label: "04" }] }),
      ],
    }),

    slide({
      id: "solution",
      name: "The work",
      layout: "showcase",
      motif: "meshLattice",
      split: 0.54,
      blocks: [
        heading({ slot: "full", kicker: "The work", title: "Three changes, in order" }),
        paragraph({ slot: "main", body: "Approval thresholds raised, one order record shared across all four teams, and carrier slots booked at the point of picking rather than after it." }),
        checklist({
          slot: "main",
          items: [
            "Approval thresholds raised, with an audit trail",
            "One order record, written once and read by all",
            "Carrier slots booked at pick, not after",
          ],
        }),
        iso3d({ slot: "aside", scale: 236, items: [{ asset: "cluster", title: "", accent: 1 }] }),
        contactFooter({ slot: "footer", items: [{ label: "05" }] }),
      ],
    }),

    slide({
      id: "proof",
      name: "After",
      layout: "stack",
      motif: "none",
      invert: true,
      blocks: [
        heading({ kicker: "After", title: "Before and after" }),
        chart({
          grow: 1,
          kind: "barChart",
          categories: ["Approvals","Re-keying","Picking","In the yard","Transit"],
          series: [
            { name: "Before", values: [6,3,2,2,6], accent: 3 },
            { name: "After", values: [1,0,1,0,6], accent: 1 },
          ],
          caption: "Transit was never the problem, which is where they had been looking.",
        }),
        contactFooter({ slot: "footer", items: [{ label: "06" }] }),
      ],
    }),

    slide({
      id: "market",
      name: "The client",
      layout: "split",
      motif: "meshPlane",
      split: 0.5,
      blocks: [
        heading({ slot: "full", kicker: "The client", title: "Who they are" }),
        paragraph({ slot: "main", body: "A family-owned logistics business, two hundred people across four sites, trading for thirty one years and profitable in every one of them." }),
        metricRow({
          slot: "main",
          items: [
            { value: "200", label: "People" },
            { value: "4", label: "Sites" },
            { value: "31yr", label: "Trading" },
          ],
        }),
        iso3d({ slot: "aside", scale: 380, items: [{ asset: "meeting", title: "", accent: 1 }] }),
        contactFooter({ slot: "footer", items: [{ label: "07" }] }),
      ],
    }),

    slide({
      id: "model",
      name: "The client",
      layout: "fullBleed",
      motif: "meshPlane",
      blocks: [
        quote({
          grow: 1,
          slot: "full",
          quote: "Nobody here believed eleven days were available. We had been told for years that the cycle was as short as the industry allows.",
          author: "Hannah Royce",
          role: "Operations Director",
        }),
        contactFooter({ slot: "footer", items: [{ label: "08" }] }),
      ],
    }),

    slide({
      id: "people",
      name: "The people",
      layout: "band",
      motif: "none",
      blocks: [
        heading({ slot: "full", kicker: "The people", title: "Who did the work" }),
        teamCards({
          slot: "main",
          style: { columns: 3 },
          items: [
            {
              name: "Hannah Royce",
              role: "Operations Director",
              bio: "The client's own lead, and the reason this stuck",
              photoPrompt: "professional headshot of a woman in practical workwear, soft studio lighting, neutral background",
            },
            {
              name: "Peter Nwosu",
              role: "Engagement Lead",
              bio: "On site three days a week for the first three months",
              photoPrompt: "professional headshot of a man in a shirt without a tie, soft studio lighting, neutral background",
            },
            {
              name: "Sofia Marchetti",
              role: "Analyst",
              bio: "Built the measurement that proved the eleven days were real",
              photoPrompt: "professional headshot of a woman in business casual, soft studio lighting, neutral background",
            },
          ],
        }),
        contactFooter({ slot: "footer", items: [{ label: "09" }] }),
      ],
    }),

    slide({
      id: "next",
      name: "What held",
      layout: "band",
      motif: "none",
      invert: true,
      blocks: [
        heading({ slot: "full", kicker: "Eighteen months on", title: "What held, and what did not" }),
        iso3d({
          slot: "main",
          divided: true,
          scale: 66,
          items: [
            {
              asset: "arrow",
              value: "8d",
              title: "Still eight days",
              body: "The cycle time has not drifted back in eighteen months",
              accent: 1,
            },
            {
              asset: "lattice",
              value: "1",
              title: "One record",
              body: "Still the only place an order is written, which is the key",
              accent: 1,
            },
            {
              asset: "torus",
              value: "2d",
              title: "Crept back",
              body: "In approvals, after a leadership change, now corrected",
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
      layout: "statement",
      motif: "meshPlane",
      blocks: [
        heading({ slot: "full", kicker: "Talk to them", title: "They will take your call" }),
        paragraph({ slot: "main", body: "The operations director has agreed to speak to anyone considering similar work. We will make the introduction." }),
        contactFooter({
          slot: "footer",
          items: [
            { icon: "globe", label: "yourfirm.com" },
            { icon: "mail", label: "hello@yourfirm.com" },
          ],
        }),
      ],
    }),
  ],
};
