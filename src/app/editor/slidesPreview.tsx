"use client";

import React, { useEffect } from "react";
import { Box, Typography, IconButton, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSlides } from "@/app/context/SlidesContext";

interface SlidePreviewsProps {
  slides: any[];
  slide_width: string | number;
  selectedIndex: number;
  onSelect: (index: number) => void;
  onAddSlide: () => void;
  onDeleteSlide: (index: number) => void;
}

const SlidePreviews: React.FC<SlidePreviewsProps> = ({
  slides,
  slide_width,
  selectedIndex,
  onSelect,
  onAddSlide,
  onDeleteSlide,
}) => {
  const {
    slides: reduxSlides,
    setSlides,
    selectedSlideIndex,
    setSelectedSlideIndex,
  } = useSlides();

  console.log({ selectedSlideIndex, reduxSlides });
  useEffect(() => {
    if (selectedIndex !== selectedSlideIndex) {
      setSelectedSlideIndex(selectedIndex);
    }
  }, [selectedIndex]);

  const handleSelect = (index: number) => {
    onSelect(index);
    setSelectedSlideIndex(index);
  };

  const handleAddSlide = () => {
    onAddSlide();
    const newIndex = slides.length;
    onSelect(newIndex);
    setSelectedSlideIndex(newIndex);
  };

  const handleDelete = (indexToDelete: number) => {
    onDeleteSlide(indexToDelete);

    const isSelected = indexToDelete === selectedSlideIndex;
    const isBefore = indexToDelete < selectedSlideIndex;

    if (isSelected) {
      const newIndex = Math.max(0, selectedSlideIndex - 1);
      onSelect(newIndex);
      setSelectedSlideIndex(newIndex);
    } else if (isBefore) {
      setSelectedSlideIndex(selectedSlideIndex - 1);
    }
  };

  return (
    <Box
      sx={{
        width: slide_width,
        overflowX: "auto",
        overflowY: "hidden",
        backgroundColor: "#f5f5fa",
        borderRadius: 1,
        mt: 1,
        px: 2,
        py: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          minWidth: "max-content",
        }}
      >
        {slides.map((slide: any, index: number) => {
          const isSelected = index === selectedSlideIndex;

          return (
            <Box
              key={slide.slide_id}
              sx={{
                position: "relative",
                width: 200,
                height: 120,
                borderLeft: isSelected
                  ? "4px solid #6941c6"
                  : "1px solid #e5e5ef",
                borderRight: "1px solid #e5e5ef",
                borderTop: "1px solid #e5e5ef",
                borderBottom: "1px solid #e5e5ef",
                borderRadius: 1,
                backgroundColor: isSelected ? "#f5f3ff" : "#ffffff",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-start",
                px: 2,
                py: 1.5,
                cursor: "pointer",
                boxShadow: isSelected ? "4px 0 0 0 #e9d7fe" : "none",
                flex: "0 0 auto",
                "&:hover .delete-button": { opacity: 1 },
              }}
              onClick={() => handleSelect(index)}
            >
              <Typography
                variant="subtitle2"
                fontWeight={600}
                sx={{
                  display: "block",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  maxWidth: "100%",
                }}
              >
                {(slide.slide_title?.text || "New Slide Title").trim()}
              </Typography>
              <Typography
                variant="caption"
                color="#667085"
                sx={{
                  display: "block",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  maxWidth: "100%",
                }}
              >
                {slide.elements.length > 0
                  ? (slide.elements[0].text || "").trim()
                  : "Add description"}
              </Typography>

              {slides.length > 1 && (
                <Tooltip title="Delete Slide">
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(index);
                    }}
                    className="delete-button"
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      backgroundColor: "#fff",
                      border: "1px solid #ccc",
                      opacity: 0,
                      transition: "opacity 0.2s",
                      zIndex: 10,
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          );
        })}

        <IconButton
          onClick={handleAddSlide}
          sx={{
            width: 120,
            height: 120,
            borderRadius: 1,
            border: "1px dashed #d0d5dd",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#ffffff",
            flex: "0 0 auto",
          }}
        >
          <AddIcon sx={{ fontSize: 32, color: "#667085" }} />
        </IconButton>
      </Box>
    </Box>
  );
};

export default SlidePreviews;
