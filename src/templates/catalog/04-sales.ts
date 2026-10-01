/**
 * 04 — Sales Presentation
 *
 * Exercises the pricing and comparison tables no other template uses, and
 * leans on fullBleed and splitLeft so the deck does not read as one layout
 * repeated fifteen times.
 */

import { salesAmber } from "../themes";
import type { SlideTemplate } from "../types";
import {
  bigStat,
  callout,
  chart,
  comparisonTable,
  contactFooter,
  cta,
  device,
  heading,
  iconBullets,
  iconGrid,
  image,
  imageGrid,
  logoWall,
  metricRow,
  numbered,
  pricingTable,
  processFlow,
  quote,
  slide,
  spotlight,
  statCards,
} from "./helpers";

export const salesPresentation: SlideTemplate = {
  id: "sales-presentation",
  number: 4,
  name: "Sales Presentation",
  category: "Business",
  archetype: "sales",
  description: "Win deals with impactful slides.",
  theme: salesAmber,
  coverPrompt: "modern glass office tower at sunset, warm amber light, upward view, no text",
  slides: [
    slide({
      id: "cover",
      name: "Cover",
      layout: "cover",
      background: {
        prompt: "modern glass office tower at golden hour, warm amber reflections, upward perspective, cinematic, no text, no logos",
        scrim: 0.6,
      },
      blocks: [
        heading({
          kicker: "Partnership Proposal",
          title: "Turning opportunities into long-term partnerships",
          subtitle: "A practical path to measurable growth.",
        }),
        contactFooter({ slot: "footer", items: [{ icon: "handshake", label: "YOUR LOGO" }] }),
      ],
    }),

    slide({
      id: "challenge",
      name: "The Challenge",
      layout: "splitLeft",
      split: 0.55,
      blocks: [
        heading({
          slot: "full",
          kicker: "The challenge",
          title: "Growth is being taxed by work nobody chose",
          subtitle: "Costs rise faster than revenue, and the cause is rarely one big thing — it is a hundred small manual steps nobody has time to remove.",
        }),
        iconBullets({
          slot: "main",
          items: [
            { icon: "trendingUp", label: "Rising costs", body: "Operating expenses climb faster than revenue." },
            { icon: "clock", label: "Inefficient processes", body: "Hours lost every week to manual work." },
            { icon: "layers", label: "Limited scalability", body: "Systems that cannot grow with the business." },
          ],
        }),
        image({
          slot: "aside",
          prompt: "business professional looking out over a city from a high office window, contemplative, warm light, no text",
        }),
      ],
    }),

    slide({
      id: "solution",
      name: "Our Solution",
      layout: "splitRight",
      split: 0.5,
      blocks: [
        heading({
          slot: "full",
          kicker: "Our solution",
          title: "Remove the manual steps, keep the control",
          subtitle: "Automation that your team configures and owns, rather than a black box that needs a consultant every time the process changes.",
        }),
        iconBullets({
          slot: "main",
          items: [
            { icon: "layers", label: "All in one place", body: "Everything the team needs, without the tool sprawl." },
            { icon: "bolt", label: "Automate the busywork", body: "Cut manual effort and the errors that come with it." },
            { icon: "trendingUp", label: "Built to scale", body: "Supports you at ten people and at a thousand." },
          ],
        }),
        device({ slot: "aside", device: "laptop", prompt: "clean business dashboard UI with charts, warm accent colour, light theme, no text" }),
      ],
    }),

    slide({
      id: "benefits",
      name: "Key Benefits",
      layout: "stack",
      blocks: [
        heading({
          kicker: "Benefits",
          title: "Four outcomes our customers measure within a quarter",
          subtitle: "Not projections. These are the median results across the last fifty implementations.",
        }),
        iconGrid({
          grow: 1,
          style: { columns: 4 },
          items: [
            { icon: "trendingUp", title: "Increase revenue", body: "More pipeline converted, faster." },
            { icon: "clock", title: "Save time", body: "Hours back every week, per person." },
            { icon: "settings", title: "Improve efficiency", body: "Fewer handoffs and less rework." },
            { icon: "heart", title: "Happier customers", body: "Faster response and fewer errors." },
          ],
        }),
        callout({
          slot: "footer",
          icon: "award",
          statement: "Median payback across the last fifty customers: 11 months",
          detail: "Measured against a baseline we establish with you before anything changes.",
        }),
      ],
    }),

    slide({
      id: "how-it-works",
      name: "How It Works",
      layout: "stack",
      blocks: [
        heading({
          kicker: "How it works",
          title: "Four steps, and you own it from step three",
          subtitle: "We design it with your team, build it alongside them, then hand it over. No permanent dependency on us.",
        }),
        processFlow({
          grow: 1,
          numbered: true,
          items: [
            { title: "Discover", body: "We learn how your team actually works today." },
            { title: "Plan", body: "A tailored rollout with clear milestones." },
            { title: "Implement", body: "Setup and integration handled for you." },
            { title: "Grow", body: "Ongoing support for long-term success." },
          ],
        }),
        callout({
          slot: "footer",
          icon: "users",
          statement: "Your team owns it from step three",
          detail: "We are not trying to become a permanent line in your budget.",
        }),
      ],
    }),

    slide({
      id: "use-cases",
      name: "Use Cases",
      layout: "stack",
      blocks: [
        heading({
          kicker: "Use cases",
          title: "The same engine, shaped to four very different operations",
          subtitle: "What changes between industries is the vocabulary and the compliance rules — not the underlying work.",
        }),
        imageGrid({
          grow: 1,
          style: { columns: 4 },
          items: [
            { icon: "cart", title: "Retail", body: "Boost sales and streamline operations.", prompt: "modern retail store interior, warm lighting, no text" },
            { icon: "health", title: "Healthcare", body: "Improve patient experience and efficiency.", prompt: "bright modern clinic reception, calm palette, no text" },
            { icon: "building", title: "Finance", body: "Enhance security and compliance.", prompt: "modern bank interior with glass and steel, no text" },
            { icon: "graduation", title: "Education", body: "Simplify learning and admin.", prompt: "university lecture hall with students, natural light, no text" },
          ],
        }),
      ],
    }),

    slide({
      id: "success",
      name: "Success Story",
      layout: "splitRight",
      split: 0.58,
      blocks: [
        heading({ slot: "full", title: "Success Stories", subtitle: "Real businesses. Real growth." }),
        quote({
          slot: "main",
          quote: "This helped us increase sales by 40% within six months. The team was genuinely good to work with.",
          author: "Ayesha Malik",
          role: "CEO, GrowthCo",
          avatarPrompt: "professional headshot of a woman executive, warm studio lighting, neutral background",
        }),
        statCards({
          slot: "aside",
          style: { columns: 1 },
          items: [
            { icon: "trendingUp", value: "40%", label: "Increase in sales" },
            { icon: "clock", value: "3x", label: "Faster onboarding" },
            { icon: "star", value: "95%", label: "Customer satisfaction" },
          ],
        }),
      ],
    }),

    slide({
      id: "why-us",
      name: "Why Choose Us",
      layout: "splitLeft",
      split: 0.58,
      blocks: [
        heading({
          slot: "full",
          kicker: "Why us",
          title: "The difference is what happens after you sign",
          subtitle: "Most vendors optimise for the sale. Our renewal rate is 94%, which only happens if the quarter after go-live goes well.",
        }),
        iconBullets({
          slot: "main",
          style: { columns: 2 },
          items: [
            { icon: "award", label: "Industry expertise", body: "Deep understanding of your sector." },
            { icon: "users", label: "Customer-centric", body: "Your success is how we measure ours." },
            { icon: "shield", label: "Reliable support", body: "Real people, available when needed." },
            { icon: "checkCircle", label: "Proven results", body: "Trusted by over a thousand businesses." },
          ],
        }),
        image({
          slot: "aside",
          prompt: "corporate team in discussion around a table in a bright modern office, candid, no text",
        }),
        callout({
          slot: "footer",
          icon: "userCheck",
          solid: true,
          statement: "94% of customers renew",
          detail: "The number that matters is not how many buy, but how many are still here two years later.",
        }),
      ],
    }),

    slide({
      id: "pricing",
      name: "Pricing Plans",
      layout: "stack",
      blocks: [
        heading({
          kicker: "Pricing",
          title: "Priced per month, with no implementation fee",
          subtitle: "Move between plans at any time. We would rather you start small and grow than buy more than you need on day one.",
        }),
        pricingTable({
          grow: 1,
          plans: [
            {
              name: "Basic",
              price: "$29",
              period: "/month",
              features: ["Core features", "Email support", "1 project"],
              cta: "Get Started",
            },
            {
              name: "Pro",
              price: "$79",
              period: "/month",
              badge: "Most popular",
              highlight: true,
              features: ["All features", "Priority support", "Up to 10 projects"],
              cta: "Get Started",
            },
            {
              name: "Enterprise",
              price: "$199",
              period: "/month",
              features: ["Custom solutions", "Dedicated support", "Unlimited projects"],
              cta: "Contact Sales",
            },
          ],
        }),
      ],
    }),

    slide({
      id: "comparison",
      name: "Comparison",
      layout: "fullBleed",
      blocks: [
        heading({ title: "How We Compare", subtitle: "See the difference." }),
        comparisonTable({
          grow: 1,
          columns: [{ label: "Our solution", highlight: true }, { label: "Traditional" }],
          rows: [
            { label: "Easy to use", cells: ["yes", "no"] },
            { label: "Scalable", cells: ["yes", "no"] },
            { label: "Cost effective", cells: ["yes", "partial"] },
            { label: "24/7 support", cells: ["yes", "no"] },
            { label: "Advanced analytics", cells: ["yes", "no"] },
          ],
        }),
      ],
    }),

    slide({
      id: "roi",
      name: "ROI & Value",
      layout: "splitRight",
      split: 0.44,
      blocks: [
        heading({
          slot: "full",
          kicker: "Return",
          title: "Payback in under eleven months, on average",
          subtitle: "Measured against the baseline we establish together before anything changes, so the number is yours rather than ours.",
        }),
        statCards({
          slot: "main",
          style: { columns: 1 },
          items: [
            { icon: "trendingUp", value: "300%", label: "Average ROI in two years" },
            { icon: "dollar", value: "50%", label: "Reduction in operating costs" },
            { icon: "users", value: "2x", label: "Increase in customer retention" },
          ],
        }),
        chart({
          slot: "aside",
          kind: "barChart",
          categories: ["Year 1", "Year 2", "Year 3"],
          series: [{ name: "Cumulative value", values: [40, 110, 230], accent: 1 }],
          yFormat: "currency",
        }),
      ],
    }),

    slide({
      id: "clients",
      name: "Our Clients",
      layout: "stack",
      blocks: [
        heading({ title: "Our Clients", subtitle: "Trusted by leading brands." }),
        logoWall({
          style: { columns: 4 },
          items: ["Nestlé", "Microsoft", "Shopify", "Coca-Cola", "Samsung", "Adidas", "Spotify", "Airbnb"],
        }),
        image({
          grow: 1,
          prompt: "wide shot of a corporate boardroom meeting at dusk with city skyline behind, warm tone, no text",
        }),
      ],
    }),

    slide({
      id: "implementation",
      name: "Implementation",
      layout: "stack",
      blocks: [
        heading({
          kicker: "Implementation",
          title: "Live in thirty days, without pausing the business",
          subtitle: "Run in parallel with your current process until you are satisfied, then switch. No cutover weekend.",
        }),
        processFlow({
          grow: 1,
          items: [
            { icon: "clipboard", title: "Week 1", body: "Discovery and account setup." },
            { icon: "settings", title: "Week 2", body: "Configuration and integrations." },
            { icon: "users", title: "Week 3", body: "Team training and dry run." },
            { icon: "rocket", title: "Week 4", body: "Go live with support on hand." },
          ],
        }),
      ],
    }),

    slide({
      id: "next-steps",
      name: "Next Steps",
      layout: "splitRight",
      split: 0.52,
      blocks: [
        heading({ slot: "full", title: "Next Steps", subtitle: "Let's make it happen." }),
        processFlow({
          slot: "main",
          numbered: true,
          items: [
            { title: "Schedule a demo", body: "See the solution on your own data." },
            { title: "Get a tailored plan", body: "Scoped to your team and budget." },
            { title: "Start your rollout", body: "With our team alongside yours." },
          ],
        }),
        image({
          slot: "aside",
          prompt: "two professionals shaking hands in a bright modern office, warm natural light, no text",
        }),
      ],
    }),

    slide({
      id: "thank-you",
      name: "Thank You",
      layout: "closing",
      background: {
        prompt: "sunrise over a calm mountain range, warm amber and gold tones, wide cinematic, no text, no logos",
        scrim: 0.6,
      },
      blocks: [
        heading({ title: "Thank you", subtitle: "Let's build a successful future together." }),
        cta({ label: "Get in Touch" }),
        contactFooter({
          slot: "footer",
          items: [
            { icon: "mail", label: "sales@yourcompany.com" },
            { icon: "phone", label: "+92 300 1234567" },
            { icon: "globe", label: "www.yourcompany.com" },
          ],
        }),
      ],
    }),
  ],
};
