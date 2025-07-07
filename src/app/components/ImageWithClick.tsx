// ImageWithClick.tsx
import React from "react";
import {
  IconButton,
  Box,
  Menu,
  MenuItem,
  CircularProgress,
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
  const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPreviewImage?.(src);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => setMenuAnchor(null);

  const handleRegenerateClick = (event: React.MouseEvent<HTMLLIElement>) => {
    event.stopPropagation();
    onRegenerate?.(event, handleMenuClose);
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
          <IconButton
            size="small"
            sx={{ p: 0.5 }}
            onClick={(e) => {
              e.stopPropagation();
              setMenuAnchor(e.currentTarget);
            }}
          >
            <MoreHorizIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        disablePortal // ✅ Correct usage here
      >
        <MenuItem onClick={handleRegenerateClick} disabled={isLoading}>
          {isLoading ? (
            <>
              <CircularProgress size={16} sx={{ mr: 1 }} color="inherit" />
              Generating...
            </>
          ) : (
            "Regenerate Image"
          )}
        </MenuItem>
      </Menu>
    </>
  );
}
