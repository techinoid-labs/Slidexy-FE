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

// Custom hook to manage layout selection
const layouts = [-1, 0, 1, 2, 3, 4, 5] as const;
type LayoutType = typeof layouts[number];

const useLayoutControl = (
  initialLayout: number | null,
  setSlides: (slides: any) => void,
  slides: any[],
  setLayoutRefreshKey: React.Dispatch<React.SetStateAction<number>>
) => {
  const { setSelectedLayout } = useSlideThemeContext();
  const userTriggeredLayoutChange = useRef(false);
  const applyLayout = (layoutIndex: LayoutType) => {
    userTriggeredLayoutChange.current = true;
    setSelectedLayout(layoutIndex);
    setLayoutRefreshKey(prev => prev + 1);
  };

  return { applyLayout, userTriggeredLayoutChange };
};

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

// Sample palettes (six predefined)
const palettes = [
  ["#fff", "black", "black", "black"],
  ["#E09B4B", "#F5D7A1", "#F9EEDB", "#3C2B1C"],
  ["#B6D44A", "#1B5E20", "#3DE1C1", "#00695C"],
  ["#7B4AE2", "#B39DDB", "#E1BEE7", "#9575CD"],
  ["#F5F5F5", "#0288D1", "#B3E5FC", "#0277BD"],
  ["#FFF3E0", "#F57C00", "#FFCC80", "#EF6C00"],
];

// Updated layout rules with specified layouts
const layoutRules: Record<
  number,
  (el: any, idx: number, type: string | undefined) => { x: number; y: number }
> = {
  0: (el, idx, type) => {
    if (type === "image") return { x: 560, y: 100 };
    if (type === "title") return { x: 50, y: 90 };
    if (type === "text") return { x: 50, y: 95 + idx * 30 };
    else {
      return { x: 50, y: 95 + idx * 30 };
    }
  },
  1: (el, idx, type) => {
    if (type === "image") return { x: 60, y: 100 };
    if (type === "title") return { x: 450, y: 90 };
    if (type === "text") return { x: 450, y: 95 + idx * 30 };
    else {
      return { x: 450, y: 95 + idx * 30 };
    }
  },
  2: (el, idx, type) => {
    if (type === "image") return { x: 227, y: 130 };
    if (type === "title") return { x: 50, y: 50 };
    if (type === "text") return { x: 350, y: 220 + idx * 30 };
    else {
      return { x: 50, y: 310 + idx * 30 };
    }
  },
  3: (el, idx, type) => {
    if (type === "image") return { x: 250, y: 310 };
    if (type === "title") return { x: 50, y: 50 };
    if (type === "text") return { x: 350, y: -30 + idx * 30 };
    else {
      return { x: 50, y: 70 + idx * 30 };
    }
  },
  4: (el, idx, type) => {
    if (type === "image") return { x: 50, y: 120 };
    if (type === "title") return { x: 50, y: 50 };
    if (type === "text") return { x: 400, y: 100 + idx * 30 };
    return { x: 400, y: 100 + idx * 30 };
  },
  5: (el, idx, type) => {
    if (type === "image") return { x: 250, y: 50 };
    if (type === "title") return { x: 50, y: 250 };
    if (type === "text") return { x: 500, y: 100 + idx * 30 };
    else {
      return { x: 50, y: 255 + idx * 30 };
    }
  },
};

const layoutStyles: Record<
  number,
  {
    title: { fontSize: number; fontWeight: number };
    text: { fontSize: number };
    bullet: { fontSize: number };
    image: { width: number; height: number };
  }
