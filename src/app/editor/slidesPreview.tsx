"use client";

import React from "react";
import { Box, Typography, IconButton, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

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
          const isSelected = index === selectedIndex;

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
              onClick={() => onSelect(index)}
            >
              <Typography
                variant="subtitle2"
                fontWeight={700}
                color={isSelected ? "#6941c6" : "#475467"}
              >
                {String(index + 1).padStart(2, "0")}
              </Typography>
              <Typography
                variant="subtitle2"
                fontWeight={600}
                sx={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "100%",
                }}
              >
                {slide.slide_title.text || "New Slide Title"}
              </Typography>
              <Typography variant="caption" color="#667085">
                {slide.elements.length > 0
                  ? slide.elements[0].text
                  : "Add description"}
              </Typography>

              {slides.length > 1 && (
                <Tooltip title="Delete Slide">
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation(); // prevent triggering onSelect
                      onDeleteSlide(index);
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
          onClick={onAddSlide}
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
