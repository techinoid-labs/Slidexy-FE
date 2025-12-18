"use client";

import { Box, Typography, Button, Stack } from "@mui/material";
import { useEffect } from "react";
import { useVideoJob } from "@/app/context/ExplainerVideoContext";

export default function VideoResultPage() {
  const { progress, videoUrl } = useVideoJob();

  const handleDownload = async () => {
    if (!videoUrl) return;

    const res = await fetch(videoUrl);
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = videoUrl.split("/").pop() || "generated_video.mp4";
    a.click();

    window.URL.revokeObjectURL(url);
  };

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", py: 6 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Video Generation
      </Typography>

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
  );
}