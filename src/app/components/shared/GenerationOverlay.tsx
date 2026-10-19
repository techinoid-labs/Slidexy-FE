"use client";

import React, { useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { ACCENT, FAINT, INK, MONO, MUTED, PAPER, RULE } from "@/app/components/home/editorial";
import Stage, { Target } from "@/app/components/journey/Stage";
import { LAP, STOPS, cardAt } from "@/app/components/journey/sheet";

interface GenerationOverlayProps {
  open: boolean;
  progress?: number;
  message?: string;
  detail?: string;
  onCancel?: () => void;
  /**
   * Called once the work is done AND the camera has actually reached
   * the end of the route. The page waits for this before it navigates,
   * because the last message from the server used to arrive while the
   * camera was still somewhere over the middle of the sheet, and the
   * page changed under it.
   */
  onArrived?: () => void;
}

/**
 * The wait.
 *
 * It used to be a spinner dressed up: three fake slide cards, a row of
 * pills, a bar, two emoji. All of it was decoration standing in for
 * information, and none of it told you anything you could not have
 * guessed from the fact that you had pressed a button.
 *
 * This is the journey from the how it works page, flown automatically,
 * at the pace of the real work. The camera's position on the route is
 * the progress: at nothing it is looking at the whole map, and as the
 * server actually gets on with it the camera travels stop by stop,
 * arriving at the finished file as the last byte lands. There is no
 * second progress model to drift out of step with the first, because
 * the camera *is* the progress bar. The thin rule along the foot is
 * only there for people who want the number.
 *
 * Nothing here is clickable except Cancel. You are waiting, not
 * driving, so the stage takes no pointer at all.
 *
 * One more thing it buys: somebody who has never seen the product
 * watches the whole explanation while they wait, instead of watching a
 * bar. The wait is the only moment you have their attention for free.
 */

/**
 * The stops are the route; these are the names the server gives the
 * work, matched to the stop each one lands on.
 */
const STAGES: { from: number; label: string }[] = [
  { from: 0, label: "Reading what you said" },
  { from: 14, label: "Settling the brief" },
  { from: 30, label: "Ordering the argument" },
  { from: 52, label: "Writing the lines" },
  { from: 74, label: "Laying out the slides" },
  { from: 92, label: "Making the file" },
];

/**
 * The server decorates its progress messages with emoji and trailing
 * dots. Nothing else in the product does, so they are taken off here
 * rather than argued about across the wire.
 */
const plain = (t?: string) =>
  (t || "")
    .replace(/[🀀-🫿←-➿️⬀-⯿]/gu, "")
    .replace(/.{2,}s*$/, "")
    .trim();

const stageAt = (p: number) => {
  let n = 0;
  for (let i = 0; i < STAGES.length; i++) if (p >= STAGES[i].from) n = i;
  return n;
};

/**
 * The number runs on this machine's clock, not the server's.
 *
 * Every version that read the server froze, because the server
 * freezes: it reaches eighty, writes seven slides in silence, and
 * reports again half a minute later. Smoothing it, creeping it,
 * putting a floor under it, all of that was still arithmetic on a
 * number that was not moving. So it is not read at all any more,
 * except for the one fact worth reading: whether the work is done.
 *
 * What is shown is a curve on elapsed time that climbs quickly at
 * first and keeps climbing for as long as it needs to, approaching
 * but never reaching the nineties, with a floor under its rate so it
 * always ticks. It is honest about the only thing it claims, which is
 * that something is still happening, and it hits a hundred when a
 * hundred is true.
 */
/** Seconds for the curve to cover most of its ground. */
const SHAPE = 14;
/** Where it heads, and the slowest it is allowed to move. */
const NEARLY = 99;
const FLOOR = 0.3;

const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);

/**
 * The journey is a cinematic, not a progress bar.
 *
 * Every version of this before it tried to make the camera's position
 * mean something: chase the percentage, then be permitted by it, then
 * approach a permit that crept. Each one was a controller reading the
 * server, and every controller had a state in which it slowed to
 * nothing and sat there, because the server itself sits there. Dressed
 * up however carefully, a camera driven by a stalled number stalls.
 *
 * So it is not driven by the number any more. It plays. One constant
 * speed from the first frame to the last, picked once from an early
 * read of how fast this particular build is going and then never
 * touched again. No feedback, no ceiling, no creep, nothing that can
 * argue with itself. The only speed change in the whole run is the
 * last one, when the work is actually finished and the journey closes
 * up to meet it.
 *
 * The percentage beside it still reports the server, honestly, because
 * that is the thing that knows. The two are no longer pretending to be
 * one number, which is what tied them in knots.
 */
