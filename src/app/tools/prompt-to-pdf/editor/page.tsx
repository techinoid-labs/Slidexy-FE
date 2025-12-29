"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/app/components/headers-navbar/Header";
import Editor from "./components/editor";
import { Box, Typography, CircularProgress, Alert } from "@mui/material";

function EditorContent() {
  const searchParams = useSearchParams();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = searchParams.get("session");
    if (session) {
      setSessionId(session);
    }
    setLoading(false);
  }, [searchParams]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!sessionId) {
    return (
      <Box sx={{ p: 4 }}>
        <Header />
        <Box sx={{ maxWidth: 800, mx: "auto", mt: 8 }}>
          <Alert severity="error">
            No session ID found. Please generate a document first.
          </Alert>
        </Box>
      </Box>
    );
  }

  return (
    <div className="bg-white">
      <Header />
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          py: { xs: 5, md: 5 },
          px: { xs: 2, md: 6 },
          bgcolor: "rgba(254, 254, 255, 1)",
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontWeight: 700,
            mb: 1,
            color: "rgba(26, 26, 26, 1)",
            fontSize: "60px",
          }}
        >
          Prompt-to-PDF Editor
        </Typography>
        <Typography
          sx={{
            color: "rgba(109, 109, 109, 1)",
            maxWidth: 580,
            fontSize: { xs: "16px", md: "18px" },
            textAlign: "center",
          }}
        >
          Edit your prompt, view LaTeX code, and preview your PDF document.
        </Typography>
      </Box>
      <Editor sessionId={sessionId} />
    </div>
  );
}

export default function EditorPage() {
  return (
    <Suspense fallback={<CircularProgress />}>
      <EditorContent />
    </Suspense>
  );
}