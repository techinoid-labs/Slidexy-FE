"use client";

import React from "react";
import Image from "next/image";
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
  Avatar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import PaletteIcon from "@mui/icons-material/Palette";
import EditIcon from "@mui/icons-material/Edit";
import { useRouter } from "next/navigation";
import { useSlideThemeContext } from "@/app/context/ThemeContext";
import { useSlides } from "@/app/context/SlidesContext";
import { useUser } from "@/app/context/AuthContext";
import NavProfileHandler from "../auth/NavProfileHandler";
import { LinkedInShareButton } from "../linkedin/LinkedInShareButton";

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

const UpperNavBar: React.FC<{
  onExportPDF: () => void;
  onExportPPT?: () => void;
  onClearCanvas?: () => void;
  onPreview: () => void;
  onOpenThemePanel: () => void;
  isThemePanelOpen?: boolean;
  showAuthModal?: any;
  setShowAuthModal?: any;
}> = ({
  onExportPDF,
  onExportPPT,
  onClearCanvas,
  onPreview,
  onOpenThemePanel,
  isThemePanelOpen = false,
  showAuthModal,
  setShowAuthModal,
}) => {
  const [mobileMenuAnchor, setMobileMenuAnchor] =
    React.useState<null | HTMLElement>(null);
  const [isAuthModalOpen, setAuthModalOpen] = React.useState(false);

  const { user } = useUser();
  const displayName =
    user?.name ||
    (user?.email ? extractNameFromEmail(user.email) : "Anonymous");
  const initial = displayName ? displayName[0].toUpperCase() : "U";

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
    // You can pass fileName to export functions if needed
    exportFn();
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
            height: { xs: 64, md: 80 },
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: { xs: 1, md: 3 },
          }}
        >
          {/* Left Section */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 0.5, md: 1.5 },
            }}
          >
            <IconButton onClick={() => router.push("/")}>
              <Image
                src="/images/home-icon.svg"
                alt="Home"
                width={20}
                height={20}
              />
            </IconButton>
            
            {/* Google Docs Style File Name Editor */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                ml: 1,
              }}
            >
              {editing ? (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    bgcolor: "#f8f9fa",
                    border: "2px solid #1a73e8",
                    borderRadius: "4px",
                    px: 1,
                    py: 0.5,
                    minWidth: 200,
                    maxWidth: 400,
                  }}
                >
                  <input
                    ref={inputRef}
                    value={tempFileName}
                    onChange={(e) => setTempFileName(e.target.value)}
                    onBlur={handleSave}
                    onKeyDown={handleKeyDown}
                    style={{
                      fontSize: 16,
                      fontWeight: 500,
                      border: "none",
                      outline: "none",
                      background: "transparent",
                      width: "100%",
                      fontFamily: "inherit",
                    }}
                  />
                </Box>
              ) : (
                <Box
                  onClick={handleStartEdit}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    px: 1,
                    py: 0.5,
                    borderRadius: "4px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      bgcolor: "#f8f9fa",
                      "& .edit-icon": {
                        opacity: 1,
                      },
                    },
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 500,
                      fontSize: 16,
                      color: "#202124",
                      maxWidth: 300,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {fileName}
                  </Typography>
                  <EditIcon
                    className="edit-icon"
                    sx={{
                      fontSize: 16,
                      color: "#5f6368",
                      opacity: 0,
                      transition: "opacity 0.2s ease",
                    }}
                  />
                </Box>
              )}
            </Box>
          </Box>

          {/* Right Section */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 0.5, md: 1 },
            }}
          >
            {/* Undo / Redo */}
            <IconButton 
              onClick={undo} 
              disabled={!canUndo}
              sx={{
                "&:disabled": {
                  opacity: 0.4,
                },
              }}
            >
              <UndoIcon />
            </IconButton>
            <IconButton 
              onClick={redo} 
              disabled={!canRedo}
              sx={{
                "&:disabled": {
                  opacity: 0.4,
                },
              }}
            >
              <RedoIcon />
            </IconButton>

            {/* Preview */}
            <IconButton
              onClick={() => {
                setSelectedImage(null);
                setSelectedImageIndex(null);
                setSelectedShapeIndex(null);
                setSelectedTextId(null);
                onPreview();
              }}
            >
              <Box
                component="img"
                src="/preview.svg"
                alt="Preview"
                sx={{ width: 20, height: 20 }}
              />
            </IconButton>

            {/* Theme Button with Pressed Effect */}
            <IconButton
              onClick={() => {
                setSelectedImage(null);
                setSelectedImageIndex(null);
                setSelectedShapeIndex(null);
                setSelectedTextId(null);
                onOpenThemePanel();
              }}
              sx={{
                position: "relative",
                bgcolor: isThemePanelOpen ? "rgba(142, 45, 226, 0.1)" : "transparent",
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: isThemePanelOpen 
                    ? "rgba(142, 45, 226, 0.15)" 
                    : "rgba(0, 0, 0, 0.04)",
                },
                "&::before": isThemePanelOpen ? {
                  content: '""',
                  position: "absolute",
                  bottom: 0,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "70%",
                  height: "3px",
                  bgcolor: "#8E2DE2",
                  borderRadius: "3px 3px 0 0",
                } : {},
              }}
            >
              <PaletteIcon 
                sx={{ 
                  color: isThemePanelOpen ? "#8E2DE2" : "inherit",
                  transition: "color 0.2s ease",
                }} 
              />
            </IconButton>

            {/* Export Buttons (desktop only) */}
            {!isMobile && (
              <>
                {/* LinkedIn Share Button */}
                <LinkedInShareButton sx={{ mr: 1 }} />

                <Box
                  onClick={() => handleExportWithFileName(onExportPDF)}
                  sx={{
                    bgcolor: "#18181B",
                    background:
                      "linear-gradient(80.89deg, #8E2DE2 -90.43%, #4A00E0 74.73%)",
                    color: "#fff",
                    borderRadius: "999px",
                    px: 2,
                    py: 1,
                    cursor: "pointer",
                    fontSize: 14,
                    fontWeight: 600,
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 4px 12px rgba(142, 45, 226, 0.3)",
                    },
                    "&:active": {
                      transform: "translateY(0)",
                    },
                  }}
                >
                  Export as PDF
                </Box>
                {onExportPPT && (
                  <Box
                    onClick={() => handleExportWithFileName(onExportPPT)}
                    sx={{
                      bgcolor: "#18181B",
                      background:
                        "linear-gradient(80.89deg, #8E2DE2 -90.43%, #4A00E0 74.73%)",
                      color: "#fff",
                      borderRadius: "999px",
                      px: 2,
                      py: 1,
                      cursor: "pointer",
                      fontSize: 14,
                      fontWeight: 600,
                      transition: "transform 0.2s ease, box-shadow 0.2s ease",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 4px 12px rgba(142, 45, 226, 0.3)",
                      },
                      "&:active": {
                        transform: "translateY(0)",
                      },
                    }}
                  >
                    Export as PPTX
                  </Box>
                )}
                <Box
                  onClick={onClearCanvas}
                  sx={{
                    bgcolor: "#18181B",
                    background:
                      "linear-gradient(80.89deg, #8E2DE2 -90.43%, #4A00E0 74.73%)",
                    color: "#fff",
                    borderRadius: "999px",
                    px: 2,
                    py: 1,
                    cursor: "pointer",
                    fontSize: 14,
                    fontWeight: 600,
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 4px 12px rgba(142, 45, 226, 0.3)",
                    },
                    "&:active": {
                      transform: "translateY(0)",
                    },
                  }}
                >
                  Clear Canvas
                </Box>
              </>
            )}

            {/* Profile Button */}
            {!isMobile ? (
              <NavProfileHandler setAuthModalOpen={setShowAuthModal} />
            ) : null}

            {/* Mobile Hamburger for extra actions */}
            {isMobile && (
              <IconButton onClick={handleMobileMenuOpen}>
                <MenuIcon />
              </IconButton>
            )}
          </Box>
        </Toolbar>

        {/* Mobile Menu */}
        <Menu
          anchorEl={mobileMenuAnchor}
          open={Boolean(mobileMenuAnchor)}
          onClose={handleMobileMenuClose}
        >
          <MenuItem onClick={() => { handleExportWithFileName(onExportPDF); handleMobileMenuClose(); }}>
            Export as PDF
          </MenuItem>
          {onExportPPT && (
            <MenuItem onClick={() => { handleExportWithFileName(onExportPPT); handleMobileMenuClose(); }}>
              Export as PPTX
            </MenuItem>
          )}
          {onClearCanvas && (
            <MenuItem onClick={() => { onClearCanvas(); handleMobileMenuClose(); }}>
              Clear Canvas
            </MenuItem>
          )}
          <Divider />
          <MenuItem sx={{ py: 1, px: 2 }} disableRipple>
            <LinkedInShareButton />
          </MenuItem>
          <Divider />
          <MenuItem
            onClick={() => {
              setSelectedTheme(null);
              localStorage.removeItem("slidesTheme");
              handleMobileMenuClose();
            }}
          >
            Reset Themes
          </MenuItem>
          <Divider />
          <MenuItem>
            <NavProfileHandler
              showMail={true}
              setAuthModalOpen={setShowAuthModal}
            />
          </MenuItem>
        </Menu>
      </AppBar>
    </>
  );
};

export default UpperNavBar;