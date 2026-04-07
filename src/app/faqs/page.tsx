import type { Metadata } from "next";
import {
  Box,
  Typography,
  Container,
} from "@mui/material";
import Header from "@/app/components/headers-navbar/Header";
import Footer from "@/app/components/home/Footer";
import ContextualFAQ from "../components/seo/ContextualFAQ";
import CTASection from "../components/seo/CTASection";

export const metadata: Metadata = {
  title: "Frequently Asked Questions (FAQ) — SlideXY AI",
  description:
    "Find answers to common questions about SlideXY AI, pricing, credits, and how to use our AI presentation maker to create stunning slides in seconds.",
  alternates: {
    canonical: "https://slidexy.ai/faqs",
  },
};

export default function FAQPage() {
  const faqs = [
    {
      question: "What is SlideXY AI and how does it work?",
      answer:
        "SlideXY is an advanced AI presentation maker that uses natural language processing and computer vision to transform your ideas into professional slide decks. Simply provide a text prompt, a video link, a website URL, or even voice input, and our AI handles the content structure, design layout, and visual selection automatically.",
    },
    {
      question: "How does SlideXY turn text into slides?",
      answer:
        "Our AI analyzes your text input to identify key talking points, hierarchical structure, and core messages. It then maps this information into a logical presentation flow, selects appropriate slide layouts, and generates high-quality visuals and icons that match your brand or theme.",
    },
    {
      question: "Can SlideXY create a professional startup pitch deck?",
      answer:
        "Yes, SlideXY is specifically optimized for startup pitch decks. Our 'Prompt-to-Deck' tool recognizes standard pitch components like Problem, Solution, Market Size, and Business Model, ensuring your deck follows the structures preferred by investors.",
    },
    {
      question: "Can I turn a website URL into a presentation with SlideXY?",
      answer:
        "Absolutely. Using our 'Web-to-Deck' or 'URL-to-Website' tools, you can paste any link. SlideXY crawls the page, summarizes the core content, and recreates the website's key messaging and branding in a presentation format.",
    },
    {
      question: "Is SlideXY an alternative to Gamma or Tome?",
      answer:
        "SlideXY is a powerful alternative to Gamma and Tome, focusing on multi-modal inputs (like video-to-slides and voice-to-slides) and providing deeper designer-level customization. While Gamma focus on 'document-like' presentations, SlideXY focuses on high-impact visual decks ready for professional delivery.",
    },
    {
      question: "Does SlideXY support multi-language presentations?",
      answer:
        "Yes, SlideXY AI supports over 50 languages. You can prompt in your native language or generate slides in a target language for international meetings and audiences.",
    },
    {
      question: "How do I export my presentations from SlideXY?",
      answer:
        "You can export your SlideXY creations as high-resolution PDF documents, professional PPTX (PowerPoint) files, or share them via a unique live link for real-time web viewing.",
    },
    {
      question: "Is there a free trial or free version available?",
      answer:
        "SlideXY offers a 'No sign-up needed' first deck experience. You can try our generation engine for free to see the quality. We also have a 'Free' tier for casual users and premium 'Pro' and 'Scale' plans for power users and teams.",
    },
  ];

  return (
    <Box
      component="main"
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#ffffff",
      }}
    >
      <Header />

      <Box sx={{ flex: "1 0 auto", pt: { xs: 4, md: 8 } }}>
        <Container maxWidth="md">
           <Typography
            component="h1"
            sx={{
              fontWeight: 700,
              mb: 2,
              textAlign: "center",
              color: "#111827",
              fontSize: { xs: "2.25rem", md: "3rem" },
            }}
          >
            SlideXY FAQ Hub
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
            Everything you need to know about the world's most versatile AI presentation platform. 
            Find answers to technical, pricing, and feature questions here.
          </Typography>
        </Container>

        <ContextualFAQ 
          title="Search-Optimized Questions" 
          subtitle="Answers to common queries about AI presentation making."
          faqs={faqs} 
        />

        <CTASection 
          title="Ready to transform your ideas?"
          href="/auth/sign-up"
        />
      </Box>

      <Footer />
    </Box>
  );
}
