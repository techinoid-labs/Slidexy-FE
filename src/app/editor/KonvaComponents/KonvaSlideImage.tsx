import React, { useEffect, useRef, useCallback, useState } from "react";
import { Image as KonvaImage, Transformer } from "react-konva";
import useImage from "use-image";
import { useSlides } from "@/app/context/SlidesContext";
import { constrainImageToCanvas, getSlideDimensions } from "../../../utils/slideUtils";
import { v4 as uuidv4 } from "uuid";

interface SlideImageProps {
  image_id: string;
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
  onSelect: (e: any) => void;
}

const SlideImage: React.FC<SlideImageProps> = ({
  image_id,
  url,
  imageSrc,
  x,
  y,
  width: initialWidth,
  height: initialHeight,
  opacity,
  shadow,
  borderRadius,
  isSelected,
  zIndex,
  onSelect,
}) => {
  const imageOpacity = opacity ?? 1;
  const imageShadow = shadow ?? { offsetX: 0, offsetY: 0, blur: 0, color: "#000000" };
  const imageBorderRadius = borderRadius ?? 0;
  const [image] = useImage(imageSrc || url || "", "anonymous");
  const imageRef = useRef<any>(null);
  const trRef = useRef<any>(null);
  const { slides, setSlides, selectedSlideIndex, setSelectedImage, setIsAtBoundary, setSelectedImageIndex } = useSlides();
  const [lastValidPos, setLastValidPos] = useState({ x, y });
  const [dimensions, setDimensions] = useState({ width: initialWidth, height: initialHeight });
  const { SLIDE_WIDTH, SLIDE_HEIGHT } = getSlideDimensions();
  const minSize = { width: 50, height: 50 };
  const padding = { left: 10, right: 10, top: 10, bottom: 10 };

  // Sync dimensions with props when they change
  useEffect(() => {
    setDimensions({ width: initialWidth, height: initialHeight });
  }, [initialWidth, initialHeight]);

  // Attach Transformer to selected image
  useEffect(() => {
    if (isSelected && trRef.current && imageRef.current) {
      trRef.current.nodes([imageRef.current]);
      trRef.current.getLayer()?.batchDraw();
    } else if (!isSelected && trRef.current) {
      trRef.current.nodes([]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  // Update image properties (opacity, shadow, borderRadius)
  useEffect(() => {
    if (imageRef.current && image) {
      imageRef.current.opacity(imageOpacity);
      imageRef.current.shadowOffsetX(imageShadow.offsetX);
      imageRef.current.shadowOffsetY(imageShadow.offsetY);
      imageRef.current.shadowBlur(imageShadow.blur);
      imageRef.current.shadowColor(imageShadow.color);
      imageRef.current.cornerRadius(imageBorderRadius);
      imageRef.current.width(dimensions.width);
      imageRef.current.height(dimensions.height);
      imageRef.current.getLayer()?.batchDraw();
    }
  }, [image, imageOpacity, imageShadow, imageBorderRadius, dimensions]);

  // Handle delete key
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
        const newSlides = structuredClone(slides);
        const currentSlide = newSlides[selectedSlideIndex];
        if (!currentSlide) return;
        if (url && !imageSrc) {
          currentSlide.image_url = null;
        }
        if (imageSrc && image_id) {
          currentSlide.elements = currentSlide.elements?.filter(
            (el: any) => el.properties?.image_id !== image_id
          ) || [];
        }
        setSlides(newSlides);
        console.log("this is new slides", newSlides);
        setSelectedImage(null);
        setSelectedImageIndex(null);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isSelected, slides, url, imageSrc, image_id, selectedSlideIndex, setSlides, setSelectedImage, setSelectedImageIndex]);

  const updateSlideImage = useCallback(
    (newProps: {
      x: number;
      y: number;
      width: number;
      height: number;
      opacity?: number;
      shadow?: any;
      borderRadius?: number;
      image_id?: string;
    }) => {
      if (!slides?.length || selectedSlideIndex < 0) return;
      const newSlides = structuredClone(slides);
      const currentSlide = newSlides[selectedSlideIndex];
      if (!currentSlide) return;
      const updatedOpacity = newProps.opacity !== undefined ? newProps.opacity : imageOpacity;
      const updatedShadow = newProps.shadow !== undefined ? newProps.shadow : imageShadow;
      const updatedBorderRadius = newProps.borderRadius !== undefined ? newProps.borderRadius : imageBorderRadius;
      const effectiveImageId = image_id || uuidv4(); // Generate if missing
      // ✅ FIX: Always initialize elements array to prevent undefined errors/duplicates
      currentSlide.elements = currentSlide.elements || [];
      if (imageSrc && effectiveImageId) {
        // ✅ FIX: Safe findIndex with optional chaining
        const imageElementIndex = currentSlide.elements.findIndex(
          (el: any) => el?.properties?.image_id === effectiveImageId
        );
        if (imageElementIndex !== -1) {
          const element = currentSlide.elements[imageElementIndex];
          element.properties = {
            ...element.properties,
            image_id: effectiveImageId,
            x: newProps.x,
            y: newProps.y,
            width: newProps.width,
            height: newProps.height,
            opacity: updatedOpacity,
            shadow: updatedShadow,
            borderRadius: updatedBorderRadius,
          };
          setSelectedImage({
            ...element,
            konva_component: element.konva_component || "Konva.Image",
            element_type: element.element_type || "image",
            properties: { ...element.properties },
          });
        } else {
          // ✅ IMPROVE: Log for debugging (remove in prod if no issues)
          console.warn(`[SlideImage] Image not found by ID ${effectiveImageId}, adding new (potential race—check addImage sync)`);
          const imageProperties = {
            image_id: effectiveImageId,
            imageSrc,
            x: newProps.x,
            y: newProps.y,
            width: newProps.width,
            height: newProps.height,
            opacity: updatedOpacity,
            shadow: updatedShadow,
            borderRadius: updatedBorderRadius,
          };
          currentSlide.elements.push({
            element_type: "image",
            konva_component: "Konva.Image",
            properties: imageProperties,
          });
          setSelectedImage({
            element_type: "image",
            konva_component: "Konva.Image",
            properties: imageProperties,
          });
        }
      } else if (url) {
        currentSlide.image_id = effectiveImageId;
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
      setDimensions({ width: newProps.width, height: newProps.height });
      console.log("[KonvaSlideImage] Updated slide with new image properties:", newProps, "effective image_id:", effectiveImageId);
    },
    [slides, selectedSlideIndex, url, imageSrc, image_id, imageOpacity, imageShadow, imageBorderRadius, setSlides, setSelectedImage]
  );

  const handleDragEnd = useCallback(() => {
    const node = imageRef.current;
    if (!node) return;
    const { x, y, isAtBoundary } = constrainImageToCanvas(node, SLIDE_WIDTH, SLIDE_HEIGHT, padding);
    node.position({ x, y });
    setLastValidPos({ x, y });
    setIsAtBoundary(isAtBoundary);
    updateSlideImage({ x, y, width: node.width(), height: node.height() });
  }, [updateSlideImage, SLIDE_WIDTH, SLIDE_HEIGHT, padding]);

  const handleTransformEnd = useCallback(() => {
    const node = imageRef.current;
    if (!node) return;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    node.scaleX(1);
    node.scaleY(1);
    const newWidth = Math.max(minSize.width, node.width() * scaleX);
    const newHeight = Math.max(minSize.height, node.height() * scaleY);
    node.width(newWidth);
    node.height(newHeight);
    const { x, y, isAtBoundary } = constrainImageToCanvas(node, SLIDE_WIDTH, SLIDE_HEIGHT, padding);
    node.position({ x, y });
    setLastValidPos({ x, y });
    setIsAtBoundary(isAtBoundary);
    updateSlideImage({ x, y, width: newWidth, height: newHeight });
  }, [updateSlideImage, SLIDE_WIDTH, SLIDE_HEIGHT, padding, minSize]);

  return (
    <>
      <KonvaImage
        ref={imageRef}
        id={image_id}
        image={image}
        x={x}
        y={y}
        zIndex={zIndex}
        width={dimensions.width}
        height={dimensions.height}
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
            if (newBox.width < minSize.width || newBox.height < minSize.height) {
              return oldBox;
            }
            return newBox;
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