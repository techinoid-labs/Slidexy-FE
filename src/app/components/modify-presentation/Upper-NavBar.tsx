import React from "react";
import Image from "next/image";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Tooltip,
  Avatar,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
  ListItemIcon,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import { useRouter } from "next/navigation";
import { useSlideThemeContext } from "@/app/context/ThemeContext";
import { useSlides } from "@/app/context/SlidesContext";

const UpperNavBar: React.FC<{
  onExportPDF: () => void;
  onExportPPT?: () => void;
  onClearCanvas?: () => void;
  // New prop for clearing canvas
  onPreview: () => void;
}> = ({ onExportPDF, onExportPPT, onClearCanvas, onPreview }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] =
    React.useState<null | HTMLElement>(null);
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { setSelectedLayout, setSelectedTheme } = useSlideThemeContext();
  const {
    setSelectedImage,
    setSelectedImageIndex,
    setSelectedShapeIndex,
    setSelectedTextId,
    selectedImage,
    selectedImageIndex,
    selectedShapeIndex,
    selectedTextId,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useSlides();

  // Handlers for mobile menu
  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  const [fileName, setFileName] = React.useState("Untitled");
  const [editing, setEditing] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const saved = localStorage.getItem("fileName");
    if (saved) setFileName(saved);
  }, []);

  const handleEdit = () => setEditing(true);

  const [error, setError] = React.useState(false);

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
    if (e.key === "Enter") {
      e.preventDefault();
      inputRef.current?.blur();
    }
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        bgcolor: "#fff",
        color: "#18181B",
        borderBottom: "1px solid #E0E0E0",
        width: "100%",
        height: { xs: 74, md: 80 },
        boxSizing: "border-box",
      }}
    >
      <Toolbar
        sx={{
          minHeight: 80,
          height: 80,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          position: "relative",
          px: 3,
        }}
      >
        {/* Left Icons */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, ml: -1 }}>
          <IconButton onClick={() => router.push("/home")} sx={{ p: 1 }}>
            <Image
              src="/images/home-icon.svg"
              alt="Home"
              width={25}
              height={25}
            />
          </IconButton>
          <Box
            sx={{
              width: "1px",
              height: 32,
              background: "#E0E0E0",
              borderRadius: 1,
              mx: 1,
              display: { xs: "none", md: "block" },
            }}
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              ml: 1,
            }}
          >
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
                  padding: 0,
                  margin: 0,
                  whiteSpace: "nowrap",
                }}
              />
            ) : (
              <Typography
                variant="subtitle1"
                onClick={handleEdit}
                sx={{
                  fontWeight: { xs: 400, md: 600 },
                  fontSize: 16,
                  cursor: "pointer",
                  "&:hover": { textDecoration: "underline" },
                  whiteSpace: "nowrap",
                }}
              >
                {fileName || "File Name Here"}
              </Typography>
            )}
            <Typography
              variant="caption"
              sx={{
                color: "#888",
                mt: -0.5,
                fontSize: 12,
                whiteSpace: "nowrap",
              }}
            >
              File Type
            </Typography>
          </Box>
        </Box>

        {/* Right Icons */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {isMobile && (
            <>
              <Box>
                <IconButton
                  onClick={undo}
                  disabled={!canUndo}
                  sx={{
                    color: "#222",
                    backgroundColor: "#F8F8FA",
                    padding: "2px",
                    width: 32,
                    height: 30,
                    mb: 0.2,
                    ml: { xs: 12, md: 100 },
                    mr: { xs: -2 },
                  }}
                >
                  <UndoIcon sx={{ fontWeight: 200, fontSize: 20 }} />
                </IconButton>
              </Box>
              <Box>
                <IconButton
                  onClick={redo}
                  disabled={!canRedo}
                  sx={{
                    color: "#222",
                    backgroundColor: "#F8F8FA",
                    padding: "2px",
                    width: 32,
                    height: 30,
                    mb: 0.2,
                    ml: { xs: 2, md: 0 },
                  }}
                >
                  <RedoIcon sx={{ fontWeight: 200, fontSize: 20 }} />
                </IconButton>
              </Box>
              <Box>
                <IconButton
                  onClick={() => {
                    setSelectedImage(null);
                    setSelectedImageIndex(null);
                    setSelectedShapeIndex(null);
                    setSelectedTextId(null);
                    setTimeout(() => {
                      onPreview();
                      handleMobileMenuClose();
                    }, 300);
                  }}
                  sx={{
                    backgroundColor: "rgba(242, 240, 255, 1)",
                    color: "#222",
                    padding: "2px",
                    width: { xs: 32, lg: 39, sm: 40, md: 30 },
                    height: { xs: 30, lg: 40, sm: 40, md: 30 },
                    mb: 0.2,
                    ml: { xs: 2, md: 0 },
                    mr: { xs: -0.5, md: 0 },
                  }}
                >
                  <Box
                    component="img"
                    src="/preview.svg"
                    alt="Preview"
                    sx={{
                      width: { xs: 15, sm: 20, md: 20, lg: 9 },
                      height: { xs: 15, sm: 20, md: 20, lg: 9 },
                      ml: 0.5,
                    }}
                  />
                </IconButton>
              </Box>
            </>
          )}
          {/* Desktop Export and Clear Buttons */}
          {!isMobile && (
            <>
              <Box>
                <IconButton
                  onClick={() => {
                    setSelectedImage(null);
                    setSelectedImageIndex(null);
                    setSelectedShapeIndex(null);
                    setSelectedTextId(null);
                    setTimeout(() => {
                      onPreview();
                      handleMobileMenuClose();
                    }, 300);
                  }}
                  sx={{
                    backgroundColor: "rgba(242, 240, 255, 1)",
                    color: "#222",
                    padding: "2px",
                    width: { xs: 32, lg: 39, sm: 40 },
                    height: { xs: 30, lg: 40, sm: 40 },
                    mb: 0.2,
                    ml: { xs: 2, md: 0 },
                  }}
                >
                  <Box
                    component="img"
                    src="/preview.svg"
                    alt="Preview"
                    sx={{
                      width: { xs: 15, sm: 20, md: 20, lg: 20 },
                      height: { xs: 15, sm: 20, md: 20, lg: 20 },
                      ml: 0.5,
                    }}
                  />
                </IconButton>
              </Box>
              <Box
                onClick={() => {
                  setSelectedImage(null);
                  setSelectedImageIndex(null);
                  setSelectedShapeIndex(null);
                  setSelectedTextId(null);
                  setTimeout(() => {
                    onExportPDF();
                    handleMobileMenuClose();
                  }, 300);
                }}
                sx={{
                  bgcolor: "#18181B",
                  background:
                    "linear-gradient(80.89deg, #8E2DE2 -90.43%, #4A00E0 74.73%)",
                  color: "#fff",
                  borderRadius: "999px",
                  px: 3,
                  py: 1.2,
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: 600,
                  ml: 1,
                  "&:hover": { bgcolor: "#333" },
                }}
              >
                Export as PDF
              </Box>

              {onExportPPT && (
                <Box
                  onClick={onExportPPT}
                  sx={{
                    bgcolor: "#18181B",
                    background:
                      "linear-gradient(80.89deg, #8E2DE2 -90.43%, #4A00E0 74.73%)",
                    color: "#fff",
                    borderRadius: "999px",
                    px: 3,
                    py: 1.2,
                    cursor: "pointer",
                    fontSize: 14,
                    fontWeight: 600,
                    ml: 1,
                    "&:hover": { bgcolor: "#333" },
                  }}
                >
                  Export as PPTX
                </Box>
              )}

              <Box
                onClick={() => {
                  setSelectedImage(null);
                  setSelectedImageIndex(null);
                  setSelectedShapeIndex(null);
                  setSelectedTextId(null);
                  setTimeout(() => {
                    onClearCanvas?.();
                    handleMobileMenuClose();
                  }, 300);
                }}
                sx={{
                  bgcolor: "#18181B",
                  background:
                    "linear-gradient(80.89deg, #8E2DE2 -90.43%, #4A00E0 74.73%)",
                  color: "#fff",
                  borderRadius: "999px",
                  px: 3,
                  py: 1.2,
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: 600,
                  ml: 1,
                  "&:hover": { bgcolor: "#333" },
                }}
              >
                Clear Canvas
              </Box>
            </>
          )}

          {/* Hamburger for mobile */}
          {isMobile && (
            <IconButton
              size="large"
              edge="end"
              color="inherit"
              onClick={handleMobileMenuOpen}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Box>
      </Toolbar>

      {/* Mobile menu */}
      <Menu
        anchorEl={mobileMenuAnchor}
        open={Boolean(mobileMenuAnchor)}
        onClose={handleMobileMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <Divider />
        <MenuItem
          onClick={() => {
            setSelectedImage(null);
            setSelectedImageIndex(null);
            setSelectedShapeIndex(null);
            setSelectedTextId(null);
            setTimeout(() => {
              onExportPDF();
              handleMobileMenuClose();
            }, 300);
          }}
        >
          <Typography fontSize={14}>Export as PDF</Typography>
        </MenuItem>
        {onExportPPT && (
          <MenuItem
            onClick={() => {
              onExportPPT();
              handleMobileMenuClose();
            }}
          >
            <Typography fontSize={14}>Export as PPTX</Typography>
          </MenuItem>
        )}
        <MenuItem
          onClick={() => {
            setSelectedImage(null);
            setSelectedImageIndex(null);
            setSelectedShapeIndex(null);
            setSelectedTextId(null);
            setTimeout(() => {
              onClearCanvas?.();
              handleMobileMenuClose();
            }, 300);
          }}
        >
          <Typography fontSize={14}>Clear Canvas</Typography>
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => {
            console.log("Reset");
            setSelectedTheme(null);
            localStorage.removeItem("slidesTheme");
          }}
        >
          <Typography fontSize={14}>Reset Themes</Typography>
        </MenuItem>
      </Menu>
    </AppBar>
  );
};

export default UpperNavBar;
