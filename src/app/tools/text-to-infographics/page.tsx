import React from 'react'
import type { Metadata } from 'next'
import Header from '@/app/components/headers-navbar/Header'
import Footer from '@/app/components/home/Footer'

import TextToInfographics from './components/textToInfographics'
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
  title: 'Text to Infographics — Turn Data into Visuals',
  description:
    'Paste your data or key points and Slidexy turns them into a clean, shareable infographic.',
  alternates: {
    canonical: 'https://slidexy.ai/tools/text-to-infographics',
  },
}

export default function Page() {
  const personas = [
    { title: "Data analysts", description: "Turn a dense research finding into something a stakeholder can skim in seconds.", icon: "business" as const },
    { title: "PR teams", description: "Turn press release numbers into a graphic that's actually shareable.", icon: "group" as const },
    { title: "Content creators", description: "Turn a blog post's key stats into something built for LinkedIn or Instagram.", icon: "person" as const },
  ];

  const steps = [
    { number: 1, title: "Paste your data", description: "Raw text, bullet points, or the specific stats you want visualized." },
    { number: 2, title: "Slidexy finds the pattern", description: "It picks out the key metrics and the visual form that fits them best." },
    { number: 3, title: "Download", description: "Export as a high-resolution PNG or PDF, ready to share." },
  ];

  const benefits = [
    { title: "No design skills needed", description: "You don't need to know a design tool to get something that looks designed.", icon: "design" as const },
    { title: "Picks the right visual", description: "Charts and icons are chosen based on what your data actually shows.", icon: "ai" as const },
    { title: "Fast", description: "From raw text to a finished graphic in under a minute.", icon: "speed" as const },
  ];

  const faqs = [
    { question: "What data formats are supported?", answer: "Plain text, CSV-style lists, or full paragraphs — numeric data gets pulled out from natural language automatically." },
    { question: "Can I customize the colors?", answer: "Yes, Pro users can apply their brand's color palette to every generated graphic." },
    { question: "What are the export resolutions?", answer: "High-resolution exports suitable for social sharing, blog embedding, or printing." },
  ];

  const relatedLinks = [
    { title: "Prompt-to-Deck", href: "/tools/prompt-to-deck", description: "Incorporate your new infographics into a full presentation deck." },
    { title: "Web-to-Deck", href: "/tools/web-to-deck", description: "Summarize entire web pages directly into visual slide decks." },
    { title: "Prompt-to-PDF", href: "/tools/prompt-to-pdf", description: "Create text-heavy reports to complement your infographics." },
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
          Turn data into something worth sharing
        </Typography>
        <Typography
          sx={{
            color: 'text.secondary',
            fontSize: { xs: '1.05rem', md: '1.15rem' },
            lineHeight: 1.7,
            mb: 2,
          }}
        >
          Paste your stats or key points. Slidexy turns them into a clean,
          designed infographic — ready for a report or a social post.
        </Typography>
      </Box>

      <TextToInfographics />

      <Reveal>
        <ProblemSolution
          problem="Data-heavy text is hard to skim, and turning stats into a real infographic usually means design software and hours of manual alignment."
          solution="Text-to-Infographics finds the key data points and maps them to a layout that's actually easy to read — no design tool required."
        />
      </Reveal>

      <Reveal><WhoItsFor personas={personas} /></Reveal>

      <Reveal><WorkflowSteps steps={steps} /></Reveal>

      <Reveal><BenefitsList benefits={benefits} /></Reveal>

      <Reveal>
        <ContextualFAQ
          title="Infographic Generation FAQ"
          subtitle="How to turn raw data into something visual."
          faqs={faqs}
        />
      </Reveal>

      <Reveal><InternalLinks title="Explore More Tools" links={relatedLinks} /></Reveal>

      <Reveal>
        <CTASection
          title="Visualize your data"
          subtitle="Turn a paragraph of stats into a graphic in under a minute."
        />
      </Reveal>


      <Footer />
    </Box>
  )
}