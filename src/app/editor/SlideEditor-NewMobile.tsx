// "use client";

// import React, { useEffect, useState } from "react";
// import { Stage, Layer, Rect, Image as KonvaImage } from "react-konva";
// import useImage from "use-image";
// import { Box } from "@mui/material";
// import SlideImage from "./KonvaComponents/KonvaSlideImageMobile";
// import KonvaTextEditor from "./KonvaComponents/KonvaTextEditorMobile";
// import { useSlideThemeContext } from "@/app/context/ThemeContext";
// import SlidePreviews from "./slidesPreview";
// import KonvaShapeRenderer from "./KonvaComponents/KonvaShapesRendererMobile";
// import { useSlides } from "../context/SlidesContext";
// import { getRandomSlide, getSlideDimensions } from "../../utils/slideUtils";
// import { applyElementPositioning } from "@/utils/slideTextPositioningUtils";
// import TextSettingsPanelMobile from "../components/new-ui/Text-Panel";
// import ImageSettingsPanelMobile from "../components/new-ui/Image-Panel";

// const getDynamicConstants = () => {
//     const { SLIDE_WIDTH, SLIDE_HEIGHT, LEFT_PADDING, SLIDE_HEIGHT_MOBILE, SLIDE_WIDTH_MOBILE } = getSlideDimensions();
//     const IMAGE_WIDTH = 400;
//     const IMAGE_PADDING = 40;
//     const textMaxWidth = SLIDE_WIDTH - IMAGE_WIDTH - IMAGE_PADDING - LEFT_PADDING;
//     const textMaxHeight = SLIDE_HEIGHT;
//     return {
//         SLIDE_WIDTH,
//         SLIDE_HEIGHT,
//         LEFT_PADDING,
//         IMAGE_WIDTH,
//         IMAGE_PADDING,
//         SLIDE_HEIGHT_MOBILE,
//         textMaxWidth,
//         textMaxHeight,
//         SLIDE_WIDTH_MOBILE
//     };
// };
// const SlideEditorMobile = ({ slides = [], stageRefs }: any) => {
//     const {
//         selectedImageIndex,
//         setSelectedImageIndex,
//         setSelectedImage,
//         selectedTextId,
//         setSelectedTextId,
//         selectedShapeIndex,
//         setSelectedShapeIndex,
//         setSlides,
//         isAtBoundary,
//         tooltip,
//         setTooltip,
//         isMobileImageSelected,
//         setIsMobileImageSelected,
//     } = useSlides();

//     const { selectedTheme, setSelectedTheme } = useSlideThemeContext();
//     const [bgImage] = useImage(selectedTheme?.image_url || "");
//     const [selectedIndex, setSelectedIndex] = useState(0);
//     const [dimensions, setDimensions] = useState(getDynamicConstants());
//     const [scale, setScale] = useState(1);
//     // console.log(slides);
//     // useEffect(() => {
//     //     const handleResize = () => {
//     //         setDimensions(getDynamicConstants());
//     //     };
//     //     window.addEventListener("resize", handleResize);
//     //     return () => window.removeEventListener("resize", handleResize);
//     // }, []);
//     const handleAddSlide = () => {
//         const newSlide = getRandomSlide();
//         const newSlides = [...slides, structuredClone(newSlide)];
//         setSlides(newSlides);
//         setSelectedIndex(newSlides.length - 1);
//     };

//     const handleDeleteSlide = (index: number) => {
//         const newSlides = [...slides];
//         newSlides.splice(index, 1);
//         setSlides(newSlides);
//         if (selectedIndex >= newSlides.length) {
//             setSelectedIndex(Math.max(0, newSlides.length - 1));
//         }
//     };

//     useEffect(() => {
//         const preservedThemeData = localStorage.getItem("slidesTheme");
//         if (preservedThemeData) {
//             setSelectedTheme(JSON.parse(preservedThemeData));
//         }
//     }, []);

//     useEffect(() => {
//         const positionedSlides = applyElementPositioning(slides, selectedTheme);
//         setSlides(positionedSlides);
//     }, [slides?.length]);

