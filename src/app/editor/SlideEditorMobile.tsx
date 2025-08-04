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
import TextSettingsPanelMobile from "../components/new-ui/Text-Panel";

const getDynamicConstants = () => {
  const { SLIDE_WIDTH, SLIDE_HEIGHT, LEFT_PADDING } = getSlideDimensions();
  const IMAGE_WIDTH = 200;
  const IMAGE_HEIGHT = 190;
  const IMAGE_PADDING = 0;
  const textMaxWidth =
    SLIDE_WIDTH - IMAGE_WIDTH - IMAGE_PADDING - LEFT_PADDING - 100;
  const textMaxHeight = SLIDE_HEIGHT - 60 - 20;
  return {
    SLIDE_WIDTH,
    SLIDE_HEIGHT,
    IMAGE_HEIGHT,
    LEFT_PADDING,
    IMAGE_WIDTH,
    IMAGE_PADDING,
    textMaxWidth,
    textMaxHeight,
  };
};

const SlideEditor = ({ slides = [], stageRefs, onClearCanvas }: any) => {
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
      const newElements = [...(slide.elements || [])];
      const elementsToAdd = [];

      // Add image if missing
      if (
        slide.image_url &&
        !newElements.some(
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
            x: getDynamicConstants().SLIDE_WIDTH - 250,
            y: getSlideDimensions().SLIDE_HEIGHT - 250,
            width: getDynamicConstants().IMAGE_WIDTH,
            height: getDynamicConstants().IMAGE_HEIGHT,
          },
        };
        elementsToAdd.push(defaultImageElement);
      }

      // // Add title text if missing
      // const title = slide.slide_title;
      // if (
      //   title?.text &&
      //   !newElements.some((el: any) => el.text === title.text)
      // ) {
      //   const defaultTextElement = {
      //     element_type: "text",
      //     konva_component: "Konva.Text",
      //     element_id: uuidv4(),
      //     text: title.text,
      //     properties: {
      //       ...title.properties,
      //       x: getDynamicConstants().LEFT_PADDING,
      //       y: 25,
      //       width: 20,
      //       opacity: 1,
      //       fill: "#000000",
      //       align: title.properties?.align ?? "left",
      //       fontSize: 14,
      //       fontFamily: "Roboto",
      //     },
      //   };
      //   elementsToAdd.push(defaultTextElement);
      // }

      // if (
      //   !newElements.some((el: any) => el.element_type === "bullet_point") &&
      //   Array.isArray(slide.bullets)
      // ) {
      //   slide.bullets.forEach((bullet: any, i: number) => {
      //     const defaultBulletElement = {
      //       element_type: "bullet_point",
      //       konva_component: "Konva.Text",
      //       element_id: uuidv4(),
      //       text: bullet.text,
      //       properties: {
      //         x: getDynamicConstants().LEFT_PADDING + 10,
      //         y: 52 + i * 20,
      //         fontSize: 12,
      //         fontFamily: "Roboto",
      //         fontWeight: "normal",
      //         align: "left",
      //         fill: "#444",
      //         width: window.innerWidth - 200,
      //         opacity: 1,
      //       },
      //     };
      //     elementsToAdd.push(defaultBulletElement);
      //   });
      // }

      return {
        ...slide,
        elements: [...newElements, ...elementsToAdd],
        image_url: null,
      };
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
  const BASE_SLIDE_WIDTH = 960;
  const BASE_SLIDE_HEIGHT = 540;

  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      const padding = 32; // Adjust as needed
      const maxWidth = window.innerWidth - padding;
      const maxHeight = window.innerHeight - 290; // Reserve top/bottom UI space

      const widthScale = maxWidth / BASE_SLIDE_WIDTH;
      const heightScale = maxHeight / BASE_SLIDE_HEIGHT;

      setScale(Math.min(widthScale, heightScale));
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

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
          }}
        >
          {slides.map((slide: any, index: number) => {
            const title = slide.slide_title;
            const titleProps = title.properties;
            const titleY = 30;
            const bulletGap = 7;
            const bulletStartY = 60;

            console.log(`[SlideEditorMobile] Title ${index} properties:`, {
              fontFamily: titleProps.fontFamily,
              fontSize: titleProps.fontSize,
              fontWeight: titleProps.fontWeight,
              align: titleProps.align,
              text: title.text,
            });

            return (
              <Box
                key={slide.slide_id}
                sx={{
                  width: `${window.innerWidth - 67}px`,
                  height: {
                    xs: `${window.innerHeight - 320}px`,
                    md: `${SLIDE_HEIGHT + 100}px`,
                  },
                  border: "1px solid #ccc",
                  backgroundColor: "#fff",
                  position: "fixed",
                  mb: 1.7,
                  display: index === selectedIndex ? "block" : "none",
                  align: "center",
                  marginLeft: "auto",
                  marginRight: "auto",
                  marginTop: "auto",
                  marginBottom: "auto",
                }}
              >
                <Stage
                  width={window.innerWidth - 69}
                  height={window.innerHeight - 323}
                  ref={(ref: any) => {
                    stageRefs.current[index] =
                      ref?.getStage()?.content?.querySelector("canvas") || null;
                  }}
                  onMouseDown={(e) => {
                    const clickedOnEmpty =
                      e.target === e.target.getStage() ||
                      e.target.name() === "background";
                    if (clickedOnEmpty) {
                      console.log("[SlideEditor] Deselect all on empty click");
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
                      console.log("[SlideEditor] Deselect all on empty touch");
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
                      listening={false}
                    />
                    {title.text && (
                      <KonvaTextEditor
                        key={`title-${index}-${titleProps.fontFamily || "Roboto"
                          }-${titleProps.fontSize || 18}-${titleProps.fontWeight || "normal"
                          }-${titleProps.align || "left"}-${titleProps.fontStyle || "normal"
                          }-${titleProps.fill || "#000"}-${titleProps.opacity || 1
                          }`}
                        id={`title-${index}`}
                        text={title.text}
                        x={titleProps.x || LEFT_PADDING}
                        y={titleProps.y || titleY}
                        width={(() => {
                          const textWidth = getDynamicConstants().textMaxWidth;
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
                          return Math.min(
                            textWidth + 200,
                            window.innerWidth - 80
                          );
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
                            y: (titleProps.y || titleY) - 40,
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
                          width={window.innerWidth - 100}
                          opacity={el.properties.opacity}
                          align={el.properties.align}
                          verticalAlign={el.properties.verticalAlign}
                          wrap="word"
                          fontSize={el.properties.fontSize || 10}
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
                          const isBullet = el.element_type === "bullet_point";
                          const fontSize =
                            el.properties.fontSize ||
                            (el.element_type === "bullet_point" ? 12 : 10);

                          console.log(el.properties.fontSize);
                          const fontFamily =
                            selectedTheme?.font || el.properties.fontFamily;
                          const lineHeight = 1;
                          const bulletText = isBullet ? `${el.text}` : el.text;

                          const textWidth = window.innerWidth - 200;
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
                            x={getDynamicConstants().SLIDE_WIDTH - 250}
                            y={getDynamicConstants().SLIDE_HEIGHT - 250}
                            width={getSlideDimensions().IMAGE_WIDTH}
                            height={getSlideDimensions().IMAGE_HEIGHT}
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
