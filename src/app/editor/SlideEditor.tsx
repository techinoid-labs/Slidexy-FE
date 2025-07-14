// "use client";

// import React, { useEffect, useRef, useState } from "react";
// import { Stage, Layer, Rect, Image as KonvaImage } from "react-konva";
// import useImage from "use-image";
// import { Box } from "@mui/material";
// import SlideImage from "./KonvaComponents/KonvaSlideImage";
// import KonvaTextEditor from "./KonvaComponents/KonvaTextEditor";
// import { dummyData } from "./dummy";
// import { useSlideThemeContext } from "@/app/context/ThemeContext";
// import SlidePreviews from "./slidesPreview";
// import { useDispatch } from "react-redux";
// import { setSlides } from "../slice/slidesSlice";
// import KonvaShapeRenderer from "./KonvaComponents/KonvaShapesRenderer";
// import { useSlides } from "../context/SlidesContext";
// import {
//   SLIDE_WIDTH,
//   SLIDE_HEIGHT,
//   LEFT_PADDING,
//   getRandomSlide,
//   getLayoutProps,
// } from "../../../utils/slideUtils";

// const IMAGE_WIDTH = 400;
// const IMAGE_PADDING = 40;

// interface SlideEditorProps {
//   slides: any[];
//   stageRefs: any;
// }

// const SlideEditor = ({ slides = [], stageRefs }: SlideEditorProps) => {
//   const containerRef = useRef<HTMLDivElement | null>(null);
//   const [canvasScale, setCanvasScale] = useState(1);

//   const dispatch = useDispatch();
//   const {
//     selectedImageIndex,
//     setSelectedImageIndex,
//     setSelectedImage,
//     selectedTextId,
//     setSelectedTextId,
//   } = useSlides();

//   const { selectedTheme, selectedLayout } = useSlideThemeContext();
//   const [bgImage] = useImage(selectedTheme?.image_url || "");
//   const [selectedIndex, setSelectedIndex] = useState(0);
//   const [selectedShapeIndex, setSelectedShapeIndex] = useState<number | null>(
//     null
//   );

//   const handleAddSlide = () => {
//     const newSlide = getRandomSlide();
//     const newSlides = [...slides, newSlide];
//     dispatch(setSlides(newSlides));
//     setSelectedIndex(newSlides.length - 1);
//   };

//   const handleDeleteSlide = (index: number) => {
//     const newSlides = [...slides];
//     newSlides.splice(index, 1);
//     dispatch(setSlides(newSlides));
//     if (selectedIndex >= newSlides.length) {
//       setSelectedIndex(Math.max(0, newSlides.length - 1));
//     }
//   };

//   // ⬇ Normalize image_url into image element
//   useEffect(() => {
//     if (!slides || slides.length === 0) return;

//     const normalizedSlides = slides.map((slide: any) => {
//       let updatedElements = [...(slide.elements || [])];

//       if (
//         slide.image_url &&
//         !updatedElements.some(
//           (el: any) =>
//             el.element_type === "image" &&
//             el.konva_component === "Konva.Image" &&
//             el.properties.imageSrc === slide.image_url
//         )
//       ) {
//         const defaultImageElement = {
//           element_type: "image",
//           konva_component: "Konva.Image",
//           properties: {
//             imageSrc: slide.image_url,
//             x: SLIDE_WIDTH - 480,
//             y: (SLIDE_HEIGHT - 400) / 2,
//             width: 480,
//             height: 400,
//           },
//         };
//         updatedElements.push(defaultImageElement);
//         slide.image_url = null;
//       }

//       // ⬇ Normalize slide_title into text element
//       if (
//         slide.slide_title &&
//         !updatedElements.some(
//           (el: any) => el.element_type === "text" && el._isTitle
//         )
//       ) {
//         updatedElements.unshift({
//           element_type: "text",
//           konva_component: "Konva.Text",
//           _isTitle: true, // helps differentiate it in rendering if needed
//           text: slide.slide_title.text,
//           properties: {
//             ...slide.slide_title.properties,
//             align: slide.slide_title.properties.align || "left",
//             verticalAlign: slide.slide_title.properties.verticalAlign || "top",
//           },
//         });
//         slide.slide_title = null;
//       }

