"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  CircularProgress,
  Alert,
  Typography,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import { useLinkedIn } from "@/app/context/LinkedInContext";

interface LinkedInShareDialogProps {
  open: boolean;
  onClose: () => void;
  presentationId?: string;
  slideIndex?: number;
  slideThumbnail?: string;
  slideTitle?: string;
}

/**
 * LinkedInShareDialog Component
 * Dialog to share a slide or custom content to LinkedIn
 */
export const LinkedInShareDialog: React.FC<LinkedInShareDialogProps> = ({
  open,
  onClose,
  presentationId,
  slideIndex = 0,
  slideThumbnail,
  slideTitle = "Check out this presentation!",
}) => {
  const { shareSlide, shareCustomContent, connectionLoading, connectionError } =
    useLinkedIn();

  const [message, setMessage] = useState(
    `Just created this amazing slide using Neuro Engine! 🚀`
  );
  const [isSharing, setIsSharing] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [includeCaption, setIncludeCaption] = useState(true);

  const handleShare = async () => {
    try {
      setIsSharing(true);
      setShareError(null);
      setShareSuccess(false);

      let result;

      if (presentationId && slideIndex !== undefined) {
        result = await shareSlide({
          presentationId,
          slideIndex,
          message: includeCaption ? message : undefined,
        });
      } else if (slideThumbnail) {
        result = await shareCustomContent({
          imageUrl: slideThumbnail,
          message: includeCaption ? message : undefined,
        });
      } else {
        setShareError("No content to share. Please provide presentation or image.");
        return;
      }

      if (result.success) {
        setShareSuccess(true);
        setMessage(
          `Just created this amazing slide using Neuro Engine! 🚀`
        );
        // Auto-close after 2 seconds
        setTimeout(() => {
          onClose();
          setShareSuccess(false);
        }, 2000);
      } else {
        setShareError(result.message);
      }
    } catch (error: any) {
      setShareError(error.message || "Failed to share");
    } finally {
      setIsSharing(false);
    }
  };

  const handleClose = () => {
    if (!isSharing) {
      setMessage(`Just created this amazing slide using Neuro Engine! 🚀`);
      setShareError(null);
      setShareSuccess(false);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <ShareIcon sx={{ color: "#0A66C2" }} />
          <Typography variant="h6">Share to LinkedIn</Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ py: 2 }}>
        {/* Error messages */}
        {connectionError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Connection Error: {connectionError}
          </Alert>
        )}

        {shareError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {shareError}
          </Alert>
        )}

        {shareSuccess && (
          <Alert severity="success" sx={{ mb: 2 }}>
            ✅ Successfully shared to LinkedIn!
          </Alert>
        )}

        {/* Slide preview info */}
        {slideTitle && (
          <Box
            sx={{
              p: 2,
              mb: 2,
              backgroundColor: "#f5f5f5",
              borderRadius: 1,
              borderLeft: "4px solid #0A66C2",
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
              Slide: {slideTitle}
            </Typography>
            {slideThumbnail && (
              <img
                src={slideThumbnail}
                alt={slideTitle}
                style={{
                  width: "100%",
                  height: "auto",
                  maxHeight: "150px",
                  borderRadius: "4px",
                  marginTop: "8px",
                }}
              />
            )}
          </Box>
        )}

        {/* Message input */}
        <TextField
          fullWidth
          multiline
          rows={3}
          label="Share message (optional)"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Add a message to go with your share..."
          disabled={isSharing}
          sx={{ mb: 2 }}
        />

        {/* Include caption checkbox */}
        <FormControlLabel
          control={
            <Checkbox
              checked={includeCaption}
              onChange={(e) => setIncludeCaption(e.target.checked)}
              disabled={isSharing}
            />
          }
          label="Include message with post"
        />
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={handleClose}
          disabled={isSharing}
          variant="outlined"
        >
          Cancel
        </Button>
        <Button
          onClick={handleShare}
          disabled={isSharing || connectionLoading}
          variant="contained"
          sx={{
            backgroundColor: "#0A66C2",
            "&:hover": {
              backgroundColor: "#004182",
            },
          }}
          startIcon={
            isSharing ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <ShareIcon />
            )
          }
        >
          {isSharing ? "Sharing..." : "Share to LinkedIn"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LinkedInShareDialog;
