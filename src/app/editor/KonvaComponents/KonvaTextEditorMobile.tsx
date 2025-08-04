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
}

const KonvaTextEditor: React.FC<KonvaTextEditorProps> = ({
  id,
  text,
  x,
  y,
  fontSize = 12,
  fontFamily = "Roboto",
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
  onSelect,
  onClick,
}) => {
  const textRef = useRef<any>(null);
  const trRef = useRef<any>(null);
  const dispatch = useDispatch();
  const { selectedTheme } = useSlideThemeContext();
  const { slides, setTooltip, setIsAtBoundary } = useSlides();
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(text);
  const [lastValidPos, setLastValidPos] = useState({ x, y });

  // Parse slide and element indices
  const parsed = id.match(/(?:title|el)-(\d+)(?:-(\d+))?/);
  const slideIndex = parsed ? parseInt(parsed[1], 10) : -1;
  const elementIndex = parsed?.[2] ? parseInt(parsed[2], 10) : null;

  // Update inputValue when text prop changes
  useEffect(() => {
    setInputValue(text);
  }, [text]);

  // Force re-render when font properties change
  useEffect(() => {
    if (textRef.current) {
      textRef.current.getLayer()?.batchDraw();
    }
  }, [fontFamily, fontSize, fontWeight, align, selectedTheme, width, height]);

  // Force re-render when props change (for transformer updates)
  useEffect(() => {
    if (textRef.current) {
      console.log("[KonvaTextEditor] Props changed, forcing re-render:", { fontSize, width, height });
      textRef.current.getLayer()?.batchDraw();
    }
  }, [fontSize, width, height]);

  // Force re-render when any prop changes
  useEffect(() => {
    if (textRef.current) {
      console.log("[KonvaTextEditor] Any prop changed, forcing re-render:", { 
        id, text, fontSize, fontFamily, fontWeight, align, x, y, width, height 
      });
      textRef.current.getLayer()?.batchDraw();
    }
  }, [id, text, fontSize, fontFamily, fontWeight, align, x, y, width, height]);

  // Log prop changes
  useEffect(() => {
    console.log("[KonvaTextEditor] Props updated:", {
      id,
      text,
      fontSize,
      fontFamily,
      fontWeight,
      fontStyle,
      align,
      x,
      y,
      width,
      height,
      isSelected,
    });
  }, [id, text, fontSize, fontFamily, fontWeight, fontStyle, align, x, y, width, height, isSelected]);

  // Debug: Log when component receives new font properties
  useEffect(() => {
    console.log(`[KonvaTextEditor] ${id} font properties changed:`, {
      fontFamily,
      fontSize,
      fontWeight,
      align
    });
  }, [id, fontFamily, fontSize, fontWeight, align]);

  // Log transformer attachment
  useEffect(() => {
    if (isSelected && textRef.current && trRef.current) {
      console.log("[KonvaTextEditor] Attaching transformer to text node:", { id, isSelected });
      trRef.current.nodes([textRef.current]);
      trRef.current.getLayer()?.batchDraw();
      console.log("[KonvaTextEditor] Canvas redrawn after transformer attachment");
    } else if (!isSelected && trRef.current) {
      console.log("[KonvaTextEditor] Detaching transformer from text node:", { id, isSelected });
      trRef.current.nodes([]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected, id]);

  const updateSlides = useCallback(
    (newText: string, newStyle: Partial<KonvaTextEditorProps> = {}) => {
      if (slideIndex === -1) {
        console.log("[KonvaTextEditor] updateSlides: Invalid slideIndex, aborting");
        return;
      }

      console.log("[KonvaTextEditor] updateSlides called:", { newText, newStyle });

      const updatedSlides = structuredClone(slides);
      const slide = updatedSlides[slideIndex];

      const updateElement = (element: any) => ({
        ...element,
        text: newText,
        properties: { ...element.properties, ...newStyle },
      });

      if (id.startsWith("title")) {
        slide.slide_title = updateElement(slide.slide_title);
        console.log("[KonvaTextEditor] Updated slide_title:", slide.slide_title);
      } else if (elementIndex !== null && slide.elements[elementIndex]) {
        slide.elements[elementIndex] = updateElement(slide.elements[elementIndex]);
        console.log("[KonvaTextEditor] Updated element:", slide.elements[elementIndex]);
      }

      dispatch(setSlides(updatedSlides));
      console.log("[KonvaTextEditor] Dispatched updated slides to Redux");
    },
    [dispatch, slideIndex, elementIndex, slides, id]
  );

  const commitEdit = useCallback(() => {
    console.log("[KonvaTextEditor] commitEdit called:", { inputValue, text });
    if (inputValue.trim() !== text.trim()) {
      console.log("[KonvaTextEditor] Text changed, updating slides:", { inputValue });
      updateSlides(inputValue, {
        fontSize,
        fontFamily,
        fontWeight,
        fontStyle,
        align,
        x,
        y,
        width,
      });
    }
    setIsEditing(false);
    console.log("[KonvaTextEditor] Exiting edit mode");
  }, [
    inputValue,
    text,
    fontSize,
    fontFamily,
    fontWeight,
    fontStyle,
    align,
    x,
    y,
    width,
    updateSlides,
  ]);

  const handleDelete = useCallback(() => {
    console.log("[KonvaTextEditor] handleDelete called:", { id, slideIndex, elementIndex });
    if (slideIndex === -1) {
      console.log("[KonvaTextEditor] handleDelete: Invalid slideIndex, aborting");
      return;
    }

    const updatedSlides = structuredClone(slides);
    const slide = updatedSlides[slideIndex];

    if (id.startsWith("title")) {
      slide.slide_title.text = "";
      console.log("[KonvaTextEditor] Cleared slide_title text");
    } else if (elementIndex !== null && slide.elements[elementIndex]) {
      slide.elements.splice(elementIndex, 1);
      console.log("[KonvaTextEditor] Removed element at index:", elementIndex);
    }

    dispatch(setSlides(updatedSlides));
    console.log("[KonvaTextEditor] Dispatched updated slides after delete");
    setIsEditing(false);
    console.log("[KonvaTextEditor] Exiting edit mode after delete");
  }, [dispatch, slideIndex, elementIndex, slides, id]);

  const handleTouchEnd = useCallback(
    (e: KonvaEventObject<TouchEvent>) => {
      console.log("[KonvaTextEditor] handleTouchEnd called:", { id, isEditing });
      e.evt.preventDefault();
      if (!isEditing) {
        onSelect();
        setIsEditing(true);
        console.log("[KonvaTextEditor] Entering edit mode and showing tooltip");
        const node = textRef.current;
        if (node) {
          const pos = node.absolutePosition();
          console.log("[KonvaTextEditor] Setting tooltip position:", pos);
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
      console.log("[KonvaTextEditor] handleClick called:", { id, isEditing });
      if (!isEditing && onClick) {
        onClick(e);
        onSelect();
        console.log("[KonvaTextEditor] Text selected, showing tooltip");
        const node = textRef.current;
        if (node) {
          const pos = node.absolutePosition();
          console.log("[KonvaTextEditor] Setting tooltip position:", pos);
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

  const handleStageClick = useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      // If clicking on the stage (canvas) and not on this text element, close editing
      if (isEditing && e.target === e.target.getStage()) {
        console.log("[KonvaTextEditor] Stage clicked, closing edit mode");
        commitEdit();
      }
    },
    [isEditing, commitEdit]
  );

  const handleDragEnd = useCallback(
    (e: KonvaEventObject<DragEvent>) => {
      const node = textRef.current;
      if (!node) {
        console.log("[KonvaTextEditor] handleDragEnd: No text node found");
        return;
      }

      const boundingBox = node.getClientRect();
      const { x: newX, y: newY, isAtBoundary } = constrainToCanvas(
        node.x(),
        node.y(),
        node.width(),
        boundingBox.height,
        getSlideDimensions().SLIDE_WIDTH,
        getSlideDimensions().SLIDE_HEIGHT
      );

      console.log("[KonvaTextEditor] handleDragEnd:", {
        nodeX: node.x(),
        nodeY: node.y(),
        newX,
        newY,
        isAtBoundary,
        lastValidPos,
      });

      if (isAtBoundary) {
        console.log("[KonvaTextEditor] Snapping back to last valid position:", lastValidPos);
        node.position({ x: lastValidPos.x, y: lastValidPos.y });
      } else {
        console.log("[KonvaTextEditor] Updating position to:", { newX, newY });
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
      console.log("[KonvaTextEditor] Canvas redrawn after drag end");
    },
    [
      text,
      width,
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
    if (!node) {
      console.log("[KonvaTextEditor] handleTransformEnd: No text node found");
      return;
    }

    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    node.scaleX(1);
    node.scaleY(1);

    const slideDimensions = getSlideDimensions();
    const { SLIDE_WIDTH, SLIDE_HEIGHT } = slideDimensions;
    
    // Calculate new dimensions from scale
    const newWidth = Math.max(30, node.width() * scaleX);
    const newHeight = Math.max(20, node.height() * scaleY);
    
    // Calculate new font size based on scale (use the smaller scale to maintain aspect ratio)
    const scale = Math.min(scaleX, scaleY);
    const newFontSize = Math.max(8, Math.min(72, fontSize * scale)); // Limit font size between 8 and 72
    
    // Get current position
    const currentX = node.x();
    const currentY = node.y();
    
    // Constrain position and size to slide bounds
    const minWidth = 30;
    const minHeight = 20;
    
    // Constrain x position
    const constrainedX = Math.max(0, Math.min(currentX, SLIDE_WIDTH - minWidth));
    
    // Constrain y position  
    const constrainedY = Math.max(0, Math.min(currentY, SLIDE_HEIGHT - minHeight));
    
    // Constrain width
    const maxWidth = SLIDE_WIDTH - constrainedX;
    const constrainedWidth = Math.max(minWidth, Math.min(newWidth, maxWidth));
    
    // Constrain height
    const maxHeight = SLIDE_HEIGHT - constrainedY;
    const constrainedHeight = Math.max(minHeight, Math.min(newHeight, maxHeight));
    
    const isAtBoundary = 
      constrainedX !== currentX || 
      constrainedY !== currentY || 
      constrainedWidth !== newWidth || 
      constrainedHeight !== newHeight;

    console.log("[KonvaTextEditor] handleTransformEnd:", {
      newWidth,
      newHeight,
      newFontSize,
      constrainedX,
      constrainedY,
      constrainedWidth,
      constrainedHeight,
      isAtBoundary,
    });

    // Apply the constrained position and size to the node
    node.position({ x: constrainedX, y: constrainedY });
    node.width(constrainedWidth);
    node.height(constrainedHeight);
    node.fontSize(newFontSize);

    setIsAtBoundary(isAtBoundary);

    updateSlides(text, {
      x: constrainedX,
      y: constrainedY,
      width: constrainedWidth,
      height: constrainedHeight,
      fontSize: newFontSize,
      fontFamily,
      fontWeight,
      fontStyle,
      align,
    });

    console.log("[KonvaTextEditor] Canvas redrawn after transform end");
  }, [
    text,
    fontSize,
    fontFamily,
    fontWeight,
    fontStyle,
    align,
    updateSlides,
    setIsAtBoundary,
  ]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      console.log("[KonvaTextEditor] handleKeyDown:", { key: e.key, isEditing, isSelected });
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
          console.log("[KonvaTextEditor] Exiting edit mode via Escape");
        }
      }
    },
    [isEditing, isSelected, handleDelete, commitEdit]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    console.log("[KonvaTextEditor] Keydown listener added");
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      console.log("[KonvaTextEditor] Keydown listener removed");
    };
  }, [handleKeyDown]);

  // Close editing when text is deselected
  useEffect(() => {
    if (isEditing && !isSelected) {
      console.log("[KonvaTextEditor] Text deselected, closing edit mode");
      commitEdit();
    }
  }, [isSelected, isEditing, commitEdit]);

  // Log textarea changes
  useEffect(() => {
    console.log("[KonvaTextEditor] inputValue changed:", { inputValue });
  }, [inputValue]);

  return (
    <>
      <Text
        ref={textRef}
        text={text}
        x={x}
        y={y}
        fontSize={fontSize}
        fontFamily={fontFamily?.trim() || selectedTheme?.font || "Roboto"}
        fontStyle={fontWeight && fontWeight !== "10px" ? fontWeight : "normal"}
        // fontWeight={fontWeight && fontWeight !== "10px" ? fontWeight : "normal"}
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
            onChange={(e) => {
              console.log("[KonvaTextEditor] Textarea input changed:", { newValue: e.target.value });
              setInputValue(e.target.value);
            }}
            onBlur={() => {
              console.log("[KonvaTextEditor] Textarea blurred, committing edit");
              commitEdit();
            }}
            style={{
              position: "absolute",
              top: (() => {
                const nodePos = textRef.current.absolutePosition();
                const slideDimensions = getSlideDimensions();
                const maxY = slideDimensions.SLIDE_HEIGHT - textRef.current.height();
                return Math.max(0, Math.min(nodePos.y, maxY));
              })(),
              left: (() => {
                const nodePos = textRef.current.absolutePosition();
                const slideDimensions = getSlideDimensions();
                const maxX = slideDimensions.SLIDE_WIDTH - textRef.current.width();
                return Math.max(0, Math.min(nodePos.x, maxX));
              })(),
              fontSize: `${fontSize}px`,
              fontFamily: fontFamily?.trim() || selectedTheme?.font || "Roboto",
              fontStyle: fontWeight && fontWeight !== "10px" ? fontWeight : "normal",
              fontWeight: fontWeight && fontWeight !== "10px" ? fontWeight : "normal",
              outline: "none",
              background: "white",
              border: "1px solid #ccc",
              paddingLeft: "6px",
              lineHeight: 1.2,
              resize: "none",
              transform: `rotate(${textRef.current.rotation()}deg)`,
              width: (() => {
                const slideDimensions = getSlideDimensions();
                const maxWidth = slideDimensions.SLIDE_WIDTH - textRef.current.x();
                return Math.min(textRef.current.width(), maxWidth);
              })(),
              height: (() => {
                const slideDimensions = getSlideDimensions();
                const maxHeight = slideDimensions.SLIDE_HEIGHT - textRef.current.y();
                return Math.min(textRef.current.height(), maxHeight);
              })(),
              zIndex: 999,
            }}
          />
        </Html>
      )}
    </>
  );
};

export default KonvaTextEditor;
