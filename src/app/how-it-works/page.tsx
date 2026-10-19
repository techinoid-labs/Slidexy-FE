import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Box, Container, Typography } from "@mui/material";
import Header from "@/app/components/headers-navbar/Header";
import Footer from "@/app/components/home/Footer";
import Journey from "./Journey";
import { ACCENT, BONE, Display, INK, MONO, MUTED } from "@/app/components/home/editorial";

export const metadata: Metadata = {
  title: "How it works | Slidexy",
  description:
    "The whole route from one sentence to a PowerPoint file you can edit: the brief, the running order, the argument, the slides, the file.",
  alternates: { canonical: "https://slidexy.ai/how-it-works" },
};

/**
 * How it works.
 *
 * Most process pages are four numbered cards in a row, which tells you
 * there are four steps and nothing else. This one is a map you travel,
 * because the thing worth understanding about this product is not what
 * the steps are called, it is that the order is deliberate: you are
 * made to settle the structure before a single slide is designed, and
 * the trip makes that obvious in a way a list cannot.
 */

export default function Page() {
  return (
    <Box component="main" sx={{ bgcolor: BONE, overflowX: "clip" }}>
      <Header />

      <Box component="section" sx={{ pt: { xs: 7, md: 11 }, pb: { xs: 5, md: 8 } }}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: "center", maxWidth: 700, mx: "auto" }}>
            <Box
              sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1.75, mb: { xs: 2, md: 2.75 } }}
            >
              <Box sx={{ width: 26, height: "1px", bgcolor: ACCENT, opacity: 0.45 }} />
              <Typography
                component="span"
                sx={{
                  fontFamily: MONO,
                  fontSize: "0.72rem",
                  letterSpacing: "0.17em",
                  textTransform: "uppercase",
                  color: ACCENT,
                }}
              >
                Six stops, one route
              </Typography>
              <Box sx={{ width: 26, height: "1px", bgcolor: ACCENT, opacity: 0.45 }} />
            </Box>
            <Display sx={{ fontSize: { xs: "2.2rem", md: "3.4rem" } }}>Watch a sentence become a deck.</Display>
            <Typography sx={{ fontSize: "1.02rem", color: MUTED, mt: 2 }}>
              Not a list of features. The actual route, in order, including the part where you change your mind.
            </Typography>
          </Box>
        </Container>
      </Box>

      <Journey />

      <Box component="section" sx={{ bgcolor: INK, py: { xs: 8, md: 12 } }}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: "center" }}>
            <Display sx={{ color: "#FFFFFF", fontSize: { xs: "2rem", md: "3rem" } }}>
              That is the whole of it.
            </Display>
            <Typography sx={{ color: "rgba(255,255,255,0.68)", fontSize: "1.02rem", mt: 2, mb: 4.5 }}>
              The first deck does not need an account.
            </Typography>
            <Box
              component={Link}
              href="/tools/prompt-to-deck"
              sx={{
                display: "inline-block",
                px: 4,
                py: 1.6,
                bgcolor: "#FFFFFF",
                color: INK,
                fontSize: "1rem",
                fontWeight: 600,
                textDecoration: "none",
                transition: "background-color 0.15s ease, color 0.15s ease",
                "&:hover": { bgcolor: ACCENT, color: "#FFFFFF" },
              }}
            >
              Start with a sentence →
            </Box>
          </Box>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
