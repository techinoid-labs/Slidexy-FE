"use client";

import React from "react";
import { Box, Typography } from "@mui/material";

/**
 * Shared editorial primitives for the marketing site.
 *
 * THE IDEA
 *
 * Slidexy makes presentations. So the site should look like a well-made
 * document, not like every other AI SaaS landing page. That means the page
 * itself is the proof, which is an argument no competitor's generic template
 * site can make.
 *
 * What that rules out, deliberately:
 *   - centred pill badges above every heading
 *   - three-column grids of rounded cards with soft drop shadows
 *   - icons sitting inside tinted rounded squares
 *   - gradient text, glow orbs, sparkle marks
 *   - everything centred
 *
 * What it uses instead, taken from how printed editorial actually works:
 *   - numbered sections with a rule, repeated identically throughout
 *   - hairline rules and whitespace for structure instead of boxes
 *   - a hard scale jump between display type and metadata, nothing in between
 *   - monospace for numbers and labels, so figures read as data
 *   - left alignment and an asymmetric grid
 *   - two colours only: ink and one accent
 */

export const INK = "#0F0A19";
export const MUTED = "#6B6478";
export const FAINT = "#9A94A6";
export const RULE = "#E4E1EA";
export const ACCENT = "#8E2DE2";

/** Monospace, for figures, labels and anything that should read as data. */
export const MONO = '"IBM Plex Mono", "SF Mono", Consolas, monospace';

/**
 * The signature device, repeated on every section.
 *
 * A two-digit number, a rule, and a label in tracked small caps. It appears
 * identically throughout, which is what makes a set of sections read as one
 * document rather than a stack of unrelated blocks.
 */
export const SectionHead: React.FC<{
  index: string;
  label: string;
  sx?: object;
}> = ({ index, label, sx = {} }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: { xs: 3, md: 4 }, ...sx }}>
    <Typography
      component="span"
      sx={{ fontFamily: MONO, fontSize: "0.78rem", fontWeight: 500, color: ACCENT, letterSpacing: "0.04em" }}
    >
      {index}
    </Typography>
    <Box sx={{ width: 28, height: 1, bgcolor: ACCENT, flexShrink: 0 }} />
    <Typography
      component="span"
      sx={{
        fontFamily: MONO,
        fontSize: "0.72rem",
        fontWeight: 500,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        color: MUTED,
      }}
    >
      {label}
    </Typography>
  </Box>
);

/**
 * Display heading. Deliberately large.
 *
 * The research into professionally designed decks turned up one consistent
 * property: a hard jump between display type and everything else, with no
 * middle sizes. A timid 1.6x heading is the clearest signal that a layout
 * was assembled rather than designed.
 */
export const Display: React.FC<React.PropsWithChildren<{ sx?: object }>> = ({ children, sx = {} }) => (
  <Typography
    component="h2"
    sx={{
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: { xs: "2rem", sm: "2.6rem", md: "3.4rem" },
      lineHeight: 1.06,
      letterSpacing: "-0.035em",
      color: INK,
      maxWidth: 880,
      ...sx,
    }}
  >
    {children}
  </Typography>
);

/** Body copy. One size, one colour, never more than ~62 characters a line. */
export const Lede: React.FC<React.PropsWithChildren<{ sx?: object }>> = ({ children, sx = {} }) => (
  <Typography
    sx={{ fontSize: "1.02rem", lineHeight: 1.65, color: MUTED, maxWidth: 560, ...sx }}
  >
    {children}
  </Typography>
);

/** A full-width hairline. Structure without a box. */
export const Hairline: React.FC<{ sx?: object }> = ({ sx = {} }) => (
  <Box sx={{ height: 1, bgcolor: RULE, ...sx }} />
);

/**
 * A row of figures, separated by rules rather than enclosed in cards.
 *
 * Numbers set in monospace at a large size read as measured facts. The same
 * numbers inside tinted rounded cards read as marketing.
 */
export const FigureRow: React.FC<{
  items: { value: string; label: string }[];
  sx?: object;
}> = ({ items, sx = {} }) => (
  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: { xs: "1fr 1fr", md: `repeat(${items.length}, 1fr)` },
      borderTop: `1px solid ${RULE}`,
      ...sx,
    }}
  >
    {items.map((it, i) => (
      <Box
        key={it.label}
        sx={{
          py: { xs: 2.5, md: 3.5 },
          pr: 3,
          borderBottom: `1px solid ${RULE}`,
          borderRight: {
            xs: i % 2 === 0 ? `1px solid ${RULE}` : "none",
            md: i < items.length - 1 ? `1px solid ${RULE}` : "none",
          },
          pl: { xs: i % 2 === 0 ? 0 : 3, md: i === 0 ? 0 : 3 },
        }}
      >
        <Typography
          sx={{
            fontFamily: MONO,
            fontSize: { xs: "1.7rem", md: "2.3rem" },
            fontWeight: 500,
            color: INK,
            lineHeight: 1,
            letterSpacing: "-0.03em",
          }}
        >
          {it.value}
        </Typography>
        <Typography
          sx={{
            mt: 1.25,
            fontSize: "0.82rem",
            color: MUTED,
            lineHeight: 1.45,
            maxWidth: 190,
          }}
        >
          {it.label}
        </Typography>
      </Box>
    ))}
  </Box>
);