//       return {
//         ...slide,
//         elements: updatedElements,
//       };
//     });

//     if (JSON.stringify(slides) !== JSON.stringify(normalizedSlides)) {
//       dispatch(setSlides(normalizedSlides));
//     }
//   }, [slides, dispatch]);

//   useEffect(() => {
//     const updateSize = () => {
//       if (containerRef.current) {
//         const containerWidth = containerRef.current.offsetWidth;
//         const scale = containerWidth / SLIDE_WIDTH;
//         setCanvasScale(scale > 1 ? 1 : scale);
//       }
//     };

//     updateSize();
//     window.addEventListener("resize", updateSize);
//     return () => window.removeEventListener("resize", updateSize);
//   }, []);

//   return (
//     <main
//       style={{
//         flexGrow: 1,
//         display: "flex",
//         flexDirection: "column",
//         overflow: "hidden",
//       }}
//     >
//       <div
//         id="text-editor-layer"
//         style={{ position: "absolute", top: 0, left: 0 }}
//       />
//       <div
//         style={{
//           flexGrow: 1,
//           overflowY: "auto",
//           padding: 16,
//           display: "flex",
//           justifyContent: "center",
//         }}
//       >
//         <Box
//           sx={{
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//           }}
//         >
//           {slides.map((slide: any, index: number) => {
//             const layoutProps = getLayoutProps(selectedLayout);
//             const bulletGap = 10;
//             let currentY = layoutProps.bullets.y;

//             const getAlignedX = (align: string | undefined, width: number) => {
//               if (align === "center") return (SLIDE_WIDTH - width) / 2;
//               if (align === "right") return SLIDE_WIDTH - width - LEFT_PADDING;
//               return LEFT_PADDING;
//             };

//             const getAlignedY = (
//               verticalAlign: string | undefined,
//               height: number,
//               defaultY: number
//             ) => {
//               if (verticalAlign === "middle")
//                 return (SLIDE_HEIGHT - height) / 2;
//               if (verticalAlign === "bottom")
//                 return SLIDE_HEIGHT - height - LEFT_PADDING;
//               return defaultY;
//             };

//             return (
//               <Box
//                 key={slide.slide_id}
//                 sx={{
//                   width: `${SLIDE_WIDTH}px`,
//                   height: `${SLIDE_HEIGHT}px`,
//                   border: "1px solid #ccc",
//                   backgroundColor: "#fff",
//                   position: "relative",
//                   mb: 1,
//                   display: index === selectedIndex ? "block" : "none",
//                 }}
//               >
//                 <div
//                   ref={containerRef}
//                   style={{ width: "100%", maxWidth: 960 }}
//                 >
//                   <Stage
//                     width={SLIDE_WIDTH}
//                     height={SLIDE_HEIGHT}
//                     ref={(ref: any) => {
//                       stageRefs.current[index] =
//                         ref?.getStage()?.content?.querySelector("canvas") ||
//                         null;
//                     }}
//                     onMouseDown={(e) => {
//                       const clickedOnEmpty =
//                         e.target === e.target.getStage() ||
//                         e.target.name() === "background";
//                       if (clickedOnEmpty) {
//                         setSelectedTextId(null);
//                         setSelectedImageIndex(null);
//                         setSelectedShapeIndex(null);
//                         setSelectedImage(null);
//                       }
//                     }}
//                   >
//                     <Layer>
//                       {selectedTheme?.image_url && bgImage ? (
//                         <KonvaImage
//                           image={bgImage}
//                           x={0}
//                           y={0}
//                           width={SLIDE_WIDTH}
//                           height={SLIDE_HEIGHT}
//                         />
//                       ) : (
//                         <Rect
//                           name="background"
//                           x={0}
//                           y={0}
//                           width={SLIDE_WIDTH}
//                           height={SLIDE_HEIGHT}
//                           fill={selectedTheme?.backgroundColor || "#fff"}
//                         />
//                       )}

