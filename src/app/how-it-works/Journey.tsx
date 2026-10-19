"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { ACCENT, FAINT, INK, MONO, MUTED, PAPER, RULE } from "@/app/components/home/editorial";
import Stage, { Target } from "@/app/components/journey/Stage";
import { Frame, STOPS } from "@/app/components/journey/sheet";

/**
 * The journey, driven by hand.
 *
 * The sheet, the stops and the camera all live in components/journey,
 * because the wait while a deck is built flies over the same map. What
 * is here is only the chrome: the chapter rail, the controls, and the
 * keys.
 *
 * Stepping, not scrolling. An earlier version drove the camera from the
 * scrollbar, which is a different thing wearing the same coat: the trip
 * plays at you, and you cannot dwell on the stop you care about, go
 * back, or wander off and find your way home. What makes a Prezi a
 * Prezi is that the canvas is real and you are the one moving over it.
 */

/** The masthead the stage sits under. */
const HEADER = 73;

export default function Journey() {
  const [at, setAt] = useState(-1);
  const [target, setTarget] = useState<Target>({ kind: "wide" });
  const [live, setLive] = useState(false);

  /** Point the camera at a stop, or at the whole map with -1. A fresh
   *  object every time, so asking for the stop you are already on still
   *  pulls the camera back to it after a wander. */
  const goTo = useCallback((n: number) => {
    const next = Math.max(-1, Math.min(STOPS.length - 1, n));
    setAt(next);
    setTarget(next < 0 ? { kind: "wide" } : { kind: "stop", n: next });
  }, []);

  useEffect(() => {
    if (!live) return;
    const key = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === " ") {
        e.preventDefault();
        goTo(Math.min(STOPS.length - 1, at + 1));
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        goTo(at <= 0 ? -1 : at - 1);
      } else if (e.key === "Escape") {
        goTo(-1);
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [at, live, goTo]);

  /** Clicking away gives the wheel back to the page. */
  useEffect(() => {
    if (!live) return;
    const off = () => setLive(false);
    const guard = (e: MouseEvent) => {
      const host = document.getElementById("journey-stage");
      if (host && !host.contains(e.target as Node)) off();
    };
    window.addEventListener("mousedown", guard);
    return () => window.removeEventListener("mousedown", guard);
  }, [live]);

  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        height: { xs: "auto", md: `calc(100vh - ${HEADER}px)` },
        minHeight: { md: 560 },
      }}
    >
      <Box
        id="journey-stage"
        onMouseDown={() => setLive(true)}
        sx={{ height: "100%", display: { xs: "none", md: "block" } }}
      >
        <Stage
          target={target}
          interactive
          live={live}
          onPick={goTo}
          sx={{
            outline: live ? `1px solid ${ACCENT}` : "1px solid transparent",
            outlineOffset: "-1px",
            transition: "outline-color 0.2s ease",
          }}
        >
          <Rail at={at} onJump={goTo} />
          <Controls at={at} live={live} onJump={goTo} />
        </Stage>
      </Box>

      {/* Below md the camera is pointless: the stops are just a list. */}
      <Box sx={{ display: { xs: "block", md: "none" }, px: 3, py: 6 }}>
        {STOPS.map((s) => (
          <Box key={s.key} sx={{ mb: 5 }}>
            <Frame stop={s} />
          </Box>
        ))}
      </Box>
    </Box>
  );
}

/* ---------------------------------------------------- rail, controls */

function Rail({ at, onJump }: { at: number; onJump: (n: number) => void }) {
  return (
    <Box
      sx={{
        position: "absolute",
        left: 36,
        top: "50%",
        transform: "translateY(-50%)",
        display: "flex",
        flexDirection: "column",
        gap: 1.75,
        zIndex: 2,
      }}
    >
      {STOPS.map((s, n) => {
        const on = n === at;
        return (
          <Box
            key={s.key}
            onClick={(e) => {
              e.stopPropagation();
              onJump(n);
            }}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              cursor: "pointer",
              color: on ? INK : FAINT,
              transition: "color 0.25s ease",
              "&:hover": { color: INK },
            }}
          >
            <Box
              sx={{
                width: on ? 34 : 16,
                height: "2px",
                bgcolor: on ? ACCENT : RULE,
                transition: "width 0.3s ease, background-color 0.3s ease",
              }}
            />
            <Typography
              component="span"
              sx={{
                fontFamily: MONO,
                fontSize: "0.72rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
                textShadow: "0 0 10px #F7F5FA, 0 0 4px #F7F5FA",
              }}
            >
              {s.index} {s.caption}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
}

const tap = {
  fontFamily: MONO,
  fontSize: "0.72rem",
  letterSpacing: "0.12em",
  textTransform: "uppercase" as const,
  px: 1.5,
  py: 0.9,
  cursor: "pointer",
  color: INK,
  transition: "color 0.15s ease",
  "&:hover": { color: ACCENT },
};

function Controls({ at, live, onJump }: { at: number; live: boolean; onJump: (n: number) => void }) {
  const last = STOPS.length - 1;
  return (
    <>
      <Box
        sx={{
          position: "absolute",
          left: "50%",
          bottom: 28,
          transform: "translateX(-50%)",
          display: "flex",
          alignItems: "center",
          bgcolor: PAPER,
          border: `1.5px solid ${INK}`,
          boxShadow: "6px 6px 0 0 rgba(142,45,226,0.9)",
          zIndex: 2,
        }}
      >
        <Box
          onClick={(e) => {
            e.stopPropagation();
            onJump(at <= 0 ? -1 : at - 1);
          }}
          sx={{ ...tap, opacity: at < 0 ? 0.35 : 1, pointerEvents: at < 0 ? "none" : "auto" }}
        >
          ‹ Back
        </Box>
        <Box sx={{ width: "1px", alignSelf: "stretch", bgcolor: RULE }} />
        <Typography
          sx={{
            fontFamily: MONO,
            fontSize: "0.72rem",
            letterSpacing: "0.12em",
            px: 2,
            color: MUTED,
            minWidth: 96,
            textAlign: "center",
          }}
        >
          {at < 0 ? "THE MAP" : `${STOPS[at].index} / 0${STOPS.length}`}
        </Typography>
        <Box sx={{ width: "1px", alignSelf: "stretch", bgcolor: RULE }} />
        <Box
          onClick={(e) => {
            e.stopPropagation();
            onJump(Math.min(last, at + 1));
          }}
          sx={{ ...tap, opacity: at >= last ? 0.35 : 1, pointerEvents: at >= last ? "none" : "auto" }}
        >
          Next ›
        </Box>
        <Box sx={{ width: "1px", alignSelf: "stretch", bgcolor: RULE }} />
        <Box
          onClick={(e) => {
            e.stopPropagation();
            onJump(-1);
          }}
          sx={{ ...tap, color: MUTED }}
        >
          Whole map
        </Box>
      </Box>

      <Typography
        sx={{
          position: "absolute",
          right: 28,
          bottom: 34,
          fontFamily: MONO,
          fontSize: "0.68rem",
          letterSpacing: "0.14em",
          color: live ? MUTED : ACCENT,
          zIndex: 2,
          pointerEvents: "none",
          transition: "color 0.2s ease",
        }}
      >
        {live ? "DRAG TO PAN · SCROLL TO ZOOM · ESC FOR THE MAP" : "CLICK THE MAP TO TAKE THE CONTROLS"}
      </Typography>
    </>
  );
}
