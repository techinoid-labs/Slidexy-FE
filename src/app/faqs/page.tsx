"use client";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Header from "@/app/components/headers-navbar/Header";
import Footer from "@/app/components/home/Footer";

export default function FAQPage() {
  const faqs = [
    {
      question: "What is SlideXy?",
      answer:
        "SlideXy is an AI-powered presentation tool that helps users create well-designed, branded decks from text, voice, or video content",
    },
    {
      question: "Is there a free version available?",
      answer:
        "It converts spoken ideas into presentation slides automatically. You speak, SlideXy builds.",
    },
    {
      question: "Can I customize the slides?",
      answer:
        "Absolutely. While AI generates the initial draft, you can fully edit, style, and personalize slides to match your needs.",
    },
    {
      question: "Do I need to install anything?",
      answer:
        "No installation required. SlideXy is 100% web-based, so you can create and access your presentations from any device with a browser.",
    },
    {
      question: "How do I get support?",
      answer:
        "You can reach out via our Contact page, or email us directly at support@slidexy.com. We're here to help!",
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
      {/* Header */}
      <Header />

      {/* FAQ Section */}
      <Box
        sx={{
          flex: "1 0 auto",
          py: { xs: 8, md: 12 },
          px: { xs: 2, md: 6 },
          maxWidth: "800px",
          mx: "auto",
        }}
      >
        <Typography
          component="h1"
          sx={{
            fontWeight: 700,
            mb: 2,
            textAlign: "center",
            color: "#111827",
            fontSize: { xs: "1.75rem", md: "2.125rem" },
          }}
        >
          Frequently Asked Questions
        </Typography>
        <Typography
          variant="body1"
          sx={{
            mb: 6,
            textAlign: "center",
            color: "text.secondary",
            maxWidth: "600px",
            mx: "auto",
          }}
        >
          Find answers to the most common questions about SlideXY. Learn
          how our AI presentation tool works, what features are available,
          how to customize your slides, and which pricing plan is right
          for you. If you do not see your question here, feel free to
          contact us anytime.
        </Typography>

        {/* Accordion List */}
        {faqs.map((faq, index) => (
          <Accordion
            key={index}
            sx={{
              mb: 2,
              boxShadow: "none",
              border: "1px solid #e5e7eb",
              borderRadius: "8px !important",
              "&:before": { display: "none" },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: "#7C3AED" }} />}
              sx={{
                fontWeight: 600,
                color: "#111827",
                "&.Mui-expanded": {
                  backgroundColor: "#f9fafb",
                },
              }}
            >
              {faq.question}
            </AccordionSummary>
            <AccordionDetails
              sx={{ color: "text.secondary", backgroundColor: "#fafafa" }}
            >
              {faq.answer}
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      {/* Footer */}
      <Footer />
    </Box>
  );
}
