"use client";

import React, { useRef, useState } from "react";
import SideNavBar from "../components/modify-presentation/Side-NavBar";
import UpperNavBar from "../components/modify-presentation/Upper-NavBar";
import ThemePanel from "../components/modify-presentation/ThemePallete";
import SlideEditor from "./SlideEditor";
import { useSlides } from "@/app/context/SlidesContext";
import { useDispatch } from "react-redux";
import { setSlides as setSlidesAction } from "@/app/slice/slidesSlice";
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
import SlideEditorMobile from "./SlideEditor-NewMobile";
import ImageSettingsPanelMobile from "../components/new-ui/Image-Panel";
import TextSettingsPanelMobile from "@/app/components/new-ui/Text-Panel";
import ThemePanelMobile from "../components/modify-presentation/ThemePalleteMobile"; // Import ThemePanelMobile
import { Button } from "@mui/material";
import SlideShowPlayer from "@/app/components/modify-presentation/Slide-Preview";
import { useSlideThemeContext } from "../context/ThemeContext";

const Page = () => {
  const [showTemplatePanel, setShowTemplatePanel] = useState(false);
  const [isThemePanelOpen, setIsThemePanelOpen] = useState(false); // State for ThemePanelMobile
  const {
    slides,
    selectedSlideIndex,
    setSlides,
    setSelectedTextId,
    selectedTextId,
    selectedImageIndex,
    selectedImage,
    selectedShapeIndex,
    setSelectedImageIndex,
    setSelectedImage,
    isMobileImageSelected,
    setIsMobileImageSelected,
  } = useSlides();
  const { selectedTheme, setSelectedTheme } = useSlideThemeContext();
  const dispatch = useDispatch();
  const router = useRouter();
  const stageRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const [initialSlides] = useState(() => slides);
  const [isMobileTextSelected, setIsMobileTextSelected] = useState(false);
  const [showRightPanel, setShowRightPanel] = useState(false);
  const theme = useTheme();
  const isLGScreen = useMediaQuery(theme.breakpoints.up("lg"));
  const [previewOpen, setPreviewOpen] = useState(false);

  const resetAll = () => {
    dispatch(setSlidesAction(initialSlides));
    setSelectedTextId(null);
    setSelectedImageIndex(null);
    setSelectedImage(null);
    setIsMobileTextSelected(false);
    setIsMobileImageSelected(false);
    setIsThemePanelOpen(false); // Close theme panel on reset
  };

  const handleClearCanvas = () => {
    if (selectedSlideIndex < 0 || selectedSlideIndex >= slides.length) return;

    const newSlides = [...slides];
    newSlides[selectedSlideIndex] = {
      ...newSlides[selectedSlideIndex],
      slide_title: {
        konva_component: "Konva.Text",
        text: "",
        properties: {
          fontSize: 14,
          fontWeight: "normal",
          fontFamily: "Roboto",
          fill: "#444",
          fontStyle: "normal",
          align: "left",
          x: 0,
          y: 25,
          width: 220,
          height: 0,
          radius: 0,
          numPoints: 0,
          innerRadius: 0,
          outerRadius: 0,
        },
      },
      elements: [],
      image_url: "",
    };

    setSlides(newSlides);
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
        } else if (element_type === "image" && imageSrc) {
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
        } else if (element_type === "text" && text) {
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
        } else if (element_type === "shape") {
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
      });

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

  const handleOpenThemePanel = () => {
    setIsThemePanelOpen(true);
    setIsMobileTextSelected(false);
    setIsMobileImageSelected(false);
    setSelectedTextId(null);
    setSelectedImageIndex(null);
    setSelectedImage(null);
  };

  const handleCloseThemePanel = () => {
    setIsThemePanelOpen(false);
  };

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

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
            onClearCanvas={handleClearCanvas}
            onPreview={() => setPreviewOpen(true)}
            onOpenThemePanel={handleOpenThemePanel} // Pass the function
          />
        </div>
      ) : (
        <UpperNavBar
          onExportPDF={handleExportPDF}
          onExportPPT={handleExportPPTX}
          onClearCanvas={handleClearCanvas}
          onPreview={() => setPreviewOpen(true)}
          onOpenThemePanel={handleOpenThemePanel} // Pass the function
        />
      )}
      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        {isMobile ? (
          <>
            <LowerNavbarMobile
              showTemplatePanel={showTemplatePanel}
              setShowTemplatePanel={setShowTemplatePanel}
            />
            <SlideEditorMobile slides={slides} stageRefs={stageRefs} />
            <SlideShowPlayer
              slides={slides}
              theme={selectedTheme}
              open={previewOpen}
              onClose={() => setPreviewOpen(false)}
            />
            {isMobileTextSelected && (
              <TextSettingsPanelMobile
                resetAll={resetAll}
                onClose={() => setIsMobileTextSelected(false)}
                style={{ top: 100, left: 100 }}
              />
            )}
            {isMobileImageSelected && (
              <ImageSettingsPanelMobile
                resetAll={resetAll}
                onClose={() => {
                  setIsMobileImageSelected(false);
                  setSelectedImageIndex(null);
                  setSelectedImage(null);
                }}
                style={{ top: 100, left: 100 }}
              />
            )}
            {isThemePanelOpen && (
              <ThemePanelMobile
                parsedSlides={slides}
                resetAll={resetAll}
                onClose={handleCloseThemePanel}
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
              <SlideShowPlayer
                slides={slides}
                theme={selectedTheme}
                open={previewOpen}
                onClose={() => setPreviewOpen(false)}
              />
            </div>
            <div
              className={`
                ${isLGScreen ? "relative" : "fixed top-0 right-0 h-full z-40"}
                bg-white shadow-md transition-all duration-300 ease-in-out flex
                ${
                  !isLGScreen && showRightPanel
                    ? "w-96"
                    : isLGScreen
                    ? "w-[375px]"
                    : "w-0"
                }
              `}
            >
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
                  <ThemePanel parsedslides={slides} resetAll={resetAll} />
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