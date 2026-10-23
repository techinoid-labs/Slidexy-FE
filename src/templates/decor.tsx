"use client";

import React from "react";
import { STAGE_HEIGHT, STAGE_WIDTH, withAlpha } from "./tokens";
import type { ThemePalette } from "./types";

/**
 * Original decorative SVG assets for slide backgrounds and accents.
 *
 * WHY THIS EXISTS
 *
 * The first motif set was built from CSS: soft radial glows in opposite
 * corners, faint dot grids, a 7% tint. That is precisely the vocabulary that
 * makes a deck read as machine-made. Soft, symmetrical, evenly weighted
 * decoration looks like something applied to a slide rather than designed
 * into it.
 *
 * Professionally designed templates use a different vocabulary, and it is
 * learnable without copying anyone's artwork:
 *
 *   1. HARD EDGES. A shape with a crisp boundary reads as a decision. A
 *      gradient fading to nothing reads as an effect.
 *   2. ASYMMETRY. One large element anchored off-centre, not two matching
 *      glows. Balance comes from contrast in weight, not from mirroring.
 *   3. BLEED. Shapes run off the canvas edge. Something fully contained and
 *      centred looks like clip-art; something cropped looks composed.
 *   4. LAYERING. Two or three shapes overlapping at different opacities give
 *      depth. One shape alone looks like a sticker.
 *   5. SCALE CONTRAST. Either very large or very small. Mid-sized decoration
 *      competes with the content and wins, which is the worst outcome.
 *   6. RESTRAINT IN HUE. One accent doing the work, not four.
 *
 * Every asset here is drawn from those rules and parameterised by the
 * theme's own palette, so the same geometry reads differently in each theme.
 * Nothing is random: the same slide renders identically every time, which
 * matters because exports re-render off-screen.
 */

export interface DecorProps {
  palette: ThemePalette;
  dark: boolean;
  /** 0..1 multiplier on every opacity, for themes that want it quieter. */
  intensity?: number;
}

const svgBase: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  pointerEvents: "none",
};

/** Opacity helper: decoration must sit further back in dark themes. */
function op(dark: boolean, light: number, darkV: number, intensity = 1) {
  return (dark ? darkV : light) * intensity;
}

// ─────────────────────────────────────────────────────────────────────────────
// Background fields
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Overlapping arches bleeding off the right edge.
 *
 * The workhorse. Reads as editorial rather than decorative because the
 * shapes are cropped by the canvas and sit at three distinct weights.
 */
export const ArchStack: React.FC<DecorProps> = ({ palette, dark, intensity = 1 }) => (
  <svg style={svgBase} viewBox={`0 0 ${STAGE_WIDTH} ${STAGE_HEIGHT}`} aria-hidden focusable="false">
    <path
      d="M700 540 V210 a170 170 0 0 1 340 0 V540 Z"
      fill={withAlpha(palette.accent, op(dark, 0.1, 0.18, intensity))}
    />
    <path
      d="M790 540 V268 a112 112 0 0 1 224 0 V540 Z"
      fill={withAlpha(palette.accent2, op(dark, 0.14, 0.2, intensity))}
    />
    <path
      d="M862 540 V330 a62 62 0 0 1 124 0 V540 Z"
      fill={withAlpha(palette.accent, op(dark, 0.2, 0.3, intensity))}
    />
  </svg>
);

/**
 * A solid wedge cut from the bottom-left corner.
 *
 * The most confident option: a flat plane of colour with one diagonal edge.
 * Works best under layouts whose content sits right of centre.
 */
export const CornerWedge: React.FC<DecorProps> = ({ palette, dark, intensity = 1 }) => (
  <svg style={svgBase} viewBox={`0 0 ${STAGE_WIDTH} ${STAGE_HEIGHT}`} aria-hidden focusable="false">
    <path d="M0 540 V250 L330 540 Z" fill={withAlpha(palette.accent, op(dark, 0.11, 0.2, intensity))} />
    <path d="M0 540 V372 L196 540 Z" fill={withAlpha(palette.accent, op(dark, 0.16, 0.28, intensity))} />
    {/* A single hairline continuing past the shape stops it reading as a
        triangle sitting on the slide and ties it to the edge. */}
    <path
      d="M0 250 L600 540"
      stroke={withAlpha(palette.accent, op(dark, 0.22, 0.3, intensity))}
      strokeWidth="1.25"
      fill="none"
    />
  </svg>
);

