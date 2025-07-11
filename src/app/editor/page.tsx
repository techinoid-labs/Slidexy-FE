"use client";

import React, { useRef, useState } from "react";
import SideNavBar from "../components/modify-presentation/Side-NavBar";
import UpperNavBar from "../components/modify-presentation/Upper-NavBar";
import ThemePanel from "../components/modify-presentation/Theme";
import CentralEditor from "../components/modify-presentation/CentralEditor";
import SlideEditor from "./SlideEditor";
import { useSlides } from "@/app/context/SlidesContext";
import { useDispatch } from "react-redux";
import { setSlides } from "@/app/slice/slidesSlice";
import { useRouter } from "next/navigation";
import type { Slide } from "@/app/slice/slidesSlice";
import { exportSlidesAsPDF } from "../../../utils/exportSlides"; 
import ImageSettingsPanel from "../components/ImagePanel";

import dynamic from "next/dynamic";

const TextPanel = dynamic(
  () => import("@/app/components/modify-presentation/TextPanel"),
  { ssr: false }
);

const Page = () => {
  const [showTemplatePanel, setShowTemplatePanel] = useState(false);
  const { slides } = useSlides();
  const dispatch = useDispatch();
  const router = useRouter();
  const stageRefs = useRef<(HTMLCanvasElement | null)[]>([]);

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

        {/* <main
          style={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          // <CentralEditor templatePanelOpen={showTemplatePanel} /> 
          <div
            style={{
              flexGrow: 1,
              overflowY: "auto",
              padding: 16,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <SlideEditor slides={slides} stageRefs={stageRefs} />
          </div>
        </main> */}
        {/* <TextPanel /> */}
        {/* <ThemePanel /> */}         
        {<ImageSettingsPanel />}
      </div>
    </div>
  );
};

export default Page;
