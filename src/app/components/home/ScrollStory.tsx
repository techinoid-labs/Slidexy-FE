"use client";

import React, { useEffect, useRef, useState } from "react";
import { Box, Container, Typography, useMediaQuery, useTheme } from "@mui/material";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { ACCENT, INK, MONO, MUTED, RULE } from "./editorial";

/**
 * The transformation.
 *
 * One object moves through the whole product in three beats: a sentence
 * becomes a running order, the running order becomes a deck. The sheet is
 * never swapped out, it changes shape, so the reader sees one thing turning
 * into another rather than three unrelated pictures.
 *
 * It plays on a timer rather than on scroll. Pinning three viewports of
 * height to drive an animation makes a page feel endless and takes the
 * scrollbar away from the reader, which is irritating the second time they
 * visit. It runs only while on screen, the step markers let someone drive
 * it by hand, and it holds still for anyone who has asked for reduced
 * motion.
 */

const BEATS = [
  {
    n: "01",
    title: "One sentence",
    body: "You write a line about what the deck is for. Nothing else is needed to start.",
  },
  {
    n: "02",
    title: "Becomes a running order",
    body: "Structure first, before anything is designed. Rewrite a line, drop a section, change the order.",
  },
  {
    n: "03",
    title: "Becomes a deck you own",
    body: "Slides you can edit down to the last caption, and a PowerPoint file with real objects inside it.",
  },
];

// Firm, quick curve. The previous one was slow enough that the sheet
// looked like it was thinking rather than changing.
const EASE = [0.33, 1, 0.5, 1] as const;

