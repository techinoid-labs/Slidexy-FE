/**
 * 04. Sales Presentation
 *
 * DEVICE: direction. Cones, chevrons and arrows, everything pointing
 * from where the buyer is to where they could be.
 * 
 * DENSITY: warm and conversational. Soft bands behind, a serif-adjacent
 * display face, and copy written the way it would be spoken.
 *
 * COMPOSITIONS: split, band, showcase, chart, hero, pricing, people, process.
 * Every template shares the frame, and draws a different sequence from
 * it, so no two decks run the same shapes in the same order.
 */

import { salesAmber } from "../themes";
import type { SlideTemplate } from "../types";
import {
  chart,
  checklist,
  contactFooter,
  heading,
  iso3d,
  metricRow,
  paragraph,
  pricingTable,
  processFlow,
  slide,
  teamCards,
} from "./helpers";

export const salesPresentation: SlideTemplate = {
  id: "sales-presentation",
  number: 4,
  name: "Sales Presentation",
  category: "Business",
  archetype: "sales",
  description: "Warm cream and amber, funnels and chevrons, written to be said out loud.",
  theme: salesAmber,
  slides: [
    slide({
      id: "cover",
      name: "Cover",
      layout: "split",
      motif: "meshBands",
      split: 0.52,
      blocks: [
        heading({ slot: "full", kicker: "For your team", title: "A shorter path" }),
        paragraph({ slot: "main", body: "Everything your team does between a lead arriving and a contract signing, in one place and roughly half the time." }),
        metricRow({
          slot: "main",
          items: [
            { value: "42%", label: "Faster" },
            { value: "3.1x", label: "Pipeline" },
            { value: "11d", label: "To value" },
          ],
        }),
        iso3d({ slot: "aside", scale: 330, items: [{ asset: "cone", title: "", accent: 1 }] }),
        contactFooter({ slot: "footer", items: [{ label: "YOUR COMPANY" }, { label: "2026" }] }),
      ],
    }),

    slide({
      id: "contents",
      name: "Contents",
      layout: "band",
      motif: "meshBands",
      blocks: [
        heading({ slot: "full", kicker: "Today", title: "What we will cover" }),
        iso3d({
          slot: "main",
          divided: true,
          scale: 56,
          style: { columns: 4 },
          items: [
            {
              asset: "chevron",
              value: "01",
              title: "Where it hurts",
              body: "The three places deals slow down in teams like yours",
              accent: 1,
            },
            {
              asset: "cone",
              value: "02",
              title: "What changes",
              body: "The workflow after, in the words of the people doing it",
              accent: 1,
            },
            {
              asset: "arrow",
              value: "03",
              title: "The numbers",
              body: "What other teams have seen in their first quarter",
              accent: 1,
            },
            {
              asset: "badge",
              value: "04",
              title: "Getting started",
              body: "What the first two weeks actually look like",
              accent: 1,
            },
          ],
        }),
        contactFooter({ slot: "footer", items: [{ label: "02" }] }),
      ],
    }),

    slide({
      id: "problem",
      name: "The problem",
      layout: "band",
      motif: "meshBands",
      blocks: [
        heading({ slot: "full", kicker: "Where it hurts", title: "Three places deals go cold" }),
        iso3d({
          slot: "main",
          divided: true,
          scale: 66,
          items: [
            {
              asset: "torus",
              value: "9d",
              title: "Before first reply",
              body: "The median across inbound leads in teams of your size",
              accent: 1,
            },
            {
              asset: "shards",
              value: "4",
              title: "Tools per deal",
              body: "Each with its own notes, and none of them agreeing",
              accent: 1,
            },
            {
              asset: "blob",
              value: "38%",
              title: "Lost to silence",
              body: "Deals that die with nobody deciding anything",
              accent: 1,
            },
          ],
        }),
        contactFooter({ slot: "footer", items: [{ label: "03" }] }),
      ],
    }),

    slide({
      id: "solution",
      name: "What changes",
      layout: "showcase",
      motif: "meshField",
      split: 0.54,
      blocks: [
        heading({ slot: "full", kicker: "What changes", title: "One place, one thread" }),
        paragraph({ slot: "main", body: "Every message, call and document against one record, so the next action is always obvious and never waiting on whoever happened to take the call." }),
        checklist({
          slot: "main",
          items: [
            "One thread per deal, across every channel",
            "The next action assigned, not implied",
            "Nothing re-keyed between four systems",
          ],
        }),
        iso3d({ slot: "aside", scale: 236, items: [{ asset: "chevron", title: "", accent: 1 }] }),
        contactFooter({ slot: "footer", items: [{ label: "04" }] }),
      ],
    }),

    slide({
      id: "proof",
      name: "Results",
      layout: "stack",
      motif: "none",
      invert: true,
      blocks: [
        heading({ kicker: "Results", title: "What a quarter looks like" }),
        chart({
          grow: 1,
          kind: "barChart",
          categories: ["Before","Month 1","Month 2","Month 3"],
          series: [
            { name: "Days to signature", values: [31,26,21,18], accent: 1 },
          ],
          caption: "Same team, same market, measured on their own records.",
        }),
        contactFooter({ slot: "footer", items: [{ label: "05" }] }),
      ],
    }),

    slide({
      id: "market",
      name: "Who it is for",
      layout: "hero",
      motif: "meshBands",
      split: 0.5,
      blocks: [
        heading({ slot: "full", kicker: "Who it is for", title: "Teams of five to fifty" }),
        paragraph({ slot: "main", body: "Big enough that deals get lost between people, small enough that nobody wants a six-month implementation to fix it." }),
        metricRow({
          slot: "main",
          items: [
            { value: "5 to 50", label: "Sellers" },
            { value: "11 days", label: "To live" },
            { value: "0", label: "Setup fee" },
          ],
        }),
        iso3d({ slot: "aside", scale: 380, items: [{ asset: "climb", title: "", accent: 1 }] }),
        contactFooter({ slot: "footer", items: [{ label: "06" }] }),
      ],
    }),

    slide({
      id: "model",
      name: "Pricing",
      layout: "stack",
      motif: "meshBands",
      blocks: [
        heading({ kicker: "Pricing", title: "What it costs" }),
        pricingTable({
          grow: 1,
          plans: [
            {
              name: "Pilot",
              price: "$0",
              period: "30 days",
              features: ["Your real data","No card","We remove our side if you walk"],
            },
            {
              name: "Per seat",
              price: "$49",
              period: "monthly",
              highlight: true,
              features: ["Everything included","Cancel whenever","Migration done for you"],
            },
            {
              name: "Scale",
              price: "Custom",
              period: "40+ seats",
              features: ["Annual terms","Single sign-on","A named contact"],
            },
          ],
        }),
        contactFooter({ slot: "footer", items: [{ label: "07" }] }),
      ],
    }),

    slide({
      id: "objections",
      name: "The usual questions",
      layout: "band",
      motif: "meshBands",
      blocks: [
        heading({ slot: "full", kicker: "The usual questions", title: "What you are about to ask" }),
        iso3d({
          slot: "main",
          divided: true,
          scale: 66,
          items: [
            {
              asset: "wedge",
              value: "11d",
              title: "Migration",
              body: "We move your records; your team keeps selling throughout",
              accent: 1,
            },
            {
              asset: "lattice",
              value: "Yes",
              title: "It integrates",
              body: "With the four tools you named on the first call",
              accent: 1,
            },
            {
              asset: "badge",
              value: "SOC 2",
              title: "Security",
              body: "Type II, with the report available before you sign",
              accent: 1,
            },
          ],
        }),
        contactFooter({ slot: "footer", items: [{ label: "08" }] }),
      ],
    }),

    slide({
      id: "people",
      name: "Your team",
      layout: "band",
      motif: "none",
      blocks: [
        heading({ slot: "full", kicker: "Your team", title: "Who you will deal with" }),
        teamCards({
          slot: "main",
          style: { columns: 3 },
          items: [
            {
              name: "Nadia Osei",
              role: "Account Director",
              bio: "Your first call and your escalation, for as long as you stay",
              photoPrompt: "professional headshot of a woman in a warm-toned blazer, soft studio lighting, neutral background",
            },
            {
              name: "Ben Carter",
              role: "Solutions Engineer",
              bio: "Runs the migration and builds the first three workflows",
              photoPrompt: "professional headshot of a man in a casual shirt, soft studio lighting, neutral background",
            },
            {
              name: "Aisha Rahman",
              role: "Customer Success",
              bio: "Checks in weekly for a month, then monthly, then when you ask",
              photoPrompt: "professional headshot of a woman in business casual, soft studio lighting, neutral background",
            },
          ],
        }),
        contactFooter({ slot: "footer", items: [{ label: "09" }] }),
      ],
    }),

    slide({
      id: "next",
      name: "Next steps",
      layout: "stack",
      motif: "none",
      invert: true,
      blocks: [
        heading({ kicker: "Next steps", title: "The first two weeks" }),
        processFlow({
          grow: 1,
          numbered: true,
          items: [
            { title: "Pilot opens", body: "Your data and your pipeline, nothing else to configure" },
            { title: "Workflows built", body: "The three that matter, in one session with your team" },
            { title: "Team goes live", body: "Everyone working in it, old tool still available" },
            { title: "You decide", body: "Keep it or walk away, on day thirty" },
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
        heading({ slot: "full", kicker: "Next", title: "Start the pilot" }),
        paragraph({ slot: "main", body: "Thirty days with your own data. If it has not paid for itself by the end, we part on good terms." }),
        iso3d({ slot: "aside", scale: 300, items: [{ asset: "star", title: "", accent: 1 }] }),
        contactFooter({
          slot: "footer",
          items: [
            { icon: "globe", label: "yourcompany.com" },
            { icon: "mail", label: "hello@yourcompany.com" },
          ],
        }),
      ],
    }),
  ],
};
