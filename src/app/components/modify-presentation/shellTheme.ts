// Shared visual tokens for the editor's outer shell — the top bar, left
// rail, canvas backdrop, and bottom thumbnail strip. Mirrors panelTheme.ts's
// pattern so a future direction change stays a one-file edit.
//
// Design direction: neutral grey chrome (Figma/Notion-style) — color is
// reserved for the accent (selection/active states, the primary export CTA)
// rather than tinting every border/background/hover. Previous version tinted
// everything with the accent purple, which read as unpolished/toy-like.

export const SHELL = {
  bg: "#FFFFFF",
  surface: "#FFFFFF",
  surfaceSunken: "#F5F5F7",
  surfaceHover: "rgba(0, 0, 0, 0.045)",
  border: "rgba(0, 0, 0, 0.09)",
  borderStrong: "rgba(0, 0, 0, 0.16)",
  text: "#18181B",
  textMuted: "#6B7280",
  textFaint: "#9CA3AF",
  accent: "#8E2DE2",
  accentDark: "#4A00E0",
  accentBg: "rgba(142, 45, 226, 0.08)",
  accentBgHover: "rgba(142, 45, 226, 0.14)",
  accentBorder: "rgba(142, 45, 226, 0.35)",
  danger: "#EF4444",
} as const;

export const RAIL_WIDTH = 56;
