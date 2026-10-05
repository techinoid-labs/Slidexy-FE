/**
 * Frame helpers that must be importable outside the block renderer.
 *
 * Kept separate from freeCanvas.tsx so the editor can compute a starting
 * frame without pulling the interaction component (and React) into its
 * module graph.
 */
import { STAGE_HEIGHT, STAGE_WIDTH } from "./tokens";
import type { BlockFrame } from "./types";

const MIN_W = 48;
const MIN_H = 28;

/** Where a block currently sits on the stage, in stage coordinates. */
export function frameFromElement(el: HTMLElement): BlockFrame {
  const stage = el.closest("[data-slide-spec]") as HTMLElement | null;
  if (!stage) return { x: 80, y: 80, w: 320, h: 180 };
  const s = stage.getBoundingClientRect();
  const r = el.getBoundingClientRect();
  // The stage is CSS-scaled to fit the workspace; undo that so the frame is
  // stored in the slide's own 960x540 space.
  const scale = s.width > 0 ? s.width / STAGE_WIDTH : 1;
  return clampFrame({
    x: Math.round((r.left - s.left) / scale),
    y: Math.round((r.top - s.top) / scale),
    w: Math.max(MIN_W, Math.round(r.width / scale)),
    h: Math.max(MIN_H, Math.round(r.height / scale)),
  });
}


/**
 * Keeps a frame on the slide.
 *
 * Anything pushed past 960x540 is clipped in both the editor and the export,
 * so letting a block bleed off only hides the user's content — and it would
 * take the selection handles out of reach with it.
 */
export function clampFrame(f: BlockFrame): BlockFrame {
  const w = Math.min(Math.max(f.w, MIN_W), STAGE_WIDTH);
  const h = Math.min(Math.max(f.h, MIN_H), STAGE_HEIGHT);
  return {
    ...f,
    w,
    h,
    x: Math.min(Math.max(f.x, 0), STAGE_WIDTH - w),
    y: Math.min(Math.max(f.y, 0), STAGE_HEIGHT - h),
  };
}
