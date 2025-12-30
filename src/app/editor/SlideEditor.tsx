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
import HorizontalSlidesCarousel from "@/app/components/editor/HorizontalSlidesCarousel";
import { useSlides } from "../context/SlidesContext";
import { getSlideDimensions } from "../../utils/slideUtils";
import { generateSlideVariants } from "../../utils/variantGenerator";
import { getStageCanvas } from "../../utils/snapShotUtils";
import snapshotsCache from "@/utils/snapshotsCache";
import { getContrastTextColor } from "../../utils/colorUtils";
import { HTMLSlideRenderer } from "../components/editor/HTMLSlideRenderer";

type SelectedElement = {
  id: string;
  type: "text" | "image" | "shape";
  index: number;
};

const getDynamicConstants = () => {
  const { SLIDE_WIDTH, SLIDE_HEIGHT, LEFT_PADDING } = getSlideDimensions();
  return { SLIDE_WIDTH, SLIDE_HEIGHT, LEFT_PADDING };
};

interface SlideRendererProps {
  slides: any[];
  selectedSlideIndex: number;
  stageRefs: React.MutableRefObject<any[]>;
  selectedImageIndex: number | null;
  selectedShapeId: string | null;
  selectedTextId: string | null;
  selectedImageId: string | null;
  selectedShapeIndex: number | null;
  selectedElements: SelectedElement[];
  selectedTheme: any;
  scale: number;
  openPanel: boolean;
  onDeselect?: () => void;
  onHandleSelect: (el: SelectedElement, multi?: boolean) => void;
  onSetSelectedShapeId: (id: string | null) => void;
  onSetSelectedImageIndex: (index: number | null) => void;
  onSetSelectedImage: (image: any) => void;
  onSetSelectedImageId: (id: string | null) => void;
  onSetSelectedTextId: (id: string | null) => void;
  onSetSelectedShapeIndex: (index: number | null) => void;
  onSetSlides: (slides: any[]) => void;
}

/**
 * Renders a single slide's Konva stage with all elements
 */
