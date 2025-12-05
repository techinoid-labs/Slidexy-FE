"use client";

import React, { useState } from "react";
import { Box, Button, CircularProgress } from "@mui/material";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import ShareIcon from "@mui/icons-material/Share";
import { useLinkedIn } from "@/app/context/LinkedInContext";
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
        sx={{
          borderColor: "#0A66C2",
          color: "#0A66C2",
          "&:hover": {
            borderColor: "#004182",
            backgroundColor: "rgba(10, 102, 194, 0.04)",
          },
          ...sx,
        }}
      />
    );
  }

  return (
    <>
      <Button
        onClick={handleShareClick}
        disabled={capturing || connectionLoading}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          bgcolor: "#18181B",
          background: "linear-gradient(80.89deg, #0A66C2 -90.43%, #004182 74.73%)",
          color: "#fff",
          borderRadius: "999px",
          px: 2,
          py: 1,
          fontSize: 14,
          fontWeight: 600,
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          opacity: capturing || connectionLoading ? 0.7 : 1,
          "&:hover": capturing || connectionLoading ? {} : {
            transform: "translateY(-2px)",
            boxShadow: "0 4px 12px rgba(10, 102, 194, 0.3)",
          },
          "&:active": {
            transform: "translateY(0)",
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
      />
    </>
  );
};

export default LinkedInShareButton;
