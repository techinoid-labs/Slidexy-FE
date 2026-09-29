import React from 'react';
import type { Metadata } from 'next';
import Header from '@/app/components/headers-navbar/Header';
import Footer from '@/app/components/home/Footer';

import PromptToPdf from './components/PromptToPdf';
import { Box, Typography } from '@mui/material';
import ProblemSolution from '@/app/components/seo/ProblemSolution'
import WhoItsFor from '@/app/components/seo/WhoItsFor'
import WorkflowSteps from '@/app/components/seo/WorkflowSteps'
import BenefitsList from '@/app/components/seo/BenefitsList'
import ContextualFAQ from '@/app/components/seo/ContextualFAQ'
import InternalLinks from '@/app/components/seo/InternalLinks'
import CTASection from '@/app/components/seo/CTASection'
import Reveal from '@/app/components/shared/Reveal'

export const metadata: Metadata = {
  title: 'Prompt to PDF — Generate a Formatted Document',
  description:
    'Describe the document you need and Slidexy generates a formatted PDF — reports, resumes, and whitepapers, ready to download.',
  alternates: {
    canonical: 'https://slidexy.ai/tools/prompt-to-pdf',
  },
};

export default function Page() {
  const personas = [
    { title: "Business analysts", description: "Turn a data summary or research notes into a polished PDF report.", icon: "business" as const },
    { title: "Marketing teams", description: "Build a whitepaper or case study without needing a designer.", icon: "group" as const },
    { title: "Solopreneurs", description: "Put together documentation and guides that look like they came from a bigger team.", icon: "person" as const },
  ];

  const steps = [
    { number: 1, title: "Describe the document", description: "A short brief or a full outline of what you want." },
    { number: 2, title: "Slidexy formats it", description: "It structures the text, applies clean typography, and handles page breaks." },
    { number: 3, title: "Download", description: "A finished PDF, no manual alignment needed." },
  ];

  const benefits = [
    { title: "No word processor needed", description: "Margins, headers, and footers are handled for you.", icon: "done" as const },
    { title: "Typography that fits", description: "Font pairings chosen for what you're actually writing.", icon: "design" as const },
    { title: "Ready right away", description: "Download a print-ready PDF as soon as it's generated.", icon: "speed" as const },
  ];

  const faqs = [
    { question: "Is the PDF text-searchable?", answer: "Yes — every generated PDF keeps selectable, searchable text." },
    { question: "Can I customize the page size?", answer: "Documents generate in standard A4 or US Letter by default, suited for screen and print." },
    { question: "Is my data secure?", answer: "Your prompts and generated PDFs are private and only accessible to you unless you choose to share them." },
  ];

  const relatedLinks = [
    { title: "Prompt-to-eBook", href: "/tools/prompt-to-ebook", description: "Create longer-form digital books with chapters and cover designs." },
    { title: "Prompt-to-Proposal", href: "/tools/prompt-to-proposal", description: "Generate business-winning proposals with AI assistance." },
    { title: "Prompt-to-Deck", href: "/tools/prompt-to-deck", description: "Turn your document ideas into visual presentations." },
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
          Describe it. Get a formatted PDF.
        </Typography>
        <Typography
          sx={{
            color: 'text.secondary',
            fontSize: { xs: '1.05rem', md: '1.15rem' },
            lineHeight: 1.7,
            mb: 2,
          }}
        >
          A resume, a report, a proposal — describe what you need and
          Slidexy handles the structure, typography, and layout.
        </Typography>
      </Box>

      <PromptToPdf />

      <Reveal>
        <ProblemSolution
          problem="Formatting a document by hand in Word or Docs is fiddly — managing spacing, margins, and hierarchy manually usually ends up looking inconsistent."
          solution="Prompt-to-PDF handles structure and design together, so every PDF comes out balanced without the manual fussing."
        />
      </Reveal>

      <Reveal><WhoItsFor personas={personas} /></Reveal>

      <Reveal><WorkflowSteps steps={steps} /></Reveal>

      <Reveal><BenefitsList benefits={benefits} /></Reveal>

      <Reveal>
        <ContextualFAQ
          title="PDF Generation FAQ"
          subtitle="Common questions about generating a document."
          faqs={faqs}
        />
      </Reveal>

      <Reveal><InternalLinks title="Explore Related Tools" links={relatedLinks} /></Reveal>

      <Reveal>
        <CTASection
          title="Generate your first PDF"
          subtitle="Stop wrestling with word processors."
        />
      </Reveal>


      <Footer />
    </Box>
  );
}