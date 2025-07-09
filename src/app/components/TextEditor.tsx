import React from "react";
import { Box, Button, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const fontCombinations = [
  { title: "Design System", subtitle: "Improve consistency" },
  { title: "Open House", subtitle: "Step inside and explore" },
  { title: "Accessibility Guidelines", subtitle: "Enhance usability for all" },
  { title: "User Testing", subtitle: "Gather feedback from real users" },
  { title: "Component Library", subtitle: "Streamline design process" },
  { title: "Style Guide", subtitle: "Outline design principles and rules" },
  { title: "Collaboration Tools", subtitle: "Facilitate teamwork" },
  {
    title: "Design Workshops",
    subtitle: "Engage stakeholders in the design phase",
  },
  { title: "Prototyping Tools", subtitle: "Visualize ideas quickly" },
  {
    title: "Interactive Demos",
    subtitle: "Showcase product features in action",
  },
];

interface TextEditorProps {
  sidebarHeight?: string | number;
  onClose?: () => void;
}

const TextEditor: React.FC<TextEditorProps> = ({
  sidebarHeight = "100vh",
  onClose,
}) => (
  <Box
    sx={{
      width: 320,
      bgcolor: "#fff",
      height: sidebarHeight,
      position: "absolute",
      left: 80,
      top: 0,
      borderRight: "1px solid #E0E0E0",
      zIndex: 10,
      boxShadow: 2,
      display: "flex",
      flexDirection: "column",
      p: 0,
    }}
  >
    {/* Header */}
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        p: 3,
        pb: 2,
      }}
    >
      <Typography sx={{ fontWeight: 600, fontSize: 20 }}>Text</Typography>

      <IconButton size="small" onClick={onClose}>
        <CloseIcon />
      </IconButton>
    </Box>
    {/* Add Text Box Button */}
    <Box sx={{ px: 3, mb: 2 }}>
      <Button
        fullWidth
        variant="outlined"
        startIcon={<AddIcon />}
        sx={{
          borderRadius: 8,
          height: 44,
          fontWeight: 600,
          fontSize: 17,
          bgcolor: "#F8F8FA",
          borderColor: "#E0E0E0",
          color: "#222",
          mb: 1,
          "&:hover": {
            bgcolor: "#F3EDFF",
            borderColor: "#7B4AE2",
            color: "#7B4AE2",
          },
        }}
      >
        Add Text Box
      </Button>
    </Box>
    {/* Text Type Buttons */}
    <Box
      sx={{ px: 3, mb: 2, display: "flex", flexDirection: "column", gap: 1.5 }}
    >
      <Button
        fullWidth
        sx={{
          bgcolor: "#F8F8FA",
          borderRadius: 3,
          height: 48,
          fontWeight: 700,
          fontSize: 24,
          color: "#222",
          mb: 0.5,
          boxShadow: "none",
          textTransform: "none",
        }}
      >
        Add a Title
      </Button>
      <Button
        fullWidth
        sx={{
          bgcolor: "#F8F8FA",
          borderRadius: 3,
          height: 44,
          fontWeight: 600,
          fontSize: 20,
          color: "#222",
          mb: 0.5,
          boxShadow: "none",
          textTransform: "none",
        }}
      >
        Add a Headline
      </Button>
      <Button
        fullWidth
        sx={{
          bgcolor: "#F8F8FA",
          borderRadius: 3,
          height: 44,
          fontWeight: 500,
          fontSize: 18,
          color: "#222",
          mb: 0.5,
          boxShadow: "none",
          textTransform: "none",
        }}
      >
        Add a Sub Headline
      </Button>
      <Button
        fullWidth
        sx={{
          bgcolor: "#F8F8FA",
          borderRadius: 3,
          height: 44,
          fontWeight: 400,
          fontSize: 17,
          color: "#888",
          boxShadow: "none",
          textTransform: "none",
        }}
      >
        Add Body Text
      </Button>
    </Box>
    {/* Font Combinations Section */}
    <Box sx={{ px: 3, pt: 1, pb: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
        <Typography sx={{ fontWeight: 600, fontSize: 16, flex: 1 }}>
          Font Combinations
        </Typography>
        <ArrowForwardIosIcon sx={{ fontSize: 18, color: "#888" }} />
      </Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 1.5,
        }}
      >
        {fontCombinations.map((combo, idx) => (
          <Box
            key={idx}
            sx={{
              bgcolor: "#F8F8FA",
              borderRadius: 3,
              p: 1.5,
              minHeight: 54,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              boxShadow: "none",
              border: "1px solid #ECECEC",
              cursor: "pointer",
              "&:hover": {
                borderColor: "#7B4AE2",
                boxShadow: "0 2px 8px 0 #7B4AE222",
              },
            }}
          >
            <Typography
              sx={{ fontWeight: 600, fontSize: 15, color: "#222", mb: 0.2 }}
            >
              {combo.title}
            </Typography>
            <Typography sx={{ fontWeight: 400, fontSize: 13, color: "#888" }}>
              {combo.subtitle}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  </Box>
);

export default TextEditor;
