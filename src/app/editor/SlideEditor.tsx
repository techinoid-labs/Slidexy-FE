// SlideEditor component
import React, { useEffect, useState, useRef } from "react";
import { Stage, Layer, Rect, Image as KonvaImage, Group, Circle, Ellipse } from "react-konva";
import useImage from "use-image";
import { Box } from "@mui/material";
import SlideImage from "./KonvaComponents/KonvaSlideImage";
import KonvaTextEditor from "./KonvaComponents/KonvaTextEditor";
import { useSlideThemeContext } from "@/app/context/ThemeContext";
import SlidePreviews from "./slidesPreview";
import KonvaShapeRenderer from "./KonvaComponents/KonvaShapesRenderer";
import { useSlides } from "../context/SlidesContext";
import { getRandomSlide, getSlideDimensions } from "../../utils/slideUtils";
import { applyTemplate, Theme } from "@/utils/slideTemplates";
import { v4 as uuidv4 } from "uuid";

type SelectedElement = {
  id: string;
  type: "text" | "image" | "shape";
  index: number;
};

const getDynamicConstants = () => {
  const { SLIDE_WIDTH, SLIDE_HEIGHT, LEFT_PADDING } = getSlideDimensions();
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
    textMaxWidth,
    textMaxHeight,
  };
};

