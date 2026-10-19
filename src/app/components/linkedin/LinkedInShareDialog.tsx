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
  Avatar,
  Divider,
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
  /** The whole deck, needed for a carousel post. */
  slides?: any[];
  theme?: any;
  deckTitle?: string;
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
  slides,
  theme,
  deckTitle,
}) => {
  const { shareSlide, shareCustomContent, shareDeckAsCarousel, connectionLoading, connectionError, connectionStatus } =
    useLinkedIn();

  const [message, setMessage] = useState(
    `Just created this amazing slide using Slidexy! 🚀`
  );
  const [isSharing, setIsSharing] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [includeCaption, setIncludeCaption] = useState(true);

  // Carousel by default when there is a deck to post. A document carousel
  // is the format that actually travels on LinkedIn; a single slide as a
  // flat image is the weakest thing you can publish.
  const canCarousel = Array.isArray(slides) && slides.length > 1;
  const [mode, setMode] = useState<"carousel" | "slide">("carousel");
  const [buildProgress, setBuildProgress] = useState<string | null>(null);

  React.useEffect(() => {
    setMode(canCarousel ? "carousel" : "slide");
  }, [canCarousel]);

  const handleShare = async () => {
    try {
      setIsSharing(true);
      setShareError(null);
      setShareSuccess(false);

      let result;

      if (mode === "carousel" && canCarousel) {
        setBuildProgress("Rendering deck…");
        const { exportSlidesAsPDF } = await import("@/utils/exportSlides");
        const pdf = (await exportSlidesAsPDF(slides!, theme, {
          output: "blob",
          onProgress: (done, total) => setBuildProgress(`Rendering slide ${done} of ${total}…`),
        })) as Blob;
        setBuildProgress("Uploading to LinkedIn…");

        if (!pdf || !(pdf instanceof Blob)) {
          setShareError("Could not render the deck as a PDF");
          return;
        }
        result = await shareDeckAsCarousel({
          pdf,
          message: includeCaption ? message : " ",
          title: deckTitle || slideTitle,
        });
      } else if (presentationId && slideIndex !== undefined) {
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
          `Just created this amazing slide using Slidexy! 🚀`
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
      setBuildProgress(null);
    }
  };

  const handleClose = () => {
    if (!isSharing) {
      setMessage(`Just created this amazing slide using Slidexy! 🚀`);
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
        {/* What gets posted. A document carousel is the format the feed
            actually rewards, so it leads and is the default. */}
        {canCarousel && (
          <Box sx={{ display: "flex", gap: 1.25, mb: 2 }}>
            {([
              { id: "carousel" as const, title: `Whole deck · ${slides!.length} slides`, sub: "Swipeable carousel" },
              { id: "slide" as const, title: "This slide only", sub: "Single image" },
            ]).map((opt) => (
              <Box
                key={opt.id}
                onClick={() => !isSharing && setMode(opt.id)}
                sx={{
                  flex: 1,
                  p: 1.25,
                  borderRadius: "10px",
                  cursor: isSharing ? "default" : "pointer",
                  border: (t) =>
                    mode === opt.id
                      ? `2px solid ${t.palette.primary.main}`
                      : "2px solid rgba(0,0,0,0.1)",
                  background: mode === opt.id ? "rgba(142,45,226,0.06)" : "transparent",
                  transition: "border-color 0.15s, background 0.15s",
                }}
              >
                <Typography sx={{ fontSize: 13, fontWeight: 700 }}>{opt.title}</Typography>
                <Typography sx={{ fontSize: 11.5, color: "text.secondary" }}>{opt.sub}</Typography>
              </Box>
            ))}
          </Box>
        )}

        {buildProgress && (
          <Alert severity="info" sx={{ mb: 2 }}>
            {buildProgress}
          </Alert>
        )}
        {/* Profile Preview */}
        {connectionStatus?.profile && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              p: 2,
              mb: 2,
              backgroundColor: "#f0f7ff",
              borderRadius: 1,
              border: "1px solid #0A66C2",
            }}
          >
            <Avatar
              src={connectionStatus.profile.picture}
              alt={connectionStatus.profile.name}
              sx={{
                width: 40,
                height: 40,
                border: "2px solid #0A66C2",
              }}
            />
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {connectionStatus.profile.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Posting to your LinkedIn
              </Typography>
            </Box>
          </Box>
        )}

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
          {isSharing
            ? buildProgress || "Sharing…"
            : mode === "carousel" && canCarousel
            ? "Post carousel"
            : "Share to LinkedIn"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LinkedInShareDialog;
