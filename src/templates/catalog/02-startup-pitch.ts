/**
 * 02. Startup Pitch Deck
 *
 * DEVICE: objects that move, a helix climbing, a bolt, an arrow, an
 * orbit. Everything in this deck is going somewhere.
 * 
 * DENSITY: fast. Short headlines, one figure a column, and a mesh field
 * behind so the slides feel lit rather than printed.
 *
 * COMPOSITIONS: showcase, band, hero, chart, split, pricing, table, people.
 * Every template shares the frame, and draws a different sequence from
 * it, so no two decks run the same shapes in the same order.
 */

import { startupViolet } from "../themes";
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
  pricingTable,
  slide,
  teamCards,
} from "./helpers";

export const startupPitch: SlideTemplate = {
  id: "startup-pitch",
  number: 2,
  name: "Startup Pitch Deck",
  category: "Business",
  archetype: "pitch",
  description: "Violet on near-black, objects in motion, built to be read in ten minutes.",
  theme: startupViolet,
  slides: [
    slide({
      id: "cover",
      name: "Cover",
      layout: "showcase",
      motif: "meshField",
      split: 0.5,
      blocks: [
        heading({ slot: "full", kicker: "Seed Round", title: "Ship it faster" }),
        paragraph({ slot: "main", body: "The tooling that cuts a team's release cycle from three weeks to two days, now used by 400 engineering teams." }),
        metricRow({
          slot: "main",
          items: [
            { value: "400", label: "Teams" },
            { value: "8.4x", label: "Faster" },
            { value: "$2.1M", label: "ARR" },
          ],
        }),
        iso3d({ slot: "aside", scale: 236, items: [{ asset: "spiral", title: "", accent: 1 }] }),
        contactFooter({ slot: "footer", items: [{ label: "YOUR LOGO" }, { label: "2026" }] }),
      ],
    }),

    slide({
      id: "contents",
      name: "Contents",
      layout: "band",
      motif: "meshBands",
      blocks: [
        heading({ slot: "full", kicker: "Contents", title: "Ten minutes" }),
        iso3d({
          slot: "main",
          divided: true,
          scale: 56,
          style: { columns: 4 },
          items: [
            {
              asset: "bolt",
              value: "01",
              title: "The problem",
              body: "Why shipping is still slow in teams that know better",
              accent: 1,
            },
            {
              asset: "orbit",
              value: "02",
              title: "The product",
              body: "One tool, and the thing it replaces in every workflow",
              accent: 1,
            },
            {
              asset: "arrow",
              value: "03",
              title: "Traction",
              body: "What four hundred teams have done with it so far",
              accent: 1,
            },
            {
              asset: "steps",
              value: "04",
              title: "The ask",
              body: "What we are raising and exactly where it goes",
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
        heading({ slot: "full", kicker: "The problem", title: "Shipping is slow for boring reasons" }),
        iso3d({
          slot: "main",
          divided: true,
          scale: 66,
          items: [
            {
              asset: "torus",
              value: "19d",
              title: "Release cycle",
              body: "The median for a team of twenty, and it is getting worse",
              accent: 1,
            },
            {
              asset: "shards",
              value: "6",
              title: "Tools in the chain",
              body: "Each one owned by a different team with its own queue",
              accent: 1,
            },
            {
              asset: "blob",
              value: "41%",
              title: "Time waiting",
              body: "Engineers blocked on something they cannot unblock",
              accent: 1,
            },
          ],
        }),
        contactFooter({ slot: "footer", items: [{ label: "03" }] }),
      ],
    }),

    slide({
      id: "solution",
      name: "The product",
      layout: "hero",
      motif: "meshLattice",
      split: 0.54,
      blocks: [
        heading({ slot: "full", kicker: "The product", title: "One pipeline, no queue" }),
        paragraph({ slot: "main", body: "A single pipeline that owns build, review and release, so the thing blocking a deploy is visible to the person who can clear it." }),
        checklist({
          slot: "main",
          items: [
            "Build, review and release in one place",
            "Blockers routed to whoever can clear them",
            "Deploys in minutes, not approvals in days",
          ],
        }),
        iso3d({ slot: "aside", scale: 350, items: [{ asset: "orbit", title: "", accent: 1 }] }),
        contactFooter({ slot: "footer", items: [{ label: "04" }] }),
      ],
    }),

    slide({
      id: "proof",
      name: "Traction",
      layout: "stack",
      motif: "none",
      invert: true,
      blocks: [
        heading({ kicker: "Traction", title: "Teams on the platform" }),
        chart({
          grow: 1,
          kind: "lineChart",
          categories: ["Jan","Mar","May","Jul","Sep","Nov"],
          series: [
            { name: "Active teams", values: [42,96,168,241,326,400], accent: 1 },
          ],
          yFormat: "compact",
          caption: "Net of churn, which has run under 2% a month all year.",
        }),
        contactFooter({ slot: "footer", items: [{ label: "05" }] }),
      ],
    }),

    slide({
      id: "market",
      name: "Market",
      layout: "split",
      motif: "meshField",
      split: 0.5,
      blocks: [
        heading({ slot: "full", kicker: "Market", title: "Every team that ships" }),
        paragraph({ slot: "main", body: "Two million engineering teams run a release process complex enough to need this, and the tools they use today were designed for a different decade." }),
        metricRow({
          slot: "main",
          items: [
            { value: "$14B", label: "Addressable" },
            { value: "2M", label: "Teams" },
            { value: "29%", label: "Growth" },
          ],
        }),
        iso3d({ slot: "aside", scale: 390, items: [{ asset: "climb", title: "", accent: 1 }] }),
        contactFooter({ slot: "footer", items: [{ label: "06" }] }),
      ],
    }),

    slide({
      id: "model",
      name: "Business model",
      layout: "stack",
      motif: "meshBands",
      blocks: [
        heading({ kicker: "Business model", title: "Per seat, per month" }),
        pricingTable({
          grow: 1,
          plans: [
            {
              name: "Free",
              price: "$0",
              period: "up to 5",
              features: ["The full pipeline","Unlimited repositories","Community support"],
            },
            {
              name: "Team",
              price: "$29",
              period: "per seat",
              highlight: true,
              features: ["Everything in Free","Policy rules","Audit history","Priority support"],
            },
            {
              name: "Enterprise",
              price: "Custom",
              features: ["Self-hosted","Single sign-on","A named engineer"],
            },
          ],
        }),
        contactFooter({ slot: "footer", items: [{ label: "07" }] }),
      ],
    }),

    slide({
      id: "competition",
      name: "Competition",
      layout: "stack",
      motif: "meshBands",
      blocks: [
        heading({ kicker: "Landscape", title: "Why the incumbents cannot follow" }),
        comparisonTable({
          grow: 1,
          columns: [
            { label: "Us", highlight: true },
            { label: "Incumbent" },
            { label: "Point tools" },
          ],
          rows: [
            { label: "Owns the whole chain", cells: ["yes","no","no"] },
            { label: "Priced per seat", cells: ["yes","no","partial"] },
            { label: "Blockers routed automatically", cells: ["yes","no","no"] },
            { label: "Median time to deploy", cells: ["2 days","19 days","11 days"] },
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
        heading({ slot: "full", kicker: "Team", title: "Who is building it" }),
        teamCards({
          slot: "main",
          style: { columns: 3 },
          items: [
            {
              name: "Sarah Khan",
              role: "Co-founder, CEO",
              bio: "Ran release engineering for a thousand-person team",
              photoPrompt: "professional headshot of a woman founder, soft studio lighting, neutral background",
            },
            {
              name: "Ali Raza",
              role: "Co-founder, CTO",
              bio: "Built the pipeline that this product started as",
              photoPrompt: "professional headshot of a man in a casual shirt, soft studio lighting, neutral background",
            },
            {
              name: "Jonas Weber",
              role: "Head of Product",
              bio: "Eight years shipping developer tools people like",
              photoPrompt: "professional headshot of a man in a plain jumper, soft studio lighting, neutral background",
            },
          ],
        }),
        contactFooter({ slot: "footer", items: [{ label: "09" }] }),
      ],
    }),

    slide({
      id: "next",
      name: "Roadmap",
      layout: "band",
      motif: "none",
      invert: true,
      blocks: [
        heading({ slot: "full", kicker: "Roadmap", title: "The next four quarters" }),
        iso3d({
          slot: "main",
          divided: true,
          scale: 56,
          style: { columns: 4 },
          items: [
            {
              asset: "cone",
              value: "Q1",
              title: "Self-hosted",
              body: "The blocker on every enterprise conversation we have",
              accent: 1,
            },
            {
              asset: "capsule",
              value: "Q2",
              title: "Policy engine",
              body: "Rules teams can write instead of asking us to",
              accent: 1,
            },
            {
              asset: "badge",
              value: "Q3",
              title: "Compliance",
              body: "SOC 2 Type II, which unlocks the regulated buyers",
              accent: 1,
            },
            {
              asset: "helix",
              value: "Q4",
              title: "Open plugins",
              body: "Anyone can extend the pipeline and charge for it",
              accent: 1,
            },
          ],
        }),
        contactFooter({ slot: "footer", items: [{ label: "10" }] }),
      ],
    }),

    slide({
      id: "close",
      name: "The ask",
      layout: "hero",
      motif: "meshField",
      split: 0.52,
      blocks: [
        heading({ slot: "full", kicker: "The ask", title: "$5M to go faster" }),
        paragraph({ slot: "main", body: "Eighteen months of runway, twelve engineers, and the self-hosted build that converts the pipeline we already have." }),
        iso3d({ slot: "aside", scale: 330, items: [{ asset: "helix", title: "", accent: 1 }] }),
        contactFooter({
          slot: "footer",
          items: [
            { icon: "globe", label: "yourcompany.com" },
            { icon: "mail", label: "founders@yourcompany.com" },
          ],
        }),
      ],
    }),
  ],
};
