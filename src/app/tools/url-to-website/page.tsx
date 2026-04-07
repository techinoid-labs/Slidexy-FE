import React from 'react'
import type { Metadata } from 'next'
import Header from '@/app/components/headers-navbar/Header'
import Footer from '@/app/components/home/Footer'

import UrlToWebsite from './components/urlToWebsite'
import { Box, Typography } from '@mui/material'
import ProblemSolution from '@/app/components/seo/ProblemSolution'
import WhoItsFor from '@/app/components/seo/WhoItsFor'
import WorkflowSteps from '@/app/components/seo/WorkflowSteps'
import BenefitsList from '@/app/components/seo/BenefitsList'
import ContextualFAQ from '@/app/components/seo/ContextualFAQ'
import InternalLinks from '@/app/components/seo/InternalLinks'
import CTASection from '@/app/components/seo/CTASection'

export const metadata: Metadata = {
  title: 'URL to Website — AI Website Generator',
  description:
    'Paste a URL and let SlideXY AI generate a complete website from the content. Turn any webpage, article, or landing page into a new site design instantly.',
  alternates: {
    canonical: 'https://slidexy.ai/tools/url-to-website',
  },
}

export default function Page() {
  const personas = [
    { title: "Growth Marketers", description: "Quickly spin up high-converting landing pages derived from existing blog posts or product pages.", icon: "group" as const },
    { title: "SaaS Founders", description: "Prototype new product pages or microsites without needing a full development team.", icon: "business" as const },
    { title: "Web Designers", description: "Explore new layout directions and architectural ideas based on current URLs in seconds.", icon: "design" as const },
  ];

  const steps = [
    { number: 1, title: "Paste a URL", description: "Provide the link to any webpage, article, or existing landing page." },
    { number: 2, title: "AI Analyzes Content", description: "SlideXY crawls the URL, extracts key messaging, and maps it to a new design." },
    { number: 3, title: "Launch and Refine", description: "Preview your responsive website design and refine it in our designer suite." },
  ];

  const benefits = [
    { title: "Instant Prototyping", description: "See your existing content in a completely new layout in under 60 seconds.", icon: "speed" as const },
    { title: "Responsive by Design", description: "Every generated website is automatically optimized for mobile, tablet, and desktop.", icon: "done" as const },
    { title: "Content-Driven Architecture", description: "Our AI ensures the structure of your new site follows logical user intent derived from the source.", icon: "ai" as const },
  ];

  const faqs = [
    { question: "What kind of URLs can I use?", answer: "You can use any public URL, including blog posts, product landing pages, or even competitor sites, to generate new design inspiration." },
    { question: "Is the generated site SEO-friendly?", answer: "Yes, SlideXY ensures that all sections follow semantic HTML practices and core SEO principles out of the box." },
    { question: "Can I export the code?", answer: "SlideXY Pro users can export the generated design or share it via a live link for hosting on our platform." },
  ];

  const relatedLinks = [
    { title: "Web-to-Deck", href: "/tools/web-to-deck", description: "Turn the same URL into a professional presentation instead of a website." },
    { title: "Prompt-to-Deck", href: "/tools/prompt-to-deck", description: "Generate presentations from simple text ideas." },
    { title: "Prompt-to-Template", href: "/tools/prompt-to-template", description: "Create the visual brand foundation for your new website." },
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
          URL to Website
        </Typography>
        <Typography
          sx={{
            color: 'text.secondary',
            fontSize: { xs: '1.05rem', md: '1.2rem' },
            lineHeight: 1.7,
            mb: 4,
          }}
        >
          Paste any URL and SlideXY AI analyzes the content to
          generate a fresh website design with responsive layouts and clean code. 
          The perfect tool for rapid redesigns and prototyping microsites.
        </Typography>
      </Box>

      {/* Main Tool Component */}
      <UrlToWebsite />

      <ProblemSolution 
        problem="Redesigning a landing page or building a microsite from existing documentation is often a slow, manual process. You have to extract the content, plan the architecture, and then design it, which can take days or weeks."
        solution="SlideXY's URL-to-Website tool automates the entire migration. Our AI reads your existing content and instantly maps it to modern, high-converting layouts, giving you a functional prototype that's ready to customize."
      />

      <WhoItsFor personas={personas} />

      <WorkflowSteps steps={steps} />

      <BenefitsList benefits={benefits} />

      <ContextualFAQ 
        title="URL to Website FAQ" 
        subtitle="Learn how to transform existing content into new web designs."
        faqs={faqs} 
      />

      <InternalLinks title="Explore More Tools" links={relatedLinks} />

      <CTASection 
        title="Transform your content into a website"
        subtitle="Experience the fastest way to prototype and redesign landing pages."
      />


      <Footer />
    </Box>
  )
}