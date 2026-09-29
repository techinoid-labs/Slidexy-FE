"use client";

import React, { forwardRef, useState } from "react";
import { Box, Typography, IconButton, InputBase } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import { motion } from "framer-motion";
import { useSlides } from "@/app/context/SlidesContext";
import {
  PANEL,
  panelContainerSx,
  panelHeaderSx,
  panelTitleSx,
  panelCloseButtonSx,
  panelSearchBarSx,
} from "./modify-presentation/panelTheme";

const STROKE = "#222";

const shapes = [
  {
    name: "Circle",
    konva_component: "Konva.Circle",
    defaultProps: { x: 150, y: 150, radius: 40, fill: "#FF5733" },
    svg: (
      <svg width="64" height="64">
        <circle cx="32" cy="32" r="20" stroke={STROKE} strokeWidth="2" fill="none" />
      </svg>
    ),
  },
  {
    name: "Rectangle",
    konva_component: "Konva.Rect",
    defaultProps: { x: 120, y: 150, width: 80, height: 60, fill: "#3498db" },
    svg: (
      <svg width="64" height="64">
        <rect x="16" y="16" width="32" height="32" stroke={STROKE} strokeWidth="2" fill="none" />
      </svg>
    ),
  },
  {
    name: "Star",
    konva_component: "Konva.Star",
    defaultProps: { x: 180, y: 180, numPoints: 5, innerRadius: 20, outerRadius: 40, fill: "#f1c40f" },
    svg: (
      <svg width="64" height="64">
        <polygon
          points="32,10 36,24 50,24 38,34 42,50 32,40 22,50 26,34 14,24 28,24"
          stroke={STROKE}
          strokeWidth="2"
          fill="none"
        />
      </svg>
    ),
  },
  {
    name: "Polygon",
    konva_component: "Konva.RegularPolygon",
    defaultProps: { x: 180, y: 180, sides: 6, radius: 40, fill: "#8e44ad" },
    svg: (
      <svg width="64" height="64">
        <polygon points="16,32 32,16 48,32 48,48 32,48 16,48" stroke={STROKE} strokeWidth="2" fill="none" />
      </svg>
    ),
  },
  {
    name: "Line",
    konva_component: "Konva.Line",
    defaultProps: { points: [20, 20, 60, 60], stroke: "#2ecc71", fill: "#2ecc71", strokeWidth: 4 },
    svg: (
      <svg width="64" height="64">
        <line x1="16" y1="16" x2="48" y2="48" stroke={STROKE} strokeWidth="2" />
      </svg>
    ),
  },
  {
    name: "Arrow",
    konva_component: "Konva.Arrow",
    defaultProps: { points: [20, 20, 60, 60], stroke: "#e67e22", fill: "#e67e22", strokeWidth: 4 },
    svg: (
      <svg width="64" height="64">
        <defs>
          <marker id="arrow" markerWidth="10" markerHeight="10" refX="0" refY="3" orient="auto">
            <path d="M0,0 L0,6 L9,3 z" fill={STROKE} />
          </marker>
        </defs>
        <line x1="16" y1="16" x2="48" y2="48" stroke={STROKE} strokeWidth="2" markerEnd="url(#arrow)" />
      </svg>
    ),
  },
  {
    name: "Ellipse",
    konva_component: "Konva.Ellipse",
    defaultProps: { x: 200, y: 200, radiusX: 40, radiusY: 20, fill: "#1abc9c" },
    svg: (
      <svg width="64" height="64">
        <ellipse cx="32" cy="32" rx="20" ry="10" stroke={STROKE} strokeWidth="2" fill="none" />
      </svg>
    ),
  },
  {
    name: "Arc",
    konva_component: "Konva.Arc",
    defaultProps: { x: 150, y: 150, innerRadius: 20, outerRadius: 40, angle: 90, fill: "#9b59b6" },
    svg: (
      <svg width="64" height="64">
        <path d="M32,32 L52,32 A20,20 0 0,1 46,52 z" stroke={STROKE} strokeWidth="2" fill="none" />
      </svg>
    ),
  },
  {
    name: "Wedge",
    konva_component: "Konva.Wedge",
    defaultProps: { x: 150, y: 150, radius: 40, angle: 60, fill: "#34495e" },
    svg: (
      <svg width="64" height="64">
        <path d="M32,32 L52,32 A20,20 0 0,1 44,52 z" stroke={STROKE} strokeWidth="2" fill="none" />
      </svg>
    ),
  },
];

