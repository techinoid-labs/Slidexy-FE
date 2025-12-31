"use client";

import React, { useEffect, useState, useRef } from "react";
import { Stage, Layer, Rect, Image as KonvaImage } from "react-konva";
import useImage from "use-image";
import { Box } from "@mui/material";
import SlideImage from "./KonvaComponents/KonvaSlideImage";
import KonvaTextEditor from "./KonvaComponents/KonvaTextEditor";
import AnimatedKonvaText from "./KonvaComponents/AnimatedKonvaText";
import { useSlideThemeContext } from "@/app/context/ThemeContext";
import SlidePreviews from "./slidesPreview";
import KonvaShapeRenderer from "./KonvaComponents/KonvaShapesRenderer";
import { useSlides } from "../context/SlidesContext";
import { getRandomSlide, getSlideDimensions } from "../../utils/slideUtils";
import { applyElementPositioning } from "@/utils/slideTextPositioningUtils";
import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { HTMLSlideRenderer } from "../components/editor/HTMLSlideRenderer";
import snapshotsCache from "@/utils/snapshotsCache";
import { getContrastTextColor } from "../../utils/colorUtils";

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

const SlideEditor = ({ slides = [], stageRefs }: any) => {
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
    // Add missing handlers if needed, assuming useSlides provides them
  } = useSlides();

  // Mock onHandleSelect if not in context (Web passed it as prop to SlideRenderer, but here we are the parent)
  const handleSelect = (el: any, multi = false) => {
    // Mobile usually implies single selection, so simplified logic
    // In Web this managed `selectedElements` array.
  };

  const { selectedTheme, setSelectedTheme } = useSlideThemeContext();
  const [bgImage] = useImage(selectedTheme?.image_url || "");
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

  // Periodic snapshot regeneration for ALL slides while editing
  useEffect(() => {
    const lastSnapshotAt = { value: 0 };
    const MIN_SNAPSHOT_INTERVAL = 1500; // Regenerate every 1.5s while editing

    const updateAllSnapshots = async () => {
      if (typeof document !== "undefined" && document.visibilityState !== "visible") return;

      const now = Date.now();
      if (now - lastSnapshotAt.value < MIN_SNAPSHOT_INTERVAL) return;
      lastSnapshotAt.value = now;

      for (let i = 0; i < slides.length; i++) {
        const slide = slides[i];
        const canvas = stageRefs.current[i]; // This ref is the canvas element from ref callback

        if (!canvas || !slide?.slide_id) continue;

        try {
          // SlideEditor-NewMobile stores canvas directly in stageRefs.current[index]
          await snapshotsCache.generateFromCanvas(slide.slide_id, canvas).catch((err) => {
            console.warn(`[MobileEditor] Snapshot regeneration failed for slide ${slide.slide_id}:`, err);
          });
        } catch (err) {
          console.error(`[MobileEditor] Error regenerating snapshot for slide ${i}:`, err);
        }

        // Small delay between slides to avoid blocking
        await new Promise(resolve => setTimeout(resolve, 30));
      }
    };

    const timer = setTimeout(updateAllSnapshots, 500);
    return () => clearTimeout(timer);
  }, [slides, selectedIndex]);

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
      {slides.map((originalSlide: any, index: number) => {
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

            {/* Hidden Konva Stage for Export */}
            <Box sx={{ visibility: "hidden", position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
              <Stage
                width={getDynamicConstants().SLIDE_WIDTH}
                height={getDynamicConstants().SLIDE_HEIGHT}
                ref={(ref: any) => {
                  stageRefs.current[index] = ref?.getStage()?.content?.querySelector("canvas") || null;
                }}
              >
                <Layer>
                  {/* Background */}
                  {bgImage && (slide.background?.type === "image" || selectedTheme?.image_url) ? (
                    <KonvaImage
                      image={bgImage}
                      x={0} y={0}
                      width={getDynamicConstants().SLIDE_WIDTH}
                      height={getDynamicConstants().SLIDE_HEIGHT}
                    />
                  ) : (
                    <Rect
                      width={getDynamicConstants().SLIDE_WIDTH}
                      height={getDynamicConstants().SLIDE_HEIGHT}
                      fill={slide.background?.color || selectedTheme?.backgroundColor || "#ffffff"}
                    />
                  )}

                  {/* Title */}
                  {title?.text && (
                    <AnimatedKonvaText
                      id={`title-${index}`}
                      isSelected={selectedTextId === `title-${index}`}
                      onSelect={() => setSelectedTextId(`title-${index}`)}
                      text={title.text}
                      x={titleProps.x || 25}
                      y={titleProps.y || 40}
                      width={titleProps.width || 800}
                      fontSize={titleProps.fontSize || 36}
                      fontWeight={titleProps.fontWeight || "700"}
                      fontFamily={titleProps.fontFamily || "Raleway"}
                      fontStyle={titleProps.fontStyle || "normal"}
                      opacity={titleProps.opacity || 1}
                      fill={title.useThemeColor !== false
                        ? getContrastTextColor(selectedTheme?.backgroundColor || "#ffffff")
                        : titleProps.fill || "#000000"}
                      align={titleProps.align || "center"}
                      lineHeight={titleProps.lineHeight || 1.2}
                      enableTypewriter={false}
                      enableLayoutAnimation={false}
                    />
                  )}

                  {/* Elements Loop */}
                  {slide.elements?.map((el: any, i: number) => {
                    if (["text", "bullet_point", "quote", "author", "context"].includes(el.element_type)) {
                      return (
                        <AnimatedKonvaText
                          key={`mobile-k-el-${index}-${i}`}
                          id={`el-${index}-${i}`}
                          isSelected={selectedTextId === `el-${index}-${i}`}
                          onSelect={() => setSelectedTextId(`el-${index}-${i}`)}
                          text={el.text || ""}
                          x={el.properties?.x || 0}
                          y={el.properties?.y || 0}
                          width={el.properties?.width || 300}
                          fontSize={el.properties?.fontSize || 16}
                          fontFamily={el.properties?.fontFamily || "Raleway"}
                          fontWeight={el.properties?.fontWeight || "400"}
                          fontStyle={el.properties?.fontStyle || "normal"}
                          opacity={el.properties?.opacity ?? 1}
                          fill={el.useThemeColor !== false
                            ? getContrastTextColor(selectedTheme?.backgroundColor || "#ffffff")
                            : el.properties?.fill || "#000000"}
                          align={el.properties?.align || "left"}
                          lineHeight={el.properties?.lineHeight || 1.4}
                          enableLayoutAnimation={false}
                        />
                      );
                    } else if (el.element_type === "image") {
                      return (
                        <SlideImage
                          key={`mobile-k-img-${index}-${i}`}
                          imageSrc={el.properties?.imageSrc}
                          x={el.properties?.x || 0}
                          y={el.properties?.y || 0}
                          width={el.properties?.width || 200}
                          height={el.properties?.height || 200}
                          image_id={el.image_id}
                          isSelected={selectedImageId === el.image_id || selectedImageIndex === i}
                          onSelect={() => {
                            setSelectedImageId(el.image_id);
                            setSelectedImageIndex(i);
                            setSelectedImage(el);
                            setIsMobileImageSelected(true);
                          }}
                        />
                      );
                    }
                    return null;
                  })}

                  <KonvaShapeRenderer
                    elements={slide.elements}
                    selectedShapeId={selectedShapeId}
                    selectedShapeIndex={selectedShapeIndex}
                    onSelectShape={(index, shapeId, e) => {
                      setSelectedShapeIndex(index);
                      setSelectedShapeId(shapeId);
                    }}
                  />
                </Layer>
              </Stage>
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
        />
      </Box>
    </Box>
  );
};

export default SlideEditor;