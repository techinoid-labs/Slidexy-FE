import React, { useEffect, useRef, useCallback, useState } from "react";
import { Image as KonvaImage, Transformer } from "react-konva";
import useImage from "use-image";
import { useSlides } from "@/app/context/SlidesContext";
import {
  constrainImageToCanvas,
  getSlideDimensions,
} from "../../../utils/slideUtils";

interface SlideImageProps {
  image_id?: string;
  url?: string;
  imageSrc?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isSelected: boolean;
  zIndex?: number | string;
  onSelect: () => void;
}

const SlideImage: React.FC<SlideImageProps> = ({
  image_id,
  url,
  imageSrc,
  x,
  y,
  width,
  height,
  isSelected,
  zIndex,
  onSelect,
}) => {
  const [image] = useImage(imageSrc || url || "");
  const imageRef = useRef<any>(null);
  const trRef = useRef<any>(null);
  const {
    slides,
    setSlides,
    selectedSlideIndex,
    setSelectedImage,
    setIsAtBoundary,
  } = useSlides();
  const [lastValidPos, setLastValidPos] = useState({ x, y });
  const { SLIDE_WIDTH, SLIDE_HEIGHT } = getSlideDimensions();
  const minSize = { width: 50, height: 50 };
  const padding = { left: 10, right: 10, top: 10, bottom: 10 };

  // Attach transformer when image is selected
  useEffect(() => {
    if (isSelected && trRef.current && imageRef.current) {
      trRef.current.nodes([imageRef.current]);
      trRef.current.getLayer()?.batchDraw();
    } else if (!isSelected && trRef.current) {
      trRef.current.nodes([]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  // Handle delete key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isTyping =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      if (isTyping) return;

      if ((e.key === "Delete" || e.key === "Backspace") && isSelected) {
        if (!slides?.length || selectedSlideIndex < 0) return;

        const newSlides = JSON.parse(JSON.stringify(slides));
        const currentSlide = newSlides[selectedSlideIndex];

        if (!currentSlide) return;

        if (url && !imageSrc) {
          currentSlide.image_url = null;
        }

        if (imageSrc && image_id) {
          currentSlide.elements = currentSlide.elements.filter(
            (el: any) => el.image_id !== image_id
          );
        }

        setSlides(newSlides);
        setSelectedImage(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    isSelected,
    slides,
    url,
    imageSrc,
    image_id,
    selectedSlideIndex,
    setSlides,
    setSelectedImage,
  ]);

  // Update slides context with new image properties
  const updateSlideImage = useCallback(
    (newProps: { x: number; y: number; width: number; height: number }) => {
      if (!slides?.length || selectedSlideIndex < 0) return;

      const newSlides = JSON.parse(JSON.stringify(slides));
      const currentSlide = newSlides[selectedSlideIndex];

      if (!currentSlide) return;

      if (url && !imageSrc) {
        currentSlide.image_url = url;
      }

      if (imageSrc && image_id) {
        const imageElement = currentSlide.elements.find(
          (el: any) => el.image_id === image_id
        );
        if (imageElement) {
          imageElement.properties = {
            ...imageElement.properties,
            ...newProps,
          };
        }
      }

      setSlides(newSlides);
    },
    [slides, selectedSlideIndex, url, imageSrc, image_id, setSlides]
  );

  // Handle drag end with boundary constraints
  const handleDragEnd = useCallback(() => {
    const node = imageRef.current;
    if (!node) return;

    const { x, y, isAtBoundary } = constrainImageToCanvas(
      node.x(),
      node.y(),
      node.width(),
      node.height(),
      SLIDE_WIDTH,
      SLIDE_HEIGHT,
      padding,
      minSize
    );

    node.position({ x, y });
    setLastValidPos({ x, y });
    setIsAtBoundary(isAtBoundary);

    // Save updated position to slides context
    updateSlideImage({ x, y, width: node.width(), height: node.height() });
  }, [updateSlideImage]);

  // Handle transform end with boundary constraints
  const handleTransformEnd = useCallback(() => {
    const node = imageRef.current;
    if (!node) return;

    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    node.scaleX(1);
    node.scaleY(1);

    const newWidth = node.width() * scaleX;
    const newHeight = node.height() * scaleY;

    const { x, y, width, height, isAtBoundary } = constrainImageToCanvas(
      node.x(),
      node.y(),
      newWidth,
      newHeight,
      SLIDE_WIDTH,
      SLIDE_HEIGHT,
      padding,
      minSize
    );

    node.position({ x, y });
    node.width(width);
    node.height(height);
    setLastValidPos({ x, y });
    setIsAtBoundary(isAtBoundary);

    // Save updated position and size to slides context
    updateSlideImage({ x, y, width, height });
  }, [updateSlideImage]);

  return (
    <>
      <KonvaImage
        ref={imageRef}
        id={image_id}
        image={image}
        x={x}
        y={y}
        zIndex={zIndex}
        width={width}
        height={height}
        draggable
        onClick={onSelect}
        onTap={onSelect}
        onMouseDown={onSelect}
        onTouchStart={onSelect}
        onDragEnd={handleDragEnd}
        onTransformEnd={handleTransformEnd}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            const { x, y, width, height } = constrainImageToCanvas(
              newBox.x,
              newBox.y,
              newBox.width,
              newBox.height,
              SLIDE_WIDTH,
              SLIDE_HEIGHT,
              padding,
              minSize
            );
            return { ...newBox, x, y, width, height };
          }}
          rotateEnabled
          enabledAnchors={[
            "middle-left",
            "middle-right",
            "top-left",
            "top-right",
            "bottom-left",
            "bottom-right",
          ]}
        />
      )}
    </>
  );
};

export default SlideImage;