/**
 * The tour goes round until there is news.
 *
 * Two measurements shaped this. Watching a real build, the camera
 * travelled the whole route in thirteen seconds and then sat dead on
 * the last card for twenty seven more, because every version was
 * trying to stretch one trip to fit a build whose length cannot be
 * known in advance. And a screenshot mid-build showed the thing that
 * actually looked broken: the camera adrift over empty graph paper
 * with a card half out of frame, which is where a continuous sweep
 * spends most of its time on a sheet this size.
 *
 * So the trip has stops in it and it laps. It is never crossing open
 * paper for more than a second and a half, it is square on a card the
 * rest of the time, and it does not have to fit anything.
 *
 * Its timings live in the sheet beside the map they apply to.
 */
/** Flying to the last card once the work is done, and the beat spent
 *  there before the page changes. */
const LAND = 1250;
const BEAT = 600;

export default function GenerationOverlay({
  open,
  progress = 0,
  message,
  detail,
  onCancel,
  onArrived,
}: GenerationOverlayProps) {
  /**
   * Seconds into the tour, which is what the stage reads every frame.
   * Written by the loop, never during render: setting it in the render
   * body would freeze it between renders, and renders are rare here on
   * purpose.
   */
  const clock = useRef(0);
  /** Two target objects for the life of the component: going round,
   *  and the one flight at the end. Never rebuilt, so the stage stays
   *  memoised. */
  const CIRCUIT = useRef<Target>({ kind: "tour" }).current;
  const LAST = useRef<Target>({ kind: "stop", n: STOPS.length - 1 }).current;
  const [pct, setPct] = useState(0);
  /** Which card the camera is on. Changes a handful of times a lap,
   *  so it can afford to be state; reading the ref during render
   *  would have left it stale, since renders are deliberately rare. */
  const [card, setCard] = useState(0);
  /** Set once the work is done: stop circling, go and land. */
  const [final, setFinal] = useState(false);
  const real = useRef(0);
  real.current = progress;

  const landed = useRef(false);
  const arrive = useRef(onArrived);
  arrive.current = onArrived;

  useEffect(() => {
    if (!open) {
      clock.current = 0;
      landed.current = false;
      setPct(0);
      setCard(0);
      setFinal(false);
      return;
    }
    let raf = 0;
    let prev = performance.now();
    const began = performance.now();
    /** The number on screen, which is a function of the clock. */
    let figure = 0;

    const tick = (now: number) => {
      const dt = Math.min(250, now - prev);
      prev = now;
      const truth = real.current;
      // Straight off the clock, so a browser dropping frames shows the
      // tour in the right place less often rather than running it slow.
      clock.current = (now - began) / 1000;

      // Off the clock, with a floor under the rate so it cannot go
      // quiet however long this takes. The server is consulted for one
      // thing only: whether it has finished.
      if (truth >= 100) {
        figure = 100;
      } else {
        const curve = NEARLY * (1 - Math.exp(-clock.current / SHAPE));
        figure = Math.min(NEARLY, Math.max(curve, figure + (FLOOR * dt) / 1000));
      }

      const whole = Math.round(clamp(figure, 0, 100));
      setPct((v) => (v === whole ? v : whole));

      // The rail names the card you are actually looking at, worked
      // out from the same timetable the camera is flying.
      const on = Math.min(STAGES.length - 1, cardAt(clock.current));
      setCard((v) => (v === on ? v : on));

      if (!landed.current && truth >= 100) {
        landed.current = true;
        // Stop going round, fly to the last card, and let the page
        // change once it has got there and been looked at.
        setFinal(true);
        setTimeout(() => arrive.current?.(), LAND + BEAT);
        return;
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [open]);


  // The rail labels the card you are looking at, so it reads the
  // camera. The bar and the number report the work, so they read the
  // server. Two honest things rather than one dishonest one.
  // Clamped at the point of use as well as where it is set. An
  // index out of range here takes the whole page down with it, and a
  // loader is the worst possible place to find that out.
  const n = Math.max(0, Math.min(STAGES.length - 1, card));
  const travelled = pct;

  return (
    <AnimatePresence>
      {open && (
        <Box
          component={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          sx={{ position: "fixed", inset: 0, zIndex: 1400, bgcolor: "#F4F2F7" }}
        >
          {/* Lifted, because the card along the foot would otherwise
              sit on top of whichever frame the camera has centred. */}
          {/* No children, so the memo on it actually holds: the
              chrome below is a sibling, not a child. */}
          <Stage target={final ? LAST : CIRCUIT} clock={clock} breathe lift={62} />
            {/* The masthead line, kept out of the way of the frames. */}
            <Box sx={{ position: "absolute", top: 30, left: 36, zIndex: 2 }}>
              <Typography
                sx={{
                  fontFamily: MONO,
                  fontSize: "0.72rem",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: ACCENT,
                  textShadow: "0 0 10px #F7F5FA, 0 0 4px #F7F5FA",
                }}
              >
                Building your deck
              </Typography>
              <Typography
                sx={{
                  fontFamily: MONO,
                  fontSize: "0.72rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: MUTED,
                  mt: 0.75,
                  textShadow: "0 0 10px #F7F5FA, 0 0 4px #F7F5FA",
                }}
              >
                This is what is happening to it
              </Typography>
            </Box>

            {/* The route, with the stage it has reached. */}
            <Box
              sx={{
                position: "absolute",
                left: 36,
                top: "50%",
                transform: "translateY(-50%)",
                display: { xs: "none", md: "flex" },
                flexDirection: "column",
                gap: 1.75,
                zIndex: 2,
              }}
            >
              {STAGES.map((s, i) => {
                const done = i < n;
                const on = i === n;
                return (
                  <Box key={s.label} sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box
                      sx={{
                        width: on ? 34 : 16,
                        height: "2px",
                        bgcolor: on ? ACCENT : done ? "rgba(142,45,226,0.45)" : RULE,
                        transition: "width 0.4s ease, background-color 0.4s ease",
                      }}
                    />
                    <Typography
                      sx={{
                        fontFamily: MONO,
                        fontSize: "0.72rem",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        whiteSpace: "nowrap",
                        color: on ? INK : done ? MUTED : FAINT,
                        transition: "color 0.4s ease",
                        textShadow: "0 0 10px #F7F5FA, 0 0 4px #F7F5FA",
                      }}
                    >
                      {STOPS[i]?.index ?? "0" + (i + 1)} {s.label}
                    </Typography>
                  </Box>
                );
              })}
            </Box>

            {/* What it is doing, and how far in. */}
            <Box
              sx={{
                position: "absolute",
                left: "50%",
                bottom: 28,
                transform: "translateX(-50%)",
                width: "min(620px, calc(100% - 72px))",
                bgcolor: PAPER,
                border: `1.5px solid ${INK}`,
                boxShadow: "6px 6px 0 0 rgba(142,45,226,0.9)",
                px: 3,
                py: 2.25,
                zIndex: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 2 }}>
                <Typography sx={{ fontSize: "1.05rem", fontWeight: 600, color: INK, lineHeight: 1.35 }}>
                  {plain(message) || STAGES[n]?.label}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: MONO,
                    fontSize: "0.8rem",
                    color: ACCENT,
                    fontVariantNumeric: "tabular-nums",
                    flexShrink: 0,
                  }}
                >
                  {String(Math.round(travelled)).padStart(2, "0")}%
                </Typography>
              </Box>

              {plain(detail) && (
                <Typography sx={{ fontSize: "0.9rem", color: MUTED, mt: 0.6, lineHeight: 1.5 }}>
                  {plain(detail)}
                </Typography>
              )}

              {/* A rule that fills, not a bar that floats. */}
              <Box sx={{ position: "relative", height: "2px", bgcolor: RULE, mt: 2 }}>
                <Box
                  sx={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: `${Math.max(1, Math.min(100, travelled))}%`,
                    bgcolor: ACCENT,
                    // No transition: the value behind it is already
                    // eased by the camera, and animating it again put the
                    // rule a third of a second behind its own number.
                  }}
                />
              </Box>

              {onCancel && (
                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1.5 }}>
                  <Typography
                    component="button"
                    onClick={onCancel}
                    sx={{
                      fontFamily: MONO,
                      fontSize: "0.7rem",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: MUTED,
                      background: "none",
                      border: "none",
                      p: 0,
                      cursor: "pointer",
                      "&:hover": { color: ACCENT },
                    }}
                  >
                    Stop building
                  </Typography>
                </Box>
              )}
            </Box>

        </Box>
      )}
    </AnimatePresence>
  );
}
