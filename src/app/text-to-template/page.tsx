"use client";

import React from "react";
import TemplateEditor from "./TemplateEditor";
import { useRouter } from "next/navigation";
import { exportPresentationToPptx } from "./pptxExportTemplate";
import { useTheme, useMediaQuery, Alert } from "@mui/material";
import TemplateNavBar from "./TemplateNavbar";
import { useTemplateSlides } from "../context/TemplateSlidesContext";
import { dummyData } from "./dummyData";

const Page = () => {
  const theme = useTheme();
  const { slideTemplates } = useTemplateSlides();

  const handleExportPPTX = () => {
    console.log("called");
    exportPresentationToPptx({ slides: slideTemplates });
    // exportPresentationToPptx(dummyData);
  };

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

      {/* Disclaimer Banner */}
      <Alert
        severity="info"
        className="flex items-center w-full justify-center"
        sx={{
          borderRadius: 0,
          textAlign: "center",
          fontSize: { xs: "12px", md: "14px" },
          py: { xs: 0.5, md: 1 },
          backgroundColor: "#F0F4FF",
          color: "#333",
          mt: isMobile ? 8 : 0,
        }}
      >
        This feature is still under development. We’re actively improving it to
        provide more accurate and reliable output.
      </Alert>

      <div
        style={{
          display: "flex",
          flex: 1,
          minHeight: 0,
        }}
      >
        <div className="relative flex flex-1 min-h-0 overflow-hidden">
          <div
            className="flex-1 overflow-auto z-0 w-full"
            style={{ marginTop: 12 }}
          >
            <TemplateEditor />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
