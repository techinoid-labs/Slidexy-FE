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
    selectedShapeId,
    selectedShapeIndex,
    selectedSlideIndex,
    setSlides,
  } = useSlides();
  const { setPrimaryColor } = useSlideThemeContext();

  // Extract shape object using shape_id (more reliable than index)
  const slideIndex = selectedSlideIndex;
  const elementIndex = selectedShapeIndex;

  // ✅ FIXED: Use shape_id to find shape reliably across variant slides
  let shapeObj: any = null;
  if (slideIndex !== -1 && slides[slideIndex] && selectedShapeId) {
    const originalSlide = slides[slideIndex];
    
    // Get the current variant slide (what's actually being rendered)
    const getCurrentVariantSlide = (slide: any) => {
      if (!slide.layouts || slide.layouts.length === 0) {
        return slide;
      }
      const variantIndex = slide.currentVariantIndex ?? 0;
      const variant = slide.layouts[variantIndex];
      return variant || slide;
    };
    
    const currentSlide = getCurrentVariantSlide(originalSlide);
    
    // Find shape by ID instead of index (works across variants)
    if (currentSlide.elements) {
      shapeObj = currentSlide.elements.find((el: any) => el.shape_id === selectedShapeId);
    }
    
    // Fallback: try to find in original slide
    if (!shapeObj && originalSlide.elements) {
      shapeObj = originalSlide.elements.find((el: any) => el.shape_id === selectedShapeId);
    }
  }

  if (!shapeObj || shapeObj.element_type !== "shape") return null;

  const rawProps = shapeObj.properties || {};
  const fill = rawProps.fill ?? "#000000";
  const opacity = rawProps.opacity ?? 1;

  const updateShapeProperty = (prop: string, value: any) => {
    if (!shapeObj || slideIndex === -1 || !selectedShapeId) return;
    
    // ✅ FIXED: Update shape using shape_id (works across variants)
    const updatedSlides = structuredClone(slides);
    const originalSlide = updatedSlides[slideIndex];
    
    if (originalSlide.layouts && originalSlide.layouts.length > 0) {
      const variantIndex = originalSlide.currentVariantIndex ?? 0;
      const variant = originalSlide.layouts[variantIndex];
      if (variant && variant.elements) {
        // Find and update shape by ID in variant
        const variantShape = variant.elements.find((el: any) => el.shape_id === selectedShapeId);
        if (variantShape) {
          if (!variantShape.properties) variantShape.properties = {};
          variantShape.properties[prop] = value;
        }
      }
    }
    
    // Also update original slide for consistency
    if (originalSlide.elements) {
      const originalShape = originalSlide.elements.find((el: any) => el.shape_id === selectedShapeId);
      if (originalShape) {
        if (!originalShape.properties) originalShape.properties = {};
        originalShape.properties[prop] = value;
      }
    }
    
    setSlides(updatedSlides);
  };

  const setShapeFillAndDisableTheme = (color: string) => {
    // Check that we have shape_id selected
    if (slideIndex === -1 || !selectedShapeId) return;

    // ✅ FIXED: Update shape using shape_id (works across variants)
    const updatedSlides = structuredClone(slides);
    const originalSlide = updatedSlides[slideIndex];

    if (!originalSlide) return;

    if (originalSlide.layouts && originalSlide.layouts.length > 0) {
      const variantIndex = originalSlide.currentVariantIndex ?? 0;
      const variant = originalSlide.layouts[variantIndex];
      
      if (variant && variant.elements) {
        // Find and update shape by ID in variant
        const variantShape = variant.elements.find((el: any) => el.shape_id === selectedShapeId);
        if (variantShape) {
          if (!variantShape.properties) {
            variantShape.properties = {};
          }
          variantShape.properties.fill = color;
          variantShape.useThemeColor = false;
        }
      }
    }
    
    // Also update original slide for consistency
    if (originalSlide.elements) {
      const originalShape = originalSlide.elements.find((el: any) => el.shape_id === selectedShapeId);
      if (originalShape) {
        if (!originalShape.properties) {
          originalShape.properties = {};
        }
        originalShape.properties.fill = color;
        originalShape.useThemeColor = false;
      }
    }
    
    setSlides(updatedSlides);
  };

  return (
    <Box className="w-[300px] min-w-[250px] md:min-w-[250px] bg-white flex flex-col overflow-y-auto border-r border-gray-200">
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
          {/* <Typography sx={{ fontSize: 14 }}>{fill.toUpperCase()}</Typography> */}
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