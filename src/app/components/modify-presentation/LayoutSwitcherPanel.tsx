"use client";

import React, { forwardRef, useState } from "react";
import { Box, Tooltip, Typography, IconButton, Divider, ToggleButton, ToggleButtonGroup } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import LayersIcon from "@mui/icons-material/Layers";
import { useSlides } from "@/app/context/SlidesContext";
import { useSlideThemeContext } from "@/app/context/ThemeContext";
import { generateSlideVariants } from "@/utils/variantGenerator";
import { TEMPLATE_META } from "../layouts/TemplateHTMLSlide";
import { TEMPLATES } from "@/templates/catalog";
import { applyTemplateToDeck } from "@/templates/applyTemplate";
import { PANEL, panelContainerSx, panelCloseButtonSx } from "./panelTheme";

// Variant count map — must stay in sync with backend LAYOUT_VARIANT_COUNTS and variantGenerator.ts
const VARIANT_COUNTS: Record<string, number> = {
  "cover-hero": 10,
  "content-right-image": 10,
  "content-left-image": 5,
  "content-split": 5,
  "comparison-slide": 3,
  "infographic-bullets": 5,
  "timeline-slide": 5,
  "quote-slide": 5,
  "conclusion": 5,
  "call-to-action": 5,
  "full-image-text-overlay": 5,
};

// Human-readable names for each layout+variant combo
const VARIANT_NAMES: Record<string, string[]> = {
  "cover-hero": [
    "Glass Overlay",
    "Modern Split",
    "Diagonal Hero",
    "Card Stack",
    "Sidebar Hero",
    "Bold Cinematic",
    "Magazine Split",
    "Glassmorphism Dark",
    "Clean Executive",
    "Dashboard App",
  ],
  "content-right-image": [
    "Clean Card",
    "Floating Card",
    "Vertical Accent",
    "Asymmetric",
    "Full Bleed",
    "Dark Mode",
    "Bento Grid",
    "Cinematic Strip",
    "Timeline Steps",
    "Bold Typographic",
  ],
  "content-left-image": ["Classic Split", "Overlay Card", "Minimal Float", "Bold Contrast", "Full Bleed"],
  "content-split": ["Side by Side", "Contrast Cards", "Overlap Grid", "Diagonal Cut", "Stacked"],
  "comparison-slide": ["Table View", "Split Panel", "Versus Layout"],
  "infographic-bullets": ["Icon Grid", "Progress Bars", "Stat Cards", "Number Focus", "Compact List"],
  "timeline-slide": ["Horizontal", "Vertical Steps", "Milestone Cards", "Compact", "Zigzag"],
  "quote-slide": ["Center Stage", "Left Accent", "Dark Elegant", "Minimal", "Bold Frame"],
  "conclusion": ["Clean CTA", "Bold Close", "Gradient", "Minimal Dark", "Card Stack"],
  "call-to-action": ["Action Strip", "Center Focus", "Split CTA", "Dark Banner", "Minimal"],
  "full-image-text-overlay": ["Bottom Overlay", "Center Overlay", "Side Panel", "Top Bar", "Full Coverage"],
};

