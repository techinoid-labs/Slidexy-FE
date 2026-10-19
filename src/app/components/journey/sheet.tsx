"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import { ACCENT, FAINT, INK, MONO, MUTED, PAPER, RULE } from "@/app/components/home/editorial";

/**
 * The sheet.
 *
 * One map of the whole process, pinned at six places, shared by the two
 * screens that have any business showing it: the page that explains the
 * product, where you drive the camera yourself, and the wait while a
 * deck is actually being built, where the camera drives itself along
 * the same route at the pace of the real work.
 *
 * Keeping it in one place is the point. The thing a person sees while
 * they wait is the thing they were shown beforehand, which is the only
 * way the wait teaches them anything.
 */

/**
 * Its proportions are the stage's, roughly, because the wide shot has
 * to fill the frame. A tall sheet seen through a wide window leaves
 * bars down both sides, and a map with margins round it reads as a
 * picture of a map.
 */
export const SHEET_W = 5600;
export const SHEET_H = 2300;

export type Stop = {
  key: string;
  index: string;
  caption: string;
  /** Where it is pinned, how it is hung, and how wide the frame is. */
  x: number;
  y: number;
  rot: number;
  w: number;
  /** How close the camera comes. */
  zoom: number;
};

export const STOPS: Stop[] = [
  { key: "said", index: "01", caption: "You say it badly", x: 700, y: 760, rot: -4, w: 620, zoom: 1.15 },
  { key: "brief", index: "02", caption: "It asks four things", x: 1840, y: 380, rot: 5, w: 540, zoom: 1.3 },
  { key: "order", index: "03", caption: "The running order, first", x: 1680, y: 1720, rot: -2.5, w: 640, zoom: 1.05 },
  { key: "argue", index: "04", caption: "You argue with it here", x: 3080, y: 1180, rot: 6, w: 660, zoom: 1.1 },
  { key: "slides", index: "05", caption: "Only then, slides", x: 4320, y: 520, rot: -5, w: 720, zoom: 0.92 },
  { key: "file", index: "06", caption: "A file that opens", x: 4720, y: 1780, rot: 3, w: 560, zoom: 1.25 },
];

export type Shot = { x: number; y: number; rot: number; k: number };

/**
 * The whole sheet, seen from a long way back.
 *
 * Its zoom is not a constant. It is whatever covers the stage at the
 * size the stage happens to be, worked out on every resize, so the map
 * fills a laptop and a monitor alike with nothing showing round the
 * edges.
 */
export const WIDE: Shot = { x: SHEET_W / 2, y: SHEET_H / 2, rot: 0, k: 0.27 };

export const wideFor = (w: number, h: number): Shot => ({
  ...WIDE,
  k: Math.max(w / SHEET_W, h / SHEET_H) || WIDE.k,
});

export const shotFor = (n: number, wide: Shot): Shot =>
  n < 0 || n >= STOPS.length
    ? { ...wide }
    : { x: STOPS[n].x, y: STOPS[n].y, rot: STOPS[n].rot, k: STOPS[n].zoom };

export const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);
export const rad = (deg: number) => (deg * Math.PI) / 180;

/** Smooth in and out of a single move, so nothing starts or stops
 *  abruptly. Used for a flight to one stop, never along the route. */
export const ease = (u: number) => u * u * (3 - 2 * u);

/**
 * The tour.
 *
 * A trip with stops in it, not a continuous sweep.
 *
 * Every version before this moved the camera the whole time, which
 * sounds smoother and is the opposite. Six cards spread over a sheet
 * this size means most of a continuous sweep is spent crossing empty
 * paper, and a camera drifting across blank grid with a card half out
 * of frame is the most stuck-looking thing it can possibly do. It was
 * also where it spent most of its time.
 *
 * So it travels briskly and then stops and holds, which is what a
 * presentation does and what makes one readable. Most of the trip is
 * now spent square on a card with the card filling the frame, and
 * nothing is ever mid-air for longer than TRAVEL.
 */

/** Seconds to cross to the next card, and to sit on it once there. */
export const TRAVEL = 1.5;
export const HOLD = 2.2;
/** And to pull back out to the wide shot at the end of a lap. */
export const RETURN = 2.6;
/** One lap of the whole map. */
export const LAP = STOPS.length * (TRAVEL + HOLD) + RETURN;

/** Smootherstep: no kick at either end of a move. */
const glide = (f: number) => {
  const v = clamp(f, 0, 1);
  return v * v * v * (v * (v * 6 - 15) + 10);
};

