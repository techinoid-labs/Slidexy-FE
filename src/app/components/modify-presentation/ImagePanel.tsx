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
    addImage,
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

  // ✅ FIXED: All useEffects FIRST (before any returns) - sync logic moved INSIDE its effect
  // Sync index effect: Compute & sync post-render when selection changes
  useEffect(() => {
    if (
      selectedSlideIndex === -1 ||
      !slides[selectedSlideIndex] ||
      !selectedImage?.properties?.image_id
    ) {
      return;
    }

    // Special handling for fixed images (slide.image_url)
    if (selectedImageIndex === -99) {
      // Update slide.image_url when selectedImage changes - IMMUTABLY
      const updatedSlides = slides.map((slide, idx) =>
        idx === selectedSlideIndex
          ? { ...slide, image_url: selectedImage.properties.imageSrc }
          : slide
      );
      setSlides(updatedSlides);
      return;
    }

    if (selectedImageIndex === null) {
      return;
    }

    const originalSlide = slides[selectedSlideIndex];
    const variantIndex = originalSlide.currentVariantIndex ?? 0;
    const variant = originalSlide.layouts?.[variantIndex];
    const variantElements = variant?.elements || [];
    const userElements = originalSlide.elements || [];
    const mergedElements = [...variantElements, ...userElements];

    // Primary: Try index first from merged
    if (mergedElements?.[selectedImageIndex] && mergedElements[selectedImageIndex]?.element_type === "image") {
      return; // Already in sync
    }

    // Fallback: Search by ID
    const targetId = selectedImage.properties.image_id;
    console.log('[ImageSettingsPanel] Searching for image_id:', targetId);

    const foundIndex = mergedElements?.findIndex((el: any) => {
      if (el.element_type !== "image") return false;
      const elId = el.image_id || el.properties?.image_id;
      return elId === targetId;
    }) ?? -1;

    if (foundIndex !== -1 && selectedImageIndex !== foundIndex) {
      console.log('[ImageSettingsPanel] Syncing index from', selectedImageIndex, 'to', foundIndex);
      setSelectedImageIndex(foundIndex);
    } else {
      console.warn('[ImageSettingsPanel] No match found for image_id:', targetId);
    }
  }, [selectedImageIndex, selectedSlideIndex, slides, selectedImage, setSelectedImageIndex]); // ✅ FIXED: Stable deps (no let vars)

  // Existing useEffect for selectedImage updates
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

  // ✅ REMOVED: problematic useEffect that caused dimensions to revert or sync incorrectly

  // ✅ FIXED: Compute unconditionally AFTER hooks (for display only, no side effects)
  let imageObj: KonvaComponent | null = null;
  let currentImageIndex = selectedImageIndex;  // Local for display (synced via effect)

  if (selectedSlideIndex !== -1 && slides[selectedSlideIndex]) {
    // Special handling for fixed images (slide.image_url)
    if (selectedImageIndex === -99) {
      imageObj = selectedImage;
      currentImageIndex = -99;
    } else {
      const originalSlide = slides[selectedSlideIndex];

      // For user-added images, look in originalSlide.elements (which contains merged elements)
      // Primary: Try index first from original slide
      if (selectedImageIndex !== null && originalSlide.elements?.[selectedImageIndex]) {
        const candidate = originalSlide.elements[selectedImageIndex];
        if (candidate?.element_type === "image") {
          imageObj = candidate;
          currentImageIndex = selectedImageIndex;
        } else {
          console.warn('[ImageSettingsPanel] Selected index points to non-image:', candidate);
        }
      }

      // Fallback: Search by ID
      if (!imageObj && selectedImage?.properties?.image_id) {
        const targetId = selectedImage.properties.image_id;
        console.log('[ImageSettingsPanel] Searching for image_id:', targetId);

        const foundIndex = originalSlide.elements?.findIndex((el: any) => {
          if (el.element_type !== "image") return false;
          const elId = el.image_id || el.properties?.image_id;
          return elId === targetId;
        }) ?? -1;

        if (foundIndex !== -1) {
          console.log('[ImageSettingsPanel] Found match at index', foundIndex);
          imageObj = originalSlide.elements[foundIndex];
          currentImageIndex = foundIndex;
        } else {
          console.warn('[ImageSettingsPanel] No match found for image_id:', targetId);
        }
      }
    }
  }

  // ✅ FIXED: Early return AFTER all hooks (now safe - always 17 hooks called)
  if (!imageObj || imageObj.element_type !== "image") return null;

  const updateImageProperty = (props: { [key: string]: any }) => {
    if (selectedSlideIndex === -1) return;

    // Special handling for fixed images (slide.image_url)
    if (currentImageIndex === -99) {
      // Update slide.image_properties for visual properties
      const updatedSlides = slides.map((slide, idx) => {
        if (idx !== selectedSlideIndex) return slide;

        const updatedSlide = {
          ...slide,
          image_properties: {
            ...slide.image_properties,
            ...props
          },
          // Only update image_url if imageSrc changed
          ...(props.imageSrc ? { image_url: props.imageSrc } : {})
        };

        // ALSO sync to the active variant if it exists, so HTMLSlideRenderer picks it up
        if (updatedSlide.layouts && updatedSlide.layouts.length > 0) {
          const variantIndex = updatedSlide.currentVariantIndex ?? 0;
          updatedSlide.layouts = updatedSlide.layouts.map((layout: any, lIdx: number) => {
            if (lIdx === variantIndex) {
              return {
                ...layout,
                image_url: props.imageSrc || layout.image_url,
                // Some variants might store image_properties at the layout level too
                image_properties: {
                  ...(layout.image_properties || {}),
                  ...props
                }
              };
            }
            return layout;
          });
        }

        return updatedSlide;
      });

      setSlides(updatedSlides);

      // Update selectedImage to reflect changes
      setSelectedImage({
        ...selectedImage,
        properties: { ...selectedImage.properties, ...props }
      });
      return;
    }

    if (selectedImageIndex === null) return;

    const updatedSlides = structuredClone(slides);
    const originalSlide = updatedSlides[selectedSlideIndex];
    const variantIndex = originalSlide.currentVariantIndex ?? 0;
    const variant = originalSlide.layouts?.[variantIndex];
    const variantElements = variant?.elements || [];
    const userElements = originalSlide.elements || [];
    const mergedElements = [...variantElements, ...userElements];

    if (selectedImageIndex < variantElements.length) {
      // Update in variant
      if (variant && variant.elements[selectedImageIndex]) {
        variant.elements[selectedImageIndex] = {
          ...variant.elements[selectedImageIndex],
          properties: { ...variant.elements[selectedImageIndex].properties, ...props }
        };
      }
    } else {
      // Update in userElements
      const userIndex = selectedImageIndex - variantElements.length;
      if (userElements[userIndex]) {
        userElements[userIndex] = {
          ...userElements[userIndex],
          properties: { ...userElements[userIndex].properties, ...props }
        };
      }
    }

    setSlides(updatedSlides);
    // Update selectedImage from the updated element
    const updatedElement = mergedElements[selectedImageIndex];
    setSelectedImage({
      ...updatedElement,
      konva_component: updatedElement.konva_component || "Konva.Image",
      element_type: updatedElement.element_type || "image",
      properties: { ...updatedElement.properties },
    });
  };

  const updateSingleImageProperty = (prop: string, value: any) => {
    updateImageProperty({ [prop]: value });
  };

  const handleDuplicateImage = () => {
    if (!imageObj || selectedSlideIndex === -1 || currentImageIndex === null)
      return;

    // Get the current image properties to duplicate
    const originalElement = imageObj;
    if (!originalElement || !originalElement.properties) {
      console.warn('[ImageSettingsPanel] Original element missing properties in duplicate');
      return;
    }

    // Special handling for layout images (index -99) - duplicate it as a new user element
    if (currentImageIndex === -99) {
      addImage({
        imageSrc: originalElement.properties.imageSrc,
        width: 400, // Default size for new element
        height: 400,
        x: 50,
        y: 50,
      });
      return;
    }

    // Standard duplication for user-added elements
    addImage({
      imageSrc: originalElement.properties.imageSrc,
      width: originalElement.properties.width,
      height: originalElement.properties.height,
      x: (originalElement.properties?.x || 0) + 20,
      y: (originalElement.properties?.y || 0) + 20,
    });
  };

  const handleDeleteImage = () => {
    if (selectedSlideIndex === -1) return;

    // Special handling for fixed images (slide.image_url)
    if (currentImageIndex === -99) {
      const updatedSlides = slides.map((slide, idx) =>
        idx === selectedSlideIndex
          ? { ...slide, image_url: null }
          : slide
      );
      setSlides(updatedSlides);
      setSelectedImage(null);
      setSelectedImageIndex(null);
      setSelectedImageId(null);
      return;
    }

    if (selectedImageIndex === null) return;

    // ✅ FIXED: Delete from variant, not just original
    const updatedSlides = structuredClone(slides);
    const originalSlide = updatedSlides[selectedSlideIndex];

    // Delete from variant
    if (originalSlide.layouts && originalSlide.layouts.length > 0) {
      const variantIndex = originalSlide.currentVariantIndex ?? 0;
      const variant = originalSlide.layouts[variantIndex];
      if (variant && variant.elements) {
        variant.elements.splice(currentImageIndex!, 1);
      }
      // Also delete from original
      if (originalSlide.elements) {
        originalSlide.elements.splice(selectedImageIndex, 1);
      }
    } else {
      // Fallback to original if no variant
      if (originalSlide.elements) {
        originalSlide.elements.splice(selectedImageIndex, 1);
      }
    }

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
        if (selectedSlideIndex !== -1 && slides[selectedSlideIndex]) {
          // Use the central updateImageProperty function for consistency
          updateImageProperty({ imageSrc: resultUrl });
          setImageSrc(resultUrl);
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
        selectedSlideIndex === -1 ||
        currentImageIndex === null ||
        !slides[selectedSlideIndex]
      )
        return;

      // Use the central updateImageProperty function for consistency
      updateImageProperty({ imageSrc: result });
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
                onBlur={() => !isNaN(imageWidth) && updateImageProperty({ width: imageWidth })}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isNaN(imageWidth)) {
                    updateImageProperty({ width: imageWidth });
                    (e.target as HTMLInputElement).blur();
                  }
                }}
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
                onBlur={() => !isNaN(imageHeight) && updateImageProperty({ height: imageHeight })}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isNaN(imageHeight)) {
                    updateImageProperty({ height: imageHeight });
                    (e.target as HTMLInputElement).blur();
                  }
                }}
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
            if (currentImageIndex !== null && currentImageIndex !== -99) {
              sendElementBackward(selectedImageIndex);  // Use synced index
            }
          }}
          disabled={selectedImageIndex === null || selectedImageIndex === -99}
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
            if (currentImageIndex !== null && currentImageIndex !== -99) {
              bringElementForward(selectedImageIndex);  // Use synced index
            }
          }}
          disabled={selectedImageIndex === null || selectedImageIndex === -99}
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