import React from 'react'
import type { Metadata } from 'next'
import Header from '@/app/components/headers-navbar/Header'
import Footer from '@/app/components/home/Footer'

import PromptToTemplate from './components/promptToTemplate'
import { Box, Typography, Container } from '@mui/material'
import ProblemSolution from '@/app/components/seo/ProblemSolution'
import WhoItsFor from '@/app/components/seo/WhoItsFor'
import WorkflowSteps from '@/app/components/seo/WorkflowSteps'
import BenefitsList from '@/app/components/seo/BenefitsList'
import ContextualFAQ from '@/app/components/seo/ContextualFAQ'
import InternalLinks from '@/app/components/seo/InternalLinks'
import CTASection from '@/app/components/seo/CTASection'
import Reveal from '@/app/components/shared/Reveal'

export const metadata: Metadata = {
  title: 'Prompt to Template — Custom Slide Template Generator',
  description:
    'Describe a style and Slidexy builds a reusable, on-brand slide template you can edit and reuse across presentations.',
  alternates: {
    canonical: 'https://slidexy.ai/tools/prompt-to-template',
  },
}

export default function Page() {
  const personas = [
    { title: "Marketing managers", description: "Keep the brand consistent by generating a template every teammate can reuse.", icon: "business" as const },
    { title: "Project managers", description: "Set up a reporting template once, reuse it for every weekly client call.", icon: "person" as const },
    { title: "Academic leads", description: "Design one consistent slide style for a whole course or seminar series.", icon: "school" as const },
  ];

  const steps = [
    { number: 1, title: "Describe the style", description: "Industry, colors, tone — e.g. 'Modern fintech, deep blue and white.'" },
    { number: 2, title: "Slidexy builds the layouts", description: "A set of master slides with matching typography and color." },
    { number: 3, title: "Save and reuse", description: "Keep it in your library and apply it to every future deck." },
  ];

  const benefits = [
    { title: "Brand stays consistent", description: "The same colors, type, and layout logic across every slide.", icon: "design" as const },
    { title: "Scales across a team", description: "Everyone works from the same professional-grade layouts.", icon: "speed" as const },
    { title: "Built to be reused", description: "Not a one-off deck — a foundation you keep using.", icon: "done" as const },
  ];

  const faqs = [
    { question: "Can I use my own brand colors?", answer: "Yes — describe your colors or drop in hex codes and the template will match your identity." },
    { question: "How many layouts does each template include?", answer: "Typically 10–15 master slide layouts: title, content, team, comparison, and more." },
    { question: "Can I share templates with my team?", answer: "Scale and Enterprise plans include a shared library for hosting templates across the team." },
  ];

  const relatedLinks = [
    { title: "Prompt-to-Deck", href: "/tools/prompt-to-deck", description: "Take your template and populate it with AI content instantly." },
    { title: "Templates Hub", href: "/templates", description: "Browse pre-made templates designed by our expert design team." },
    { title: "Web-to-Deck", href: "/tools/web-to-deck", description: "Apply your custom template to content derived from any URL." },
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
          Build a template, not just a deck
        </Typography>
        <Typography
          sx={{
            color: 'text.secondary',
            fontSize: { xs: '1.05rem', md: '1.15rem' },
            lineHeight: 1.7,
            mb: 2,
          }}
        >
          Describe the style — industry, colors, tone — and Slidexy builds a
          reusable set of layouts you can apply to every deck after.
        </Typography>
      </Box>

      <PromptToTemplate />

      <Reveal>
        <ProblemSolution
          problem="Generic templates make your brand look unfinished, but hiring a designer for every sub-project is slow and expensive. Manually matching colors and layouts across decks eats hours."
          solution="Prompt-to-Template builds a tailored, reusable design system in seconds — a foundation your whole team can keep using."
        />
      </Reveal>

      <Reveal><WhoItsFor personas={personas} /></Reveal>

      <Reveal><WorkflowSteps steps={steps} /></Reveal>

      <Reveal><BenefitsList benefits={benefits} /></Reveal>

      <Reveal>
        <ContextualFAQ
          title="Template Generation FAQ"
          subtitle="How to build a consistent, reusable design foundation."
          faqs={faqs}
        />
      </Reveal>

      <Reveal><InternalLinks title="Explore More Tools" links={relatedLinks} /></Reveal>

      <Reveal>
        <CTASection
          title="Lock in your brand's look"
          subtitle="Generate your first custom template in under a minute."
        />
      </Reveal>


      <Footer />
    </Box>
  )
}