"use client";

import React from "react";
import { Box, Container, Typography } from "@mui/material";
import Link from "next/link";
import { motion } from "framer-motion";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import { ACCENT, INK, MONO } from "./editorial";
import { ExportDrawing } from "./illustrations";

/**
 * Closing call to action.
 *
 * Was a dark panel with a purple glow and the line "Experience the future
 * first", which says nothing and sounds like every other AI product. A
 * closing section should restate the one thing worth remembering and then
 * get out of the way.
 */

export default function Community() {
  return (
    <Box component="section" sx={{ pb: { xs: 8, md: 14 } }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            bgcolor: INK,
            color: "#fff",
            px: { xs: 3, md: 7 },
            py: { xs: 5, md: 7 },
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.1fr 0.9fr" },
            gap: { xs: 4, md: 7 },
            alignItems: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Glass panels drifting behind the content.

              Kept rectangular and slow on purpose. Blurred circular blobs
              are the stock "AI product" background and were removed from
              this site earlier; hard-edged panes at a shallow angle read
              as material rather than atmosphere, and they only appear on
              this one dark band so they stay an accent. */}
          {[
            { w: 300, h: 190, top: -60, left: -70, rot: -14, dur: 19, delay: 0 },
            { w: 210, h: 140, bottom: -50, left: "32%", rot: 10, dur: 23, delay: 1.5 },
            { w: 260, h: 170, top: -40, right: -60, rot: 16, dur: 21, delay: 0.8 },
          ].map((g, i) => (
            <Box
              key={i}
              component={motion.div}
              aria-hidden
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: [0, -14, 0], x: [0, 8, 0] }}
              transition={{
                opacity: { duration: 1.2, delay: g.delay },
                y: { duration: g.dur, repeat: Infinity, ease: "easeInOut", delay: g.delay },
                x: { duration: g.dur * 1.3, repeat: Infinity, ease: "easeInOut", delay: g.delay },
              }}
              sx={{
                position: "absolute",
                width: g.w,
                height: g.h,
                top: g.top,
                bottom: g.bottom,
                left: g.left,
                right: g.right,
                transform: `rotate(${g.rot}deg)`,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.12)",
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
                pointerEvents: "none",
                display: { xs: "none", md: "block" },
              }}
            />
          ))}

          <Box sx={{ position: "relative", zIndex: 1 }}>
            <Typography
              sx={{
                fontFamily: MONO,
                fontSize: "0.7rem",
                letterSpacing: "0.17em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.55)",
                mb: 2.5,
              }}
            >
              One deck, no account
            </Typography>

            <Typography
              sx={{
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: { xs: "1.9rem", md: "2.7rem" },
                lineHeight: 1.05,
                letterSpacing: "-0.025em",
                mb: 2,
              }}
            >
              Build one and see
              <Box component="span" sx={{ display: "block", fontStyle: "italic", color: "#C9A6F2" }}>
                if it holds up.
              </Box>
            </Typography>

            <Typography
              sx={{
                fontSize: "1rem",
                lineHeight: 1.6,
                color: "rgba(255,255,255,0.7)",
                maxWidth: 420,
                mb: 4,
              }}
            >
              Bring what you are presenting next week. A test topic proves
              nothing.
            </Typography>

            <Link href="/tools/prompt-to-deck" style={{ textDecoration: "none" }}>
              <Box
                component="span"
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 1.25,
                  bgcolor: "#fff",
                  color: INK,
                  px: 3,
                  py: 1.6,
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  transition: "background 0.15s ease, color 0.15s ease",
                  "&:hover": { bgcolor: ACCENT, color: "#fff" },
                }}
              >
                Start a deck
                <ArrowForwardRounded />
              </Box>
            </Link>
          </Box>

          {/* The drawing restates the differentiator without a screenshot */}
          <Box
            sx={{
              display: { xs: "none", md: "block" },
              "& svg line, & svg rect, & svg path": { stroke: "rgba(255,255,255,0.75)" },
              "& svg rect[fill]:not([fill='none'])": { fill: "#C9A6F2" },
            }}
          >
            <ExportDrawing />
            <Box sx={{ display: "flex", justifyContent: "space-around", mt: 1 }}>
              <Typography sx={{ fontFamily: MONO, fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)" }}>
                Everyone else
              </Typography>
              <Typography sx={{ fontFamily: MONO, fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#C9A6F2" }}>
                Slidexy
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
