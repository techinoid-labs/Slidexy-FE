"use client";
import React from "react";
import { v4 as uuidv4 } from "uuid";
import { useTheme, useMediaQuery } from "@mui/material";
import {
  Box,
  Button,
  Divider,
  MenuItem,
  Select,
  Typography,
  IconButton,
  Slider,
  InputBase,
} from "@mui/material";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import { useSlides } from "@/app/context/SlidesContext";
import { getContrastTextColor } from "@/utils/colorUtils";
import { PANEL } from "./panelTheme";

const fontOptions = ["Raleway", "Roboto", "Arial", "Inter", "Playfair Display", "Montserrat", "Outfit"];

const weightOptions = [
  { label: "Regular", value: "normal" },
  { label: "Italic", value: "italic" },
  { label: "Bold", value: "bold" },
];

interface TextSettingsPanelProps {
  sidebarHeight?: string | number;
  resetAll?: () => void;
}

const TextSettingsPanel: React.FC<TextSettingsPanelProps> = ({
  sidebarHeight = "100vh",
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  if (isMobile) return null;

  const {
    slides,
    selectedSlideIndex,
    selectedTextId,
    selectedTextIndex,
    setSelectedTextId,
    setSlides,
  } = useSlides();

  const [detectedFont, setDetectedFont] = React.useState<string | null>(null);

  React.useEffect(() => {
    setDetectedFont(null); // Reset immediately to prevent flickering of old font
    if (selectedTextId) {
      const timer = setTimeout(() => {
        const el = document.getElementById(selectedTextId);
        if (el) {
          const style = window.getComputedStyle(el);
          // Handle complex font stacks and Next.js font class names
          const font = style.fontFamily.split(',')[0].replace(/['"]/g, '').trim();

          // If it's a Next.js font like __Raleway_123456, normalize it
          let normalizedFont = font;
          if (font.includes('Raleway')) normalizedFont = 'Raleway';
          else if (font.includes('Roboto')) normalizedFont = 'Roboto';
          else if (font.includes('Inter')) normalizedFont = 'Inter';
          else if (font.includes('Playfair')) normalizedFont = 'Playfair Display';
          else if (font.includes('Montserrat')) normalizedFont = 'Montserrat';
          else if (font.includes('Outfit')) normalizedFont = 'Outfit';

          setDetectedFont(normalizedFont);
        }
      }, 100); // Increased timeout to ensure DOM is ready
      return () => clearTimeout(timer);
    }
  }, [selectedTextId]);

  // ✅ FIX: Enhanced ID parsing to allow suffixes like -metric or -desc
  const parsed = selectedTextId
    ? selectedTextId.match(/^(title|subtitle|quote|author|context|el|text|user-text)-(\d+)(?:-(\d+))?(?:-.*)?$/)
    : null;

  const slideIndex = parsed ? parseInt(parsed[2], 10) : selectedSlideIndex;
  // Use parsed index or context fallback index
  let elementIndex = parsed?.[3] ? parseInt(parsed[3], 10) : selectedTextIndex;

  // ✅ FIX: Get text object from current variant slide
  let textObj: any = null;
  let currentSlide: any = null;

  if (slideIndex !== -1 && slides[slideIndex]) {
    const originalSlide = slides[slideIndex];

    const getCurrentVariantSlide = (slide: any) => {
      if (!slide.layouts || slide.layouts.length === 0) {
        return slide;
      }
      const variantIndex = slide.currentVariantIndex ?? 0;
      const variant = slide.layouts[variantIndex];
      return variant || slide;
    };

    currentSlide = getCurrentVariantSlide(originalSlide);

    // 1. Try finding by explicit ID first (most robust for UUIDs)
    if (selectedTextId) {
      const allElements = [
        ...(currentSlide.elements || []),
        ...(originalSlide.elements || [])
      ];

      const found = allElements.find((el: any) =>
        el.id === selectedTextId ||
        el.properties?.id === selectedTextId ||
        el.properties?.text_id === selectedTextId ||
        el.shape_id === selectedTextId ||
        el.properties?.shape_id === selectedTextId
      );

      if (found) {
        textObj = found;
        if (elementIndex === null) {
          const idx = currentSlide.elements?.indexOf(found);
          if (idx !== -1 && idx !== undefined) elementIndex = idx;
        }
      }
    }

    // 2. Fallback to parsing-based logic if not found by ID
    if (!textObj) {
      if (selectedTextId?.startsWith("title") || selectedTextId?.startsWith("quote")) {
        textObj = currentSlide.slide_title || { properties: {}, konva_component: "Konva.Text", element_type: "text" };
      } else if (selectedTextId?.startsWith("subtitle") || selectedTextId?.startsWith("author")) {
        textObj = currentSlide.subtitle || { properties: {}, konva_component: "Konva.Text", element_type: "text" };
      } else if (selectedTextId?.startsWith("context")) {
        const existing = (currentSlide.elements || []).find((el: any) => el.element_type === 'context');
        textObj = existing || { properties: {}, konva_component: "Konva.Text", element_type: "text", text: currentSlide.context || "" };
      } else if (elementIndex !== null) {
        const variantElements = currentSlide.elements || [];
        if (elementIndex < variantElements.length) {
          textObj = variantElements[elementIndex];
        } else {
          const userIndex = elementIndex - variantElements.length;
          const userElements = originalSlide.elements || [];
          if (userIndex >= 0 && userIndex < userElements.length) {
            textObj = userElements[userIndex];
          }
        }
      }
    }
  }

  const hasValidText = !!textObj;

  const displayText = textObj?.text || (
    selectedTextId?.startsWith("quote") ? currentSlide?.quote :
      selectedTextId?.startsWith("author") ? currentSlide?.author :
        selectedTextId?.startsWith("context") ? currentSlide?.context :
          ""
  ) || "";
  const rawProps = textObj?.properties || {};

  const fontSize = rawProps.fontSize ?? 24;
  const fontFamily = detectedFont || (fontOptions.includes(rawProps.fontFamily)
    ? rawProps.fontFamily
    : "Raleway");
  const selectedTheme = slides[selectedSlideIndex]?.theme || null;
  // Update the fill variable definition:
  const fill = rawProps.fill ?? (textObj?.useThemeColor !== false
    ? getContrastTextColor(selectedTheme?.backgroundColor || "#ffffff")
    : "#000000");
  // Check fontStyle for italic, otherwise use fontWeight


  const fontWeight = rawProps.fontStyle === "italic"
    ? "italic"
    : (weightOptions.some((w) => w.value === rawProps.fontWeight)
      ? rawProps.fontWeight
      : "normal");



  const align = rawProps.align ?? "left";
  const opacity = rawProps.opacity ?? 1;

  // ✅ FIX: Update multiple text properties in one go to avoid race conditions
  const updateTextProperties = (updates: Record<string, any>) => {
    if (!textObj || slideIndex === -1) return;

    const updatedSlides = structuredClone(slides);
    const originalSlide = updatedSlides[slideIndex];

    const isTitle = selectedTextId?.startsWith("title") || selectedTextId?.startsWith("quote");
    const isSubtitle = selectedTextId?.startsWith("subtitle") || selectedTextId?.startsWith("author");
    const isContext = selectedTextId?.startsWith("context");

    const applyUpdates = (target: any) => {
      if (!target) return;
      target.properties = target.properties || {};
      Object.entries(updates).forEach(([p, v]) => {
        target.properties[p] = v;
      });
    };

    // Update original slide
    if (isTitle) {
      originalSlide.slide_title = originalSlide.slide_title || { properties: {}, konva_component: "Konva.Text", element_type: "text" };
      applyUpdates(originalSlide.slide_title);
    } else if (isSubtitle) {
      originalSlide.subtitle = originalSlide.subtitle || { properties: {}, konva_component: "Konva.Text", element_type: "text" };
      applyUpdates(originalSlide.subtitle);
    } else if (isContext) {
      const idx = originalSlide.elements?.findIndex((el: any) => el.element_type === 'context');
      if (idx !== undefined && idx >= 0) {
        applyUpdates(originalSlide.elements[idx]);
      } else {
        // Create context element if it doesn't exist
        originalSlide.elements = originalSlide.elements || [];
        originalSlide.elements.push({
          element_type: 'context',
          text: originalSlide.context || "",
          properties: updates,
          konva_component: "Konva.Text"
        });
      }
    } else if (selectedTextId) {
      // ✅ FIX: Find and update ALL elements with this ID (handles mirrored elements)
      const targets: any[] = [];

      // Look in top-level elements
      if (originalSlide.elements) {
        originalSlide.elements.forEach((el: any) => {
          if (el.id === selectedTextId || el.properties?.id === selectedTextId ||
            el.shape_id === selectedTextId || el.properties?.shape_id === selectedTextId) {
            targets.push(el);
          }
        });
      }

      // Look in ALL layouts/variants
      if (originalSlide.layouts) {
        originalSlide.layouts.forEach((layout: any) => {
          if (layout.elements) {
            layout.elements.forEach((el: any) => {
              if (el.id === selectedTextId || el.properties?.id === selectedTextId ||
                el.shape_id === selectedTextId || el.properties?.shape_id === selectedTextId) {
                targets.push(el);
              }
            });
          }
        });
      }

      if (targets.length > 0) {
        targets.forEach(t => applyUpdates(t));
      } else if (elementIndex !== null) {
        // Fallback to index if ID search fails (backward compatibility)
        const variantElements = (originalSlide.layouts?.[originalSlide.currentVariantIndex ?? 0]?.elements) || [];
        if (elementIndex < variantElements.length) {
          applyUpdates(variantElements[elementIndex]);
        } else {
          const userIndex = elementIndex - variantElements.length;
          const userElements = originalSlide.elements || [];
          if (userIndex >= 0 && userIndex < userElements.length) {
            applyUpdates(userElements[userIndex]);
          }
        }
      }
    }

    // Update current variant
    if (originalSlide.layouts && originalSlide.layouts.length > 0) {
      const variantIndex = originalSlide.currentVariantIndex ?? 0;
      const variant = originalSlide.layouts[variantIndex];
      if (variant) {
        if (isTitle) {
          variant.slide_title = variant.slide_title || { properties: {}, konva_component: "Konva.Text", element_type: "text" };
          applyUpdates(variant.slide_title);
        } else if (isSubtitle) {
          variant.subtitle = variant.subtitle || { properties: {}, konva_component: "Konva.Text", element_type: "text" };
          applyUpdates(variant.subtitle);
        } else if (isContext) {
          const vIdx = variant.elements?.findIndex((el: any) => el.element_type === 'context');
          if (vIdx !== undefined && vIdx >= 0) {
            applyUpdates(variant.elements[vIdx]);
          } else {
            variant.elements = variant.elements || [];
            variant.elements.push({
              element_type: 'context',
              text: variant.context || originalSlide.context || "",
              properties: updates,
              konva_component: "Konva.Text"
            });
          }
        }
      }
    }

    setSlides(updatedSlides);
  };

  // ✅ FIX: Update text property in both original and variant
  const updateTextProperty = (prop: string, value: any) => {
    updateTextProperties({ [prop]: value });
  };

  // ✅ FIX: Update text content in both original and variant
  const updateTextContent = (value: string) => {
    if (!textObj || slideIndex === -1) return;

    const updatedSlides = structuredClone(slides);
    const originalSlide = updatedSlides[slideIndex];

    const isTitle = selectedTextId?.startsWith("title") || selectedTextId?.startsWith("quote");
    const isSubtitle = selectedTextId?.startsWith("subtitle") || selectedTextId?.startsWith("author");
    const isContext = selectedTextId?.startsWith("context");

    // Update original
    if (isTitle) {
      originalSlide.slide_title = originalSlide.slide_title || { properties: {}, konva_component: "Konva.Text", element_type: "text" };
      originalSlide.slide_title.text = value;
    } else if (isSubtitle) {
      originalSlide.subtitle = originalSlide.subtitle || { properties: {}, konva_component: "Konva.Text", element_type: "text" };
      originalSlide.subtitle.text = value;
    } else if (isContext) {
      const idx = originalSlide.elements?.findIndex((el: any) => el.element_type === 'context');
      if (idx !== undefined && idx >= 0) {
        originalSlide.elements[idx].text = value;
      } else {
        // Create context element if it doesn't exist
        originalSlide.elements = originalSlide.elements || [];
        originalSlide.elements.push({
          element_type: 'context',
          text: value,
          properties: {},
          konva_component: "Konva.Text"
        });
      }
    } else if (selectedTextId) {
      const targets: any[] = [];

      if (originalSlide.elements) {
        originalSlide.elements.forEach((el: any) => {
          if (el.id === selectedTextId || el.properties?.id === selectedTextId ||
            el.shape_id === selectedTextId || el.properties?.shape_id === selectedTextId) {
            targets.push(el);
          }
        });
      }

      if (originalSlide.layouts) {
        originalSlide.layouts.forEach((layout: any) => {
          if (layout.elements) {
            layout.elements.forEach((el: any) => {
              if (el.id === selectedTextId || el.properties?.id === selectedTextId ||
                el.shape_id === selectedTextId || el.properties?.shape_id === selectedTextId) {
                targets.push(el);
              }
            });
          }
        });
      }

      if (targets.length > 0) {
        targets.forEach(t => t.text = value);
      } else if (elementIndex !== null) {
        const variantElements = (originalSlide.layouts?.[originalSlide.currentVariantIndex ?? 0]?.elements) || [];
        if (elementIndex < variantElements.length) {
          variantElements[elementIndex].text = value;
        } else {
          const userIndex = elementIndex - variantElements.length;
          const userElements = originalSlide.elements || [];
          if (userIndex >= 0 && userIndex < userElements.length) {
            userElements[userIndex].text = value;
          }
        }
      }
    }

    // Update current variant (if exists)
    if (originalSlide.layouts && originalSlide.layouts.length > 0) {
      const variantIndex = originalSlide.currentVariantIndex ?? 0;
      const variant = originalSlide.layouts[variantIndex];
      if (variant) {
        if (isTitle) {
          variant.slide_title = variant.slide_title || { properties: {}, konva_component: "Konva.Text", element_type: "text" };
          variant.slide_title.text = value;
        } else if (isSubtitle) {
          variant.subtitle = variant.subtitle || { properties: {}, konva_component: "Konva.Text", element_type: "text" };
          variant.subtitle.text = value;
        } else if (isContext) {
          const vIdx = variant.elements?.findIndex((el: any) => el.element_type === 'context');
          if (vIdx !== undefined && vIdx >= 0) {
            variant.elements[vIdx].text = value;
          } else {
            variant.elements = variant.elements || [];
            variant.elements.push({
              element_type: 'context',
              text: value,
              properties: {},
              konva_component: "Konva.Text"
            });
          }
        }
      }
    }

    setSlides(updatedSlides);
  };

  // ✅ FIX: Update color and disable theme color
  const setTextFillAndDisableTheme = (color: string) => {
    if (slideIndex === -1) return;

    const updatedSlides = structuredClone(slides);
    const originalSlide = updatedSlides[slideIndex];

    const isTitle = selectedTextId?.startsWith("title") || selectedTextId?.startsWith("quote");
    const isSubtitle = selectedTextId?.startsWith("subtitle") || selectedTextId?.startsWith("author");
    const isContext = selectedTextId?.startsWith("context");

    // Update original
    let el = null;
    if (isTitle) {
      el = originalSlide.slide_title;
    } else if (isSubtitle) {
      el = originalSlide.subtitle;
    } else if (isContext) {
      el = originalSlide.elements?.find((e: any) => e.element_type === 'context');
    } else if (selectedTextId) {
      const targets: any[] = [];

      if (originalSlide.elements) {
        originalSlide.elements.forEach((el: any) => {
          if (el.id === selectedTextId || el.properties?.id === selectedTextId ||
            el.shape_id === selectedTextId || el.properties?.shape_id === selectedTextId) {
            targets.push(el);
          }
        });
      }

      if (originalSlide.layouts) {
        originalSlide.layouts.forEach((layout: any) => {
          if (layout.elements) {
            layout.elements.forEach((el: any) => {
              if (el.id === selectedTextId || el.properties?.id === selectedTextId ||
                el.shape_id === selectedTextId || el.properties?.shape_id === selectedTextId) {
                targets.push(el);
              }
            });
          }
        });
      }

      if (targets.length > 0) {
        targets.forEach(el => {
          el.properties = el.properties || {};
          el.properties.fill = color;
          el.useThemeColor = false;
        });
      } else if (elementIndex !== null) {
        const variantElements = (originalSlide.layouts?.[originalSlide.currentVariantIndex ?? 0]?.elements) || [];
        if (elementIndex < variantElements.length) {
          el = variantElements[elementIndex];
        } else {
          const userIndex = elementIndex - variantElements.length;
          const userElements = originalSlide.elements || [];
          if (userIndex >= 0 && userIndex < userElements.length) {
            el = userElements[userIndex];
          }
        }
        if (el) {
          el.properties = el.properties || {};
          el.properties.fill = color;
          el.useThemeColor = false;
        }
      }
    }

    if (!el && isContext) {
      // Create context if missing
      originalSlide.elements = originalSlide.elements || [];
      const newEl = {
        element_type: 'context',
        text: originalSlide.context || "",
        properties: { fill: color, userAdded: true },
        konva_component: "Konva.Text",
        useThemeColor: false
      };
      originalSlide.elements.push(newEl);
      el = newEl;
    }

    if (el) {
      el.properties = el.properties || {};
      el.properties.fill = color;
      el.useThemeColor = false;
    }

    // Update current variant (if exists)
    if (originalSlide.layouts && originalSlide.layouts.length > 0) {
      const variantIndex = originalSlide.currentVariantIndex ?? 0;
      const variant = originalSlide.layouts[variantIndex];
      if (variant) {
        let variantEl = null;
        if (isTitle) {
          variantEl = variant.slide_title;
        } else if (isSubtitle) {
          variantEl = variant.subtitle;
        } else if (isContext) {
          variantEl = variant.elements?.find((e: any) => e.element_type === 'context');
        } else if (elementIndex !== null) {
          const variantElements = variant.elements || [];
          if (elementIndex < variantElements.length) {
            variantEl = variantElements[elementIndex];
          } else {
            // For user elements, no variantEl
          }
        }

        if (!variantEl && isContext) {
          variant.elements = variant.elements || [];
          variantEl = {
            element_type: 'context',
            text: variant.context || originalSlide.context || "",
            properties: { fill: color, userAdded: true },
            konva_component: "Konva.Text",
            useThemeColor: false
          };
          variant.elements.push(variantEl);
        }

        if (variantEl) {
          variantEl.properties = variantEl.properties || {};
          variantEl.properties.fill = color;
          variantEl.useThemeColor = false;
        }
      }
    }

    setSlides(updatedSlides);
  };

  // ✅ FIX: Duplicate text properly
  const handleDuplicateText = () => {
    if (!textObj || slideIndex === -1) return;

    const updatedSlides = structuredClone(slides);
    const originalSlide = updatedSlides[slideIndex];

    const isTitle = selectedTextId?.startsWith("title") || selectedTextId?.startsWith("quote");
    const isSubtitle = selectedTextId?.startsWith("subtitle") || selectedTextId?.startsWith("author");
    const isContext = selectedTextId?.startsWith("context");

    const originalElement = textObj;

    if (!originalElement) return;

    // ✅ FIX: Generate new UUID for the duplicate to prevent duplicate key errors
    const newId = `user-text-${uuidv4()}`;

    // ✅ FIX: Create new text element with proper structure and mark as userAdded
    const newTextElement = {
      id: newId, // ✅ New unique ID
      konva_component: "Konva.Text",
      element_type: "text",
      text: originalElement.text || "",
      properties: {
        ...structuredClone(originalElement.properties || {}),
        id: newId, // ✅ Ensure properties also have the new unique ID
        userAdded: true, // ✅ Mark as user-added so UserElementsRenderer picks it up
        x: (originalElement.properties?.x || 100) + 30,
        y: (originalElement.properties?.y || 100) + 30,
        width: originalElement.properties?.width || 300,
        fontSize: originalElement.properties?.fontSize || 24,
        fontFamily: originalElement.properties?.fontFamily || "Roboto",
        fill: originalElement.properties?.fill || "#000000",
        fontWeight: originalElement.properties?.fontWeight || "normal",
        align: originalElement.properties?.align || "left",
      },
      useThemeColor: originalElement.useThemeColor !== undefined ? originalElement.useThemeColor : false,
    };

    // Update original: Add to elements array
    originalSlide.elements = originalSlide.elements || [];

    // Determine the actual insertion point in the original elements array
    // If it's a variant element, we want to insert it after its original counterpart
    const insertIndex = (isTitle || isSubtitle || isContext) ? 0 : (elementIndex !== null ? elementIndex + 1 : originalSlide.elements.length);
    originalSlide.elements.splice(insertIndex, 0, newTextElement);

    setSlides(updatedSlides);

    // Select the new duplicated element by its NEW ID
    setSelectedTextId(newId);
  };

  // ✅ FIX: Delete text properly
  const handleDeleteText = () => {
    if (slideIndex === -1) return;

    const updatedSlides = structuredClone(slides);
    const originalSlide = updatedSlides[slideIndex];

    const isTitle = selectedTextId?.startsWith("title") || selectedTextId?.startsWith("quote");
    const isSubtitle = selectedTextId?.startsWith("subtitle") || selectedTextId?.startsWith("author");
    const isContext = selectedTextId?.startsWith("context");

    // Update original
    if (isTitle) {
      originalSlide.slide_title = {
        konva_component: "Konva.Text",
        text: "",
        properties: {
          fontSize: 36,
          fontWeight: "700",
          fontFamily: "Raleway",
          fill: "#000",
          fontStyle: "normal",
          align: "center",
          x: 25,
          y: 40,
          width: 800,
          height: 0,
        },
        useThemeColor: true,
      };
    } else if (isSubtitle) {
      originalSlide.subtitle = undefined;
    } else if (isContext) {
      const idx = originalSlide.elements?.findIndex((el: any) => el.element_type === 'context');
      if (idx !== undefined && idx >= 0) {
        originalSlide.elements.splice(idx, 1);
      }
    } else if (selectedTextId) {
      // Find and delete by ID
      let deleted = false;
      if (originalSlide.elements) {
        const idx = originalSlide.elements.findIndex((el: any) =>
          el.id === selectedTextId || el.properties?.id === selectedTextId ||
          el.shape_id === selectedTextId || el.properties?.shape_id === selectedTextId
        );
        if (idx !== -1) {
          originalSlide.elements.splice(idx, 1);
          deleted = true;
        }
      }

      const variantIndex = originalSlide.currentVariantIndex ?? 0;
      const variant = originalSlide.layouts?.[variantIndex];
      if (!deleted && variant?.elements) {
        const vIdx = variant.elements.findIndex((el: any) =>
          el.id === selectedTextId || el.properties?.id === selectedTextId ||
          el.shape_id === selectedTextId || el.properties?.shape_id === selectedTextId
        );
        if (vIdx !== -1) {
          variant.elements.splice(vIdx, 1);
          deleted = true;
        }
      }

      // Final fallback to elementIndex if ID search failed
      if (!deleted && elementIndex !== null) {
        const variantElements = variant?.elements || [];
        if (elementIndex < variantElements.length) {
          variantElements.splice(elementIndex, 1);
        } else {
          const userIndex = elementIndex - variantElements.length;
          const userElements = originalSlide.elements || [];
          if (userIndex >= 0 && userIndex < userElements.length) {
            userElements.splice(userIndex, 1);
          }
        }
      }
    }

    // Update current variant (if exists)
    if (originalSlide.layouts && originalSlide.layouts.length > 0) {
      const variantIndex = originalSlide.currentVariantIndex ?? 0;
      const variant = originalSlide.layouts[variantIndex];
      if (variant) {
        if (isTitle) {
          variant.slide_title = structuredClone(originalSlide.slide_title);
        } else if (isSubtitle) {
          variant.subtitle = undefined;
        } else if (isContext) {
          const vIdx = variant.elements?.findIndex((el: any) => el.element_type === 'context');
          if (vIdx !== undefined && vIdx >= 0) {
            variant.elements.splice(vIdx, 1);
          }
        }
      }
    }

    setSlides(updatedSlides);
    setSelectedTextId(null);
  };

  return (
    <Box className="w-[300px] min-w-[250px] md:min-w-[250px] flex flex-col overflow-y-auto" sx={{ bgcolor: PANEL.surface, borderLeft: `1px solid ${PANEL.border}` }}>
      <Box sx={{ px: 3, mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3, mt: 3 }}>
          <Typography sx={{ fontWeight: 600, fontSize: 16, flex: 1, color: PANEL.text }}>
            Text Panel
          </Typography>
        </Box>

        <InputBase
          value={displayText}
          onChange={(e) => hasValidText && updateTextContent(e.target.value)}
          fullWidth
          disabled={!hasValidText}
          multiline
          sx={{
            mb: 1,
            borderRadius: 2,
            bgcolor: !hasValidText ? PANEL.surfaceHover : PANEL.surfaceSunken,
            color: PANEL.text,
            border: "1.5px solid transparent",
            fontWeight: 500,
            fontSize: 15,
            minHeight: 44,
            px: 2,
            py: 1.5,
            opacity: hasValidText ? 1 : 0.6,
            transition: "border-color 0.2s ease, box-shadow 0.2s ease",
            "&.Mui-focused": {
              borderColor: PANEL.accent,
              boxShadow: `0 0 0 4px ${PANEL.accentBg}`,
            },
          }}
        />

        <Select
          value={fontOptions.includes(fontFamily) ? fontFamily : (fontOptions.includes(detectedFont || "") ? detectedFont : "Raleway")}
          onChange={(e) => hasValidText && updateTextProperty("fontFamily", e.target.value)}
          fullWidth
          size="small"
          disabled={!hasValidText}
          sx={{
            mb: 1,
            borderRadius: 2,
            bgcolor: !hasValidText ? PANEL.surfaceHover : PANEL.surfaceSunken,
            color: PANEL.text,
            fontWeight: 500,
            fontSize: 15,
            height: 44,
            opacity: hasValidText ? 1 : 0.6,
            "& .MuiOutlinedInput-notchedOutline": { borderColor: PANEL.border },
            "& .MuiSvgIcon-root": { color: PANEL.textMuted },
          }}
        >
          {fontOptions.map((opt) => (
            <MenuItem key={opt} value={opt}>
              {opt}
            </MenuItem>
          ))}
          {detectedFont && !fontOptions.includes(detectedFont) && (
            <MenuItem key={detectedFont} value={detectedFont}>
              {detectedFont} (Detected)
            </MenuItem>
          )}
        </Select>

        <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
          <Select
            value={fontSize}
            onChange={(e) => hasValidText && updateTextProperty("fontSize", Number(e.target.value))}
            size="small"
            disabled={!hasValidText}
            sx={{
              borderRadius: 2,
              bgcolor: !hasValidText ? PANEL.surfaceHover : PANEL.surfaceSunken,
              color: PANEL.text,
              fontWeight: 500,
              fontSize: 15,
              width: 80,
              height: 44,
              opacity: hasValidText ? 1 : 0.6,
              "& .MuiOutlinedInput-notchedOutline": { borderColor: PANEL.border },
              "& .MuiSvgIcon-root": { color: PANEL.textMuted },
            }}
          >
            {[12, 14, 16, 18, 20, 24, 28, 32, 36, 42, 48].map((size) => (
              <MenuItem key={size} value={size}>
                {size}
              </MenuItem>
            ))}
          </Select>
          <Select
            value={fontWeight}
            onChange={(e) => {
              if (!hasValidText) return;
              const value = e.target.value;
              // ✅ FIX: Use updateTextProperties to apply both changes in one state update
              if (value === "italic") {
                updateTextProperties({
                  fontStyle: "italic",
                  fontWeight: "normal"
                });
              } else {
                updateTextProperties({
                  fontWeight: value,
                  fontStyle: "normal"
                });
              }
            }}
            size="small"
            disabled={!hasValidText}
            sx={{
              borderRadius: 2,
              bgcolor: !hasValidText ? PANEL.surfaceHover : PANEL.surfaceSunken,
              color: PANEL.text,
              fontWeight: 500,
              fontSize: 15,
              width: 120,
              height: 44,
              opacity: hasValidText ? 1 : 0.6,
              "& .MuiOutlinedInput-notchedOutline": { borderColor: PANEL.border },
              "& .MuiSvgIcon-root": { color: PANEL.textMuted },
            }}
          >
            {weightOptions.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </Box>

        <Box className="flex flex-wrap gap-x-2 gap-y-2 mb-2">
          {[
            FormatAlignLeftIcon,
            FormatAlignCenterIcon,
            FormatAlignRightIcon,
            FormatAlignJustifyIcon,
          ].map((Icon, i) => {
            const value = ["left", "center", "right", "justify"][i];
            return (
              <IconButton
                key={value}
                onClick={() => hasValidText && updateTextProperty("align", value)}
                disabled={!hasValidText}
                sx={{
                  borderRadius: "10px",
                  width: 44,
                  height: 44,
                  bgcolor: align === value ? PANEL.accentBg : PANEL.surfaceSunken,
                  color: align === value ? PANEL.accentSoft : PANEL.textMuted,
                  transition: "background-color 0.2s ease, transform 0.15s ease",
                  "&:hover": {
                    bgcolor: PANEL.accentBg,
                    transform: "scale(1.06)",
                  },
                }}
              >
                <Icon />
              </IconButton>
            );
          })}
        </Box>
      </Box>

      <Divider sx={{ my: 2, borderColor: PANEL.border }} />

      <Box sx={{ px: 3, mb: 2 }}>
        <Typography sx={{ fontWeight: 600, fontSize: 16, mb: 1, color: PANEL.text }}>
          Color
        </Typography>
        <Box className="flex items-center gap-2">
          <Box
            component="input"
            type="color"
            value={fill}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => hasValidText && setTextFillAndDisableTheme(e.target.value)}
            disabled={!hasValidText}
            sx={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              cursor: "pointer",
              border: `3px solid ${PANEL.surface}`,
              boxShadow: "0 0 0 1.5px rgba(142, 45, 226, 0.25), 0 4px 12px rgba(142, 45, 226, 0.15)",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              "&:hover": {
                transform: "scale(1.08)",
                boxShadow: `0 0 0 1.5px ${PANEL.accent}, 0 6px 16px rgba(142, 45, 226, 0.25)`,
              },
            }}
          />
        </Box>
      </Box>

      <Divider sx={{ my: 2, borderColor: PANEL.border }} />

      <Box sx={{ px: 2, mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Typography sx={{ fontWeight: 500, fontSize: 16, flex: 1, color: PANEL.text }}>
            Opacity
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Slider
            value={Math.round(opacity * 100)}
            onChange={(_, v) => hasValidText && updateTextProperty("opacity", Number(v) / 100)}
            disabled={!hasValidText}
            sx={{ color: PANEL.accent, flex: 1, fontSize: 12, opacity: hasValidText ? 1 : 0.6 }}
          />
          <InputBase
            value={`${Math.round(opacity * 100)}%`}
            readOnly
            sx={{
              width: 57,
              fontWeight: 500,
              fontSize: 12,
              color: PANEL.text,
              bgcolor: PANEL.surfaceSunken,
              borderRadius: 2,
              px: 1.5,
              py: 0.5,
              textAlign: "center",
            }}
          />
        </Box>
      </Box>

      <Divider sx={{ my: 2, borderColor: PANEL.border }} />

      <Box sx={{ px: 3, mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Typography sx={{ fontWeight: 600, fontSize: 16, flex: 1, color: PANEL.text }}>
            Actions
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={handleDuplicateText}
            disabled={!hasValidText}
            sx={{ flex: 1 }}
          >
            Duplicate
          </Button>
          <Button
            variant="outlined"
            size="small"
            color="error"
            onClick={handleDeleteText}
            disabled={!hasValidText}
            sx={{ flex: 1 }}
          >
            Delete
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default TextSettingsPanel;