"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSlides } from "@/app/context/SlidesContext";
import snapshotsCache from "@/utils/snapshotsCache";

interface SlidePreviewsProps {
  slides: any[];
  slide_width: string | number;
  slide_height: string | number;
  selectedIndex: number;
  onSelect: (index: number) => void;
  onAddSlide: () => void;
  onDeleteSlide: (index: number) => void;
  scale?: number;
}

const SlidePreviews: React.FC<SlidePreviewsProps> = ({
  slides,
  slide_width,
  slide_height,
  selectedIndex,
  onSelect,
  onAddSlide,
  onDeleteSlide,
  scale,
}) => {
  const {
    slides: reduxSlides,
    setSlides,
    selectedSlideIndex,
    setSelectedSlideIndex,
  } = useSlides();
  const [thumbs, setThumbs] = useState<Record<string, string | null>>({});
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  useEffect(() => {
    if (selectedIndex !== selectedSlideIndex) {
      setSelectedSlideIndex(selectedIndex);
    }
  }, [selectedIndex]);

  // Populate thumbnails from snapshotsCache and subscribe to updates per-slide
  useEffect(() => {
    const map: Record<string, string | null> = {};
    const unsubscribers: Array<() => void> = [];

    slides.forEach((s: any) => {
      const id = s.slide_id;
      try {
        const snapshot = snapshotsCache.getSnapshot(id);
        map[id] = snapshot;
        console.log(`[slidesPreview] Initial snapshot for slide ${id}:`, snapshot ? 'LOADED' : 'PENDING');
      } catch (e) {
        console.error(`[slidesPreview] Error getting snapshot for slide ${id}:`, e);
        map[id] = null;
      }

      // subscribe to this slide's updates
      const cb = (data?: string | null) => {
        console.log(`[slidesPreview] Snapshot updated for slide ${id}:`, data ? 'LOADED' : 'CLEARED');
        setThumbs((prev) => ({ ...prev, [id]: data || null }));
      };
      snapshotsCache.subscribe(id, cb);
      unsubscribers.push(() => snapshotsCache.unsubscribe(id, cb));
    });

    setThumbs(map);

    return () => {
      unsubscribers.forEach((u) => u());
    };
  }, [slides]);

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
        width: "100%",
        overflowX: "auto",
        overflowY: "hidden",
        backgroundColor: "#fafbfc",
        borderTop: "1px solid #e5e7eb",
        borderRadius: 0,
        my: 0,
        px: 2,
        py: 2,
        mt: 0,
        "&::-webkit-scrollbar": {
          height: "6px",
        },
        "&::-webkit-scrollbar-track": {
          background: "#f0f0f0",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "#d0d0d0",
          borderRadius: "3px",
          "&:hover": {
            background: "#999",
          },
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          minWidth: "max-content",
          flexWrap: "nowrap",
          px: 1,
        }}
      >
        {slides.map((slide: any, index: number) => {
          const isSelected = index === selectedSlideIndex;
          const thumb = thumbs[slide.slide_id];

          return (
            <Box
              key={slide.slide_id}
              onClick={() => handleSelect(index)}
              sx={{
                position: "relative",
                width: "120px",
                height: "90px",
                minWidth: "120px",
                borderRadius: "6px",
                border: isSelected ? "3px solid #1976d2" : "2px solid #d1d5db",
                backgroundColor: "#ffffff",
                cursor: "pointer",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease",
                boxShadow: isSelected
                  ? "0 4px 12px rgba(25, 118, 210, 0.25)"
                  : "0 1px 3px rgba(0, 0, 0, 0.1)",
                "&:hover": {
                  borderColor: "#1976d2",
                  boxShadow: "0 4px 12px rgba(25, 118, 210, 0.15)",
                  transform: "translateY(-1px)",
                },
                flexShrink: 0,
              }}
            >
              {/* Show actual slide thumbnail image */}
              {thumb ? (
                <>
                  <img
                    src={thumb}
                    alt={`Slide ${index + 1}: ${slide.slide_title?.text || "Untitled"}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  {/* Slide number badge */}
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 4,
                      left: 4,
                      backgroundColor: "rgba(0, 0, 0, 0.6)",
                      color: "#fff",
                      fontSize: "11px",
                      fontWeight: 600,
                      padding: "2px 6px",
                      borderRadius: "3px",
                    }}
                  >
                    {index + 1}
                  </Box>
                </>
              ) : (
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#f9fafb",
                    padding: "8px",
                    textAlign: "center",
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: "9px",
                      fontWeight: 600,
                      color: "#9ca3af",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "100%",
                      lineHeight: 1.2,
                    }}
                  >
                    {(slide.slide_title?.text || `Slide ${index + 1}`).substring(0, 15)}
                  </Typography>
                  {!thumb && (
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: "7px",
                        color: "#d1d5db",
                        marginTop: "2px",
                      }}
                    >
                      Loading...
                    </Typography>
                  )}
                </Box>
              )}

              {/* Delete button - show on hover for selected slide */}
              {slides.length > 1 && (
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(index);
                  }}
                  className="delete-button"
                  size="small"
                  sx={{
                    position: "absolute",
                    top: 2,
                    right: 2,
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "1px solid #e5e7eb",
                    width: "24px",
                    height: "24px",
                    opacity: isSelected ? 1 : 0,
                    transition: "opacity 0.2s",
                    zIndex: 10,
                    "&:hover": {
                      backgroundColor: "#fee2e2",
                      borderColor: "#fca5a5",
                    },
                  }}
                >
                  <DeleteIcon sx={{ fontSize: "14px", color: "#dc2626" }} />
                </IconButton>
              )}
            </Box>
          );
        })}

        {/* Add new slide button */}
        <Tooltip title="Add new slide">
          <IconButton
            onClick={handleAddSlide}
            sx={{
              width: "120px",
              height: "90px",
              minWidth: "120px",
              borderRadius: "6px",
              border: "2px dashed #d1d5db",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#ffffff",
              flexShrink: 0,
              transition: "all 0.2s ease",
              cursor: "pointer",
              "&:hover": {
                borderColor: "#6366f1",
                backgroundColor: "#f0f9ff",
              },
            }}
          >
            <AddIcon sx={{ fontSize: 28, color: "#9ca3af" }} />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default SlidePreviews;
