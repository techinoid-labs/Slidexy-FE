"use client";

import React, { useState } from "react";
import {
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import CloseIcon from "@mui/icons-material/Close";
import { useLinkedIn } from "@/app/context/LinkedInContext";

interface LinkedInShareMenuProps {
  onShareSlide?: () => void;
  onShareCustom?: () => void;
  onDisconnect?: () => void;
  variant?: "contained" | "outlined" | "text";
  size?: "small" | "medium" | "large";
  sx?: any;
}

/**
 * LinkedInShareMenu Component
 * Dropdown menu with LinkedIn actions: share, disconnect, etc.
 */
export const LinkedInShareMenu: React.FC<LinkedInShareMenuProps> = ({
  onShareSlide,
  onShareCustom,
  onDisconnect,
  variant = "outlined",
  size = "medium",
  sx = {},
}) => {
  const { isConnected, connectionLoading, disconnect } = useLinkedIn();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [disconnecting, setDisconnecting] = useState(false);

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleShareSlide = async () => {
    onShareSlide?.();
    handleClose();
  };

  const handleShareCustom = async () => {
    onShareCustom?.();
    handleClose();
  };

  const handleDisconnect = async () => {
    setDisconnecting(true);
    const success = await disconnect();
    setDisconnecting(false);
    if (success) {
      onDisconnect?.();
    }
    handleClose();
  };

  return (
    <>
      <Button
        id="linkedin-menu-button"
        aria-controls={open ? "linkedin-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        disabled={connectionLoading || !isConnected}
        startIcon={
          connectionLoading ? (
            <CircularProgress size={20} />
          ) : (
            <LinkedInIcon />
          )
        }
        variant={variant}
        size={size}
        sx={{
          ...sx,
          ...(isConnected && {
            backgroundColor: "#0A66C2",
            color: "white",
            "&:hover": {
              backgroundColor: "#004182",
            },
          }),
        }}
      >
        {!isMobile ? "LinkedIn" : ""}
      </Button>

      <Menu
        id="linkedin-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={handleShareSlide} disabled={connectionLoading}>
          <ListItemIcon>
            <ShareIcon fontSize="small" sx={{ color: "#0A66C2" }} />
          </ListItemIcon>
          <ListItemText>Share Slide</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleShareCustom} disabled={connectionLoading}>
          <ListItemIcon>
            <ShareIcon fontSize="small" sx={{ color: "#0A66C2" }} />
          </ListItemIcon>
          <ListItemText>Share Custom Content</ListItemText>
        </MenuItem>

        <Divider />

        <MenuItem
          onClick={handleDisconnect}
          disabled={disconnecting || connectionLoading}
          sx={{ color: "error.main" }}
        >
          <ListItemIcon>
            {disconnecting ? (
              <CircularProgress size={20} />
            ) : (
              <CloseIcon fontSize="small" sx={{ color: "error.main" }} />
            )}
          </ListItemIcon>
          <ListItemText>Disconnect LinkedIn</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default LinkedInShareMenu;
