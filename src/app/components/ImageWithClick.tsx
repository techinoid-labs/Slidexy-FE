"use client";
import React from "react";
import { Box, CircularProgress } from "@mui/material";
import Image from "next/image";

export default function ImageWithClick({
  src,
  alt,
  onShowLarge,
  onPreviewImage,
  isLoading = false,
  width,
  height,
}: {
  src: string;
  alt: string;
  onShowLarge?: () => void;
  onPreviewImage?: (src: string) => void;
  isLoading?: boolean;
  /** Overrides the default square. Given so a caller with a column to
   *  fill can fill it, instead of leaving a stamp in the corner. */
  width?: object | string | number;
  height?: object | string | number;
}) {
  const [imgError, setImgError] = React.useState(false);
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLoading && !imgError) {
      onPreviewImage?.(src);
    }
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: width ?? { xs: 62, sm: 80 },
        height: height ?? { xs: 59, sm: 80 },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        cursor: isLoading ? "default" : "pointer",
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
          <CircularProgress size={24} />
        </Box>
      ) : imgError ? (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#f8d7da",
            color: "#721c24",
            fontSize: 12,
            border: "1px solid #f5c6cb",
            borderRadius: 2,
          }}
        >
          Image not found
        </Box>
      ) : (
        <Image
          src={src}
          alt={alt || "Slide image"}
          width={70}
          height={70}
          style={{
            objectFit: "cover",
            width: "100%",
            height: "100%",
          }}
          onError={() => setImgError(true)}
        />
      )}
    </Box>
  );
}