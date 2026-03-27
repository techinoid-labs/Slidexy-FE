import React from 'react'
import type { Metadata } from 'next'
import PromptToVideo from './components/promptToVideo'
import Header from '@/app/components/headers-navbar/Header'
import CommunitySection from '@/app/components/home/Community'
import Footer from '@/app/components/home/Footer'
import { Box, Typography } from '@mui/material'

export const metadata: Metadata = {
  title: 'Prompt to Video — AI Video Presentation Maker',
  description:
    'Convert a text prompt into an animated video presentation with SlideXY AI. Generate narrated, slide-based videos for marketing, education, and social media.',
  alternates: {
    canonical: 'https://slidexy.ai/tools/prompt-to-video',
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
          Prompt to Video
        </Typography>
        <Typography
          sx={{
            color: 'text.secondary',
            fontSize: { xs: '0.95rem', md: '1.05rem' },
            lineHeight: 1.7,
            mb: 2,
          }}
        >
          Describe your video topic and SlideXY AI creates an animated,
          slide-based video presentation complete with transitions and
          visual effects. Ideal for marketing explainers, social media
          content, educational walkthroughs, and product demos. Export
          your video and share it anywhere.
        </Typography>
      </Box>
      <PromptToVideo />
      <CommunitySection />
      <Footer />
    </>
  )
}