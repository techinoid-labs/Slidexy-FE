"use client";

import { useTheme, useMediaQuery } from "@mui/material";
import { Alert, Typography } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import TemplateNavBar from "../template-components/TemplateNavbar";
import ProfessionalPresentationViewer from "../template-components/ProfessionalPresentationViewer";
import { useTemplateSlides } from "@/app/context/TemplateSlidesContext";
import { usePresentation } from "@/app/text-to-template/hooks/usePresentation";
//import { exportPresentationToPptx } from "../pptxExportTemplate";
import { exportPresentationToPdf } from "../pdfExportTemplate";
import { convertPresentation } from "@/utils/convertPresentation";
import type { Presentation } from "@/app/text-to-template/types/presentation";

const Page = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const router = useRouter();
  const params = useParams();
  const pid = params?.pid as string;

  // Redirect if no valid pid
  if (!pid) {
    router.push("/error");
    return null;
  }

  // Fetch presentation using custom hook
  const { presentation, loading, error } = usePresentation(pid);

  const { slideTemplates, setSlideTemplates, presentationId, setPresentationId, selectedTemplate } = useTemplateSlides();

  useEffect(() => {
    if (presentation && presentation.slides) {
      console.log("Setting presentationId:", presentation.id);
      console.log("Setting slideTemplates:", presentation.slides);
      setPresentationId(presentation.id);
      setSlideTemplates(presentation.slides);
    }
  }, [presentation, setPresentationId, setSlideTemplates]);

  const handleExportPPTX = () => {
    const rawPresentation: Presentation = {
      slides: slideTemplates || [],
      id: presentationId || pid, // Use pid as fallback
    };
    const converted = convertPresentation(rawPresentation, selectedTemplate);
    //exportPresentationToPptx(converted);
  };

  const handleExportPDF = async () => {
    try {
      const rawPresentation: Presentation = {
        slides: slideTemplates || [],
        id: presentationId || pid,
        topic: presentation?.topic || presentation?.title || "AI in 2025"
      };
      
      const converted = convertPresentation(rawPresentation, selectedTemplate);
      
      // Wait a bit for any pending renders to complete
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await exportPresentationToPdf(converted, {
        filename: `${presentation?.topic || 'presentation'}.pdf`,
        quality: 0.95,
        format: 'presentation',
        orientation: 'landscape'
      });
      
    } catch (error) {
      console.error('PDF export failed:', error);
      // You could add a toast notification here
    }
  };

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
        <div style={{ flexShrink: 0, height: "80px", zIndex: 20 }}>
          <TemplateNavBar 
            presentationId={pid} 
          />
        </div>
      ) : (
        <TemplateNavBar 
          presentationId={pid} 
        />
      )}

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
        This feature is still under development. We're actively improving it to
        provide more accurate and reliable output.
      </Alert>

      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        <div className="relative flex flex-1 min-h-0 overflow-hidden">
          <div className="flex-1 overflow-auto z-0 w-full" style={{ marginTop: 12 }}>
            {loading ? (
              <Typography>Loading presentation...</Typography>
            ) : error ? (
              <Alert severity="error">{error}</Alert>
            ) : (
              <ProfessionalPresentationViewer presentationId={pid} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;