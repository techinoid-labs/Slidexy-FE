import React from 'react'
import type { Metadata } from 'next'
import PromptToVideo from './components/promptToVideo'
import Header from '@/app/components/headers-navbar/Header'

import Footer from '@/app/components/home/Footer'
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
  title: 'Prompt to Video — AI Video Presentation Maker',
  description:
    'Convert a text prompt into an animated video presentation with SlideXY AI. Generate narrated, slide-based videos for marketing, education, and social media.',
  alternates: {
    canonical: 'https://slidexy.ai/tools/prompt-to-video',
  },
}

export default function Page() {
  const personas = [
    { title: "Social Media Managers", description: "Turn a thread or a rough idea into a video that's actually ready to post on LinkedIn or Instagram.", icon: "group" as const },
    { title: "Product Managers", description: "Put together a product walkthrough without waiting on the design team's calendar.", icon: "business" as const },
    { title: "YouTube Educators", description: "Make a slide-based lesson video without opening editing software or recording your voice.", icon: "school" as const },
  ];

  const steps = [
    { number: 1, title: "Describe the video", description: "A topic, a rough script, or a few sentences about what it's for." },
    { number: 2, title: "Slidexy builds it", description: "It lays out the slides and adds transitions between them." },
    { number: 3, title: "Export and share", description: "Download as MP4 and post it wherever you need." },
  ];

  const benefits = [
    { title: "Nothing to edit by hand", description: "Transitions and timing are handled for you — no keyframes to fiddle with.", icon: "speed" as const },
    { title: "Doesn't look thrown together", description: "Every slide gets a real layout, not a text box on a plain background.", icon: "design" as const },
    { title: "Ready to post", description: "Sized and formatted for the platforms you're actually sharing to.", icon: "done" as const },
  ];

  const faqs = [
    { question: "What video formats are supported?", answer: "Videos export as MP4, which works across all the major social platforms." },
    { question: "Can I add music or voiceover?", answer: "Yes — pick from a library of background tracks, or use built-in text-to-speech for narration." },
    { question: "How long can each video be?", answer: "It's built for short-to-medium content, generally 30 seconds to 5 minutes — a good fit for explainers and social ads." },
  ];

  const relatedLinks = [
    { title: "Prompt-to-Deck", href: "/tools/prompt-to-deck", description: "Create the static presentation foundation for your video." },
    { title: "Web-to-Deck", href: "/tools/web-to-deck", description: "Turn a blog post or landing page into a video presentation." },
    { title: "Text-to-Infographics", href: "/tools/text-to-infographics", description: "Generate visual assets to include in your video explainers." },
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
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: { xs: '1.85rem', md: '2.75rem' },
            letterSpacing: '-0.03em',
            color: '#0F0A19',
            mb: 2,
          }}
        >
          Turn a prompt into a video
        </Typography>
        <Typography
          sx={{
            color: 'text.secondary',
            fontSize: { xs: '1.05rem', md: '1.15rem' },
            lineHeight: 1.7,
            mb: 2,
          }}
        >
          Describe the topic. Slidexy builds the slides, adds transitions,
          and exports a video that's ready to share.
        </Typography>
      </Box>

      {/* Main Tool Component */}
      <PromptToVideo />

      <Reveal>
        <ProblemSolution
          problem="Animated explainer videos usually mean a subscription to something like After Effects, or hiring an editor — slow, and expensive for a minute of content."
          solution="Slidexy handles the whole pipeline from idea to finished video — slide design, transitions, and export — so you get a shareable result in a couple of minutes instead of a couple of days."
        />
      </Reveal>

      <Reveal><WhoItsFor personas={personas} /></Reveal>

      <Reveal><WorkflowSteps steps={steps} /></Reveal>

      <Reveal><BenefitsList benefits={benefits} /></Reveal>

      <Reveal>
        <ContextualFAQ
          title="Video Generation FAQ"
          subtitle="What to know before you make your first one."
          faqs={faqs}
        />
      </Reveal>

      <Reveal><InternalLinks title="Explore More Tools" links={relatedLinks} /></Reveal>

      <Reveal>
        <CTASection
          title="Make your first video"
          subtitle="No credit card required to try it."
        />
      </Reveal>


      <Footer />
    </Box>
  )
}