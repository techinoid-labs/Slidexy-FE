"use client";

import type React from "react";
import { useRef, useState } from "react";
import { Box, Typography } from "@mui/material";

interface TemplateSelectorProps {
  selectedTemplate: string;
  onTemplateChange: (
    template: "modern" | "corporate" | "creative" | "bold" | "minimal" | "Vyntra" | "civora" | "fluxera" | "linear" | "retro"
  ) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ selectedTemplate, onTemplateChange }) => {
  const templates = [
    { id: "modern" as const, name: "Modern", description: "Clean, contemporary styling" },
    { id: "corporate" as const, name: "Corporate", description: "Professional business layout" },
    { id: "creative" as const, name: "Creative", description: "Artistic and dynamic" },
    { id: "bold" as const, name: "Bold", description: "Strong, eye-catching design" },
    { id: "minimal" as const, name: "Minimal", description: "Simple and clean" },
    { id: "Vyntra" as const, name: "Vyntra", description: "Modern minimalist" },
    { id: "civora" as const, name: "Civora", description: "Elegant and sophisticated" },
    { id: "fluxera" as const, name: "Fluxera", description: "Vibrant and dynamic" },
    { id : "linear" as const, name: "Linear", description: "Sleek and streamlined" },
    { id : "retro" as const, name: "Retro", description: "Nostalgic vintage style" },
  ];

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    setStartX("touches" in e ? e.touches[0].pageX : e.pageX);
    setScrollLeft(containerRef.current?.scrollLeft || 0);
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || !containerRef.current) return;
    const x = "touches" in e ? e.touches[0].pageX : e.pageX;
    const walk = (x - startX) * 1.5;
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => setIsDragging(false);
  const handleMouseLeave = () => setIsDragging(false);

  return (
    <Box sx={{ p: 3, bgcolor: "#f5f5f5", borderRadius: 2, mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Choose Template Style
      </Typography>

      <Box
        ref={containerRef}
        sx={{
          display: "flex",
          overflowX: "auto",
          gap: 2,
          pb: 1,
          cursor: isDragging ? "grabbing" : "grab",
          userSelect: "none",
          WebkitOverflowScrolling: "touch",
          "&::-webkit-scrollbar": { height: 6 },
          "&::-webkit-scrollbar-thumb": { backgroundColor: "#ccc", borderRadius: 4 },
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
      >
        {templates.map((template) => {
          const isSelected = selectedTemplate === template.id;
          return (
            <Box
              key={template.id}
              role="button"
              tabIndex={0}
              aria-pressed={isSelected}
              sx={{
                minWidth: 200,
                flexShrink: 0,
                borderRadius: 2,
                backgroundColor: "#fff",
                border: isSelected ? "2px solid #8E2DE2" : "1px solid #E5E1EF",
                boxShadow: isSelected ? "0 6px 20px rgba(142,45,226,0.18)" : "0 2px 8px rgba(0,0,0,0.06)",
                p: 2,
                cursor: "pointer",
                transition: "all 0.25s ease",
                display: "flex",
                flexDirection: "column",
                "&:hover": {
                  borderColor: "#8E2DE2",
                },
                "&:focus-visible": {
                  outline: "2px solid #8E2DE2",
                  outlineOffset: "2px",
                },
              }}
              onClick={() => onTemplateChange(template.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onTemplateChange(template.id);
                }
              }}
            >
              <Box sx={{ mb: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {template.name}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {template.description}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default TemplateSelector;
