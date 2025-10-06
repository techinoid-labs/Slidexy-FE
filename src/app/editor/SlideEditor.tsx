import React, { useEffect, useState } from "react";
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
  const width = window.innerWidth / 1.25 // random width
  const height = window.innerHeight / 1.5 // random height

  // Specify angle in degrees
  const angleInDeg = 140

  // Compute angle in radians - CSS starts from 180 degrees and goes clockwise
  // Math functions start from 0 and go anti-clockwise so we use 180 - angleInDeg to convert between the two
  const angle = ((180 - angleInDeg) / 180) * Math.PI

  // This computes the length such that the start/stop points will be at the corners
  const length =
    Math.abs(width * Math.sin(angle)) + Math.abs(height * Math.cos(angle))

  // Compute the actual x,y points based on the angle, length of the gradient line and the center of the div
  const halfx = (Math.sin(angle) * length) / 2.0
  const halfy = (Math.cos(angle) * length) / 2.0
  const cx = width / 2.0
  const cy = height / 2.0
  const x1 = cx - halfx
  const y1 = cy - halfy
  const x2 = cx + halfx
  const y2 = cy + halfy
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
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // --- allow typing inside editors ---
      const active = document.activeElement as HTMLElement | null;
      const isTyping =
        active?.tagName === "INPUT" ||
        active?.tagName === "TEXTAREA" ||
        active?.isContentEditable;

      // Handle undo/redo shortcuts
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

      // Ctrl+A select all
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

      // Delete element (only if NOT typing text)
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
        console.log("[SlideEditor] Processing slide", index, slide);
        const title = slide.slide_title;
        const titleProps = title.properties;
        const titleY = 25;

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
              <Layer clipFunc={(ctx) => {
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
                  <Group
                  >
                    <Rect
                      name="background"
                      x={0}
                      y={0}
                      width={getDynamicConstants().SLIDE_WIDTH}
                      height={getDynamicConstants().SLIDE_HEIGHT}
                      onClick={deselectAll}
                      fillPriority="radial-gradient"
                      fillRadialGradientStartPoint={{ x: 200, y: 200 }}
                      fillRadialGradientEndPoint={{ x: 200, y: 200 }}
                      fillRadialGradientStartRadius={0}
                      fillRadialGradientEndRadius={400}
                      fillRadialGradientColorStops={[
                        0, "rgba(250, 248, 245, 1)",   // off-white
                        0.4, "rgba(241, 234, 246, 0.6)", // cream
                        1, "rgba(240, 240, 240, 1)",
                        // light gray
                      ]}
                    />
                    <Circle
                      x={150}
                      y={100}
                      radius={180}
                      fillPriority="radial-gradient"
                      fillRadialGradientStartPoint={{ x: 150, y: 100 }}
                      fillRadialGradientEndPoint={{ x: 150, y: 100 }}
                      fillRadialGradientStartRadius={0}
                      fillRadialGradientEndRadius={180}
                      fillRadialGradientColorStops={[
                        0, "rgba(205, 185, 220, 0.6)", // lavender
                        1, "rgba(255, 255, 255, 0)",   // transparent fade
                      ]}
                    />

                    {/* Blob 2 */}
                    <Circle
                      x={400}
                      y={150}
                      radius={220}
                      fillPriority="radial-gradient"
                      fillRadialGradientStartPoint={{ x: 180, y: 120 }}
                      fillRadialGradientEndPoint={{ x: 180, y: 120 }}
                      fillRadialGradientStartRadius={0}
                      fillRadialGradientEndRadius={220}
                      fillRadialGradientColorStops={[
                        0, "rgba(200, 220, 210, 0.5)", // sage green
                        1, "rgba(255, 255, 255, 0)",
                      ]}
                    />

                    {/* Blob 3 */}
                    <Ellipse
                      x={250}
                      y={300}
                      radiusX={180}
                      radiusY={120}
                      fillPriority="radial-gradient"
                      fillRadialGradientStartPoint={{ x: 200, y: 150 }}
                      fillRadialGradientEndPoint={{ x: 200, y: 150 }}
                      fillRadialGradientStartRadius={0}
                      fillRadialGradientEndRadius={180}
                      fillRadialGradientColorStops={[
                        0, "rgba(255, 232, 255, 0.4)", // dusty purple
                        1, "rgba(255, 255, 255, 0)",
                      ]}
                    />

                    {/* Blob 4 */}
                    <Ellipse
                      x={500}
                      y={350}
                      radiusX={150}
                      radiusY={100}
                      fillPriority="radial-gradient"
                      fillRadialGradientStartPoint={{ x: 200, y: 350 }}
                      fillRadialGradientEndPoint={{ x: 200, y: 350 }}
                      fillRadialGradientStartRadius={0}
                      fillRadialGradientEndRadius={150}
                      fillRadialGradientColorStops={[
                        0, "rgba(245, 210, 210, 0.5)", // soft blush
                        1, "rgba(255, 255, 255, 0)",
                      ]}
                    />

                    {/* Blob 5 */}
                    <Circle
                      x={100}
                      y={320}
                      radius={130}
                      fillPriority="radial-gradient"
                      fillRadialGradientStartPoint={{ x: 100, y: 320 }}
                      fillRadialGradientEndPoint={{ x: 100, y: 320 }}
                      fillRadialGradientStartRadius={0}
                      fillRadialGradientEndRadius={130}
                      fillRadialGradientColorStops={[
                        0, "rgba(200, 210, 230, 0.4)", // dusty blue
                        1, "rgba(255, 255, 255, 0)",
                      ]}
                    />
                  </Group>
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