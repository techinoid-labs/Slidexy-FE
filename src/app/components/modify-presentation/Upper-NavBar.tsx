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
// import { AppBar, Toolbar, Typography, Box, IconButton } from "@mui/material";
import { useRouter } from "next/navigation";

const UpperNavBar: React.FC<{
  onExportPDF: () => void;
  onExportPPT?: () => void;
}> = ({ onExportPDF, onExportPPT }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] =
    React.useState<null | HTMLElement>(null);
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

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
      position="static"
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
          {/* <IconButton sx={{ p: 1.5 }}>
            <Image
              src="/images/list-icon.svg"
              alt="List"
              width={25}
              height={25}
            />
          </IconButton>
          <IconButton sx={{ p: 1.5 }}>
            <Image
              src="/images/ai-star.svg"
              alt="Star"
              width={25}
              height={25}
            />
          </IconButton> */}

          {/* File title/type always visible */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              ml: 1,
            }}
          >
            {/* <Typography
              variant="subtitle1"
              sx={{ fontWeight: { xs: 400, md: 600 }, fontSize: 16 }}
            >
              File Name Here
            </Typography> */}

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
                }}
              >
                {fileName || "File Name Here"}
              </Typography>
            )}
            <Typography
              variant="caption"
              sx={{ color: "#888", mt: -0.5, fontSize: 12 }}
            >
              File Type
            </Typography>
          </Box>
        </Box>

        {/* Right Icons */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {/* <IconButton sx={{ p: 1.5 }}>
            <Image
              src="/images/profile-icon.svg"
              alt="Profile"
              width={40}
              height={40}
            />
          </IconButton>
          <IconButton sx={{ p: 1.5 }}>
            <Image
              src="/images/bell-icon.svg"
              alt="Notifications"
              width={40}
              height={40}
            />
          </IconButton>
          <IconButton sx={{ p: 1.5 }}>
            <Image
              src="/images/play-button.svg"
              alt="Play"
              width={40}
              height={40}
            />
          </IconButton> */}

          {/* Share Button */}
          {/* <Box
            sx={{
              display: "flex",
              alignItems: "center",
              bgcolor: "#18181B",
              background:
                "linear-gradient(80.89deg, #8E2DE2 -90.43%, #4A00E0 74.73%)",
              color: "#fff",
              borderRadius: { xs: "800px", md: "999px" },
              px: { xs: 1.5, md: 3 },
              py: { xs: 1, md: 1.2 },
              ml: { xs: -1, md: 3 },
              mr: { xs: -1, md: 1 },
              cursor: "pointer",
              gap: { xs: 1, md: 1.5 },
              fontSize: { xs: 12, md: 14 },
              fontWeight: 600,
              transition: "background 0.2s",
              "&:hover": { bgcolor: "#333" },
            }}
          >
            Share
            <Image
              src="/images/share-icon.svg"
              alt="Share"
              width={26}
              height={26}
            />
          </Box> */}

          {/* Desktop Export Buttons */}
          {!isMobile && (
            <>
              <Box
                onClick={onExportPDF}
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
        {/* <MenuItem
          onClick={() => {
            router.push("/home");
            handleMobileMenuClose();
          }}
        >
          <ListItemIcon>
            <Image
              src="/images/home-icon.svg"
              alt="Home"
              width={25}
              height={25}
            />
          </ListItemIcon>
          Home
        </MenuItem>
        <MenuItem onClick={handleMobileMenuClose}>
          <ListItemIcon>
            <Image
              src="/images/list-icon.svg"
              alt="List"
              width={25}
              height={25}
            />
          </ListItemIcon>
          List
        </MenuItem>
        <MenuItem onClick={handleMobileMenuClose}>
          <ListItemIcon>
            <Image
              src="/images/ai-star.svg"
              alt="Star"
              width={25}
              height={25}
            />
          </ListItemIcon>
          AI Star
        </MenuItem> */}
        <Divider />
        {/* <MenuItem onClick={handleMobileMenuClose}>
          <ListItemIcon>
            <Image
              src="/images/bell-icon.svg"
              alt="Notifications"
              width={25}
              height={25}
            />
          </ListItemIcon>
          Notifications
        </MenuItem> */}
        <MenuItem
          onClick={() => {
            onExportPDF();
            handleMobileMenuClose();
          }}
        >
          {/* <ListItemIcon>
            <Image
              src="/images/file.svg"
              alt="Export PDF"
              width={25}
              height={25}
            />
          </ListItemIcon> */}
          Export as PDF
        </MenuItem>
        {onExportPPT && (
          <MenuItem
            onClick={() => {
              onExportPPT();
              handleMobileMenuClose();
            }}
          >
            {/* <ListItemIcon>
              <Image
                src="/images/file.svg"
                alt="Export PPTX"
                width={25}
                height={25}
              />
            </ListItemIcon> */}
            Export as PPTX
          </MenuItem>
        )}
      </Menu>
    </AppBar>
  );
};

export default UpperNavBar;
