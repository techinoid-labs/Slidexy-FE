import React from "react";
import { IconButton, Box, Menu, MenuItem } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Image from "next/image";

export default function ImageWithClick({
  src,
  alt,
  onShowLarge,
  onRegenerate,
  isLoading = false,
}: {
  src: string;
  alt: string;
  onShowLarge?: () => void;
  onRegenerate?: (e: React.MouseEvent) => void;
  isLoading?: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null);
  const isDesktop = typeof window !== "undefined" && window.innerWidth >= 768;

  const handleClick = () => {
    if (isDesktop && onShowLarge) {
      onShowLarge();
    } else {
      setOpen(true);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => setMenuAnchor(null);

  const handleRegenerateClick = (event: React.MouseEvent<HTMLLIElement>) => {
    handleMenuClose();
    onRegenerate?.(event); // ✅ triggers parent function
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
          alt={alt}
          width={32}
          height={32}
          style={{
            objectFit: "contain",
            maxWidth: "100%",
            maxHeight: "100%",
          }}
        />
        {/* Overlay always visible on mobile, hover-visible on desktop */}
        <Box
          className="overlay"
          sx={{
            display: "flex", // Optional: or use hover logic
            position: "absolute",
            top: 2,
            right: 2,
            backgroundColor: "rgba(255, 255, 255, 0.85)",
            borderRadius: "50%",
            zIndex: 2,
            pointerEvents: "auto", // ✅ Fully interactive
          }}
          onClick={(e) => e.stopPropagation()} // ✅ Prevent image click
        >
          <IconButton
            size="small"
            sx={{ p: 0.5 }}
            onClick={(e) => {
              e.stopPropagation(); // ✅ Prevent bubbling
              setMenuAnchor(e.currentTarget);
            }}
          >
            <MoreHorizIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* Right-click dropdown menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem
          onClick={(event) => handleRegenerateClick(event)}
          disabled={isLoading}
        >
          {isLoading ? "Generating..." : "Regenerate Image"}
        </MenuItem>
      </Menu>

      {/* Fullscreen modal view on mobile tap */}
      {!isDesktop && open && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            bgcolor: "rgba(0,0,0,0.4)",
            zIndex: 2000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setOpen(false)}
        >
          <Box
            sx={{
              bgcolor: "white",
              borderRadius: 2,
              boxShadow: 4,
              p: 2,
              width: { xs: 180, sm: 220 },
              height: { xs: 180, sm: 220 },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={src}
              alt={alt}
              width={160}
              height={160}
              style={{ objectFit: "contain" }}
            />
          </Box>
        </Box>
      )}
    </>
  );
}
