"use client";

import React from "react";
import type { ThemePalette } from "./types";

/**
 * The 3D asset library.
 *
 * WHY IT IS BUILT THE WAY IT IS
 *
 * Catalogue decks that read as designed almost always carry one dimensional
 * object, large, in the deck's own colour. Buying or rendering those as
 * pictures would cost us the only thing we sell: a picture lands in
 * PowerPoint as a picture, and the customer cannot recolour it, resize it,
 * or pull it apart.
 *
 * So every asset is drawn twice, and the two halves have nothing to do with
 * each other:
 *
 *   1. THE ARTWORK. True isometric SVG, projected at the real 30 degrees,
 *      with per-face shading, edge highlights and a contact shadow. It is
 *      marked `data-ppt-skip`, which means the exporter walks straight past
 *      it, which in turn means it may use anything at all: gradients,
 *      strokes, opacity, whatever looks best. Nothing here is constrained
 *      by the export, because none of it is exported.
 *
 *   2. THE EXPORT HULLS. One invisible div per solid, carrying the solid's
 *      colour and a `data-ppt-shape`, at `opacity: 0`. These draw nothing
 *      on screen. On export each becomes a real PowerPoint preset: a cube,
 *      a can, a hexagon, an ellipse. PowerPoint draws the geometry itself
 *      and the customer gets objects they can recolour, resize and move.
 *
 * The honest trade: the editor and any image export get the rich artwork,
 * and PowerPoint gets simpler but genuinely editable 3D primitives in the
 * same places and colours. That is a far better bargain than a flat picture
 * in both.
 *
 * The hulls are invisible and easy to mistake for dead markup. They are the
 * opposite: they are the only part of an asset that survives the export.
 * `opacity: 0` rather than `display: none`, because the exporter measures
 * the element's rectangle and a hidden element has none.
 *
 * ADDING AN ASSET: describe it as solids in world space and let the
 * projection do the work. Pick the PowerPoint preset each solid should
 * become. If a solid has no sensible preset, it does not belong here.
 */

export interface Asset3DProps {
  palette: ThemePalette;
  /** Base colour. Defaults to the theme accent. */
  color?: string;
  /** Width in px. Height follows each asset's own proportion. */
  size?: number;
}

export interface Asset3DMeta {
  name: string;
  /** What its hulls export as. */
  pptShape: string;
  /** What it is for, so a template author picks on purpose. */
  use: string;
  /** Height as a multiple of width, so a row can share a cap height. */
  aspect: number;
}

// ───────────────────────────────────────────────────────── colour handling

function parse(color: string): [number, number, number] {
  const c = (color || "").trim();
  if (c.startsWith("rgb")) {
    const n = c.match(/[\d.]+/g);
    if (n && n.length >= 3) return [+n[0], +n[1], +n[2]];
    return [0, 0, 0];
  }
  let hex = c.replace("#", "");
  if (hex.length === 3) hex = hex.split("").map((ch) => ch + ch).join("");
  if (hex.length !== 6) return [0, 0, 0];
  return [
    parseInt(hex.slice(0, 2), 16),
    parseInt(hex.slice(2, 4), 16),
    parseInt(hex.slice(4, 6), 16),
  ];
}

/** Mixes toward white (positive) or black (negative). */
function shade(color: string, amount: number): string {
  const [r, g, b] = parse(color);
  const t = amount > 0 ? 255 : 0;
  const k = Math.abs(amount);
  const m = (v: number) => Math.round(v + (t - v) * k);
  return `rgb(${m(r)}, ${m(g)}, ${m(b)})`;
}

/**
 * One light source for the whole library, high and to the left. Assets lit
 * differently stop reading as one set, which is the point of a set.
 */
const TOP = 0.26;
const LEFT = -0.04;
const RIGHT = -0.3;

// ─────────────────────────────────────────────── isometric projection

const COS30 = Math.cos(Math.PI / 6);
const SIN30 = 0.5;

/** World (x, y, z) to screen. z is up. */
function project(x: number, y: number, z: number): [number, number] {
  return [(x - y) * COS30, (x + y) * SIN30 - z];
}

