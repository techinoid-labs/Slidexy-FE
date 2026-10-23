"use client";

import React, { useEffect, useRef, useState } from "react";
import { Box, Container, Typography } from "@mui/material";
import Link from "next/link";
import DriveFileRenameOutlineRounded from "@mui/icons-material/DriveFileRenameOutlineRounded";
import PaletteRounded from "@mui/icons-material/PaletteRounded";
import DashboardCustomizeRounded from "@mui/icons-material/DashboardCustomizeRounded";
import FileDownloadRounded from "@mui/icons-material/FileDownloadRounded";
import { HTMLSlideRenderer } from "@/app/components/editor/HTMLSlideRenderer";
import { TEMPLATES } from "@/templates/catalog";
import { templateToDeck } from "@/templates/toDeck";
import {
  ACCENT,
  Display,
  FigureRow,
  Hairline,
  INK,
  Lede,
  ListEntry,
  MONO,
  MUTED,
  RULE,
  SectionHead,
} from "./editorial";

/**
 * What you actually get.
 *
 * This section used to be a grid of five tool cards, four of which no longer
 * exist. More importantly it described the product instead of showing it.
 * Now it renders real slides from the catalogue through the real renderer:
 * if the templates are the strongest thing here, the page should be made of
 * them rather than of claims about them.
 */

// Three visually distinct templates, rendered live rather than screenshotted,
// so the page can never drift out of sync with what ships.
// Picked for contrast rather than convenience: a dark theme, a light one and
// a colour-led one, across three different categories. Three near-identical
// light business slides would undersell the range.
const SHOWCASE_IDS = ["investor-deck", "marketing-strategy", "product-launch"];

const SHOWCASE = SHOWCASE_IDS.map((id) => {
  const t = TEMPLATES.find((x) => x.id === id) ?? TEMPLATES[0];
  const deck = templateToDeck(t);
  return {
    id: t.id,
    name: t.name,
    category: t.category,
    theme: t.theme as any,
    // Slide 2 rather than the cover: covers lean on a background image, the
    // second slide shows the typography and layout work honestly.
    slide: (deck[1] ?? deck[0]) as any,
  };
});

/** Renders a 960x540 slide scaled to whatever width its container has. */
const SlideThumb: React.FC<{ slide: any; theme: any }> = ({ slide, theme }) => {
  const wrap = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.3);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const fit = () => setScale(el.clientWidth / 960);
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <Box
      ref={wrap}
      sx={{
        position: "relative",
        width: "100%",
        aspectRatio: "16 / 9",
        overflow: "hidden",
        border: `1px solid ${RULE}`,
        bgcolor: "#fff",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 960,
          height: 540,
          transformOrigin: "top left",
          transform: `scale(${scale})`,
          pointerEvents: "none",
        }}
      >
        <HTMLSlideRenderer slide={slide} theme={theme} isEditing={false} slideIndex={0} />
      </Box>
    </Box>
  );
};


export default function WhatWeOffer() {
  return (
    <Box component="section" sx={{ pt: { xs: 7, md: 9 }, pb: { xs: 8, md: 14 } }}>

      <Container maxWidth="lg">
        <SectionHead index="01" label="What you get" />

        {/* Asymmetric: heading left, supporting copy offset right. A centred
            heading with centred copy beneath is the default every template
            ships with. */}
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
            A template is a design<br />system, not a skin.
          </Display>
          <Lede sx={{ pb: 1 }}>
            Typography, colour, spacing and card treatment. Change any of
            it, on any slide.
          </Lede>
        </Box>

        {/* Live renders, not screenshots */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(3, 1fr)" },
            gap: { xs: 3, md: 4 },
            mb: { xs: 6, md: 9 },
          }}
        >
          {SHOWCASE.map((s) => (
            <Box key={s.id}>
              <SlideThumb slide={s.slide} theme={s.theme} />
              <Box sx={{ display: "flex", alignItems: "baseline", gap: 1.5, mt: 1.75 }}>
                <Typography
                  sx={{ fontFamily: MONO, fontSize: "0.68rem", color: ACCENT, letterSpacing: "0.1em", textTransform: "uppercase" }}
                >
                  {s.category}
                </Typography>
                <Typography sx={{ fontSize: "0.9rem", fontWeight: 600, color: INK }}>
                  {s.name}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>

        <FigureRow
          items={[
            { value: "10+", label: "Templates, each a full design system" },
            { value: "25", label: "Themes, swappable across a whole deck" },
            { value: "150", label: "Slide layouts built and ready" },
            { value: "33", label: "Block types, from stats to timelines" },
          ]}
          sx={{ mb: { xs: 6, md: 9 } }}
        />

        {/* Capabilities as a ruled list, not a card grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 2,
            alignItems: "start",
          }}
        >
          <Box>
            <Typography
              sx={{
                fontFamily: MONO,
                fontSize: "0.72rem",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: MUTED,
                mb: { xs: 1, md: 0 },
              }}
            >
              In the editor
            </Typography>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              columnGap: { md: 6 },
              borderTop: `1px solid ${RULE}`,
            }}
          >
            <ListEntry
              index="01"
              icon={<DriveFileRenameOutlineRounded />}
              title="Edit anything, in place"
              body="Headings, bullets, captions, icons, images. Click it and change it."
            />
            <ListEntry
              index="02"
              icon={<DashboardCustomizeRounded />}
              title="Move it, or let the layout hold it"
              body="Unlock any block and drag, resize or rotate it, with snapping."
            />
            <ListEntry
              index="03"
              icon={<PaletteRounded />}
              title="Restyle the whole deck at once"
              body="Switch theme and every slide follows. Your content never moves."
            />
            <ListEntry
              index="04"
              icon={<FileDownloadRounded />}
              title="Hand over a file people can edit"
              body="Real text boxes, native tables, charts with their own data."
              last
            />
          </Box>
        </Box>

        <Hairline sx={{ mt: { xs: 6, md: 9 }, mb: 3 }} />

        <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 3 }}>
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
              Browse all templates
            </Typography>
          </Link>
          <Link href="/tools/prompt-to-deck" style={{ textDecoration: "none" }}>
            <Typography
              component="span"
              sx={{
                fontSize: "0.95rem",
                color: MUTED,
                "&:hover": { color: INK },
                transition: "color 0.15s",
              }}
            >
              Start a deck &rarr;
            </Typography>
          </Link>
        </Box>
      </Container>
    </Box>
  );
}
