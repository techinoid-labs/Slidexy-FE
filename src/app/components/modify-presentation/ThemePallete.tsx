import React, { useRef, useState, useEffect } from "react";
import {
  Box,
  Button,
  Divider,
  MenuItem,
  Select,
  Typography,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import { useSlideThemeContext } from "@/app/context/ThemeContext";
import { ChromePicker } from "react-color";
import Popover from "@mui/material/Popover";
import { useSlides } from "@/app/context/SlidesContext";
import { getSlideDimensions } from "../../../utils/slideUtils";

const getDynamicConstants = () => {
  const { SLIDE_WIDTH, SLIDE_HEIGHT, LEFT_PADDING } = getSlideDimensions();
  const IMAGE_WIDTH = 400;
  const IMAGE_PADDING = 40;
  const textMaxWidth = SLIDE_WIDTH - IMAGE_WIDTH - IMAGE_PADDING - LEFT_PADDING;
  const textMaxHeight = SLIDE_HEIGHT;

  return {
    SLIDE_WIDTH,
    SLIDE_HEIGHT,
    LEFT_PADDING,
    IMAGE_WIDTH,
    IMAGE_PADDING,
    textMaxWidth,
    textMaxHeight,
  };
};
// Custom hook to manage layout selection
const layouts = [-1, 0, 1, 2, 3, 4, 5] as const;
type LayoutType = typeof layouts[number];

const useLayoutControl = (
  initialLayout: number | null,
  setSlides: (slides: any) => void,
  slides: any[],
  setLayoutRefreshKey: React.Dispatch<React.SetStateAction<number>>,
  selectedSlideIndex: number
) => {
  const { setSelectedLayout } = useSlideThemeContext();
  const userTriggeredLayoutChange = useRef(false);
  const layoutMap: Record<LayoutType, string> = {
    [-1]: "",
    [0]: "content-right-image",
    [1]: "content-left-image",
    [2]: "cover-hero",
    [3]: "split-content",
    [4]: "conclusion",
    [5]: "content-right-image",
  };
  const applyLayout = (layoutIndex: LayoutType) => {
    userTriggeredLayoutChange.current = true;
    setSelectedLayout(layoutIndex);
    setLayoutRefreshKey(prev => prev + 1);

    try {
      localStorage.setItem("selectedLayout", String(layoutIndex));
    } catch (e) {
      console.error("Failed to save layout to localStorage", e);
    }
  };

  return { applyLayout, userTriggeredLayoutChange, layoutMap };
};

// FIXED: PaletteStack with better visibility and hover
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
            border: "2px solid white",  // FIXED: Better visibility
            boxShadow: "0 2px 8px 0 rgba(0,0,0,0.15)",  // FIXED: Better shadow
            position: "absolute",
            left: i * overlap,
            zIndex: colors.length - i,
            transition: "transform 0.15s, box-shadow 0.15s",
            "&:hover": {
              transform: "scale(1.1)",  // FIXED: Hover effect
              boxShadow: "0 4px 12px 0 rgba(0,0,0,0.25)",
            },
          }}
        />
      ))}
    </Box>
  );
};

// Enhanced palettes with high contrast (updated for better contrast)
const palettes = [
  ["#ffffff", "#000000", "#333333", "#666666"], // High contrast black on white
  ["#FFF7F7", "#D32F2F", "#FFCDD2", "#B71C1C"], // Red theme with contrast
  ["#E8F5E8", "#2E7D32", "#C8E6C9", "#2E7D32"], // Green theme - FIXED: Use darker green for primary
  ["#F3E5F5", "#7B1FA2", "#E1BEE7", "#4A148C"], // Purple theme
  ["#E3F2FD", "#0D47A1", "#BBDEFB", "#0D47A1"], // Blue theme - FIXED: Use darker blue for primary
  ["#FFF8E1", "#BF360C", "#FFE0B2", "#E65100"], // Orange theme - FIXED: Use darker orange for primary
];

// FIXED: Improved contrast calculation
const getContrastingTextColor = (bgColor: string, preferredText: string): string => {
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.replace('#', ''));
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const getLuminance = (hex: string): number => {
    const rgb = hexToRgb(hex);
    if (!rgb) return 1;
    const [r, g, b] = [rgb.r / 255, rgb.g / 255, rgb.b / 255].map(c =>
      c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    );
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const bgLum = getLuminance(bgColor || '#ffffff');
  const textLum = getLuminance(preferredText || '#000000');
  const contrast = (Math.max(bgLum, textLum) + 0.05) / (Math.min(bgLum, textLum) + 0.05);

  // Return contrasting color if needed
  return contrast >= 4.5 ? preferredText : (bgLum > 0.5 ? '#1a1a1a' : '#ffffff');
};

