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
    { title: "Freelancers", description: "Quickly respond to RFPs with professional-grade proposals that demonstrate authority.", icon: "person" as const },
    { title: "Agencies", description: "Scale your sales operation by generating initial project proposals in minutes instead of days.", icon: "business" as const },
    { title: "Sales Teams", description: "Convert prospect calls into formal documentation instantly with our AI narrative builder.", icon: "group" as const },
  ];

  const steps = [
    { number: 1, title: "Input Project Details", description: "Briefly describe the client, the problem, and your proposed solution." },
    { number: 2, title: "AI Builds Narrative", description: "SlideXY generates the executive summary, scope, timeline, and pricing sections." },
    { number: 3, title: "Customize and Sign", description: "Adjust the details, add your branding, and send it to your client as a PDF." },
  ];

  const benefits = [
    { title: "Expert Formatting", description: "Our AI understands standard business proposal structures preferred by enterprise companies.", icon: "done" as const },
    { title: "Save Hours Daily", description: "Stop copying and pasting from old documents. Generate a fresh, tailored proposal every time.", icon: "speed" as const },
    { title: "High Conversion", description: "Professionally designed layouts and logical narratives help you win more business.", icon: "ai" as const },
  ];

  const faqs = [
    { question: "Can I include pricing tables?", answer: "Yes, our proposal generator includes a dedicated section for pricing, deliverables, and payment terms." },
    { question: "What sections are included?", answer: "A standard proposal includes an Executive Summary, Problem Definition, Scope of Work, Timeline, Pricing, and About Us section." },
    { question: "Is the content industry-specific?", answer: "Absolutely. Whether you're in IT, Marketing, or Construction, our AI adjusts the tone and terminology accordingly." },
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
          pt: { xs: 6, md: 10 },
          pb: { xs: 4, md: 6 },
          px: { xs: 3, md: 6 },
          maxWidth: 800,
          mx: "auto",
        }}
      >
        <Typography
          component="h1"
          sx={{
            fontWeight: 700,
            fontSize: { xs: "2.25rem", md: "3.5rem" },
            color: "#111827",
            mb: 2,
          }}
        >
          Prompt to Proposal
        </Typography>
        <Typography
          sx={{
            color: "text.secondary",
            fontSize: { xs: "1.05rem", md: "1.2rem" },
            lineHeight: 1.7,
            mb: 4,
          }}
        >
          Enter your project details and SlideXY AI builds a complete
          business proposal with an executive summary, scope of work,
          timeline, and pricing. Win more clients with 
          professionally structured proposals generated in seconds.
        </Typography>
      </Box>

      {/* Main Tool Component */}
      <PromptToProposal />

      <ProblemSolution 
        problem="Drafting business proposals is one of the most time-consuming parts of the sales cycle. Reusing old templates often leads to errors, while starting from scratch is slow and repetitive."
        solution="SlideXY's Prompt-to-Proposal tool acts as your dedicated sales assistant. It analyzes your input to generate a coherent, persuasive document that covers every essential section of a winning business proposal."
      />

      <WhoItsFor personas={personas} />

      <WorkflowSteps steps={steps} />

      <BenefitsList benefits={benefits} />

      <ContextualFAQ 
        title="Proposal Generation FAQ" 
        subtitle="Learn how to win more clients with AI-driven documentation."
        faqs={faqs} 
      />

      <InternalLinks title="Explore More Tools" links={relatedLinks} />

      <CTASection 
        title="Start winning more business"
        subtitle="Generate your first professional proposal in under a minute."
      />


      <Footer />
    </Box>
  );
}