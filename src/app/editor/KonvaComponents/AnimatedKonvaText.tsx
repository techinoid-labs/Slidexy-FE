import React, { useEffect, useRef } from "react";
import { Text, Transformer } from "react-konva";
import { useKonvaTypewriter } from "@/hooks/useKonvaTypewriter";
import { useKonvaLayoutAnimation } from "@/hooks/useKonvaLayoutAnimation";

interface AnimatedKonvaTextProps {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize?: number;
  fontFamily?: string;
  fill?: string;
  fontWeight?: string;
  fontStyle?: string;
  align?: "left" | "center" | "right" | "justify";
  opacity?: number;
  height?: number;
  width?: number;
  wrap?: "word" | "char";
  verticalAlign?: string;
  lineHeight?: number;
  draggable?: boolean;
  isSelected: boolean;
  onSelect: (e: any) => void;
  onChange?: (newText: string) => void;
  
  // Typewriter animation props
  enableTypewriter?: boolean;
  typewriterDuration?: number;
  typewriterDelay?: number;
  typewriterHold?: number;
  
  // Layout animation props
  enableLayoutAnimation?: boolean;
  layoutAnimationType?: 'slideIn' | 'fadeIn' | 'scaleUp' | 'rotate' | 'bounce';
  layoutAnimationDuration?: number;
  layoutAnimationDelay?: number;
}

/**
 * Enhanced Konva Text component with typewriter and layout animations
 */
const AnimatedKonvaText: React.FC<AnimatedKonvaTextProps> = ({
  id,
  text,
  x,
  y,
  fontSize = 24,
  fontFamily = "Raleway",
  fill = "#000",
  fontWeight,
  fontStyle,
  align = "left",
  opacity = 1,
  height,
  width,
  wrap = "word",
  verticalAlign = "start",
  lineHeight = 1.2,
  draggable = true,
  isSelected,
  onSelect,
  enableTypewriter = false,
  typewriterDuration = 300,
  typewriterDelay = 100,
  typewriterHold = 1500,
  enableLayoutAnimation = false,
  layoutAnimationType = 'slideIn',
  layoutAnimationDuration = 600,
  layoutAnimationDelay = 0,
}) => {
  const textRef = useRef<any>(null);
  const trRef = useRef<any>(null);

  // Typewriter animation
  const { applyCharOpacity } = useKonvaTypewriter(textRef, {
    duration: typewriterDuration,
    characterDelay: typewriterDelay,
    holdDuration: typewriterHold,
    loopAnimation: false,
    startDelay: 0,
  });

  // Layout animation
  useKonvaLayoutAnimation(textRef, {
    type: layoutAnimationType,
    duration: layoutAnimationDuration,
    delay: layoutAnimationDelay,
  });

  useEffect(() => {
    if (isSelected && textRef.current && trRef.current) {
      trRef.current.nodes([textRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <Text
        ref={textRef}
        id={id}
        text={text}
        x={x}
        y={y}
        fontSize={fontSize}
        fontFamily={fontFamily}
        fill={fill}
        fontWeight={fontWeight}
        fontStyle={fontStyle}
        align={align}
        opacity={opacity}
        height={height}
        width={width}
        wrap={wrap}
        verticalAlign={verticalAlign}
        lineHeight={lineHeight}
        draggable={draggable}
        onClick={onSelect}
        onTap={onSelect}
        charRenderFunc={
          enableTypewriter
            ? ({ context, index }: any) => {
                applyCharOpacity(context, index);
              }
            : undefined
        }
      />
      {isSelected && <Transformer ref={trRef} />}
    </>
  );
};

export default AnimatedKonvaText;
