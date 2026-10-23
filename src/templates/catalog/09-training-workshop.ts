/**
 * 09. Training & Workshop
 *
 * DEVICE: things that are assembled. Steps, lattices, stacked plates
 * and a badge at the end, in one blue, on a lattice that fades out.
 * 
 * DENSITY: open and friendly. A rounded humanist face, large radii, and
 * one idea a column so the room can follow it while you talk.
 *
 * COMPOSITIONS: split, timeline, band, hero, quote, process, showcase, people, table.
 * Every template shares the frame, and draws a different sequence from
 * it, so no two decks run the same shapes in the same order.
 */

import { educationSky } from "../themes";
import type { SlideTemplate } from "../types";
import {
  checklist,
  comparisonTable,
  contactFooter,
  heading,
  iso3d,
  metricRow,
  paragraph,
  processFlow,
  quote,
  slide,
  teamCards,
  timeline,
} from "./helpers";

export const trainingWorkshop: SlideTemplate = {
  id: "training-workshop",
  number: 9,
  name: "Training & Workshop",
  category: "Education",
  archetype: "education",
  description: "Studio sky and rounded type, objects that build up step by step.",
  theme: educationSky,
  slides: [
    slide({
      id: "cover",
      name: "Cover",
      layout: "split",
      motif: "meshLattice",
      split: 0.52,
      blocks: [
        heading({ slot: "full", kicker: "Workshop", title: "Learn it by building it" }),
        paragraph({ slot: "main", body: "A full day, four exercises, and one thing you will have built by the end that you can take back and use on Monday." }),
        metricRow({
          slot: "main",
          items: [
            { value: "1 day", label: "Length" },
            { value: "4", label: "Exercises" },
            { value: "12", label: "Places" },
          ],
        }),
        iso3d({ slot: "aside", scale: 360, items: [{ asset: "climb", title: "", accent: 1 }] }),
        contactFooter({ slot: "footer", items: [{ label: "YOUR ACADEMY" }, { label: "2026" }] }),
      ],
    }),

    slide({
      id: "contents",
      name: "The day",
      layout: "stack",
      motif: "meshBands",
      blocks: [
        heading({ kicker: "The day", title: "How it runs" }),
        timeline({
          grow: 1,
          items: [
            { date: "09:30", title: "Groundwork", body: "The ideas you need before the first exercise makes sense" },
            { date: "11:00", title: "Build one", body: "Your first working version, wrong in instructive ways" },
            { date: "14:00", title: "Build two", body: "The same problem again, with everything you just learned" },
            { date: "16:30", title: "Take it home", body: "Packaging what you built so it survives the journey" },
          ],
        }),
        contactFooter({ slot: "footer", items: [{ label: "02" }] }),
      ],
    }),

    slide({
      id: "about",
      name: "Who it is for",
      layout: "band",
      motif: "none",
      invert: true,
      blocks: [
        heading({ slot: "full", kicker: "Who it is for", title: "Come if this is you" }),
        iso3d({
          slot: "main",
          divided: true,
          scale: 66,
          items: [
            {
              asset: "prism",
              value: "1yr",
              title: "Some experience",
              body: "Enough that the basics will bore you, which we skip",
              accent: 1,
            },
            {
              asset: "capsule",
              value: "0",
              title: "Prerequisites",
              body: "No setup, no reading list, nothing to install beforehand",
              accent: 1,
            },
            {
              asset: "orbit",
              value: "12",
              title: "Per session",
              body: "Small enough that everyone gets looked at twice",
              accent: 1,
            },
          ],
        }),
        contactFooter({ slot: "footer", items: [{ label: "03" }] }),
      ],
    }),

    slide({
      id: "problem",
      name: "Why a workshop",
      layout: "band",
      motif: "meshBands",
      blocks: [
        heading({ slot: "full", kicker: "Why a workshop", title: "Why reading does not work" }),
        iso3d({
          slot: "main",
          divided: true,
          scale: 66,
          items: [
            {
              asset: "blob",
              value: "9%",
              title: "Retained",
              body: "From reading alone, measured a fortnight afterwards",
              accent: 1,
            },
            {
              asset: "torus",
              value: "3x",
              title: "By doing",
              body: "Retention when the learner builds the thing themselves",
              accent: 1,
            },
            {
              asset: "shards",
              value: "0",
              title: "Slides to read",
              body: "You will be building for five of the six hours",
              accent: 1,
            },
          ],
        }),
        contactFooter({ slot: "footer", items: [{ label: "04" }] }),
      ],
    }),

    slide({
      id: "solution",
      name: "The method",
      layout: "hero",
      motif: "meshField",
      split: 0.54,
      blocks: [
        heading({ slot: "full", kicker: "The method", title: "Build, break, build again" }),
        paragraph({ slot: "main", body: "You build it once badly, we break it together in front of the room, and you build it again knowing why the first one failed." }),
        checklist({
          slot: "main",
          items: [
            "Build before you are ready, deliberately",
            "Break it publicly, where it is safe",
            "Build it again with the reason in hand",
          ],
        }),
        iso3d({ slot: "aside", scale: 340, items: [{ asset: "lattice", title: "", accent: 1 }] }),
        contactFooter({ slot: "footer", items: [{ label: "05" }] }),
      ],
    }),

    slide({
      id: "proof",
      name: "What people say",
      layout: "fullBleed",
      motif: "none",
      invert: true,
      blocks: [
        quote({
          grow: 1,
          slot: "full",
          quote: "I had read about this for two years and understood none of it. I built a working one before lunch and have used it every week since.",
          author: "An attendee",
          role: "March session",
        }),
        contactFooter({ slot: "footer", items: [{ label: "06" }] }),
      ],
    }),

    slide({
      id: "exercises",
      name: "The exercises",
      layout: "stack",
      motif: "meshBands",
      blocks: [
        heading({ kicker: "The exercises", title: "What you will build" }),
        processFlow({
          grow: 1,
          numbered: true,
          items: [
            { title: "The simplest version", body: "Working, ugly, and finished inside ninety minutes" },
            { title: "The one that scales", body: "The same problem rebuilt for the case that breaks it" },
            { title: "The one you keep", body: "Documented well enough to hand to someone else" },
          ],
        }),
        contactFooter({ slot: "footer", items: [{ label: "07" }] }),
      ],
    }),

    slide({
      id: "market",
      name: "Logistics",
      layout: "showcase",
      motif: "meshLattice",
      split: 0.5,
      blocks: [
        heading({ slot: "full", kicker: "Logistics", title: "Where and when" }),
        paragraph({ slot: "main", body: "Central location, nine thirty to five, lunch included, and everything you need provided on the day." }),
        metricRow({
          slot: "main",
          items: [
            { value: "09:30", label: "Start" },
            { value: "17:00", label: "Finish" },
            { value: "£340", label: "Per place" },
          ],
        }),
        iso3d({ slot: "aside", scale: 236, items: [{ asset: "team", title: "", accent: 1 }] }),
        contactFooter({ slot: "footer", items: [{ label: "08" }] }),
      ],
    }),

    slide({
      id: "people",
      name: "Who teaches",
      layout: "band",
      motif: "none",
      blocks: [
        heading({ slot: "full", kicker: "Who teaches", title: "In the room" }),
        teamCards({
          slot: "main",
          style: { columns: 3 },
          items: [
            {
              name: "Rosa Delgado",
              role: "Lead facilitator",
              bio: "Has run this workshop eleven times and rewritten it twice",
              photoPrompt: "professional headshot of a woman smiling, soft studio lighting, neutral background",
            },
            {
              name: "Kwame Boateng",
              role: "Assistant",
              bio: "Sits with whoever is stuck, which is everyone at some point",
              photoPrompt: "professional headshot of a man in a casual jumper, soft studio lighting, neutral background",
            },
            {
              name: "Mira Petrova",
              role: "Materials",
              bio: "Writes the exercises and the handbook you take away",
              photoPrompt: "professional headshot of a woman in casual wear, soft studio lighting, neutral background",
            },
          ],
        }),
        contactFooter({ slot: "footer", items: [{ label: "09" }] }),
      ],
    }),

    slide({
      id: "next",
      name: "Dates",
      layout: "stack",
      motif: "none",
      invert: true,
      blocks: [
        heading({ kicker: "Dates", title: "Upcoming sessions" }),
        comparisonTable({
          grow: 1,
          columns: [
            { label: "Spring" },
            { label: "Early summer", highlight: true },
            { label: "Autumn" },
            { label: "Winter" },
          ],
          rows: [
            { label: "Date", cells: ["12 Mar","09 May","18 Sep","20 Nov"] },
            { label: "Places left", cells: ["4","12","12","12"] },
            { label: "Exercise set", cells: ["Current","Revised","Revised","Revised"] },
          ],
        }),
        contactFooter({ slot: "footer", items: [{ label: "10" }] }),
      ],
    }),

    slide({
      id: "close",
      name: "Close",
      layout: "hero",
      motif: "meshLattice",
      split: 0.54,
      blocks: [
        heading({ slot: "full", kicker: "Book a place", title: "See you there" }),
        paragraph({ slot: "main", body: "Twelve places a session. Bring a laptop and nothing else; everything you need is provided on the day." }),
        iso3d({ slot: "aside", scale: 290, items: [{ asset: "badge", title: "", accent: 1 }] }),
        contactFooter({
          slot: "footer",
          items: [
            { icon: "globe", label: "youracademy.com" },
            { icon: "mail", label: "workshops@youracademy.com" },
          ],
        }),
      ],
    }),
  ],
};