interface ShapedProps {
  sidebarHeight: string;
  onClose: () => void;
}
const Shapes = forwardRef<HTMLDivElement, ShapedProps>(
  ({ sidebarHeight = "100vh", onClose }, ref) => {
    const { addShape } = useSlides();
    const [search, setSearch] = useState("");

    const filteredShapes = shapes.filter((s) =>
      s.name.toLowerCase().includes(search.trim().toLowerCase())
    );

    const handleShapeClick = (shape: any) => {
      addShape({
        konva_component: shape.konva_component,
        properties: shape.defaultProps,
      });
      onClose();
    };

    return (
      <Box
        ref={ref}
        component={motion.div}
        initial={{ x: -24, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -24, opacity: 0 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        sx={{ ...panelContainerSx(290, sidebarHeight), overflowY: "auto" }}
      >
        <Box sx={{ ...panelHeaderSx, mb: 0, position: "sticky", top: 0, bgcolor: PANEL.surface, zIndex: 1 }}>
          <Typography sx={panelTitleSx}>Shapes</Typography>
          <IconButton size="small" onClick={onClose} sx={panelCloseButtonSx}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <Box sx={{ px: 3, pt: 2, pb: 2 }}>
          <Box sx={panelSearchBarSx}>
            <SearchIcon sx={{ color: PANEL.accentSoft, mr: 1, fontSize: 18 }} />
            <InputBase
              placeholder="Search shapes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ flex: 1, fontSize: 14, color: PANEL.text, "& input::placeholder": { color: PANEL.textFaint, opacity: 1 } }}
            />
          </Box>
        </Box>

        <Box sx={{ px: 3, pb: 2 }}>
          <Typography sx={{ fontWeight: 600, fontSize: 12.5, color: PANEL.textMuted, mb: 1, textTransform: "uppercase", letterSpacing: "0.04em" }}>
            Essentials
          </Typography>
          {filteredShapes.length > 0 ? (
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5 }}>
              {filteredShapes.map((shape, idx) => (
                <Box
                  key={idx}
                  role="button"
                  tabIndex={0}
                  aria-label={`Add ${shape.name} shape`}
                  onClick={() => handleShapeClick(shape)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleShapeClick(shape);
                    }
                  }}
                  sx={{
                    bgcolor: PANEL.surfaceSunken,
                    borderRadius: 3,
                    p: 2,
                    minHeight: 80,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 0.5,
                    border: `1px solid ${PANEL.border}`,
                    cursor: "pointer",
                    transition: "border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s cubic-bezier(0.22,1,0.36,1)",
                    "&:hover": {
                      borderColor: PANEL.accentBorder,
                      boxShadow: `0 8px 20px -6px ${PANEL.accentBg}`,
                      transform: "translateY(-2px) scale(1.03)",
                    },
                    "&:focus-visible": {
                      outline: `2px solid ${PANEL.accent}`,
                      outlineOffset: "2px",
                    },
                  }}
                >
                  {shape.svg}
                  <Typography sx={{ fontSize: 11, color: PANEL.textFaint }}>{shape.name}</Typography>
                </Box>
              ))}
            </Box>
          ) : (
            <Typography sx={{ color: PANEL.textFaint, textAlign: "center", mt: 4, fontSize: 13 }}>
              No shapes match "{search}"
            </Typography>
          )}
        </Box>
      </Box>
    );
  }
);

export default Shapes;
