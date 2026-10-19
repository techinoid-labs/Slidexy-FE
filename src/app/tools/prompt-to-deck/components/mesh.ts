/**
 * The sheet.
 *
 * One description of the water, shared by everything standing on it.
 * The mesh is drawn on a canvas and the cubes are real elements, which
 * are two completely different rendering paths, so the only way they can
 * belong to the same surface is to be told about it by the same code.
 * Both read `swell` at the same instant off the same clock, so a cube
 * sits exactly where its cell of the grid went.
 */

/** Cell of the ruling, in screen pixels. Also the size of a cube. */
export const CELL = 38;
/** How far the sheet heaves, and how far it bows sideways. */
export const AMP = 24;
export const SWAY = 10;
/** Cells travelled a second. */
export const DRIFT = 0.42;

export const INK = "74,30,134";

/**
 * Pointer parallax. The mesh owns it because the mesh owns the pointer
 * handler; anything standing on the sheet reads it so it leans too.
 */
export const camera = { lean: 0 };

/** Columns of the grid, and where its first one starts. */
export const columns = (w: number) => Math.ceil(w / CELL) + 3;
export const originX = (w: number) => (w - (columns(w) - 1) * CELL) / 2;

/** The two swells, as a single signed figure at a point. */
export const swell = (x: number, y: number, w: number, h: number, t: number) =>
  Math.sin((x / w) * 5.1 + (y / h) * 3.2 - t * 0.95) * 0.58 +
  Math.sin((x / w) * -3.4 + (y / h) * 6.7 + t * 0.64) * 0.42;

/** How hard the sheet heaves at a given height. The near half moves
 *  more, which is where the depth comes from. */
export const lift = (y: number, h: number) => AMP * (0.4 + 0.6 * (y / h));

/** Where a point of the grid actually lands once the water has it. */
export function settle(bx: number, by: number, w: number, h: number, t: number) {
  const d = swell(bx, by, w, h, t);
  return { d, x: bx + d * SWAY + camera.lean, y: by + d * lift(by, h) };
}

/**
 * The ramp the mesh fades on: nothing at the top of the page, full
 * strength at the foot. Anything standing on the sheet uses it too, or
 * it hangs in front of a surface that has already faded out.
 */
export function haze(y: number, h: number) {
  const v = Math.max(0, Math.min(1, y / h));
  return v < 0.46 ? (v / 0.46) * 0.52 : 0.52 + ((v - 0.46) / 0.54) * 0.48;
}

/* --------------------------------------------------------- isometric */

/**
 * The lattice is isometric: two families of lines at thirty degrees
 * instead of a square ruling. One step along a line moves you CX across
 * and CY down, so the cells are diamonds and the sheet reads as a floor
 * seen from a corner rather than a wall seen head on.
 */
export const CX = CELL * Math.cos(Math.PI / 6);
export const CY = CELL * 0.5;
/** Vertical period of the lattice, which is what the drift wraps on. */
export const PERIOD = 2 * CY;

/** How far the whole lattice has travelled toward you by now. */
export const shift = (t: number) => ((t * DRIFT * PERIOD) % PERIOD + PERIOD) % PERIOD;

/**
 * The colour of the sheet, top to bottom: lilac at the masthead,
 * violet through the middle, plum at the foot. One ramp, so the mesh
 * and anything standing on it are the same purple at the same height.
 */
export const RAMP: { at: number; rgb: string }[] = [
  { at: 0, rgb: "176,116,240" },
  { at: 0.46, rgb: "142,45,226" },
  { at: 1, rgb: "74,30,134" },
];