type Pt = [number, number];
const pts = (ps: Pt[]) => ps.map((p) => `${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(" ");

/** Which way a face points, which decides how its gradient runs. */
type FaceKind = "top" | "left" | "right";

interface Solid {
  /** Polygons to paint, back to front. */
  faces: Array<{ points?: string; d?: string; tone: number; kind: FaceKind }>;
  /** Screen bounding box, for placing the export hull. */
  box: { x: number; y: number; w: number; h: number };
  shape: string;
  /**
   * Painter's-algorithm key: distance from the viewer along the isometric
   * axis. A scene drawn in the order it was written looks right until
   * someone adds a solid behind an existing one, and then a block in the
   * back row is painted over the one in front of it.
   */
  depth: number;
}

/** An axis-aligned box: origin corner, then width, depth and height. */
function solidBox(x: number, y: number, z: number, w: number, d: number, h: number): Solid {
  const p = (dx: number, dy: number, dz: number) => project(x + dx, y + dy, z + dz);

  const top: Pt[] = [p(0, 0, h), p(w, 0, h), p(w, d, h), p(0, d, h)];
  const left: Pt[] = [p(0, d, h), p(w, d, h), p(w, d, 0), p(0, d, 0)];
  const right: Pt[] = [p(w, 0, h), p(w, d, h), p(w, d, 0), p(w, 0, 0)];

  const all = [...top, ...left, ...right];
  const xs = all.map((q) => q[0]);
  const ys = all.map((q) => q[1]);

  return {
    faces: [
      { points: pts(top), tone: TOP, kind: "top" },
      { points: pts(left), tone: LEFT, kind: "left" },
      { points: pts(right), tone: RIGHT, kind: "right" },
    ],
    box: {
      x: Math.min(...xs),
      y: Math.min(...ys),
      w: Math.max(...xs) - Math.min(...xs),
      h: Math.max(...ys) - Math.min(...ys),
    },
    shape: "cube",
    depth: x + y + z,
  };
}

/**
 * A column on an arbitrary footprint.
 *
 * `solidBox` can only make axis-aligned boxes, which is why the library
 * came out looking like a brick yard. Give this any polygon in the ground
 * plane and it raises it to a solid, so a square turned forty degrees, a
 * hexagonal pillar or a fanned card all become real geometry rather than
 * another box.
 *
 * Only the walls facing the camera are drawn. In this projection the viewer
 * sees the +x and +y sides, so a wall is visible when its outward normal
 * satisfies nx + ny > 0.
 */
function solidColumn(footprint: Pt[], z: number, h: number, shape = "cube"): Solid {
  const topPts = footprint.map(([x, y]) => project(x, y, z + h));
  const botPts = footprint.map(([x, y]) => project(x, y, z));

  const walls = footprint
    .map((_, i) => {
      const j = (i + 1) % footprint.length;
      const [ax, ay] = footprint[i];
      const [bx, by] = footprint[j];
      // Outward normal of the edge, for a footprint wound anticlockwise.
      const nx = by - ay;
      const ny = -(bx - ax);
      return { i, j, facing: nx + ny };
    })
    .filter((w) => w.facing > 0)
    .sort((a, b) => a.facing - b.facing);

  const all = [...topPts, ...botPts];

  return {
    faces: [
      ...walls.map((w) => ({
        points: pts([topPts[w.i], topPts[w.j], botPts[w.j], botPts[w.i]]),
        tone: w.facing > 0.6 ? LEFT : RIGHT,
        kind: (w.facing > 0.6 ? "left" : "right") as FaceKind,
      })),
      { points: pts(topPts), tone: TOP, kind: "top" as FaceKind },
    ],
    box: bboxOf(all),
    shape,
    depth:
      footprint.reduce((n, p) => n + p[0] + p[1], 0) / footprint.length + z,
  };
}

/** A square footprint of side `s`, centred on the origin, turned `deg`. */
function squareAt(cx: number, cy: number, s: number, deg: number): Pt[] {
  const a = (deg * Math.PI) / 180;
  const h = s / 2;
  return ([[-h, -h], [h, -h], [h, h], [-h, h]] as Pt[]).map(([x, y]) => [
    cx + x * Math.cos(a) - y * Math.sin(a),
    cy + x * Math.sin(a) + y * Math.cos(a),
  ]);
}

/**
 * Extrusion: how anything that is not a box gets made.
 *
 * A library of boxes is a library of one idea. Everything else worth having
 * (a star, a cog, an arrow, a bolt, a pie wedge) starts as a flat outline,
 * and pushing that outline back along the isometric axis turns it into a
 * solid object with a lit face, a side wall and a shadowed back.
 *
 * The draw order does the occlusion for us: the back copy first, then the
 * wall quads that close the gap, then the lit face over the top. No depth
 * buffer needed, and it works for any outline, convex or not.
 *
 * Each extruded object still names the PowerPoint preset it exports as, so
 * a 3D star in the editor arrives as a real, editable five-point star.
 */
const EXTRUDE_DIR: Pt = [0.5, 0.3];

function bboxOf(points: Pt[]) {
  const xs = points.map((p) => p[0]);
  const ys = points.map((p) => p[1]);
  return {
    x: Math.min(...xs),
    y: Math.min(...ys),
    w: Math.max(...xs) - Math.min(...xs),
    h: Math.max(...ys) - Math.min(...ys),
  };
}

function extruded(outline: Pt[], depth: number, shape: string, lift = 0): Solid {
  const off: Pt = [EXTRUDE_DIR[0] * depth, EXTRUDE_DIR[1] * depth];
  const front: Pt[] = outline.map((p) => [p[0], p[1] - lift]);
  const back: Pt[] = front.map((p) => [p[0] + off[0], p[1] + off[1]]);

  const walls = front.map((p, i) => {
    const j = (i + 1) % front.length;
    return pts([front[i], front[j], back[j], back[i]]);
  });

  return {
    faces: [
      { points: pts(back), tone: RIGHT, kind: "right" },
      ...walls.map((points) => ({ points, tone: LEFT, kind: "left" as FaceKind })),
      { points: pts(front), tone: TOP, kind: "top" as FaceKind },
    ],
    box: bboxOf([...front, ...back]),
    shape,
    depth: 0,
  };
}

// ── outline generators ───────────────────────────────────────────────────

function polygonOutline(sides: number, r: number, rotate = -Math.PI / 2): Pt[] {
  return Array.from({ length: sides }, (_, i) => {
    const a = rotate + (i * 2 * Math.PI) / sides;
    return [Math.cos(a) * r, Math.sin(a) * r] as Pt;
  });
}

function starOutline(points: number, rOuter: number, rInner: number): Pt[] {
  return Array.from({ length: points * 2 }, (_, i) => {
    const r = i % 2 === 0 ? rOuter : rInner;
    const a = -Math.PI / 2 + (i * Math.PI) / points;
    return [Math.cos(a) * r, Math.sin(a) * r] as Pt;
  });
}

function gearOutline(teeth: number, rOuter: number, rInner: number): Pt[] {
  const out: Pt[] = [];
  const step = (Math.PI * 2) / teeth;
  for (let i = 0; i < teeth; i++) {
    const a = i * step;
    const w = step * 0.26;
    out.push([Math.cos(a - w) * rInner, Math.sin(a - w) * rInner]);
    out.push([Math.cos(a - w * 0.6) * rOuter, Math.sin(a - w * 0.6) * rOuter]);
    out.push([Math.cos(a + w * 0.6) * rOuter, Math.sin(a + w * 0.6) * rOuter]);
    out.push([Math.cos(a + w) * rInner, Math.sin(a + w) * rInner]);
  }
  return out;
}

/** An arrow climbing to the right, for growth. */
function arrowOutline(len: number, body: number, head: number): Pt[] {
  return [
    [-len, body],
    [len - head, body],
    [len - head, body + head * 0.55],
    [len + head * 0.5, 0],
    [len - head, -body - head * 0.55],
    [len - head, -body],
    [-len, -body],
  ];
}

function boltOutline(s: number): Pt[] {
  return [
    [0.1 * s, -1.0 * s],
    [0.72 * s, -1.0 * s],
    [0.26 * s, -0.16 * s],
    [0.78 * s, -0.16 * s],
    [-0.16 * s, 1.0 * s],
    [0.04 * s, 0.1 * s],
    [-0.5 * s, 0.1 * s],
  ];
}

/** A wedge of a pie, for a share of something. */
function pieOutline(r: number, fromDeg: number, toDeg: number, steps = 14): Pt[] {
  const out: Pt[] = [[0, 0]];
  for (let i = 0; i <= steps; i++) {
    const a = ((fromDeg + ((toDeg - fromDeg) * i) / steps) * Math.PI) / 180;
    out.push([Math.cos(a) * r, Math.sin(a) * r]);
  }
  return out;
}

/** A chevron, with the notch cut out of its back edge. */
function chevronOutline(w: number, h: number, t: number): Pt[] {
  return [
    [-w, -h],
    [-w + t, -h],
    [w, 0],
    [-w + t, h],
    [-w, h],
    [w - t, 0],
  ];
}

/** A rounded blob, for something organic among all the hard edges. */
function blobOutline(r: number, lobes = 7): Pt[] {
  return Array.from({ length: 48 }, (_, i) => {
    const a = (i / 48) * Math.PI * 2;
    const k = r * (1 + 0.14 * Math.sin(a * 3) + 0.08 * Math.cos(a * 5) + 0.05 * Math.sin(a * lobes));
    return [Math.cos(a) * k, Math.sin(a) * k] as Pt;
  });
}

/**
 * How a face is painted.
 *
 * A flat fill per face reads as a diagram. Real objects have light falling
 * across a surface, a bright edge where it turns, and a darker foot where
 * it meets the ground. Each face therefore gets a gradient with a lit
 * shoulder, a body tone and a shaded foot, plus a narrow specular band that
 * gives the surface the slight sheen of a finished material.
 *
 * None of this costs anything on export: the artwork is skipped and the
 * invisible hull carries the flat colour PowerPoint needs.
 */
const FACE_PAINT: Record<FaceKind, { from: [number, number]; to: [number, number]; lift: number }> = {
  // Light arrives high and to the left, so the top face brightens across
  // its upper-left shoulder and falls away to the far corner.
  top: { from: [0, 0], to: [1, 1], lift: 0.2 },
  left: { from: [0, 0], to: [0.25, 1], lift: 0.14 },
  right: { from: [0, 0], to: [0.35, 1], lift: 0.1 },
};

/**
 * A metallic finish.
 *
 * The difference between a plastic surface and a metal one is not the
 * colour, it is how many times the light changes direction across the
 * face. A matte face has one soft ramp; chrome has a bright band, a dark
 * band and a second bright band, with hard transitions between them.
 *
 * These stops are deliberately uneven. Evenly spaced bands read as a
 * striped pattern rather than as a reflection.
 */
const METAL_STOPS: Array<[number, number]> = [
  [0, -0.22],
  [12, 0.46],
  [26, 0.02],
  [40, -0.3],
  [52, 0.62],
  [64, 0.1],
  [80, -0.26],
  [100, 0.22],
];

/** A scene is a list of solids plus the ellipses and arcs drawn with them. */
interface Scene {
  solids: Solid[];
  /** Paints every face as polished metal rather than a matte surface. */
  metal?: boolean;
  /**
   * Extra artwork drawn in projected space, after the solids. `grad` hands
   * back the same shaded gradients the solids use, so a drawn cylinder
   * matches a projected box standing next to it.
   */
  extras?: (c: { base: string; grad: (kind: FaceKind, tone?: number) => string }) => React.ReactNode;
  /** Ground shadow, in projected units. */
  shadow?: { cx: number; cy: number; rx: number; ry: number };
  /**
   * Several shadows, for a composition whose parts float at different
   * heights. One shadow under a floating tile is what tells the eye it is
   * floating rather than simply drawn higher up.
   */
  shadows?: Array<{ cx: number; cy: number; rx: number; ry: number; o?: number }>;
}

function sceneBBox(scene: Scene) {
  const boxes = scene.solids.map((s) => s.box);
  const x0 = Math.min(...boxes.map((b) => b.x));
  const y0 = Math.min(...boxes.map((b) => b.y));
  const x1 = Math.max(...boxes.map((b) => b.x + b.w));
  const y1 = Math.max(...boxes.map((b) => b.y + b.h));
  return { x0, y0, w: x1 - x0, h: y1 - y0 };
}

/**
 * Draws a scene: the artwork as one skipped SVG, and one invisible hull per
 * solid so the export gets real geometry in the right places.
 */
const SceneView: React.FC<{ scene: Scene; base: string; size: number; pad?: number }> = ({
  scene,
  base,
  size,
  pad = 0.5,
}) => {
  // Gradient ids are document-global, and `useId` is only unique within one
  // React root. A page that renders several decks in separate roots, which
  // the catalogue does, hands every asset the same ids, and the first
  // definition on the page then colours all of them.
  //
  // Keying the id by the colour fixes it by construction: two assets that
  // collide are the same colour and therefore want the same definition.
  // The finish is part of the key: a polished and a matte object of the
  // same colour want different definitions, and sharing an id would give
  // both of them whichever one the page happened to define first.
  const shadowId =
    "a3d" +
    (scene.metal ? "m" : "s") +
    parse(base).map((n) => n.toString(16).padStart(2, "0")).join("");
  const bb = sceneBBox(scene);
  const vb = { x: bb.x0 - pad, y: bb.y0 - pad, w: bb.w + pad * 2, h: bb.h + pad * 2 };
  const scale = size / vb.w;
  const height = vb.h * scale;

  // Hull position as a percentage of the drawn box, so it tracks the art
  // at any size without a second projection pass.
  const place = (b: Solid["box"]) => ({
    left: `${((b.x - vb.x) / vb.w) * 100}%`,
    top: `${((b.y - vb.y) / vb.h) * 100}%`,
    width: `${(b.w / vb.w) * 100}%`,
    height: `${(b.h / vb.h) * 100}%`,
  });

  return (
    <div style={{ position: "relative", width: size, height }}>
      <svg
        data-ppt-skip="1"
        viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`}
        width={size}
        height={height}
        aria-hidden
        focusable="false"
        style={{ display: "block", overflow: "visible" }}
      >
        {/* The contact shadow has to fade out. A flat ellipse at any opacity
            reads as a grey disc lying on the slide rather than as light. */}
        <defs>
          <radialGradient id={shadowId}>
            <stop offset="0%" stopColor="rgba(0,0,0,0.26)" />
            <stop offset="55%" stopColor="rgba(0,0,0,0.12)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>

          {(Object.keys(FACE_PAINT) as FaceKind[]).map((kind) => {
            const paint = FACE_PAINT[kind];
            const tone = kind === "top" ? TOP : kind === "left" ? LEFT : RIGHT;
            return (
              <linearGradient
                key={kind}
                id={`${shadowId}-${kind}`}
                x1={paint.from[0]}
                y1={paint.from[1]}
                x2={paint.to[0]}
                y2={paint.to[1]}
              >
                {scene.metal ? (
                  METAL_STOPS.map(([at, lift]) => (
                    <stop key={at} offset={`${at}%`} stopColor={shade(base, tone + lift)} />
                  ))
                ) : (
                  <>
                    <stop offset="0%" stopColor={shade(base, tone + paint.lift)} />
                    <stop offset="38%" stopColor={shade(base, tone)} />
                    {/* The specular band. Narrow and slightly brighter than
                        the body tone, which is what separates a finished
                        material from a flat fill. */}
                    <stop offset="62%" stopColor={shade(base, tone + paint.lift * 0.45)} />
                    <stop offset="100%" stopColor={shade(base, tone - 0.16)} />
                  </>
                )}
              </linearGradient>
            );
          })}
        </defs>
        {[...(scene.shadow ? [scene.shadow] : []), ...(scene.shadows ?? [])].map((sh, i) => (
          <ellipse
            key={"sh" + i}
            cx={sh.cx}
            cy={sh.cy}
            rx={sh.rx * 1.15}
            ry={sh.ry * 0.85}
            fill={`url(#${shadowId})`}
            opacity={(sh as any).o ?? 1}
          />
        ))}
        {[...scene.solids].sort((a, b) => a.depth - b.depth).map((s, i) =>
          s.faces.map((f, j) =>
            f.d ? (
              <path
                key={`${i}-${j}`}
                d={f.d}
                fillRule="evenodd"
                fill={`url(#${shadowId}-${f.kind})`}
                stroke={shade(base, f.kind === "top" ? TOP + 0.3 : f.tone + 0.12)}
                strokeWidth={f.kind === "top" ? 0.016 : 0.01}
                strokeLinejoin="round"
              />
            ) : (
            <polygon
              key={`${i}-${j}`}
              points={f.points}
              fill={`url(#${shadowId}-${f.kind})`}
              // The rim light. A hairline a shade brighter than the face
              // keeps the silhouette crisp where two solids of the same
              // colour meet, which is most of a composed scene.
              stroke={shade(base, f.kind === "top" ? TOP + 0.3 : f.tone + 0.12)}
              strokeWidth={f.kind === "top" ? 0.016 : 0.01}
              strokeLinejoin="round"
            />
            )
          )
        )}
        {scene.extras?.({
          base,
          grad: (kind) => `url(#${shadowId}-${kind})`,
        })}
      </svg>

      {scene.solids.map((s, i) => (
        <div
          key={"hull" + i}
          aria-hidden
          data-ppt-shape={s.shape}
          style={{ position: "absolute", backgroundColor: base, opacity: 0, ...place(s.box) }}
        />
      ))}
    </div>
  );
};

