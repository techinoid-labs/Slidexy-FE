"use client";

import React, { useEffect, useRef } from "react";
import { Box } from "@mui/material";
import { CX, CY, PERIOD, RAMP, camera, settle, shift } from "./mesh";

/**
 * The swell.
 *
 * An isometric sheet behind the composer, heaving like water.
 *
 * It was a square ruling before, which reads as a wall seen head on
 * however much you bend it. This is two families of lines at thirty
 * degrees, so the cells are diamonds and the sheet reads as a floor
 * seen from a corner: you are above it, looking across it, which is the
 * only way a flat thing can have a near end and a far end without a
 * vanishing point. It is the same projection the cubes standing on it
 * are drawn in, so the whole scene agrees about which way is up.
 *
 * The colour is a ramp rather than one ink: lilac at the masthead,
 * violet through the middle, plum at the foot, carried by the stroke
 * gradients so it costs nothing per line.
 *
 * Every vertex is pushed by the same two travelling swells, sideways a
 * little and up and down a lot, with the lower half heaving harder so
 * the sheet looks nearer there. Both families are drawn from the same
 * function, so the joints stay joined.
 *
 * It costs four paths a frame. The lines share two gradients, one light
 * and one heavy, instead of carrying a colour each, so the whole sheet
 * is four strokes: no layers, no textures and nothing to repaint.
 */

/** Every fourth line is drawn heavier. The cell, the swell, the drift
 *  and the colour all live in ./mesh, because the cubes use them too. */
const MAJOR = 4;
/** Lattice steps between samples. The swell is gentle enough that every
 *  second vertex traces it, at half the points. */
const STRIDE = 2;

export default function ComposeScene() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cv = canvas.current;
    const box = host.current;
    if (!cv || !box) return;

    const ctx = cv.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let live = true;
    let raf = 0;

    const size = () => {
      const r = box.getBoundingClientRect();
      // Capped: a 3x screen gains nothing on hairlines and costs a lot.
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = Math.max(1, Math.round(r.width));
      h = Math.max(1, Math.round(r.height));
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      cv.style.width = `${w}px`;
      cv.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    size();
    const ro = new ResizeObserver(size);
    ro.observe(box);

    const io = new IntersectionObserver(([e]) => {
      live = e.isIntersecting;
      if (live && !raf) raf = requestAnimationFrame(draw);
    });
    io.observe(box);

    const onMove = (e: PointerEvent) => {
      camera.lean = ((e.clientX / window.innerWidth) * 2 - 1) * -16;
    };
    window.addEventListener("pointermove", onMove);

    function draw(now: number) {
      raf = 0;
      if (!live || !ctx) return;

      const t = reduced ? 0 : now / 1000;
      // The sheet travels toward you by whole cells, so the lattice
      // never shifts out of register with itself.
      const slip = reduced ? 0 : shift(t);
      const mid = w / 2;

      // Steps along a line needed to cross the page, and the lines
      // needed above and below it to cover the diagonal overhang.
      const reach = Math.ceil((mid + 120) / CX);
      const over = reach * CY + PERIOD;
      const first = Math.floor((-over - slip) / PERIOD);
      const last = Math.ceil((h + over) / PERIOD);

      ctx.clearRect(0, 0, w, h);
      ctx.lineCap = "butt";

      /**
       * One vertical ramp standing in for a colour on every line. It
       * carries the hue as well as the weight, so the sheet goes from
       * lilac at the top to plum at the foot in a single stroke style.
       */
      const ramp = (alpha: number[]) => {
        const g = ctx.createLinearGradient(0, 0, 0, h);
        RAMP.forEach((stop, i) => g.addColorStop(stop.at, `rgba(${stop.rgb},${alpha[i]})`));
        return g;
      };
      const faint = ramp([0, 0.16, 0.32]);
      const bold = ramp([0, 0.3, 0.58]);

      // Both families at once: the light lines first, then every fourth
      // over the top of them.
      for (const heavy of [false, true]) {
        ctx.beginPath();
        for (let n = first; n <= last; n++) {
          if ((n % MAJOR === 0) !== heavy) continue;
          const base = 2 * n * CY + slip;
          // Down to the right, then down to the left, off the same
          // lattice, so the two cross where they should.
          for (const away of [1, -1]) {
            let started = false;
            for (let q = -reach; q <= reach; q += STRIDE) {
              const by = base + q * CY;
              if (by < -PERIOD || by > h + PERIOD) {
                started = false;
                continue;
              }
              const { x: sx, y: sy } = settle(mid + away * q * CX, by, w, h, t);
              if (!started) {
                ctx.moveTo(sx, sy);
                started = true;
              } else ctx.lineTo(sx, sy);
            }
          }
        }
        ctx.strokeStyle = heavy ? bold : faint;
        ctx.lineWidth = heavy ? 1.15 : 0.7;
        ctx.stroke();
      }

      if (!reduced) raf = requestAnimationFrame(draw);
    }

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <>
      {/* Colour in the top of the page, which the mesh is too faint to
          hold on its own: one wash down from the masthead and a bloom in
          each upper corner, behind everything. */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          background: [
            "radial-gradient(64% 46% at 50% -6%, rgba(142,45,226,0.14), transparent 72%)",
            "radial-gradient(38% 34% at 2% 4%, rgba(176,116,240,0.2), transparent 74%)",
            "radial-gradient(38% 34% at 98% 2%, rgba(74,30,134,0.14), transparent 74%)",
          ].join(", "),
        }}
      />
      <Box
        ref={host}
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          pointerEvents: "none",
          zIndex: 0,
          // Dissolves into the page rather than stopping at an edge. It
          // runs most of the way up: the ramp keeps it faint enough up
          // there to sit behind the headline instead of under it.
          maskImage:
            "radial-gradient(120% 108% at 50% 84%, #000 48%, transparent 98%), linear-gradient(180deg, transparent 0%, #000 13%)",
          WebkitMaskImage:
            "radial-gradient(120% 108% at 50% 84%, #000 48%, transparent 98%), linear-gradient(180deg, transparent 0%, #000 13%)",
          maskComposite: "intersect",
          WebkitMaskComposite: "source-in",
        }}
      >
        <Box component="canvas" ref={canvas} sx={{ display: "block" }} />
      </Box>
    </>
  );
}
