"use client";

import React, { useState } from "react";
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

interface TemplatePanelProps {
  sidebarHeight?: string | number;
  onClose?: () => void;
}

const TemplatePanel: React.FC<TemplatePanelProps> = ({
  sidebarHeight = "100vh",
  onClose,
}) => {
  const [search, setSearch] = useState("");
  const [themes, setThemes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!search.trim()) return;
    console.log("🔍 Search triggered with prompt:", search);
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/generate-theme-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: search }),
      });

      console.log("📡 API Response Status:", res.status);

      if (!res.ok) throw new Error("❌ Failed to fetch themes");

      const data = await res.json();
      console.log("✅ API Response Data:", data);

      const themesWithCleanedImages = (data.themes || []).map((theme: any) => ({
        ...theme,
        image_url: cleanBase64(theme.image_url),
      }));

      setThemes(themesWithCleanedImages);
    } catch (e: any) {
      console.error("🚨 Error during fetch:", e);
      setError(e.message || "Unknown error");
      setThemes([]);
    } finally {
      setLoading(false);
      console.log("🔁 Search finished");
    }
  };

  const cleanBase64 = (url: string): string => {
    if (!url.startsWith("data:image")) {
      return `data:image/png;base64,${url}`;
    }
    return url;
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

      {/* Theme Results */}
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
                  border: "1px solid #EEE",
                  borderRadius: 3,
                  boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                  transition: "0.2s ease",
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
                  onError={() => console.warn("⚠️ Image failed to load:", theme.image_url)}
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
                    {[theme.primaryColor, theme.secondaryColor, theme.backgroundColor].map(
                      (color, index) => (
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
                      )
                    )}
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