// ───────────────────────────────────────────────────────────────── solids

const cubeScene = (): Scene => ({
  solids: [solidBox(0, 0, 0, 1, 1, 1)],
  shadow: { cx: 0, cy: 1.08, rx: 1.0, ry: 0.5 },
});

const towerScene = (): Scene => ({
  solids: [solidBox(0, 0, 0, 0.72, 0.72, 2.1)],
  shadow: { cx: 0, cy: 0.78, rx: 0.72, ry: 0.36 },
});

const slabScene = (): Scene => ({
  solids: [solidBox(0, 0, 0, 1.7, 1.7, 0.34)],
  shadow: { cx: 0, cy: 1.78, rx: 1.6, ry: 0.72 },
});

/** A cylinder: an iso box hull with drawn caps over it. */
const cylinderScene = (): Scene => {
  const r = 0.62;
  const h = 1.5;
  const topY = project(0, 0, h)[1];
  const botY = project(0, 0, 0)[1];
  const rx = r * 2 * COS30;
  const ry = r * 2 * SIN30;

  const body: Solid = {
    faces: [],
    box: { x: -rx, y: topY - ry, w: rx * 2, h: botY - topY + ry * 2 },
    shape: "can",
    depth: 0,
  };

  return {
    solids: [body],
    shadow: { cx: 0, cy: botY + 0.12, rx: rx * 1.05, ry: ry * 1.05 },
    extras: ({ base, grad }) => (
      <g>
        <path
          d={`M${-rx} ${topY} L${-rx} ${botY} A ${rx} ${ry} 0 0 0 ${rx} ${botY} L${rx} ${topY} Z`}
          fill={grad("right")}
        />
        <path
          d={`M${-rx} ${topY} L${-rx} ${botY} A ${rx} ${ry} 0 0 0 ${0} ${botY + ry} L0 ${topY + ry} Z`}
          fill={grad("left")}
        />
        <ellipse
          cx={0}
          cy={topY}
          rx={rx}
          ry={ry}
          fill={grad("top")}
          stroke={shade(base, TOP + 0.3)}
          strokeWidth="0.016"
        />
      </g>
    ),
  };
};

