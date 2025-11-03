"use client";
import React, { useRef, useState, useEffect } from "react";
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
import ShapeSettingsPanel from "@/app/components/modify-presentation/ShapePanel";
import { useTheme, useMediaQuery } from "@mui/material";
import LowerNavbarMobile from "../components/modify-presentation/Lower-Navbar-Mobile";
import SlideEditorMobile from "./SlideEditor-NewMobile";
import ImageSettingsPanelMobile from "../components/new-ui/Image-Panel";
import TextSettingsPanelMobile from "@/app/components/new-ui/Text-Panel";
import ShapeSettingsPanelMobile from "@/app/components/modify-presentation/ShapePanelMobile";
import ThemePanelMobile from "../components/modify-presentation/ThemePalleteMobile";
import SlideShowPlayer from "@/app/components/modify-presentation/Slide-Preview";
import { useSlideThemeContext } from "../context/ThemeContext";
import { useSession } from "next-auth/react";
import AuthModal from "../components/auth/AuthModal";
import { useTemplateSlides } from "../context/TemplateSlidesContext";
import { useUser } from "../context/AuthContext";
import { getContrastingBackground } from "@/utils/colorUtils";
import { getRandomSlide } from "@/utils/slideUtils";
import { generateSlideVariants } from "@/utils/variantGenerator"; // ✅ NEW: Import for initial gen

