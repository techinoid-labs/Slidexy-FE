import React from 'react'
import type { Metadata } from 'next'
import Header from '../components/headers-navbar/Header'
import Footer from '../components/home/Footer'

import OurAiTools from './components/OurAiTools'
import Services from './components/Services'
import WhoItsFor from '../components/seo/WhoItsFor'
import InternalLinks from '../components/seo/InternalLinks'
import ContextualFAQ from '../components/seo/ContextualFAQ'
import CTASection from '../components/seo/CTASection'
import { Box, Container, Typography } from '@mui/material'

export const metadata: Metadata = {
  title: "AI Presentation Tools — SlideXY Hub",
  description:
    "Explore Slidexy's complete suite of AI tools. From prompt-to-deck and video-to-slides to infographic and template generation, we automate your entire presentation workflow.",
  alternates: {
    canonical: "https://slidexy.ai/tools",
  },
};

export default function ToolsHub() {
    const toolLinks = [
        { title: "Prompt-to-Deck", href: "/tools/prompt-to-deck", description: "Generate full presentations from a single text prompt." },
        { title: "Web-to-Deck", href: "/tools/web-to-deck", description: "Convert any website or URL into a structured slide deck." },
        { title: "Video-to-Deck", href: "/tools/video-to-deck", description: "Turn YouTube videos or uploaded lectures into slides." },
        { title: "Prompt-to-Template", href: "/tools/prompt-to-template", description: "Create custom branded slide templates from a description." },
        { title: "Text-to-Infographics", href: "/tools/text-to-infographics", description: "Transform data-heavy text into visual infographics." },
        { title: "Prompt-to-Video", href: "/tools/prompt-to-video", description: "Convert presentation ideas into animated videos." },
        { title: "Prompt-to-eBook", href: "/tools/prompt-to-ebook", description: "Turn technical notes into formatted eBook documents." },
        { title: "Prompt-to-PDF", href: "/tools/prompt-to-pdf", description: "Generate polished PDF reports from simple prompts." },
        { title: "Prompt-to-Proposal", href: "/tools/prompt-to-proposal", description: "Create professional business proposals with AI." },
        { title: "Prompt to Web", href: "https://prompt-to-web.slidexy.net/", description: "Generate a functional landing page from a presentation." },
    ];

    const personas = [
        { title: "Sales & Marketing", description: "Speed up pitch deck creation and marketing collateral generation.", icon: "business" as const },
        { title: "Educators & Students", description: "Convert lectures and study notes into visual aids in seconds.", icon: "school" as const },
        { title: "Startup Founders", description: "Build professional investor decks and proposals from scratch.", icon: "person" as const },
    ];

    const toolsFaqs = [
        { question: "How many tools does SlideXY offer?", answer: "SlideXY currently offers 10 specialized AI tools ranging from multi-modal slide generation to infographic and video creation." },
        { question: "Can I use multiple tools for one project?", answer: "Yes, our tools are interconnected. You can generate a deck from a prompt and then use the 'Video-to-Deck' tool to add more content from a recording." },
        { question: "Do these tools support brand kits?", answer: "Absolutely. SlideXY Pro users can apply their brand colors, logos, and fonts across all hub tools for a consistent look." },
    ];

    return (
        <Box component="main" sx={{ bgcolor: "#fff" }}>
            <Header />
            
            {/* Header section already in OurAiTools */}
            <OurAiTools />
            
            {/* Services already contains the grid, but we want it to be crawlable */}
            <Services />
            
            <WhoItsFor personas={personas} />
            
            <InternalLinks 
                title="Detailed Feature Guides" 
                links={toolLinks} 
            />
            
            <ContextualFAQ 
                title="Common Tool Questions" 
                subtitle="Everything you need to know about our AI engine handles various inputs."
                faqs={toolsFaqs} 
            />
            
            <CTASection 
                title="Start building with AI today"
                subtitle="Explore our full suite of professional presentation tools."
                showButton={false}
            />
            

            <Footer />
        </Box>
    )
}
