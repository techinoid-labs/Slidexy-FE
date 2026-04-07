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

export const metadata: Metadata = {
  title: 'Video to Deck — Convert Videos into Slide Presentations',
  description:
    'Upload a video and SlideXY AI extracts key points, structures them into slides, and generates a complete presentation deck automatically.',
  alternates: {
    canonical: 'https://slidexy.ai/tools/video-to-deck',
  },
}

export default function Page() {
  const personas = [
    { title: "Students & Learners", description: "Convert long university lectures and online courses into structured study decks instantly.", icon: "school" as const },
    { title: "Corporate Trainers", description: "Turn recorded webinars and training sessions into professional onboarding decks for teams.", icon: "business" as const },
    { title: "Content Marketers", description: "Repurpose YouTube videos and interviews into shareable slide decks for social media.", icon: "group" as const },
  ];

  const steps = [
    { number: 1, title: "Upload or Link Video", description: "Paste a YouTube link or upload your MP4 file to SlideXY." },
    { number: 2, title: "AI Analyzes Speech", description: "SlideXY transcribes the audio, identifies key points, and captures visual frames." },
    { number: 3, title: "Generate Deck", description: "Get a complete presentation with structured content and layouts derived from the video." },
  ];

  const benefits = [
    { title: "Automated Summarization", description: "Don't spend hours re-watching videos. Our AI extracts only the most important insights.", icon: "speed" as const },
    { title: "Context-Aware Layouts", description: "The deck's design and visuals are automatically aligned with the video's subject matter.", icon: "ai" as const },
    { title: "Multi-Modal Support", description: "We support diverse video sources, including technical lectures, product demos, and interviews.", icon: "done" as const },
  ];

  const faqs = [
    { question: "Which YouTube links are supported?", answer: "We support all public YouTube URLs. Just ensure the video has clear audio for the best AI transcription results." },
    { question: "How long can the video be?", answer: "SlideXY can process videos up to 60 minutes long, depending on your plan tier. For longer videos, the AI efficiently summarizes key highlights." },
    { question: "Can I export to PowerPoint?", answer: "Yes, every deck generated from a video can be exported as a fully editable PPTX file or shared as a PDF." },
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
          Video to Deck
        </Typography>
        <Typography
          sx={{
            color: 'text.secondary',
            fontSize: { xs: '1.05rem', md: '1.2rem' },
            lineHeight: 1.7,
            mb: 4,
          }}
        >
          Upload a video or paste a link and SlideXY AI watches it, 
          identifies the key talking points, and builds a complete slide deck. 
          The ultimate tool for repurposing webinars, lectures, and conference talks.
        </Typography>
      </Box>

      {/* Main Tool Component */}
      <VideoToDeck />

      <ProblemSolution 
        problem="Manually summarizing a 30-minute video into a 10-slide presentation is an arduous task. It requires constant pausing, note-taking, and then designing layouts from scratch, which can take an entire afternoon."
        solution="SlideXY's Video-to-Deck tool automates the entire analytical and creative process. Our AI transcribes, summarizes, and designs simultaneously, producing a polished presentation that captures the video's core message in minutes."
      />

      <WhoItsFor personas={personas} />

      <WorkflowSteps steps={steps} />

      <BenefitsList benefits={benefits} />

      <ContextualFAQ 
        title="Video-to-Deck FAQ" 
        subtitle="Common questions about converting video content into presentations."
        faqs={faqs} 
      />

      <InternalLinks title="Explore More Tools" links={relatedLinks} />

      <CTASection 
        title="Repurpose your videos instantly"
        subtitle="Turn any video content into a professional presentation today."
      />


      <Footer />
    </Box>
  )
}