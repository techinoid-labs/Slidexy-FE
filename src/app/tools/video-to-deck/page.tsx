import React from 'react'
import type { Metadata } from 'next'
import Header from '@/app/components/headers-navbar/Header'
import Footer from '@/app/components/home/Footer'

import VideoToDeck from './components/videoToDeck'
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
  title: 'Video to Deck — Convert Videos into Slide Presentations',
  description:
    'Paste a YouTube link and Slidexy extracts the key points and structures them into a complete slide deck.',
  alternates: {
    canonical: 'https://slidexy.ai/tools/video-to-deck',
  },
}

export default function Page() {
  const personas = [
    { title: "Students", description: "Turn a long lecture or course video into a study deck without re-watching the whole thing.", icon: "school" as const },
    { title: "Trainers", description: "Turn a recorded webinar or training session into an onboarding deck for the team.", icon: "business" as const },
    { title: "Content creators", description: "Repurpose a video or interview into a shareable deck for social.", icon: "group" as const },
  ];

  const steps = [
    { number: 1, title: "Paste a YouTube link", description: "Any public video works — the clearer the audio, the better the result." },
    { number: 2, title: "Slidexy watches it", description: "It transcribes the audio, pulls out the key points, and grabs relevant frames." },
    { number: 3, title: "Get your deck", description: "A structured presentation built from what's actually in the video." },
  ];

  const benefits = [
    { title: "No re-watching required", description: "Skip pausing and note-taking — Slidexy pulls out what matters.", icon: "speed" as const },
    { title: "Layouts that fit the topic", description: "The deck's design lines up with what the video is actually about.", icon: "ai" as const },
    { title: "Works across formats", description: "Lectures, product demos, interviews — most spoken-word video works.", icon: "done" as const },
  ];

  const faqs = [
    { question: "Which YouTube links are supported?", answer: "Any public YouTube URL. Clear audio gives the best transcription results." },
    { question: "How long can the video be?", answer: "Up to 60 minutes depending on your plan. Longer videos get summarized to the key highlights." },
    { question: "Can I export to PowerPoint?", answer: "Yes — every generated deck can be exported as an editable PPTX or shared as a PDF." },
  ];

  const relatedLinks = [
    { title: "Web-to-Deck", href: "/tools/web-to-deck", description: "Turn websites and blog posts into professional presentations." },
    { title: "Prompt-to-Deck", href: "/tools/prompt-to-deck", description: "Generate decks from text prompts and ideas." },
    { title: "Prompt-to-Video", href: "/tools/prompt-to-video", description: "Convert your static slides back into animated videos." },
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
          Turn a video into a deck
        </Typography>
        <Typography
          sx={{
            color: 'text.secondary',
            fontSize: { xs: '1.05rem', md: '1.15rem' },
            lineHeight: 1.7,
            mb: 2,
          }}
        >
          Paste a YouTube link. Slidexy listens, pulls out the key points,
          and builds a slide deck around them.
        </Typography>
      </Box>

      <VideoToDeck />

      <Reveal>
        <ProblemSolution
          problem="Turning a 30-minute video into a 10-slide deck by hand means constant pausing, note-taking, then building layouts from scratch — usually an afternoon gone."
          solution="Video-to-Deck transcribes, summarizes, and lays out the deck at once, so what took an afternoon takes a couple of minutes."
        />
      </Reveal>

      <Reveal><WhoItsFor personas={personas} /></Reveal>

      <Reveal><WorkflowSteps steps={steps} /></Reveal>

      <Reveal><BenefitsList benefits={benefits} /></Reveal>

      <Reveal>
        <ContextualFAQ
          title="Video-to-Deck FAQ"
          subtitle="Common questions about turning video content into a presentation."
          faqs={faqs}
        />
      </Reveal>

      <Reveal><InternalLinks title="Explore More Tools" links={relatedLinks} /></Reveal>

      <Reveal>
        <CTASection
          title="Turn your next video into a deck"
          subtitle="Paste a link and see what Slidexy builds. No credit card required."
        />
      </Reveal>

      <Footer />
    </Box>
  )
}
