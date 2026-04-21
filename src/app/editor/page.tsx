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
import { generateSlideVariants } from "@/utils/variantGenerator";
import snapshotsCache from "@/utils/snapshotsCache";


const Page = () => {
  const [showTemplatePanel, setShowTemplatePanel] = useState(false);
  const [isThemePanelOpen, setIsThemePanelOpen] = useState(false);

  const {
    slides,
    selectedSlideIndex,
    setSlides,
    setSelectedSlideIndex,
    setSelectedTextId,
    selectedTextId,
    selectedImageIndex,
    selectedImage,
    selectedImageId,
    selectedShapeIndex,
    setSelectedShapeId,
    setSelectedImageIndex,
    setSelectedImage,
    setSelectedImageId,
    isMobileImageSelected,
    setIsMobileImageSelected,
    setSelectedShapeIndex,
    selectedShapeId,
  } = useSlides();
  const { selectedTheme, setSelectedTheme } = useSlideThemeContext();
  const { presentationId } = useTemplateSlides();
  const dispatch = useDispatch();
  const router = useRouter();
  const stageRefs = useRef<any[]>([]);

  // AIAgent Live Slide Text Editing Listener
  useEffect(() => {
     const applyAgentEdit = (payload: any) => {
         console.log("🛠️ Received AI Slide Edit Demand:", payload);
         if (payload && payload.newTitle) {
             const index = payload.slideIndex !== undefined ? payload.slideIndex : selectedSlideIndex;
             const updatedSlides = JSON.parse(JSON.stringify(slides));
             
             if (updatedSlides[index] && updatedSlides[index].content) {
                 // Try finding a title element (assuming Title is often large text)
                 const textTitleIndex = updatedSlides[index].content.findIndex(
                     (c: any) => c.type === 'text' && c.props && (c.props.fontSize && c.props.fontSize > 20)
                 );
                 if (textTitleIndex !== -1) {
                      updatedSlides[index].content[textTitleIndex].props.text = payload.newTitle;
                      setSlides(updatedSlides);
                      dispatch(setSlidesAction(updatedSlides));
                 }
             }
         }
     };

     // 1. Check for buffered edits from another page
     const storedEdit = localStorage.getItem("agentEditPayload");
     if (storedEdit && slides.length > 0) { // wait until slides are loaded
        try {
            const payload = JSON.parse(storedEdit);
            localStorage.removeItem("agentEditPayload");
            setTimeout(() => applyAgentEdit(payload), 800);
        } catch(e) {}
     }

     // 2. Listen for live edits on the current page
     const handleAgentEvent = (e: any) => applyAgentEdit(e.detail);
     window.addEventListener("SLIDEXY_AGENT_EDIT_SLIDE", handleAgentEvent);
     
     return () => window.removeEventListener("SLIDEXY_AGENT_EDIT_SLIDE", handleAgentEvent);
  }, [slides, selectedSlideIndex, setSlides, dispatch]);

  const [initialSlides] = useState(() => slides);
  const [showRightPanel, setShowRightPanel] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isLGScreen = useMediaQuery(theme.breakpoints.up("lg"));
  const [previewOpen, setPreviewOpen] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [isExportingPPTX, setIsExportingPPTX] = useState(false);
  const { data: session } = useSession();
  const { user, loading } = useUser();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [hadSelection, setHadSelection] = useState(false);

  // Fetch presentation slides on mount or when presentationId changes
  useEffect(() => {
    if (presentationId) {
      const fetchPresentation = async () => {
        try {
          const response = await fetch(`/api/presentations/${presentationId}`);
          if (response.ok) {
            const data = await response.json();
            let fetchedSlides = data.slides || [];

            // Only generate variants for slides that don't have them
            fetchedSlides = fetchedSlides.map((slide: any) => {
              if (slide.layouts && slide.layouts.length > 0) {
                return slide;
              }

              const newLayouts = generateSlideVariants(
                slide,
                selectedTheme || {
                  backgroundColor: '#fff',
                  primaryColor: '#000',
                  artPalette: ['#000', '#333', '#000', '#fff', '#fff']
                }
              );
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

            console.log('Editor: Loaded slides with latest updates:', fetchedSlides.length);
            setSlides(fetchedSlides);
          }
        } catch (error) {
          console.error("Failed to fetch presentation:", error);
        }
      };
      fetchPresentation();
    }
  }, [presentationId]); // Only depend on presentationId to avoid infinite loops

  useEffect(() => {
    if (slides.length > 0 && (selectedSlideIndex === undefined || selectedSlideIndex === -1)) {
      setSelectedSlideIndex(0);
    }
  }, [slides.length, selectedSlideIndex, setSelectedSlideIndex]);

  useEffect(() => {
    const hasSelection = selectedTextId !== null || selectedImageIndex !== null || selectedShapeIndex !== null;
    if (hasSelection) {
      setIsThemePanelOpen(false);
    }
  }, [selectedTextId, selectedImageIndex, selectedShapeIndex]);

  const resetAll = () => {
    dispatch(setSlidesAction(initialSlides));
    setSelectedImageId(null);
    setSelectedShapeId(null);
    setIsMobileImageSelected(false);
    setIsThemePanelOpen(false);
    setSelectedShapeIndex(null);
  };

  const handleClearCanvas = () => {
    if (selectedSlideIndex < 0 || selectedSlideIndex >= slides.length) return;

    console.log('[ClearCanvas] Starting canvas clear...');

    const newSlides = structuredClone(slides);
    const currentSlide = newSlides[selectedSlideIndex];

    const blankSlide = {
      ...currentSlide,
      slide_title: {
        konva_component: "Konva.Text",
        text: "",
        properties: {
          fontSize: 36,
          fontWeight: "700",
          fontFamily: "Raleway",
          fill: selectedTheme?.primaryColor || "#000",
          fontStyle: "normal",
          align: "center",
          x: 25,
          y: 40,
          width: 800,
          height: 0,
        },
      },
      subtitle: undefined,
      elements: [],
      image_url: "",
      image_placeholder: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      },
    };

    const freshLayouts = generateSlideVariants(blankSlide, selectedTheme);
    blankSlide.layouts = freshLayouts;
    blankSlide.currentVariantIndex = 0;

    newSlides[selectedSlideIndex] = blankSlide;
    setSlides(newSlides);

    setSelectedTextId(null);
    setSelectedImageIndex(null);
    setSelectedImage(null);
    setSelectedShapeIndex(null);
    setIsMobileImageSelected(false);

    console.log('[ClearCanvas] Canvas cleared successfully');
  };

  const handleExportPDF = async () => {
    if (loading) return;
    if (session?.user || user) {
      setShowAuthModal(false);
      setIsExportingPDF(true);
      try {
        await exportSlidesAsPDF(slides);
      } catch (err) {
        console.error("PDF Export failed:", err);
      } finally {
        setIsExportingPDF(false);
      }
    } else {
      setShowAuthModal(true);
    }
  };

  const handleExportPPTX = async () => {
    if (loading) return;
    if (session?.user || user) {
      setShowAuthModal(false);
      setIsExportingPPTX(true);
      try {
        await exportSlidesAsPPT(slides);
      } catch (err) {
        console.error("PPTX Export failed:", err);
      } finally {
        setIsExportingPPTX(false);
      }
    } else {
      setShowAuthModal(true);
    }
  };

  // Derived selection flags - simplified and unified
  const isTextSelected = !!selectedTextId;
  const isImageSelected = selectedImageIndex !== null || !!selectedImage || !!selectedImageId;
  const isShapeSelected = selectedShapeIndex !== null || !!selectedShapeId;

  const hasElementSelected = isTextSelected || isImageSelected || isShapeSelected;


  const handleOpenThemePanel = () => {
    setSelectedTextId(null);
    setSelectedImageIndex(null);
    setSelectedImage(null);
    setSelectedShapeIndex(null);
    setIsMobileImageSelected(false);
    setIsThemePanelOpen(true);
  };

  const handleCloseThemePanel = () => {
    setIsThemePanelOpen(false);
  };

  const handleDeselect = () => {
    setSelectedTextId(null);
    setSelectedImageIndex(null);
    setSelectedImage(null);
    setIsMobileImageSelected(false);

    if (isMobile) {
      setIsThemePanelOpen(true);
    } else {
      setShowRightPanel(true);
    }
  };
  const deselectAllRef = useRef<(() => void) | null>(null);
  const handlePreviewOpen = () => {
    // Call the SlideEditor's deselectAll function
    if (deselectAllRef.current) {
      deselectAllRef.current();
    }

    // Also clear all parent component states
    setSelectedTextId(null);
    setSelectedImageIndex(null);
    setSelectedImage(null);
    setSelectedShapeIndex(null);
    setIsMobileImageSelected(false);

    // Open preview after state updates
    setTimeout(() => {
      setPreviewOpen(true);
    }, 100);
  };
  useEffect(() => {
    const hasSelection = !!selectedTextId || selectedImageIndex !== null || selectedShapeIndex !== null;
    if (hasSelection) {
      setHadSelection(true);
    } else if (hadSelection && isMobile) {
      setIsThemePanelOpen(true);
      setHadSelection(false);
    }
  }, [selectedTextId, selectedImageIndex, selectedShapeIndex, hadSelection, isMobile]);

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
              onPreview={handlePreviewOpen}
              onOpenThemePanel={handleOpenThemePanel}
              isThemePanelOpen={isThemePanelOpen}
              showAuthModal={showAuthModal}
              setShowAuthModal={setShowAuthModal}
              isExportingPDF={isExportingPDF}
              isExportingPPT={isExportingPPTX}
            />
          </div>
        ) : (
          <UpperNavBar
            onExportPDF={handleExportPDF}
            onExportPPT={handleExportPPTX}
            onClearCanvas={handleClearCanvas}
            onPreview={handlePreviewOpen}
            onOpenThemePanel={handleOpenThemePanel}
            isThemePanelOpen={isThemePanelOpen}
            showAuthModal={showAuthModal}
            setShowAuthModal={setShowAuthModal}
            isExportingPDF={isExportingPDF}
            isExportingPPT={isExportingPPTX}
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
                open={previewOpen}
                onClose={() => setPreviewOpen(false)}
                theme={selectedTheme}
                forceCleanPreview={previewOpen}
                key={previewOpen ? "clean" : "normal"}
              />
              {isTextSelected && !isShapeSelected && (
                <TextSettingsPanelMobile
                  resetAll={resetAll}
                  onClose={() => setSelectedTextId(null)}
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
                    setSelectedTextId(null);
                    setSelectedImageIndex(null);
                    setSelectedImage(null);
                    setSelectedImageId(null);
                    setSelectedShapeIndex(null);
                    setSelectedShapeId(null);
                    setIsMobileImageSelected(false);
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
                <SlideEditor slides={slides} stageRefs={stageRefs} onDeselect={handleDeselect} slideCount={slides.length} deselectAllRef={deselectAllRef} />
                <SlideShowPlayer
                  slides={slides}
                  theme={selectedTheme}
                  open={previewOpen}
                  onClose={() => setPreviewOpen(false)}
                  forceCleanPreview={previewOpen}
                  key={previewOpen ? "clean" : "normal"}
                />
              </div>
              <div
                className={`
                  ${isLGScreen ? "relative" : "fixed top-0 right-0 h-full z-40"}
                  bg-white shadow-md transition-all duration-300 ease-in-out flex scrollbar-hide 
                  ${!isLGScreen && showRightPanel
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
                  className={`transition-opacity duration-300 ease-in-out overflow-auto w-full scrollbar-hide ${!showRightPanel && !isLGScreen
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