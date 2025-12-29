"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  Box,
  Button,
  Divider,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useSlideThemeContext } from "@/app/context/ThemeContext";
import { useSlides } from "@/app/context/SlidesContext";
import LiveLayoutPreview from "./LiveLayoutPreview";
import { generateSlideVariants } from "../../../utils/variantGenerator";

// Enhanced palettes - Synchronized with Desktop
const palettes = [
  ["#F8F4FF", "#9575CD", "#E6D6FF", "#5E35B1"],
  ["#F3E5F5", "#7B1FA2", "#E1BEE7", "#4A148C"],
  ["#FFF7F7", "#D32F2F", "#FFCDD2", "#B71C1C"],
  ["#E8F5E8", "#2E7D32", "#C8E6C9", "#1B5E20"],
  ["#ffffff", "#000000", "#333333", "#666666"],
  ["#E3F2FD", "#0D47A1", "#BBDEFB", "#01579B"],
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

  if (bgLum > 0.5) {
    return contrast >= 7 ? preferredText : '#0a0a0a';
  } else {
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

// PaletteStack: renders a stack of overlapping color circles
interface PaletteStackProps {
  colors: string[];
  size?: number;
  overlap?: number;
}

const PaletteStack: React.FC<PaletteStackProps> = ({
  colors,
  size = 30,
  overlap = 10,
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
            border: "1px solid rgba(255,255,255,0.4)",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            position: "absolute",
            left: i * overlap,
            zIndex: colors.length - i,
          }}
        />
      ))}
    </Box>
  );
};

interface ThemePanelMobileProps {
  onClose: () => void;
  parsedSlides?: any[];
  resetAll?: () => void;
}

