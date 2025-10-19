"use client";

import React, { useState, useRef, useEffect } from "react";
import { Box, IconButton, Typography, CircularProgress, Button, Slider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useSlides, KonvaComponent } from "@/app/context/SlidesContext";
import { v4 as uuidv4 } from "uuid";
import CropModal from "./CropModal";
import { removeBackground } from "@imgly/background-removal";

interface ImageSettingsPanelMobileProps {
  onClose: () => void;
  style: React.CSSProperties;
  resetAll?: () => void;
}

interface PanelProps {
  onClose: () => void;
  onApply: (prop: string, value: any) => void;
  initialValues: any;
}

const OpacityPanel: React.FC<PanelProps & { initialValues: { opacity: number } }> = ({ initialValues, onApply, onClose }) => {
  const [opacity, setOpacity] = useState(initialValues.opacity);

  const handleOpacityChange = (event: Event, newValue: number | number[]) => {
    setOpacity((newValue as number) / 100);
  };

  const handleApply = () => {
    onApply("opacity", opacity);
    onClose();
  };

  return (
    <Box sx={{ position: "fixed", bottom: 143, width: "90%", backgroundColor: "#fff", borderTopLeftRadius: "10px", borderTopRightRadius: "10px", boxShadow: 3, right: "5%", p: 2, zIndex: 4, overflowY: "auto" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <IconButton onClick={onClose} sx={{ color: "#000000" }}><CloseIcon /></IconButton>
        <Typography variant="h6" sx={{ fontSize: 16, color: "#000000", textAlign: "center", flexGrow: 1 }}>Opacity</Typography>
        <div style={{ width: 48 }} />
      </Box>
      <Box sx={{ mb: 2 }}>
        <Typography variant="caption" sx={{ color: "#000000", mb: 1, fontWeight: 500 }}>Adjust Opacity</Typography>
        <Box sx={{ border: "1px solid #ccc", borderRadius: "4px", p: 1, height: 40, backgroundColor: "#fff" }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Slider value={Math.round(opacity * 100)} onChange={handleOpacityChange} min={0} max={100} sx={{ width: "100%", mr: 1 }} />
            <Typography sx={{ fontSize: 14, minWidth: 40 }}>{Math.round(opacity * 100)}%</Typography>
          </Box>
        </Box>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <Button variant="contained" sx={{ background: "linear-gradient(80.89deg, #8E2DE2 -90.43%, #4A00E0 74.73%)", color: "#fff", px: 4, py: 1, "&:hover": { backgroundColor: "#5A3ED9" }, width: 290, height: 35, fontSize: 10, fontWeight: 500 }} onClick={handleApply}>Apply</Button>
      </Box>
    </Box>
  );
};

const ShadowPanel: React.FC<PanelProps & { initialValues: { shadow: { offsetX: number; offsetY: number; blur: number; color: string } } }> = ({ initialValues, onApply, onClose }) => {
  const [shadow, setShadow] = useState(initialValues.shadow);

  const handleChange = (key: string, value: number | string) => {
    setShadow({ ...shadow, [key]: value });
  };

  const handleApply = () => {
    onApply("shadow", shadow);
    onClose();
  };

  return (
    <Box sx={{ position: "fixed", bottom: 143, width: "90%", backgroundColor: "#fff", borderTopLeftRadius: "10px", borderTopRightRadius: "10px", boxShadow: 3, right: "5%", p: 2, zIndex: 4, overflowY: "auto" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <IconButton onClick={onClose} sx={{ color: "#000000" }}><CloseIcon /></IconButton>
        <Typography variant="h6" sx={{ fontSize: 16, color: "#000000", textAlign: "center", flexGrow: 1 }}>Shadow</Typography>
        <div style={{ width: 48 }} />
      </Box>
      <Box sx={{ mb: 2 }}>
        <Typography variant="caption" sx={{ color: "#000000", mb: 1, fontWeight: 500 }}>Shadow Offset X</Typography>
        <Slider value={shadow.offsetX} onChange={(e, val) => handleChange("offsetX", val as number)} min={-50} max={50} sx={{ mb: 2 }} />
        <Typography variant="caption" sx={{ color: "#000000", mb: 1, fontWeight: 500 }}>Shadow Offset Y</Typography>
        <Slider value={shadow.offsetY} onChange={(e, val) => handleChange("offsetY", val as number)} min={-50} max={50} sx={{ mb: 2 }} />
        <Typography variant="caption" sx={{ color: "#000000", mb: 1, fontWeight: 500 }}>Shadow Blur</Typography>
        <Slider value={shadow.blur} onChange={(e, val) => handleChange("blur", val as number)} min={0} max={100} sx={{ mb: 2 }} />
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <Button variant="contained" sx={{ background: "linear-gradient(80.89deg, #8E2DE2 -90.43%, #4A00E0 74.73%)", color: "#fff", px: 4, py: 1, "&:hover": { backgroundColor: "#5A3ED9" }, width: 290, height: 35, fontSize: 10, fontWeight: 500 }} onClick={handleApply}>Apply</Button>
      </Box>
    </Box>
  );
};

const RadiusPanel: React.FC<PanelProps & { initialValues: { borderRadius: number } }> = ({ initialValues, onApply, onClose }) => {
  const [borderRadius, setBorderRadius] = useState(initialValues.borderRadius);

  const handleRadiusChange = (event: Event, newValue: number | number[]) => {
    setBorderRadius(newValue as number);
  };

  const handleApply = () => {
    onApply("borderRadius", borderRadius);
    onClose();
  };

  return (
    <Box sx={{ position: "fixed", bottom: 143, width: "90%", backgroundColor: "#fff", borderTopLeftRadius: "10px", borderTopRightRadius: "10px", boxShadow: 3, right: "5%", p: 2, zIndex: 4, overflowY: "auto" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <IconButton onClick={onClose} sx={{ color: "#000000" }}><CloseIcon /></IconButton>
        <Typography variant="h6" sx={{ fontSize: 16, color: "#000000", textAlign: "center", flexGrow: 1 }}>Border Radius</Typography>
        <div style={{ width: 48 }} />
      </Box>
      <Box sx={{ mb: 2 }}>
        <Typography variant="caption" sx={{ color: "#000000", mb: 1, fontWeight: 500 }}>Adjust Border Radius</Typography>
        <Slider value={borderRadius} onChange={handleRadiusChange} min={0} max={100} sx={{ mb: 2 }} />
        <Typography sx={{ fontSize: 14 }}>{borderRadius}px</Typography>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <Button variant="contained" sx={{ background: "linear-gradient(80.89deg, #8E2DE2 -90.43%, #4A00E0 74.73%)", color: "#fff", px: 4, py: 1, "&:hover": { backgroundColor: "#5A3ED9" }, width: 290, height: 35, fontSize: 10, fontWeight: 500 }} onClick={handleApply}>Apply</Button>
      </Box>
    </Box>
  );
};

const ImageSettingsPanelMobile: React.FC<ImageSettingsPanelMobileProps> = ({ onClose, style }) => {
  const { slides, selectedImageIndex, selectedSlideIndex, setSlides, selectedImage, setSelectedImage, setSelectedImageIndex, setSelectedImageId, bringElementForward, sendElementBackward } = useSlides();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isOpacityPanelOpen, setIsOpacityPanelOpen] = useState(false);
  const [isShadowPanelOpen, setIsShadowPanelOpen] = useState(false);
  const [isRadiusPanelOpen, setIsRadiusPanelOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);

  let imageObj: KonvaComponent | null = null;
  if (selectedSlideIndex !== -1 && slides[selectedSlideIndex] && selectedImageIndex !== null) {
    imageObj = slides[selectedSlideIndex].elements[selectedImageIndex];
  }

  if (!imageObj || imageObj.element_type !== "image") return null;

  const rawProps = imageObj.properties || {};
  const opacity = rawProps.opacity ?? 1;
  const shadow = rawProps.shadow ?? { offsetX: 0, offsetY: 0, blur: 0, color: "#000000" };
  const borderRadius = rawProps.borderRadius ?? 0;

  const updateImageProperty = (props: { [key: string]: any }) => {
    if (!imageObj || selectedSlideIndex === -1 || selectedImageIndex === null) return;

    const updatedSlides = structuredClone(slides);
    const target = updatedSlides[selectedSlideIndex].elements[selectedImageIndex].properties;
    const element = updatedSlides[selectedSlideIndex].elements[selectedImageIndex];

    if (target) {
      Object.entries(props).forEach(([key, value]) => {
        target[key] = value;
        // console.log(`[ImageSettingsPanelMobile] Updated ${key} to ${JSON.stringify(value)} for image at slide ${selectedSlideIndex}, index ${selectedImageIndex}`);
      });

      setSlides(updatedSlides);
      setSelectedImage({
        ...element,
        konva_component: element.konva_component || "Konva.Image",
        element_type: element.element_type || "image",
        properties: { ...element.properties },
      });
    }
  };

  const updateSingleImageProperty = (prop: string, value: any) => {
    updateImageProperty({ [prop]: value });
  };

  const handleDuplicateImage = () => {
    if (!imageObj || selectedSlideIndex === -1 || selectedImageIndex === null)
      return;

    const currentSlide = slides[selectedSlideIndex];
    const elements = [...currentSlide.elements];

    const originalElement = elements[selectedImageIndex];

    const newImageId = uuidv4();
    const newElement = {
      ...structuredClone(originalElement),
      id: `el-${selectedSlideIndex}-${uuidv4()}`,
      properties: {
        ...structuredClone(originalElement.properties),
        image_id: newImageId,
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
    setSelectedImageId(newImageId);
  };

  const handleDeleteImage = () => {
    if (selectedSlideIndex === -1 || selectedImageIndex === null) return;
    const updatedSlides = structuredClone(slides);
    updatedSlides[selectedSlideIndex].elements.splice(selectedImageIndex, 1);
    setSlides(updatedSlides);
    onClose();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      if (selectedSlideIndex === null || selectedImageIndex === null || !slides[selectedSlideIndex]?.elements[selectedImageIndex]) return;

      const updatedSlides = structuredClone(slides);
      const element = updatedSlides[selectedSlideIndex].elements[selectedImageIndex];
      element.properties.imageSrc = result;
      element.properties.opacity = 1;
      setSlides(updatedSlides);
      setSelectedImage({
        ...element,
        konva_component: element.konva_component || "Konva.Image",
        element_type: element.element_type || "image",
        properties: { ...element.properties },
      });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveBackground = async () => {
    if (!imageObj || !imageObj.properties?.imageSrc) return;

    setIsLoading(true);
    try {
      const response = await fetch(imageObj.properties.imageSrc);
      const blob = await response.blob();
      const result = await removeBackground(blob, { output: { format: "image/png", quality: 0.8 } });
      const reader = new FileReader();
      reader.onloadend = () => {
        const resultUrl = reader.result as string;
        if (selectedSlideIndex !== null && selectedImageIndex !== null && slides[selectedSlideIndex]?.elements[selectedImageIndex]) {
          const updatedSlides = structuredClone(slides);
          const element = updatedSlides[selectedSlideIndex].elements[selectedImageIndex];
          element.properties.imageSrc = resultUrl;
          setSlides(updatedSlides);
          setSelectedImage({
            ...element,
            konva_component: element.konva_component || "Konva.Image",
            element_type: element.element_type || "image",
            properties: { ...element.properties },
          });
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
    <>
      <Box sx={{ width: "100%", height: 60, bgcolor: "#fff", borderTop: "1px solid #E0E0E0", display: "flex", flexDirection: "row", justifyContent: "center", py: 1.2, overflow: "auto", zIndex: 3, boxSizing: "border-box", position: "fixed", bottom: 83, paddingLeft: 20, paddingRight: 3, left: 10, gap: 1.5 }}>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <IconButton onClick={handleDuplicateImage} sx={{ color: "#222", backgroundColor: "#F8F8FA", padding: "2px", width: 32, height: 30, mb: 0.2 }}><img src="/duplicate-icon.svg" alt="duplicate" style={{ width: 15, height: 15 }} /></IconButton>
          <Typography sx={{ fontSize: "9px", color: "#222", textTransform: "none", letterSpacing: "0.5px", marginBottom: 0.5 }}>Duplicate</Typography>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <IconButton onClick={handleDeleteImage} sx={{ color: "#C00", backgroundColor: "#F8F8FA", padding: "2px", width: 32, height: 30, mb: 0.2 }}><img src="/delete-icon.svg" alt="delete" style={{ width: 15, height: 15 }} /></IconButton>
          <Typography sx={{ fontSize: "9px", color: "#222", textTransform: "none", letterSpacing: "0.5px", marginBottom: 0.5 }}>Delete</Typography>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <IconButton onClick={() => fileInputRef.current?.click()} sx={{ color: "#222", backgroundColor: "#F8F8FA", padding: "2px", width: 32, height: 30, mb: 0.2 }}><img src="/replace.svg" alt="replace" style={{ width: 15, height: 15 }} /></IconButton>
          <Typography sx={{ fontSize: "9px", color: "#222", textTransform: "none", letterSpacing: "0.5px", marginBottom: 0.5 }}>Replace</Typography>
          <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleImageChange} />
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <IconButton onClick={handleRemoveBackground} sx={{ color: "#222", backgroundColor: "#F8F8FA", padding: "2px", width: 32, height: 30, mb: 0.2 }} disabled={isLoading}>{isLoading ? <CircularProgress size={15} sx={{ color: "#222" }} /> : <img src="/bg-remove.svg" alt="remove-bg" style={{ width: 15, height: 15 }} />}</IconButton>
          <Typography sx={{ fontSize: "9px", color: "#222", textTransform: "none", letterSpacing: "0.5px", marginBottom: 0.5, whiteSpace: "nowrap" }}>BG Remover</Typography>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <IconButton onClick={() => selectedImageIndex !== null && bringElementForward(selectedImageIndex)} sx={{ color: "#222", backgroundColor: "#F8F8FA", padding: "2px", width: 32, height: 30, mb: 0.2 }} disabled={selectedImageIndex === null}><img src="/backward.svg" alt="backward" style={{ width: 15, height: 15 }} /></IconButton>
          <Typography sx={{ fontSize: "9px", color: "#222", textTransform: "none", letterSpacing: "0.5px", marginBottom: 0.5 }}>Backward</Typography>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <IconButton onClick={() => selectedImageIndex !== null && sendElementBackward(selectedImageIndex)} sx={{ color: "#222", backgroundColor: "#F8F8FA", padding: "2px", width: 32, height: 30, mb: 0.2 }} disabled={selectedImageIndex === null}><img src="/forward.svg" alt="forward" style={{ width: 15, height: 15 }} /></IconButton>
          <Typography sx={{ fontSize: "9px", color: "#222", textTransform: "none", letterSpacing: "0.5px", marginBottom: 0.5 }}>Forward</Typography>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <IconButton onClick={() => setIsCropModalOpen(true)} sx={{ color: "#222", backgroundColor: "#F8F8FA", padding: "2px", width: 32, height: 30, mb: 0.2 }} disabled={!imageObj?.properties?.imageSrc}><img src="/crop.svg" alt="crop" style={{ width: 15, height: 15 }} /></IconButton>
          <Typography sx={{ fontSize: "9px", color: "#222", textTransform: "none", letterSpacing: "0.5px", marginBottom: 0.5 }}>Crop</Typography>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <IconButton onClick={() => setIsOpacityPanelOpen(!isOpacityPanelOpen)} sx={{ color: "#222", backgroundColor: "#F8F8FA", padding: "2px", width: 32, height: 30, mb: 0.2 }}><img src="/opacity-icon.svg" alt="opacity" style={{ width: 15, height: 15 }} /></IconButton>
          <Typography sx={{ fontSize: "9px", color: "#222", textTransform: "none", letterSpacing: "0.5px", marginBottom: 0.5 }}>Opacity</Typography>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <IconButton onClick={() => setIsShadowPanelOpen(!isShadowPanelOpen)} sx={{ color: "#222", backgroundColor: "#F8F8FA", padding: "2px", width: 32, height: 30, mb: 0.2 }}><img src="/shadow.svg" alt="shadow" style={{ width: 15, height: 15 }} /></IconButton>
          <Typography sx={{ fontSize: "9px", color: "#222", textTransform: "none", letterSpacing: "0.5px", marginBottom: 0.5 }}>Shadow</Typography>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <IconButton onClick={() => setIsRadiusPanelOpen(!isRadiusPanelOpen)} sx={{ color: "#222", backgroundColor: "#F8F8FA", padding: "2px", width: 32, height: 30, mb: 0.2 }}><img src="/radius-icon.svg" alt="radius" style={{ width: 15, height: 15 }} /></IconButton>
          <Typography sx={{ fontSize: "9px", color: "#222", textTransform: "none", letterSpacing: "0.5px", marginBottom: 0.5 }}>Radius</Typography>
        </Box>
      </Box>

      {isOpacityPanelOpen && <OpacityPanel initialValues={{ opacity }} onApply={updateSingleImageProperty} onClose={() => setIsOpacityPanelOpen(false)} />}
      {isShadowPanelOpen && <ShadowPanel initialValues={{ shadow }} onApply={updateSingleImageProperty} onClose={() => setIsShadowPanelOpen(false)} />}
      {isRadiusPanelOpen && <RadiusPanel initialValues={{ borderRadius }} onApply={updateSingleImageProperty} onClose={() => setIsRadiusPanelOpen(false)} />}
      <CropModal open={isCropModalOpen} onClose={() => setIsCropModalOpen(false)} imageSrc={imageObj?.properties?.imageSrc || ""} selectedSlideIndex={selectedSlideIndex} selectedImageIndex={selectedImageIndex} updateImageProperty={updateSingleImageProperty} />
    </>
  );
};

export default ImageSettingsPanelMobile;
