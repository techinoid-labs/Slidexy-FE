import React, { useState, useCallback } from "react";
import { Box, Button, Modal, Typography, Slider, IconButton } from "@mui/material";
import Cropper from "react-easy-crop";
import { Point, Area } from "react-easy-crop";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

interface CropModalProps {
  open: boolean;
  onClose: () => void;
  imageSrc: string;
  selectedSlideIndex: number;
  selectedImageIndex: number | null;
  updateImageProperty: (prop: string, value: any) => void;
}

const CropModal: React.FC<CropModalProps> = ({
  open,
  onClose,
  imageSrc,
  selectedSlideIndex,
  selectedImageIndex,
  updateImageProperty,
}) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropCompleteCallback = useCallback(
    (_croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const handleZoomIn = () => {
    setZoom((prevZoom) => Math.min(prevZoom + 0.1, 3)); // Max zoom: 3
  };

  const handleZoomOut = () => {
    setZoom((prevZoom) => Math.max(prevZoom - 0.1, 1)); // Min zoom: 1
  };

  const handleZoomChange = (_event: Event, newValue: number | number[]) => {
    setZoom(newValue as number);
  };

  const getCroppedImage = async () => {
    if (!croppedAreaPixels || !imageSrc) {
      console.error("No crop area or image source provided");
      return;
    }

    try {
      const canvas = document.createElement("canvas");
      const image = new Image();
      image.src = imageSrc;
      image.crossOrigin = "anonymous";
      await new Promise((resolve, reject) => {
        image.onload = resolve;
        image.onerror = () => reject(new Error("Failed to load image"));
      });

      const { width, height, x, y } = croppedAreaPixels;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        console.error("Failed to get canvas context");
        return;
      }

      ctx.drawImage(image, x, y, width, height, 0, 0, width, height);
      const croppedImageUrl = canvas.toDataURL("image/png");

      updateImageProperty("imageSrc", croppedImageUrl);
      onClose();
    } catch (error) {
      console.error("Error cropping image:", error);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "85%",
          maxWidth: 500,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 1,
        }}
      >
        <Typography variant="h6" mb={2}>
          Crop Image
        </Typography>
        <Box sx={{ position: "relative", width: "100%", height: 300 }}>
          {imageSrc ? (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={4 / 3}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropCompleteCallback}
            />
          ) : (
            <Typography color="error">No image selected</Typography>
          )}
        </Box>
        <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton onClick={handleZoomOut} disabled={zoom <= 1} sx={{color:" rgba(100, 18, 255, 1)"}}>
            <RemoveIcon />
          </IconButton>
          <Slider
            value={zoom}
            onChange={handleZoomChange}
            min={1}
            max={3}
            step={0.1}
            sx={{ width: 150, color : "rgba(147, 114, 255, 1)" }}
            aria-label="Zoom"
          />
          <IconButton onClick={handleZoomIn} disabled={zoom >= 3} sx={{color:" rgba(100, 18, 255, 1)"}}>
            <AddIcon />
          </IconButton>
        </Box>
        <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between", gap : 2 }}>
          <Button variant="outlined" onClick={onClose} sx={{ outlineColor: "rgba(74, 0, 224, 1)", height : 36, width : 100, fontSize: 15}}>
            Cancel
          </Button>
          <Button
            variant="contained"
            
            onClick={getCroppedImage}
            disabled={!croppedAreaPixels || !imageSrc}
            sx={{ background : "rgba(74, 0, 224, 1)", height : 36, width : 100, fontSize: 15}}

          >
            Crop
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default CropModal;