//     useEffect(() => {
//         const updateScale = () => {
//             const slideWidth = getDynamicConstants().SLIDE_WIDTH;
//             const slideHeight = getDynamicConstants().SLIDE_HEIGHT_MOBILE;
//             const margin = 32;
//             const availableWidth = window.innerWidth - margin;
//             const newScale = availableWidth / slideWidth;
//             setScale(Math.min(1, newScale)); // max 1x scale
//         };

//         updateScale();
//         window.addEventListener("resize", updateScale);
//         return () => window.removeEventListener("resize", updateScale);
//     }, []);

//     return (
//         <Box
//             sx={{
//                 display: "flex",
//                 flexDirection: "column",
//                 alignItems: "center",
//                 overflow: "hidden",

//             }}
//         >
//             {slides.map((slide: any, index: number) => {
//                 const title = slide.slide_title;
//                 const titleProps = title.properties;
//                 const titleY = 25;
//                 // const bulletGap = 10;
//                 // const bulletStartY = titleY + titleProps.fontSize + 20;

//                 return (
//                     <Box
//                         key={slide.slide_id}
//                         sx={{
//                             //border: "1px solid #1a1a1a",
//                             backgroundColor: "#fff",
//                             position: "relative",
//                             mb: 1,
//                             top: -15,
//                             display: index === selectedIndex ? "block" : "none",
//                             transform: `scale(${scale})`,
//                             //transformOrigin: "top left", // important to scale from top-left
//                             width: `${getDynamicConstants().SLIDE_WIDTH}px`, // must define to avoid shrink
//                             height: `${getDynamicConstants().SLIDE_HEIGHT}px`,
//                         }}
//                     >
//                         <Stage
//                             width={getDynamicConstants().SLIDE_WIDTH}
//                             height={getDynamicConstants().SLIDE_HEIGHT}

//                             ref={(ref: any) => {
//                                 stageRefs.current[index] =
//                                     ref?.getStage()?.content?.querySelector("canvas") || null;
//                             }}
//                             onMouseDown={(e) => {
//                                 const clickedOnEmpty =
//                                     e.target === e.target.getStage() ||
//                                     e.target.name() === "background";
//                                 if (clickedOnEmpty) {
//                                     setSelectedTextId(null);
//                                     setSelectedImageIndex(null);
//                                     setSelectedShapeIndex(null);
//                                     setSelectedImage(null);
//                                     setTooltip({ visible: false, x: 0, y: 0, node: null });
//                                     setIsMobileImageSelected(false);
//                                 }
//                             }}
//                             onTouchEnd={(e) => {
//                                 const clickedOnEmpty =
//                                     e.target === e.target.getStage() ||
//                                     e.target.name() === "background";

//                                 if (clickedOnEmpty) {
//                                     setSelectedTextId(null);
//                                     setSelectedImageIndex(null);
//                                     setSelectedShapeIndex(null);
//                                     setSelectedImage(null);
//                                     setTooltip({ visible: false, x: 0, y: 0, node: null });
//                                     setIsMobileImageSelected(false);
//                                 }
//                             }}
//                         >
//                             <Layer>
//                                 {selectedTheme?.image_url && bgImage ? (
//                                     <KonvaImage
//                                         image={bgImage}
//                                         x={0}
//                                         y={0}
//                                         width={getDynamicConstants().SLIDE_WIDTH}
//                                         height={getDynamicConstants().SLIDE_HEIGHT}
//                                         onClick={() => {
//                                             setSelectedTextId(null);
//                                             setSelectedImageIndex(null);
//                                             setSelectedShapeIndex(null);
//                                             setIsMobileImageSelected(false);
//                                             setSelectedImage(null);
//                                             setTooltip({
//                                                 visible: false,
//                                                 x: 0,
//                                                 y: 0,
//                                                 node: null,
//                                             });
//                                         }}
//                                     />
//                                 ) : (
//                                     <Rect
//                                         name="background"
//                                         x={0}
//                                         y={0}
//                                         width={getDynamicConstants().SLIDE_WIDTH}
//                                         height={getDynamicConstants().SLIDE_HEIGHT}
//                                         onClick={() => {
//                                             setSelectedTextId(null);
//                                             setSelectedImageIndex(null);
//                                             setSelectedShapeIndex(null);
//                                             setSelectedImage(null);
//                                             setTooltip({
//                                                 visible: false,
//                                                 x: 0,
//                                                 y: 0,
//                                                 node: null,
//                                             });
//                                         }}
//                                         fill={selectedTheme?.backgroundColor || "#fff"}
//                                     />
//                                 )}
//                                 <Rect
//                                     x={0}
//                                     y={0}
//                                     width={getDynamicConstants().SLIDE_WIDTH}
//                                     height={window.innerHeight - 320}
//                                     listening={false}
//                                 />

