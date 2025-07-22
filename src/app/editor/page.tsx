"use client";

import React, { useRef, useState } from "react";
import SideNavBar from "../components/modify-presentation/Side-NavBar";
import UpperNavBar from "../components/modify-presentation/Upper-NavBar";
import ThemePanel from "../components/modify-presentation/ThemePallete";
import CentralEditor from "../components/modify-presentation/CentralEditor";
import SlideEditor from "./SlideEditor";
import { useSlides } from "@/app/context/SlidesContext";
import { useDispatch } from "react-redux";
import { setSlides } from "@/app/slice/slidesSlice";
import { useRouter } from "next/navigation";
import { exportSlidesAsPDF } from "../../utils/exportSlides";
import ImageSettingsPanel from "../components/modify-presentation/ImagePanel";
import dynamic from "next/dynamic";
import TextSettingsPanel from "@/app/components/modify-presentation/TextPanel";
import { useTheme, useMediaQuery } from "@mui/material";
import LowerNavbarMobile from "../components/modify-presentation/Lower-Navbar-Mobile";
import MobileSlideEditor from "./SlideEditorMobile";
//import TextSettingsPanelMobile from "@/app/components/modify-presentation/TextPanelMobile";
import TextSettingsPanelMobile from "@/app/components/modify-presentation/Text-Panel-Mobile";
const Page = () => {
  const [showTemplatePanel, setShowTemplatePanel] = useState(false);
  const {
    slides,
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

  console.log({
    selectedTextId,
    selectedImageIndex,
    selectedShapeIndex,
    isMobileTextSelected,
  });

  const resetAll = () => {
    dispatch(setSlides(initialSlides));
    setSelectedTextId(null);
    setIsMobileTextSelected(false);
  };

  const isTextSelected = selectedTextId !== null && selectedTextId !== "";
  const isShapeSelected = selectedShapeIndex !== null;
  const isImageSelected = selectedImageIndex !== null;
  const handleExportPDF = () => exportSlidesAsPDF(stageRefs.current);

  const theme = useTheme();
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
        //position: "fixed",
      }}
    >
      <UpperNavBar onExportPDF={handleExportPDF} />
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
            {isTextSelected && <TextSettingsPanelMobile resetAll={resetAll} />}
          </>
        ) : (
          <>
            <SideNavBar
              showTemplatePanel={showTemplatePanel}
              setShowTemplatePanel={setShowTemplatePanel}
            />
            <SlideEditor slides={slides} stageRefs={stageRefs} />
            {/* Only show web text panel on desktop */}
            {(isTextSelected || isShapeSelected) && (
              <TextSettingsPanel resetAll={resetAll} />
            )}
            {isImageSelected && <ImageSettingsPanel />}
            {!isTextSelected && !isShapeSelected && !isImageSelected && (
              <ThemePanel resetAll={resetAll} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Page;
