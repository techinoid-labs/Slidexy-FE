import React from 'react'
import type { Metadata } from 'next'
import Header from '@/app/components/headers-navbar/Header'
import Footer from '@/app/components/home/Footer'
import CommunitySection from '@/app/components/home/Community'
import PromptToTemplate from './components/promptToTemplate'
import { Box, Typography } from '@mui/material'

export const metadata: Metadata = {
  title: 'Prompt to Template — AI Slide Template Generator',
  description:
    'Generate custom slide templates from a text prompt. SlideXY AI creates reusable, on-brand presentation templates you can edit and download instantly.',
  alternates: {
    canonical: 'https://slidexy.ai/tools/prompt-to-template',
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
          Prompt to Template
        </Typography>
        <Typography
          sx={{
            color: 'text.secondary',
            fontSize: { xs: '0.95rem', md: '1.05rem' },
            lineHeight: 1.7,
            mb: 2,
          }}
        >
          Describe the style, topic, or industry and SlideXY AI generates a
          reusable slide template with professional layouts, color schemes,
          and typography. Customize every element to match your brand and
          save it for future presentations. Ideal for teams that need
          consistent, on-brand decks at scale.
        </Typography>
      </Box>
      <PromptToTemplate />
      <CommunitySection />
      <Footer />
    </>
  )
}