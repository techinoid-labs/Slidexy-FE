"use client";

import React from "react";
import {
  Button,
  CircularProgress,
  Tooltip,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { useLinkedIn } from "@/app/context/LinkedInContext";

interface LinkedInConnectButtonProps {
  onAuthUrl?: (url: string) => void;
  variant?: "contained" | "outlined" | "text";
  size?: "small" | "medium" | "large";
  fullWidth?: boolean;
  sx?: any;
}

/**
 * LinkedInConnectButton Component
 * Button to initiate LinkedIn OAuth flow
 * Opens LinkedIn authorization in new window
 */
export const LinkedInConnectButton: React.FC<LinkedInConnectButtonProps> = ({
  onAuthUrl,
  variant = "contained",
  size = "medium",
  fullWidth = false,
  sx = {},
}) => {
  const { isConnected, connectionLoading, initiateAuth } = useLinkedIn();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleConnect = async () => {
    const authUrl = await initiateAuth();
    if (authUrl) {
      onAuthUrl?.(authUrl);
      // Open in new window
      window.open(authUrl, "linkedin-auth", "width=500,height=600");
    }
  };

  const buttonText = isConnected ? "Connected to LinkedIn" : "Connect LinkedIn";
  const isDisabled = isConnected || connectionLoading;

  return (
    <Tooltip
      title={
        isConnected
          ? "You're already connected to LinkedIn"
          : "Connect your LinkedIn account to share presentations"
      }
    >
      <span>
        <Button
          startIcon={
            connectionLoading ? (
              <CircularProgress size={20} />
            ) : (
              <LinkedInIcon />
            )
          }
          onClick={handleConnect}
          disabled={isDisabled}
          variant={variant}
          size={size}
          fullWidth={fullWidth}
          sx={{
            backgroundColor: isConnected ? "#0A66C2" : "#0A66C2",
            color: "white",
            "&:hover": {
              backgroundColor: "#004182",
            },
            "&:disabled": {
              backgroundColor: "#9CADC9",
              color: "white",
            },
            ...sx,
          }}
        >
          {!isMobile ? buttonText : "LinkedIn"}
        </Button>
      </span>
    </Tooltip>
  );
};

export default LinkedInConnectButton;
