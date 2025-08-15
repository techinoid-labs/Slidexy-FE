"use client";

import React, { useRef, useState } from "react";
import TemplateEditor from "./TemplateEditor";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { exportSlidesAsPDF } from "@/utils/exportSlides";
import { useTheme, useMediaQuery } from "@mui/material";
import TemplateNavBar from "./TemplateNavbar";

const Page = () => {
  const stageRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const theme = useTheme();

  const handleExportPPTX = () => {
    console.log("called");
    // exportSlidesAsPPT(structuredSlides);
  };

  const handleExportPDF = () => exportSlidesAsPDF(stageRefs.current);

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
          <TemplateNavBar onExportPPT={handleExportPPTX} />
        </div>
      ) : (
        <TemplateNavBar onExportPPT={handleExportPPTX} />
      )}
      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        {/* {isMobile ? (
          <>
         
            <TemplateEditor />

          </>
        ) : ( */}
        <div className="relative flex flex-1 min-h-0 overflow-hidden">
          <div className="shrink-0 z-10"></div>
          <div className="flex-1 overflow-auto z-0" style={{ marginTop: 12 }}>
            <TemplateEditor />
          </div>
        </div>
        {/* )} */}
      </div>
    </div>
  );
};

export default Page;
