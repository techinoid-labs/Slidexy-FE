import React, { useEffect, useState, useRef } from "react";
import { Stage, Layer, Rect, Image as KonvaImage } from "react-konva";
import useImage from "use-image";
import { Box } from "@mui/material";
import SlideImage from "./KonvaComponents/KonvaSlideImage";
import KonvaTextEditor from "./KonvaComponents/KonvaTextEditor";
import { useSlideThemeContext } from "@/app/context/ThemeContext";
import SlidePreviews from "./slidesPreview";
import KonvaShapeRenderer from "./KonvaComponents/KonvaShapesRenderer";
import { useSlides } from "../context/SlidesContext";
import { getSlideDimensions } from "../../utils/slideUtils";
import { generateSlideVariants } from "../../utils/variantGenerator";

type SelectedElement = {
  id: string;
  type: "text" | "image" | "shape";
  index: number;
};

// deepEqual kept for slides comparison (optional now, but harmless)
const deepEqual = (a: any, b: any): boolean => {
  if (a === b) return true;
  if (a == null || b == null) return a === b;
  if (typeof a !== typeof b) return false;
  if (typeof a !== 'object') return a === b;

  if (Array.isArray(a) !== Array.isArray(b)) return false;
  if (Array.isArray(a)) {
    if (a.length !== b.length) return false;
    return a.every((val, idx) => deepEqual(val, b[idx]));
  }

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  return keysA.every(key => deepEqual(a[key], b[key]));
};

const getDynamicConstants = () => {
  const { SLIDE_WIDTH, SLIDE_HEIGHT, LEFT_PADDING } = getSlideDimensions();
  return { SLIDE_WIDTH, SLIDE_HEIGHT, LEFT_PADDING };
};

