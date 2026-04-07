import React from "react";
import type { Metadata } from 'next';
import Header from "../components/headers-navbar/Header";
import Hero from "../components/templates/Hero";
import Footer from "../components/home/Footer";
import TemplatesSection from "../components/templates/TemplatesSection";
import WhoItsFor from "../components/seo/WhoItsFor";
import BenefitsList from "../components/seo/BenefitsList";
import ContextualFAQ from "../components/seo/ContextualFAQ";
import CTASection from "../components/seo/CTASection";
import { Box, Container, Typography } from "@mui/material";

export const metadata: Metadata = {
  title: "Professional Slide Templates — SlideXY Library",
  description:
    "Browse hundreds of designer-grade AI presentation templates. From startup pitch decks and educational workshops to corporate reports, find the perfect starting point for your slides.",
  alternates: {
    canonical: "https://slidexy.ai/templates",
  },
};

export default function TemplatesHub() {
  const personas = [
    { title: "Business Professionals", description: "Quickly create on-brand reports, proposals, and client decks without starting from zero.", icon: "business" as const },
    { title: "Educators & Trainers", description: "Design engaging course materials and seminar slides that capture students' attention.", icon: "school" as const },
    { title: "Creatives & Marketers", description: "Launch brand awareness campaigns with visually stunning, themed presentation templates.", icon: "group" as const },
  ];

  const benefits = [
    { title: "Designer-Grade Layouts", description: "Every template is crafted by professional designers to ensure high-impact visual communication.", icon: "design" as const },
    { title: "AI-Powered Content", description: "Don't just get a layout; our AI fills your templates with relevant content based on your niche.", icon: "ai" as const },
    { title: "Fully Customizable", description: "Edit every element, color, and font to match your specific brand identity in seconds.", icon: "ease" as const },
  ];

  const templateFaqs = [
    { question: "How do I use these templates with the AI?", answer: "Choose a template that matches your style, then use our 'Prompt-to-Template' or 'Prompt-to-Deck' tools. The AI will populate your chosen design with custom content." },
    { question: "Can I export these templates to PowerPoint?", answer: "Yes, all presentations generated from our templates can be exported as fully editable PPTX files or high-quality PDFs." },
    { question: "Are new templates added regularly?", answer: "Absolutely. Our design team adds new themed templates weekly, ranging from modern startup pitch decks to traditional business reports." },
  ];

  return (
    <Box component="main" sx={{ bgcolor: "#fff" }}>
      <Header />
      
      {/* Hero section from component */}
      <Hero />

      <Box sx={{ py: { xs: 4, md: 8 } }}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, mb: 2, textAlign: "center", color: "#111827" }}
          >
            Explore Master-Designed AI Templates
          </Typography>
          <Typography
            variant="body1"
            sx={{
              mb: 8,
              textAlign: "center",
              color: "text.secondary",
              maxWidth: "700px",
              mx: "auto",
              fontSize: "1.1rem"
            }}
          >
            SlideXY offers a diverse library of templates for every industry. 
            Whether you're closing a deal, teaching a class, or presenting a report, 
            our AI-enhanced templates provide the perfect foundation.
          </Typography>
        </Container>

        {/* Existing templates grid */}
        <TemplatesSection />
      </Box>

      <WhoItsFor personas={personas} />
      
      <BenefitsList 
        title="Why Use SlideXY Templates?" 
        subtitle="Combine professional design with the speed of AI."
        benefits={benefits} 
      />

      <ContextualFAQ 
        title="Template Questions" 
        subtitle="Common queries about using and customizing our presentation designs."
        faqs={templateFaqs} 
      />

      <CTASection 
        title="Build your deck on a professional foundation"
        subtitle="Choose a template and let AI handle the rest."
        buttonText="Browse All Templates"
        href="/auth/sign-up"
      />

      <Footer />
    </Box>
  );
}
