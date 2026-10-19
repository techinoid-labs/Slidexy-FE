"use client";

import React, { useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import { motion, useInView } from "framer-motion";
import { THEMES } from "@/templates/themes";
import type { TemplateTheme } from "@/templates/types";
import { CUBE_SHADES, INK, MONO, MUTED, RULE } from "./editorial";

/**
 * Two halves of the same idea.
 *
 * Left: a field of real cubes rolling a quarter turn to bring a new face
 * forward. Four faces mounted on the sides of a box in 3D, so the turn
 * has an edge rather than being a crossfade. The palette is weighted
 * hard toward pale lilac and only one or two cubes move at a time: a
 * wall of saturated purple all flipping at once reads as a loading
 * screen.
 *
 * Right: the type specimen. One line of real slide copy set over and
 * over in the product's actual themes, pulled live from `themes.ts`
 * rather than mocked up, with an index down the side you can drive by
 * hand. The words never change; the typeface, colour and card treatment
 * do.
 *
 * Together they carry the two things a theme actually is: a palette, and
 * a way of setting type.
 */

const PANEL_H = 304;

/* ---------------------------------------------------------------- cubes */

const GAP = 5;
const TARGET = 56; // rough cube size; the real one is derived from the width

/** The house cubes, shared with every other field of them. */
const SHADES = CUBE_SHADES;

const pick = () => SHADES[Math.floor(Math.random() * SHADES.length)];

type Cube = { faces: string[]; turn: number };

const makeCube = (): Cube => ({
  faces: [pick(), pick(), pick(), pick()],
  turn: 0,
});

/**
 * One cube, memoised.
 *
 * Only one or two cubes change on a tick, but the state is a single
 * array, so without this every cube in the field re-renders five times a
 * second. Styling them through `sx` made that worse: four faces each
 * means a few hundred emotion classes being recomputed on every tick,
 * which was enough to stall the specimen's entrance animation in the
 * panel beside it. Plain inline styles, and a memo so untouched cubes
 * sit still.
 */
const CubeCell = React.memo(function CubeCell({
  cube,
  side,
}: {
  cube: Cube;
  side: number;
}) {
  return (
    <div
      style={{
        display: "grid",
        placeItems: "center",
        // Each cube gets its own vanishing point. One perspective across
        // the whole row throws the far cubes into wedges.
        perspective: "520px",
      }}
    >
      <motion.div
        animate={{ rotateX: -90 * cube.turn }}
        transition={{ duration: 0.62, ease: [0.22, 1, 0.3, 1] }}
        style={{
          position: "relative",
          width: side,
          height: side,
          transformStyle: "preserve-3d",
        }}
      >
        {cube.faces.map((shade, f) => (
          <div
            key={f}
            style={{
              position: "absolute",
              inset: 0,
              background: shade,
              backfaceVisibility: "hidden",
              transform: `rotateX(${90 * f}deg) translateZ(${side / 2}px)`,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
});

const CubeField: React.FC = () => {
  const wrap = useRef<HTMLDivElement>(null);
  const inView = useInView(wrap, { amount: 0.3 });

  const [size, setSize] = useState(0);
  const [cols, setCols] = useState(0);
  const [rows, setRows] = useState(0);
  const [cubes, setCubes] = useState<Cube[]>([]);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false);
  }, []);

  // Measure, then derive an exact cube size so the field runs edge to
  // edge with no ragged gutter on the right, and enough rows to fill the
  // height of the panel beside it.
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;

    const measure = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (!w) return;
      const c = Math.max(3, Math.round((w + GAP) / (TARGET + GAP)));
      const s = (w - GAP * (c - 1)) / c;
      setCols(c);
      setSize(s);
      setRows(Math.max(2, Math.round((h + GAP) / (s + GAP))));
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Built on the client so the random faces never fight hydration.
  useEffect(() => {
    if (!cols || !rows) return;
    setCubes((prev) => {
      const want = cols * rows;
      if (prev.length === want) return prev;
      if (prev.length > want) return prev.slice(0, want);
      return [...prev, ...Array.from({ length: want - prev.length }, makeCube)];
    });
  }, [cols, rows]);

  useEffect(() => {
    if (!inView || reduced || cubes.length === 0) return;

    const id = setInterval(() => {
      setCubes((prev) => {
        if (prev.length === 0) return prev;
        const next = [...prev];

        // One cube, and now and then the one beside it, so the movement
        // reads as a ripple rather than a scatter.
        const hits = [Math.floor(Math.random() * next.length)];
        if (Math.random() < 0.3) hits.push((hits[0] + 1) % next.length);

        for (const i of hits) {
          const c = next[i];
          const faces = [...c.faces];
          // Repaint the face two turns out, well behind the box, so the
          // colour never changes anywhere the eye can see it.
          faces[(c.turn + 2) % 4] = pick();
          next[i] = { faces, turn: c.turn + 1 };
        }
        return next;
      });
    }, 620);

    return () => clearInterval(id);
  }, [inView, reduced, cubes.length]);

  // The cube sits slightly inside its cell, so a corner sweeping through
  // a turn never crosses into the cube beside it.
  const side = size * 0.84;

  return (
    <Box
      ref={wrap}
      aria-hidden
      sx={{
        height: "100%",
        display: "grid",
        gridTemplateColumns: cols ? `repeat(${cols}, 1fr)` : "1fr",
        gridAutoRows: size ? `${size}px` : "auto",
        gap: `${GAP}px`,
        alignContent: "space-between",
        overflow: "hidden",
      }}
    >
      {cubes.map((c, i) => (
        <CubeCell key={i} cube={c} side={side} />
      ))}
    </Box>
  );
};

/* -------------------------------------------------------------- specimen */

// Chosen for contrast across serif, grotesque and geometric, light and
// dark, rather than for being the first eight in the file.
// THEMES is keyed by each theme's own id, not by its export name.
const PICKS = [
  "corporate-navy",
  "investor-midnight",
  "marketing-magenta",
  "academic-ink",
  "tech-noir",
  "creative-sunset",
  "minimal-mono",
  "impact-green",
];

const SPECIMENS: TemplateTheme[] = PICKS
  .map((id) => (THEMES as any)[id] ?? Object.values(THEMES).find((t: any) => t.id === id))
  .filter(Boolean) as TemplateTheme[];

const LINE = "Revenue doubled in eighteen months";
const KICKER = "The number that matters";

const Specimen: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const [i, setI] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false);
  }, []);

  useEffect(() => {
    if (!inView || reduced || SPECIMENS.length === 0) return;
    const id = setInterval(() => setI((n) => (n + 1) % SPECIMENS.length), 2600);
    return () => clearInterval(id);
  }, [inView, reduced]);

  if (SPECIMENS.length === 0) return null;

  const t = SPECIMENS[i];
  const p: any = t.palette ?? {};
  const dark = (t as any).mode === "dark";

  return (
    <Box
      ref={ref}
      sx={{
        height: "100%",
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "1fr 152px" },
        border: `1px solid ${RULE}`,
      }}
    >
      <Box sx={{ position: "relative", overflow: "hidden" }}>
        {/* A hard cut, not a crossfade. These themes run light to dark, so
            dissolving one into the next spends half a second on a muddy
            average of the two, and waiting for the old one to leave first
            flashes the panel empty. The background swaps on the frame and
            the contents set themselves, the way a slide changes. */}
        <div key={t.id}>
          <motion.div
            style={{
              position: "absolute",
              inset: 0,
              background: p.bg,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "0 clamp(18px, 3vw, 34px)",
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 }}
            >
              <Box
                component="span"
                sx={{
                  display: "inline-block",
                  fontFamily: t.fonts?.body,
                  fontSize: "0.62rem",
                  letterSpacing: "0.17em",
                  textTransform: (t as any).uppercaseKickers ? "uppercase" : "none",
                  color: p.accent,
                  mb: 1.5,
                }}
              >
                {KICKER}
              </Box>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.34, delay: 0.1 }}
            >
              <Box
                component="span"
                sx={{
                  display: "block",
                  fontFamily: t.fonts?.display,
                  fontWeight: 700,
                  fontSize: "clamp(1.2rem, 2vw, 1.7rem)",
                  lineHeight: 1.1,
                  letterSpacing: "-0.025em",
                  color: p.text,
                }}
              >
                {LINE}
              </Box>
            </motion.div>

            {/* A card, so the card treatment is visible too */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.34, delay: 0.16 }}
              style={{ marginTop: 20, display: "flex", gap: 10, flexWrap: "wrap" }}
            >
              {["$4.2M", "+112%", "18 mo"].map((v) => (
                <Box
                  key={v}
                  sx={{
                    px: 1.5,
                    py: 1,
                    minWidth: 74,
                    background: p.surface,
                    border: `1px solid ${dark ? "rgba(255,255,255,0.14)" : p.border}`,
                    borderRadius:
                      t.radius === "none" ? 0 : t.radius === "pill" ? "999px" : t.radius === "lg" ? "14px" : "6px",
                    boxShadow: t.cardStyle === "elevated" && !dark ? "0 2px 10px rgba(0,0,0,0.07)" : "none",
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      fontFamily: t.fonts?.numeric ?? t.fonts?.display,
                      fontSize: "0.95rem",
                      fontWeight: 700,
                      color: p.accent,
                    }}
                  >
                    {v}
                  </Box>
                </Box>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </Box>

      {/* The index, so you can see what is being swapped and pick one */}
      <Box
        sx={{
          display: { xs: "none", sm: "grid" },
          gridTemplateRows: `repeat(${SPECIMENS.length}, 1fr)`,
          borderLeft: `1px solid ${RULE}`,
        }}
      >
        {SPECIMENS.map((s, n) => (
          <Box
            key={s.id}
            onClick={() => setI(n)}
            role="button"
            aria-label={`Set in ${s.name}`}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.1,
              px: 1.5,
              cursor: "pointer",
              borderBottom: n < SPECIMENS.length - 1 ? `1px solid ${RULE}` : "none",
              bgcolor: n === i ? "#FAFAFB" : "transparent",
              transition: "background 0.15s ease",
              "&:hover": { bgcolor: "#FAFAFB" },
            }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                flexShrink: 0,
                bgcolor: (s.palette as any)?.accent,
                outline: n === i ? `2px solid ${(s.palette as any)?.accent}33` : "none",
                outlineOffset: 1,
              }}
            />
            <Typography
              sx={{
                fontFamily: MONO,
                fontSize: "0.63rem",
                color: n === i ? INK : MUTED,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {s.name}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

/* ----------------------------------------------------------------- both */

export const Mosaic: React.FC = () => (
  <Box
    sx={{
      display: "grid",
      // The cubes are the quieter half, so they take less of the width
      // than the specimen beside them.
      gridTemplateColumns: { xs: "1fr", md: "0.72fr 1fr" },
      gap: { xs: 2, md: 3 },
      height: { xs: "auto", md: PANEL_H },
    }}
  >
    {/* Shorter than the specimen as well as narrower, and centred against
        it, so the cubes sit as a margin note rather than a second panel
        competing for the same weight. */}
    <Box sx={{ height: { xs: 150, md: 196 }, alignSelf: "center" }}>
      <CubeField />
    </Box>
    <Box sx={{ height: { xs: PANEL_H, md: "100%" } }}>
      <Specimen />
    </Box>
  </Box>
);

export default Mosaic;
