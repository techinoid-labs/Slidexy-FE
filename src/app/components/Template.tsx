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
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useSlideThemeContext } from "../context/ThemeContext";
import Image from "next/image";
import { useSlides } from "../context/SlidesContext";

interface Theme {
  font: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  image_url: string;
}

interface TemplatePanelProps {
  sidebarHeight?: string | number;
  onClose?: () => void;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const TemplatePanel = ({
  sidebarHeight = "100vh",
  onClose,
}: TemplatePanelProps) => {
  const [search, setSearch] = useState("");
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imgError, setImgError] = useState(false);
  const { selectedTheme, setSelectedTheme } = useSlideThemeContext();
  const { setSlides, slides } = useSlides();
  const themeImageUrls = [
    "/theme-1.jpeg",
    "/theme-2.jpeg",
    "/theme-3.jpeg",
    "/theme-4.jpg",
    "/theme-5.jpeg",
    "/theme-6.jpg",
  ];

  const mockThemes: Theme[] = [
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
      primaryColor: "#F7D9EC		",
      secondaryColor: "#FF8A65",
      backgroundColor: "#FFF3E0",
      image_url: themeImageUrls[5],
    },
  ];

  const fallbackThemes: Theme[] = [
    {
      font: "Inter",
      primaryColor: "#2c3e50",
      secondaryColor: "#e67e22",
      backgroundColor: "#ecf0f1",
      image_url: themeImageUrls[0],
    },
    {
      font: "Roboto",
      primaryColor: "#8e44ad",
      secondaryColor: "#16a085",
      backgroundColor: "#f9e79f",
      image_url: themeImageUrls[1],
    },
    {
      font: "Poppins",
      primaryColor: "#2980b9",
      secondaryColor: "#f1c40f",
      backgroundColor: "#f5eef8",
      image_url: themeImageUrls[2],
    },
    {
      font: "Lato",
      primaryColor: "#c0392b",
      secondaryColor: "#27ae60",
      backgroundColor: "#f6ddcc",
      image_url: themeImageUrls[3],
    },
    {
      font: "Montserrat",
      primaryColor: "#34495e",
      secondaryColor: "#e74c3c",
      backgroundColor: "#d5f5e3",
      image_url: themeImageUrls[4],
    },
    {
      font: "Open Sans",
      primaryColor: "#1abc9c",
      secondaryColor: "#9b59b6",
      backgroundColor: "#f2d7d5",
      image_url: themeImageUrls[5],
    },
  ];

  useEffect(() => {
    setThemes(mockThemes);
  }, []);

  const handleSearch = async () => {
    if (!search.trim()) return;

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
      console.log("🎨 API Response Themes:", data.themes);

      const cleanedThemes = (data.themes || []).map(
        (theme: any, index: number) => {
          return {
            font: theme.font || "Inter",
            primaryColor: theme.primaryColor || "#000",
            secondaryColor: theme.secondaryColor || "#888",
            backgroundColor: theme.backgroundColor || "#fff",
            image_url: theme.image_base64 || "", // use directly without manipulating
          };
        }
      );

      const newThemes =
        cleanedThemes.length > 0 ? cleanedThemes : fallbackThemes;

      console.log("✅ Cleaned Themes:", newThemes);
      setThemes(newThemes);

      if (newThemes.length > 0) {
        setSelectedTheme(newThemes[0]);
      }
    } catch (e: any) {
      console.error("Error during fetch:", e);
      setError(e.message || "Unknown error");
      setThemes(fallbackThemes);
    } finally {
      setLoading(false);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

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
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
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

      {/* Search Bar */}
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
            placeholder="Describe your theme..."
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

      {/* Tabs */}
      <Box sx={{ display: "flex", px: 3 }}>
        <Box
          sx={{
            flex: 1,
            bgcolor: "#EFE8FF",
            color: "#7B4AE2",
            fontWeight: 600,
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
          sx={{
            flex: 1,
            bgcolor: "#F9F9F9",
            color: "#888",
            fontWeight: 500,
            borderRadius: 2,
            textAlign: "center",
            py: 1,
            fontSize: 15,
          }}
        >
          Your Templates
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Theme Cards */}
      <Box sx={{ flex: 1, overflowY: "auto", px: 3, pb: 3 }}>
        {themes.length > 0 ? (
          <>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <Typography fontWeight={500} fontSize={16}>
                Theme Suggestions
              </Typography>
              <ArrowForwardIosIcon sx={{ fontSize: 16, color: "#888" }} />
            </Box>

            {themes.map((theme, i) => (
              <Box
                key={i}
                sx={{
                  display: "flex",
                  gap: 2,
                  p: 2,
                  mb: 2,
                  bgcolor: "#FAFAFA",
                  border:
                    selectedTheme?.image_url === theme.image_url
                      ? "2px solid #7B4AE2"
                      : "1px solid #EEE",
                  borderRadius: 3,
                  boxShadow:
                    selectedTheme?.image_url === theme.image_url
                      ? "0 4px 16px rgba(123,74,226,0.12)"
                      : "0 2px 6px rgba(0,0,0,0.05)",
                  transition: "0.2s ease",
                  cursor: "pointer",
                  "&:hover": {
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  },
                }}
                // onClick={() => setSelectedTheme(theme)}
                onClick={() => {
                  setSelectedTheme(theme);
                  const updatedSlides = slides.map((slide) => ({
                    ...slide,
                    slide_title: { ...slide.slide_title, useThemeColor: true },
                    elements: slide.elements.map((el) => {
                      if (
                        el.element_type === "text" ||
                        (el.element_type === "bullet_point" &&
                          el.useThemeColor !== false)
                      ) {
                        return {
                          ...el,
                          useThemeColor: true,
                        };
                      }
                      return el;
                    }),
                  }));

                  setSlides(updatedSlides);
                }}
              >
                {theme.image_url && theme.image_url.startsWith("data:image") ? (
                  <img
                    src={theme.image_url}
                    alt="theme"
                    style={{
                      width: 200,
                      height: 140,
                      objectFit: "cover",
                      borderRadius: 8,
                      border: "1px solid #DDD",
                      background: "#fff",
                    }}
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <img
                    src={
                      imgError
                        ? "https://source.unsplash.com/200x140/?abstract,theme"
                        : theme.image_url
                    }
                    alt="theme"
                    style={{
                      width: 200,
                      height: 140,
                      objectFit: "cover",
                      borderRadius: 8,
                      border: "1px solid #DDD",
                      background: "#fff",
                    }}
                    onError={() => setImgError(true)}
                  />
                )}
                <Box sx={{ flex: 1 }}>
                  <Typography
                    fontSize={15}
                    fontWeight={600}
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
            ))}
          </>
        ) : (
          <Typography
            sx={{
              color: "#999",
              textAlign: "center",
              mt: 6,
              fontSize: 15,
            }}
          >
            No themes to display. Try searching for a topic!
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default TemplatePanel;