const SlideRenderer: React.FC<SlideRendererProps & { index: number; originalSlide: any }> = ({
  slides,
  selectedSlideIndex,
  stageRefs,
  selectedImageIndex,
  selectedShapeId,
  selectedTextId,
  selectedImageId,
  selectedShapeIndex,
  selectedElements,
  selectedTheme,
  scale,
  openPanel,
  onDeselect,
  onHandleSelect,
  onSetSelectedShapeId,
  onSetSelectedImageIndex,
  onSetSelectedImage,
  onSetSelectedImageId,
  onSetSelectedTextId,
  onSetSelectedShapeIndex,
  onSetSlides,
  index,
  originalSlide,
}) => {
  /**
  * Returns the currently active variant of a slide.
  * Always uses the variant stored in slide.layouts[currentVariantIndex]
  * Preserves user-added custom shapes (that have shape_id)
  */
  const getCurrentVariantSlide = (slide: any) => {
    // If no layouts exist at all → return the slide as-is
    if (!slide.layouts || slide.layouts.length === 0) {
      return slide;
    }

    const variantIndex = slide.currentVariantIndex ?? 0;
    const variant = slide.layouts[variantIndex];

    // Safety: if variant is missing (corrupted data), fall back to first layout
    if (!variant) {
      console.warn(`[getCurrentVariantSlide] Variant ${variantIndex} not found, falling back to index 0`);
      const fallbackVariant = slide.layouts[0];
      return {
        ...slide,
        ...fallbackVariant,
        elements: [...(fallbackVariant.elements || []), ...extractUserElements(slide)],
      };
    }

    // Extract user-added elements (drawn manually, not part of layout)
    const userElements = extractUserElements(slide);

    // Merge: variant wins on everything except user-added elements
    return {
      ...slide,                           // Keep original slide props (slide_id, etc.)
      ...variant,                         // Override with variant data
      // ✅ FIX: Combine variant elements with user-added elements (deduplicated by multiple ID fields)
      elements: [
        ...(variant.elements || []),
        ...userElements.filter((ue: any) => {
          const ueId = ue.id || ue.shape_id || ue.properties?.shape_id || ue.properties?.image_id;
          return !(variant.elements || []).some((ve: any) => {
            const veId = ve.id || ve.shape_id || ve.properties?.shape_id || ve.properties?.image_id;
            return ueId && veId && ueId === veId;
          });
        })
      ],
      currentVariantIndex: variantIndex,
    };
  };

  /**
   * Helper: extracts only user-added elements (not part of generated layouts)
   */
  const extractUserElements = (slide: any): any[] => {
    if (!slide.elements || !Array.isArray(slide.elements)) return [];

    return slide.elements.filter((el: any) => {
      // 1. Elements marked with userAdded property
      if (el.userAdded === true || el.properties?.userAdded === true) return true;

      // 2. Elements with known user-generated ID prefixes
      const id = el.id || el.shape_id || el.properties?.shape_id || el.properties?.image_id || el.image_id;
      if (typeof id === "string") {
        if (id.startsWith("user-")) return true;
        if (id.startsWith("el-")) return true;
        if (id.startsWith("img-")) return true;
      }

      // 3. Fallback for specific element types that are likely user-added in this context
      // (like shapes or images that somehow lost their userAdded flag)
      if (el.element_type === 'shape' || el.element_type === 'image') return true;

      return false;
    });
  };

  const slide = getCurrentVariantSlide(originalSlide);
  const title = slide.slide_title;
  const titleProps = title?.properties || {};

  let renderBgUrl = "";
  if (slide.background?.type === "image" && slide.background.url) {
    renderBgUrl = slide.background.url;
  } else if (selectedTheme?.image_url) {
    renderBgUrl = selectedTheme.image_url;
  }

  const [bgImage] = useImage(renderBgUrl);

  const handleElementClickFromHTML = (
    elementId: string,
    elementType: string,
    elementIndex?: number
  ) => {
    // Selective clearing based on what's being selected
    if (elementType === "text") {
      onSetSelectedShapeId(null);
      onSetSelectedImageId(null);
      onSetSelectedImageIndex(null);
      onSetSelectedShapeIndex(null);

      const textId =
        elementId ||
        (typeof elementIndex === "number"
          ? `el-${index}-${elementIndex}`
          : `title-${index}`);

      if (selectedTextId !== textId) {
        onSetSelectedTextId(textId);
        onHandleSelect({ id: textId, type: "text", index: elementIndex ?? -1 });
      }
    } else if (elementType === "image") {
      onSetSelectedShapeId(null);
      onSetSelectedShapeIndex(null);
      onSetSelectedTextId(null);

      // Find image element in slide
      const imgEl = slide.elements?.find((el: any) =>
        el.element_type === "image" &&
        (el.image_id === elementId || el.properties?.image_id === elementId ||
          typeof elementIndex === "number" && slide.elements.indexOf(el) === elementIndex)
      ) || slide.elements?.find((el: any) => el.element_type === "image");

      const finalIndex = typeof elementIndex === "number"
        ? elementIndex
        : imgEl ? slide.elements?.indexOf(imgEl) ?? null : null;

      const finalId = elementId || imgEl?.image_id || imgEl?.properties?.image_id || `image-${index}-${finalIndex ?? 0}`;

      if (selectedImageId !== finalId || selectedImageIndex !== finalIndex) {
        onSetSelectedImageId(finalId);
        onSetSelectedImageIndex(finalIndex);
        onHandleSelect({ id: finalId, type: "image", index: finalIndex ?? 0 });
      }

      if (imgEl) {
        onSetSelectedImage({
          ...imgEl,
          image_id: finalId,
          konva_component: imgEl.konva_component || "Konva.Image",
          element_type: "image",
          properties: {
            ...imgEl.properties,
            image_id: finalId,
          },
        });
      } else {
        // Layout image (slide.image_url) - read properties from slide.image_properties
        const layoutImageProps = originalSlide.image_properties || {};
        onSetSelectedImage({
          element_type: "image",
          konva_component: "Konva.Image",
          properties: {
            imageSrc: slide.image_url,
            x: 0,
            y: 0,
            width: 400,
            height: 400,
            image_id: finalId,
            // Read visual properties from slide.image_properties
            opacity: layoutImageProps.opacity ?? 1,
            borderRadius: layoutImageProps.borderRadius ?? 0,
            shadow: layoutImageProps.shadow,
            ...layoutImageProps,
          },
        });
        onSetSelectedImageIndex(-99);
      }
    } else if (elementType === "shape") {
      const shapeId = elementId || `shape-${index}-${elementIndex ?? 0}`;
      onHandleSelect({ id: shapeId, type: "shape", index: elementIndex ?? 0 });
      onSetSelectedShapeId(shapeId);
      onSetSelectedShapeIndex(elementIndex ?? null);
    }
  };

  return (
    <Box
      key={originalSlide.slide_id}
      data-slide-index={index}
      id={`slide-node-${index}`}
      sx={{
        border: "1px solid #939393ff",
        backgroundColor: "#fff",
        position: "absolute",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        // Render all slides but only show the selected one
        // Hidden slides are positioned off-screen so snapshots can be generated
        visibility: index === selectedSlideIndex ? "visible" : "hidden",
        opacity: index === selectedSlideIndex ? 1 : 0,
        pointerEvents: index === selectedSlideIndex ? "auto" : "none",
        transform: `scale(${scale})`,
        left: index === selectedSlideIndex ? 0 : -99999,
        width: getDynamicConstants().SLIDE_WIDTH,
        height: getDynamicConstants().SLIDE_HEIGHT,
      }}
    >
      {/* HTML Overlay for editing - visible and interactive */}
      <Box
        data-slide-container="true"
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 10,
          pointerEvents: openPanel ? "none" : "auto",
        }}
      >
        <HTMLSlideRenderer
          slide={slide}
          theme={selectedTheme}
          isEditing={true}
          slideIndex={index}
          onElementClick={handleElementClickFromHTML}
          onSlideUpdate={(updatedSlide) => {
            // Merge updates from HTML renderer into the original slide/variant
            // Don't replace the whole slide object (that would wipe `layouts` etc.)
            const updatedSlides = structuredClone(slides);
            const originalSlide = updatedSlides[index];
            if (!originalSlide) return;

            // Preserve variant index
            const variantIndex = originalSlide.currentVariantIndex ?? 0;

            // Update common slide-level fields
            if (updatedSlide.slide_title) {
              originalSlide.slide_title = updatedSlide.slide_title;
            }
            if (updatedSlide.subtitle) {
              originalSlide.subtitle = updatedSlide.subtitle;
            }
            if (updatedSlide.background) {
              originalSlide.background = updatedSlide.background;
            }
            if (typeof updatedSlide.image_url !== "undefined") {
              originalSlide.image_url = updatedSlide.image_url;
            }

            // If this slide has layouts/variants, map back into the current variant
            if (originalSlide.layouts && originalSlide.layouts.length > 0) {
              const currentVariant = originalSlide.layouts[variantIndex] || { elements: [] };
              const variantCount = (currentVariant.elements || []).length;

              // The HTML renderer provides elements as [ ...variant.elements, ...userShapes ]
              if (Array.isArray(updatedSlide.elements)) {
                // ✅ FIX: Correctly identify user elements and variant elements
                const userElements = extractUserElements(updatedSlide);
                const variantElements = updatedSlide.elements.filter(el =>
                  !userElements.some(ue => {
                    const ueId = ue.id || ue.shape_id || ue.properties?.image_id || ue.properties?.shape_id;
                    const elId = el.id || el.shape_id || el.properties?.image_id || el.properties?.shape_id;
                    return ueId && elId && ueId === elId;
                  })
                );

                // Apply to variant and original slide elements
                currentVariant.elements = variantElements;
                originalSlide.layouts[variantIndex] = currentVariant;

                // Compose original elements
                originalSlide.elements = [...variantElements, ...userElements];
              }
            } else {
              // No variants: replace top-level elements
              if (Array.isArray(updatedSlide.elements)) {
                originalSlide.elements = updatedSlide.elements;
              }
            }

            // Keep track of the active variant
            originalSlide.currentVariantIndex = variantIndex;

            updatedSlides[index] = originalSlide;
            onSetSlides(updatedSlides);
          }}
        />
      </Box>

      {/* Konva Stage - hidden but used for export */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          visibility: "hidden",
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        <Box
          sx={{
            pointerEvents: openPanel ? "none" : "auto",
            width: "100%",
            height: "100%",
          }}
        >
          <Stage
            width={getDynamicConstants().SLIDE_WIDTH}
            height={getDynamicConstants().SLIDE_HEIGHT}
            ref={(node) => {
              stageRefs.current[index] = node;
            }}
          >
            <Layer>
              {/* Background */}
              {bgImage && renderBgUrl ? (
                <KonvaImage
                  image={bgImage}
                  x={0}
                  y={0}
                  width={getDynamicConstants().SLIDE_WIDTH}
                  height={getDynamicConstants().SLIDE_HEIGHT}
                  name="background"
                  listening={false}
                />
              ) : slide.background?.type === "linear" && slide.background.gradient ? (
                <Rect
                  width={getDynamicConstants().SLIDE_WIDTH}
                  height={getDynamicConstants().SLIDE_HEIGHT}
                  fillLinearGradientStartPoint={{ x: 0, y: 0 }}
                  fillLinearGradientEndPoint={{
                    x: getDynamicConstants().SLIDE_WIDTH,
                    y: getDynamicConstants().SLIDE_HEIGHT,
                  }}
                  fillLinearGradientColorStops={
                    slide.background.gradient.stops || [
                      0,
                      slide.background.gradient.start,
                      1,
                      slide.background.gradient.end,
                    ]
                  }
                  cornerRadius={8}
                  name="background"
                  listening={false}
                />
              ) : (
                <Rect
                  width={getDynamicConstants().SLIDE_WIDTH}
                  height={getDynamicConstants().SLIDE_HEIGHT}
                  fill={slide.background?.color || selectedTheme?.backgroundColor || "#ffffff"}
                  cornerRadius={8}
                  name="background"
                  listening={false}
                />
              )}

              {/* Shapes */}
              <KonvaShapeRenderer
                elements={slide.elements || []}
                selectedShapeId={selectedShapeId}
                selectedShapeIndex={selectedShapeIndex}
                onSelectShape={(shapeIndex, shapeId, e) => {
                  onHandleSelect(
                    { id: shapeId!, type: "shape", index: shapeIndex! },
                    e.evt.ctrlKey
                  );
                  onSetSelectedShapeId(shapeId!);
                  onSetSelectedShapeIndex(shapeIndex!);
                  onSetSelectedTextId(null);
                  onSetSelectedImageIndex(null);
                  onSetSelectedImage(null);
                }}
              />

              {/* Title */}
              {title?.text && (
                <AnimatedKonvaText
                  key={`title-${index}`}
                  id={`title-${index}`}
                  text={title.text}
                  x={titleProps.x || 25}
                  y={titleProps.y || 40}
                  width={titleProps.width || 800}
                  fontSize={titleProps.fontSize || 36}
                  fontWeight={titleProps.fontWeight || "700"}
                  fontFamily={titleProps.fontFamily || "Raleway"}
                  opacity={titleProps.opacity || 1}
                  fill={
                    title.useThemeColor !== false
                      ? getContrastTextColor(selectedTheme?.backgroundColor || "#ffffff")
                      : titleProps.fill || "#000000"
                  }
                  align={titleProps.align || "center"}
                  isSelected={selectedElements.some((s) => s.id === `title-${index}`)}
                  onSelect={(e) => {
                    onHandleSelect({ id: `title-${index}`, type: "text", index: -1 }, e.evt.ctrlKey);
                    onSetSelectedTextId(`title-${index}`);
                    onSetSelectedImageIndex(null);
                    onSetSelectedImage(null);
                    onSetSelectedShapeIndex(null);
                  }}
                  enableTypewriter={false}
                  enableLayoutAnimation={false}
                />
              )}

              {/* Subtitle */}
              {slide.subtitle?.text && (
                <AnimatedKonvaText
                  key={`subtitle-${index}`}
                  id={`subtitle-${index}`}
                  text={slide.subtitle.text || ""}
                  x={slide.subtitle.properties?.x || 80}
                  y={slide.subtitle.properties?.y || 320}
                  width={slide.subtitle.properties?.width || 800}
                  height={slide.subtitle.properties?.height || 80}
                  fontSize={slide.subtitle.properties?.fontSize || 26}
                  fontWeight={slide.subtitle.properties?.fontWeight || "400"}
                  fontFamily={slide.subtitle.properties?.fontFamily || "Raleway"}
                  opacity={slide.subtitle.properties?.opacity ?? 1}
                  fill={
                    slide.subtitle.useThemeColor !== false
                      ? getContrastTextColor(selectedTheme?.backgroundColor || "#ffffff")
                      : slide.subtitle.properties?.fill || "#000000"
                  }
                  align={slide.subtitle.properties?.align || "center"}
                  lineHeight={slide.subtitle.properties?.lineHeight || 1.5}
                  isSelected={selectedElements.some((s) => s.id === `subtitle-${index}`)}
                  onSelect={(e) => {
                    onHandleSelect(
                      { id: `subtitle-${index}`, type: "text", index: -2 },
                      e.evt.ctrlKey
                    );
                    onSetSelectedTextId(`subtitle-${index}`);
                    onSetSelectedImageIndex(null);
                    onSetSelectedImage(null);
                    onSetSelectedShapeIndex(null);
                  }}
                  onChange={(newText) => {
                    const updatedSlides = [...slides];
                    const currentSlide = updatedSlides[selectedSlideIndex];
                    if (currentSlide?.subtitle) {
                      currentSlide.subtitle.text = newText;
                      // Also update current variant if exists
                      if (currentSlide.layouts?.[currentSlide.currentVariantIndex ?? 0]) {
                        const variant = currentSlide.layouts[currentSlide.currentVariantIndex ?? 0];
                        if (variant.subtitle) {
                          variant.subtitle.text = newText;
                        }
                      }
                      onSetSlides(updatedSlides);
                    }
                  }}
                  enableTypewriter={false}
                  enableLayoutAnimation={false}
                />
              )}

              {/* Text elements */}
              {slide.elements?.map((el: any, i: number) => {
                if (
                  el.element_type === "text" ||
                  el.element_type === "bullet_point" ||
                  el.element_type === "quote" ||
                  el.element_type === "author" ||
                  el.element_type === "context"
                ) {
                  return (
                    <AnimatedKonvaText
                      key={`${el.id || `el-${index}-${i}`}`}
                      id={el.id || `el-${index}-${i}`}
                      text={el.text || ""}
                      x={el.properties?.x || 0}
                      y={el.properties?.y || 0}
                      width={el.properties?.width || 300}
                      height={el.properties?.height || 100}
                      fontSize={el.properties?.fontSize || 16}
                      fontFamily={el.properties?.fontFamily || "Raleway"}
                      fontWeight={el.properties?.fontWeight || "400"}
                      opacity={el.properties?.opacity ?? 1}
                      fill={
                        el.useThemeColor !== false
                          ? getContrastTextColor(selectedTheme?.backgroundColor || "#ffffff")
                          : el.properties?.fill || "#000000"
                      }
                      align={el.properties?.align || "left"}
                      lineHeight={el.properties?.lineHeight || 1.4}
                      wrap="word"
                      isSelected={selectedElements.some((s) => s.id === (el.id || `el-${index}-${i}`))}
                      onSelect={(e) => {
                        const elementId = el.id || `el-${index}-${i}`;
                        onHandleSelect({ id: elementId, type: "text", index: i }, e.evt.ctrlKey);
                        onSetSelectedTextId(elementId);
                        onSetSelectedImageIndex(null);
                        onSetSelectedImage(null);
                        onSetSelectedShapeIndex(null);
                      }}
                      onChange={(newText) => {
                        const updatedSlides = [...slides];
                        const currentSlide = updatedSlides[selectedSlideIndex];
                        if (currentSlide?.elements?.[i]) {
                          currentSlide.elements[i].text = newText;
                          onSetSlides(updatedSlides);
                        }
                      }}
                      enableLayoutAnimation={false}
                    />
                  );
                }
                return null;
              })}

              {/* Images */}
              {slide.elements?.map((el: any, i: number) => {
                if (el.element_type === "image") {
                  const imageId = el.image_id || el.properties?.image_id || `img-${i}`;

                  return (
                    <SlideImage
                      key={`${el.id || `el-${index}-${i}`}`}
                      image_id={el.id || `el-${index}-${i}`}
                      imageSrc={el.properties?.imageSrc}
                      x={el.properties?.x || 0}
                      y={el.properties?.y || 0}
                      width={el.properties?.width || 200}
                      height={el.properties?.height || 200}
                      opacity={el.properties?.opacity ?? 1}
                      shadow={el.properties?.shadow}
                      zIndex={el.properties?.zIndex}
                      borderRadius={el.properties?.borderRadius || 0}
                      isSelected={selectedElements.some((s) => s.id === imageId)}
                      onSelect={(e) => {
                        onHandleSelect({ id: imageId, type: "image", index: i }, e.evt.ctrlKey);
                        onSetSelectedImageId(imageId);
                        onSetSelectedImageIndex(i);
                        onSetSelectedImage({
                          ...el,
                          image_id: imageId,
                          konva_component: el.konva_component || "Konva.Image",
                          element_type: "image",
                          properties: {
                            ...el.properties,
                            image_id: imageId,
                          },
                        });
                        onSetSelectedTextId(null);
                        onSetSelectedShapeIndex(null);
                        onSetSelectedShapeId(null);
                      }}
                    />
                  );
                }
                return null;
              })}
            </Layer>
          </Stage>
        </Box>
      </Box>
    </Box>
  );
};