//                       {/* All text elements including title */}
//                       {slide.elements?.map((el: any, i: number) => {
//                         if (el.konva_component === "Konva.Text") {
//                           const y = el._isTitle
//                             ? layoutProps.title.y
//                             : getAlignedY(
//                                 el.properties.verticalAlign,
//                                 50,
//                                 currentY
//                               );
//                           const width = el.properties.width || 800;
//                           const x = getAlignedX(el.properties.align, width);

//                           const textElement = (
//                             <KonvaTextEditor
//                               key={`el-${index}-${i}`}
//                               id={`el-${index}-${i}`}
//                               text={el.text}
//                               x={x}
//                               y={y}
//                               width={width}
//                               wrap="word"
//                               fontSize={el.properties.fontSize}
//                               fontFamily={
//                                 selectedTheme?.font || el.properties.fontFamily
//                               }
//                               fill={
//                                 selectedTheme?.primaryColor ||
//                                 el.properties.fill
//                               }
//                               fontStyle={el.properties.fontStyle}
//                               fontWeight={el.properties.fontWeight}
//                               align={el.properties.align}
//                               opacity={el.properties.opacity}
//                               isSelected={selectedTextId === `el-${index}-${i}`}
//                               onSelect={() => {
//                                 setSelectedTextId(`el-${index}-${i}`);
//                                 setSelectedImageIndex(null);
//                                 setSelectedShapeIndex(null);
//                                 setSelectedImage(null);
//                               }}
//                             />
//                           );

//                           if (!el._isTitle) {
//                             currentY +=
//                               (el.properties.fontSize || 18) + bulletGap;
//                           }

//                           return textElement;
//                         }
//                       })}

//                       {/* Image layout */}
//                       {layoutProps.image &&
//                         slide.image_url &&
//                         selectedLayout !== 5 && (
//                           <SlideImage
//                             url={slide.image_url}
//                             x={layoutProps.image.x}
//                             y={layoutProps.image.y}
//                             width={layoutProps.image.width}
//                             height={layoutProps.image.height}
//                             isSelected={selectedImageIndex === index}
//                             onSelect={() => setSelectedImageIndex(index)}
//                           />
//                         )}

//                       {/* Shapes */}
//                       <KonvaShapeRenderer
//                         elements={slide.elements}
//                         selectedShapeIndex={selectedShapeIndex}
//                         onSelectShape={(i) => {
//                           setSelectedShapeIndex(i);
//                           setSelectedTextId(null);
//                           setSelectedImageIndex(null);
//                           setSelectedImage(null);
//                         }}
//                       />

//                       {/* Element-based images */}
//                       {slide.elements.map((el: any, i: number) => {
//                         if (
//                           el.element_type === "image" &&
//                           el.konva_component === "Konva.Image"
//                         ) {
//                           return (
//                             <SlideImage
//                               key={`image-${i}`}
//                               imageSrc={el.properties.imageSrc}
//                               x={el.properties.x}
//                               y={el.properties.y}
//                               width={el.properties.width}
//                               height={el.properties.height}
//                               isSelected={selectedImageIndex === i}
//                               onSelect={() => {
//                                 setSelectedImage({ ...el });
//                                 setSelectedImageIndex(i);
//                                 setSelectedShapeIndex(null);
//                                 setSelectedTextId(null);
//                               }}
//                             />
//                           );
//                         }
//                       })}
//                     </Layer>
//                   </Stage>
//                 </div>
//               </Box>
//             );
//           })}

