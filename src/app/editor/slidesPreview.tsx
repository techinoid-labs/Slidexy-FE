"use client";

import React, { useEffect, useRef, memo } from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { HTMLSlideRenderer } from "../components/editor/HTMLSlideRenderer";
import { useSlideThemeContext } from "../context/ThemeContext";
import { SHELL } from "../components/modify-presentation/shellTheme";

interface SlidePreviewsProps {
  slides: any[];
  slide_width: number;
  slide_height: number;
  selectedIndex: number;
  onSelect: (index: number) => void;
  onAddSlide: () => void;
  onDeleteSlide: (index: number) => void;
  onDuplicateSlide: (index: number) => void;
  onReorderSlide: (fromIndex: number, toIndex: number) => void;
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
  onDuplicateSlide,
  onReorderSlide,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { selectedTheme } = useSlideThemeContext();

  // Calculate thumbnail dimensions (maintain aspect ratio)
  const thumbnailWidth = 152;
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

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const from = result.source.index;
    const to = result.destination.index;
    if (from !== to) onReorderSlide(from, to);
  };

  return (
    <Box
      ref={containerRef}
      sx={{
        width: "100%",
        overflowX: "auto",
        overflowY: "hidden",
        backgroundColor: SHELL.bg,
        borderTop: `1px solid ${SHELL.border}`,
        py: 2,
        px: 3,
        "&::-webkit-scrollbar": {
          height: "6px",
        },
        "&::-webkit-scrollbar-track": {
          background: SHELL.surfaceSunken,
          borderRadius: "4px",
        },
        "&::-webkit-scrollbar-thumb": {
          background: SHELL.accentBorder,
          borderRadius: "4px",
          "&:hover": {
            background: SHELL.accent,
          },
        },
      }}
    >
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="slides-carousel" direction="horizontal">
          {(droppableProvided) => (
            <Box
              ref={droppableProvided.innerRef}
              {...droppableProvided.droppableProps}
              sx={{
                display: "flex",
                gap: 2,
                alignItems: "center",
                minWidth: "max-content",
              }}
            >
              {slides.map((slide, index) => (
                <Draggable
                  key={slide.slide_id || index}
                  draggableId={String(slide.slide_id ?? index)}
                  index={index}
                >
                  {(dragProvided, dragSnapshot) => (
                    <Box
                      ref={dragProvided.innerRef}
                      {...dragProvided.draggableProps}
                      {...dragProvided.dragHandleProps}
                      onClick={() => onSelect(index)}
                      sx={{
                        position: "relative",
                        flexShrink: 0,
                        width: thumbnailWidth,
                        height: thumbnailHeight,
                        cursor: "pointer",
                        border: selectedIndex === index ? `2px solid ${SHELL.accent}` : `1px solid ${SHELL.border}`,
                        borderRadius: "8px",
                        overflow: "hidden",
                        backgroundColor: SHELL.surfaceSunken,
                        boxShadow: dragSnapshot.isDragging
                          ? "0 12px 32px rgba(74,0,224,0.25)"
                          : selectedIndex === index
                            ? `0 0 0 1px ${SHELL.accent}, 0 4px 20px ${SHELL.accentBorder}`
                            : "0 2px 8px rgba(74,0,224,0.08)",
                        transition: dragSnapshot.isDragging ? "none" : "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                        transform: dragSnapshot.isDragging
                          ? dragProvided.draggableProps.style?.transform
                          : selectedIndex === index ? "scale(1.05)" : "scale(1)",
                        "&:hover": {
                          transform: "scale(1.07)",
                          boxShadow: `0 6px 20px ${SHELL.accentBorder}`,
                          borderColor: selectedIndex === index ? SHELL.accent : SHELL.accentBorder,
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

                      {/* Duplicate + Delete Buttons */}
                      <Box
                        sx={{
                          position: "absolute",
                          top: 6,
                          right: 6,
                          display: "flex",
                          gap: 0.5,
                          opacity: selectedIndex === index ? 1 : 0,
                          transition: "opacity 0.2s",
                        }}
                      >
                        <Tooltip title="Duplicate slide">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDuplicateSlide(index);
                            }}
                            sx={{
                              backgroundColor: "rgba(255,255,255,0.95)",
                              backdropFilter: "blur(4px)",
                              padding: "4px",
                              "&:hover": {
                                backgroundColor: "#8B5CF6",
                                color: "#fff",
                              },
                            }}
                          >
                            <ContentCopyIcon sx={{ fontSize: 14 }} />
                          </IconButton>
                        </Tooltip>
                        {slides.length > 1 && (
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteSlide(index);
                            }}
                            sx={{
                              backgroundColor: "rgba(255,255,255,0.95)",
                              backdropFilter: "blur(4px)",
                              padding: "4px",
                              "&:hover": {
                                backgroundColor: "#ff6b6b",
                                color: "#fff",
                              },
                            }}
                          >
                            <DeleteIcon sx={{ fontSize: 14 }} />
                          </IconButton>
                        )}
                      </Box>
                    </Box>
                  )}
                </Draggable>
              ))}
              {droppableProvided.placeholder}

              {/* Add Slide Button - static trailing item, not draggable */}
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
                    border: `1px dashed ${SHELL.accentBorder}`,
                    borderRadius: "8px",
                    cursor: "pointer",
                    backgroundColor: "transparent",
                    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      backgroundColor: SHELL.accentBg,
                      borderColor: SHELL.accent,
                      transform: "scale(1.05)",
                      boxShadow: `0 4px 12px ${SHELL.accentBorder}`,
                    },
                  }}
                >
                  <AddIcon sx={{ fontSize: 40, color: SHELL.accent, opacity: 0.7 }} />
                </Box>
              </Tooltip>
            </Box>
          )}
        </Droppable>
      </DragDropContext>
    </Box>
  );
};

export default memo(SlidePreviews);
