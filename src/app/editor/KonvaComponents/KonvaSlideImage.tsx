import React, { useEffect, useRef, useCallback, useState } from "react";
import { Image as KonvaImage, Transformer } from "react-konva";
import useImage from "use-image";
import { useSlides } from "@/app/context/SlidesContext";
import {
  constrainImageToCanvas,
  getSlideDimensions,
} from "../../../utils/slideUtils";

interface SlideImageProps {
  image_id?: string; // Add image_id prop, optional to preserve url-based background images
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
  image_id, // Add image_id
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
            (el: any) => el.image_id !== image_id // Use image_id for filtering
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
    image_id, // Add image_id to dependencies
    selectedSlideIndex,
    setSlides,
    setSelectedImage,
  ]);

  // Handle drag end with boundary constraints
  const handleDragEnd = useCallback(
    (e: any) => {
      const node = imageRef.current;
      if (!node) return;

      const { SLIDE_WIDTH, SLIDE_HEIGHT } = getSlideDimensions();
      const {
        x: newX,
        y: newY,
        isAtBoundary,
      } = constrainImageToCanvas(
        node.x(),
        node.y(),
        node.width(),
        node.height(),
        SLIDE_WIDTH,
        SLIDE_HEIGHT
      );

      if (isAtBoundary) {
        node.position({ x: lastValidPos.x, y: lastValidPos.y });
      } else {
        node.position({ x: newX, y: newY });
        setLastValidPos({ x: newX, y: newY });
      }

      setIsAtBoundary(isAtBoundary);

      const newSlides = JSON.parse(JSON.stringify(slides));
      const currentSlide = newSlides[selectedSlideIndex];

      if (url && !imageSrc && currentSlide.image_url === url) {
        currentSlide.image_url = url;
        setSlides(newSlides);
        setSelectedImage({
          element_type: "image",
          konva_component: "Konva.Image",
          image_id, // Include image_id
          properties: {
            x: newX,
            y: newY,
            width: node.width(),
            height: node.height(),
            imageSrc: url,
          },
        });
        return;
      }

      const imageElement = currentSlide.elements.find(
        (el: any) =>
          el.element_type === "image" &&
          el.konva_component === "Konva.Image" &&
          el.image_id === image_id // Use image_id
      );

      if (imageElement) {
        imageElement.properties.x = newX;
        imageElement.properties.y = newY;
        setSlides(newSlides);
        setSelectedImage({ ...imageElement, image_id }); // Include image_id
      }

      node.getLayer()?.batchDraw();
    },
    [
      slides,
      selectedSlideIndex,
      url,
      imageSrc,
      image_id, // Add image_id to dependencies
      setSlides,
      setSelectedImage,
      setIsAtBoundary,
      lastValidPos,
    ]
  );

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
    const currentX = node.x();
    const currentY = node.y();

    const { SLIDE_WIDTH, SLIDE_HEIGHT } = getSlideDimensions();
    const {
      x: constrainedX,
      y: constrainedY,
      width: constrainedWidth,
      height: constrainedHeight,
      isAtBoundary,
    } = constrainImageToCanvas(
      currentX,
      currentY,
      newWidth,
      newHeight,
      SLIDE_WIDTH,
      SLIDE_HEIGHT
    );

    node.position({ x: constrainedX, y: constrainedY });
    node.width(constrainedWidth);
    node.height(constrainedHeight);

    setIsAtBoundary(isAtBoundary);

    const newSlides = JSON.parse(JSON.stringify(slides));
    const currentSlide = newSlides[selectedSlideIndex];

    if (url && !imageSrc && currentSlide.image_url === url) {
      currentSlide.image_url = url;
      setSlides(newSlides);
      setSelectedImage({
        element_type: "image",
        konva_component: "Konva.Image",
        image_id, // Include image_id
        properties: {
          x: constrainedX,
          y: constrainedY,
          width: constrainedWidth,
          height: constrainedHeight,
          imageSrc: url,
        },
      });
      return;
    }

    const imageElement = currentSlide.elements.find(
      (el: any) =>
        el.element_type === "image" &&
        el.konva_component === "Konva.Image" &&
        el.image_id === image_id // Use image_id
    );

    if (imageElement) {
      imageElement.properties.x = constrainedX;
      imageElement.properties.y = constrainedY;
      imageElement.properties.width = constrainedWidth;
      imageElement.properties.height = constrainedHeight;
      setSlides(newSlides);
      setSelectedImage({ ...imageElement, image_id }); // Include image_id
    }

    node.getLayer()?.batchDraw();
  }, [
    slides,
    selectedSlideIndex,
    url,
    imageSrc,
    image_id, // Add image_id to dependencies
    setSlides,
    setSelectedImage,
    setIsAtBoundary,
  ]);

  return (
    <>
      <KonvaImage
        ref={imageRef}
        id={image_id} // Use image_id for Konva node ID, fallback to imageSrc or url
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
      {isSelected
       && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            const { x, y, width, height, isAtBoundary } =
              constrainImageToCanvas(
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