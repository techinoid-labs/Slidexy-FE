/**
 * 07. Product Launch
 *
 * DEVICE: soft, floating objects. Capsules, tiles lifted off their
 * plinth, a sphere in orbit. A launch deck should feel like something
 * arriving rather than something reported.
 * 
 * DENSITY: generous. Large radii, a lattice fogging out behind, and one
 * object given real room on every other slide.
 *
 * COMPOSITIONS: showcase, band, hero, chart, gallery, split, pricing, people, statement.
 * Every template shares the frame, and draws a different sequence from
 * it, so no two decks run the same shapes in the same order.
 */

import { productIndigo } from "../themes";
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
  pricingTable,
  slide,
  teamCards,
} from "./helpers";

export const productLaunch: SlideTemplate = {
  id: "product-launch",
  number: 7,
  name: "Product Launch",
  category: "Product",
  archetype: "product",
  description: "Indigo on midnight, soft capsules and floating tiles, built for a keynote.",
  theme: productIndigo,
  slides: [
    slide({
      id: "cover",
      name: "Cover",
      layout: "showcase",
      motif: "meshLattice",
      split: 0.5,
      blocks: [
        heading({ slot: "full", kicker: "Launching March", title: "Meet the new one" }),
        paragraph({ slot: "main", body: "Three years of work, rebuilt from the file format up, and the first version we have been willing to put our name on." }),
        metricRow({
          slot: "main",
          items: [
            { value: "3yr", label: "In the making" },
            { value: "4x", label: "Faster" },
            { value: "1", label: "File format" },
          ],
        }),
        iso3d({ slot: "aside", scale: 236, items: [{ asset: "floatTiles", title: "", accent: 1 }] }),
        contactFooter({ slot: "footer", items: [{ label: "YOUR PRODUCT" }, { label: "MARCH 2026" }] }),
      ],
    }),

    slide({
      id: "contents",
      name: "Contents",
      layout: "band",
      motif: "meshBands",
      blocks: [
        heading({ slot: "full", kicker: "Contents", title: "What is new" }),
        iso3d({
          slot: "main",
          divided: true,
          scale: 56,
          style: { columns: 4 },
          items: [
            {
              asset: "capsule",
              value: "01",
              title: "The problem",
              body: "What the old version could never be talked into doing",
              accent: 1,
            },
            {
              asset: "orbit",
              value: "02",
              title: "The rebuild",
              body: "What we changed underneath, and why it took three years",
              accent: 1,
            },
            {
              asset: "star",
              value: "03",
              title: "The features",
              body: "The four that people will actually notice on day one",
              accent: 1,
            },
            {
              asset: "arrow",
              value: "04",
              title: "Availability",
              body: "Pricing, dates, and what happens to your old files",
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
        heading({ slot: "full", kicker: "Why rebuild", title: "What we could not fix" }),
        iso3d({
          slot: "main",
          divided: true,
          scale: 66,
          items: [
            {
              asset: "torus",
              value: "11s",
              title: "Open time",
              body: "For a large file, on hardware that should not care",
              accent: 1,
            },
            {
              asset: "shards",
              value: "3",
              title: "Rendering paths",
              body: "Editor, preview and export, each drifting from the others",
              accent: 1,
            },
            {
              asset: "blob",
              value: "0",
              title: "Plugin surface",
              body: "Because nothing underneath was stable enough to expose",
              accent: 1,
            },
          ],
        }),
        contactFooter({ slot: "footer", items: [{ label: "03" }] }),
      ],
    }),

    slide({
      id: "solution",
      name: "The rebuild",
      layout: "hero",
      motif: "meshField",
      split: 0.54,
      blocks: [
        heading({ slot: "full", kicker: "The rebuild", title: "One core, underneath" }),
        paragraph({ slot: "main", body: "Editor, preview and export now run the same renderer against the same document, so what you see is what ships, every time." }),
        checklist({
          slot: "main",
          items: [
            "One renderer behind all three surfaces",
            "Documents open in under a second",
            "A plugin API, because the core is finally stable",
          ],
        }),
        iso3d({ slot: "aside", scale: 360, items: [{ asset: "capsule", title: "", accent: 1 }] }),
        contactFooter({ slot: "footer", items: [{ label: "04" }] }),
      ],
    }),

    slide({
      id: "proof",
      name: "The numbers",
      layout: "stack",
      motif: "none",
      invert: true,
      blocks: [
        heading({ kicker: "The numbers", title: "What changed underneath" }),
        chart({
          grow: 1,
          kind: "barChart",
          categories: ["Open a large file","Export","First paint","Save"],
          series: [
            { name: "Old version", values: [11,8.4,2.9,1.8], accent: 3 },
            { name: "New version", values: [0.8,2.1,0.4,0.3], accent: 1 },
          ],
          caption: "Seconds, on the same files and the same machines.",
        }),
        contactFooter({ slot: "footer", items: [{ label: "05" }] }),
      ],
    }),

    slide({
      id: "features",
      name: "Features",
      layout: "stack",
      motif: "meshBands",
      blocks: [
        heading({ kicker: "Day one", title: "What you will notice" }),
        imageGrid({
          grow: 1,
          style: { columns: 3 },
          items: [
            { title: "Instant open", body: "Large documents load before you finish clicking", prompt: "clean laptop screen on a minimal desk, soft studio light, no text, no interface" },
            { title: "Real layers", body: "Groups and masks that survive a round trip", prompt: "designer hands arranging paper shapes on a light table, overhead, no text" },
            { title: "True export", body: "Every object editable in whatever opens it next", prompt: "printed document and a tablet side by side on a desk, daylight, no text" },
          ],
        }),
        contactFooter({ slot: "footer", items: [{ label: "06" }] }),
      ],
    }),

    slide({
      id: "market",
      name: "Who it is for",
      layout: "split",
      motif: "meshLattice",
      split: 0.5,
      blocks: [
        heading({ slot: "full", kicker: "Who it is for", title: "Everyone on the old one" }),
        paragraph({ slot: "main", body: "Four hundred thousand people use the version this replaces. Every file they have made opens in the new one without conversion." }),
        metricRow({
          slot: "main",
          items: [
            { value: "400k", label: "On the old version" },
            { value: "100%", label: "Files open" },
            { value: "£0", label: "To upgrade" },
          ],
        }),
        iso3d({ slot: "aside", scale: 390, items: [{ asset: "desk", title: "", accent: 1 }] }),
        contactFooter({ slot: "footer", items: [{ label: "07" }] }),
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
              name: "Existing users",
              price: "£0",
              period: "upgrade",
              features: ["Free on a current licence","Every file opens","No conversion step"],
            },
            {
              name: "Individual",
              price: "£12",
              period: "monthly",
              highlight: true,
              features: ["The full application","Plugin registry","Cloud sync"],
            },
            {
              name: "Team",
              price: "£29",
              period: "per seat",
              features: ["Shared libraries","Brand kit","Admin controls"],
            },
          ],
        }),
        contactFooter({ slot: "footer", items: [{ label: "08" }] }),
      ],
    }),

    slide({
      id: "people",
      name: "The team",
      layout: "band",
      motif: "none",
      blocks: [
        heading({ slot: "full", kicker: "The team", title: "Who built it" }),
        teamCards({
          slot: "main",
          style: { columns: 3 },
          items: [
            {
              name: "Yuki Tanaka",
              role: "Product",
              bio: "Decided what to leave out, which took most of the three years",
              photoPrompt: "professional headshot of a woman in a dark top, soft studio lighting, neutral background",
            },
            {
              name: "Oscar Lindgren",
              role: "Engineering",
              bio: "Wrote the renderer that all three surfaces now share",
              photoPrompt: "professional headshot of a man with a beard, soft studio lighting, neutral background",
            },
            {
              name: "Fatima Siddiqui",
              role: "Design",
              bio: "Owns the object library and the way the whole thing feels",
              photoPrompt: "professional headshot of a woman in business casual, soft studio lighting, neutral background",
            },
          ],
        }),
        contactFooter({ slot: "footer", items: [{ label: "09" }] }),
      ],
    }),

    slide({
      id: "next",
      name: "Launch plan",
      layout: "band",
      motif: "none",
      invert: true,
      blocks: [
        heading({ slot: "full", kicker: "Launch plan", title: "The next four months" }),
        iso3d({
          slot: "main",
          divided: true,
          scale: 56,
          style: { columns: 4 },
          items: [
            {
              asset: "cone",
              value: "Mar",
              title: "General release",
              body: "Everyone on the old version is offered the upgrade",
              accent: 1,
            },
            {
              asset: "capsule",
              value: "Apr",
              title: "Plugin registry",
              body: "Opens to the twelve partners already building",
              accent: 1,
            },
            {
              asset: "badge",
              value: "May",
              title: "Teams",
              body: "Shared libraries and the first enterprise controls",
              accent: 1,
            },
            {
              asset: "helix",
              value: "Jun",
              title: "Open API",
              body: "Anyone can build and sell against the core",
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
      motif: "meshLattice",
      blocks: [
        heading({ slot: "full", kicker: "Available now", title: "Try the beta" }),
        paragraph({ slot: "main", body: "Open your heaviest file in it. That is the only test that has ever mattered to us." }),
        contactFooter({
          slot: "footer",
          items: [
            { icon: "globe", label: "yourproduct.com" },
            { icon: "mail", label: "beta@yourproduct.com" },
          ],
        }),
      ],
    }),
  ],
};