//                                 {title.text && (
//                                     <>
//                                         <KonvaTextEditor
//                                             key={`title-${index}-${titleProps.fontFamily || "Roboto"
//                                                 }-${titleProps.fontSize || 18}-${titleProps.fontWeight || "normal"
//                                                 }-${titleProps.align || "left"}-${titleProps.fontStyle || "normal"
//                                                 }-${titleProps.fill || "#000"}-${titleProps.opacity || 1
//                                                 }`}
//                                             id={`title-${index}`}
//                                             text={title.text}
//                                             x={titleProps.x || titleY}
//                                             y={titleProps.y || getDynamicConstants().LEFT_PADDING}
//                                             width={(() => {
//                                                 const textWidth =
//                                                     getDynamicConstants().textMaxWidth + 200;
//                                                 const canvas = document.createElement("canvas");
//                                                 const context = canvas.getContext("2d");
//                                                 const fontSize = titleProps.fontSize || 14;
//                                                 const fontFamily = titleProps.fontFamily || "Roboto";
//                                                 context!.font = `${fontSize}px ${fontFamily}`;
//                                                 const words = title.text.split(" ");
//                                                 let lines = [];
//                                                 let line = "";

//                                                 for (let word of words) {
//                                                     const testLine = line + word + " ";
//                                                     const metrics = context!.measureText(testLine);
//                                                     if (metrics.width > textWidth && line !== "") {
//                                                         lines.push(line.trim());
//                                                         line = word + " ";
//                                                     } else {
//                                                         line = testLine;
//                                                     }
//                                                 }
//                                                 if (line) lines.push(line.trim());

//                                                 // Return the calculated width with more padding and less right constraint
//                                                 return Math.min(
//                                                     textWidth + 200,
//                                                     window.innerWidth - 80
//                                                 ); // Reduced right padding constraint
//                                             })()}
//                                             // width={getDynamicConstants().textMaxWidth}
//                                             wrap="word"
//                                             fontSize={titleProps.fontSize}
//                                             fontWeight={titleProps.fontWeight}
//                                             fontFamily={titleProps.fontFamily}
//                                             opacity={titleProps.opacity}
//                                             align={titleProps.align}
//                                             verticalAlign={titleProps.verticalAlign}
//                                             fill={
//                                                 !title.useThemeColor
//                                                     ? titleProps.fill
//                                                     : selectedTheme?.primaryColor ?? "#000"
//                                             }
//                                             fontStyle={titleProps.fontStyle}
//                                             isSelected={selectedTextId === `title-${index}`}
//                                             onSelect={() => {
//                                                 setSelectedTextId(`title-${index}`);
//                                                 setSelectedImageIndex(null);
//                                                 setSelectedShapeIndex(null);
//                                                 setSelectedImage(null);
//                                                 setSelectedImage(null);
//                                                 setTooltip({
//                                                     visible: true,
//                                                     x: titleProps.x || getDynamicConstants().LEFT_PADDING + 100,
//                                                     y: (titleProps.y || titleY) - 40,
//                                                     node: null,
//                                                 });
//                                             }}
//                                         />
//                                     </>
//                                 )}
//                                 {slide.elements.map((el: any, i: number) => {
//                                     if (
//                                         el.element_type !== "text" &&
//                                         el.element_type !== "bullet_point"
//                                     )
//                                         return null;

