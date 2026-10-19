"use client";

import React, { useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";
import { motion, useAnimationFrame, useInView, useMotionValue } from "framer-motion";

/**
 * Solids.
 *
 * Real boxes, not pictures of boxes. Each one is six div faces placed in
 * CSS 3D inside a perspective container, so the thing genuinely turns:
 * faces catch and lose the light as they come round, near edges pass in
 * front of far ones, and the form is live rather than a drawing that
 * happens to drift.
 *
 * No SVG and no images. The graph paper on each face is two repeating
 * gradients, so the browser's own compositor draws it and the texture
 * scales with the face.
 *
 * Three forms, chosen so the silhouettes cannot be confused:
 *
 *   Slab    one box. Heavy and cubic, or wide and low, or tall and
 *           narrow, which is three different objects already.
 *   Deck    thin slabs stacked with air between them: a deck of slides,
 *           built out of the block material.
 *   Spiral  a coil climbing through the hue range, plum at the bottom to
 *           lilac at the top. A deck coming together rather than sitting
 *           still, and the one shape on the page that no block grid can
 *           produce.
 *
 * They are also **driven, not just animated**. Hover one and it spins
 * up; press it and it gets a flick that decays back to its cruising
 * speed. The rotation runs on a motion value stepped by hand each frame
 * rather than a fixed keyframe loop, which is what makes a live speed
 * change possible at all.
 */

export type Hue = "violet" | "lilac" | "plum" | "orchid" | "ink";

type Shades = { face: string; side: string; top: string; base: string; line: string };

const HUES: Record<Hue, Shades> = {
  violet: { face: "#8E2DE2", side: "#5E1A99", top: "#C9A6F2", base: "#3D0F69", line: "rgba(22,6,42,0.3)" },
  lilac: { face: "#CDAEF4", side: "#A77BE0", top: "#EFE4FD", base: "#8355C6", line: "rgba(44,18,78,0.22)" },
  plum: { face: "#4A1480", side: "#330B5C", top: "#7C35BE", base: "#1F0640", line: "rgba(255,255,255,0.12)" },
  orchid: { face: "#B341C8", side: "#822A94", top: "#E394F2", base: "#5C1A6A", line: "rgba(40,6,48,0.26)" },
  ink: { face: "#1C1527", side: "#120D1B", top: "#3A3348", base: "#0A0711", line: "rgba(255,255,255,0.13)" },
};

/** Graph paper, as two repeating gradients rather than an image. */
const paper = (line: string, cell: number) => ({
  backgroundImage: `repeating-linear-gradient(0deg, ${line} 0 1px, transparent 1px ${cell}px), repeating-linear-gradient(90deg, ${line} 0 1px, transparent 1px ${cell}px)`,
});

function usePrefersStill() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    setReduced(window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false);
  }, []);
  return reduced;
}

/**
 * The six faces of one box. The caller owns the sizing and the
 * `preserve-3d` context, which is what lets a stack or a coil reuse the
 * same box without nesting perspectives.
 */
function Faces({ w, h, d, c, cell }: { w: number; h: number; d: number; c: Shades; cell: number }) {
  const face = (key: string, transform: string, fill: string, fw: number, fh: number) => (
    <Box
      key={key}
      sx={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: fw,
        height: fh,
        marginLeft: `${-fw / 2}px`,
        marginTop: `${-fh / 2}px`,
        backgroundColor: fill,
        backfaceVisibility: "hidden",
        boxShadow: `inset 0 0 0 1px ${c.line}`,
        transform,
        ...paper(c.line, cell),
      }}
    />
  );

  return (
    <>
      {face("front", `translateZ(${d / 2}px)`, c.face, w, h)}
      {face("back", `rotateY(180deg) translateZ(${d / 2}px)`, c.face, w, h)}
      {face("right", `rotateY(90deg) translateZ(${w / 2}px)`, c.side, d, h)}
      {face("left", `rotateY(-90deg) translateZ(${w / 2}px)`, c.side, d, h)}
      {face("top", `rotateX(90deg) translateZ(${h / 2}px)`, c.top, w, d)}
      {face("base", `rotateX(-90deg) translateZ(${h / 2}px)`, c.base, w, d)}
    </>
  );
}

/** One member of a group: its own `preserve-3d` box, placed by transform. */
const member = (w: number, h: number, transform: string) => ({
  position: "absolute" as const,
  left: "50%",
  top: "50%",
  width: w,
  height: h,
  marginLeft: `${-w / 2}px`,
  marginTop: `${-h / 2}px`,
  transformStyle: "preserve-3d" as const,
  transform,
});

