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
  Slider,
  Collapse,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { v4 as uuidv4 } from "uuid";
import { removeBackground } from "@imgly/background-removal";
import CropModal from "./../new-ui/CropModal";
import { useSlides, KonvaComponent } from "@/app/context/SlidesContext";

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
    setSelectedImageId,
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
  const [isOpacityOpen, setIsOpacityOpen] = useState(false);
  const [isShadowOpen, setIsShadowOpen] = useState(false);
  const [isRadiusOpen, setIsRadiusOpen] = useState(false);
  const [opacity, setOpacity] = useState<number>(
    selectedImage?.properties?.opacity ?? 1
  );
  const [shadow, setShadow] = useState<{
    offsetX: number;
    offsetY: number;
    blur: number;
    color: string;
  }>(
    selectedImage?.properties?.shadow ?? {
      offsetX: 0,
      offsetY: 0,
      blur: 0,
      color: "#000000",
    }
  );
  const [borderRadius, setBorderRadius] = useState<number>(
    selectedImage?.properties?.borderRadius ?? 0
  );

 // PART 1: ImageSettingsPanel.tsx Changes
// Replace the image search logic (around line 48-90) with this improved version:

let imageObj: KonvaComponent | null = null;
let currentImageIndex = selectedImageIndex;

if (selectedSlideIndex !== -1 && slides[selectedSlideIndex]) {
  const currentSlide = slides[selectedSlideIndex];
  
  // Primary: Try index first
  if (selectedImageIndex !== null && currentSlide.elements[selectedImageIndex]) {
    const candidate = currentSlide.elements[selectedImageIndex];
    if (candidate?.element_type === "image") {
      imageObj = candidate;
      currentImageIndex = selectedImageIndex;
    } else {
      console.warn('[ImageSettingsPanel] Selected index points to non-image:', candidate);
    }
  }
  
  // ENHANCED FALLBACK: Search by ID if no valid object found
  if (!imageObj && selectedImage?.properties?.image_id) {
    const targetId = selectedImage.properties.image_id;
    console.log('[ImageSettingsPanel] Searching for image_id:', targetId);
    
    const foundIndex = currentSlide.elements.findIndex((el: any) => {
      if (el.element_type !== "image") return false;
      
      // Check both locations where ID might be stored
      const elId = el.image_id || el.properties?.image_id;
      const match = elId === targetId;
      
      if (match) {
        console.log('[ImageSettingsPanel] Found match at index', foundIndex);
      }
      
      return match;
    });
    
    if (foundIndex !== -1) {
      imageObj = currentSlide.elements[foundIndex];
      currentImageIndex = foundIndex;
      
      // CRITICAL: Sync context index immediately
      if (selectedImageIndex !== foundIndex) {
        console.log('[ImageSettingsPanel] Syncing index from', selectedImageIndex, 'to', foundIndex);
        setSelectedImageIndex(foundIndex);
      }
    } else {
      // console.error('[ImageSettingsPanel] ID search failed for:', targetId);
      // console.error('[ImageSettingsPanel] Available images:', 
      //   currentSlide.elements
      //     .filter((el: any) => el.element_type === "image")
      //     .map((el: any, idx: number) => ({
      //       index: idx,
      //       image_id: el.image_id,
      //       props_id: el.properties?.image_id
      //     }))
      // );
    }
  }
}

