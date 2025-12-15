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
  onChange?: (newText: string) => void;
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

    // 1. Get current scale from transformer
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    // 2. Reset scale (prevents letter stretching)
    node.scaleX(1);
    node.scaleY(1);

    // 3. Apply new width (this triggers wrapping)
    const newWidth = Math.max(60, node.width() * scaleX);  // minimum readable width
    node.width(newWidth);

    // 4. THIS IS THE MAGIC: Let Konva measure the real height of wrapped text
    const contentHeight = node.getTextHeight(); // ← measures wrapped text perfectly
    const padding = 24; // your padding (12 top + 12 bottom)
    const newHeight = Math.max(40, contentHeight + padding);

    // 5. Apply auto-calculated height
    node.height(newHeight);

    // 6. Optional: Keep within canvas bounds
    const { x: newX, y: newY, isAtBoundary } = constrainToCanvas(
      node,
      getSlideDimensions().SLIDE_WIDTH,
      getSlideDimensions().SLIDE_HEIGHT
    );
    node.position({ x: newX, y: newY });
    setIsAtBoundary(isAtBoundary);

    // 7. Save new width + auto height
    updateSlides(text, {
      x: newX,
      y: newY,
      width: newWidth,
      height: newHeight,        // ← Auto height saved
    });

    // 8. Redraw
    node.getLayer()?.batchDraw();
  }, [text, updateSlides, setIsAtBoundary]);
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

  useEffect(() => {
    if (isSelected && textRef.current && trRef.current) {
      // Force transformer to update when width/height changes
      trRef.current.nodes([textRef.current]);
      trRef.current.forceUpdate();
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected, width, height]);

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
        width={width || 300}
        height={height}
        fontSize={fontSize}
        fill={fill}
        fontFamily={fontFamily?.trim() || selectedTheme?.font || "Raleway"}
        fontStyle={fontStyle || "normal"}
        fontWeight={fontWeight || "normal"}
        align={align}
        wrap="char"
        ellipsis={true}
        padding={12}
        opacity={opacity}
        draggable={draggable}
        visible={!isEditing}
        onDragEnd={handleDragEnd}
        onTransformEnd={handleTransformEnd}
        perfectDrawEnabled={false}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          rotateEnabled={false}
          // DO NOT use keepRatio
          // DO NOT use centeredScaling (bad for text)

          enabledAnchors={[
            "top-left",
            "top-center",
            "top-right",
            "middle-left",     // ← These make width resize feel natural
            "middle-right",    // ← This is what you want!
            "bottom-left",
            "bottom-center",
            "bottom-right",
          ]}

          // Prevent tiny boxes
          boundBoxFunc={(oldBox, newBox) => {
            newBox.width = Math.max(60, newBox.width);
            newBox.height = Math.max(40, newBox.height);
            return newBox;
          }}

          // This is the KEY: ignore height changes from dragging bottom handle
          // Let our handleTransformEnd recalculate height instead
          ignoreStroke={true}
          padding={0}
        />
      )}
      {isEditing && textRef.current && (
        <Html>
          <div
            className="editor-text-overlay"
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
              width: (() => {
                const slideDimensions = getSlideDimensions();
                const maxWidth =
                  slideDimensions.SLIDE_WIDTH - textRef.current.x();
                return Math.min(textRef.current.width(), maxWidth);
              })(),
              minHeight: (() => {
                const slideDimensions = getSlideDimensions();
                const maxHeight =
                  slideDimensions.SLIDE_HEIGHT - textRef.current.y();
                return Math.min(textRef.current.height(), maxHeight);
              })(),
            }}
          >
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
                fontSize: `${fontSize}px`,
                fontFamily: fontFamily?.trim() || selectedTheme?.font || "Raleway",
                fontStyle: fontWeight || "normal",
                fontWeight: fontWeight || "normal",
                color: fill,
                lineHeight: 1.2,
                transform: `rotate(${textRef.current.rotation()}deg)`,
              }}
            />
          </div>
        </Html>
      )}
    </>
  );
};

export default KonvaTextEditor;
