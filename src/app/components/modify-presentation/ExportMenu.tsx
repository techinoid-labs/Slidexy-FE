"use client";

import React from "react";
import { Box, Menu, MenuItem, Divider, Typography, ListItemText, Radio } from "@mui/material";
import { SHELL } from "./shellTheme";

/**
 * Export options.
 *
 * Previously both exports were a single button with no choices, so anyone
 * wanting one slide for a Slack message, or a smaller file for email, had
 * to export the whole deck at full quality and fix it elsewhere.
 *
 * Three decisions, in the order people make them: what to export, at what
 * quality, and in what format. Format stays as the two buttons that already
 * exist; this menu holds the first two.
 */

export type ExportScope = "deck" | "current";
export type ExportQuality = "standard" | "high" | "compact";

export interface ExportOptions {
  scope: ExportScope;
  quality: ExportQuality;
}

export const QUALITY_PRESETS: Record<ExportQuality, { scale: number; jpegQuality: number; label: string; hint: string }> = {
  // The old hardcoded behaviour, kept as the default so nothing changes for
  // anyone who does not open this menu.
  standard: { scale: 2, jpegQuality: 0.92, label: "Standard", hint: "1920×1080 · good for most uses" },
  high: { scale: 3, jpegQuality: 0.96, label: "High", hint: "2880×1620 · print and large screens" },
  compact: { scale: 1.5, jpegQuality: 0.82, label: "Compact", hint: "Smallest file · good for email" },
};

export const ExportMenu: React.FC<{
  anchorEl: HTMLElement | null;
  onClose: () => void;
  options: ExportOptions;
  onChange: (next: ExportOptions) => void;
  slideCount: number;
  currentSlideNumber: number;
}> = ({ anchorEl, onClose, options, onChange, slideCount, currentSlideNumber }) => {
  const row = {
    py: 0.75,
    px: 1.5,
    gap: 1,
    "&:hover": { background: SHELL.surfaceHover },
  } as const;

  const heading = {
    fontSize: 10.5,
    fontWeight: 700,
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    color: SHELL.textMuted,
    px: 1.5,
    pt: 1.25,
    pb: 0.5,
  } as const;

  return (
    <Menu
      anchorEl={anchorEl}
      open={!!anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      slotProps={{ paper: { sx: { minWidth: 248, borderRadius: "10px", mt: 0.5 } } }}
    >
      <Typography sx={heading}>What to export</Typography>
      {([
        { id: "deck" as const, label: `Whole deck`, hint: `${slideCount} slide${slideCount === 1 ? "" : "s"}` },
        { id: "current" as const, label: "Current slide only", hint: `Slide ${currentSlideNumber}` },
      ]).map((o) => (
        <MenuItem key={o.id} sx={row} onClick={() => onChange({ ...options, scope: o.id })}>
          <Radio checked={options.scope === o.id} size="small" sx={{ p: 0 }} />
          <ListItemText
            primary={<Typography sx={{ fontSize: 13 }}>{o.label}</Typography>}
            secondary={<Typography sx={{ fontSize: 11, color: SHELL.textMuted }}>{o.hint}</Typography>}
          />
        </MenuItem>
      ))}

      <Divider sx={{ my: 0.5 }} />

      <Typography sx={heading}>Quality</Typography>
      {(Object.keys(QUALITY_PRESETS) as ExportQuality[]).map((q) => (
        <MenuItem key={q} sx={row} onClick={() => onChange({ ...options, quality: q })}>
          <Radio checked={options.quality === q} size="small" sx={{ p: 0 }} />
          <ListItemText
            primary={<Typography sx={{ fontSize: 13 }}>{QUALITY_PRESETS[q].label}</Typography>}
            secondary={<Typography sx={{ fontSize: 11, color: SHELL.textMuted }}>{QUALITY_PRESETS[q].hint}</Typography>}
          />
        </MenuItem>
      ))}

      <Divider sx={{ my: 0.5 }} />
      <Box sx={{ px: 1.5, py: 1 }}>
        <Typography sx={{ fontSize: 11, color: SHELL.textMuted, lineHeight: 1.5 }}>
          PowerPoint export ignores quality: it writes real text and shapes
          rather than pictures.
        </Typography>
      </Box>
    </Menu>
  );
};

export default ExportMenu;
