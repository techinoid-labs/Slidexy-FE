"use client";

import React from "react";
import { STAGE_HEIGHT, STAGE_WIDTH } from "../tokens";
import type { BlockFrame } from "../types";
import { clampFrame } from "../freeCanvasUtil";

/**
 * Free-canvas placement: drag, resize, rotate.
 *
 * The slide is drawn at a fixed 960x540 and CSS-scaled to fit the workspace,
 * so every pointer delta has to be divided by that scale before it becomes a
 * coordinate — otherwise a block moves faster than the cursor at any zoom
 * other than 100%. The scale is measured from the stage element rather than
 * passed in, so this stays correct however the editor chooses to size things.
 */

const HANDLE = 9;
const SNAP = 6; // px, in stage space
const MIN_W = 48;
const MIN_H = 28;

const CHROME = {
  accent: "#8E2DE2",
  handle: "#ffffff",
  guide: "#f43f5e",
};

export interface Guides {
  v: number[];
  h: number[];
}

type HandleId =
  | "nw" | "n" | "ne"
  | "w"  |       "e"
  | "sw" | "s" | "se"
  | "rotate";

const HANDLES: Array<{ id: HandleId; cx: number; cy: number; cursor: string }> = [
  { id: "nw", cx: 0,   cy: 0,   cursor: "nwse-resize" },
  { id: "n",  cx: 0.5, cy: 0,   cursor: "ns-resize" },
  { id: "ne", cx: 1,   cy: 0,   cursor: "nesw-resize" },
  { id: "w",  cx: 0,   cy: 0.5, cursor: "ew-resize" },
  { id: "e",  cx: 1,   cy: 0.5, cursor: "ew-resize" },
  { id: "sw", cx: 0,   cy: 1,   cursor: "nesw-resize" },
  { id: "s",  cx: 0.5, cy: 1,   cursor: "ns-resize" },
  { id: "se", cx: 1,   cy: 1,   cursor: "nwse-resize" },
];

/** Measures how much the stage is visually scaled right now. */
function stageScale(el: HTMLElement | null): number {
  const stage = el?.closest("[data-slide-spec]") as HTMLElement | null;
  if (!stage) return 1;
  const rect = stage.getBoundingClientRect();
  return rect.width > 0 ? rect.width / STAGE_WIDTH : 1;
}

/** Snaps a value to nearby candidates, returning the value and what it hit. */
function snapTo(value: number, candidates: number[]): { value: number; hit: number | null } {
  let best: number | null = null;
  let bestDist = SNAP;
  for (const c of candidates) {
    const d = Math.abs(value - c);
    if (d < bestDist) {
      bestDist = d;
      best = c;
    }
  }
  return best === null ? { value, hit: null } : { value: best, hit: best };
}

export interface FreeBlockProps {
  frame: BlockFrame;
  selected: boolean;
  /** Frames of the other framed blocks, used for alignment snapping. */
  peers: BlockFrame[];
  onSelect: () => void;
  onChange: (next: BlockFrame, committed: boolean) => void;
  children: React.ReactNode;
}

