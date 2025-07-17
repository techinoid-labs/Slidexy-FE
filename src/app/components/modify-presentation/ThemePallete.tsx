import React, { useRef, useState } from "react";
import {
  Box,
  Button,
  Divider,
  MenuItem,
  Select,
  Typography,
  IconButton,
} from "@mui/material";
import { useSlideThemeContext } from "@/app/context/ThemeContext";
import { ChromePicker } from "react-color";
import Popover from "@mui/material/Popover";
import { useSlides } from "@/app/context/SlidesContext"; // adjust path if needed

// PaletteStack: renders a stack of overlapping color circles
interface PaletteStackProps {
  colors: string[];
  size?: number;
  overlap?: number;
}

const PaletteStack: React.FC<PaletteStackProps> = ({
  colors,
  size = 38,
  overlap = 14,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        position: "relative",
        height: size,
        width: size + (colors.length - 1) * overlap,
      }}
    >
      {colors.map((color, i) => (
        <Box
          key={i}
          sx={{
            width: size,
            height: size,
            borderRadius: "50%",
            bgcolor: color,
            border: "none",
            boxShadow: "0 2px 8px 0 rgba(0,0,0,0.10)",
            position: "absolute",
            left: i * overlap,
            zIndex: colors.length - i,
            transition: "transform 0.15s, box-shadow 0.15s",
          }}
        />
      ))}
    </Box>
  );
};

// Sample palettes (replace with API data later)
const palettes = [
  ["#fff", "black", "black", "black"],
  ["#E09B4B", "#F5D7A1", "#F9EEDB", "#3C2B1C"],
  ["#B6D44A", "#1B5E20", "#3DE1C1", "#00695C"],
  ["#7B4AE2", "#B39DDB", "#E1BEE7", "#9575CD"],
];

// Helper to map palette to theme object
const paletteToTheme = (palette: string[]) => ({
  font: "Inter",
  primaryColor: palette[1],
  secondaryColor: palette[2],
  backgroundColor: palette[0],
  image_url: "",
});

