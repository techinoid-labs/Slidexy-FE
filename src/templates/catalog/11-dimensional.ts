/**
 * 11. Dimensional
 *
 * TWO FRAMES, ALTERNATING. A deck built from one composition flattens out
 * however good that composition is, so this runs two and cuts between them:
 *
 *   BAND    eyebrow, a headline across the top, and a row of columns on the
 *           bottom margin divided by hairlines. Each column is an object, a
 *           figure, a caps label and two lines of supporting copy.
 *
 *   HERO    headline, copy and a second element on the left, with one large
 *           isometric scene owning the right half.
 *
 * SIGNATURE DEVICE: isometric blocks in vermilion, in every band column and
 * at full size on every hero slide. They come from `assets3d.tsx`, drawn as
 * true isometric artwork with gradient faces, a specular band and rim light,
 * carrying invisible hulls that export as real PowerPoint geometry.
 *
 * RHYTHM: three slides invert the field, which breaks a long deck into
 * chapters without introducing a second palette.
 *
 * COPY DENSITY: a figure leads every column, then a caps label, then two
 * lines that earn their place. Around sixty words a slide. Note this is
 * catalogue copy, which is marketing and read at leisure. The generator's
 * own limits in `generateSlideText.js` are deliberately tighter and nothing
 * here changes them.
 */

import { dimensionalClay } from "../themes";
import type { SlideTemplate } from "../types";
import {
  checklist,
  contactFooter,
  heading,
  iso3d,
  metricRow,
  paragraph,
  slide,
  teamCards,
} from "./helpers";

