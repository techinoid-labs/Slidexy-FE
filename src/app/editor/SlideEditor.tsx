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
  } = useSlides();

  const { selectedTheme, setSelectedTheme } = useSlideThemeContext();
  const [bgImage] = useImage(selectedTheme?.image_url || "");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scale, setScale] = useState(1);

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
      setScale(window.innerWidth < 1366 ? 0.85 : 1);
    };

    updateScale();
    window.addEventListener("resize", updateScale);

    return () => window.removeEventListener("resize", updateScale);
  }, []);

  // Function to deselect all elements
  const deselectAll = () => {
    setSelectedTextId(null);
    setSelectedImageIndex(null);
    setSelectedShapeIndex(null);
    setSelectedImage(null);
    setSelectedImageId(null); 
    setSelectedShapeId(null);
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
                  deselectAll(); // Deselect all elements, including image
                }
              }}
              onTouchStart={(e) => {
                const clickedOnEmpty =
                  e.target === e.target.getStage() ||
                  e.target.name() === "background";
                if (clickedOnEmpty) {
                  deselectAll(); // Deselect all elements, including image
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
                    isSelected={selectedTextId === `title-${index}`}
                    onSelect={() => {
                      deselectAll(); // Deselect all before selecting text
                      setSelectedTextId(`title-${index}`);
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
                      fontFamily={
                        selectedTheme?.font ||
                        el.properties.fontFamily ||
                        "Arial"
                      }
                      fill={
                        !el.useThemeColor
                          ? el.properties.fill
                          : selectedTheme?.primaryColor
                      }
                      fontStyle={el.properties.fontStyle}
                      fontWeight={el.properties.fontWeight}
                      isSelected={selectedTextId === `el-${index}-${i}`}
                      onSelect={() => {
                        deselectAll(); // Deselect all before selecting text
                        setSelectedTextId(`el-${index}-${i}`);
                      }}
                    />
                  );
                })}
                <KonvaShapeRenderer
                  elements={slide.elements}
                  selectedShapeIndex={selectedShapeIndex}
                  onSelectShape={(i) => {
                    deselectAll(); // Deselect all before selecting shape
                    setSelectedShapeIndex(i);
                    setSelectedShapeId(`el-${index}-${i}`);
                  }}
                />
                               {slide.elements.map((el: any, i: number) => {
                  if (el.element_type === "image" && el.konva_component === "Konva.Image") {
                    return (
                      <SlideImage
                        key={`image-${i}`}
                        image_id={`el-${index}-${i}`}
                        imageSrc={el.properties.imageSrc}
                        x={el.properties.x}
                        y={el.properties.y}
                        zIndex={el.properties.zIndex}
                        width={el.properties.width}
                        height={el.properties.height}
                        opacity={el.properties.opacity}
                        shadow={el.properties.shadow}
                        borderRadius={el.properties.borderRadius}
                        isSelected={selectedImageId === `el-${index}-${i}`}
                        onSelect={() => {
                          setSelectedImage({ ...el });
                          setSelectedImageId(`el-${index}-${i}`);
                          setSelectedImageIndex(i);
                          setSelectedShapeIndex(null);
                          setSelectedTextId(null);
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