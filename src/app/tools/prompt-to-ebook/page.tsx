import React from 'react'
import type { Metadata } from 'next'
import Header from '@/app/components/headers-navbar/Header'
import Footer from '@/app/components/home/Footer'

import PromptToEbook from './components/promptToEbook'
import { Box, Typography } from '@mui/material'
import ProblemSolution from '@/app/components/seo/ProblemSolution'
import WhoItsFor from '@/app/components/seo/WhoItsFor'
import WorkflowSteps from '@/app/components/seo/WorkflowSteps'
import BenefitsList from '@/app/components/seo/BenefitsList'
import ContextualFAQ from '@/app/components/seo/ContextualFAQ'
import InternalLinks from '@/app/components/seo/InternalLinks'
import CTASection from '@/app/components/seo/CTASection'

export const metadata: Metadata = {
  title: 'Prompt to eBook — AI eBook Creator',
  description:
    'Turn a text prompt into a professionally formatted eBook with SlideXY AI. Generate chapters, layouts, and cover designs automatically from your ideas.',
  alternates: {
    canonical: 'https://slidexy.ai/tools/prompt-to-ebook',
  },
}

export default function Page() {
  const personas = [
    { title: "Content Marketers", description: "Create high-converting lead magnets and whitepapers in a fraction of the time.", icon: "business" as const },
    { title: "Authors & Creators", description: "Turn your outlines into formatted eBook drafts ready for fine-tuning and publishing.", icon: "person" as const },
    { title: "Educators", description: "Convert course notes into structured student workbooks and educational eBooks.", icon: "school" as const },
  ];

  const steps = [
    { number: 1, title: "Provide a Topic", description: "Enter your eBook idea, title, or a detailed chapter outline." },
    { number: 2, title: "AI Sequences Chapters", description: "SlideXY structures the narrative, generates content, and designs the layout." },
    { number: 3, title: "Export to PDF", description: "Review your formatted eBook and export it as a professional PDF document." },
  ];

  const benefits = [
    { title: "Automated Formatting", description: "No more wrestling with margins and fonts; AI handles the entire layout.", icon: "design" as const },
    { title: "Logical Structuring", description: "Our AI ensures your eBook follows a coherent chapter flow from start to finish.", icon: "ai" as const },
    { title: "Ready for Leads", description: "Generate professional lead magnets that look like they were designed by an agency.", icon: "done" as const },
  ];

  const faqs = [
    { question: "How long can the generated eBooks be?", answer: "SlideXY can generate eBooks ranging from short 5-page guides to comprehensive 30+ page whitepapers depending on your plan tier." },
    { question: "Can I add my own images to the eBook?", answer: "Yes, you can upload custom images or use our AI-powered visual search to find the perfect graphics for each chapter." },
    { question: "What formats does the export support?", answer: "Currently, 'Prompt-to-eBook' supports high-resolution PDF exports, perfect for lead magnets and digital downloads." },
  ];

  const relatedLinks = [
    { title: "Prompt-to-PDF", href: "/tools/prompt-to-pdf", description: "Generate shorter professional documents and reports." },
    { title: "Prompt-to-Proposal", href: "/tools/prompt-to-proposal", description: "Create business-winning proposals with AI assistance." },
    { title: "Prompt-to-Deck", href: "/tools/prompt-to-deck", description: "Turn your eBook concepts into visual presentations." },
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
          Prompt to eBook
        </Typography>
        <Typography
          sx={{
            color: 'text.secondary',
            fontSize: { xs: '1.05rem', md: '1.2rem' },
            lineHeight: 1.7,
            mb: 4,
          }}
        >
          Enter a topic or outline and SlideXY AI creates a fully formatted
          eBook with logical chapters, professional layouts, and cover design. 
          Perfect for lead magnets, internal guides, and educational content.
        </Typography>
      </Box>

      {/* Main Tool Component */}
      <PromptToEbook />

      <ProblemSolution 
        problem="Creating a professional eBook involves hours of research, writing, and complex formatting in tools like InDesign or Word. Most creators get stuck at the 'outline' phase or struggle to make the final product look polished."
        solution="SlideXY's Prompt-to-eBook tool takes care of the heavy lifting. Our AI generates a structured narrative, formats every page for readability, and produces a designer-grade document in minutes."
      />

      <WhoItsFor personas={personas} />

      <WorkflowSteps steps={steps} />

      <BenefitsList benefits={benefits} />

      <ContextualFAQ 
        title="eBook Generation FAQ" 
        subtitle="Common questions about creating and exporting professional eBooks with AI."
        faqs={faqs} 
      />

      <InternalLinks title="Explore Related Tools" links={relatedLinks} />

      <CTASection 
        title="Publish your first eBook today"
        subtitle="Go from idea to digital download in minutes, not weeks."
      />


      <Footer />
    </Box>
  )
}