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
import { exportSlidesAsPDF } from "../../../utils/exportSlides";
import ImageSettingsPanel from "../components/modify-presentation/ImagePanel";
import dynamic from "next/dynamic";
import TextSettingsPanel from "@/app/components/modify-presentation/TextPanel";

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

  console.log({
    selectedTextId,
    selectedImageIndex,
    selectedShapeIndex,
  });

  const resetAll = () => {
    dispatch(setSlides(initialSlides));
    setSelectedTextId(null);
  };

  const isTextSelected = selectedTextId !== null && selectedTextId !== "";
  const isShapeSelected = selectedShapeIndex !== null;
  const isImageSelected = selectedImageIndex !== null;
  const handleExportPDF = () => exportSlidesAsPDF(stageRefs.current);
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
      <UpperNavBar onExportPDF={handleExportPDF} />
      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        <SideNavBar
          showTemplatePanel={showTemplatePanel}
          setShowTemplatePanel={setShowTemplatePanel}
        />
        <SlideEditor slides={slides} stageRefs={stageRefs} />
        {isTextSelected || isShapeSelected ? (
          <TextSettingsPanel resetAll={resetAll} />
        ) : isImageSelected ? (
          <ImageSettingsPanel />
        ) : (
          <ThemePanel resetAll={resetAll} />
        )}
      </div>
    </div>
  );
};

export default Page;
