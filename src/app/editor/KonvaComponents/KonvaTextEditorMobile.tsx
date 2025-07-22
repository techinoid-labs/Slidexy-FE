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
  onClick?: (e: KonvaEventObject<MouseEvent>) => void; // Added onClick prop
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
  onClick, // Added to props destructuring
}) => {
  const textRef = useRef<any>(null);
  const trRef = useRef<any>(null);
  const dispatch = useDispatch();
  const { selectedTheme } = useSlideThemeContext();
  const { slides, setTooltip } = useSlides();

  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(text);
  const [currentFontSize, setCurrentFontSize] = useState(fontSize || 24);
  const [currentFontFamily, setCurrentFontFamily] = useState(
    fontFamily || "Roboto"
  );
  const [currentFontWeight, setCurrentFontWeight] = useState(
    weightOptions.some((w) => w.value === fontWeight) ? fontWeight : "normal"
  );
  const [currentAlign, setCurrentAlign] = useState(align || "left");
  const [currentFontStyle, setCurrentFontStyle] = useState(
    fontStyle || "normal"
  );

  const parsed = id.match(/(?:title|el)-(\d+)(?:-(\d+))?/);
  const slideIndex = parsed ? parseInt(parsed[1], 10) : -1;
  const elementIndex = parsed?.[2] ? parseInt(parsed[2], 10) : null;

  useEffect(() => {
    if (isSelected && textRef.current && trRef.current) {
      trRef.current.nodes([textRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  const updateSlides = (
    newText: string,
    newStyle: Partial<KonvaTextEditorProps> = {}
  ) => {
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
      slide.elements[elementIndex] = updateElement(
        slide.elements[elementIndex]
      );
    }

    dispatch(setSlides(updatedSlides));
  };

  const commitEdit = useCallback(() => {
    if (inputValue.trim() !== text.trim()) {
      updateSlides(inputValue, {
        fontSize: fontSize,
        fontFamily: fontFamily,
        fontWeight: fontWeight,
        align: align,
        fontStyle: fontStyle,
      });
    }
    setIsEditing(false);
  }, [
    inputValue,
    text,
    currentFontSize,
    currentFontFamily,
    currentFontWeight,
    currentAlign,
    currentFontStyle,
  ]);

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
  }, [slideIndex, elementIndex, slides, dispatch, id]);

  const handleTouchEnd = useCallback(
    (e: KonvaEventObject<TouchEvent>) => {
      e.evt.preventDefault(); // Prevent default touch behavior
      if (!isEditing) {
        onSelect();
        setIsEditing(true);
        const node = textRef.current;
        if (node) {
          const stage = node.getStage();
          const pos = node.absolutePosition();
          setTooltip({
            visible: true,
            x: pos.x,
            y: pos.y - 60,
            node,
          });
        }
      }
    },
    [onSelect, isEditing, setTooltip]
  );

  const handleClick = useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      if (!isEditing && onClick) {
        onClick(e); // Call the passed onClick handler
        onSelect(); // Ensure selection is updated
        const node = textRef.current;
        if (node) {
          const pos = node.absolutePosition();
          setTooltip({
            visible: true,
            x: pos.x,
            y: pos.y - 60,
            node,
          });
        }
      }
    },
    [onSelect, isEditing, onClick, setTooltip]
  );

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
    let updatedFontSize = fontSize;
    let updatedFontFamily = fontFamily;
    let updatedFontWeight = fontWeight;
    let updatedFontStyle = fontStyle;
    let updatedAlign = align;

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
    //setCurrentFontStyle(updatedFontStyle);
    setCurrentAlign(updatedAlign);
  };

  useEffect(() => {
    if (isEditing && textRef.current) {
      const rect = textRef.current.getClientRect();
    }
  }, [isEditing, textRef.current]);

  return (
    <>
      <Text
        onClick={handleClick} // Updated to use handleClick
        onTap={onSelect}
        onTouchEnd={handleTouchEnd}
        ref={textRef}
        text={text}
        x={x}
        y={y}
        zIndex={999}
        fontSize={fontSize}
        fill={selectedTheme?.primaryColor || fill}
        verticalAlign={verticalAlign}
        fontFamily={fontFamily}
        fontStyle={fontWeight} // Note: This might be a typo; should it be fontStyle?
        fontWeight={fontWeight}
        align={align}
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
          enabledAnchors={[
            "top-left",
            "top-right",
            "bottom-left",
            "bottom-right",
          ]}
        />
      )}
      {isEditing && textRef.current && (
        <Html>
          <textarea
            autoFocus
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            style={{
              position: "absolute",
              top: textRef.current.absolutePosition().y,
              left: textRef.current.absolutePosition().x,
              fontSize: `${fontSize}px`,
              fontFamily: fontFamily,
              fontStyle: fontStyle,
              fontWeight: fontWeight,
              color: selectedTheme?.primaryColor || fill,
              background: "white",
              border: "1px solid #ccc",
              padding: "2px 4px",
              lineHeight: 1.2,
              width: "250px", // Default width for mobile
              zIndex: 1000, // Ensure textarea is above other elements
              boxSizing: "border-box",
            }}
            onBlur={commitEdit}
          />
        </Html>
      )}
    </>
  );
};

export default KonvaTextEditor;