// Helper to map palette to theme object
const paletteToTheme = (palette: string[]) => ({
  font: "Inter",
  primaryColor: palette[1],
  secondaryColor: palette[2],
  backgroundColor: palette[0],
  titleColor: palette[1], // Use primaryColor for titles
  image_url: "",
  artPalette: [palette[1], palette[3] || palette[1], palette[1], palette[0], palette[0]],
});

const ThemePanel = ({ parsedSlides = [], resetAll }: any) => {
  const { selectedTheme, setSelectedTheme, selectedLayout, setSelectedLayout } =
    useSlideThemeContext();
  const { slides, setSlides, selectedSlideIndex } = useSlides();
  const [layoutRefreshKey, setLayoutRefreshKey] = useState(0);
  const { applyLayout, userTriggeredLayoutChange, layoutMap } = useLayoutControl(
    selectedLayout,
    setSlides,
    slides,
    setLayoutRefreshKey,
    selectedSlideIndex
  );

  const [lastAppliedLayout, setLastAppliedLayout] = useState<number | null>(null);
  const [backgroundMode, setBackgroundMode] = useState<"color" | "image">("color");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [quotaError, setQuotaError] = useState(false);
  const backgroundStateRef = useRef<{ mode: "color" | "image"; value: string }>({
    mode: "color",
    value: "#fff",
  });
  const colorInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [colorPickerAnchor, setColorPickerAnchor] = useState<null | HTMLElement>(null);

  const handleColorButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    setColorPickerAnchor(event.currentTarget);
  };

  const handleColorPickerClose = () => {
    setColorPickerAnchor(null);
  };

  const handleCloseQuotaError = () => {
    setQuotaError(false);
  };

  // FIXED: Palette application
  const handlePaletteClick = (palette: string[]) => {
    const theme = paletteToTheme(palette);
    // FIXED: Calculate contrasting text color
    const contrastText = getContrastingTextColor(palette[0], palette[1]);
    const updatedTheme = {
      ...theme,
      primaryColor: contrastText,
      titleColor: contrastText,
      image_url: backgroundStateRef.current.mode === "image" ? backgroundStateRef.current.value : "",
      backgroundColor: backgroundStateRef.current.mode === "color" ? palette[0] : "",
      artPalette: [
        palette[1],
        palette[3] || palette[1],
        palette[1],
        backgroundStateRef.current.mode === "color" ? palette[0] : (selectedTheme?.artPalette?.[3] || palette[0]),  // FIXED: Sync with current bg
        backgroundStateRef.current.mode === "color" ? palette[0] : (selectedTheme?.artPalette?.[4] || palette[0])   // FIXED: Sync background
      ],
    };
    setSelectedTheme(updatedTheme);
    if (backgroundStateRef.current.mode === "color") {
      backgroundStateRef.current.value = palette[0];
      try {
        localStorage.setItem("backgroundValue", palette[0]);
      } catch (e) {
        console.error("Failed to save background value to localStorage", e);
      }
    }
    try {
      localStorage.setItem("slidesTheme", JSON.stringify(updatedTheme));
      localStorage.setItem("backgroundMode", backgroundStateRef.current.mode);
    } catch (e) {
      console.error("Failed to save theme to localStorage", e);
      if (e instanceof DOMException && e.name === "QuotaExceededError") {
        setQuotaError(true);
      }
    }
  };

  const handleBackgroundColorChange = (color: string) => {
    const contrastText = getContrastingTextColor(color, selectedTheme?.primaryColor || '#000000');
    backgroundStateRef.current = { mode: "color", value: color };
    const updatedTheme = {
      ...selectedTheme,
      backgroundColor: color,
      primaryColor: contrastText,
      titleColor: contrastText,
      image_url: "",
      font: selectedTheme?.font ?? "Inter",
      secondaryColor: selectedTheme?.secondaryColor,
      artPalette: selectedTheme?.artPalette?.map((c, i) =>
        i === 4 ? color : c  // FIXED: Update artPalette[4] to match new background
      ) || selectedTheme?.artPalette,
    };
    setSelectedTheme(updatedTheme);
    setBackgroundMode("color");
    setImageUrl("");
    try {
      localStorage.setItem("slidesTheme", JSON.stringify(updatedTheme));
      localStorage.setItem("backgroundMode", "color");
      localStorage.setItem("backgroundValue", color);
    } catch (e) {
      console.error("Failed to save theme to localStorage", e);
      if (e instanceof DOMException && e.name === "QuotaExceededError") {
        setQuotaError(true);
      }
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const image = reader.result as string;
        backgroundStateRef.current = { mode: "image", value: image };
        const updatedTheme = {
          ...selectedTheme,
          backgroundColor: "",
          image_url: image,
          font: selectedTheme?.font ?? "Inter",
          primaryColor: selectedTheme?.primaryColor,
          secondaryColor: selectedTheme?.secondaryColor,
          titleColor: selectedTheme?.titleColor ?? "black",
          artPalette: selectedTheme?.artPalette,
        };
        setSelectedTheme(updatedTheme);
        setImageUrl(image);
        setBackgroundMode("image");
        try {
          localStorage.setItem("slidesTheme", JSON.stringify(updatedTheme));
          localStorage.setItem("backgroundMode", "image");
          localStorage.setItem("backgroundValue", image);
        } catch (e) {
          if (e instanceof DOMException && e.name === "QuotaExceededError") {
            setQuotaError(true);
          } else {
            console.error("Failed to save image to localStorage", e);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBackgroundModeChange = (
    newMode: "color" | "image"
  ) => {
    const currentValue = backgroundStateRef.current.value;
    backgroundStateRef.current = {
      mode: newMode,
      value: newMode === "color" && !currentValue ? "#fff" : currentValue,
    };
    const updatedTheme = {
      ...selectedTheme,
      backgroundColor: newMode === "color" ? backgroundStateRef.current.value : "",
      image_url: newMode === "image" ? backgroundStateRef.current.value : "",
      font: selectedTheme?.font ?? "Inter",
      primaryColor: selectedTheme?.primaryColor,
      secondaryColor: selectedTheme?.secondaryColor,
      titleColor: selectedTheme?.titleColor ?? "black",
      artPalette: selectedTheme?.artPalette,
    };
    setSelectedTheme(updatedTheme);
    setBackgroundMode(newMode);
    setImageUrl(newMode === "image" ? backgroundStateRef.current.value : "");
    try {
      localStorage.setItem("slidesTheme", JSON.stringify(updatedTheme));
      localStorage.setItem("backgroundMode", newMode);
      localStorage.setItem("backgroundValue", backgroundStateRef.current.value);
    } catch (e) {
      if (e instanceof DOMException && e.name === "QuotaExceededError") {
        setQuotaError(true);
      } else {
        console.error("Failed to save theme to localStorage", e);
      }
    }
  };

  const DEFAULT_THEME = paletteToTheme(palettes[0]);
  const DEFAULT_LAYOUT = 0;

  const handleReset = () => {
    backgroundStateRef.current = { mode: "color", value: "#fff" };
    const defaultPal = palettes[0];
    const defaultThemeBase = paletteToTheme(defaultPal);
    const contrastText = getContrastingTextColor(defaultPal[0], defaultPal[1]);
    const updatedDefaultTheme = {
      ...defaultThemeBase,
      primaryColor: contrastText,
      titleColor: contrastText,
      artPalette: [defaultPal[1], defaultPal[3] || defaultPal[1], defaultPal[1], defaultPal[0], defaultPal[0]],
    };
    setSelectedTheme(updatedDefaultTheme);
    try {
      localStorage.setItem("slidesTheme", JSON.stringify(updatedDefaultTheme));
      localStorage.setItem("backgroundMode", "color");
      localStorage.setItem("backgroundValue", "#fff");
    } catch (e) {
      console.error("Failed to reset localStorage", e);
      if (e instanceof DOMException && e.name === "QuotaExceededError") {
        setQuotaError(true);
      }
    }
    setSelectedLayout(DEFAULT_LAYOUT as any);
    setBackgroundMode("color");
    setImageUrl("");
    setLastAppliedLayout(DEFAULT_LAYOUT);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("slidesTheme");
    const savedBackgroundMode = localStorage.getItem("backgroundMode");
    const savedBackgroundValue = localStorage.getItem("backgroundValue");
    const savedLayout = localStorage.getItem("selectedLayout");

    // restore theme
    if (savedTheme && savedBackgroundMode && savedBackgroundValue) {
      try {
        const parsed = JSON.parse(savedTheme);
        backgroundStateRef.current = {
          mode: savedBackgroundMode as "color" | "image",
          value: savedBackgroundValue,
        };
        setSelectedTheme({
          ...parsed,
          backgroundColor: savedBackgroundMode === "color" ? savedBackgroundValue : "",
          image_url: savedBackgroundMode === "image" ? savedBackgroundValue : parsed.image_url || "",
          titleColor: parsed.titleColor || "black",
          artPalette: parsed.artPalette,
        });
        setBackgroundMode(savedBackgroundMode as "color" | "image");
        if (savedBackgroundMode === "image") {
          setImageUrl(savedBackgroundValue);
        }
      } catch (e) {
        console.error("Failed to parse saved theme", e);
        backgroundStateRef.current = { mode: "color", value: "#fff" };
        setSelectedTheme(DEFAULT_THEME);
        setBackgroundMode("color");
        setImageUrl("");
      }
    } else {
      backgroundStateRef.current = { mode: "color", value: "#fff" };
      setSelectedTheme(DEFAULT_THEME);
      setBackgroundMode("color");
      setImageUrl("");
    }

    if (savedLayout !== null) {
      const parsedLayout = Number(savedLayout);

      if (layouts.includes(parsedLayout as LayoutType)) {
        setSelectedLayout(parsedLayout as LayoutType);
        setLastAppliedLayout(parsedLayout);
      } else {
        setSelectedLayout(DEFAULT_LAYOUT);
        setLastAppliedLayout(DEFAULT_LAYOUT);
      }
    } else {
      setSelectedLayout(DEFAULT_LAYOUT);
      setLastAppliedLayout(DEFAULT_LAYOUT);
    }

  }, []);


  // UPDATED: Layout application - Set layout_type and let template handle
  useEffect(() => {
    if (!userTriggeredLayoutChange.current) return;

    const layoutType = layoutMap[selectedLayout];
    if (layoutType && selectedSlideIndex >= 0 && selectedSlideIndex < slides.length) {
      const updatedSlides = structuredClone(slides);
      updatedSlides[selectedSlideIndex] = {
        ...updatedSlides[selectedSlideIndex],
        layout_type: layoutType,
      };
      setSlides(updatedSlides);
    }

    userTriggeredLayoutChange.current = false;
  }, [selectedLayout, layoutRefreshKey, slides, setSlides, selectedSlideIndex]);
  const allPalettes = palettes;
  // FIXED: Updated matching to use contrasted color
  const selectedPaletteIdx = allPalettes.findIndex(
    (p) =>
      selectedTheme &&
      p[0] === selectedTheme.backgroundColor &&
      getContrastingTextColor(p[0], p[1]) === selectedTheme.primaryColor &&
      p[2] === selectedTheme.secondaryColor
  );

  return (
    <Box className="w-[360px] min-w-[320px] md:min-w-[320px] bg-white flex flex-col overflow-y-auto border-r border-gray-200">
      {/* Quota Exceeded Popup */}
      <Snackbar
        open={quotaError}
        autoHideDuration={6000}
        onClose={handleCloseQuotaError}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseQuotaError}
          severity="error"
          sx={{ width: "100%" }}
        >
          Storage limit exceeded. Please use a smaller image.
        </Alert>
      </Snackbar>
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
      </Box>
      <Divider sx={{ my: 2 }} />
      {/* Theme Palette */}
      <Box sx={{ px: 3, mb: 2 }}>
        <Typography
          sx={{ fontWeight: 600, fontSize: 17, mb: 1, letterSpacing: 0.2 }}
        >
          Theme Palette
        </Typography>
        {/* FIXED: Render palettes with better selection indication */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          {allPalettes.map((palette, i) => (
            <Box
              key={i}
              onClick={() => handlePaletteClick(palette)}
              sx={{
                cursor: "pointer",
                p: 1.5,  // FIXED: Better padding
                borderRadius: 2,
                border: selectedPaletteIdx === i
                  ? "2px solid #7B4AE2"  // FIXED: Show selected state
                  : "2px solid transparent",
                bgcolor: selectedPaletteIdx === i ? "#F5F5F5" : "transparent",
                "&:hover": {
                  bgcolor: "#F5F5F5",
                  borderColor: selectedPaletteIdx === i ? "#7B4AE2" : "#E0E0E0",
                },
                transition: "all 0.2s ease",
              }}
            >
              <PaletteStack colors={palette} />
            </Box>
          ))}
        </Box>
      </Box>
      <Divider />
      {/* Presentation Layout */}
      <Box sx={{ px: 3, py: 2 }}>
        <Typography sx={{ fontWeight: 500, fontSize: 16, mb: 1 }}>
          Presentation Layout
        </Typography>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
          {[...Array(6)].map((_, i) => (
            <button
              key={i}
              onClick={() => applyLayout(i as LayoutType)}
              className={`w-[150px] h-[85px] p-0 overflow-hidden mb-2 rounded-sm
                ${selectedLayout === i
                  ? "shadow-[0_0_0_2px_#7B4AE2]"
                  : "shadow-[0_0_0_1px_#ECECEC]"
                }`}

            >
              <img
                src={`/new-layout-${i}.svg`}
                alt={`Layout ${i + 1}`}
                className="block w-[100px] h-[50px] mx-auto"
                style={{ marginLeft: 5 }}
              />
            </button>
          ))}
        </div>
        <Box sx={{ px: 3, pb: 3, pt: 0 }}>
          <Button
            fullWidth
            sx={{
              bgcolor: "linear-gradient(90deg, #7B4AE2 0%, #5F2EEA 100%)",
              color: "#fff",
              fontWeight: 600,
              marginTop: "20px",
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
            onClick={() => applyLayout(-1 as LayoutType)}
          >
            Disable Layout
          </Button>
        </Box>
      </Box>
      <Divider />
      {/* Custom Background Color Section */}
      <Box display="flex" sx={{ px: 3, py: 2 }}>
        <Typography sx={{ fontWeight: 300, fontSize: 16, mb: 1 }}>
          Background
        </Typography>
        <Select
          value={backgroundMode}
          onChange={(e) => handleBackgroundModeChange(e.target.value as "color" | "image")}
          sx={{ ml: 10, height: 30, width: 200, fontSize: 15, color: "rgba(109, 109, 109, 1)" }}
        >
          <MenuItem value="color" sx={{ textTransform: "none", fontSize: 15 }}>
            Color
          </MenuItem>
          <MenuItem value="image" sx={{ textTransform: "none", fontSize: 15 }}>
            Image
          </MenuItem>
        </Select>
        <Box>
          {backgroundMode === "color" ? (
            <Box sx={{ px: 10, py: 2, ml: -42, mt: 6 }}>
              {/* Current Color Section */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 300, whiteSpace: "nowrap", fontSize: 16 }}
                >
                  Current Color
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      flexGrow: "unset",
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      backgroundColor: selectedTheme?.backgroundColor || "#fff",
                      border: "1px solid #ccc",
                      cursor: "pointer",
                    }}
                    onClick={() => handleBackgroundColorChange(selectedTheme?.backgroundColor || "#fff")}
                  />
                  <IconButton
                    onClick={handleColorButtonClick}
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      border: "1px solid #ccc",
                    }}
                  >
                    +
                  </IconButton>
                </Box>
                <Popover
                  open={Boolean(colorPickerAnchor)}
                  anchorEl={colorPickerAnchor}
                  onClose={handleColorPickerClose}
                  anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                >
                  <ChromePicker
                    color={selectedTheme?.backgroundColor || "#fff"}
                    onChangeComplete={(color) => handleBackgroundColorChange(color.hex)}
                    disableAlpha
                  />
                </Popover>
              </Box>
            </Box>
          ) : (
            <Box sx={{ px: 3, py: 2 }}>
              {/* Preview area */}
              <Box
                sx={{
                  width: 300,
                  height: 150,
                  aspectRatio: "16/9",
                  borderRadius: 3,
                  overflow: "hidden",
                  mt: 8,
                  mb: 1.5,
                  ml: -35,
                  position: "relative",
                }}
              >
                <img
                  src={imageUrl || "/sample-content-image.jpg"}
                  alt="Preview"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: 12,
                  }}
                />
                <Button
                  variant="contained"
                  onClick={() => fileInputRef.current?.click()}
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    bgcolor: "rgba(0,0,0,0.5)",
                    color: "#fff",
                    borderRadius: 2,
                    px: 2,
                    py: 0.5,
                    fontWeight: 600,
                    fontSize: 15,
                    textTransform: "none",
                    minWidth: 0,
                  }}
                >
                  Replace
                </Button>
              </Box>
              {/* Upload Button */}
              <Box sx={{ px: 3, pb: 2, display: "flex" }}>
                <Button
                  variant="outlined"
                  component="label"
                  sx={{
                    textTransform: "none",
                    px: 10,
                    whiteSpace: "nowrap",
                    width: 200,
                    marginLeft: -30,
                    marginTop: 5,
                  }}
                >
                  Upload Image
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleImageUpload}
                  />
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
      <Divider />
      {/* Reset Button */}
      <Box sx={{ px: 3, pb: 3, pt: 0 }}>
        <Button
          fullWidth
          sx={{
            bgcolor: "linear-gradient(90deg, #7B4AE2 0%, #5F2EEA 100%)",
            color: "#fff",
            fontWeight: 600,
            marginTop: "20px",
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