// Add debug logging for failures
if (!imageObj && selectedImageIndex !== null) {
  // console.error('[ImageSettingsPanel] Failed to find image element', {
  //   selectedSlideIndex,
  //   selectedImageIndex,
  //   selectedImageId: selectedImage?.properties?.image_id,
  //   totalElements: slides[selectedSlideIndex]?.elements?.length,
  //   imageElements: slides[selectedSlideIndex]?.elements?.filter((el: any) => el.element_type === "image").length
  // });
}
  useEffect(() => {
    if (selectedImage) {
      setImageWidth(selectedImage?.properties?.width || 0);
      setImageHeight(selectedImage?.properties?.height || 0);
      setIsBackground(selectedImage?.properties?.isBackground || false);
      setImageSrc(
        selectedImage?.properties?.imageSrc || "/sample-content-image.jpg"
      );
      setOpacity(selectedImage?.properties?.opacity ?? 1);
      setShadow(
        selectedImage?.properties?.shadow ?? {
          offsetX: 0,
          offsetY: 0,
          blur: 0,
          color: "#000000",
        }
      );
      setBorderRadius(selectedImage?.properties?.borderRadius ?? 0);
    }
  }, [selectedImage]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (
        selectedSlideIndex === -1 ||
        currentImageIndex === null ||
        !slides[selectedSlideIndex]?.elements[currentImageIndex]
      )
        return;

      const updatedSlides = structuredClone(slides);
      const element =
        updatedSlides[selectedSlideIndex].elements[currentImageIndex];

      // FIXED: Add null check for element and properties to prevent undefined error
      if (!element || !element.properties) {
        console.warn('[ImageSettingsPanel] Element or properties missing, skipping update');
        return;
      }

      if (!isNaN(imageWidth)) {
        element.properties.width = imageWidth;
      }

      if (!isNaN(imageHeight)) {
        element.properties.height = imageHeight;
      }

      setSlides(updatedSlides);
    }, 400);

    return () => clearTimeout(timeout);
  }, [
    imageWidth,
    imageHeight,
    slides,
    selectedSlideIndex,
    currentImageIndex,
    setSlides,
  ]);

  const updateImageProperty = (props: { [key: string]: any }) => {
    if (selectedSlideIndex === -1 || currentImageIndex === null) return;
    const updatedSlides = structuredClone(slides);
    const target =
      updatedSlides[selectedSlideIndex].elements[currentImageIndex].properties;
    const element =
      updatedSlides[selectedSlideIndex].elements[currentImageIndex];
    // FIXED: Add null check for element and target
    if (!element || !target) {
      console.warn('[ImageSettingsPanel] Element or properties missing in updateImageProperty');
      return;
    }
    Object.entries(props).forEach(([key, value]) => {
      target[key] = value;
      // console.log(
      //   `[ImageSettingsPanel] Updated ${key} to ${JSON.stringify(
      //     value
      //   )} for image at slide ${selectedSlideIndex}, index ${currentImageIndex}`
      // );
    });
    setSlides(updatedSlides);
    setSelectedImage({
      ...element,
      konva_component: element.konva_component || "Konva.Image",
      element_type: element.element_type || "image",
      properties: { ...element.properties },
    });
  };

  const updateSingleImageProperty = (prop: string, value: any) => {
    updateImageProperty({ [prop]: value });
  };

  const handleDuplicateImage = () => {
    if (!imageObj || selectedSlideIndex === -1 || currentImageIndex === null)
      return;

    const currentSlide = slides[selectedSlideIndex];
    const elements = [...currentSlide.elements];
    const originalElement = elements[currentImageIndex];

    // FIXED: Ensure originalElement has properties
    if (!originalElement || !originalElement.properties) {
      console.warn('[ImageSettingsPanel] Original element missing properties in duplicate');
      return;
    }

    const newImageId = uuidv4();
    const newElement = {
      ...structuredClone(originalElement),
      properties: {
        ...structuredClone(originalElement.properties),
        image_id: newImageId,
        x: (originalElement.properties?.x || 0) + 20,
        y: (originalElement.properties?.y || 0) + 20,
      },
    };

    elements.splice(currentImageIndex + 1, 0, newElement);

    const updatedSlide = {
      ...currentSlide,
      elements,
    };

    const updatedSlides = [...slides];
    updatedSlides[selectedSlideIndex] = updatedSlide;

    setSlides(updatedSlides);
    setSelectedImage(newElement);
    setSelectedImageIndex(currentImageIndex + 1);
    setSelectedImageId(newImageId);
  };

  const handleDeleteImage = () => {
    if (selectedSlideIndex === -1 || currentImageIndex === null) return;

    const updatedSlides = structuredClone(slides);
    updatedSlides[selectedSlideIndex].elements.splice(currentImageIndex, 1);

    setSlides(updatedSlides);
    setSelectedImage(null);
    setSelectedImageIndex(null);
    setSelectedImageId(null);
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
          currentImageIndex !== null &&
          slides[selectedSlideIndex]?.elements[currentImageIndex]
        ) {
          const updatedSlides = structuredClone(slides);
          const element =
            updatedSlides[selectedSlideIndex].elements[currentImageIndex];
          // FIXED: Ensure element has properties before updating
          if (element && element.properties) {
            element.properties.imageSrc = resultUrl;
            setSlides(updatedSlides);
            setImageSrc(resultUrl);
            setSelectedImage({
              ...element,
              konva_component: element.konva_component || "Konva.Image",
              element_type: element.element_type || "image",
              properties: { ...element.properties },
            });
          } else {
            console.warn('[ImageSettingsPanel] Element missing properties in removeBackground');
          }
        }
        setIsLoading(false);
      };

      reader.readAsDataURL(result);
    } catch (error) {
      console.error("Error removing background:", error);
      setIsLoading(false);
    }
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
        currentImageIndex === null ||
        !slides[selectedSlideIndex]?.elements[currentImageIndex]
      )
        return;

      const updatedSlides = structuredClone(slides);
      const element =
        updatedSlides[selectedSlideIndex].elements[currentImageIndex];
      // FIXED: Ensure element has properties before updating
      if (element && element.properties) {
        element.properties.imageSrc = result;
        setSlides(updatedSlides);
        setSelectedImage({
          ...element,
          konva_component: element.konva_component || "Konva.Image",
          element_type: element.element_type || "image",
          properties: { ...element.properties },
        });
      } else {
        console.warn('[ImageSettingsPanel] Element missing properties in handleImageChange');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setImageWidth(val === "" ? NaN : Number(val));
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setImageHeight(val === "" ? NaN : Number(val));
  };

  const handleOpacityChange = (event: Event, newValue: number | number[]) => {
    const newOpacity = (newValue as number) / 100;
    setOpacity(newOpacity);
    updateImageProperty({ opacity: newOpacity });
  };

  const handleShadowChange = (key: string, value: number | string) => {
    const newShadow = { ...shadow, [key]: value };
    setShadow(newShadow);
    updateImageProperty({ shadow: newShadow });
  };

  const handleRadiusChange = (event: Event, newValue: number | number[]) => {
    const newRadius = newValue as number;
    setBorderRadius(newRadius);
    updateImageProperty({ borderRadius: newRadius });
  };

  if (!imageObj || imageObj.element_type !== "image") return null;

  return (
    <Box
      className="w-[300px] min-w-[250px] bg-white flex flex-col overflow-y-auto border-r border-gray-200"
      sx={{ height: sidebarHeight || "100vh" }}
    >
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

      {/* Effects */}
      <Divider sx={{ my: 2 }} />
      <Box sx={{ px: 3, mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Typography
            sx={{ fontWeight: 500, fontSize: 16, flex: 1, color: "#454545" }}
          >
            Effects
          </Typography>
          <IconButton size="small">
            <ArrowDropDownIcon />
          </IconButton>
        </Box>
        <Box sx={{ mb: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 1,
            }}
          >
            <Typography sx={{ fontSize: 14, color: "#454545" }}>
              Opacity
            </Typography>
            <IconButton
              onClick={() => setIsOpacityOpen(!isOpacityOpen)}
              size="small"
            >
              <ArrowDropDownIcon />
            </IconButton>
          </Box>
          <Collapse in={isOpacityOpen}>
            <Box sx={{ px: 2, py: 1 }}>
              <Slider
                value={Math.round(opacity * 100)}
                onChange={handleOpacityChange}
                min={0}
                max={100}
                sx={{ width: "100%" }}
              />
              <Typography sx={{ fontSize: 12, color: "#6D6D6D" }}>
                {Math.round(opacity * 100)}%
              </Typography>
            </Box>
          </Collapse>
        </Box>
        <Box sx={{ mb: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 1,
            }}
          >
            <Typography sx={{ fontSize: 14, color: "#454545" }}>
              Shadow
            </Typography>
            <IconButton
              onClick={() => setIsShadowOpen(!isShadowOpen)}
              size="small"
            >
              <ArrowDropDownIcon />
            </IconButton>
          </Box>
          <Collapse in={isShadowOpen}>
            <Box sx={{ px: 2, py: 1 }}>
              <Typography
                variant="caption"
                sx={{ color: "#454545", mb: 1, fontWeight: 500 }}
              >
                Shadow Offset X
              </Typography>
              <Slider
                value={shadow.offsetX}
                onChange={(e, val) =>
                  handleShadowChange("offsetX", val as number)
                }
                min={-50}
                max={50}
                sx={{ mb: 2 }}
              />
              <Typography
                variant="caption"
                sx={{ color: "#454545", mb: 1, fontWeight: 500 }}
              >
                Shadow Offset Y
              </Typography>
              <Slider
                value={shadow.offsetY}
                onChange={(e, val) =>
                  handleShadowChange("offsetY", val as number)
                }
                min={-50}
                max={50}
                sx={{ mb: 2 }}
              />
              <Typography
                variant="caption"
                sx={{ color: "#454545", mb: 1, fontWeight: 500 }}
              >
                Shadow Blur
              </Typography>
              <Slider
                value={shadow.blur}
                onChange={(e, val) => handleShadowChange("blur", val as number)}
                min={0}
                max={100}
                sx={{ mb: 2 }}
              />
            </Box>
          </Collapse>
        </Box>
        <Box sx={{ mb: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 1,
            }}
          >
            <Typography sx={{ fontSize: 14, color: "#454545" }}>
              Border Radius
            </Typography>
            <IconButton
              onClick={() => setIsRadiusOpen(!isRadiusOpen)}
              size="small"
            >
              <ArrowDropDownIcon />
            </IconButton>
          </Box>
          <Collapse in={isRadiusOpen}>
            <Box sx={{ px: 2, py: 1 }}>
              <Slider
                value={borderRadius}
                onChange={handleRadiusChange}
                min={0}
                max={500}
                sx={{ mb: 2 }}
              />
              <Typography sx={{ fontSize: 12, color: "#6D6D6D" }}>
                {borderRadius}px
              </Typography>
            </Box>
          </Collapse>
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
      </Box>

      {/* Actions Section */}
      <Divider sx={{ my: 2 }} />
      <Box sx={{ px: 3, mb: 2 }}>
        <Typography
          sx={{ fontWeight: 500, fontSize: 14, color: "#000", mb: 1 }}
        >
          Actions
        </Typography>
        <Box sx={{ display: "flex", gap: 4, mb: 1 }}>
          <Button
            sx={{
              fontColor: "#1a1a1a",
              height: 47,
              width: 150,
              fontSize: 14,
              fontWeight: 500,
            }}
            variant="outlined"
            size="small"
            onClick={handleDuplicateImage}
          >
            Duplicate
          </Button>
          <Button
            sx={{
              fontColor: "#1a1a1a",
              height: 47,
              width: 150,
              fontSize: 14,
              fontWeight: 500,
            }}
            variant="outlined"
            size="small"
            color="error"
            onClick={handleDeleteImage}
          >
            Delete
          </Button>
        </Box>
        <Box sx={{ display: "flex", gap: 4 }}>
          <Button
            variant="outlined"
            sx={{ fontColor: "#1a1a1a", height: 47, width: 150 }}
            size="small"
            onClick={handleRemoveBackground}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <CircularProgress size={9} sx={{ mr: 1 }} />
                Processing...
              </>
            ) : (
              <Typography
                sx={{ whiteSpace: "nowrap", fontSize: 14, fontWeight: 500 }}
              >
                BG Remover
              </Typography>
            )}
          </Button>
          <Button
            sx={{
              fontColor: "#1a1a1a",
              height: 47,
              width: 150,
              fontSize: 14,
              fontWeight: 500,
            }}
            variant="outlined"
            size="small"
            onClick={() => setIsCropModalOpen(true)}
          >
            Crop
          </Button>
        </Box>
      </Box>

      {/* Layer Controls */}
      <Divider sx={{ my: 2 }} />
      <Box sx={{ px: 3, mb: 2, display: "flex", gap: 2 }}>
        <Button
          onClick={() => {
            if (currentImageIndex !== null) {
              sendElementBackward(currentImageIndex);  // Use synced index
            }
          }}
          disabled={currentImageIndex === null}
          variant="outlined"
          endIcon={
            <img
              src="/forward-icon.svg"
              alt="Forward"
              style={{ width: 20, height: 20 }}
            />
          }
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            maxHeight: "50px",
            borderRadius: 1,
            fontWeight: 400,
            fontSize: 15,
            bgcolor: "#F8F8FA",
            borderColor: "#E0E0E0",
            color: "#222",
            flex: 1,
            textTransform: "none",
            whiteSpace: "nowrap",
            "&:hover": {
              bgcolor: "#F3EDFF",
              borderColor: "#7B4AE2",
              color: "#7B4AE2",
            },
            "&:disabled": {
              bgcolor: "#F0F0F0",
              color: "#999",
              borderColor: "#E0E0E0",
            },
          }}
        >
          Send Backward
        </Button>
        <Button
          onClick={() => {
            if (currentImageIndex !== null) {
              bringElementForward(currentImageIndex);  // Use synced index
            }
          }}
          disabled={currentImageIndex === null}
          variant="outlined"
          endIcon={
            <img
              src="/backward-icon.svg"
              alt="Backward"
              style={{ width: 20, height: 20 }}
            />
          }
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            maxHeight: "50px",
            borderRadius: 1,
            fontWeight: 400,
            fontSize: 15,
            bgcolor: "#F8F8FA",
            borderColor: "#E0E0E0",
            color: "#222",
            flex: 1,
            textTransform: "none",
            whiteSpace: "nowrap",
            "&:hover": {
              bgcolor: "#F3EDFF",
              borderColor: "#7B4AE2",
              color: "#7B4AE2",
            },
            "&:disabled": {
              bgcolor: "#F0F0F0",
              color: "#999",
              borderColor: "#E0E0E0",
            },
          }}
        >
          Bring Forward
        </Button>
      </Box>

      {/* Crop Modal */}
      <CropModal
        open={isCropModalOpen}
        onClose={() => setIsCropModalOpen(false)}
        imageSrc={imageSrc || ""}
        selectedSlideIndex={selectedSlideIndex}
        selectedImageIndex={currentImageIndex}  // Use synced
        updateImageProperty={updateSingleImageProperty}
      />
    </Box>
  );
};

export default ImageSettingsPanel;