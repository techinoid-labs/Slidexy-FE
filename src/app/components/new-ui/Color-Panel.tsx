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
        width: 320,
        maxHeight: 420,
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
        <IconButton onClick={onClose} sx={{ color: "#6B48FF" }}>
          <CloseIcon />
        </IconButton>
        <Typography variant="h6" sx={{ fontSize: 16, color: "#000000" }}>
          Select Color
        </Typography>
        <IconButton sx={{ color: "#6B48FF" }} onClick={() => setIsColorPickerOpen(true)}>
          <AddIcon />
        </IconButton>
      </Box>

      {/* Preset Colors */}
      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
        {presetColors.map((presetColor) => (
          <Box
            key={presetColor}
            sx={{
              width: 24,
              height: 24,
              borderRadius: "50%",
              backgroundColor: presetColor,
              border: "1px solid #aaa",
              cursor: "pointer",
            }}
            onClick={() => handleColorChange(presetColor)}
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
          sx={{
            backgroundColor: "linear-gradient(80.89deg, #8E2DE2 -90.43%, #4A00E0 74.73%)",
            color: "#fff",
            px: 4,
            py: 1,
            "&:hover": { backgroundColor: "#5A3ED9" },
            width: 290,
            height: 35,
            fontSize: 10,
            fontWeight : 500,

          }}
          onClick={handleApply}
        >
          Apply
        </Button>
      </Box>
    </Box>
  );
};

export default ColorPanelMobile;
