import React, { useEffect, useState, useRef, memo } from "react";
import { Box } from "@mui/material";
import { useSlideThemeContext } from "@/app/context/ThemeContext";
import HorizontalSlidesCarousel from "@/app/components/editor/HorizontalSlidesCarousel";
import { useSlides } from "../context/SlidesContext";
import { getSlideDimensions } from "../../utils/slideUtils";
import { generateSlideVariants } from "../../utils/variantGenerator";
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
  onSetSelectedTextIndex: (index: number | null) => void;
  onSetSelectedShapeIndex: (index: number | null) => void;
  onSetSlides: (slides: any[]) => void;
}

/**
 * Renders a single slide as editable HTML.
 */
const SlideRenderer: React.FC<SlideRendererProps & { index: number; originalSlide: any }> = ({
  slides,
  selectedSlideIndex,
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
  onSetSelectedTextIndex,
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
        onSetSelectedTextIndex(elementIndex ?? null);
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
        border: "1px solid rgba(255,255,255,0.08)",
        backgroundColor: "#fff",
        position: "absolute",
        boxShadow: "0 8px 48px rgba(0,0,0,0.7), 0 2px 12px rgba(0,0,0,0.4)",
        transform: `scale(${scale})`,
        left: 0,
        width: getDynamicConstants().SLIDE_WIDTH,
        height: getDynamicConstants().SLIDE_HEIGHT,
      }}
    >
      {/* HTML Overlay — primary visible renderer for editing */}
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
          selectedElementId={selectedTextId}
          onElementClick={handleElementClickFromHTML}
          onSlideUpdate={(updatedSlide) => {
            // Merge updates from HTML renderer into the original slide/variant
            // Don't replace the whole slide object (that would wipe `layouts` etc.)
            const updatedSlides = structuredClone(slides);
            const originalSlide = updatedSlides[index];
            if (!originalSlide) return;

            // Block-template slides carry their whole content in `blockSpec`.
            // They have no layout variants and no loose `elements`, so the
            // variant mapping below does not apply to them.
            if (updatedSlide.blockSpec) {
              originalSlide.blockSpec = updatedSlide.blockSpec;
              if (updatedSlide.slide_title) {
                originalSlide.slide_title = updatedSlide.slide_title;
              }
              updatedSlides[index] = originalSlide;
              onSetSlides(updatedSlides);
              return;
            }

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

              // Title and subtitle must be written into the variant too.
              // HTMLSlideRenderer reads `variant.slide_title` in preference to
              // `slide.slide_title`, so writing only the slide-level copy meant
              // every title/subtitle edit was silently discarded on the next
              // re-render (switching slides, changing theme, undo).
              if (updatedSlide.slide_title) {
                currentVariant.slide_title = updatedSlide.slide_title;
              }
              if (updatedSlide.subtitle) {
                currentVariant.subtitle = updatedSlide.subtitle;
              }
              if (typeof updatedSlide.image_url !== "undefined") {
                currentVariant.image_url = updatedSlide.image_url;
              }
              if (updatedSlide.background) {
                currentVariant.background = updatedSlide.background;
              }
              originalSlide.layouts[variantIndex] = currentVariant;

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
    </Box>
  );
};

const SlideEditor = ({ slides = [], onDeselect, openPanel, deselectAllRef, scale: scaleProp }: any) => {
  const {
    selectedImageIndex,
    selectedShapeId,
    setSelectedShapeId,
    setSelectedImageIndex,
    setSelectedImage,
    selectedTextId,
    selectedTextIndex,
    selectedImageId,
    setSelectedImageId,
    setSelectedTextId,
    setSelectedTextIndex,
    selectedShapeIndex,
    setSelectedShapeIndex,
    setSlides,
    undo,
    redo,
    selectedSlideIndex,
    setSelectedSlideIndex,
    addSlide,
    deleteSlide,
    duplicateSlide,
    reorderSlides,
  } = useSlides();

  const { setSelectedTheme, selectedTheme } = useSlideThemeContext();
  const scale = scaleProp ?? 1;
  const [selectedElements, setSelectedElements] = useState<SelectedElement[]>([]);
  const activeSlide = slides[selectedSlideIndex];

  const lastThemeRef = useRef<any>(null);

  // Keep a live reference to slides so the variant effect can read them
  // WITHOUT re-running on every edit (it calls setSlides, which would loop).
  const slidesRef = useRef(slides);
  slidesRef.current = slides;

  // Theme changes and variant generation.
  // Runs when the theme changes or when slides are added/removed — never on
  // a plain content edit.
  useEffect(() => {
    const current = slidesRef.current;
    if (!selectedTheme || current.length === 0) return;

    const themeChanged =
      JSON.stringify(lastThemeRef.current) !== JSON.stringify(selectedTheme);

    // Any slide missing layouts always needs generating (covers newly added slides,
    // which the previous `layoutsInitialized` flag silently skipped).
    const hasSlideWithoutLayouts = current.some(
      (slide: any) => !slide.blockSpec && (!slide.layouts || slide.layouts.length === 0)
    );

    if (!themeChanged && !hasSlideWithoutLayouts) return;

    const updatedSlides = current.map((slide: any) => {
      // Block slides are themed by `templateThemeId`, not by the palette
      // variant generator — leave them exactly as they are.
      if (slide.blockSpec) return slide;
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

    lastThemeRef.current = selectedTheme;
    setSlides(updatedSlides);
  }, [selectedTheme, slides.length]);

  useEffect(() => {
    const preservedThemeData = localStorage.getItem("slidesTheme");
    if (preservedThemeData) {
      setSelectedTheme(JSON.parse(preservedThemeData));
    }
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
      onDuplicateSlide={duplicateSlide}
      onReorderSlide={reorderSlides}
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
        {/* Only the active slide is mounted. Previously every slide in the deck
            was rendered at once (parked off-screen) so the Konva snapshot loop
            could reach them; that loop is gone, so there is nothing to keep
            alive. Export mounts its own copies on demand — see exportSlides.ts. */}
        {activeSlide && (
          <SlideRenderer
            key={activeSlide.slide_id}
            slides={slides}
            selectedSlideIndex={selectedSlideIndex}
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
            onSetSelectedTextIndex={setSelectedTextIndex}
            onSetSelectedShapeIndex={setSelectedShapeIndex}
            onSetSlides={setSlides}
            index={selectedSlideIndex}
            originalSlide={activeSlide}
          />
        )}
      </Box>
    </HorizontalSlidesCarousel>
  );
};

export default SlideEditor;
