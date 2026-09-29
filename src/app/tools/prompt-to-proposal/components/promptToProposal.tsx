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
  Paper,
  CircularProgress,
} from "@mui/material";
import GenerationOverlay from "@/app/components/shared/GenerationOverlay";
import { AutoAwesome, Close as CloseIcon } from "@mui/icons-material";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const API_BASE_URL = process.env.NEXT_PUBLIC_Proposal_API_BASE_URL;

const loadingMessages = [
  "Analyzing your prompt and extracting key requirements...",
  "Understanding context and identifying proposal objectives...",
  "Generating comprehensive proposal structure and outline...",
  "Researching relevant information and gathering insights...",
  "Writing executive summary and introduction sections...",
  "Crafting detailed content for methodology and approach...",
  "Developing timeline, deliverables, and project scope...",
  "Creating budget breakdown and resource allocation...",
  "Writing conclusion and call-to-action sections...",
  "Applying professional formatting and styling...",
  "Optimizing document layout and visual hierarchy...",
  "Adding final touches and quality enhancements...",
  "Finalizing your professional proposal document...",
];

export default function PromptToProposal() {
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const router = useRouter();


  const cycleLoadingMessages = () => {
    let index = 0;
    setLoadingMessage(loadingMessages[0]);

    const interval = setInterval(() => {
      index = (index + 1) % loadingMessages.length;
      setLoadingMessage(loadingMessages[index]);
    }, 5000);

    return interval;
  };

  const handleSubmit = async () => {
    if (!description.trim()) {
      setError("Please enter a description for the proposal.");
      return;
    }

    setLoading(true);
    setError("");

    const messageInterval = cycleLoadingMessages();

    try {
      const payload = {
        prompt: description,
      };

      const res = await fetch(`${API_BASE_URL}/generate-proposal`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to generate proposal.");
      }

      // Parse JSON response instead of blob
      const data = await res.json();

      clearInterval(messageInterval);

      // Check if generation was successful
      if (data.success && data.pdfUrl) {
        // Store the necessary data
        sessionStorage.setItem("proposalPrompt", description);
        sessionStorage.setItem("proposalPdfUrl", data.pdfUrl);
        sessionStorage.setItem("proposalId", data.proposalId);
        sessionStorage.setItem("proposalTitle", data.title);
        sessionStorage.setItem("proposalData", JSON.stringify(data.data));
        sessionStorage.setItem("pageMap", JSON.stringify(data.pageMap));

        // Navigate to viewer
        router.push("/tools/prompt-to-proposal/viewer");
      } else {
        throw new Error(data.error || "Failed to generate proposal.");
      }
    } catch (err: any) {
      clearInterval(messageInterval);
      setError(err.message || "Something went wrong.");
      setLoading(false);
    }
  };

  const quickPrompts = [
    "Website redesign for a local bakery",
    "Social media management retainer",
    "Mobile app development proposal",
    "Brand identity package for a startup",
    "IT infrastructure upgrade proposal",
    "Event planning services proposal",
  ];

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        minHeight: "60vh",
        overflow: "hidden",
        background:
          "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(142,45,226,0.1) 0%, transparent 55%)",
      }}
    >
      <Box
        component={motion.div}
        animate={{ y: [0, -24, 0], x: [0, 16, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        sx={{
          position: "absolute",
          top: "-5%",
          left: "-5%",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(142,45,226,0.15) 0%, transparent 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />
      <Box
        component={motion.div}
        animate={{ y: [0, -24, 0], x: [0, 16, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 10, delay: 1, repeat: Infinity, ease: "easeInOut" }}
        sx={{
          position: "absolute",
          bottom: "10%",
          right: "-5%",
          width: 260,
          height: 260,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(74,0,224,0.12) 0%, transparent 70%)",
          filter: "blur(50px)",
          pointerEvents: "none",
        }}
      />

      <Box sx={{ width: "100%", minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", py: { xs: 8, md: 10 }, px: { xs: 2, md: 6 }, position: "relative", zIndex: 1 }}>


        <Box
          sx={{
            width: "100%",
            maxWidth: "926px",
            bgcolor: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(12px)",
            borderRadius: "24px",
            border: "1px solid rgba(142, 45, 226, 0.14)",
            boxShadow: "0 28px 60px -20px rgba(142, 45, 226, 0.28), 0 8px 24px rgba(15, 10, 25, 0.04)",
            p: { xs: 3, md: 4 },
            mb: 4,
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0, left: 0, right: 0,
              height: 4,
              background: "linear-gradient(90deg, #8E2DE2, #C084FC, #4A00E0)",
              backgroundSize: "200% 100%",
              animation: "sx-gradient-shift 4s ease infinite",
            },
          }}
        >
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
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Button
              variant="contained"
              size="large"
              onClick={handleSubmit}
              disabled={loading}
              startIcon={<AutoAwesome />}
              sx={{ minWidth: "130px" }}
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

        {loading && (
          <GenerationOverlay
            open={loading}
            message={loadingMessage || "Generating your proposal"}
          />
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