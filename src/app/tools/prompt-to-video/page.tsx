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
    { title: "Social Media Managers", description: "Quickly turn educational threads and ideas into engaging video content for LinkedIn and Instagram.", icon: "group" as const },
    { title: "SaaS Product Managers", description: "Create high-impact product walkthroughs and feature explainer videos in minutes.", icon: "business" as const },
    { title: "YouTube Educators", description: "Generate slide-based video lessons without expensive editing software or voice recording.", icon: "school" as const },
  ];

  const steps = [
    { number: 1, title: "Brief Your Idea", description: "Enter a topic, a script, or just a few sentences about your video's goal." },
    { number: 2, title: "AI Animates Slides", description: "SlideXY builds the slides and applies professional transitions and effects." },
    { number: 3, title: "Export and Share", description: "Download your video in MP4 format and publish it to any social platform." },
  ];

  const benefits = [
    { title: "No Editing Required", description: "Our AI handles all keyframes, transitions, and timings automatically.", icon: "speed" as const },
    { title: "Professional Visuals", description: "High-quality animations and background effects are applied to every slide.", icon: "design" as const },
    { title: "Social-Ready Output", description: "Generate videos optimized for professional platforms and marketing channels.", icon: "done" as const },
  ];

  const faqs = [
    { question: "What video formats are supported?", answer: "Currently, SlideXY exports videos as high-quality MP4 files, compatible with all major social media platforms and websites." },
    { question: "Can I add music or voiceover?", answer: "Yes, our video tool allows you to select from a library of background tracks or use integrated AI Text-to-Speech for professional narration." },
    { question: "How long can each video be?", answer: "SlideXY is optimized for 'short-to-medium' form content, generally ranging from 30 seconds to 5 minutes, ideal for explainers and social ads." },
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
          Prompt to Video
        </Typography>
        <Typography
          sx={{
            color: 'text.secondary',
            fontSize: { xs: '1.05rem', md: '1.2rem' },
            lineHeight: 1.7,
            mb: 4,
          }}
        >
          Describe your video topic and SlideXY AI creates an animated,
          slide-based video presentation complete with professional transitions. 
          Perfect for explainers, social media content, and product demos.
        </Typography>
      </Box>

      {/* Main Tool Component */}
      <PromptToVideo />

      <ProblemSolution 
        problem="Creating animated video explainers traditionally requires expensive subscriptions to tools like Adobe After Effects or hiring specialized editors. The process is slow and often costs thousands of dollars for a single minute of content."
        solution="SlideXY's Prompt-to-Video tool democratizes video production. You provide the idea, and our AI logic handles the entire production pipeline—from slide design to animation—producing a professional result in under 2 minutes."
      />

      <WhoItsFor personas={personas} />

      <WorkflowSteps steps={steps} />

      <BenefitsList benefits={benefits} />

      <ContextualFAQ 
        title="Video Generation FAQ" 
        subtitle="Learn how to create impactful animated explainers with AI."
        faqs={faqs} 
      />

      <InternalLinks title="Explore More Tools" links={relatedLinks} />

      <CTASection 
        title="Start making professional videos"
        subtitle="Experience the speed of AI-driven video production."
      />


      <Footer />
    </Box>
  )
}