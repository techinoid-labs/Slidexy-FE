"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { KonvaEventObject } from "konva/lib/Node";
import { Text, Transformer } from "react-konva";
import { Html } from "react-konva-utils";
import { Select, MenuItem } from "@mui/material";
import { useSlideThemeContext } from "@/app/context/ThemeContext";
import { useSlides } from "@/app/context/SlidesContext";
import { setSlides } from "@/app/slice/slidesSlice";
import { useDispatch } from "react-redux";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";

interface KonvaTextEditorProps {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize?: number;
  fontFamily?: string;
  fill?: string;
  fontStyle?: string;
  fontWeight?: string;
  align?: "left" | "center" | "right" | "justify";
  opacity?: number;
  width?: number;
  wrap?: "word" | "char";
  draggable?: boolean;
  isSelected: boolean;
  onSelect: () => void;
  verticalAlign?: string;
}

const fontOptions = ["Raleway", "Roboto", "Arial"];
const weightOptions = [
  { label: "Regular", value: "normal" },
  { label: "Semibold", value: "600" },
  { label: "Bold", value: "bold" },
];

const KonvaTextEditor: React.FC<KonvaTextEditorProps> = ({
  id,
  text,
  x,
  y,
  fontSize = 24,
  fontFamily = "Roboto",
  fill = "#000",
  fontStyle,
  fontWeight,
  verticalAlign = "start",
  align = "left",
  opacity = 1,
  width,
  wrap = "word",
  draggable = true,
  isSelected,
  onSelect,
}) => {
  const textRef = useRef<any>(null);
  const trRef = useRef<any>(null);
  const dispatch = useDispatch();
  const { selectedTheme } = useSlideThemeContext();
  const { slides } = useSlides();

  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(text);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipStyle, setTooltipStyle] = useState({ top: 0, left: 0 });
  const [currentFontSize, setCurrentFontSize] = useState(fontSize || 24);
  const [currentFontFamily, setCurrentFontFamily] = useState(fontFamily || "Roboto");
  const [currentFontWeight, setCurrentFontWeight] = useState(
    weightOptions.some((w) => w.value === fontWeight) ? fontWeight : "normal"
  );
  const [currentAlign, setCurrentAlign] = useState(align || "left");
  const [currentFontStyle, setCurrentFontStyle] = useState(fontStyle || "normal");

  const parsed = id.match(/(?:title|el)-(\d+)(?:-(\d+))?/);
  const slideIndex = parsed ? parseInt(parsed[1], 10) : -1;
  const elementIndex = parsed?.[2] ? parseInt(parsed[2], 10) : null;

  useEffect(() => {
    if (isSelected && textRef.current && trRef.current) {
      trRef.current.nodes([textRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  const updateSlides = (newText: string, newStyle: Partial<KonvaTextEditorProps> = {}) => {
    if (slideIndex === -1) return;

    const updatedSlides = structuredClone(slides);
    const slide = updatedSlides[slideIndex];

    const updateElement = (element: any) => ({
      ...element,
      text: newText,
      properties: { ...element.properties, ...newStyle },
    });

    if (id.startsWith("title")) {
      slide.slide_title = updateElement(slide.slide_title);
    } else if (elementIndex !== null && slide.elements[elementIndex]) {
      slide.elements[elementIndex] = updateElement(slide.elements[elementIndex]);
    }

    dispatch(setSlides(updatedSlides));
  };

  const commitEdit = useCallback(() => {
    if (inputValue.trim() !== text.trim()) {
      updateSlides(inputValue, {
        fontSize: currentFontSize,
        fontFamily: currentFontFamily,
        fontWeight: currentFontWeight,
        align: currentAlign,
        fontStyle: currentFontStyle,
      });
    }
    setIsEditing(false);
    setTooltipVisible(false);
  }, [inputValue, text, currentFontSize, currentFontFamily, currentFontWeight, currentAlign, currentFontStyle]);

  const handleDelete = useCallback(() => {
    if (slideIndex === -1) return;

    const updatedSlides = structuredClone(slides);
    const slide = updatedSlides[slideIndex];

    if (id.startsWith("title")) {
      slide.slide_title.text = "";
    } else if (elementIndex !== null && slide.elements[elementIndex]) {
      slide.elements.splice(elementIndex, 1);
    }

    dispatch(setSlides(updatedSlides));
    setIsEditing(false);
    setTooltipVisible(false);
  }, [slideIndex, elementIndex, slides, dispatch, id]);

  const handleTouchEnd = useCallback((e: KonvaEventObject<TouchEvent>) => {
    e.evt.preventDefault(); // Prevent default touch behavior
    if (!isEditing) {
      onSelect();
      setIsEditing(true);
      setTooltipVisible(true);
    }
  }, [onSelect, isEditing]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Delete" && !isEditing && isSelected) {
        e.preventDefault();
        handleDelete();
        return;
      }
      if (isEditing) {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          commitEdit();
        }
        if (e.key === "Escape") {
          setIsEditing(false);
          setTooltipVisible(false);
        }
      }
    },
    [isEditing, isSelected, handleDelete, commitEdit]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const handleStyleChange = (style: Partial<KonvaTextEditorProps>) => {
    let updatedFontSize = currentFontSize;
    let updatedFontFamily = currentFontFamily;
    let updatedFontWeight = currentFontWeight;
    let updatedFontStyle = currentFontStyle;
    let updatedAlign = currentAlign;

    if (style.fontSize !== undefined) updatedFontSize = style.fontSize;
    if (style.fontFamily !== undefined) updatedFontFamily = style.fontFamily;
    if (style.fontWeight !== undefined) updatedFontWeight = style.fontWeight;
    if (style.fontStyle !== undefined) updatedFontStyle = style.fontStyle;
    if (style.align !== undefined) updatedAlign = style.align;

    updateSlides(inputValue, {
      fontSize: updatedFontSize,
      fontFamily: updatedFontFamily,
      fontWeight: updatedFontWeight,
      fontStyle: updatedFontStyle,
      align: updatedAlign,
    });
    setCurrentFontSize(updatedFontSize);
    setCurrentFontFamily(updatedFontFamily);
    setCurrentFontWeight(updatedFontWeight);
    setCurrentFontStyle(updatedFontStyle);
    setCurrentAlign(updatedAlign);
    setTooltipVisible(true);
  };

  useEffect(() => {
    if (isEditing && textRef.current) {
      const rect = textRef.current.getClientRect();
      setTooltipStyle({
        top: rect.y - 60, // Adjusted for better mobile visibility
        left: Math.max(10, rect.x + rect.width / 2 - 150), // Ensure it stays on screen
      });
    }
  }, [isEditing, textRef.current]);

  return (
    <>
      <Text
        onClick={onSelect}
        onTap={onSelect}
        onTouchEnd={handleTouchEnd}
        ref={textRef}
        text={text}
        x={x}
        y={y}
        zIndex={999}
        fontSize={currentFontSize}
        fill={selectedTheme?.primaryColor || fill}
        verticalAlign={verticalAlign}
        fontFamily={currentFontFamily}
        fontStyle={fontStyle || (currentFontWeight ? "normal" : undefined)}
        fontWeight={currentFontWeight}
        align={currentAlign}
        opacity={opacity}
        width={width}
        wrap={wrap}
        draggable={draggable}
        visible={!isEditing}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          keepRatio={true}
          boundBoxFunc={(oldBox, newBox) => ({
            ...newBox,
            width: Math.max(30, newBox.width),
          })}
          enabledAnchors={["top-left", "top-right", "bottom-left", "bottom-right"]}
        />
      )}
      {isEditing && textRef.current && (
        <>
          <Html>
            <textarea
              autoFocus
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              style={{
                position: "absolute",
                top: textRef.current.absolutePosition().y,
                left: textRef.current.absolutePosition().x,
                fontSize: `${currentFontSize}px`,
                fontFamily: currentFontFamily,
                fontStyle: currentFontStyle,
                fontWeight: currentFontWeight,
                color: selectedTheme?.primaryColor || fill,
                background: "white",
                border: "1px solid #ccc",
                padding: "4px 8px",
                lineHeight: 1.2,
                width: `${width || 200}px`, // Default width for mobile
                zIndex: 1000, // Ensure textarea is above other elements
                boxSizing: "border-box",
              }}
              onBlur={commitEdit}
            />
          </Html>
          {tooltipVisible && (
            <Html>
              <div
                onClick={(e) => e.stopPropagation()} // Prevent click from closing the tooltip
                style={{
                  position: "absolute",
                  top: `${tooltipStyle.top}px`,
                  left: `${tooltipStyle.left}px`,
                  background: "#fff",
                  borderRadius: "10px",
                  padding: "8px 8px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  zIndex: 2001,
                  minWidth: "260px",
                  minHeight: "40px",
                  alignItems: "center",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                  overflow: "visible",
                }}
              >
                <div style={{ display: "flex", gap: "8px", width: "100%", alignItems: "center" }}>
                  {/* Font Family Dropdown */}
                  <Select
                    value={currentFontFamily}
                    onChange={(e) => handleStyleChange({ fontFamily: e.target.value })}
                    size="small"
                    style={{ minWidth: 80, fontSize: 14, background: "#F8F8FA", borderRadius: 6 }}
                    MenuProps={{
                      PaperProps: { style: { maxHeight: 200, zIndex: 2100 } },
                      disableScrollLock: true,
                    }}
                  >
                    {fontOptions.map((opt) => (
                      <MenuItem key={opt} value={opt} style={{ fontSize: 14 }}>
                        {opt}
                      </MenuItem>
                    ))}
                  </Select>
                  {/* Font Size Dropdown */}
                  <Select
                    value={currentFontSize}
                    onChange={(e) => handleStyleChange({ fontSize: Number(e.target.value) })}
                    size="small"
                    style={{ minWidth: 60, fontSize: 14, background: "#F8F8FA", borderRadius: 6 }}
                    MenuProps={{
                      PaperProps: { style: { maxHeight: 200, zIndex: 2100 } },
                      disableScrollLock: true,
                    }}
                  >
                    {[16, 18, 20, 24, 28, 32, 36].map((size) => (
                      <MenuItem key={size} value={size} style={{ fontSize: 14 }}>
                        {size}
                      </MenuItem>
                    ))}
                  </Select>
                  {/* Font Weight Dropdown */}
                  <Select
                    value={currentFontWeight}
                    onChange={(e) => handleStyleChange({ fontWeight: e.target.value })}
                    size="small"
                    style={{ minWidth: 70, fontSize: 14, background: "#F8F8FA", borderRadius: 6 }}
                    MenuProps={{
                      PaperProps: { style: { maxHeight: 200, zIndex: 2100 } },
                      disableScrollLock: true,
                    }}
                  >
                    {weightOptions.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value} style={{ fontSize: 14 }}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </Select>
                </div>
                <div style={{ display: "flex", gap: "6px", width: "100%", justifyContent: "center", marginTop: 4 }}>
                  {/* Horizontal Alignment */}
                  {[
                    { Icon: FormatAlignLeftIcon, value: "left" },
                    { Icon: FormatAlignCenterIcon, value: "center" },
                    { Icon: FormatAlignRightIcon, value: "right" },
                    { Icon: require("@mui/icons-material/FormatAlignJustify").default, value: "justify" },
                  ].map(({ Icon, value }) => (
                    <button
                      key={value}
                      onClick={() => handleStyleChange({ align: value })}
                      style={{
                        color: currentAlign === value ? "#7B4AE2" : "#222",
                        background: currentAlign === value ? "#F3EDFF" : "#F8F8FA",
                        border: "none",
                        borderRadius: 6,
                        fontSize: 18,
                        padding: "4px 6px",
                        cursor: "pointer",
                        outline: "none",
                        width: 32,
                        height: 32,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      title={`Align ${value.charAt(0).toUpperCase() + value.slice(1)}`}
                    >
                      <Icon fontSize="small" />
                    </button>
                  ))}
                  {/* Vertical Alignment */}
                  {[
                    { Icon: require("@mui/icons-material/VerticalAlignTop").default, value: "top" },
                    { Icon: require("@mui/icons-material/VerticalAlignCenter").default, value: "middle" },
                    { Icon: require("@mui/icons-material/VerticalAlignBottom").default, value: "bottom" },
                  ].map(({ Icon, value }) => (
                    <button
                      key={value}
                      onClick={() => handleStyleChange({ verticalAlign: value })}
                      style={{
                        color: (verticalAlign || "top") === value ? "#7B4AE2" : "#222",
                        background: (verticalAlign || "top") === value ? "#F3EDFF" : "#F8F8FA",
                        border: "none",
                        borderRadius: 6,
                        fontSize: 18,
                        padding: "4px 6px",
                        cursor: "pointer",
                        outline: "none",
                        width: 32,
                        height: 32,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      title={`Vertical Align ${value.charAt(0).toUpperCase() + value.slice(1)}`}
                    >
                      <Icon fontSize="small" />
                    </button>
                  ))}
                </div>
              </div>
            </Html>
          )}
        </>
      )}
    </>
  );
};

export default KonvaTextEditor;