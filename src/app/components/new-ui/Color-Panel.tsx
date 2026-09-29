"use client";

import React, { useState, useEffect } from "react";
import { Box, Typography, IconButton, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { ChromePicker } from "react-color";

interface ColorPanelMobileProps {
  color: string;
  onColorChange: (newColor: string) => void;
  onClose?: () => void;
}

const ColorPanelMobile: React.FC<ColorPanelMobileProps> = ({ color: initialColor, onColorChange, onClose }) => {
  const [currentColor, setCurrentColor] = useState("#000000");
  const [presetColors, setPresetColors] = useState(["#FFFFFF", "#E0E0FF", "#A0A0FF", "#4040FF", "#000080"]);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);

  useEffect(() => {
    const validInitialColor = /^#([0-9A-Fa-f]{3}){1,2}$/.test(initialColor) ? initialColor : "#000000";
    setCurrentColor(validInitialColor);
  }, [initialColor]);

  const handleColorChange = (newColor: string) => {
    setCurrentColor(newColor);
  };

  const handleCustomColorPick = (color: any) => {
    const newColor = color.hex;
    setCurrentColor(newColor);
    if (!presetColors.includes(newColor)) {
      setPresetColors([...presetColors, newColor]);
    }
    setIsColorPickerOpen(false);
  };

  const handleApply = () => {
    onColorChange(currentColor);
    if (onClose) onClose();
  };

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
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <IconButton onClick={onClose} sx={{ color: "#1a1a1a" }}>
          <CloseIcon />
        </IconButton>
        <Typography variant="h6" sx={{ fontSize: 16, color: "#1a1a1a" }}>
          Select Color
        </Typography>
        <IconButton sx={{ color: "#000000" }} onClick={() => setIsColorPickerOpen(true)}>
          <AddIcon />
        </IconButton>
      </Box>

      {/* Preset Colors */}
      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
        {presetColors.map((presetColor) => (
          <Box
            key={presetColor}
            role="button"
            tabIndex={0}
            aria-label={`Use color ${presetColor}`}
            sx={{
              width: 24,
              height: 24,
              borderRadius: "50%",
              backgroundColor: presetColor,
              border: currentColor === presetColor ? "2px solid #8E2DE2" : "1px solid #aaa",
              cursor: "pointer",
              transition: "transform 0.15s ease",
              "&:hover": { transform: "scale(1.1)" },
              "&:focus-visible": { outline: "2px solid #8E2DE2", outlineOffset: "2px" },
            }}
            onClick={() => handleColorChange(presetColor)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleColorChange(presetColor);
              }
            }}
          />
        ))}
      </Box>

      {/* Custom Color Preview + Picker */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="caption" sx={{ color: "#6B48FF", mb: 1 }}>
          Custom Color
        </Typography>
        <Box
          sx={{
            border: "1px solid #ccc",
            borderRadius: "4px",
            p: 1,
            cursor: "pointer",
            backgroundColor: isColorPickerOpen ? "#f5f5f5" : "#fff",
          }}
          onClick={() => setIsColorPickerOpen(true)}
        >
          {/* Color preview */}
          <Box
            sx={{
              width: "100%",
              height: 20,
              backgroundColor: currentColor,
              borderRadius: "4px",
              mb: isColorPickerOpen ? 2 : 0,
            }}
          />

          {/* Centered ChromePicker */}
          {isColorPickerOpen && (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <ChromePicker
                color={currentColor}
                onChange={handleCustomColorPick}
                disableAlpha={true}
              />
            </Box>
          )}
        </Box>
      </Box>

      {/* Apply Button */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <Button
          variant="contained"
          size="small"
          sx={{ width: 290 }}
          onClick={handleApply}
        >
          Apply
        </Button>
      </Box>
    </Box>
  );
};

export default ColorPanelMobile;
