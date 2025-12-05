"use client";

import { useState } from "react";
import { useSlides } from "@/app/context/SlidesContext";
import { useLinkedIn } from "@/app/context/LinkedInContext";
import html2canvas from "html2canvas";

/**
 * useLinkedInShare Hook
 * Provides functionality to share current slide to LinkedIn
 * Handles screenshot generation and dialog management
 */
export const useLinkedInShare = () => {
  const { slides, selectedSlideIndex } = useSlides();
  const { shareSlide, isConnected } = useLinkedIn();

  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [lastSlideScreenshot, setLastSlideScreenshot] = useState<string | null>(
    null
  );

  /**
   * Capture current slide as image for preview and sharing
   */
  const captureSlideScreenshot = async (): Promise<string | null> => {
    try {
      // Find the stage element (Konva stage)
      const stageElement = document.querySelector(
        '[role="presentation"]'
      ) as HTMLElement;

      if (!stageElement) {
        console.warn("[LinkedIn Share] Stage element not found");
        return null;
      }

      // Convert to canvas
      const canvas = await html2canvas(stageElement, {
        backgroundColor: "#fff",
        scale: 2,
        allowTaint: true,
        useCORS: true,
      });

      const imageData = canvas.toDataURL("image/png");
      setLastSlideScreenshot(imageData);
      return imageData;
    } catch (error) {
      console.error("[LinkedIn Share] Failed to capture slide:", error);
      return null;
    }
  };

  /**
   * Open share dialog (requires screenshot)
   */
  const handleOpenShareDialog = async () => {
    const screenshot = await captureSlideScreenshot();
    if (screenshot) {
      setShareDialogOpen(true);
    }
  };

  /**
   * Share slide with custom message
   */
  const handleShareSlide = async (message?: string): Promise<boolean> => {
    if (!isConnected) {
      console.warn("[LinkedIn Share] Not connected to LinkedIn");
      return false;
    }

    // Note: The actual sharing would use the presentation ID from query params
    // This is handled by the component that calls this hook
    return true;
  };

  return {
    shareDialogOpen,
    setShareDialogOpen,
    lastSlideScreenshot,
    captureSlideScreenshot,
    handleOpenShareDialog,
    handleShareSlide,
    isConnected,
    currentSlide: slides[selectedSlideIndex] || null,
  };
};

export default useLinkedInShare;
