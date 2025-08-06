"use client";

import React, { useEffect, useRef, useCallback, useState } from "react";
import { Image as KonvaImage, Transformer } from "react-konva";
import useImage from "use-image";
import { useSlides } from "@/app/context/SlidesContext";
import { constrainImageToCanvas, getSlideDimensions } from "../../../utils/slideUtilsmobile";

interface SlideImageProps {
  url?: string;
  imageSrc?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isSelected: boolean;
  onSelect: () => void;
}

const SlideImage: React.FC<SlideImageProps> = ({
  url,
  imageSrc,
  x,
  y,
  width,
  height,
  isSelected,
  onSelect,
}) => {
  const [image] = useImage(imageSrc || url || "");
  const imageRef = useRef<any>(null);
  const trRef = useRef<any>(null);
  const { slides, setSlides, selectedSlideIndex, setSelectedImage, setIsAtBoundary } = useSlides();
  const [lastValidPos, setLastValidPos] = useState({ x, y });

  // Attach transformer when image is selected
  useEffect(() => {
    if (isSelected && trRef.current && imageRef.current) {
      //console.log("[SlideImage] Attaching transformer to image node:", { isSelected });
      trRef.current.nodes([imageRef.current]);
      trRef.current.getLayer()?.batchDraw();
    } else if (!isSelected && trRef.current) {
      //console.log("[SlideImage] Detaching transformer from image node:", { isSelected });
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
        console.log("[SlideImage] Delete key pressed, removing image");
        if (!slides?.length || selectedSlideIndex < 0) return;

        const newSlides = structuredClone(slides);
        const currentSlide = newSlides[selectedSlideIndex];

        if (!currentSlide) return;

        if (url && !imageSrc) {
          currentSlide.image_url = null;
          //console.log("[SlideImage] Cleared slide.image_url");
        }

        if (imageSrc) {
          currentSlide.elements = currentSlide.elements.filter(
            (el: any) =>
              !(
                el.element_type === "image" &&
                el.konva_component === "Konva.Image" &&
                el.properties.imageSrc === imageSrc
              )
          );
          //console.log("[SlideImage] Removed image element from slide.elements");
        }

        setSlides(newSlides);
        setSelectedImage(null);
        //console.log("[SlideImage] Dispatched updated slides and cleared selected image");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    //console.log("[SlideImage] Keydown listener added");
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      //console.log("[SlideImage] Keydown listener removed");
    };
  }, [isSelected, slides, url, imageSrc, selectedSlideIndex, setSlides, setSelectedImage]);

  // Handle drag end with boundary constraints
  const handleDragEnd = useCallback(
    (e: any) => {
      const node = imageRef.current;
      if (!node) {
        //console.log("[SlideImage] handleDragEnd: No image node found");
        return;
      }

      const { SLIDE_WIDTH, SLIDE_HEIGHT } = getSlideDimensions();
      const { x: newX, y: newY, isAtBoundary } = constrainImageToCanvas(
        node.x(),
        node.y(),
        node.width(),
        node.height(),
        SLIDE_WIDTH,
        SLIDE_HEIGHT
      );

      if (isAtBoundary) {
        //console.log("[SlideImage] Snapping back to last valid position:", lastValidPos);
        node.position({ x: lastValidPos.x, y: lastValidPos.y });
      } else {
        //console.log("[SlideImage] Updating position to:", { newX, newY });
        node.position({ x: newX, y: newY });
        setLastValidPos({ x: newX, y: newY });
      }

      setIsAtBoundary(isAtBoundary);

      // Update slide state
      const newSlides = structuredClone(slides);
      const currentSlide = newSlides[selectedSlideIndex];

      if (url && !imageSrc && currentSlide.image_url === url) {
        currentSlide.image_url = url;
        setSlides(newSlides);
        setSelectedImage({
          element_type: "image",
          konva_component: "Konva.Image",
          properties: {
            x: newX,
            y: newY,
            width: node.width(),
            height: node.height(),
            imageSrc: url,
          },
        });
        //console.log("[SlideImage] Updated slide.image_url position");
        return;
      }

      const imageElement = currentSlide.elements.find(
        (el: any) =>
          el.element_type === "image" &&
          el.konva_component === "Konva.Image" &&
          el.properties.imageSrc === imageSrc
      );

      if (imageElement) {
        imageElement.properties.x = newX;
        imageElement.properties.y = newY;
        setSlides(newSlides);
        setSelectedImage(imageElement);
        console.log("[SlideImage] Updated image element position");
      }

      node.getLayer()?.batchDraw();
      console.log("[SlideImage] Canvas redrawn after drag end");
    },
    [slides, selectedSlideIndex, url, imageSrc, setSlides, setSelectedImage, setIsAtBoundary, lastValidPos]
  );

  // Handle transform end with boundary constraints
  const handleTransformEnd = useCallback(() => {
    const node = imageRef.current;
    if (!node) {
      console.log("[SlideImage] handleTransformEnd: No image node found");
      return;
    }

    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    node.scaleX(1);
    node.scaleY(1);

    const newWidth = node.width() * scaleX;
    const newHeight = node.height() * scaleY;
    const currentX = node.x();
    const currentY = node.y();

    const { SLIDE_WIDTH, SLIDE_HEIGHT } = getSlideDimensions();
    const { x: constrainedX, y: constrainedY, width: constrainedWidth, height: constrainedHeight, isAtBoundary } =
      constrainImageToCanvas(currentX, currentY, newWidth, newHeight, SLIDE_WIDTH, SLIDE_HEIGHT);

    console.log("[SlideImage] handleTransformEnd:", {
      newWidth,
      newHeight,
      constrainedX,
      constrainedY,
      constrainedWidth,
      constrainedHeight,
      isAtBoundary,
    });

    // Apply constrained values
    node.position({ x: constrainedX, y: constrainedY });
    node.width(constrainedWidth);
    node.height(constrainedHeight);

    setIsAtBoundary(isAtBoundary);

    // Update slide state
    const newSlides = structuredClone(slides);
    const currentSlide = newSlides[selectedSlideIndex];

    if (url && !imageSrc && currentSlide.image_url === url) {
      currentSlide.image_url = url;
      setSlides(newSlides);
      setSelectedImage({
        element_type: "image",
        konva_component: "Konva.Image",
        properties: {
          x: constrainedX,
          y: constrainedY,
          width: constrainedWidth,
          height: constrainedHeight,
          imageSrc: url,
        },
      });
      console.log("[SlideImage] Updated slide.image_url properties");
      return;
    }

    const imageElement = currentSlide.elements.find(
      (el: any) =>
        el.element_type === "image" &&
        el.konva_component === "Konva.Image" &&
        el.properties.imageSrc === imageSrc
    );

    if (imageElement) {
      imageElement.properties.x = constrainedX;
      imageElement.properties.y = constrainedY;
      imageElement.properties.width = constrainedWidth;
      imageElement.properties.height = constrainedHeight;
      setSlides(newSlides);
      setSelectedImage(imageElement);
      console.log("[SlideImage] Updated image element properties");
    }

    node.getLayer()?.batchDraw();
    console.log("[SlideImage] Canvas redrawn after transform end");
  }, [slides, selectedSlideIndex, url, imageSrc, setSlides, setSelectedImage, setIsAtBoundary]);

  return (
    <>
      <KonvaImage
        ref={imageRef}
        image={image}
        x={x}
        y={y}
        zIndex={1}
        width={width}
        height={height}
        draggable
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
            const { x, y, width, height, isAtBoundary } = constrainImageToCanvas(
              newBox.x,
              newBox.y,
              newBox.width,
              newBox.height,
              getSlideDimensions().SLIDE_WIDTH,
              getSlideDimensions().SLIDE_HEIGHT
            );
            setIsAtBoundary(isAtBoundary);
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