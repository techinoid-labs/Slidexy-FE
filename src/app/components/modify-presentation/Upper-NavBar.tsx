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
import { useRouter } from "next/navigation";
import { useSlideThemeContext } from "@/app/context/ThemeContext";
import { useSlides } from "@/app/context/SlidesContext";
import { useUser } from "@/app/context/AuthContext";
import ProfileModal from "../auth/ProfileModal";

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
}> = ({ onExportPDF, onExportPPT, onClearCanvas, onPreview, onOpenThemePanel }) => {
  const [mobileMenuAnchor, setMobileMenuAnchor] = React.useState<null | HTMLElement>(null);
  const [isProfileModalOpen, setProfileModalOpen] = React.useState(false);

  const { user } = useUser();
  const displayName =
    user?.name || (user?.email ? extractNameFromEmail(user.email) : "Anonymous");
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

  // File name
  const [fileName, setFileName] = React.useState("Untitled");
  const [editing, setEditing] = React.useState(false);
  const [error, setError] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const saved = localStorage.getItem("fileName");
    if (saved) setFileName(saved);
  }, []);

  const handleBlur = () => {
    const trimmed = fileName.trim();
    if (trimmed.length < 3) {
      setError(true);
      const saved = localStorage.getItem("fileName");
      setFileName(saved || "Untitled");
    } else {
      setError(false);
      localStorage.setItem("fileName", trimmed);
      setFileName(trimmed);
    }
    setEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") inputRef.current?.blur();
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
          <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.5, md: 1.5 } }}>
            <IconButton onClick={() => router.push("/home")}>
              <Image src="/images/home-icon.svg" alt="Home" width={20} height={20} />
            </IconButton>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", ml: 1 }}>
              {editing ? (
                <input
                  ref={inputRef}
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
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
                  onClick={() => setEditing(true)}
                  sx={{
                    fontWeight: 600,
                    fontSize: 16,
                    cursor: "pointer",
                    "&:hover": { textDecoration: "underline" },
                    maxWidth: 200,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {fileName}
                </Typography>
              )}
              <Typography variant="caption" sx={{ color: "#888", fontSize: 12 }}>
                File Type
              </Typography>
            </Box>
          </Box>

          {/* Right Section */}
          <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.5, md: 1 } }}>
            {/* Undo / Redo */}
            <IconButton onClick={undo} disabled={!canUndo}>
              <UndoIcon />
            </IconButton>
            <IconButton onClick={redo} disabled={!canRedo}>
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
              <Box component="img" src="/preview.svg" alt="Preview" sx={{ width: 20, height: 20 }} />
            </IconButton>

            {/* Theme */}
            <IconButton
              onClick={() => {
                setSelectedImage(null);
                setSelectedImageIndex(null);
                setSelectedShapeIndex(null);
                setSelectedTextId(null);
                onOpenThemePanel();
              }}
            >
              <PaletteIcon />
            </IconButton>

            {/* Export Buttons (desktop only) */}
            {!isMobile && (
              <>
                <Box
                  onClick={onExportPDF}
                  sx={{
                    bgcolor: "#18181B",
                    background: "linear-gradient(80.89deg, #8E2DE2 -90.43%, #4A00E0 74.73%)",
                    color: "#fff",
                    borderRadius: "999px",
                    px: 2,
                    py: 1,
                    cursor: "pointer",
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  Export as PDF
                </Box>
                {onExportPPT && (
                  <Box
                    onClick={onExportPPT}
                    sx={{
                      bgcolor: "#18181B",
                      background: "linear-gradient(80.89deg, #8E2DE2 -90.43%, #4A00E0 74.73%)",
                      color: "#fff",
                      borderRadius: "999px",
                      px: 2,
                      py: 1,
                      cursor: "pointer",
                      fontSize: 14,
                      fontWeight: 600,
                    }}
                  >
                    Export as PPTX
                  </Box>
                )}
                <Box
                  onClick={onClearCanvas}
                  sx={{
                    bgcolor: "#18181B",
                    background: "linear-gradient(80.89deg, #8E2DE2 -90.43%, #4A00E0 74.73%)",
                    color: "#fff",
                    borderRadius: "999px",
                    px: 2,
                    py: 1,
                    cursor: "pointer",
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  Clear Canvas
                </Box>
              </>
            )}

            {/* Profile Button */}
            {!isMobile ? (
              <Button
                variant="outlined"
                onClick={() => setProfileModalOpen(true)}
                sx={{ borderRadius: "999px", height: 40, ml: 1, px: 2 }}
              >
                Profile
              </Button>
            ) : (
              <IconButton
                onClick={() => setProfileModalOpen(true)}
                sx={{
                  color: "#222",
                  backgroundColor: "#F8F8FA",
                  width: 28,
                  height: 28,
                  p: 0,
                }}
              >
                <Avatar sx={{ width: 24, height: 24, fontSize: 14 }}>{initial}</Avatar>
              </IconButton>
            )}

            {/* Mobile Hamburger for extra actions */}
            {isMobile && (
              <IconButton onClick={handleMobileMenuOpen}>
                <MenuIcon />
              </IconButton>
            )}
          </Box>
        </Toolbar>

        {/* Mobile Menu (no profile here anymore) */}
        <Menu
          anchorEl={mobileMenuAnchor}
          open={Boolean(mobileMenuAnchor)}
          onClose={handleMobileMenuClose}
        >
          <MenuItem onClick={onExportPDF}>Export as PDF</MenuItem>
          {onExportPPT && <MenuItem onClick={onExportPPT}>Export as PPTX</MenuItem>}
          {onClearCanvas && <MenuItem onClick={onClearCanvas}>Clear Canvas</MenuItem>}
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
        </Menu>
      </AppBar>

      {/* Profile Modal */}
      <ProfileModal open={isProfileModalOpen} onClose={() => setProfileModalOpen(false)} />
    </>
  );
};

export default UpperNavBar;
