import type { Metadata } from "next";
import { Box, Typography, Container, Grid, Divider } from "@mui/material";
import Header from "@/app/components/headers-navbar/Header";
import Footer from "@/app/components/home/Footer";
import PricingSection from "../components/pricing/Pricing";
import WhoItsFor from "../components/seo/WhoItsFor";
import ContextualFAQ from "../components/seo/ContextualFAQ";
import CTASection from "../components/seo/CTASection";

export const metadata: Metadata = {
  title: "Pricing & Plans — SlideXY AI",
  description:
    "Choose the best AI presentation plan for your needs. From free credits to professional and scale tiers, SlideXY power-ups your workflow with designer-grade slides.",
  alternates: {
    canonical: "https://slidexy.ai/pricing",
  },
};

export default function PricingPage() {
  const personas = [
    {
      title: "Students & Casuals",
      description: "Perfect for one-off presentations, school projects, and exploring AI slide generation without commitment.",
      icon: "school" as const,
    },
    {
      title: "Professsionals & Freelancers",
      description: "Designed for consultants and creators who need consistent, high-quality decks for clients and meetings.",
      icon: "person" as const,
    },
    {
      title: "Startups & Teams",
      description: "Built for scaling businesses that need rapid deck creation, brand consistency, and collaborative tools.",
      icon: "business" as const,
    },
  ];

  const pricingFaqs = [
    {
      question: "How do credits work in SlideXY?",
      answer: "Credits are used each time you generate a new presentation or transform existing content (like video-to-slides). Each plan comes with a monthly allocation of credits that refresh every 30 days.",
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Yes, you can cancel your Pro or Scale subscription at any time through your account settings. You will retain access to your premium features until the end of your current billing cycle.",
    },
    {
      question: "What is the 'No sign-up' first deck?",
      answer: "We believe in our AI. You can generate your first presentation without even creating an account to see the quality of our content and design engine.",
    },
    {
      question: "Do you offer enterprise-level security?",
      answer: "Yes, our Scale plan includes enhanced security features and dedicated support. For custom enterprise requirements, please contact our sales team.",
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

      <Box sx={{ flex: "1 0 auto" }}>
        {/* Main Pricing Tables */}
        <Box sx={{ pt: { xs: 4, md: 8 }, pb: 4 }}>
          <Container maxWidth="lg">
            <Typography
              component="h1"
              sx={{
                fontWeight: 700,
                mb: 2,
                textAlign: "center",
                color: "#111827",
                fontSize: { xs: "2.25rem", md: "3.5rem" },
              }}
            >
              Simple, Transparent Pricing
            </Typography>
            <Typography
              variant="body1"
              sx={{
                mb: 8,
                textAlign: "center",
                color: "text.secondary",
                maxWidth: "600px",
                mx: "auto",
                fontSize: "1.1rem",
              }}
            >
              Choose the perfect plan for your presentation needs. From individuals to scaling teams, 
              SlideXY has you covered.
            </Typography>
          </Container>
          <PricingSection />
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Persona Section */}
        <WhoItsFor personas={personas} />

        {/* Feature Explanation Section (SEO Rich Text) */}
        <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: "#F9FAFB" }}>
          <Container maxWidth="md">
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, mb: 4, textAlign: "center", color: "#111827" }}
            >
              Understand Your Plan Features
            </Typography>
            <Grid container spacing={4}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: "#7C3AED" }}>
                  AI Generation Credits
                </Typography>
                <Typography sx={{ color: "text.secondary", lineHeight: 1.7 }}>
                  Our credits power the 'Brains' of SlideXY. Whether you're using Prompt-to-Deck or 
                  Web-to-Deck, credits allow our AI to crawl, summarize, and design your slides. 
                  Unused credits do not roll over to the next month on standard plans.
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: "#7C3AED" }}>
                  Premium Exports & Branding
                </Typography>
                <Typography sx={{ color: "text.secondary", lineHeight: 1.7 }}>
                  Pro and Scale users can export in high-fidelity PPTX and PDF formats without watermarks. 
                  You also gain access to custom brand kits, allowing you to lock in colors, fonts, 
                  and logos across every AI-generated deck.
                </Typography>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Pricing FAQs */}
        <ContextualFAQ 
          title="Pricing & Billing FAQ" 
          subtitle="Answers to common questions about SlideXY plans and credits."
          faqs={pricingFaqs} 
        />

        <CTASection 
          title="Join SlideXY Pro Today"
          subtitle="Unlock the full power of AI-driven presentation design."
          buttonText="Upgrade Now"
          href="/auth/sign-up"
        />
      </Box>

      <Footer />
    </Box>
  );
}
