"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function FAQSection() {
  const [expanded, setExpanded] = useState<string[]>([]);

  const handleChange =
    (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded((prev) =>
        isExpanded ? [...prev, panel] : prev.filter((id) => id !== panel)
      );
    };

  const faqs = [
    {
      id: "q1",
      question: "What is the Slidexy?",
      answer:
        "SlideXy is an AI-powered presentation tool that helps users create well-designed, branded decks from text, voice, or video content.",
    },
    {
      id: "q2",
      question: "What is the AI Voice Assistant for presentations?",
      answer:
        "It converts spoken ideas into presentation slides automatically. You speak, SlideXy builds.",
    },
    {
      id: "q3",
      question: "Is there a free version available?",
      answer:
        "Yes. You can start with a free version that includes limited daily deck creation to try the platform before subscribing.",
    },
    {
      id: "q4",
      question: "Can I create a presentation from a video?",
      answer:
        "Yes. SlideXy supports generating slides from video sources like YouTube by analyzing and extracting content.",
    },
    {
      id: "q5",
      question: "Can I edit the generated slides?",
      answer:
        "Yes. Every slide deck is editable. You can adjust layout, text, images, and formatting.",
    },
    {
      id: "q6",
      question: "How fast can I create a presentation with this tool?",
      answer:
        "You can generate a fully structured and branded presentation in under five minutes using SlideXy’s AI.",
    },
  ];

  return (
    <Box
      sx={{
        maxWidth: 1116,
        mx: "auto",
        px: { xs: 2, sm: 4 },
        py: { xs: 4, sm: 6 },
      }}
    >
      {/* Title */}
      <Typography
        variant="h5"
        fontWeight={500}
        fontSize={40}
        gutterBottom
        sx={{ mb: 1, color: "#1A1A1A" }}
      >
        Frequently Asked Questions
      </Typography>

      {/* Subtitle */}
      <Typography variant="body2" sx={{ mb: 3, color: "#6D6D6D" }}>
        Alternative innovation network environmental whiteboard pursue for
        premier methods
      </Typography>

      {/* FAQs */}
      {faqs.map((faq) => (
        <Accordion
          key={faq.id}
          expanded={expanded.includes(faq.id)}
          onChange={handleChange(faq.id)}
          disableGutters
          sx={{
            boxShadow: "none",
            backgroundColor: "rgba(167, 139, 250, 0.04)",
            marginTop: "10px",

            borderRadius: "16px",
            "&:before": { display: "none" },
            ...(expanded.includes(faq.id) && {
              border: "1px solid #A78BFA",
              borderRadius: "16px",
              backgroundColor: "rgba(167, 139, 250, 0.04)",
            }),
          }}
        >
          <AccordionSummary
            expandIcon={
              <ExpandMoreIcon
                sx={{
                  color: expanded.includes(faq.id) ? "#7C3AED" : "inherit",
                }}
              />
            }
            sx={{
              typography: "subtitle1",
              fontWeight: expanded.includes(faq.id) ? 600 : 500,
              color: expanded.includes(faq.id) ? "#7C3AED" : "inherit",
              fontSize: "20px",
            }}
          >
            {faq.question}
          </AccordionSummary>
          {faq.answer && (
            <AccordionDetails sx={{ color: "text.secondary", fontSize: 14 }}>
              {faq.answer}
            </AccordionDetails>
          )}
        </Accordion>
      ))}
    </Box>
  );
}
