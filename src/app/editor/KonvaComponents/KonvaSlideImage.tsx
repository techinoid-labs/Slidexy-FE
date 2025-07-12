"use client";

import React, { useEffect, useRef } from "react";
import { Image as KonvaImage, Transformer } from "react-konva";
import useImage from "use-image";
import { useSlides } from "@/app/context/SlidesContext";

interface SlideImageProps {
  url?: string; // from slide.image_url
  imageSrc?: string; // from element.properties.imageSrc
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

  const { slides, setSlides, selectedSlideIndex } = useSlides();

  useEffect(() => {
    if (isSelected && trRef.current && imageRef.current) {
      trRef.current.nodes([imageRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === "Delete" || e.key === "Backspace") && isSelected) {
        const newSlides = JSON.parse(JSON.stringify(slides));
        const currentSlide = newSlides[selectedSlideIndex];

        // Case 1: remove image_url
        if (url && !imageSrc) {
          currentSlide.image_url = null;
        }

        // Case 2: remove matching image element
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
        onTransformEnd={(e) => {
          const node = imageRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          node.scaleX(1);
          node.scaleY(1);
          node.width(Math.max(50, node.width() * scaleX));
          node.height(Math.max(50, node.height() * scaleY));
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