> = {
  0: {
    title: { fontSize: 30, fontWeight: 700 },
    text: { fontSize: 24 },
    bullet: { fontSize: 18 },
    image: { width: 300, height: 350 },
  },
  1: {
    title: { fontSize: 30, fontWeight: 700 },
    text: { fontSize: 24 },
    bullet: { fontSize: 18 },
    image: { width: 300, height: 350 },
  },
  2: {
    title: { fontSize: 30, fontWeight: 700 },
    text: { fontSize: 24 },
    bullet: { fontSize: 18 },
    image: { width: 500, height: 200 },
  },
  3: {
    title: { fontSize: 30, fontWeight: 700 },
    text: { fontSize: 24 },
    bullet: { fontSize: 18 },
    image: { width: 500, height: 200 },
  },
  4: {
    title: { fontSize: 30, fontWeight: 700 },
    text: { fontSize: 24 },
    bullet: { fontSize: 18 },
    image: { width: 300, height: 350 },
  },
  5: {
    title: { fontSize: 30, fontWeight: 700 },
    text: { fontSize: 24 },
    bullet: { fontSize: 18 },
    image: { width: 500, height: 200 },
  },
};

// Helper to map palette to theme object
const paletteToTheme = (palette: string[]) => ({
  font: "Inter",
  primaryColor: palette[1],
  secondaryColor: palette[2],
  backgroundColor: palette[0],
  titleColor: palette[1], // Use primaryColor for titles
  image_url: "",
});

