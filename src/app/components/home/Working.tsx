"use client";

import React from "react";
import { Box, Container, Typography } from "@mui/material";
import Link from "next/link";
import {
  ACCENT,
  Display,
  Hairline,
  INK,
  Lede,
  MONO,
  MUTED,
  RULE,
  SectionHead,
} from "./editorial";
import Gutter, { WORKING_GUTTER } from "./Gutter";

/**
 * How it works.
 *
 * The old version leaned on animated Lottie files and a purple glow. This
 * uses one drawing that carries the whole argument, because the argument is
 * visual: a sentence has one line of structure, an outline has six, a deck
 * has a grid. Showing that growth is more convincing than describing it.
 */

const STEPS = [
  {
    n: "01",
    title: "Say what it is about",
    body:
      "A sentence is enough. If you have more, give it more: a brief, a report, a link, a transcript. It reads whatever you hand it.",
    note: "Takes about ten seconds",
  },
  {
    n: "02",
    title: "Argue with the outline",
    body:
      "Before anything gets designed you see the running order. Rewrite a line, drop a section, reorder the middle. This is where a deck is won or lost, so it happens first.",
    note: "The step most tools skip",
  },
  {
    n: "03",
    title: "Take the file",
    body:
      "Pick a template, edit anything you want on the slides themselves, then export. PowerPoint gets real text boxes and tables, not a flat picture.",
    note: "Yours to keep and change",
  },
];


export default function Working() {
  return (
    <Box
      id="how-it-works"
      component="section"
      sx={{ position: "relative", overflow: "hidden", py: { xs: 8, md: 14 } }}
    >
      <Gutter items={WORKING_GUTTER} />

      <Container maxWidth="lg" sx={{ position: "relative" }}>
        <SectionHead index="04" label="How it works" />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.25fr 1fr" },
            gap: { xs: 3, md: 8 },
            alignItems: "end",
            mb: { xs: 5, md: 7 },
          }}
        >
          <Display>
            Three steps, and<br />you can stop at any of them.
          </Display>
          <Lede sx={{ pb: 1 }}>
            Some people take the outline and build the deck themselves. Some
            take the first draft and present it. Both are fine. Nothing here
            locks you into finishing the way it started.
          </Lede>
        </Box>

        {/* Steps as three ruled columns rather than three floating cards */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
            borderTop: `1px solid ${INK}`,
          }}
        >
          {STEPS.map((s, i) => (
            <Box
              key={s.n}
              sx={{
                pt: 3,
                pb: { xs: 3, md: 4 },
                pr: { md: 4 },
                pl: { md: i === 0 ? 0 : 4 },
                borderBottom: { xs: `1px solid ${RULE}`, md: "none" },
                borderRight: { xs: "none", md: i < 2 ? `1px solid ${RULE}` : "none" },
              }}
            >
              <Typography
                sx={{ fontFamily: MONO, fontSize: "0.78rem", color: ACCENT, mb: 2 }}
              >
                {s.n}
              </Typography>
              <Typography
                sx={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.3rem",
                  fontWeight: 600,
                  color: INK,
                  letterSpacing: "-0.015em",
                  mb: 1.25,
                }}
              >
                {s.title}
              </Typography>
              <Typography sx={{ fontSize: "0.95rem", lineHeight: 1.6, color: MUTED, mb: 2 }}>
                {s.body}
              </Typography>
              <Typography
                sx={{
                  fontFamily: MONO,
                  fontSize: "0.68rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#A9A3B4",
                }}
              >
                {s.note}
              </Typography>
            </Box>
          ))}
        </Box>

        <Hairline sx={{ mt: { xs: 4, md: 6 }, mb: 3 }} />

        <Link href="/tools/prompt-to-deck" style={{ textDecoration: "none" }}>
          <Typography
            component="span"
            sx={{
              fontSize: "0.95rem",
              fontWeight: 600,
              color: INK,
              borderBottom: `2px solid ${ACCENT}`,
              pb: 0.25,
              "&:hover": { color: ACCENT },
              transition: "color 0.15s",
            }}
          >
            Try it with your own topic
          </Typography>
        </Link>
      </Container>
    </Box>
  );
}