//           <SlidePreviews
//             slides={slides}
//             selectedIndex={selectedIndex}
//             slide_width={SLIDE_WIDTH}
//             onSelect={setSelectedIndex}
//             onAddSlide={handleAddSlide}
//             onDeleteSlide={handleDeleteSlide}
//           />
//         </Box>
//       </div>
//     </main>
//   );
// };

// export default SlideEditor;

"use client";

import React, { useEffect, useRef, useState } from "react";
import { Stage, Layer, Rect, Image as KonvaImage } from "react-konva";
import useImage from "use-image";
import { Box } from "@mui/material";
import SlideImage from "./KonvaComponents/KonvaSlideImage";
import KonvaTextEditor from "./KonvaComponents/KonvaTextEditor";
import { dummyData } from "./dummy";
import { useSlideThemeContext } from "@/app/context/ThemeContext";
import SlidePreviews from "./slidesPreview";
import { useDispatch } from "react-redux";
import { setSlides } from "../slice/slidesSlice";
import KonvaShapeRenderer from "./KonvaComponents/KonvaShapesRenderer";
import { useSlides } from "../context/SlidesContext";

const SLIDE_WIDTH = 920;
const SLIDE_HEIGHT = 430;
const LEFT_PADDING = 60;
const IMAGE_WIDTH = 400;
const IMAGE_PADDING = 40;
const textMaxWidth = SLIDE_WIDTH - IMAGE_WIDTH - IMAGE_PADDING - LEFT_PADDING;

const getRandomSlide = () => {
  const titles = [
    "5 Ways to Boost Productivity",
    "Understanding AI in 2025",
    "Why Design Thinking Works",
    "Top Marketing Trends This Year",
    "The Future of Remote Work",
  ];

  const bullets = [
    "Keep tasks short and focused",
    "Automate where possible",
    "Use data to drive decisions",
    "Stay aligned with team goals",
    "Prioritize clarity over complexity",
    "Break problems into smaller chunks",
    "Embrace flexible tooling",
    "Focus on outcomes, not outputs",
    "Be user-first in every decision",
  ];

  const getRandomBullets = (count: number) =>
    Array.from({ length: count }, () => {
      const text = bullets[Math.floor(Math.random() * bullets.length)];
      return {
        element_type: "bullet_point",
        text,
        konva_component: "Konva.Text",
        properties: {
          fontSize: 18,
          fontFamily: "Inter",
          fill: "#444",
          fontStyle: "normal",
        },
      };
    });

  return {
    slide_id: `slide-${Date.now()}`,
    slide_title: {
      text: titles[Math.floor(Math.random() * titles.length)],
      properties: {
        fontSize: 24,
        fontFamily: "Arial",
        fill: "#000",
        fontStyle: "normal",
      },
    },
    elements: getRandomBullets(3),
    image_url: "/images/create-presentation/new-slide-img.png",
  };
};

interface SlideEditorProps {
  slides: any[];
  stageRefs: any;
}

