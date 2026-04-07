"use client";

import {
  Box,
  Typography,
  Container,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface FAQItem {
  question: string;
  answer: string;
}

interface ContextualFAQProps {
  title?: string;
  subtitle?: string;
  faqs: FAQItem[];
}

export default function ContextualFAQ({
  title = "Frequently Asked Questions",
  subtitle = "Everything you need to know about this tool.",
  faqs,
}: ContextualFAQProps) {
  return (
    <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: "#fff" }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, mb: 2, color: "#111827" }}
          >
            {title}
          </Typography>
          <Typography
            sx={{ color: "text.secondary", fontSize: "1.1rem" }}
          >
            {subtitle}
          </Typography>
        </Box>
        <Box sx={{ maxWidth: 800, mx: "auto" }}>
          {faqs.map((faq, index) => (
            <Accordion
              key={index}
              sx={{
                mb: 2,
                boxShadow: "none",
                border: "1px solid #E5E7EB",
                borderRadius: "12px !important",
                "&:before": { display: "none" },
                overflow: "hidden",
                "&.Mui-expanded": {
                  border: "1px solid #7C3AED",
                },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: "#7C3AED" }} />}
                sx={{
                  fontWeight: 600,
                  color: "#111827",
                  py: 1,
                  "&.Mui-expanded": {
                    bgcolor: "rgba(124, 58, 237, 0.02)",
                  },
                }}
              >
                {faq.question}
              </AccordionSummary>
              <AccordionDetails
                sx={{
                  color: "text.secondary",
                  lineHeight: 1.6,
                  fontSize: "0.95rem",
                  bgcolor: "rgba(124, 58, 237, 0.02)",
                }}
              >
                {faq.answer}
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