/**
 * A dwell is not a stop.
 *
 * Sitting perfectly still on a card is the right amount of time to
 * read it and the wrong thing to look at: a motionless screen is read
 * as a hung one, whatever else is true. So the camera keeps easing in
 * across the whole dwell, a few per cent of zoom and a few pixels of
 * pan. It is slow enough to read over and fast enough that nothing on
 * screen is ever static.
 */
const DRIFT_ZOOM = 0.055;
const DRIFT_PAN = 9;

const settle = (s: Shot, f: number): Shot => ({
  x: s.x + DRIFT_PAN * (f - 0.5) * 2,
  y: s.y + DRIFT_PAN * 0.5 * (f - 0.5) * 2,
  rot: s.rot,
  k: s.k * (1 - DRIFT_ZOOM / 2 + DRIFT_ZOOM * f),
});

const blend = (a: Shot, b: Shot, f: number): Shot => ({
  x: a.x + (b.x - a.x) * f,
  y: a.y + (b.y - a.y) * f,
  rot: a.rot + (b.rot - a.rot) * f,
  // Log space, or the zoom lurches at the near end.
  k: Math.exp(Math.log(a.k) + (Math.log(b.k) - Math.log(a.k)) * f),
});

/** Which card is in front of you at this moment of the lap. */
export function cardAt(t: number): number {
  const lap = ((t % LAP) + LAP) % LAP;
  return Math.min(STOPS.length - 1, Math.floor(lap / (TRAVEL + HOLD)));
}

/**
 * Where the camera is at this moment of the lap.
 *
 * Nought and one lap are the same place, the wide shot, so it can
 * simply keep going round for as long as it is needed.
 */
export function tour(t: number, wide: Shot): Shot {
  const lap = ((t % LAP) + LAP) % LAP;
  const step = TRAVEL + HOLD;
  const i = Math.floor(lap / step);

  if (i >= STOPS.length) {
    // The way home, so the next lap starts without a cut.
    const out = lap - STOPS.length * step;
    return blend(settle(shotFor(STOPS.length - 1, wide), 1), wide, glide(out / RETURN));
  }

  const into = lap - i * step;
  // Leave the previous card from where its drift had got to, and
  // arrive at this one where its drift begins, so the joins are
  // seamless and nothing ever jumps.
  const from = i === 0 ? wide : settle(shotFor(i - 1, wide), 1);
  const to = shotFor(i, wide);
  return into < TRAVEL
    ? blend(from, settle(to, 0), glide(into / TRAVEL))
    : settle(to, (into - TRAVEL) / HOLD);
}

/* ------------------------------------------------------------- route */

/**
 * A word on each leg, written on the sheet between the two stops it
 * joins. From the wide shot they are what make the route read as an
 * argument rather than a dotted line: six boxes connected by nothing
 * tell you there is an order, these tell you why it is that order.
 */
const LEGS = [
  "first, badly",
  "then it asks",
  "before anything is drawn",
  "change your mind here",
  "and only now",
];

/**
 * The route.
 *
 * Drawn at every distance, because it is the only thing that says
 * these six cards are one journey rather than six cards. It used to
 * appear to run across the middle of whatever you were reading; that
 * was the cards being translucent, not the route being wrong, and it
 * is fixed where it was broken. The labels and the big numerals do
 * step back as you arrive, since those are map furniture and you are
 * no longer reading the map.
 */
export function Route({ wash }: { wash?: React.Ref<SVGGElement> }) {
  const d = STOPS.map((s, i) => `${i ? "L" : "M"} ${s.x} ${s.y}`).join(" ");
  return (
    <Box
      component="svg"
      viewBox={`0 0 ${SHEET_W} ${SHEET_H}`}
      sx={{ position: "absolute", inset: 0, width: SHEET_W, height: SHEET_H, pointerEvents: "none" }}
    >
      <defs>
        <marker id="journey-arrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={ACCENT} />
        </marker>
      </defs>
      <path
        d={d}
        fill="none"
        stroke={ACCENT}
        strokeWidth={3}
        strokeDasharray="14 12"
        opacity={0.42}
        markerMid="url(#journey-arrow)"
        markerEnd="url(#journey-arrow)"
      />
      {STOPS.map((s) => (
        <circle key={s.key} cx={s.x} cy={s.y} r={9} fill={ACCENT} opacity={0.5} />
      ))}
      <g ref={wash as React.Ref<SVGGElement>}>
      {STOPS.map((s) => (
        <g key={s.key}>
          {/* The number, set huge and faint on the paper itself, so the
              map still reads from across the sheet. */}
          <text
            x={s.x - 150}
            y={s.y - 150}
            fill={ACCENT}
            opacity={0.1}
            fontSize={300}
            fontFamily="var(--font-display), system-ui, sans-serif"
            fontWeight={700}
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {s.index}
          </text>
        </g>
      ))}
      {LEGS.map((label, i) => {
        const a = STOPS[i];
        const b = STOPS[i + 1];
        if (!a || !b) return null;
        const mx = (a.x + b.x) / 2;
        const my = (a.y + b.y) / 2;
        const deg = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
        return (
          <text
            key={label}
            x={mx}
            y={my - 16}
            fill={ACCENT}
            opacity={0.55}
            fontSize={30}
            letterSpacing={6}
            fontFamily="var(--font-mono), monospace"
            textAnchor="middle"
            transform={`rotate(${deg} ${mx} ${my})`}
          >
            {label.toUpperCase()}
          </text>
        );
      })}
      </g>
    </Box>
  );
}

