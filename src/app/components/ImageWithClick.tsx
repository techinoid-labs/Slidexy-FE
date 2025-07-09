"use client";
import React from "react";
import {  
  Box,
} from "@mui/material";
import Image from "next/image";

export default function ImageWithClick({
  src,
  alt,
  onShowLarge, // Still available if needed for other functionality
  onPreviewImage,
  isLoading = false, // Still available for the main image loading state
}: {
  src: string;
  alt: string;
  onShowLarge?: () => void;
  onPreviewImage?: (src: string) => void;
  isLoading?: boolean;
}) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPreviewImage?.(src);
  };

  return (
    <>
      <Box
        sx={{
          position: "relative",
          width: { xs: 48, sm: 56, md: 64 },
          height: { xs: 48, sm: 56, md: 64 },
          borderRadius: 2,
          bgcolor: "#F2F0FF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          cursor: "pointer",
        }}
        onClick={handleClick}
      >
        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
            }}
          >
            {/* Re-added CircularProgress import just for this */}
          </Box>
        ) : (
          <Image
            src={src}
            alt={alt || "Slide image"}
            width={32}
            height={32}
            style={{
              objectFit: "contain",
              maxWidth: "100%",
              maxHeight: "100%",
            }}
          />
        )}
      </Box>
    </>
  );
}
