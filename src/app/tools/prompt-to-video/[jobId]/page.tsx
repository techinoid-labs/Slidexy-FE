"use client";

import { Box, Typography, Button, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { useVideoJob } from "@/app/context/ExplainerVideoContext";
import Header from "@/app/components/headers-navbar/Header";

export default function VideoResultPage() {
  const { progress, videoUrl: contextVideoUrl } = useVideoJob();
  const [videoUrl, setVideoUrl] = useState<string | null>(contextVideoUrl);

  // Rehydrate from localStorage if context is empty (on reload)
  useEffect(() => {
    if (!contextVideoUrl) {
      const savedUrl = localStorage.getItem("savedVideoUrl");
      if (savedUrl) setVideoUrl(savedUrl);
    }
  }, [contextVideoUrl]);

  const handleDownload = async () => {
    if (!videoUrl) return;
    try {
      const res = await fetch(videoUrl);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = videoUrl.split("/").pop() || "generated_video.mp4";
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed", err);
    }
  };

  return (
    <>
      <Header />
      <Box sx={{ maxWidth: 900, mx: "auto", py: 6 }}>
        {!videoUrl && (
          <Typography>
            Generating video... Progress: {progress}%
          </Typography>
        )}

        {videoUrl && (
          <>
            <video
              src={videoUrl}
              controls
              style={{ width: "100%", borderRadius: 12 }}
            />

            <Stack direction="row" justifyContent="flex-end" mt={2}>
              <Button variant="contained" onClick={handleDownload}>
                Download
              </Button>
            </Stack>
          </>
        )}
      </Box>
    </>
  );
}