const sphereScene = (): Scene => {
  const r = 0.78;
  const rx = r * 2 * COS30;
  const cy = -r;
  const body: Solid = {
    faces: [],
    box: { x: -rx, y: cy - rx, w: rx * 2, h: rx * 2 },
    shape: "ellipse",
    depth: 0,
  };
  return {
    solids: [body],
    shadow: { cx: 0, cy: 0.1, rx: rx * 0.92, ry: rx * 0.42 },
    extras: ({ base }) => {
      // A sphere needs a radial falloff, not stacked circles. Three flat
      // discs read as a target; one gradient plus a tight specular reads as
      // a ball with a polished surface.
      // Keyed by colour, so two spheres of the same colour share one
      // definition and two of different colours never collide.
      const gid = "sph" + parse(base).map((n) => n.toString(16).padStart(2, "0")).join("");
      return (
        <g>
          <defs>
            <radialGradient id={gid} cx="32%" cy="26%" r="78%">
              <stop offset="0%" stopColor={shade(base, 0.42)} />
              <stop offset="42%" stopColor={shade(base, 0.06)} />
              <stop offset="82%" stopColor={shade(base, -0.24)} />
              {/* The bounce: ground light lifting the far underside, which
                  is what stops a sphere looking like a flat disc. */}
              <stop offset="100%" stopColor={shade(base, -0.08)} />
            </radialGradient>
          </defs>
          <circle cx={0} cy={cy} r={rx} fill={`url(#${gid})`} />
          <ellipse
            cx={-rx * 0.34}
            cy={cy - rx * 0.44}
            rx={rx * 0.22}
            ry={rx * 0.15}
            fill={shade(base, 0.62)}
            opacity="0.75"
          />
        </g>
      );
    },
  };
};

const prismScene = (): Scene => {
  // A hexagonal plate, drawn as a ring of six points around the centre.
  const r = 0.95;
  const h = 0.5;
  const corner = (i: number): [number, number] => {
    const a = (Math.PI / 3) * i;
    return [Math.cos(a) * r, Math.sin(a) * r];
  };
  const topPts = Array.from({ length: 6 }, (_, i) => {
    const [cx, cy] = corner(i);
    return project(cx, cy, h);
  }) as Pt[];
  const botPts = Array.from({ length: 6 }, (_, i) => {
    const [cx, cy] = corner(i);
    return project(cx, cy, 0);
  }) as Pt[];

  const all = [...topPts, ...botPts];
  const xs = all.map((q) => q[0]);
  const ys = all.map((q) => q[1]);

  const body: Solid = {
    faces: [],
    box: {
      x: Math.min(...xs),
      y: Math.min(...ys),
      w: Math.max(...xs) - Math.min(...xs),
      h: Math.max(...ys) - Math.min(...ys),
    },
    shape: "hexagon",
    depth: 0,
  };

  return {
    solids: [body],
    shadow: { cx: 0, cy: Math.max(...ys) + 0.1, rx: 1.5, ry: 0.6 },
    extras: ({ base, grad }) => {
      // A side face is visible when its outward normal points toward the
      // camera. In this projection the viewer sees the +x and +y sides, so
      // the test is nx + ny > 0. Picking face indices by hand instead is
      // what turned this into a blob with a tail.
      const sides = Array.from({ length: 6 }, (_, i) => {
        const mid = (Math.PI / 3) * (i + 0.5);
        const facing = Math.cos(mid) + Math.sin(mid);
        return { i, facing };
      })
        .filter((s) => s.facing > 0)
        .sort((a, b) => a.facing - b.facing);

      return (
        <g>
          {sides.map(({ i, facing }) => {
            const j = (i + 1) % 6;
            return (
              <polygon
                key={i}
                points={pts([topPts[i], topPts[j], botPts[j], botPts[i]])}
                fill={grad(facing > 1.2 ? "left" : "right")}
              />
            );
          })}
          <polygon
            points={pts(topPts)}
            fill={grad("top")}
            stroke={shade(base, TOP + 0.3)}
            strokeWidth="0.016"
          />
        </g>
      );
    },
  };
};

const ringScene = (): Scene => {
  const R = 1;
  const r = 0.34;
  const rx = R * 2 * COS30;
  const ry = R * 2 * SIN30;
  const body: Solid = {
    faces: [],
    box: { x: -rx, y: -ry - r, w: rx * 2, h: ry * 2 + r },
    shape: "donut",
    depth: 0,
  };
  return {
    solids: [body],
    shadow: { cx: 0, cy: ry + 0.12, rx, ry: ry * 0.6 },
    extras: ({ base }) => (
      <g>
        <ellipse cx={0} cy={0} rx={rx} ry={ry} fill="none" stroke={shade(base, -0.2)} strokeWidth={r * 1.5} />
        {/* The lit quarter, drawn as an arc. A dashed stroke with round
            caps reads as a smear rather than as light on a surface. */}
        <path
          d={`M ${-rx} 0 A ${rx} ${ry} 0 0 1 0 ${-ry}`}
          fill="none"
          stroke={shade(base, TOP)}
          strokeWidth={r * 0.9}
          strokeLinecap="round"
        />
      </g>
    ),
  };
};

/** A ramp. A real wedge, not a box: the top face slopes. */
const wedgeScene = (): Scene => {
  const w = 1.5;
  const d = 1.1;
  const h = 1.0;
  const p = (x: number, y: number, z: number) => project(x, y, z);

  const top: Pt[] = [p(0, 0, 0), p(w, 0, h), p(w, d, h), p(0, d, 0)];
  const side: Pt[] = [p(0, d, 0), p(w, d, h), p(w, d, 0)];
  const end: Pt[] = [p(w, 0, h), p(w, d, h), p(w, d, 0), p(w, 0, 0)];

  const all = [...top, ...side, ...end];
  const xs = all.map((q) => q[0]);
  const ys = all.map((q) => q[1]);

  return {
    solids: [
      {
        faces: [
          { points: pts(top), tone: TOP, kind: "top" },
          { points: pts(side), tone: LEFT, kind: "left" },
          { points: pts(end), tone: RIGHT, kind: "right" },
        ],
        box: {
          x: Math.min(...xs),
          y: Math.min(...ys),
          w: Math.max(...xs) - Math.min(...xs),
          h: Math.max(...ys) - Math.min(...ys),
        },
        shape: "cube",
        depth: 0,
      },
    ],
    shadow: { cx: 0, cy: Math.max(...ys) + 0.08, rx: 1.4, ry: 0.6 },
  };
};

// ───────────────────────────────────────────────────── composed scenes

/** Three plates stacked with a twist, the layers of a system. */
const cubeStackScene = (): Scene => ({
  solids: [
    solidBox(-0.1, -0.1, 0, 1.4, 1.4, 0.34),
    solidBox(0.05, 0.05, 0.4, 1.1, 1.1, 0.34),
    solidBox(0.2, 0.2, 0.8, 0.8, 0.8, 0.34),
  ],
  shadow: { cx: 0, cy: 1.42, rx: 1.4, ry: 0.62 },
});

/** A climb. Four boxes rising, the last one taller than the rest. */
const stepsScene = (): Scene => ({
  solids: [
    solidBox(0, 0, 0, 0.62, 0.62, 0.5),
    solidBox(0.72, 0, 0, 0.62, 0.62, 0.95),
    solidBox(1.44, 0, 0, 0.62, 0.62, 1.5),
    solidBox(2.16, 0, 0, 0.62, 0.62, 2.2),
  ],
  shadow: { cx: 0.6, cy: 1.5, rx: 2.2, ry: 0.6 },
});

/** Discs stacked. Money, volume, a reserve. */
const coinStackScene = (): Scene => {
  const r = 0.78;
  const rx = r * 2 * COS30;
  const ry = r * 2 * SIN30;
  const levels = [0, 0.34, 0.68];
  const topY = project(0, 0, levels[2] + 0.28)[1];
  const botY = project(0, 0, 0)[1];

  const body: Solid = {
    faces: [],
    box: { x: -rx, y: topY - ry, w: rx * 2, h: botY - topY + ry * 2 },
    shape: "can",
    depth: 0,
  };

  return {
    solids: [body],
    shadow: { cx: 0, cy: botY + 0.1, rx, ry },
    extras: ({ base, grad }) => (
      <g>
        {levels.map((z, i) => {
          const yTop = project(0, 0, z + 0.28)[1];
          const yBot = project(0, 0, z)[1];
          return (
            <g key={i}>
              <path
                d={`M${-rx} ${yTop} L${-rx} ${yBot} A ${rx} ${ry} 0 0 0 ${rx} ${yBot} L${rx} ${yTop} Z`}
                fill={grad("right")}
              />
              <ellipse
                cx={0}
                cy={yTop}
                rx={rx}
                ry={ry}
                fill={grad("top")}
                stroke={shade(base, TOP + 0.26)}
                strokeWidth="0.014"
              />
            </g>
          );
        })}
      </g>
    ),
  };
};

