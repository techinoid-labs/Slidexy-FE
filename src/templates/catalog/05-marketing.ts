/**
 * 05. Marketing Strategy
 *
 * DEVICE: soft objects, blobs, orbits, rings and stars. The only
 * template in the set with curves rather than corners, because a brand
 * plan should not look like an audit.
 * 
 * DENSITY: airy, pill radii, a mesh field behind, and headlines allowed
 * to be a little louder than the evidence strictly requires.
 *
 * COMPOSITIONS: showcase, band, chart, split, gallery, hero, people, timeline, statement.
 * Every template shares the frame, and draws a different sequence from
 * it, so no two decks run the same shapes in the same order.
 */

import { marketingMagenta } from "../themes";
import type { SlideTemplate } from "../types";
import {
  chart,
  checklist,
  contactFooter,
  heading,
  imageGrid,
  iso3d,
  metricRow,
  paragraph,
  slide,
  teamCards,
  timeline,
} from "./helpers";

export const marketingStrategy: SlideTemplate = {
  id: "marketing-strategy",
  number: 5,
  name: "Marketing Strategy",
  category: "Marketing",
  archetype: "marketing",
  description: "Blush and magenta, soft organic objects, a plan with a voice.",
  theme: marketingMagenta,
  slides: [
    slide({
      id: "cover",
      name: "Cover",
      layout: "showcase",
      motif: "meshField",
      split: 0.52,
      blocks: [
        heading({ slot: "full", kicker: "Brand Plan", title: "Be worth repeating" }),
        paragraph({ slot: "main", body: "A year of work aimed at one outcome: that people describe us to each other in roughly the words we would choose." }),
        metricRow({
          slot: "main",
          items: [
            { value: "3", label: "Audiences" },
            { value: "1", label: "Message" },
            { value: "12mo", label: "Horizon" },
          ],
        }),
        iso3d({ slot: "aside", scale: 236, items: [{ asset: "blob", title: "", accent: 1 }] }),
        contactFooter({ slot: "footer", items: [{ label: "YOUR BRAND" }, { label: "2026" }] }),
      ],
    }),

    slide({
      id: "contents",
      name: "Contents",
      layout: "band",
      motif: "meshBands",
      blocks: [
        heading({ slot: "full", kicker: "Contents", title: "The plan" }),
        iso3d({
          slot: "main",
          divided: true,
          scale: 56,
          style: { columns: 4 },
          items: [
            {
              asset: "ring",
              value: "01",
              title: "Where we stand",
              body: "What people currently say when we are not in the room",
              accent: 1,
            },
            {
              asset: "orbit",
              value: "02",
              title: "What we will say",
              body: "One message, and the three proofs that carry it",
              accent: 1,
            },
            {
              asset: "star",
              value: "03",
              title: "Where we say it",
              body: "The channels that earn their place and the ones that do not",
              accent: 1,
            },
            {
              asset: "arrow",
              value: "04",
              title: "How we will know",
              body: "The four numbers we will be judged on",
              accent: 1,
            },
          ],
        }),
        contactFooter({ slot: "footer", items: [{ label: "02" }] }),
      ],
    }),

    slide({
      id: "about",
      name: "Where we stand",
      layout: "stack",
      motif: "none",
      invert: true,
      blocks: [
        heading({ kicker: "Where we stand", title: "What people say now" }),
        chart({
          grow: 1,
          kind: "barChart",
          categories: ["Unprompted recall","Correct category","Would recommend","Can name a product"],
          series: [
            { name: "Us", values: [39,54,28,31], accent: 1 },
            { name: "Category leader", values: [81,88,62,74], accent: 3 },
          ],
          yFormat: "percent",
          caption: "1,400 responses and 32 interviews, run over six weeks in the spring.",
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
        heading({ slot: "full", kicker: "The problem", title: "We are hard to repeat" }),
        iso3d({
          slot: "main",
          divided: true,
          scale: 66,
          items: [
            {
              asset: "shards",
              value: "9",
              title: "Value props",
              body: "On the homepage alone, which is nine too many",
              accent: 1,
            },
            {
              asset: "cards",
              value: "4",
              title: "Visual systems",
              body: "Running at once, none of them finished",
              accent: 1,
            },
            {
              asset: "ring",
              value: "0",
              title: "Owned phrases",
              body: "Nothing we say that a customer says back to us",
              accent: 1,
            },
          ],
        }),
        contactFooter({ slot: "footer", items: [{ label: "04" }] }),
      ],
    }),

    slide({
      id: "solution",
      name: "The idea",
      layout: "split",
      motif: "meshLattice",
      split: 0.54,
      blocks: [
        heading({ slot: "full", kicker: "The idea", title: "One thing, said everywhere" }),
        paragraph({ slot: "main", body: "A single claim, carried by three proofs, repeated without variation until it is boring to us and new to everyone else." }),
        checklist({
          slot: "main",
          items: [
            "One claim, in the same words everywhere",
            "Three proofs, each a number or a name",
            "Nothing new said until this one lands",
          ],
        }),
        iso3d({ slot: "aside", scale: 350, items: [{ asset: "vortex", title: "", accent: 1 }] }),
        contactFooter({ slot: "footer", items: [{ label: "05" }] }),
      ],
    }),

    slide({
      id: "proof",
      name: "The work",
      layout: "stack",
      motif: "meshBands",
      blocks: [
        heading({ kicker: "The work", title: "Where it shows up" }),
        imageGrid({
          grow: 1,
          style: { columns: 3 },
          items: [
            { title: "The site", body: "Every page carrying the claim and one proof", prompt: "bright modern office wall with a large screen showing a clean website, no text, soft daylight" },
            { title: "The stage", body: "Ten conferences, one talk, delivered the same way", prompt: "speaker on a conference stage facing a seated audience, warm lighting, no text" },
            { title: "The inbox", body: "A fortnightly letter people actually finish", prompt: "person reading on a phone at a kitchen table, morning light, candid, no text" },
          ],
        }),
        contactFooter({ slot: "footer", items: [{ label: "06" }] }),
      ],
    }),

    slide({
      id: "market",
      name: "Audience",
      layout: "hero",
      motif: "meshField",
      split: 0.5,
      blocks: [
        heading({ slot: "full", kicker: "Audience", title: "Three people, not a segment" }),
        paragraph({ slot: "main", body: "We will write for three named roles and ignore everyone else for twelve months, because a message built for everybody is heard by nobody." }),
        metricRow({
          slot: "main",
          items: [
            { value: "3", label: "Roles" },
            { value: "1", label: "Message" },
            { value: "0", label: "Exceptions" },
          ],
        }),
        iso3d({ slot: "aside", scale: 370, items: [{ asset: "team", title: "", accent: 1 }] }),
        contactFooter({ slot: "footer", items: [{ label: "07" }] }),
      ],
    }),

    slide({
      id: "model",
      name: "Channels",
      layout: "band",
      motif: "meshBands",
      blocks: [
        heading({ slot: "full", kicker: "Channels", title: "Where the budget goes" }),
        iso3d({
          slot: "main",
          divided: true,
          scale: 66,
          items: [
            {
              asset: "cylinder",
              value: "48%",
              title: "Owned",
              body: "The site, the newsletter and the documentation nobody reads yet",
              accent: 1,
            },
            {
              asset: "capsule",
              value: "34%",
              title: "Earned",
              body: "Ten conference talks and the press that follows them",
              accent: 1,
            },
            {
              asset: "coinStack",
              value: "18%",
              title: "Paid",
              body: "Retargeting only, because broad paid has never worked for us",
              accent: 1,
            },
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
        heading({ slot: "full", kicker: "Team", title: "Who delivers it" }),
        teamCards({
          slot: "main",
          style: { columns: 3 },
          items: [
            {
              name: "Lucia Ferrari",
              role: "Brand Director",
              bio: "Owns the claim and the right to say no to new ones",
              photoPrompt: "professional headshot of a woman with short hair, soft studio lighting, neutral background",
            },
            {
              name: "Marcus Bell",
              role: "Content Lead",
              bio: "Writes the proofs and keeps every channel saying one thing",
              photoPrompt: "professional headshot of a man in a plain shirt, soft studio lighting, neutral background",
            },
            {
              name: "Hana Sato",
              role: "Growth",
              bio: "Runs the measurement, and will tell us when it is not working",
              photoPrompt: "professional headshot of a woman in casual business wear, soft studio lighting, neutral background",
            },
          ],
        }),
        contactFooter({ slot: "footer", items: [{ label: "09" }] }),
      ],
    }),

    slide({
      id: "next",
      name: "The year",
      layout: "stack",
      motif: "none",
      invert: true,
      blocks: [
        heading({ kicker: "The year", title: "Four quarters" }),
        timeline({
          grow: 1,
          items: [
            { date: "Q1", title: "Agree the claim", body: "One sentence, signed off by three people and nobody else" },
            { date: "Q2", title: "Rebuild the site", body: "Every page carrying the claim and one of the three proofs" },
            { date: "Q3", title: "Earn the talks", body: "Ten stages, same talk, measured on unprompted recall" },
            { date: "Q4", title: "Measure honestly", body: "Repeat the survey and publish it internally whatever it says" },
          ],
        }),
        contactFooter({ slot: "footer", items: [{ label: "10" }] }),
      ],
    }),

    slide({
      id: "close",
      name: "Close",
      layout: "statement",
      motif: "meshField",
      blocks: [
        heading({ slot: "full", kicker: "The ask", title: "Say one thing" }),
        paragraph({ slot: "main", body: "Approve the claim, protect it for twelve months, and judge us on whether people repeat it." }),
        contactFooter({
          slot: "footer",
          items: [
            { icon: "globe", label: "yourbrand.com" },
            { icon: "mail", label: "brand@yourbrand.com" },
          ],
        }),
      ],
    }),
  ],
};