const SlideEditor = ({ slides = [], stageRefs, onDeselect, openPanel, deselectAllRef }: any) => {
  const {
    selectedImageIndex,
    selectedShapeId,
    setSelectedShapeId,
    setSelectedImageIndex,
    setSelectedImage,
    selectedTextId,
    selectedImageId,
    setSelectedImageId,
    setSelectedTextId,
    selectedShapeIndex,
    setSelectedShapeIndex,
    setSlides,
    undo,
    redo,
    selectedSlideIndex,
    setSelectedSlideIndex,
    addSlide,
    deleteSlide,
  } = useSlides();

  const { setSelectedTheme, selectedTheme } = useSlideThemeContext();
  const [scale, setScale] = useState(1);
  const [selectedElements, setSelectedElements] = useState<SelectedElement[]>([]);

  const layoutsInitializedRef = useRef(false);
  const lastThemeRef = useRef<any>(null);

  // Snapshot generation - generate for all slides to show in carousel immediately
  useEffect(() => {
    if (slides.length === 0) return;

    // Wait a bit for stages to render, then generate snapshots
    const timer = setTimeout(() => {
      const generateAllSnapshots = async () => {
        // Generate snapshots for all slides
        for (let i = 0; i < slides.length; i++) {
          const slide = slides[i];
          const stage = stageRefs.current[i];

          if (!stage) {
            console.warn(`[SlideEditor] No stage ref for slide index ${i}`);
            continue;
          }

          try {
            const canvas = stage.toCanvas ? stage.toCanvas() : null;
            if (!canvas) {
              console.warn(`[SlideEditor] Failed to get canvas for slide ${slide.slide_id}`);
              continue;
            }

            await snapshotsCache.generateFromCanvas(slide.slide_id, canvas)
              .catch((err) => {
                console.warn(`[SlideEditor] generateFromCanvas failed for slide ${slide.slide_id}:`, err);
              });
          } catch (err) {
            console.error(`[SlideEditor] Error generating snapshot for slide ${slide.slide_id}:`, err);
          }

          // Small delay between slides to avoid blocking
          await new Promise(resolve => setTimeout(resolve, 50));
        }
      };

      generateAllSnapshots();
    }, 500); // Wait 500ms for stages to mount and render

    return () => clearTimeout(timer);
  }, [slides]);

  // Periodic snapshot regeneration for ALL slides while editing
  useEffect(() => {
    const lastSnapshotAt = { value: 0 } as { value: number };
    const MIN_SNAPSHOT_INTERVAL = 1500; // Regenerate every 1.5s while editing

    const updateAllSnapshots = async () => {
      if (typeof document !== "undefined" && document.visibilityState !== "visible") return;

      const now = Date.now();
      if (now - lastSnapshotAt.value < MIN_SNAPSHOT_INTERVAL) return;
      lastSnapshotAt.value = now;

      // Regenerate snapshots for ALL slides, not just the selected one
      // This ensures carousel shows updated variants even before selection
      for (let i = 0; i < slides.length; i++) {
        const slide = slides[i];
        const stage = stageRefs.current[i];

        if (!stage) continue;

        try {
          const canvas = stage.toCanvas ? stage.toCanvas() : null;
          if (!canvas) continue;

          await snapshotsCache.generateFromCanvas(slide.slide_id, canvas).catch((err) => {
            console.warn(`[SlideEditor] Snapshot regeneration failed for slide ${slide.slide_id}:`, err);
          });
        } catch (err) {
          console.error(`[SlideEditor] Error regenerating snapshot for slide ${i}:`, err);
        }

        // Small delay between slides to avoid blocking
        await new Promise(resolve => setTimeout(resolve, 30));
      }
    };

    const timer = setTimeout(updateAllSnapshots, 500);
    return () => clearTimeout(timer);
  }, [slides, selectedSlideIndex]);

  // Theme changes and variant generation
  useEffect(() => {
    if (!selectedTheme || slides.length === 0) return;

    const themeChanged =
      JSON.stringify(lastThemeRef.current) !== JSON.stringify(selectedTheme);

    const needsRegeneration =
      !layoutsInitializedRef.current ||
      (themeChanged && slides.some((slide: any) => slide.layouts && slide.layouts.length > 0));

    if (!needsRegeneration) {
      return;
    }

    const updatedSlides = slides.map((slide: any) => {
      if (slide.layouts && slide.layouts.length > 0 && !themeChanged) {
        return slide;
      }

      const newLayouts = generateSlideVariants(slide, selectedTheme);
      const currentVariantIndex = slide.currentVariantIndex ?? 0;

      return {
        ...slide,
        layouts: newLayouts,
        currentVariantIndex,
      };
    });

    setSlides(updatedSlides);
    layoutsInitializedRef.current = true;
    lastThemeRef.current = selectedTheme;

    // CRITICAL: Regenerate snapshots after variants are applied
    // This ensures carousel shows actual slides with variants applied
    setTimeout(() => {
      const regenerateSnapshots = async () => {
        for (let i = 0; i < updatedSlides.length; i++) {
          const slide = updatedSlides[i];
          const stage = stageRefs.current[i];

          if (!stage) continue;

          try {
            const canvas = stage.toCanvas ? stage.toCanvas() : null;
            if (!canvas) continue;

            await snapshotsCache.generateFromCanvas(slide.slide_id, canvas).catch((err) => {
              console.warn(`[SlideEditor] Snapshot regeneration after variant failed:`, err);
            });
          } catch (err) {
            console.error(`[SlideEditor] Error regenerating snapshot after variant:`, err);
          }

          await new Promise(resolve => setTimeout(resolve, 50));
        }
      };

      regenerateSnapshots();
    }, 100); // Small delay to let Stage render the variant
  }, [selectedTheme, slides]);

  useEffect(() => {
    const preservedThemeData = localStorage.getItem("slidesTheme");
    if (preservedThemeData) {
      setSelectedTheme(JSON.parse(preservedThemeData));
    }
  }, []);

  useEffect(() => {
    const updateScale = () => {
      setScale(window.innerWidth < 1366 ? 0.85 : 1);
    };
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  const deselectAll = () => {
    setSelectedElements([]);
    setSelectedTextId(null);
    setSelectedImageId(null);
    setSelectedShapeId(null);
    setSelectedImageIndex(null);
    setSelectedImage(null);
    setSelectedShapeIndex(null);
    if (onDeselect) onDeselect();
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const active = document.activeElement as HTMLElement | null;
      const isTyping =
        active?.tagName === "INPUT" ||
        active?.tagName === "TEXTAREA" ||
        active?.isContentEditable;

      if (e.ctrlKey && e.key.toLowerCase() === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
        return;
      }

      if (
        e.ctrlKey &&
        (e.key.toLowerCase() === "y" || (e.key.toLowerCase() === "z" && e.shiftKey))
      ) {
        e.preventDefault();
        redo();
        return;
      }

      if ((e.key === "Delete" || e.key === "Backspace") && !isTyping) {
        e.preventDefault();
        if (selectedElements.length === 0) return;

        const updatedSlides = structuredClone(slides);
        const currentSlide = updatedSlides[selectedSlideIndex];
        if (!currentSlide) return;

        if (selectedElements.some((el) => el.index === -1)) {
          currentSlide.slide_title.text = "";
        }

        const indexesToRemove = new Set(
          selectedElements.filter((el) => el.index >= 0).map((el) => el.index)
        );

        currentSlide.elements = currentSlide.elements.filter(
          (_: any, i: number) => !indexesToRemove.has(i)
        );

        setSlides(updatedSlides);
        setSelectedElements([]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [slides, selectedSlideIndex, selectedElements, setSlides, undo, redo]);

  const handleSelect = (el: SelectedElement, multi = false) => {
    if (multi) {
      setSelectedElements((prev) =>
        prev.find((p) => p.id === el.id)
          ? prev.filter((p) => p.id !== el.id)
          : [...prev, el]
      );
    } else {
      setSelectedElements([el]);
    }
  };

  return (
    <HorizontalSlidesCarousel
      slides={slides}
      selectedIndex={selectedSlideIndex}
      onSelectSlide={setSelectedSlideIndex}
      slideWidth={getDynamicConstants().SLIDE_WIDTH}
      slideHeight={getDynamicConstants().SLIDE_HEIGHT}
      onAddSlide={addSlide}
      onDeleteSlide={deleteSlide}
    >
      <Box
        sx={{
          position: "relative",
          width: getDynamicConstants().SLIDE_WIDTH,
          height: getDynamicConstants().SLIDE_HEIGHT,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        {slides.map((originalSlide: any, index: number) => (
          <SlideRenderer
            key={`${originalSlide.slide_id}-variant-${originalSlide.currentVariantIndex}`}
            slides={slides}
            selectedSlideIndex={selectedSlideIndex}
            stageRefs={stageRefs}
            selectedImageIndex={selectedImageIndex}
            selectedShapeId={selectedShapeId}
            selectedTextId={selectedTextId}
            selectedImageId={selectedImageId}
            selectedShapeIndex={selectedShapeIndex}
            selectedElements={selectedElements}
            selectedTheme={selectedTheme}
            scale={scale}
            openPanel={openPanel}
            onDeselect={onDeselect}
            onHandleSelect={handleSelect}
            onSetSelectedShapeId={setSelectedShapeId}
            onSetSelectedImageIndex={setSelectedImageIndex}
            onSetSelectedImage={setSelectedImage}
            onSetSelectedImageId={setSelectedImageId}
            onSetSelectedTextId={setSelectedTextId}
            onSetSelectedShapeIndex={setSelectedShapeIndex}
            onSetSlides={setSlides}
            index={index}
            originalSlide={originalSlide}
          />
        ))}
      </Box>
    </HorizontalSlidesCarousel>
  );
};

export default SlideEditor;
