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
  LinearProgress,
} from "@mui/material";
import {
  Add,
  Remove,
  AutoAwesome,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useState, useRef } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSlides } from "@/app/context/SlidesContext";
import { useTemplateSlides } from "@/app/context/TemplateSlidesContext";
import { useUser } from "@/app/context/AuthContext";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const TEXT_ART_STYLES = [
  { value: "Concept Art", label: "Concept Art" },
  { value: "3D Render / CGI", label: "3D Render / CGI" },
  { value: "Watercolor Illustration", label: "Watercolor Illustration" },
  { value: "AI Collage / Mixed Media", label: "AI Collage / Mixed Media" },
  { value: "Digital Painting", label: "Digital Painting" },
  { value: "Fantasy / Sci-Fi Style", label: "Fantasy / Sci-Fi Style" },
  { value: "Minimal Abstract", label: "Minimal Abstract" },
];

// Progress tracker to ensure monotonic progress
class FrontendProgressTracker {
  private currentProgress: number = 0;
  private lastUpdateTime: number = Date.now();

  update(newProgress: number): number {
    this.currentProgress = Math.max(this.currentProgress, newProgress);
    this.lastUpdateTime = Date.now();
    return this.currentProgress;
  }

  get(): number {
    return this.currentProgress;
  }

  reset(): void {
    this.currentProgress = 0;
    this.lastUpdateTime = Date.now();
  }
}