// SVG layout diagrams — one per variant style (simplified skeleton icons)
const LayoutDiagram: React.FC<{ layoutType: string; variantIndex: number; isActive: boolean; accentColor: string }> = ({
  layoutType, variantIndex, isActive, accentColor,
}) => {
  const w = 80, h = 52;
  const accent = isActive ? accentColor : "#9ca3af";
  const bg = isActive ? `${accentColor}18` : "#f3f4f6";
  const text = isActive ? `${accentColor}80` : "#d1d5db";

  // Cover hero patterns
  if (layoutType === "cover-hero") {
    const patterns: React.ReactNode[] = [
      // V1: glass overlay left + image right
      <><rect x="4" y="4" width="46" height="44" rx="3" fill={bg} /><rect x="54" y="4" width="22" height="44" rx="3" fill={text} /><rect x="8" y="12" width="30" height="6" rx="2" fill={accent} /><rect x="8" y="22" width="22" height="3" rx="1" fill={text} /></>,
      // V2: content left + image right  
      <><rect x="4" y="4" width="44" height="44" rx="3" fill={bg} /><rect x="52" y="4" width="24" height="44" rx="3" fill={text} /><rect x="8" y="10" width="28" height="7" rx="2" fill={accent} /><rect x="8" y="22" width="20" height="3" rx="1" fill={text} /></>,
      // V3: diagonal clip
      <><rect x="4" y="4" width="72" height="44" rx="3" fill={bg} /><polygon points="50,4 76,4 76,52 35,52" fill={text} opacity="0.5" /><rect x="8" y="12" width="28" height="6" rx="2" fill={accent} /></>,
      // V4: center with image square top-right + card row bottom
      <><rect x="4" y="4" width="72" height="44" rx="3" fill={bg} /><rect x="46" y="6" width="26" height="26" rx="3" fill={text} /><rect x="6" y="36" width="22" height="10" rx="2" fill={accent} opacity="0.5" /><rect x="30" y="36" width="22" height="10" rx="2" fill={accent} opacity="0.5" /></>,
      // V5: sidebar left + full bg
      <><rect x="4" y="4" width="72" height="44" rx="3" fill={text} opacity="0.3" /><rect x="4" y="4" width="30" height="44" rx="3" fill="#fff" opacity="0.85" /><rect x="8" y="12" width="20" height="6" rx="2" fill={accent} /></>,
      // V6: full bleed dark + bottom content
      <><rect x="4" y="4" width="72" height="44" rx="3" fill="#1a1a2e" /><rect x="4" y="36" width="72" height="12" rx="0" fill="rgba(0,0,0,0.6)" /><rect x="8" y="38" width="30" height="4" rx="1" fill="#fff" opacity="0.9" /></>,
      // V7: left accent panel + right image
      <><rect x="4" y="4" width="36" height="44" rx="3" fill={accent} /><rect x="44" y="4" width="32" height="44" rx="3" fill={text} /><rect x="8" y="10" width="24" height="7" rx="2" fill="#fff" /></>,
      // V8: dark center glass card
      <><rect x="4" y="4" width="72" height="44" rx="3" fill="#0d0d1a" /><rect x="14" y="8" width="52" height="36" rx="6" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.15)" strokeWidth="1" /><rect x="18" y="16" width="30" height="6" rx="2" fill={accent} opacity="0.8" /></>,
      // V9: white bg + decorative circle + rounded image
      <><rect x="4" y="4" width="72" height="44" rx="3" fill={bg} /><circle cx="58" cy="28" r="18" fill={accent} opacity="0.08" /><rect x="8" y="10" width="26" height="7" rx="2" fill={accent} /><rect x="46" y="8" width="26" height="36" rx="6" fill={text} /></>,
      // V10: browser chrome + sidebar
      <><rect x="4" y="4" width="72" height="44" rx="3" fill={bg} /><rect x="4" y="4" width="72" height="8" rx="3" fill={accent} opacity="0.2" /><rect x="4" y="12" width="52" height="36" rx="0" fill={text} opacity="0.3" /><rect x="60" y="12" width="16" height="36" rx="0" fill={accent} opacity="0.15" /></>,
    ];
    return <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>{patterns[variantIndex] || patterns[0]}</svg>;
  }

  // Content right image patterns
  if (layoutType === "content-right-image") {
    const patterns: React.ReactNode[] = [
      <><rect x="4" y="4" width="44" height="44" rx="3" fill={bg} /><rect x="52" y="10" width="24" height="32" rx="3" fill={text} /><rect x="8" y="10" width="28" height="5" rx="2" fill={accent} /><rect x="8" y="20" width="20" height="2" rx="1" fill={text} /></>,
      <><rect x="4" y="4" width="72" height="44" rx="3" fill={bg} /><rect x="50" y="8" width="20" height="36" rx="3" fill={text} /><rect x="8" y="10" width="26" height="5" rx="2" fill={accent} /></>,
      <><rect x="4" y="4" width="44" height="44" rx="3" fill={bg} /><rect x="3" y="4" width="4" height="44" rx="0" fill={accent} /><rect x="52" y="10" width="24" height="32" rx="3" fill={text} /></>,
      <><rect x="4" y="4" width="44" height="44" rx="3" fill={bg} /><rect x="52" y="8" width="24" height="36" rx="3" fill={text} /><circle cx="32" cy="26" r="12" fill={accent} opacity="0.15" /></>,
      <><rect x="4" y="4" width="72" height="44" rx="3" fill={text} opacity="0.25" /><rect x="4" y="4" width="44" height="44" fill={bg} rx="0" /><rect x="8" y="10" width="28" height="5" rx="2" fill={accent} /></>,
      <><rect x="4" y="4" width="72" height="44" rx="3" fill="#0f0f14" /><rect x="52" y="8" width="20" height="36" rx="3" fill={accent} opacity="0.3" /><rect x="8" y="10" width="24" height="5" rx="2" fill={accent} /></>,
      <><rect x="4" y="4" width="44" height="44" rx="3" fill={bg} /><rect x="52" y="4" width="24" height="26" rx="3" fill={text} /><rect x="52" y="34" width="24" height="14" rx="3" fill={accent} /></>,
      <><rect x="4" y="4" width="72" height="44" rx="3" fill={bg} /><rect x="4" y="4" width="72" height="18" rx="3" fill={text} opacity="0.4" /><rect x="4" y="22" width="40" height="2" rx="1" fill={accent} /><rect x="8" y="28" width="26" height="4" rx="2" fill={accent} /></>,
      <><rect x="4" y="4" width="44" height="44" rx="3" fill={bg} /><rect x="52" y="4" width="24" height="44" rx="3" fill={accent} opacity="0.1" /><rect x="8" y="10" width="26" height="5" rx="2" fill={accent} /></>,
      <><rect x="4" y="4" width="72" height="44" rx="3" fill={bg} /><rect x="3" y="4" width="5" height="44" rx="0" fill={`${accent}`} /><rect x="48" y="6" width="26" height="40" rx="4" fill={text} /></>,
    ];
    return <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>{patterns[variantIndex] || patterns[0]}</svg>;
  }

  // Generic diagram for other layout types
  const colors = [accent, text, bg];
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <rect x="4" y="4" width="72" height="44" rx="3" fill={bg} />
      <rect x="8" y="8" width={20 + (variantIndex * 5)} height="6" rx="2" fill={accent} />
      <rect x="8" y="18" width="56" height="3" rx="1" fill={text} />
      <rect x="8" y="24" width="48" height="3" rx="1" fill={text} />
      {variantIndex > 2 && <rect x="44" y="8" width="28" height="30" rx="3" fill={text} />}
    </svg>
  );
};

