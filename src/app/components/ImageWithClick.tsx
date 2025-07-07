"use client";
import React from "react";
import {
  IconButton,
  Box,
  Popover,
  MenuItem,
  CircularProgress,
  Typography,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Image from "next/image";

export default function ImageWithClick({
  src,
  alt,
  onShowLarge,
  onRegenerate,
  onPreviewImage,
  isLoading = false,
}: {
  src: string;
  alt: string;
  onShowLarge?: () => void;
  onRegenerate?: (e: React.MouseEvent, closeMenu: () => void) => void;
  onPreviewImage?: (src: string) => void;
  isLoading?: boolean;
}) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPreviewImage?.(src);
  };

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => setAnchorEl(null);

  const handleRegenerateClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    onRegenerate?.(event, handlePopoverClose);
  };

  const open = Boolean(anchorEl);

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
          "&:hover .overlay": {
            display: "flex",
          },
        }}
        onClick={handleClick}
      >
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

        <Box
          className="overlay"
          sx={{
            display: { xs: "flex", md: "none" },
            position: "absolute",
            top: 2,
            right: 2,
            backgroundColor: "rgba(255, 255, 255, 0.85)",
            borderRadius: "50%",
            zIndex: 2,
            pointerEvents: "auto",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <IconButton size="small" sx={{ p: 0.5 }} onClick={handlePopoverOpen}>
            <MoreHorizIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        disablePortal
        PaperProps={{
          sx: {
            p: 1,
            minWidth: 160,
          },
        }}
      >
        <MenuItem
          onClick={handleRegenerateClick}
          disabled={isLoading}
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          {isLoading ? (
            <>
              <CircularProgress size={16} color="inherit" />
              <Typography variant="body2">Generating...</Typography>
            </>
          ) : (
            <Typography variant="body2">Regenerate Image</Typography>
          )}
        </MenuItem>
      </Popover>
    </>
  );
}
