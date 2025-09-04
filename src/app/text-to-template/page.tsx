
"use client";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Box, Container, Typography } from "@mui/material";
import { useTemplateSlides } from "@/app/context/TemplateSlidesContext";
import PresentationViewer from "./template-components/ProfessionalPresentationViewer"; 
import { exportPresentationToPptx } from "./pptxExportTemplate";
import type { Presentation } from "@/app/text-to-template/types/presentation";
import { useTheme, useMediaQuery, Alert } from "@mui/material";
import ProfessionalPresentationViewer from "./template-components/ProfessionalPresentationViewer";
import TemplateNavBar from "./template-components/TemplateNavbar";
import { convertPresentation } from "@/utils/convertPresentation";
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
    background: {
      default: "#f8fafc",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
  },
});

const Page = () => {
  const theme = useTheme();
 const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const { slideTemplates, presentationId, selectedTemplate } = useTemplateSlides();

  const presentation: Presentation = {
    slides: slideTemplates || [],
    id: presentationId || "unknown",
    
  };

const handleExportPPTX = () => {
  const rawPresentation: Presentation = { 
    slides: slideTemplates || [], 
    id: presentationId || "unknown" 
  };

  const converted = convertPresentation(rawPresentation, selectedTemplate);
  exportPresentationToPptx(converted);
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
           <div
             style={{
               flexShrink: 0,
               height: "80px",
               zIndex: 20,
             }}
           >
             <TemplateNavBar onExportPPT={handleExportPPTX} presentationId={presentationId}
 />
           </div>
         ) : (
           <TemplateNavBar onExportPPT={handleExportPPTX} presentationId={presentationId}
 />
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
               <ProfessionalPresentationViewer presentationId={presentationId || "unknown"} />
             </div>
           </div>
         </div>
       </div>
     );
};

export default Page;