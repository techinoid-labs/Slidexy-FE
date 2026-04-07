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

export const metadata: Metadata = {
  title: 'Website to Presentation — Turn Any Webpage into Slides',
  description:
    'Paste a website URL and SlideXY AI converts the page content into a structured, professional slide presentation. Summarize any site into a deck in seconds.',
  alternates: {
    canonical: 'https://slidexy.ai/tools/web-to-deck',
  },
}

export default function Page() {
  const personas = [
    { title: "Market Researchers", description: "Convert competitor landing pages and industry reports into executive summaries in seconds.", icon: "business" as const },
    { title: "Content Marketers", description: "Repurpose your blog posts and whitepapers into engaging slide decks for webinars and social sharing.", icon: "group" as const },
    { title: "Sales Executives", description: "Turn a prospect's website into a customized presentation that shows you've done your homework.", icon: "person" as const },
  ];

  const steps = [
    { number: 1, title: "Paste a URL", description: "Provde the link to any landing page, blog post, or article you want to summarize." },
    { number: 2, title: "AI Crawls and Maps", description: "SlideXY extracts key messaging, visuals, and hierarchy from the webpage." },
    { number: 3, title: "Customize Your Deck", description: "Review and refine your new presentation before exporting it to PDF or PowerPoint." },
  ];

  const benefits = [
    { title: "Instant Summarization", description: "Our AI identifies the core value propositions and messages from any URL automatically.", icon: "speed" as const },
    { title: "Consistent Brand Kits", description: "Apply your own branding to the extracted content for a uniform look and feel.", icon: "design" as const },
    { title: "High-Fidelity Visuals", description: "SlideXY selects professional icons and imagery that complement the website's original context.", icon: "ai" as const },
  ];

  const faqs = [
    { question: "Does it work with any website?", answer: "Yes, SlideXY can crawl and summarize most public websites, including blog posts, product pages, and technical documentation." },
    { question: "Can I choose which pages are summarized?", answer: "Currently, our AI summarizes the primary content from the provided URL, mapping it to a presentation between 5-15 slides." },
    { question: "Can I export to Google Slides?", answer: "Yes, every presentation can be exported as a PPTX file, which is fully compatible with Google Slides and Microsoft PowerPoint." },
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
          Website to Presentation Tool
        </Typography>
        <Typography
          sx={{
            color: 'text.secondary',
            fontSize: { xs: '1.05rem', md: '1.2rem' },
            lineHeight: 1.7,
            mb: 4,
          }}
        >
          Paste any website URL and SlideXY AI analyzes the page to
          generate a structured slide deck. Perfect for summarizing blog posts, 
          converting landing pages into pitches, and competitive research.
        </Typography>
      </Box>

      {/* Main Tool Component */}
      <WebToDeck />

      <ProblemSolution 
        problem="Copying and pasting text from a website into a slide deck is an inefficient way to summarize content. It leads to messy layouts, inconsistent branding, and hours wasted on manual editing."
        solution="SlideXY's Web-to-Deck tool automates the entire analytical process. Our AI parses the webpage for you, summarizes the key highlights, and presents them in a logical and visually stunning slide deck."
      />

      <WhoItsFor personas={personas} />

      <WorkflowSteps steps={steps} />

      <BenefitsList benefits={benefits} />

      <ContextualFAQ 
        title="Web-to-Presentation FAQ" 
        subtitle="Learn how to turn any webpage into an impactful slide deck."
        faqs={faqs} 
      />

      <InternalLinks title="Explore More Tools" links={relatedLinks} />

      <CTASection 
        title="Convert any URL into a presentation"
        subtitle="Experience the power of AI-driven content transformation."
      />


      <Footer />
    </Box>
  )
}