import React from 'react'
import type { Metadata } from 'next'
import Header from '@/app/components/headers-navbar/Header'
import Footer from '@/app/components/home/Footer'

import PromptToEbook from './components/promptToEbook'
import { Box, Typography } from '@mui/material'
import ProblemSolution from '@/app/components/seo/ProblemSolution'
import WhoItsFor from '@/app/components/seo/WhoItsFor'
import WorkflowSteps from '@/app/components/seo/WorkflowSteps'
import BenefitsList from '@/app/components/seo/BenefitsList'
import ContextualFAQ from '@/app/components/seo/ContextualFAQ'
import InternalLinks from '@/app/components/seo/InternalLinks'
import CTASection from '@/app/components/seo/CTASection'
import Reveal from '@/app/components/shared/Reveal'

export const metadata: Metadata = {
  title: 'Prompt to eBook — Generate a Formatted eBook',
  description:
    'Turn a topic or outline into a professionally formatted eBook — chapters, layout, and cover, generated for you.',
  alternates: {
    canonical: 'https://slidexy.ai/tools/prompt-to-ebook',
  },
}

export default function Page() {
  const personas = [
    { title: "Content marketers", description: "Build a lead magnet or whitepaper in a fraction of the usual time.", icon: "business" as const },
    { title: "Authors & creators", description: "Turn an outline into a formatted draft ready for fine-tuning.", icon: "person" as const },
    { title: "Educators", description: "Turn course notes into a structured student workbook.", icon: "school" as const },
  ];

  const steps = [
    { number: 1, title: "Give it a topic", description: "A title, an idea, or a detailed chapter outline." },
    { number: 2, title: "Slidexy writes it", description: "It sequences the chapters, writes the content, and lays out each page." },
    { number: 3, title: "Export to PDF", description: "Review the formatted eBook and export it as a PDF." },
  ];

  const benefits = [
    { title: "No fighting with margins", description: "Layout and formatting are handled for you.", icon: "design" as const },
    { title: "Reads like it was planned", description: "Chapters follow a coherent flow start to finish.", icon: "ai" as const },
    { title: "Ready to send out", description: "Looks like it came from a design team, not a template.", icon: "done" as const },
  ];

  const faqs = [
    { question: "How long can the generated eBooks be?", answer: "Anywhere from a short 5-page guide to a 30+ page whitepaper, depending on your plan." },
    { question: "Can I add my own images to the eBook?", answer: "Yes — upload your own images or let the AI-powered visual search find graphics for each chapter." },
    { question: "What formats does the export support?", answer: "High-resolution PDF exports, ready for lead magnets and digital downloads." },
  ];

  const relatedLinks = [
    { title: "Prompt-to-PDF", href: "/tools/prompt-to-pdf", description: "Generate shorter professional documents and reports." },
    { title: "Prompt-to-Proposal", href: "/tools/prompt-to-proposal", description: "Create business-winning proposals with AI assistance." },
    { title: "Prompt-to-Deck", href: "/tools/prompt-to-deck", description: "Turn your eBook concepts into visual presentations." },
  ];

  return (
    <Box component="main">
      <Header />
      
      <Box
        component="section"
        sx={{
          textAlign: 'center',
          pt: { xs: 5, md: 7 },
          pb: { xs: 2, md: 2 },
          px: { xs: 3, md: 6 },
          maxWidth: 720,
          mx: 'auto',
        }}
      >
        <Typography
          component="h1"
          className="sx-display"
          sx={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: { xs: '1.85rem', md: '2.75rem' },
            letterSpacing: "-0.03em",
            color: '#0F0A19',
            mb: 2,
          }}
        >
          A topic in, a formatted eBook out
        </Typography>
        <Typography
          sx={{
            color: 'text.secondary',
            fontSize: { xs: '1.05rem', md: '1.15rem' },
            lineHeight: 1.7,
            mb: 2,
          }}
        >
          Give it a topic or outline. Slidexy writes the chapters, lays out
          every page, and designs a cover.
        </Typography>
      </Box>

      <PromptToEbook />

      <Reveal>
        <ProblemSolution
          problem="A professional eBook usually means hours of writing plus formatting in a tool like InDesign — most people get stuck at the outline stage or the final product looks unpolished."
          solution="Prompt-to-eBook handles the writing and the layout together, producing a designer-grade document in minutes instead of weeks."
        />
      </Reveal>

      <Reveal><WhoItsFor personas={personas} /></Reveal>

      <Reveal><WorkflowSteps steps={steps} /></Reveal>

      <Reveal><BenefitsList benefits={benefits} /></Reveal>

      <Reveal>
        <ContextualFAQ
          title="eBook Generation FAQ"
          subtitle="Common questions about creating and exporting an eBook."
          faqs={faqs}
        />
      </Reveal>

      <Reveal><InternalLinks title="Explore Related Tools" links={relatedLinks} /></Reveal>

      <Reveal>
        <CTASection
          title="Publish your first eBook"
          subtitle="Go from idea to digital download in minutes, not weeks."
        />
      </Reveal>


      <Footer />
    </Box>
  )
}