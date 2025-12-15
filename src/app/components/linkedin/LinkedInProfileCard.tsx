"use client";

import React from "react";
import {
  Card,
  CardContent,
  Box,
  Avatar,
  Typography,
  Button,
  Divider,
  CircularProgress,
  Skeleton,
} from "@mui/material";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import LogoutIcon from "@mui/icons-material/Logout";
import { useLinkedIn } from "@/app/context/LinkedInContext";

interface LinkedInProfileCardProps {
  onDisconnect?: () => void;
  sx?: any;
}

/**
 * LinkedInProfileCard Component
 * Shows full LinkedIn profile information with actions
 * Displays: profile picture, name, email, connection status, and disconnect button
 */
export const LinkedInProfileCard: React.FC<LinkedInProfileCardProps> = ({
  onDisconnect,
  sx = {},
}) => {
  const { isConnected, connectionLoading, connectionStatus, disconnect } =
    useLinkedIn();
  const [disconnecting, setDisconnecting] = React.useState(false);

  const handleDisconnect = async () => {
    setDisconnecting(true);
    const success = await disconnect();
    setDisconnecting(false);
    if (success) {
      onDisconnect?.();
    }
  };

  if (connectionLoading) {
    return (
      <Card sx={{ maxWidth: 400, ...sx }}>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Skeleton variant="circular" width={60} height={60} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="100%" height={24} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="80%" height={20} />
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (!isConnected) {
    return (
      <Card sx={{ maxWidth: 400, ...sx }}>
        <CardContent sx={{ textAlign: "center", py: 3 }}>
          <LinkedInIcon sx={{ fontSize: 48, color: "#0A66C2", mb: 2 }} />
          <Typography variant="h6" sx={{ mb: 1 }}>
            Not Connected
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Connect your LinkedIn account to share presentations with your network
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const profile = connectionStatus?.profile;
  const expiryDate = connectionStatus?.expiryDate;

  return (
    <Card sx={{ maxWidth: 400, ...sx }}>
      <CardContent>
        {/* Profile Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mb: 2,
          }}
        >
          {/* Profile Picture */}
          <Avatar
            src={profile?.picture}
            alt={profile?.name}
            sx={{
              width: 60,
              height: 60,
              border: "3px solid #0A66C2",
            }}
          >
            <LinkedInIcon />
          </Avatar>

          {/* Profile Info */}
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                color: "#202124",
              }}
            >
              {profile?.name}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {profile?.email}
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                mt: 0.5,
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: "#4caf50",
                }}
              />
              <Typography variant="caption" sx={{ color: "#4caf50" }}>
                Connected
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Connection Details */}
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="caption"
            sx={{
              display: "block",
              color: "text.secondary",
              mb: 0.5,
              fontWeight: 600,
            }}
          >
            LinkedIn Profile ID
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontFamily: "monospace",
              backgroundColor: "#f5f5f5",
              p: 1,
              borderRadius: 1,
              wordBreak: "break-all",
            }}
          >
            {profile?.id}
          </Typography>
        </Box>

        {expiryDate && (
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="caption"
              sx={{
                display: "block",
                color: "text.secondary",
                mb: 0.5,
                fontWeight: 600,
              }}
            >
              Token Expiry
            </Typography>
            <Typography variant="body2">
              {new Date(expiryDate).toLocaleDateString()} at{" "}
              {new Date(expiryDate).toLocaleTimeString()}
            </Typography>
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        {/* Actions */}
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="contained"
            size="small"
            startIcon={<LinkedInIcon />}
            sx={{
              flex: 1,
              backgroundColor: "#0A66C2",
              "&:hover": {
                backgroundColor: "#004182",
              },
            }}
          >
            View Profile
          </Button>
          <Button
            variant="outlined"
            size="small"
            color="error"
            startIcon={disconnecting ? <CircularProgress size={16} /> : <LogoutIcon />}
            onClick={handleDisconnect}
            disabled={disconnecting}
            sx={{ flex: 1 }}
          >
            Disconnect
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default LinkedInProfileCard;