/* --------------------------------------------------------- turntable */

type TurnProps = {
  /** Seconds for one full turn at cruising speed. Longer is calmer. */
  spin?: number;
  /** Degrees it is tipped, so you see the top. */
  tilt?: number;
  /** Degrees into its turn it starts, so no two ever match. */
  phase?: number;
  /** Reverse the turn. */
  back?: boolean;
};

/**
 * Tips, then turns, and answers the pointer.
 *
 * The angle is a motion value stepped by hand every frame instead of a
 * keyframe loop, because a loop cannot change speed halfway through. The
 * current speed eases toward a target, so hovering spins it up smoothly
 * and a press gives it a flick that bleeds off on its own.
 *
 * It idles when off screen: eight of these stepping every frame for
 * content nobody is looking at is wasted battery.
 */
function Turntable({
  w,
  h,
  spin = 46,
  tilt = 16,
  phase = 0,
  back = false,
  children,
}: TurnProps & { w: number; h: number; children: React.ReactNode }) {
  const reduced = usePrefersStill();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "160px" });

  const cruise = ((back ? -360 : 360) / spin) * (reduced ? 0 : 1);
  const angle = useMotionValue(((phase % 360) + 360) % 360);
  const speed = useRef(cruise);
  const target = useRef(cruise);
  const [hot, setHot] = useState(false);

  useAnimationFrame((_, dt) => {
    if (!inView || reduced) return;
    // Ease toward the target so a flick decays instead of stopping dead.
    speed.current += (target.current - speed.current) * Math.min(1, dt / 420);
    angle.set(angle.get() + (speed.current * dt) / 1000);
  });

  const warm = () => {
    target.current = cruise * 5;
    setHot(true);
  };
  const cool = () => {
    target.current = cruise;
    setHot(false);
  };
  const flick = () => {
    speed.current = cruise * 20;
  };

  return (
    <Box
      ref={ref}
      onPointerEnter={warm}
      onPointerLeave={cool}
      onPointerDown={flick}
      sx={{
        width: w,
        height: h,
        perspective: `${Math.max(w, h) * 4}px`,
        cursor: "pointer",
        touchAction: "manipulation",
      }}
    >
      <Box
        component={motion.div}
        animate={{ scale: hot ? 1.06 : 1 }}
        transition={{ type: "spring", stiffness: 180, damping: 18 }}
        sx={{
          width: "100%",
          height: "100%",
          transformStyle: "preserve-3d",
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "100%",
            transformStyle: "preserve-3d",
            transform: `rotateX(${tilt}deg)`,
          }}
        >
          <Box
            component={motion.div}
            style={{ rotateY: angle }}
            sx={{ position: "relative", width: "100%", height: "100%", transformStyle: "preserve-3d" }}
          >
            {children}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

/* --------------------------------------------------------------- box */

export type SlabProps = TurnProps & {
  /** Size of the box along each axis, in px. */
  w: number;
  h: number;
  d: number;
  hue?: Hue;
  /** Graph paper spacing. */
  cell?: number;
};

export function Slab({ w, h, d, hue = "violet", cell = 20, ...turn }: SlabProps) {
  return (
    <Turntable w={w} h={h} {...turn}>
      <Faces w={w} h={h} d={d} c={HUES[hue]} cell={cell} />
    </Turntable>
  );
}

/* ------------------------------------------------------------- stack */

export type DeckProps = TurnProps & {
  /** Footprint of one slide. */
  w: number;
  d: number;
  /** Thickness of each slide. */
  plate?: number;
  count?: number;
  /** Clear air between slides. */
  gap?: number;
  hue?: Hue;
  cell?: number;
  /** Degrees each slide is turned against the one below. */
  fan?: number;
};

/**
 * A deck, built out of the same material as the blocks: thin slabs
 * stacked with air between them, each turned a few degrees against the
 * one below the way a pile of paper never sits quite square.
 */
export function Deck({
  w,
  d,
  plate = 11,
  count = 5,
  gap = 19,
  hue = "violet",
  cell = 18,
  fan = 3,
  ...turn
}: DeckProps) {
  const c = HUES[hue];
  const step = plate + gap;
  const total = count * plate + (count - 1) * gap;
  const mid = (count - 1) / 2;

  return (
    <Turntable w={w} h={total} {...turn}>
      {Array.from({ length: count }, (_, i) => (
        <Box
          key={i}
          sx={member(w, plate, `translateY(${(i - mid) * step}px) rotateY(${fan * (i - mid)}deg)`)}
        >
          <Faces w={w} h={plate} d={d} c={c} cell={cell} />
        </Box>
      ))}
    </Turntable>
  );
}

/* ------------------------------------------------------------ spiral */

export type SpiralProps = TurnProps & {
  /** Distance from the axis to the middle of the coil. */
  radius?: number;
  /** How many full turns the coil makes. */
  turns?: number;
  /** Steps per turn. More is smoother and heavier. */
  perTurn?: number;
  /** Total climb from bottom to top. */
  rise?: number;
  /** Thickness and depth of the band. */
  band?: number;
  depth?: number;
  /** The coil ramps through these, bottom to top. */
  hues?: readonly Hue[];
  cell?: number;
};

/**
 * A coil.
 *
 * Short segments walked round a circle and lifted as they go, each one
 * turned to sit tangent so the band stays continuous. The chord length
 * is worked out from the radius and the step count, with a little
 * overlap, so the joins close at any size rather than being eyeballed.
 *
 * It ramps through the purples as it climbs, deep at the base and pale
 * at the top, which gives it a direction the blocks do not have: a deck
 * coming together rather than a thing sitting there.
 */
export function Spiral({
  radius = 62,
  turns = 2,
  perTurn = 14,
  rise = 118,
  band = 6,
  depth = 30,
  hues = ["violet", "lilac"],
  cell = 22,
  ...turn
}: SpiralProps) {
  const n = Math.round(turns * perTurn);
  const stepDeg = 360 / perTurn;
  // Chord across one step, plus a little so the joins close.
  const chord = 2 * radius * Math.sin(Math.PI / perTurn) * 1.08;

  return (
    <Turntable w={radius * 2 + chord} h={rise + band} {...turn}>
      {Array.from({ length: n }, (_, i) => {
        const t = n > 1 ? i / (n - 1) : 0;
        const hue = hues[Math.min(hues.length - 1, Math.floor(t * hues.length))];
        const y = rise / 2 - t * rise;
        return (
          <Box
            key={i}
            sx={member(
              chord,
              band,
              `rotateY(${i * stepDeg}deg) translateZ(${radius}px) translateY(${y}px)`
            )}
          >
            <Faces w={chord} h={band} d={depth} c={HUES[hue]} cell={cell} />
          </Box>
        );
      })}
    </Turntable>
  );
}


/* -------------------------------------------------- three more forms */

export type StairProps = TurnProps & {
  /** Size of one tread. */
  w?: number;
  h?: number;
  d?: number;
  steps?: number;
  hues?: readonly Hue[];
  cell?: number;
};

/**
 * A staircase.
 *
 * Treads climbing away from you, each one up and back from the last. It
 * is the only form in the set that goes somewhere: everything else turns
 * on the spot, this one is visibly building. Which is the right thing to
 * have beside a box where you commission a deck.
 */
export function Stair({
  w = 54,
  h = 20,
  d = 54,
  steps = 5,
  hues = ["plum", "violet", "lilac"],
  cell = 13,
  ...turn
}: StairProps) {
  const mid = (steps - 1) / 2;

  return (
    <Turntable w={w * steps} h={h * steps} {...turn}>
      {Array.from({ length: steps }, (_, i) => {
        const hue = hues[Math.min(hues.length - 1, Math.floor((i / steps) * hues.length))];
        return (
          <Box
            key={i}
            sx={member(
              w,
              h,
              `translate3d(${(i - mid) * w}px, ${(mid - i) * h}px, ${(mid - i) * d}px)`
            )}
          >
            <Faces w={w} h={h} d={d} c={HUES[hue]} cell={cell} />
          </Box>
        );
      })}
    </Turntable>
  );
}

export type ArchProps = TurnProps & {
  /** Radius of the span. */
  radius?: number;
  /** Blocks in the span. */
  count?: number;
  /** Size of one voussoir. */
  block?: number;
  depth?: number;
  hue?: Hue;
  cell?: number;
};

/**
 * An arch.
 *
 * Blocks laid round a half circle, each one turned to sit square on the
 * curve, the way a real arch is cut. The chord is worked out from the
 * radius and the count so the joints close at any size, and the two feet
 * land level however many blocks you ask for.
 */
export function Arch({
  radius = 78,
  count = 9,
  block = 26,
  depth = 34,
  hue = "violet",
  cell = 12,
  ...turn
}: ArchProps) {
  // Span the half circle, a block at each end sitting flat.
  const stepDeg = 180 / (count - 1);
  const chord = 2 * radius * Math.sin(Math.PI / (2 * (count - 1))) * 1.25;

  return (
    <Turntable w={radius * 2 + chord} h={radius + block} {...turn}>
      {Array.from({ length: count }, (_, i) => {
        const deg = -90 + i * stepDeg;
        const rad = (deg * Math.PI) / 180;
        return (
          <Box
            key={i}
            sx={member(
              chord,
              block,
              `translate3d(${radius * Math.sin(rad)}px, ${-radius * Math.cos(rad) / 2 + radius / 2}px, 0px) rotateZ(${deg}deg)`
            )}
          >
            <Faces w={chord} h={block} d={depth} c={HUES[hue]} cell={cell} />
          </Box>
        );
      })}
    </Turntable>
  );
}

export type RingProps = TurnProps & {
  radius?: number;
  count?: number;
  /** Height of one block in the ring. */
  tall?: number;
  depth?: number;
  hues?: readonly Hue[];
  cell?: number;
};

/**
 * A ring.
 *
 * Blocks stood in a circle on a flat plane, each facing outward. Where
 * the coil climbs, this one lies down, so from across the page the two
 * read as different objects rather than the same trick twice.
 */
export function Ring({
  radius = 66,
  count = 11,
  tall = 30,
  depth = 26,
  hues = ["violet", "lilac"],
  cell = 11,
  ...turn
}: RingProps) {
  const chord = 2 * radius * Math.sin(Math.PI / count) * 1.06;

  return (
    <Turntable w={radius * 2 + chord} h={tall + 10} {...turn}>
      {Array.from({ length: count }, (_, i) => (
        <Box
          key={i}
          sx={member(
            chord,
            tall,
            `rotateY(${(i * 360) / count}deg) translateZ(${radius}px)`
          )}
        >
          <Faces w={chord} h={tall} d={depth} c={HUES[hues[i % hues.length]]} cell={cell} />
        </Box>
      ))}
    </Turntable>
  );
}

export type FrameProps = TurnProps & {
  w?: number;
  h?: number;
  d?: number;
  /** Thickness of each edge. */
  t?: number;
  hue?: Hue;
  cell?: number;
};

/**
 * A frame.
 *
 * Twelve edges and nothing else: a box you can see through. The only
 * hollow thing in the set, which is what it is for. Next to the solids
 * it reads as a drawing that happens to be three dimensional.
 */
export function Frame({ w = 148, h = 96, d = 110, t = 8, hue = "violet", cell = 9, ...turn }: FrameProps) {
  const c = HUES[hue];
  const edges: { w: number; h: number; d: number; x: number; y: number; z: number }[] = [];

  for (const y of [-h / 2, h / 2]) for (const z of [-d / 2, d / 2]) edges.push({ w, h: t, d: t, x: 0, y, z });
  for (const x of [-w / 2, w / 2]) for (const z of [-d / 2, d / 2]) edges.push({ w: t, h, d: t, x, y: 0, z });
  for (const x of [-w / 2, w / 2]) for (const y of [-h / 2, h / 2]) edges.push({ w: t, h: t, d, x, y, z: 0 });

  return (
    <Turntable w={w} h={h} {...turn}>
      {edges.map((e, i) => (
        <Box key={i} sx={member(e.w, e.h, `translate3d(${e.x}px, ${e.y}px, ${e.z}px)`)}>
          <Faces w={e.w} h={e.h} d={e.d} c={c} cell={cell} />
        </Box>
      ))}
    </Turntable>
  );
}

/* -------------------------------------------------------------- plane */

/**
 * Graph paper.
 *
 * A squared plane in the house purple, used as a backing for something
 * real: a card, a panel, a preview. It sits offset behind the thing it
 * backs so a band of it shows along two edges, which is what makes the
 * card read as pinned to a surface rather than floating on nothing.
 */
export function GraphPlane({
  tint = "#E4D5FA",
  cell = 20,
  line = "rgba(88,38,154,0.26)",
  sx,
}: {
  tint?: string;
  cell?: number;
  line?: string;
  sx?: object;
}) {
  return (
    <Box
      aria-hidden
      sx={{
        position: "absolute",
        backgroundColor: tint,
        backgroundImage: `repeating-linear-gradient(0deg, ${line} 0 1px, transparent 1px ${cell}px), repeating-linear-gradient(90deg, ${line} 0 1px, transparent 1px ${cell}px)`,
        ...sx,
      }}
    />
  );
}
