"use client";

import React, { useEffect, useRef } from "react";
import { Image as KonvaImage, Transformer } from "react-konva";
import useImage from "use-image";
import { useSlides } from "@/app/context/SlidesContext";

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

const SlideImage = ({
  url,
  imageSrc,
  x,
  y,
  width,
  height,
  isSelected,
  onSelect,
}: SlideImageProps) => {
  const [image] = useImage(imageSrc || url || "");
  const imageRef = useRef<any>(null);
  const trRef = useRef<any>(null);

  const {
    slides,
    setSlides,
    selectedSlideIndex,
    selectedImage,
    setSelectedImage,
  } = useSlides();

  useEffect(() => {
    if (isSelected && trRef.current && imageRef.current) {
      trRef.current.nodes([imageRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

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

        if (imageSrc) {
          currentSlide.elements = currentSlide.elements.filter(
            (el: any) =>
              !(
                el.element_type === "image" &&
                el.konva_component === "Konva.Image" &&
                el.properties.imageSrc === imageSrc
              )
          );
        }

        setSlides(newSlides);
        setSelectedImage(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSelected, slides, url, imageSrc, selectedSlideIndex, setSlides]);

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
        onClick={onSelect}
        onTap={onSelect}
        onMouseDown={onSelect}
        onTouchStart={onSelect}
        onTransformEnd={(e) => {
          const node = imageRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          node.scaleX(1);
          node.scaleY(1);

          const newWidth = Math.max(50, node.width() * scaleX);
          const newHeight = Math.max(50, node.height() * scaleY);
          const newX = node.x();
          const newY = node.y();

          const newSlides = JSON.parse(JSON.stringify(slides));
          const currentSlide = newSlides[selectedSlideIndex];

          // Case 1: update slide.image_url (treated like a normal image)
          if (url && !imageSrc && currentSlide.image_url === url) {
            currentSlide.image_url = url; // keep image URL the same
            setSlides(newSlides);
            setSelectedImage({
              element_type: "image",
              konva_component: "Konva.Image",
              properties: {
                x: newX,
                y: newY,
                width: newWidth,
                height: newHeight,
                imageSrc: url,
              },
            });
            return;
          }

          // Case 2: update image element
          const imageElement = currentSlide.elements.find(
            (el: any) =>
              el.element_type === "image" &&
              el.konva_component === "Konva.Image" &&
              el.properties.imageSrc === imageSrc
          );

          if (imageElement) {
            imageElement.properties.width = newWidth;
            imageElement.properties.height = newHeight;
            imageElement.properties.x = newX;
            imageElement.properties.y = newY;

            setSlides(newSlides);
            setSelectedImage(imageElement);
          }
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 50 || newBox.height < 50) return oldBox;
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