/**
 * The hero: a plinth carrying a small skyline of blocks. This is the one
 * that earns a half slide to itself.
 */
const clusterScene = (): Scene => ({
  solids: [
    solidBox(-0.3, -0.3, 0, 3.4, 3.4, 0.3),
    solidBox(0.1, 0.1, 0.3, 0.9, 0.9, 1.9),
    solidBox(1.2, 0.15, 0.3, 0.8, 0.8, 1.05),
    solidBox(0.15, 1.3, 0.3, 0.8, 0.8, 0.7),
    solidBox(1.25, 1.35, 0.3, 1.1, 1.1, 1.5),
    solidBox(2.45, 0.3, 0.3, 0.55, 0.55, 0.45),
    solidBox(0.3, 2.5, 0.3, 0.55, 0.55, 0.9),
  ],
  shadow: { cx: 0, cy: 3.3, rx: 3.2, ry: 1.3 },
});

/** A gateway: two columns and a lintel. Reads as a threshold or a step up. */
const archScene = (): Scene => ({
  solids: [
    solidBox(0, 0, 0, 0.6, 0.9, 1.9),
    solidBox(1.7, 0, 0, 0.6, 0.9, 1.9),
    solidBox(0, 0, 1.9, 2.3, 0.9, 0.55),
  ],
  shadow: { cx: 0.6, cy: 1.5, rx: 2.1, ry: 0.68 },
});

/** A grid of tiles, three of them raised. A system with parts in motion. */
const gridScene = (): Scene => {
  const solids: Solid[] = [];
  const raised: Record<string, number> = { "0,1": 0.55, "1,2": 0.95, "2,0": 0.35 };
  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      const z = raised[`${x},${y}`] ?? 0;
      solids.push(solidBox(x * 1.05, y * 1.05, z, 0.95, 0.95, 0.3));
    }
  }
  return { solids, shadow: { cx: 0, cy: 3.4, rx: 3, ry: 1.2 } };
};

// ──────────────────────────────────────── curved and faceted solids

/** A cone. Elliptical base, straight sides, a lit seam down the front. */
const coneScene = (): Scene => {
  const r = 0.9;
  const h = 2.0;
  const rx = r * 2 * COS30;
  const ry = r * 2 * SIN30;
  const apex: Pt = [0, -h];

  const body: Solid = {
    faces: [],
    box: { x: -rx, y: -h, w: rx * 2, h: h + ry },
    shape: "triangle",
    depth: 0,
  };

  return {
    solids: [body],
    shadow: { cx: 0, cy: ry * 0.9, rx, ry },
    extras: ({ base, grad }) => (
      <g>
        {/* Two halves meeting on the axis. Three overlapping paths left a
            seam down the front where the opacities stacked. */}
        <path
          d={`M0 ${ry} A ${rx} ${ry} 0 0 0 ${rx} 0 L${apex[0]} ${apex[1]} Z`}
          fill={grad("right")}
        />
        <path
          d={`M0 ${ry} A ${rx} ${ry} 0 0 1 ${-rx} 0 L${apex[0]} ${apex[1]} Z`}
          fill={grad("top")}
        />
        {/* The base ellipse's visible front lip. */}
        <path
          d={`M${-rx} 0 A ${rx} ${ry} 0 0 0 ${rx} 0`}
          fill="none"
          stroke={shade(base, TOP + 0.22)}
          strokeWidth="0.03"
          opacity="0.6"
        />
      </g>
    ),
  };
};

/** A capsule: a tube with domed ends. The softest shape in the set. */
const capsuleScene = (): Scene => {
  const r = 0.55;
  const h = 1.8;
  const rx = r * 2 * COS30;
  const ry = r * 2 * SIN30;
  const top = -h;

  const body: Solid = {
    faces: [],
    box: { x: -rx, y: top - rx * 0.78, w: rx * 2, h: h + rx * 1.56 },
    shape: "roundRect",
    depth: 0,
  };

  return {
    solids: [body],
    shadow: { cx: 0, cy: ry * 0.6, rx, ry },
    extras: ({ base, grad }) => {
      // The ends are domes, not discs. Drawn with the same ry as the
      // cylinder's caps the shape came out identical to a cylinder, which
      // is the whole reason it is a separate asset.
      const dome = rx * 0.78;
      return (
        <g>
          <path
            d={`M${-rx} ${top} L${-rx} 0 A ${rx} ${dome} 0 0 0 ${rx} 0 L${rx} ${top} Z`}
            fill={grad("right")}
          />
          <path
            d={`M${-rx} ${top} L${-rx} 0 A ${rx} ${dome} 0 0 0 0 ${dome} L0 ${top - dome} Z`}
            fill={grad("left")}
          />
          <path
            d={`M${-rx} ${top} A ${rx} ${dome} 0 0 1 ${rx} ${top} L${rx} ${top} L${-rx} ${top} Z`}
            fill={grad("top")}
          />
        </g>
      );
    },
  };
};

/** A torus. Two arcs and a hole, which no box can stand in for. */
const torusScene = (): Scene => {
  const R = 1.05;
  const t = 0.38;
  const rx = R * 2 * COS30;
  const ry = R * 2 * SIN30;

  const ring = (k: number) =>
    `M${-rx * k} 0 A ${rx * k} ${ry * k} 0 1 0 ${rx * k} 0 A ${rx * k} ${ry * k} 0 1 0 ${-rx * k} 0 Z`;

  const body: Solid = {
    faces: [
      {
        d: ring(1) + ring(1 - t),
        tone: TOP,
        kind: "top",
      },
    ],
    box: { x: -rx, y: -ry - t * 0.6, w: rx * 2, h: ry * 2 + t * 0.6 },
    shape: "donut",
    depth: 0,
  };

  return {
    solids: [body],
    shadow: { cx: 0, cy: ry * 0.95, rx, ry: ry * 0.7 },
    extras: ({ base }) => (
      <g>
        {/* The underside of the far wall, which gives the ring thickness. */}
        <path
          d={`M${-rx} 0 A ${rx} ${ry} 0 0 0 ${rx} 0`}
          fill="none"
          stroke={shade(base, RIGHT)}
          strokeWidth={t * 0.9}
        />
        <path
          d={`M${-rx * 0.86} ${-ry * 0.22} A ${rx * 0.86} ${ry * 0.86} 0 0 1 ${rx * 0.2} ${-ry * 0.92}`}
          fill="none"
          stroke={shade(base, TOP + 0.26)}
          strokeWidth={t * 0.34}
          strokeLinecap="round"
          opacity="0.9"
        />
      </g>
    ),
  };
};

/** A pyramid. Two visible faces meeting at a ridge. */
const pyramidScene = (): Scene => {
  const b = 1.1;
  const h = 1.8;
  const apex = project(b / 2, b / 2, h);
  const c0 = project(0, 0, 0);
  const c1 = project(b, 0, 0);
  const c2 = project(b, b, 0);
  const c3 = project(0, b, 0);

  const all = [apex, c0, c1, c2, c3];

  return {
    solids: [
      {
        faces: [
          { points: pts([c3, c2, apex]), tone: LEFT, kind: "left" },
          { points: pts([c2, c1, apex]), tone: RIGHT, kind: "right" },
          { points: pts([c0, c3, apex]), tone: TOP, kind: "top" },
        ],
        box: bboxOf(all),
        shape: "triangle",
        depth: 0,
      },
    ],
    shadow: { cx: 0, cy: project(b / 2, b / 2, 0)[1] + 0.1, rx: b * 1.3, ry: b * 0.6 },
  };
};

// ────────────────────────────────────────────── extruded objects

const starScene = (): Scene => ({
  solids: [extruded(starOutline(5, 1.15, 0.5), 0.42, "star5")],
  shadow: { cx: 0.1, cy: 1.35, rx: 1.1, ry: 0.42 },
});

