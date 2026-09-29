"use client";

import React, { useState, useEffect } from "react";
import { Box, Typography, IconButton, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface FontSizePanelProps {
  fontSize: number;
  onFontSizeChange: (newFontSize: number) => void;
  onClose?: () => void;
}

const FontSizePanel: React.FC<FontSizePanelProps> = ({
  fontSize: initialFontSize,
  onFontSizeChange,
  onClose,
}) => {
  const [currentFontSize, setCurrentFontSize] = useState(initialFontSize);

  useEffect(() => {
    setCurrentFontSize(initialFontSize);
  }, [initialFontSize]);

  const handleFontSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = parseInt(event.target.value);
    setCurrentFontSize(newSize);
  };

  const handleApply = () => {
    onFontSizeChange(currentFontSize);
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
        <IconButton onClick={onClose} sx={{ color: "#000000" }}>
          <CloseIcon />
        </IconButton>
        <Typography variant="h6" sx={{ fontSize: 16, color: "#000000", align: "center", mr: 10, ml: 5 }}>
          Font Size
        </Typography>
        <div></div> {/* Placeholder for symmetry */}
      </Box>

      {/* Font Size Slider */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="caption" sx={{ color: "#000000", mb: 1, fontWeight: 500 }}>
          Font Size
        </Typography>
        <Box
          sx={{
            border: "1px solid #ccc",
            borderRadius: "4px",
            p: 1,
            height: 40,
            backgroundColor: "#fff",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <input
              type="range"
              min="16"
              max="36"
              step="1"
              value={currentFontSize}
              onChange={handleFontSizeChange}
              style={{ width: "100%", marginRight: 8 }}
            />
            <Typography sx={{ fontSize: 14, minWidth: 40 }}>
              {currentFontSize}px
            </Typography>
          </Box>
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

export default FontSizePanel;
