import React from "react";
import {
  Box,
  MenuItem,
  Select,
  FormControl,
  useTheme,
  ListItemIcon,
  ListItemText,
  Typography,
  Fade,
  Grow,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import PaletteIcon from "@mui/icons-material/Palette";
import BrushIcon from "@mui/icons-material/Brush";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import ViewInArIcon from "@mui/icons-material/ViewInAr";
import LayersIcon from "@mui/icons-material/Layers";
import MovieIcon from "@mui/icons-material/Movie";
import PanoramaIcon from "@mui/icons-material/Panorama";

type InputMode = "Text" | "Website" | "Youtube" | "Template" | "TextToInfographics";

interface Props {
  goal: string;
  tone: string;
  audience: string;
  slideCount: string;
  artStyle: string;
  inputMode: InputMode;
  setGoal: (val: string) => void;
  setTone: (val: string) => void;
  setAudience: (val: string) => void;
  setSlideCount: (val: string) => void;
  setArtStyle: (val: string) => void;
  orientation?: "portrait" | "landscape";
  setOrientation?: (val: "portrait" | "landscape") => void;
}

export default function PromptAttributeSelector({
  goal,
  tone,
  audience,
  slideCount,
  artStyle,
  inputMode,
  setGoal,
  setTone,
  setAudience,
  setSlideCount,
  setArtStyle,
  orientation = "landscape",
  setOrientation,
}: Props) {
  const theme = useTheme();

  const dropdownStyles = {
    flex: { xs: "1 1 100%", sm: "1 1 0" },
    backgroundColor: "#fff",
    borderRadius: "12px",
    px: 1.5,
    py: 1.5,
    fontSize: 14,
    minWidth: 160,
    fontWeight: 400,
    border: `1px solid ${theme.palette.grey[200]}`,
    color: theme.palette.grey[600],
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.03)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    "&:hover": {
      borderColor: theme.palette.grey[300],
      boxShadow: "0 6px 20px rgba(0, 0, 0, 0.08)",
      transform: "translateY(-1px)",
    },
    "& .MuiSelect-select": {
      py: 1,
      display: "flex",
      alignItems: "center",
    },
    "& .MuiSelect-icon": {
      color: theme.palette.grey[400],
      transition: "transform 0.3s ease",
    },
    "& fieldset": {
      border: "none",
    },
  };

  // Enhanced art style dropdown with visual focus and animation
  const artStyleDropdownStyles = {
    ...dropdownStyles,
    background: artStyle 
      ? "linear-gradient(135deg, #f8f5ff 0%, #ffffff 100%)" 
      : "#fff",
    border: artStyle 
      ? `2px solid rgba(74, 0, 224, 1)` 
      : `1px solid ${theme.palette.grey[200]}`,
    boxShadow: artStyle 
      ? "0 8px 25px rgba(74, 0, 224, 0.15)" 
      : "0 2px 6px rgba(0, 0, 0, 0.03)",
    minWidth: 200,
  };

  const renderMenuItem = (
    value: string,
    label: string,
    selectedValue: string
  ) => (
    <MenuItem
      key={value}
      value={value}
      sx={{
        fontWeight: value === selectedValue ? 600 : 400,
        color:
          value === selectedValue
            ? "rgba(74, 0, 224, 1)"
            : theme.palette.grey[700],
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        py: 1.5,
        px: 2,
        gap: 1,
        borderRadius: "8px",
        margin: "2px 8px",
        "&:hover": {
          backgroundColor: "rgba(74, 0, 224, 0.05)",
          transform: "scale(1.02)",
          transition: "all 0.2s ease",
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Typography variant="body2" sx={{ fontWeight: "inherit" }}>
          {label}
        </Typography>
      </Box>
      {value === selectedValue && (
        <ListItemIcon
          sx={{
            minWidth: 0,
            color: "rgba(74, 0, 224, 1)",
          }}
        >
          <CheckIcon fontSize="small" />
        </ListItemIcon>
      )}
    </MenuItem>
  );

  // Icon mapping for art styles
  const styleIcons: Record<InputMode, Record<string, React.ReactElement>> = {
    Text: {
      "Concept Art": <AutoAwesomeIcon fontSize="small" />,
      "3D Render / CGI": <ViewInArIcon fontSize="small" />,
      "Watercolor Illustration": <BrushIcon fontSize="small" />,
      "AI Collage / Mixed Media": <LayersIcon fontSize="small" />,
      "Digital Painting": <PaletteIcon fontSize="small" />,
      "Fantasy / Sci-Fi Style": <AutoAwesomeIcon fontSize="small" />,
      "Minimal Abstract": <DesignServicesIcon fontSize="small" />,
    },
    Website: {
      "Flat Illustration": <DesignServicesIcon fontSize="small" />,
      "Line Art / Outline": <BrushIcon fontSize="small" />,
      "Material Design": <LayersIcon fontSize="small" />,
      "Photorealistic / Stock Style": <PhotoCameraIcon fontSize="small" />,
      "Isometric": <ViewInArIcon fontSize="small" />,
      "Corporate Futurism": <AutoAwesomeIcon fontSize="small" />,
      "Minimalist White Space": <PaletteIcon fontSize="small" />,
    },
    Youtube: {
      "Cinematic Still Frame": <MovieIcon fontSize="small" />,
      "Documentary Realism": <PhotoCameraIcon fontSize="small" />,
      "Color-Graded Film Look": <PanoramaIcon fontSize="small" />,
      "Storyboard Sketch": <BrushIcon fontSize="small" />,
      "Moody Monochrome": <PaletteIcon fontSize="small" />,
      "Cyberpunk / Neon": <AutoAwesomeIcon fontSize="small" />,
      "Photojournalistic Style": <PhotoCameraIcon fontSize="small" />,
    },
    Template: {"Concept Art": <AutoAwesomeIcon fontSize="small" />,
      "3D Render / CGI": <ViewInArIcon fontSize="small" />,
      "Watercolor Illustration": <BrushIcon fontSize="small" />,
      "AI Collage / Mixed Media": <LayersIcon fontSize="small" />,
      "Digital Painting": <PaletteIcon fontSize="small" />,
      "Fantasy / Sci-Fi Style": <AutoAwesomeIcon fontSize="small" />,
      "Minimal Abstract": <DesignServicesIcon fontSize="small" />,},
    TextToInfographics: {
      "Flat Illustration": <DesignServicesIcon fontSize="small" />,
      "Line Art / Outline": <BrushIcon fontSize="small" />,},

  };

  // Selected icon for info box
  const selectedInfoIcon = artStyle ? styleIcons[inputMode][artStyle] || <PaletteIcon fontSize="small" /> : <BrushIcon fontSize="small" />;

  // Enhanced art style menu items with icons and descriptions
  const renderArtStyleMenuItem = (
    value: string,
    label: string,
    description: string,
    selectedValue: string
  ) => {
    const icon = styleIcons[inputMode][value] || <PaletteIcon fontSize="small" />;
    return (
      <MenuItem
        key={value}
        value={value}
        sx={{
          fontWeight: value === selectedValue ? 600 : 400,
          color:
            value === selectedValue
              ? "rgba(74, 0, 224, 1)"
              : theme.palette.grey[700],
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          py: 2,
          px: 2,
          gap: 1,
          borderRadius: "12px",
          margin: "4px 8px",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            backgroundColor: "rgba(74, 0, 224, 0.05)",
            transform: "translateX(4px)",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          },
          borderLeft: value === selectedValue 
            ? `4px solid rgba(74, 0, 224, 1)` 
            : "4px solid transparent",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", width: "100%", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box sx={{ 
              bgcolor: "rgba(74, 0, 224, 0.1)", 
              p: 0.5, 
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              {icon}
            </Box>
            <Typography variant="body2" sx={{ fontWeight: "inherit", mb: 0.2 }}>
              {label}
            </Typography>
          </Box>
          {value === selectedValue && (
            <Grow in={true}>
              <CheckIcon fontSize="small" sx={{ color: "rgba(74, 0, 224, 1)" }} />
            </Grow>
          )}
        </Box>
        <Typography 
          variant="caption" 
          color="text.secondary"
          sx={{ 
            fontSize: "0.75rem",
            lineHeight: 1.4,
            opacity: 0.85,
            pl: 3.5, // Align with icon offset
          }}
        >
          {description}
        </Typography>
      </MenuItem>
    );
  };

  // Art style options with descriptions
  const artStyleOptions: Record<InputMode, Array<{ value: string; label: string; description: string }>> = {
    Text: [
      { value: "Concept Art", label: "Concept Art", description: "Epic cinematic environments with dramatic lighting" },
      { value: "3D Render / CGI", label: "3D Render / CGI", description: "Photorealistic 3D with perfect materials" },
      { value: "Watercolor Illustration", label: "Watercolor", description: "Soft, translucent artistic paintings" },
      { value: "AI Collage / Mixed Media", label: "Mixed Media", description: "Contemporary collage with layered textures" },
      { value: "Digital Painting", label: "Digital Painting", description: "Rich brush strokes and artistic interpretation" },
      { value: "Fantasy / Sci-Fi Style", label: "Fantasy / Sci-Fi", description: "Imaginative futuristic or magical scenes" },
      { value: "Minimal Abstract", label: "Minimal Abstract", description: "Clean geometric forms and negative space" },
    ],
    Website: [
      { value: "Flat Illustration", label: "Flat Illustration", description: "Modern flat design with simple shapes" },
      { value: "Line Art / Outline", label: "Line Art", description: "Elegant continuous line drawings" },
      { value: "Material Design", label: "Material Design", description: "Google's layered depth with bold colors" },
      { value: "Photorealistic / Stock Style", label: "Photorealistic", description: "Professional stock photography style" },
      { value: "Isometric", label: "Isometric", description: "30-degree angled miniature worlds" },
      { value: "Corporate Futurism", label: "Corporate Futurism", description: "Sleek high-tech business environments" },
      { value: "Minimalist White Space", label: "White Space", description: "Airy design with abundant breathing room" },
    ],
    Youtube: [
      { value: "Cinematic Still Frame", label: "Cinematic Frame", description: "Film-quality with depth of field" },
      { value: "Documentary Realism", label: "Documentary", description: "Authentic photojournalistic style" },
      { value: "Color-Graded Film Look", label: "Film Look", description: "Professional color grading with film grain" },
      { value: "Storyboard Sketch", label: "Storyboard", description: "Loose sketchy composition studies" },
      { value: "Moody Monochrome", label: "Monochrome", description: "High contrast black & white drama" },
      { value: "Cyberpunk / Neon", label: "Cyberpunk", description: "Neon-lit futuristic urban scenes" },
      { value: "Photojournalistic Style", label: "Photojournalistic", description: "Candid documentary moments" },
    ],
    Template:  [
      { value: "Concept Art", label: "Concept Art", description: "Epic cinematic environments with dramatic lighting" },
      { value: "3D Render / CGI", label: "3D Render / CGI", description: "Photorealistic 3D with perfect materials" },
      { value: "Watercolor Illustration", label: "Watercolor", description: "Soft, translucent artistic paintings" },
      { value: "AI Collage / Mixed Media", label: "Mixed Media", description: "Contemporary collage with layered textures" },
      { value: "Digital Painting", label: "Digital Painting", description: "Rich brush strokes and artistic interpretation" },
      { value: "Fantasy / Sci-Fi Style", label: "Fantasy / Sci-Fi", description: "Imaginative futuristic or magical scenes" },
      { value: "Minimal Abstract", label: "Minimal Abstract", description: "Clean geometric forms and negative space" },
    ],
    TextToInfographics: [
      { value: "Flat Illustration", label: "Flat Illustration", description: "Modern flat design with simple shapes" },
      { value: "Line Art / Outline", label: "Line Art", description: "Elegant continuous line drawings" },],
  };

  const currentArtStyles = artStyleOptions[inputMode] || [];

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: 2,
        width: "100%",
        mb: 4,
      }}
    >
      <FormControl fullWidth sx={dropdownStyles}>
        <Select
          value={goal}
          sx={{ fontSize: 14, pt: 0.2 }}
          displayEmpty
          onChange={(e) => setGoal(e.target.value)}
          renderValue={(selected) => selected || "Select Goal"}
        >
          {renderMenuItem("Pitch", "Pitch", goal)}
          {renderMenuItem("Report", "Report", goal)}
          {renderMenuItem("Portfolio", "Portfolio", goal)}
          {renderMenuItem("Lesson", "Lesson", goal)}
          {renderMenuItem("Personal", "Personal", goal)}
        </Select>
      </FormControl>

      <FormControl fullWidth sx={dropdownStyles}>
        <Select
          value={tone}
          sx={{ fontSize: 14, pt: 0.2 }}
          displayEmpty
          onChange={(e) => setTone(e.target.value)}
          renderValue={(selected) => selected || "Select Tone"}
        >
          {renderMenuItem("Minimal", "Minimal", tone)}
          {renderMenuItem("Professional", "Professional", tone)}
          {renderMenuItem("Friendly", "Friendly", tone)}
          {renderMenuItem("Storytelling", "Storytelling", tone)}
        </Select>
      </FormControl>

      <FormControl fullWidth sx={dropdownStyles}>
        <Select
          value={audience}
          sx={{ fontSize: 14, pt: 0.2 }}
          displayEmpty
          onChange={(e) => setAudience(e.target.value)}
          renderValue={(selected) => selected || "Select Audience"}
        >
          {renderMenuItem("General", "General", audience)}
          {renderMenuItem("Student", "Student", audience)}
          {renderMenuItem("Customer", "Customer", audience)}
          {renderMenuItem("Investor", "Investor", audience)}
        </Select>
      </FormControl>

      <FormControl fullWidth sx={dropdownStyles}>
        <Select
          value={slideCount}
          sx={{ fontSize: 14, pt: 0.2 }}
          displayEmpty
          onChange={(e) => setSlideCount(e.target.value)}
          renderValue={(selected) => selected || "No. of Slides"}
        >
          {renderMenuItem("3", "3", slideCount)}
          {renderMenuItem("5", "5", slideCount)}
          {renderMenuItem("7", "7", slideCount)}
          {renderMenuItem("10", "10", slideCount)}
        </Select>
      </FormControl>

      {/* Enhanced Visual Direction Selector with header */}
      {currentArtStyles.length > 0 && (
        <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 0" }, minWidth: 200 }}>
          <Typography 
            variant="caption" 
            sx={{ 
              display: "block", 
              mb: 1, 
              fontWeight: 500, 
              color: "rgba(74, 0, 224, 1)",
              fontSize: "0.8rem",
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            Visual Style
          </Typography>
          <FormControl fullWidth sx={artStyleDropdownStyles}>
            <Select
              value={artStyle}
              sx={{ 
                fontSize: 14, 
                pt: 0.2,
                fontWeight: artStyle ? 600 : 400,
              }}
              displayEmpty
              onChange={(e) => setArtStyle(e.target.value)}
              renderValue={(selected) => {
                if (!selected) {
                  return (
                    <Fade in={true}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, opacity: 0.6 }}>
                        <PaletteIcon sx={{ fontSize: 18 }} />
                        <span>Choose Art Style</span>
                      </Box>
                    </Fade>
                  );
                }
                const selectedStyle = currentArtStyles.find(s => s.value === selected);
                const selectedIcon = styleIcons[inputMode][selected] || <PaletteIcon fontSize="small" />;
                return (
                  <Grow in={true}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box sx={{ 
                        bgcolor: "rgba(74, 0, 224, 0.1)", 
                        p: 0.5, 
                        borderRadius: "6px",
                      }}>
                        {selectedIcon}
                      </Box>
                      <span>{selectedStyle?.label || selected}</span>
                    </Box>
                  </Grow>
                );
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    maxHeight: 450,
                    borderRadius: "12px",
                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
                    "& .MuiList-root": {
                      py: 0.5,
                    },
                  },
                },
              }}
            >
              {currentArtStyles.map(({ value, label, description }) =>
                renderArtStyleMenuItem(value, label, description, artStyle)
              )}
            </Select>
          </FormControl>
        </Box>
      )}

      {/* Enhanced Orientation Toggle for TextToInfographics */}
      {inputMode === "TextToInfographics" && setOrientation && (
        <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 0" }, minWidth: 200 }}>
          <Typography 
            variant="caption" 
            sx={{ 
              display: "block", 
              mb: 1, 
              fontWeight: 500, 
              color: "rgba(74, 0, 224, 1)",
              fontSize: "0.8rem",
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            Orientation
          </Typography>
          <ToggleButtonGroup
            value={orientation}
            exclusive
            onChange={(e, newValue) => setOrientation(newValue)}
            aria-label="Orientation"
            sx={{
              backgroundColor: "#fff",
              borderRadius: "12px",
              border: `1px solid ${theme.palette.grey[200]}`,
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.03)",
              overflow: "hidden",
              "& .MuiToggleButtonGroup-grouped": {
                border: "none !important",
                py: 1.5,
                px: 3,
                fontSize: 14,
                fontWeight: 500,
                color: theme.palette.grey[600],
                "&:hover": {
                  backgroundColor: "rgba(74, 0, 224, 0.05)",
                  color: "rgba(74, 0, 224, 1)",
                  transform: "scale(1.05)",
                  transition: "all 0.2s ease",
                },
                "&.Mui-selected": {
                  backgroundColor: "rgba(74, 0, 224, 0.1)",
                  color: "rgba(74, 0, 224, 1)",
                  boxShadow: "inset 0 0 0 1px rgba(74, 0, 224, 0.2)",
                },
              },
            }}
          >
            <ToggleButton value="landscape">
              <PanoramaIcon sx={{ fontSize: 20, mr: 0.5 }} />
              Landscape
            </ToggleButton>
            <ToggleButton value="portrait">
              <PhotoCameraIcon sx={{ fontSize: 20, mr: 0.5 }} />
              Portrait
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      )}

      {/* Animated Info helper text when art style is selected */}
      {artStyle && (
        <Fade in={true} timeout={500}>
          <Box
            sx={{
              width: "100%",
              px: 2,
              py: 1.5,
              borderRadius: 2,
              background: "linear-gradient(135deg, #f8f5ff 0%, #f0e7ff 100%)",
              border: `1px solid rgba(74, 0, 224, 0.2)`,
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              boxShadow: "0 2px 10px rgba(74, 0, 224, 0.1)",
              transition: "all 0.3s ease",
            }}
          >
            <Box sx={{ 
              bgcolor: "rgba(74, 0, 224, 0.1)", 
              p: 0.75, 
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              {React.cloneElement(selectedInfoIcon, { fontSize: "medium" })}
            </Box>
            <Box>
              <Typography variant="body2" color="text.primary" sx={{ fontSize: "0.85rem", fontWeight: 500 }}>
                {currentArtStyles.find(s => s.value === artStyle)?.label}
              </Typography>
              <Typography 
                variant="caption" 
                color="text.secondary"
                sx={{ 
                  display: "block",
                  fontSize: "0.75rem",
                  lineHeight: 1.3,
                }}
              >
                {currentArtStyles.find(s => s.value === artStyle)?.description}
              </Typography>
            </Box>
          </Box>
        </Fade>
      )}
    </Box>
  );
}