const badgeScene = (): Scene => ({
  solids: [extruded(starOutline(6, 1.05, 0.62), 0.4, "star6")],
  shadow: { cx: 0.1, cy: 1.25, rx: 1.05, ry: 0.4 },
});

const arrowScene = (): Scene => ({
  solids: [extruded(arrowOutline(1.2, 0.26, 0.55), 0.4, "rightArrow")],
  shadow: { cx: 0.1, cy: 1.0, rx: 1.3, ry: 0.4 },
});

const gearScene = (): Scene => ({
  solids: [extruded(gearOutline(8, 1.15, 0.86), 0.42, "gear6")],
  shadow: { cx: 0.1, cy: 1.35, rx: 1.15, ry: 0.44 },
});

const boltScene = (): Scene => ({
  solids: [extruded(boltOutline(1.05), 0.4, "lightningBolt")],
  shadow: { cx: 0.2, cy: 1.3, rx: 0.8, ry: 0.34 },
});

const pieScene = (): Scene => ({
  solids: [extruded(pieOutline(1.2, -90, 150), 0.46, "pie")],
  shadow: { cx: 0.1, cy: 1.45, rx: 1.15, ry: 0.44 },
});

const chevronScene = (): Scene => ({
  solids: [extruded(chevronOutline(0.95, 0.95, 0.72), 0.44, "chevron")],
  shadow: { cx: 0.1, cy: 1.1, rx: 1.0, ry: 0.38 },
});

const gemScene = (): Scene => ({
  solids: [extruded(polygonOutline(6, 1.0, -Math.PI / 2), 0.5, "hexagon")],
  shadow: { cx: 0.1, cy: 1.25, rx: 1.0, ry: 0.4 },
});

const blobScene = (): Scene => ({
  solids: [extruded(blobOutline(1.05), 0.44, "ellipse")],
  shadow: { cx: 0.1, cy: 1.3, rx: 1.1, ry: 0.42 },
});

// ─────────────────────────────────────────── composed, one-off objects
//
// These are the ones worth having. A primitive says "a thing"; a built
// object says what kind of thing, and it is the difference between a
// shape library and a design.

/** A plinth with three tiles floating above it, each casting its own shadow. */
const floatScene = (): Scene => ({
  solids: [
    solidBox(0, 0, 0, 2.6, 2.6, 0.24),
    solidColumn(squareAt(1.3, 1.3, 1.9, 14), 1.1, 0.2),
    solidColumn(squareAt(1.55, 1.05, 1.45, -20), 2.1, 0.18),
    solidColumn(squareAt(1.2, 1.5, 1.0, 34), 3.0, 0.16),
  ],
  shadows: [
    { cx: 0, cy: 2.45, rx: 2.4, ry: 1.0 },
    { cx: 0.0, cy: 1.75, rx: 1.3, ry: 0.5, o: 0.5 },
    { cx: 0.1, cy: 1.45, rx: 1.0, ry: 0.4, o: 0.35 },
  ],
});

/** A quarter turn of a staircase, climbing as it rotates. */
const helixScene = (): Scene => ({
  solids: Array.from({ length: 7 }, (_, i) =>
    solidColumn(squareAt(0, 0, 1.5 - i * 0.05, i * 22), i * 0.3, 0.22)
  ),
  shadow: { cx: 0, cy: 1.1, rx: 1.4, ry: 0.6 },
});

/** A wireframe cube: twelve thin bars, hollow in the middle. */
const latticeScene = (): Scene => {
  const s = 2.0;
  const t = 0.16;
  const bars: Solid[] = [];
  // Uprights at the four corners.
  for (const [x, y] of [[0, 0], [s - t, 0], [0, s - t], [s - t, s - t]]) {
    bars.push(solidBox(x, y, 0, t, t, s));
  }
  // Rails along the top and the bottom.
  for (const z of [0, s - t]) {
    bars.push(solidBox(0, 0, z, s, t, t));
    bars.push(solidBox(0, s - t, z, s, t, t));
    bars.push(solidBox(0, 0, z, t, s, t));
    bars.push(solidBox(s - t, 0, z, t, s, t));
  }
  return { solids: bars, shadow: { cx: 0, cy: s * 1.05, rx: s * 0.95, ry: s * 0.42 } };
};

/** A field of columns at varying heights. Data as landscape. */
const terrainScene = (): Scene => {
  const heights = [
    [0.4, 0.9, 1.5, 0.7],
    [0.8, 1.9, 2.4, 1.1],
    [1.3, 2.2, 1.7, 0.6],
    [0.5, 1.0, 0.8, 0.35],
  ];
  const solids: Solid[] = [];
  const g = 0.86;
  heights.forEach((row, x) =>
    row.forEach((h, y) => solids.push(solidBox(x * g, y * g, 0, g * 0.82, g * 0.82, h)))
  );
  return { solids, shadow: { cx: 0, cy: 3.2, rx: 3.0, ry: 1.3 } };
};

/** Plates fanned like a hand of cards, each turned a little further. */
const cardsScene = (): Scene => ({
  solids: Array.from({ length: 5 }, (_, i) =>
    solidColumn(squareAt(i * 0.12, -i * 0.05, 1.7, i * 11 - 22), i * 0.17, 0.1)
  ),
  shadow: { cx: 0, cy: 1.5, rx: 1.7, ry: 0.72 },
});

/** Thin slabs standing on edge, fanned out. A set of options. */
const shardsScene = (): Scene => ({
  solids: [
    solidColumn(squareAt(0, 0, 0.9, 0), 0, 1.5),
    solidColumn(squareAt(1.15, 0.25, 0.8, 28), 0, 2.2),
    solidColumn(squareAt(2.15, 0.1, 0.7, -16), 0, 1.1),
  ],
  shadow: { cx: 0.5, cy: 1.5, rx: 2.0, ry: 0.72 },
});

/** A sphere with a ring around it. The one that reads as a rendered object. */
const orbitScene = (): Scene => {
  const r = 0.72;
  const rx = r * 2 * COS30;
  const R = 1.35;
  const Rx = R * 2 * COS30;
  const Ry = R * 2 * SIN30;
  const cy = -r * 1.1;

  const body: Solid = {
    faces: [],
    box: { x: -Rx, y: cy - rx, w: Rx * 2, h: rx + Ry + Math.abs(cy) },
    shape: "ellipse",
    depth: 0,
  };

  return {
    solids: [body],
    shadow: { cx: 0, cy: Ry * 0.9, rx: Rx * 0.8, ry: Ry * 0.7 },
    extras: ({ base }) => {
      const gid = "orb" + parse(base).map((n) => n.toString(16).padStart(2, "0")).join("");
      return (
        <g>
          <defs>
            <radialGradient id={gid} cx="32%" cy="26%" r="78%">
              <stop offset="0%" stopColor={shade(base, 0.42)} />
              <stop offset="44%" stopColor={shade(base, 0.04)} />
              <stop offset="86%" stopColor={shade(base, -0.26)} />
              <stop offset="100%" stopColor={shade(base, -0.08)} />
            </radialGradient>
          </defs>
          {/* Back half of the ring, then the sphere, then the front half,
              which is what makes the ring pass behind and in front. */}
          <path
            d={`M${-Rx} ${cy} A ${Rx} ${Ry} 0 0 1 ${Rx} ${cy}`}
            fill="none"
            stroke={shade(base, -0.3)}
            strokeWidth="0.26"
          />
          <circle cx={0} cy={cy} r={rx} fill={`url(#${gid})`} />
          <ellipse
            cx={-rx * 0.34}
            cy={cy - rx * 0.46}
            rx={rx * 0.2}
            ry={rx * 0.13}
            fill={shade(base, 0.6)}
            opacity="0.72"
          />
          <path
            d={`M${-Rx} ${cy} A ${Rx} ${Ry} 0 0 0 ${Rx} ${cy}`}
            fill="none"
            stroke={shade(base, TOP)}
            strokeWidth="0.26"
          />
        </g>
      );
    },
  };
};

// ────────────────────────────────────────────── spirals, in metal

