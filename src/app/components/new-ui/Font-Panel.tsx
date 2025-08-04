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
        position: "absolute",
        bottom: "0%",
        left: "8%",
        width: 320,
        maxHeight: 500,
        overflowY: "auto",
        backgroundColor: "#fff",
        borderTopLeftRadius: "10px",
        borderTopRightRadius: "10px",
        boxShadow: 3,
        p: 2,
        zIndex: 2,
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
                onClick={() => onFontChange(font)}
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
        sx={{
          mt: 3,
          borderRadius: 10,
          background: "linear-gradient(80.89deg, #8E2DE2 -90.43%, #4A00E0 74.73%)",
          textTransform: "none",
        }}
        onClick={onApply}
      >
        Apply
      </Button>
    </Box>
  );

};

export default FontPanel;
