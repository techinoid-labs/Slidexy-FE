"use client";

import React from "react";
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
  CircularProgress,
  Tooltip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import PaletteIcon from "@mui/icons-material/Palette";
import EditIcon from "@mui/icons-material/Edit";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { useRouter } from "next/navigation";
import { useSlideThemeContext } from "@/app/context/ThemeContext";
import { useSlides } from "@/app/context/SlidesContext";
import { useUser } from "@/app/context/AuthContext";
import NavProfileHandler from "../auth/NavProfileHandler";
import { LinkedInShareButton } from "../linkedin/LinkedInShareButton";
import { SHELL } from "./shellTheme";

// helper: extract readable name from email
const extractNameFromEmail = (email: string): string => {
  if (!email) return "User";
  const username = email.split("@")[0];
  return username
    .replace(/[._]/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const iconButtonSx = {
  borderRadius: "8px",
  color: SHELL.textMuted,
  width: 30,
  height: 30,
  padding: 0,
  transition: "background 0.15s ease, color 0.15s ease",
  "&:hover": { background: SHELL.surfaceHover, color: SHELL.text },
  "&:disabled": { opacity: 0.35 },
} as const;

const UpperNavBar: React.FC<{
  onExportPDF: () => void;
  onExportPPT?: () => void;
  onClearCanvas?: () => void;
  onPreview: () => void;
  onOpenThemePanel: () => void;
  isThemePanelOpen?: boolean;
  showAuthModal?: any;
  setShowAuthModal?: any;
  isExportingPDF?: boolean;
  isExportingPPT?: boolean;
  zoomPercent?: number;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onZoomFit?: () => void;
  isZoomFit?: boolean;
}> = ({
  onExportPDF,
  onExportPPT,
  onClearCanvas,
  onPreview,
  onOpenThemePanel,
  isThemePanelOpen = false,
  showAuthModal,
  setShowAuthModal,
  isExportingPDF = false,
  isExportingPPT = false,
  zoomPercent = 100,
  onZoomIn,
  onZoomOut,
  onZoomFit,
  isZoomFit = true,
}) => {
  const [mobileMenuAnchor, setMobileMenuAnchor] =
    React.useState<null | HTMLElement>(null);

  const { user } = useUser();
  const displayName =
    user?.name ||
    (user?.email ? extractNameFromEmail(user.email) : "Anonymous");

  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const { setSelectedTheme } = useSlideThemeContext();
  const {
    setSelectedImage,
    setSelectedImageIndex,
    setSelectedShapeIndex,
    setSelectedTextId,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useSlides();

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMenuAnchor(event.currentTarget);
  };
  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  // File name state
  const [fileName, setFileName] = React.useState("Untitled Presentation");
  const [editing, setEditing] = React.useState(false);
  const [tempFileName, setTempFileName] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Load saved file name on mount
  React.useEffect(() => {
    const saved = localStorage.getItem("fileName");
    if (saved) setFileName(saved);
  }, []);

  // Focus input when editing starts
  React.useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const handleStartEdit = () => {
    setTempFileName(fileName);
    setEditing(true);
  };

  const handleSave = () => {
    const trimmed = tempFileName.trim();
    if (trimmed.length >= 1) {
      setFileName(trimmed);
      localStorage.setItem("fileName", trimmed);
    }
    setEditing(false);
  };

  const handleCancel = () => {
    setTempFileName(fileName);
    setEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  const handleExportWithFileName = (exportFn: () => void) => {
    exportFn();
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: SHELL.bg,
          color: SHELL.text,
          borderBottom: `1px solid ${SHELL.border}`,
          boxShadow: "none",
          width: "100%",
          height: { xs: 56, md: 56 },
        }}
      >
        <Toolbar
          sx={{
            minHeight: { xs: 56, md: 56 },
            height: { xs: 56, md: 56 },
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: { xs: 1.5, md: 2 },
            gap: 1,
          }}
        >
          {/* ── Left: logo + title ── */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0 }}>
            <IconButton
              onClick={() => router.push("/")}
              size="small"
              sx={{
                width: 30, height: 30, borderRadius: "8px",
                background: SHELL.accent,
                "&:hover": { background: SHELL.accentDark },
              }}
            >
              <Box sx={{ width: 13, height: 13, borderRadius: "3px", background: "rgba(255,255,255,0.95)", transform: "rotate(15deg)" }} />
            </IconButton>

            {/* Editable title */}
            {editing ? (
              <Box sx={{ display: "flex", alignItems: "center", background: SHELL.surfaceSunken, border: `1.5px solid ${SHELL.accent}`, borderRadius: "8px", px: 1.25, py: 0.4, minWidth: 160, maxWidth: 300 }}>
                <input
                  ref={inputRef}
                  value={tempFileName}
                  onChange={(e) => setTempFileName(e.target.value)}
                  onBlur={handleSave}
                  onKeyDown={handleKeyDown}
                  style={{ fontSize: 13.5, fontWeight: 500, border: "none", outline: "none", background: "transparent", width: "100%", fontFamily: "inherit", color: SHELL.text }}
                />
              </Box>
            ) : (
              <Box
                onClick={handleStartEdit}
                sx={{ display: "flex", alignItems: "center", gap: 0.5, px: 1, py: 0.4, borderRadius: "8px", cursor: "pointer", maxWidth: 260, transition: "background 0.15s", "&:hover": { background: SHELL.surfaceHover, "& .pen": { opacity: 1 } } }}
              >
                <Typography sx={{ fontWeight: 500, fontSize: 13.5, color: SHELL.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {fileName}
                </Typography>
                <EditIcon className="pen" sx={{ fontSize: 12, color: SHELL.textMuted, opacity: 0, transition: "opacity 0.15s" }} />
              </Box>
            )}
          </Box>

          {/* ── Center: undo / redo / zoom ── */}
          <Box
            sx={{
              display: "flex", alignItems: "center", gap: 0.25,
              bgcolor: SHELL.surfaceSunken,
              border: `1px solid ${SHELL.border}`,
              borderRadius: "10px",
              px: 0.5, py: 0.25,
            }}
          >
            <IconButton onClick={undo} disabled={!canUndo || isExportingPDF || isExportingPPT} size="small" sx={iconButtonSx}>
              <UndoIcon sx={{ fontSize: 16 }} />
            </IconButton>
            <IconButton onClick={redo} disabled={!canRedo || isExportingPDF || isExportingPPT} size="small" sx={iconButtonSx}>
              <RedoIcon sx={{ fontSize: 16 }} />
            </IconButton>

            {!isMobile && onZoomIn && onZoomOut && onZoomFit && (
              <>
                <Divider orientation="vertical" flexItem sx={{ borderColor: SHELL.border, my: 0.75, mx: 0.25 }} />
                <IconButton onClick={onZoomOut} size="small" sx={{ ...iconButtonSx, width: 26, height: 26 }}>
                  <RemoveIcon sx={{ fontSize: 13 }} />
                </IconButton>
                <Tooltip title={isZoomFit ? "Auto-fit" : "Reset to fit"} placement="bottom">
                  <Box
                    onClick={onZoomFit}
                    sx={{
                      fontSize: 11.5, fontWeight: 600, color: isZoomFit ? SHELL.accent : SHELL.textMuted,
                      width: 38, textAlign: "center", cursor: "pointer", userSelect: "none",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {zoomPercent}%
                  </Box>
                </Tooltip>
                <IconButton onClick={onZoomIn} size="small" sx={{ ...iconButtonSx, width: 26, height: 26 }}>
                  <AddIcon sx={{ fontSize: 13 }} />
                </IconButton>
              </>
            )}
          </Box>

          {/* ── Right: actions ── */}
          <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.5, md: 0.75 } }}>

            {/* Preview */}
            {!isMobile && (
              <Tooltip title="Preview">
                <IconButton onClick={onPreview} disabled={isExportingPDF || isExportingPPT} size="small" sx={iconButtonSx}>
                  <Box component="img" src="/preview.svg" alt="Preview" sx={{ width: 15, height: 15, opacity: 0.65 }} />
                </IconButton>
              </Tooltip>
            )}

            {/* Theme */}
            {!isMobile && (
              <Tooltip title="Theme">
                <IconButton
                  onClick={onOpenThemePanel}
                  disabled={isExportingPDF || isExportingPPT}
                  size="small"
                  sx={{ ...iconButtonSx, color: isThemePanelOpen ? SHELL.accent : SHELL.textMuted, background: isThemePanelOpen ? SHELL.accentBg : "transparent" }}
                >
                  <PaletteIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
            )}

            {/* LinkedIn share */}
            {!isMobile && <LinkedInShareButton sx={{ mr: 0.25 }} />}

            {/* Export group (desktop) */}
            {!isMobile && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.6, ml: 0.25 }}>
                <Box
                  component="button"
                  onClick={() => !isExportingPDF && handleExportWithFileName(onExportPDF)}
                  disabled={isExportingPDF}
                  sx={{
                    display: "flex", alignItems: "center", gap: 0.5,
                    px: 1.5, py: 0.55, borderRadius: "8px", border: `1.5px solid ${SHELL.border}`,
                    background: "transparent", color: SHELL.text, fontSize: 12.5, fontWeight: 600,
                    cursor: isExportingPDF ? "not-allowed" : "pointer", opacity: isExportingPDF ? 0.6 : 1,
                    fontFamily: "inherit", whiteSpace: "nowrap",
                    transition: "all 0.15s ease",
                    "&:hover": { background: SHELL.surfaceHover, borderColor: SHELL.borderStrong },
                  }}
                >
                  {isExportingPDF ? <CircularProgress size={11} sx={{ color: SHELL.accent }} /> : null}
                  {isExportingPDF ? "PDF…" : "PDF"}
                </Box>

                <Box
                  component="button"
                  onClick={() => !isExportingPPT && onExportPPT?.()}
                  disabled={isExportingPPT}
                  sx={{
                    display: "flex", alignItems: "center", gap: 0.5,
                    px: 1.5, py: 0.55, borderRadius: "8px", border: "none",
                    background: SHELL.accent,
                    color: "#fff", fontSize: 12.5, fontWeight: 600,
                    cursor: isExportingPPT ? "not-allowed" : "pointer", opacity: isExportingPPT ? 0.7 : 1,
                    fontFamily: "inherit", whiteSpace: "nowrap",
                    transition: "all 0.15s ease",
                    "&:hover": { background: SHELL.accentDark },
                  }}
                >
                  {isExportingPPT ? <CircularProgress size={11} sx={{ color: "#fff" }} /> : null}
                  {isExportingPPT ? "PPTX…" : "PPTX"}
                </Box>
              </Box>
            )}

            {/* Profile */}
            {!isMobile ? (
              <NavProfileHandler setAuthModalOpen={setShowAuthModal} />
            ) : (
              <IconButton onClick={handleMobileMenuOpen} sx={{ color: SHELL.text }}><MenuIcon /></IconButton>
            )}
          </Box>
        </Toolbar>

        {/* Mobile Menu */}
        <Menu anchorEl={mobileMenuAnchor} open={Boolean(mobileMenuAnchor)} onClose={handleMobileMenuClose}>
          <MenuItem onClick={onPreview}>Preview</MenuItem>
          <MenuItem onClick={onOpenThemePanel}>Themes</MenuItem>
          <Divider />
          <MenuItem disabled={isExportingPDF} onClick={() => { handleExportWithFileName(onExportPDF); handleMobileMenuClose(); }}>
            {isExportingPDF && <CircularProgress size={14} sx={{ mr: 1 }} />}
            Export PDF
          </MenuItem>
          {onExportPPT && (
            <MenuItem disabled={isExportingPPT} onClick={() => { handleExportWithFileName(onExportPPT); handleMobileMenuClose(); }}>
              {isExportingPPT && <CircularProgress size={14} sx={{ mr: 1 }} />}
              Export PPTX
            </MenuItem>
          )}
          <Divider />
          <MenuItem>
            <LinkedInShareButton />
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => { onClearCanvas?.(); handleMobileMenuClose(); }}>Clear Canvas</MenuItem>
          <Divider />
          <MenuItem><NavProfileHandler showMail setAuthModalOpen={setShowAuthModal} /></MenuItem>
        </Menu>
      </AppBar>
    </>
  );
};
export default UpperNavBar;
