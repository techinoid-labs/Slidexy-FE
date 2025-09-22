import React, { useEffect, useState } from "react";
import { Stage, Layer, Rect, Image as KonvaImage } from "react-konva";
import useImage from "use-image";
import { Box } from "@mui/material";
import SlideImage from "./KonvaComponents/KonvaSlideImage";
import KonvaTextEditor from "./KonvaComponents/KonvaTextEditor";
import { useSlideThemeContext } from "@/app/context/ThemeContext";
import SlidePreviews from "./slidesPreview";
import KonvaShapeRenderer from "./KonvaComponents/KonvaShapesRenderer";
import { useSlides } from "../context/SlidesContext";
import { getRandomSlide, getSlideDimensions } from "../../utils/slideUtils";
import { applyElementPositioning } from "@/utils/slideTextPositioningUtils";
import { v4 as uuidv4 } from "uuid";

// NEW: type helper for selection
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
    setSlides,
  } = useSlides();

  const { selectedTheme, setSelectedTheme } = useSlideThemeContext();
  const [bgImage] = useImage(selectedTheme?.image_url || "");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scale, setScale] = useState(1);

  // NEW: multiple selection state
  const [selectedElements, setSelectedElements] = useState<SelectedElement[]>([]);

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

  // Preserve theme
  useEffect(() => {
    const preservedThemeData = localStorage.getItem("slidesTheme");
    if (preservedThemeData) {
      setSelectedTheme(JSON.parse(preservedThemeData));
    }
  }, []);

  // Positioning
  useEffect(() => {
    const positionedSlides = applyElementPositioning(slides, selectedTheme);
    setSlides(positionedSlides);
  }, [slides?.length]);

  // Responsive scale
  useEffect(() => {
    const updateScale = () => {
      setScale(window.innerWidth < 1366 ? 0.85 : 1);
    };

    updateScale();
    window.addEventListener("resize", updateScale);

    return () => window.removeEventListener("resize", updateScale);
  }, []);

  // Ensure IDs exist for images/shapes
  useEffect(() => {
    const updatedSlides = structuredClone(slides);
    let changed = false;

    updatedSlides.forEach((slide: any) => {
      slide.elements.forEach((el: any) => {
        if (el.element_type === "image" && !el.properties.image_id) {
          el.properties.image_id = uuidv4();
          changed = true;
        }
        if (el.element_type === "shape" && !el.shape_id) {
          el.shape_id = uuidv4();
          changed = true;
        }
      });
    });

    if (changed) {
      setSlides(updatedSlides);
    }
  }, [slides, setSlides]);

  // NEW: deselect helper
  const deselectAll = () => setSelectedElements([]);

  // NEW: select all with Ctrl+A
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === "a") {
        e.preventDefault();

        const currentSlide = slides[selectedIndex];
        if (!currentSlide) return;

        const all: SelectedElement[] = currentSlide.elements.map((el: any, i: number) => {
          if (el.element_type === "image") {
            return { id: el.properties.image_id, type: "image", index: i };
          } else if (el.element_type === "shape") {
            return { id: el.shape_id, type: "shape", index: i };
          } else {
            return { id: `el-${selectedIndex}-${i}`, type: "text", index: i };
          }
        });

        setSelectedElements(all);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [slides, selectedIndex]);

  // NEW: toggle select (ctrl+click vs single select)
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
      }}
    >
      {slides.map((slide: any, index: number) => {
        const title = slide.slide_title;
        const titleProps = title.properties;
        const titleY = 25;

        return (
          <Box
            key={slide.slide_id}
            sx={{
              border: "1px solid #ccc",
              backgroundColor: "#fff",
              position: "relative",
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
              <Layer>
                {selectedTheme?.image_url && bgImage ? (
                  <KonvaImage
                    image={bgImage}
                    x={0}
                    y={0}
                    width={getDynamicConstants().SLIDE_WIDTH}
                    height={getDynamicConstants().SLIDE_HEIGHT}
                    onClick={deselectAll}
                  />
                ) : (
                  <Rect
                    name="background"
                    x={0}
                    y={0}
                    width={getDynamicConstants().SLIDE_WIDTH}
                    height={getDynamicConstants().SLIDE_HEIGHT}
                    onClick={deselectAll}
                    fill={selectedTheme?.backgroundColor || "#fff"}
                  />
                )}

                {/* TITLE */}
                {title.text && (
                  <KonvaTextEditor
                    id={`title-${index}`}
                    text={title.text}
                    x={titleProps.x || titleY}
                    y={titleProps.y || getDynamicConstants().LEFT_PADDING}
                    width={getDynamicConstants().textMaxWidth}
                    fontSize={titleProps.fontSize}
                    fontWeight={titleProps.fontWeight}
                    fontFamily={titleProps.fontFamily}
                    fill={
                      !title.useThemeColor
                        ? titleProps.fill
                        : selectedTheme?.primaryColor ?? "#000"
                    }
                    isSelected={selectedElements.some((el) => el.id === `title-${index}`)}
                    onSelect={(e) => handleSelect({ id: `title-${index}`, type: "text", index: -1 }, e.evt.ctrlKey)}
                  />
                )}

                {/* TEXT & BULLETS */}
                {slide.elements.map((el: any, i: number) => {
                  if (el.element_type !== "text" && el.element_type !== "bullet_point") return null;
                  return (
                    <KonvaTextEditor
                      key={`el-${index}-${i}`}
                      id={`el-${index}-${i}`}
                      text={el.text}
                      x={el.properties.x}
                      y={el.properties.y}
                      width={el.properties.width || getDynamicConstants().textMaxWidth}
                      fontSize={el.properties.fontSize}
                      fontFamily={el.properties.fontFamily}
                      fill={
                        !el.useThemeColor
                          ? el.properties.fill
                          : selectedTheme?.primaryColor
                      }
                      isSelected={selectedElements.some((s) => s.id === `el-${index}-${i}`)}
                      onSelect={(e) =>
                        handleSelect({ id: `el-${index}-${i}`, type: "text", index: i }, e.evt.ctrlKey)
                      }
                    />
                  );
                })}

                {/* SHAPES */}
                <KonvaShapeRenderer
                  elements={slide.elements}
                  selectedShapeId={
                    selectedElements.find((s) => s.type === "shape")?.id || null
                  }
                  onSelectShape={(shapeIndex, shapeId, e) => {
                    handleSelect({ id: shapeId, type: "shape", index: shapeIndex }, e.evt.ctrlKey);
                  }}
                />

                {/* IMAGES */}
                {slide.elements.map((el: any, i: number) => {
                  if (el.element_type === "image" && el.konva_component === "Konva.Image") {
                    return (
                      <SlideImage
                        key={`image-${index}-${i}-${el.properties.image_id}`}
                        image_id={el.properties.image_id}
                        imageSrc={el.properties.imageSrc}
                        x={el.properties.x}
                        y={el.properties.y}
                        width={el.properties.width}
                        height={el.properties.height}
                        isSelected={selectedElements.some((s) => s.id === el.properties.image_id)}
                        onSelect={(e) =>
                          handleSelect({ id: el.properties.image_id, type: "image", index: i }, e.evt.ctrlKey)
                        }
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
