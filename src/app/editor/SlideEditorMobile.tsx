"use client";

import React, { useEffect, useState } from "react";
import { Stage, Layer, Rect, Image as KonvaImage } from "react-konva";
import useImage from "use-image";
import { Box } from "@mui/material";
import SlideImage from "./KonvaComponents/KonvaSlideImageMobile";
import KonvaTextEditor from "./KonvaComponents/KonvaTextEditorMobile";
import { dummyData } from "./dummy";
import { useSlideThemeContext } from "@/app/context/ThemeContext";
import SlidePreviews from "./slidesPreview";
import { useDispatch } from "react-redux";
import KonvaShapeRenderer from "./KonvaComponents/KonvaShapesRendererMobile";
import { useSlides } from "../context/SlidesContext";
import {
  getRandomSlide,
  getLayoutProps,
  getSlideDimensions,
} from "../../utils/slideUtilsmobile";
import { v4 as uuidv4 } from "uuid";
import TextSettingsPanelMobile from "../components/modify-presentation/TextPanelMobile";

const getDynamicConstants = () => {
  const { SLIDE_WIDTH, SLIDE_HEIGHT, LEFT_PADDING } = getSlideDimensions();
  const IMAGE_WIDTH = 100;
  const IMAGE_PADDING = 0;
  const textMaxWidth =
    SLIDE_WIDTH - IMAGE_WIDTH - IMAGE_PADDING - LEFT_PADDING - 100;
  const textMaxHeight = SLIDE_HEIGHT - 60 - 20;
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
  const dispatch = useDispatch();
  const {
    selectedImageIndex,
    setSelectedImageIndex,
    setSelectedImage,
    selectedTextId,
    setSelectedTextId,
    selectedShapeIndex,
    setSelectedShapeIndex,
    setSlides,
    tooltip,
    setTooltip,
    isAtBoundary,
  } = useSlides();
  const { selectedTheme, selectedLayout } = useSlideThemeContext();
  const [bgImage] = useImage(selectedTheme?.image_url || "");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [dimensions, setDimensions] = useState(getDynamicConstants());
  const [useDummy] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setDimensions(getDynamicConstants());
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
    if (!slides || slides.length === 0) return;

    const normalizedSlides = slides.map((slide: any) => {
      if (
        slide.image_url &&
        !slide.elements?.some(
          (el: any) =>
            el.element_type === "image" &&
            el.konva_component === "Konva.Image" &&
            el.properties.imageSrc === slide.image_url
        )
      ) {
        const defaultImageElement = {
          element_type: "image",
          konva_component: "Konva.Image",
          element_id: uuidv4(),
          properties: {

            imageSrc: slide.image_url,
            x: dimensions.SLIDE_WIDTH - 260,
            y: (dimensions.SLIDE_HEIGHT - 50) / 2,
            width: 200,
            height: 150,
          },
        };
        return {
          ...slide,
          elements: [...(slide.elements || []), defaultImageElement],
          image_url: null,
        };
      }
      return slide;
    });

    if (JSON.stringify(slides) !== JSON.stringify(normalizedSlides)) {
      setSlides(normalizedSlides);
    }
  }, [slides, dimensions.SLIDE_WIDTH, dimensions.SLIDE_HEIGHT, setSlides]);

  const {
    SLIDE_WIDTH,
    SLIDE_HEIGHT,
    LEFT_PADDING,
    textMaxWidth,
    textMaxHeight,
  } = dimensions;

  return (
    <main
      style={{
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "auto",
        height: "100vh",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          overflow: "hidden",
          width: "900px",
          height: "100px",
          marginLeft: 27,
          marginRight: 20,
          position: "fixed",
          borderRadius: "5px",
          borderBottomRightRadius: "16px",
          marginTop: 80,
        }}
      >
        <SlidePreviews
          slides={slides}
          selectedIndex={selectedIndex}
          slide_width={SLIDE_WIDTH + 20}
          slide_height={SLIDE_HEIGHT + 10}
          onSelect={setSelectedIndex}
          onAddSlide={handleAddSlide}
          onDeleteSlide={handleDeleteSlide}
        />
      </div>

      <div
        style={{
          flexGrow: 1,
          overflow: "auto",
          padding: 16,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            position: "fixed",
            top: 190,
            width: window.innerWidth - 40,
            height: window.innerHeight - 290,
            bgcolor: "#fff",
            border: "1px solid #E0E0E0",
            zIndex: 1,
            boxShadow: 3,
            display: "flex",
            flexDirection: "column",
            padding: "12px",
            borderBottomLeftRadius: "13px",
            borderBottomRightRadius: "13px",
            borderTopLeftRadius: "13px",
            borderTopRightRadius: "13px",
            //paddingRight: "17px",
            //overflowX: "hidden",
          }}
        >
          {slides.map((slide: any, index: number) => {
            const title = slide.slide_title;
            const titleProps = title.properties;
            const titleY = 30;
            const bulletGap = 1;
            const bulletStartY = 60;

            // Debug: Log title properties
            console.log(`[SlideEditorMobile] Title ${index} properties:`, {
              fontFamily: titleProps.fontFamily,
              fontSize: titleProps.fontSize,
              fontWeight: titleProps.fontWeight,
              align: titleProps.align,
              text: title.text
            });

            return (
              <Box
                key={slide.slide_id}
                sx={{
                  width: `${SLIDE_WIDTH + 10}px`,
                  height: {
                    xs: `${window.innerHeight}px`,
                    md: `${SLIDE_HEIGHT + 100}px`,
                  },
                  border: "1px solid #ccc",
                  backgroundColor: "#fff",
                  position: "relative",
                  mb: 1.7,
                  display: index === selectedIndex ? "block" : "none",
                  align: "center",
                  marginLeft: "auto",
                  marginRight: "auto",
                  marginTop: "auto",
                  marginBottom: "auto"


                  //maxHeight: {xs: "calc(100vh - 200px)", sm: "calc(100vh - 150px)"},
                }}
              >
                <Stage
                  width={window.innerWidth - 69}
                  height={window.innerHeight - 320}
                  ref={(ref: any) => {
                    stageRefs.current[index] =
                      ref?.getStage()?.content?.querySelector("canvas") || null;
                  }}
                  onMouseDown={(e) => {
                    const clickedOnEmpty =
                      e.target === e.target.getStage() ||
                      e.target.name() === "background";
                    if (clickedOnEmpty) {
                      console.log(window.innerHeight);
                      setSelectedTextId(null);
                      setSelectedImageIndex(null);
                      setSelectedShapeIndex(null);
                      setSelectedImage(null);
                      setTooltip({ visible: false, x: 0, y: 0, node: null });
                    }
                  }}
                  onTouchEnd={(e) => {
                    const clickedOnEmpty =
                      e.target === e.target.getStage() ||
                      e.target.name() === "background";
                    if (clickedOnEmpty) {
                      console.log(window.innerHeight);
                      setSelectedTextId(null);
                      setSelectedImageIndex(null);
                      setSelectedShapeIndex(null);
                      setSelectedImage(null);
                      setTooltip({ visible: false, x: 0, y: 0, node: null });
                    }
                  }}
                >
                  <Layer>
                    {selectedTheme?.image_url && bgImage ? (
                      <KonvaImage
                        image={bgImage}
                        x={0}
                        y={0}
                        width={SLIDE_WIDTH}
                        height={SLIDE_HEIGHT}
                        onClick={() => {
                          setSelectedTextId(null);
                          setSelectedImageIndex(null);
                          setSelectedShapeIndex(null);
                          setSelectedImage(null);
                          setTooltip({
                            visible: false,
                            x: 0,
                            y: 0,
                            node: null,
                          });
                        }}
                      />
                    ) : (
                      <Rect
                        name="background"
                        x={0}
                        y={0}
                        width={SLIDE_WIDTH}
                        height={SLIDE_HEIGHT}
                        fill={selectedTheme?.backgroundColor || "#fff"}
                      />
                    )}
                    <Rect
                      x={0}
                      y={0}
                      width={SLIDE_WIDTH}
                      height={window.innerHeight - 320}
                      // stroke={isAtBoundary ? "red" : "transparent"}
                      // strokeWidth={1}
                      listening={false}
                    />
                    {title.text && (
                      <KonvaTextEditor
                        key={`title-${index}-${titleProps.fontFamily || "Roboto"}-${titleProps.fontSize || 18}-${titleProps.fontWeight || "normal"}-${titleProps.align || "left"}-${titleProps.fontStyle || "normal"}-${titleProps.fill || "#000"}-${titleProps.opacity || 1}`}
                        id={`title-${index}`}
                        text={title.text}
                        x={titleProps.x || LEFT_PADDING }
                        y={titleProps.y || titleY}
                        width={(() => {
                          // Calculate dynamic width like bullets
                          const textWidth = getDynamicConstants().textMaxWidth; // Increased width
                          const canvas = document.createElement("canvas");
                          const context = canvas.getContext("2d");
                          const fontSize = titleProps.fontSize || 14; // Reduced default font size
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

                          // Return the calculated width with more padding and less right constraint
                          return Math.min(textWidth + 200, window.innerWidth - 80); // Reduced right padding constraint
                        })()}
                        wrap="word"
                        fontSize={titleProps.fontSize || 14}
                        fontWeight={titleProps.fontWeight || "normal"}
                        fontFamily={titleProps.fontFamily || "Roboto"}
                        opacity={titleProps.opacity || 1}
                        align={titleProps.align || "left"}
                        verticalAlign={titleProps.verticalAlign || "top"}
                        fill={
                          !title.useThemeColor
                            ? titleProps.fill
                            : selectedTheme?.primaryColor ?? "#000"
                        }
                        fontStyle={titleProps.fontStyle}
                        isSelected={selectedTextId === `title-${index}`}
                        onSelect={() => {
                          setSelectedTextId(`title-${index}`);
                          setSelectedImageIndex(null);
                          setSelectedShapeIndex(null);
                          setSelectedImage(null);
                          setTooltip({
                            visible: true,
                            x: titleProps.x || LEFT_PADDING + 100,
                            y: (titleProps.y || titleY) - 40, // Move tooltip 40px above the title
                            node: null,
                          });
                        }}
                      />
                    )}
                    {slide.elements.map((el: any, i: number) => {
                      if (el.element_type !== "text") return null;

                      return (
                        <KonvaTextEditor
                          key={`el-${index}-${i}-${el.properties.fontFamily}-${el.properties.fontSize}-${el.properties.fontWeight}-${el.properties.align}`}
                          id={`el-${index}-${i}`}
                          text={el.text}
                          x={el.properties.x || LEFT_PADDING}
                          y={el.properties.y || 300}
                          width={el.properties.width + 80 || textMaxWidth + 100}
                          opacity={el.properties.opacity}
                          align={el.properties.align}
                          verticalAlign={el.properties.verticalAlign}
                          wrap="word"
                          fontSize={el.properties.fontSize}
                          fontFamily={el.properties.fontFamily}
                          fill={
                            !el.useThemeColor
                              ? el.properties.fill
                              : selectedTheme?.primaryColor
                          }
                          fontStyle={el.properties.fontStyle}
                          fontWeight={el.properties.fontWeight}
                          isSelected={selectedTextId === `el-${index}-${i}`}
                          onSelect={() => {
                            setSelectedTextId(`el-${index}-${i}`);
                            setSelectedImageIndex(null);
                            setSelectedShapeIndex(null);
                            setSelectedImage(null);
                          }}
                          onClick={() => {
                            setTooltip({
                              visible: true,
                              x: 10,
                              y: 10,
                              node: null,
                            });
                          }}
                        />
                      );
                    })}
                    {(() => {
                      let currentY = bulletStartY;

                      return slide.elements
                        .filter((el: any) => el.element_type === "bullet_point")
                        .map((el: any, i: number) => {
                          //console.log(el);
                          const isBullet = el.element_type === "bullet_point";
                          const fontSize = el.properties.fontSize;
                          const fontFamily =
                            selectedTheme?.font || el.properties.fontFamily;
                          const lineHeight = 0.9;
                          const bulletText = isBullet ? `${el.text}` : el.text;

                          const textWidth =
                            getDynamicConstants().textMaxWidth -
                            (isBullet ? 1 : 0);
                          const canvas = document.createElement("canvas");
                          const context = canvas.getContext("2d");
                          context!.font = `${fontSize}px ${fontFamily}`;
                          const words = bulletText.split(" ");
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

                          const height = lines.length * fontSize * lineHeight;

                          const editor = (
                            <KonvaTextEditor
                              key={`el-${index}-${i}-${fontFamily}-${fontSize}-${el.properties.fontWeight}-${el.properties.align}`}
                              id={`el-${index}-${i}`}
                              text={bulletText}
                              x={
                                getDynamicConstants().LEFT_PADDING +
                                (isBullet ? 4 : 0)
                              }
                              y={currentY}

                              opacity={el.properties.opacity}
                              align={el.properties.align}
                              width={textWidth + 100}
                              wrap="word"
                              fontSize={fontSize}
                              fontFamily={fontFamily}
                              fill={
                                !el.useThemeColor
                                  ? el.properties.fill
                                  : selectedTheme?.primaryColor
                              }
                              fontStyle={el.properties.fontStyle}
                              fontWeight={el.properties.fontWeight}
                              isSelected={selectedTextId === `el-${index}-${i}`}
                              onSelect={() => {
                                setSelectedTextId(`el-${index}-${i}`);
                                setSelectedImageIndex(null);
                                setSelectedShapeIndex(null);
                                setSelectedImage(null);
                              }}
                            />
                          );

                          currentY += height + bulletGap;
                          return editor;
                        });
                    })()}
                    <KonvaShapeRenderer
                      elements={slide.elements}
                      selectedShapeIndex={selectedShapeIndex}
                      onSelectShape={(i) => {
                        setSelectedShapeIndex(i);
                        setSelectedTextId(null);
                        setSelectedImageIndex(null);
                        setSelectedImage(null);
                        setTooltip({ visible: false, x: 0, y: 0, node: null });
                      }}
                    />
                    {slide.elements.map((el: any, i: number) => {
                      if (
                        el.element_type === "image" &&
                        el.konva_component === "Konva.Image"
                      ) {
                        return (
                          <SlideImage
                            key={`image-${i}`}
                            imageSrc={el.properties.imageSrc}
                            x={el.properties.x}
                            y={el.properties.y}
                            width={el.properties.width}
                            height={el.properties.height}
                            isSelected={selectedImageIndex === i}
                            onSelect={() => {
                              setSelectedImage({ ...el });
                              setSelectedImageIndex(i);
                              setSelectedShapeIndex(null);
                              setSelectedTextId(null);
                              setTooltip({
                                visible: false,
                                x: 0,
                                y: 0,
                                node: null,
                              });
                            }}
                          />
                        );
                      }
                    })}
                  </Layer>
                </Stage>
              </Box>
            );
          })}
          {tooltip.visible && (
            <TextSettingsPanelMobile
              style={{
                top: tooltip.y,
                left: tooltip.x - 15,
              }}
              onClose={() => setTooltip({ ...tooltip, visible: false })}
            />
          )}
        </Box>
      </div>
    </main>
  );
};

export default SlideEditor;
