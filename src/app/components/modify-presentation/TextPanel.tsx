"use client";
import React from "react";
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

const fontOptions = ["Raleway", "Roboto", "Arial"];

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
    selectedTextId,
    setSelectedTextId,
    selectedSlideIndex,
    setSlides,
  } = useSlides();

  // ✅ FIX: Parse selectedTextId to handle title, subtitle, and elements
  const parsed = selectedTextId
    ? selectedTextId.match(/(?:title|subtitle|el)-(\d+)(?:-(\d+))?/)
    : null;

  const slideIndex = parsed ? parseInt(parsed[1], 10) : selectedSlideIndex;
  const elementIndex = parsed?.[2] ? parseInt(parsed[2], 10) : null;

  // ✅ FIX: Get text object from current variant slide
  let textObj: any = null;
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

    const currentSlide = getCurrentVariantSlide(originalSlide);

    // ✅ FIX: Handle title, subtitle, and regular elements
    if (selectedTextId?.startsWith("title")) {
      textObj = currentSlide.slide_title;
    } else if (selectedTextId?.startsWith("subtitle")) {
      textObj = currentSlide.subtitle;
    } else if (elementIndex !== null && currentSlide.elements?.[elementIndex]) {
      textObj = currentSlide.elements[elementIndex];
    }
  }

  const hasValidText = !!textObj;
  const rawProps = textObj?.properties || {};

  const fontSize = rawProps.fontSize ?? 24;
  const fontFamily = fontOptions.includes(rawProps.fontFamily)
    ? rawProps.fontFamily
    : "Roboto";
  const selectedTheme = slides[selectedSlideIndex]?.theme || null;
  // Update the fill variable definition:
  const fill = rawProps.fill ?? (textObj?.useThemeColor !== false
    ? getContrastTextColor(selectedTheme?.backgroundColor || "#ffffff")
    : "#000000");
  const fontWeight = weightOptions.some((w) => w.value === rawProps.fontWeight)
    ? rawProps.fontWeight
    : "normal";
  const align = rawProps.align ?? "left";
  const opacity = rawProps.opacity ?? 1;

  // ✅ FIX: Update text property in both original and variant
  const updateTextProperty = (prop: string, value: any) => {
    if (!textObj || slideIndex === -1) return;

    const updatedSlides = structuredClone(slides);
    const originalSlide = updatedSlides[slideIndex];

    const isTitle = selectedTextId?.startsWith("title");
    const isSubtitle = selectedTextId?.startsWith("subtitle");

    // Update original slide
    if (isTitle) {
      originalSlide.slide_title = originalSlide.slide_title;
      originalSlide.slide_title.properties = originalSlide.slide_title.properties || {};
      originalSlide.slide_title.properties[prop] = value;
    } else if (isSubtitle) {
      originalSlide.subtitle = originalSlide.subtitle || {};
      originalSlide.subtitle.properties = originalSlide.subtitle.properties || {};
      originalSlide.subtitle.properties[prop] = value;
    } else if (elementIndex !== null && elementIndex >= 0 && originalSlide.elements?.[elementIndex]) {
      const el = originalSlide.elements[elementIndex];
      el.properties = el.properties || {};
      el.properties[prop] = value;
    }

    // Update current variant (if exists)
    if (originalSlide.layouts && originalSlide.layouts.length > 0) {
      const variantIndex = originalSlide.currentVariantIndex ?? 0;
      const variant = originalSlide.layouts[variantIndex];
      if (variant) {
        if (isTitle) {
          variant.slide_title = variant.slide_title;
          variant.slide_title.properties = variant.slide_title.properties || {};
          variant.slide_title.properties[prop] = value;
        } else if (isSubtitle) {
          variant.subtitle = variant.subtitle || {};
          variant.subtitle.properties = variant.subtitle.properties || {};
          variant.subtitle.properties[prop] = value;
        } else if (elementIndex !== null && elementIndex >= 0 && variant.elements?.[elementIndex]) {
          const variantEl = variant.elements[elementIndex];
          variantEl.properties = variantEl.properties || {};
          variantEl.properties[prop] = value;
        }
      }
    }

    setSlides(updatedSlides);
  };

  // ✅ FIX: Update text content in both original and variant
  const updateTextContent = (value: string) => {
    if (!textObj || slideIndex === -1) return;

    const updatedSlides = structuredClone(slides);
    const originalSlide = updatedSlides[slideIndex];

    const isTitle = selectedTextId?.startsWith("title");
    const isSubtitle = selectedTextId?.startsWith("subtitle");

    // Update original
    if (isTitle) {
      originalSlide.slide_title = originalSlide.slide_title;
      originalSlide.slide_title.text = value;
    } else if (isSubtitle) {
      originalSlide.subtitle = originalSlide.subtitle || {};
      originalSlide.subtitle.text = value;
    } else if (elementIndex !== null && elementIndex >= 0 && originalSlide.elements?.[elementIndex]) {
      originalSlide.elements[elementIndex].text = value;
    }

    // Update current variant (if exists)
    if (originalSlide.layouts && originalSlide.layouts.length > 0) {
      const variantIndex = originalSlide.currentVariantIndex ?? 0;
      const variant = originalSlide.layouts[variantIndex];
      if (variant) {
        if (isTitle) {
          variant.slide_title = variant.slide_title;
          variant.slide_title.text = value;
        } else if (isSubtitle) {
          variant.subtitle = variant.subtitle || {};
          variant.subtitle.text = value;
        } else if (elementIndex !== null && elementIndex >= 0 && variant.elements?.[elementIndex]) {
          variant.elements[elementIndex].text = value;
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

    const isTitle = selectedTextId?.startsWith("title");
    const isSubtitle = selectedTextId?.startsWith("subtitle");

    // Update original
    let el = isTitle
      ? originalSlide.slide_title
      : isSubtitle
        ? originalSlide.subtitle
        : (elementIndex !== null && elementIndex >= 0 ? originalSlide.elements?.[elementIndex] : null);

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
        let variantEl = isTitle
          ? variant.slide_title
          : isSubtitle
            ? variant.subtitle
            : (elementIndex !== null && elementIndex >= 0 ? variant.elements?.[elementIndex] : null);

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

    const isTitle = selectedTextId?.startsWith("title");
    const isSubtitle = selectedTextId?.startsWith("subtitle");

    const originalElement = isTitle
      ? originalSlide.slide_title
      : isSubtitle
        ? originalSlide.subtitle
        : (elementIndex !== null && elementIndex >= 0 ? originalSlide.elements?.[elementIndex] : null);

    if (!originalElement) return;

    // ✅ FIX: Create new text element with proper structure
    const newTextElement = {
      konva_component: "Konva.Text",
      element_type: "text",
      text: originalElement.text || "",
      properties: {
        ...structuredClone(originalElement.properties || {}),
        x: (originalElement.properties?.x || 0) + 20,
        y: (originalElement.properties?.y || 0) + 20,
      },
      useThemeColor: originalElement.useThemeColor !== undefined ? originalElement.useThemeColor : false,
    };

    // Update original: Add to elements array
    originalSlide.elements = originalSlide.elements || [];
    const insertIndex = (isTitle || isSubtitle) ? 0 : (elementIndex! + 1);
    originalSlide.elements.splice(insertIndex, 0, newTextElement);

    // Update current variant (if exists)
    if (originalSlide.layouts && originalSlide.layouts.length > 0) {
      const variantIndex = originalSlide.currentVariantIndex ?? 0;
      const variant = originalSlide.layouts[variantIndex];
      if (variant) {
        variant.elements = variant.elements || [];
        variant.elements.splice(insertIndex, 0, structuredClone(newTextElement));
      }
    }

    setSlides(updatedSlides);

    // Select the new duplicated element
    const newId = `el-${slideIndex}-${insertIndex}`;
    setSelectedTextId(newId);
  };

  // ✅ FIX: Delete text properly
  const handleDeleteText = () => {
    if (slideIndex === -1) return;

    const updatedSlides = structuredClone(slides);
    const originalSlide = updatedSlides[slideIndex];

    const isTitle = selectedTextId?.startsWith("title");
    const isSubtitle = selectedTextId?.startsWith("subtitle");

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
    } else if (elementIndex !== null && elementIndex >= 0 && originalSlide.elements) {
      originalSlide.elements.splice(elementIndex, 1);
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
        } else if (elementIndex !== null && elementIndex >= 0 && variant.elements) {
          variant.elements.splice(elementIndex, 1);
        }
      }
    }

    setSlides(updatedSlides);
    setSelectedTextId(null);
  };

  return (
    <Box className="w-[300px] min-w-[250px] md:min-w-[250px] bg-white flex flex-col overflow-y-auto border-r border-gray-200">
      <Box sx={{ px: 3, mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3, mt: 3 }}>
          <Typography sx={{ fontWeight: 600, fontSize: 16, flex: 1 }}>
            Text Panel
          </Typography>
        </Box>

        <InputBase
          value={textObj?.text ?? ""}
          onChange={(e) => hasValidText && updateTextContent(e.target.value)}
          fullWidth
          disabled={!hasValidText}
          multiline
          sx={{
            mb: 1,
            borderRadius: 2,
            bgcolor: !hasValidText ? "#F0F0F0" : "#F8F8FA",
            fontWeight: 500,
            fontSize: 15,
            minHeight: 44,
            px: 2,
            py: 1.5,
            opacity: hasValidText ? 1 : 0.6,
          }}
        />

        <Select
          value={fontFamily}
          onChange={(e) => hasValidText && updateTextProperty("fontFamily", e.target.value)}
          fullWidth
          size="small"
          disabled={!hasValidText}
          sx={{
            mb: 1,
            borderRadius: 2,
            bgcolor: !hasValidText ? "#F0F0F0" : "#F8F8FA",
            fontWeight: 500,
            fontSize: 15,
            height: 44,
            opacity: hasValidText ? 1 : 0.6,
          }}
        >
          {fontOptions.map((opt) => (
            <MenuItem key={opt} value={opt}>
              {opt}
            </MenuItem>
          ))}
        </Select>

        <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
          <Select
            value={fontSize}
            onChange={(e) => hasValidText && updateTextProperty("fontSize", Number(e.target.value))}
            size="small"
            disabled={!hasValidText}
            sx={{
              borderRadius: 2,
              bgcolor: !hasValidText ? "#F0F0F0" : "#F8F8FA",
              fontWeight: 500,
              fontSize: 15,
              width: 80,
              height: 44,
              opacity: hasValidText ? 1 : 0.6,
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
            onChange={(e) => hasValidText && updateTextProperty("fontWeight", e.target.value)}
            size="small"
            disabled={!hasValidText}
            sx={{
              borderRadius: 2,
              bgcolor: !hasValidText ? "#F0F0F0" : "#F8F8FA",
              fontWeight: 500,
              fontSize: 15,
              width: 120,
              height: 44,
              opacity: hasValidText ? 1 : 0.6,
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
                className={`rounded-md w-11 h-11 ${align === value ? "bg-gray-300" : "bg-[#F8F8FA]"} ${!hasValidText ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Icon />
              </IconButton>
            );
          })}
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ px: 3, mb: 2 }}>
        <Typography sx={{ fontWeight: 600, fontSize: 16, mb: 1 }}>
          Color
        </Typography>
        <Box className="flex items-center gap-2">
          <input
            type="color"
            value={fill}
            className="w-12 h-12 rounded-full cursor-pointer"
            onChange={(e) => hasValidText && setTextFillAndDisableTheme(e.target.value)}
            disabled={!hasValidText}
          />
          {/* <Typography sx={{ fontSize: 14, fontWeight: 500 }}>{fill.toUpperCase()}</Typography> */}
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ px: 2, mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Typography sx={{ fontWeight: 500, fontSize: 16, flex: 1 }}>
            Opacity
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Slider
            value={Math.round(opacity * 100)}
            onChange={(_, v) => hasValidText && updateTextProperty("opacity", Number(v) / 100)}
            disabled={!hasValidText}
            sx={{ color: "#7B4AE2", flex: 1, fontSize: 12, opacity: hasValidText ? 1 : 0.6 }}
          />
          <InputBase
            value={`${Math.round(opacity * 100)}%`}
            readOnly
            sx={{
              width: 57,
              fontWeight: 500,
              fontSize: 12,
              bgcolor: "#F8F8FA",
              borderRadius: 2,
              px: 1.5,
              py: 0.5,
              textAlign: "center",
            }}
          />
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ px: 3, mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Typography sx={{ fontWeight: 600, fontSize: 16, flex: 1 }}>
            Actions
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            onClick={handleDuplicateText}
            disabled={!hasValidText}
            sx={{
              borderRadius: 2,
              fontWeight: 600,
              fontSize: 12,
              bgcolor: "#F8F8FA",
              borderColor: "#E0E0E0",
              color: "#222",
              textTransform: "none",
              whiteSpace: "nowrap",
              flex: 1,
              opacity: hasValidText ? 1 : 0.6,
              "&:hover": {
                bgcolor: hasValidText ? "#F3EDFF" : "#F8F8FA",
                borderColor: hasValidText ? "#7B4AE2" : "#E0E0E0",
                color: hasValidText ? "#7B4AE2" : "#222",
              },
            }}
          >
            Duplicate
          </Button>
          <Button
            variant="outlined"
            onClick={handleDeleteText}
            disabled={!hasValidText}
            sx={{
              borderRadius: 2,
              fontWeight: 600,
              fontSize: 12,
              bgcolor: "#F8F8FA",
              borderColor: "#E0E0E0",
              color: "#222",
              textTransform: "none",
              whiteSpace: "nowrap",
              flex: 1,
              opacity: hasValidText ? 1 : 0.6,
              "&:hover": {
                bgcolor: hasValidText ? "#FFF3F3" : "#F8F8FA",
                borderColor: hasValidText ? "#C00" : "#E0E0E0",
                color: hasValidText ? "#C00" : "#222",
              },
            }}
          >
            Delete
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default TextSettingsPanel;