export default function PromptToTemplate() {
  const [count, setCount] = useState(7);
  const [goal, setGoal] = useState("pitch");
  const [tone, setTone] = useState("professional");
  const [visualStyle, setVisualStyle] = useState("Minimal Abstract");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState("");
  const [currentDetail, setCurrentDetail] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();
  const { setSlides } = useSlides();
  const { setSlideTemplates, setPresentationId } = useTemplateSlides();
  const { user } = useUser();

  const abortControllerRef = useRef<AbortController | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const progressTracker = useRef(new FrontendProgressTracker()).current;

  // Helper function to handle streaming response
  const handleStream = async (
    reader: ReadableStreamDefaultReader<Uint8Array>,
    decoder: TextDecoder,
    onEvent: (event: any) => void
  ) => {
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const parts = buffer.split("\n\n");
      buffer = parts.pop() || "";

      for (const part of parts) {
        if (!part.startsWith("data:")) continue;
        const jsonStr = part.replace(/^data:\s*/, "").trim();
        if (!jsonStr || jsonStr === "[DONE]") continue;

        try {
          const event = JSON.parse(jsonStr);
          onEvent(event);
        } catch (err) {
          console.error("Bad JSON chunk:", jsonStr);
        }
      }
    }
  };

  const handleSubmit = async () => {
    if (!description.trim()) {
      setError("Please describe your idea.");
      return;
    }

    setLoading(true);
    setError("");
    setProgress(0);
    setCurrentMessage("");
    setCurrentDetail("");
    setSlides([]);
    progressTracker.reset();

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const meta = { goal, tone, audience: "" };

    const payload = {
      topic: description,
      meta,
      slideCount: count,
      userData: user,
    };

    let frontendProgress = 0;
    let lastBackendProgress = 0;
    let isCompleted = false;

    const startProgressSimulation = () => {
      progressIntervalRef.current = setInterval(() => {
        if (!isCompleted && frontendProgress < 90) {
          const increment = Math.random() * 1.8 + 0.4;
          frontendProgress = Math.min(frontendProgress + increment, 90);
          setProgress(progressTracker.update(Math.round(frontendProgress)));
        }
      }, 700);
    };

    const stopProgressSimulation = () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    };

    try {
      startProgressSimulation();

      const res = await fetch(`${API_BASE_URL}/generate-ppt-template`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/event-stream",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      if (!res.ok) {
        stopProgressSimulation();
        let errMsg = "Failed to generate template";
        try {
          const errJson = await res.json();
          errMsg = errJson.error || errMsg;
        } catch {}
        throw new Error(errMsg);
      }

      if (!res.body) {
        stopProgressSimulation();
        throw new Error("No response body received from server.");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      const onEvent = (event: any) => {
        console.log("SSE Event:", event); // Debug

        if (event.percent !== undefined) {
          lastBackendProgress = event.percent;
          frontendProgress = Math.max(frontendProgress, event.percent);
          setProgress(progressTracker.update(Math.round(frontendProgress)));
        }

        if (event.message) setCurrentMessage(event.message);
        if (event.detail) setCurrentDetail(event.detail);

        if (event.error) {
          stopProgressSimulation();
          setError(event.error);
          setLoading(false);
          return;
        }

        if (event.complete) {
          console.log("Generation COMPLETE!", event);
          isCompleted = true;
          stopProgressSimulation();
          setProgress(100);
          setCurrentMessage(event.message || "Template successfully created!");
          setCurrentDetail("Redirecting to your presentation...");

          // Update context
          if (event.slides) {
            setSlideTemplates(event.slides);
          }

          // OPTION 2: Use template_id (sent by backend) OR fallback to presentation_id
          const pid = event.template_id || event.presentation_id;

          if (pid) {
            setPresentationId(pid);
            setLoading(false);

            setTimeout(() => {
              router.push(`/text-to-template/${pid}`);
            }, 200);
          } else {
            console.error(
              "Missing both template_id and presentation_id!",
              event
            );
            setError(
              "Presentation created but failed to open. Please refresh."
            );
            setLoading(false);
          }
        }
      };

      await handleStream(reader, decoder, onEvent);
    } catch (err: any) {
      stopProgressSimulation();
      if (err.name !== "AbortError") {
        console.error("Template generation error:", err);
        setError(err.message || "Something went wrong. Please try again.");
      }
      setLoading(false);
      progressTracker.reset();
    } finally {
      abortControllerRef.current = null;
    }
  };

  // Cleanup on unmount: abort ongoing request and clear any progress interval
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    };
  }, []);

  const cancelGeneration = () => {
    abortControllerRef.current?.abort();
    setLoading(false);
    setProgress(0);
    setCurrentMessage("");
    setCurrentDetail("");
    progressTracker.reset();
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
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        bgcolor: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        py: { xs: 8, md: 10 },
        px: { xs: 2, md: 6 },
        textAlign: "center",
      }}
    >
      <Typography
        variant="h2"
        sx={{ fontWeight: 700, mb: 1, color: "rgba(26, 26, 26, 1)" }}
      >
        Prompt-to-Template
      </Typography>

      <Typography
        sx={{
          color: "rgba(109, 109, 109, 1)",
          maxWidth: 520,
          mb: 6,
          fontSize: { xs: "1rem", md: "1.1rem" },
        }}
      >
        Elevate your presentations with our AI-powered tool—create polished,
        professional slides in just seconds.
      </Typography>

      <Box
        sx={{
          width: "100%",
          maxWidth: "926px",
          backgroundColor: "rgba(251, 250, 255, 1)",
          borderRadius: 1,
          boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
          border: "1px solid rgba(232, 228, 255, 1)",
          p: { xs: 3, md: 4 },
          mb: 4,
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 1 }}>
          <FormControl
            variant="outlined"
            sx={{
              backgroundColor: "#fff",
              width: "142px",
              height: "44px",
              borderRadius: "10px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
              "& .MuiOutlinedInput-notchedOutline": { border: "none" },
            }}
          >
            <InputLabel sx={{ fontSize: "14px", fontFamily: "Raleway" }}>
              Select Goal
            </InputLabel>
            <Select
              value={goal}
              label="Select Goal"
              onChange={(e) => setGoal(e.target.value)}
              disabled={loading}
            >
              <MenuItem value="pitch">Pitch Deck</MenuItem>
              <MenuItem value="education">Educational Deck</MenuItem>
              <MenuItem value="marketing">Marketing Presentation</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <TextField
          fullWidth
          multiline
          minRows={4}
          placeholder="Describe your idea... e.g., 'Pitch for a new mental health app'"
          variant="outlined"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={loading}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.ctrlKey) {
              e.preventDefault();
              if (description.trim()) handleSubmit();
            }
          }}
          sx={{
            mb: 1.5,
            "& .MuiOutlinedInput-notchedOutline": { border: "none" },
            borderBottom: "1px solid rgba(242, 240, 255, 1)",
            "& .MuiInputBase-input": { fontSize: "15px", lineHeight: 1.6 },
          }}
        />

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: { xs: "center", md: "space-between" },
            alignItems: { xs: "stretch", md: "center" },
            gap: 2,
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems={{ xs: "stretch", sm: "center" }}
            spacing={1.5}
            sx={{ flex: 1 }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                width: "100px",
                height: "44px",
                borderRadius: "4px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.04)",
                backgroundColor: "#fff",
              }}
            >
              <IconButton
                size="small"
                onClick={() => setCount(Math.max(1, count - 1))}
                disabled={loading}
              >
                <Remove />
              </IconButton>
              <Typography sx={{ px: 1, width: 40, textAlign: "center" }}>
                {count}
              </Typography>
              <IconButton
                size="small"
                onClick={() => {
                  if (count > 9) {
                    return;
                  }
                  setCount(count + 1);
                }}
                disabled={loading}
              >
                <Add />
              </IconButton>
            </Box>

            <FormControl
              variant="outlined"
              sx={{
                width: { xs: "100%", sm: "130px" },
                height: "44px",
                borderRadius: "4px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.04)",
                backgroundColor: "#fff",
                "& .MuiOutlinedInput-notchedOutline": { border: "none" },
              }}
            >
              <InputLabel sx={{ fontSize: "14px" }}>Select Tone</InputLabel>
              <Select
                value={tone}
                label="Select Tone"
                onChange={(e) => setTone(e.target.value)}
                disabled={loading}
              >
                <MenuItem value="professional">Professional</MenuItem>
                <MenuItem value="casual">Casual</MenuItem>
                <MenuItem value="inspirational">Inspirational</MenuItem>
              </Select>
            </FormControl>

            <FormControl
              variant="outlined"
              sx={{
                width: { xs: "100%", sm: "231px" },
                height: "44px",
                borderRadius: "4px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.04)",
                backgroundColor: "#fff",
                "& .MuiOutlinedInput-notchedOutline": { border: "none" },
              }}
            >
              <InputLabel sx={{ fontSize: "14px" }}>
                Select Visual Style
              </InputLabel>
              <Select
                value={visualStyle}
                label="Select Visual Style"
                onChange={(e) => setVisualStyle(e.target.value)}
                disabled={loading}
              >
                {TEXT_ART_STYLES.map((style) => (
                  <MenuItem key={style.value} value={style.value}>
                    {style.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>

          <Button
            variant="contained"
            disabled={loading || !description.trim()}
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
              "&:hover": { backgroundColor: "#5B21B6" },
              "&:disabled": { backgroundColor: "#d0d0d0", color: "#888" },
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

      {/* ---------- PROGRESS SECTION (Aligned with PromptToDeck) ---------- */}
      {loading && (
        <Box
          sx={{
            mb: { xs: 2, md: 4 },
            p: { xs: 2, sm: 3, md: 5 },
            height: { xs: "auto", sm: 250, md: 270 },
            width: { xs: "95%", md: 800 },
            maxWidth: 926,
            mx: "auto",
            borderRadius: 3,
            bgcolor: "white",
            boxShadow: "0 4px 20px rgba(142, 45, 226, 0.1)",
            border: "1px solid #f0f0f0",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "flex-start", sm: "center" },
              gap: { xs: 1, sm: 2 },
              mb: 2,
            }}
          >
            <Box
              sx={{
                width: 15,
                height: 15,
                borderRadius: "50%",
                bgcolor: "#8E2DE2",
                animation: "pulse 1.5s ease-in-out infinite",
                alignSelf: { xs: "flex-start", sm: "center" },
                mt: { xs: 0.5, sm: 0 },
                "@keyframes pulse": {
                  "0%, 100%": { opacity: 0.7 },
                  "50%": { opacity: 1 },
                },
              }}
            />

            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: "#8E2DE2",
                flexGrow: 1,
                fontSize: { xs: "1.25rem", md: "1.5rem" },
                textAlign: { xs: "left", sm: "left" },
              }}
            >
              {currentMessage || "Generating your template..."}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                color: "#8E2DE2",
                minWidth: { sm: "60px" },
                textAlign: "right",
                fontSize: "1rem",
              }}
            >
              {Math.round(progress)}%
            </Typography>
          </Box>

          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              mb: 2,
              height: 8,
              borderRadius: 4,
              bgcolor: "#e0e0e0",
              "& .MuiLinearProgress-bar": {
                bgcolor: "#8E2DE2",
                borderRadius: 4,
              },
            }}
          />

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              lineHeight: 1.7,
              color: "#666",
              mb: 2,
            }}
          >
            {currentDetail ||
              "Please wait while we craft your professional presentation..."}
          </Typography>

          <Button
            onClick={cancelGeneration}
            color="error"
            variant="outlined"
            sx={{
              alignSelf: "center",
              mt: 1,
              borderColor: "#ff4444",
              color: "#ff4444",
              "&:hover": {
                borderColor: "#cc0000",
                bgcolor: "rgba(255, 68, 68, 0.04)",
              },
            }}
          >
            Cancel Generation
          </Button>
        </Box>
      )}
      {/* Quick Prompts */}
      <Box sx={{ textAlign: "center", maxWidth: 800 }}>
        <Typography sx={{ fontWeight: 500, mb: 2, color: "#6D6D6D" }}>
          Quick Prompt Generator:
        </Typography>
        <Stack
          direction={{ xs: "column", md: "row" }}
          flexWrap="wrap"
          justifyContent="center"
          gap={2.2}
        >
          {quickPrompts.map((prompt, index) => (
            <Chip
              key={index}
              label={prompt}
              onClick={() => !loading && setDescription(prompt)}
              disabled={loading}
              sx={{
                bgcolor: "rgba(242, 240, 255, 1)",
                color: "#1A1A1A",
                fontWeight: 400,
                borderRadius: "20px",
                "&:hover": { bgcolor: "rgba(230, 226, 255, 1)" },
                px: 1.5,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            />
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
