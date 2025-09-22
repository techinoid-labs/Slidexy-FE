import React, { useState, useRef, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  useMediaQuery,
  useTheme,
  Button,
  CircularProgress,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useRouter } from "next/navigation";
import { useTemplateSlides } from "@/app/context/TemplateSlidesContext";
import { useSession } from "next-auth/react";
import { useUser } from "@/app/context/AuthContext";
import ProfileModal from "@/app/components/auth/ProfileModal";
import NavProfileHandler from "@/app/components/auth/NavProfileHandler";
import AuthModal from "@/app/components/auth/AuthModal";
import { exportPresentationToPdf } from "../pdfExportTemplate";
import { exportToPowerPoint } from "../pptxExportTemplate";
import { convertPresentation } from "@/utils/convertPresentation";
import type { Presentation } from "@/app/text-to-template/types/presentation";
import { enhanceSlideWithExportElements } from "@/utils/htmlToJsonParser";

const TemplateNavBar: React.FC<{
  presentationId?: string | null;
}> = ({ presentationId }) => {
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState<null | HTMLElement>(
    null
  );
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [isExportingPPTX, setIsExportingPPTX] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { slideTemplates, selectedTemplate } = useTemplateSlides();
  const { data: session } = useSession();
  const { user, loading } = useUser();

  const [templateFileName, setTemplateFileName] = useState("Untitled");
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.removeItem("templateFileName");
    setTemplateFileName("Untitled");
  }, []);

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => setMobileMenuAnchor(null);

  const handleEdit = () => setEditing(true);

  const handleBlur = () => {
    const trimmed = templateFileName.trim();
    if (trimmed.length < 3) {
      setError(true);
      setTemplateFileName("Untitled");
      localStorage.removeItem("templateFileName");
    } else {
      setError(false);
      localStorage.setItem("templateFileName", trimmed);
      setTemplateFileName(trimmed);
    }
    setEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") inputRef.current?.blur();
  };

  const handleExportClick = async (type: "pptx" | "pdf") => {
    if (loading) return;

    if (!session?.user && !user) {
      setShowAuthModal(true);
      return;
    }

    try {
      const presentation: Presentation = {
        slides: slideTemplates,
        id: presentationId || "presentation",
        topic: templateFileName || "Presentation",
      };

      const convertedPresentation = convertPresentation(
        presentation,
        selectedTemplate
      );
      const enhancedPresentation = {
        ...convertedPresentation,
        slides: convertedPresentation.slides.map(
          enhanceSlideWithExportElements
        ),
      };

      if (type === "pdf") {
        setIsExportingPDF(true);
        setExportError(null);
        await exportPresentationToPdf(enhancedPresentation, {
          filename: `${templateFileName || "presentation"}.pdf`,
          quality: 1.0,
          format: "presentation",
          orientation: "landscape",
          pixelRatio: 3,
        });
      } else if (type === "pptx") {
        setIsExportingPPTX(true);
        setExportError(null);
        await exportToPowerPoint(enhancedPresentation);
      }
    } catch (error) {
      console.error(`${type.toUpperCase()} export failed`, error);
      setExportError(error instanceof Error ? error.message : "Export failed");
    } finally {
      setIsExportingPDF(false);
      setIsExportingPPTX(false);
    }
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: "#fff",
          color: "#18181B",
          borderBottom: "1px solid #E0E0E0",
          width: "100%",
          height: { xs: 64, md: 80 },
        }}
      >
        <Toolbar
          sx={{
            minHeight: { xs: 64, md: 80 },
            display: "flex",
            justifyContent: "space-between",
            px: { xs: 1, md: 3 },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton onClick={() => router.push("/")}>
              <img
                src="/images/home-icon.svg"
                alt="Home"
                width={20}
                height={20}
              />
            </IconButton>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              {editing ? (
                <input
                  ref={inputRef}
                  value={templateFileName}
                  onChange={(e) => setTemplateFileName(e.target.value)}
                  onBlur={handleBlur}
                  onKeyDown={handleKeyDown}
                  autoFocus
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    border: error ? "1px solid red" : "none",
                    outline: "none",
                    background: "transparent",
                    maxWidth: 200,
                  }}
                />
              ) : (
                <Typography
                  variant="subtitle1"
                  onClick={handleEdit}
                  sx={{ cursor: "pointer" }}
                >
                  {templateFileName || "Untitled"}
                </Typography>
              )}
              <Typography variant="caption" sx={{ color: "#888" }}>
                File Type
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {!isMobile && (
              <>
                <Button
                  onClick={() => handleExportClick("pptx")}
                  disabled={slideTemplates.length <= 0 || isExportingPPTX}
                  sx={{
                    bgcolor:
                      slideTemplates.length > 0 && !isExportingPPTX
                        ? "#4A00E0"
                        : "#ccc",
                    color: "#fff",
                    borderRadius: "999px",
                    px: 2,
                    mr: 1,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  {isExportingPPTX && (
                    <CircularProgress size={16} color="inherit" />
                  )}
                  Export as PPTX
                </Button>
                <Button
                  onClick={() => handleExportClick("pdf")}
                  disabled={slideTemplates.length <= 0 || isExportingPDF}
                  sx={{
                    bgcolor:
                      slideTemplates.length > 0 && !isExportingPDF
                        ? "#4A00E0"
                        : "#ccc",
                    color: "#fff",
                    borderRadius: "999px",
                    px: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  {isExportingPDF && (
                    <CircularProgress size={16} color="inherit" />
                  )}
                  Export as PDF
                </Button>
              </>
            )}
            <NavProfileHandler setProfileModalOpen={setIsProfileModalOpen} />
          </Box>

          <Menu
            anchorEl={mobileMenuAnchor}
            open={Boolean(mobileMenuAnchor)}
            onClose={handleMobileMenuClose}
          >
            <Divider />
            <MenuItem
              onClick={() => {
                handleExportClick("pptx");
                handleMobileMenuClose();
              }}
              disabled={isExportingPPTX}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {isExportingPPTX && <CircularProgress size={12} />}
                <Typography fontSize={14}>Export as PPTX</Typography>
              </Box>
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleExportClick("pdf");
                handleMobileMenuClose();
              }}
              disabled={isExportingPDF}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {isExportingPDF && <CircularProgress size={12} />}
                <Typography fontSize={14}>Export as PDF</Typography>
              </Box>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {exportError && (
        <Box
          sx={{
            position: "fixed",
            top: 100,
            right: 20,
            bgcolor: "error.main",
            color: "white",
            p: 2,
            borderRadius: 1,
            zIndex: 9999,
            maxWidth: 300,
          }}
        >
          <Typography variant="body2">Export Error: {exportError}</Typography>
          <Button
            size="small"
            onClick={() => setExportError(null)}
            sx={{ color: "white", mt: 1 }}
          >
            Dismiss
          </Button>
        </Box>
      )}

      <ProfileModal
        open={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          presentationId={presentationId}
        />
      )}
    </>
  );
};

export default TemplateNavBar;
