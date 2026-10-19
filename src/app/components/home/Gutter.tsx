"use client";

import React from "react";
import { Box } from "@mui/material";
import { Arch, Deck, Frame, Ring, Slab, Spiral, Stair } from "./blocks";

/**
 * Gutter objects.
 *
 * Solids that live in the empty margin either side of the content
 * column and run off the edge of the page, so each one is cropped by
 * two trims at once. That is how a page like this is actually put
 * together: the object is not placed near the text, it is placed in the
 * space the text does not use.
 *
 * The guarantee is structural, not a set of coordinates. Each object is
 * pinned inside a strip whose width is
 *
 *     max(0px, (100% - 1200px) / 2 + 24px)
 *
 * which is exactly the gutter left over by the page container, and it is
 * anchored to that strip's inner edge. Being wider than its strip, it
 * grows outward, off the page, never inward. So it cannot reach the text
 * at any window size, and when the window narrows to the point where
 * there is no gutter left the strip collapses to nothing and the object
 * slides off screen on its own. No breakpoints, no magic numbers, and
 * nothing to re-tune when the copy changes.
 *
 * Before this they sat in a horizontal band between sections, which was
 * safe but lined them up like a toolbar. This keeps the safety and
 * throws away the line.
 */

const DEFAULT_CONTENT = 1200; // the usual page container width
const PAD = 24; // and its inner padding, which is extra clearance

export type GutterPiece =
  | { kind: "slab"; props: React.ComponentProps<typeof Slab> }
  | { kind: "deck"; props: React.ComponentProps<typeof Deck> }
  | { kind: "spiral"; props: React.ComponentProps<typeof Spiral> }
  | { kind: "stair"; props: React.ComponentProps<typeof Stair> }
  | { kind: "arch"; props: React.ComponentProps<typeof Arch> }
  | { kind: "ring"; props: React.ComponentProps<typeof Ring> }
  | { kind: "frame"; props: React.ComponentProps<typeof Frame> };

export type GutterItem = {
  key: string;
  piece: GutterPiece;
  /** Which margin it lives in. */
  side: "left" | "right";
  /** Distance from the section's top or bottom edge. Negative crops it. */
  top?: number;
  bottom?: number;
  /** Extra push outward, away from the content. Never inward. */
  out?: number;
};

function render(piece: GutterPiece) {
  switch (piece.kind) {
    case "deck":
      return <Deck {...piece.props} />;
    case "spiral":
      return <Spiral {...piece.props} />;
    case "stair":
      return <Stair {...piece.props} />;
    case "arch":
      return <Arch {...piece.props} />;
    case "ring":
      return <Ring {...piece.props} />;
    case "frame":
      return <Frame {...piece.props} />;
    default:
      return <Slab {...piece.props} />;
  }
}

/**
 * Drop inside a section that is `position: relative` and
 * `overflow: hidden`. The hidden overflow is what crops the objects
 * against the section's own top and bottom.
 */
export default function Gutter({
  items,
  content = DEFAULT_CONTENT,
}: {
  items: GutterItem[];
  /** Width of the container this sits beside. */
  content?: number;
}) {
  return (
    <Box
      aria-hidden
      sx={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        display: { xs: "none", md: "block" },
      }}
    >
      {items.map((it) => {
        const outward = it.side === "left" ? "right" : "left";
        return (
          <Box
            key={it.key}
            sx={{
              position: "absolute",
              top: 0,
              bottom: 0,
              [it.side]: 0,
              width: `max(0px, calc((100% - ${content}px) / 2 + ${PAD}px))`,
            }}
          >
            <Box
              sx={{
                position: "absolute",
                [outward]: it.out ?? 0,
                top: it.top,
                bottom: it.bottom,
                pointerEvents: "auto",
              }}
            >
              {render(it.piece)}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}

/* ------------------------------------------------------ the casts */

/**
 * Four places on the page carry objects, and the rest carry none. The
 * reference site does the same: two enormous corner anchors at the top,
 * a pair further down, then long stretches of nothing. Objects on every
 * section would be wallpaper.
 */

/** The hero: two heavy anchors in the bottom corners, cropped by both trims. */
export const HERO_GUTTER: GutterItem[] = [
  {
    key: "left",
    side: "left",
    bottom: -72,
    out: 54,
    piece: {
      kind: "slab",
      props: { w: 352, h: 236, d: 196, hue: "violet", cell: 30, spin: 64, phase: 36 },
    },
  },
  {
    key: "right",
    side: "right",
    bottom: -96,
    out: 30,
    piece: {
      kind: "slab",
      props: { w: 318, h: 214, d: 180, hue: "plum", cell: 27, spin: 58, phase: 212, back: true },
    },
  },
];

/** The handover section: a deck low on the left, a coil high on the right. */
export const PURPOSE_GUTTER: GutterItem[] = [
  {
    key: "deck",
    side: "left",
    bottom: 120,
    out: 92,
    piece: {
      kind: "deck",
      props: { w: 248, d: 168, count: 6, plate: 14, gap: 22, hue: "lilac", cell: 20, spin: 50, phase: 150, fan: 4 },
    },
  },
  {
    key: "coil",
    side: "right",
    top: 150,
    out: 46,
    piece: {
      kind: "spiral",
      props: { radius: 82, turns: 2, perTurn: 15, rise: 168, band: 8, depth: 38, spin: 42, phase: 280, tilt: 22 },
    },
  },
];

/** How it works: one long low slab running off the right trim. */
export const WORKING_GUTTER: GutterItem[] = [
  {
    key: "long",
    side: "right",
    bottom: 96,
    out: 20,
    piece: {
      kind: "slab",
      props: { w: 340, h: 92, d: 228, hue: "orchid", cell: 26, spin: 68, phase: 20, back: true },
    },
  },
];

/** The closing form: a tall column in the left gutter. */
export const CONTACT_GUTTER: GutterItem[] = [
  {
    key: "column",
    side: "left",
    bottom: -40,
    out: 72,
    piece: {
      kind: "slab",
      props: { w: 136, h: 268, d: 136, hue: "ink", cell: 18, spin: 54, phase: 115 },
    },
  },
];

/**
 * Create a deck.
 *
 * The composer sits in a narrow column with a lot of empty page either
 * side of it. Three solids fill that, cropped by the trim: a heavy block
 * on the left, a coil climbing on the right, and a deck of plates low
 * down. They never cross into the column, so the box stays the only
 * thing competing for attention.
 */
export const COMPOSE_GUTTER: GutterItem[] = [
  {
    key: "stair",
    side: "left",
    top: 30,
    out: 36,
    piece: {
      kind: "stair",
      props: { w: 62, h: 24, d: 62, steps: 5, spin: 58, phase: 30, tilt: 28 },
    },
  },
  {
    key: "ring",
    side: "right",
    top: 44,
    out: 22,
    piece: {
      kind: "ring",
      props: { radius: 70, count: 11, tall: 32, spin: 46, phase: 215, tilt: 24, back: true },
    },
  },
  {
    key: "arch",
    side: "left",
    bottom: -26,
    out: 70,
    piece: {
      kind: "arch",
      props: { radius: 82, count: 9, block: 27, hue: "lilac", spin: 64, phase: 120 },
    },
  },
  {
    key: "frame",
    side: "right",
    bottom: -18,
    out: 54,
    piece: {
      kind: "frame",
      props: { w: 150, h: 98, d: 112, hue: "plum", spin: 54, phase: 300, tilt: 20 },
    },
  },
];
