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
  LinearProgress,
  Alert,
  AlertTitle,
} from "@mui/material";
import {
  Add,
  Remove,
  AutoAwesome,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useState, useEffect, useRef } from "react";
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

// const getProgressMessage = (progress: number) => {
//   if (progress < 8) return "Initializing…";
//   if (progress < 17) return "Analyzing your idea…";
//   if (progress < 24) return "Thinking deeply…";
//   if (progress < 43) return "Building content…";
//   if (progress < 76) return "Generating visuals…";
//   return "Finalizing your deck…";
// };

export default function PromptToDeck() {
  const [count, setCount] = useState(7);
  const [goal, setGoal] = useState("Select Goal");
  const [tone, setTone] = useState("Select Tone");
  const [visualStyle, setVisualStyle] = useState("Choose Visual Art Style");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState("");
  const [currentDetail, setCurrentDetail] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();
  const { setSlides } = useSlides();
  const { setPresentationId } = useTemplateSlides();
  const { user } = useUser();

  const abortControllerRef = useRef<AbortController | null>(null);

  const handleSubmit = async () => {
    // ---- validation -------------------------------------------------
    if (!description.trim()) {
      setError("Please describe your idea.");
      return;
    }

    // ---- reset UI ---------------------------------------------------
    setLoading(true);
    setError("");
    setProgress(0);
    setCurrentMessage("");
    setCurrentDetail("");
    setSlides([]);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const payload = {
      source: "text",
      textContent: description,
      meta: { goal, tone, audience: "" }, // audience not used here
      artStyle: visualStyle,
      slideCount: count,
      userData: user,
    };

    try {
      const res = await fetch(`${API_BASE_URL}/generate-slides`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/event-stream",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Something went wrong");
      }

      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      // ---- stream parser (identical to PresentationMaker) ----------
      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n\n");
        buffer = parts.pop() ?? "";

        for (const part of parts) {
          if (!part.startsWith("data:")) continue;
          const jsonStr = part.replace(/^data:\s*/, "").trim();
          if (!jsonStr || jsonStr === "[DONE]") continue;

          try {
            const event = JSON.parse(jsonStr);
            // progress
            if (event.percent !== undefined) setProgress(event.percent);
            // messages
            if (event.message !== undefined) setCurrentMessage(event.message);
            if (event.detail !== undefined) setCurrentDetail(event.detail);
            // error
            if (event.error) {
              setError(event.error);
              setLoading(false);
              return;
            }
            // completion
            if (event.complete) {
              setProgress(100);
              setCurrentMessage(event.message || "Presentation ready!");
              setCurrentDetail(event.detail || "");

              if (event.slides) setSlides(event.slides);
              if (event.presentation_id) {
                setPresentationId(event.presentation_id);
                router.push(
                  `/presentation/outline?pid=${event.presentation_id}`
                );
              }
              setLoading(false);
            }
          } catch (e) {
            console.error("Bad SSE chunk:", jsonStr);
          }
        }
      }
    } catch (err: any) {
      if (err.name !== "AbortError") {
        setError(err.message || "Network error");
      }
      setLoading(false);
    } finally {
      abortControllerRef.current = null;
    }
  };

  /* ---------- Cancel generation ---------- */
  const cancelGeneration = () => {
    abortControllerRef.current?.abort();
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
    "Responsive design principles",
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
          justifyContent: "flex-start",
          py: { xs: 8, md: 10 },
          px: { xs: 2, md: 6 },
          textAlign: "center",
        }}
      >
        {/* Title */}
        <Typography
          variant="h2"
          sx={{
            fontWeight: 700,
            mb: 1,
            color: "rgba(26, 26, 26, 1)",
            fontSize: { xs: "16px", md: "60px" },
          }}
        >
          Prompt-to-Deck
        </Typography>

        {/* Subtitle */}
        <Typography
          sx={{
            color: "rgba(109, 109, 109, 1)",
            maxWidth: 520,
            mb: 6,
            fontSize: { xs: "1rem", md: "18px" },
          }}
        >
          Elevate your presentations with our AI-powered tool—create polished,
          professional slides in just seconds.
        </Typography>

        {/* Input Section */}
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
          {/* Goal Selector */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              mb: 1,
            }}
          >
            <FormControl
              variant="outlined"
              sx={{
                backgroundColor: " rgba(255, 255, 255, 1)",
                width: "142px",
                height: "44px",
                borderRadius: "10px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
                "& .MuiSelect-select": {
                  py: "6px",
                },
                gap: 4,
              }}
            >
              {/* <InputLabel
                sx={{
                  fontSize: "16px",
                  fontFamily: "Raleway",
                  top: "-10px",
                }}
              >
                Select Goal
              </InputLabel> */}
              <Select
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                disabled={loading}
                sx={{ fontSize: "16px", backgroundColor: "#fff", height: "44px", color: "rgba(109, 109, 109, 1)", }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      mt: 0.5,
                      borderRadius: "10px",
                    },
                  },
                }}
              >
                <MenuItem sx={{ fontSize: "12px", color: "rgba(109, 109, 109, 1)" }} value="Select Goal" hidden>
                  Select Goal
                </MenuItem>

                <MenuItem sx={{ fontSize: "16px", color: "rgba(109, 109, 109, 1)", }} value="pitch">Pitch Deck</MenuItem>
                <MenuItem sx={{ fontSize: "16px", color: "rgba(109, 109, 109, 1)" }} value="education">Educational</MenuItem>
                <MenuItem sx={{ fontSize: "16px", color: "rgba(109, 109, 109, 1)" }} value="marketing">Marketing</MenuItem>
              </Select>

            </FormControl>
          </Box>

          {/* Description Field */}
          <TextField
            fullWidth
            multiline
            minRows={4}
            placeholder="Describe your idea... e.g., 'Pitch for a new mental health app'"
            variant="outlined"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{
              mb: 1.5,
              "& .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
              borderBottom: "1px solid rgba(242, 240, 255, 0.5)",
              "& .MuiInputBase-input": {
                fontSize: "15px",
                lineHeight: 1.6,
              },
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
            <Stack
              direction={{ xs: "column", sm: "row" }}
              alignItems={{ xs: "stretch", sm: "center" }}
              sx={{
                flex: 1,
              }}
              spacing={1.5}
            >
              {/* <IconButton>
                            <img
                                src="/images/voice-icon-input.svg"
                                alt="Custom icon"
                                style={{ width: 20, height: 20 }}
                            />
                        </IconButton>
                        <IconButton>
                            <img
                                src="/images/file-icon.svg"
                                alt="Custom icon"
                                style={{ width: 18, height: 18 }}
                            />
                        </IconButton> */}

              {/* Counter */}
              <Box
                sx={{
                  display: "flex",
                  width: "124px",
                  height: "44px",
                  borderRadius: "8px",
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
                <IconButton
                  size="small"
                  onClick={() => setCount(Math.max(1, count - 1))}
                  disabled={loading}
                  disableRipple
                  sx={{ color: "rgba(52, 51, 48, 1)", paddingLeft: "14px", paddingRight: "8px", paddingTop: "8px", paddingBottom: "8px", }}

                >
                  <Remove sx={{ width: "20px", height: "20px", fontWeight: "normal" }} />
                </IconButton>
                <Typography sx={{ px: 1, marginLeft: "8px", marginRight: "8px", paddingTop: "8px", paddingBottom: "8px" }}>{count}</Typography>
                <IconButton
                  //size= "small"

                  sx={{ color: "rgba(52, 51, 48, 1)", padding: "8px" }}
                  onClick={() => {
                    if (count > 9) {
                      return;
                    }
                    setCount(count + 1);
                  }}
                  disabled={loading}
                  disableRipple
                >
                  <Add sx={{ width: "20px", height: "20px", fontWeight: "normal" }} />
                </IconButton>
              </Box>

              {/* Tone Selector */}
              <FormControl
                variant="outlined"
                sx={{
                  display: "flex",
                  width: "149px",
                  height: "44px",
                  borderRadius: "8px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.04)",
                  backgroundColor: " rgba(255, 255, 255, 1)",
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                  "& .MuiSelect-select": {
                    py: "8px",
                  },
                  mb: 4,
                }}
              >
                {/* <InputLabel
                  sx={{
                    fontSize: "14px",
                    fontFamily: "Raleway",
                  }}
                >
                  Select Tone
                </InputLabel> */}
                <Select
                  value={tone}
                  label="Select Tone"
                  onChange={(e) => setTone(e.target.value)}
                  disabled={loading}

                  sx={{ fontSize: "16px", backgroundColor: "#fff", height: "44px", color: "rgba(109, 109, 109, 1)", }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        mt: 1.5,
                        borderRadius: "10px",
                      },
                    },
                  }}
                >
                  <MenuItem sx={{ fontSize: "12px", color: "rgba(61, 61, 61, 1)", width: "147px" }} value="Select Tone" hidden>
                    Select Tone
                  </MenuItem>
                  <MenuItem sx={{ fontSize: "16px", color: "rgba(61, 61, 61, 1)", width: "147px" }} value="Professional">Professional</MenuItem>
                  <MenuItem sx={{ fontSize: "16px", color: "rgba(61, 61, 61, 1)", width: "147px" }} value="Casual">Casual</MenuItem>
                  <MenuItem sx={{ fontSize: "16px", color: "rgba(61, 61, 61 , 1)", width: "147px" }} value="Inspirational">Inspirational</MenuItem>
                </Select>
              </FormControl>
              {/* Visual Style Selector */}
              {/* Visual Style Selector */}
              <FormControl
                variant="outlined"
                sx={{
                  display: "flex",
                  width: { xs: "100%", sm: "231px" },
                  height: "44px",
                  borderRadius: "8px",
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
                <Select
                  value={visualStyle}
                  onChange={(e) => setVisualStyle(e.target.value)}
                  displayEmpty
                  sx={{
                    fontSize: "16px",
                    backgroundColor: "#fff",
                    height: "44px",
                    color: "rgba(109, 109, 109, 1)",
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        mt: 0.5,
                        borderRadius: "10px",
                        maxHeight: 300,
                      },
                    },
                  }}
                >
                  <MenuItem value="Choose Visual Art Style" hidden>
                    Choose Visual Art Style
                  </MenuItem>

                  {TEXT_ART_STYLES.map((style) => (
                    <MenuItem
                      key={style.value}
                      value={style.value}
                      sx={{ fontSize: "16px", color: "rgba(61,61,61,1)" }}
                    >
                      {style.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

            </Stack>

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
        {/* ---------- PROGRESS */}
        {loading && (
          <Box
            sx={{
              mb: { xs: 2, md: 4 },
              p: { xs: 2, sm: 3, md: 5 },
              height: { xs: "auto", sm: 250, md: 270 },
              width: { sx: "auto", md: 800 },
              mx: "auto",
              borderRadius: 3,
              bgcolor: "white",
              boxShadow: "0 4px 20px rgba(142, 45, 226, 0.1)",
              border: "1px solid #f0f0f0",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: { xs: "flex-start", sm: "center" },
                gap: { xs: 1, sm: 0 },
                mb: 1.5,
              }}
            >
              <Box
                sx={{
                  width: 15,
                  height: 15,
                  borderRadius: "50%",
                  bgcolor: "#8E2DE2",
                  mr: { xs: 0, sm: 2 },
                  mb: { xs: 1, sm: 0 },
                  animation: "pulse 1.5s ease-in-out infinite",
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: "#8E2DE2",
                  flexGrow: 1,
                  fontSize: { xs: "1.25rem", md: "1.5rem" },
                }}
              >
                {currentMessage}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mt: { xs: 0.5, sm: 0 },
                  minWidth: { sm: "50px" },
                  textAlign: { xs: "right", sm: "left" },
                }}
              >
                {Math.round(progress)}%
              </Typography>
            </Box>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                mb: 2,
                lineHeight: 1.6,
                wordBreak: "break-word",
              }}
            >
              {currentDetail}
            </Typography>
            {/* <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 6,
              borderRadius: 5,
              bgcolor: "grey.200",
              "& .MuiLinearProgress-bar": {
                borderRadius: 5,
                background: "linear-gradient(90deg, #8E2DE2 0%, #4A00E0 100%)",
                boxShadow: "0 2px 10px rgba(142, 45, 226, 0.3)",
              },
            }}
          /> */}
          </Box>
        )}

        <Box sx={{ textAlign: "center", maxWidth: 800 }}>

          <Stack
            display="flex"
            flexDirection={{ xs: "column", md: "row" }}
            flexWrap="wrap"
            justifyContent="center"
            gap={2.2}
            alignItems="center"
          >
            {quickPrompts.map((prompt, index) => (
              <Chip
                key={index}
                label={prompt}
                onClick={() => setDescription(prompt)}
                sx={{
                  border: "1px solid rgba(246, 246, 246, 1)",
                  bgcolor: "rgba(248, 248, 248, 0.14)",
                  color: "#1A1A1A",
                  fontWeight: 400,
                  borderRadius: "20px",
                  "&:hover": { bgcolor: "rgba(230, 226, 255, 1)" },
                  px: 1.5,
                }}
              />
            ))}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
