"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Text, Transformer } from "react-konva";
import { Html } from "react-konva-utils";
import { useSlideThemeContext } from "@/app/context/ThemeContext";
import { useSlides } from "@/app/context/SlidesContext";
import { setSlides } from "@/app/slice/slidesSlice";
import { useDispatch } from "react-redux";

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lastTap = useRef<number | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(text);

  const parsed = id.match(/(?:title|el)-(\d+)(?:-(\d+))?/);
  const slideIndex = parsed ? parseInt(parsed[1], 10) : -1;
  const elementIndex = parsed?.[2] ? parseInt(parsed[2], 10) : null;

  useEffect(() => {
    if (isSelected && textRef.current && trRef.current) {
      trRef.current.nodes([textRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  const updateSlides = (newText: string) => {
    if (slideIndex === -1) return;

    const updatedSlides = structuredClone(slides);
    const slide = updatedSlides[slideIndex];

    if (id.startsWith("title")) {
      slide.slide_title.text = newText;
    } else if (elementIndex !== null && slide.elements[elementIndex]) {
      slide.elements[elementIndex].text = newText.replace(/^\u2022\s*/, "");
    }

    dispatch(setSlides(updatedSlides));
  };

  const commitEdit = useCallback(() => {
    if (inputValue.trim() !== text.trim()) {
      updateSlides(inputValue);
    }
    setIsEditing(false);
  }, [inputValue, text]);

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

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // 🔁 Handle delete when NOT editing but selected
      if (e.key === "Delete" && !isEditing && isSelected) {
        e.preventDefault();
        handleDelete();
        return;
      }

      // ✍️ Handle Enter and Escape while editing
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
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [isEditing]);
  useEffect(() => {
    const handleStageClick = (e: MouseEvent | TouchEvent) => {
      if (!textRef.current || !isSelected) return;

      const stage = textRef.current.getStage();
      const clickedOnText =
        stage?.findOne(`#${textRef.current._id}`) === e.target;

      // If clicked somewhere else, deselect
      if (!clickedOnText) {
        setIsEditing(false);
      }
    };

    const stage = textRef.current?.getStage();
    stage?.on("mousedown touchstart", handleStageClick);

    return () => {
      stage?.off("mousedown touchstart", handleStageClick);
    };
  }, [isSelected]);

  return (
    <>
      <Text
        onClick={onSelect}
        onTap={onSelect}
        onTouchEnd={(e) => {
          onSelect(); // select on any touch

          const now = Date.now();
          const DOUBLE_TAP_DELAY = 300;

          if (lastTap.current && now - lastTap.current < DOUBLE_TAP_DELAY) {
            setIsEditing(true); // double-tap
          }

          lastTap.current = now;
        }}
        ref={textRef}
        text={text}
        x={x}
        y={y}
        zIndex={999}
        fontSize={fontSize}
        fill={fill}
        verticalAlign={verticalAlign}
        fontFamily={fontFamily?.trim() || selectedTheme?.font || "Roboto"}
        fontStyle={fontWeight || "normal"}
        fontWeight={fontWeight || "normal"}
        align={align}
        opacity={opacity}
        width={width}
        wrap={wrap}
        draggable={draggable}
        onDblClick={() => setIsEditing(true)}
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
            // "middle-left",
            // "middle-right",
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
            // onChange={(e) => setInputValue(e.target.value)}
            onChange={(e) => {
              setInputValue(e.target.value);

              if (textareaRef.current) {
                textareaRef.current.style.height = "auto";
                textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
              }
            }}
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
            onBlur={commitEdit}
          />
        </Html>
      )}
    </>
  );
};

export default KonvaTextEditor;
