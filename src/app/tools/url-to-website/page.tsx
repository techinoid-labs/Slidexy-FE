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
import Reveal from '@/app/components/shared/Reveal'

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
    { title: "Growth Marketers", description: "Spin up a landing page from an existing blog post or product page without starting from a blank canvas.", icon: "group" as const },
    { title: "Founders", description: "Prototype a new product page or microsite without pulling in a developer.", icon: "business" as const },
    { title: "Web Designers", description: "Try out a different layout direction for an existing URL in seconds, not a full mockup session.", icon: "design" as const },
  ];

  const steps = [
    { number: 1, title: "Paste a URL", description: "Any public webpage, article, or landing page." },
    { number: 2, title: "Slidexy reads it", description: "It pulls out the key messaging and maps it onto a new design." },
    { number: 3, title: "Preview and refine", description: "Check the responsive layout, then adjust it in the editor." },
  ];

  const benefits = [
    { title: "See it differently, fast", description: "The same content, in a new layout, in under a minute.", icon: "speed" as const },
    { title: "Responsive by default", description: "Every generated site works across mobile, tablet, and desktop out of the box.", icon: "done" as const },
    { title: "Structure that makes sense", description: "The new site follows the logic of the content it came from, not a generic template.", icon: "ai" as const },
  ];

  const faqs = [
    { question: "What kind of URLs can I use?", answer: "Any public URL — a blog post, a product page, even a competitor's site — as design inspiration." },
    { question: "Is the generated site SEO-friendly?", answer: "Yes, sections follow semantic HTML and standard on-page SEO practices by default." },
    { question: "Can I export the code?", answer: "Pro users can export the generated design or share it via a live link for hosting." },
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
          Turn a page into a new website
        </Typography>
        <Typography
          sx={{
            color: 'text.secondary',
            fontSize: { xs: '1.05rem', md: '1.15rem' },
            lineHeight: 1.7,
            mb: 2,
          }}
        >
          Paste a URL. Slidexy reads the content and rebuilds it as a
          fresh, responsive site you can edit.
        </Typography>
      </Box>

      {/* Main Tool Component */}
      <UrlToWebsite />

      <Reveal>
        <ProblemSolution
          problem="Redesigning a landing page or spinning up a microsite from existing content is usually slow — pulling out the copy, planning the structure, then actually designing it can eat days."
          solution="Slidexy reads your existing content and maps it onto a new, modern layout automatically, so you get a working prototype to customize instead of a blank page."
        />
      </Reveal>

      <Reveal><WhoItsFor personas={personas} /></Reveal>

      <Reveal><WorkflowSteps steps={steps} /></Reveal>

      <Reveal><BenefitsList benefits={benefits} /></Reveal>

      <Reveal>
        <ContextualFAQ
          title="URL to Website FAQ"
          subtitle="What to know before you turn a page into a site."
          faqs={faqs}
        />
      </Reveal>

      <Reveal><InternalLinks title="Explore More Tools" links={relatedLinks} /></Reveal>

      <Reveal>
        <CTASection
          title="Turn a page into a site"
          subtitle="No credit card required to try it."
        />
      </Reveal>


      <Footer />
    </Box>
  )
}