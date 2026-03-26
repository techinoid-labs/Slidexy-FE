import React from 'react'
import type { Metadata } from 'next'
import Header from '../components/headers-navbar/Header'
import Footer from '../components/home/Footer'
import CommunitySection from '../components/home/Community'
import OurAiTools from './components/OurAiTools'
import Services from './components/Services'

export const metadata: Metadata = {
  title: 'AI Presentation Tools — Create Decks, Videos & More',
  description:
    'Explore SlideXY AI tools: prompt-to-deck, video-to-slides, website-to-deck, text-to-template and more. Turn any content into professional presentations.',
  alternates: {
    canonical: 'https://slidexy.ai/tools',
  },
}


export default function Tools() {
    return (
        <>
            <Header />
            <OurAiTools />
            <Services />
            <CommunitySection />
            <Footer />
        </>
    )
}