/* ------------------------------------------------------------ frames */

const card = {
  bgcolor: PAPER,
  border: `1.5px solid ${INK}`,
  boxShadow: "10px 10px 0 0 rgba(142,45,226,0.9)",
};

function Head({ stop }: { stop: Stop }) {
  return (
    <Box sx={{ display: "flex", alignItems: "baseline", gap: 1.25, mb: 1.5 }}>
      <Typography component="span" sx={{ fontFamily: MONO, fontSize: "0.72rem", color: ACCENT }}>
        {stop.index}
      </Typography>
      <Typography
        component="span"
        sx={{ fontFamily: MONO, fontSize: "0.72rem", letterSpacing: "0.14em", textTransform: "uppercase", color: MUTED }}
      >
        {stop.caption}
      </Typography>
    </Box>
  );
}

/**
 * A frame.
 *
 * The card itself is opaque at every distance; only the ink on it
 * fades, through a --dim custom property the camera writes on the
 * wrapper. The whole card used to fade together, which is why the
 * dotted route appeared to run across the middle of it: there was
 * nothing solid there to hide behind. Now the paper always hides the
 * line and the route can stay drawn at every zoom, which is what it is
 * for.
 */
export function Frame({ stop }: { stop: Stop }) {
  const dim = { opacity: "var(--dim, 1)", transition: "opacity 0.12s linear" };
  return (
    <Box>
      <Box sx={dim}>
        <Head stop={stop} />
      </Box>
      <Box sx={{ ...card, p: 3 }}>
        <Box sx={dim}>{BODIES[stop.key]()}</Box>
      </Box>
    </Box>
  );
}

const line = { borderBottom: `1px solid ${RULE}`, py: 1.1, display: "flex", gap: 2, alignItems: "baseline" };
const num = { fontFamily: MONO, fontSize: "0.7rem", color: FAINT, minWidth: 18 };

const ORDER = [
  "Shipping burns a billion tonnes a year",
  "Why the obvious fixes have not worked",
  "What we built, in one diagram",
  "Three pilots, nine months, the numbers",
  "The market, sized honestly",
  "What the round buys",
];

