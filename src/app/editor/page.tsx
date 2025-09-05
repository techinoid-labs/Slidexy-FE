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
import ShapeSettingsPanel from "@/app/components/modify-presentation/ShapePanel";
import { useTheme, useMediaQuery } from "@mui/material";
import LowerNavbarMobile from "../components/modify-presentation/Lower-Navbar-Mobile";
import SlideEditorMobile from "./SlideEditor-NewMobile";
import ImageSettingsPanelMobile from "../components/new-ui/Image-Panel";
import TextSettingsPanelMobile from "@/app/components/new-ui/Text-Panel";
import ShapeSettingsPanelMobile from "@/app/components/modify-presentation/ShapePanelMobile"; // Adjust if file is ShapeSettingsPanelMobile.tsx
import ThemePanelMobile from "../components/modify-presentation/ThemePalleteMobile";
import { Button } from "@mui/material";
import SlideShowPlayer from "@/app/components/modify-presentation/Slide-Preview";
import { useSlideThemeContext } from "../context/ThemeContext";
import { useSession } from "next-auth/react";
import AuthModal from "../components/auth/AuthModal";
import { useTemplateSlides } from "../context/TemplateSlidesContext";
import { useUser } from "../context/AuthContext";
import axios from "axios";
const Page = () => {
  const [showTemplatePanel, setShowTemplatePanel] = useState(false);
  const [isThemePanelOpen, setIsThemePanelOpen] = useState(false);
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
    setSelectedShapeIndex, // Ensure this is included from SlidesContext
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
  const { data: session } = useSession();
  const { presentationId } = useTemplateSlides();
  const datapresentationId = presentationId;

  const { user, loading } = useUser();
  const [showAuthModal, setShowAuthModal] = useState(false);
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
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
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

  const handleExportPPTX = async () => {
    if (loading) return;

   if (!(session?.user || user)) {
    setShowAuthModal(true);
    return;
  }

    try {
      console.log("Session:", session);
      console.log("Token sent:", session?.user?.accessToken);

      const token = session?.user?.accessToken;

      if (!token) {
        console.error("No access token available");
        setShowAuthModal(true);
        return;
      }
      if (!presentationId) {
        console.error("No presentationId in context. Save presentation first.");
        setShowAuthModal(true);
        return;
      }

      const response = await axios.get(
        `${API_BASE_URL}/api/presentations/${datapresentationId}/export`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );

      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `presentation-${datapresentationId}.pptx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed", error);
      setShowAuthModal(true);
    }
  };

  const isTextSelected = selectedTextId !== null && selectedTextId !== "";
  const isShapeSelected = selectedShapeIndex !== null;
  const isImageSelected = selectedImageIndex !== null;

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

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <>
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
              onOpenThemePanel={handleOpenThemePanel}
            />
          </div>
        ) : (
          <UpperNavBar
            onExportPDF={handleExportPDF}
            onExportPPT={handleExportPPTX}
            onClearCanvas={handleClearCanvas}
            onPreview={() => setPreviewOpen(true)}
            onOpenThemePanel={handleOpenThemePanel}
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
                ${!isLGScreen && showRightPanel
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
                  className={`transition-opacity duration-300 ease-in-out overflow-auto w-full ${!showRightPanel && !isLGScreen
                    ? "opacity-0 pointer-events-none"
                    : "opacity-100"
                    }`}
                >
                  {isTextSelected && !isShapeSelected && (
                    <TextSettingsPanel resetAll={resetAll} />
                  )}
                  {isImageSelected && <ImageSettingsPanel />}
                  {isShapeSelected && <ShapeSettingsPanel resetAll={resetAll} />}
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
    onClose={() => setShowAuthModal(false)}
    presentationId={datapresentationId}
  />
)}
    </>
  );
};

export default Page;