/** A wide band crossing the slide at a shallow angle, cropped both sides. */
export const Ribbon: React.FC<DecorProps> = ({ palette, dark, intensity = 1 }) => (
  <svg style={svgBase} viewBox={`0 0 ${STAGE_WIDTH} ${STAGE_HEIGHT}`} aria-hidden focusable="false">
    <path d="M-40 430 L1000 236 V330 L-40 524 Z" fill={withAlpha(palette.accent, op(dark, 0.09, 0.16, intensity))} />
    <path
      d="M-40 430 L1000 236"
      stroke={withAlpha(palette.accent, op(dark, 0.26, 0.34, intensity))}
      strokeWidth="2"
      fill="none"
    />
  </svg>
);

/** Concentric rings anchored off the top-right corner. */
export const Concentric: React.FC<DecorProps> = ({ palette, dark, intensity = 1 }) => {
  const stroke = withAlpha(palette.accent, op(dark, 0.17, 0.24, intensity));
  return (
    <svg style={svgBase} viewBox={`0 0 ${STAGE_WIDTH} ${STAGE_HEIGHT}`} aria-hidden focusable="false">
      <g fill="none" stroke={stroke} strokeWidth="1.25">
        {[120, 196, 272, 348, 424].map((r) => (
          <circle key={r} cx="912" cy="78" r={r} />
        ))}
      </g>
      <circle cx="912" cy="78" r="56" fill={withAlpha(palette.accent, op(dark, 0.2, 0.3, intensity))} />
    </svg>
  );
};

/** A large half-disc bleeding off the left edge, with one offset outline. */
export const HalfMoon: React.FC<DecorProps> = ({ palette, dark, intensity = 1 }) => (
  <svg style={svgBase} viewBox={`0 0 ${STAGE_WIDTH} ${STAGE_HEIGHT}`} aria-hidden focusable="false">
    <path d="M0 70 a200 200 0 0 1 0 400 Z" fill={withAlpha(palette.accent, op(dark, 0.12, 0.2, intensity))} />
    <path
      d="M0 30 a240 240 0 0 1 0 480"
      fill="none"
      stroke={withAlpha(palette.accent2, op(dark, 0.22, 0.3, intensity))}
      strokeWidth="1.5"
    />
  </svg>
);

/**
 * Fine diagonal hatching confined to one corner.
 *
 * Hatching is drawn rather than tiled so the lines terminate on a diagonal
 * boundary. A tiled pattern masked with a gradient fades out, which is the
 * soft look this set is trying to avoid.
 */
export const Hatch: React.FC<DecorProps> = ({ palette, dark, intensity = 1 }) => {
  const stroke = withAlpha(palette.accent, op(dark, 0.2, 0.26, intensity));
  const lines: React.ReactNode[] = [];
  for (let i = 0; i < 26; i++) {
    const x = 640 + i * 14;
    lines.push(<line key={i} x1={x} y1={0} x2={x - 180} y2={180} stroke={stroke} strokeWidth="1.5" />);
  }
  return (
    <svg style={svgBase} viewBox={`0 0 ${STAGE_WIDTH} ${STAGE_HEIGHT}`} aria-hidden focusable="false">
      {lines}
    </svg>
  );
};

/**
 * Scattered geometric marks, bottom-left, in a deliberate arrangement.
 *
 * Positions are hand-placed rather than generated: random scatter clusters
 * and leaves holes, and reads as noise. These sit on an implied diagonal.
 */
export const Scatter: React.FC<DecorProps> = ({ palette, dark, intensity = 1 }) => {
  const a = withAlpha(palette.accent, op(dark, 0.3, 0.4, intensity));
  const b = withAlpha(palette.accent2, op(dark, 0.26, 0.36, intensity));
  return (
    <svg style={svgBase} viewBox={`0 0 ${STAGE_WIDTH} ${STAGE_HEIGHT}`} aria-hidden focusable="false">
      <circle cx="56" cy="462" r="7" fill={a} />
      <rect x="104" y="492" width="11" height="11" fill={b} />
      <circle cx="150" cy="430" r="4.5" fill={b} />
      <rect x="34" y="372" width="8" height="8" transform="rotate(45 38 376)" fill={a} />
      <circle cx="210" cy="498" r="5.5" fill={a} />
      <path d="M186 404 h14 M193 397 v14" stroke={b} strokeWidth="2" strokeLinecap="round" />
      <circle cx="268" cy="452" r="3.5" fill={b} />
    </svg>
  );
};

