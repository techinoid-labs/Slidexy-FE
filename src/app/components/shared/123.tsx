import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Divider,
  Typography,
  IconButton,
  InputBase,
  Switch,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useSlides } from "@/app/context/SlidesContext";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

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

  // 🔁 Sync local state with selectedImage when it changes
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

  // ✅ Debounced update to Redux slides
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
    <Box className="w-[360px] min-w-[320px] md:min-w-[320px] bg-white flex flex-col overflow-y-auto border-r border-gray-200">
      {/* Tabs */}
      <Box sx={{ display: "flex", alignItems: "center", px: 2, pt: 2, pb: 1 }}>
        <Box
          sx={{
            bgcolor: "#F5F5F5",
            color: "#222",
            fontWeight: 600,
            borderRadius: 2,
            px: 2.5,
            py: 1,
            fontSize: 15,
            mr: 2,
          }}
        >
          Settings
        </Box>
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
        <Divider sx={{ my: 2 }} />

        <Box sx={{ px: 3, mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <Typography sx={{ fontWeight: 600, fontSize: 16, flex: 1 }}>
              Layer Order
            </Typography>
          </Box>
          <Box sx={{ mb: 2, display: "flex", gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => bringElementForward(selectedImageIndex)}
              endIcon={<ArrowUpwardIcon />}
              sx={{
                borderRadius: 2,
                fontWeight: 600,
                fontSize: 12,
                bgcolor: "#F8F8FA",
                borderColor: "#E0E0E0",
                color: "#222",
                textTransform: "none",
                whiteSpace: "nowrap",
                minWidth: 140,
                "&:hover": {
                  bgcolor: "#F3EDFF",
                  borderColor: "#7B4AE2",
                  color: "#7B4AE2",
                },
              }}
            >
              Bring Forward
            </Button>
            <Button
              variant="outlined"
              onClick={() => sendElementBackward(selectedImageIndex)}
              endIcon={<ArrowDownwardIcon />}
              sx={{
                borderRadius: 2,
                fontWeight: 600,
                fontSize: 12,
                bgcolor: "#F8F8FA",
                borderColor: "#E0E0E0",
                color: "#222",
                textTransform: "none",
                whiteSpace: "nowrap",
                minWidth: 140,
                "&:hover": {
                  bgcolor: "#F3EDFF",
                  borderColor: "#7B4AE2",
                  color: "#7B4AE2",
                },
              }}
            >
              Send Backward
            </Button>
          </Box>
        </Box>
        {/* Set as Background */}
        {/* <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Typography sx={{ fontWeight: 500, fontSize: 15, flex: 1 }}>
            Set as Background
          </Typography>
          <Switch checked={isBackground} onChange={handleSwitchChange} />
        </Box> */}
      </Box>
    </Box>
  );
};

export default ImageSettingsPanel;  