export const FreeBlock: React.FC<FreeBlockProps> = ({
  frame,
  selected,
  peers,
  onSelect,
  onChange,
  children,
}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [guides, setGuides] = React.useState<Guides>({ v: [], h: [] });
  const [live, setLive] = React.useState<BlockFrame | null>(null);

  const f = live ?? frame;

  // Candidate lines: slide edges, slide centre, and every peer's edges/centre.
  const candidates = React.useMemo(() => {
    const v = [0, STAGE_WIDTH / 2, STAGE_WIDTH];
    const h = [0, STAGE_HEIGHT / 2, STAGE_HEIGHT];
    for (const p of peers) {
      v.push(p.x, p.x + p.w / 2, p.x + p.w);
      h.push(p.y, p.y + p.h / 2, p.y + p.h);
    }
    return { v, h };
  }, [peers]);

  const begin = (
    e: React.MouseEvent,
    mode: "move" | HandleId
  ) => {
    e.stopPropagation();
    e.preventDefault();
    onSelect();

    const scale = stageScale(ref.current);
    const start = { mx: e.clientX, my: e.clientY, ...frame };
    let latest = { ...frame };

    const onMove = (ev: MouseEvent) => {
      const dx = (ev.clientX - start.mx) / scale;
      const dy = (ev.clientY - start.my) / scale;
      const next: BlockFrame = { ...start };
      const hitV: number[] = [];
      const hitH: number[] = [];

      if (mode === "move") {
        next.x = start.x + dx;
        next.y = start.y + dy;

        if (!ev.altKey) {
          // Snap whichever of left/centre/right is closest, same vertically.
          const left = snapTo(next.x, candidates.v);
          const centre = snapTo(next.x + next.w / 2, candidates.v);
          const right = snapTo(next.x + next.w, candidates.v);
          if (left.hit !== null) { next.x = left.value; hitV.push(left.hit); }
          else if (centre.hit !== null) { next.x = centre.value - next.w / 2; hitV.push(centre.hit); }
          else if (right.hit !== null) { next.x = right.value - next.w; hitV.push(right.hit); }

          const top = snapTo(next.y, candidates.h);
          const middle = snapTo(next.y + next.h / 2, candidates.h);
          const bottom = snapTo(next.y + next.h, candidates.h);
          if (top.hit !== null) { next.y = top.value; hitH.push(top.hit); }
          else if (middle.hit !== null) { next.y = middle.value - next.h / 2; hitH.push(middle.hit); }
          else if (bottom.hit !== null) { next.y = bottom.value - next.h; hitH.push(bottom.hit); }
        }
      } else if (mode === "rotate") {
        const cx = start.x + start.w / 2;
        const cy = start.y + start.h / 2;
        const el = ref.current?.closest("[data-slide-spec]") as HTMLElement | null;
        const box = el?.getBoundingClientRect();
        if (box) {
          const px = (ev.clientX - box.left) / scale;
          const py = (ev.clientY - box.top) / scale;
          let deg = (Math.atan2(py - cy, px - cx) * 180) / Math.PI + 90;
          // Shift snaps to 15° increments.
          if (ev.shiftKey) deg = Math.round(deg / 15) * 15;
          next.rotation = Math.round(deg);
        }
      } else {
        const m = mode;
        if (m.includes("w")) { next.x = start.x + dx; next.w = start.w - dx; }
        if (m.includes("e")) { next.w = start.w + dx; }
        if (m.includes("n")) { next.y = start.y + dy; next.h = start.h - dy; }
        if (m.includes("s")) { next.h = start.h + dy; }

        // Shift keeps the aspect ratio on corner handles.
        if (ev.shiftKey && m.length === 2) {
          const ratio = start.w / start.h;
          next.h = next.w / ratio;
          if (m.includes("n")) next.y = start.y + start.h - next.h;
        }

        if (next.w < MIN_W) { if (m.includes("w")) next.x = start.x + start.w - MIN_W; next.w = MIN_W; }
        if (next.h < MIN_H) { if (m.includes("n")) next.y = start.y + start.h - MIN_H; next.h = MIN_H; }
      }

      next.x = Math.round(next.x);
      next.y = Math.round(next.y);
      next.w = Math.round(next.w);
      next.h = Math.round(next.h);

      // Blocks stay on the slide: off-slide content is clipped on export,
      // and it would carry the selection handles out of reach too.
      const bounded = clampFrame(next);

      latest = bounded;
      setLive(bounded);
      setGuides({ v: hitV, h: hitH });
    };

    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      setGuides({ v: [], h: [] });
      setLive(null);
      // Commit once, on release, so the undo history gets one entry per
      // gesture rather than one per mouse move.
      onChange(latest, true);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  return (
    <>
      <div
        ref={ref}
        data-free-block
        onMouseDown={(e) => begin(e, "move")}
        style={{
          position: "absolute",
          left: f.x,
          top: f.y,
          width: f.w,
          height: f.h,
          transform: f.rotation ? `rotate(${f.rotation}deg)` : undefined,
          transformOrigin: "center center",
          zIndex: 10 + (f.z ?? 0),
          outline: selected ? `1.5px solid ${CHROME.accent}` : "none",
          cursor: "move",
          boxSizing: "border-box",
        }}
      >
        <div style={{ width: "100%", height: "100%", overflow: "hidden" }}>{children}</div>

        {selected && (
          <>
            {HANDLES.map((h) => (
              <div
                key={h.id}
                onMouseDown={(e) => begin(e, h.id)}
                style={{
                  position: "absolute",
                  left: `calc(${h.cx * 100}% - ${HANDLE / 2}px)`,
                  top: `calc(${h.cy * 100}% - ${HANDLE / 2}px)`,
                  width: HANDLE,
                  height: HANDLE,
                  background: CHROME.handle,
                  border: `1.5px solid ${CHROME.accent}`,
                  borderRadius: 2,
                  cursor: h.cursor,
                  zIndex: 2,
                }}
              />
            ))}

            {/* Rotate grip lives just INSIDE the bottom-right corner.
                Outside the block it is unusable: above, the block toolbar
                covers it; below, it falls past the slide edge, which is
                clipped. Inside, it is reachable wherever the block sits. */}
            <div
              onMouseDown={(e) => begin(e, "rotate")}
              title="Rotate (hold Shift for 15° steps)"
              style={{
                position: "absolute",
                right: 20,
                bottom: 4,
                width: HANDLE + 3,
                height: HANDLE + 3,
                background: CHROME.accent,
                border: `1.5px solid ${CHROME.handle}`,
                borderRadius: "50%",
                cursor: "grab",
                zIndex: 3,
                boxShadow: "0 1px 4px rgba(0,0,0,0.35)",
              }}
            />
          </>
        )}
      </div>

      {/* Alignment guides, drawn across the whole stage while dragging */}
      {guides.v.map((x, i) => (
        <div
          key={`v${i}`}
          style={{
            position: "absolute",
            left: x,
            top: 0,
            width: 1,
            height: STAGE_HEIGHT,
            background: CHROME.guide,
            pointerEvents: "none",
            zIndex: 500,
          }}
        />
      ))}
      {guides.h.map((y, i) => (
        <div
          key={`h${i}`}
          style={{
            position: "absolute",
            left: 0,
            top: y,
            width: STAGE_WIDTH,
            height: 1,
            background: CHROME.guide,
            pointerEvents: "none",
            zIndex: 500,
          }}
        />
      ))}
    </>
  );
};