const Page = () => {
  const [showTemplatePanel, setShowTemplatePanel] = useState(false);
  const [isThemePanelOpen, setIsThemePanelOpen] = useState(false);
  const {
    slides,
    selectedSlideIndex,
    setSlides,
    setSelectedSlideIndex,  // ✅ NEW: Destructure setter
    setSelectedTextId,
    selectedTextId,
    selectedImageIndex,
    selectedImage,
    selectedShapeIndex,
    setSelectedImageIndex,
    setSelectedImage,
    isMobileImageSelected,
    setIsMobileImageSelected,
    setSelectedShapeIndex,
  } = useSlides();
  const { selectedTheme, setSelectedTheme } = useSlideThemeContext();
  const { presentationId } = useTemplateSlides();
  const dispatch = useDispatch();
  const router = useRouter();
  const stageRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const [initialSlides] = useState(() => slides);
  const [isMobileTextSelected, setIsMobileTextSelected] = useState(false);
  // ✅ FIXED: Init to true for desktop (always show right panel on lg+)
  const [showRightPanel, setShowRightPanel] = useState(true);
  const theme = useTheme();
  const isLGScreen = useMediaQuery(theme.breakpoints.up("lg"));
  const [previewOpen, setPreviewOpen] = useState(false);
  const { data: session } = useSession();
  const { user, loading } = useUser();
  const [showAuthModal, setShowAuthModal] = useState(false);
  // FIXED: State to track if there was a selection before deselect
  const [hadSelection, setHadSelection] = useState(false);

  // NEW: Fetch presentation data + generate initial layouts (no theme clone)
  useEffect(() => {
    if (presentationId && slides.length === 0) { // Only fetch if no slides yet
      const fetchPresentation = async () => {
        try {
          const response = await fetch(`/api/presentations/${presentationId}`); // Your endpoint
          if (response.ok) {
            const data = await response.json();
            let fetchedSlides = data.slides || [];
            
            // ✅ FIXED: Generate initial layouts for each slide (triggers SlideEditor naturally)
            fetchedSlides = fetchedSlides.map((slide: any) => {
              const newLayouts = generateSlideVariants(slide, selectedTheme || { backgroundColor: '#fff', primaryColor: '#000', artPalette: ['#000', '#333', '#000', '#fff', '#fff'] });
              const variant0 = newLayouts[0] || slide;
              return {
                ...slide,
                layouts: newLayouts,
                currentVariantIndex: 0,
                slide_title: variant0.slide_title || slide.slide_title,
                subtitle: variant0.subtitle || slide.subtitle,
                background: variant0.background || slide.background,
                elements: variant0.elements || slide.elements,
              };
            });
            
            setSlides(fetchedSlides); // Populates slides with layouts
          }
        } catch (error) {
          console.error("Failed to fetch presentation:", error);
        }
      };
      fetchPresentation();
    }
  }, [presentationId, setSlides, selectedTheme]); // ✅ Added selectedTheme dep if needed for gen

  // ✅ FIXED: Removed the problematic theme clone useEffect (initial gen now in fetch)

  // ✅ NEW: Default selectedSlideIndex to 0 on slides load (prevents no-slide render)
  useEffect(() => {
    if (slides.length > 0 && (selectedSlideIndex === undefined || selectedSlideIndex === -1)) {
      setSelectedSlideIndex(0);
    }
  }, [slides.length, selectedSlideIndex, setSelectedSlideIndex]);

  const resetAll = () => {
    dispatch(setSlidesAction(initialSlides));
    setSelectedTextId(null);
    setSelectedImageIndex(null);
    setSelectedImage(null);
    setIsMobileTextSelected(false);
    setIsMobileImageSelected(false);
    setIsThemePanelOpen(false);
    setSelectedShapeIndex(null);
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
    if (loading) return;

    if (session?.user || user) {
      setShowAuthModal(false);

      // FIXED: Enhanced structuring for PPT export to include gradients and backgrounds properly
      const structuredSlides: StructuredSlide[] = slides.map((slide: any) => {
        const elements: StructuredSlide["elements"] = [];

        // FIXED: Handle background gradient explicitly
        const background = slide.elements.find((el: any) => el.element_type === "background");
        // Do not push a "background" element_type, just extract properties for later use
        // If needed, pass background info via a separate property below

        slide.elements?.forEach((el: any) => {
          if (el.element_type === "background") return; // Already handled

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
            // FIXED: Include shape-specific props for better export
            stroke,
            strokeWidth,
            radius,
            radiusX,
            radiusY,
            innerRadius,
            outerRadius,
            angle,
            points,
            sides,
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
              element_type: "shape",
              text: konva_component,
              properties: {
                x: xIn,
                y: yIn,
                w: wIn,
                h: hIn,
                fill: fill.replace("#", "") || "cccccc",
                stroke: stroke ? stroke.replace("#", "") : undefined,
                strokeWidth,
                radius,
                radiusX,
                radiusY,
                innerRadius,
                outerRadius,
                angle,
                points,
                sides,
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
          // FIXED: Pass theme/gradient info for slide background
          backgroundGradient: background?.properties?.gradientColors || [],
        };
      });

      exportSlidesAsPPT(structuredSlides);
    } else {
      setShowAuthModal(true);
    }
  };

const isTextSelected =
  selectedTextId !== null &&
  selectedTextId !== "" &&
  selectedImageIndex === null &&  // ✅ FIXED: Check === null instead of !
  selectedShapeIndex === null;    // ✅ FIXED: Check === null instead of !

const isShapeSelected =
  selectedShapeIndex !== null && 
  selectedTextId === null &&      // ✅ FIXED: More explicit
  selectedImageIndex === null;    // ✅ FIXED: More explicit

const isImageSelected =
  selectedImageIndex !== null && 
  selectedTextId === null &&      // ✅ FIXED: More explicit
  selectedShapeIndex === null; 

  const handleExportPDF = () => {
    if (loading) return;

    if (session?.user || user) {
      setShowAuthModal(false);
      exportSlidesAsPDF(stageRefs.current);
    } else {
      setShowAuthModal(true);
    }
  };

  const handleOpenThemePanel = () => {
    setIsThemePanelOpen(true);
    setIsMobileTextSelected(false);
    setIsMobileImageSelected(false);
    setSelectedTextId(null);
    setSelectedImageIndex(null);
    setSelectedImage(null);
    setSelectedShapeIndex(null);
  };

  const handleCloseThemePanel = () => {
    setIsThemePanelOpen(false);
  };
const handleDeselect = () => {
  setSelectedTextId(null);
  setSelectedImageIndex(null);
  setSelectedImage(null);
  setSelectedShapeIndex(null);
  setIsMobileTextSelected(false);
  setIsMobileImageSelected(false);
  
  if (isMobile) {
    setIsThemePanelOpen(true);
  } else {
    setShowRightPanel(true); // ✅ This was already there but might not work
  }
};
  // FIXED: Track previous selection to open theme only after deselect
  useEffect(() => {
    const hasSelection = !!selectedTextId || selectedImageIndex !== null || selectedShapeIndex !== null;
    if (hasSelection) {
      setHadSelection(true);
    } else if (hadSelection && isMobile) {
      setIsThemePanelOpen(true);
      setHadSelection(false);
    }
  }, [selectedTextId, selectedImageIndex, selectedShapeIndex]);

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          background: getContrastingBackground(
            selectedTheme?.primaryColor || "#1a1a1a"
          ),
          maxWidth: "100%",
          overflow: "hidden",
          transition: "background 0.5s ease-in-out",
        }}
        className="animated-bg"
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
              onOpenThemePanel={handleOpenThemePanel}
              showAuthModal={showAuthModal}
              setShowAuthModal={setShowAuthModal}
            />
          </div>
        ) : (
          <UpperNavBar
            onExportPDF={handleExportPDF}
            onExportPPT={handleExportPPTX}
            onClearCanvas={handleClearCanvas}
            onPreview={() => setPreviewOpen(true)}
            onOpenThemePanel={handleOpenThemePanel}
            showAuthModal={showAuthModal}
            setShowAuthModal={setShowAuthModal}
          />
        )}
        <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
          {isMobile ? (
            <>
              <LowerNavbarMobile
                showTemplatePanel={showTemplatePanel}
                setShowTemplatePanel={setShowTemplatePanel}
              />
              <SlideEditorMobile slides={slides} stageRefs={stageRefs} onDeselect={handleDeselect} />
              <SlideShowPlayer
                slides={slides}
                theme={selectedTheme}
                open={previewOpen}
                onClose={() => setPreviewOpen(false)}
              />
              {isMobileTextSelected && !isShapeSelected && (
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
              {isShapeSelected && (
                <ShapeSettingsPanelMobile
                  resetAll={resetAll}
                  onClose={() => {
                    setIsMobileTextSelected(false);
                    setIsMobileImageSelected(false);
                    setSelectedTextId(null);
                    setSelectedImageIndex(null);
                    setSelectedImage(null);
                    setSelectedShapeIndex(null);
                  }}
                  style={{ top: 100, left: 100 }}
                />
              )}
              {isThemePanelOpen && !isShapeSelected && (
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
              <div
                className="flex-1 overflow-auto z-0"
                style={{ marginTop: 12 }}
              >
                <SlideEditor slides={slides} stageRefs={stageRefs} onDeselect={handleDeselect} slideCount={slides.length} />
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
                  bg-white shadow-md transition-all duration-300 ease-in-out flex scrollbar-hide 
                  ${
                    !isLGScreen && showRightPanel
                      ? "w-96"
                      : isLGScreen
                      ? "w-[310px]"
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
                  className={`transition-opacity duration-300 ease-in-out overflow-auto w-full scrollbar-hide ${
                    !showRightPanel && !isLGScreen
                      ? "opacity-0 pointer-events-none"
                      : "opacity-100"
                  }`}
                >
                  {isTextSelected && !isShapeSelected && (
                    <TextSettingsPanel resetAll={resetAll} />
                  )}
                  {isImageSelected && <ImageSettingsPanel />}
                  {isShapeSelected && (
                    <ShapeSettingsPanel resetAll={resetAll} />
                  )}
                  {!isTextSelected && !isImageSelected && !isShapeSelected && (
                    <ThemePanel parsedSlides={slides} resetAll={resetAll} />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {showAuthModal && (
        <AuthModal
          open={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          presentationId={presentationId}
        />
      )}
    </>
  );
};

export default Page;