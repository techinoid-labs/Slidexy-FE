import React from 'react'
import type { Metadata } from 'next'
import Header from '@/app/components/headers-navbar/Header'
import Footer from '@/app/components/home/Footer'
import CommunitySection from '@/app/components/home/Community'
import WebToDeck from './components/webToDeck'
import { Box, Typography } from '@mui/material'

export const metadata: Metadata = {
  title: 'Website to Presentation — Turn Any Webpage into Slides',
  description:
    'Paste a website URL and SlideXY AI converts the page content into a structured, professional slide presentation. Summarize any site into a deck in seconds.',
  alternates: {
    canonical: 'https://slidexy.ai/tools/web-to-deck',
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
          Website to Presentation Tool
        </Typography>
        <Typography
          sx={{
            color: 'text.secondary',
            fontSize: { xs: '0.95rem', md: '1.05rem' },
            lineHeight: 1.7,
            mb: 2,
          }}
        >
          Paste any website URL and SlideXY AI reads the page, extracts
          the most important content, and builds a structured slide deck
          from it. Ideal for summarizing competitor sites, turning blog
          posts into presentations, or converting landing pages into
          pitch decks. Your slides are ready in seconds.
        </Typography>
      </Box>
      <WebToDeck />
      <CommunitySection />
      <Footer />
    </>
  )
}