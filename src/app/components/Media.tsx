"use client";
import React, { useRef, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  MenuItem,
  Select,
  ButtonBase,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useSlides } from "@/app/context/SlidesContext";

interface MediaPanelProps {
  sidebarHeight?: string | number;
  onClose?: () => void;
}

const MAX_IMAGES = 8;
const MAX_WIDTH = 8009;
const MAX_HEIGHT = 4009;
const ACCEPTED_TYPES = [
  "image/png",
  "image/jpeg",
  "image/svg+xml",
  "image/gif",
];

const Media: React.FC<MediaPanelProps> = ({
  sidebarHeight = "100vh",
  onClose,
}) => {
  const [uploadType, setUploadType] = useState("Upload Image");

  const [images, setImages] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("media_library");
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });

  const updateImages = (newImages: string[]) => {
    setImages(newImages);
    localStorage.setItem("media_library", JSON.stringify(newImages));
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    slides,
    setSlides,
    selectedSlideIndex,
    setSelectedImageIndex,
    setSelectedImage,
  } = useSlides();

  const insertImageIntoRedux = (base64: string, width = 400, height = 400) => {
    const SLIDE_WIDTH = 920;
    const SLIDE_HEIGHT = 430;
    const x = (SLIDE_WIDTH - width) / 2;
    const y = (SLIDE_HEIGHT - height) / 2;

    const newImageElement = {
      konva_component: "Konva.Image",
      element_type: "image",
      properties: {
        x,
        y,
        width,
        height,
        imageSrc: base64,
      },
    };

    const updatedSlides = [...slides];
    const slide = { ...updatedSlides[selectedSlideIndex] };

    slide.elements = [...(slide.elements || []), newImageElement];
    updatedSlides[selectedSlideIndex] = slide;

    setSlides(updatedSlides);

    // ✅ Set selection to newly added image
    const newIndex = slide.elements.length - 1;
    setSelectedImage(newImageElement);
    setSelectedImageIndex(newIndex);
  };

  const handleFile = (file: File) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("Unsupported file type.");
      return;
    }

    const img = new window.Image();
    img.onload = () => {
      const originalWidth = img.width;
      const originalHeight = img.height;

      const MAX_DIMENSION = 400;
      const scale = Math.min(
        MAX_DIMENSION / originalWidth,
        MAX_DIMENSION / originalHeight,
        1
      );

      const scaledWidth = originalWidth * scale;
      const scaledHeight = originalHeight * scale;

      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === "string") {
          const base64 = e.target.result;
          const newImages = [base64, ...images].slice(0, MAX_IMAGES);
          updateImages(newImages);
          setError(null);

          insertImageIntoRedux(base64, scaledWidth, scaledHeight);
          onClose?.();
        }
      };
      reader.readAsDataURL(file);
    };

    img.onerror = () => setError("Invalid image file.");
    img.src = URL.createObjectURL(file);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <Box
      sx={{
        width: 320,
        bgcolor: "#fff",
        height: sidebarHeight,
        position: "absolute",
        left: 80,
        top: 0,
        borderRight: "1px solid #E0E0E0",
        zIndex: 10,
        boxShadow: 2,
        display: "flex",
        flexDirection: "column",
        p: 0,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 3,
          pb: 2,
        }}
      >
        <Typography sx={{ fontWeight: 600, fontSize: 20 }}>Media</Typography>
        <IconButton size="small" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Upload Dropdown */}
      <Box sx={{ px: 3, mb: 2 }}>
        <Select
          value={uploadType}
          onChange={(e) => setUploadType(e.target.value as string)}
          fullWidth
          size="small"
          sx={{
            borderRadius: 8,
            bgcolor: "#F8F8FA",
            fontWeight: 500,
            fontSize: 16,
            height: 44,
            mb: 1,
          }}
        >
          <MenuItem value="Upload Image">Upload Image</MenuItem>
        </Select>
      </Box>

      {/* Upload Area */}
      <Box sx={{ px: 3, mb: 2 }}>
        <ButtonBase
          component="div"
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setDragActive(false);
          }}
          onDrop={handleDrop}
          sx={{
            width: "100%",
            height: 200,
            border: dragActive ? "2px solid #7B4AE2" : "2px dashed #E0E0E0",
            borderRadius: 4,
            bgcolor: "#FAFAFC",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            mb: 0.5,
            transition: "border 0.2s",
            position: "relative",
          }}
        >
          <Box
            sx={{
              bgcolor: "#F3F3F7",
              borderRadius: "50%",
              p: 1.2,
              mb: 1,
              boxShadow: "0 2px 8px 0 #E0E0E0",
            }}
          >
            <CloudUploadIcon sx={{ fontSize: 32, color: "#B0AEB8" }} />
          </Box>
          <Typography
            sx={{
              color: "#7B4AE2",
              fontWeight: 500,
              fontSize: 15,
              mb: 0.5,
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            Click to upload
          </Typography>
          <Typography sx={{ color: "#888", fontSize: 13, textAlign: "center" }}>
            or drag and drop
            <br />
            SVG, PNG, JPG or GIF (max. 800x400px)
          </Typography>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/svg+xml,image/gif"
            style={{ display: "none" }}
            onChange={handleUpload}
          />
        </ButtonBase>
        {error && (
          <Typography sx={{ color: "red", fontSize: 13, mt: 0.5 }}>
            {error}
          </Typography>
        )}
      </Box>

      {/* From Library */}
      <Box sx={{ px: 3, pt: 1, pb: 2, flex: 1, overflowY: "auto" }}>
        <Typography sx={{ fontWeight: 600, fontSize: 16, mb: 1 }}>
          From Library:
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 2,
          }}
        >
          {Array.from({ length: MAX_IMAGES }).map((_, idx) => (
            <Box
              key={idx}
              sx={{
                width: "100%",
                aspectRatio: "1.1/1",
                bgcolor: "#F8F8FA",
                borderRadius: 2.5,
                border: "1px solid #F3F3F7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                mb: 0.5,
              }}
            >
              {images[idx] ? (
                <img
                  src={images[idx]}
                  alt={`library-img-${idx}`}
                  onClick={() => {
                    insertImageIntoRedux(images[idx]);
                    onClose?.();
                  }}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: 8,
                    cursor: "pointer",
                  }}
                />
              ) : null}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Media;
