"use client";

import React, { useState } from "react";
import { Box, Button, CircularProgress } from "@mui/material";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import ShareIcon from "@mui/icons-material/Share";
import { useLinkedIn } from "@/app/context/LinkedInContext";
import { useSlides } from "@/app/context/SlidesContext";
import { useSlideThemeContext } from "@/app/context/ThemeContext";
import { LinkedInConnectButton, LinkedInShareDialog } from "@/app/components/linkedin";
import { useSearchParams } from "next/navigation";
import html2canvas from "html2canvas";

interface LinkedInShareButtonProps {
  sx?: any;
}

/**
 * LinkedInShareButton Component
 * Integrated LinkedIn share button for the editor
 * Shows connect button if not connected, share button if connected
 */
export const LinkedInShareButton: React.FC<LinkedInShareButtonProps> = ({
  sx = {},
}) => {
  const { isConnected, connectionLoading } = useLinkedIn();
  // The deck, so the dialog can offer a carousel post rather than only
  // the single slide this button used to share.
  const { slides } = useSlides() as any;
  const { selectedTheme } = useSlideThemeContext() as any;
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [slideScreenshot, setSlideScreenshot] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const presentationId = searchParams.get("pid");
  const [capturing, setCapturing] = useState(false);

  const handleShareClick = async () => {
    if (!isConnected) return;

    try {
      setCapturing(true);
      // Capture the current slide (find Konva stage)
      const stageElement = document.querySelector(
        ".konva-slide-renderer, [role='presentation']"
      ) as HTMLElement;

      if (stageElement) {
        const canvas = await html2canvas(stageElement, {
          backgroundColor: "#fff",
          scale: 2,
          allowTaint: true,
          useCORS: true,
        });
        const imageData = canvas.toDataURL("image/png");
        setSlideScreenshot(imageData);
      }

      setShareDialogOpen(true);
    } catch (error) {
      console.error("[LinkedIn Share] Error capturing slide:", error);
    } finally {
      setCapturing(false);
    }
  };

  if (!isConnected) {
    return (
      <LinkedInConnectButton
        variant="outlined"
        size="medium"
        sx={{ fontSize: 14, ...sx }}
      />
    );
  }

  return (
    <>
      <Button
        variant="contained"
        onClick={handleShareClick}
        disabled={capturing || connectionLoading}
        sx={{
          background: "linear-gradient(80.89deg, #0A66C2 -90.43%, #004182 74.73%)",
          fontSize: 14,
          boxShadow: capturing || connectionLoading ? "none" : "0 4px 12px rgba(10, 102, 194, 0.2)",
          "&:hover": {
            background: "linear-gradient(80.89deg, #0A66C2 -90.43%, #004182 74.73%)",
            boxShadow: capturing || connectionLoading ? "none" : "0 6px 16px rgba(10, 102, 194, 0.4)",
          },
          ...sx,
        }}
        startIcon={
          capturing ? (
            <CircularProgress size={16} color="inherit" />
          ) : (
            <ShareIcon sx={{ fontSize: 16 }} />
          )
        }
      >
        {capturing ? "Preparing..." : "Share"}
      </Button>

      <LinkedInShareDialog
        open={shareDialogOpen}
        onClose={() => setShareDialogOpen(false)}
        presentationId={presentationId || undefined}
        slideIndex={0}
        slideThumbnail={slideScreenshot || undefined}
        slideTitle="Presentation Slide"
        slides={slides}
        theme={selectedTheme}
      />
    </>
  );
};

export default LinkedInShareButton;
