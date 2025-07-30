"use client";

import React, { useRef, useState } from "react";
import SideNavBar from "../components/modify-presentation/Side-NavBar";
import UpperNavBar from "../components/modify-presentation/Upper-NavBar";
import ThemePanel from "../components/modify-presentation/ThemePallete";
import SlideEditor from "./SlideEditor";
import { useSlides } from "@/app/context/SlidesContext";
import { useDispatch } from "react-redux";
import { setSlides } from "@/app/slice/slidesSlice";
import { useRouter } from "next/navigation";
import { exportSlidesAsPDF } from "@/utils/exportSlides";
import { exportSlidesAsPPT } from "@/utils/exportSlidesAsPPT";
import type { StructuredSlide } from "@/utils/exportSlidesAsPPT";
import SettingsIcon from "@mui/icons-material/Settings";
import CloseIcon from "@mui/icons-material/Close";
import ImageSettingsPanel from "../components/modify-presentation/ImagePanel";
import TextSettingsPanel from "@/app/components/modify-presentation/TextPanel";
import { useTheme, useMediaQuery } from "@mui/material";
import LowerNavbarMobile from "../components/modify-presentation/Lower-Navbar-Mobile";
import MobileSlideEditor from "./SlideEditorMobile";
import TextSettingsPanelMobile from "@/app/components/modify-presentation/TextPanelMobile";
import { Button } from "@mui/material"; // Optional: MUI or use your own toggle icon

