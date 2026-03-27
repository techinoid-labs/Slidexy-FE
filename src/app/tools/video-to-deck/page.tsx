import React from 'react'
import type { Metadata } from 'next'
import Header from '@/app/components/headers-navbar/Header'
import Footer from '@/app/components/home/Footer'
import CommunitySection from '@/app/components/home/Community'
import VideoToDeck from './components/videoToDeck'
import { Box, Typography } from '@mui/material'

export const metadata: Metadata = {
  title: 'Video to Deck — Convert Videos into Slide Presentations',
  description:
    'Upload a video and SlideXY AI extracts key points, structures them into slides, and generates a complete presentation deck automatically.',
  alternates: {
    canonical: 'https://slidexy.ai/tools/video-to-deck',
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
          Video to Deck
        </Typography>
        <Typography
          sx={{
            color: 'text.secondary',
            fontSize: { xs: '0.95rem', md: '1.05rem' },
            lineHeight: 1.7,
            mb: 2,
          }}
        >
          Upload or link a video and SlideXY AI watches it, extracts the
          key talking points, and builds a complete slide deck from the
          content. Turn webinars, lectures, product demos, and conference
          talks into shareable presentations you can edit and download
          instantly.
        </Typography>
      </Box>
      <VideoToDeck />
      <CommunitySection />
      <Footer />
    </>
  )
}