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
  const getCurrentVariantSlide = (slide: any) => {
    if (!slide.layouts || slide.layouts.length === 0) return slide;

    const variantIndex = slide.currentVariantIndex ?? 0;
    const variant = slide.layouts[variantIndex];

    if (!variant) return slide;

    const variantElements = variant.elements || [];
    const originalElements = slide.elements || [];
    const userShapes = originalElements.filter(
      (el: any) => el.element_type === "shape" && el.shape_id
    );

    return {
      ...variant,
      elements: [...variantElements, ...userShapes],
    };
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

  return (
    <Box
      key={originalSlide.slide_id}
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
              <KonvaTextEditor
                key={`subtitle-${index}`}
                id={`subtitle-${index}`}
                text={slide.subtitle.text}
                x={slide.subtitle.properties?.x || 80}
                y={slide.subtitle.properties?.y || 320}
                width={slide.subtitle.properties?.width || 800}
                height={slide.subtitle.properties?.height || 80}
                opacity={slide.subtitle.properties?.opacity ?? 1}
                fontSize={slide.subtitle.properties?.fontSize || 26}
                fontWeight={slide.subtitle.properties?.fontWeight || "400"}
                fontFamily={slide.subtitle.properties?.fontFamily || "Raleway, sans-serif"}
                fill={
                  slide.subtitle?.useThemeColor !== false
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
  );
};

const SlideEditor = ({ slides = [], stageRefs, onDeselect, openPanel }: any) => {
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
  } = useSlides();

  const { setSelectedTheme, selectedTheme } = useSlideThemeContext();
  const [scale, setScale] = useState(1);
  const [selectedElements, setSelectedElements] = useState<SelectedElement[]>([]);

  const layoutsInitializedRef = useRef(false);
  const lastThemeRef = useRef<any>(null);

  // Snapshot generation - generate for all slides to show in carousel immediately
  useEffect(() => {
    if (slides.length === 0) return;

    // Wait a bit for stages to render, then generate snapshots for mounted stages only.
    // Important: limit work to mounted stages and slides without an existing snapshot to
    // avoid overwhelming the main thread and creating too many Konva instances.
    let cancelled = false;
    const timer = setTimeout(() => {
      const generateAllSnapshots = async () => {
        for (let i = 0; i < slides.length; i++) {
          if (cancelled) return;
          const slide = slides[i];
          // If we already have a cached snapshot, skip to reduce work
          try {
            const existing = snapshotsCache.getSnapshot(slide.slide_id);
            if (existing) continue;
          } catch (e) {
            // ignore and proceed
          }

          const stage = stageRefs.current[i];
          if (!stage) {
            // stage not mounted (we render only a small window of stages) - skip
            continue;
          }

          try {
            const canvas = stage.toCanvas ? stage.toCanvas() : null;
            if (!canvas) continue;

            // Prefer scheduling snapshot work during idle periods when available
            const run = async () => {
              try {
                await snapshotsCache.generateFromCanvas(slide.slide_id, canvas);
              } catch (err) {
                console.warn(`[SlideEditor] generateFromCanvas failed for slide ${slide.slide_id}:`, err);
              }
            };

            if (typeof (window as any).requestIdleCallback === "function") {
              (window as any).requestIdleCallback(() => {
                void run();
              }, { timeout: 2000 });
            } else {
              // small delay to avoid blocking on fast loops
              await new Promise((res) => setTimeout(res, 150));
              await run();
            }
          } catch (err) {
            console.error(`[SlideEditor] Error generating snapshot for slide ${slide.slide_id}:`, err);
          }
        }
      };

      void generateAllSnapshots();
    }, 500); // Wait for stages to mount and render

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [slides]);

  // Periodic snapshot regeneration for ALL slides while editing
  useEffect(() => {
    // Only regenerate snapshot occasionally for the selected slide (or small window) to
    // avoid continuous heavy work. This reduces CPU and memory spikes while editing.
    const lastSnapshotAt = { value: 0 } as { value: number };
    const MIN_SNAPSHOT_INTERVAL = 1500; // Regenerate every 1.5s while editing
    let cancelled = false;

    const updateSnapshots = async () => {
      if (typeof document !== "undefined" && document.visibilityState !== "visible") return;

      const now = Date.now();
      if (now - lastSnapshotAt.value < MIN_SNAPSHOT_INTERVAL) return;
      lastSnapshotAt.value = now;

      // Prefer regenerating only for the selected slide and its immediate neighbors
      const window = 1;
      const start = Math.max(0, selectedSlideIndex - window);
      const end = Math.min(slides.length - 1, selectedSlideIndex + window);

      for (let i = start; i <= end; i++) {
        if (cancelled) return;
        const slide = slides[i];
        const stage = stageRefs.current[i];
        if (!stage) continue;

        try {
          const canvas = stage.toCanvas ? stage.toCanvas() : null;
          if (!canvas) continue;

          // schedule during idle if available
          const run = async () => {
            try {
              await snapshotsCache.generateFromCanvas(slide.slide_id, canvas);
            } catch (err) {
              console.warn(`[SlideEditor] Snapshot regeneration failed for slide ${slide.slide_id}:`, err);
            }
          };

          if (typeof (window as any).requestIdleCallback === "function") {
            (window as any).requestIdleCallback(() => {
              void run();
            }, { timeout: 2000 });
          } else {
            await run();
          }
        } catch (err) {
          console.error(`[SlideEditor] Error regenerating snapshot for slide ${i}:`, err);
        }

        // Small delay between slides to avoid blocking
        // (only triggered for up to 3 slides because of window)
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
    };

    const timer = setTimeout(updateSnapshots, 500);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
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

    // Regenerate snapshot for the selected slide only (less work, avoids spike)
    setTimeout(() => {
      const regenerateSnapshots = async () => {
        const i = selectedSlideIndex || 0;
        const slide = updatedSlides[i];
        const stage = stageRefs.current[i];
        if (!slide || !stage) return;
        try {
          const canvas = stage.toCanvas ? stage.toCanvas() : null;
          if (!canvas) return;
          if (typeof (window as any).requestIdleCallback === "function") {
            (window as any).requestIdleCallback(() => {
              void snapshotsCache.generateFromCanvas(slide.slide_id, canvas).catch((err) => {
                console.warn(`[SlideEditor] Snapshot regeneration after variant failed:`, err);
              });
            }, { timeout: 2000 });
          } else {
            await snapshotsCache.generateFromCanvas(slide.slide_id, canvas).catch((err) => {
              console.warn(`[SlideEditor] Snapshot regeneration after variant failed:`, err);
            });
          }
        } catch (err) {
          console.error(`[SlideEditor] Error regenerating snapshot after variant:`, err);
        }
      };

      void regenerateSnapshots();
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
        {(() => {
          // Only mount Konva stages for a small window around the selected slide to
          // avoid creating too many heavy Konva instances which causes CPU/memory spikes.
          const RENDER_WINDOW = 1; // render selected +/- 1
          return slides.map((originalSlide: any, index: number) => {
            if (Math.abs(index - selectedSlideIndex) <= RENDER_WINDOW) {
              return (
                <SlideRenderer
                  key={originalSlide.slide_id}
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
              );
            }

            // Placeholder box for non-mounted slides to preserve layout without the heavy Stage
            return (
              <Box
                key={originalSlide.slide_id}
                sx={{
                  width: getDynamicConstants().SLIDE_WIDTH,
                  height: getDynamicConstants().SLIDE_HEIGHT,
                }}
              />
            );
          });
        })()}
      </Box>
    </HorizontalSlidesCarousel>
  );
};

export default SlideEditor;