const Page = () => {
  const [showTemplatePanel, setShowTemplatePanel] = useState(false);
  const {
    slides,
    selectedSlideIndex, setSlides,
    setSelectedTextId,
    selectedTextId,
    selectedImageIndex,
    selectedShapeIndex,
  } = useSlides();
  const dispatch = useDispatch();
  const router = useRouter();
  const stageRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const [initialSlides] = useState(() => slides);
  // Separate state for mobile text selection
  const [isMobileTextSelected, setIsMobileTextSelected] = useState(false);
  const [showRightPanel, setShowRightPanel] = useState(false);
  const theme = useTheme();
  const isLGScreen = useMediaQuery(theme.breakpoints.up("lg"));

  const resetAll = () => {
    dispatch(setSlides(initialSlides));
    setSelectedTextId(null);
    setIsMobileTextSelected(false);
  };
  // const handleExportPPTX = () => {
  //   const structuredSlides: StructuredSlide[] = slides.map((slide) => {
  //     const elements: StructuredSlide["elements"] = [];

  //     slide.elements?.forEach((el) => {
  //       if (el.element_type === "bullet_point") {
  //         const textProps = el.properties as any; // Or define a better type for bullet points
  //         elements.push({
  //           element_type: "bullet_point",
  //           text: el.text,
  //           properties: {
  //             x: 0.7,
  //             y: undefined,
  //             w: 8,
  //             h: 0.6,
  //             fontSize: textProps?.fontSize || 18,
  //             fill: textProps?.fill || "#444444",
  //           },
  //         });
  //       }

  //       if (el.element_type === "image") {
  //         const imgProps = el.properties as any; // Or define a better type for images
  //         elements.push({
  //           element_type: "image",
  //           src: slide.image_url || undefined,
  //           properties: {
  //             imageSrc: imgProps?.imageSrc,
  //             x: (imgProps?.x || 440) / 100,
  //             y: (imgProps?.y || 15) / 100,
  //             w: (imgProps?.width || 480) / 100,
  //             h: (imgProps?.height || 400) / 100,
  //           },
  //         });
  //       }
  //     });

  //     return {
  //       slide_id: slide.slide_id,
  //       slide_title: {
  //         text: slide.slide_title?.text || "",
  //         properties: {
  //           fill: slide.slide_title?.properties?.fill?.replace("#", ""),
  //         },
  //       },
  //       elements,
  //       image_url: slide.image_url || undefined,
  //     };
  //   });

  //   exportSlidesAsPPT(structuredSlides);
  // };

const handleClearCanvas = () => {
  if (selectedSlideIndex < 0 || selectedSlideIndex >= slides.length) return;

  const newSlides = [...slides];
  newSlides[selectedSlideIndex] = {
    ...newSlides[selectedSlideIndex],
    elements: [], // Clear images, shapes, text, etc.
    slide_title: { text: "", properties: {} }, // Clear title
    image_url: "", // Clear background
  };

  setSlides(newSlides); // Dispatches to Redux
};

  const handleExportPPTX = () => {
    const structuredSlides: StructuredSlide[] = slides.map((slide: any) => {
      const elements: StructuredSlide["elements"] = [];

      slide.elements?.forEach((el: any) => {
        const { element_type, text, properties = {}, konva_component } = el;
        const {
          x = 0,
          y = 0,
          width,
          height,
          w,
          h,
          fontSize = 18,
          fill = "#444444",
          fontFamily,
          fontStyle,
          fontWeight,
          imageSrc,
        } = properties;

        const xIn = x / 100;
        const yIn = y / 100;
        const wIn = (width || w || 400) / 100;
        const hIn = (height || h || 200) / 100;

        // BULLET POINT
        if (element_type === "bullet_point") {
          elements.push({
            element_type: "bullet_point",
            text,
            properties: {
              x: xIn,
              y: yIn,
              w: wIn,
              h: hIn,
              fontSize,
              fill: fill.replace("#", ""),
              fontFamily,
              fontStyle,
              fontWeight,
            },
          });
        }

        // IMAGE
        else if (element_type === "image" && imageSrc) {
          elements.push({
            element_type: "image",
            src: slide.image_url || undefined,
            properties: {
              imageSrc,
              x: xIn,
              y: yIn,
              w: wIn,
              h: hIn,
            },
          });
        }

        // TEXT (like headline or custom)
        else if (element_type === "text" && text) {
          elements.push({
            element_type: "text",
            text,
            properties: {
              x: xIn,
              y: yIn,
              w: wIn,
              h: hIn,
              fontSize,
              fill: fill.replace("#", ""),
              fontFamily,
              fontStyle,
              fontWeight,
            },
          });
        }

        // Optional: shape fallback to text label
        else if (element_type === "shape") {
          elements.push({
            element_type: "text",
            text: konva_component,
            properties: {
              x: xIn,
              y: yIn,
              fontSize: 12,
              fill: fill.replace("#", "") || "cccccc",
            },
          });
        }

        // if (element_type === "shape") {
        //   // Basic shape fallback
        //   const shapeMap: any = {
        //     "Konva.Rect": "rect",
        //     "Konva.Circle": "ellipse",
        //     "Konva.Ellipse": "ellipse",
        //     "Konva.Line": "line", // For simple horizontal/vertical line
        //   };

        //   const shapeType = shapeMap[konva_component];
        //   if (shapeType) {
        //     slide.addShape(shapeType, {
        //       x,
        //       y,
        //       w,
        //       h,
        //       fill: fill,
        //       line: { color: "000000", width: 1 },
        //     });
        //   } else {
        //     // fallback to label if unsupported
        //     slide.addText(konva_component || "shape", {
        //       x,
        //       y,
        //       fontSize: 12,
        //       color: fill,
        //     });
        //   }
        // }
      });

      // Handle slide title
      const slideTitleProps: any = slide.slide_title?.properties || {};
      const slideTitle = slide.slide_title?.text;

      return {
        slide_id: slide.slide_id,
        slide_title: slideTitle
          ? {
              text: slideTitle,
              properties: {
                fontSize: slideTitleProps.fontSize,
                fill: slideTitleProps.fill?.replace("#", ""),
                fontStyle: slideTitleProps.fontStyle,
                fontFamily: slideTitleProps.fontFamily,
              },
            }
          : undefined,
        elements,
        image_url: slide.image_url,
      };
    });

    exportSlidesAsPPT(structuredSlides);
  };

  const isTextSelected = selectedTextId !== null && selectedTextId !== "";
  const isShapeSelected = selectedShapeIndex !== null;
  const isImageSelected = selectedImageIndex !== null;

  const handleExportPDF = () => exportSlidesAsPDF(stageRefs.current);

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isThemePanelOpen =
    !isTextSelected && !isShapeSelected && !isImageSelected;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        backgroundColor: "#FBFAFF",
        maxWidth: "100%",
        overflow: "hidden",
      }}
    >
      {!isMobile ? (
        <div
          style={{
            flexShrink: 0,
            height: "80px",
            zIndex: 20,
          }}
        >
          <UpperNavBar
            onExportPDF={handleExportPDF}
            onExportPPT={handleExportPPTX}
          />
        </div>
      ) : (
        <UpperNavBar
          onExportPDF={handleExportPDF}
          onExportPPT={handleExportPPTX}
          onClearCanvas={handleClearCanvas}
        />
      )}

      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        {isMobile ? (
          <>
            <LowerNavbarMobile
              showTemplatePanel={showTemplatePanel}
              setShowTemplatePanel={setShowTemplatePanel}
            />
            <MobileSlideEditor
              slides={slides}
              stageRefs={stageRefs}
              setIsMobileTextSelected={setIsMobileTextSelected}
            />
            {/* Only show mobile text panel on mobile */}
            {/* {isTextSelected && <TextSettingsPanelMobile resetAll={resetAll} />} */}
            {isMobileTextSelected && (
              <TextSettingsPanelMobile
                resetAll={resetAll}
                onClose={() => setIsMobileTextSelected(false)} // Function to close the panel
                style={{ top: 100, left: 100 }} // Example style with positioning
              />
            )}
          </>
        ) : (
          <div className="relative flex flex-1 min-h-0 overflow-hidden">
            <div className="shrink-0 z-10">
              <SideNavBar
                showTemplatePanel={showTemplatePanel}
                setShowTemplatePanel={setShowTemplatePanel}
              />
            </div>

            <div className="flex-1 overflow-auto z-0" style={{ marginTop: 12 }}>
              <SlideEditor slides={slides} stageRefs={stageRefs} />
            </div>
            <div
              className={`
    ${isLGScreen ? "relative" : "fixed top-0 right-0 h-full z-40"}
    bg-white shadow-md transition-all duration-300 ease-in-out flex
     ${
       !isLGScreen && showRightPanel ? "w-96" : isLGScreen ? "w-[360px]" : "w-0"
     }
  `}
            >
              {/* Toggle Tab */}
              {!isLGScreen && (
                <div
                  className={`
      absolute -left-5 top-24
      bg-white border-r-0 border border-gray-200 shadow-xl
      rounded-l-md px-2 py-2 cursor-pointer z-50
    `}
                  onClick={() => setShowRightPanel(!showRightPanel)}
                >
                  {showRightPanel ? (
                    <CloseIcon color="primary" fontSize="small" />
                  ) : (
                    <SettingsIcon color="primary" fontSize="small" />
                  )}
                </div>
              )}

              {/* Content area only shows if expanded */}
              <div
                className={`transition-opacity duration-300 ease-in-out overflow-auto w-full ${
                  !showRightPanel && !isLGScreen
                    ? "opacity-0 pointer-events-none"
                    : "opacity-100"
                }`}
              >
                {(isTextSelected || isShapeSelected) && (
                  <TextSettingsPanel resetAll={resetAll} />
                )}
                {isImageSelected && <ImageSettingsPanel />}
                {!isTextSelected && !isShapeSelected && !isImageSelected && (
                  <ThemePanel resetAll={resetAll} />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
