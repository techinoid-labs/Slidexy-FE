"use client";

import React, { useEffect, useState } from "react";
import { Stage, Layer, Rect, Image as KonvaImage } from "react-konva";
import useImage from "use-image";
import { Box } from "@mui/material";
import SlideImage from "./KonvaComponents/KonvaSlideImage";
import KonvaTextEditor from "./KonvaComponents/KonvaTextEditor";
import { dummyData } from "./dummy";
import { useSlideThemeContext } from "@/app/context/ThemeContext";
import SlidePreviews from "./slidesPreview";
import { useDispatch } from "react-redux";
import KonvaShapeRenderer from "./KonvaComponents/KonvaShapesRenderer";
import { useSlides } from "../context/SlidesContext";
import {
  getRandomSlide,
  getLayoutProps,
  SLIDE_WIDTH,
  SLIDE_HEIGHT,
  LEFT_PADDING,
} from "../../utils/slideUtils";
import { v4 as uuidv4 } from "uuid";
const IMAGE_WIDTH = 500;
const IMAGE_PADDING = 2;
const textMaxWidth = SLIDE_WIDTH - IMAGE_WIDTH - IMAGE_PADDING - LEFT_PADDING;

const SlideEditor = ({ slides = [], stageRefs }: any) => {
  const {
    selectedImageIndex,
    setSelectedImageIndex,
    setSelectedImage,
    selectedTextId,
    setSelectedTextId,
    selectedShapeIndex,
    setSelectedShapeIndex,
    setSlides,
  } = useSlides();
  const { selectedTheme, selectedLayout } = useSlideThemeContext();
  const [bgImage] = useImage(selectedTheme?.image_url || "");
  const [selectedIndex, setSelectedIndex] = useState(0);

  console.log(slides);
  const [useDummy] = useState(false);

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

  // useEffect(() => {
  //   if (!slides || slides.length === 0) return;

  //   const normalizedSlides = slides.map((slide: any) => {
  //     if (
  //       slide.image_url &&
  //       !slide.elements?.some(
  //         (el: any) =>
  //           el.element_type === "image" &&
  //           el.konva_component === "Konva.Image" &&
  //           el.properties.imageSrc === slide.image_url
  //       )
  //     ) {
  //       const defaultImageElement = {
  //         element_type: "image",
  //         konva_component: "Konva.Image",
  //         element_id: uuidv4(),
  //         properties: {
  //           imageSrc: slide.image_url,
  //           x: SLIDE_WIDTH - 480,
  //           y: (SLIDE_HEIGHT - 400) / 2,
  //           width: 480,
  //           height: 400,
  //         },
  //       };
  //       return {
  //         ...slide,
  //         elements: [...(slide.elements || []), defaultImageElement],
  //         // image_url: null,
  //       };
  //     }
  //     return slide;
  //   });

  //   if (JSON.stringify(slides) !== JSON.stringify(normalizedSlides)) {
  //     setSlides(normalizedSlides);
  //   }
  // }, [slides]);

  return (
    <main
      style={{
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          flexGrow: 1,
          overflowY: "auto",
          padding: 16,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {slides.map((slide: any, index: number) => {
            const title = slide.slide_title;
            const titleProps = title.properties;
            const titleY = 25;
            const bulletGap = 10;
            const bulletStartY = titleY + titleProps.fontSize + 20;

            return (
              <Box
                key={slide.slide_id}
                sx={{
                  width: `${SLIDE_WIDTH}px`,
                  height: `${SLIDE_HEIGHT}px`,
                  border: "1px solid #ccc",
                  backgroundColor: "#fff",
                  position: "relative",
                  mb: 1,
                  display: index === selectedIndex ? "block" : "none",
                }}
              >
                <Stage
                  width={SLIDE_WIDTH}
                  height={SLIDE_HEIGHT}
                  ref={(ref: any) => {
                    stageRefs.current[index] =
                      ref?.getStage()?.content?.querySelector("canvas") || null;
                  }}
                  onMouseDown={(e) => {
                    const clickedOnEmpty =
                      e.target === e.target.getStage() ||
                      e.target.name() === "background";
                    if (clickedOnEmpty) {
                      setSelectedTextId(null);
                      setSelectedImageIndex(null);
                      setSelectedShapeIndex(null);
                      setSelectedImage(null);
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

                    {title.text && (
                      <>
                        <KonvaTextEditor
                          id={`title-${index}`}
                          text={title.text}
                          x={LEFT_PADDING}
                          y={titleY}
                          width={textMaxWidth}
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
                            setSelectedTextId(`title-${index}`);
                            setSelectedImageIndex(null);
                            setSelectedShapeIndex(null);
                            setSelectedImage(null);
                          }}
                        />
                      </>
                    )}
                    {slide.elements.map((el: any, i: number) => {
                      if (el.element_type !== "text") return null;

                      return (
                        <KonvaTextEditor
                          key={`el-${index}-${i}`}
                          id={`el-${index}-${i}`}
                          text={el.text}
                          x={el.properties.x || LEFT_PADDING}
                          y={el.properties.y || 300}
                          width={el.properties.width || textMaxWidth}
                          opacity={el.properties.opacity}
                          align={el.properties.align}
                          verticalAlign={el.properties.verticalAlign}
                          wrap="word"
                          fontSize={el.properties.fontSize}
                          fill={
                            !el.useThemeColor
                              ? el.properties.fill
                              : selectedTheme?.primaryColor
                          }
                          fontStyle={el.properties.fontStyle}
                          fontWeight={el.properties.fontWeight}
                          fontFamily={el.properties.fontFamily}
                          isSelected={selectedTextId === `el-${index}-${i}`}
                          onSelect={() => {
                            setSelectedTextId(`el-${index}-${i}`);
                            setSelectedImageIndex(null);
                            setSelectedShapeIndex(null);
                            setSelectedImage(null);
                          }}
                        />
                      );
                    })}

                    {(() => {
                      let currentY = bulletStartY + 70;

                      return slide.elements
                        .filter((el: any) => el.element_type === "bullet_point")
                        .map((el: any, i: number) => {
                          const isBullet = el.element_type === "bullet_point";
                          const fontSize = el.properties.fontSize;
                          const fontFamily =
                            selectedTheme?.font || el.properties.fontFamily;
                          const lineHeight = 1.2;
                          const bulletText = isBullet ? `${el.text}` : el.text;

                          const textWidth = textMaxWidth - (isBullet ? 20 : 0);
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
                              key={`el-${index}-${i}`}
                              id={`el-${index}-${i}`}
                              text={bulletText}
                              x={LEFT_PADDING + (isBullet ? 20 : 0)}
                              y={currentY}
                              opacity={el.properties.opacity}
                              align={el.properties.align}
                              width={textWidth}
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
          <SlidePreviews
            slides={slides}
            selectedIndex={selectedIndex}
            slide_width={SLIDE_WIDTH}
            onSelect={setSelectedIndex}
            onAddSlide={handleAddSlide}
            onDeleteSlide={handleDeleteSlide}
          />
        </Box>
      </div>
    </main>
  );
};

export default SlideEditor;
