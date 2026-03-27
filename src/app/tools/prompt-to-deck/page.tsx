import React from 'react'
import type { Metadata } from 'next'
import PromptToDeck from './components/promptToDeck'
import Header from '@/app/components/headers-navbar/Header'
import Footer from '@/app/components/home/Footer'
import CommunitySection from '@/app/components/home/Community'
import { Box, Typography } from '@mui/material'

export const metadata: Metadata = {
  title: 'Prompt to Deck — Generate Slides from Text',
  description:
    'Type a prompt and let SlideXY AI generate a complete, professional slide deck in seconds. Perfect for pitch decks, business presentations, and classroom slides.',
  alternates: {
    canonical: 'https://slidexy.ai/tools/prompt-to-deck',
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
          Prompt to Deck
        </Typography>
        <Typography
          sx={{
            color: 'text.secondary',
            fontSize: { xs: '0.95rem', md: '1.05rem' },
            lineHeight: 1.7,
            mb: 2,
          }}
        >
          Type a topic, idea, or detailed brief and SlideXY AI generates a
          complete slide deck with structured content, professional layouts,
          and matching visuals. Perfect for startup pitch decks, sales
          presentations, academic lectures, and team updates. Your deck is
          ready to edit and export in seconds.
        </Typography>
      </Box>
      <PromptToDeck />
      <CommunitySection />
      <Footer />
    </>
  )
}