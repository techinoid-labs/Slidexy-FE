import React from 'react'
import type { Metadata } from 'next'
import Header from '@/app/components/headers-navbar/Header'
import Footer from '@/app/components/home/Footer'
import CommunitySection from '@/app/components/home/Community'
import PromptToEbook from './components/promptToEbook'
import { Box, Typography } from '@mui/material'

export const metadata: Metadata = {
  title: 'Prompt to eBook — AI eBook Creator',
  description:
    'Turn a text prompt into a professionally formatted eBook with SlideXY AI. Generate chapters, layouts, and cover designs automatically from your ideas.',
  alternates: {
    canonical: 'https://slidexy.ai/tools/prompt-to-ebook',
  },
}

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
          Prompt to eBook
        </Typography>
        <Typography
          sx={{
            color: 'text.secondary',
            fontSize: { xs: '0.95rem', md: '1.05rem' },
            lineHeight: 1.7,
            mb: 2,
          }}
        >
          Enter a topic or outline and SlideXY AI creates a fully formatted
          eBook with chapter structure, professional layouts, and cover
          design. Perfect for lead magnets, educational content, and
          thought-leadership publications. Download your eBook ready to
          share or publish.
        </Typography>
      </Box>
      <PromptToEbook />
      <CommunitySection />
      <Footer />
    </>
  )
}