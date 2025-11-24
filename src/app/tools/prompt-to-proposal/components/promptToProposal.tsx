"use client";

import {
  Box,
  Typography,
  Button,
  TextField,
  IconButton,
  Chip,
  Stack,
  Alert,
  LinearProgress,
  Paper,
} from "@mui/material";
import { AutoAwesome, Close as CloseIcon } from "@mui/icons-material";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

const API_BASE_URL = process.env.NEXT_PUBLIC_Proposal_API_BASE_URL;

interface GenerationStage {
  message: string;
  detail: string;
  progress: number;
}

const generationStages: GenerationStage[] = [
  { message: "Initializing AI Engine", detail: "Setting up the proposal generation pipeline...", progress: 5 },
  { message: "Analyzing Your Prompt", detail: "Understanding requirements and context...", progress: 15 },
  { message: "Generating Content Structure", detail: "Creating proposal outline and sections...", progress: 30 },
  { message: "Writing Proposal Content", detail: "Generating detailed content for each section...", progress: 50 },
  { message: "Formatting Document", detail: "Applying professional styling and layout...", progress: 70 },
  { message: "Optimizing PDF", detail: "Finalizing document structure...", progress: 85 },
  { message: "Completing Generation", detail: "Preparing your proposal for download...", progress: 95 },
];