//                                     // if (el.element_type !== "text") return null;
//                                     return (
//                                         <KonvaTextEditor
//                                             key={`el-${index}-${i}`}
//                                             id={`el-${index}-${i}`}
//                                             text={el.text}
//                                             x={el.properties.x}
//                                             y={el.properties.y}
//                                             width={
//                                                 el.properties.width ||
//                                                 getDynamicConstants().textMaxWidth -
//                                                 (el.element_type === "bullet_point" ? 20 : 0)
//                                                 // x={el.properties.x || getDynamicConstants().LEFT_PADDING}
//                                                 // y={el.properties.y || 300}
//                                                 // width={
//                                                 //   el.properties.width ||
//                                                 //   getDynamicConstants().textMaxWidth
//                                             }
//                                             opacity={el.properties.opacity}
//                                             align={el.properties.align}
//                                             verticalAlign={el.properties.verticalAlign}
//                                             wrap="word"
//                                             fontSize={el.properties.fontSize}
//                                             fontFamily={
//                                                 selectedTheme?.font ||
//                                                 el.properties.fontFamily ||
//                                                 "Arial"
//                                             }
//                                             fill={
//                                                 !el.useThemeColor
//                                                     ? el.properties.fill
//                                                     : selectedTheme?.primaryColor
//                                             }
//                                             fontStyle={el.properties.fontStyle}
//                                             fontWeight={el.properties.fontWeight}
//                                             // fontFamily={el.properties.fontFamily}
//                                             isSelected={selectedTextId === `el-${index}-${i}`}
//                                             onSelect={() => {
//                                                 setSelectedTextId(`el-${index}-${i}`);
//                                                 setSelectedImageIndex(null);
//                                                 setSelectedShapeIndex(null);
//                                                 setSelectedImage(null);
//                                                 setIsMobileImageSelected(false);
//                                             }}
//                                             onClick={() => {
//                                                 setTooltip({
//                                                     visible: true,
//                                                     x: 10,
//                                                     y: 10,
//                                                     node: null,
//                                                 });
//                                             }}
//                                         />
//                                     );
//                                 })}
//                                 <KonvaShapeRenderer
//                                     elements={slide.elements}
//                                     selectedShapeIndex={selectedShapeIndex}
//                                     onSelectShape={(i) => {
//                                         setSelectedShapeIndex(i);
//                                         setSelectedTextId(null);
//                                         setSelectedImageIndex(null);
//                                         setSelectedImage(null);
//                                         setSelectedImage(null);
//                                         setTooltip({
//                                             visible: false,
//                                             x: 0,
//                                             y: 0,
//                                             node: null,
//                                         });
//                                         setIsMobileImageSelected(false);
//                                     }}
//                                 />
//                                 {slide.elements.map((el: any, i: number) => {
//                                     if (
//                                         el.element_type === "image" &&
//                                         el.konva_component === "Konva.Image"
//                                     ) {
//                                         return (
//                                             <SlideImage
//                                                 key={`image-${i}`}
//                                                 imageSrc={el.properties.imageSrc}
//                                                 x={el.properties.x}
//                                                 y={el.properties.y}
//                                                 width={el.properties.width}
//                                                 height={el.properties.height}
//                                                 isSelected={selectedImageIndex === i}
//                                                 onSelect={() => {
//                                                     setSelectedImage({ ...el });
//                                                     setSelectedImageIndex(i);
//                                                     setIsMobileImageSelected(true);
//                                                     setSelectedShapeIndex(null);
//                                                     setSelectedTextId(null);
//                                                     setTooltip({
//                                                         visible: false,
//                                                         x: 0,
//                                                         y: 0,
//                                                         node: null,
//                                                     });
//                                                 }}
//                                             />
//                                         );
//                                     }
//                                 })}
//                             </Layer>
//                         </Stage>
//                     </Box>
//                 );
//             })}
//             {tooltip.visible && (
//                 <TextSettingsPanelMobile style={{
//                     top: tooltip.y,
//                     left: tooltip.x - 15,
//                 }}
//                     onClose={() => setTooltip({ ...tooltip, visible: false })} />
//             )}
//             {isMobileImageSelected && (
//                 <ImageSettingsPanelMobile
//                     style={{
//                         top: 100,
//                         left: 100,
//                     }}
//                     onClose={() => {
//                         setIsMobileImageSelected(false);
//                         setSelectedImageIndex(null);
//                         setSelectedImage(null);
//                     }}
//                 />
//             )}
//             <div
//                 style={{
//                     transform: `scale(${scale})`,
//                     //transformOrigin: "top left",
//                     width: `${(getDynamicConstants().SLIDE_WIDTH)}px`,
//                     height: `${getDynamicConstants().SLIDE_HEIGHT}px`,
//                     marginTop: -100,
//                     position: "fixed",
//                     //left: 20,
//                     zIndex: 2,
//                 }}
//             >
//                 <SlidePreviews
//                     slides={slides}
//                     //scale={scale}
//                     selectedIndex={selectedIndex}
//                     slide_width={getDynamicConstants().SLIDE_WIDTH}
//                     slide_height={getDynamicConstants().SLIDE_HEIGHT_MOBILE + 10}
//                     onSelect={setSelectedIndex}
//                     onAddSlide={handleAddSlide}
//                     onDeleteSlide={handleDeleteSlide}
//                 />
//             </div>
//         </Box>
//     );
// };

