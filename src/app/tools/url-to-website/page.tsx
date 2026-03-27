import React from 'react'
import type { Metadata } from 'next'
import Header from '@/app/components/headers-navbar/Header'
import Footer from '@/app/components/home/Footer'
import CommunitySection from '@/app/components/home/Community'
import UrlToWebsite from './components/urlToWebsite'
import { Box, Typography } from '@mui/material'

export const metadata: Metadata = {
  title: 'URL to Website — AI Website Generator',
  description:
    'Paste a URL and let SlideXY AI generate a complete website from the content. Turn any webpage, article, or landing page into a new site design instantly.',
  alternates: {
    canonical: 'https://slidexy.ai/tools/url-to-website',
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
          URL to Website
        </Typography>
        <Typography
          sx={{
            color: 'text.secondary',
            fontSize: { xs: '0.95rem', md: '1.05rem' },
            lineHeight: 1.7,
            mb: 2,
          }}
        >
          Paste any URL and SlideXY AI analyzes the page content, then
          generates a fresh website design with structured sections,
          responsive layouts, and clean code. Perfect for redesigning
          landing pages, building microsites from existing content, or
          quickly prototyping new web pages.
        </Typography>
      </Box>
      <UrlToWebsite />
      <CommunitySection />
      <Footer />
    </>
  )
}