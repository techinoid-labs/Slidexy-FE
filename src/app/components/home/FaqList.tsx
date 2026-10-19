"use client";

import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { ACCENT, INK, MONO, MUTED, RULE } from "./editorial";

/**
 * Questions, as a ruled list.
 *
 * Not MUI's Accordion: that arrives with its own card, its own shadow,
 * its own radius and a chevron, none of which belong on a page built out
 * of hairlines. This is a numbered list where a row opens in place.
 *
 * One answer open at a time. A page of accordions all hanging open is
 * just a page of text with extra clicks in front of it, and the point of
 * collapsing them is that the questions stay scannable.
 */

export type Faq = { q: string; a: string };

export default function FaqList({ items }: { items: Faq[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Box sx={{ borderTop: `1px solid ${INK}` }}>
      {items.map((f, i) => {
        const isOpen = open === i;
        return (
          <Box key={f.q} sx={{ borderBottom: `1px solid ${RULE}` }}>
            <Box
              component="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              sx={{
                width: "100%",
                display: "grid",
                gridTemplateColumns: "auto 1fr auto",
                alignItems: "baseline",
                gap: 2.5,
                px: 0,
                py: 2.4,
                border: "none",
                background: "none",
                textAlign: "left",
                cursor: "pointer",
                fontFamily: "inherit",
                color: INK,
                "&:hover .q": { color: ACCENT },
              }}
            >
              <Typography
                sx={{ fontFamily: MONO, fontSize: "0.72rem", color: isOpen ? ACCENT : "#A9A3B4" }}
              >
                {String(i + 1).padStart(2, "0")}
              </Typography>

              <Typography
                className="q"
                sx={{
                  fontSize: "1.05rem",
                  fontWeight: 600,
                  color: INK,
                  transition: "color 0.15s ease",
                }}
              >
                {f.q}
              </Typography>

              {/* A plus that becomes a minus. One bar turns, which is
                  cheaper and calmer than swapping an icon. */}
              <Box sx={{ position: "relative", width: 13, height: 13, mt: "4px" }}>
                <Box
                  sx={{
                    position: "absolute",
                    top: 6,
                    left: 0,
                    width: 13,
                    height: 1.5,
                    bgcolor: isOpen ? ACCENT : INK,
                  }}
                />
                <Box
                  component={motion.div}
                  animate={{ rotate: isOpen ? 0 : 90 }}
                  transition={{ duration: 0.22, ease: [0.33, 1, 0.5, 1] }}
                  sx={{
                    position: "absolute",
                    top: 6,
                    left: 0,
                    width: 13,
                    height: 1.5,
                    bgcolor: isOpen ? ACCENT : INK,
                  }}
                />
              </Box>
            </Box>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="a"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.26, ease: [0.33, 1, 0.5, 1] }}
                  style={{ overflow: "hidden" }}
                >
                  <Typography
                    sx={{
                      pl: { xs: 0, sm: "44px" },
                      pr: { sm: 6 },
                      pb: 3,
                      fontSize: "0.98rem",
                      lineHeight: 1.65,
                      color: MUTED,
                      maxWidth: 640,
                    }}
                  >
                    {f.a}
                  </Typography>
                </motion.div>
              )}
            </AnimatePresence>
          </Box>
        );
      })}
    </Box>
  );
}
