"use client";

import React from "react";
import { Box, Button, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { useDispatch } from "react-redux";
import { useSlides } from "@/app/context/SlidesContext";
import { addTextElementToSlide } from "@/app/slice/slidesSlice";

interface TextEditorProps {
  sidebarHeight?: string | number;
  onClose?: () => void;
}

const TextEditor: React.FC<TextEditorProps> = ({
  sidebarHeight = "100vh",
  onClose,
}) => {
  const { selectedSlideIndex } = useSlides();
  const dispatch = useDispatch();
 const slidesState = useSlides();

  const handleAddTextElement = (
    text: string,
    fontSize: number,
    fontWeight: string,
    color = "#222"
  ) => {
    // Get the current slide's elements
        const currentSlide = slidesState.slides[slidesState.selectedSlideIndex];
    const GAP = 16; // vertical gap between elements

    // Find the max y + estimated height among text/bullet elements
    let maxY = 60; // Start below the title (default titleY in SlideEditorMobile)
    if (currentSlide && currentSlide.elements && currentSlide.elements.length > 0) {
      currentSlide.elements.forEach((el: any) => {
        if (el.element_type === "text" || el.element_type === "bullet_point") {
          const y = el.properties.y ?? 300;
          const size = el.properties.fontSize ?? 24;
          // Estimate height: 1 line for now (could be improved for multiline)
          const height = size * 1.2;
          if (y + height > maxY) maxY = y + height;
        }
      });
    }
    const newY = maxY + GAP;

    const newTextElement = {
      text,
      konva_component: "Konva.Text",
      element_type: "text",
      properties: {
        fontSize,
        fontFamily: "Roboto",
        fill: color,
        fontStyle: "normal",
        fontWeight: fontWeight.toString(),
        y: newY,
      },
    };

    dispatch(
      addTextElementToSlide({
        slideIndex: selectedSlideIndex,
        newElement: newTextElement,
      })
    );

    if (onClose) onClose();
  };

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: "8%",
        width: window.innerWidth * 0.84,
        height: window.innerHeight * 0.4,
        bgcolor: "#fff",
        border: "1px solid #E0E0E0",
        zIndex: 10,
        boxShadow: 3,
        display: "flex",
        flexDirection: "column",
        padding: "24px",
        borderTopLeftRadius: "16px",
        borderTopRightRadius: "16px",
        overflowY: "auto",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Typography sx={{ fontWeight: 500, fontSize: 25 }}>Text</Typography>
        <IconButton size="small" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Add Text Box Button */}
      <Box sx={{ mb: 2 }}>
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
          onClick={() => handleAddTextElement("New Text Box", 24, "600")}
        >
          Add Text Box
        </Button>
      </Box>

      {/* Text Variants */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
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
          onClick={() => handleAddTextElement("Title Text", 32, "700")}
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
          onClick={() => handleAddTextElement("Headline Text", 26, "600")}
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
          onClick={() => handleAddTextElement("Sub Headline Text", 20, "500")}
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
          onClick={() => handleAddTextElement("Body Text", 16, "400", "#888")}
        >
          Add Body Text
        </Button>
      </Box>
    </Box>
  );
};

export default TextEditor;