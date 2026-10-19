"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Box, Tooltip, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import GridViewIcon from "@mui/icons-material/GridView";
import { HTMLSlideRenderer } from "../editor/HTMLSlideRenderer";

/**
 * Presenter mode.
 *
 * Replaces a dialog that showed the slide in a rounded, shadowed card at a
 * fixed 75vh -- which read as a preview thumbnail rather than a presentation.
 * Here the slide is the only thing on screen: letterboxed to the viewport,
 * square-cornered, on black, with chrome that fades out while you talk.
 *
 * Keyboard is the real interface, because that is what a presenter uses:
 *
 *   Right / Space / PageDown   next          Left / PageUp   previous
 *   Home / End                 first / last  G               slide grid
 *   F                          fullscreen    Esc             close
 */

const SLIDE_W = 960;
const SLIDE_H = 540;
const IDLE_MS = 2600;

interface SlideShowPlayerProps {
  slides: any[];
  open: boolean;
  onClose: () => void;
  theme?: any | null;
  forceCleanPreview?: boolean;
}

const SlideShowPlayer: React.FC<SlideShowPlayerProps> = ({
  slides,
  open,
  onClose,
  theme,
}) => {
  const [index, setIndex] = useState(0);
  const [scale, setScale] = useState(1);
  const [chromeVisible, setChromeVisible] = useState(true);
  const [gridOpen, setGridOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const count = slides?.length ?? 0;

  useEffect(() => {
    if (open) {
      setIndex(0);
      setGridOpen(false);
      setChromeVisible(true);
    }
  }, [open]);

  const goNext = useCallback(() => {
    setIndex((i) => (count ? Math.min(i + 1, count - 1) : 0));
  }, [count]);

  const goPrev = useCallback(() => {
    setIndex((i) => Math.max(i - 1, 0));
  }, []);

  // ── Fullscreen ───────────────────────────────────────────────────────
  const toggleFullscreen = useCallback(async () => {
    const el = rootRef.current;
    if (!el) return;
    try {
      if (!document.fullscreenElement) {
        await el.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      // Fullscreen can be refused (permissions policy, an iframe). The
      // overlay already covers the viewport, so this is cosmetic.
    }
  }, []);

  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  // Leaving fullscreen with the browser's own Esc should not also close the
  // player, so closing is driven by our own key handler rather than this.
  useEffect(() => {
    if (!open && document.fullscreenElement) {
      void document.exitFullscreen().catch(() => {});
    }
  }, [open]);

  // ── Scale the fixed 960x540 stage to fit the viewport ────────────────
  useEffect(() => {
    if (!open) return;
    const fit = () => {
      // Leave a margin only when the chrome is on screen; in fullscreen the
      // slide should reach the edges.
      const margin = document.fullscreenElement ? 0 : 48;
      const w = window.innerWidth - margin;
      const h = window.innerHeight - margin;
      setScale(Math.min(w / SLIDE_W, h / SLIDE_H));
    };
    fit();
    window.addEventListener("resize", fit);
    document.addEventListener("fullscreenchange", fit);
    return () => {
      window.removeEventListener("resize", fit);
      document.removeEventListener("fullscreenchange", fit);
    };
  }, [open]);

  // ── Chrome auto-hide ─────────────────────────────────────────────────
  const wake = useCallback(() => {
    setChromeVisible(true);
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => setChromeVisible(false), IDLE_MS);
  }, []);

  useEffect(() => {
    if (!open) return;
    wake();
    return () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, [open, wake]);

  // ── Keyboard ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      wake();
      switch (e.key) {
        case "ArrowRight":
        case "PageDown":
        case " ":
          e.preventDefault();
          gridOpen ? setGridOpen(false) : goNext();
          break;
        case "ArrowLeft":
        case "PageUp":
          e.preventDefault();
          goPrev();
          break;
        case "Home":
          e.preventDefault();
          setIndex(0);
          break;
        case "End":
          e.preventDefault();
          setIndex(Math.max(0, count - 1));
          break;
        case "g":
        case "G":
          setGridOpen((v) => !v);
          break;
        case "f":
        case "F":
          void toggleFullscreen();
          break;
        case "Escape":
          // Esc closes the grid first, then the player.
          if (gridOpen) setGridOpen(false);
          else onClose();
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, gridOpen, goNext, goPrev, count, onClose, toggleFullscreen, wake]);

  if (!open || count === 0) return null;

  const atStart = index === 0;
  const atEnd = index === count - 1;

  const chrome = {
    opacity: chromeVisible || gridOpen ? 1 : 0,
    pointerEvents: (chromeVisible || gridOpen ? "auto" : "none") as "auto" | "none",
    transition: "opacity 0.3s ease",
  };

  const navButton = {
    width: 44,
    height: 44,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "rgba(255,255,255,0.9)",
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(6px)",
    cursor: "pointer",
    transition: "background 0.15s ease, opacity 0.15s ease",
    "&:hover": { background: "rgba(255,255,255,0.18)" },
  } as const;

  return (
    <Box
      ref={rootRef}
      onMouseMove={wake}
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 2000,
        background: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: chromeVisible || gridOpen ? "default" : "none",
      }}
    >
      {/* Click zones: the right two-thirds advance, the left third goes
          back. This is how every presentation tool behaves, and it means
          the deck can be driven without aiming at a button. */}
      {!gridOpen && (
        <>
          <Box
            onClick={goPrev}
            sx={{ position: "absolute", inset: "0 66% 0 0", zIndex: 1, cursor: "w-resize" }}
          />
          <Box
            onClick={goNext}
            sx={{ position: "absolute", inset: "0 0 0 34%", zIndex: 1, cursor: "e-resize" }}
          />
        </>
      )}

      {/* The slide */}
      <Box
        key={index}
        sx={{
          width: SLIDE_W,
          height: SLIDE_H,
          flex: "0 0 auto",
          overflow: "hidden",
          transform: `scale(${scale})`,
          transformOrigin: "center center",
          animation: "slideIn 0.22s ease",
          "@keyframes slideIn": {
            from: { opacity: 0.4 },
            to: { opacity: 1 },
          },
        }}
      >
        <HTMLSlideRenderer
          slide={slides[index]}
          theme={theme}
          isEditing={false}
          slideIndex={index}
        />
      </Box>

      {/* ── Chrome ─────────────────────────────────────────────────── */}
      <Box sx={{ ...chrome, position: "absolute", top: 18, right: 18, display: "flex", gap: 1, zIndex: 3 }}>
        <Tooltip title="Slide grid (G)" placement="bottom">
          <Box sx={navButton} onClick={() => setGridOpen((v) => !v)}>
            <GridViewIcon sx={{ fontSize: 19 }} />
          </Box>
        </Tooltip>
        <Tooltip title={isFullscreen ? "Exit fullscreen (F)" : "Fullscreen (F)"} placement="bottom">
          <Box sx={navButton} onClick={() => void toggleFullscreen()}>
            {isFullscreen ? <FullscreenExitIcon sx={{ fontSize: 21 }} /> : <FullscreenIcon sx={{ fontSize: 21 }} />}
          </Box>
        </Tooltip>
        <Tooltip title="Close (Esc)" placement="bottom">
          <Box sx={navButton} onClick={onClose}>
            <CloseIcon sx={{ fontSize: 19 }} />
          </Box>
        </Tooltip>
      </Box>

      {!atStart && (
        <Box sx={{ ...chrome, position: "absolute", left: 18, top: "50%", mt: "-22px", zIndex: 3 }}>
          <Box sx={navButton} onClick={goPrev}>
            <ArrowBackIosNewIcon sx={{ fontSize: 16, ml: "3px" }} />
          </Box>
        </Box>
      )}
      {!atEnd && (
        <Box sx={{ ...chrome, position: "absolute", right: 18, top: "50%", mt: "-22px", zIndex: 3 }}>
          <Box sx={navButton} onClick={goNext}>
            <ArrowForwardIosIcon sx={{ fontSize: 16 }} />
          </Box>
        </Box>
      )}

      {/* Counter, doubling as the grid toggle */}
      <Box
        data-presenter-counter
        onClick={() => setGridOpen((v) => !v)}
        sx={{
          ...chrome,
          position: "absolute",
          bottom: 20,
          left: "50%",
          transform: "translateX(-50%)",
          px: 1.75,
          py: 0.6,
          borderRadius: "999px",
          background: "rgba(255,255,255,0.1)",
          backdropFilter: "blur(6px)",
          cursor: "pointer",
          zIndex: 3,
          "&:hover": { background: "rgba(255,255,255,0.18)" },
        }}
      >
        <Typography sx={{ color: "rgba(255,255,255,0.92)", fontSize: 12.5, fontWeight: 600, letterSpacing: "0.02em" }}>
          {index + 1} / {count}
        </Typography>
      </Box>

      {/* Progress: a hairline, so it reads as position rather than decoration */}
      <Box sx={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: "rgba(255,255,255,0.12)", zIndex: 3 }}>
        <Box
          sx={{
            height: "100%",
            width: `${((index + 1) / count) * 100}%`,
            background: "linear-gradient(90deg, #8E2DE2, #4A00E0)",
            transition: "width 0.25s ease",
          }}
        />
      </Box>

      {/* ── Slide grid ─────────────────────────────────────────────── */}
      {gridOpen && (
        <Box
          onClick={() => setGridOpen(false)}
          sx={{
            position: "absolute",
            inset: 0,
            zIndex: 4,
            background: "rgba(0,0,0,0.9)",
            backdropFilter: "blur(10px)",
            overflowY: "auto",
            p: 5,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 2.5,
            alignContent: "start",
          }}
        >
          {slides.map((s, i) => (
            <Box
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                setIndex(i);
                setGridOpen(false);
              }}
              sx={{
                position: "relative",
                aspectRatio: "16 / 9",
                borderRadius: "8px",
                overflow: "hidden",
                cursor: "pointer",
                outline: i === index ? "2.5px solid #8E2DE2" : "1px solid rgba(255,255,255,0.16)",
                outlineOffset: i === index ? "1px" : 0,
                transition: "transform 0.15s ease",
                "&:hover": { transform: "translateY(-2px)" },
              }}
            >
              {/* Rendered at full size and scaled down, so the thumbnail is
                  the real slide rather than a separate approximation. */}
              <Box
                sx={{
                  width: SLIDE_W,
                  height: SLIDE_H,
                  transform: "scale(0.229)",
                  transformOrigin: "top left",
                  pointerEvents: "none",
                }}
              >
                <HTMLSlideRenderer slide={s} theme={theme} isEditing={false} slideIndex={i} />
              </Box>
              <Typography
                sx={{
                  position: "absolute",
                  bottom: 5,
                  right: 7,
                  fontSize: 10.5,
                  fontWeight: 700,
                  color: "#fff",
                  background: "rgba(0,0,0,0.55)",
                  px: 0.7,
                  borderRadius: "4px",
                }}
              >
                {i + 1}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default SlideShowPlayer;
