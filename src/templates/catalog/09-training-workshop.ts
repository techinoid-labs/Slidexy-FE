/**
 * 09 — Training & Workshop
 *
 * Teaching voice: rounded friendly type, flat cards, numbered headings, dots
 * motif, geometric cover. Section dividers break the deck into modules.
 */

import { educationSky } from "../themes";
import type { SlideTemplate } from "../types";
import {
  checklist,
  contactFooter,
  cta,
  heading,
  iconBullets,
  iconGrid,
  image,
  imageGrid,
  paragraph,
  processFlow,
  quote,
  slide,
  statCards,
  timeline,
} from "./helpers";

export const trainingWorkshop: SlideTemplate = {
  id: "training-workshop",
  number: 9,
  name: "Training & Workshop",
  category: "Education",
  archetype: "education",
  description: "Build skills and knowledge.",
  theme: educationSky,
  coverPrompt: "bright classroom with soft daylight and blue accents, welcoming, no text",
  slides: [
    slide({
      id: "cover",
      name: "Cover",
      layout: "cover",
      background: {
        prompt: "bright modern classroom with soft daylight, blue and white palette, welcoming and uncluttered, no text, no logos",
        scrim: 0.55,
      },
      blocks: [
        heading({ kicker: "Workshop", title: "Practical skills, in one session", subtitle: "A hands-on workshop you can apply the same week." }),
        contactFooter({ slot: "footer", items: [{ icon: "graduation", label: "YOUR ORGANISATION" }] }),
      ],
    }),

    slide({
      id: "welcome",
      name: "Welcome",
      layout: "splitRight",
      split: 0.56,
      blocks: [
        heading({ slot: "full", title: "Welcome", subtitle: "What we will cover and how the session runs." }),
        iconBullets({
          slot: "main",
          items: [
            { icon: "clock", label: "Three hours", body: "Two short breaks, finishing on time." },
            { icon: "users", label: "Hands-on", body: "You will build something, not just watch." },
            { icon: "document", label: "Take-aways", body: "Slides, templates and a checklist to keep." },
          ],
        }),
        image({ slot: "aside", prompt: "small group workshop around a table with laptops, bright daylight, candid, no text" }),
      ],
    }),

    slide({
      id: "objectives",
      name: "Learning Objectives",
      layout: "stack",
      blocks: [
        heading({ title: "Learning Objectives", subtitle: "By the end of this session you will be able to..." }),
        checklist({
          grow: 1,
          style: { columns: 2 },
          items: [
            "Explain the core concepts in your own words",
            "Apply the framework to a real example",
            "Identify the three most common mistakes",
            "Run the process independently next week",
          ],
        }),
      ],
    }),

    slide({
      id: "agenda",
      name: "Agenda",
      layout: "stack",
      blocks: [
        heading({ title: "Agenda", subtitle: "How the three hours are structured." }),
        timeline({
          grow: 1,
          items: [
            { icon: "lightbulb", date: "0:00", title: "Foundations", body: "Concepts and vocabulary." },
            { icon: "settings", date: "0:45", title: "The method", body: "Walk through, step by step." },
            { icon: "users", date: "1:30", title: "Practice", body: "Work on your own example." },
            { icon: "checkCircle", date: "2:30", title: "Review", body: "Share back and troubleshoot." },
          ],
        }),
      ],
    }),

    slide({
      id: "module-1",
      name: "Module 1 — Foundations",
      layout: "stack",
      blocks: [
        heading({ kicker: "Module 1", title: "Foundations", subtitle: "The ideas everything else builds on." }),
        iconGrid({
          grow: 1,
          style: { columns: 3 },
          items: [
            { icon: "lightbulb", title: "Concept one", body: "What it is and why it matters in practice." },
            { icon: "layers", title: "Concept two", body: "How it relates to the first." },
            { icon: "target", title: "Concept three", body: "Where teams usually get this wrong." },
          ],
        }),
      ],
    }),

    slide({
      id: "key-idea",
      name: "The Key Idea",
      layout: "fullBleed",
      blocks: [
        heading({ title: "If you remember one thing" }),
        quote({
          grow: 1,
          quote: "Start from the outcome you need, then work backwards. Most of the difficulty comes from starting in the middle.",
          author: "Workshop principle",
        }),
      ],
    }),

    slide({
      id: "module-2",
      name: "Module 2 — The Method",
      layout: "stack",
      blocks: [
        heading({ kicker: "Module 2", title: "The Method", subtitle: "Five steps, in order." }),
        processFlow({
          grow: 1,
          numbered: true,
          items: [
            { title: "Define", body: "State the outcome precisely." },
            { title: "Gather", body: "Collect only what you need." },
            { title: "Analyse", body: "Find the pattern, not the anecdote." },
            { title: "Decide", body: "Commit and write it down." },
            { title: "Review", body: "Check against the outcome." },
          ],
        }),
      ],
    }),

    slide({
      id: "example",
      name: "Worked Example",
      layout: "splitRight",
      split: 0.54,
      blocks: [
        heading({ slot: "full", title: "Worked Example", subtitle: "The method applied to a real case." }),
        iconBullets({
          slot: "main",
          items: [
            { icon: "search", label: "The situation", body: "A team missing its deadline every sprint." },
            { icon: "barChart", label: "What we found", body: "Work entered the sprint after it started." },
            { icon: "checkCircle", label: "The change", body: "One rule: nothing added mid-sprint." },
          ],
        }),
        statCards({
          slot: "aside",
          style: { columns: 1 },
          items: [
            { icon: "trendingUp", value: "+41%", label: "Sprint completion" },
            { icon: "clock", value: "-2 days", label: "Average cycle time" },
          ],
        }),
      ],
    }),

    slide({
      id: "mistakes",
      name: "Common Mistakes",
      layout: "stack",
      blocks: [
        heading({ title: "Common Mistakes", subtitle: "And how to avoid each one." }),
        iconBullets({
          grow: 1,
          style: { columns: 2 },
          items: [
            { icon: "close", label: "Skipping the define step", body: "You cannot measure against an outcome you never stated." },
            { icon: "close", label: "Gathering everything", body: "More data is not more insight; it is more delay." },
            { icon: "close", label: "Deciding verbally", body: "If it is not written down, it was not decided." },
            { icon: "close", label: "Never reviewing", body: "Without review the method becomes ritual." },
          ],
        }),
      ],
    }),

    slide({
      id: "exercise",
      name: "Your Turn",
      layout: "splitLeft",
      split: 0.5,
      blocks: [
        heading({ slot: "full", kicker: "Exercise", title: "Your Turn", subtitle: "Twenty minutes, working on your own example." }),
        checklist({
          slot: "main",
          items: [
            "Pick a real problem from your team",
            "Write the outcome in one sentence",
            "List what you actually need to know",
            "Draft the decision you would make",
          ],
        }),
        image({ slot: "aside", prompt: "person writing in a notebook at a bright desk, focused, natural light, no text" }),
      ],
    }),

    slide({
      id: "discussion",
      name: "Share Back",
      layout: "stack",
      blocks: [
        heading({ title: "Share Back", subtitle: "What did you find?" }),
        iconGrid({
          grow: 1,
          style: { columns: 3 },
          items: [
            { icon: "users", title: "In pairs", body: "Five minutes each, explain your outcome." },
            { icon: "search", title: "Look for", body: "Where the outcome was vague." },
            { icon: "checkCircle", title: "Then", body: "Rewrite it once, more precisely." },
          ],
        }),
      ],
    }),

    slide({
      id: "resources",
      name: "Resources",
      layout: "stack",
      blocks: [
        heading({ title: "Resources", subtitle: "Everything you need to run this yourself." }),
        imageGrid({
          grow: 1,
          style: { columns: 3 },
          items: [
            { icon: "document", title: "Worksheet", body: "The template used in today's exercise.", prompt: "clean printed worksheet on a desk, overhead, no readable text" },
            { icon: "book", title: "Reading list", body: "Four short pieces worth your time.", prompt: "small stack of books on a bright desk, no readable text" },
            { icon: "play", title: "Recording", body: "This session, available for a month.", prompt: "laptop showing a video player interface, soft light, no text" },
          ],
        }),
      ],
    }),

    slide({
      id: "recap",
      name: "Recap",
      layout: "stack",
      blocks: [
        heading({ title: "Recap", subtitle: "The whole session in four lines." }),
        checklist({
          grow: 1,
          style: { columns: 2 },
          items: [
            "Start from the outcome, not the data",
            "Gather only what changes the decision",
            "Write the decision down",
            "Review against the outcome you stated",
          ],
        }),
      ],
    }),

    slide({
      id: "next",
      name: "Next Steps",
      layout: "splitRight",
      split: 0.56,
      blocks: [
        heading({ slot: "full", title: "Next Steps", subtitle: "What to do in the next seven days." }),
        processFlow({
          slot: "main",
          numbered: true,
          items: [
            { title: "This week", body: "Run the method once on a real problem." },
            { title: "Next week", body: "Bring it to your team retro." },
            { title: "This month", body: "Teach it to one other person." },
          ],
        }),
        paragraph({ slot: "aside", body: "Teaching it to someone else is the fastest way to find the parts you have not understood yet." }),
      ],
    }),

    slide({
      id: "thanks",
      name: "Thank You",
      layout: "closing",
      background: {
        prompt: "soft blue sky with light clouds, bright and optimistic, minimal, no text, no logos",
        scrim: 0.45,
      },
      blocks: [
        heading({ title: "Thank you for joining", subtitle: "Questions are welcome any time." }),
        cta({ label: "Book a Follow-up" }),
        contactFooter({
          slot: "footer",
          items: [
            { icon: "mail", label: "training@yourorg.com" },
            { icon: "globe", label: "yourorg.com/workshops" },
          ],
        }),
      ],
    }),
  ],
};