const ThemePanelMobile = ({ onClose }: ThemePanelMobileProps) => {
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

  const [currentVariants, setCurrentVariants] = useState<any[]>([]);
  const [localVariantIndex, setLocalVariantIndex] = useState(0);
  const [isApplying, setIsApplying] = useState(false);

  const isApplyingRef = useRef(false);
  const variantTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (variantTimeoutRef.current) clearTimeout(variantTimeoutRef.current);
    if (isApplyingRef.current) return;

    if (selectedSlideIndex >= 0 && slides[selectedSlideIndex]) {
      const currentSlide = slides[selectedSlideIndex];
      variantTimeoutRef.current = setTimeout(() => {
        const freshLayouts = generateSlideVariants(currentSlide, selectedTheme);
        setCurrentVariants(freshLayouts);
        const currentIndex = currentSlide.currentVariantIndex ?? 0;
        setLocalVariantIndex(Math.min(currentIndex, freshLayouts.length - 1));
      }, 300);
    } else {
      setCurrentVariants([]);
      setLocalVariantIndex(0);
    }
    return () => { if (variantTimeoutRef.current) clearTimeout(variantTimeoutRef.current); };
  }, [selectedSlideIndex, selectedTheme, slides]);

  const applyVariant = (variantIndex: number) => {
    if (selectedSlideIndex < 0 || !currentVariants || !currentVariants[variantIndex] || isApplying) return;

    setIsApplying(true);
    isApplyingRef.current = true;
    setLocalVariantIndex(variantIndex);

    const updatedSlides = structuredClone(slides);
    const currentSlide = updatedSlides[selectedSlideIndex];
    const selectedVariant = structuredClone(currentVariants[variantIndex]);

    if (!currentSlide) {
      setIsApplying(false);
      isApplyingRef.current = false;
      return;
    }

    currentSlide.elements = selectedVariant.elements ? structuredClone(selectedVariant.elements) : [];
    currentSlide.layout_type = selectedVariant.layout_type || currentSlide.layout_type;
    currentSlide.slide_title = selectedVariant.slide_title ? structuredClone(selectedVariant.slide_title) : currentSlide.slide_title;
    currentSlide.subtitle = selectedVariant.subtitle ? structuredClone(selectedVariant.subtitle) : currentSlide.subtitle;
    currentSlide.background = selectedVariant.background ? structuredClone(selectedVariant.background) : currentSlide.background;

    if (selectedVariant.image_url !== undefined) currentSlide.image_url = selectedVariant.image_url;
    currentSlide.currentVariantIndex = variantIndex;

    if (!currentSlide.layouts) {
      currentSlide.layouts = currentVariants;
    } else {
      currentSlide.layouts[variantIndex] = selectedVariant;
    }

    setSlides(updatedSlides);

    setTimeout(() => {
      setSelectedTextId(null);
      setSelectedImageId(null);
      setSelectedImageIndex(null);
      setSelectedImage(null);
      setSelectedShapeIndex(null);
      setSelectedShapeId(null);
      setIsApplying(false);
      isApplyingRef.current = false;
    }, 150);
  };

  const updateContent = (item: any, primaryColor: string) => {
    if (!item) return;

    // Update title
    if (item.slide_title) {
      if (!item.slide_title.properties) item.slide_title.properties = {};
      item.slide_title.properties = { ...item.slide_title.properties, fill: primaryColor };
    }

    // Update subtitle
    if (item.subtitle) {
      if (!item.subtitle.properties) item.subtitle.properties = {};
      item.subtitle.properties = { ...item.subtitle.properties, fill: primaryColor };
    }

    // Update other text elements
    if (item.elements && Array.isArray(item.elements)) {
      item.elements = item.elements.map((el: any) => {
        if (['text', 'bullet_point', 'quote', 'author', 'context'].includes(el.element_type)) {
          const props = el.properties || {};
          return { ...el, properties: { ...props, fill: primaryColor } };
        }
        return el;
      });
    }
  };

  const handlePaletteClick = (palette: string[]) => {
    const theme = paletteToTheme(palette);
    const contrastText = getContrastingTextColor(palette[0], palette[1]);
    const updatedTheme = {
      ...theme,
      primaryColor: contrastText,
      titleColor: contrastText,
      backgroundColor: palette[0],
      artPalette: [palette[1], palette[3] || palette[1], palette[1], palette[0], palette[0]],
    };

    setSelectedTheme(updatedTheme);
    localStorage.setItem("slidesTheme", JSON.stringify(updatedTheme));

    const updatedSlides = slides.map((slide: any) => {
      const newSlide = structuredClone(slide);
      updateContent(newSlide, contrastText);
      if (newSlide.layouts) {
        newSlide.layouts.forEach((layout: any) => updateContent(layout, contrastText));
      }
      return newSlide;
    });
    setSlides(updatedSlides);
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
    localStorage.setItem("slidesTheme", JSON.stringify(updatedDefaultTheme));

    const updatedSlides = slides.map((slide: any) => {
      const newSlide = structuredClone(slide);
      updateContent(newSlide, contrastText);
      if (newSlide.layouts) {
        newSlide.layouts.forEach((layout: any) => updateContent(layout, contrastText));
      }
      return newSlide;
    });
    setSlides(updatedSlides);
  };

  const selectedPaletteIdx = palettes.findIndex(
    (p) =>
      selectedTheme &&
      p[0] === selectedTheme.backgroundColor &&
      getContrastingTextColor(p[0], p[1]) === selectedTheme.primaryColor
  );

  return (
    <Box
      sx={{
        width: "90%",
        maxWidth: 400,
        bgcolor: "white",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        bottom: "10px",
        left: "50%",
        transform: "translateX(-50%)",
        borderRadius: "16px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
        zIndex: 1300,
        maxHeight: "80vh",
        overflow: "hidden"
      }}
    >
      <Box sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f0f0f0" }}>
        <Typography sx={{ fontWeight: 700, fontSize: 18 }}>Theme & Layout</Typography>
        <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
      </Box>

      <Box sx={{ p: 2, overflowY: "auto", flex: 1 }}>
        <Typography sx={{ fontWeight: 600, fontSize: 14, mb: 1.5, color: "#666" }}>Palettes</Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mb: 3 }}>
          {palettes.map((palette, i) => (
            <Box
              key={i}
              onClick={() => handlePaletteClick(palette)}
              sx={{
                p: "4px",
                borderRadius: "50%",
                border: selectedPaletteIdx === i ? "2px solid #7B4AE2" : "2px solid transparent",
                transition: "all 0.2s"
              }}
            >
              <PaletteStack colors={palette} size={36} />
            </Box>
          ))}
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Typography sx={{ fontWeight: 600, fontSize: 14, mb: 1.5, color: "#666" }}>Layouts</Typography>
        {selectedSlideIndex >= 0 && currentVariants.length > 0 ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {currentVariants.map((variant, i) => (
              <LiveLayoutPreview
                key={`variant-${i}`}
                variant={variant}
                theme={selectedTheme}
                isSelected={localVariantIndex === i}
                onClick={() => applyVariant(i)}
                size={{ width: 340, height: 191 }}
              />
            ))}
          </Box>
        ) : (
          <Box sx={{ py: 4, textAlign: "center", color: "#999" }}>
            <Typography variant="body2">Select a slide to see layouts</Typography>
          </Box>
        )}
      </Box>

      <Box sx={{ p: 2, bgcolor: "#fafafa" }}>
        <Button
          fullWidth
          variant="contained"
          onClick={handleReset}
          sx={{
            py: 1.2,
            borderRadius: "12px",
            bgcolor: "#7B4AE2",
            textTransform: "none",
            fontWeight: 600,
            "&:hover": { bgcolor: "#5F2EEA" }
          }}
        >
          Reset Theme
        </Button>
      </Box>
    </Box>
  );
};

export default ThemePanelMobile;