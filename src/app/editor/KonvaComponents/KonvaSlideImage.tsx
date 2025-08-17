"use client";

import React, { useEffect, useRef, useCallback, useState } from "react";
import { Image as KonvaImage, Transformer } from "react-konva";
import useImage from "use-image";
import { useSlides } from "@/app/context/SlidesContext";
import { constrainImageToCanvas, getSlideDimensions } from "../../../utils/slideUtils";

interface SlideImageProps {
  image_id?: string;
  url?: string;
  imageSrc?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  opacity?: number;
  shadow?: { offsetX: number; offsetY: number; blur: number; color: string };
  borderRadius?: number;
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
  opacity,
  shadow,
  borderRadius,
  isSelected,
  zIndex,
  onSelect,
}) => {
  const imageOpacity = (opacity !== undefined && opacity !== null) ? opacity : 1;
  const imageShadow = shadow ?? { offsetX: 0, offsetY: 0, blur: 0, color: "#000000" };
  const imageBorderRadius = borderRadius ?? 0;

  console.log(`[SlideImage] Received props: opacity=${imageOpacity}, shadow=${JSON.stringify(imageShadow)}, borderRadius=${imageBorderRadius} for image_id: ${image_id}`);

  const [image] = useImage(imageSrc || url || "");
  const imageRef = useRef<any>(null);
  const trRef = useRef<any>(null);
  const { slides, setSlides, selectedSlideIndex, setSelectedImage, setIsAtBoundary } = useSlides();
  const [lastValidPos, setLastValidPos] = useState({ x, y });
  const { SLIDE_WIDTH, SLIDE_HEIGHT } = getSlideDimensions();
  const minSize = { width: 50, height: 50 };
  const padding = { left: 10, right: 10, top: 10, bottom: 10 };

  useEffect(() => {
    if (isSelected && trRef.current && imageRef.current) {
      trRef.current.nodes([imageRef.current]);
      trRef.current.getLayer()?.batchDraw();
    } else if (!isSelected && trRef.current) {
      trRef.current.nodes([]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  useEffect(() => {
    if (imageRef.current) {
      imageRef.current.opacity(imageOpacity);
      imageRef.current.shadowOffsetX(imageShadow.offsetX);
      imageRef.current.shadowOffsetY(imageShadow.offsetY);
      imageRef.current.shadowBlur(imageShadow.blur);
      imageRef.current.shadowColor(imageShadow.color);
      imageRef.current.cornerRadius(imageBorderRadius);
      imageRef.current.getLayer()?.batchDraw();
    }
  }, [imageOpacity, imageShadow, imageBorderRadius, image]);

  useEffect(() => {
    if (imageRef.current && image) {
      imageRef.current.opacity(imageOpacity);
      imageRef.current.shadowOffsetX(imageShadow.offsetX);
      imageRef.current.shadowOffsetY(imageShadow.offsetY);
      imageRef.current.shadowBlur(imageShadow.blur);
      imageRef.current.shadowColor(imageShadow.color);
      imageRef.current.cornerRadius(imageBorderRadius);
      imageRef.current.getLayer()?.batchDraw();
    }
  }, [image, imageOpacity, imageShadow, imageBorderRadius]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isTyping = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;
      if (isTyping) return;

      if ((e.key === "Delete" || e.key === "Backspace") && isSelected) {
        if (!slides?.length || selectedSlideIndex < 0) return;

        const newSlides = structuredClone(slides);
        const currentSlide = newSlides[selectedSlideIndex];
        if (!currentSlide) return;

        if (url && !imageSrc) {
          currentSlide.image_url = null;
          console.log("[SlideImage] Cleared slide.image_url");
        }

        if (imageSrc) {
          currentSlide.elements = currentSlide.elements.filter(
            (el: any) => !(el.element_type === "image" && el.konva_component === "Konva.Image" && el.properties.imageSrc === imageSrc)
          );
          console.log("[SlideImage] Removed image element from slide.elements");
        }

        if (image_id) {
          currentSlide.elements = currentSlide.elements.filter(
            (el: any) => !(el.element_type === "image" && el.konva_component === "Konva.Image" && el.properties.image_id === image_id)
          );
          console.log("[SlideImage] Removed image element by image_id");
        }

        setSlides(newSlides);
        setSelectedImage(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSelected, slides, url, imageSrc, image_id, selectedSlideIndex, setSlides, setSelectedImage]);

  const updateSlideImage = useCallback(
    (newProps: { x: number; y: number; width: number; height: number; opacity?: number; shadow?: any; borderRadius?: number }) => {
      if (!slides?.length || selectedSlideIndex < 0) return;

      const newSlides = structuredClone(slides);
      const currentSlide = newSlides[selectedSlideIndex];
      if (!currentSlide) return;

      const updatedOpacity = newProps.opacity !== undefined ? newProps.opacity : imageOpacity;
      const updatedShadow = newProps.shadow !== undefined ? newProps.shadow : imageShadow;
      const updatedBorderRadius = newProps.borderRadius !== undefined ? newProps.borderRadius : imageBorderRadius;

      if (imageSrc) {
        const imageElementIndex = currentSlide.elements.findIndex(
          (el: any) => el.element_type === "image" && el.konva_component === "Konva.Image" && el.properties.imageSrc === imageSrc
        );

        if (imageElementIndex !== -1) {
          currentSlide.elements[imageElementIndex].properties = {
            ...currentSlide.elements[imageElementIndex].properties,
            x: newProps.x,
            y: newProps.y,
            width: newProps.width,
            height: newProps.height,
            opacity: updatedOpacity,
            shadow: updatedShadow,
            borderRadius: updatedBorderRadius,
          };
        } else {
          const imageProperties = {
            imageSrc,
            x: newProps.x,
            y: newProps.y,
            width: newProps.width,
            height: newProps.height,
            opacity: updatedOpacity,
            shadow: updatedShadow,
            borderRadius: updatedBorderRadius,
            ...(image_id && { image_id }),
          };

          currentSlide.elements.push({
            element_type: "image",
            konva_component: "Konva.Image",
            properties: imageProperties,
          });
        }
      } else if (url) {
        currentSlide.image_url = url;
        currentSlide.x = newProps.x;
        currentSlide.y = newProps.y;
        currentSlide.width = newProps.width;
        currentSlide.height = newProps.height;
        currentSlide.opacity = updatedOpacity;
        currentSlide.shadow = updatedShadow;
        currentSlide.borderRadius = updatedBorderRadius;
      }

      setSlides(newSlides);
    },
    [slides, selectedSlideIndex, url, imageSrc, image_id, imageOpacity, imageShadow, imageBorderRadius, setSlides]
  );

  const handleDragEnd = useCallback(() => {
    const node = imageRef.current;
    if (!node) return;

    const { x, y, isAtBoundary } = constrainImageToCanvas(node.x(), node.y(), node.width(), node.height(), SLIDE_WIDTH, SLIDE_HEIGHT, padding, minSize);
    node.position({ x, y });
    setLastValidPos({ x, y });
    setIsAtBoundary(isAtBoundary);

    updateSlideImage({ x, y, width: node.width(), height: node.height(), opacity: imageOpacity, shadow: imageShadow, borderRadius: imageBorderRadius });
  }, [updateSlideImage, imageOpacity, imageShadow, imageBorderRadius, SLIDE_WIDTH, SLIDE_HEIGHT]);

  const handleTransformEnd = useCallback(() => {
    const node = imageRef.current;
    if (!node) return;

    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    node.scaleX(1);
    node.scaleY(1);

    const newWidth = node.width() * scaleX;
    const newHeight = node.height() * scaleY;

    const { x, y, width, height, isAtBoundary } = constrainImageToCanvas(node.x(), node.y(), newWidth, newHeight, SLIDE_WIDTH, SLIDE_HEIGHT, padding, minSize);

    node.position({ x, y });
    node.width(width);
    node.height(height);
    setLastValidPos({ x, y });
    setIsAtBoundary(isAtBoundary);

    updateSlideImage({ x, y, width, height, opacity: imageOpacity, shadow: imageShadow, borderRadius: imageBorderRadius });
  }, [updateSlideImage, imageOpacity, imageShadow, imageBorderRadius, SLIDE_WIDTH, SLIDE_HEIGHT]);

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
        opacity={imageOpacity}
        shadowOffsetX={imageShadow.offsetX}
        shadowOffsetY={imageShadow.offsetY}
        shadowBlur={imageShadow.blur}
        shadowColor={imageShadow.color}
        cornerRadius={imageBorderRadius}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            const { x, y, width, height } = constrainImageToCanvas(newBox.x, newBox.y, newBox.width, newBox.height, SLIDE_WIDTH, SLIDE_HEIGHT, padding, minSize);
            return { ...newBox, x, y, width, height };
          }}
          rotateEnabled
          enabledAnchors={["middle-left", "middle-right", "top-left", "top-right", "bottom-left", "bottom-right"]}
        />
      )}
    </>
  );
};

export default SlideImage;