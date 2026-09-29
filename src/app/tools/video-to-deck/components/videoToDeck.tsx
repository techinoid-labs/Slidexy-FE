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
import {
  Add,
  Remove,
  AutoAwesome,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useSlides } from "@/app/context/SlidesContext";
import { useTemplateSlides } from "@/app/context/TemplateSlidesContext";
import { useUser } from "@/app/context/AuthContext";
import AnimatedOrb from "@/app/components/shared/AnimatedOrb";
import { fadeUp, staggerContainer } from "@/lib/motion";

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

export default function VideoToDeck() {
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

  const isValidYoutubeUrl = (url: string): boolean => {
    try {
      const u = new URL(url.trim());
      const host = u.hostname.toLowerCase().replace(/^www\./, "");

      if (host === "youtu.be") return true;

      if (
        host.endsWith("youtube.com") ||
        host.endsWith("youtube-nocookie.com")
      ) {
        return (
          u.searchParams.has("v") ||
          u.pathname.startsWith("/embed/") ||
          u.pathname.startsWith("/shorts/") ||
          u.pathname.startsWith("/live/")
        );
      }
      return false;
    } catch {
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!description.trim()) {
      setError("Please paste a YouTube link.");
      return;
    }

    if (!isValidYoutubeUrl(description)) {
      setError(
        "Please paste a valid YouTube URL (e.g. https://youtu.be/… or https://www.youtube.com/watch?v=…)."
      );
      return;
    }

    setLoading(true);
    setError("");
    setProgress(0);
    setCurrentMessage("");
    setCurrentDetail("");
    setSlides([]);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const payload = {
        source: "youtube",
        inputUrl: description.trim(),
        meta: { goal, tone, audience: "" },
        artStyle: visualStyle,
        slideCount: count,
        userData: user,
      };

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
            if (event.percent !== undefined) setProgress(event.percent);
            if (event.message !== undefined) setCurrentMessage(event.message);
            if (event.detail !== undefined) setCurrentDetail(event.detail);
            if (event.error) {
              setError(event.error);
              setLoading(false);
              return;
            }
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
          } catch {
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

  const cancelGeneration = () => {
    abortControllerRef.current?.abort();
    setLoading(false);
    setProgress(0);
    setCurrentMessage("");
    setCurrentDetail("");
  };

  const quickPrompts = [
    "https://www.youtube.com/watch?v=n7ndRwqJYDM",
    "https://www.youtube.com/watch?v=lTTvKwCylFY",
    "https://www.youtube.com/watch?v=TjPFZaMe2yw",
    "https://www.youtube.com/watch?v=iG9CE55wbtY",
    "https://www.youtube.com/teded",
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
      <AnimatedOrb
        size={300}
        top="-5%"
        left="-5%"
        color="rgba(142, 45, 226, 0.15)"
        blur={60}
      />
      <AnimatedOrb
        size={260}
        bottom="10%"
        right="-5%"
        color="rgba(74, 0, 224, 0.12)"
        blur={50}
        delay={1}
      />

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
          <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 1.5 }}>
            <FormControl variant="outlined" sx={{ ...controlSx, minWidth: 150 }}>
              <Select
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                disabled={loading}
                sx={{ height: 44, color: "#5B5568" }}
              >
                <MenuItem value="Select Goal" hidden>
                  Select Goal
                </MenuItem>
                <MenuItem value="pitch">Pitch Deck</MenuItem>
                <MenuItem value="education">Educational</MenuItem>
                <MenuItem value="marketing">Marketing</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <TextField
            fullWidth
            multiline
            minRows={4}
            placeholder="Paste a YouTube link… e.g. https://youtu.be/dQw4w9WgXcQ"
            variant="outlined"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "stretch", md: "center" },
              gap: 2,
            }}
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              alignItems={{ xs: "stretch", sm: "center" }}
              spacing={1.5}
              sx={{ flex: 1, flexWrap: "wrap" }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  height: 44,
                  borderRadius: "12px",
                  bgcolor: "rgba(248, 246, 255, 1)",
                  border: "1px solid rgba(142, 45, 226, 0.1)",
                  px: 0.5,
                }}
              >
                <IconButton
                  size="small"
                  onClick={() => setCount(Math.max(1, count - 1))}
                  disabled={loading}
                >
                  <Remove sx={{ fontSize: 18 }} />
                </IconButton>
                <Typography
                  sx={{
                    px: 1.5,
                    fontWeight: 600,
                    fontFamily: "var(--font-display)",
                    minWidth: 28,
                    textAlign: "center",
                  }}
                >
                  {count}
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => {
                    if (count > 9) return;
                    setCount(count + 1);
                  }}
                  disabled={loading}
                >
                  <Add sx={{ fontSize: 18 }} />
                </IconButton>
              </Box>

              <FormControl variant="outlined" sx={{ ...controlSx, minWidth: 150 }}>
                <Select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  disabled={loading}
                  sx={{ height: 44, color: "#5B5568" }}
                >
                  <MenuItem value="Select Tone" hidden>
                    Select Tone
                  </MenuItem>
                  <MenuItem value="Professional">Professional</MenuItem>
                  <MenuItem value="Casual">Casual</MenuItem>
                  <MenuItem value="Inspirational">Inspirational</MenuItem>
                </Select>
              </FormControl>

              <FormControl
                variant="outlined"
                sx={{ ...controlSx, minWidth: { xs: "100%", sm: 200 } }}
              >
                <Select
                  value={visualStyle}
                  onChange={(e) => setVisualStyle(e.target.value)}
                  displayEmpty
                  disabled={loading}
                  sx={{ height: 44, color: "#5B5568" }}
                >
                  <MenuItem value="Choose Visual Art Style" hidden>
                    Visual style
                  </MenuItem>
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
              size="large"
              disabled={loading}
              onClick={handleSubmit}
              startIcon={<AutoAwesome />}
              sx={{
                minWidth: { xs: "100%", sm: 150 },
                py: 1.35,
                alignSelf: { xs: "stretch", md: "center" },
              }}
            >
              Generate
            </Button>
          </Box>

          {error && (
            <Alert
              severity="error"
              sx={{ mt: 2, borderRadius: "12px" }}
              action={
                <IconButton size="small" onClick={() => setError("")} color="inherit">
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
          message={currentMessage || "Watching the video"}
          detail={currentDetail}
          onCancel={cancelGeneration}
        />

        <Box
          component={motion.div}
          variants={fadeUp}
          sx={{ textAlign: "center", maxWidth: 820 }}
        >
          <Typography
            sx={{
              color: "text.secondary",
              fontSize: "0.9rem",
              fontWeight: 500,
              mb: 2,
            }}
          >
            Not sure what to paste? Try one of these
          </Typography>
          <Stack direction="row" flexWrap="wrap" justifyContent="center" gap={1.5}>
            {quickPrompts.map((prompt, index) => (
              <Chip
                key={index}
                label={prompt}
                onClick={() => setDescription(prompt)}
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
