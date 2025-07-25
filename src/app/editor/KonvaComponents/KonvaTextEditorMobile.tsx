"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { KonvaEventObject } from "konva/lib/Node";
import { Text, Transformer } from "react-konva";
import { Html } from "react-konva-utils";
import { useSlideThemeContext } from "@/app/context/ThemeContext";
import { useSlides } from "@/app/context/SlidesContext";
import { useDispatch } from "react-redux";
import { setSlides } from "@/app/slice/slidesSlice";
import {
  constrainToCanvas,
  getSlideDimensions,
} from "../../../utils/slideUtilsmobile";

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
  height?: number;
  width?: number;
  wrap?: "word" | "char";
  draggable?: boolean;
  isSelected: boolean;
  onSelect: () => void;
  verticalAlign?: string;
  onClick?: (e: KonvaEventObject<MouseEvent>) => void;
  isEditingText?: boolean;
  setIsEditingText?: any;
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
  fontSize = 12,
  fontFamily = "Roboto",
  fill = "#000",
  fontStyle = "normal",
  fontWeight = "normal",
  verticalAlign = "start",
  align = "left",
  opacity = 1,
  height,
  width,
  wrap = "word",
  draggable = true,
  isSelected,
  onSelect,
  onClick,
}) => {
  const textRef = useRef<any>(null);
  const trRef = useRef<any>(null);
  const dispatch = useDispatch();
  const { selectedTheme } = useSlideThemeContext();
  const { slides, setTooltip, setIsAtBoundary } = useSlides();
  const [lastValidPos, setLastValidPos] = useState({ x, y });

  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(text);
  const [currentFontSize, setCurrentFontSize] = useState(fontSize);
  const [currentFontFamily, setCurrentFontFamily] = useState(fontFamily);
  const [currentFontWeight, setCurrentFontWeight] = useState(
    weightOptions.some((w) => w.value === fontWeight) ? fontWeight : "normal"
  );
  const [currentAlign, setCurrentAlign] = useState(align);
  const [currentFontStyle, setCurrentFontStyle] = useState(fontStyle);

  const parsed = id.match(/(?:title|el)-(\d+)(?:-(\d+))?/);
  const slideIndex = parsed ? parseInt(parsed[1], 10) : -1;
  const elementIndex = parsed?.[2] ? parseInt(parsed[2], 10) : null;

  useEffect(() => {
    if (isSelected && textRef.current && trRef.current) {
      trRef.current.nodes([textRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  const updateSlides = useCallback(
    (newText: string, newStyle: Partial<KonvaTextEditorProps> = {}) => {
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
    },
    [dispatch, slideIndex, elementIndex, slides, id]
  );

  const commitEdit = useCallback(() => {
    if (inputValue.trim() !== text.trim()) {
      updateSlides(inputValue, {
        fontSize: fontSize,
        fontFamily: fontFamily,
        fontWeight: fontWeight,
        fontStyle: fontStyle,
        align: align,
        x,
        y,
        width,
      });
    }
    setIsEditing(false);
  }, [
    inputValue,
    text,
    currentFontSize,
    currentFontFamily,
    currentFontWeight,
    currentFontStyle,
    currentAlign,
    x,
    y,
    width,
    updateSlides,
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
  }, [dispatch, slideIndex, elementIndex, slides, id]);

  const handleTouchEnd = useCallback(
    (e: KonvaEventObject<TouchEvent>) => {
      e.evt.preventDefault();
      if (!isEditing) {
        onSelect();
        setIsEditing(true);
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
    [onSelect, isEditing, setTooltip]
  );

  const handleClick = useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      if (!isEditing && onClick) {
        onClick(e);
        onSelect();
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

  const handleDragEnd = useCallback(
    (e: KonvaEventObject<DragEvent>) => {
      const node = textRef.current;
      if (!node) return;

      const boundingBox = node.getClientRect();
      const {
        x: newX,
        y: newY,
        isAtBoundary,
      } = constrainToCanvas(
        node.x(),
        node.y(),
        node.width(),
        boundingBox.height,
        getSlideDimensions().SLIDE_WIDTH,
        getSlideDimensions().SLIDE_HEIGHT
      );

      if (isAtBoundary) {
        // Snap back to last valid position
        node.position({ x: lastValidPos.x, y: lastValidPos.y });
      } else {
        // Update position and state
        node.position({ x: newX, y: newY });
        setLastValidPos({ x: newX, y: newY });
        updateSlides(text, {
          x: newX,
          y: newY,
          width,
          fontSize: fontSize,
          fontFamily: fontFamily,
          fontWeight: fontWeight,
          fontStyle: fontStyle,
          align: align,
        });
      }

      setIsAtBoundary(isAtBoundary);
    },
    [
      text,
      width,
      height,
      fontSize,
      fontFamily,
      fontWeight,
      fontStyle,
      align,
      updateSlides,
      setIsAtBoundary,
      lastValidPos,
    ]
  );

  const handleTransformEnd = useCallback(() => {
    const node = textRef.current;
    if (!node) return;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    node.scaleX(1);
    node.scaleY(1);
    const newWidth = Math.max(30, node.width() * scaleX);
    const newHeight = Math.max(20, node.height() * scaleY);
    const { x, y, isAtBoundary } = constrainToCanvas(
      node.x(),
      node.y(),
      newWidth,
      newHeight,
      getSlideDimensions().SLIDE_WIDTH,
      getSlideDimensions().SLIDE_HEIGHT
    );
    node.position({ x, y });
    node.width(newWidth);
    node.height(newHeight);
    setIsAtBoundary(isAtBoundary);
    updateSlides(text, {
      x,
      y,
      width: newWidth,
      height: newHeight,
      fontSize: fontSize,
      fontFamily: fontFamily,
      fontWeight: fontWeight,
      fontStyle: fontWeight,
      align: align,
    });
  }, [
    text,
    currentFontSize,
    currentFontFamily,
    currentFontWeight,
    currentFontStyle,
    currentAlign,
    updateSlides,
    setIsAtBoundary,
  ]);

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

  const handleStyleChange = useCallback(
    (style: Partial<KonvaTextEditorProps>) => {
      const updatedStyle = {
        fontSize:
          style.fontSize !== undefined ? style.fontSize : currentFontSize,
        fontFamily:
          style.fontFamily !== undefined ? style.fontFamily : currentFontFamily,
        fontWeight:
          style.fontWeight !== undefined ? style.fontWeight : currentFontWeight,
        fontStyle:
          style.fontStyle !== undefined ? style.fontStyle : currentFontStyle,
        align: style.align !== undefined ? style.align : currentAlign,
        x,
        y,
        width,
      };

      updateSlides(inputValue, updatedStyle);
      setCurrentFontSize(updatedStyle.fontSize);
      setCurrentFontFamily(updatedStyle.fontFamily);
      setCurrentFontWeight(updatedStyle.fontWeight);
      setCurrentFontStyle(updatedStyle.fontStyle);
      setCurrentAlign(updatedStyle.align);
    },
    [
      currentFontSize,
      currentFontFamily,
      currentFontWeight,
      currentFontStyle,
      currentAlign,
      x,
      y,
      width,
      inputValue,
      updateSlides,
    ]
  );

  useEffect(() => {
    if (isEditing && textRef.current) {
      textRef.current.getClientRect();
    }
  }, [isEditing]);

  return (
    <>
      <Text
        ref={textRef}
        text={text}
        x={x}
        y={y}
        fontSize={fontSize}
        fontFamily={fontFamily}
        fontStyle={fontWeight}
        fontWeight={fontWeight}
        fill={selectedTheme?.primaryColor || fill}
        align={align}
        verticalAlign={verticalAlign}
        opacity={opacity}
        width={width}
        wrap={wrap}
        draggable={draggable}
        visible={!isEditing}
        zIndex={999}
        onClick={handleClick}
        onTap={onSelect}
        onTouchEnd={handleTouchEnd}
        onDragEnd={handleDragEnd}
        onTransformEnd={handleTransformEnd}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          keepRatio={true}
          enabledAnchors={[
            "top-left",
            "top-right",
            "bottom-left",
            "bottom-right",
          ]}
          boundBoxFunc={(oldBox, newBox) => {
            const { x, y, isAtBoundary } = constrainToCanvas(
              newBox.x,
              newBox.y,
              newBox.width,
              newBox.height,
              getSlideDimensions().SLIDE_WIDTH,
              getSlideDimensions().SLIDE_HEIGHT
            );
            setIsAtBoundary(isAtBoundary);
            return { ...newBox, x, y, width: Math.max(30, newBox.width) };
          }}
        />
      )}
      {isSelected && isEditing && textRef.current && (
        <Html>
          <textarea
            autoFocus
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={commitEdit}
            style={{
              position: "absolute",
              top: textRef.current.absolutePosition().y,
              left: textRef.current.absolutePosition().x,
              fontSize: `${fontSize}px`,
              fontFamily: fontFamily?.trim() || selectedTheme?.font || "Roboto",
              fontStyle: fontWeight || "normal",
              fontWeight: fontWeight || "normal",
              outline: "none",
              // background: "transparent",
              background: "white",
              border: "0px",
              paddingLeft: "6px",
              lineHeight: 0.9,
              resize: "none",
              transform: `rotate(${textRef.current.rotation()}deg)`,
              width: `${textRef.current.width()}px`,
              height: `${textRef.current.height()}px`,
              zIndex: 999,
            }}
          />
        </Html>
      )}
    </>
  );
};

export default KonvaTextEditor;