const ThemePanel = ({ resetAll }: any) => {
  const { selectedTheme, setSelectedTheme, selectedLayout, setSelectedLayout } =
    useSlideThemeContext();
  const { slides, setSlides } = useSlides(); // Get slides + dispatcher from context

  // Find selected palette index
  const [customPalettes, setCustomPalettes] = useState<string[][]>([]);
  const [customColors, setCustomColors] = useState<string[]>([]);
  const colorInputRef = useRef<HTMLInputElement>(null);
  const [colorPickerAnchor, setColorPickerAnchor] =
    useState<null | HTMLElement>(null);

  const handleColorButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    setColorPickerAnchor(event.currentTarget);
  };

  const handleColorPickerClose = () => {
    setColorPickerAnchor(null);
  };

  const allPalettes = [...customPalettes, ...palettes];
  const selectedPaletteIdx = allPalettes.findIndex(
    (p) =>
      selectedTheme &&
      p[0] === selectedTheme.backgroundColor &&
      p[1] === selectedTheme.primaryColor &&
      p[2] === selectedTheme.secondaryColor
  );

  // const handlePaletteClick = (palette: string[]) => {
  //   setSelectedTheme(paletteToTheme(palette));
  // };

  const handlePaletteClick = (palette: string[]) => {
    const theme = paletteToTheme(palette);
    setSelectedTheme(theme);

    // Update all relevant text elements to use the new theme color
    const updatedSlides = slides.map((slide) => ({
      ...slide,
      elements: slide.elements.map((el) => {
        if (
          el.element_type === "text" ||
          (el.element_type === "bullet_points" && el.useThemeColor !== false)
        ) {
          return {
            ...el,
            useThemeColor: true,
            properties: {
              ...el.properties,
              // fill: theme.primaryColor,
            },
          };
        }
        return el;
      }),
    }));

    setSlides(updatedSlides); // Dispatch to Redux
  };

  const handleAddColor = (color: string) => {
    if (customColors.length < 3 && !customColors.includes(color)) {
      const newColors = [...customColors, color];
      setCustomColors(newColors);
      if (newColors.length === 3) {
        setCustomPalettes([[...newColors], ...customPalettes]);
        setCustomColors([]);
      }
    }
  };

  const DEFAULT_THEME = paletteToTheme(palettes[0]);
  const DEFAULT_LAYOUT = 0;

  const handleReset = () => {
    setSelectedTheme(DEFAULT_THEME);
    setSelectedLayout(DEFAULT_LAYOUT as any);
    setCustomPalettes([]);
    setCustomColors([]);
  };

  return (
    <Box className="w-[410px] min-w-[350px] md:min-w-[410px] bg-white flex flex-col overflow-y-auto border-r border-gray-200">
      {/* Tabs */}
      <Box sx={{ display: "flex", alignItems: "center", px: 2, pt: 2, pb: 1 }}>
        <Box
          sx={{
            bgcolor: "#F5F5F5",
            color: "#222",
            fontWeight: 600,
            borderRadius: 2,
            px: 2.5,
            py: 1,
            fontSize: 15,
            mr: 2,
          }}
        >
          Settings
        </Box>
        <Box
          sx={{
            color: "#888",
            fontWeight: 500,
            fontSize: 15,
            mr: 2,
            py: 1,
            cursor: "pointer",
          }}
        >
          Animate
        </Box>
        <Box sx={{ flex: 1 }} />
        <Select
          value={50}
          size="small"
          sx={{
            fontSize: 15,
            bgcolor: "#F5F5F5",
            borderRadius: 2,
            width: 95,
            height: 32,
          }}
          displayEmpty
          inputProps={{ "aria-label": "Percentage" }}
        >
          <MenuItem value={50}>50%</MenuItem>
          <MenuItem value={75}>75%</MenuItem>
          <MenuItem value={100}>100%</MenuItem>
        </Select>
      </Box>
      <Divider sx={{ my: 2 }} />
      {/* Theme Palette */}
      <Box sx={{ px: 3, mb: 2 }}>
        <Typography
          sx={{ fontWeight: 600, fontSize: 17, mb: 1, letterSpacing: 0.2 }}
        >
          Theme Palette
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            justifyContent: "flex-start",
            alignItems: "center",
            mb: 2,
            width: "100%",
            maxWidth: "100%",
          }}
        >
          {allPalettes.map((colors, idx) => (
            <Box
              key={idx}
              onClick={() => handlePaletteClick(colors)}
              sx={{
                cursor: "pointer",
                borderRadius: "50%",
                boxShadow:
                  selectedPaletteIdx === idx
                    ? "0 0 0 3px #7B4AE2"
                    : "0 2px 8px 0 rgba(0,0,0,0.10)",
                transition: "box-shadow 0.2s",
                p: 0.5,
                border:
                  selectedPaletteIdx === idx
                    ? "2px solid #7B4AE2"
                    : "2px solid transparent",
              }}
            >
              <PaletteStack colors={colors} />
            </Box>
          ))}
        </Box>
      </Box>
      <Divider />
      {/* Presentation Style */}
      <Box sx={{ px: 3, py: 2 }}>
        <Typography sx={{ fontWeight: 500, fontSize: 16, mb: 1 }}>
          Presentation Layout
        </Typography>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
          {[...Array(6)].map((_, i) => (
            <button
              key={i}
              onClick={() => setSelectedLayout(i as any)}
              aria-label={`Select layout ${i + 1}`}
              className={`w-[150px] h-[85px] p-0 overflow-hidden bg-white mb-2 transition-shadow rounded-sm
        ${
          selectedLayout === i
            ? "shadow-[0_0_0_2px_#7B4AE2]"
            : "shadow-[0_0_0_1px_#ECECEC]"
        } hover:bg-[#FBFAFF]`}
            >
              <img
                src={`/layout-${i}.svg`}
                alt={`Layout ${i + 1}`}
                className="block w-[100px] h-[50px] object-cover mx-auto"
              />
            </button>
          ))}
        </div>
      </Box>
      <Divider />
      {/* Custom Background Color Section */}
      <Box sx={{ px: 3, py: 2 }}>
        <Typography sx={{ fontWeight: 500, fontSize: 16, mb: 1 }}>
          Background
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          {/* Render up to 3 color circles */}
          {customColors.map((color, idx) => (
            <Box
              key={idx}
              sx={{
                width: 50,
                height: 50,
                borderRadius: "50%",
                bgcolor: color,
                border: "1px solid #E0E0E0",
              }}
            />
          ))}
          {/* + Button for color picker */}
          {customColors.length < 3 && (
            <IconButton
              // onClick={() => colorInputRef.current?.click()}
              onClick={handleColorButtonClick}
              sx={{
                width: 48,
                height: 45,
                borderRadius: "50%",
                bgcolor: "#fff",
                border: "1px solid #E0E0E0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                p: 1,
              }}
            >
              <span style={{ fontSize: 25, color: "#888" }}>+</span>
              <input
                ref={colorInputRef}
                type="color"
                style={{ display: "none" }}
                onChange={(e) => handleAddColor(e.target.value)}
              />
            </IconButton>
          )}
          {/* Color palette button */}
          {/* <Button
            variant="outlined"
            onClick={handleColorButtonClick}
            sx={{ height: 40 }}
          >
            Color
          </Button> */}
          <Popover
            open={Boolean(colorPickerAnchor)}
            anchorEl={colorPickerAnchor}
            onClose={handleColorPickerClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          >
            <ChromePicker
              color={customColors[customColors.length - 1] || "#fff"}
              onChangeComplete={(color) => {
                handleAddColor(color.hex);
                handleColorPickerClose();
              }}
              disableAlpha
            />
          </Popover>
        </Box>
      </Box>
      {/* Reset Button */}
      <Box sx={{ px: 3, pb: 3, pt: 0 }}>
        <Button
          fullWidth
          sx={{
            bgcolor: "linear-gradient(90deg, #7B4AE2 0%, #5F2EEA 100%)",
            color: "#fff",
            fontWeight: 600,
            fontSize: 18,
            borderRadius: 8,
            py: 1.5,
            textTransform: "none",
            boxShadow: "0 2px 8px 0 rgba(123,74,226,0.15)",
            background: "linear-gradient(90deg, #7B4AE2 0%, #5F2EEA 100%)",
            "&:hover": {
              background: "linear-gradient(90deg, #5F2EEA 0%, #7B4AE2 100%)",
            },
          }}
          onClick={handleReset}
        >
          Reset
        </Button>
      </Box>
    </Box>
  );
};

export default ThemePanel;
