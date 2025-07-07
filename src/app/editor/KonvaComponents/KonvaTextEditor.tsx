// app/components/KonvaComponents/KonvaTextEditor.tsx
"use client";

import React from "react";
import { Text } from "react-konva";

interface KonvaTextEditorProps {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize?: number;
  fontFamily?: string;
  fill?: string;
  fontStyle?: string;
  width?: number; // 👈 NEW
  wrap?: "word" | "char"; // 👈 NEW
  onDblClick?: () => void;
  onClick?: () => void;
}

const KonvaTextEditor: React.FC<KonvaTextEditorProps> = ({
  id,
  text,
  x,
  y,
  fontSize = 24,
  fontFamily = "Arial",
  fill = "#000",
  fontStyle = "normal",
  width,
  wrap = "word",
  onDblClick,
  onClick,
}) => {
  return (
    <Text
      key={id}
      text={text}
      x={x}
      y={y}
      fontSize={fontSize}
      fontFamily={fontFamily}
      fill={fill}
      fontStyle={fontStyle}
      width={width}
      wrap={wrap}
      draggable
      onClick={onClick}
      onDblClick={onDblClick}
    />
  );
};

export default KonvaTextEditor;
