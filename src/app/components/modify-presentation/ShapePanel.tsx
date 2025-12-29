"use client";

import React from "react";
import { useTheme, useMediaQuery } from "@mui/material";
import { useSlides } from "@/app/context/SlidesContext";
import { useSlideThemeContext } from "@/app/context/ThemeContext";
import {
  PremiumSlider,
  PremiumColorPicker,
  PremiumDivider,
} from "@/app/components/editor/PremiumControls";

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
    selectedShapeIndex,
    selectedSlideIndex,
    setSlides,
  } = useSlides();

  const slideIndex = selectedSlideIndex;

  // Use shape_id to find shape reliably across variant slides
  let shapeObj: any = null;
  if (slideIndex !== -1 && slides[slideIndex] && selectedShapeId) {
    const originalSlide = slides[slideIndex];

    const getCurrentVariantSlide = (slide: any) => {
      if (!slide.layouts || slide.layouts.length === 0) {
        return slide;
      }
      const variantIndex = slide.currentVariantIndex ?? 0;
      const variant = slide.layouts[variantIndex];
      return variant || slide;
    };

    const currentSlide = getCurrentVariantSlide(originalSlide);

    if (currentSlide.elements) {
      shapeObj = currentSlide.elements.find(
        (el: any) => el.shape_id === selectedShapeId
      );
    }

    if (!shapeObj && originalSlide.elements) {
      shapeObj = originalSlide.elements.find(
        (el: any) => el.shape_id === selectedShapeId
      );
    }
  }

  if (!shapeObj || shapeObj.element_type !== "shape") return null;

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
    if (color.startsWith("#") && color.length === 7) return color;
    if (color.startsWith("#") && color.length === 9) return color.slice(0, 7);

    if (color.startsWith("rgb")) {
      const match = color.match(/\d+/g);
      if (match) {
        const [r, g, b] = match.map(Number);
        return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
      }
    }

    return "#000000";
  };

  const resolvedColor = ensureHex(displayColor);

  const updateShapeProperty = (prop: string, value: any) => {
    if (!shapeObj || slideIndex === -1 || !selectedShapeId) return;

    const updatedSlides = structuredClone(slides);
    const originalSlide = updatedSlides[slideIndex];

    if (originalSlide.layouts && originalSlide.layouts.length > 0) {
      const variantIndex = originalSlide.currentVariantIndex ?? 0;
      const variant = originalSlide.layouts[variantIndex];
      if (variant && variant.elements) {
        const variantShape = variant.elements.find(
          (el: any) => el.shape_id === selectedShapeId
        );
        if (variantShape) {
          if (!variantShape.properties) variantShape.properties = {};
          variantShape.properties[prop] = value;
        }
      }
    }

    if (originalSlide.elements) {
      const originalShape = originalSlide.elements.find(
        (el: any) => el.shape_id === selectedShapeId
      );
      if (originalShape) {
        if (!originalShape.properties) originalShape.properties = {};
        originalShape.properties[prop] = value;
      }
    }

    setSlides(updatedSlides);
  };

  const setShapeFillAndDisableTheme = (color: string) => {
    if (slideIndex === -1 || !selectedShapeId) return;

    const updatedSlides = structuredClone(slides);
    const originalSlide = updatedSlides[slideIndex];

    if (!originalSlide) return;

    if (originalSlide.layouts && originalSlide.layouts.length > 0) {
      const variantIndex = originalSlide.currentVariantIndex ?? 0;
      const variant = originalSlide.layouts[variantIndex];

      if (variant && variant.elements) {
        const variantShape = variant.elements.find(
          (el: any) => el.shape_id === selectedShapeId
        );
        if (variantShape) {
          if (!variantShape.properties) {
            variantShape.properties = {};
          }
          variantShape.properties.fill = color;
          variantShape.properties.stroke = color;
          variantShape.useThemeColor = false;
        }
      }
    }

    if (originalSlide.elements) {
      const originalShape = originalSlide.elements.find(
        (el: any) => el.shape_id === selectedShapeId
      );
      if (originalShape) {
        if (!originalShape.properties) {
          originalShape.properties = {};
        }
        originalShape.properties.fill = color;
        originalShape.properties.stroke = color;
        originalShape.useThemeColor = false;
      }
    }

    setSlides(updatedSlides);
  };

  // ✅ NEW: Duplicate shape properly
  const handleDuplicateShape = () => {
    if (!shapeObj || slideIndex === -1 || !selectedShapeId) return;

    const updatedSlides = structuredClone(slides);
    const originalSlide = updatedSlides[slideIndex];

    if (!originalSlide) return;

    // Create new shape element with proper structure and mark as userAdded
    const newShapeElement = {
      ...structuredClone(shapeObj),
      shape_id: `user-${Date.now()}`, // New unique ID
      properties: {
        ...structuredClone(shapeObj.properties || {}),
        userAdded: true,
        x: (shapeObj.properties?.x || 100) + 30,
        y: (shapeObj.properties?.y || 100) + 30,
      },
    };

    // Update original: Add to elements array
    originalSlide.elements = originalSlide.elements || [];
    originalSlide.elements.push(newShapeElement);

    // Update current variant (if exists)
    if (originalSlide.layouts && originalSlide.layouts.length > 0) {
      const variantIndex = originalSlide.currentVariantIndex ?? 0;
      const variant = originalSlide.layouts[variantIndex];
      if (variant) {
        variant.elements = variant.elements || [];
        variant.elements.push(structuredClone(newShapeElement));
      }
    }

    setSlides(updatedSlides);
  };

  // ✅ NEW: Delete shape properly
  const handleDeleteShape = () => {
    if (slideIndex === -1 || !selectedShapeId) return;

    const updatedSlides = structuredClone(slides);
    const originalSlide = updatedSlides[slideIndex];

    if (!originalSlide) return;

    // Find and delete from variant
    if (originalSlide.layouts && originalSlide.layouts.length > 0) {
      const variantIndex = originalSlide.currentVariantIndex ?? 0;
      const variant = originalSlide.layouts[variantIndex];
      if (variant && variant.elements) {
        const variantIndex = variant.elements.findIndex(
          (el: any) => el.shape_id === selectedShapeId
        );
        if (variantIndex !== -1) {
          variant.elements.splice(variantIndex, 1);
        }
      }
    }

    // Delete from original
    if (originalSlide.elements) {
      const originalIndex = originalSlide.elements.findIndex(
        (el: any) => el.shape_id === selectedShapeId
      );
      if (originalIndex !== -1) {
        originalSlide.elements.splice(originalIndex, 1);
      }
    }

    setSlides(updatedSlides);
  };

  return (
    <div className="w-[310px] min-w-[310px] bg-white flex flex-col overflow-y-auto editor-scrollbar border-l border-gray-100">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Shape Settings</h3>
          <div className="editor-badge-primary">Selected</div>
        </div>

        <PremiumDivider />

        {/* Color */}
        <PremiumColorPicker
          value={resolvedColor}
          onChange={(color) => setShapeFillAndDisableTheme(color)}
          label="Shape Color"
        />

        <PremiumDivider />

        {/* Opacity */}
        <PremiumSlider
          value={Math.round(opacity * 100)}
          onChange={(val) => updateShapeProperty("opacity", val / 100)}
          min={0}
          max={100}
          step={1}
          label="Opacity"
          showValue
          unit="%"
        />

        <PremiumDivider />

        {/* Actions */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Actions</h4>
          <div className="flex gap-2">
            <button
              onClick={handleDuplicateShape}
              className="flex-1 px-3 py-2.5 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-purple-50 hover:text-purple-600 hover:border-purple-300 transition-all"
            >
              Duplicate
            </button>
            <button
              onClick={handleDeleteShape}
              className="flex-1 px-3 py-2.5 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-all"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShapeSettingsPanel;