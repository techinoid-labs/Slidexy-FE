// components/ImageSuggestionsBox.tsx
import React from "react";
import { Box, Typography } from "@mui/material";
import Image from "next/image";

interface ImageSuggestionsBoxProps {
  x: number;
  y: number;
  suggestions: string[];
  onSelect: (url: string) => void;
  onClose: () => void;
}

const ImageSuggestionsBox: React.FC<ImageSuggestionsBoxProps> = ({
  x,
  y,
  suggestions,
  onSelect,
  onClose,
}) => {
  return (
    <Box
      sx={{
        position: "absolute",
        top: y,
        left: x,
        bgcolor: "white",
        borderRadius: 2,
        boxShadow: 6,
        padding: 1.5,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: 1,
        width: 200,
        border: "1px solid #e0e0e0",
      }}
    >
      <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
        Choose a new image:
      </Typography>
      {suggestions.map((url, i) => (
        <Box
          key={i}
          sx={{
            width: "100%",
            height: 100,
            borderRadius: 1,
            overflow: "hidden",
            cursor: "pointer",
            position: "relative",
            "&:hover": {
              outline: "2px solid #8E2DE2",
            },
          }}
          onClick={() => onSelect(url)}
        >
          <Image
            src={url}
            alt={`suggestion-${i}`}
            fill
            style={{ objectFit: "cover" }}
          />
        </Box>
      ))}
      <Typography
        variant="caption"
        color="gray"
        sx={{ mt: 1, textAlign: "center", cursor: "pointer" }}
        onClick={onClose}
      >
        Cancel
      </Typography>
    </Box>
  );
};

export default ImageSuggestionsBox;
