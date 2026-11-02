"use client";

import React from "react";
import { Box } from "@mui/material";

/**
 * The moving surface the slide sits on.
 *
 * This replaces a static checkerboard. The job of a workspace backdrop
 * is to say "the thing in the middle is the artwork and this is not",
 * and a little slow movement does that better than a fixed pattern,
 * which the eye stops seeing within a minute.
 *
 * Rules it follows, because a backdrop that breaks them is worse than no
 * backdrop at all:
 *
 *   - Nothing moves fast. The quickest cycle is 28 seconds. At that
 *     speed the motion is only visible if you look for it, which is the
 *     point: you are meant to be reading the slide.
 *   - Only transform and opacity animate. Those are composited on the
 *     GPU, so this costs nothing while someone is dragging a text block
 *     around. Animating a blur or a background-position would make the
 *     whole editor feel heavy.
 *   - Everything is CSS keyframes, not framer-motion. The canvas already
 *     re-renders on every edit and a JS animation loop would be fighting
 *     it for the main thread for no visual gain.
 *   - prefers-reduced-motion stops all of it. The gradients stay, so the
 *     surface still looks designed rather than broken.
 *
 * The greens are the Capital Green template's accents, the template a
 * new deck now opens on, so the workspace and the slide belong to each
 * other instead of a purple frame around a green deck.
 */

const GREEN = "47, 191, 113";      // #2fbf71, Capital Green accent
const GREEN_SOFT = "154, 232, 189"; // #9ae8bd, its lightest accent
const VIOLET = "142, 45, 226";      // the editor chrome's accent

/** One drifting, blurred blob. */
function blob(
  color: string,
  alpha: number,
  size: number,
  top: string,
  left: string,
  animation: string
) {
  return {
    position: "absolute" as const,
    width: size,
    height: size,
    top,
    left,
    borderRadius: "50%",
    background: `radial-gradient(circle, rgba(${color}, ${alpha}) 0%, rgba(${color}, 0) 70%)`,
    filter: "blur(40px)",
    willChange: "transform",
    animation,
  };
}

export default function EditorBackdrop() {
  return (
    <Box
      aria-hidden
      sx={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
        background: "#FAFAFA",

        "@keyframes sxDriftA": {
          "0%,100%": { transform: "translate3d(0, 0, 0) scale(1)" },
          "33%": { transform: "translate3d(6vw, -4vh, 0) scale(1.12)" },
          "66%": { transform: "translate3d(-3vw, 5vh, 0) scale(0.94)" },
        },
        "@keyframes sxDriftB": {
          "0%,100%": { transform: "translate3d(0, 0, 0) scale(1)" },
          "50%": { transform: "translate3d(-7vw, 6vh, 0) scale(1.18)" },
        },
        "@keyframes sxDriftC": {
          "0%,100%": { transform: "translate3d(0, 0, 0) scale(0.96)" },
          "40%": { transform: "translate3d(4vw, 7vh, 0) scale(1.1)" },
          "75%": { transform: "translate3d(-5vw, -3vh, 0) scale(1)" },
        },
        // The grid slides exactly one 28px cell, so the loop is seamless
        // and you never catch it jumping back to the start.
        "@keyframes sxGridPan": {
          "0%": { transform: "translate3d(0, 0, 0)" },
          "100%": { transform: "translate3d(28px, 28px, 0)" },
        },
        "@keyframes sxSheen": {
          "0%,100%": { opacity: 0.25 },
          "50%": { opacity: 0.6 },
        },

        // Movement is a decoration, never information. Anyone who has
        // asked their system to stop animations gets the same surface,
        // held still.
        "@media (prefers-reduced-motion: reduce)": {
          "& *": { animation: "none !important" },
        },
      }}
    >
      {/* Drifting colour fields */}
      <Box sx={blob(GREEN, 0.16, 520, "-12%", "-8%", "sxDriftA 34s ease-in-out infinite")} />
      <Box sx={blob(VIOLET, 0.1, 460, "45%", "70%", "sxDriftB 44s ease-in-out infinite")} />
      <Box sx={blob(GREEN_SOFT, 0.18, 380, "62%", "8%", "sxDriftC 38s ease-in-out infinite")} />

      {/* The dot grid, kept from the old backdrop because it is what
          makes the surface read as a canvas and gives the eye something
          to judge the slide's edges against. It is oversized by one cell
          in each direction so panning never exposes a bare corner. */}
      <Box
        sx={{
          position: "absolute",
          top: -28,
          left: -28,
          right: -28,
          bottom: -28,
          backgroundImage:
            "radial-gradient(circle, rgba(15, 20, 18, 0.07) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          willChange: "transform",
          animation: "sxGridPan 28s linear infinite",
        }}
      />

      {/* A wide soft band that breathes behind the slide, so the middle
          of the workspace is very slightly brighter than the edges and
          the slide looks lit rather than pasted on. */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 70% 55% at 50% 45%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 100%)",
          animation: "sxSheen 22s ease-in-out infinite",
        }}
      />
    </Box>
  );
}
