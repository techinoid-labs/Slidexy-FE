import type { Metadata } from "next";
import Header from "@/app/components/headers-navbar/Header";
import Footer from "@/app/components/home/Footer";

import PromptToProposal from "./components/promptToProposal";
import { Box, Typography } from "@mui/material";
import ProblemSolution from '@/app/components/seo/ProblemSolution'
import WhoItsFor from '@/app/components/seo/WhoItsFor'
import WorkflowSteps from '@/app/components/seo/WorkflowSteps'
import BenefitsList from '@/app/components/seo/BenefitsList'
import ContextualFAQ from '@/app/components/seo/ContextualFAQ'
import InternalLinks from '@/app/components/seo/InternalLinks'
import CTASection from '@/app/components/seo/CTASection'
import Reveal from '@/app/components/shared/Reveal'

export const metadata: Metadata = {
  title: "Prompt to Proposal — AI Proposal Generator",
  description:
    "Create professional business proposals from a text prompt. SlideXY AI generates structured proposals with executive summaries, timelines, and deliverables.",
  alternates: {
    canonical: "https://slidexy.ai/tools/prompt-to-proposal",
  },
};

export default function Page() {
  const personas = [
    { title: "Freelancers", description: "Respond to an RFP the same day it lands, with a proposal that reads like you had a week to write it.", icon: "person" as const },
    { title: "Agencies", description: "Get a first-draft proposal in front of a prospect in minutes instead of blocking out an afternoon.", icon: "business" as const },
    { title: "Sales Teams", description: "Turn notes from a discovery call into a formal document before the follow-up email goes out.", icon: "group" as const },
  ];

  const steps = [
    { number: 1, title: "Describe the project", description: "The client, the problem, and roughly what you're proposing to do about it." },
    { number: 2, title: "Slidexy drafts it", description: "Executive summary, scope, timeline, and pricing — structured the way clients expect to see them." },
    { number: 3, title: "Adjust and send", description: "Fix anything that's off, drop in your branding, and export as a PDF." },
  ];

  const benefits = [
    { title: "Structure that reads right", description: "Sections are laid out the way enterprise buyers expect a proposal to be organized.", icon: "done" as const },
    { title: "No more copy-paste drafts", description: "Every proposal starts fresh instead of being stitched together from the last one.", icon: "speed" as const },
    { title: "Built to win, not just fill space", description: "Clear structure and language that makes it easier to say yes.", icon: "ai" as const },
  ];

  const faqs = [
    { question: "Can I include pricing tables?", answer: "Yes — there's a dedicated section for pricing, deliverables, and payment terms." },
    { question: "What sections are included?", answer: "A standard proposal covers an executive summary, problem definition, scope of work, timeline, pricing, and an about-us section." },
    { question: "Is the content industry-specific?", answer: "It adapts tone and terminology to your industry, whether that's IT, marketing, or construction." },
  ];

  const relatedLinks = [
    { title: "Prompt-to-PDF", href: "/tools/prompt-to-pdf", description: "Deliver your finished proposal as a polished PDF document." },
    { title: "Prompt-to-Deck", href: "/tools/prompt-to-deck", description: "Visualized your proposal as a presentation for a follow-up pitch." },
    { title: "Prompt-to-eBook", href: "/tools/prompt-to-ebook", description: "Create authority-building guides to send alongside your proposals." },
  ];

  return (
    <Box component="main">
      <Header />
      
      <Box
        component="section"
        sx={{
          textAlign: "center",
          pt: { xs: 5, md: 7 },
          pb: { xs: 2, md: 2 },
          px: { xs: 3, md: 6 },
          maxWidth: 720,
          mx: "auto",
        }}
      >
        <Typography
          component="h1"
          className="sx-display"
          sx={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: { xs: "1.85rem", md: "2.75rem" },
            letterSpacing: "-0.03em",
            color: "#0F0A19",
            mb: 2,
          }}
        >
          Turn a brief into a proposal
        </Typography>
        <Typography
          sx={{
            color: "text.secondary",
            fontSize: { xs: "1.05rem", md: "1.15rem" },
            lineHeight: 1.7,
            mb: 2,
          }}
        >
          Describe the client and the job. Slidexy drafts the summary,
          scope, timeline, and pricing — ready to send.
        </Typography>
      </Box>

      {/* Main Tool Component */}
      <PromptToProposal />

      <Reveal>
        <ProblemSolution
          problem="Drafting a proposal is one of the slowest parts of the sales cycle. Reusing an old template invites mistakes, and starting from a blank page eats an afternoon."
          solution="Slidexy's Prompt-to-Proposal tool turns a short project brief into a coherent, well-structured document — every section a proposal needs, without the copy-paste."
        />
      </Reveal>

      <Reveal><WhoItsFor personas={personas} /></Reveal>

      <Reveal><WorkflowSteps steps={steps} /></Reveal>

      <Reveal><BenefitsList benefits={benefits} /></Reveal>

      <Reveal>
        <ContextualFAQ
          title="Proposal Generation FAQ"
          subtitle="How to get a proposal ready to send in minutes, not hours."
          faqs={faqs}
        />
      </Reveal>

      <Reveal><InternalLinks title="Explore More Tools" links={relatedLinks} /></Reveal>

      <Reveal>
        <CTASection
          title="Draft your first proposal"
          subtitle="No credit card required to try it."
        />
      </Reveal>


      <Footer />
    </Box>
  );
}