const SlideEditor = ({ slides = [], stageRefs, onDeselect }: any) => {
  const {
    selectedImageIndex,
    selectedShapeId,
    setSelectedShapeId,
    setSelectedImageIndex,  // ✅ Ensure this is destructured
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
    selectedSlideIndex,  // ✅ NEW: Use context for current slide
    setSelectedSlideIndex,  // ✅ NEW: Use context setter
  } = useSlides();

  const { setSelectedTheme, selectedTheme } = useSlideThemeContext();
  // ✅ REMOVED: Local selectedIndex - use context selectedSlideIndex instead
  const [scale, setScale] = useState(1);
  const [selectedElements, setSelectedElements] = useState<SelectedElement[]>([]);

  // ✅ SIMPLIFIED: Only regenerate when theme changes, preserve ALL slide data
  useEffect(() => {
    if (!selectedTheme || slides.length === 0) return;

    console.log('[SlideEditor] Regenerating variants for theme change:', selectedTheme.backgroundColor);

    const updatedSlides = slides.map((slide: any) => {
      const newLayouts = generateSlideVariants(slide, selectedTheme);
      const currentVariantIndex = slide.currentVariantIndex ?? 0;

      return {
        ...slide,
        layouts: newLayouts,
        currentVariantIndex,
      };
    });


    // Only update if changed
    const slidesChanged = !deepEqual(slides, updatedSlides);
    if (slidesChanged) {
      console.log('[SlideEditor] Updating slides with new layouts');
      setSlides(updatedSlides);
    }
  }, [selectedTheme]); // ✅ ONLY selectedTheme - no slides dependency!
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

      if (e.ctrlKey && (e.key.toLowerCase() === "y" || (e.key.toLowerCase() === "z" && e.shiftKey))) {
        e.preventDefault();
        redo();
        return;
      }

      if ((e.key === "Delete" || e.key === "Backspace") && !isTyping) {
        e.preventDefault();
        if (selectedElements.length === 0) return;

        const updatedSlides = structuredClone(slides);
        const currentSlide = updatedSlides[selectedSlideIndex];  // ✅ Use context selectedSlideIndex
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
  }, [slides, selectedSlideIndex, selectedElements, setSlides, undo, redo]);  // ✅ Use selectedSlideIndex

  const handleSelect = (el: SelectedElement, multi = false) => {
    if (multi) {
      setSelectedElements((prev) =>
        prev.find((p) => p.id === el.id) ? prev.filter((p) => p.id !== el.id) : [...prev, el]
      );
    } else {
      setSelectedElements([el]);
    }
  };

  const getCurrentVariantSlide = (slide: any) => {
    if (!slide.layouts || slide.layouts.length === 0) {
      console.log('[SlideEditor] No layouts found, returning original slide');
      return slide;
    }

    const variantIndex = slide.currentVariantIndex ?? 0;
    console.log('[SlideEditor] Getting variant', variantIndex, 'from', slide.layouts.length, 'layouts');
    console.log('[SlideEditor] Slide currentVariantIndex:', slide.currentVariantIndex);

    const variant = slide.layouts[variantIndex];
    if (!variant) {
      console.warn('[SlideEditor] Variant', variantIndex, 'not found! Falling back to slide');
      return slide;
    }

    console.log('[SlideEditor] Rendering variant', variantIndex, 'background:', variant.background);
    return variant;
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", overflow: "auto" }}>
      {slides.map((originalSlide: any, index: number) => {
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

        return (
          <Box
            key={originalSlide.slide_id}
            sx={{
              border: "1px solid #939393ff",
              backgroundColor: "#fff",
              position: "relative",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              mb: { md: 1 },
              display: index === selectedSlideIndex ? "block" : "none",  // ✅ Use context selectedSlideIndex
              transform: `scale(${scale})`,
            }}
          >
            <Stage
              width={getDynamicConstants().SLIDE_WIDTH}
              height={getDynamicConstants().SLIDE_HEIGHT}
              ref={(ref: any) => {
                stageRefs.current[index] = ref?.getStage()?.content?.querySelector("canvas") || null;
              }}
              onMouseDown={(e) => {
                const clickedOnEmpty = e.target === e.target.getStage() || e.target.name() === "background";
                if (clickedOnEmpty) deselectAll();
              }}
            >
              <Layer>
                {bgImage && renderBgUrl ? (
                  <KonvaImage
                    image={bgImage}
                    x={0}
                    y={0}
                    width={getDynamicConstants().SLIDE_WIDTH}
                    height={getDynamicConstants().SLIDE_HEIGHT}
                    name="background"
                  />
                ) : slide.background?.type === "linear" && slide.background.gradient ? (
                  <Rect
                    width={getDynamicConstants().SLIDE_WIDTH}
                    height={getDynamicConstants().SLIDE_HEIGHT}
                    fillLinearGradientStartPoint={{ x: 0, y: 0 }}
                    fillLinearGradientEndPoint={{ x: getDynamicConstants().SLIDE_WIDTH, y: getDynamicConstants().SLIDE_HEIGHT }}
                    fillLinearGradientColorStops={slide.background.gradient.stops || [0, slide.background.gradient.start, 1, slide.background.gradient.end]}
                    cornerRadius={8}
                    name="background"
                  />
                ) : (
                  <Rect
                    width={getDynamicConstants().SLIDE_WIDTH}
                    height={getDynamicConstants().SLIDE_HEIGHT}
                    fill={slide.background?.color || selectedTheme?.backgroundColor || "#ffffff"}
                    cornerRadius={8}
                    name="background"
                  />
                )}

                <KonvaShapeRenderer
                  elements={slide.elements || []}
                  selectedShapeId={selectedShapeId}
                  selectedShapeIndex={selectedShapeIndex}
                  onSelectShape={(shapeIndex, shapeId, e) => {
                    handleSelect({ id: shapeId!, type: "shape", index: shapeIndex! }, e.evt.ctrlKey);
                    setSelectedShapeId(shapeId!);
                    setSelectedShapeIndex(shapeIndex!);
                    // ✅ NEW: Clear other selections for mutual exclusivity
                    setSelectedTextId(null);
                    setSelectedImageIndex(null);
                    setSelectedImage(null);
                  }}
                />

                {title?.text && (
                  <KonvaTextEditor
                    key={`title-${index}`}
                    id={`title-${index}`}
                    text={title.text}
                    x={titleProps.x || 25}
                    y={titleProps.y || 40}
                    width={titleProps.width || 800}
                    fontSize={titleProps.fontSize || 36}
                    fontWeight={titleProps.fontWeight || "700"}
                    fontFamily={titleProps.fontFamily || "Raleway"}
                    fill={titleProps.fill || "#000"}
                    align={titleProps.align || "center"}
                    isSelected={selectedElements.some((s) => s.id === `title-${index}`)}
                    onSelect={(e) => {
                      handleSelect({ id: `title-${index}`, type: "text", index: -1 }, e.evt.ctrlKey);
                      setSelectedTextId(`title-${index}`);
                      // ✅ NEW: Clear other selections for mutual exclusivity
                      setSelectedImageIndex(null);
                      setSelectedImage(null);
                      setSelectedShapeIndex(null);
                    }}
                  />
                )}

                {slide.subtitle?.text && (
                  <KonvaTextEditor
                    key={`subtitle-${index}`}
                    id={`subtitle-${index}`}
                    text={slide.subtitle.text}
                    x={slide.subtitle.properties?.x || 80}
                    y={slide.subtitle.properties?.y || 320}
                    width={slide.subtitle.properties?.width || 800}
                    height={slide.subtitle.properties?.height || 80}
                    fontSize={slide.subtitle.properties?.fontSize || 26}
                    fontWeight={slide.subtitle.properties?.fontWeight || "400"}
                    fontFamily={slide.subtitle.properties?.fontFamily || "Raleway, sans-serif"}
                    fill={slide.subtitle.properties?.fill || "#000000"}
                    align={slide.subtitle.properties?.align || "center"}
                    lineHeight={slide.subtitle.properties?.lineHeight || 1.5}
                    isSelected={selectedElements.some((s) => s.id === `subtitle-${index}`)}
                    onSelect={(e) => {
                      handleSelect({ id: `subtitle-${index}`, type: "text", index: -2 }, e.evt.ctrlKey);
                      setSelectedTextId(`subtitle-${index}`);
                      // NEW: Clear other selections for mutual exclusivity
                      setSelectedImageIndex(null);
                      setSelectedImage(null);
                      setSelectedShapeIndex(null);
                    }}
                  />
                )}

                {slide.elements?.map((el: any, i: number) => {
                  if (el.element_type !== "text" && el.element_type !== "bullet_point") return null;
                  return (
                    <KonvaTextEditor
                      key={`el-${index}-${i}`}
                      id={`el-${index}-${i}`}
                      text={el.text}
                      x={el.properties?.x || 0}
                      y={el.properties?.y || 0}
                      width={el.properties?.width || 300}
                      fontSize={el.properties?.fontSize || 16}
                      fontFamily={el.properties?.fontFamily || "Raleway"}
                      fill={el.properties?.fill || "#000"}
                      align={el.properties?.align || "left"}
                      isSelected={selectedElements.some((s) => s.id === `el-${index}-${i}`)}
                      onSelect={(e) => {
                        handleSelect({ id: `el-${index}-${i}`, type: "text", index: i }, e.evt.ctrlKey);
                        setSelectedTextId(`el-${index}-${i}`);
                        // NEW: Clear other selections for mutual exclusivity
                        setSelectedImageIndex(null);
                        setSelectedImage(null);
                        setSelectedShapeIndex(null);
                      }}
                    />
                  );
                })}
                {slide.elements?.map((el: any, i: number) => {
                  if (el.element_type === "image") {
                    // ✅ CRITICAL: Use proper ID from element or properties
                    const imageId = el.image_id || el.properties?.image_id || `img-${i}`;

                    return (
                      <SlideImage
                        key={`image-${index}-${i}-${imageId}`} // ✅ Unique key
                        image_id={imageId}
                        imageSrc={el.properties?.imageSrc}
                        x={el.properties?.x || 0}
                        y={el.properties?.y || 0}
                        width={el.properties?.width || 200}
                        height={el.properties?.height || 200}
                        borderRadius={el.properties?.cornerRadius || 0}
                        isSelected={selectedElements.some((s) => s.id === imageId)}
                        onSelect={(e) => {
                          console.log('[SlideEditor] Image clicked:', imageId, 'at index', i);

                          handleSelect(
                            { id: imageId, type: "image", index: i },
                            e.evt.ctrlKey
                          );

                          // ✅ CRITICAL: Set all image selection states
                          setSelectedImageId(imageId);
                          setSelectedImageIndex(i);
                          setSelectedImage({
                            ...el,
                            image_id: imageId, // ✅ Ensure ID is at top level
                            konva_component: el.konva_component || "Konva.Image",
                            element_type: "image",
                            properties: {
                              ...el.properties,
                              image_id: imageId, // ✅ And in properties
                            },
                          });

                          // ✅ Clear other selections for mutual exclusivity
                          setSelectedTextId(null);
                          setSelectedShapeIndex(null);
                          setSelectedShapeId(null);

                          console.log('[SlideEditor] Image selection state updated');
                        }}
                      />
                    );
                  }
                  return null;
                })}
              </Layer>
            </Stage>
          </Box>
        );
      })}
      <SlidePreviews
        slides={slides}
        scale={scale}
        selectedIndex={selectedSlideIndex}  // ✅ Pass context selectedSlideIndex
        slide_width={getDynamicConstants().SLIDE_WIDTH}
        slide_height={getDynamicConstants().SLIDE_HEIGHT}
        onSelect={setSelectedSlideIndex}  // ✅ Use context setter
        onAddSlide={() => { }}
        onDeleteSlide={() => { }}
      />
    </Box>
  );
};

export default SlideEditor;