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
import { exportSlidesAsPDF } from "../../../utils/exportSlides";
import { exportSlidesAsPPT } from "../../../utils/exportSlidesAsPPT";
import type { StructuredSlide } from "../../../utils/exportSlidesAsPPT";

import ImageSettingsPanel from "../components/modify-presentation/ImagePanel";
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

  const resetAll = () => {
    dispatch(setSlides(initialSlides));
    setSelectedTextId(null);
  };

  const handleExportPPTX = () => {
    const structuredSlides: StructuredSlide[] = slides.map((slide) => {
      const elements: StructuredSlide["elements"] = [];

      slide.elements?.forEach((el) => {
        if (el.element_type === "bullet_point") {
          const textProps = el.properties as any; // Or define a better type for bullet points
          elements.push({
            element_type: "bullet_point",
            text: el.text,
            properties: {
              x: 0.7,
              y: undefined,
              w: 8,
              h: 0.6,
              fontSize: textProps?.fontSize || 18,
              fill: textProps?.fill || "#444444",
            },
          });
        }

        if (el.element_type === "image") {
          const imgProps = el.properties as any; // Or define a better type for images
          elements.push({
            element_type: "image",
            src: slide.image_url || undefined,
            properties: {
              imageSrc: imgProps?.imageSrc,
              x: (imgProps?.x || 440) / 100,
              y: (imgProps?.y || 15) / 100,
              w: (imgProps?.width || 480) / 100,
              h: (imgProps?.height || 400) / 100,
            },
          });
        }
      });

      return {
        slide_id: slide.slide_id,
        slide_title: {
          text: slide.slide_title?.text || "",
          properties: {
            fill: slide.slide_title?.properties?.fill?.replace("#", ""),
          },
        },
        elements,
        image_url: slide.image_url || undefined,
      };
    });

    exportSlidesAsPPT(structuredSlides);
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
      <UpperNavBar
        onExportPDF={handleExportPDF}
        onExportPPT={handleExportPPTX}
      />
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
