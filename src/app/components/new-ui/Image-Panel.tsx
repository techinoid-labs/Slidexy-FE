"use client";

import React, { useState, useRef } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import OpacityPanel from "./Opacity-Panel";
import { useSlides } from "@/app/context/SlidesContext";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";
import { removeBackground } from "@imgly/background-removal";
import { CircularProgress } from "@mui/material";

interface ImageSettingsPanelMobileProps {
  onClose: () => void;
  style: React.CSSProperties;
  resetAll?: () => void;
}

const ImageSettingsPanelMobile: React.FC<ImageSettingsPanelMobileProps> = ({
  onClose,
  style,
}) => {
  const {
    slides,
    selectedImageIndex,
    selectedSlideIndex,
    setSlides,
    selectedImage,
    setSelectedImage,
    setSelectedImageIndex,
    bringElementForward,
    sendElementBackward,
  } = useSlides();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [imageSrc, setImageSrc] = useState<string>(
    selectedImage?.properties?.imageSrc || "/sample-content-image.jpg"
  );
  const [isOpacityPanelOpen, setIsOpacityPanelOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Get the selected image object
  let imageObj: any = null;
  if (
    selectedSlideIndex !== -1 &&
    slides[selectedSlideIndex] &&
    selectedImageIndex !== null
  ) {
    imageObj = slides[selectedSlideIndex].elements[selectedImageIndex];
  }

  // If no valid image is selected, render nothing
  if (!imageObj || imageObj.element_type !== "image") return null;

  const rawProps = imageObj.properties || {};
  const opacity = rawProps.opacity ?? 1;
  const originalX = rawProps.x ?? 0;
  const originalY = rawProps.y ?? 0;
  const width = rawProps.width ?? 200;
  const height = rawProps.height ?? 190;
  const slideIndex = selectedSlideIndex;

  const updateImageProperty = (prop: string, value: any) => {
    if (!imageObj || selectedSlideIndex === -1 || selectedImageIndex === null)
      return;
    const updatedSlides = structuredClone(slides);
    const target: any =
      updatedSlides[selectedSlideIndex].elements[selectedImageIndex].properties;

    if (target) {
      target[prop] = value;
    }
    setSlides(updatedSlides);
  };

  const handleDuplicateImage = () => {
    if (!imageObj || selectedSlideIndex === -1 || selectedImageIndex === null)
      return;

    const currentSlide = slides[selectedSlideIndex];
    const elements = [...currentSlide.elements];

    const originalElement = elements[selectedImageIndex];

    const newElement = {
      ...structuredClone(originalElement),
      id: `el-${selectedSlideIndex}-${uuidv4()}`,
      properties: {
        ...structuredClone(originalElement.properties),
        x: (originalElement.properties?.x || 0) + 20,
        y: (originalElement.properties?.y || 0) + 20,
      },
    };

    elements.splice(selectedImageIndex + 1, 0, newElement);

    const updatedSlide = {
      ...currentSlide,
      elements,
    };

    const updatedSlides = [...slides];
    updatedSlides[selectedSlideIndex] = updatedSlide;

    setSlides(updatedSlides);
    setSelectedImage(newElement);
    setSelectedImageIndex(selectedImageIndex + 1);
  };

  const handleDeleteImage = () => {
    if (selectedSlideIndex === -1 || selectedImageIndex === null) return;
    const updatedSlides = structuredClone(slides);
    updatedSlides[selectedSlideIndex].elements.splice(selectedImageIndex, 1);
    setSlides(updatedSlides);
    onClose(); // Close the panel after deletion
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setImageSrc(result);

      if (
        selectedSlideIndex === null ||
        selectedImageIndex === null ||
        !slides[selectedSlideIndex]?.elements[selectedImageIndex]
      )
        return;

      const updatedSlides = JSON.parse(JSON.stringify(slides));
      updatedSlides[selectedSlideIndex].elements[
        selectedImageIndex
      ].properties.imageSrc = result;
      setSlides(updatedSlides);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveBackground = async () => {
    if (!imageObj || !imageObj.properties?.imageSrc) return;

    setIsLoading(true);

    try {
      const response = await fetch(imageObj.properties.imageSrc);
      const blob = await response.blob();

      const result = await removeBackground(blob, {
        output: {
          format: "image/png",
          quality: 0.8,
        },
      });

      const reader = new FileReader();
      reader.onloadend = () => {
        const resultUrl = reader.result as string;
        setImageSrc(resultUrl);

        if (
          selectedSlideIndex !== null &&
          selectedImageIndex !== null &&
          slides[selectedSlideIndex]?.elements[selectedImageIndex]
        ) {
          const updatedSlides = JSON.parse(JSON.stringify(slides));
          updatedSlides[selectedSlideIndex].elements[
            selectedImageIndex
          ].properties.imageSrc = resultUrl;
          setSlides(updatedSlides);
        }

        setIsLoading(false);
      };

      reader.readAsDataURL(result);
    } catch (error) {
      console.error("Error removing background:", error);
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: 60,
        bgcolor: "#fff",
        borderTop: "1px solid #E0E0E0",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        py: 1.2,
        overflow: "auto",
        zIndex: 3,
        boxSizing: "border-box",
        position: "fixed",
        bottom: 83,
        paddingLeft: 3,
        paddingRight: 3,
        left: 0,
        gap: 1.5,
      }}
    >
      {/* Duplicate Button */}
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <IconButton
          onClick={handleDuplicateImage}
          sx={{
            color: "#222",
            backgroundColor: "#F8F8FA",
            padding: "2px",
            width: 32,
            height: 30,
            mb: 0.2,
          }}
        >
          <img
            src="/duplicate-icon.svg"
            alt="duplicate"
            style={{ width: 15, height: 15 }}
          />
        </IconButton>
        <Typography
          sx={{
            fontSize: "9px",
            color: "#222",
            textTransform: "none",
            letterSpacing: "0.5px",
            marginBottom: 0.5,
          }}
        >
          Duplicate
        </Typography>
      </Box>

      {/* Delete Button */}
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <IconButton
          onClick={handleDeleteImage}
          sx={{
            color: "#C00",
            backgroundColor: "#F8F8FA",
            padding: "2px",
            width: 32,
            height: 30,
            mb: 0.2,
          }}
        >
          <img
            src="/delete-icon.svg"
            alt="delete"
            style={{ width: 15, height: 15 }}
          />
        </IconButton>
        <Typography
          sx={{
            fontSize: "9px",
            color: "#222",
            textTransform: "none",
            letterSpacing: "0.5px",
            marginBottom: 0.5,
          }}
        >
          Delete
        </Typography>
      </Box>

      {/* Replace Button */}
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <IconButton
          onClick={() => fileInputRef.current?.click()}
          sx={{
            color: "#222",
            backgroundColor: "#F8F8FA",
            padding: "2px",
            width: 32,
            height: 30,
            mb: 0.2,
          }}
        >
          <img
            src="/replace.svg"
            alt="replace"
            style={{ width: 15, height: 15 }}
          />
        </IconButton>
        <Typography
          sx={{
            fontSize: "9px",
            color: "#222",
            textTransform: "none",
            letterSpacing: "0.5px",
            marginBottom: 0.5,
          }}
        >
          Replace
        </Typography>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={handleImageChange}
        />
      </Box>

      {/* Background Remover Button */}
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <IconButton
          onClick={handleRemoveBackground}
          sx={{
            color: "#222",
            backgroundColor: "#F8F8FA",
            padding: "2px",
            width: 32,
            height: 30,
            mb: 0.2,
          }}
          disabled={isLoading}
        >
          {isLoading ? (
            <CircularProgress size={15} sx={{ color: "#222" }} />
          ) : (
            <img
              src="/bg-remove.svg"
              alt="remove-bg"
              style={{ width: 15, height: 15 }}
            />
          )}
        </IconButton>
        <Typography
          sx={{
            fontSize: "9px",
            color: "#222",
            textTransform: "none",
            letterSpacing: "0.5px",
            marginBottom: 0.5,
            whiteSpace: "nowrap",
          }}
        >
          BG Remover
        </Typography>
      </Box>
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <IconButton
          onClick={() => bringElementForward(selectedImageIndex)}
          sx={{
            color: "#C00",
            backgroundColor: "#F8F8FA",
            padding: "2px",
            width: 32,
            height: 30,
            mb: 0.2,
          }}
        >
          <img
            src="/forward.svg"
            alt="delete"
            style={{ width: 15, height: 15, stroke: "#000000" }}
          />
        </IconButton>
        <Typography
          sx={{
            fontSize: "9px",
            color: "#222",
            textTransform: "none",
            letterSpacing: "0.5px",
            marginBottom: 0.5,
          }}
        >
          Forward
        </Typography>
      </Box>
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <IconButton
          onClick={() => sendElementBackward(selectedImageIndex)}
          sx={{
            color: "#C00",
            backgroundColor: "#F8F8FA",
            padding: "2px",
            width: 32,
            height: 30,
            mb: 0.2,
          }}
        >
          <img
            src="/backward.svg"
            alt="delete"
            style={{ width: 15, height: 15, stroke: "#000000" }}
          />
        </IconButton>
        <Typography
          sx={{
            fontSize: "9px",
            color: "#222",
            textTransform: "none",
            letterSpacing: "0.5px",
            marginBottom: 0.5,
          }}
        >
          Backward
        </Typography>
      </Box>
    </Box>
  );
};

export default ImageSettingsPanelMobile;
