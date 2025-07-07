"use client";

import React, { useRef, useState } from "react";
import SideNavBar from "../components/Side-NavBar";
import UpperNavBar from "../components/Upper-NavBar";
import ThemePanel from "../components/Theme";
import CentralEditor from "../components/CentralEditor";
import SlideEditor from "./SlideEditor";
import { useSlides } from "@/app/context/SlidesContext";
import { useDispatch } from "react-redux";
import { setSlides } from "@/app/slice/slidesSlice";
import { useRouter } from "next/navigation";
import type { Slide } from "@/app/slice/slidesSlice";
import { exportSlidesAsPDF } from "../../../utils/exportSlides";

const Page = () => {
  const [showTemplatePanel, setShowTemplatePanel] = useState(false);
  const { slides } = useSlides();
  const dispatch = useDispatch();
  const router = useRouter();
  const stageRefs = useRef<(HTMLCanvasElement | null)[]>([]);

  const handleExportPDF = () => exportSlidesAsPDF(stageRefs.current);
  // const handleExportPPT = () => exportSlidesAsPPT(stageRefs.current);
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
        // onExportPPT={handleExportPPT}
      />
      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        <SideNavBar
          showTemplatePanel={showTemplatePanel}
          setShowTemplatePanel={setShowTemplatePanel}
        />
        <main
          style={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* <CentralEditor templatePanelOpen={showTemplatePanel} /> */}
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
        </main>
        {/* <ThemePanel /> */}
      </div>
    </div>
  );
};

export default Page;
