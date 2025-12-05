"use client";

import React from "react";
import {
  Box,
  Chip,
  Avatar,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { useLinkedIn } from "@/app/context/LinkedInContext";

interface LinkedInStatusBadgeProps {
  showProfile?: boolean;
  size?: "small" | "medium";
  sx?: any;
}

/**
 * LinkedInStatusBadge Component
 * Shows current LinkedIn connection status and profile info
 */
export const LinkedInStatusBadge: React.FC<LinkedInStatusBadgeProps> = ({
  showProfile = true,
  size = "medium",
  sx = {},
}) => {
  const { isConnected, connectionLoading, connectionStatus } = useLinkedIn();

  if (connectionLoading) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, ...sx }}>
        <CircularProgress size={20} />
      </Box>
    );
  }

  if (!isConnected || !connectionStatus?.profile) {
    return (
      <Tooltip title="LinkedIn not connected">
        <Chip
          icon={<LinkedInIcon />}
          label="Not Connected"
          variant="outlined"
          size={size}
          color="default"
          sx={{
            backgroundColor: "#f5f5f5",
            ...sx,
          }}
        />
      </Tooltip>
    );
  }

  const profile = connectionStatus.profile;

  return (
    <Tooltip title={`Connected as: ${profile.name} (${profile.email})`}>
      <Chip
        avatar={
          profile.picture ? (
            <Avatar src={profile.picture} alt={profile.name} />
          ) : (
            <Avatar>
              <LinkedInIcon />
            </Avatar>
          )
        }
        label={showProfile ? profile.name : "Connected"}
        variant="filled"
        size={size}
        sx={{
          backgroundColor: "#0A66C2",
          color: "white",
          "& .MuiChip-label": {
            color: "white",
            fontWeight: 500,
          },
          ...sx,
        }}
      />
    </Tooltip>
  );
};

export default LinkedInStatusBadge;