interface LayoutSwitcherPanelProps {
  sidebarHeight?: string | number;
  onClose?: () => void;
}

const LayoutSwitcherPanel = forwardRef<HTMLDivElement, LayoutSwitcherPanelProps>(
  ({ sidebarHeight = "100vh", onClose }, ref) => {
    const { slides, selectedSlideIndex, setSlides } = useSlides();
    const { selectedTheme } = useSlideThemeContext();

    // "all" = apply to every slide, "current" = current slide only
    const [scope, setScope] = useState<"all" | "current">("all");
    // which tab is open: "templates" or "layouts"
    const [activeTab, setActiveTab] = useState<"templates" | "layouts">("templates");

    const currentSlide = slides[selectedSlideIndex];
    const layoutType = currentSlide?.layout_type || "content-right-image";
    const variantCount = VARIANT_COUNTS[layoutType] || 5;
    const activeVariantIndex = currentSlide?.currentVariantIndex ?? 0;
    // Active template is determined by the current slide (representative)
    const activeTemplateStyle = currentSlide?.templateStyle || null;
    const accentColor = selectedTheme?.artPalette?.[0] || "#6c5ce7";

    const variantNames = VARIANT_NAMES[layoutType] || Array.from({ length: variantCount }, (_, i) => `Layout ${i + 1}`);

    /* Apply or remove a template style, respecting scope */
    const handleSelectTemplate = (templateId: string) => {
      if (!currentSlide) return;
      const updatedSlides = structuredClone(slides);
      const newValue = activeTemplateStyle === templateId ? undefined : templateId;

      if (scope === "all") {
        // Apply to ALL slides
        updatedSlides.forEach((s: any) => {
          s.templateStyle = newValue;
        });
      } else {
        // Apply only to current slide
        updatedSlides[selectedSlideIndex].templateStyle = newValue;
      }
      setSlides(updatedSlides);
    };

    /**
     * Block templates re-skin the whole deck rather than setting a per-slide
     * style flag: content is lifted out of each slide and poured into the
     * template's slide specs, so an AI-generated deck keeps its words and
     * only changes how it looks.
     */
    const handleSelectBlockTemplate = (templateId: string) => {
      const template = TEMPLATES.find((t) => t.id === templateId);
      if (!template || !slides.length) return;
      setSlides(applyTemplateToDeck(structuredClone(slides), template));
    };

    const activeBlockTemplateId: string | null =
      (currentSlide as any)?.templateId ?? null;

    const handleSelectVariant = (variantIndex: number) => {
      if (!currentSlide) return;
      const updatedSlides = structuredClone(slides);
      const slide = updatedSlides[selectedSlideIndex];

      if (!slide.layouts || slide.layouts.length === 0) {
        const newLayouts = generateSlideVariants(slide, selectedTheme || {
          backgroundColor: "#fff", primaryColor: "#000",
          artPalette: ["#6c5ce7", "#00b894", "#fdcb6e", "#e17055", "#74b9ff"],
        });
        slide.layouts = newLayouts;
      }

      const safeIndex = Math.min(variantIndex, (slide.layouts?.length ?? 1) - 1);
      const variantSlide = slide.layouts?.[safeIndex];
      slide.currentVariantIndex = safeIndex;
      if (variantSlide) {
        slide.slide_title = variantSlide.slide_title || slide.slide_title;
        slide.subtitle = variantSlide.subtitle || slide.subtitle;
        slide.background = variantSlide.background || slide.background;
        slide.elements = variantSlide.elements || slide.elements;
      }
      setSlides(updatedSlides);
    };

    return (
      <Box
        ref={ref}
        sx={{
          ...panelContainerSx(292, sidebarHeight),
          overflowY: "hidden",
        }}
      >
        {/* ── Header ── */}
        <Box sx={{
          px: 2.25, py: 2,
          borderBottom: `1px solid ${PANEL.border}`,
          flexShrink: 0,
        }}>
          <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: "1rem", color: PANEL.text, letterSpacing: "-0.01em" }}>
                Design Studio
              </Typography>
              <Typography sx={{ fontSize: "0.72rem", color: PANEL.textMuted, mt: 0.25 }}>
                {TEMPLATE_META.length} templates · {variantCount} layouts
              </Typography>
            </Box>
            <IconButton size="small" onClick={onClose} sx={panelCloseButtonSx}>
              <CloseIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>

          {/* Scope toggle */}
          <Box sx={{ mt: 1.5 }}>
            <ToggleButtonGroup
              value={scope}
              exclusive
              onChange={(_, v) => v && setScope(v)}
              size="small"
              sx={{
                width: "100%",
                background: PANEL.surfaceSunken,
                borderRadius: "8px",
                p: "2px",
                "& .MuiToggleButtonGroup-grouped": {
                  border: "none !important",
                  borderRadius: "6px !important",
                  flex: 1,
                  py: 0.4,
                  fontSize: "0.72rem",
                  fontWeight: 600,
                  textTransform: "none",
                  color: PANEL.textMuted,
                  "&.Mui-selected": {
                    background: PANEL.surface,
                    color: PANEL.text,
                    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                    "&:hover": { background: PANEL.surface },
                  },
                  "&:hover": { background: "rgba(0,0,0,0.03)" },
                },
              }}
            >
              <ToggleButton value="all">All Slides</ToggleButton>
              <ToggleButton value="current">This Slide</ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>

        {/* ── Tab bar ── */}
        <Box sx={{
          display: "flex", flexShrink: 0,
          borderBottom: `1px solid ${PANEL.border}`,
          background: PANEL.surface,
        }}>
          {(["templates", "layouts"] as const).map((tab) => (
            <Box
              key={tab}
              onClick={() => setActiveTab(tab)}
              sx={{
                flex: 1, py: 1.25, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 0.6,
                borderBottom: activeTab === tab ? `2px solid ${accentColor}` : "2px solid transparent",
                color: activeTab === tab ? accentColor : "#6B7280",
                fontWeight: activeTab === tab ? 700 : 500,
                fontSize: "0.78rem",
                transition: "all 0.15s",
                "&:hover": { color: accentColor, background: `${accentColor}06` },
              }}
            >
              {tab === "templates"
                ? <AutoAwesomeIcon sx={{ fontSize: 14 }} />
                : <LayersIcon sx={{ fontSize: 14 }} />}
              {tab === "templates" ? "Templates" : "Layouts"}
            </Box>
          ))}
        </Box>

        {/* ── No slide selected ── */}
        {!currentSlide && (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography sx={{ color: "#9CA3AF", fontSize: "0.85rem" }}>
              Select a slide to begin
            </Typography>
          </Box>
        )}

        {currentSlide && (
          <Box sx={{ flex: 1, overflowY: "auto", "&::-webkit-scrollbar": { width: 4 }, "&::-webkit-scrollbar-thumb": { background: "#e5e7eb", borderRadius: 4 } }}>

            {/* ════════ TEMPLATES TAB ════════ */}
            {activeTab === "templates" && (
              <Box sx={{ p: 1.5 }}>
                {/* Active template banner */}
                {activeTemplateStyle && (
                  <Box sx={{
                    mb: 1.5, px: 1.5, py: 1, borderRadius: "10px",
                    background: `linear-gradient(135deg, ${accentColor}18, ${accentColor}08)`,
                    border: `1px solid ${accentColor}30`,
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                  }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: "50%", background: accentColor }} />
                      <Typography sx={{ fontSize: "0.72rem", fontWeight: 700, color: accentColor }}>
                        {TEMPLATE_META.find(t => t.id === activeTemplateStyle)?.name || activeTemplateStyle}
                      </Typography>
                    </Box>
                    <Typography
                      onClick={() => handleSelectTemplate(activeTemplateStyle)}
                      sx={{ fontSize: "0.65rem", color: "#9CA3AF", cursor: "pointer", "&:hover": { color: "#EF4444" } }}
                    >
                      Remove
                    </Typography>
                  </Box>
                )}

                {/* ── Block templates ──────────────────────────────────
                    Fully editable, theme-driven decks. Applying one re-skins
                    the whole deck and keeps the existing copy. */}
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", mb: 1 }}>
                    <Typography sx={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", color: PANEL.textMuted }}>
                      Editable templates
                    </Typography>
                    <Typography sx={{ fontSize: "0.62rem", color: PANEL.textFaint }}>
                      keeps your content
                    </Typography>
                  </Box>

                  <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
                    {TEMPLATES.map((tpl) => {
                      const isActive = activeBlockTemplateId === tpl.id;
                      const p = tpl.theme.palette;
                      return (
                        <Box
                          key={tpl.id}
                          onClick={() => handleSelectBlockTemplate(tpl.id)}
                          sx={{
                            cursor: "pointer",
                            borderRadius: "12px",
                            overflow: "hidden",
                            border: isActive ? `2px solid ${accentColor}` : "2px solid transparent",
                            boxShadow: isActive
                              ? `0 0 0 3px ${accentColor}20, 0 4px 16px rgba(0,0,0,0.1)`
                              : "0 1px 4px rgba(0,0,0,0.08)",
                            transition: "all 0.18s ease",
                            "&:hover": {
                              transform: "translateY(-2px)",
                              boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                            },
                          }}
                        >
                          {/* Miniature of the template's actual palette and type */}
                          <Box sx={{ height: 64, background: p.bg, p: "10px 12px", position: "relative", overflow: "hidden" }}>
                            <Box sx={{ width: "70%", height: 7, borderRadius: 1, background: p.text, opacity: 0.9, mb: "5px", fontFamily: tpl.theme.fonts.display }} />
                            <Box sx={{ width: "45%", height: 4, borderRadius: 1, background: p.textMuted, opacity: 0.6, mb: "8px" }} />
                            <Box sx={{ display: "flex", gap: "4px" }}>
                              {[p.accent, p.accent2, p.accent3, p.accent4].map((c, i) => (
                                <Box key={i} sx={{ width: 14, height: 14, borderRadius: tpl.theme.radius === "pill" ? "50%" : "4px", background: c }} />
                              ))}
                            </Box>
                          </Box>
                          <Box sx={{ px: 1.25, py: 0.9, background: PANEL.surface, borderTop: `1px solid ${PANEL.border}` }}>
                            <Typography sx={{ fontSize: "0.72rem", fontWeight: 600, color: PANEL.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                              {tpl.name}
                            </Typography>
                            <Typography sx={{ fontSize: "0.6rem", color: PANEL.textFaint }}>
                              {tpl.slides.length} slides
                            </Typography>
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>
                </Box>

                {/* ── Legacy templates ─────────────────────────────────────
                    Hand-authored HTML. Not editable and they override the
                    theme, so they are kept below the editable set. */}
                <Typography sx={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", color: PANEL.textMuted, mb: 1 }}>
                  Classic styles
                </Typography>
                <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
                  {TEMPLATE_META.map((tmpl) => {
                    const isActive = activeTemplateStyle === tmpl.id;
                    // Determine if bg is dark
                    const isDark = ["#050508", "#0B0F1A", "#0C0A09", "#111827", "#0D0D0D", "#0F172A", "#114B5F"].includes(tmpl.bg);
                    return (
                      <Box
                        key={tmpl.id}
                        onClick={() => handleSelectTemplate(tmpl.id)}
                        sx={{
                          cursor: "pointer",
                          borderRadius: "12px",
                          border: isActive ? `2px solid ${accentColor}` : "2px solid transparent",
                          overflow: "hidden",
                          transition: "all 0.18s ease",
                          boxShadow: isActive
                            ? `0 0 0 3px ${accentColor}20, 0 4px 16px rgba(0,0,0,0.1)`
                            : "0 1px 4px rgba(0,0,0,0.08)",
                          "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                            borderColor: isActive ? accentColor : `${accentColor}60`,
                          },
                        }}
                      >
                        {/* Color preview area */}
                        <Box sx={{
                          height: 64,
                          background: `linear-gradient(135deg, ${tmpl.bg} 0%, ${tmpl.accent}44 100%)`,
                          position: "relative",
                          overflow: "hidden",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-start",
                          p: "10px 12px",
                          gap: "6px",
                        }}>
                          {/* Mock slide elements */}
                          <Box sx={{ flex: 1 }}>
                            <Box sx={{ height: 4, width: "70%", borderRadius: 2, background: isDark ? `rgba(255,255,255,0.7)` : `${tmpl.accent}`, mb: "4px" }} />
                            <Box sx={{ height: 2.5, width: "50%", borderRadius: 1, background: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.15)" }} />
                            <Box sx={{ height: 2, width: "40%", borderRadius: 1, background: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)", mt: "3px" }} />
                          </Box>
                          <Box sx={{
                            width: 28, height: 28,
                            borderRadius: "6px",
                            background: `${tmpl.accent}44`,
                            border: `1px solid ${tmpl.accent}66`,
                            flexShrink: 0,
                          }} />
                          {/* Active checkmark */}
                          {isActive && (
                            <Box sx={{
                              position: "absolute", top: 5, right: 5,
                              width: 16, height: 16, borderRadius: "50%",
                              background: accentColor,
                              display: "flex", alignItems: "center", justifyContent: "center",
                            }}>
                              <CheckIcon sx={{ fontSize: 10, color: "#fff" }} />
                            </Box>
                          )}
                        </Box>
                        {/* Name label */}
                        <Box sx={{
                          px: 1, py: 0.6,
                          background: PANEL.surfaceSunken,
                          borderTop: isActive ? `1px solid ${accentColor}30` : `1px solid ${PANEL.border}`,
                        }}>
                          <Typography sx={{
                            fontSize: "0.68rem",
                            fontWeight: isActive ? 700 : 500,
                            color: isActive ? accentColor : PANEL.text,
                            textAlign: "center",
                            lineHeight: 1,
                          }}>
                            {tmpl.name}
                          </Typography>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>

                {/* Scope info */}
                <Box sx={{ mt: 1.5, px: 1, py: 0.875, borderRadius: "8px", background: PANEL.surfaceSunken, textAlign: "center" }}>
                  <Typography sx={{ fontSize: "0.65rem", color: PANEL.textMuted, lineHeight: 1.5 }}>
                    {scope === "all"
                      ? `Applying to all ${slides.length} slides`
                      : "Applying to current slide only"}
                  </Typography>
                </Box>
              </Box>
            )}

            {/* ════════ LAYOUTS TAB ════════ */}
            {activeTab === "layouts" && (
              <Box sx={{ p: 1.5 }}>
                {activeTemplateStyle && (
                  <Box sx={{
                    mb: 1.5, p: 1.25, borderRadius: "10px",
                    background: "rgba(251,191,36,0.08)",
                    border: "1px solid rgba(251,191,36,0.2)",
                  }}>
                    <Typography sx={{ fontSize: "0.68rem", color: "#92400E", lineHeight: 1.5 }}>
                      A template style is active. Remove it to use layout variants.
                    </Typography>
                  </Box>
                )}
                <Box sx={{
                  display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1,
                  opacity: activeTemplateStyle ? 0.35 : 1,
                  pointerEvents: activeTemplateStyle ? "none" : "auto",
                }}>
                  {Array.from({ length: variantCount }, (_, i) => {
                    const isActive = !activeTemplateStyle && activeVariantIndex === i;
                    return (
                      <Tooltip key={i} title={variantNames[i] || `Layout ${i + 1}`} placement="right" arrow>
                        <Box
                          onClick={() => handleSelectVariant(i)}
                          sx={{
                            cursor: "pointer",
                            borderRadius: "12px",
                            border: isActive ? `2px solid ${accentColor}` : "2px solid transparent",
                            background: isActive ? `${accentColor}12` : PANEL.surfaceSunken,
                            p: "8px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "6px",
                            transition: "all 0.15s ease",
                            boxShadow: isActive
                              ? `0 0 0 3px ${accentColor}18`
                              : "0 1px 4px rgba(0,0,0,0.06)",
                            "&:hover": {
                              borderColor: `${accentColor}50`,
                              background: `${accentColor}05`,
                              transform: "translateY(-1px)",
                            },
                          }}
                        >
                          <Box sx={{ borderRadius: "8px", overflow: "hidden", width: "100%", display: "flex", justifyContent: "center" }}>
                            <LayoutDiagram layoutType={layoutType} variantIndex={i} isActive={isActive} accentColor={accentColor} />
                          </Box>
                          <Typography sx={{
                            fontSize: "0.65rem",
                            fontWeight: isActive ? 700 : 500,
                            color: isActive ? accentColor : "#6B7280",
                            textAlign: "center",
                            lineHeight: 1.2,
                          }}>
                            {variantNames[i] || `Layout ${i + 1}`}
                          </Typography>
                          {isActive && (
                            <Box sx={{ width: 20, height: 2.5, borderRadius: 2, background: accentColor }} />
                          )}
                        </Box>
                      </Tooltip>
                    );
                  })}
                </Box>
              </Box>
            )}

          </Box>
        )}

        {/* ── Footer ── */}
        <Box sx={{
          flexShrink: 0, px: 2, py: 1.25,
          borderTop: `1px solid ${PANEL.border}`,
          background: PANEL.surface,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Typography sx={{ fontSize: "0.65rem", color: PANEL.textFaint }}>
            Text &amp; images stay editable after switching
          </Typography>
        </Box>
      </Box>
    );
  }
);

LayoutSwitcherPanel.displayName = "LayoutSwitcherPanel";
export default LayoutSwitcherPanel;

