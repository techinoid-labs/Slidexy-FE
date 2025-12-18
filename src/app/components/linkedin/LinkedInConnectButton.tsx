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
            // Default styles based on variant
            ...(variant === "contained" && {
              bgcolor: "#0A66C2",
              color: "#fff",
              "&:hover": {
                bgcolor: "#004182",
              },
            }),
            ...(variant === "outlined" && {
              borderColor: "#0A66C2",
              color: "#0A66C2",
              "&:hover": {
                bgcolor: "#0A66C2",
                color: "#fff",
                borderColor: "#0A66C2",
              },
            }),
            ...(variant === "text" && {
              color: "#0A66C2",
              "&:hover": {
                bgcolor: "rgba(10, 102, 194, 0.08)",
              },
            }),

            "&:disabled": {
              bgcolor: variant === "contained" ? "#9CADC9" : "transparent",
              color: "#9CADC9",
              borderColor: variant === "outlined" ? "#9CADC9" : "transparent",
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
