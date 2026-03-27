"use client"
import React from "react";
import { Box, Typography } from "@mui/material";
import ComingSoonPage from "../components/coming-soon/ComingSoon";
import Header from "../components/headers-navbar/Header";

export default function Product() {
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
          SlideXY AI Presentation Platform
        </Typography>
        <Typography
          sx={{
            color: "text.secondary",
            fontSize: { xs: "0.95rem", md: "1.1rem" },
            lineHeight: 1.7,
          }}
        >
          SlideXY transforms how teams create presentations. Paste a
          prompt, upload a video, or drop in a website link and our AI
          builds polished, on-brand slide decks in seconds. Designed for
          startup founders, sales teams, educators, and anyone who needs
          professional presentations without the design overhead. Discover
          how our platform works and what makes it different.
        </Typography>
      </Box>
      <ComingSoonPage />
    </>
  );
}
