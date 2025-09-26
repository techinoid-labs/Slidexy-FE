// NEW

"use client";

import React, { useState, useEffect } from "react";
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
import { useSlideThemeContext } from "../context/ThemeContext";
import { useSlides } from "../context/SlidesContext";
import { set, get } from "idb-keyval";

interface Theme {
  font: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  image_url: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const LOCAL_STORAGE_THEME_KEY = "slidesTheme";
const INDEXED_DB_THEME_KEY = "slidesThemeIndexed";

const TemplatePanel = ({ sidebarHeight = "100vh", onClose, isOpen }: any) => {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"ai" | "default">("ai");

  const { selectedTheme, setSelectedTheme } = useSlideThemeContext();
  const { setSlides, slides, aiThemes, setAiThemes } = useSlides();

  const themeImageUrls = [
    "/theme-1.jpeg",
    "/theme-2.jpeg",
    "/theme-3.jpeg",
    "/theme-4.jpg",
    "/theme-5.jpeg",
    "/theme-6.jpg",
  ];

  const defaultThemes: Theme[] = [
    {
      font: "Inter",
      primaryColor: "#fff",
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
      font: "Open Sans",
      primaryColor: "#ffa",
      secondaryColor: "#00BCD4",
      backgroundColor: "#E3F2FD",
      image_url: themeImageUrls[2],
    },
    {
      font: "Poppins",
      primaryColor: "#9E7e12",
      secondaryColor: "#FFD600",
      backgroundColor: "#F1F8E9",
      image_url: themeImageUrls[3],
    },
    {
      font: "Lato",
      primaryColor: "#fff",
      secondaryColor: "#FF7043",
      backgroundColor: "#ECEFF1",
      image_url: themeImageUrls[4],
    },
    {
      font: "Montserrat",
      primaryColor: "#F7D9EC",
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

    const isBase64 = theme.image_url.includes("base64");

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

    const updatedSlides = slides.map((slide) => ({
      ...slide,
      slide_title: { ...slide.slide_title, useThemeColor: true },
      elements: slide.elements.map((el) => {
        if (
          el.element_type === "text" ||
          (el.element_type === "bullet_point" && el.useThemeColor !== false)
        ) {
          return { ...el, useThemeColor: true };
        }
        return el;
      }),
    }));

    setSlides(updatedSlides);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  const activeThemes = activeTab === "ai" ? aiThemes : defaultThemes;

  return (
    <Box
      sx={{
        position: "absolute",
        left: 80,
        top: 0,
        height: sidebarHeight,
        width: 420,
        bgcolor: "#fff",
        borderRight: "1px solid #E0E0E0",
        zIndex: 10,
        boxShadow: 3,
        display: isOpen ? "flex" : "none",
        flexDirection: "column",
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 3,
          py: 2,
          borderBottom: "1px solid #EEE",
        }}
      >
        <Typography fontSize={20} fontWeight={600}>
          Templates
        </Typography>
        <IconButton size="small" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* SEARCH BAR */}
      <Box sx={{ px: 3, py: 2 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            bgcolor: "#F5F5F5",
            borderRadius: 2,
            px: 2,
            height: 42,
            border: "1px solid #DDD",
          }}
        >
          <InputBase
            placeholder="Type a theme prompt to generate..."
            sx={{ flex: 1, fontSize: 15 }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleInputKeyDown}
            disabled={loading}
          />
          <Tooltip title="Search">
            <IconButton size="small" onClick={handleSearch} disabled={loading}>
              {loading ? (
                <CircularProgress size={18} />
              ) : (
                <SearchIcon sx={{ color: "#666" }} />
              )}
            </IconButton>
          </Tooltip>
        </Box>
        {error && (
          <Typography sx={{ color: "red", fontSize: 13, mt: 1 }}>
            {error}
          </Typography>
        )}
      </Box>

      {/* TAB SWITCH */}
      <Box sx={{ display: "flex", px: 3 }}>
        <Box
          onClick={() => setActiveTab("ai")}
          sx={{
            flex: 1,
            cursor: "pointer",
            bgcolor: activeTab === "ai" ? "#EFE8FF" : "#F9F9F9",
            color: activeTab === "ai" ? "#7B4AE2" : "#888",
            fontWeight: activeTab === "ai" ? 600 : 500,
            borderRadius: 2,
            textAlign: "center",
            py: 1,
            fontSize: 15,
          }}
        >
          From Slide AI
        </Box>
        <Box sx={{ width: 8 }} />
        <Box
          onClick={() => setActiveTab("default")}
          sx={{
            flex: 1,
            cursor: "pointer",
            bgcolor: activeTab === "default" ? "#EFE8FF" : "#F9F9F9",
            color: activeTab === "default" ? "#7B4AE2" : "#888",
            fontWeight: activeTab === "default" ? 600 : 500,
            borderRadius: 2,
            textAlign: "center",
            py: 1,
            fontSize: 15,
          }}
        >
          Default Templates
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* THEME LIST */}
      <Box sx={{ flex: 1, overflowY: "auto", px: 3, pb: 3 }}>
        {activeThemes.length > 0 ? (
          activeThemes.map((theme: Theme, i: number) => (
            <Box
              key={i}
              onClick={() => handleThemeSelect(theme)}
              sx={{
                display: "flex",
                gap: 2,
                p: 2,
                mb: 2,
                bgcolor: "#FAFAFA",
                border: "1px solid #EEE",
                borderRadius: 3,
                cursor: "pointer",
                boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                "&:hover": {
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                },
              }}
            >
              <Box
                component="img"
                src={theme.image_url}
                alt="theme"
                sx={{
                  width: 100,
                  height: 70,
                  objectFit: "cover",
                  borderRadius: 2,
                  border: "1px solid #DDD",
                  background: "#fff",
                }}
              />
              <Box sx={{ flex: 1 }}>
                <Typography
                  fontSize={15}
                  fontWeight={500}
                  sx={{ color: theme.primaryColor }}
                >
                  {theme.font}
                </Typography>
                <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                  {[
                    theme.primaryColor,
                    theme.secondaryColor,
                    theme.backgroundColor,
                  ].map((color, index) => (
                    <Box
                      key={index}
                      sx={{
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        bgcolor: color,
                        border: "1px solid #CCC",
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </Box>
          ))
        ) : (
          <Typography
            sx={{
              color: "#999",
              textAlign: "center",
              mt: 6,
              fontSize: 15,
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
};

export default TemplatePanel;
