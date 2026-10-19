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
    question: "How can I create a presentation using AI for free?",
    answer:
      "You can create a presentation using an AI presentation maker by simply entering your topic or text. The tool automatically generates structured slides within seconds, saving time and effort.",
  },
  {
    question: "What is the best free AI presentation maker online?",
    answer:
      "The best AI presentation maker should be fast, easy to use, and require minimal input. Tools like Slidexy.ai allow users to generate professional slides instantly without complex design skills.",
  },
  {
    question: "Can I convert text into PowerPoint slides automatically?",
    answer:
      "Yes, AI tools can convert plain text into fully designed PowerPoint slides. Just paste your content, and the AI will organize it into headings, bullet points, and visuals.",
  },
  {
    question: "Is there an AI tool that creates slides without signup?",
    answer:
      "Yes, some AI presentation tools allow users to generate a few slides without signing up. This helps users test the tool before creating an account.",
  },
  {
    question: "How does an AI PPT generator work?",
    answer:
      "An AI PPT generator analyzes your input text, understands the context, and transforms it into a well-structured presentation with relevant formatting and layout.",
  },
    {
    question: "Can students use AI tools to make presentations easily?",
    answer:
      "Yes, students can use AI presentation makers to quickly create assignments, project slides, and class presentations without spending hours on design.",
  },
      {
    question: "Are AI-generated presentations customizable?",
    answer:
      "Yes, most AI-generated presentations can be edited. You can customize text, design, colors, and layout according to your needs.",
  },
        {
    question: "Is it safe to use AI tools for presentations?",
    answer:
      "Yes, reliable AI presentation tools are safe to use. Always ensure you are using a trusted platform and avoid sharing sensitive information.",
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