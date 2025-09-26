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

  const { selectedTheme, setSelectedTheme } = useSlideThemeContext();
  const [bgImage] = useImage(selectedTheme?.image_url || "");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scale, setScale] = useState(1);
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

  useEffect(() => {
    const positionedSlides = applyElementPositioning(slides, selectedTheme);
    setSlides(positionedSlides);
  }, [slides?.length]);

  useEffect(() => {
    const updateScale = () => {
      setScale(window.innerWidth < 1366 ? 0.85 : 1);
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

  // Assign shape_id to shapes that don't have it
  useEffect(() => {
    const updatedSlides = structuredClone(slides);
    let changed = false;
    updatedSlides.forEach((slide: any) => {
      slide.elements.forEach((el: any) => {
        if (el.element_type === "shape" && !el.shape_id) {
          el.shape_id = uuidv4();
          changed = true;
          console.log(`[SlideEditor] Assigned shape_id ${el.shape_id} to shape element`, el);
        }
      });
    });
    if (changed) {
      setSlides(updatedSlides);
      console.log("[SlideEditor] Assigned missing shape_ids to shapes");
    }
  }, [slides, setSlides]);

  const deselectAll = () => {
    setSelectedElements([]);
    setSelectedTextId(null);
    setSelectedImageId(null);
    setSelectedShapeId(null);
    setSelectedImageIndex(null);
    setSelectedImage(null);
    setSelectedShapeIndex(null);
  };

// Add this useEffect in your SlideEditor component, after the existing useEffects

useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    // Handle undo/redo shortcuts
    if (e.ctrlKey && e.key.toLowerCase() === 'z' && !e.shiftKey) {
      e.preventDefault();
      undo();
      return;
    }
    
    if (e.ctrlKey && (e.key.toLowerCase() === 'y' || (e.key.toLowerCase() === 'z' && e.shiftKey))) {
      e.preventDefault();
      redo();
      return;
    }

    // Your existing Ctrl+A logic
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

    // Your existing delete logic
    if (e.key === "Delete" || e.key === "Backspace") {
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
      }}
    >
      {slides.map((slide: any, index: number) => {
        console.log("[SlideEditor] Processing slide", index, slide);
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
                <Rect
                  x={0}
                  y={0}
                  width={getDynamicConstants().SLIDE_WIDTH}
                  height={window.innerHeight - 320}
                  listening={false}
                />

                {title.text && (
                  <KonvaTextEditor
                    key={`title-${index}-${titleProps.fontFamily || "Roboto"}-${titleProps.fontSize || 18
                      }-${titleProps.fontWeight || "normal"}-${titleProps.align || "left"
                      }-${titleProps.fontStyle || "normal"}-${titleProps.fill || "#000"
                      }-${titleProps.opacity || 1}`}
                    id={`title-${index}`}
                    text={title.text}
                    x={titleProps.x || titleY}
                    y={titleProps.y || getDynamicConstants().LEFT_PADDING}
                    zIndex={titleProps.zIndex}
                    width={(() => {
                      const textWidth = getDynamicConstants().textMaxWidth + 200;
                      const canvas = document.createElement("canvas");
                      const context = canvas.getContext("2d");
                      const fontSize = titleProps.fontSize || 14;
                      const fontFamily = titleProps.fontFamily || "Roboto";
                      context!.font = `${fontSize}px ${fontFamily}`;
                      const words = title.text.split(" ");
                      let lines = [];
                      let line = "";

                      for (let word of words) {
                        const testLine = line + word + " ";
                        const metrics = context!.measureText(testLine);
                        if (metrics.width > textWidth && line !== "") {
                          lines.push(line.trim());
                          line = word + " ";
                        } else {
                          line = testLine;
                        }
                      }
                      if (line) lines.push(line.trim());

                      return Math.min(textWidth + 200, window.innerWidth - 80);
                    })()}
                    wrap="word"
                    fontSize={titleProps.fontSize}
                    fontWeight={titleProps.fontWeight}
                    fontFamily={titleProps.fontFamily}
                    opacity={titleProps.opacity}
                    align={titleProps.align}
                    verticalAlign={titleProps.verticalAlign}
                    fill={
                      !title.useThemeColor
                        ? titleProps.fill
                        : selectedTheme?.primaryColor ?? "#000"
                    }
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
                      width={
                        el.properties.width ||
                        getDynamicConstants().textMaxWidth -
                        (el.element_type === "bullet_point" ? 20 : 0)
                      }
                      opacity={el.properties.opacity}
                      align={el.properties.align}
                      verticalAlign={el.properties.verticalAlign}
                      wrap="word"
                      fontSize={el.properties.fontSize}
                      fontFamily={el.properties.fontFamily || "Arial"}
                      fill={
                        !el.useThemeColor
                          ? el.properties.fill
                          : selectedTheme?.primaryColor
                      }
                      fontStyle={el.properties.fontStyle}
                      fontWeight={el.properties.fontWeight}
                      isSelected={selectedElements.some((s) => s.id === `el-${index}-${i}`)}
                      onSelect={(e) => {
                        handleSelect(
                          { id: `el-${index}-${i}`, type: "text", index: i },
                          e.evt.ctrlKey // allow ctrl+click multi select
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