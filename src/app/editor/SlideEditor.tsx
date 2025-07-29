"use client";

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

// const getDefaultPosition = (elementType: string) => {
//   switch (elementType) {
//     case "title":
//     case "slide_title":
//       return { x: getDynamicConstants().LEFT_PADDING, y: 25 };
//     case "bullet_point":
//       const isBullet = elementType === "bullet_point";

//       const bulletStartY = 25 + 38 + 20;
//       let currentY = bulletStartY + 70;

//       return {
//         x: getDynamicConstants().LEFT_PADDING + (isBullet ? 20 : 0),
//         y: currentY,
//       };
//     case "image":
//       return { x: 150, y: 300 };
//     default:
//       return { x: getDynamicConstants().LEFT_PADDING, y: 300 };
//   }
// };

// const IMAGE_WIDTH = 400;
// const IMAGE_PADDING = 40;
// const textMaxWidth = SLIDE_WIDTH - IMAGE_WIDTH - IMAGE_PADDING - LEFT_PADDING;

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
    setSelectedImageIndex,
    setSelectedImage,
    selectedTextId,
    setSelectedTextId,
    selectedShapeIndex,
    setSelectedShapeIndex,
    setSlides,
    isAtBoundary,
  } = useSlides();

  const { selectedTheme, selectedLayout, setSelectedTheme } =
    useSlideThemeContext();
  const [bgImage] = useImage(selectedTheme?.image_url || "");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [useDummy] = useState(false);

  console.log(slides);

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

  // const ensureElementPositioning = () => {
  //   let updated = false;

  //   const clonedSlides = structuredClone(slides); // or use lodash.cloneDeep if needed

  //   const updatedSlides = clonedSlides.map((slide: any) => {
  //     // Update title position
  //     if (
  //       slide.slide_title &&
  //       (slide.slide_title.properties?.x == null ||
  //         slide.slide_title.properties?.y == null)
  //     ) {
  //       const { x, y } = getDefaultPosition("slide_title");
  //       updated = true;
  //       slide.slide_title.properties = {
  //         ...slide.slide_title.properties,
  //         x: slide.slide_title.properties.x ?? x,
  //         y: slide.slide_title.properties.y ?? y,
  //       };
  //     }

  //     // Position bullet points with spacing logic
  //     const bulletStartY =
  //       (slide.slide_title?.properties?.y ?? 25) +
  //       (slide.slide_title?.properties?.fontSize ?? 38) +
  //       70;

  //     let currentBulletY = bulletStartY;
  //     const bulletGap = 10;
  //     const lineHeight = 1.2;

  //     slide.elements = slide.elements.map((el: any) => {
  //       if (el.element_type === "bullet_point") {
  //         const fontSize = el.properties?.fontSize ?? 20;
  //         const fontFamily =
  //           selectedTheme?.font || el.properties?.fontFamily || "Arial";
  //         const text = el.text || "";

  //         const textWidth =
  //           getDynamicConstants().textMaxWidth -
  //           (el.element_type === "bullet_point" ? 20 : 0);

  //         const canvas = document.createElement("canvas");
  //         const context = canvas.getContext("2d");
  //         context!.font = `${fontSize}px ${fontFamily}`;
  //         const words = text.split(" ");
  //         let lines: string[] = [];
  //         let line = "";

  //         for (let word of words) {
  //           const testLine = line + word + " ";
  //           const metrics = context!.measureText(testLine);
  //           if (metrics.width > textWidth && line !== "") {
  //             lines.push(line.trim());
  //             line = word + " ";
  //           } else {
  //             line = testLine;
  //           }
  //         }
  //         if (line) lines.push(line.trim());

  //         const estimatedHeight = lines.length * fontSize * lineHeight;

  //         // Set bullet position immutably
  //         updated = true;
  //         const updatedBullet = {
  //           ...el,
  //           properties: {
  //             ...el.properties,
  //             x: el.properties?.x ?? getDynamicConstants().LEFT_PADDING + 20,
  //             y: currentBulletY,
  //           },
  //         };

  //         currentBulletY += estimatedHeight + bulletGap;
  //         return updatedBullet;
  //       }

  //       // Handle other element types
  //       if (el.properties?.x == null || el.properties?.y == null) {
  //         const { x, y } = getDefaultPosition(el.element_type);
  //         updated = true;
  //         return {
  //           ...el,
  //           properties: {
  //             ...el.properties,
  //             x: el.properties.x ?? x,
  //             y: el.properties.y ?? y,
  //           },
  //         };
  //       }

  //       return el;
  //     });

  //     return slide;
  //   });

  //   if (updated) {
  //     setSlides(updatedSlides);
  //   }
  // };

  // useEffect(() => {
  //   ensureElementPositioning();
  // }, [slides?.length]); // only once on mount

  useEffect(() => {
    const positionedSlides = applyElementPositioning(slides, selectedTheme);
    setSlides(positionedSlides);
  }, [slides?.length]);

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
        const bulletGap = 10;
        const bulletStartY = titleY + titleProps.fontSize + 20;

        return (
          <Box
            key={slide.slide_id}
            sx={{
              width: `${getDynamicConstants().SLIDE_WIDTH}px`,
              height: `${getDynamicConstants().SLIDE_HEIGHT}px`,
              border: "1px solid #ccc",
              backgroundColor: "#fff",
              position: "relative",
              mb: 1,
              display: index === selectedIndex ? "block" : "none",
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
                  setSelectedTextId(null);
                  setSelectedImageIndex(null);
                  setSelectedShapeIndex(null);
                  setSelectedImage(null);
                }
              }}
              onTouchStart={(e) => {
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
                    width={getDynamicConstants().SLIDE_WIDTH}
                    height={getDynamicConstants().SLIDE_HEIGHT}
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
                    width={getDynamicConstants().SLIDE_WIDTH}
                    height={getDynamicConstants().SLIDE_HEIGHT}
                    onClick={() => {
                      setSelectedTextId(null);
                      setSelectedImageIndex(null);
                      setSelectedShapeIndex(null);
                      setSelectedImage(null);
                    }}
                    fill={selectedTheme?.backgroundColor || "#fff"}
                  />
                )}
                <Rect
                  x={0}
                  y={0}
                  width={getDynamicConstants().SLIDE_WIDTH}
                  height={window.innerHeight - 320}
                  // stroke={ isAtBoundary ? "red" : "transparent"}
                  // strokeWidth={1}
                  listening={false}
                />

                {title.text && (
                  <>
                    <KonvaTextEditor
                      id={`title-${index}`}
                      text={title.text}
                      x={titleProps.x || titleY}
                      y={titleProps.y || getDynamicConstants().LEFT_PADDING}
                      width={getDynamicConstants().textMaxWidth}
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
                {/* {slide.elements.map((el: any, i: number) => {
                  if (el.element_type !== "text") return null;
                  // console.log("title", {
                  //   x: getDynamicConstants().LEFT_PADDING,
                  //   y: 300,
                  // });
                  return (
                    <KonvaTextEditor
                      key={`el-${index}-${i}`}
                      id={`el-${index}-${i}`}
                      text={el.text}
                      x={el.properties.x || getDynamicConstants().LEFT_PADDING}
                      y={el.properties.y || 300}
                      width={
                        el.properties.width ||
                        getDynamicConstants().textMaxWidth
                      }
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

                      const textWidth =
                        getDynamicConstants().textMaxWidth -
                        (isBullet ? 20 : 0);
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
                      // console.log("BULLETS POSITION", {
                      //   x:
                      //     getDynamicConstants().LEFT_PADDING +
                      //     (isBullet ? 20 : 0),
                      //   y: currentY,
                      // });
                      const editor = (
                        <KonvaTextEditor
                          key={`el-${index}-${i}`}
                          id={`el-${index}-${i}`}
                          text={bulletText}
                          x={
                            el.properties.x ||
                            getDynamicConstants().LEFT_PADDING +
                              (isBullet ? 20 : 0)
                          }
                          y={el.properties.y || currentY}
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
                })()} */}

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
                        setSelectedTextId(`el-${index}-${i}`);
                        setSelectedImageIndex(null);
                        setSelectedShapeIndex(null);
                        setSelectedImage(null);
                      }}
                    />
                  );
                })}

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
        slide_width={getDynamicConstants().SLIDE_WIDTH}
        slide_height={getDynamicConstants().SLIDE_HEIGHT}
        onSelect={setSelectedIndex}
        onAddSlide={handleAddSlide}
        onDeleteSlide={handleDeleteSlide}
      />
    </Box>
  );

  /* </div>
    </main> 
  );
    */
};

export default SlideEditor;
