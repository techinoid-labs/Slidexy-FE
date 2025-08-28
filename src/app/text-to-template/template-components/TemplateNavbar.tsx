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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useRouter } from "next/navigation";
import { useTemplateSlides } from "@/app/context/TemplateSlidesContext";
const TemplateNavBar: React.FC<{
  onExportPPT?: () => void;
}> = ({ onExportPPT }) => {
  const [mobileMenuAnchor, setMobileMenuAnchor] =
    React.useState<null | HTMLElement>(null);
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { slideTemplates } = useTemplateSlides();
  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  // === File name editing state ===
  const [templateFileName, setTemplateFileName] = React.useState("Untitled");
  const [editing, setEditing] = React.useState(false);
  const [error, setError] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // On mount, clear any old stored title
  React.useEffect(() => {
    localStorage.removeItem("templateFileName");
    setTemplateFileName("Untitled");
  }, []);

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
        height: { xs: 64, md: 80 },
        boxSizing: "border-box",
      }}
    >
      <Toolbar
        sx={{
          minHeight: { xs: 64, md: 80 },
          height: { xs: 64, md: 80 },
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          px: { xs: 1, md: 3 },
        }}
      >
        {/* Left section */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 0.5, md: 1.5 },
          }}
        >
          <IconButton
            onClick={() => router.push("/home")}
            sx={{ p: { xs: 0.5, md: 1 } }}
          >
            <Image
              src="/images/home-icon.svg"
              alt="Home"
              width={20}
              height={20}
            />
          </IconButton>

          <Box
            sx={{
              width: "1px",
              height: 32,
              background: "#E0E0E0",
              borderRadius: 1,
              mx: { xs: 0.5, md: 1 },
              display: { xs: "none", md: "block" },
            }}
          />

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              ml: { xs: 0.5, md: 1 },
            }}
          >
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
                  padding: 0,
                  margin: 0,
                  maxWidth: 200,
                }}
              />
            ) : (
              <Typography
                variant="subtitle1"
                onClick={handleEdit}
                sx={{
                  fontWeight: { xs: 400, md: 600 },
                  fontSize: { xs: 14, md: 16 },
                  cursor: "pointer",
                  "&:hover": { textDecoration: "underline" },
                  maxWidth: { xs: 120, md: 200 },
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {templateFileName || "Untitled"}
              </Typography>
            )}
            <Typography
              variant="caption"
              sx={{
                color: "#888",
                mt: -0.5,
                fontSize: { xs: 10, md: 12 },
                whiteSpace: "nowrap",
              }}
            >
              File Type
            </Typography>
          </Box>
        </Box>

        {/* Right section */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 0.5, md: 1 },
          }}
        >
          {isMobile ? (
            <IconButton
              size="large"
              edge="end"
              color="inherit"
              onClick={handleMobileMenuOpen}
            >
              <MenuIcon sx={{ fontSize: 24 }} />
            </IconButton>
          ) : (
            <>
              {onExportPPT && (
                <Button
                  onClick={onExportPPT}
                  disabled={slideTemplates.length <= 0}
                  sx={{
                    bgcolor: slideTemplates.length <= 0 ? " white" : "#18181B",
                    background:
                      slideTemplates.length > 0
                        ? "linear-gradient(80.89deg, #8E2DE2 -90.43%, #4A00E0 74.73%)"
                        : "",
                    color: "#fff",
                    borderRadius: "999px",
                    px: 2,
                    py: 1,
                    cursor: "pointer",
                    fontSize: 14,
                    fontWeight: 600,
                    ml: 1,
                    "&:hover": { bgcolor: "#333" },
                  }}
                >
                  Export as PPTX
                </Button>
              )}
            </>
          )}
        </Box>
      </Toolbar>

      {/* Mobile menu */}
      <Menu
        anchorEl={mobileMenuAnchor}
        open={Boolean(mobileMenuAnchor)}
        onClose={handleMobileMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Divider />
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
      </Menu>
    </AppBar>
  );
};

export default TemplateNavBar;