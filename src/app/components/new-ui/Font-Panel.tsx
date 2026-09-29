"use client";

import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Typography,
  Grid,
  Button,
  Divider,
  IconButton,
} from "@mui/material";

const fontCategories = [
  {
    title: "Serif",
    fonts: ["Playfair Display", "Roboto Serif", "Arial Rounded", "Times New Roman"],
  },
  {
    title: "Sans-Serif",
    fonts: ["Helvetica", "Open Sans", "Montserrat", "Roboto", "Raleway", "Arial"],
  },
  {
    title: "Display",
    fonts: ["Oswald", "Bebas Neue", "Lobster"],
  },
  {
    title: "Monospace",
    fonts: ["Courier New", "Consolas", "Menlo"],
  },
];

interface FontPanelProps {
  selectedFont: string;
  onFontChange: (font: string) => void;
  onApply: () => void;
  onClose: () => void;
}

const FontPanel: React.FC<FontPanelProps> = ({
  selectedFont,
  onFontChange,
  onApply,
  onClose,
}) => {
  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 143,
        width: window.innerWidth * 0.9,
        height: window.innerHeight * 0.4,
        backgroundColor: "#fff",
        borderTopLeftRadius: "10px",
        borderTopRightRadius: "10px",
        boxShadow: 3,
        right: "5%",
        p: 2,
        zIndex: 4,
        overflowY: "auto",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 1,
        }}
      >
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
        <Typography
          sx={{
            fontWeight: 500,
            mt: 1,
            mb: 1,
            fontSize: 15,
            mr: 8,
          }}
        >
          Select Font Typeface
        </Typography>
      </Box>
      <Divider />

      {fontCategories.map((category) => (
        <Box key={category.title} sx={{ mt: 3 }}>
          <Typography sx={{ fontWeight: 500, mb: 1 }}>
            {category.title}
          </Typography>
          <Box
            sx={{
              display: "flex",
              overflowX: "auto",
              gap: 1,
              pb: 1,
            }}
          >
            {category.fonts.map((font) => (
              <Box
                key={font}
                role="button"
                tabIndex={0}
                onClick={() => onFontChange(font)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onFontChange(font);
                  }
                }}
                sx={{
                  minWidth: 100,
                  height: 100,
                  borderRadius: 2,
                  textAlign: "center",
                  py: 5,
                  px: 1,
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  fontFamily: font,
                  border:
                    selectedFont === font
                      ? "2px solid #4A00E0"
                      : "1px solid #eee",
                  backgroundColor:
                    selectedFont === font ? "#F5F3FF" : "#F8F8FA",
                  color: "#000",
                  flexShrink: 0,
                  transition: "border-color 0.15s ease, background-color 0.15s ease",
                  "&:hover": { borderColor: "#8E2DE2" },
                  "&:focus-visible": { outline: "2px solid #8E2DE2", outlineOffset: "2px" },
                }}
              >
                {font}
              </Box>
            ))}
          </Box>
        </Box>
      ))}

      {/* Apply Button */}
      <Button
        fullWidth
        variant="contained"
        sx={{ mt: 3 }}
        onClick={onApply}
      >
        Apply
      </Button>
    </Box>
  );

};

export default FontPanel;
