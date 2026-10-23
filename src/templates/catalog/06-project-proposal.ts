/**
 * 06. Project Proposal
 *
 * DEVICE: scaffolding. Lattices, arches and standing slabs, drawn on
 * a receding plane, so the deck reads like a plan rather than a pitch.
 * 
 * DENSITY: precise. Numbered headings, mono kickers, and a figure against
 * every claim because a proposal is a document somebody will hold you to.
 *
 * COMPOSITIONS: hero, band, chart, statement, split, table, people, timeline.
 * Every template shares the frame, and draws a different sequence from
 * it, so no two decks run the same shapes in the same order.
 */

import { consultingSlate } from "../themes";
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

export const projectProposal: SlideTemplate = {
  id: "project-proposal",
  number: 6,
  name: "Project Proposal",
  category: "Business",
  archetype: "proposal",
  description: "Blueprint slate and teal, frames and scaffolds, scoped to the hour.",
  theme: consultingSlate,
  slides: [
    slide({
      id: "cover",
      name: "Cover",
      layout: "hero",
      motif: "meshPlane",
      split: 0.52,
      blocks: [
        heading({ slot: "full", kicker: "Proposal", title: "Scope and shape" }),
        paragraph({ slot: "main", body: "What we propose to build, what it will cost, how long it will take, and what we will not be doing." }),
        metricRow({
          slot: "main",
          items: [
            { value: "14wk", label: "Duration" },
            { value: "£186k", label: "Fixed fee" },
            { value: "4", label: "Phases" },
          ],
        }),
        iso3d({ slot: "aside", scale: 360, items: [{ asset: "lattice", title: "", accent: 1 }] }),
        contactFooter({ slot: "footer", items: [{ label: "PREPARED FOR" }, { label: "2026" }] }),
      ],
    }),

    slide({
      id: "contents",
      name: "Contents",
      layout: "band",
      motif: "meshBands",
      blocks: [
        heading({ slot: "full", kicker: "Contents", title: "This document" }),
        iso3d({
          slot: "main",
          divided: true,
          scale: 56,
          style: { columns: 4 },
          items: [
            {
              asset: "cube",
              value: "01",
              title: "The brief",
              body: "What you asked for, in our words, so we can check",
              accent: 1,
            },
            {
              asset: "lattice",
              value: "02",
              title: "The approach",
              body: "How the work is structured and why in that order",
              accent: 1,
            },
            {
              asset: "arch",
              value: "03",
              title: "The plan",
              body: "Four phases, with what lands at the end of each",
              accent: 1,
            },
            {
              asset: "coinStack",
              value: "04",
              title: "The cost",
              body: "A fixed fee, the assumptions behind it and the exclusions",
              accent: 1,
            },
          ],
        }),
        contactFooter({ slot: "footer", items: [{ label: "02" }] }),
      ],
    }),

    slide({
      id: "about",
      name: "The brief",
      layout: "band",
      motif: "none",
      invert: true,
      blocks: [
        heading({ slot: "full", kicker: "The brief", title: "What you asked for" }),
        iso3d({
          slot: "main",
          divided: true,
          scale: 66,
          items: [
            {
              asset: "cubeStack",
              value: "3",
              title: "Systems",
              body: "To be replaced by one, without a freeze on trading",
              accent: 1,
            },
            {
              asset: "torus",
              value: "18mo",
              title: "Payback",
              body: "The window the board set for the investment to return",
              accent: 1,
            },
            {
              asset: "shards",
              value: "0",
              title: "Downtime",
              body: "The constraint that shapes every decision in this plan",
              accent: 1,
            },
          ],
        }),
        contactFooter({ slot: "footer", items: [{ label: "03" }] }),
      ],
    }),

    slide({
      id: "problem",
      name: "The difficulty",
      layout: "stack",
      motif: "meshBands",
      blocks: [
        heading({ kicker: "The difficulty", title: "Where this normally fails" }),
        chart({
          grow: 1,
          kind: "barChart",
          categories: ["On time","Over by a quarter","Over by a half","Abandoned"],
          series: [
            { name: "Migrations in this category", values: [29,34,25,12], accent: 1 },
          ],
          yFormat: "percent",
          caption: "Published industry figures, across 240 comparable programmes.",
        }),
        contactFooter({ slot: "footer", items: [{ label: "04" }] }),
      ],
    }),

    slide({
      id: "solution",
      name: "The approach",
      layout: "statement",
      motif: "meshLattice",
      blocks: [
        heading({ slot: "full", kicker: "The approach", title: "Strangle, do not replace" }),
        paragraph({ slot: "main", body: "The new system takes over one capability at a time while the old one keeps running, so there is never a date on which everything has to work." }),
        checklist({
          slot: "main",
          items: [
            "One capability moved per phase, reversible",
            "Both systems live until the last one is empty",
            "No single cutover date to miss",
          ],
        }),
        contactFooter({ slot: "footer", items: [{ label: "05" }] }),
      ],
    }),

    slide({
      id: "proof",
      name: "Evidence",
      layout: "band",
      motif: "none",
      invert: true,
      blocks: [
        heading({ slot: "full", kicker: "Evidence", title: "We have done this before" }),
        iso3d({
          slot: "main",
          divided: true,
          scale: 66,
          items: [
            {
              asset: "tower",
              value: "6",
              title: "Migrations",
              body: "Of comparable scale, in the last four years",
              accent: 1,
            },
            {
              asset: "arrow",
              value: "0",
              title: "Overruns",
              body: "On fixed-fee work since we changed how we scope it",
              accent: 1,
            },
            {
              asset: "badge",
              value: "2",
              title: "References",
              body: "Both happy to take your call before you sign",
              accent: 1,
            },
          ],
        }),
        contactFooter({ slot: "footer", items: [{ label: "06" }] }),
      ],
    }),

    slide({
      id: "market",
      name: "The team",
      layout: "split",
      motif: "meshPlane",
      split: 0.52,
      blocks: [
        heading({ slot: "full", kicker: "The team", title: "Four people, named" }),
        paragraph({ slot: "main", body: "The people on this page are the people who will do the work. If one of them changes, we will tell you before you notice." }),
        metricRow({
          slot: "main",
          items: [
            { value: "4", label: "Named" },
            { value: "2", label: "Full time" },
            { value: "14wk", label: "Committed" },
          ],
        }),
        iso3d({ slot: "aside", scale: 340, items: [{ asset: "shards", title: "", accent: 1 }] }),
        contactFooter({ slot: "footer", items: [{ label: "07" }] }),
      ],
    }),

    slide({
      id: "model",
      name: "The cost",
      layout: "stack",
      motif: "meshBands",
      blocks: [
        heading({ kicker: "The cost", title: "What it comes to" }),
        comparisonTable({
          grow: 1,
          columns: [
            { label: "Fixed fee", highlight: true },
            { label: "Included" },
            { label: "Excluded" },
          ],
          rows: [
            { label: "Discovery", cells: ["£24k","yes","no"] },
            { label: "Migration", cells: ["£108k","yes","no"] },
            { label: "Handover and training", cells: ["£54k","yes","no"] },
            { label: "Hardware and licences", cells: ["At cost","no","yes"] },
          ],
        }),
        contactFooter({ slot: "footer", items: [{ label: "08" }] }),
      ],
    }),

    slide({
      id: "people",
      name: "Who does it",
      layout: "band",
      motif: "none",
      blocks: [
        heading({ slot: "full", kicker: "Who does it", title: "The four" }),
        teamCards({
          slot: "main",
          style: { columns: 3 },
          items: [
            {
              name: "Ines Moreau",
              role: "Principal",
              bio: "Accountable for the whole engagement, and signs it off",
              photoPrompt: "professional headshot of a woman in a grey blazer, soft studio lighting, neutral background",
            },
            {
              name: "Victor Adeyemi",
              role: "Lead Engineer",
              bio: "Full time on this from week one to week fourteen",
              photoPrompt: "professional headshot of a man in a plain shirt, soft studio lighting, neutral background",
            },
            {
              name: "Clara Novak",
              role: "Data",
              bio: "Owns the migration itself, which is the risky part",
              photoPrompt: "professional headshot of a woman with glasses, soft studio lighting, neutral background",
            },
          ],
        }),
        contactFooter({ slot: "footer", items: [{ label: "09" }] }),
      ],
    }),

    slide({
      id: "next",
      name: "The plan",
      layout: "stack",
      motif: "none",
      invert: true,
      blocks: [
        heading({ kicker: "The plan", title: "Four phases, fourteen weeks" }),
        timeline({
          grow: 1,
          items: [
            { date: "Week 1", title: "Discovery", body: "Mapping the data and writing down the undocumented" },
            { date: "Week 3", title: "First capability", body: "Moved, live, and reversible for a fortnight after" },
            { date: "Week 7", title: "The bulk", body: "Six weeks of the same pattern, one capability at a time" },
            { date: "Week 13", title: "Handover", body: "Documentation, training, and the old system switched off" },
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
        heading({ slot: "full", kicker: "To proceed", title: "Sign and we start" }),
        paragraph({ slot: "main", body: "The fee is fixed, the team is named, and the first phase begins within ten working days of signature." }),
        iso3d({ slot: "aside", scale: 290, items: [{ asset: "desk", title: "", accent: 1 }] }),
        contactFooter({
          slot: "footer",
          items: [
            { icon: "globe", label: "yourfirm.com" },
            { icon: "mail", label: "proposals@yourfirm.com" },
          ],
        }),
      ],
    }),
  ],
};
