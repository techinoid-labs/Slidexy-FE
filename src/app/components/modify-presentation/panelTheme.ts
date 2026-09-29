// Shared visual tokens for the editor's rail flyout panels and right
// property panel. All nine panel components import from here instead of
// hardcoding their own literals, so the editor's content surfaces stay one
// consistent system.
//
// Design direction: neutral grey chrome — color reserved for accent/active
// states, not tinting every border and background. See shellTheme.ts for
// the fuller rationale (this file mirrors it for the panels).

export const PANEL = {
  bg: "#FFFFFF",
  surface: "#FFFFFF",
  surfaceHover: "rgba(0, 0, 0, 0.045)",
  surfaceSunken: "#F5F5F7",
  border: "rgba(0, 0, 0, 0.09)",
  borderHover: "rgba(142, 45, 226, 0.4)",
  text: "#18181B",
  textMuted: "#5B5568",
  textFaint: "#9CA3AF",
  accent: "#8E2DE2",
  accentSoft: "#8E2DE2",
  accentBg: "rgba(142, 45, 226, 0.08)",
  accentBgHover: "rgba(142, 45, 226, 0.14)",
  accentBorder: "rgba(142, 45, 226, 0.35)",
  danger: "#EF4444",
} as const;

export { RAIL_WIDTH } from "./shellTheme";
import { RAIL_WIDTH } from "./shellTheme";

// Panels float above the canvas (absolute overlay) rather than pushing it —
// pushing made the canvas visibly resize/shift every time a panel opened,
// which read as janky. The canvas reserves permanent margin for this
// (see editor/page.tsx's PAD_X) so the overlay never actually reaches the
// slide, and opening/closing a panel never changes canvas size at all.
export const panelContainerSx = (
  width: number | string = 300,
  sidebarHeight: string | number = "100vh"
) => ({
  width,
  bgcolor: PANEL.surface,
  height: sidebarHeight,
  position: "absolute" as const,
  left: RAIL_WIDTH,
  top: 0,
  zIndex: 10,
  borderRight: `1px solid ${PANEL.border}`,
  boxShadow: "8px 0 24px rgba(0, 0, 0, 0.05)",
  display: "flex",
  flexDirection: "column" as const,
});

export const panelHeaderSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  px: 3,
  py: 2,
  borderBottom: `1px solid ${PANEL.border}`,
  flexShrink: 0,
};

export const panelTitleSx = {
  fontWeight: 600,
  fontSize: 18,
  color: PANEL.text,
};

export const panelCloseButtonSx = {
  color: PANEL.textMuted,
  transition: "background-color 0.18s ease, transform 0.18s ease, color 0.18s ease",
  "&:hover": { bgcolor: PANEL.accentBg, color: PANEL.accent, transform: "rotate(90deg)" },
};

export const panelSearchBarSx = {
  display: "flex",
  alignItems: "center",
  bgcolor: PANEL.surfaceSunken,
  borderRadius: "10px",
  px: 2,
  height: 40,
  border: `1.5px solid ${PANEL.border}`,
  transition: "border-color 0.2s ease, box-shadow 0.2s ease",
  "&:focus-within": {
    borderColor: PANEL.accent,
    boxShadow: `0 0 0 4px ${PANEL.accentBg}`,
  },
};

export const panelTileSx = {
  bgcolor: PANEL.surfaceSunken,
  borderRadius: 3,
  border: `1px solid ${PANEL.border}`,
  cursor: "pointer",
  transition: "border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s cubic-bezier(0.22,1,0.36,1)",
  "&:hover": {
    borderColor: PANEL.borderHover,
    boxShadow: `0 8px 20px -6px ${PANEL.accentBg}`,
    transform: "translateY(-2px)",
  },
  "&:focus-visible": {
    outline: `2px solid ${PANEL.accent}`,
    outlineOffset: "2px",
  },
};
