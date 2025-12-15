"use client";

import React, { useEffect, useRef, memo } from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { HTMLSlideRenderer } from "../components/editor/HTMLSlideRenderer";
import { useSlideThemeContext } from "../context/ThemeContext";

interface SlidePreviewsProps {
  slides: any[];
  slide_width: number;
  slide_height: number;
  selectedIndex: number;
  onSelect: (index: number) => void;
  onAddSlide: () => void;
  onDeleteSlide: (index: number) => void;
}

/**
 * Optimized slide previews using HTML rendering
 * No Konva, no transformers, instant loading
 */
const SlidePreviews: React.FC<SlidePreviewsProps> = ({
  slides,
  slide_width,
  slide_height,
  selectedIndex,
  onSelect,
  onAddSlide,
  onDeleteSlide,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { selectedTheme } = useSlideThemeContext();

  // Calculate thumbnail dimensions (maintain aspect ratio)
  const thumbnailWidth = 140;
  const thumbnailHeight = (thumbnailWidth / slide_width) * slide_height;
  const scale = thumbnailWidth / slide_width;

  // Scroll selected thumbnail into view
  useEffect(() => {
    if (containerRef.current) {
      const selectedThumbnail = containerRef.current.children[0]?.children[selectedIndex] as HTMLElement;
      if (selectedThumbnail) {
        selectedThumbnail.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [selectedIndex]);

  return (
    <Box
      ref={containerRef}
      sx={{
        width: "100%",
        overflowX: "auto",
        overflowY: "hidden",
        backgroundColor: "#f5f7fa",
        borderTop: "1px solid #e1e4e8",
        py: 2,
        px: 3,
        "&::-webkit-scrollbar": {
          height: "8px",
        },
        "&::-webkit-scrollbar-track": {
          background: "#f1f3f5",
          borderRadius: "4px",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "#adb5bd",
          borderRadius: "4px",
          "&:hover": {
            background: "#868e96",
          },
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: 2,
          alignItems: "center",
          minWidth: "max-content",
        }}
      >
        {slides.map((slide, index) => (
          <Box
            key={slide.slide_id || index}
            onClick={() => onSelect(index)}
            sx={{
              position: "relative",
              flexShrink: 0,
              width: thumbnailWidth,
              height: thumbnailHeight,
              cursor: "pointer",
              border: selectedIndex === index ? "3px solid #6c5ce7" : "2px solid #dee2e6",
              borderRadius: "8px",
              overflow: "hidden",
              backgroundColor: "#fff",
              boxShadow: selectedIndex === index
                ? "0 4px 16px rgba(108, 92, 231, 0.25)"
                : "0 2px 8px rgba(0,0,0,0.08)",
              transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
              transform: selectedIndex === index ? "scale(1.05)" : "scale(1)",
              "&:hover": {
                transform: "scale(1.08)",
                boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
                borderColor: selectedIndex === index ? "#6c5ce7" : "#adb5bd",
              },
            }}
          >
            {/* HTML Thumbnail - Instant rendering, no loading */}
            <Box
              sx={{
                width: "100%",
                height: "100%",
                transform: `scale(${scale})`,
                transformOrigin: "top left",
                pointerEvents: "none",
                userSelect: "none",
              }}
            >
              <Box sx={{ width: slide_width, height: slide_height }}>
                <HTMLSlideRenderer
                  slide={slide}
                  theme={selectedTheme}
                  isEditing={false}
                />
              </Box>
            </Box>

            {/* Slide Number Badge */}
            <Box
              sx={{
                position: "absolute",
                bottom: 6,
                left: 6,
                backgroundColor: "rgba(0,0,0,0.75)",
                color: "#fff",
                padding: "3px 8px",
                borderRadius: "4px",
                fontSize: "11px",
                fontWeight: 700,
                backdropFilter: "blur(4px)",
              }}
            >
              {index + 1}
            </Box>

            {/* Delete Button */}
            {slides.length > 1 && (
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteSlide(index);
                }}
                sx={{
                  position: "absolute",
                  top: 6,
                  right: 6,
                  backgroundColor: "rgba(255,255,255,0.95)",
                  backdropFilter: "blur(4px)",
                  padding: "4px",
                  opacity: selectedIndex === index ? 1 : 0,
                  transition: "all 0.2s",
                  "&:hover": {
                    backgroundColor: "#ff6b6b",
                    color: "#fff",
                    opacity: 1,
                  },
                }}
              >
                <DeleteIcon sx={{ fontSize: 16 }} />
              </IconButton>
            )}
          </Box>
        ))}

        {/* Add Slide Button */}
        <Tooltip title="Add new slide" placement="top">
          <Box
            onClick={onAddSlide}
            sx={{
              flexShrink: 0,
              width: thumbnailWidth,
              height: thumbnailHeight,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "2px dashed #6c5ce7",
              borderRadius: "8px",
              cursor: "pointer",
              backgroundColor: "#f8f9fa",
              transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                backgroundColor: "#f0ebff",
                borderColor: "#5849c7",
                transform: "scale(1.05)",
                boxShadow: "0 4px 12px rgba(108, 92, 231, 0.15)",
              },
            }}
          >
            <AddIcon sx={{ fontSize: 48, color: "#6c5ce7" }} />
          </Box>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default memo(SlidePreviews);
