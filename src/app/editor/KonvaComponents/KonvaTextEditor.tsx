"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Text, Transformer } from "react-konva";
import { Html } from "react-konva-utils";
import { useSlideThemeContext } from "@/app/context/ThemeContext";
import { useSlides } from "@/app/context/SlidesContext";
import { setSlides } from "@/app/slice/slidesSlice";
import { useDispatch } from "react-redux";
import { constrainToCanvas, getSlideDimensions } from "@/utils/slideUtils";

interface KonvaTextEditorProps {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize?: number;
  fontFamily?: string;
  zIndex?: number | string;
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
  onSelect: (e: any) => void;
  verticalAlign?: string;
  lineHeight?: number;
}

const KonvaTextEditor: React.FC<KonvaTextEditorProps> = ({
  id,
  text,
  x,
  y,
  fontSize = 24,
  fontFamily = "Raleway",
  fill = "#000",
  fontStyle,
  fontWeight,
  verticalAlign = "start",
  align = "left",
  opacity = 1,
  height,
  width,
  wrap = "word",
  draggable = true,
  isSelected,
  zIndex,
  onSelect,
}) => {
  const textRef = useRef<any>(null);
  const trRef = useRef<any>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lastTap = useRef<number | null>(null);

  const dispatch = useDispatch();
  const { selectedTheme } = useSlideThemeContext();
  const { slides, setSlides, setIsAtBoundary } = useSlides();

  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(text);
  const [lastValidPos, setLastValidPos] = useState({ x, y });

  const parsed = id.match(/(?:title|el)-(\d+)(?:-(\d+))?/);
  const slideIndex = parsed ? parseInt(parsed[1], 10) : -1;
  const elementIndex = parsed?.[2] ? parseInt(parsed[2], 10) : null;
  const caretRef = useRef<number | null>(null);
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
      setSlides(updatedSlides);
      // dispatch(setSlides(updatedSlides));
    },
    [dispatch, slides, slideIndex, elementIndex, id]
  );

  const commitEdit = useCallback(() => {
    if (inputValue.trim() !== text.trim()) {
      updateSlides(inputValue);
    }
    setIsEditing(false);
  }, [inputValue, text, updateSlides]);

  const handleDelete = useCallback(() => {
    if (slideIndex === -1) return;

    const updatedSlides = structuredClone(slides);
    const slide = updatedSlides[slideIndex];

    if (id.startsWith("title")) {
      slide.slide_title.text = "";
    } else if (elementIndex !== null && slide.elements[elementIndex]) {
      slide.elements.splice(elementIndex, 1);
    }
    setSlides(updatedSlides);
    // dispatch(setSlides(updatedSlides));
    setIsEditing(false);
  }, [dispatch, slideIndex, elementIndex, slides, id]);

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

  const handleDragEnd = useCallback(
    (e: any) => {
      const node = textRef.current;
      if (!node) return;

      const { x: newX, y: newY, isAtBoundary } = constrainToCanvas(
        node,
        getSlideDimensions().SLIDE_WIDTH,
        getSlideDimensions().SLIDE_HEIGHT
      );

      if (isAtBoundary) {
        node.position({ x: lastValidPos.x, y: lastValidPos.y });
      } else {
        node.position({ x: newX, y: newY });
        setLastValidPos({ x: newX, y: newY });
      }

      updateSlides(text, {
        x: node.x(),
        y: node.y(),
        width,
        fontSize,
        fontFamily,
        fontWeight,
        fontStyle,
        align,
      });

      setIsAtBoundary(isAtBoundary);
    },
    [text, width, fontSize, fontFamily, fontWeight, fontStyle, align, updateSlides, setIsAtBoundary, lastValidPos]
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
    node.width(newWidth);
    node.height(newHeight);

    const { x: newX, y: newY, isAtBoundary } = constrainToCanvas(
      node,
      getSlideDimensions().SLIDE_WIDTH,
      getSlideDimensions().SLIDE_HEIGHT
    );

    node.position({ x: newX, y: newY });
    setIsAtBoundary(isAtBoundary);

    updateSlides(text, {
      x: newX,
      y: newY,
      width: newWidth,
      height: newHeight,
      fontSize,
      fontFamily,
      fontWeight,
      fontStyle,
      align,
    });
  }, [text, fontSize, fontFamily, fontWeight, fontStyle, align, updateSlides, setIsAtBoundary]);


  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [isEditing]);

  return (
    <>
      <Text
        ref={textRef}
        onClick={(e) => onSelect(e)}
        onTap={onSelect}
        onDblClick={() => setIsEditing(true)}
        onTouchEnd={(e) => {
          onSelect(e);
          const now = Date.now();
          const DOUBLE_TAP_DELAY = 300;
          if (lastTap.current && now - lastTap.current < DOUBLE_TAP_DELAY) {
            setIsEditing(true);
          }
          lastTap.current = now;
        }}
        text={text}
        x={x}
        y={y}
        zIndex={zIndex || 10}
        fontSize={fontSize}
        // height={50}
        fill={fill}
        verticalAlign={verticalAlign}
        fontFamily={fontFamily?.trim() || selectedTheme?.font || "Raleway"}
        fontStyle={fontWeight || "normal"}
        fontWeight={fontWeight || "normal"}
        shadowColor="rgba(0, 0, 0, 0.1)"
        align={align}
        padding={12}
        opacity={opacity}
        width={width}
        wrap={wrap}
        draggable={draggable}
        visible={!isEditing}
        onDragEnd={handleDragEnd}
        onTransformEnd={handleTransformEnd}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          keepRatio={true}
          boundBoxFunc={(oldBox, newBox) => {
            if (!textRef.current) return oldBox;

            const node = textRef.current;

            // Temporarily apply new box dimensions for boundary check
            node.width(newBox.width);
            node.height(newBox.height);
            node.x(newBox.x);
            node.y(newBox.y);

            // Check with rotation-aware boundaries
            const { x: newX, y: newY, isAtBoundary } = constrainToCanvas(node);

            // Re-apply corrected position
            node.position({ x: newX, y: newY });

            setIsAtBoundary(isAtBoundary);

            return {
              ...newBox,
              x: newX,
              y: newY,
              width: Math.max(30, newBox.width),
              height: Math.max(20, newBox.height),
            };
          }}
          enabledAnchors={["top-left", "top-right", "bottom-left", "bottom-right"]}
        />

      )}
      {isEditing && textRef.current && (
        <Html>
          <textarea
            autoFocus
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => {
              const target = e.target;
              caretRef.current = target.selectionStart;
              setInputValue(e.target.value);
              if (textareaRef.current) {
                textareaRef.current.style.height = "auto";
                textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
              }
            }}
            onBlur={commitEdit}
            style={{
              position: "absolute",
              top: (() => {
                const nodePos = textRef.current.absolutePosition();
                const slideDimensions = getSlideDimensions();
                const maxY =
                  slideDimensions.SLIDE_HEIGHT - textRef.current.height();
                return Math.max(0, Math.min(nodePos.y, maxY));
              })(),
              left: (() => {
                const nodePos = textRef.current.absolutePosition();
                const slideDimensions = getSlideDimensions();
                const maxX =
                  slideDimensions.SLIDE_WIDTH - textRef.current.width();
                return Math.max(0, Math.min(nodePos.x, maxX));
              })(),
              fontSize: `${fontSize}px`,
              fontFamily: fontFamily?.trim() || selectedTheme?.font || "Ralway",
              fontStyle: fontWeight || "normal",
              fontWeight: fontWeight || "normal",
              padding: "12px",

              outline: "none",
              // background: "white",
              // border: "1px solid #ccc",
              paddingLeft: "10px",
              lineHeight: 0.9,
              resize: "none",
              transform: `rotate(${textRef.current.rotation()}deg)`,
              width: (() => {
                const slideDimensions = getSlideDimensions();
                const maxWidth =
                  slideDimensions.SLIDE_WIDTH - textRef.current.x();
                return Math.min(textRef.current.width(), maxWidth);
              })(),
              height: (() => {
                const slideDimensions = getSlideDimensions();
                const maxHeight =
                  slideDimensions.SLIDE_HEIGHT - textRef.current.y();
                return Math.min(textRef.current.height(), maxHeight);
              })(),
              zIndex,
            }}
          />
        </Html>
      )}
    </>
  );
};

export default KonvaTextEditor;
