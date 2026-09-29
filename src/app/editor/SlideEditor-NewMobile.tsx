"use client";

import React, { useEffect, useState, useRef } from "react";
import { Box } from "@mui/material";
import { useSlideThemeContext } from "@/app/context/ThemeContext";
import SlidePreviews from "./slidesPreview";
import { useSlides } from "../context/SlidesContext";
import { getRandomSlide, getSlideDimensions } from "../../utils/slideUtils";
import { applyElementPositioning } from "@/utils/slideTextPositioningUtils";
import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { HTMLSlideRenderer } from "../components/editor/HTMLSlideRenderer";

const getDynamicConstants = () => {
  const {
    SLIDE_WIDTH,
    SLIDE_HEIGHT,
    LEFT_PADDING,
    SLIDE_HEIGHT_MOBILE,
    SLIDE_WIDTH_MOBILE,
  } = getSlideDimensions();
  const IMAGE_WIDTH = 400;
  const IMAGE_PADDING = 40;
  const textMaxWidth = SLIDE_WIDTH - IMAGE_WIDTH - IMAGE_PADDING - LEFT_PADDING;
  const textMaxHeight = SLIDE_HEIGHT;
  return {
    SLIDE_WIDTH,
    SLIDE_HEIGHT,
    LEFT_PADDING,
    IMAGE_WIDTH,
    IMAGE_PADDING,
    SLIDE_HEIGHT_MOBILE,
    SLIDE_WIDTH_MOBILE,
    textMaxWidth,
    textMaxHeight,
  };
};

