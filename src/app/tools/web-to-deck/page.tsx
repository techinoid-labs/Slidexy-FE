import React from 'react'
import type { Metadata } from 'next'
import Header from '@/app/components/headers-navbar/Header'
import Footer from '@/app/components/home/Footer'

import WebToDeck from './components/webToDeck'
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
  title: 'Web to Deck — Turn Any Webpage into Slides',
  description:
    'Paste a website URL and Slidexy turns the page content into a structured, professional slide presentation in seconds.',
  alternates: {
    canonical: 'https://slidexy.ai/tools/web-to-deck',
  },
}

export default function Page() {
  const personas = [
    { title: "Market researchers", description: "Turn a competitor's landing page or a long report into a summary you can skim in a meeting.", icon: "business" as const },
    { title: "Content marketers", description: "Repurpose a blog post or whitepaper into a deck for a webinar or social share.", icon: "group" as const },
    { title: "Sales teams", description: "Build a quick deck from a prospect's own site to show you did your homework.", icon: "person" as const },
  ];

  const steps = [
    { number: 1, title: "Paste a URL", description: "Any landing page, blog post, or article you want summarized." },
    { number: 2, title: "Slidexy reads it", description: "It pulls out the key messaging, structure, and visuals from the page." },
    { number: 3, title: "Review and export", description: "Adjust anything that's off, then export to PDF or PowerPoint." },
  ];

  const benefits = [
    { title: "Skips the copy-paste grind", description: "No more pulling text into a doc and reformatting it slide by slide.", icon: "speed" as const },
    { title: "Keeps your branding", description: "Apply your own colors, fonts, and logo to the extracted content.", icon: "design" as const },
    { title: "Visuals that fit the page", description: "Icons and imagery are chosen based on what the source page is actually about.", icon: "ai" as const },
  ];

  const faqs = [
    { question: "Does it work with any website?", answer: "Most public websites — blog posts, product pages, technical docs. Pages behind a login won't work." },
    { question: "Can I choose which parts get summarized?", answer: "Right now Slidexy reads the primary content on the page and maps it to a 5–15 slide deck." },
    { question: "Can I export to Google Slides?", answer: "Yes — export as PPTX, which opens cleanly in Google Slides or PowerPoint." },
  ];

  const relatedLinks = [
    { title: "Video-to-Deck", href: "/tools/video-to-deck", description: "Turn YouTube videos or recordings into slide decks." },
    { title: "Prompt-to-Deck", href: "/tools/prompt-to-deck", description: "Generate decks directly from your text ideas and prompts." },
    { title: "Prompt to Web", href: "https://prompt-to-web.slidexy.net/", description: "Re-imagine a URL as a new website redesign instantly." },
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
          Turn any webpage into a deck
        </Typography>
        <Typography
          sx={{
            color: 'text.secondary',
            fontSize: { xs: '1.05rem', md: '1.15rem' },
            lineHeight: 1.7,
            mb: 2,
          }}
        >
          Paste a URL. Slidexy reads the page and lays out a slide deck
          that actually reflects what's on it.
        </Typography>
      </Box>

      <WebToDeck />

      <Reveal>
        <ProblemSolution
          problem="Copying text from a website into a slide deck by hand is slow — messy layouts, inconsistent formatting, and hours lost to manual editing."
          solution="Web-to-Deck reads the page for you, pulls out the key points, and lays them into a deck that's ready to present, not just a wall of pasted text."
        />
      </Reveal>

      <Reveal><WhoItsFor personas={personas} /></Reveal>

      <Reveal><WorkflowSteps steps={steps} /></Reveal>

      <Reveal><BenefitsList benefits={benefits} /></Reveal>

      <Reveal>
        <ContextualFAQ
          title="Web-to-Deck FAQ"
          subtitle="Common questions about turning a webpage into a presentation."
          faqs={faqs}
        />
      </Reveal>

      <Reveal><InternalLinks title="Explore More Tools" links={relatedLinks} /></Reveal>

      <Reveal>
        <CTASection
          title="Turn a URL into a deck"
          subtitle="Paste a link and see what Slidexy builds. No credit card required."
        />
      </Reveal>

      <Footer />
    </Box>
  )
}
