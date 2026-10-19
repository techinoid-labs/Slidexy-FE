"use client";

import React from "react";
import { Box } from "@mui/material";
import { Slab } from "@/app/components/home/blocks";

/**
 * The corner anchors.
 *
 * Two big cubes rising out of the bottom corners, cropped by the trim,
 * turning a full circle very slowly.
 *
 * This is the arrangement the home page hero uses and the one the
 * reference site uses, and the reason both do it is the same: a solid
 * is an anchor or it is litter. Cropped against two edges at once it
 * reads as something the page is sitting in front of, and the eye
 * accepts it without asking what it is. Floated whole in the middle of
 * a margin it reads as a sticker, which is what the last few versions
 * of this were, at every size I tried.
 *
 * They are the house `Slab` with its three sides equal, so they behave
 * like the solids on the home page: tipped so you can see the top,
 * spinning up when the pointer is on them, taking a flick when you
 * press. The angle is stepped by hand every frame rather than run as a
 * keyframe loop, which is the only way the speed can change halfway
 * through a turn, and each one idles when it is off screen.
 *
 * They are kept off the text structurally rather than by eye. Each side
 * is a strip as wide as the margin the content column leaves over,
 *
 *     max(0px, (100% - 900px) / 2)
 *
 * and each cube is set in from that strip's inner edge by its own sweep
 * (see `sweep`), so the furthest corner it can reach mid turn still
 * lands inside the margin. It grows outward from there, off the page.
 * No window width lets one touch the column, and when the margin runs
 * out the strip collapses and they leave on their own.
 */

/**
 * How far a turning cube reaches past its own box.
 *
 * A box of edge s presents its diagonal, s·√2, when it is halfway
 * between faces, so it overhangs each side by s·(√2 − 1)/2. Setting it
 * in by that much is what makes the clearance a fact about the geometry
 * rather than a number I liked the look of.
 */
const sweep = (s: number) => Math.ceil(s * 0.2072) + 8;

type Spec = {
  /** Edge of the cube. */
  s: number;
  hue: "violet" | "lilac" | "plum" | "orchid";
  cell: number;
  /** How far it is cropped by the bottom trim. */
  under: number;
  /** Seconds for one full turn, degrees into it that it starts, how far
   *  it is tipped, and whether it turns the other way. */
  spin: number;
  phase: number;
  tilt: number;
  back?: boolean;
};

const LEFT: Spec = { s: 304, hue: "violet", cell: 30, under: 96, spin: 92, phase: 24, tilt: 16 };
const RIGHT: Spec = { s: 266, hue: "plum", cell: 26, under: 68, spin: 108, phase: 196, tilt: 20, back: true };

/** Width of the column the cubes must stay clear of. */
const CONTENT = 900;

export default function SpinCubes() {
  return (
    <Box
      aria-hidden
      sx={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        // The field lets the pointer through; each cube takes it back
        // for itself, since the turning answers the pointer.
        pointerEvents: "none",
        zIndex: 0,
        display: { xs: "none", md: "block" },
      }}
    >
      {(["left", "right"] as const).map((side) => {
        const c = side === "left" ? LEFT : RIGHT;
        return (
          <Box
            key={side}
            sx={{
              position: "absolute",
              top: 0,
              bottom: 0,
              [side]: 0,
              width: `max(0px, calc((100% - ${CONTENT}px) / 2))`,
            }}
          >
            <Box
              sx={{
                position: "absolute",
                [side === "left" ? "right" : "left"]: `${sweep(c.s)}px`,
                bottom: `${-c.under}px`,
                pointerEvents: "auto",
              }}
            >
              <Slab
                w={c.s}
                h={c.s}
                d={c.s}
                hue={c.hue}
                cell={c.cell}
                spin={c.spin}
                phase={c.phase}
                tilt={c.tilt}
                back={c.back}
              />
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