export default function PromptToProposal() {
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);

  const router = useRouter();
  const animationRef = useRef<number | null>(null);

  const startFakeProgress = (onComplete: () => void) => {
    const DURATION = 18000; // 18s max — feels fast & premium
    const START = Date.now();

    const tick = () => {
      const elapsed = Date.now() - START;
      const ratio = Math.min(elapsed / DURATION, 1);
      const easeOutQuint = (t: number) => 1 - Math.pow(1 - t, 5);
      const eased = easeOutQuint(ratio);
      const fake = Math.min(eased * 98, 98); // Cap at 98%

      // Map to stages
      const thresholds = [5, 15, 30, 50, 70, 85, 95];
      let stage = 0;
      for (let i = 0; i < thresholds.length; i++) {
        if (fake >= thresholds[i]) stage = i;
      }

      setProgress(fake);
      setCurrentStage(stage);

      if (ratio < 1) {
        animationRef.current = requestAnimationFrame(tick);
      }
    };

    tick();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      setProgress(100);
      setCurrentStage(generationStages.length - 1);
      onComplete();
    };
  };

  const handleSubmit = async () => {
    if (!description.trim()) {
      setError("Please enter a description for the proposal.");
      return;
    }

    setLoading(true);
    setError("");
    setProgress(0);
    setCurrentStage(0);

    const completeProgress = startFakeProgress(() => {});

    try {
      const res = await fetch(`${API_BASE_URL}/generate-proposal`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: description }),
      });

      if (!res.ok) throw new Error("Failed to generate proposal.");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      completeProgress();

      setTimeout(() => {
        sessionStorage.setItem("proposalPrompt", description);
        sessionStorage.setItem("proposalPdfUrl", url);
        router.push("/tools/prompt-to-proposal/viewer");
      }, 600);
    } catch (err: any) {
      completeProgress();
      setError(err.message || "Something went wrong.");
      setLoading(false);
    }
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
      <Box sx={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", overflow: "hidden", zIndex: -1 }}>
        <video autoPlay muted loop playsInline style={{ width: "100%", height: "100%", objectFit: "cover", opacity: "0.1" }}>
          <source src="/services-background.mp4" type="video/mp4" />
        </video>
      </Box>

      <Box sx={{ width: "100%", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", py: { xs: 8, md: 10 }, px: { xs: 2, md: 6 } }}>
        <Typography variant="h2" sx={{ fontWeight: 700, mb: 1, color: "#1a1a1a", fontSize: { xs: "40px", md: "60px" }, textAlign: "center" }}>
          Prompt-to-Proposal
        </Typography>

        <Typography sx={{ color: "#6d6d6d", textAlign: "center", maxWidth: 520, mb: 6, fontSize: { xs: "16px", md: "18px" } }}>
          Elevate your presentations with our AI-powered tool—create polished, professional proposals in seconds.
        </Typography>

        <Box sx={{ width: "100%", maxWidth: "926px", bgcolor: "rgba(251, 250, 255, 0.5)", borderRadius: 1, boxShadow: "0 4px 14px rgba(0,0,0,0.05)", border: "1px solid #e8e4ff", p: { xs: 3, md: 4 }, mb: 4 }}>
          <TextField
            fullWidth
            multiline
            minRows={4}
            placeholder="e.g. Draft a proposal for the development of a mobile application that helps users track their fitness goals..."
            variant="outlined"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
            sx={{
              mt: -3,
              mb: 1.5,
              "& .MuiOutlinedInput-notchedOutline": { border: "none" },
              borderBottom: "1px solid #f2f0ff",
              "& .MuiInputBase-input": { fontSize: "15px", lineHeight: 1.6 },
              minHeight: 224,
            }}
          />

          <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading || !description.trim()}
              startIcon={<AutoAwesome />}
              sx={{
                bgcolor: "#6C2BD9",
                borderRadius: "32px",
                minWidth: "130px",
                height: "44px",
                px: 4,
                py: 1.2,
                fontWeight: 600,
                boxShadow: "0 3px 10px rgba(108,43,217,0.3)",
                "&:hover": { bgcolor: "#5B21B6" },
                "&:disabled": { bgcolor: "rgba(108,43,217,0.5)" },
              }}
            >
              {loading ? "Generating..." : "Generate"}
            </Button>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }} action={<IconButton size="small" onClick={() => setError("")}><CloseIcon fontSize="small" /></IconButton>}>
              <strong>Error:</strong> {error}
            </Alert>
          )}
        </Box>

        {/* Beautiful Loading State */}
        {loading && (
          <Paper elevation={0} sx={{ width: "100%", maxWidth: "926px", p: 4, borderRadius: 2, border: "1px solid #e8e4ff", bgcolor: "white", mb: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: "#6C2BD9" }}>
              {generationStages[currentStage]?.message || "Finalizing..."}
            </Typography>
            <Typography variant="body2" sx={{ color: "#6d6d6d", mb: 3 }}>
              {generationStages[currentStage]?.detail || "Almost done!"}
            </Typography>

            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 10,
                borderRadius: 5,
                mb: 2,
                bgcolor: "#e8e4ff",
                "& .MuiLinearProgress-bar": { bgcolor: "#6C2BD9", borderRadius: 5 },
              }}
            />

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="body2" sx={{ color: "#6C2BD9", fontWeight: 600 }}>
                {Math.round(progress)}% Complete
              </Typography>
              <Typography variant="body2" sx={{ color: "#8b6fbf", fontWeight: 500 }}>
                Polishing your proposal...
              </Typography>
            </Box>
          </Paper>
        )}

        {!loading && (
          <Box sx={{ textAlign: "center", maxWidth: 800, mt: 2 }}>
            <Typography variant="body2" sx={{ mb: 2, color: "#6d6d6d" }}>
              Quick prompts to get started:
            </Typography>
            <Stack direction="row" flexWrap="wrap" justifyContent="center" gap={2}>
              {quickPrompts.map((prompt, i) => (
                <Chip
                  key={i}
                  label={prompt}
                  onClick={() => setDescription(prompt)}
                  sx={{
                    border: "1px solid #e8e4ff",
                    bgcolor: "rgba(251, 250, 255, 0.8)",
                    cursor: "pointer",
                    "&:hover": { bgcolor: "#e6e2ff", transform: "translateY(-2px)", boxShadow: "0 2px 8px rgba(108,43,217,0.2)" },
                  }}
                />
              ))}
            </Stack>
          </Box>
        )}
      </Box>
    </Box>
  );
}