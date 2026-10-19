"use client";

import React from "react";
import { Box, Tooltip, CircularProgress, Typography } from "@mui/material";
import CloudDoneOutlinedIcon from "@mui/icons-material/CloudDoneOutlined";
import CloudOffOutlinedIcon from "@mui/icons-material/CloudOffOutlined";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { SHELL } from "./shellTheme";
import type { SaveState } from "@/app/hooks/useDeckAutosave";

/**
 * Where the deck currently lives.
 *
 * Deliberately always visible rather than a toast that appears on change:
 * the question this answers -- "is my work safe?" -- is one people ask at
 * arbitrary moments, usually just before closing the tab.
 */

function relative(at: number): string {
  const secs = Math.round((Date.now() - at) / 1000);
  if (secs < 10) return "just now";
  if (secs < 60) return `${secs}s ago`;
  const mins = Math.round(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  return `${Math.round(mins / 60)}h ago`;
}

export const SaveStatus: React.FC<{
  state: SaveState;
  onSaveNow: () => void;
  onSignIn: () => void;
  /** Icon only. Mobile has no room for the label, but 'is my work
   *  saved?' is the question phones most need answered. */
  compact?: boolean;
}> = ({ state, onSaveNow, onSignIn, compact = false }) => {
  // Re-render while "saved" so the relative time does not go stale.
  const [, tick] = React.useReducer((n) => n + 1, 0);
  React.useEffect(() => {
    if (state.status !== "saved") return;
    const id = setInterval(tick, 20000);
    return () => clearInterval(id);
  }, [state.status]);

  const shell = {
    display: "flex",
    alignItems: "center",
    gap: 0.6,
    height: 28,
    px: 1,
    borderRadius: "8px",
    fontSize: 11.5,
    fontWeight: 500,
    userSelect: "none",
    transition: "background 0.15s ease",
  } as const;

  if (state.status === "signedout") {
    return (
      <Tooltip title="Your work is only in this browser. Sign in to keep it." placement="bottom">
        <Box
          onClick={onSignIn}
          sx={{ ...shell, cursor: "pointer", color: "#b4791a", background: "rgba(217,131,36,0.1)", "&:hover": { background: "rgba(217,131,36,0.18)" } }}
        >
          <LockOutlinedIcon sx={{ fontSize: 14 }} />
          {!compact && <Typography sx={{ fontSize: 11.5, fontWeight: 600 }}>Sign in to save</Typography>}
        </Box>
      </Tooltip>
    );
  }

  if (state.status === "saving") {
    return (
      <Box sx={{ ...shell, color: SHELL.textMuted }}>
        <CircularProgress size={11} thickness={6} sx={{ color: SHELL.textMuted }} />
        {!compact && <Typography sx={{ fontSize: 11.5 }}>Saving</Typography>}
      </Box>
    );
  }

  if (state.status === "saved") {
    return (
      <Tooltip title="Saved to your account" placement="bottom">
        <Box sx={{ ...shell, color: "#1d7a3d" }}>
          <CloudDoneOutlinedIcon sx={{ fontSize: 14 }} />
          {!compact && <Typography sx={{ fontSize: 11.5 }}>Saved {relative(state.at)}</Typography>}
        </Box>
      </Tooltip>
    );
  }

  if (state.status === "error") {
    return (
      <Tooltip title={state.canRetry ? `${state.message}. Click to retry.` : state.message} placement="bottom">
        <Box
          onClick={state.canRetry ? onSaveNow : undefined}
          sx={{ ...shell, cursor: state.canRetry ? "pointer" : "default", color: "#a8322a", background: "rgba(168,50,42,0.1)", "&:hover": state.canRetry ? { background: "rgba(168,50,42,0.18)" } : {} }}
        >
          <ErrorOutlineIcon sx={{ fontSize: 14 }} />
          {!compact && (
            <Typography sx={{ fontSize: 11.5, fontWeight: 600 }}>
              {state.canRetry ? "Not saved · retry" : "Not saved"}
            </Typography>
          )}
        </Box>
      </Tooltip>
    );
  }

  if (state.status === "unsaved") {
    return (
      <Tooltip title="Unsaved changes. Ctrl+S to save now." placement="bottom">
        <Box onClick={onSaveNow} sx={{ ...shell, cursor: "pointer", color: SHELL.textMuted, "&:hover": { background: SHELL.surfaceHover } }}>
          <CloudOffOutlinedIcon sx={{ fontSize: 14 }} />
          {!compact && <Typography sx={{ fontSize: 11.5 }}>Unsaved</Typography>}
        </Box>
      </Tooltip>
    );
  }

  return null;
};

export default SaveStatus;
