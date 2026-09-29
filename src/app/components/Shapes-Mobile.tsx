"use client";

import React from "react";
import { Box, Typography, IconButton, InputBase } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import { useSlides } from "@/app/context/SlidesContext";

const shapes = [
  {
    name: "Circle",
    konva_component: "Konva.Circle",
    defaultProps: {
      x: 150,
      y: 150,
      radius: 40,
      fill: "#FF5733",
    },
    svg: (
      <svg width="64" height="64">
        <circle
          cx="32"
          cy="32"
          r="20"
          stroke="#222"
          strokeWidth="2"
          fill="none"
        />
      </svg>
    ),
  },
  {
    name: "Rectangle",
    konva_component: "Konva.Rect",
    defaultProps: {
      x: 120,
      y: 150,
      width: 80,
      height: 60,
      fill: "#3498db",
    },
    svg: (
      <svg width="64" height="64">
        <rect
          x="16"
          y="16"
          width="32"
          height="32"
          stroke="#222"
          strokeWidth="2"
          fill="none"
        />
      </svg>
    ),
  },
  {
    name: "Star",
    konva_component: "Konva.Star",
    defaultProps: {
      x: 180,
      y: 180,
      numPoints: 5,
      innerRadius: 20,
      outerRadius: 40,
      fill: "#f1c40f",
    },
    svg: (
      <svg width="64" height="64">
        <polygon
          points="32,10 36,24 50,24 38,34 42,50 32,40 22,50 26,34 14,24 28,24"
          stroke="#222"
          strokeWidth="2"
          fill="none"
        />
      </svg>
    ),
  },
  {
    name: "Polygon",
    konva_component: "Konva.RegularPolygon",
    defaultProps: {
      x: 180,
      y: 180,
      sides: 6,
      radius: 40,
      fill: "#8e44ad",
    },
    svg: (
      <svg width="64" height="64">
        <polygon
          points="16,32 32,16 48,32 48,48 32,48 16,48"
          stroke="#222"
          strokeWidth="2"
          fill="none"
        />
      </svg>
    ),
  },
  {
    name: "Line",
    konva_component: "Konva.Line",
    defaultProps: {
      points: [100, 100, 160, 160], // Position near the middle of the canvas
      stroke: "#2ecc71",
      fill: "#2ecc71",
      strokeWidth: 4,
    },
    svg: (
      <svg width="64" height="64">
        <line x1="16" y1="16" x2="48" y2="48" stroke="#222" strokeWidth="2" refX="10" refY="10" />
      </svg>
    ),
  },
  {
    name: "Arrow",
    konva_component: "Konva.Arrow",
    defaultProps: {
      points: [100, 100, 160, 160],
      stroke: "#e67e22",
      fill: "#e67e22",
      strokeWidth: 4,
    },
    svg: (
      <svg width="64" height="64">
        <defs>
          <marker
            id="arrow"
            markerWidth="10"
            markerHeight="10"
            refX="5"
            refY="5"
            orient="auto"
          >
            <path d="M0,0 L0,6 L9,3 z" fill="#222" />
          </marker>
        </defs>
        <line
          x1="16"
          y1="16"
          x2="48"
          y2="48"
          stroke="#222"
          strokeWidth="2"
          markerEnd="url(#arrow)"
        />
      </svg>
    ),
  },
  {
    name: "Ellipse",
    konva_component: "Konva.Ellipse",
    defaultProps: {
      x: 200,
      y: 200,
      radiusX: 40,
      radiusY: 20,
      fill: "#1abc9c",
    },
    svg: (
      <svg width="64" height="64">
        <ellipse
          cx="32"
          cy="32"
          rx="20"
          ry="10"
          stroke="#222"
          strokeWidth="2"
          fill="none"
        />
      </svg>
    ),
  },
  {
    name: "Arc",
    konva_component: "Konva.Arc",
    defaultProps: {
      x: 150,
      y: 150,
      innerRadius: 20,
      outerRadius: 40,
      angle: 90,
      fill: "#9b59b6",
    },
    svg: (
      <svg width="64" height="64">
        <path
          d="M32,32 L52,32 A20,20 0 0,1 46,52 z"
          stroke="#222"
          strokeWidth="2"
          fill="none"
        />
      </svg>
    ),
  },
  {
    name: "Wedge",
    konva_component: "Konva.Wedge",
    defaultProps: {
      x: 150,
      y: 150,
      radius: 40,
      angle: 60,
      fill: "#34495e",
    },
    svg: (
      <svg width="64" height="64">
        <path
          d="M32,32 L52,32 A20,20 0 0,1 44,52 z"
          stroke="#222"
          strokeWidth="2"
          fill="none"
        />
      </svg>
    ),
  },
];

interface ShapedProps {
  sidebarHeight: string;
  onClose: () => void;
}

const MobileShapes = ({ sidebarHeight = "100vh", onClose }: ShapedProps) => {
  const { addShape } = useSlides(); // ✅ Use addShape from context

  const handleShapeClick = (shape: any) => {
    console.log('[Shapes-Mobile] Adding shape via context:', shape);

    // ✅ Use context's addShape function which handles everything correctly
    addShape({
      konva_component: shape.konva_component,
      properties: shape.defaultProps,
    });

    onClose();
  };

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: "8%",
        width: window.innerWidth * 0.84,
        height: window.innerHeight * 0.5,
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
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
          flexShrink: 0,
          bgcolor: "#fff",
          position: "relative",
          top: 0,
          //zIndex: 1,
        }}
      >
        <Typography sx={{ fontWeight: 600, fontSize: 20 }}>Shapes</Typography>
        <IconButton size="small" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* <Box sx={{ mb: 2 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            bgcolor: "#F8F8FA",
            borderRadius: 8,
            px: 2,
            height: 40,
            border: "2px solid #E5DFFF",
          }}
        >
          <SearchIcon sx={{ color: "#B0AEB8", mr: 1 }} />
          <InputBase placeholder="Search..." sx={{ flex: 1, fontSize: 15 }} />
        </Box>
      </Box> */}

      <Box sx={{ pb: 2 }}>

        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
          {shapes.map((shape, idx) => (
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
                bgcolor: "#F8F8FA",
                borderRadius: 3,
                p: 2,
                minHeight: 80,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "none",
                border: "1px solid #ECECEC",
                cursor: "pointer",
                transition: "border-color 0.15s ease, box-shadow 0.15s ease",
                "&:hover": {
                  borderColor: "#8E2DE2",
                  boxShadow: "0 2px 8px 0 rgba(142,45,226,0.13)",
                },
                "&:focus-visible": {
                  outline: "2px solid #8E2DE2",
                  outlineOffset: "2px",
                },
              }}
            >
              {shape.svg}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default MobileShapes;