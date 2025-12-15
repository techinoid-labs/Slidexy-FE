import React, { useRef, useState, useEffect } from "react";
import { Box, Button, Divider, Typography, Snackbar, Alert } from "@mui/material";
import { useSlideThemeContext } from "@/app/context/ThemeContext";
import { useSlides } from "@/app/context/SlidesContext";
import LayoutVariantPreview from "./LayoutVariantPreview";
import { generateSlideVariants } from "../../../utils/variantGenerator";

// Compact palette swatch component - small inline rectangles
const PaletteSwatch: React.FC<{ colors: string[]; isSelected?: boolean; onClick?: () => void }> = ({
  colors,
  isSelected = false,
  onClick,
}) => {
  return (
    <Box
      onClick={onClick}
      sx={{
        display: "flex",
        alignItems: "center",
        height: 24, // Even smaller for compactness
        borderRadius: 1,
        border: isSelected ? "2px solid #7B4AE2" : "1px solid #e5e5e5",
        bgcolor: isSelected ? "rgba(123,74,226,0.04)" : "transparent",
        cursor: "pointer",
        transition: "all 0.15s ease",
        overflow: "hidden",
        "&:hover": {
          borderColor: "#7B4AE2",
          bgcolor: "rgba(123,74,226,0.06)",
          transform: "scale(1.01)",
        },
        p: 0,
      }}
    >
      {colors.map((color, i) => (
        <Box
          key={i}
          sx={{
            flex: 1,
            height: "100%",
            bgcolor: color,
            borderRight: i < colors.length - 1 ? "1px solid rgba(255,255,255,0.6)" : "none",
          }}
        />
      ))}
      {isSelected && (
        <Box
          sx={{
            ml: 0.5,
            minWidth: 16,
            height: 16,
            borderRadius: 0.5,
            bgcolor: "#7B4AE2",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: 9,
            fontWeight: 700,
          }}
        >
          ✓
        </Box>
      )}
    </Box>
  );
};

// Enhanced palettes - Added more palettes for variety, starting with a lighter purple theme
const palettes = [
  // Lighter Purple (default/first applying)
  ["#F8F4FF", "#9575CD", "#E6D6FF", "#5E35B1"],
  // Original Purple
  ["#F3E5F5", "#7B1FA2", "#E1BEE7", "#4A148C"],
  // Red
  ["#FFF7F7", "#D32F2F", "#FFCDD2", "#B71C1C"],
  // Green
  ["#E8F5E8", "#2E7D32", "#C8E6C9", "#1B5E20"],
  // Black/White
  ["#ffffff", "#000000", "#333333", "#666666"],
  // Blue
  ["#E3F2FD", "#0D47A1", "#BBDEFB", "#01579B"],
  // Orange
  ["#FFF8E1", "#BF360C", "#FFE0B2", "#E65100"],
  // Pink
  ["#FCE4EC", "#C2185B", "#F8BBD9", "#880E4F"],
  // Teal
  ["#E0F2F1", "#00695C", "#B2DFDB", "#004D40"],
  // Pastel Yellow
  ["#FFFDE7", "#FBC02D", "#FFF59D", "#F57F17"],
  // Cool Grey
  ["#FAFAFA", "#757575", "#E0E0E0", "#424242"],
];

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

  // Make text darker and more visible - use higher contrast threshold
  // For light backgrounds, use very dark text (#000000 or #0a0a0a)
  // For dark backgrounds, use white (#ffffff)
  if (bgLum > 0.5) {
    // Light background - use very dark text for better visibility
    return contrast >= 7 ? preferredText : '#0a0a0a';
  } else {
    // Dark background - use white
    return contrast >= 7 ? preferredText : '#ffffff';
  }
};

const paletteToTheme = (palette: string[]) => ({
  font: "Inter",
  primaryColor: palette[1],
  secondaryColor: palette[2],
  backgroundColor: palette[0],
  titleColor: palette[1],
  image_url: "",
  artPalette: [palette[1], palette[3] || palette[1], palette[1], palette[0], palette[0]],
});

interface ThemePanelProps {
  parsedSlides: any;  // or a proper type like SlidesType
  resetAll: () => void;
}

