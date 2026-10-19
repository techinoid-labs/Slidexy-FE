"use client";

import React from "react";
import { Box } from "@mui/material";
import { motion } from "framer-motion";
import { ACCENT, INK } from "./editorial";

/**
 * The demo cursor.
 *
 * A pointer that drives the panel on its own: it travels to a tab,
 * presses it, the panel answers, it waits, it moves on. The hero stops
 * being a picture of the product and becomes a recording of somebody
 * using it, which is the one thing a static screenshot can never do.
 *
 * It is a real pointer rather than a video of one, so it costs a few
 * kilobytes instead of a few megabytes, it is sharp at any size, and it
 * can be aimed at the actual tabs: the targets are measured from the
 * live layout, so if the copy or the type size changes the cursor still
 * lands on them.
 *
 * It gets out of the way the moment a person takes over. Motion that
 * carries on after someone has grabbed the wheel is just noise.
 */

/** The arrow, cut out of a div. No image and no SVG. */
const ARROW =
  "polygon(0% 0%, 0% 78%, 23% 60%, 40% 97%, 57% 89%, 41% 54%, 71% 52%)";

export default function DemoCursor({
  to,
  show,
  press,
  onArrive,
}: {
  /** Where the pointer should be, in the panel's own coordinates. */
  to: { x: number; y: number };
  /** False once a person has taken over. */
  show: boolean;
  /** Bumped on every press, to replay the ring. */
  press: number;
  onArrive: () => void;
}) {
  return (
    <Box
      component={motion.div}
      aria-hidden
      initial={false}
      animate={{ x: to.x, y: to.y, opacity: show ? 1 : 0, scale: show ? 1 : 0.8 }}
      transition={{
        x: { duration: 0.5, ease: [0.33, 1, 0.5, 1] },
        y: { duration: 0.5, ease: [0.33, 1, 0.5, 1] },
        opacity: { duration: 0.3 },
        scale: { duration: 0.3 },
      }}
      onAnimationComplete={onArrive}
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 4,
        pointerEvents: "none",
        display: { xs: "none", md: "block" },
      }}
    >
      {/* The press, as a ring leaving the tip */}
      <Box
        key={press}
        component={motion.div}
        initial={{ scale: 0.3, opacity: 0.55 }}
        animate={{ scale: 1.9, opacity: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        sx={{
          position: "absolute",
          left: -13,
          top: -13,
          width: 28,
          height: 28,
          borderRadius: "50%",
          border: `2px solid ${ACCENT}`,
        }}
      />

      <Box
        sx={{
          width: 15,
          height: 21,
          backgroundColor: INK,
          clipPath: ARROW,
          // A thin light edge so it reads against dark and light alike,
          // then a soft drop so it sits above the panel.
          filter:
            "drop-shadow(0 0 1px rgba(255,255,255,0.95)) drop-shadow(0 2px 3px rgba(20,8,40,0.35))",
        }}
      />
    </Box>
  );
}
