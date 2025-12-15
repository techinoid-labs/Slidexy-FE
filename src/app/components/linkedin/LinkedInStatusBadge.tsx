"use client";

import React from "react";
import {
  Box,
  Chip,
  Avatar,
  Tooltip,
  CircularProgress,
  Popover,
  Card,
  CardContent,
  Typography,
  Divider,
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
 * Hover to see full profile details and ID
 */
export const LinkedInStatusBadge: React.FC<LinkedInStatusBadgeProps> = ({
  showProfile = true,
  size = "medium",
  sx = {},
}) => {
  const { isConnected, connectionLoading, connectionStatus } = useLinkedIn();
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

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
    <>
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
        onMouseEnter={handlePopoverOpen}
        sx={{
          backgroundColor: "#0A66C2",
          color: "white",
          cursor: "pointer",
          transition: "all 0.2s ease",
          "&:hover": {
            backgroundColor: "#004182",
            transform: "scale(1.05)",
          },
          "& .MuiChip-label": {
            color: "white",
            fontWeight: 500,
          },
          ...sx,
        }}
      />

      {/* Profile Preview Popover */}
      <Popover
        id="linkedin-profile-preview"
        open={open}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        slotProps={{
          paper: {
            onMouseLeave: handlePopoverClose,
          },
        }}
      >
        <Card sx={{ width: 280, boxShadow: 3 }}>
          <CardContent>
            {/* Profile Picture and Name */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Avatar
                src={profile.picture}
                alt={profile.name}
                sx={{
                  width: 80,
                  height: 80,
                  border: "3px solid #0A66C2",
                  mb: 1,
                }}
              />
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, textAlign: "center" }}
              >
                {profile.name}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textAlign: "center" }}
              >
                {profile.email}
              </Typography>
            </Box>

            <Divider sx={{ my: 1.5 }} />

            {/* Profile ID */}
            <Box sx={{ mb: 1.5 }}>
              <Typography
                variant="caption"
                sx={{ color: "text.secondary", fontWeight: 600 }}
              >
                LinkedIn ID
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  fontFamily: "monospace",
                  backgroundColor: "#f5f5f5",
                  p: 1,
                  borderRadius: 0.5,
                  mt: 0.5,
                  wordBreak: "break-all",
                }}
              >
                {profile.id}
              </Typography>
            </Box>

            {/* Status Indicator */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1.5 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: "#4caf50",
                }}
              />
              <Typography
                variant="caption"
                sx={{ color: "#4caf50", fontWeight: 600 }}
              >
                Active Connection
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Popover>
    </>
  );
};

export default LinkedInStatusBadge;