const BODIES: Record<string, () => React.ReactNode> = {
  said: () => (
    <Box>
      <Typography sx={{ fontSize: "1.5rem", lineHeight: 1.35, color: INK, fontStyle: "italic" }}>
        “Seed pitch for a climate tech startup cutting shipping emissions”
        <Box
          component="span"
          sx={{
            display: "inline-block",
            width: "2px",
            height: "1.15em",
            bgcolor: ACCENT,
            ml: 0.5,
            transform: "translateY(3px)",
            animation: "blink 1.1s steps(1) infinite",
            "@keyframes blink": { "0%, 50%": { opacity: 1 }, "50.01%, 100%": { opacity: 0 } },
          }}
        />
      </Typography>
      <Typography sx={{ mt: 2, fontSize: "0.92rem", color: MUTED }}>
        One line is enough. It is never a blank page problem.
      </Typography>
    </Box>
  ),

  brief: () => (
    <Box>
      {[
        ["How many slides", "12"],
        ["Who is in the room", "Investors"],
        ["How it should sound", "Plain language"],
        ["Pictures", "None, for now"],
      ].map(([q, a]) => (
        <Box key={q} sx={{ ...line, justifyContent: "space-between" }}>
          <Typography sx={{ fontSize: "0.95rem", color: MUTED }}>{q}</Typography>
          <Typography sx={{ fontSize: "0.95rem", fontWeight: 600, color: INK }}>{a}</Typography>
        </Box>
      ))}
      <Typography sx={{ mt: 2, fontSize: "0.92rem", color: MUTED }}>
        Four questions, all optional. Skip them and it guesses well.
      </Typography>
    </Box>
  ),

  order: () => (
    <Box>
      {ORDER.map((t, i) => (
        <Box key={t} sx={line}>
          <Typography component="span" sx={num}>
            {String(i + 1).padStart(2, "0")}
          </Typography>
          <Typography sx={{ fontSize: "1rem", color: INK }}>{t}</Typography>
        </Box>
      ))}
      <Typography sx={{ mt: 2, fontSize: "0.92rem", color: MUTED }}>
        The running order comes back before anything is designed.
      </Typography>
    </Box>
  ),

  argue: () => (
    <Box>
      <Box sx={line}>
        <Typography component="span" sx={num}>
          01
        </Typography>
        <Typography sx={{ fontSize: "1rem", color: INK }}>{ORDER[0]}</Typography>
      </Box>
      <Box sx={{ ...line, bgcolor: "rgba(142,45,226,0.07)" }}>
        <Typography component="span" sx={{ ...num, color: ACCENT }}>
          02
        </Typography>
        <Typography sx={{ fontSize: "1rem", color: INK }}>
          Why the obvious fixes have not worked
          <Box component="span" sx={{ color: ACCENT, fontWeight: 600 }}>
            , and what it cost the ones who tried
          </Box>
        </Typography>
      </Box>
      <Box sx={line}>
        <Typography component="span" sx={num}>
          03
        </Typography>
        <Typography sx={{ fontSize: "1rem", color: FAINT, textDecoration: "line-through" }}>
          What we built, in one diagram
        </Typography>
      </Box>
      <Box sx={{ ...line, borderBottom: "none" }}>
        <Typography component="span" sx={num}>
          04
        </Typography>
        <Typography sx={{ fontSize: "1rem", color: INK }}>
          Three pilots, nine months, the numbers{" "}
          <Box component="span" sx={{ fontFamily: MONO, fontSize: "0.68rem", color: ACCENT, ml: 0.5 }}>
            MOVED UP
          </Box>
        </Typography>
      </Box>
      <Typography sx={{ mt: 2, fontSize: "0.92rem", color: MUTED }}>
        Rewrite a line, cut one, drag one up. This is the cheap place to change your mind.
      </Typography>
    </Box>
  ),

  slides: () => (
    <Box>
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1.25 }}>
        {Array.from({ length: 8 }, (_, i) => (
          <Box
            key={i}
            sx={{
              aspectRatio: "16 / 9",
              border: `1px solid ${RULE}`,
              bgcolor: "#FCFBFE",
              p: 0.9,
              display: "flex",
              flexDirection: "column",
              gap: 0.5,
            }}
          >
            <Box sx={{ height: 4, width: "62%", bgcolor: i % 3 === 0 ? ACCENT : INK, opacity: 0.85 }} />
            <Box sx={{ height: 3, width: "88%", bgcolor: RULE }} />
            <Box sx={{ height: 3, width: "74%", bgcolor: RULE }} />
            {i % 4 === 1 && <Box sx={{ mt: "auto", height: 16, bgcolor: "rgba(142,45,226,0.16)" }} />}
          </Box>
        ))}
      </Box>
      <Typography sx={{ mt: 2, fontSize: "0.92rem", color: MUTED }}>
        Built from the order you approved, in a theme you picked.
      </Typography>
    </Box>
  ),

  file: () => (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, pb: 1.75, borderBottom: `1px solid ${RULE}` }}>
        <Box
          sx={{
            width: 38,
            height: 46,
            border: `1.5px solid ${INK}`,
            display: "grid",
            placeItems: "center",
            fontFamily: MONO,
            fontSize: "0.56rem",
            color: ACCENT,
          }}
        >
          PPTX
        </Box>
        <Box>
          <Typography sx={{ fontSize: "1.05rem", fontWeight: 600, color: INK }}>seed-pitch.pptx</Typography>
          <Typography sx={{ fontFamily: MONO, fontSize: "0.72rem", color: MUTED }}>12 SLIDES · 1.8 MB</Typography>
        </Box>
      </Box>
      {["Real text boxes, not one flat image a slide", "Native tables you can retype", "Charts still bound to their own data"].map(
        (t) => (
          <Box key={t} sx={{ display: "flex", gap: 1.25, pt: 1.4 }}>
            <Box sx={{ width: 7, height: 7, bgcolor: ACCENT, mt: "7px", flexShrink: 0 }} />
            <Typography sx={{ fontSize: "0.95rem", color: INK }}>{t}</Typography>
          </Box>
        )
      )}
    </Box>
  ),
};