const SlideEditor = ({ slides = [] }: any) => {
  const {
    selectedImageIndex,
    setSelectedImageIndex,
    setSelectedImage,
    selectedTextId,
    setSelectedShapeId,
    selectedShapeId,
    setSelectedTextId,
    selectedImageId,
    setSelectedImageId,
    selectedShapeIndex,
    setSelectedShapeIndex,
    setSlides,
    isAtBoundary,
    tooltip,
    setTooltip,
    isMobileImageSelected,
    setIsMobileImageSelected,
    duplicateSlide,
    reorderSlides,
  } = useSlides();

  // Mock onHandleSelect if not in context (Web passed it as prop to SlideRenderer, but here we are the parent)
  const handleSelect = (el: any, multi = false) => {
    // Mobile usually implies single selection, so simplified logic
    // In Web this managed `selectedElements` array.
  };

  const { selectedTheme, setSelectedTheme } = useSlideThemeContext();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scale, setScale] = useState(1);
  const dispatch = useDispatch();

  const handleAddSlide = () => {
    const newSlide = getRandomSlide();
    const newSlides = [...slides, structuredClone(newSlide)];
    setSlides(newSlides);
    setSelectedIndex(newSlides.length - 1);
  };

  const handleDeleteSlide = (index: number) => {
    const newSlides = [...slides];
    newSlides.splice(index, 1);
    setSlides(newSlides);
    if (selectedIndex >= newSlides.length) {
      setSelectedIndex(Math.max(0, newSlides.length - 1));
    }
  };

  useEffect(() => {
    const preservedThemeData = localStorage.getItem("slidesTheme");
    if (preservedThemeData) {
      setSelectedTheme(JSON.parse(preservedThemeData));
    }
  }, []);

  useEffect(() => {
    const positionedSlides = applyElementPositioning(slides, selectedTheme);
    setSlides(positionedSlides);
  }, [slides?.length]);


  useEffect(() => {
    const updateScale = () => {
      const slideWidth = getDynamicConstants().SLIDE_WIDTH;
      const margin = 32;
      const availableWidth = window.innerWidth - margin;
      const newScale = availableWidth / slideWidth;
      setScale(Math.min(1, newScale)); // max 1x scale
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  // Assign image_id to images that don't have it
  useEffect(() => {
    const updatedSlides = structuredClone(slides);
    let changed = false;
    updatedSlides.forEach((slide: any) => {
      slide.elements.forEach((el: any) => {
        if (el.element_type === "image" && !el.properties.image_id) {
          el.properties.image_id = uuidv4();
          changed = true;
        }
      });
    });
    if (changed) {
      setSlides(updatedSlides);
      console.log("[SlideEditor] Assigned missing image_ids to images");
    }
  }, [slides, setSlides]);

  const deselectAll = () => {
    setSelectedTextId(null);
    setSelectedImageIndex(null);
    setSelectedShapeIndex(null);
    setSelectedImage(null);
    setSelectedImageId(null);
    setSelectedShapeId(null);
    setTooltip({ visible: false, x: 0, y: 0, node: null });
    setIsMobileImageSelected(false);
  };

  const handleElementClickFromHTML = (
    elementId: string,
    elementType: string,
    elementIndex?: number
  ) => {
    // Clear selections
    deselectAll();

    // Try to get element coordinates for tooltip
    let clientRect = { x: 100, y: 100 }; // Default
    if (typeof document !== 'undefined' && elementId) {
      const el = document.getElementById(elementId);
      if (el) {
        const rect = el.getBoundingClientRect();
        // Adjust for scale if needed, or just use screen coordinates
        // Tooltip expects screen-relative or container-relative?
        // TextSettingsPanelMobile uses absolute positioning.
        // Let's assume viewport coordinates or relative to editor container.
        // Simple attempt:
        clientRect = { x: rect.left, y: rect.top };
      }
    }

    if (elementType === "text") {
      const textId = elementId || (typeof elementIndex === "number" ? `el-${selectedIndex}-${elementIndex}` : `title-${selectedIndex}`);
      setSelectedTextId(textId);
    } else if (elementType === "image") {
      const slide = slides[selectedIndex];
      // Find image logic mirroring Web
      const imgEl = slide.elements?.find((el: any) =>
        el.element_type === "image" &&
        (el.image_id === elementId || el.properties?.image_id === elementId ||
          typeof elementIndex === "number" && slide.elements.indexOf(el) === elementIndex)
      ) || slide.elements?.find((el: any) => el.element_type === "image");

      const finalIndex = typeof elementIndex === "number"
        ? elementIndex
        : imgEl ? slide.elements?.indexOf(imgEl) ?? null : null;

      const finalId = elementId || imgEl?.image_id || imgEl?.properties?.image_id;

      if (finalId) setSelectedImageId(finalId);
      if (finalIndex !== null) setSelectedImageIndex(finalIndex);

      if (imgEl) {
        setSelectedImage(imgEl);
        setIsMobileImageSelected(true);
      }

    } else if (elementType === "shape") {
      setSelectedShapeId(elementId);
      if (typeof elementIndex === 'number') setSelectedShapeIndex(elementIndex);
      // Mobile shape panel logic?
    }
  };

  /**
   * Helper: extracts only user-drawn shapes (not part of generated layouts)
   */
  const extractUserShapes = (slide: any): any[] => {
    if (!slide.elements || !Array.isArray(slide.elements)) return [];
    return slide.elements.filter((el: any) =>
      el.element_type === "shape" &&
      el.shape_id &&
      typeof el.shape_id === "string" &&
      el.shape_id.startsWith("user-")
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {/* Only the active slide is mounted — see SlideEditor.tsx for the rationale. */}
      {[slides[selectedIndex]].filter(Boolean).map((originalSlide: any) => {
        const index = selectedIndex;
        // Prepare Variant Slide (Logic from Web)
        const getCurrentVariantSlide = (slide: any) => {
          if (!slide.layouts || slide.layouts.length === 0) return slide;
          const variantIndex = slide.currentVariantIndex ?? 0;
          const variant = slide.layouts[variantIndex];
          if (!variant) return slide;

          const userShapes = extractUserShapes(slide);
          return {
            ...slide,
            ...variant,
            // Combine variant elements with user-added shapes (deduplicated by shape_id)
            elements: [
              ...(variant.elements || []),
              ...userShapes.filter((us: any) =>
                !(variant.elements || []).some((ve: any) => ve.shape_id === us.shape_id)
              )
            ],
            currentVariantIndex: variantIndex,
          };
        };

        const slide = getCurrentVariantSlide(originalSlide);
        const title = slide.slide_title;
        const titleProps = title?.properties || {};

        return (
          <Box
            key={originalSlide.slide_id}
            id={`slide-node-${index}`}
            sx={{
              borderRadius: 4,
              border: "1px solid #939393ff",
              backgroundColor: "#fff",
              position: index === selectedIndex ? "relative" : "absolute",
              mb: { xs: 7, md: -1, sm: -1 },
              top: index === selectedIndex ? { xs: -30, sm: 20, lg: 20 } : 0,
              left: index === selectedIndex ? 0 : -99999,
              display: "block",
              visibility: index === selectedIndex ? "visible" : "hidden",
              transform: `scale(${scale})`,
              width: `${getDynamicConstants().SLIDE_WIDTH}px`,
              height: `${getDynamicConstants().SLIDE_HEIGHT}px`,
            }}
          >
            {/* HTML Layer (Visible) */}
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                zIndex: 10,
              }}
            >
              <HTMLSlideRenderer
                slide={slide}
                theme={selectedTheme}
                isEditing={true}
                slideIndex={index}
                onElementClick={(id, type, idx) => handleElementClickFromHTML(id, type, idx)}
                onSlideUpdate={(updatedSlide) => {
                  // Merge logic from Web
                  const updatedSlides = structuredClone(slides);
                  const orig = updatedSlides[index];
                  if (!orig) return;

                  // See SlideEditor.tsx — block slides bypass variant mapping.
                  if (updatedSlide.blockSpec) {
                    orig.blockSpec = updatedSlide.blockSpec;
                    if (updatedSlide.slide_title) orig.slide_title = updatedSlide.slide_title;
                    updatedSlides[index] = orig;
                    setSlides(updatedSlides);
                    return;
                  }

                  const variantIndex = orig.currentVariantIndex ?? 0;

                  // Update common slide-level fields
                  if (updatedSlide.slide_title) orig.slide_title = updatedSlide.slide_title;
                  if (updatedSlide.subtitle) orig.subtitle = updatedSlide.subtitle;
                  if (updatedSlide.background) orig.background = updatedSlide.background;
                  if (typeof updatedSlide.image_url !== "undefined") orig.image_url = updatedSlide.image_url;

                  // Layouts update logic
                  if (orig.layouts && orig.layouts.length > 0) {
                    const currentVariant = orig.layouts[variantIndex] || { elements: [] };
                    const variantCount = (currentVariant.elements || []).length;

                    // HTMLSlideRenderer reads these from the variant, so they
                    // must be written there or the edit is lost on re-render.
                    if (updatedSlide.slide_title) currentVariant.slide_title = updatedSlide.slide_title;
                    if (updatedSlide.subtitle) currentVariant.subtitle = updatedSlide.subtitle;
                    if (updatedSlide.background) currentVariant.background = updatedSlide.background;
                    if (typeof updatedSlide.image_url !== "undefined") currentVariant.image_url = updatedSlide.image_url;
                    orig.layouts[variantIndex] = currentVariant;

                    if (Array.isArray(updatedSlide.elements)) {
                      const newVariantElements = updatedSlide.elements.slice(0, variantCount);
                      const newUserShapes = updatedSlide.elements.slice(variantCount);

                      currentVariant.elements = newVariantElements;
                      orig.layouts[variantIndex] = currentVariant;
                      orig.elements = [...newVariantElements, ...newUserShapes];
                    }
                  } else {
                    if (Array.isArray(updatedSlide.elements)) {
                      orig.elements = updatedSlide.elements;
                    }
                  }

                  orig.currentVariantIndex = variantIndex;
                  updatedSlides[index] = orig;
                  setSlides(updatedSlides);
                }}
              />
            </Box>

          </Box>
        );
      })}

      <Box sx={{ transform: `scale(${scale})` }}>
        <SlidePreviews
          slides={slides}
          selectedIndex={selectedIndex}
          slide_width={getDynamicConstants().SLIDE_WIDTH}
          slide_height={getDynamicConstants().SLIDE_HEIGHT_MOBILE + 10}
          onSelect={setSelectedIndex}
          onAddSlide={handleAddSlide}
          onDeleteSlide={handleDeleteSlide}
          onDuplicateSlide={duplicateSlide}
          onReorderSlide={reorderSlides}
        />
      </Box>
    </Box>
  );
};

export default SlideEditor;