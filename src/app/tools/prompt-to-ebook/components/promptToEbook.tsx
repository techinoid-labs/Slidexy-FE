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

const API_URL = "https://aaa-saving-indexes-view.trycloudflare.com/api/v1";

export default function PromptToEbook() {
  const [topic, setTopic] = useState("");
  const [genre, setGenre] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState("");
  const [error, setError] = useState("");

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const quickPrompts = [
    "Artificial Intelligence",
    "Healthy Diet",
    "UX UI Guidelines",
    "Design Systems",
    "Cybersecurity",
  ];

  /** ---------------------------
   *  Step 1: Generate eBook
   *  --------------------------*/
  const handleSubmit = async () => {
    if (!topic.trim()) {
      setError("Please enter a topic for the eBook.");
      return;
    }

    setError("");
    setPdfUrl(null);
    setLoading(true);
    setProgress(0);
    setCurrentMessage("Starting eBook generation...");

    try {
      const payload = {
        topic,
        genre,
        num_chapters: 4,
        target_audience: "general",
        author: "Slidexy.ai",
        publisher: "Slidexy.ai",
        length_config: { section_length: "short", chapter_length: "short" },
        enhancements: {
          include_exercises: false,
          include_case_studies: false,
          include_examples: true,
          include_summary: true,
        },
        research_config: {
          enable_research: true,
          max_sources: 5,
          research_depth: "medium",
        },
        image_config: {
          generate_images: true,
          images_per_chapter: 1,
          image_style: "professional",
        },
        cover_config: {
          generate_cover: true,
          cover_style: "professional",
          background_color: "light grey",
        },
        output_format: "pdf",
        output_filename: "ebook",
      };

      const res = await fetch(`${API_URL}/ebook/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!data.job_id) throw new Error("Failed to start job.");

      setJobId(data.job_id);
      setCurrentMessage("AI is generating your eBook...");

      /** ---------------------------
       * Step 2: Poll job status
       * --------------------------*/
      intervalRef.current = setInterval(async () => {
        const jobRes = await fetch(`${API_URL}/jobs/${data.job_id}`);
        const job = await jobRes.json();

        if (job.progress) setProgress(job.progress);
        if (job.message) setCurrentMessage(job.message);

        if (job.status === "completed") {
          clearInterval(intervalRef.current!);
          setLoading(false);
          setProgress(100);
          setCurrentMessage("Your eBook is ready! Preparing preview...");

          await downloadPdf(data.job_id);
        }

        if (job.status === "failed") {
          clearInterval(intervalRef.current!);
          setLoading(false);
          setError(job.error || "eBook generation failed.");
        }
      }, 3000);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  /** ---------------------------
   * Step 3: Download PDF + Preview
   * --------------------------*/
  const downloadPdf = async (job_id: string) => {
    try {
      const res = await fetch(`${API_URL}/ebook/download/${job_id}`);

      if (!res.ok) {
        throw new Error("Server returned an error.");
      }

      // Fetch PDF as binary (Blob)
      const blob = await res.blob();

      // Preview URL for iframe
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);

      setCurrentMessage("eBook Preview Ready Below.");
    } catch (err) {
      console.error(err);
      setError("Failed to download eBook.");
    }
  };

  return (
    <Box sx={{ position: "relative", width: "100%", minHeight: "100vh" }}>
      {/* Background */}
      <Box
        sx={{
          position: "absolute",
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
          style={{ width: "100%", height: "100%", objectFit: "cover", opacity: "0.1" }}
        >
          <source src="/services-background.mp4" type="video/mp4" />
        </video>
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          width: "100%",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          py: 10,
          px: 6,
        }}
      >
        <Typography variant="h2" sx={{ fontWeight: 700, mb: 1, fontSize: "60px" }}>
          Prompt-to-eBook
        </Typography>

        <Typography sx={{ color: "#6d6d6d", maxWidth: 520, mb: 6 }}>
          Generate fully structured eBooks with AI—fast, clean & professional.
        </Typography>

        {/* Input Box */}
        <Box
          sx={{
            width: "100%",
            maxWidth: "926px",
            bgcolor: "rgba(251, 250, 255, 0.5)",
            borderRadius: 1,
            boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
            border: "1px solid rgba(232, 228, 255, 1)",
            p: 4,
            mb: 4,
          }}
        >
          {/* Topic */}
          <TextField
            fullWidth
            multiline
            minRows={4}
            placeholder="Enter eBook topic..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            sx={{
              borderBottom: "1px solid rgba(242, 240, 255, 1)",
              mb: 2,
            }}
          />

          {/* Genre Selector */}
          <FormControl
            fullWidth
            sx={{
              mt: 2,
              background: "#fff",
              borderRadius: 1,
            }}
          >
            <InputLabel>Genre</InputLabel>
            <Select value={genre} label="Genre" onChange={(e) => setGenre(e.target.value)}>
              <MenuItem value="technology">Technology</MenuItem>
              <MenuItem value="business">Business</MenuItem>
              <MenuItem value="education">Education</MenuItem>
            </Select>
          </FormControl>

          {/* Generate Button */}
          <Button
            variant="contained"
            disabled={loading}
            onClick={handleSubmit}
            sx={{
              mt: 3,
              backgroundColor: "#6C2BD9",
              color: "#fff",
              borderRadius: "32px",
              px: 4,
              py: 1.2,
            }}
            startIcon={<AutoAwesome />}
          >
            Generate
          </Button>

          {error && (
            <Alert
              sx={{ mt: 2 }}
              severity="error"
              action={
                <IconButton size="small" onClick={() => setError("")}>
                  <CloseIcon />
                </IconButton>
              }
            >
              <AlertTitle>Error</AlertTitle>
              {error}
            </Alert>
          )}
        </Box>

        {/* Loading Box */}
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
            <Typography variant="h6" color="#8E2DE2">
              {currentMessage}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Progress: {progress}%
            </Typography>
          </Box>
        )}

        {/* PDF Preview + Download */}
        {pdfUrl && !loading && (
          <Box
            sx={{
              mt: 4,
              width: "100%",
              maxWidth: 900,
              bgcolor: "white",
              p: 2,
              borderRadius: 2,
              boxShadow: "0 5px 25px rgba(0,0,0,0.1)",
            }}
          >
            <Typography variant="h5" sx={{ mb: 2 }}>
              📘 eBook Preview
            </Typography>

            <iframe
              src={pdfUrl}
              style={{ width: "100%", height: "600px", border: "1px solid #ddd" }}
            ></iframe>

            <Button
              variant="contained"
              sx={{ mt: 2, borderRadius: "30px" }}
              onClick={() => {
                const a = document.createElement("a");
                a.href = pdfUrl;
                a.download = "ebook.pdf";
                a.click();
              }}
            >
              Download PDF
            </Button>
          </Box>
        )}

        {/* Quick Prompts */}
        <Box sx={{ textAlign: "center", maxWidth: 800, mt: 4 }}>
          <Stack direction="row" flexWrap="wrap" justifyContent="center" gap={2}>
            {quickPrompts.map((text, i) => (
              <Chip
                key={i}
                label={text}
                onClick={() => setTopic(text)}
                sx={{
                  border: "1px solid rgba(246, 246, 246, 1)",
                  bgcolor: "rgba(248, 248, 248, 0.14)",
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