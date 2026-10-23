/**
 * Design tokens for block-based slides.
 *
 * Everything is expressed in px against a fixed 960x540 stage, so a slide
 * renders identically at any zoom (the stage is CSS-transformed as a whole).
 * Nothing here uses rem — root font size is not ours to depend on.
 */

import type { CardStyle, TemplateTheme, ThemePalette } from "./types";

export const STAGE_WIDTH = 960;
export const STAGE_HEIGHT = 540;

/**
 * Type scale. Ratios chosen so a heading and its body never land on adjacent
 * sizes — the thing that makes hand-tuned decks look accidental.
 */
const BASE_TYPE = {
  // The editorial headline. It is the composition on a band slide, not a
  // label on top of one, so it runs about eight times the body size.
  displayXl: { size: 94, weight: 800, tracking: -3.4, leading: 0.9 },
  // The same headline in a half-width column. At displayXl it overruns
  // the column and lands on top of the body copy.
  displayLg: { size: 58, weight: 800, tracking: -1.9, leading: 0.98 },
  // The step between. A headline of thirty characters at displayXl runs
  // to three lines and lands on the content band underneath it.
  displayMd: { size: 72, weight: 800, tracking: -2.6, leading: 0.94 },
  display: { size: 52, weight: 800, tracking: -1.4, leading: 1.06 },
  h1: { size: 36, weight: 700, tracking: -0.8, leading: 1.15 },
  h2: { size: 26, weight: 700, tracking: -0.4, leading: 1.2 },
  h3: { size: 18, weight: 650, tracking: -0.2, leading: 1.3 },
  bodyLg: { size: 15, weight: 400, tracking: 0, leading: 1.5 },
  body: { size: 13, weight: 400, tracking: 0, leading: 1.5 },
  small: { size: 11.5, weight: 400, tracking: 0, leading: 1.45 },
  micro: { size: 10, weight: 600, tracking: 0.4, leading: 1.3 },
  label: { size: 12, weight: 700, tracking: 0.9, leading: 1.25 },
  stat: { size: 30, weight: 800, tracking: -1, leading: 1 },
} as const;

export type TypeToken = keyof typeof BASE_TYPE;

/** 4px base grid. */
const BASE_SPACE = [0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64] as const;

export const RADII = {
  none: 0,
  sm: 6,
  md: 12,
  lg: 18,
  pill: 999,
} as const;

/** Slide edge padding, before density scaling. */
const BASE_PAD = { x: 48, y: 40 };

export interface ResolvedTokens {
  type: (token: TypeToken) => {
    fontSize: string;
    fontWeight: number;
    letterSpacing: string;
    lineHeight: number;
    fontFamily: string;
  };
  space: (step: number) => number;
  radius: number;
  radiusSm: number;
  pad: { x: number; y: number };
  palette: ThemePalette;
  /** Accent by 1-based index, wrapping. */
  accent: (i: number) => string;
  /** Card container styling for the theme's `cardStyle`, or an override. */
  card: (override?: CardStyle) => React.CSSProperties;
  /** Tinted wash of an accent, for soft icon chips and card fills. */
  tint: (color: string, alpha: number) => string;
  theme: TemplateTheme;
}

/** Accepts #rgb, #rrggbb and rgb()/rgba(); returns an rgba() string. */
export function withAlpha(color: string, alpha: number): string {
  if (!color) return `rgba(0,0,0,${alpha})`;
  const c = color.trim();

  if (c.startsWith("rgb")) {
    const nums = c.match(/[\d.]+/g);
    if (nums && nums.length >= 3) {
      return `rgba(${nums[0]}, ${nums[1]}, ${nums[2]}, ${alpha})`;
    }
    return c;
  }

  let hex = c.replace("#", "");
  if (hex.length === 3) {
    hex = hex.split("").map((ch) => ch + ch).join("");
  }
  if (hex.length !== 6) return c;

  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** Relative luminance, for deciding whether to put light or dark text on a fill. */
export function luminance(color: string): number {
  let hex = (color || "").replace("#", "").trim();
  if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("");
  if (hex.length !== 6) return 1;

  const toLinear = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  const r = toLinear(parseInt(hex.slice(0, 2), 16));
  const g = toLinear(parseInt(hex.slice(2, 4), 16));
  const b = toLinear(parseInt(hex.slice(4, 6), 16));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Picks whichever of the theme's two text colours is readable on `bg`. */
export function readableOn(bg: string, palette: ThemePalette): string {
  return luminance(bg) > 0.45 ? palette.text : palette.onAccent;
}

export function resolveTokens(theme: TemplateTheme): ResolvedTokens {
  const { palette, typeScale, density } = theme;
  const radius = RADII[theme.radius];

  const accents = [palette.accent, palette.accent2, palette.accent3, palette.accent4];

  const tint = (color: string, alpha: number) => withAlpha(color, alpha);

  const card = (override?: CardStyle): React.CSSProperties => {
    const style = override ?? theme.cardStyle;
    const base: React.CSSProperties = {
      borderRadius: radius,
      boxSizing: "border-box",
    };

    switch (style) {
      case "flat":
        return { ...base, background: palette.surface };
      case "outlined":
        return {
          ...base,
          background: palette.surface,
          border: `1px solid ${palette.border}`,
        };
      case "elevated":
        return {
          ...base,
          background: palette.surface,
          boxShadow:
            theme.mode === "dark"
              ? `0 8px 24px ${withAlpha("#000000", 0.45)}`
              : `0 6px 20px ${withAlpha("#0f172a", 0.08)}, 0 1px 2px ${withAlpha("#0f172a", 0.04)}`,
        };
      case "glass":
        return {
          ...base,
          background: withAlpha(palette.surface, theme.mode === "dark" ? 0.18 : 0.55),
          border: `1px solid ${withAlpha(palette.onImage, 0.25)}`,
          backdropFilter: "blur(14px)",
        };
      case "brutalist":
        return {
          ...base,
          background: palette.surface,
          border: `2px solid ${palette.text}`,
          borderRadius: Math.min(radius, RADII.sm),
          boxShadow: `4px 4px 0 ${palette.text}`,
        };
      case "tinted":
        return {
          ...base,
          background: withAlpha(palette.accent, theme.mode === "dark" ? 0.16 : 0.08),
          border: `1px solid ${withAlpha(palette.accent, 0.22)}`,
        };
      default:
        return { ...base, background: palette.surface };
    }
  };

  return {
    theme,
    palette,
    radius,
    radiusSm: Math.min(radius, RADII.sm),
    pad: {
      x: Math.round(BASE_PAD.x * density),
      y: Math.round(BASE_PAD.y * density),
    },
    space: (step: number) => {
      const v = BASE_SPACE[Math.max(0, Math.min(step, BASE_SPACE.length - 1))];
      return Math.round(v * density);
    },
    accent: (i: number) => accents[((i - 1) % accents.length + accents.length) % accents.length],
    tint,
    card,
    type: (token: TypeToken) => {
      const t = BASE_TYPE[token];
      const isDisplay =
        token === "displayXl" ||
        token === "displayLg" ||
        token === "displayMd" ||
        token === "display" ||
        token === "h1" ||
        token === "h2" ||
        token === "stat";
      return {
        fontSize: `${Math.round(t.size * typeScale * 100) / 100}px`,
        fontWeight: t.weight,
        letterSpacing: `${t.tracking}px`,
        lineHeight: t.leading,
        fontFamily: isDisplay ? theme.fonts.display : theme.fonts.body,
      };
    },
  };
}
