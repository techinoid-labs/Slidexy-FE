"use client";

import React from "react";
import { Box, Container, Typography } from "@mui/material";
import Link from "next/link";
import { TEMPLATES } from "@/templates/catalog";
import { ACCENT, BONE_DEEP, Display, Hairline, INK, Lede, MONO, MUTED, RULE, SectionHead } from "./editorial";
import Lottie from "lottie-react";
import templateAnimation from "@/json/Gif8-template-section.json";
import { EditDrawing } from "./illustrations";

/**
 * Templates.
 *
 * The old version had a card reading "AI Popular Templates" next to a Lottie
 * of tilted slide thumbnails that were not even made with this product.
 * Advertising someone else's work is a bad idea generally and a worse one
 * while your own templates are being redesigned.
 *
 * So this names the real templates, pulled from the catalogue so the list
 * cannot go stale, and uses a drawing instead of a screenshot.
 */

// Real catalogue data. If a template is added, this list grows by itself.
const ROWS = TEMPLATES.map((t) => ({
  id: t.id,
  name: t.name,
  category: t.category,
  slides: t.slides.length,
  mode: (t.theme as any)?.mode === "dark" ? "Dark" : "Light",
}));


export default function PresentationStyle() {
  return (
    <Box component="section" sx={{ bgcolor: BONE_DEEP, py: { xs: 8, md: 10 } }}>

      <Container maxWidth="lg">
        <SectionHead index="03" label="Templates" />

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
            Starting points,<br />none of them generic.
          </Display>
          <Lede sx={{ pb: 1 }}>
            Each one is a different design system, not a recolour of the same
            one. Pick a template, or switch later. Your content stays where it
            is while everything around it changes.
          </Lede>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.15fr 0.85fr" },
            gap: { xs: 5, md: 8 },
            alignItems: "start",
          }}
        >
          {/* The catalogue, as a list you can read rather than cards */}
          <Box sx={{ borderTop: `1px solid ${INK}` }}>
            {ROWS.map((r) => (
              <Box
                key={r.id}
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto auto",
                  alignItems: "baseline",
                  gap: 2,
                  py: 1.6,
                  // Pulled out past the text on both sides so the hover
                  // reads as a row, not as a box around the name.
                  px: 2,
                  mx: -2,
                  borderBottom: `1px solid ${RULE}`,
                  transition: "background 0.12s ease",
                  "&:hover": { bgcolor: "#fff" },
                }}
              >
                <Typography sx={{ fontSize: "1rem", fontWeight: 600, color: INK }}>
                  {r.name}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: MONO,
                    fontSize: "0.68rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: MUTED,
                  }}
                >
                  {r.category}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: MONO,
                    fontSize: "0.72rem",
                    color: "#A9A3B4",
                    minWidth: 84,
                    textAlign: "right",
                  }}
                >
                  {r.slides} slides · {r.mode}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Right: what you can do once a template is on the page */}
          <Box>
            <Box sx={{ border: `1px solid ${RULE}`, bgcolor: "#fff", p: { xs: 2, md: 3 } }}>
              <EditDrawing />
            </Box>

            {/* Shows a deck changing theme, which is the claim this
                section makes and the one thing a still cannot carry. */}
            <Typography
              sx={{
                fontFamily: MONO,
                fontSize: "0.68rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: MUTED,
                mt: 3,
                mb: 1.5,
              }}
            >
              The same deck, restyled
            </Typography>
            <Box sx={{ border: `1px solid ${RULE}`, bgcolor: "#fff", height: 240, overflow: "hidden" }}>
              <Lottie
                animationData={templateAnimation}
                loop
                autoplay
                style={{ width: "100%", height: "100%", display: "block" }}
              />
            </Box>

            <Typography
              sx={{
                fontFamily: MONO,
                fontSize: "0.68rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: MUTED,
                mt: 2,
                mb: 1.25,
              }}
            >
              A template is a starting point, not a cage
            </Typography>
            <Typography sx={{ fontSize: "0.95rem", lineHeight: 1.6, color: MUTED }}>
              The layout holds everything in place so a long deck stays
              consistent. Unlock any single block and it comes out of the flow,
              ready to drag, resize or rotate, snapping to every other element
              on the slide. Put it back whenever you want.
            </Typography>
          </Box>
        </Box>

        <Hairline sx={{ mt: { xs: 5, md: 7 }, mb: 3 }} />

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, alignItems: "center" }}>
          <Link href="/templates" style={{ textDecoration: "none" }}>
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
              See every template
            </Typography>
          </Link>
          <Typography sx={{ fontSize: "0.88rem", color: "#9A94A6" }}>
            Plus 25 themes, each swappable across a whole deck in one click.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
