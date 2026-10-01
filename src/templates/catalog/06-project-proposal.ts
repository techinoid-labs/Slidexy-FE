/**
 * 06 — Project Proposal
 *
 * Restrained consulting voice: type-led cover, no photography on the cover,
 * grid motif, square corners, outline icons.
 */

import { consultingSlate } from "../themes";
import type { SlideTemplate } from "../types";
import {
  bigStat,
  callout,
  chart,
  checklist,
  comparisonTable,
  contactFooter,
  cta,
  heading,
  iconBullets,
  iconGrid,
  image,
  metricRow,
  numbered,
  paragraph,
  pricingTable,
  processFlow,
  roadmapPhases,
  scatter,
  slide,
  spotlight,
  statCards,
  teamCards,
  timeline,
} from "./helpers";

export const projectProposal: SlideTemplate = {
  id: "project-proposal",
  number: 6,
  name: "Project Proposal",
  category: "Business",
  archetype: "proposal",
  description: "Get your projects approved.",
  theme: consultingSlate,
  coverPrompt: "clean architectural detail in muted teal and grey, minimal, no text",
  slides: [
    slide({
      id: "cover",
      name: "Cover",
      layout: "cover",
      blocks: [
        heading({
          kicker: "Prepared for your team",
          title: "Project Proposal",
          subtitle: "Scope, approach, timeline and investment.",
        }),
        contactFooter({
          slot: "footer",
          items: [
            { icon: "calendar", label: "October 2026" },
            { icon: "briefcase", label: "YOUR COMPANY" },
          ],
        }),
      ],
    }),

    slide({
      id: "summary",
      name: "Executive Summary",
      layout: "splitRight",
      split: 0.58,
      blocks: [
        heading({ slot: "full", kicker: "Overview", title: "Executive Summary" }),
        paragraph({
          slot: "main",
          body: "A focused engagement to address the problems below, delivered in four phases over twelve weeks, with clear milestones and a fixed investment.",
        }),
        checklist({
          slot: "main",
          items: [
            "Twelve-week engagement, four phases",
            "Fixed fee with no change-order surprises",
            "Weekly reporting against agreed milestones",
          ],
        }),
        statCards({
          slot: "aside",
          style: { columns: 1 },
          items: [
            { icon: "calendar", value: "12 wks", label: "Duration" },
            { icon: "users", value: "5", label: "Team members" },
            { icon: "dollar", value: "$180K", label: "Total investment" },
          ],
        }),
      ],
    }),

    slide({
      id: "problem",
      name: "The Problem",
      layout: "splitLeft",
      split: 0.55,
      blocks: [
        heading({
          slot: "full",
          kicker: "Current state",
          title: "Three constraints, one shared root cause",
          subtitle: "Each of these is usually treated as a separate problem. They are symptoms of the same missing operational layer.",
        }),
        iconBullets({
          slot: "main",
          items: [
            { icon: "clock", label: "Slow delivery", body: "Releases take weeks longer than planned." },
            { icon: "database", label: "Fragmented data", body: "No single view across systems." },
            { icon: "dollar", label: "Rising cost to serve", body: "Manual effort scales with volume." },
          ],
        }),
        image({ slot: "aside", prompt: "abstract grid of teal and grey geometric panels, architectural, minimal, no text" }),
      ],
    }),

    slide({
      id: "objectives",
      name: "Objectives",
      layout: "stack",
      blocks: [
        heading({
          kicker: "Objectives",
          title: "Three outcomes, each measurable at handover",
          subtitle: "Agreed with you before we start, and reported against every week so there is no debate at the end about what success meant.",
        }),
        iconGrid({
          grow: 1,
          style: { columns: 3 },
          items: [
            { icon: "target", title: "Reduce cycle time", body: "Cut delivery time by at least a third." },
            { icon: "database", title: "Unify reporting", body: "One trusted source of operational truth." },
            { icon: "trendingUp", title: "Lower cost to serve", body: "Automate the highest-volume manual work." },
          ],
        }),
      ],
    }),

    slide({
      id: "approach",
      name: "Our Approach",
      layout: "stack",
      blocks: [
        heading({
          kicker: "Approach",
          title: "Four phases, and you can stop after any of them",
          subtitle: "Each phase produces something useful on its own, so the engagement never becomes all-or-nothing.",
        }),
        processFlow({
          grow: 1,
          numbered: true,
          items: [
            { title: "Discover", body: "Audit systems, data and workflows." },
            { title: "Design", body: "Target operating model and architecture." },
            { title: "Build", body: "Implement in two-week increments." },
            { title: "Embed", body: "Train the team and hand over." },
          ],
        }),
        callout({
          slot: "footer",
          icon: "checkCircle",
          statement: "You can stop after any phase",
          detail: "Each one produces something your team can use on its own, so this never becomes all-or-nothing.",
        }),
      ],
    }),

    slide({
      id: "scope",
      name: "Scope of Work",
      layout: "fullBleed",
      blocks: [
        heading({ title: "Scope of Work", subtitle: "What is included, and what is not." }),
        comparisonTable({
          grow: 1,
          columns: [{ label: "In scope", highlight: true }, { label: "Out of scope" }],
          rows: [
            { label: "Process audit and mapping", cells: ["yes", "no"] },
            { label: "Data model and integrations", cells: ["yes", "no"] },
            { label: "Automation build", cells: ["yes", "no"] },
            { label: "Team training and handover", cells: ["yes", "no"] },
            { label: "Ongoing managed service", cells: ["no", "yes"] },
          ],
        }),
      ],
    }),

    slide({
      id: "deliverables",
      name: "Deliverables",
      layout: "stack",
      blocks: [
        heading({
          kicker: "Deliverables",
          title: "Four artefacts you keep, whatever happens next",
          subtitle: "Written to be used by your team without us, including the parts that document what we got wrong.",
        }),
        iconBullets({
          grow: 1,
          style: { columns: 2 },
          items: [
            { icon: "document", label: "Current-state assessment", body: "Findings, risks and quantified baseline." },
            { icon: "layers", label: "Target architecture", body: "Systems, data flows and integration plan." },
            { icon: "code", label: "Working implementation", body: "Deployed, tested and documented." },
            { icon: "graduation", label: "Enablement pack", body: "Runbooks and recorded training." },
          ],
        }),
      ],
    }),

    slide({
      id: "timeline",
      name: "Timeline",
      layout: "stack",
      blocks: [
        heading({
          kicker: "Schedule",
          title: "Twelve weeks, with a go/no-go at week five",
          subtitle: "The design phase ends in a decision. If the target model is not worth building, that is a legitimate outcome.",
        }),
        timeline({
          grow: 1,
          items: [
            { icon: "search", date: "Weeks 1–2", title: "Discover", body: "Audit and baseline." },
            { icon: "layers", date: "Weeks 3–5", title: "Design", body: "Target model agreed." },
            { icon: "settings", date: "Weeks 6–10", title: "Build", body: "Increments every two weeks." },
            { icon: "graduation", date: "Weeks 11–12", title: "Embed", body: "Training and handover." },
          ],
        }),
      ],
    }),

    slide({
      id: "team",
      name: "Project Team",
      layout: "stack",
      blocks: [
        heading({
          kicker: "The team",
          title: "The people named here are the people who show up",
          subtitle: "No bait and switch between the pitch and the engagement. These three are allocated for the full twelve weeks.",
        }),
        teamCards({
          grow: 1,
          style: { columns: 3 },
          items: [
            { name: "Engagement Lead", role: "Accountable for delivery", bio: "Fifteen years in operations transformation.", photoPrompt: "professional headshot, neutral grey background, muted palette" },
            { name: "Solution Architect", role: "Design and integration", bio: "Designs the target systems architecture.", photoPrompt: "professional headshot, neutral grey background, muted palette" },
            { name: "Delivery Manager", role: "Day-to-day execution", bio: "Runs the increments and reporting.", photoPrompt: "professional headshot, neutral grey background, muted palette" },
          ],
        }),
      ],
    }),

    slide({
      id: "governance",
      name: "Governance",
      layout: "splitRight",
      split: 0.56,
      blocks: [
        heading({ slot: "full", title: "Governance", subtitle: "How we stay aligned." }),
        iconBullets({
          slot: "main",
          items: [
            { icon: "calendar", label: "Weekly checkpoint", body: "Progress, risks and decisions needed." },
            { icon: "clipboard", label: "Phase gate review", body: "Formal sign-off before the next phase." },
            { icon: "flag", label: "Escalation path", body: "Named sponsor on both sides." },
          ],
        }),
        checklist({
          slot: "aside",
          items: ["Shared backlog", "Published burn-up", "Open risk register", "Single point of contact"],
        }),
      ],
    }),

    slide({
      id: "risks",
      name: "Risks & Mitigation",
      layout: "splitRight",
      split: 0.42,
      blocks: [
        heading({ slot: "full", title: "Risks & Mitigation", subtitle: "Known risks and how we handle them." }),
        iconBullets({
          slot: "main",
          style: { compact: true },
          items: [
            { icon: "clock", label: "Data access delays", body: "Agreed access list signed in week one." },
            { icon: "users", label: "Stakeholder availability", body: "Sessions booked for the whole engagement up front." },
            { icon: "layers", label: "Scope creep", body: "Change requests priced and approved separately." },
          ],
        }),
        scatter({
          slot: "aside",
          xAxis: { low: "Low likelihood", high: "High likelihood" },
          yAxis: { low: "Low impact", high: "High impact" },
          points: [
            { label: "Data access", x: 0.62, y: 0.7, highlight: true },
            { label: "Availability", x: 0.5, y: 0.42 },
            { label: "Scope creep", x: 0.35, y: 0.6 },
            { label: "Tooling", x: 0.22, y: 0.25 },
          ],
        }),
        callout({
          slot: "footer",
          icon: "shield",
          statement: "Every risk here has a named owner on both sides",
          detail: "A risk register without owners is a list of things nobody is doing anything about.",
        }),
      ],
    }),

    slide({
      id: "investment",
      name: "Investment",
      layout: "stack",
      blocks: [
        heading({
          kicker: "Investment",
          title: "Fixed fee per phase, no change orders",
          subtitle: "If the work takes longer than we scoped, that is our risk. Scope changes are priced separately and approved by you first.",
        }),
        pricingTable({
          grow: 1,
          plans: [
            { name: "Discover", price: "$30K", period: "weeks 1–2", features: ["Audit", "Baseline", "Findings report"] },
            { name: "Design & Build", price: "$120K", period: "weeks 3–10", highlight: true, badge: "Core", features: ["Target architecture", "Implementation", "Testing"] },
            { name: "Embed", price: "$30K", period: "weeks 11–12", features: ["Training", "Runbooks", "Handover"] },
          ],
        }),
        callout({
          slot: "footer",
          icon: "dollar",
          solid: true,
          statement: "Fixed fee. If it takes longer than we scoped, that is our risk",
          detail: "Scope changes are priced separately and approved by you before any work starts.",
        }),
      ],
    }),

    slide({
      id: "value",
      name: "Expected Value",
      layout: "splitRight",
      split: 0.58,
      blocks: [
        heading({ slot: "full", title: "Expected Value", subtitle: "What the investment returns." }),
        chart({
          slot: "main",
          kind: "barChart",
          categories: ["Year 1", "Year 2", "Year 3"],
          series: [{ name: "Net benefit", values: [120, 340, 520], accent: 1 }],
          yFormat: "currency",
          caption: "Payback inside the first year.",
        }),
        statCards({
          slot: "aside",
          style: { columns: 1 },
          items: [
            { icon: "clock", value: "-35%", label: "Cycle time" },
            { icon: "dollar", value: "-22%", label: "Cost to serve" },
            { icon: "trendingUp", value: "2.9x", label: "Three-year ROI" },
          ],
        }),
      ],
    }),

    slide({
      id: "next-phase",
      name: "Beyond This Phase",
      layout: "stack",
      blocks: [
        heading({ title: "Beyond This Phase", subtitle: "Where this could go next." }),
        roadmapPhases({
          grow: 1,
          items: [
            { icon: "flag", phase: "Now", period: "This engagement", points: ["Audit and baseline", "Build core automation", "Train the team"] },
            { icon: "trendingUp", phase: "Next", period: "6–12 months", points: ["Extend to adjacent teams", "Add predictive reporting"] },
            { icon: "globe", phase: "Later", period: "12 months+", points: ["Group-wide rollout", "Continuous optimisation"] },
          ],
        }),
      ],
    }),

    slide({
      id: "approval",
      name: "Approval",
      layout: "closing",
      blocks: [
        heading({ kicker: "Next step", title: "Ready to proceed", subtitle: "Sign-off starts the clock on week one." }),
        checklist({
          style: { columns: 2 },
          items: ["Confirm scope and phases", "Approve the investment", "Name the project sponsor", "Agree a kickoff date"],
        }),
        cta({ label: "Approve This Proposal" }),
        contactFooter({
          slot: "footer",
          items: [
            { icon: "mail", label: "proposals@yourcompany.com" },
            { icon: "phone", label: "+92 300 1234567" },
          ],
        }),
      ],
    }),
  ],
};
