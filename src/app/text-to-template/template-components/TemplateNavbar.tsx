"use client";

import React, { useState, useRef, useEffect } from "react";
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
  TextField,
  Modal,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useRouter } from "next/navigation";
import { useTemplateSlides } from "@/app/context/TemplateSlidesContext";
import axios from "axios";
import { useSession, signIn } from "next-auth/react";
import AuthModal from "../../components/auth/AuthModal";
import { useUser } from "@/app/context/AuthContext";
import ProfileModal from "../../components/auth/ProfileModal";
import NavProfileHandler from "@/app/components/auth/NavProfileHandler";
// --- Template NavBar ---
const TemplateNavBar: React.FC<{
  onExportPPT?: () => void;
  presentationId?: string | null;
}> = ({ onExportPPT, presentationId }) => {
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState<null | HTMLElement>(
    null
  );
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { slideTemplates } = useTemplateSlides();
  const { data: session } = useSession();

  const [templateFileName, setTemplateFileName] = useState("Untitled");
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { user, loading } = useUser();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  // Clear old title on mount
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

  const handleExportClick = async () => {
    if (loading) return;

    if (session?.user || user) {
      setShowAuthModal(false);
    } else {
      setShowAuthModal(true);
      return;
    }

    try {
      console.log("Session:", session);
      console.log("Token sent:", session?.user?.accessToken);

      const token = session?.user?.accessToken;

      if (!token) {
        console.error("No access token available");
        return;
      }

      const response = await axios.get(
        `${API_BASE_URL}/api/presentations/${presentationId}/export`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${templateFileName}.pptx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Export failed", error);
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
          {/* Left section */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton onClick={() => router.push("/")}>
              <Image
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

          {/* Right section */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {isMobile ? (
              <IconButton onClick={handleMobileMenuOpen}>
                <MenuIcon />
              </IconButton>
            ) : (
              onExportPPT && (
                <Button
                  onClick={handleExportClick}
                  disabled={slideTemplates.length <= 0}
                  sx={{
                    bgcolor: slideTemplates.length > 0 ? "#4A00E0" : "#ccc",
                    color: "#fff",
                    borderRadius: "999px",
                    px: 2,
                  }}
                >
                  Export as PPTX
                </Button>
              )
            )}
            <NavProfileHandler setProfileModalOpen={setIsProfileModalOpen} />
          </Box>
          {/* <Button
            variant="outlined"
            onClick={() => setIsProfileModalOpen(true)}
            sx={{ borderRadius: "999px", height: 40, mr: 1, width: 100 }}
          >
            Profile
          </Button> */}
        </Toolbar>

        {/* Mobile menu */}
        <Menu
          anchorEl={mobileMenuAnchor}
          open={Boolean(mobileMenuAnchor)}
          onClose={handleMobileMenuClose}
        >
          <Divider />
          {onExportPPT && (
            <MenuItem
              onClick={() => {
                handleExportClick();
                handleMobileMenuClose();
              }}
            >
              <Typography fontSize={14}>Export as PPTX</Typography>
            </MenuItem>
          )}
        </Menu>
      </AppBar>

      {/* Auth Modal */}
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