const ThemePanel: React.FC<ThemePanelProps> = ({ parsedSlides, resetAll }) => {
  const { selectedTheme, setSelectedTheme } = useSlideThemeContext();
  const {
    slides,
    setSlides,
    selectedSlideIndex,
    setSelectedTextId,
    setSelectedImageId,
    setSelectedImageIndex,
    setSelectedImage,
    setSelectedShapeIndex,
    setSelectedShapeId,
  } = useSlides();

  const [quotaError, setQuotaError] = useState(false);
  const [currentVariants, setCurrentVariants] = useState<any[]>([]);
  const [localVariantIndex, setLocalVariantIndex] = useState(0);
  const [isApplying, setIsApplying] = useState(false);

  const isApplyingRef = useRef(false);
  const variantTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear any pending timeout
    if (variantTimeoutRef.current) {
      clearTimeout(variantTimeoutRef.current);
    }

    if (isApplyingRef.current) {
      console.log('[ThemePanel] Skipping variant generation - applying in progress');
      return;
    }

    if (selectedSlideIndex >= 0 && slides[selectedSlideIndex]) {
      const currentSlide = slides[selectedSlideIndex];
      
      // Debounce variant generation to prevent performance issues
      variantTimeoutRef.current = setTimeout(() => {
        console.log('[ThemePanel] Generating fresh layouts for theme/slide update');
        const freshLayouts = generateSlideVariants(currentSlide, selectedTheme);
        setCurrentVariants(freshLayouts);

        const currentIndex = currentSlide.currentVariantIndex ?? 0;
        setLocalVariantIndex(Math.min(currentIndex, freshLayouts.length - 1));
        console.log('[ThemePanel] Synced localVariantIndex to', currentIndex);

        // Only update slide layouts if they don't exist or are empty
        if (!currentSlide.layouts || currentSlide.layouts.length === 0) {
          const updatedSlides = structuredClone(slides);
          updatedSlides[selectedSlideIndex].layouts = freshLayouts;
          setSlides(updatedSlides);
          console.log('[ThemePanel] Initialized slide layouts');
        }
      }, 300); // Debounce 300ms to prevent rapid re-generation
    } else {
      setCurrentVariants([]);
      setLocalVariantIndex(0);
    }

    return () => {
      if (variantTimeoutRef.current) {
        clearTimeout(variantTimeoutRef.current);
      }
    };
  }, [selectedSlideIndex, selectedTheme, slides]);

  const applyVariant = (variantIndex: number) => {
    if (selectedSlideIndex < 0 || !currentVariants || !currentVariants[variantIndex]) {
      console.error('[ThemePanel] Invalid variant apply attempt:', { selectedSlideIndex, variantIndex, variantCount: currentVariants?.length });
      return;
    }

    if (isApplying) {
      console.log('[ThemePanel] Skipping apply - debounce active');
      return;
    }

    console.log('[ThemePanel] Applying variant', variantIndex, 'from', currentVariants.length, 'variants');

    setIsApplying(true);
    isApplyingRef.current = true;

    // Immediately update UI to show selection
    setLocalVariantIndex(variantIndex);

    // Deep clone to ensure no mutations
    const updatedSlides = structuredClone(slides);
    const currentSlide = updatedSlides[selectedSlideIndex];
    const selectedVariant = structuredClone(currentVariants[variantIndex]);

    if (!currentSlide) {
      console.error('[ThemePanel] Slide not found at index', selectedSlideIndex);
      setIsApplying(false);
      isApplyingRef.current = false;
      return;
    }

    // ✅ CRITICAL: Replace entire slide properties with variant
    currentSlide.elements = selectedVariant.elements ? structuredClone(selectedVariant.elements) : [];
    currentSlide.layout_type = selectedVariant.layout_type || currentSlide.layout_type;
    currentSlide.slide_title = selectedVariant.slide_title ? structuredClone(selectedVariant.slide_title) : currentSlide.slide_title;
    currentSlide.subtitle = selectedVariant.subtitle ? structuredClone(selectedVariant.subtitle) : currentSlide.subtitle;
    currentSlide.background = selectedVariant.background ? structuredClone(selectedVariant.background) : currentSlide.background;
    
    if (selectedVariant.image_url !== undefined) {
      currentSlide.image_url = selectedVariant.image_url;
    }

    // Track which variant is active
    currentSlide.currentVariantIndex = variantIndex;

    // Update layouts array
    if (!currentSlide.layouts) {
      currentSlide.layouts = currentVariants;
    } else {
      currentSlide.layouts[variantIndex] = selectedVariant;
    }

    console.log('[ThemePanel] Updated slide with variant:', { layout_type: currentSlide.layout_type, elementCount: currentSlide.elements.length });

    // Apply changes - triggers SlideEditor re-render
    setSlides(updatedSlides);

    // Clear selections to prevent stale state
    const clearSelections = () => {
      setSelectedTextId(null);
      setSelectedImageId(null);
      setSelectedImageIndex(null);
      setSelectedImage(null);
      setSelectedShapeIndex(null);
      setSelectedShapeId(null);
      setIsApplying(false);
      isApplyingRef.current = false;
    };

    // Batch clearance to avoid flickering
    setTimeout(clearSelections, 150);

    // Persist variant choice
    try {
      localStorage.setItem(`slide-variant-${selectedSlideIndex}`, String(variantIndex));
    } catch (e) {
      console.warn('[ThemePanel] Failed to save variant index to localStorage:', e);
    }
  };

  const handlePaletteClick = (palette: string[], index: number) => {
    const theme = paletteToTheme(palette);
    const contrastText = getContrastingTextColor(palette[0], palette[1]);
    const updatedTheme = {
      ...theme,
      primaryColor: contrastText,
      titleColor: contrastText,
      image_url: "",
      backgroundColor: palette[0],
      artPalette: [
        palette[1],
        palette[3] || palette[1],
        palette[1],
        palette[0],
        palette[0]
      ],
    };
    setSelectedTheme(updatedTheme);
    try {
      localStorage.setItem("slidesTheme", JSON.stringify(updatedTheme));
    } catch (e) {
      console.error("Failed to save theme", e);
      if (e instanceof DOMException && e.name === "QuotaExceededError") {
        setQuotaError(true);
      }
    }
  };

  const handleReset = () => {
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
    } catch (e) {
      console.error("Failed to reset localStorage", e);
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("slidesTheme");

    if (savedTheme) {
      try {
        const parsed = JSON.parse(savedTheme);
        setSelectedTheme({
          ...parsed,
          titleColor: parsed.titleColor || getContrastingTextColor(parsed.backgroundColor || "#ffffff", parsed.primaryColor || "#000000"),
          artPalette: parsed.artPalette,
        });
      } catch (e) {
        console.error("Failed to parse saved theme", e);
      }
    } else {
      handleReset();
    }
  }, []);

  const allPalettes = palettes;
  const selectedPaletteIdx = allPalettes.findIndex(
    (p) =>
      selectedTheme &&
      p[0] === selectedTheme.backgroundColor &&
      getContrastingTextColor(p[0], p[1]) === selectedTheme.primaryColor &&
      p[2] === selectedTheme.secondaryColor
  );

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const previewSize = isMobile ? { width: 120, height: 67.5 } : { width: 140, height: 78.75 }; // Smaller previews for narrower panel

  return (
    <Box className="w-[300px] min-w-[250px] md:min-w-[250px] bg-white flex-col border-r border-gray-200 shadow-sm"
      sx={{
        '&::-webkit-scrollbar': {
          display: 'none',
        },
        msOverflowStyle: 'none',  // IE and Edge
        scrollbarWidth: 'none',   // Firefox
      }}>
      <Snackbar
        open={quotaError}
        autoHideDuration={6000}
        onClose={() => setQuotaError(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setQuotaError(false)} severity="error" sx={{ width: "100%" }}>
          Storage limit exceeded. Please use a smaller image.
        </Alert>
      </Snackbar>

      {/* Header - Clean and minimal */}
      <Box sx={{ px: 2, pt: 2, pb: 1.5 }}>
        <Typography sx={{ fontWeight: 700, fontSize: 16, color: "#333", letterSpacing: 0.3 }}>
          Theme Settings
        </Typography>
      </Box>
      <Divider sx={{ borderColor: "#f0f0f0" }} />

      {/* Theme Palette - Vertical stack, compact swatches */}
      <Box sx={{ px: 4, py: 2 }}>
        <Typography sx={{ fontWeight: 600, fontSize: 14, mb: 1.5, color: "#555" }}>
          Palettes
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {allPalettes.map((palette, i) => (
            <PaletteSwatch
              key={i}
              colors={palette}
              isSelected={selectedPaletteIdx === i}
              onClick={() => handlePaletteClick(palette, i)}
            />
          ))}
        </Box>
        <Typography variant="caption" sx={{ color: "#999", textAlign: "center", display: "block", mt: 1.5, fontSize: 11 }}>
          Titles auto-contrast for visibility.
        </Typography>
      </Box>
      <Divider sx={{ borderColor: "#f0f0f0" }} />

      {/* Layout Variants Section - Adjusted for narrower panel */}
      <Box sx={{ px: 2, py: 2 }}>
        <Typography sx={{ fontWeight: 600, fontSize: 14, mb: 1.5, color: "#555" }}>
          Layouts
        </Typography>
        {selectedSlideIndex >= 0 && currentVariants.length > 0 ? (
          <>
            <Typography variant="caption" sx={{ mb: 1.5, color: "#888", fontSize: 12 }}>
              Slide {selectedSlideIndex + 1}
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {currentVariants.map((variant: any, i: number) => (
                <LayoutVariantPreview
                  key={`variant-${selectedSlideIndex}-${i}`}
                  variant={variant}
                  isSelected={localVariantIndex === i}
                  onClick={() => applyVariant(i)}
                  size={previewSize}
                />
              ))}
            </Box>
          </>
        ) : (
          <Box sx={{ textAlign: "center", py: 4, color: "#999" }}>
            <Typography variant="caption" sx={{ mb: 0.5, display: "block" }}>
              Select slide
            </Typography>
            <Typography variant="caption" color="textSecondary" sx={{ fontSize: 10 }}>
              to see layouts
            </Typography>
          </Box>
        )}
      </Box>
      <Divider sx={{ borderColor: "#f0f0f0" }} />

      {/* Reset Button - Compact footer */}
      <Box sx={{ px: 2, py: 2, bgcolor: "#fafafa" }}>
        <Button
          fullWidth
          onClick={handleReset}
          variant="contained"
          size="small"
          sx={{
            bgcolor: "#7B4AE2",
            color: "#fff",
            fontWeight: 600,
            fontSize: 13,
            borderRadius: 1.5,
            py: 1,
            textTransform: "none",
            boxShadow: "0 1px 4px rgba(123,74,226,0.2)",
            "&:hover": {
              bgcolor: "#5F2EEA",
              boxShadow: "0 2px 8px rgba(123,74,226,0.3)",
            },
          }}
        >
          Reset
        </Button>
      </Box>
    </Box>
  );
};

export default ThemePanel;