/**
 * A continuous helical ribbon.
 *
 * Separate plates placed around a circle do not read as a spiral: they
 * scatter, because each one is its own object and the eye never joins
 * them up. A ribbon is one surface, built as a strip of quads between an
 * inner and an outer edge, with a wall hanging off the outer edge to give
 * it thickness.
 *
 * The segments are sorted back to front before the faces are emitted,
 * because within one solid the faces paint in array order.
 */
function ribbon(
  turns: number,
  steps: number,
  rIn: (t: number) => number,
  rOut: (t: number) => number,
  z: (t: number) => number,
  thick: number,
  shape: string
): Solid {
  const at = (t: number) => {
    const a = t * turns * Math.PI * 2 - Math.PI / 2;
    return { a, zz: z(t), ci: Math.cos(a) * rIn(t), si: Math.sin(a) * rIn(t), co: Math.cos(a) * rOut(t), so: Math.sin(a) * rOut(t) };
  };

  const segs = [];
  for (let i = 0; i < steps; i++) {
    const t0 = i / steps;
    const t1 = (i + 1) / steps;
    const p = at(t0);
    const q = at(t1);

    const top = [
      project(p.ci, p.si, p.zz),
      project(p.co, p.so, p.zz),
      project(q.co, q.so, q.zz),
      project(q.ci, q.si, q.zz),
    ] as Pt[];

    const wall = [
      project(p.co, p.so, p.zz),
      project(q.co, q.so, q.zz),
      project(q.co, q.so, q.zz - thick),
      project(p.co, p.so, p.zz - thick),
    ] as Pt[];

    segs.push({
      depth: (p.ci + p.co + p.si + p.so) / 2 + p.zz,
      faces: [
        { points: pts(wall), tone: RIGHT, kind: "right" as FaceKind },
        { points: pts(top), tone: TOP, kind: "top" as FaceKind },
      ],
      all: [...top, ...wall],
    });
  }

  segs.sort((a, b) => a.depth - b.depth);

  return {
    faces: segs.flatMap((s) => s.faces),
    box: bboxOf(segs.flatMap((s) => s.all)),
    shape,
    depth: 0,
  };
}

/** A tall polished coil. The showpiece. */
const spiralScene = (): Scene => ({
  metal: true,
  solids: [
    ribbon(3.4, 150, () => 0.56, () => 0.95, (t) => t * 3.4, 0.13, "can"),
  ],
  shadow: { cx: 0, cy: 0.62, rx: 1.1, ry: 0.5 },
});

/** A flat spiral winding inward, seen from above. Convergence. */
const vortexScene = (): Scene => ({
  metal: true,
  solids: [
    ribbon(2.4, 110, (t) => 0.3 + t * 1.25, (t) => 0.62 + t * 1.25, (t) => t * 0.55, 0.12, "donut"),
  ],
  shadow: { cx: 0, cy: 1.05, rx: 2.0, ry: 0.86 },
});

/** A twisted column: a square tower that rotates as it climbs. */
const twistScene = (): Scene => ({
  metal: true,
  solids: Array.from({ length: 16 }, (_, i) =>
    solidColumn(squareAt(0, 0, 1.25, i * 7.5), i * 0.17, 0.19)
  ),
  shadow: { cx: 0, cy: 1.0, rx: 1.2, ry: 0.5 },
});

// ────────────────────────────────────── isometric figures and scenes
//
// A deck of objects has nobody in it. A figure changes what a slide is
// about: a plinth is a platform, a plinth with someone standing on it is
// a person with a position.
//
// The figures are built from the same boxes as everything else, so they
// export as real shapes rather than disappearing. The head is drawn, and
// carries its own ellipse hull.

interface Figure {
  solids: Solid[];
  head: { cx: number; cy: number; r: number };
  /** Where the head's hull sits, in projected units. */
  headBox: { x: number; y: number; w: number; h: number };
}

function figure(x: number, y: number, s = 1, lift = 0): Figure {
  const leg = 0.17 * s;
  const legH = 0.52 * s;
  const torsoH = 0.6 * s;
  const cx = x + 0.21 * s;
  const cy = y + 0.085 * s;

  const solids = [
    solidBox(x, y, lift, leg, leg, legH),
    solidBox(x + 0.25 * s, y, lift, leg, leg, legH),
    solidColumn(squareAt(cx, cy, 0.46 * s, 0), lift + legH, torsoH),
    // Arms, slightly out from the body so the silhouette reads.
    solidBox(x - 0.1 * s, y + 0.02 * s, lift + legH + 0.06 * s, 0.1 * s, 0.1 * s, 0.42 * s),
    solidBox(x + 0.42 * s, y + 0.02 * s, lift + legH + 0.06 * s, 0.1 * s, 0.1 * s, 0.42 * s),
  ];

  const hz = lift + legH + torsoH + 0.3 * s;
  const [hx, hy] = project(cx, cy, hz);
  const r = 0.3 * s;

  return {
    solids,
    head: { cx: hx, cy: hy, r },
    headBox: { x: hx - r, y: hy - r, w: r * 2, h: r * 2 },
  };
}

/** Draws the heads of a set of figures, with the hulls they export as. */
function headArt(figs: Figure[], base: string) {
  const gid = "hd" + parse(base).map((n) => n.toString(16).padStart(2, "0")).join("");
  return (
    <g>
      <defs>
        <radialGradient id={gid} cx="34%" cy="28%" r="76%">
          <stop offset="0%" stopColor={shade(base, 0.4)} />
          <stop offset="52%" stopColor={shade(base, 0.04)} />
          <stop offset="100%" stopColor={shade(base, -0.26)} />
        </radialGradient>
      </defs>
      {figs.map((f, i) => (
        <circle key={i} cx={f.head.cx} cy={f.head.cy} r={f.head.r} fill={`url(#${gid})`} />
      ))}
    </g>
  );
}

/** Turns a figure's head into an export hull, so it is not lost. */
function headHull(f: Figure): Solid {
  return { faces: [], box: f.headBox, shape: "ellipse", depth: 99 };
}

function peopleScene(figs: Figure[], extraSolids: Solid[], shadow: Scene["shadow"], shadows?: Scene["shadows"]): Scene {
  return {
    solids: [...extraSolids, ...figs.flatMap((f) => f.solids), ...figs.map(headHull)],
    shadow,
    shadows,
    extras: ({ base }) => headArt(figs, base),
  };
}

/** One figure standing on a plinth. */
const personScene = (): Scene => {
  const f = figure(0.6, 0.6, 1, 0.3);
  return peopleScene(
    [f],
    [solidBox(0, 0, 0, 1.9, 1.9, 0.3)],
    { cx: 0, cy: 1.9, rx: 1.8, ry: 0.78 }
  );
};

/** Three figures on a shared platform. A team, not an org chart. */
const teamScene = (): Scene => {
  const figs = [figure(0.45, 1.5, 0.92, 0.28), figure(1.5, 1.45, 1.04, 0.28), figure(2.5, 0.6, 0.92, 0.28)];
  return peopleScene(
    figs,
    [solidBox(0, 0, 0, 3.4, 3.4, 0.28)],
    { cx: 0, cy: 3.3, rx: 3.1, ry: 1.3 }
  );
};

/** A figure at a desk with a screen. The working scene. */
const deskScene = (): Scene => {
  const f = figure(0.25, 1.5, 0.95, 0);
  return peopleScene(
    f ? [f] : [],
    [
      // Desk top and its two legs.
      solidBox(0.9, 0.5, 0.72, 1.7, 1.0, 0.12),
      solidBox(0.95, 0.56, 0, 0.12, 0.12, 0.72),
      solidBox(2.45, 0.56, 0, 0.12, 0.12, 0.72),
      // A screen standing on it.
      solidColumn(squareAt(1.75, 0.95, 0.95, 0), 0.84, 0.72, "roundRect"),
    ],
    { cx: 0.5, cy: 2.3, rx: 2.4, ry: 0.95 }
  );
};

/** A figure climbing a flight of steps. Progress, with somebody doing it. */
const climbScene = (): Scene => {
  const f = figure(1.55, 0.2, 0.9, 1.05);
  return peopleScene(
    [f],
    [
      solidBox(0, 0, 0, 0.75, 1.1, 0.35),
      solidBox(0.8, 0, 0, 0.75, 1.1, 0.7),
      solidBox(1.6, 0, 0, 0.75, 1.1, 1.05),
      solidBox(2.4, 0, 0, 0.75, 1.1, 1.4),
    ],
    { cx: 0.4, cy: 1.5, rx: 2.3, ry: 0.78 }
  );
};

