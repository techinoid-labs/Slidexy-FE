"use client";

import {
  Box,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  IconButton,
  Chip,
  Stack,
  Alert,
  AlertTitle,
} from "@mui/material";
import GenerationOverlay from "@/app/components/shared/GenerationOverlay";
import { AutoAwesome, Close as CloseIcon } from "@mui/icons-material";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useEbook } from "@/app/context/EbookContext";
import AnimatedOrb from "@/app/components/shared/AnimatedOrb";
import { fadeUp, staggerContainer } from "@/lib/motion";

const API_URL = process.env.NEXT_PUBLIC_EBOOK_API_BASE_URL;

const controlSx = {
  height: 44,
  borderRadius: "12px",
  bgcolor: "rgba(248, 246, 255, 1)",
  border: "1px solid rgba(142, 45, 226, 0.1)",
  "& .MuiOutlinedInput-notchedOutline": { border: "none" },
  "& .MuiSelect-select": { py: "10px", fontSize: "0.9rem" },
  transition: "border-color 0.2s ease, box-shadow 0.2s ease",
  "&:hover": { borderColor: "rgba(142, 45, 226, 0.3)" },
  "&.Mui-focused, &:focus-within": {
    borderColor: "#8E2DE2",
    boxShadow: "0 0 0 3px rgba(142, 45, 226, 0.1)",
  },
};

export default function PromptToEbook() {
  const [topic, setTopic] = useState("");
  const [genre, setGenre] = useState("Select Genre");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const { setPdfBlob } = useEbook();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const quickPrompts = [
    "Artificial Intelligence",
    "Healthy Diet",
    "UX UI Guidelines",
    "Design Systems",
    "Cybersecurity",
  ];

  const handleSubmit = async () => {
    if (!topic.trim()) {
      setError("Please enter a topic for the eBook.");
      return;
    }

    setError("");
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

      setCurrentMessage("Writing your eBook...");

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

  const downloadPdf = async (job_id: string) => {
    try {
      const res = await fetch(`${API_URL}/ebook/download/${job_id}`);

      if (!res.ok) {
        throw new Error("Server returned an error.");
      }

      const blob = await res.blob();
      setPdfBlob(blob);
      router.push(`/tools/prompt-to-ebook/viewer?title=${topic}`);
    } catch (err) {
      console.error(err);
      setError("Failed to download eBook.");
    }
  };

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
      <AnimatedOrb size={300} top="-5%" left="-5%" color="rgba(142, 45, 226, 0.15)" blur={60} />
      <AnimatedOrb size={260} bottom="10%" right="-5%" color="rgba(74, 0, 224, 0.12)" blur={50} delay={1} />

      <Box
        component={motion.div}
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          py: { xs: 3, md: 4 },
          px: { xs: 2, md: 6 },
          position: "relative",
          zIndex: 1,
        }}
      >
        <Box
          component={motion.div}
          variants={fadeUp}
          sx={{
            position: "relative",
            width: "100%",
            maxWidth: 920,
            bgcolor: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(12px)",
            borderRadius: "24px",
            border: "1px solid rgba(142, 45, 226, 0.14)",
            boxShadow:
              "0 28px 60px -20px rgba(142, 45, 226, 0.28), 0 8px 24px rgba(15, 10, 25, 0.04)",
            p: { xs: 3, md: 4 },
            mb: 4,
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
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
            placeholder="Enter your eBook topic or a chapter outline…"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: "14px",
                bgcolor: "rgba(248, 246, 255, 0.5)",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(142, 45, 226, 0.12)",
              },
              "& .MuiInputBase-input": {
                fontSize: "1rem",
                lineHeight: 1.65,
              },
            }}
          />

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <FormControl variant="outlined" sx={{ ...controlSx, minWidth: 160 }}>
              <Select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                disabled={loading}
                sx={{ height: 44, color: "#5B5568" }}
              >
                <MenuItem value="Select Genre" hidden>
                  Select Genre
                </MenuItem>
                <MenuItem value="Technology">Technology</MenuItem>
                <MenuItem value="Business">Business</MenuItem>
                <MenuItem value="Education">Education</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="contained"
              size="large"
              disabled={loading}
              onClick={handleSubmit}
              startIcon={<AutoAwesome />}
              sx={{
                minWidth: { xs: "100%", sm: 150 },
                py: 1.35,
                whiteSpace: "nowrap",
              }}
            >
              Generate
            </Button>
          </Box>

          {error && (
            <Alert
              sx={{ mt: 2, borderRadius: "12px" }}
              severity="error"
              action={
                <IconButton size="small" onClick={() => setError("")}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              }
            >
              <AlertTitle>Error</AlertTitle>
              {error}
            </Alert>
          )}
        </Box>

        <GenerationOverlay
          open={loading}
          progress={progress}
          message={currentMessage || "Writing your eBook"}
        />

        <Box component={motion.div} variants={fadeUp} sx={{ textAlign: "center", maxWidth: 800, mt: 1 }}>
          <Typography sx={{ color: "text.secondary", fontSize: "0.9rem", fontWeight: 500, mb: 2 }}>
            Not sure where to start? Try one of these
          </Typography>
          <Stack direction="row" flexWrap="wrap" justifyContent="center" gap={1.5}>
            {quickPrompts.map((text, i) => (
              <Chip
                key={i}
                label={text}
                onClick={() => setTopic(text)}
                sx={{
                  border: "1px solid rgba(142, 45, 226, 0.14)",
                  bgcolor: "rgba(255,255,255,0.8)",
                  color: "#0F0A19",
                  fontWeight: 450,
                  borderRadius: "999px",
                  cursor: "pointer",
                  transition: "transform 0.2s ease, background 0.2s ease, border-color 0.2s ease",
                  "&:hover": {
                    bgcolor: "rgba(242, 240, 255, 1)",
                    borderColor: "rgba(142, 45, 226, 0.35)",
                    transform: "translateY(-2px)",
                  },
                  px: 1,
                }}
              />
            ))}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
