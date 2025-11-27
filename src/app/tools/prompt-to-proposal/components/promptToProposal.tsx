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
import { AutoAwesome, Close as CloseIcon } from "@mui/icons-material";
import { useState } from "react";
import { useRouter } from "next/navigation";

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
      const res = await fetch(`${API_BASE_URL}/generate-proposal`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: description }),
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

        {loading && (
          <Paper elevation={0} sx={{ width: "100%", maxWidth: "926px", p: 4, borderRadius: 2, border: "1px solid #e8e4ff", bgcolor: "white", mb: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
              <CircularProgress size={40} sx={{ color: "#6C2BD9" }} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5, color: "#6C2BD9" }}>
                  {loadingMessage}
                </Typography>
                <Typography variant="body2" sx={{ color: "#6d6d6d" }}>
                  Please be patient AI is crafting your proposal...
                </Typography>
              </Box>
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