"use client";

import React, { useEffect, useRef } from "react";
import { Box } from "@mui/material";
import {
  Frame,
  Route,
  SHEET_H,
  SHEET_W,
  STOPS,
  Shot,
  clamp,
  rad,
  shotFor,
  tour,
  wideFor,
} from "./sheet";



/**
 * The camera.
 *
 * One rendering of the sheet and one loop that moves a camera over it,
 * used both by the page you drive yourself and by the wait that drives
 * itself. The difference between those two is a prop, not a second
 * implementation, which is the only reason they stay in step when the
 * map changes.
 *
 * Three details do most of the work.
 *
 * Scale is interpolated in log space. Halfway between a tenth and a
 * whole is a third, not a half: zooms read as even travel only if each
 * step multiplies by the same amount, and linear interpolation makes
 * every zoom lurch at the near end.
 *
 * The frames are hung at angles and the camera rolls to meet them. The
 * roll is what makes an arrival feel like an arrival.
 *
 * And the camera always chases a target rather than being set, by
 * exponential decay against real elapsed time, so the glide takes the
 * same wall-clock quarter second whatever rate the loop is running at.
 */

export type Target =
  /** The whole map, at whatever zoom covers the stage. */
  | { kind: "wide" }
  /** One stop, square on. */
  | { kind: "stop"; n: number }
  /** Playing the tour, at whatever second the clock says. */
  | { kind: "tour" };

export type StageProps = {
  target: Target;
  /** Drag to pan and, once live, scroll to zoom. */
  interactive?: boolean;
  live?: boolean;
  /** Clicking a frame, when the chrome wants to offer that. */
  onPick?: (n: number) => void;
  /** A slow sway on top of the target, so a camera that is waiting for
   *  something never looks frozen. */
  breathe?: boolean;
  /** Screen pixels to raise the centre by, for chrome along the foot
   *  that would otherwise cover whatever the camera is looking at. */
  lift?: number;
  /**
   * Seconds into the tour, read fresh every frame.
   *
   * A ref rather than a number in the target, because the alternative
   * is a new target object on every tick, which re-renders this and
   * everything on the sheet sixty times a second. That was most of the
   * flicker: React rebuilding three hundred nodes while the frame loop
   * was writing styles to them.
   */
  clock?: React.MutableRefObject<number>;
  /** Chrome drawn over the camera, which does not move with it. */
  children?: React.ReactNode;
  sx?: object;
};

/**
 * Memoised, and that matters more than it looks.
 *
 * While a deck is building, its parent re-renders on every message
 * from the server. Without this, each one rebuilt the sheet and all
 * six cards, several hundred nodes, in the middle of an animation
 * that was trying to write transforms to those same nodes. Give it
 * stable props and no children and it renders once for the whole
 * wait.
 */
