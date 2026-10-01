/**
 * 07 — Product Launch
 *
 * Product-led: device mockups carry most slides, split-image cover, grid
 * motif, generous radii.
 */

import { productIndigo } from "../themes";
import type { SlideTemplate } from "../types";
import {
  bigStat,
  callout,
  chart,
  checklist,
  contactFooter,
  cta,
  device,
  heading,
  iconBullets,
  iconGrid,
  image,
  imageGrid,
  metricRow,
  numbered,
  paragraph,
  pricingTable,
  processFlow,
  quote,
  slide,
  spotlight,
  statCards,
  timeline,
} from "./helpers";

export const productLaunch: SlideTemplate = {
  id: "product-launch",
  number: 7,
  name: "Product Launch",
  category: "Product",
  archetype: "product",
  description: "Showcase your product to the world.",
  theme: productIndigo,
  coverPrompt: "sleek modern device on a soft indigo gradient backdrop, product photography, no text",
  slides: [
    slide({
      id: "cover",
      name: "Cover",
      layout: "cover",
      background: {
        prompt: "sleek modern device floating on a soft indigo gradient backdrop, studio product photography, no text, no logos",
        scrim: 0.52,
      },
      blocks: [
        heading({ kicker: "Introducing", title: "Meet the new standard", subtitle: "Everything your team needs, finally in one place." }),
        contactFooter({ slot: "footer", items: [{ icon: "rocket", label: "YOUR LOGO" }] }),
      ],
    }),

    slide({
      id: "why",
      name: "Why We Built It",
      layout: "splitRight",
      split: 0.55,
      blocks: [
        heading({ slot: "full", title: "Why We Built It", subtitle: "The problem we kept hearing." }),
        paragraph({ slot: "main", body: "Teams were stitching together four tools to do one job. Nothing talked to anything else, and the work fell through the gaps." }),
        iconBullets({
          slot: "main",
          style: { compact: true },
          items: [
            { icon: "layers", label: "Too many tools", body: "Four subscriptions for one workflow." },
            { icon: "close", label: "Nothing connected", body: "Copy-paste between systems, every day." },
          ],
        }),
        image({ slot: "aside", prompt: "cluttered desk with multiple screens and sticky notes, slightly desaturated, no text" }),
      ],
    }),

    slide({
      id: "product",
      name: "The Product",
      layout: "splitLeft",
      split: 0.44,
      blocks: [
        heading({ slot: "full", title: "The Product", subtitle: "One place for the whole workflow." }),
        iconBullets({
          slot: "main",
          items: [
            { icon: "bolt", label: "Fast by default", body: "Built for speed on real-world data." },
            { icon: "layers", label: "Everything connected", body: "One record, visible everywhere." },
            { icon: "shield", label: "Secure", body: "Enterprise controls from day one." },
          ],
        }),
        device({ slot: "aside", device: "browser", prompt: "clean SaaS product interface with sidebar and data table, indigo accent, light theme, no text" }),
      ],
    }),

    slide({
      id: "features",
      name: "Key Features",
      layout: "stack",
      blocks: [
        heading({
          kicker: "Features",
          title: "Six capabilities, none of them an add-on",
          subtitle: "Everything here is in every plan. We would rather compete on how well it works than on what we withhold.",
        }),
        iconGrid({
          grow: 1,
          style: { columns: 3 },
          items: [
            { icon: "bolt", title: "Automation", body: "Rules that run the repetitive work for you." },
            { icon: "barChart", title: "Analytics", body: "Live dashboards without a data team." },
            { icon: "users", title: "Collaboration", body: "Comments, mentions and shared views." },
            { icon: "link", title: "Integrations", body: "Connects to the tools you already run." },
            { icon: "smartphone", title: "Mobile", body: "Full functionality on the move." },
            { icon: "lock", title: "Permissions", body: "Granular access for every role." },
          ],
        }),
        callout({
          slot: "footer",
          icon: "checkCircle",
          solid: true,
          statement: "Every feature is in every plan",
          detail: "We compete on how well the product works, not on what we withhold from the cheaper tier.",
        }),
      ],
    }),

    slide({
      id: "mobile",
      name: "On Every Device",
      layout: "splitRight",
      split: 0.5,
      blocks: [
        heading({ slot: "full", title: "On Every Device", subtitle: "Same product, wherever the work happens." }),
        device({ slot: "main", device: "phone", prompt: "mobile app interface with cards and charts, indigo accent, light theme, no text" }),
        iconBullets({
          slot: "aside",
          style: { compact: true },
          items: [
            { icon: "smartphone", label: "Native mobile", body: "iOS and Android, not a wrapper." },
            { icon: "cloud", label: "Offline capable", body: "Keeps working without a connection." },
            { icon: "refresh", label: "Real-time sync", body: "Changes land everywhere instantly." },
          ],
        }),
      ],
    }),

    slide({
      id: "how",
      name: "How It Works",
      layout: "stack",
      blocks: [
        heading({
          kicker: "Getting started",
          title: "Four steps, most teams finish in an afternoon",
          subtitle: "No implementation call required. If you want one we will do it, but nothing is gated behind it.",
        }),
        processFlow({
          grow: 1,
          numbered: true,
          items: [
            { title: "Connect", body: "Link your existing tools in minutes." },
            { title: "Configure", body: "Pick a template or build your own." },
            { title: "Invite", body: "Bring the team in with one link." },
            { title: "Run", body: "Work in one place from day one." },
          ],
        }),
      ],
    }),

    slide({
      id: "before-after",
      name: "Before & After",
      layout: "splitRight",
      split: 0.5,
      blocks: [
        heading({ slot: "full", title: "Before & After", subtitle: "What changes on day one." }),
        iconBullets({
          slot: "main",
          items: [
            { icon: "close", label: "Before", body: "Four tools, manual handoffs, weekly reporting by hand." },
            { icon: "checkCircle", label: "After", body: "One workspace, automated handoffs, live reporting." },
          ],
        }),
        chart({
          slot: "aside",
          kind: "barChart",
          categories: ["Setup", "Weekly admin", "Reporting"],
          series: [
            { name: "Before (hrs)", values: [16, 9, 6], accent: 4 },
            { name: "After (hrs)", values: [2, 2, 0.5], accent: 1 },
          ],
        }),
      ],
    }),

    slide({
      id: "results",
      name: "Early Results",
      layout: "stack",
      blocks: [
        heading({
          kicker: "Results",
          title: "What 2,400 beta users did with it",
          subtitle: "Ninety days of real usage, including the teams who churned — the retention number below is net of them.",
        }),
        statCards({
          grow: 1,
          style: { columns: 4 },
          items: [
            { icon: "clock", value: "7hrs", label: "Saved per person weekly" },
            { icon: "users", value: "2,400", label: "Beta users" },
            { icon: "star", value: "4.8", label: "Average rating" },
            { icon: "trendingUp", value: "92%", label: "Weekly retention" },
          ],
        }),
        callout({
          slot: "footer",
          icon: "users",
          statement: "2,400 beta users, 92% still active weekly",
          detail: "Retention measured net of churn, including the teams who left in the first month.",
        }),
      ],
    }),

    slide({
      id: "testimonial",
      name: "What Users Say",
      layout: "fullBleed",
      blocks: [
        heading({ title: "What Early Users Say" }),
        quote({
          grow: 1,
          quote: "We replaced three tools in the first week. The thing that surprised us was how little training anyone needed.",
          author: "Priya Mehta",
          role: "Head of Operations, Northwind",
          avatarPrompt: "professional headshot of a woman, soft studio lighting, neutral background",
        }),
      ],
    }),

    slide({
      id: "use-cases",
      name: "Who It's For",
      layout: "stack",
      blocks: [
        heading({
          kicker: "Who it's for",
          title: "Three teams who felt this problem most",
          subtitle: "If your week is shaped by a process rather than a project, this was built for you.",
        }),
        imageGrid({
          grow: 1,
          style: { columns: 3 },
          items: [
            { icon: "settings", title: "Operations", body: "Standardise and automate the daily run.", prompt: "operations team at a bank of monitors, modern office, no text" },
            { icon: "megaphone", title: "Marketing", body: "Plan campaigns and track performance.", prompt: "marketing team collaborating around a whiteboard, no text" },
            { icon: "handshake", title: "Sales", body: "Keep the pipeline honest and current.", prompt: "sales professional on a call at a standing desk, no text" },
          ],
        }),
      ],
    }),

    slide({
      id: "integrations",
      name: "Integrations",
      layout: "stack",
      blocks: [
        heading({
          kicker: "Integrations",
          title: "Connects to what you already run",
          subtitle: "Nothing has to be migrated or retired. The product earns its place alongside your stack before it replaces any of it.",
        }),
        iconGrid({
          grow: 1,
          style: { columns: 4 },
          items: [
            { icon: "mail", title: "Email" },
            { icon: "calendar", title: "Calendar" },
            { icon: "database", title: "Data warehouse" },
            { icon: "cloud", title: "Cloud storage" },
            { icon: "code", title: "REST API" },
            { icon: "users", title: "SSO / SCIM" },
            { icon: "cart", title: "Billing" },
            { icon: "barChart", title: "BI tools" },
          ],
        }),
        callout({
          slot: "footer",
          icon: "link",
          statement: "Nothing has to be migrated or retired",
          detail: "The product earns its place alongside your stack before it replaces any part of it.",
        }),
      ],
    }),

    slide({
      id: "pricing",
      name: "Pricing",
      layout: "stack",
      blocks: [
        heading({
          kicker: "Pricing",
          title: "Per seat, and the free tier is genuinely usable",
          subtitle: "No feature gating on the paid tiers — you pay for scale and support, not for unlocking the product.",
        }),
        pricingTable({
          grow: 1,
          plans: [
            { name: "Starter", price: "$12", period: "/user/mo", features: ["Core workspace", "5 integrations", "Email support"], cta: "Start free" },
            { name: "Team", price: "$24", period: "/user/mo", highlight: true, badge: "Most popular", features: ["Automation", "Unlimited integrations", "Priority support"], cta: "Start free" },
            { name: "Enterprise", price: "Custom", features: ["SSO and SCIM", "Dedicated CSM", "99.9% SLA"], cta: "Talk to sales" },
          ],
        }),
      ],
    }),

    slide({
      id: "roadmap",
      name: "What's Next",
      layout: "stack",
      blocks: [
        heading({
          kicker: "Roadmap",
          title: "Four quarters, committed publicly",
          subtitle: "Dates we are prepared to be held to. Anything we are unsure about is not on this slide.",
        }),
        timeline({
          grow: 1,
          items: [
            { icon: "rocket", date: "Q1", title: "General availability", body: "Open to everyone." },
            { icon: "cpu", title: "AI assist", date: "Q2", body: "Drafting and summarisation." },
            { icon: "globe", date: "Q3", title: "Localisation", body: "Eight new languages." },
            { icon: "shield", date: "Q4", title: "Compliance", body: "SOC 2 Type II and HIPAA." },
          ],
        }),
      ],
    }),

    slide({
      id: "launch-plan",
      name: "Launch Plan",
      layout: "splitRight",
      split: 0.54,
      blocks: [
        heading({ slot: "full", title: "Launch Plan", subtitle: "How we take it to market." }),
        processFlow({
          slot: "main",
          items: [
            { icon: "users", title: "Beta", body: "2,400 users, 90 days" },
            { icon: "megaphone", title: "Announce", body: "Press and community" },
            { icon: "rocket", title: "GA", body: "Open signup" },
            { icon: "trendingUp", title: "Scale", body: "Paid acquisition" },
          ],
        }),
        checklist({
          slot: "aside",
          items: ["Launch page live", "Docs and onboarding ready", "Support team trained", "Pricing published"],
        }),
      ],
    }),

    slide({
      id: "cta",
      name: "Get Started",
      layout: "closing",
      background: {
        prompt: "soft indigo and violet gradient with subtle geometric shapes, clean and modern, no text, no logos",
        scrim: 0.4,
      },
      blocks: [
        heading({ title: "Try it with your team", subtitle: "Free for fourteen days. No card required." }),
        cta({ label: "Start Free Trial" }),
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