const ThemePanel = ({ parsedSlides = [], resetAll }: any) => {
  const { selectedTheme, setSelectedTheme, selectedLayout, setSelectedLayout } =
    useSlideThemeContext();
  const { slides, setSlides } = useSlides();
  const [layoutRefreshKey, setLayoutRefreshKey] = useState(0);
  const { applyLayout, userTriggeredLayoutChange } = useLayoutControl(
    selectedLayout,
    setSlides,
    slides,
    setLayoutRefreshKey
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

  const handlePaletteClick = (palette: string[]) => {
    const theme = paletteToTheme(palette);
    const updatedTheme = {
      ...theme,
      image_url: backgroundStateRef.current.mode === "image" ? backgroundStateRef.current.value : "",
      backgroundColor: backgroundStateRef.current.mode === "color" ? palette[0] : "",
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
    const updatedSlides = slides.map((slide) => ({
      ...slide,
      slide_title: {
        ...slide.slide_title,
        useThemeColor: true,
        properties: {
          ...slide.slide_title.properties,
          color: slide.slide_title.properties?.color || palette[1],
        },

      },
      elements: slide.elements.map((el) => {
        if (
          el.element_type === "text" ||
          (el.element_type === "bullet_point" && el.useThemeColor !== false)
        ) {
          return {
            ...el,
            useThemeColor: true,
            properties: {
              ...el.properties,
              color: palette[1], // Apply primaryColor to text and bullet points
            },
          };
        }
        return el;
      }),
    }));
    setSlides(updatedSlides);
  };

  const handleBackgroundColorChange = (color: string) => {
    backgroundStateRef.current = { mode: "color", value: color };
    const updatedTheme = {
      ...selectedTheme,
      backgroundColor: color,
      image_url: "",
      font: selectedTheme?.font ?? "Inter",
      primaryColor: selectedTheme?.primaryColor,
      secondaryColor: selectedTheme?.secondaryColor,
      titleColor: selectedTheme?.titleColor ?? "black",
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
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    const newMode = event.target.value as "color" | "image";
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
    setSelectedTheme(DEFAULT_THEME);
    try {
      localStorage.setItem("slidesTheme", JSON.stringify(DEFAULT_THEME));
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
    const updatedSlides = slides.map((slide) => ({
      ...slide,
      slide_title: {
        ...slide.slide_title,
        useThemeColor: true,
        properties: {
          ...slide.slide_title.properties,
          color: DEFAULT_THEME.titleColor,
        },
      },
      elements: slide.elements.map((el) => {
        if (
          el.element_type === "text" ||
          (el.element_type === "bullet_point" && el.useThemeColor !== false)
        ) {
          return {
            ...el,
            useThemeColor: true,
            properties: {
              ...el.properties,
              color: DEFAULT_THEME.primaryColor,
            },
          };
        }
        return el;
      }),
    }));
    setSlides(updatedSlides);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("slidesTheme");
    const savedBackgroundMode = localStorage.getItem("backgroundMode");
    const savedBackgroundValue = localStorage.getItem("backgroundValue");

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
  }, []);

  useEffect(() => {
    if (!userTriggeredLayoutChange.current) return;
    if (selectedLayout == null || selectedLayout === -1) return;

    const rule = layoutRules[selectedLayout];
    const style = layoutStyles[selectedLayout];
    if (!rule || !style) return;

    const updatedSlides = slides.map((slide) => {
      const newSlide = structuredClone(slide);
      const titleEl = { ...newSlide.slide_title, element_type: "title" };
      const bulletEls = newSlide.elements.filter((el) => el.element_type === "bullet_point");
      const textEls = newSlide.elements.filter((el) => el.element_type === "text");
      const imageEls = newSlide.elements.filter((el) => el.element_type === "image");

      const textElements = [titleEl, ...bulletEls, ...textEls];

      textElements.forEach((el, idx) => {
          const { x, y } = rule(el, idx, el.element_type);
          el.properties = {
            ...el.properties,
            x,
            y,
            ...(el.element_type === "title" && {
              fontSize: style.title.fontSize,
              fontWeight: style.title.fontWeight,
              color: selectedTheme?.titleColor || "black",
            }),
            ...(el.element_type === "text" && {
              fontSize: style.text.fontSize,
              color: selectedTheme?.primaryColor || "black",
            }),
            ...(el.element_type === "bullet_point" && {
              fontSize: style.bullet.fontSize,
              color: selectedTheme?.primaryColor || "black",
            }),
        }
      });

      imageEls.forEach((el, idx) => {
          const { x, y } = rule(el, idx, "image");
          el.properties = {
            ...el.properties,
            x,
            y,
            width: style.image.width,
            height: style.image.height,

        }
      });

      newSlide.slide_title = titleEl;
      newSlide.elements = [
        ...textElements.filter((el) => el.element_type !== "title"),
        ...imageEls,
      ];

      return newSlide;
    });

    setSlides(updatedSlides);
    setLastAppliedLayout(selectedLayout);
    userTriggeredLayoutChange.current = false;
  }, [selectedLayout, layoutRefreshKey, slides, setSlides, selectedTheme]);

  const allPalettes = palettes;
  const selectedPaletteIdx = allPalettes.findIndex(
    (p) =>
      selectedTheme &&
      p[0] === selectedTheme.backgroundColor &&
      p[1] === selectedTheme.primaryColor &&
      p[2] === selectedTheme.secondaryColor &&
      p[1] === selectedTheme.titleColor
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
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          {allPalettes.map((palette, i) => (
            <Box
              key={i}
              onClick={() => handlePaletteClick(palette)}
              sx={{
                cursor: "pointer",
                p: 1,
                borderRadius: 2,
                bgcolor: selectedPaletteIdx === i ? "#F5F5F5" : "transparent",
                "&:hover": { bgcolor: "#F5F5F5" },
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
          <button
            onClick={() => applyLayout(-1 as LayoutType)}
            className={`w-[150px] h-[85px] p-0 overflow-hidden mb-2 rounded-sm
              ${selectedLayout === -1
                ? "shadow-[0_0_0_2px_#7B4AE2]"
                : "shadow-[0_0_0_1px_#ECECEC]"
              }`}
          >
            <Typography
              sx={{
                fontSize: 14,
                fontWeight: 500,
                textAlign: "center",
                pt: 3,
              }}
            >
              Disable Layout
            </Typography>
          </button>
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
                src={`/layout-${i}.svg`}
                alt={`Layout ${i + 1}`}
                className="block w-[100px] h-[50px] mx-auto"
              />
            </button>
          ))}
        </div>
      </Box>
      <Divider />
      {/* Custom Background Color Section */}
      <Box display="flex" sx={{ px: 3, py: 2 }}>
        <Typography sx={{ fontWeight: 300, fontSize: 16, mb: 1 }}>
          Background
        </Typography>
        <Select
          value={backgroundMode}
          onChange={(e) => handleBackgroundModeChange(e.target.value as any)}
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