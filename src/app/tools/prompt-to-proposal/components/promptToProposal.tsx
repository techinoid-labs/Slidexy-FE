"use client";

import {
  Box,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Chip,
  Stack,
  Alert,
  AlertTitle,
} from "@mui/material";
import { AutoAwesome, Close as CloseIcon } from "@mui/icons-material";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTemplateSlides } from "@/app/context/TemplateSlidesContext";

const API_BASE_URL = process.env.NEXT_PUBLIC_Proposal_API_BASE_URL;


export default function PromptToProposal() {
  const [generatedPdfUrl, setGeneratedPdfUrl] = useState<string | null>(null);
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState("");
  const [currentDetail, setCurrentDetail] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleSubmit = async () => {
    if (!description.trim()) {
      setError("Please enter a description for the proposal.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE_URL}/generate-proposal`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: description }),
      });

      if (!res.ok) throw new Error("Failed to generate proposal.");

      const pdfBlob = await res.blob(); // ← PDF binary
      const pdfURL = URL.createObjectURL(pdfBlob);

      // Save link to state so UI can display it
      setGeneratedPdfUrl(pdfURL);

    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };


  const cancelGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setLoading(false);
    setProgress(0);
    setCurrentMessage("");
    setCurrentDetail("");
  };

  const quickPrompts = [
    "Creativity at Work",
    "Responsive design principles",
    "Healthy diet",
    "UX UI guidelines",
    "Accessibility best practices",
    "Design system components",
  ];

  return (
    <Box sx={{ position: "relative", width: "100%", minHeight: "100vh" }}>
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          overflow: "hidden",
          zIndex: -1,
        }}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: "0.1"
          }}
        >
          <source src="/services-background.mp4" type="video/mp4" />
        </video>
      </Box>
      <Box
        sx={{
          width: "100%",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          py: { xs: 8, md: 10 },
          px: { xs: 2, md: 6 },
        }}
      >
        <Typography variant="h2" sx={{ fontWeight: 700, mb: 1, color: "rgba(26, 26, 26, 1)", fontSize: "60px" }}>
          Prompt-to-Proposal
        </Typography>

        <Typography sx={{
          color: "rgba(109, 109, 109, 1)", alignSelf: 'center', maxWidth: 520, mb: 6, fontSize: { xs: "16px", md: "18px" },


        }}>
          Elevate your presentations with our AI-powered tool—create polished, professional slides in just seconds.
        </Typography>

        <Box
          sx={{
            width: "100%",
            maxWidth: "926px",
            maxHeight: { xs: "50%", md: "340px" },
            bgcolor: "rgba(251, 250, 255, 0.5)",
            borderRadius: 1,
            boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
            border: "1px solid rgba(232, 228, 255, 1)",
            p: { xs: 3, md: 4 },
            mb: 4,
          }}
        >
          {/* Description Field */}
          <TextField
            fullWidth
            multiline
            minRows={4}
            placeholder="e.g. Draft a proposal for the development of ... "
            variant="outlined"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{
              mt: -3,
              mb: 1.5,
              "& .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
              borderBottom: "1px solid rgba(242, 240, 255, 1)",
              "& .MuiInputBase-input": {
                fontSize: "15px",
                lineHeight: 1.6,
              },
              height: 224,
            }}
          />

          {/* Control Row */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: { xs: "center", md: "space-between" },
              alignItems: { xs: "stretch", md: "center" },
              gap: 2,
              width: "100%",
            }}
          >

            {/* Generate Button */}
            <Button
              variant="contained"
              disabled={loading}
              onClick={handleSubmit}
              sx={{
                backgroundColor: "#6C2BD9",
                color: "#fff",
                borderRadius: "32px",
                width: { xs: "100%", sm: "130px" },
                height: "44px",
                px: 4,
                py: 1.2,
                fontWeight: 600,
                boxShadow: "0 3px 10px rgba(108,43,217,0.3)",
                alignSelf: { xs: "stretch", md: "center" },
                "&:hover": { backgroundColor: "#5B21B6" },
              }}
              startIcon={<AutoAwesome />}
            >
              Generate
            </Button>
          </Box>

          {error && (
            <Alert
              severity="error"
              sx={{ mt: 2 }}
              action={
                <IconButton
                  size="small"
                  onClick={() => setError("")}
                  color="inherit"
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              }
            >
              <AlertTitle>Error</AlertTitle>
              {error}
            </Alert>
          )}
        </Box>

        {loading && (
          <Box
            sx={{
              p: 3,
              borderRadius: 2,
              bgcolor: "white",
              boxShadow: "0 4px 20px rgba(142, 45, 226, 0.1)",
              border: "1px solid #f0f0f0",
              width: "100%",
              maxWidth: 800,
            }}
          >
            <Typography variant="h6" color="#8E2DE2" sx={{ mb: 1 }}>
              {currentMessage}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {currentDetail}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Progress: {Math.round(progress)}%
            </Typography>
          </Box>
        )}

        {generatedPdfUrl && (
          <Box
            sx={{
              mt: 4,
              width: "100%",
              maxWidth: 900,
              textAlign: "center",
              p: 2,
              borderRadius: 2,
              bgcolor: "white",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              Proposal Generated Successfully
            </Typography>

            {/* View in browser */}
            <iframe
              src={generatedPdfUrl}
              style={{ width: "100%", height: "600px", border: "none" }}
            />

            {/* Download button */}
            <Button
              variant="contained"
              sx={{ mt: 2 }}
              href={generatedPdfUrl}
              download="proposal.pdf"
            >
              Download PDF
            </Button>
          </Box>
        )}


        <Box sx={{ textAlign: "center", maxWidth: 800, mt: 4 }}>
          <Stack direction="row" flexWrap="wrap" justifyContent="center" gap={2}>
            {quickPrompts.map((prompt, i) => (
              <Chip
                key={i}
                label={prompt}
                onClick={() => setDescription(prompt)}
                sx={{
                  border: "1px solid rgba(246, 246, 246, 1)",
                  bgcolor: "rgba(248, 248, 248, 0.14);",
                  "&:hover": { bgcolor: "rgba(230, 226, 255, 1)" },
                }}
              />
            ))}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}