/**
 * Flowing contour lines, like a topographic map.
 *
 * Fixed bezier paths rather than noise: contour lines read as deliberate
 * only when they nest cleanly, which generated noise rarely does.
 */
export const Contour: React.FC<DecorProps> = ({ palette, dark, intensity = 1 }) => {
  const stroke = withAlpha(palette.accent, op(dark, 0.16, 0.22, intensity));
  const paths = [
    "M-20 180 C 180 120, 300 240, 520 180 S 860 90, 990 150",
    "M-20 236 C 190 176, 310 296, 530 236 S 870 146, 990 206",
    "M-20 292 C 200 232, 320 352, 540 292 S 880 202, 990 262",
    "M-20 348 C 210 288, 330 408, 550 348 S 890 258, 990 318",
    "M-20 404 C 220 344, 340 464, 560 404 S 900 314, 990 374",
  ];
  return (
    <svg style={svgBase} viewBox={`0 0 ${STAGE_WIDTH} ${STAGE_HEIGHT}`} aria-hidden focusable="false">
      <g fill="none" stroke={stroke} strokeWidth="1.25">
        {paths.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
    </svg>
  );
};

/** An organic blob with a hard edge and an offset outline echoing it. */
export const BlobCut: React.FC<DecorProps> = ({ palette, dark, intensity = 1 }) => {
  const d =
    "M782 36 c74 -18 164 26 172 108 c8 82 -44 118 -36 192 c8 74 56 128 -8 170 c-64 42 -168 -4 -232 -56 c-64 -52 -88 -130 -62 -204 c26 -74 92 -192 166 -210 Z";
  return (
    <svg style={svgBase} viewBox={`0 0 ${STAGE_WIDTH} ${STAGE_HEIGHT}`} aria-hidden focusable="false">
      <path d={d} fill={withAlpha(palette.accent, op(dark, 0.12, 0.2, intensity))} />
      <path
        d={d}
        transform="translate(-26 22)"
        fill="none"
        stroke={withAlpha(palette.accent2, op(dark, 0.22, 0.3, intensity))}
        strokeWidth="1.5"
      />
    </svg>
  );
};

/**
 * Editorial rules: a heavy short rule over a hairline running full bleed.
 *
 * The quietest asset here, and often the right one. Two lines of different
 * weight at the same baseline is a century-old typographic device and never
 * reads as generated.
 */
export const RuleMark: React.FC<DecorProps> = ({ palette, dark, intensity = 1 }) => (
  <svg style={svgBase} viewBox={`0 0 ${STAGE_WIDTH} ${STAGE_HEIGHT}`} aria-hidden focusable="false">
    <line
      x1="0"
      y1="96"
      x2={STAGE_WIDTH}
      y2="96"
      stroke={withAlpha(palette.border, op(dark, 0.7, 0.5, intensity))}
      strokeWidth="1"
    />
    <line x1="0" y1="96" x2="150" y2="96" stroke={palette.accent} strokeWidth="4" opacity={intensity} />
  </svg>
);

/** A frame inset from the slide edge, broken at the top-left for a title. */
export const BrokenFrame: React.FC<DecorProps> = ({ palette, dark, intensity = 1 }) => {
  const stroke = withAlpha(palette.accent, op(dark, 0.3, 0.4, intensity));
  return (
    <svg style={svgBase} viewBox={`0 0 ${STAGE_WIDTH} ${STAGE_HEIGHT}`} aria-hidden focusable="false">
      <g fill="none" stroke={stroke} strokeWidth="1.5">
        <path d="M300 28 H932 V512 H28 V28 H170" />
      </g>
    </svg>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Image masks
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Clip-path shapes for images.
 *
 * A rectangular photograph is the single strongest tell that a slide was
 * assembled rather than designed. These are CSS clip-path values, applied
 * directly to an image element.
 */
export const IMAGE_MASKS = {
  /** Rounded at the top, square at the bottom. The most useful one. */
  arch: "path('M0,120 A120,120 0 0,1 240,120 L240,300 L0,300 Z')",
  none: "none",
  circle: "circle(50% at 50% 50%)",
  /** Square with one corner cut, like a folded page. */
  notch: "polygon(0 0, 82% 0, 100% 18%, 100% 100%, 0 100%)",
  /** Soft organic edge. */
  blob: "ellipse(48% 46% at 50% 50%)",
  hexagon: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
  /** Leaf: two opposite corners rounded hard. */
  leaf: "inset(0 round 48% 6px 48% 6px)",
} as const;

export type ImageMask = keyof typeof IMAGE_MASKS;

// ─────────────────────────────────────────────────────────────────────────────
// Accent marks for type
// ─────────────────────────────────────────────────────────────────────────────

/**
 * A hand-drawn-feeling highlighter stroke behind a word or phrase.
 *
 * Sits behind inline text; the parent needs `position: relative`. The stroke
 * is intentionally not a clean rectangle — an uneven edge is what separates
 * this from a background-color.
 */
export const HighlightStroke: React.FC<{ color: string; opacity?: number }> = ({
  color,
  opacity = 0.28,
}) => (
  <svg
    viewBox="0 0 200 40"
    preserveAspectRatio="none"
    aria-hidden
    focusable="false"
    style={{ position: "absolute", left: "-2%", right: 0, bottom: "4%", width: "104%", height: "62%", zIndex: 0, pointerEvents: "none" }}
  >
    <path
      d="M3 30 C 40 22, 84 34, 126 26 C 158 20, 180 30, 197 24 L 197 38 C 170 32, 140 40, 104 36 C 62 31, 30 40, 3 36 Z"
      fill={color}
      opacity={opacity}
    />
  </svg>
);

/** A swooping underline that overshoots the word slightly at both ends. */
export const UnderlineSwoosh: React.FC<{ color: string; width?: number }> = ({ color, width = 3 }) => (
  <svg
    viewBox="0 0 200 14"
    preserveAspectRatio="none"
    aria-hidden
    focusable="false"
    style={{ position: "absolute", left: "-1%", width: "102%", height: 10, bottom: -6, pointerEvents: "none" }}
  >
    <path d="M2 9 C 46 2, 98 13, 198 5" fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" />
  </svg>
);

/** Square brackets either side of a phrase. */
export const BracketPair: React.FC<{ color: string }> = ({ color }) => (
  <svg
    viewBox="0 0 200 40"
    preserveAspectRatio="none"
    aria-hidden
    focusable="false"
    style={{ position: "absolute", inset: "-14% -3%", width: "106%", height: "128%", pointerEvents: "none" }}
  >
    <g fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="square">
      <path d="M14 3 H3 V37 H14" />
      <path d="M186 3 H197 V37 H186" />
    </g>
  </svg>
);

// ─────────────────────────────────────────────────────────────────────────────
/**
 * An isometric ground plane running off the bottom-right corner, with two
 * blocks standing on it.
 *
 * This is the signature device of the Dimensional template, and the reason
 * it lives here rather than in assets3d.tsx: the exporter flattens the whole
 * slide background into one picture, so decoration behind the content can be
 * true isometric SVG, sheared faces and all. Anything in the content area
 * cannot, and belongs in assets3d.tsx instead.
 */
export const IsoFloor: React.FC<DecorProps> = ({ palette, dark, intensity = 1 }) => {
  const line = withAlpha(palette.accent, op(dark, 0.14, 0.2, intensity));
  const faint = withAlpha(palette.text, op(dark, 0.07, 0.12, intensity));
  const step = 48;

  // A true isometric block: 30 degree faces, which only works out here.
  const cube = (cx: number, cy: number, w: number, h: number) => {
    const d = w * 0.577;
    return {
      top: `M${cx} ${cy} L${cx + w} ${cy + d} L${cx} ${cy + 2 * d} L${cx - w} ${cy + d} Z`,
      left: `M${cx - w} ${cy + d} L${cx} ${cy + 2 * d} L${cx} ${cy + 2 * d + h} L${cx - w} ${cy + d + h} Z`,
      right: `M${cx + w} ${cy + d} L${cx} ${cy + 2 * d} L${cx} ${cy + 2 * d + h} L${cx + w} ${cy + d + h} Z`,
    };
  };

  const big = cube(880, 296, 150, 118);
  const small = cube(694, 402, 54, 42);

  return (
    <svg style={svgBase} viewBox={`0 0 ${STAGE_WIDTH} ${STAGE_HEIGHT}`} aria-hidden focusable="false">
      <g stroke={faint} strokeWidth="1" fill="none">
        {Array.from({ length: 12 }, (_, i) => (
          <path key={"a" + i} d={`M${300 + i * step} 580 L${780 + i * step} 303`} />
        ))}
        {Array.from({ length: 12 }, (_, i) => (
          <path key={"b" + i} d={`M${300 + i * step} 303 L${780 + i * step} 580`} />
        ))}
      </g>

      {[
        { c: small, o: 0.7 },
        { c: big, o: 1 },
      ].map(({ c, o }, i) => (
        <g key={i}>
          {/* The blocks stand on the grid, so each face is first filled with
              the page colour. Without this the grid lines read straight
              through the solid and the whole thing looks like a mistake
              rather than an object. */}
          <path d={c.top} fill={palette.bg} />
          <path d={c.left} fill={palette.bg} />
          <path d={c.right} fill={palette.bg} />
          <path d={c.top} fill={withAlpha(palette.accent, op(dark, 0.2, 0.3, intensity) * o)} />
          <path d={c.left} fill={withAlpha(palette.accent, op(dark, 0.13, 0.2, intensity) * o)} />
          <path d={c.right} fill={withAlpha(palette.accent, op(dark, 0.08, 0.14, intensity) * o)} />
        </g>
      ))}

      {/* One hard edge down the front of the big block, so it reads as a
          decision rather than a tint. */}
      <path d={big.left} fill="none" stroke={line} strokeWidth="1.25" />
    </svg>
  );
};

/* ─────────────────────────────────────────────────────────── mesh layers
 *
 * Depth behind the content.
 *
 * Everything above draws a shape on the slide. These draw the space the
 * shapes sit in: a soft field of colour, a receding plane, a lattice with
 * fog in it. Without one, an object on a flat field is a sticker; with one,
 * it is an object somewhere.
 *
 * They belong here rather than in assets3d.tsx for the usual reason: the
 * exporter flattens the whole slide background into a single picture, so a
 * layer behind the content may use blur filters, mesh gradients and fifty
 * hairlines at no cost. The same marks in the content area would each have
 * to survive as a PowerPoint shape, and would not.
 *
 * All of them are keyed off the theme palette and are deterministic, which
 * matters because the export re-renders off-screen and must match.
 */

/** A mesh gradient: four soft colour fields bleeding into each other. */
export const MeshField: React.FC<DecorProps> = ({ palette, dark, intensity = 1 }) => {
  const a = op(dark, 0.2, 0.15, intensity);
  return (
    <svg style={svgBase} viewBox={`0 0 ${STAGE_WIDTH} ${STAGE_HEIGHT}`} aria-hidden focusable="false">
      <defs>
        <filter id="mesh-blur" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="110" />
        </filter>
      </defs>
      <g filter="url(#mesh-blur)">
        <ellipse cx="760" cy="90" rx="330" ry="250" fill={withAlpha(palette.accent, a)} />
        <ellipse cx="980" cy="430" rx="300" ry="280" fill={withAlpha(palette.accent2, a * 0.8)} />
        <ellipse cx="180" cy="520" rx="320" ry="220" fill={withAlpha(palette.accent3, a * 0.55)} />
        <ellipse cx="420" cy="-40" rx="260" ry="200" fill={withAlpha(palette.accent, a * 0.5)} />
      </g>
    </svg>
  );
};

/**
 * A ground plane receding to a horizon, with the lines fading as they go.
 *
 * The fade is the whole trick. An even grid reads as graph paper; a grid
 * that loses contrast with distance reads as a floor.
 */
export const MeshPlane: React.FC<DecorProps> = ({ palette, dark, intensity = 1 }) => {
  const line = withAlpha(palette.accent, op(dark, 0.26, 0.3, intensity));
  const horizon = 300;
  const vpX = STAGE_WIDTH * 0.5;

  // Rows at an accelerating spacing, which is what perspective does.
  const rows = Array.from({ length: 16 }, (_, i) => {
    const t = (i + 1) / 16;
    return horizon + Math.pow(t, 2.3) * (STAGE_HEIGHT - horizon) * 1.25;
  }).filter((y) => y < STAGE_HEIGHT + 40);

  return (
    <svg style={svgBase} viewBox={`0 0 ${STAGE_WIDTH} ${STAGE_HEIGHT}`} aria-hidden focusable="false">
      <defs>
        <linearGradient id="plane-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0" />
          <stop offset="45%" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#fff" stopOpacity="1" />
        </linearGradient>
        <mask id="plane-mask">
          <rect x="0" y={horizon} width={STAGE_WIDTH} height={STAGE_HEIGHT - horizon} fill="url(#plane-fade)" />
        </mask>
      </defs>
      <g mask="url(#plane-mask)" stroke={line} strokeWidth="1" fill="none">
        {rows.map((y, i) => (
          <line key={"r" + i} x1={-200} y1={y} x2={STAGE_WIDTH + 200} y2={y} />
        ))}
        {Array.from({ length: 23 }, (_, i) => {
          const x = -STAGE_WIDTH + i * (STAGE_WIDTH / 7);
          return <line key={"c" + i} x1={vpX} y1={horizon} x2={x} y2={STAGE_HEIGHT + 60} />;
        })}
      </g>
    </svg>
  );
};

/** An isometric lattice of nodes and struts, fogged toward the corner. */
export const MeshLattice: React.FC<DecorProps> = ({ palette, dark, intensity = 1 }) => {
  const line = withAlpha(palette.accent, op(dark, 0.34, 0.46, intensity));
  const node = withAlpha(palette.accent, op(dark, 0.55, 0.7, intensity));
  const step = 74;
  const cols = 11;
  const rows = 7;

  const at = (i: number, j: number): [number, number] => [
    420 + (i - j) * step * 0.866,
    120 + (i + j) * step * 0.5,
  ];

  const struts: Array<[number, number, number, number]> = [];
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const [x, y] = at(i, j);
      if (i + 1 < cols) {
        const [x2, y2] = at(i + 1, j);
        struts.push([x, y, x2, y2]);
      }
      if (j + 1 < rows) {
        const [x2, y2] = at(i, j + 1);
        struts.push([x, y, x2, y2]);
      }
    }
  }

  return (
    <svg style={svgBase} viewBox={`0 0 ${STAGE_WIDTH} ${STAGE_HEIGHT}`} aria-hidden focusable="false">
      <defs>
        <radialGradient id="lattice-fog" cx="78%" cy="72%" r="72%">
          <stop offset="0%" stopColor="#fff" stopOpacity="1" />
          <stop offset="62%" stopColor="#fff" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask id="lattice-mask">
          <rect width={STAGE_WIDTH} height={STAGE_HEIGHT} fill="url(#lattice-fog)" />
        </mask>
      </defs>
      <g mask="url(#lattice-mask)">
        <g stroke={line} strokeWidth="1" fill="none">
          {struts.map(([x1, y1, x2, y2], i) => (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />
          ))}
        </g>
        <g fill={node}>
          {Array.from({ length: cols }, (_, i) =>
            Array.from({ length: rows }, (_, j) => {
              const [x, y] = at(i, j);
              return <circle key={`${i}-${j}`} cx={x} cy={y} r={1.9} />;
            })
          )}
        </g>
      </g>
    </svg>
  );
};

/**
 * Soft bands crossing the slide at a shallow angle, blurred into each other.
 * The quietest of the four; use it under a dense band slide.
 */
export const MeshBands: React.FC<DecorProps> = ({ palette, dark, intensity = 1 }) => {
  const a = op(dark, 0.22, 0.34, intensity);
  return (
    <svg style={svgBase} viewBox={`0 0 ${STAGE_WIDTH} ${STAGE_HEIGHT}`} aria-hidden focusable="false">
      <defs>
        <filter id="band-blur" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="46" />
        </filter>
      </defs>
      <g filter="url(#band-blur)">
        <path d="M-60 170 L1020 20 L1020 150 L-60 300 Z" fill={withAlpha(palette.accent, a)} />
        <path d="M-60 420 L1020 250 L1020 360 L-60 530 Z" fill={withAlpha(palette.accent2, a * 0.75)} />
      </g>
    </svg>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Registry
// ─────────────────────────────────────────────────────────────────────────────

export const BACKGROUND_DECOR = {
  archStack: ArchStack,
  cornerWedge: CornerWedge,
  ribbon: Ribbon,
  concentric: Concentric,
  halfMoon: HalfMoon,
  hatch: Hatch,
  scatter: Scatter,
  contour: Contour,
  blobCut: BlobCut,
  ruleMark: RuleMark,
  brokenFrame: BrokenFrame,
  isoFloor: IsoFloor,
  meshField: MeshField,
  meshPlane: MeshPlane,
  meshLattice: MeshLattice,
  meshBands: MeshBands,
} as const;

export type BackgroundDecorName = keyof typeof BACKGROUND_DECOR;

export const BACKGROUND_DECOR_NAMES = Object.keys(BACKGROUND_DECOR) as BackgroundDecorName[];
