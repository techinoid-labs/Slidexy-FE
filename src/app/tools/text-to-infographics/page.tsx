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

export const metadata: Metadata = {
  title: 'Text to Infographics — AI Infographic Generator',
  description:
    'Transform text into stunning infographics with SlideXY AI. Generate data-driven visual graphics for reports, social media, and presentations automatically.',
  alternates: {
    canonical: 'https://slidexy.ai/tools/text-to-infographics',
  },
}

export default function Page() {
  const personas = [
    { title: "Data Analysts", description: "Convert complex research findings into easy-to-digest visual summaries for stakeholders.", icon: "business" as const },
    { title: "PR Professionals", description: "Turn press release statistics into high-impact graphics for media distribution.", icon: "group" as const },
    { title: "Content Creators", description: "Generate viral-ready infographics for LinkedIn and Instagram from blog post snippets.", icon: "person" as const },
  ];

  const steps = [
    { number: 1, title: "Paste Your Data", description: "Provide raw text, bullet points, or specific statistics you want to visualize." },
    { number: 2, title: "AI Identifies Patterns", description: "SlideXY extracts key metrics and chooses the best visual representation (charts, icons, etc.)." },
    { number: 3, title: "Download Graphic", description: "Export your high-resolution infographic in PNG or PDF format instantly." },
  ];

  const benefits = [
    { title: "Zero Design Knowledge", description: "You don't need to be a graphic designer to create agency-level infographics.", icon: "design" as const },
    { title: "Automated Visualization", description: "Our AI understands which chart types and icons best represent your specific data points.", icon: "ai" as const },
    { title: "Fast Turnaround", description: "Go from raw text to a finished infographic in under 60 seconds.", icon: "speed" as const },
  ];

  const faqs = [
    { question: "What data formats are supported?", answer: "You can paste plain text, CSV-style lists, or detailed paragraphs. Our AI excels at extracting numeric data from natural language." },
    { question: "Can I customize the colors?", answer: "Yes, SlideXY Pro users can apply their brand's specific color palette to every generated graphic." },
    { question: "What are the export resolutions?", answer: "We provide high-resolution exports suitable for social media sharing, blog embedding, and high-quality printing." },
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
          Text to Infographics
        </Typography>
        <Typography
          sx={{
            color: 'text.secondary',
            fontSize: { xs: '1.05rem', md: '1.2rem' },
            lineHeight: 1.7,
            mb: 4,
          }}
        >
          Paste your data, statistics, or key points and SlideXY AI turns
          them into visually striking infographics. The perfect tool for data 
          visualization in reports, social media, and presentations.
        </Typography>
      </Box>

      {/* Main Tool Component */}
      <TextToInfographics />

      <ProblemSolution 
        problem="Data-heavy text is boring and hard to process. Converting statistics into professional infographics usually requires expensive design software and hours of manual alignment and icon hunting."
        solution="SlideXY's Text-to-Infographics tool automates the visual storytelling process. Our AI identifies core data points and maps them to designer-grade layouts, ensuring your insights are both beautiful and easy to understand."
      />

      <WhoItsFor personas={personas} />

      <WorkflowSteps steps={steps} />

      <BenefitsList benefits={benefits} />

      <ContextualFAQ 
        title="Infographic Generation FAQ" 
        subtitle="Learn how to visualize your data effortlessly with AI."
        faqs={faqs} 
      />

      <InternalLinks title="Explore More Tools" links={relatedLinks} />

      <CTASection 
        title="Visualize your data today"
        subtitle="Turn boring reports into stunning visuals in seconds."
      />


      <Footer />
    </Box>
  )
}