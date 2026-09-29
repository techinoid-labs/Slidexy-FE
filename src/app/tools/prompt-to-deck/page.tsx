import React from 'react'
import type { Metadata } from 'next'
import PromptToDeck from './components/promptToDeck'
import Header from '@/app/components/headers-navbar/Header'
import Footer from '@/app/components/home/Footer'

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
  title: 'Prompt to Deck — AI Slide Generator',
  description:
    'Turn a text prompt into a complete, professional slide deck in seconds. SlideXY AI handles content, layout, and visual design for your pitch decks and presentations.',
  alternates: {
    canonical: 'https://slidexy.ai/tools/prompt-to-deck',
  },
}

export default function Page() {
  const personas = [
    { title: "Startup Founders", description: "Turn a rough pitch idea into slides you could actually send to an investor tonight.", icon: "business" as const },
    { title: "Marketing Teams", description: "Get a campaign or social strategy deck out of your head and into a review meeting fast.", icon: "group" as const },
    { title: "Educators", description: "Build a lesson deck from your notes without opening a design tool.", icon: "school" as const },
  ];

  const steps = [
    { number: 1, title: "Say what it's for", description: "A sentence or two is enough — the topic, the audience, the point you're making." },
    { number: 2, title: "Slidexy drafts it", description: "It structures the narrative, writes the copy, and picks visuals that fit." },
    { number: 3, title: "Tweak and ship", description: "Adjust anything that's off, then export to PDF or PowerPoint." },
  ];

  const benefits = [
    { title: "Fast, not rushed-looking", description: "A full deck in under a minute — but structured like someone actually thought about it.", icon: "speed" as const },
    { title: "Layouts that fit the content", description: "Each slide gets a layout suited to what's actually on it, not a single repeated template.", icon: "design" as const },
    { title: "Visuals that match the topic", description: "Images and icons are chosen based on what your deck is actually about.", icon: "ai" as const },
  ];

  const faqs = [
    { question: "How detailed should my prompt be?", answer: "You can be as simple as 'A pitch deck for a coffee startup' or as detailed as providing a full business outline. The more detail you provide, the more tailored the content will be." },
    { question: "Can I edit the generated slides?", answer: "Yes, once the AI generates the deck, you have full control to edit text, swap images, and reposition elements in our editor." },
    { question: "Does it support custom branding?", answer: "SlideXY Pro allows you to apply your own brand kit (colors, fonts, logo) to every generated presentation." },
  ];

  const relatedLinks = [
    { title: "Web-to-Deck", href: "/tools/web-to-deck", description: "Turn any webpage into a professional presentation." },
    { title: "Video-to-Deck", href: "/tools/video-to-deck", description: "Convert YouTube videos or recordings into slide decks." },
    { title: "Prompt-to-Template", href: "/tools/prompt-to-template", description: "Generate custom slide templates from a description." },
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
          Turn a prompt into a real deck
        </Typography>
        <Typography
          sx={{
            color: "text.secondary",
            fontSize: { xs: "1.05rem", md: "1.15rem" },
            lineHeight: 1.7,
            mb: 2,
          }}
        >
          Describe what it&apos;s for in a sentence or two. Slidexy writes the
          outline, drafts the copy, and lays out every slide.
        </Typography>
      </Box>

      {/* Main Tool Component - already has "use client" inside */}
      <PromptToDeck />

      <Reveal>
        <ProblemSolution
          problem="Starting a presentation from scratch is intimidating. Between structuring the content and hunting for the right visuals, hours are lost to 'blank slide' syndrome."
          solution="SlideXY's Prompt-to-Deck tool acts as your expert co-pilot. It instantly processes your ideas into a logical narrative, handles all the design work, and gives you a professional starting point in seconds."
        />
      </Reveal>

      <Reveal><WhoItsFor personas={personas} /></Reveal>

      <Reveal><WorkflowSteps steps={steps} /></Reveal>

      <Reveal><BenefitsList benefits={benefits} /></Reveal>

      <Reveal>
        <ContextualFAQ
          title="Prompt-to-Deck FAQ"
          subtitle="Learn how to get the best results from our AI generation engine."
          faqs={faqs}
        />
      </Reveal>

      <Reveal><InternalLinks title="Explore More Tools" links={relatedLinks} /></Reveal>

      <Reveal>
        <CTASection
          title="Generate your first deck now"
          subtitle="Experience the future of presentation design. No credit card required."
        />
      </Reveal>


      <Footer />
    </Box>
  )
}