"use client";

import React, { useState } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import OpacityPanel from "./Opacity-Panel";
import { useSlides } from "@/app/context/SlidesContext";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";

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
  } = useSlides();

  // Get the selected image object
  let imageObj: any = null;
  if (
    selectedSlideIndex !== -1 &&
    slides[selectedSlideIndex] &&
    selectedImageIndex !== null
  ) {
    imageObj = slides[selectedSlideIndex].elements[selectedImageIndex];
  }

  // If no valid image is selected, return null
  if (!imageObj || imageObj.element_type !== "image") return null;

  const rawProps = imageObj.properties || {};
  const opacity = rawProps.opacity ?? 1;
  const originalX = rawProps.x ?? 0;
  const originalY = rawProps.y ?? 0;
  const width = rawProps.width ?? 200;
  const height = rawProps.height ?? 190;

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

    const updatedSlides = structuredClone(slides);
    const elements = updatedSlides[selectedSlideIndex].elements;

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
    setSlides(updatedSlides);
  };

  const handleDeleteImage = () => {
    if (selectedSlideIndex === -1 || selectedImageIndex === null) return;
    const updatedSlides = structuredClone(slides);
    updatedSlides[selectedSlideIndex].elements.splice(selectedImageIndex, 1);
    setSlides(updatedSlides);
    onClose(); // Close the panel after deletion
  };

  const [isOpacityPanelOpen, setIsOpacityPanelOpen] = useState(false);

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
        paddingLeft: 22,
        paddingRight: 3,
        left: 0,
        gap: 2,
      }}
    >
      {/* Opacity Button */}
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <IconButton
          onClick={() => setIsOpacityPanelOpen(!isOpacityPanelOpen)}
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
            src="/opacity-icon.svg"
            alt="opacity"
            style={{ width: 15, height: 15 }}
          />
        </IconButton>
        <Typography
          sx={{
            fontSize: "9px",
            color: "#222",
            textTransform: "none",
            letterSpacing: "0.5px",
            marginBottom: 5,
          }}
        >
          Opacity
        </Typography>
      </Box>
      {isOpacityPanelOpen && (
        <OpacityPanel
          opacity={opacity}
          onOpacityChange={(newOpacity) =>
            updateImageProperty("opacity", newOpacity)
          }
          onClose={() => setIsOpacityPanelOpen(false)}
        />
      )}

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
    </Box>
  );
};

export default ImageSettingsPanelMobile;
