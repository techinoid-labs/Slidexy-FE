"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Divider,
  Typography,
  IconButton,
  InputBase,
  CircularProgress,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { v4 as uuidv4 } from "uuid";
import { removeBackground } from "@imgly/background-removal";
import CropModal from "./../new-ui/CropModal";
import { useSlides } from "@/app/context/SlidesContext";

const ImageSettingsPanel: React.FC<{ sidebarHeight?: string | number }> = ({
  sidebarHeight,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const {
    selectedImage,
    selectedImageIndex,
    selectedSlideIndex,
    slides,
    setSlides,
    bringElementForward,
    sendElementBackward,
    setSelectedImage,
    setSelectedImageIndex,
  } = useSlides();

   const [imageWidth, setImageWidth] = useState<number>(
      selectedImage?.properties?.width || 0
    );
    const [imageHeight, setImageHeight] = useState<number>(
      selectedImage?.properties?.height || 0
    );
    const [isBackground, setIsBackground] = useState<boolean>(
      selectedImage?.properties?.isBackground || false
    );
    const [imageSrc, setImageSrc] = useState<string>(
      selectedImage?.properties?.imageSrc || "/sample-content-image.jpg"
    );
  const [isLoading, setIsLoading] = useState(false);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  useEffect(() => {
    if (selectedImage) {
      setImageWidth(selectedImage?.properties?.width || 0);
      setImageHeight(selectedImage?.properties?.height || 0);
      setIsBackground(selectedImage?.properties?.isBackground || false);
      setImageSrc(
        selectedImage?.properties?.imageSrc || "/sample-content-image.jpg"
      );
    }
  }, [selectedImage]);
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (
        selectedSlideIndex === null ||
        selectedImageIndex === null ||
        !slides[selectedSlideIndex]?.elements[selectedImageIndex]
      )
        return;

      const updatedSlides = JSON.parse(JSON.stringify(slides));
      const element =
        updatedSlides[selectedSlideIndex].elements[selectedImageIndex];

      if (!isNaN(imageWidth)) {
        element.properties.width = imageWidth;
      }

      if (!isNaN(imageHeight)) {
        element.properties.height = imageHeight;
      }

      setSlides(updatedSlides);
    }, 400);

    return () => clearTimeout(timeout);
  }, [imageWidth, imageHeight]);
  const handleDuplicateImage = () => {
    if (!selectedImage || selectedSlideIndex === -1 || selectedImageIndex === null)
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
    const updatedSlide = { ...currentSlide, elements };
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
  };

 

 const handleRemoveBackground = async () => {
  if (!selectedImage?.properties?.imageSrc) return;
  setIsLoading(true);

  try {
    const response = await fetch(selectedImage.properties.imageSrc);
    const blob = await response.blob();

    const result = await removeBackground(blob, {
      output: { format: "image/png", quality: 0.8 },
    });

    const reader = new FileReader();
    reader.onloadend = () => {
      const resultUrl = reader.result as string;
      if (
        selectedSlideIndex !== null &&
        selectedImageIndex !== null &&
        slides[selectedSlideIndex]?.elements[selectedImageIndex]
      ) {
        const updatedSlides = structuredClone(slides);
        updatedSlides[selectedSlideIndex].elements[selectedImageIndex]
          .properties.imageSrc = resultUrl; 
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


  const updateImageProperty = (prop: string, value: any) => {
    if (selectedSlideIndex === -1 || selectedImageIndex === null) return;
    const updatedSlides = structuredClone(slides);
    const target =
      updatedSlides[selectedSlideIndex].elements[selectedImageIndex].properties;
    if (target) target[prop] = value;
    setSlides(updatedSlides);
  };

   const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     const val = e.target.value;
     setImageWidth(val === "" ? NaN : Number(val));
   };
 
   const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     const val = e.target.value;
     setImageHeight(val === "" ? NaN : Number(val));
   };
 
   const handleSwitchChange = () => {
     const newVal = !isBackground;
     setIsBackground(newVal);
 
     if (
       selectedSlideIndex === null ||
       selectedImageIndex === null ||
       !slides[selectedSlideIndex]?.elements[selectedImageIndex]
     )
       return;
 
     const updatedSlides = JSON.parse(JSON.stringify(slides));
     updatedSlides[selectedSlideIndex].elements[
       selectedImageIndex
     ].properties.isBackground = newVal;
     setSlides(updatedSlides);
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


  return (
    <Box className="w-[360px] min-w-[320px] bg-white flex flex-col overflow-y-auto border-r border-gray-200">
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", px: 2, pt: 2 }}>
        <Typography sx={{ fontWeight: 600, fontSize: 16, color: "#000" }}>
          Image Settings
        </Typography>
      </Box>
      {/* Size */}
      <Divider sx={{ my: 2 }} />
      <Box sx={{ px: 3, mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Typography
            sx={{ fontWeight: 500, fontSize: 16, flex: 1, color: "#454545" }}
          >
            Size
          </Typography>
          <IconButton size="small">
            <ArrowDropDownIcon />
          </IconButton>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 5, mb: 1 }}>
          {/* Width */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="caption" sx={{ fontSize: 20 }}>
              W
            </Typography>
            <Box
              sx={{
                bgcolor: "#fff",
                border: "1px solid #F6F6F6",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)",
                borderRadius: 0.5,
                px: 1.5,
                py: 0.5,
              }}
            >
              <InputBase
                type="number"
                value={isNaN(imageWidth) ? "" : imageWidth}
                onChange={handleWidthChange}
                sx={{
                  width: 50,
                  fontSize: 16,
                  input: { textAlign: "center" },
                  color: "#6D6D6D",
                }}
                inputProps={{ style: { textAlign: "center" } }}
              />
            </Box>
          </Box>

          {/* Height */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="caption" sx={{ fontSize: 20 }}>
              H
            </Typography>
            <Box
              sx={{
                bgcolor: "#fff",
                border: "1px solid #F6F6F6",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)",
                borderRadius: 0.5,
                px: 1.5,
                py: 0.5,
              }}
            >
              <InputBase
                type="number"
                value={isNaN(imageHeight) ? "" : imageHeight}
                onChange={handleHeightChange}
                sx={{
                  width: 50,
                  fontSize: 16,
                  input: { textAlign: "center" },
                  color: "#6D6D6D",
                }}
                inputProps={{ style: { textAlign: "center" } }}
              />
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Content */}
      <Divider sx={{ my: 2 }} />
      <Box sx={{ px: 3, mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Typography
            sx={{ fontWeight: 500, fontSize: 16, flex: 1, color: "#454545" }}
          >
            Content
          </Typography>
          <IconButton size="small">
            <ArrowDropDownIcon />
          </IconButton>
        </Box>

        {/* Image Preview */}
        <Box
          sx={{
            width: "100%",
            aspectRatio: "16/9",
            borderRadius: 3,
            overflow: "hidden",
            mb: 1.5,
            position: "relative",
          }}
        >
          <img
            src={imageSrc}
            alt="Preview"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: 12,
            }}
          />
          <Button
            variant="contained"
            onClick={() => fileInputRef.current?.click()}
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "rgba(0,0,0,0.5)",
              color: "#fff",
              borderRadius: 2,
              px: 2,
              py: 0.5,
              fontWeight: 600,
              fontSize: 15,
              textTransform: "none",
              minWidth: 0,
            }}
          >
            Replace
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleImageChange}
          />
        </Box>
        

      {/* Actions Section */}
      <Divider sx={{ my: 1 }} />
      <Box sx={{ px: 3 }}>
        <Typography sx={{ fontWeight: 500, fontSize: 14, color: "#000", mb: 1 }}>
          Actions
        </Typography>
        <Box sx={{ display: "flex", gap: 4, mb: 1 }}>
          <Button sx={{  fontColor: "#1a1a1a", height: 47, width: 150, fontSize: 14, fontWeight: 500 }}
            variant="outlined" size="small" onClick={handleDuplicateImage}>Duplicate</Button>
          <Button sx={{ fontColor: "#1a1a1a", height: 47, width: 150, fontSize: 14, fontWeight: 500 }} variant="outlined" size="small" color="error" onClick={handleDeleteImage}>Delete</Button>
        </Box>
        <Box sx={{ display: "flex", gap: 4 }}>
          <Button
            variant="outlined"
            sx={{ fontColor: "#1a1a1a", height: 47, width: 150}} 
            size="small"
            onClick={handleRemoveBackground}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <CircularProgress size={9} sx={{ mr: 1 }} />
                Processing...
              </>
            ) : <Typography sx={{whiteSpace: "nowrap", fontSize: 14, fontWeight: 500}}>BG Remover</Typography>}
          </Button>
          <Button sx={{ fontColor: "#1a1a1a", height: 47, width: 150, fontSize: 14, fontWeight: 500 }} variant="outlined" size="small" onClick={() => setIsCropModalOpen(true)}>Crop</Button>
        </Box>
      </Box>

      {/* Layer Order */}
      <Divider sx={{ my: 1 }} />
      <Box sx={{ px: 3, mb: 2 }}>
        <Typography sx={{ fontWeight: 500, fontSize: 14, mb: 1 }}>Layer Order</Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            sx={{ backgroundColor: "rgba(249, 249, 251, 1)", fontColor: "#1a1a1a", height: 50 , width : 300}}

            size="small"
            endIcon={
              <img
                src="/forward.svg"
                alt="Forward"
                style={{ width: 22, height: 22 }}
              />
            }
            onClick={() => bringElementForward(selectedImageIndex)}
          >
            <Typography sx={{ color: "#1a1a1a", fontSize: 14, fontWeight: 300 }}>Forward</Typography>

          </Button>
          <Button sx={{ backgroundColor: "rgba(249, 249, 251, 1)", fontColor: "#1a1a1a", height: 50 }} size="small" endIcon={
            <img
              src="/backward.svg"
              alt="Forward"
              style={{ width: 22, height: 22 }}
            />
          } onClick={() => sendElementBackward(selectedImageIndex)}>
            <Typography sx={{ color: "#1a1a1a", fontSize: 14, fontWeight: 300 , width : 200}}>Backward</Typography>
          </Button>
        </Box>
      </Box>

      {/* Crop Modal */}
      <CropModal
        open={isCropModalOpen}
        onClose={() => setIsCropModalOpen(false)}
        imageSrc={imageSrc || ""}
        selectedSlideIndex={selectedSlideIndex}
        selectedImageIndex={selectedImageIndex}
        updateImageProperty={updateImageProperty}
      />
    </Box>
    </Box>
  );
};

export default ImageSettingsPanel;
