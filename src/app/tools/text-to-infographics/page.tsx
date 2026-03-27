import React from 'react'
import type { Metadata } from 'next'
import Header from '@/app/components/headers-navbar/Header'
import Footer from '@/app/components/home/Footer'
import CommunitySection from '@/app/components/home/Community'
import TextToInfographics from './components/textToInfographics'
import { Box, Typography } from '@mui/material'

export const metadata: Metadata = {
  title: 'Text to Infographics — AI Infographic Generator',
  description:
    'Transform text into stunning infographics with SlideXY AI. Generate data-driven visual graphics for reports, social media, and presentations automatically.',
  alternates: {
    canonical: 'https://slidexy.ai/tools/text-to-infographics',
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
          Text to Infographics
        </Typography>
        <Typography
          sx={{
            color: 'text.secondary',
            fontSize: { xs: '0.95rem', md: '1.05rem' },
            lineHeight: 1.7,
            mb: 2,
          }}
        >
          Paste your data, statistics, or key points and SlideXY AI turns
          them into visually striking infographics. Choose from multiple
          layout styles and export high-resolution graphics for reports,
          social media posts, blog articles, and presentations. No design
          skills required.
        </Typography>
      </Box>
      <TextToInfographics />
      <CommunitySection />
      <Footer />
    </>
  )
}