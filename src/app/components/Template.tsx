"use client";

import React, { useState, useEffect, forwardRef } from "react";
import {
  Box,
  IconButton,
  InputBase,
  CircularProgress,
  Divider,
  Typography,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import { motion } from "framer-motion";
import { useSlideThemeContext } from "../context/ThemeContext";
import { useSlides } from "../context/SlidesContext";
import { set, get } from "idb-keyval";
import { palettes, paletteToTheme } from "@/utils/themePalettes";
import { generateSlideVariants } from "@/utils/variantGenerator";
import {
  PANEL,
  panelContainerSx,
  panelHeaderSx,
  panelTitleSx,
  panelCloseButtonSx,
  panelSearchBarSx,
  panelTileSx,
} from "./modify-presentation/panelTheme";

interface Theme {
  font: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  image_url: string;
}
interface TemplateProps {
  sidebarHeight: string;
  onClose: () => void;
}
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const LOCAL_STORAGE_THEME_KEY = "slidesTheme";
const INDEXED_DB_THEME_KEY = "slidesThemeIndexed";

const TemplatePanel = forwardRef<HTMLDivElement, TemplateProps>(
  ({ sidebarHeight = "100vh", onClose }, ref) => {
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState<"ai" | "default">("default");

    const { selectedTheme, setSelectedTheme } = useSlideThemeContext();
    const { setSlides, slides, aiThemes, setAiThemes } = useSlides();

    const themeImageUrls = [
      "/theme-2.jpg",
      "/theme-1.jpg",
      "/theme-3.jpg",
      "/theme-4.jpg",
      "/theme-5.jpg",
      "/theme-7.jpg",
    ];

    const defaultThemes: Theme[] = [
      {
        font: "Raleway",
        primaryColor: "#1A202C",
        secondaryColor: "#007AFF",
        backgroundColor: "#E0F7FA",
        image_url: themeImageUrls[0],
      },
      {
        font: "Roboto",
        primaryColor: "#4A148C",
        secondaryColor: "#F50057",
        backgroundColor: "#F3E5F5",
        image_url: themeImageUrls[1],
      },
      {
        font: "Poppins",
        primaryColor: "#2D3748",
        secondaryColor: "#FFD600",
        backgroundColor: "#F1F8E9",
        image_url: themeImageUrls[3],
      },
      {
        font: "Lato",
        primaryColor: "#2C3E50",
        secondaryColor: "#FF7043",
        backgroundColor: "#ECEFF1",
        image_url: themeImageUrls[4],
      },
      {
        font: "Montserrat",
        primaryColor: "#5D4037",
        secondaryColor: "#FF8A65",
        backgroundColor: "#FFF3E0",
        image_url: themeImageUrls[5],
      },
    ];

    useEffect(() => {
      const loadTheme = async () => {
        const localStorageTheme = localStorage.getItem(LOCAL_STORAGE_THEME_KEY);

        if (localStorageTheme) {
          try {
            const fallback = JSON.parse(localStorageTheme);
            setSelectedTheme(fallback);

            // Cleanup any lingering IndexedDB theme
            await set(INDEXED_DB_THEME_KEY, null);
            return;
          } catch (e) {
            console.error("Failed to parse fallback localStorage theme:", e);
          }
        }

        try {
          const stored = await get(INDEXED_DB_THEME_KEY);
          if (stored) {
            setSelectedTheme(stored);

            // Cleanup localStorage if we're loading from IndexedDB
            localStorage.removeItem(LOCAL_STORAGE_THEME_KEY);
          }
        } catch (err) {
          console.error("Failed to load theme from IndexedDB:", err);
        }
      };

      loadTheme();
    }, []);

    const handleSearch = async () => {
      if (!search.trim()) {
        setError("Please enter a theme description to search.");
        return;
      }

      setLoading(true);
      setError("");

      try {
        const res = await fetch(`${API_BASE_URL}/generate-theme-image`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: search }),
        });

        if (!res.ok) throw new Error("Failed to fetch themes");

        const data = await res.json();
        const cleaned = (data.themes || []).map((theme: any) => ({
          ...theme,
          image_url: theme.image_base64.startsWith("data:image")
            ? theme.image_base64
            : `data:image/png;base64,${theme.image_base64}`,
        }));

        setAiThemes(cleaned);
      } catch (e: any) {
        setError(e.message || "Unknown error");
        setAiThemes([]);
      } finally {
        setLoading(false);
      }
    };

    const handleThemeSelect = async (theme: Theme) => {
      setSelectedTheme(theme);

      const isBase64 = theme.image_url?.includes("base64");

      try {
        if (isBase64) {
          await set(INDEXED_DB_THEME_KEY, theme);
          localStorage.removeItem(LOCAL_STORAGE_THEME_KEY);
        } else {
          localStorage.setItem(LOCAL_STORAGE_THEME_KEY, JSON.stringify(theme));
          await set(INDEXED_DB_THEME_KEY, null); // Clear IndexedDB when using non-base64 theme
        }
      } catch (e) {
        console.warn("Failed to save theme:", e);
      }

      const updatedSlides = slides.map((slide) => {
        const primaryColor = theme.primaryColor;

        const updateContent = (s: any) => ({
          ...s,
          // A template style renders its own hardcoded colors, completely
          // bypassing theme/layout colors — clear it so picking a theme
          // actually changes how the slide looks.
          templateStyle: undefined,
          slide_title: {
            ...s.slide_title,
            useThemeColor: true,
            properties: {
              ...s.slide_title?.properties,
              fill: primaryColor,
            },
          },
          subtitle: s.subtitle ? {
            ...s.subtitle,
            properties: {
              ...s.subtitle.properties,
              fill: primaryColor,
            }
          } : undefined,
          elements: (s.elements || []).map((el: any) => {
            if (
              el.element_type === "text" ||
              el.element_type === "bullet_point" ||
              el.element_type === "quote" ||
              el.element_type === "author" ||
              el.element_type === "context"
            ) {
              return {
                ...el,
                useThemeColor: true,
                properties: {
                  ...el.properties,
                  fill: primaryColor,
                },
              };
            }
            return el;
          }),
        });

        const updatedMain = updateContent(slide);

        // Regenerate layout variants immediately (background, art palette,
        // positions) so the change is visible right away instead of
        // depending on a separate effect elsewhere to pick it up.
        const newLayouts = generateSlideVariants(updatedMain, theme);
        const variantIndex = Math.min(
          slide.currentVariantIndex ?? 0,
          Math.max(newLayouts.length - 1, 0)
        );

        return {
          ...updatedMain,
          layouts: newLayouts,
          currentVariantIndex: variantIndex,
          background: newLayouts[variantIndex]?.background || updatedMain.background,
        };
      });

      setSlides(updatedSlides);
      onClose();
    };

    const handlePaletteSelect = (palette: string[]) => {
      handleThemeSelect(paletteToTheme(palette) as unknown as Theme);
    };

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") handleSearch();
    };

    const activeThemes = activeTab === "ai" ? aiThemes : defaultThemes;

    return (
      <Box
        ref={ref}
        component={motion.div}
        initial={{ x: -24, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -24, opacity: 0 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        sx={panelContainerSx(300, sidebarHeight)}
      >
        {/* HEADER */}
        <Box sx={panelHeaderSx}>
          <Typography sx={panelTitleSx}>Themes</Typography>
          <IconButton size="small" onClick={onClose} sx={panelCloseButtonSx}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* SEARCH BAR */}
        <Box sx={{ px: 3, pt: 2.25 }}>
          <Box sx={panelSearchBarSx}>
            <InputBase
              placeholder="Describe a theme to generate..."
              sx={{ flex: 1, fontSize: 14, color: PANEL.text, "& input::placeholder": { color: PANEL.textFaint, opacity: 1 } }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleInputKeyDown}
              disabled={loading}
            />
            <Tooltip title="Search">
              <IconButton
                size="small"
                onClick={handleSearch}
                disabled={loading}
                sx={{ transition: "background-color 0.18s ease, transform 0.18s ease", "&:hover": { bgcolor: PANEL.accentBg, transform: "scale(1.08)" } }}
              >
                {loading ? (
                  <CircularProgress size={16} sx={{ color: PANEL.accentSoft }} />
                ) : (
                  <SearchIcon sx={{ color: PANEL.accentSoft, fontSize: 18 }} />
                )}
              </IconButton>
            </Tooltip>
          </Box>
          {error && (
            <Typography sx={{ color: PANEL.danger, fontSize: 12.5, mt: 1 }}>
              {error}
            </Typography>
          )}
        </Box>

        {/* QUICK PALETTES */}
        <Box sx={{ px: 3, pt: 2.25 }}>
          <Typography sx={{ fontWeight: 600, fontSize: 12.5, color: PANEL.textMuted, mb: 1, textTransform: "uppercase", letterSpacing: "0.04em" }}>
            Quick Palettes
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {palettes.map((palette, i) => {
              const isActive = selectedTheme?.primaryColor === palette[1] && selectedTheme?.backgroundColor === palette[0];
              return (
                <Tooltip key={i} title="Apply palette" placement="top">
                  <Box
                    role="button"
                    tabIndex={0}
                    onClick={() => handlePaletteSelect(palette)}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handlePaletteSelect(palette); } }}
                    sx={{
                      display: "flex",
                      width: 40,
                      height: 26,
                      borderRadius: "8px",
                      overflow: "hidden",
                      cursor: "pointer",
                      border: isActive ? `2px solid ${PANEL.accent}` : `1px solid ${PANEL.border}`,
                      boxShadow: isActive ? `0 0 0 2px ${PANEL.accentBg}` : "none",
                      transition: "transform 0.15s ease, border-color 0.15s ease",
                      "&:hover": { transform: "translateY(-2px) scale(1.05)", borderColor: PANEL.accentBorder },
                    }}
                  >
                    {palette.map((c, ci) => (
                      <Box key={ci} sx={{ flex: 1, height: "100%", bgcolor: c }} />
                    ))}
                  </Box>
                </Tooltip>
              );
            })}
          </Box>
        </Box>

        {/* TAB SWITCH */}
        <Box sx={{ display: "flex", px: 3, pt: 2.25, gap: 1 }}>
          <Box
            component="button"
            type="button"
            onClick={() => setActiveTab("default")}
            sx={{
              flex: 1,
              cursor: "pointer",
              border: "none",
              bgcolor: activeTab === "default" ? PANEL.accentBg : "transparent",
              color: activeTab === "default" ? PANEL.accentSoft : PANEL.textMuted,
              fontWeight: activeTab === "default" ? 600 : 500,
              borderRadius: 2,
              textAlign: "center",
              py: 1,
              fontSize: 13.5,
              fontFamily: "inherit",
              transition: "background-color 0.15s ease, color 0.15s ease",
              "&:focus-visible": {
                outline: `2px solid ${PANEL.accent}`,
                outlineOffset: "2px",
              },
            }}
          >
            Default Themes
          </Box>
        </Box>

        <Divider sx={{ my: 2, borderColor: PANEL.border }} />

        {/* THEME LIST */}
        <Box sx={{ flex: 1, overflowY: "auto", px: 3, pb: 3 }}>
          {activeThemes.length > 0 ? (
            activeThemes.map((theme: Theme, i: number) => {
              const isActive = selectedTheme?.primaryColor === theme.primaryColor && selectedTheme?.font === theme.font;
              return (
                <Box
                  key={i}
                  role="button"
                  tabIndex={0}
                  aria-label={`Select ${theme.font} theme`}
                  onClick={() => handleThemeSelect(theme)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleThemeSelect(theme);
                    }
                  }}
                  sx={{
                    ...panelTileSx,
                    display: "flex",
                    gap: 2,
                    p: 1.5,
                    mb: 1.5,
                    borderColor: isActive ? PANEL.accent : PANEL.border,
                    boxShadow: isActive ? `0 0 0 2px ${PANEL.accentBg}` : "none",
                  }}
                >
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      flexShrink: 0,
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: theme.font,
                      fontWeight: 700,
                      fontSize: 18,
                      color: theme.primaryColor,
                      background: theme.backgroundColor,
                      border: `1px solid ${PANEL.border}`,
                    }}
                  >
                    Aa
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontSize: 14, fontWeight: 500, color: PANEL.text }}>
                      {theme.font}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 0.75, mt: 1 }}>
                      {[
                        theme.primaryColor,
                        theme.secondaryColor,
                        theme.backgroundColor,
                      ].map((color, index) => (
                        <Box
                          key={index}
                          sx={{
                            width: 16,
                            height: 16,
                            borderRadius: "50%",
                            bgcolor: color,
                            border: `1px solid ${PANEL.border}`,
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                  {isActive && (
                    <Box sx={{ width: 8, height: 8, borderRadius: "50%", background: PANEL.accent, alignSelf: "center", flexShrink: 0 }} />
                  )}
                </Box>
              );
            })
          ) : (
            <Typography
              sx={{
                color: PANEL.textFaint,
                textAlign: "center",
                mt: 6,
                fontSize: 14,
              }}
            >
              {activeTab === "ai"
                ? "No themes to display. Try searching for a topic!"
                : "No default themes available."}
            </Typography>
          )}
        </Box>
      </Box>
    );
  }
);

export default TemplatePanel;
