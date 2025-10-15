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
      answer: "Slidexy is an AI-powered presentation tool that helps you instantly turn your ideas into professional slides with minimal effort.",
    },
    {
      id: "q2",
      question: "What is the AI Voice Assistant for presentations?",
      answer:
        "You can chat with or send a voice note to the built-in AI assistant. It will follow your instructions—such as “make a pitch deck on renewable energy” or “add an infographic to slide 4”—and update your deck in real time.",
    },
    {
      id: "q3",
      question: "Is there a free version available?",
      answer: "Yes! Slidexy offers a free plan with basic features so you can try it out before upgrading to our premium plans for advanced functionality.",
    },
    {
      id: "q4",
      question: "Can I create a presentation from a video?",
      answer: "Yes! Just upload your video, and our AI will analyze its content to generate a tailored presentation complete with slides, images, and text.",
    },
    {
      id: "q5",
      question: "Can I edit the generated slides?",
      answer: "Yes, absolutely! While AI generates the initial draft, you can fully edit, style, and personalize slides to match your needs.",
    },
    {
      id: "q6",
      question: "How fast can I create a presentation with this tool?",
      answer: "With Slidexy, you can create a complete presentation in just a few minutes, depending on the complexity of your content and the number of slides you need.",
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
                sx={{ color: expanded.includes(faq.id) ? "#7C3AED" : "inherit" }}
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
