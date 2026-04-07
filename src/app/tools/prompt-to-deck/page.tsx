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
    { title: "Startup Founders", description: "Generate investor-ready pitch decks from a simple business idea prompt.", icon: "business" as const },
    { title: "Marketing Teams", description: "Create campaign proposals and social media strategy decks in minutes.", icon: "group" as const },
    { title: "Educators", description: "Turn lesson topics into engaging classroom presentations without manual design.", icon: "school" as const },
  ];

  const steps = [
    { number: 1, title: "Enter Your Topic", description: "Type a simple idea or a detailed brief into our AI prompt box." },
    { number: 2, title: "AI Generates Content", description: "SlideXY builds a logical structure, writes copy, and selects visuals." },
    { number: 3, title: "Refine & Export", description: "Customize the design and export your deck to PDF or PowerPoint." },
  ];

  const benefits = [
    { title: "Instant Generation", description: "Go from zero to a complete 10-slide deck in under 60 seconds.", icon: "speed" as const },
    { title: "Dynamic Layouts", description: "AI selects the perfect grid and components for every individual slide.", icon: "design" as const },
    { title: "Content-Aware Design", description: "Visuals and icons are automatically matched to your prompt's context.", icon: "ai" as const },
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
          textAlign: 'center',
          pt: { xs: 6, md: 10 },
          pb: { xs: 4, md: 6 },
          px: { xs: 3, md: 6 },
          maxWidth: 800,
          mx: 'auto',
        }}
      >
        <Typography
          component="h1"
          sx={{
            fontWeight: 700,
            fontSize: { xs: '2.25rem', md: '3.5rem' },
            color: '#111827',
            mb: 2,
          }}
        >
          Prompt to Deck
        </Typography>
        <Typography
          sx={{
            color: 'text.secondary',
            fontSize: { xs: '1.05rem', md: '1.2rem' },
            lineHeight: 1.7,
            mb: 4,
          }}
        >
          Type a topic, idea, or detailed brief and SlideXY AI generates a
          complete slide deck with structured content, professional layouts,
          and matching visuals. Perfect for startup pitch decks, sales
          presentations, and team updates.
        </Typography>
      </Box>

      {/* Main Tool Component - already has "use client" inside */}
      <PromptToDeck />

      <ProblemSolution 
        problem="Starting a presentation from scratch is intimidating. Between structuring the content and hunting for the right visuals, hours are lost to 'blank slide' syndrome."
        solution="SlideXY's Prompt-to-Deck tool acts as your expert co-pilot. It instantly processes your ideas into a logical narrative, handles all the design work, and gives you a professional starting point in seconds."
      />

      <WhoItsFor personas={personas} />

      <WorkflowSteps steps={steps} />

      <BenefitsList benefits={benefits} />

      <ContextualFAQ 
        title="Prompt-to-Deck FAQ" 
        subtitle="Learn how to get the best results from our AI generation engine."
        faqs={faqs} 
      />

      <InternalLinks title="Explore More Tools" links={relatedLinks} />

      <CTASection 
        title="Generate your first deck now"
        subtitle="Experience the future of presentation design. No credit card required."
      />


      <Footer />
    </Box>
  )
}