"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Container,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const faqs = [
  {
    question: "What is SlideXY?",
    answer:
      "SlideXY is an AI-powered presentation maker that helps you create professional slide decks in seconds. Simply input your topic, prompt, or content, and our AI generates beautifully designed slides instantly.",
  },
  {
    question: "Do I need design skills to use SlideXY?",
    answer:
      "No, you do not need any design skills. SlideXY takes care of the layout, structure, and design for you, so you can focus purely on your message. It's built for everyone from startup founders to educators.",
  },
  {
    question: "Can I export my presentations?",
    answer:
      "Yes! You can export your generated presentations to popular formats like PPTX and PDF, making it easy to share them with your team, clients, or audience.",
  },
  {
    question: "Is there a free version available?",
    answer:
      "We offer a free version so you can try out our core AI presentation generation features without any commitment. When you're ready for advanced features, you can upgrade to one of our affordable premium plans.",
  },
  {
    question: "How does SlideXY compare to tools like Gamma or Canva?",
    answer:
      "SlideXY is uniquely focused on presentation generation speed and regional pricing accessibility. While tools like Canva are broad graphic design suites, SlideXY offers an uncluttered, hyper-focused presentation generation experience designed to be highly affordable.",
  },
];

export default function FAQSection() {
  const [expanded, setExpanded] = useState<number | false>(0);

  const handleChange =
    (panel: number) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  return (
    <Box sx={{ py: { xs: 8, md: 12 }, backgroundColor: "#F9F9FB" }}>
      <Container maxWidth="md">
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: "28px", md: "40px" },
              fontWeight: 700,
              color: "#222",
              mb: 2,
            }}
          >
            Frequently Asked Questions
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "#666", fontSize: { xs: "16px", md: "18px" } }}
          >
            Everything you need to know about SlideXY and how it works.
          </Typography>
        </Box>

        <Box>
          {faqs.map((faq, index) => (
            <Accordion
              key={index}
              expanded={expanded === index}
              onChange={handleChange(index)}
              sx={{
                mb: 2,
                boxShadow: "none",
                "&:before": { display: "none" },
                border: "1px solid #EAEAEA",
                borderRadius: "8px !important",
                overflow: "hidden",
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: "#6C2BD7" }} />}
                sx={{
                  backgroundColor: expanded === index ? "#F3F0FF" : "#FFF",
                  px: 3,
                  py: 1,
                  "& .MuiAccordionSummary-content": {
                    my: 1,
                  },
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 600,
                    fontSize: "18px",
                    color: expanded === index ? "#6C2BD7" : "#333",
                  }}
                >
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 3, py: 3, backgroundColor: "#FFF" }}>
                <Typography sx={{ color: "#555", lineHeight: 1.6 }}>
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Container>
    </Box>
  );
}