function Stage({
  target,
  interactive = false,
  live = false,
  onPick,
  breathe = false,
  lift = 0,
  clock,
  children,
  sx = {},
}: StageProps) {
  const stage = useRef<HTMLDivElement>(null);
  const sheet = useRef<HTMLDivElement>(null);
  const frames = useRef<(HTMLDivElement | null)[]>([]);

  const cam = useRef<Shot | null>(null);
  const aim = useRef<Shot | null>(null);
  const wash = useRef<SVGGElement | null>(null);
  /** A timed flight: where it left, when, and how long it has. */
  const flight = useRef<{ from: Shot; at: number; ms: number } | null>(null);
  const mid = useRef({ x: 0, y: 0 });
  const wide = useRef<Shot>(wideFor(1440, 720));
  const want = useRef<Target>(target);
  /** Set by a drag or a zoom; cleared the moment the chrome asks for a
   *  new target, so wandering off does not fight the controls. */
  const free = useRef(false);

  want.current = target;
  useEffect(() => {
    free.current = false;
    // A new fixed target is a flight with a beginning and an end,
    // eased over a fixed time so it arrives rather than asymptoting.
    // The tour is exempt: it is already a timetable, and wrapping it
    // in a second one would fight it.
    if (target.kind !== "tour" && cam.current) {
      flight.current = { from: { ...cam.current }, at: performance.now(), ms: 0 };
    }
  }, [target]);

  useEffect(() => {
    const st = stage.current;
    const sh = sheet.current;
    if (!st || !sh) return;

    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    let raf = 0;
    let prev = performance.now();

    const measure = () => {
      mid.current = { x: st.clientWidth / 2, y: st.clientHeight / 2 - lift };
      wide.current = wideFor(st.clientWidth, st.clientHeight);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(st);

    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !raf) {
        prev = performance.now();
        raf = requestAnimationFrame(step);
      } else if (!e.isIntersecting && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    });
    io.observe(st);

    const resolve = (t: Target): Shot => {
      if (t.kind === "stop") return shotFor(t.n, wide.current);
      if (t.kind === "tour") return tour(clock ? clock.current : 0, wide.current);
      return { ...wide.current };
    };

    // Start where we are being pointed, rather than flying in from a
    // default nobody asked for.
    if (!cam.current) {
      cam.current = resolve(want.current);
      aim.current = { ...cam.current };
    }

    function step(now: number) {
      // Capped generously: a stall should not be fully absorbed in one
      // frame, but clipping it to a frame's worth means the camera
      // crawls whenever the tab is throttled.
      const dt = Math.min(200, now - prev);
      prev = now;
      raf = 0;

      const c = cam.current as Shot;

      // Following means travelling the route, not cutting across the
      // sheet toward wherever the far end happens to be. The parameter
      // is what eases; the camera is wherever that parameter puts it,
      // so every stop between here and there is actually visited.
      if (!free.current) aim.current = resolve(want.current);
      const a = aim.current as Shot;

      const f = flight.current;
      if (f && !free.current && !reduced) {
        // Long hops get a little longer, but not proportionally, or
        // crossing the sheet feels like a different control to nudging
        // one stop sideways.
        if (!f.ms) {
          const span = Math.hypot(a.x - f.from.x, a.y - f.from.y) / SHEET_W;
          const zoom = Math.abs(Math.log(a.k / f.from.k));
          f.ms = 620 + Math.min(620, span * 900 + zoom * 220);
        }
        const u = clamp((now - f.at) / f.ms, 0, 1);
        // Smootherstep: no kick at either end, which is what sells it
        // as a camera on a track rather than a tween.
        const p = u * u * u * (u * (u * 6 - 15) + 10);
        c.x = f.from.x + (a.x - f.from.x) * p;
        c.y = f.from.y + (a.y - f.from.y) * p;
        c.rot = f.from.rot + (a.rot - f.from.rot) * p;
        c.k = Math.exp(Math.log(f.from.k) + (Math.log(a.k) - Math.log(f.from.k)) * p);
        if (u >= 1) flight.current = null;
      } else if (want.current.kind === "tour" && !free.current) {
        // The tour is already shaped in time, easing into and out of
        // every move of its own accord. Easing it again adds only lag.
        c.x = a.x;
        c.y = a.y;
        c.rot = a.rot;
        c.k = a.k;
      } else {
        const e = reduced ? 1 : 1 - Math.exp(-dt / 240);
        c.x += (a.x - c.x) * e;
        c.y += (a.y - c.y) * e;
        c.rot += (a.rot - c.rot) * e;
        c.k = Math.exp(Math.log(c.k) + (Math.log(a.k) - Math.log(c.k)) * e);
      }

      // A waiting camera that is perfectly still reads as a frozen
      // page, so it drifts a little. Never on a camera being driven.
      let bx = 0;
      let by = 0;
      let br = 0;
      if (breathe && !reduced) {
        const t = now / 1000;
        bx = Math.sin(t * 0.21) * 22;
        by = Math.cos(t * 0.17) * 14;
        br = Math.sin(t * 0.13) * 0.55;
      }

      const m = mid.current;
      sh.style.transform = `translate(${m.x}px, ${m.y}px) scale(${c.k.toFixed(4)}) rotate(${(-(c.rot + br)).toFixed(3)}deg) translate(${(-(c.x + bx)).toFixed(2)}px, ${(-(c.y + by)).toFixed(2)}px)`;

      // Map furniture, the numerals and the leg labels, steps back as
      // you arrive at a card. The dashes themselves stay: they are the
      // only thing saying these cards are one journey.
      if (wash.current) {
        const out = clamp((0.7 - c.k) / (0.7 - wide.current.k || 1), 0, 1);
        wash.current.style.opacity = out.toFixed(2);
      }

      // The ink on a card comes up as the camera closes on it, measured
      // against how much sheet is on screen, so the rule holds at every
      // zoom. The card itself never fades, or the route would show
      // straight through it.
      const halfView = m.x / c.k || 1;
      STOPS.forEach((s, n) => {
        const node = frames.current[n];
        if (!node) return;
        const d = Math.hypot(c.x - s.x, c.y - s.y) / halfView;
        const near = clamp(1 - d / 0.55, 0, 1);
        node.style.setProperty("--dim", (0.22 + 0.78 * near).toFixed(2));
      });

      raf = requestAnimationFrame(step);
    }

    raf = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [breathe, lift, clock]);

  /* ------------------------------------------------- pan and zoom */

  useEffect(() => {
    const st = stage.current;
    if (!st || !interactive) return;

    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let moved = 0;

    /** A screen point back to a point on the sheet, undoing the camera. */
    const toSheet = (sx2: number, sy2: number) => {
      const c = cam.current as Shot;
      const m = mid.current;
      const r = st.getBoundingClientRect();
      const dx = (sx2 - r.left - m.x) / c.k;
      const dy = (sy2 - r.top - m.y) / c.k;
      const t = rad(c.rot);
      return { x: c.x + dx * Math.cos(t) - dy * Math.sin(t), y: c.y + dx * Math.sin(t) + dy * Math.cos(t) };
    };

    const down = (e: PointerEvent) => {
      dragging = true;
      moved = 0;
      lastX = e.clientX;
      lastY = e.clientY;
      // Deliberately no capture here. Capturing on press retargets
      // every later pointer event to the stage, which eats the click
      // the buttons and the frames are waiting for: pressing Next did
      // nothing at all. The capture is taken below, once the pointer
      // has actually travelled far enough to be a drag.
    };

    const move = (e: PointerEvent) => {
      if (!dragging || !cam.current) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      moved += Math.abs(dx) + Math.abs(dy);
      if (moved < 4) return;
      if (!st.hasPointerCapture(e.pointerId)) st.setPointerCapture(e.pointerId);

      const c = cam.current;
      const t = rad(c.rot);
      // Undo the roll, or dragging sideways while a tilted stop is in
      // frame walks the sheet off diagonally.
      const wx = (-dx * Math.cos(t) + dy * Math.sin(t)) / c.k;
      const wy = (-dx * Math.sin(t) - dy * Math.cos(t)) / c.k;
      // Both, so the sheet tracks the hand exactly instead of lagging.
      c.x += wx;
      c.y += wy;
      aim.current = { ...c };
      free.current = true;
    };

    const up = (e: PointerEvent) => {
      dragging = false;
      if (st.hasPointerCapture(e.pointerId)) st.releasePointerCapture(e.pointerId);
    };

    const wheel = (e: WheelEvent) => {
      if (!live || !cam.current) return; // the page keeps its scrollbar until you ask
      e.preventDefault();
      const c = cam.current;
      const w = toSheet(e.clientX, e.clientY);
      const k = clamp(c.k * Math.exp(-e.deltaY * 0.0014), 0.12, 2.6);
      // Keep the sheet still under the pointer: find the point it is
      // over, then work back to the centre that leaves it there.
      const m = mid.current;
      const r = st.getBoundingClientRect();
      const sx2 = (e.clientX - r.left - m.x) / k;
      const sy2 = (e.clientY - r.top - m.y) / k;
      const t = rad(c.rot);
      c.k = k;
      c.x = w.x - (sx2 * Math.cos(t) - sy2 * Math.sin(t));
      c.y = w.y - (sx2 * Math.sin(t) + sy2 * Math.cos(t));
      aim.current = { ...c };
      free.current = true;
    };

    st.addEventListener("pointerdown", down);
    st.addEventListener("pointermove", move);
    st.addEventListener("pointerup", up);
    st.addEventListener("pointercancel", up);
    st.addEventListener("wheel", wheel, { passive: false });

    return () => {
      st.removeEventListener("pointerdown", down);
      st.removeEventListener("pointermove", move);
      st.removeEventListener("pointerup", up);
      st.removeEventListener("pointercancel", up);
      st.removeEventListener("wheel", wheel);
    };
  }, [interactive, live]);

  return (
    <Box
      ref={stage}
      sx={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        bgcolor: "#F4F2F7",
        cursor: interactive ? "grab" : "default",
        touchAction: interactive ? "none" : "auto",
        userSelect: "none",
        ...(interactive ? { "&:active": { cursor: "grabbing" } } : {}),
        ...sx,
      }}
    >
      <Box
        ref={sheet}
        sx={{
          position: "absolute",
          left: 0,
          top: 0,
          width: SHEET_W,
          height: SHEET_H,
          transformOrigin: "0 0",
          backgroundColor: "#F7F5FA",
          // The paper scales with the sheet, which is most of what
          // tells you the camera is moving and not the cards.
          backgroundImage: [
            `repeating-linear-gradient(0deg, rgba(142,45,226,0.1) 0 1px, transparent 1px 48px)`,
            `repeating-linear-gradient(90deg, rgba(142,45,226,0.1) 0 1px, transparent 1px 48px)`,
            `repeating-linear-gradient(0deg, rgba(74,30,134,0.16) 0 1.5px, transparent 1.5px 240px)`,
            `repeating-linear-gradient(90deg, rgba(74,30,134,0.16) 0 1.5px, transparent 1.5px 240px)`,
          ].join(", "),
        }}
      >
        <Route wash={wash} />
        {STOPS.map((s, n) => (
          <Box
            key={s.key}
            ref={(el: HTMLDivElement | null) => {
              frames.current[n] = el;
            }}
            onClick={onPick ? () => onPick(n) : undefined}
            sx={{
              position: "absolute",
              left: s.x,
              top: s.y,
              width: s.w,
              transform: `translate(-50%, calc(-50% + 19px)) rotate(${s.rot}deg)`,
              "--dim": 0.22,
              cursor: onPick ? "pointer" : "default",
            }}
          >
            <Frame stop={s} />
          </Box>
        ))}
      </Box>

      {children}
    </Box>
  );
}

export default React.memo(Stage);
