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
    const structuredSlides: StructuredSlide[] = slides.map((s, index) => {
      // Determine title text
      let titleText = "";

      if (typeof s.title === "string") {
        titleText = s.title;
      } else if (s.title?.text && typeof s.title.text === "string") {
        titleText = s.title.text;
      }

      // Create title element
      const titleElement = titleText
        ? [
            {
              element_type: "title",
              text: titleText,
              properties: {
                x: 0.5,
                y: 0.3,
                w: 9,
                h: 1,
                fontSize: 28,
                color: "000000",
              },
            },
          ]
        : [];

      // Create bullet elements
      let bulletElements: StructuredSlide["elements"] = [];
      if (Array.isArray(s.bullets)) {
        bulletElements =
          typeof s.bullets[0] === "string"
            ? [
                {
                  element_type: "bullet_point",
                  text: s.bullets as string[],
                  properties: {
                    x: 0.7,
                    y: 1.2,
                    w: 8,
                    h: 3,
                    fontSize: 18,
                    color: "444444",
                  },
                },
              ]
            : (s.bullets as any);
      }

      // Add image if present
      const imageElements =
        s.images && s.images[0]?.url
          ? [
              {
                element_type: "image",
                src: s.images[0].url,
                properties: {
                  x: 1,
                  y: 4,
                  w: 6,
                  h: 3.5,
                },
              },
            ]
          : [];

      return {
        elements: [...titleElement, ...bulletElements, ...imageElements],
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
