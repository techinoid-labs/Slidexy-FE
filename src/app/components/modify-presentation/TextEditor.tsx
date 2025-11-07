"use client";

import React from "react";
import { Box, Button, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { useSlides } from "@/app/context/SlidesContext";

interface TextEditorProps {
  sidebarHeight?: string | number;
  onClose?: () => void;
}

const TextEditor: React.FC<TextEditorProps> = ({
  sidebarHeight = "100vh",
  onClose,
}) => {
  const { addText } = useSlides();

  const handleAddTextElement = (
    text: string,
    fontSize: number,
    fontWeight: number,
    color = "#222"
  ) => {
    // ✅ FIXED: Use addText from context which handles variants correctly
    addText({
      text,
      fontSize,
      fontWeight: fontWeight.toString(),
      fill: color,
      fontFamily: "Inter",
      x: 200,
      y: 300,
    });

    if (onClose) onClose();
  };

  return (
    <Box
      sx={{
        width: 320,
        bgcolor: "#fff",
        height: sidebarHeight,
        position: "absolute",
        left: 80,
        top: 0,
        borderRight: "1px solid #E0E0E0",
        zIndex: 10,
        boxShadow: 2,
        display: "flex",
        flexDirection: "column",
        p: 0,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 3,
          pb: 2,
        }}
      >
        <Typography sx={{ fontWeight: 600, fontSize: 20 }}>Text</Typography>
        <IconButton size="small" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Add Text Box Button */}
      <Box sx={{ px: 3, mb: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<AddIcon />}
          sx={{
            borderRadius: 8,
            height: 44,
            fontWeight: 600,
            fontSize: 17,
            bgcolor: "#F8F8FA",
            borderColor: "#E0E0E0",
            color: "#222",
            mb: 1,
            "&:hover": {
              bgcolor: "#F3EDFF",
              borderColor: "#7B4AE2",
              color: "#7B4AE2",
            },
          }}
          onClick={() => handleAddTextElement("New Text Box", 24, 600)}
        >
          Add Text Box
        </Button>
      </Box>

      {/* Text Variants */}
      <Box
        sx={{
          px: 3,
          mb: 2,
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
        }}
      >
        <Button
          fullWidth
          sx={{
            bgcolor: "#F8F8FA",
            borderRadius: 3,
            height: 48,
            fontWeight: 700,
            fontSize: 24,
            color: "#222",
            mb: 0.5,
            textTransform: "none",
          }}
          onClick={() => handleAddTextElement("Title Text", 32, 700)}
        >
          Add a Title
        </Button>
        <Button
          fullWidth
          sx={{
            bgcolor: "#F8F8FA",
            borderRadius: 3,
            height: 44,
            fontWeight: 600,
            fontSize: 20,
            color: "#222",
            mb: 0.5,
            textTransform: "none",
          }}
          onClick={() => handleAddTextElement("Headline Text", 26, 600)}
        >
          Add a Headline
        </Button>
        <Button
          fullWidth
          sx={{
            bgcolor: "#F8F8FA",
            borderRadius: 3,
            height: 44,
            fontWeight: 500,
            fontSize: 18,
            color: "#222",
            mb: 0.5,
            textTransform: "none",
          }}
          onClick={() => handleAddTextElement("Sub Headline Text", 20, 500)}
        >
          Add a Sub Headline
        </Button>
        <Button
          fullWidth
          sx={{
            bgcolor: "#F8F8FA",
            borderRadius: 3,
            height: 44,
            fontWeight: 400,
            fontSize: 16,
            color: "#888",
            textTransform: "none",
          }}
          onClick={() => handleAddTextElement("Body Text", 16, 400, "#888")}
        >
          Add Body Text
        </Button>
      </Box>
    </Box>
  );
};

export default TextEditor;
