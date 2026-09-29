"use client";

import React from "react";
import { v4 as uuidv4 } from "uuid";
import { useTheme, useMediaQuery, Box, Divider, Typography, Slider, InputBase, Button } from "@mui/material";
import { useSlides } from "@/app/context/SlidesContext";
import { useSlideThemeContext } from "@/app/context/ThemeContext";
import { PANEL } from "./panelTheme";

interface ShapeSettingsPanelProps {
  sidebarHeight?: string | number;
  resetAll?: () => void;
}

const ShapeSettingsPanel: React.FC<ShapeSettingsPanelProps> = ({
  sidebarHeight = "100vh",
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  if (isMobile) return null;

  const {
    slides,
    selectedShapeId,
    setSelectedShapeId, // ✅ Use this to update selection after duplication
    selectedShapeIndex,
    selectedSlideIndex,
    setSlides,
  } = useSlides();

  const slideIndex = selectedSlideIndex;
  let elementIndex = selectedShapeIndex;

  // ✅ ROBUST LOOKUP: Same logic as TextPanel
  let shapeObj: any = null;
  let originalSlide: any = null;
  let currentSlide: any = null;

  if (slideIndex !== -1 && slides[slideIndex]) {
    originalSlide = slides[slideIndex];

    // Get the current variant slide
    const variantIndex = originalSlide.currentVariantIndex ?? 0;
    currentSlide = originalSlide.layouts?.[variantIndex] || originalSlide;

    if (selectedShapeId) {
      // 1. Try to find by stable ID in both arrays
      const allElements = [
        ...(originalSlide.elements || []),
        ...(currentSlide.elements || [])
      ];

      shapeObj = allElements.find((el: any) =>
        el.id === selectedShapeId ||
        el.properties?.id === selectedShapeId ||
        el.shape_id === selectedShapeId ||
        el.properties?.shape_id === selectedShapeId
      );

      // 2. Fallback to index if ID lookup failed (for layout shapes without stable IDs)
      if (!shapeObj && elementIndex !== null && elementIndex >= 0) {
        const variantElements = currentSlide.elements || [];
        if (elementIndex < variantElements.length) {
          shapeObj = variantElements[elementIndex];
        } else {
          const userIndex = elementIndex - variantElements.length;
          const userElements = originalSlide.elements || [];
          if (userIndex >= 0 && userIndex < userElements.length) {
            shapeObj = userElements[userIndex];
          }
        }
      }
    }
  }

  // Guard: Must be a shape
  if (!shapeObj || (shapeObj.element_type !== "shape" && shapeObj.konva_component !== "Konva.Rect")) return null;

  const rawProps = shapeObj.properties || {};
  const opacity = rawProps.opacity ?? 1;

  // Smart color resolution
  let displayColor = "#000000";
  if (rawProps.fill && rawProps.fill !== "transparent") {
    displayColor = rawProps.fill;
  } else if (rawProps.stroke && rawProps.stroke !== "transparent") {
    displayColor = rawProps.stroke;
  }

  if (shapeObj.useThemeColor !== false) {
    const theme = useSlideThemeContext().selectedTheme;
    if (theme?.primaryColor) {
      displayColor = theme.primaryColor;
    }
  }

  const ensureHex = (color: string): string => {
    if (!color || typeof color !== 'string') return "#000000";
    if (color.startsWith("#")) return color.length > 7 ? color.slice(0, 7) : color;
    if (color.startsWith("rgb")) {
      const match = color.match(/\d+/g);
      if (match) {
        const [r, g, b] = match.map(Number);
        return "#" + [r, g, b].map(x => x.toString(16).padStart(2, "0")).join("");
      }
    }
    return "#000000";
  };

  const resolvedColor = ensureHex(displayColor);

  // ✅ ROBUST UPDATE: Targets all mirrored elements by ID or index
  const updateShapeProperty = (prop: string, value: any) => {
    if (!shapeObj || slideIndex === -1) return;

    const updatedSlides = structuredClone(slides);
    const original = updatedSlides[slideIndex];

    const applyUpdates = (target: any) => {
      if (!target) return;
      target.properties = target.properties || {};
      target.properties[prop] = value;
    };

    let found = false;
    const findAndApply = (elements: any[]) => {
      if (!elements) return;
      elements.forEach(el => {
        if (selectedShapeId && (el.id === selectedShapeId || el.properties?.id === selectedShapeId || el.shape_id === selectedShapeId || el.properties?.shape_id === selectedShapeId)) {
          applyUpdates(el);
          found = true;
        }
      });
    };

    // 1. Update by ID everywhere
    findAndApply(original.elements);
    if (original.layouts) {
      original.layouts.forEach((l: any) => findAndApply(l.elements));
    }

    // 2. Fallback to index if ID search didn't find anything
    if (!found && elementIndex !== null && elementIndex >= 0) {
      const currentVariant = original.layouts?.[original.currentVariantIndex ?? 0] || original;
      const variantElements = currentVariant.elements || [];
      if (elementIndex < variantElements.length) {
        applyUpdates(variantElements[elementIndex]);
      } else {
        const userIndex = elementIndex - variantElements.length;
        const userElements = original.elements || [];
        if (userIndex >= 0 && userIndex < userElements.length) {
          applyUpdates(userElements[userIndex]);
        }
      }
    }

    setSlides(updatedSlides);
  };

  const setShapeFillAndDisableTheme = (color: string) => {
    if (!shapeObj || slideIndex === -1) return;

    const updatedSlides = structuredClone(slides);
    const original = updatedSlides[slideIndex];

    const applyFill = (target: any) => {
      if (!target) return;
      target.properties = target.properties || {};
      target.properties.fill = color;
      target.properties.stroke = color;
      target.useThemeColor = false;
    };

    let found = false;
    const findAndFill = (elements: any[]) => {
      if (!elements) return;
      elements.forEach(el => {
        if (selectedShapeId && (el.id === selectedShapeId || el.properties?.id === selectedShapeId || el.shape_id === selectedShapeId || el.properties?.shape_id === selectedShapeId)) {
          applyFill(el);
          found = true;
        }
      });
    };

    findAndFill(original.elements);
    if (original.layouts) {
      original.layouts.forEach((l: any) => findAndFill(l.elements));
    }

    if (!found && elementIndex !== null && elementIndex >= 0) {
      const currentVariant = original.layouts?.[original.currentVariantIndex ?? 0] || original;
      const variantElements = currentVariant.elements || [];
      if (elementIndex < variantElements.length) {
        applyFill(variantElements[elementIndex]);
      } else {
        const userIndex = elementIndex - variantElements.length;
        const userElements = original.elements || [];
        if (userIndex >= 0 && userIndex < userElements.length) {
          applyFill(userElements[userIndex]);
        }
      }
    }

    setSlides(updatedSlides);
  };

  const handleDuplicateShape = () => {
    if (!shapeObj || slideIndex === -1) return;

    const updatedSlides = structuredClone(slides);
    const original = updatedSlides[slideIndex];

    const newId = `user-shape-${uuidv4()}`;
    const newShape = {
      ...structuredClone(shapeObj),
      id: newId,
      shape_id: newId,
      properties: {
        ...structuredClone(shapeObj.properties || {}),
        id: newId,
        shape_id: newId,
        userAdded: true,
        x: (shapeObj.properties?.x || 100) + 30,
        y: (shapeObj.properties?.y || 100) + 30,
      },
    };

    original.elements = original.elements || [];
    original.elements.push(newShape);

    setSlides(updatedSlides);

    // ✅ CRITICAL: Update selection to the new shape
    setSelectedShapeId(newId);
  };

  const handleDeleteShape = () => {
    if (!shapeObj || slideIndex === -1) return;

    const updatedSlides = structuredClone(slides);
    const original = updatedSlides[slideIndex];

    let deleted = false;
    const findAndDelete = (elements: any[]) => {
      if (!elements) return;
      const idx = elements.findIndex(el =>
        selectedShapeId && (el.id === selectedShapeId || el.properties?.id === selectedShapeId || el.shape_id === selectedShapeId || el.properties?.shape_id === selectedShapeId)
      );
      if (idx !== -1) {
        elements.splice(idx, 1);
        deleted = true;
      }
    };

    findAndDelete(original.elements);
    if (original.layouts) {
      original.layouts.forEach((l: any) => findAndDelete(l.elements));
    }

    if (!deleted && elementIndex !== null && elementIndex >= 0) {
      const currentVariant = original.layouts?.[original.currentVariantIndex ?? 0] || original;
      const variantElements = currentVariant.elements || [];
      if (elementIndex < variantElements.length) {
        variantElements.splice(elementIndex, 1);
      } else {
        const userIndex = elementIndex - variantElements.length;
        const userElements = original.elements || [];
        if (userIndex >= 0 && userIndex < userElements.length) {
          userElements.splice(userIndex, 1);
        }
      }
    }

    setSlides(updatedSlides);
    setSelectedShapeId(null);
  };

  return (
    <Box className="w-[300px] min-w-[250px] md:min-w-[250px] flex flex-col overflow-y-auto" sx={{ bgcolor: PANEL.surface, borderLeft: `1px solid ${PANEL.border}` }}>
      <Box sx={{ display: "flex", alignItems: "center", px: 3, pt: 2.5, pb: 1.5 }}>
        <Typography sx={{ fontWeight: 600, fontSize: 16, color: PANEL.text }}>
          Shape Settings
        </Typography>
      </Box>

      <Divider sx={{ my: 2, borderColor: PANEL.border }} />

      <Box sx={{ px: 3, mb: 2 }}>
        <Typography sx={{ fontWeight: 600, fontSize: 16, mb: 1, color: PANEL.text }}>
          Color
        </Typography>
        <Box
          component="input"
          type="color"
          value={resolvedColor}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const newColor = e.target.value;
            updateShapeProperty("fill", newColor);
            updateShapeProperty("stroke", newColor);
            setShapeFillAndDisableTheme(newColor);
          }}
          sx={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            cursor: "pointer",
            border: `3px solid ${PANEL.surface}`,
            boxShadow: "0 0 0 1.5px rgba(142, 45, 226, 0.25), 0 4px 12px rgba(142, 45, 226, 0.15)",
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
            "&:hover": {
              transform: "scale(1.08)",
              boxShadow: `0 0 0 1.5px ${PANEL.accent}, 0 6px 16px rgba(142, 45, 226, 0.25)`,
            },
          }}
        />
      </Box>

      <Divider sx={{ my: 2, borderColor: PANEL.border }} />

      <Box sx={{ px: 3, mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Typography sx={{ fontWeight: 600, fontSize: 16, flex: 1, color: PANEL.text }}>
            Opacity
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Slider
            value={Math.round(opacity * 100)}
            onChange={(_, v) => updateShapeProperty("opacity", Number(v) / 100)}
            sx={{ color: PANEL.accent, flex: 1 }}
          />
          <InputBase
            value={`${Math.round(opacity * 100)}%`}
            readOnly
            sx={{
              width: 64,
              fontWeight: 600,
              fontSize: 16,
              color: PANEL.text,
              bgcolor: PANEL.surfaceSunken,
              borderRadius: 2,
              px: 1.5,
              py: 0.5,
              textAlign: "center",
            }}
          />
        </Box>
      </Box>

      <Divider sx={{ my: 2, borderColor: PANEL.border }} />
      <Box sx={{ px: 3, mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Typography sx={{ fontWeight: 600, fontSize: 16, flex: 1, color: PANEL.text }}>
            Actions
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={handleDuplicateShape}
            sx={{ flex: 1 }}
          >
            Duplicate
          </Button>
          <Button
            variant="outlined"
            size="small"
            color="error"
            onClick={handleDeleteShape}
            sx={{ flex: 1 }}
          >
            Delete
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ShapeSettingsPanel;