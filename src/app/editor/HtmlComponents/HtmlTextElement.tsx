// app/components/editor/HTMLTextElement.tsx
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Box } from '@mui/material';
import Draggable from 'react-draggable';

interface HTMLTextElementProps {
  id: string;
  text: string;
  x: number;
  y: number;
  width?: number | 'auto';
  height?: number | 'auto';
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string;
  fill?: string;
  align?: 'left' | 'center' | 'right';
  opacity?: number;
  lineHeight?: number;
  onUpdate: (changes: Partial<HTMLTextElementProps & { text: string }>) => void;
  isSelected?: boolean;
}

export const HTMLTextElement: React.FC<HTMLTextElementProps> = ({
  id,
  text,
  x,
  y,
  width = 300,
  height = 'auto',
  fontSize = 24,
  fontFamily = 'Raleway',
  fontWeight = 'normal',
  fill = '#000',
  align = 'left',
  opacity = 1,
  lineHeight = 1.4,
  onUpdate,
  isSelected = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(text);
  const divRef = useRef<HTMLDivElement>(null);

  // Sync external text changes (e.g. undo/redo, AI rewrite)
  useEffect(() => {
    if (text !== content && !isEditing) {
      setContent(text);
    }
  }, [text]);

  const handleBlur = () => {
    setIsEditing(false);
    if (content !== text) {
      onUpdate({ text: content });
    }
  };

  const handleDragStop = (_e: any, data: any) => {
    onUpdate({ x: data.x, y: data.y });
  };

  return (
    <Draggable
      position={{ x, y }}
      onStop={handleDragStop}
      disabled={isEditing}
      bounds="parent"
      handle=".drag-handle"
    >
      <Box
        className="drag-handle"
        ref={divRef}
        contentEditable={isEditing}
        suppressContentEditableWarning
        onBlur={handleBlur}
        onInput={(e) => setContent(e.currentTarget.textContent || '')}
        onClick={() => !isEditing && setIsEditing(true)}
        onDoubleClick={(e) => {
          e.stopPropagation();
          setIsEditing(true);
          setTimeout(() => divRef.current?.focus(), 0);
        }}
        dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br>') }}
        sx={{
          position: 'absolute',
          minWidth: 100,
          minHeight: 40,
          width: width === 'auto' ? 'fit-content' : width,
          height,
          padding: '8px 12px',
          fontSize: `${fontSize}px`,
          fontFamily,
          fontWeight,
          color: fill,
          textAlign: align,
          opacity,
          lineHeight,
          cursor: isEditing ? 'text' : 'move',
          outline: isSelected ? '3px solid #1976d2' : '2px solid transparent',
          outlineOffset: 2,
          borderRadius: '4px',
          background: isEditing ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
          transition: 'all 0.2s ease',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          userSelect: isEditing ? 'text' : 'none',
          pointerEvents: 'auto',
          '&:hover': {
            outline: '2px dashed #1976d2',
          },
          '&:focus': {
            outline: '3px solid #1976d2',
          },
        }}
      />
    </Draggable>
  );
};