/** Two figures either side of a table. The meeting. */
const meetingScene = (): Scene => {
  const figs = [figure(-0.15, 1.75, 1.15, 0), figure(2.45, 0.05, 1.15, 0)];
  return peopleScene(
    figs,
    [
      solidBox(0.85, 0.8, 0.66, 1.5, 1.5, 0.13),
      solidColumn(squareAt(1.6, 1.55, 0.34, 0), 0, 0.66),
    ],
    { cx: 0.3, cy: 2.6, rx: 2.8, ry: 1.1 }
  );
};

// ──────────────────────────────────────────────────────────── components

function make(build: () => Scene): React.FC<Asset3DProps> {
  const scene = build();
  const bb = sceneBBox(scene);
  const C: React.FC<Asset3DProps> = ({ palette, color, size = 96 }) => (
    <SceneView scene={scene} base={color ?? palette.accent} size={size} />
  );
  (C as any).aspect = (bb.h + 1) / (bb.w + 1);
  return C;
}

export const Cube = make(cubeScene);
export const Tower = make(towerScene);
export const Slab = make(slabScene);
export const Cylinder = make(cylinderScene);
export const Sphere = make(sphereScene);
export const Prism = make(prismScene);
export const Ring = make(ringScene);
export const Wedge = make(wedgeScene);
export const CubeStack = make(cubeStackScene);
export const Steps = make(stepsScene);
export const CoinStack = make(coinStackScene);
export const Cluster = make(clusterScene);
export const Arch = make(archScene);
export const TileGrid = make(gridScene);
export const Cone = make(coneScene);
export const Capsule = make(capsuleScene);
export const Torus = make(torusScene);
export const Pyramid = make(pyramidScene);
export const Star = make(starScene);
export const Badge = make(badgeScene);
export const Arrow = make(arrowScene);
export const Gear = make(gearScene);
export const Bolt = make(boltScene);
export const PieWedge = make(pieScene);
export const Chevron = make(chevronScene);
export const Gem = make(gemScene);
export const Blob = make(blobScene);
export const FloatTiles = make(floatScene);
export const Helix = make(helixScene);
export const Lattice = make(latticeScene);
export const Terrain = make(terrainScene);
export const Cards = make(cardsScene);
export const Shards = make(shardsScene);
export const Orbit = make(orbitScene);
export const Spiral = make(spiralScene);
export const Vortex = make(vortexScene);
export const Twist = make(twistScene);
export const Person = make(personScene);
export const Team = make(teamScene);
export const Desk = make(deskScene);
export const Climb = make(climbScene);
export const Meeting = make(meetingScene);

// ──────────────────────────────────────────────────────── the catalogue

function entry(
  component: React.FC<Asset3DProps>,
  name: string,
  pptShape: string,
  use: string
) {
  return { component, meta: { name, pptShape, use, aspect: (component as any).aspect ?? 1 } };
}

export const ASSETS_3D: Record<string, { component: React.FC<Asset3DProps>; meta: Asset3DMeta }> = {
  cube: entry(Cube, "Block", "cube", "The unit. One idea, one block."),
  tower: entry(Tower, "Column", "cube", "A figure that implies data without being a chart."),
  slab: entry(Slab, "Plinth", "cube", "A base under something, or a ground plane."),
  cylinder: entry(Cylinder, "Cylinder", "can", "Storage, a store of value, a pipeline."),
  sphere: entry(Sphere, "Sphere", "ellipse", "A whole, a market, a single idea."),
  prism: entry(Prism, "Hex plate", "hexagon", "A node, a module, a cell in a system."),
  ring: entry(Ring, "Ring", "donut", "A share or a cycle."),
  wedge: entry(Wedge, "Slab block", "cube", "A tier, or one stage of a model."),
  cubeStack: entry(CubeStack, "Stacked plates", "cube x3", "Layers, tiers, anything built up."),
  steps: entry(Steps, "Climb", "cube x4", "Growth, phases, a run of quarters."),
  coinStack: entry(CoinStack, "Stacked discs", "can", "Money, volume, a reserve."),
  cluster: entry(Cluster, "Skyline", "cube x7", "The hero. Worth half a slide on its own."),
  arch: entry(Arch, "Gateway", "cube x3", "A threshold, a way through, a platform."),
  tileGrid: entry(TileGrid, "Tile field", "cube x9", "A system with parts in motion."),

  // Curved and faceted, for when a box is the wrong shape for the idea.
  cone: entry(Cone, "Cone", "triangle", "A point of focus, a funnel, a signal."),
  capsule: entry(Capsule, "Capsule", "roundRect", "The soft one. A dose, a unit, a pill."),
  torus: entry(Torus, "Torus", "donut", "A cycle or a loop, with a real hole in it."),
  pyramid: entry(Pyramid, "Pyramid", "triangle", "A hierarchy, or something built to last."),

  // Extruded objects: a flat outline pushed back into a solid.
  star: entry(Star, "Star", "star5", "Quality, a rating, the pick of something."),
  badge: entry(Badge, "Badge", "star6", "An award, a certification, a standard met."),
  arrow: entry(Arrow, "Arrow", "rightArrow", "Direction and growth, pointing up and out."),
  gear: entry(Gear, "Cog", "gear6", "Process, automation, the machinery underneath."),
  bolt: entry(Bolt, "Bolt", "lightningBolt", "Speed, power, a sudden change."),
  pieWedge: entry(PieWedge, "Pie wedge", "pie", "A share of a market or a budget."),
  chevron: entry(Chevron, "Chevron", "chevron", "A step in a sequence, or forward motion."),
  gem: entry(Gem, "Gem", "hexagon", "Value, a premium tier, something cut and finished."),
  blob: entry(Blob, "Blob", "ellipse", "The organic one, for a set that is all hard edges."),

  // Composed objects. These carry a slide on their own.
  floatTiles: entry(FloatTiles, "Floating tiles", "cube x4", "Layers that are related but not fixed to each other."),
  helix: entry(Helix, "Helix", "cube x7", "A process that turns as it climbs."),
  lattice: entry(Lattice, "Lattice", "cube x12", "A framework, a structure, something open."),
  terrain: entry(Terrain, "Terrain", "cube x16", "Data as landscape. The densest object in the set."),
  cards: entry(Cards, "Fanned cards", "cube x5", "Versions, options, a deck of anything."),
  shards: entry(Shards, "Shards", "cube x3", "Three options standing side by side."),
  orbit: entry(Orbit, "Orbit", "ellipse", "A core with something circling it."),

  // Polished metal. A different material, not just a different shape.
  spiral: entry(Spiral, "Spiral", "cube x26", "A climb with a turn in it, in polished metal."),
  vortex: entry(Vortex, "Vortex", "cube x22", "A flat spiral winding inward. Convergence."),
  twist: entry(Twist, "Twisted column", "cube x16", "A tower that turns as it rises."),

  // Isometric scenes with people in them.
  person: entry(Person, "Figure", "cube x5 + ellipse", "One person on a plinth. A role, not a shape."),
  team: entry(Team, "Team", "cube x15", "Three figures sharing a platform."),
  desk: entry(Desk, "At the desk", "cube x9", "Someone working. The scene for a product slide."),
  climb: entry(Climb, "The climb", "cube x9", "A figure part way up a flight of steps."),
  meeting: entry(Meeting, "The meeting", "cube x12", "Two figures across a table."),
};

export type Asset3DName = keyof typeof ASSETS_3D;
export const ASSET_3D_NAMES = Object.keys(ASSETS_3D) as Asset3DName[];

/** Unknown names render a plain block rather than nothing. */
export function asset3d(name?: string): React.FC<Asset3DProps> {
  return (name && ASSETS_3D[name]?.component) || Cube;
}

/** Height of an asset at a given width, for callers aligning a row. */
export function asset3dHeight(name: string | undefined, size: number): number {
  return size * (ASSETS_3D[name ?? ""]?.meta.aspect ?? 1);
}
