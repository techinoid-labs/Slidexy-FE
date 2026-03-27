"use client"
import React from "react";
import { Box, Typography } from "@mui/material";
import ComingSoonPage from "../components/coming-soon/ComingSoon";
import Header from "../components/headers-navbar/Header";

export default function Features() {
  return (
    <>
      <Header />
      {/* SEO H1 + Intro — visible above the ComingSoon component */}
      <Box
        sx={{
          textAlign: "center",
          pt: { xs: 6, md: 10 },
          px: { xs: 3, md: 6 },
          maxWidth: 720,
          mx: "auto",
        }}
      >
        <Typography
          component="h1"
          sx={{
            fontWeight: 700,
            fontSize: { xs: "1.75rem", md: "2.5rem" },
            color: "#111827",
            mb: 2,
          }}
        >
          AI-Powered Presentation Features
        </Typography>
        <Typography
          sx={{
            color: "text.secondary",
            fontSize: { xs: "0.95rem", md: "1.1rem" },
            lineHeight: 1.7,
          }}
        >
          SlideXY is built to make presentation creation effortless. From
          AI-generated slide layouts and auto-designed templates to
          voice-to-deck conversion and real-time collaboration, every
          feature is designed to save you hours of manual work. Explore
          what is available now and what is coming next as we continue to
          expand the platform.
        </Typography>
      </Box>
      <ComingSoonPage />
    </>
  );
}