export const dimensional: SlideTemplate = {
  id: "dimensional",
  number: 11,
  name: "Dimensional",
  category: "Product",
  archetype: "product",
  description: "Isometric blocks and an editorial frame, editable all the way out.",
  theme: dimensionalClay,
  slides: [
    // 1. Cover. The skyline carries the right, three figures hold the left.
    slide({
      id: "cover",
      name: "Cover",
      layout: "hero",
      motif: "meshField",
      split: 0.5,
      blocks: [
        heading({ slot: "full", kicker: "Dimensional", title: "Built in blocks" }),
        paragraph({
          slot: "main",
          body: "A deck system whose shapes are still shapes after the export. Every object here is a real PowerPoint solid, not a picture of one.",
        }),
        metricRow({
          slot: "main",
          items: [
            { value: "34", label: "3D objects" },
            { value: "11", label: "Slide archetypes" },
            { value: "100%", label: "Editable out" },
          ],
        }),
        iso3d({ slot: "aside", scale: 440, items: [{ asset: "cluster", title: "", accent: 1 }] }),
        contactFooter({ slot: "footer", items: [{ label: "YOUR LOGO" }, { label: "2026" }] }),
      ],
    }),

    // 2. Contents.
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
          scale: 78,
          style: { columns: 4 },
          items: [
            {
              asset: "gem",
              value: "01",
              title: "The problem",
              body: "Where decks go wrong today, and why the fix has to sit in the file rather than the tool",
              accent: 1,
            },
            {
              asset: "torus",
              value: "02",
              title: "Our answer",
              body: "One editable core under every surface, so a change lands in all of them at once",
              accent: 1,
            },
            {
              asset: "tower",
              value: "03",
              title: "The proof",
              body: "Numbers from the teams already running it, against their own previous workflow",
              accent: 1,
            },
            {
              asset: "arrow",
              value: "04",
              title: "What is next",
              body: "Four quarters of work, and the release that opens the library to everyone",
              accent: 1,
            },
          ],
        }),
        contactFooter({ slot: "footer", items: [{ label: "02" }] }),
      ],
    }),

    // 3. About. First inversion.
    slide({
      id: "about",
      name: "About",
      layout: "band",
      motif: "none",
      invert: true,
      blocks: [
        heading({ slot: "full", kicker: "About", title: "Who we are" }),
        paragraph({
          slot: "aside",
          body: "Twelve people in one workshop, building the tools we wanted and never found.",
        }),
        iso3d({
          slot: "main",
          divided: true,
          scale: 82,
          items: [
            {
              asset: "cubeStack",
              value: "4",
              title: "Products",
              body: "Four surfaces sharing one rendering core, so a fix in one arrives in all of them",
              accent: 1,
            },
            {
              asset: "capsule",
              value: "9 yrs",
              title: "Together",
              body: "The same team in the same workshop, which is why the file format has not churned",
              accent: 1,
            },
            {
              asset: "torus",
              value: "40k",
              title: "Decks made",
              body: "Built on the system last quarter, across agencies, studios and in-house teams",
              accent: 1,
            },
          ],
        }),
        contactFooter({ slot: "footer", items: [{ label: "03" }] }),
      ],
    }),

    // 4. Problem.
    slide({
      id: "problem",
      name: "Problem",
      layout: "band",
      motif: "meshBands",
      blocks: [
        heading({ slot: "full", kicker: "The problem", title: "Three things break every time" }),
        iso3d({
          slot: "main",
          divided: true,
          scale: 82,
          items: [
            {
              asset: "cards",
              value: "4",
              title: "Versions lost",
              body: "Four files called final, and the one on the shared drive is not the one presented",
              accent: 1,
            },
            {
              asset: "gear",
              value: "3",
              title: "Tools per deck",
              body: "Three tools and two handoffs between the brief and the room it is shown in",
              accent: 1,
            },
            {
              asset: "blob",
              value: "0",
              title: "Editable slides",
              body: "What arrives is a picture of a slide, so changing a number means starting again",
              accent: 1,
            },
          ],
        }),
        contactFooter({ slot: "footer", items: [{ label: "04" }] }),
      ],
    }),

    // 5. Solution. Hero, with the three promises listed under the copy.
    slide({
      id: "solution",
      name: "Solution",
      layout: "hero",
      motif: "meshLattice",
      split: 0.54,
      blocks: [
        heading({ slot: "full", kicker: "Our answer", title: "One core, every surface" }),
        paragraph({
          slot: "main",
          body: "One rendering core behind the editor, the web view and the export, so a deck means the same thing everywhere it lands.",
        }),
        checklist({
          slot: "main",
          items: [
            "Every shape stays a real shape on the way out",
            "Recolour a whole deck from one palette",
            "Swap a layer without touching the rest",
          ],
        }),
        iso3d({ slot: "aside", scale: 380, items: [{ asset: "orbit", title: "", accent: 1 }] }),
        contactFooter({ slot: "footer", items: [{ label: "05" }] }),
      ],
    }),

    // 6. Proof. Second inversion.
    slide({
      id: "proof",
      name: "Proof",
      layout: "band",
      motif: "meshBands",
      invert: true,
      blocks: [
        heading({ slot: "full", kicker: "Proof", title: "What changed for the teams on it" }),
        iso3d({
          slot: "main",
          divided: true,
          scale: 76,
          items: [
            {
              asset: "bolt",
              value: "4.2x",
              title: "To a first draft",
              body: "Measured against the same teams' previous workflow, over their first full quarter",
              accent: 1,
            },
            {
              asset: "pieWedge",
              value: "61%",
              title: "Fewer edits",
              body: "Rounds after the first review, because the numbers stay editable where they sit",
              accent: 1,
            },
            {
              asset: "arrow",
              value: "9 days",
              title: "Brief to board",
              body: "Down from twenty six, with no extra headcount and no change of agency",
              accent: 1,
            },
          ],
        }),
        contactFooter({ slot: "footer", items: [{ label: "06" }] }),
      ],
    }),

    // 7. Market. Hero, with the sizing as figures under the copy.
    slide({
      id: "market",
      name: "Market",
      layout: "hero",
      motif: "meshPlane",
      split: 0.52,
      blocks: [
        heading({ slot: "full", kicker: "Market", title: "Where we grow" }),
        paragraph({
          slot: "main",
          body: "Mid-market design tooling: teams too large for a free plan and too small for an agency retainer. Nobody serves them properly.",
        }),
        metricRow({
          slot: "main",
          items: [
            { value: "$6.1B", label: "By 2028" },
            { value: "34%", label: "Annual growth" },
            { value: "3", label: "Segments" },
          ],
        }),
        iso3d({ slot: "aside", scale: 410, items: [{ asset: "terrain", title: "", accent: 1 }] }),
        contactFooter({ slot: "footer", items: [{ label: "07" }] }),
      ],
    }),

    // 8. Model.
    slide({
      id: "model",
      name: "Model",
      layout: "band",
      motif: "meshBands",
      blocks: [
        heading({ slot: "full", kicker: "Model", title: "Three tiers, one product" }),
        iso3d({
          slot: "main",
          divided: true,
          scale: 82,
          items: [
            {
              asset: "cube",
              value: "$0",
              title: "Starter",
              body: "One editor, the full template library, and editable export on the free plan too",
              accent: 1,
            },
            {
              asset: "cylinder",
              value: "$24",
              title: "Studio",
              body: "Per seat each month, adding a shared library, a brand kit and version history",
              accent: 1,
            },
            {
              asset: "gem",
              value: "Talk",
              title: "Enterprise",
              body: "Controls, single sign-on, audit history and a named engineer on support",
              accent: 1,
            },
          ],
        }),
        contactFooter({ slot: "footer", items: [{ label: "08" }] }),
      ],
    }),

    // 9. People.
    slide({
      id: "people",
      name: "People",
      layout: "band",
      motif: "none",
      blocks: [
        heading({ slot: "full", kicker: "People", title: "Who builds it" }),
        teamCards({
          slot: "main",
          style: { columns: 3 },
          items: [
            {
              name: "Sarah Khan",
              role: "Founder",
              bio: "Ten years in product and design tooling, most of it spent on file formats",
              photoPrompt: "professional headshot of a woman founder, soft studio lighting, neutral background",
            },
            {
              name: "Ali Raza",
              role: "Engineering",
              bio: "Builds the rendering core and the export pipeline everything else sits on",
              photoPrompt: "professional headshot of a man in a casual shirt, soft studio lighting, neutral background",
            },
            {
              name: "Ayesha Malik",
              role: "Design",
              bio: "Owns the template library and the 3D object set the whole system draws from",
              photoPrompt: "professional headshot of a woman in business casual, soft studio lighting, neutral background",
            },
          ],
        }),
        contactFooter({ slot: "footer", items: [{ label: "09" }] }),
      ],
    }),

    // 10. Next. Third inversion.
    slide({
      id: "next",
      name: "What is next",
      layout: "band",
      motif: "meshBands",
      invert: true,
      blocks: [
        heading({ slot: "full", kicker: "What is next", title: "The year ahead" }),
        iso3d({
          slot: "main",
          divided: true,
          scale: 68,
          style: { columns: 4 },
          items: [
            {
              asset: "cone",
              value: "Q1",
              title: "Shared libraries",
              body: "One brand kit per team, with templates that update everywhere when they change",
              accent: 1,
            },
            {
              asset: "capsule",
              value: "Q2",
              title: "Live sync",
              body: "Edits land in every open copy at once, so nobody presents a stale file again",
              accent: 1,
            },
            {
              asset: "badge",
              value: "Q3",
              title: "Three languages",
              body: "German, French and Urdu, with the type scale retuned for each of them",
              accent: 1,
            },
            {
              asset: "pyramid",
              value: "Q4",
              title: "Open library",
              body: "Anyone can publish a template, and keep a share of what it earns",
              accent: 1,
            },
          ],
        }),
        contactFooter({ slot: "footer", items: [{ label: "10" }] }),
      ],
    }),

    // 11. Close. Hero, so the deck ends on the object it opened with.
    slide({
      id: "close",
      name: "Close",
      layout: "hero",
      motif: "meshField",
      split: 0.52,
      blocks: [
        heading({ slot: "full", kicker: "Thank you", title: "Let's build it" }),
        paragraph({
          slot: "main",
          body: "Start a deck in the editor, or send us the brief and we will build the first draft with you.",
        }),
        iso3d({ slot: "aside", scale: 360, items: [{ asset: "helix", title: "", accent: 1 }] }),
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
