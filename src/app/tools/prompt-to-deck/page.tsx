import React from "react";
import type { Metadata } from "next";
import { Box, Container, Typography } from "@mui/material";
import PromptToDeck from "./components/promptToDeck";
import Header from "@/app/components/headers-navbar/Header";
import Footer from "@/app/components/home/Footer";
import FaqList from "@/app/components/home/FaqList";
import ComposeScene from "./components/ComposeScene";
import SpinCubes from "./components/SpinCubes";
import { ACCENT, BONE, BONE_DEEP, Display, INK, MONO, MUTED, SectionHead } from "@/app/components/home/editorial";

export const metadata: Metadata = {
  title: "Create a deck | Slidexy",
  description:
    "Describe what the deck is for and Slidexy writes the running order first, then the slides, then a PowerPoint file you can actually edit.",
  alternates: { canonical: "https://slidexy.ai/tools/prompt-to-deck" },
};

/**
 * Create a deck.
 *
 * The page was a centred headline over a tinted panel of dropdowns, then
 * seven stacked marketing sections: problem and solution, personas,
 * workflow steps, benefits, FAQ, related tools, call to action. Nobody
 * who came here to make a deck read any of it, and three of the related
 * tool links pointed at routes that no longer exist.
 *
 * What is left is the brief itself and a short answer to the question
 * people actually ask before they type anything: what happens next.
 */

const FAQS = [
  {
    q: "How much do I need to write?",
    a: "One line is enough. 'Q3 results for the board' will get you a sensible running order. The more you give it, the more specific the draft, but it is never a blank page problem.",
  },
  {
    q: "What happens after I press the button?",
    a: "You get the running order first, as a list you can rewrite, reorder or cut. Nothing is designed until you are happy with the structure, because that is where a deck is won or lost.",
  },
  {
    q: "Can I use my own document instead?",
    a: "Yes. Hand over a brief, a report, a transcript or an existing deck and it reads that instead of a prompt. It keeps your facts rather than inventing new ones.",
  },
  {
    q: "What do I get at the end?",
    a: "Slides you can edit down to the last caption, and a PowerPoint file with real text boxes, native tables and charts bound to their own data. Not one flat image per slide.",
  },
];

export default function Page() {
  return (
    <Box component="main" sx={{ bgcolor: BONE, minHeight: "100vh", overflowX: "clip" }}>
      <Header />

      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          minHeight: { md: "calc(100vh - 73px)" },
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          pt: { xs: 2, md: 4 },
          pb: { xs: 8, md: 10 },
        }}
      >
        <ComposeScene />
        <SpinCubes />

      <Box component="section" sx={{ position: "relative", zIndex: 1, pt: { xs: 4, md: 5.5 }, pb: { xs: 3, md: 4 } }}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: "center", maxWidth: 680, mx: "auto" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1.75,
                mb: { xs: 2, md: 2.75 },
              }}
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
                A sentence, an outline, a deck
              </Typography>
              <Box sx={{ width: 26, height: "1px", bgcolor: ACCENT, opacity: 0.45 }} />
            </Box>
            <Display sx={{ fontSize: { xs: "2.3rem", md: "3.6rem" } }}>
              Say it badly first.
            </Display>
            <Typography sx={{ fontSize: "1.02rem", color: MUTED, mt: 1.75 }}>
              We will hand you back a running order to argue with.
            </Typography>
          </Box>
        </Container>
      </Box>

      <Box sx={{ position: "relative", zIndex: 1 }}>
        <PromptToDeck />
      </Box>
      </Box>

      <Box component="section" sx={{ bgcolor: BONE_DEEP, py: { xs: 8, md: 11 } }}>
        <Container maxWidth="lg">
          <SectionHead index="01" label="Before you start" />

          <Box sx={{ mb: { xs: 4, md: 5 } }}>
            <Display>What happens next.</Display>
          </Box>

          <FaqList items={FAQS} />

          <Typography
            sx={{
              mt: 4,
              fontFamily: MONO,
              fontSize: "0.78rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#9A94A6",
            }}
          >
            No sign up for your first deck
          </Typography>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
