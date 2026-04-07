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
  Backdrop,
} from "@mui/material";
import { AutoAwesome, Close as CloseIcon } from "@mui/icons-material";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useEbook } from "@/app/context/EbookContext";

const loadingMessages = [
  "Analyzing your prompt",
  "Generating outlines",
  "Designing visual layout",
  "Enhancing Design",
  "Finalizing your Book",
];

const API_URL = process.env.NEXT_PUBLIC_EBOOK_API_BASE_URL;

export default function PromptToEbook() {
  const [topic, setTopic] = useState("");
  const [genre, setGenre] = useState("Select Genre");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState("");
  const [error, setError] = useState("");
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const router = useRouter();

  const { setPdfBlob } = useEbook();
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
    // setPdfUrl(null);
    setLoading(true);
    setProgress(0);
    setCurrentMessage("Starting eBook generation...");

    try {
      const payload = {
        topic,
        genre,
        num_chapters: "4",
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
        headers: {
          "Content-Type": "application/json",
        },
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
      setPdfBlob(blob);
      router.push(`/tools/prompt-to-ebook/viewer?title=${topic}`);
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
              mt: -3,
              mb: 1.5,
              "& .MuiOutlinedInput-notchedOutline": { border: "none" },
              borderBottom: "1px solid #f2f0ff",
              "& .MuiInputBase-input": { fontSize: "15px", lineHeight: 1.6 },
              minHeight: 224,
            }}
          />

          {/* Genre + Generate Row */}
          <Box
            sx={{
              mt: 2,
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
            }}
          >

            {/* Genre Selector */}
            <FormControl
              sx={{
                display: "flex",
                width: { xs: "100%", sm: "130px", md: "160px" },
                height: "44px",
                borderRadius: "4px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.04)",
                backgroundColor: " rgba(255, 255, 255, 1)",
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
                "& .MuiSelect-select": {
                  py: "8px",
                },
              }}
            >
              {/* <InputLabel>Genre</InputLabel> */}
              <Select
                value={genre}
                label="Genre"
                onChange={(e) => setGenre(e.target.value)}
                disabled={loading}

                sx={{ fontSize: "16px", backgroundColor: "#fff", height: "44px", color: "rgba(109, 109, 109, 1)", }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      mt: 1.8,
                      borderRadius: "10px",
                    },
                  },
                }}
              >
                <MenuItem sx={{ fontSize: "12px", color: "rgba(61, 61, 61, 1)", width: "147px" }} value="Select Genre" hidden>
                  Select Genre
                </MenuItem>
                <MenuItem sx={{ fontSize: "16px", color: "rgba(61, 61, 61, 1)", width: "147px" }} value="Technology">Technology</MenuItem>
                <MenuItem sx={{ fontSize: "16px", color: "rgba(61, 61, 61, 1)", width: "147px" }} value="Business">Business</MenuItem>
                <MenuItem sx={{ fontSize: "16px", color: "rgba(61, 61, 61 , 1)", width: "147px" }} value="Education">Education</MenuItem>
              </Select>
            </FormControl>

            {/* Generate Button */}
            <Button
              variant="contained"
              disabled={loading}
              onClick={handleSubmit}
              sx={{
                backgroundColor: "#6C2BD9",
                color: "#fff",
                borderRadius: "32px",
                px: 4,
                py: 1.2,
                whiteSpace: "nowrap",
                height: "44px",
              }}
              startIcon={<AutoAwesome />}
            >
              Generate
            </Button>
          </Box>

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
        {/* {loading && (
          <Box
            sx={{
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
        )} */}
        {loading && (
          <Backdrop
            open={loading}
            sx={{
              zIndex: (theme) => theme.zIndex.drawer + 1,
              backgroundColor: "rgba(0, 0, 0, 0.5)", // dim screen
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <img
                src="/Loader.gif"
                alt="Generating..."
                style={{ width: 470, height: 160 }}
              />

              <Typography
                sx={{
                  fontFamily: "Raleway",
                  fontSize: "24px",
                  fontWeight: 700,
                  color: "#fff",
                  mt: 1,
                }}
              >
                {currentMessage || 'Thinking'}.....
              </Typography>
            </Box>
          </Backdrop>
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