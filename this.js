import React, { useRef, useState, useEffect } from "react";
import { Box, Button, Divider, MenuItem, Select, Typography, IconButton, Snackbar, Alert } from "@mui/material";
import { useSlideThemeContext } from "@/app/context/ThemeContext";
import { ChromePicker } from "react-color";
import Popover from "@mui/material/Popover";
import { useSlides } from "@/app/context/SlidesContext";
import LayoutVariantPreview from "./LayoutVariantPreview";
import { generateSlideVariants } from "../../utils/variantGenerator"; // ✅ Import from shared utility

// ... (PaletteStack, palettes, helper functions remain the same) ...

const ThemePanel = () => {
  const { selectedTheme, setSelectedTheme } = useSlideThemeContext();
  const { slides, setSlides, selectedSlideIndex } = useSlides();
  
  const [backgroundMode, setBackgroundMode] = useState<"color" | "image">("color");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [quotaError, setQuotaError] = useState(false);
  const [colorPickerAnchor, setColorPickerAnchor] = useState<null | HTMLElement>(null);
  const [currentVariants, setCurrentVariants] = useState<any[]>([]);
  
  const backgroundStateRef = useRef<{ mode: "color" | "image"; value: string }>({
    mode: "color",
    value: "#fff",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ✅ CRITICAL FIX: Update variants when slide OR theme changes
  useEffect(() => {
    if (selectedSlideIndex >= 0 && slides[selectedSlideIndex]) {
      const currentSlide = slides[selectedSlideIndex];
      
      // If layouts exist and theme hasn't changed, use them
      if (currentSlide.layouts && currentSlide.layouts.length > 0) {
        console.log('[ThemePanel] Using existing layouts from slide');
        setCurrentVariants(currentSlide.layouts);
      } else {
        // Generate fresh layouts if they don't exist
        console.log('[ThemePanel] Generating fresh layouts for slide');
        const freshLayouts = generateSlideVariants(currentSlide, selectedTheme);
        setCurrentVariants(freshLayouts);
      }
    } else {
      setCurrentVariants([]);
    }
  }, [selectedSlideIndex, slides, selectedTheme]); // ✅ Watch all three

  const applyVariant = (variantIndex: number) => {
    if (selectedSlideIndex < 0 || !currentVariants[variantIndex]) return;

    console.log('[ThemePanel] Applying variant', variantIndex, 'with theme:', selectedTheme?.backgroundColor);

    const updatedSlides = structuredClone(slides);
    const originalSlide = structuredClone(updatedSlides[selectedSlideIndex]);
    const currentSlide = updatedSlides[selectedSlideIndex];
    const selectedVariant = currentVariants[variantIndex];

    // Set variant index
    currentSlide.currentVariantIndex = variantIndex;

    // Update slide_title
    if (selectedVariant.slide_title) {
      currentSlide.slide_title = structuredClone(selectedVariant.slide_title);
    }

    // Update subtitle
    if (selectedVariant.subtitle) {
      currentSlide.subtitle = structuredClone(selectedVariant.subtitle);
    } else if (originalSlide.subtitle && !currentSlide.subtitle) {
      currentSlide.subtitle = structuredClone(originalSlide.subtitle);
      if (!currentSlide.subtitle.konva_component) {
        currentSlide.subtitle.konva_component = "Text";
        currentSlide.subtitle.properties = {
          x: 80, y: 320, width: 800, height: 80, fontSize: 26,
          fontFamily: "Raleway, sans-serif", fontWeight: "400",
          fill: selectedTheme?.primaryColor || "#000", 
          align: "center", lineHeight: 1.5
        };
      }
    }
    
    // ✅ CRITICAL: Apply background from variant (already has theme colors)
    if (selectedVariant.background) {
      currentSlide.background = structuredClone(selectedVariant.background);
      console.log('[ThemePanel] Applied variant background:', currentSlide.background);
    } else if (originalSlide.background) {
      currentSlide.background = structuredClone(originalSlide.background);
    } else {
      currentSlide.background = {
        type: "solid",
        color: selectedTheme?.backgroundColor || "#ffffff"
      };
    }
    
    // Update elements
    if (selectedVariant.elements) {
      const variantShapes = selectedVariant.elements.filter(
        (el: any) => el.element_type === "shape"
      );
      const originalNonShapes = originalSlide.elements?.filter(
        (el: any) => el.element_type !== "shape"
      ) || [];
      
      currentSlide.elements = [...variantShapes, ...originalNonShapes];
    } else if (originalSlide.elements) {
      currentSlide.elements = structuredClone(originalSlide.elements);
    }
    
    if (selectedVariant.image_url !== undefined) {
      currentSlide.image_url = selectedVariant.image_url;
    }
    if (selectedVariant.image_placeholder) {
      currentSlide.image_placeholder = structuredClone(selectedVariant.image_placeholder);
    }

    Object.keys(selectedVariant).forEach(key => {
      if (!['slide_title', 'subtitle', 'elements', 'background', 'image_url', 'image_placeholder', 'name'].includes(key)) {
        currentSlide[key] = structuredClone(selectedVariant[key]);
      }
    });

    setSlides(updatedSlides);
    
    try {
      localStorage.setItem(`slide-variant-${selectedSlideIndex}`, String(variantIndex));
    } catch (e) {
      console.error("Failed to save variant selection", e);
    }
    
    console.log('✅ [ThemePanel] Variant applied. Background:', currentSlide.background);
  };

  // ... (rest of ThemePanel functions remain the same) ...
  
  return (
    // ... (JSX remains the same) ...
  );
};

export default ThemePanel;