const SlideEditor = ({ slides = [], stageRefs }: any) => {
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
  } = useSlides();

  const { setSelectedTheme, selectedTheme, selectedLayout } = useSlideThemeContext();
  const [bgImage] = useImage(selectedTheme?.image_url || "");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scale, setScale] = useState(1);
  const [selectedElements, setSelectedElements] = useState<SelectedElement[]>([]);

  const lastKeyRef = useRef<string | null>(null);
  const lastLengthRef = useRef(0);

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
    setSelectedTextId(null);
    setSelectedImageId(null);
    setSelectedShapeId(null);

    if (selectedElements.length === 1) {
      const el = selectedElements[0];
      if (el.type === "text") setSelectedTextId(el.id);
      if (el.type === "image") setSelectedImageId(el.id);
      if (el.type === "shape") setSelectedShapeId(el.id);
    }
  }, [selectedElements]);

  useEffect(() => {
    const preservedThemeData = localStorage.getItem("slidesTheme");
    if (preservedThemeData) {
      setSelectedTheme(JSON.parse(preservedThemeData));
    }
  }, []);

  // Apply templates initial and on theme/layout change
  useEffect(() => {
    if (slides.length === 0) return;

    const currentKeyStr = JSON.stringify({ theme: selectedTheme, layout: selectedLayout });
    const needsReapply = lastKeyRef.current !== currentKeyStr || lastLengthRef.current < slides.length;

    if (needsReapply) {
      console.log("[SlideEditor] Applying/reapplying templates", needsReapply ? "due to change or initial/add" : "no");

      const { SLIDE_WIDTH, SLIDE_HEIGHT } = getDynamicConstants();

      const templatedSlides = slides.map((slide: any, index: number) => {
        console.log(`[SlideEditor] Applying template to slide ${index}:`, slide);

        // Remove art_palette override, always use theme
        const slideWithPal = { ...slide };

        const templated = applyTemplate(
          slideWithPal,
          slide.layout_type || "content-right-image",
          slide.image_url || "",
          index,
          slides.length,
          SLIDE_WIDTH,
          SLIDE_HEIGHT,
          selectedTheme
        );

        // Ensure all IDs are preserved/assigned
        const processedSlide = {
          ...templated,
          slide_id: slide.slide_id || templated.slide_id,
          elements: templated.elements.map((el: any) => {
            if (el.element_type === "image" && !el.properties?.image_id) {
              el.properties = { ...el.properties, image_id: uuidv4() };
            }
            if (el.element_type === "shape" && !el.shape_id) {
              el.shape_id = uuidv4();
            }
            return el;
          })
        };

        console.log(`[SlideEditor] Processed slide ${index}:`, processedSlide);
        return processedSlide;
      });

      console.log("[SlideEditor] All templated slides:", templatedSlides);
      setSlides(templatedSlides);
      lastKeyRef.current = currentKeyStr;
      lastLengthRef.current = slides.length;
    }
  }, [selectedTheme, selectedLayout, slides.length]);

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

      if (
        e.ctrlKey &&
        (e.key.toLowerCase() === "y" ||
          (e.key.toLowerCase() === "z" && e.shiftKey))
      ) {
        e.preventDefault();
        redo();
        return;
      }

      if (e.ctrlKey && e.key.toLowerCase() === "a") {
        e.preventDefault();
        const currentSlide = slides[selectedIndex];
        if (!currentSlide) return;

        const all: SelectedElement[] = [];

        if (currentSlide.slide_title?.text) {
          all.push({
            id: `title-${selectedIndex}`,
            type: "text",
            index: -1,
          });
        }

        currentSlide.elements.forEach((el: any, i: number) => {
          if (el.element_type === "image") {
            all.push({ id: el.properties.image_id, type: "image", index: i });
          } else if (el.element_type === "shape") {
            all.push({ id: el.shape_id, type: "shape", index: i });
          } else {
            all.push({ id: `el-${selectedIndex}-${i}`, type: "text", index: i });
          }
        });

        setSelectedElements(all);
        return;
      }

      if ((e.key === "Delete" || e.key === "Backspace") && !isTyping) {
        e.preventDefault();
        if (selectedElements.length === 0) return;

        const updatedSlides = structuredClone(slides);
        const currentSlide = updatedSlides[selectedIndex];
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
  }, [slides, selectedIndex, selectedElements, setSlides, undo, redo]);

  const handleSelect = (el: SelectedElement, multi = false) => {
    if (multi) {
      setSelectedElements((prev) =>
        prev.find((p) => p.id === el.id) ? prev.filter((p) => p.id !== el.id) : [...prev, el]
      );
    } else {
      setSelectedElements([el]);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        overflow: "auto",
        borderRadius: 10,
      }}
    >
      {slides.map((slide: any, index: number) => {
        console.log("[SlideEditor] Rendering slide", index, slide);
        const title = slide.slide_title;
        const titleProps = title?.properties || {};

        return (
          <Box
            key={slide.slide_id}
            sx={{
              borderRadius: 4,
              border: "1px solid #939393ff",
              backgroundColor: "#fff",
              position: "relative",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              mb: { md: 1 },
              display: index === selectedIndex ? "block" : "none",
              transform: `scale(${scale})`,
            }}
          >
            <Stage
              width={getDynamicConstants().SLIDE_WIDTH}
              height={getDynamicConstants().SLIDE_HEIGHT}
              ref={(ref: any) => {
                stageRefs.current[index] =
                  ref?.getStage()?.content?.querySelector("canvas") || null;
              }}
              onMouseDown={(e) => {
                const clickedOnEmpty =
                  e.target === e.target.getStage() ||
                  e.target.name() === "background";
                if (clickedOnEmpty) {
                  deselectAll();
                }
              }}
              onTouchStart={(e) => {
                const clickedOnEmpty =
                  e.target === e.target.getStage() ||
                  e.target.name() === "background";
                if (clickedOnEmpty) {
                  deselectAll();
                }
              }}
            >
              <Layer
                clipFunc={(ctx) => {
                  ctx.beginPath();
                  const radius = 50;
                  const width = getDynamicConstants().SLIDE_WIDTH;
                  const height = getDynamicConstants().SLIDE_HEIGHT;

                  ctx.moveTo(radius, 0);
                  ctx.lineTo(width - radius, 0);
                  ctx.quadraticCurveTo(width, 0, width, radius);
                  ctx.lineTo(width, height - radius);
                  ctx.quadraticCurveTo(width, height, width - radius, height);
                  ctx.lineTo(radius, height);
                  ctx.quadraticCurveTo(0, height, 0, height - radius);
                  ctx.lineTo(0, radius);
                  ctx.quadraticCurveTo(0, 0, radius, 0);
                  ctx.closePath();
                }}
              >
                {selectedTheme?.image_url && bgImage && (
                  <KonvaImage
                    image={bgImage}
                    x={0}
                    y={0}
                    width={getDynamicConstants().SLIDE_WIDTH}
                    height={getDynamicConstants().SLIDE_HEIGHT}
                    name="background"
                  />
                )}
                {/* Render shapes from template */}
                <KonvaShapeRenderer
                  elements={slide.elements}
                  selectedShapeId={selectedShapeId}
                  selectedShapeIndex={selectedShapeIndex}
                  onSelectShape={(shapeIndex, shapeId, e) => {
                    handleSelect(
                      { id: shapeId!, type: "shape", index: shapeIndex! },
                      e.evt.ctrlKey
                    );
                    setSelectedShapeId(shapeId!);
                    setSelectedShapeIndex(shapeIndex!);
                  }}
                />

                {/* Render title */}
                {title?.text && (
                  <KonvaTextEditor
                    key={`title-${index}`}
                    id={`title-${index}`}
                    text={title.text}
                    x={titleProps.x || 25}
                    y={titleProps.y || getDynamicConstants().LEFT_PADDING}
                    zIndex={titleProps.zIndex}
                    width={titleProps.width || getDynamicConstants().textMaxWidth}
                    wrap="word"
                    fontSize={titleProps.fontSize}
                    fontWeight={titleProps.fontWeight}
                    fontFamily={titleProps.fontFamily}
                    opacity={titleProps.opacity}
                    align={titleProps.align}
                    verticalAlign={titleProps.verticalAlign}
                    fill={titleProps.fill || "#000"}
                    fontStyle={titleProps.fontStyle}
                    isSelected={selectedElements.some((s) => s.id === `title-${index}`)}
                    onSelect={(e) => {
                      handleSelect(
                        { id: `title-${index}`, type: "text", index: -1 },
                        e.evt.ctrlKey
                      );
                      setSelectedTextId(`title-${index}`);
                      setSelectedImageId(null);
                      setSelectedImageIndex(null);
                      setSelectedImage(null);
                      setSelectedShapeId(null);
                      setSelectedShapeIndex(null);
                    }}
                  />
                )}

                {/* Render text elements */}
                {slide.elements.map((el: any, i: number) => {
                  if (
                    el.element_type !== "text" &&
                    el.element_type !== "bullet_point"
                  )
                    return null;

                  return (
                    <KonvaTextEditor
                      key={`el-${index}-${i}`}
                      id={`el-${index}-${i}`}
                      text={el.text}
                      x={el.properties.x}
                      y={el.properties.y}
                      zIndex={el.properties.zIndex}
                      width={el.properties.width || getDynamicConstants().textMaxWidth}
                      opacity={el.properties.opacity}
                      align={el.properties.align}
                      verticalAlign={el.properties.verticalAlign}
                      wrap="word"
                      fontSize={el.properties.fontSize}
                      fontFamily={el.properties.fontFamily || "Arial"}
                      fill={el.properties.fill}
                      fontStyle={el.properties.fontStyle}
                      fontWeight={el.properties.fontWeight}
                      isSelected={selectedElements.some((s) => s.id === `el-${index}-${i}`)}
                      onSelect={(e) => {
                        handleSelect(
                          { id: `el-${index}-${i}`, type: "text", index: i },
                          e.evt.ctrlKey
                        );
                        setSelectedTextId(`el-${index}-${i}`);
                        setSelectedImageId(null);
                        setSelectedImageIndex(null);
                        setSelectedImage(null);
                        setSelectedShapeId(null);
                        setSelectedShapeIndex(null);
                      }}
                    />
                  );
                })}

                {/* Render images */}
                {slide.elements.map((el: any, i: number) => {
                  if (el.element_type === "image" && el.konva_component === "Konva.Image") {
                    return (
                      <SlideImage
                        key={`image-${index}-${i}-${el.properties.image_id}`}
                        image_id={el.properties.image_id}
                        imageSrc={el.properties.imageSrc}
                        x={el.properties.x}
                        y={el.properties.y}
                        zIndex={el.properties.zIndex}
                        width={el.properties.width}
                        height={el.properties.height}
                        opacity={el.properties.opacity}
                        shadow={el.properties.shadow}
                        borderRadius={el.properties.borderRadius}
                        isSelected={selectedElements.some((s) => s.id === el.properties.image_id)}
                        onSelect={(e) => {
                          handleSelect(
                            { id: el.properties.image_id, type: "image", index: i },
                            e.evt.ctrlKey
                          );
                          setSelectedImage({ ...el });
                          setSelectedImageId(el.properties.image_id);
                          setSelectedImageIndex(i);
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
        selectedIndex={selectedIndex}
        slide_width={getDynamicConstants().SLIDE_WIDTH}
        slide_height={getDynamicConstants().SLIDE_HEIGHT}
        onSelect={setSelectedIndex}
        onAddSlide={handleAddSlide}
        onDeleteSlide={handleDeleteSlide}
      />
    </Box>
  );
};

export default SlideEditor;
