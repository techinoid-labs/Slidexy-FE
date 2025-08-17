"use client";

import React from "react";
import { useTheme, useMediaQuery, Box, Divider, Typography, Slider, InputBase } from "@mui/material";
import { useSlides } from "@/app/context/SlidesContext";
import { useSlideThemeContext } from "@/app/context/ThemeContext";

interface ShapeSettingsPanelProps {
  sidebarHeight?: string | number;
  resetAll?: () => void;
}

const ShapeSettingsPanel: React.FC<ShapeSettingsPanelProps> = ({
  sidebarHeight = "100vh",
}) => {
  // Hard guard: never render on mobile
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  if (isMobile) return null;

  const {
    slides,
    selectedShapeIndex,
    selectedSlideIndex,
    setSlides,
  } = useSlides();
  const { setPrimaryColor } = useSlideThemeContext();

  // Extract shape object
  const parsed = selectedShapeIndex !== null ? `el-${selectedSlideIndex}-${selectedShapeIndex}` : null;
  const slideIndex = selectedSlideIndex;
  const elementIndex = selectedShapeIndex;

  let shapeObj: any = null;
  if (slideIndex !== -1 && slides[slideIndex] && elementIndex !== null) {
    shapeObj = slides[slideIndex].elements[elementIndex];
  }

  if (!shapeObj || shapeObj.element_type !== "shape") return null;

  const rawProps = shapeObj.properties || {};
  const fill = rawProps.fill ?? "#000000";
  const opacity = rawProps.opacity ?? 1;

  const updateShapeProperty = (prop: string, value: any) => {
    if (!shapeObj || slideIndex === -1 || elementIndex === null) return;
    const updatedSlides = structuredClone(slides);
    const target = updatedSlides[slideIndex].elements[elementIndex].properties;
    if (target) target[prop] = value;
    setSlides(updatedSlides);
  };

  const setShapeFillAndDisableTheme = (color: string) => {
    // Add proper null checks before using elementIndex as an array index
    if (slideIndex === -1 || elementIndex === null) return;
    
    const updatedSlides = structuredClone(slides);
    
    // Ensure the slide exists
    if (!updatedSlides[slideIndex] || !updatedSlides[slideIndex].elements) return;
    
    // Ensure the element exists at the specified index
    const el = updatedSlides[slideIndex].elements[elementIndex];
    if (!el) return;
    
    // Update properties
    if (!el.properties) {
      el.properties = {};
    }
    
    el.properties.fill = color;
    el.useThemeColor = false;
    setSlides(updatedSlides);
  };

  return (
    <Box className="w-[360px] min-w-[320px] md:min-w-[320px] bg-white flex flex-col overflow-y-auto border-r border-gray-200">
      {/* Tabs */}
      <Box sx={{ display: "flex", alignItems: "center", px: 2, pt: 2, pb: 1 }}>
        <Box
          sx={{
            bgcolor: "#F5F5F5",
            color: "#222",
            fontWeight: 600,
            borderRadius: 2,
            px: 2.5,
            py: 1,
            fontSize: 15,
            mr: 2,
          }}
        >
          Shape Settings
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Color */}
      <Box sx={{ px: 3, mb: 2 }}>
        <Typography sx={{ fontWeight: 600, fontSize: 16, mb: 1 }}>
          Color
        </Typography>
        <Box className="w-12 h-12 rounded-full">
          <input
            type="color"
            value={fill}
            className="w-12 h-12 rounded-full"
            onChange={(e) => {
              updateShapeProperty("fill", e.target.value);
              setShapeFillAndDisableTheme(e.target.value);
            }}
          />
          <Typography sx={{ fontSize: 14 }}>{fill.toUpperCase()}</Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Effects */}
      <Box sx={{ px: 3, mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Typography sx={{ fontWeight: 600, fontSize: 16, flex: 1 }}>
            Effects
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Slider
            value={Math.round(opacity * 100)}
            onChange={(_, v) => updateShapeProperty("opacity", Number(v) / 100)}
            sx={{ color: "#7B4AE2", flex: 1 }}
          />
          <InputBase
            value={`${Math.round(opacity * 100)}%`}
            readOnly
            sx={{
              width: 64,
              fontWeight: 600,
              fontSize: 16,
              bgcolor: "#F8F8FA",
              borderRadius: 2,
              px: 1.5,
              py: 0.5,
              textAlign: "center",
            }}
          />
        </Box>
      </Box>

      {/* Commented out other options for now */}
      {/* 
      <Divider sx={{ my: 2 }} />
      <Box sx={{ px: 3, mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Typography sx={{ fontWeight: 600, fontSize: 16, flex: 1 }}>
            Layer Order & Actions
          </Typography>
        </Box>
        <Box sx={{ mb: 2, display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            onClick={() => bringElementForward(selectedShapeIndex)}
            endIcon={<ArrowUpwardIcon />}
            sx={{
              borderRadius: 2,
              fontWeight: 600,
              fontSize: 12,
              bgcolor: "#F8F8FA",
              borderColor: "#E0E0E0",
              color: "#222",
              textTransform: "none",
              whiteSpace: "nowrap",
              flex: 1,
              "&:hover": {
                bgcolor: "#F3EDFF",
                borderColor: "#7B4AE2",
                color: "#7B4AE2",
              },
            }}
          >
            Bring Forward
          </Button>
          <Button
            variant="outlined"
            onClick={() => sendElementBackward(selectedShapeIndex)}
            endIcon={<ArrowDownwardIcon />}
            sx={{
              borderRadius: 2,
              fontWeight: 600,
              fontSize: 12,
              bgcolor: "#F8F8FA",
              borderColor: "#E0E0E0",
              color: "#222",
              textTransform: "none",
              whiteSpace: "nowrap",
              flex: 1,
              "&:hover": {
                bgcolor: "#F3EDFF",
                borderColor: "#7B4AE2",
                color: "#7B4AE2",
              },
            }}
          >
            Send Backward
          </Button>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            onClick={handleDuplicateShape}
            endIcon={
              <img
                src="/duplicate-icon.svg"
                alt="duplicate"
                style={{ width: 15, height: 15 }}
              />
            }
            sx={{
              borderRadius: 2,
              fontWeight: 600,
              fontSize: 12,
              bgcolor: "#F8F8FA",
              borderColor: "#E0E0E0",
              color: "#222",
              textTransform: "none",
              whiteSpace: "nowrap",
              flex: 1,
              "&:hover": {
                bgcolor: "#F3EDFF",
                borderColor: "#7B4AE2",
                color: "#7B4AE2",
              },
            }}
          >
            Duplicate
          </Button>
          <Button
            variant="outlined"
            onClick={handleDeleteShape}
            endIcon={
              <img
                src="/delete-icon.svg"
                alt="delete"
                style={{ width: 15, height: 15 }}
              />
            }
            sx={{
              borderRadius: 2,
              fontWeight: 600,
              fontSize: 12,
              bgcolor: "#F8F8FA",
              borderColor: "#E0E0E0",
              color: "#222",
              textTransform: "none",
              whiteSpace: "nowrap",
              flex: 1,
              "&:hover": {
                bgcolor: "#FFF3F3",
                borderColor: "#C00",
                color: "#C00",
              },
            }}
          >
            Delete
          </Button>
        </Box>
      </Box>
      */}
    </Box>
  );
};

export default ShapeSettingsPanel;