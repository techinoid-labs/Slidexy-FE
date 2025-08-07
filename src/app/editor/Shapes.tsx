"use client";

import React from "react";
import { Box, Typography, IconButton, InputBase } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import { useSlides } from "@/app/context/SlidesContext";
import { v4 as uuidv4 } from "uuid";
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
      points: [20, 20, 60, 60],
      stroke: "#2ecc71",
      fill: "#2ecc71",
      strokeWidth: 4,
    },
    svg: (
      <svg width="64" height="64">
        <line x1="16" y1="16" x2="48" y2="48" stroke="#222" strokeWidth="2" />
      </svg>
    ),
  },
  {
    name: "Arrow",
    konva_component: "Konva.Arrow",
    defaultProps: {
      points: [20, 20, 60, 60],
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
            refX="0"
            refY="3"
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
  // {
  //   name: "Arc",
  //   konva_component: "Konva.Arc",
  //   defaultProps: {
  //     x: 150,
  //     y: 150,
  //     innerRadius: 20,
  //     outerRadius: 40,
  //     angle: 90,
  //     fill: "#9b59b6",
  //   },
  //   svg: (
  //     <svg width="64" height="64">
  //       <path
  //         d="M32,32 L52,32 A20,20 0 0,1 46,52 z"
  //         stroke="#222"
  //         strokeWidth="2"
  //         fill="none"
  //       />
  //     </svg>
  //   ),
  // },
  // {
  //   name: "Wedge",
  //   konva_component: "Konva.Wedge",
  //   defaultProps: {
  //     x: 150,
  //     y: 150,
  //     radius: 40,
  //     angle: 60,
  //     fill: "#34495e",
  //   },
  //   svg: (
  //     <svg width="64" height="64">
  //       <path
  //         d="M32,32 L52,32 A20,20 0 0,1 44,52 z"
  //         stroke="#222"
  //         strokeWidth="2"
  //         fill="none"
  //       />
  //     </svg>
  //   ),
  // },
];

interface ShapedProps {
  sidebarHeight: string;
  onClose: () => void;
}

const Shapes = ({ sidebarHeight = "100vh", onClose }: ShapedProps) => {
  const { slides, setSlides, selectedSlideIndex } = useSlides();

  const handleShapeClick = (shape: any) => {
    const elementIndex = slides[selectedSlideIndex].elements.length;
    console.log("CLISKED");
    const newShape = {
      konva_component: shape.konva_component,
      element_type: "shape",
      properties: { ...shape.defaultProps, zIndex: elementIndex },
      element_id: uuidv4(),
    };

    const updatedSlides = [...slides];
    const currentSlide = { ...updatedSlides[selectedSlideIndex] };
    const updatedElements = [...(currentSlide.elements || []), newShape];
    updatedSlides[selectedSlideIndex] = {
      ...currentSlide,
      elements: updatedElements,
    };

    setSlides(updatedSlides);
    onClose();
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
        overflowY: "auto",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 3,
          pb: 2,
          mb: 2,
          borderBottom: "1px solid #E0E0E0",
          flexShrink: 0,
          bgcolor: "#fff",
          position: "sticky",
          top: 0,
          zIndex: 1,
        }}
      >
        <Typography sx={{ fontWeight: 600, fontSize: 20 }}>Shapes</Typography>
        <IconButton size="small" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Box sx={{ px: 3, mb: 2 }}>
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
      </Box>

      <Box sx={{ px: 3, pb: 2 }}>
        <Typography sx={{ fontWeight: 600, fontSize: 16, mb: 1 }}>
          Essentials
        </Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
          {shapes.map((shape, idx) => (
            <Box
              key={idx}
              onClick={() => handleShapeClick(shape)}
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
                "&:hover": {
                  borderColor: "#7B4AE2",
                  boxShadow: "0 2px 8px 0 #7B4AE222",
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

export default Shapes;