/**
 * A numbered list item with a thin icon.
 *
 * No tinted rounded square behind the icon. That container is the single
 * most repeated shape on the modern web, and removing it is most of what
 * makes a feature list stop looking templated.
 */
export const ListEntry: React.FC<{
  index: string;
  icon: React.ReactNode;
  title: string;
  body: string;
  last?: boolean;
}> = ({ index, icon, title, body, last = false }) => (
  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: { xs: "auto 1fr", md: "56px 32px 1fr" },
      gap: { xs: 2, md: 0 },
      alignItems: "start",
      py: { xs: 3, md: 3.5 },
      borderBottom: last ? "none" : `1px solid ${RULE}`,
    }}
  >
    <Typography
      sx={{
        fontFamily: MONO,
        fontSize: "0.78rem",
        color: FAINT,
        pt: 0.4,
        gridRow: { xs: "1", md: "auto" },
      }}
    >
      {index}
    </Typography>
    <Box sx={{ color: INK, display: { xs: "none", md: "flex" }, pt: 0.2, fontSize: 19 }}>{icon}</Box>
    <Box sx={{ gridColumn: { xs: "2", md: "auto" } }}>
      <Typography
        sx={{
          fontFamily: "var(--font-display)",
          fontSize: "1.15rem",
          fontWeight: 600,
          color: INK,
          letterSpacing: "-0.015em",
          mb: 0.75,
        }}
      >
        {title}
      </Typography>
      <Typography sx={{ fontSize: "0.95rem", lineHeight: 1.6, color: MUTED }}>
        {body}
      </Typography>
    </Box>
  </Box>
);

/* -------------------------------------------------------- the ground */

/**
 * Bone, not white.
 *
 * A pure white page has no temperature and makes every white card on it
 * invisible. A warm off-white gives the sheets, cards and slide previews
 * something to sit on, so paper reads as paper, and it stops the whole
 * site looking like an untouched default.
 */
export const BONE = "#F1F0EE";
/** The alternating band, a shade down from BONE. */
export const BONE_DEEP = "#E9E7E3";
/** Actual paper: cards, sheets, slide previews. */
export const PAPER = "#FFFFFF";

/**
 * The cube palette.
 *
 * Weighted hard toward pale lilac, with the deep shades rare enough to
 * land as punctuation. Any field of these flipping at once in full
 * saturation reads as a loading screen, which is why the first four
 * entries repeat and the last two barely appear. Shared, so the cubes
 * on the home page and the cubes anywhere else are the same cubes.
 */
export const CUBE_SHADES = [
  "#F1EAFC",
  "#F1EAFC",
  "#F1EAFC",
  "#F1EAFC",
  "#E7DCF9",
  "#E7DCF9",
  "#E7DCF9",
  "#E7DCF9",
  "#D8C8F4",
  "#D8C8F4",
  "#D8C8F4",
  "#C3ABEC",
  "#C3ABEC",
  "#A87FDF",
  "#8B5BD0",
  "#7B4BC2",
];

/* ------------------------------------------------------------ marks */

/**
 * The house mark.
 *
 * Replaces the short accent dash that used to sit before every kicker.
 * A dash says nothing and every site has one. Three rules of falling
 * width is a slide seen from across the room: a headline, a line of
 * body, a shorter one. It is the smallest possible drawing of the thing
 * we make, and it costs three divs.
 */
export const Mark: React.FC<{ color?: string }> = ({ color = ACCENT }) => (
  <Box aria-hidden sx={{ display: "grid", gap: "3px", width: 18, flexShrink: 0 }}>
    {[100, 68, 44].map((w) => (
      <Box key={w} sx={{ width: `${w}%`, height: 2, backgroundColor: color }} />
    ))}
  </Box>
);

/**
 * A border coloured on two sides only.
 *
 * Top and left in the accent, bottom and right in the hairline. A panel
 * edged all the way round in a strong colour shouts; edged on half its
 * perimeter it reads as lit from one corner, which is what a sheet of
 * paper on a desk actually looks like.
 *
 * Returned as an sx fragment rather than a wrapper component so it adds
 * no DOM and can sit on anything that already has a border.
 */
export const halfBorder = (accent: string = ACCENT, rule: string = RULE) => ({
  borderStyle: "solid",
  borderColor: `${accent} ${rule} ${rule} ${accent}`,
  borderWidth: "2px 1px 1px 2px",
});
