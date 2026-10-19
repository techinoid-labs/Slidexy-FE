"use client";

import React, { forwardRef, useMemo, useState } from "react";
import { Box, Typography, IconButton, Tooltip, InputBase } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import CheckIcon from "@mui/icons-material/Check";
import { THEMES } from "@/templates/themes";
import type { TemplateTheme } from "@/templates/types";
import { useSlides } from "@/app/context/SlidesContext";
import { PANEL, panelTitleSx, panelCloseButtonSx } from "./panelTheme";

/**
 * Theme picker for block-template decks.
 *
 * Moved out of the top bar, where a single icon opened a palette that had no
 * effect on template slides. A theme is a whole visual system here -- palette,
 * two typefaces, card treatment, icon treatment, heading treatment, cover
 * treatment and a background motif -- so it belongs beside Templates and
 * Layouts rather than next to the export buttons.
 *
 * Applying a theme rewrites `blockSpec.theme` on every block slide. Content is
 * untouched: the same blocks render in the new system.
 */

const ALL = Object.values(THEMES) as TemplateTheme[];

/** A small visual sample so a theme is chosen by eye, not by name. */
const ThemeSwatch: React.FC<{ t: TemplateTheme; active: boolean; onPick: () => void }> = ({
  t,
  active,
  onPick,
}) => {
  const p: any = t.palette || {};
  const bg = p.bg || "#fff";
  const ink = p.text || p.ink || "#111";
  const accent = p.accent || p.primary || "#8E2DE2";
  const surface = p.surface || bg;

  return (
    <Tooltip title={`${t.name} · ${t.mode}`} placement="top" arrow>
      <Box
        onClick={onPick}
        sx={{
          position: "relative",
          borderRadius: "8px",
          overflow: "hidden",
          cursor: "pointer",
          border: active ? `2px solid ${accent}` : `1px solid ${PANEL.border}`,
          transition: "transform 0.12s ease, box-shadow 0.12s ease",
          "&:hover": { transform: "translateY(-2px)", boxShadow: "0 4px 14px rgba(0,0,0,0.16)" },
        }}
      >
        {/* A miniature slide: heading bar, body lines, accent chip. */}
        <Box sx={{ background: bg, p: 1, height: 62, display: "flex", flexDirection: "column", gap: 0.5 }}>
          <Box
            sx={{
              height: 7,
              width: "62%",
              borderRadius: "2px",
              background: ink,
              opacity: 0.88,
            }}
          />
          <Box sx={{ height: 4, width: "88%", borderRadius: "2px", background: ink, opacity: 0.32 }} />
          <Box sx={{ height: 4, width: "74%", borderRadius: "2px", background: ink, opacity: 0.32 }} />
          <Box sx={{ display: "flex", gap: 0.5, mt: "auto" }}>
            <Box sx={{ height: 10, width: 22, borderRadius: "3px", background: accent }} />
            <Box sx={{ height: 10, width: 14, borderRadius: "3px", background: surface, border: `1px solid ${ink}22` }} />
          </Box>
        </Box>

        <Box sx={{ px: 0.85, py: 0.55, background: PANEL.surface, borderTop: `1px solid ${PANEL.border}` }}>
          <Typography
            sx={{
              fontSize: "0.63rem",
              fontWeight: 600,
              color: PANEL.text,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {t.name}
          </Typography>
          <Typography sx={{ fontSize: "0.56rem", color: PANEL.textFaint, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {shortFamily(t.fonts?.display)} / {shortFamily(t.fonts?.body)}
          </Typography>
        </Box>

        {active && (
          <Box
            sx={{
              position: "absolute",
              top: 4,
              right: 4,
              width: 16,
              height: 16,
              borderRadius: "50%",
              background: accent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CheckIcon sx={{ fontSize: 11, color: "#fff" }} />
          </Box>
        )}
      </Box>
    </Tooltip>
  );
};

/** "var(--font-archivo, 'Archivo'), sans-serif" -> "Archivo" */
function shortFamily(stack?: string): string {
  if (!stack) return "";
  const quoted = stack.match(/['"]([^'"]+)['"]/);
  if (quoted) return quoted[1];
  const first = stack.split(",")[0] || "";
  return first.replace(/var\(|\)|--font-/g, "").trim();
}

interface Props {
  sidebarHeight?: number | string;
  onClose: () => void;
}

const BlockThemePanel = forwardRef<HTMLDivElement, Props>(({ sidebarHeight, onClose }, ref) => {
  const { slides, setSlides } = useSlides() as any;
  const [query, setQuery] = useState("");

  const blockSlides = useMemo(
    () => (slides || []).filter((s: any) => !!s?.blockSpec),
    [slides]
  );

  const currentThemeId: string | null = blockSlides[0]?.blockSpec?.theme?.id ?? null;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ALL;
    return ALL.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q) ||
        t.mode.includes(q)
    );
  }, [query]);

  const applyTheme = (t: TemplateTheme) => {
    if (!slides?.length) return;
    // structuredClone so the theme object is not shared by reference across
    // slides -- a later per-slide override would otherwise leak to all of them.
    const next = slides.map((s: any) =>
      s?.blockSpec ? { ...s, blockSpec: { ...s.blockSpec, theme: structuredClone(t) } } : s
    );
    setSlides(next);
  };

  return (
    <Box
      ref={ref}
      sx={{
        width: 300,
        height: sidebarHeight ?? "100%",
        bgcolor: PANEL.surface,
        borderRight: `1px solid ${PANEL.border}`,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", px: 2, pt: 2, pb: 1 }}>
        <Box>
          <Typography sx={panelTitleSx}>Themes</Typography>
          <Typography sx={{ fontSize: "0.72rem", color: PANEL.textMuted, mt: 0.25 }}>
            Colour, type and treatment for the whole deck
          </Typography>
        </Box>
        <IconButton size="small" onClick={onClose} sx={panelCloseButtonSx}>
          <CloseIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Box>

      <Box sx={{ px: 2, pb: 1.25 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, px: 1, py: 0.5, borderRadius: "8px", background: PANEL.surfaceSunken ?? "rgba(0,0,0,0.04)", border: `1px solid ${PANEL.border}` }}>
          <SearchIcon sx={{ fontSize: 15, color: PANEL.textFaint }} />
          <InputBase
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search themes"
            sx={{ fontSize: "0.78rem", color: PANEL.text, flex: 1 }}
          />
        </Box>
      </Box>

      {blockSlides.length === 0 ? (
        <Box sx={{ px: 2, py: 3 }}>
          <Typography sx={{ fontSize: "0.78rem", color: PANEL.textMuted, lineHeight: 1.6 }}>
            This deck has no template slides yet. Apply a template from the
            Templates tab first, then a theme restyles the whole deck.
          </Typography>
        </Box>
      ) : (
        <Box sx={{ flex: 1, overflowY: "auto", px: 2, pb: 2 }}>
          <Typography sx={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: PANEL.textMuted, mb: 1 }}>
            {filtered.length} theme{filtered.length === 1 ? "" : "s"}
          </Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.25 }}>
            {filtered.map((t) => (
              <ThemeSwatch
                key={t.id}
                t={t}
                active={t.id === currentThemeId}
                onPick={() => applyTheme(t)}
              />
            ))}
          </Box>
          {filtered.length === 0 && (
            <Typography sx={{ fontSize: "0.78rem", color: PANEL.textFaint, mt: 2 }}>
              No theme matches &ldquo;{query}&rdquo;.
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
});

BlockThemePanel.displayName = "BlockThemePanel";
export default BlockThemePanel;