const SlideEditor = ({ slides = [], stageRefs }: SlideEditorProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [canvasScale, setCanvasScale] = useState(1);

  const SLIDE_WIDTH = 920;
  const SLIDE_HEIGHT = 430;

  const dispatch = useDispatch();
  const {
    selectedImageIndex,
    setSelectedImageIndex,
    setSelectedImage,
    selectedTextId,
    setSelectedTextId,
  } = useSlides();

  const { selectedTheme, selectedLayout } = useSlideThemeContext();
  const [bgImage] = useImage(selectedTheme?.image_url || "");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedShapeIndex, setSelectedShapeIndex] = useState<number | null>(
    null
  );
  const [useDummy] = useState(false);

  // useEffect(() => {
  //   if (slides.length === 0 && useDummy) {
  //     dispatch(setSlides(dummyData));
  //   }
  // }, [dispatch, slides.length]);

  const handleAddSlide = () => {
    const newSlide = getRandomSlide();
    // Store initial state for this slide
    // newSlide._initialState = structuredClone(newSlide);
    const newSlides = [...slides, newSlide];
    dispatch(setSlides(newSlides));
    setSelectedIndex(newSlides.length - 1);
  };

  const handleDeleteSlide = (index: number) => {
    const newSlides = [...slides];
    newSlides.splice(index, 1);
    dispatch(setSlides(newSlides));
    if (selectedIndex >= newSlides.length) {
      setSelectedIndex(Math.max(0, newSlides.length - 1));
    }
  };

  useEffect(() => {
    if (!slides || slides.length === 0) return; // ⛔️ Skip if no slides

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
          properties: {
            imageSrc: slide.image_url,
            x: SLIDE_WIDTH - 480,
            y: (SLIDE_HEIGHT - 400) / 2,
            width: 480,
            height: 400,
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
      dispatch(setSlides(normalizedSlides));
    }
  }, [slides, dispatch]);
  // Layout logic
  const getLayoutProps = (layout: number) => {
    // Returns { image: {x, y, width, height}, title: {x, y}, bullets: {x, y} }
    switch (layout) {
      case 0: // image down, text above
        return {
          image: { x: 100, y: 500, width: 700, height: 220 },
          title: { x: LEFT_PADDING, y: 60 },
          bullets: { x: LEFT_PADDING, y: 180 },
        };
      case 1: // image up, text below
        return {
          image: { x: 100, y: 60, width: 700, height: 220 },
          title: { x: LEFT_PADDING, y: 350 },
          bullets: { x: LEFT_PADDING, y: 420 },
        };
      case 2: // image right, text left
        return {
          image: { x: 900, y: 100, width: 320, height: 520 },
          title: { x: LEFT_PADDING, y: 100 },
          bullets: { x: LEFT_PADDING, y: 200 },
        };
      case 3: // image left, text right
        return {
          image: { x: 60, y: 100, width: 320, height: 520 },
          title: { x: 500, y: 100 },
          bullets: { x: 500, y: 200 },
        };
      case 4: // image center, title above, bullets below
        return {
          image: {
            x: (SLIDE_WIDTH - 500) / 2,
            y: 300,
            width: 500,
            height: 200,
          },
          title: { x: (SLIDE_WIDTH - 900) / 2, y: 80 },
          bullets: { x: (SLIDE_WIDTH - 900) / 2, y: 540 },
        };
      case 5: // text only
        return {
          image: null,
          title: { x: LEFT_PADDING, y: 100 },
          bullets: { x: LEFT_PADDING, y: 200 },
        };
      default:
        return {
          image: {
            x: SLIDE_WIDTH - 700,
            y: (SLIDE_HEIGHT - 600) / 2,
            width: 700,
            height: 600,
          },
          title: { x: LEFT_PADDING, y: 60 },
          bullets: { x: LEFT_PADDING, y: 180 },
        };
    }
  };

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const scale = containerWidth / SLIDE_WIDTH;
        setCanvasScale(scale > 1 ? 1 : scale); // Prevent upscaling
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

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
        id="text-editor-layer"
        style={{ position: "absolute", top: 0, left: 0 }}
      ></div>

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
            const layoutProps = getLayoutProps(selectedLayout);
            const bulletGap = 10;
            let currentY = layoutProps.bullets.y;
            const textMaxWidth =
              selectedLayout === 2 || selectedLayout === 3
                ? 250
                : SLIDE_WIDTH - IMAGE_WIDTH - IMAGE_PADDING - LEFT_PADDING;

            // Helper to calculate x based on align
            const getAlignedX = (align: string | undefined, width: number) => {
              if (align === "center") {
                return (SLIDE_WIDTH - width) / 2;
              } else if (align === "right") {
                return SLIDE_WIDTH - width - LEFT_PADDING;
              } else {
                return LEFT_PADDING;
              }
            };

            // Helper to calculate y based on verticalAlign
            const getAlignedY = (
              verticalAlign: string | undefined,
              height: number,
              defaultY: number
            ) => {
              if (verticalAlign === "middle") {
                return (SLIDE_HEIGHT - height) / 2;
              } else if (verticalAlign === "bottom") {
                return SLIDE_HEIGHT - height - LEFT_PADDING;
              } else {
                return defaultY;
              }
            };

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
                <div
                  ref={containerRef}
                  style={{ width: "100%", maxWidth: 960 }}
                >
                  <Stage
                    width={SLIDE_WIDTH}
                    height={SLIDE_HEIGHT}
                    ref={(ref: any) => {
                      stageRefs.current[index] =
                        ref?.getStage()?.content?.querySelector("canvas") ||
                        null;
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

                      {/* Slide Title */}
                      {title.text && (
                        <KonvaTextEditor
                          id={`title-${index}`}
                          text={title.text}
                          x={getAlignedX(titleProps.align, textMaxWidth)}
                          y={getAlignedY(
                            titleProps.verticalAlign,
                            50,
                            layoutProps.title.y
                          )}
                          width={textMaxWidth}
                          wrap="word"
                          fontSize={titleProps.fontSize}
                          fontFamily={
                            selectedTheme?.font || titleProps.fontFamily
                          }
                          fill={selectedTheme?.primaryColor || titleProps.fill}
                          fontStyle={titleProps.fontStyle}
                          fontWeight={titleProps.fontWeight}
                          align={titleProps.align}
                          opacity={titleProps.opacity}
                          isSelected={selectedTextId === `title-${index}`}
                          onSelect={() => {
                            setSelectedTextId(`title-${index}`);
                            setSelectedImageIndex(null);
                            setSelectedShapeIndex(null);
                            setSelectedImage(null);
                          }}
                        />
                      )}

                      {/* Bullets/Text Elements */}
                      {slide.elements &&
                        slide.elements
                          .filter(
                            (el: any) =>
                              el.element_type === "bullet_point" ||
                              el.element_type === "text"
                          )
                          .map((el: any, i: number) => {
                            const y = currentY;
                            const elAlign = el.properties.align;
                            const elWidth = el.properties.width || textMaxWidth;
                            const elVerticalAlign = el.properties.verticalAlign;
                            const editor = (
                              <KonvaTextEditor
                                key={`el-${index}-${i}`}
                                id={`el-${index}-${i}`}
                                text={el.text}
                                x={getAlignedX(elAlign, elWidth)}
                                y={getAlignedY(elVerticalAlign, 50, y)}
                                width={elWidth}
                                wrap="word"
                                fontSize={el.properties.fontSize}
                                fontFamily={
                                  selectedTheme?.font ||
                                  el.properties.fontFamily
                                }
                                fill={
                                  selectedTheme?.primaryColor ||
                                  el.properties.fill
                                }
                                fontStyle={el.properties.fontStyle}
                                fontWeight={el.properties.fontWeight}
                                align={el.properties.align}
                                opacity={el.properties.opacity}
                                isSelected={
                                  selectedTextId === `el-${index}-${i}`
                                }
                                onSelect={() => {
                                  setSelectedTextId(`el-${index}-${i}`);
                                  setSelectedImageIndex(null);
                                  setSelectedShapeIndex(null);
                                  setSelectedImage(null);
                                }}
                              />
                            );
                            currentY +=
                              (el.properties.fontSize || 18) + bulletGap;
                            return editor;
                          })}

                      {/* Image Layouts */}
                      {layoutProps.image &&
                        slide.image_url &&
                        selectedLayout !== 5 && (
                          <SlideImage
                            url={slide.image_url}
                            x={layoutProps.image.x}
                            y={layoutProps.image.y}
                            width={layoutProps.image.width}
                            height={layoutProps.image.height}
                            isSelected={selectedImageIndex === index}
                            onSelect={() => setSelectedImageIndex(index)}
                          />
                        )}

                      {/* Shapes */}
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
                              // flipHorizontal={el.properties.flipHorizontal}
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
                </div>
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