// export default SlideEditorMobile;

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
import TextSettingsPanelMobile from "../components/new-ui/Text-Panel";
import ImageSettingsPanelMobile from "../components/new-ui/Image-Panel";
import { useDispatch } from "react-redux";
const getDynamicConstants = () => {
  const {
    SLIDE_WIDTH,
    SLIDE_HEIGHT,
    LEFT_PADDING,
    SLIDE_HEIGHT_MOBILE,
    SLIDE_WIDTH_MOBILE,
  } = getSlideDimensions();
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
    SLIDE_HEIGHT_MOBILE,
    SLIDE_WIDTH_MOBILE,
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
    selectedImageId,
    setSelectedImageId,
    selectedShapeIndex,
    setSelectedShapeIndex,
    setSlides,
    isAtBoundary,
    tooltip,
    setTooltip,
    isMobileImageSelected,
    setIsMobileImageSelected,
  } = useSlides();

  const { selectedTheme, setSelectedTheme } = useSlideThemeContext();
  const [bgImage] = useImage(selectedTheme?.image_url || "");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scale, setScale] = useState(1);
  // console.log(slides);
  const dispatch = useDispatch();
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
    const updateScale = () => {
      const slideWidth = getDynamicConstants().SLIDE_WIDTH;
      const slideHeight = getDynamicConstants().SLIDE_HEIGHT;
      const margin = 32;
      const availableWidth = window.innerWidth - margin;
      const newScale = availableWidth / slideWidth;
      setScale(Math.min(1, newScale)); // max 1x scale
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {slides.map((slide: any, index: number) => {
        const title = slide.slide_title;
        const titleProps = title.properties;
        const titleY = 25;
        // const bulletGap = 10;
        // const bulletStartY = titleY + titleProps.fontSize + 20;

        return (
          <Box
            key={slide.slide_id}
            sx={{
              position: "relative",
              mb: { xs: 7, md: -1, sm: -1 },
              top: { xs: -30, sm: 20, lg: 20 },
              display: index === selectedIndex ? "block" : "none",
              transform: `scale(${scale})`,
              width: `${getDynamicConstants().SLIDE_WIDTH}px`,
              height: `${getDynamicConstants().SLIDE_HEIGHT}px`,
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
                  setTooltip({ visible: false, x: 0, y: 0, node: null });
                  setIsMobileImageSelected(false);
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
                  setTooltip({ visible: false, x: 0, y: 0, node: null });
                  setIsMobileImageSelected(false);
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
                      setIsMobileImageSelected(false);
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
                    width={getDynamicConstants().SLIDE_WIDTH}
                    height={getDynamicConstants().SLIDE_HEIGHT}
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
                  <>
                    <KonvaTextEditor
                      key={`title-${index}-${
                        titleProps.fontFamily || "Roboto"
                      }-${titleProps.fontSize || 18}-${
                        titleProps.fontWeight || "normal"
                      }-${titleProps.align || "left"}-${
                        titleProps.fontStyle || "normal"
                      }-${titleProps.fill || "#000"}-${
                        titleProps.opacity || 1
                      }`}
                      id={`title-${index}`}
                      text={title.text}
                      x={titleProps.x || titleY}
                      y={titleProps.y || getDynamicConstants().LEFT_PADDING}
                      zIndex={titleProps.zIndex}
                      width={(() => {
                        const textWidth =
                          getDynamicConstants().textMaxWidth + 200;
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

                        // Return the calculated width with more padding and less right constraint
                        return Math.min(
                          textWidth + 200,
                          window.innerWidth - 80
                        ); // Reduced right padding constraint
                      })()}
                      // width={getDynamicConstants().textMaxWidth}
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
                        setTooltip({
                          visible: true,
                          x:
                            titleProps.x ||
                            getDynamicConstants().LEFT_PADDING + 100,
                          y: (titleProps.y || titleY) - 40,
                          node: null,
                        });
                      }}
                    />
                  </>
                )}
                {slide.elements.map((el: any, i: number) => {
                  if (
                    el.element_type !== "text" &&
                    el.element_type !== "bullet_point"
                  )
                    return null;

                  // if (el.element_type !== "text") return null;
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
                        // x={el.properties.x || getDynamicConstants().LEFT_PADDING}
                        // y={el.properties.y || 300}
                        // width={
                        //   el.properties.width ||
                        //   getDynamicConstants().textMaxWidth
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
                      // fontFamily={el.properties.fontFamily}
                      isSelected={selectedTextId === `el-${index}-${i}`}
                      onSelect={() => {
                        setSelectedTextId(`el-${index}-${i}`);
                        setSelectedImageIndex(null);
                        setSelectedShapeIndex(null);
                        setSelectedImage(null);
                        setIsMobileImageSelected(false);
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
                <KonvaShapeRenderer
                  elements={slide.elements}
                  selectedShapeIndex={selectedShapeIndex}
                  onSelectShape={(i) => {
                    setSelectedShapeIndex(i);
                    setSelectedTextId(null);
                    setSelectedImageIndex(null);
                    setSelectedImage(null);
                    setTooltip({
                      visible: false,
                      x: 0,
                      y: 0,
                      node: null,
                    });
                    setIsMobileImageSelected(false);
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
                        image_id={`el-${index}-${i}`}
                        imageSrc={el.properties.imageSrc}
                        x={el.properties.x}
                        y={el.properties.y}
                        width={el.properties.width}
                        zIndex={el.properties.zIndex}
                        height={el.properties.height}
                        isSelected={selectedImageId === `el-${index}-${i}`}
                        onSelect={() => {
                          setSelectedImage({ ...el });
                          setSelectedImageId(`el-${index}-${i}`);
                          setSelectedImageIndex(i);
                          setSelectedTextId(null);
                          setIsMobileImageSelected(true);
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
      {isMobileImageSelected && (
        <ImageSettingsPanelMobile
          style={{
            top: 100,
            left: 100,
          }}
          onClose={() => {
            setIsMobileImageSelected(false);
            setSelectedImageIndex(null);
            setSelectedImage(null);
          }}
          resetAll={() => {
            //dispatch(setSlidesAction(initialSlides));
            setSelectedTextId(null);
            setSelectedImageIndex(null);
            setSelectedImage(null);
            //setIsMobileTextSelected(false);
            setIsMobileImageSelected(false);
          }}
        />
      )}
      {/* <SlidePreviews
                    slides={slides}
                    //scale={scale}
                    selectedIndex={selectedIndex}
                    slide_width={getDynamicConstants().SLIDE_WIDTH}
                    slide_height={getDynamicConstants().SLIDE_HEIGHT_MOBILE + 10}
                    onSelect={setSelectedIndex}
                    onAddSlide={handleAddSlide}
                    onDeleteSlide={handleDeleteSlide}
                /> */}
      {/* <Box
                sx={{
                    transform: `scale(${scale})`,
                    width: `${(getDynamicConstants().SLIDE_WIDTH)}px`,
                    height: `${getDynamicConstants().SLIDE_HEIGHT}px`,
                    marginTop: -100,
                    position: "fixed",
                    //left: 20,
                    zIndex: 2,
                }}
            > */}
      <Box sx={{ transform: `scale(${scale})` }}>
        <SlidePreviews
          slides={slides}
          //scale={scale}
          selectedIndex={selectedIndex}
          slide_width={getDynamicConstants().SLIDE_WIDTH}
          slide_height={getDynamicConstants().SLIDE_HEIGHT_MOBILE + 10}
          onSelect={setSelectedIndex}
          onAddSlide={handleAddSlide}
          onDeleteSlide={handleDeleteSlide}
        />
      </Box>
      {/* </Box>  */}
    </Box>
  );
};

export default SlideEditor;