export default function ScrollStory() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.35 });

  const [beat, setBeat] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false);
  }, []);

  useEffect(() => {
    if (!inView || reduced) return;
    const id = setInterval(() => setBeat((b) => (b + 1) % BEATS.length), 3600);
    return () => clearInterval(id);
  }, [inView, reduced]);

  const b = BEATS[beat];
  const isDeck = beat === 2;

  if (!isDesktop) {
    return (
      <Box ref={ref} component="section" sx={{ position: "relative", py: 8 }}>
        <Container maxWidth="lg">
          {BEATS.map((x) => (
            <Box key={x.n} sx={{ py: 3, borderBottom: `1px solid ${RULE}` }}>
              <Typography sx={{ fontFamily: MONO, fontSize: "0.74rem", color: ACCENT, mb: 1 }}>
                {x.n}
              </Typography>
              <Typography
                sx={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.4rem",
                  fontWeight: 600,
                  color: INK,
                  mb: 1,
                }}
              >
                {x.title}
              </Typography>
              <Typography sx={{ fontSize: "0.95rem", color: MUTED, lineHeight: 1.6 }}>
                {x.body}
              </Typography>
            </Box>
          ))}
        </Container>
      </Box>
    );
  }

  return (
    <Box
      ref={ref}
      component="section"
      sx={{ position: "relative", pt: 4, pb: 7, overflow: "hidden" }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "0.82fr 1.18fr",
            gap: 8,
            alignItems: "center",
            minHeight: 352,
          }}
        >
          {/* Left: the beats, cross-fading in place */}
          <Box sx={{ position: "relative", pl: 4 }}>
            <Box sx={{ position: "absolute", left: 0, top: 6, bottom: 6, width: 2, bgcolor: RULE }}>
              <motion.div
                animate={{ scaleY: (beat + 1) / BEATS.length }}
                transition={{ duration: 0.6, ease: EASE }}
                style={{ transformOrigin: "top", width: "100%", height: "100%", background: ACCENT }}
              />
            </Box>

            <Box sx={{ minHeight: 238 }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={b.n}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.34, ease: EASE }}
                >
                  <Typography sx={{ fontFamily: MONO, fontSize: "0.74rem", color: ACCENT, mb: 2 }}>
                    {b.n} / 0{BEATS.length}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 600,
                      fontSize: "2.6rem",
                      lineHeight: 1.05,
                      letterSpacing: "-0.03em",
                      color: INK,
                      mb: 2,
                    }}
                  >
                    {b.title}
                  </Typography>
                  <Typography sx={{ fontSize: "1rem", lineHeight: 1.6, color: MUTED, maxWidth: 380 }}>
                    {b.body}
                  </Typography>
                </motion.div>
              </AnimatePresence>
            </Box>

            {/* Step markers: something to drive, not only watch */}
            <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
              {BEATS.map((x, i) => (
                <Box
                  key={x.n}
                  onClick={() => setBeat(i)}
                  role="button"
                  aria-label={`Show step ${x.n}`}
                  sx={{
                    width: 34,
                    height: 3,
                    cursor: "pointer",
                    bgcolor: i === beat ? ACCENT : RULE,
                    transition: "background 0.25s ease",
                    "&:hover": { bgcolor: i === beat ? ACCENT : "#C9C3D2" },
                  }}
                />
              ))}
            </Box>
          </Box>

          {/* Right: one sheet, changing shape */}
          <Box
            sx={{
              position: "relative",
              height: 360,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {[-1, 1].map((dir) => (
              <motion.div
                key={dir}
                animate={{
                  x: isDeck ? dir * 206 : 0,
                  rotate: isDeck ? dir * 7 : 0,
                  opacity: isDeck ? 1 : 0,
                }}
                transition={{ duration: 0.38, ease: EASE }}
                style={{
                  position: "absolute",
                  width: 296,
                  height: 296,
                  background: "#fff",
                  border: `1px solid ${RULE}`,
                }}
              >
                <Box sx={{ p: 2.5 }}>
                  <Box sx={{ height: 7, width: "62%", bgcolor: INK, opacity: 0.7, mb: 1.5 }} />
                  <Box sx={{ height: 4, width: "88%", bgcolor: INK, opacity: 0.2, mb: 0.9 }} />
                  <Box sx={{ height: 4, width: "74%", bgcolor: INK, opacity: 0.2, mb: 0.9 }} />
                  <Box sx={{ height: 4, width: "80%", bgcolor: INK, opacity: 0.2 }} />
                </Box>
              </motion.div>
            ))}

            <motion.div
              animate={{
                width: beat === 0 ? 460 : 300,
                height: beat === 0 ? 96 : 300,
                rotate: isDeck ? -7 : 0,
              }}
              transition={{ duration: 0.38, ease: EASE }}
              style={{
                position: "relative",
                background: "#fff",
                border: `1.5px solid ${INK}`,
                overflow: "hidden",
              }}
            >
              <AnimatePresence mode="wait">
                {beat === 0 && (
                  <motion.div
                    key="typing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    style={{ position: "absolute", inset: 0, padding: 24 }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 1.5 }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: 168 }}
                        transition={{ duration: 1.1, ease: "linear" }}
                        style={{ height: 6, background: INK, opacity: 0.8 }}
                      />
                      <motion.div
                        animate={{ opacity: [1, 1, 0, 0, 1] }}
                        transition={{ duration: 1, repeat: Infinity, times: [0, 0.45, 0.5, 0.95, 1] }}
                        style={{ width: 2, height: 18, background: ACCENT }}
                      />
                    </Box>
                    <Box sx={{ height: 4, width: 104, bgcolor: INK, opacity: 0.22, mt: 1.75 }} />
                  </motion.div>
                )}

                {beat === 1 && (
                  <motion.div
                    key="outline"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    style={{ position: "absolute", inset: 0, padding: 26 }}
                  >
                    {[150, 190, 128, 172, 142, 164].map((w, i) => (
                      <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.1 }}>
                        <Box sx={{ fontFamily: MONO, fontSize: 9, color: "#B4AEC0", width: 14 }}>
                          {String(i + 1).padStart(2, "0")}
                        </Box>
                        <motion.div
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ delay: 0.12 + i * 0.09, duration: 0.3, ease: EASE }}
                          style={{
                            transformOrigin: "left",
                            height: 5,
                            width: w,
                            background: INK,
                            opacity: 0.68,
                          }}
                        />
                      </Box>
                    ))}
                  </motion.div>
                )}

                {beat === 2 && (
                  <motion.div
                    key="slide"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25, delay: 0.15 }}
                    style={{ position: "absolute", inset: 0, padding: 24 }}
                  >
                    <Box sx={{ height: 9, width: "66%", bgcolor: ACCENT, mb: 2 }} />
                    <Box sx={{ height: 4, width: "90%", bgcolor: INK, opacity: 0.22, mb: 1 }} />
                    <Box sx={{ height: 4, width: "78%", bgcolor: INK, opacity: 0.22, mb: 2.5 }} />
                    <Box sx={{ display: "flex", gap: 1.25 }}>
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 + i * 0.09, duration: 0.3, ease: EASE }}
                          style={{ flex: 1 }}
                        >
                          <Box sx={{ height: 60, border: `1px solid ${RULE}`, p: 1 }}>
                            <Box sx={{ height: 10, width: "70%", bgcolor: ACCENT, opacity: 0.8, mb: 0.75 }} />
                            <Box sx={{ height: 3, width: "90%", bgcolor: INK, opacity: 0.16 }} />
                          </Box>
                        </motion.div>
                      ))}
                    </Box>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
