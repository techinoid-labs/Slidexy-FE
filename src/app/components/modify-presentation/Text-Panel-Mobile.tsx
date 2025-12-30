"use client";

import React from "react";
import { useTheme, useMediaQuery } from "@mui/material";
import {
    Box,
    Divider,
    MenuItem,
    Select,
    Typography,
    IconButton,
    Slider,
    InputBase,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import VerticalAlignTopIcon from "@mui/icons-material/VerticalAlignTop";
import VerticalAlignBottomIcon from "@mui/icons-material/VerticalAlignBottom";
import VerticalAlignCenterIcon from "@mui/icons-material/VerticalAlignCenter";
import { useSlides } from "@/app/context/SlidesContext";
import { useSlideThemeContext } from "@/app/context/ThemeContext";

const fontOptions = ["Raleway", "Roboto", "Arial", "Inter"];

const weightOptions = [
    { label: "Regular", value: "normal" },
    { label: "Semibold", value: "600" },
    { label: "Bold", value: "bold" },
];

interface TextSettingsPanelProps {
    sidebarHeight?: string | number;
    resetAll?: () => void;
}

const TextSettingsPanelMobile: React.FC<TextSettingsPanelProps> = ({
    sidebarHeight = "100vh",
}) => {
    // Hard guard: never render on mobile
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    if (!isMobile) return null;

    const {
        slides,
        selectedTextId,
        setSelectedTextId,
        selectedSlideIndex,
        setSlides,
    } = useSlides();

    // ✅ FIX: Parse selectedTextId to handle title, subtitle, quote, author, context and elements
    const parsed = selectedTextId
        ? selectedTextId.match(/(?:title|subtitle|quote|author|context|el)-(\d+)(?:-(\d+))?/)
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

        // ✅ FIX: Handle title, subtitle, specialized IDs and regular elements
        if (selectedTextId?.startsWith("title") || selectedTextId?.startsWith("quote")) {
            textObj = currentSlide.slide_title || { properties: {}, konva_component: "Konva.Text", element_type: "text" };
            if (!textObj.text) textObj.text = currentSlide.quote || currentSlide.slide_title?.text || "";
        } else if (selectedTextId?.startsWith("subtitle") || selectedTextId?.startsWith("author")) {
            textObj = currentSlide.subtitle || { properties: {}, konva_component: "Konva.Text", element_type: "text" };
            if (!textObj.text) textObj.text = currentSlide.author || currentSlide.subtitle?.text || "";
        } else if (selectedTextId?.startsWith("context")) {
            const existing = currentSlide.elements?.find((el: any) => el.element_type === 'context');
            textObj = existing || { properties: {}, konva_component: "Konva.Text", element_type: "text", text: currentSlide.context || "" };
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
    const fill = rawProps.fill ?? (textObj?.useThemeColor !== false
        ? "#000000"
        : "#000000");
    const fontWeight = weightOptions.some((w) => w.value === rawProps.fontWeight)
        ? rawProps.fontWeight
        : "normal";
    const align = rawProps.align ?? "left";
    const opacity = rawProps.opacity ?? 1;
    const verticalAlign = rawProps.verticalAlign ?? "top";

    // ✅ FIX: Update text property in both original and variant
    const updateTextProperty = (prop: string, value: any) => {
        if (!textObj || slideIndex === -1) return;

        const updatedSlides = structuredClone(slides);
        const originalSlide = updatedSlides[slideIndex];

        const isTitle = selectedTextId?.startsWith("title") || selectedTextId?.startsWith("quote");
        const isSubtitle = selectedTextId?.startsWith("subtitle") || selectedTextId?.startsWith("author");
        const isContext = selectedTextId?.startsWith("context");

        // Update original slide
        if (isTitle) {
            originalSlide.slide_title = originalSlide.slide_title || { properties: {}, konva_component: "Konva.Text", element_type: "text" };
            originalSlide.slide_title.properties = originalSlide.slide_title.properties || {};
            originalSlide.slide_title.properties[prop] = value;
        } else if (isSubtitle) {
            originalSlide.subtitle = originalSlide.subtitle || { properties: {}, konva_component: "Konva.Text", element_type: "text" };
            originalSlide.subtitle.properties = originalSlide.subtitle.properties || {};
            originalSlide.subtitle.properties[prop] = value;
        } else if (isContext) {
            const idx = originalSlide.elements?.findIndex((el: any) => el.element_type === 'context');
            if (idx !== undefined && idx >= 0) {
                originalSlide.elements[idx].properties = originalSlide.elements[idx].properties || {};
                originalSlide.elements[idx].properties[prop] = value;
            } else {
                originalSlide.elements = originalSlide.elements || [];
                originalSlide.elements.push({
                    element_type: 'context',
                    text: originalSlide.context || "",
                    properties: { [prop]: value, userAdded: true },
                    konva_component: "Konva.Text"
                });
            }
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
                    variant.slide_title = variant.slide_title || { properties: {}, konva_component: "Konva.Text", element_type: "text" };
                    variant.slide_title.properties = variant.slide_title.properties || {};
                    variant.slide_title.properties[prop] = value;
                } else if (isSubtitle) {
                    variant.subtitle = variant.subtitle || { properties: {}, konva_component: "Konva.Text", element_type: "text" };
                    variant.subtitle.properties = variant.subtitle.properties || {};
                    variant.subtitle.properties[prop] = value;
                } else if (isContext) {
                    const vIdx = variant.elements?.findIndex((el: any) => el.element_type === 'context');
                    if (vIdx !== undefined && vIdx >= 0) {
                        variant.elements[vIdx].properties = variant.elements[vIdx].properties || {};
                        variant.elements[vIdx].properties[prop] = value;
                    } else {
                        variant.elements = variant.elements || [];
                        variant.elements.push({
                            element_type: 'context',
                            text: variant.context || originalSlide.context || "",
                            properties: { [prop]: value, userAdded: true },
                            konva_component: "Konva.Text"
                        });
                    }
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
                originalSlide.elements = originalSlide.elements || [];
                originalSlide.elements.push({
                    element_type: 'context',
                    text: value,
                    properties: { userAdded: true },
                    konva_component: "Konva.Text"
                });
            }
        } else if (elementIndex !== null && elementIndex >= 0 && originalSlide.elements?.[elementIndex]) {
            originalSlide.elements[elementIndex].text = value;
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
                            properties: { userAdded: true },
                            konva_component: "Konva.Text"
                        });
                    }
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

        const isTitle = selectedTextId?.startsWith("title") || selectedTextId?.startsWith("quote");
        const isSubtitle = selectedTextId?.startsWith("subtitle") || selectedTextId?.startsWith("author");
        const isContext = selectedTextId?.startsWith("context");

        // Update original
        let el = isTitle
            ? originalSlide.slide_title
            : isSubtitle
                ? originalSlide.subtitle
                : isContext
                    ? originalSlide.elements?.find((e: any) => e.element_type === 'context')
                    : (elementIndex !== null && elementIndex >= 0 ? originalSlide.elements?.[elementIndex] : null);

        if (!el && isContext) {
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
                if (isTitle) {
                    variant.slide_title = variant.slide_title || { properties: {}, konva_component: "Konva.Text", element_type: "text" };
                } else if (isSubtitle) {
                    variant.subtitle = variant.subtitle || { properties: {}, konva_component: "Konva.Text", element_type: "text" };
                }

                let variantEl = isTitle
                    ? variant.slide_title
                    : isSubtitle
                        ? variant.subtitle
                        : isContext
                            ? variant.elements?.find((e: any) => e.element_type === 'context')
                            : (elementIndex !== null && elementIndex >= 0 ? variant.elements?.[elementIndex] : null);

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

        const originalElement = isTitle
            ? originalSlide.slide_title
            : isSubtitle
                ? originalSlide.subtitle
                : isContext
                    ? originalSlide.elements?.find((e: any) => e.element_type === 'context')
                    : (elementIndex !== null && elementIndex >= 0 ? originalSlide.elements?.[elementIndex] : null);

        if (!originalElement && !isContext) return;

        // ✅ FIX: Create new text element with proper structure and mark as userAdded
        const newTextElement = {
            konva_component: "Konva.Text",
            element_type: "text",
            text: originalElement.text || "",
            properties: {
                ...structuredClone(originalElement.properties || {}),
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
        const insertIndex = (isTitle || isSubtitle || isContext) ? 0 : (elementIndex! + 1);
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
            if (idx !== undefined && idx >= 0) originalSlide.elements.splice(idx, 1);
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
                } else if (isContext) {
                    const vIdx = variant.elements?.findIndex((el: any) => el.element_type === 'context');
                    if (vIdx !== undefined && vIdx >= 0) variant.elements.splice(vIdx, 1);
                } else if (elementIndex !== null && elementIndex >= 0 && variant.elements) {
                    variant.elements.splice(elementIndex, 1);
                }
            }
        }

        setSlides(updatedSlides);
        setSelectedTextId(null);
    };

    return (
        <Box
            sx={{
                position: "fixed",
                bottom: 0,
                left: "8%",
                width: 350,
                height: 600,
                bgcolor: "#fff",
                border: "1px solid #E0E0E0",
                zIndex: 10,
                boxShadow: 3,
                display: "flex",
                flexDirection: "column",
                padding: "24px",
                borderTopLeftRadius: "16px",
                borderTopRightRadius: "16px",
                overflowY: "auto",
            }}
        >
            <Box className="w-[410px] min-w-[350px] md:min-w-[410px] bg-white flex flex-col overflow-y-auto border-r border-gray-200">
                {/* Tabs */}
                <Box sx={{ display: "flex", alignItems: "center", px: 2, pt: 2, pb: 1 }}>
                    {/* <Box
                        sx={{
                            bgcolor: "#F5F5F5",
                            color: "#222",
                            fontWeight: 600,
                            borderRadius: 2,
                            px: 2,
                            py: 1,
                            fontSize: 15,
                            mr: 1,
                        }}
                    >
                        Settings
                    </Box> */}
                    {/* <Box
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
                    </Box> */}
                    {/* <Box sx={{ flex: 1 }} />
                    <Select
                        value={50}
                        size="small"
                        sx={{
                            fontSize: 15,
                            bgcolor: "#F5F5F5",
                            borderRadius: 2,
                            width: 50,
                            height: 32,
                        }}
                        displayEmpty
                        inputProps={{ "aria-label": "Percentage" }}
                    >
                        <MenuItem value={50}>50%</MenuItem>
                        <MenuItem value={75}>75%</MenuItem>
                        <MenuItem value={100}>100%</MenuItem>
                    </Select> */}
                </Box>

                {/* 

                {/* Text */}
                <Box sx={{ px: 1, mb: 2, width: 300 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1, width: 20 }}>
                        <Typography sx={{ fontWeight: 600, fontSize: 16, flex: 1 }}>
                            Text
                        </Typography>
                        <IconButton size="small">

                        </IconButton>
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
                            bgcolor: hasValidText ? "#F8F8FA" : "#F0F0F0",
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
                            bgcolor: hasValidText ? "#F8F8FA" : "#F0F0F0",
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
                                bgcolor: hasValidText ? "#F8F8FA" : "#F0F0F0",
                                fontWeight: 500,
                                fontSize: 15,
                                width: 80,
                                height: 44,
                                opacity: hasValidText ? 1 : 0.6,
                            }}
                        >
                            {[16, 18, 20, 24, 28, 32, 36].map((size) => (
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
                                bgcolor: hasValidText ? "#F8F8FA" : "#F0F0F0",
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
                        <Box className="flex gap-1 bg-[#F8F8FA] rounded-md px-1 ml-2">
                            {[
                                VerticalAlignTopIcon,
                                VerticalAlignCenterIcon,
                                VerticalAlignBottomIcon,
                            ].map((Icon, i) => {
                                const value = ["top", "middle", "bottom"][i];
                                return (
                                    <IconButton
                                        key={value}
                                        onClick={() => hasValidText && updateTextProperty("verticalAlign", value)}
                                        disabled={!hasValidText}
                                        className={`w-9 h-9 rounded-md ${verticalAlign === value ? "bg-gray-300" : "bg-transparent"} ${!hasValidText ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        <Icon />
                                    </IconButton>
                                );
                            })}
                        </Box>
                    </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Color */}
                <Box sx={{ px: 3, mb: 2 }}>
                    <Typography sx={{ fontWeight: 600, fontSize: 16, mb: 1 }}>
                        Color
                    </Typography>
                    <Box className="w-12 h-12 rounded-full">
                        <input
                            type="color"
                            value={fill}
                            className="w-12 h-12 rounded-full"
                            onChange={(e) => setTextFillAndDisableTheme(e.target.value)}
                            disabled={!hasValidText}
                        />
                        <Typography sx={{ fontSize: 14 }}>{fill.toUpperCase()}</Typography>
                    </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Effects */}
                <Box sx={{ px: 3, mb: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                        <Typography sx={{ fontWeight: 600, fontSize: 16, flex: 1 }}>
                            Effects
                        </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, width: 250 }}>
                        <Slider
                            value={Math.round(opacity * 100)}
                            onChange={(_, v) => updateTextProperty("opacity", Number(v) / 100)}
                            sx={{ color: "#7B4AE2", flex: 1 }}
                        />
                        <InputBase
                            value={`${Math.round(opacity * 100)}%`}
                            readOnly
                            sx={{
                                width: 54,
                                fontWeight: 600,
                                fontSize: 16,
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

                {/* Actions */}
                <Box sx={{ px: 3, mb: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <Typography sx={{ fontWeight: 600, fontSize: 16, flex: 1 }}>
                            Actions
                        </Typography>
                    </Box>

                    <Box sx={{ display: "flex", gap: 2, width: 250 }}>
                        <Box
                            onClick={handleDuplicateText}
                            sx={{
                                flex: 1,
                                borderRadius: 2,
                                fontWeight: 600,
                                fontSize: 12,
                                py: 1.5,
                                textAlign: "center",
                                bgcolor: hasValidText ? "#F8F8FA" : "#F0F0F0",
                                border: "1px solid #E0E0E0",
                                color: "#222",
                                cursor: hasValidText ? "pointer" : "not-allowed",
                                opacity: hasValidText ? 1 : 0.6,
                                "&:hover": {
                                    bgcolor: hasValidText ? "#F3EDFF" : "#F8F8FA",
                                    borderColor: hasValidText ? "#7B4AE2" : "#E0E0E0",
                                    color: hasValidText ? "#7B4AE2" : "#222",
                                },
                            }}
                        >
                            Duplicate
                        </Box>
                        <Box
                            onClick={handleDeleteText}
                            sx={{
                                flex: 1,
                                borderRadius: 2,
                                fontWeight: 600,
                                fontSize: 12,
                                py: 1.5,
                                textAlign: "center",
                                bgcolor: hasValidText ? "#F8F8FA" : "#F0F0F0",
                                border: "1px solid #E0E0E0",
                                color: "#222",
                                cursor: hasValidText ? "pointer" : "not-allowed",
                                opacity: hasValidText ? 1 : 0.6,
                                "&:hover": {
                                    bgcolor: hasValidText ? "#FFF3F3" : "#F8F8FA",
                                    borderColor: hasValidText ? "#C00" : "#E0E0E0",
                                    color: hasValidText ? "#C00" : "#222",
                                },
                            }}
                        >
                            Delete
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default TextSettingsPanelMobile;
