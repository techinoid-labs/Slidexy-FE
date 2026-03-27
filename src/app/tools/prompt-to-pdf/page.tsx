import React from 'react';
import type { Metadata } from 'next';
import Header from '@/app/components/headers-navbar/Header';
import Footer from '@/app/components/home/Footer';
import CommunitySection from '@/app/components/home/Community';
import PromptToPdf from './components/PromptToPdf';
import { Box, Typography } from '@mui/material';

export const metadata: Metadata = {
  title: 'Prompt to PDF — AI PDF Document Generator',
  description:
    'Generate polished PDF documents from a text prompt using SlideXY AI. Create reports, whitepapers, and formatted documents in seconds without manual layout work.',
  alternates: {
    canonical: 'https://slidexy.ai/tools/prompt-to-pdf',
  },
};

export default function Page() {
  return (
    <>
      <Header />
      <Box
        component="section"
        sx={{
          textAlign: 'center',
          pt: { xs: 4, md: 6 },
          px: { xs: 3, md: 6 },
          maxWidth: 720,
          mx: 'auto',
        }}
      >
        <Typography
          component="h1"
          sx={{
            fontWeight: 700,
            fontSize: { xs: '1.75rem', md: '2.25rem' },
            color: '#111827',
            mb: 1.5,
          }}
        >
          Prompt to PDF
        </Typography>
        <Typography
          sx={{
            color: 'text.secondary',
            fontSize: { xs: '0.95rem', md: '1.05rem' },
            lineHeight: 1.7,
            mb: 2,
          }}
        >
          Describe the document you need and SlideXY AI generates a
          professionally formatted PDF with structured content, clean
          typography, and page layouts. Build reports, whitepapers, and
          business documents without touching a word processor. Download
          your finished PDF instantly.
        </Typography>
      </Box>
      <PromptToPdf />
      <CommunitySection />
      <Footer />
    </>
  );
}