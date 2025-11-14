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

export default function PromptToEbook() {
  const { setInfographicId } = useTemplateSlides();
  const [orientation, setOrientation] = useState("landscape");
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
      setError("Please enter a description for the infographic.");
      return;
    }

    setLoading(true);
    setError("");
    setProgress(0);
    setCurrentMessage("Starting AI generation...");
    setCurrentDetail("");

    abortControllerRef.current = new AbortController();
    const payload = {
      prompt: description,
      viewMode: orientation,
      useReferences: true,
    };

    try {
      const res = await fetch(`${API_BASE_URL}/generate-poster-template`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/event-stream",
        },
        body: JSON.stringify(payload),
        signal: abortControllerRef.current.signal,
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Failed to start infographic generation");
      }

      if (!res.body) throw new Error("No response body received.");

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let done = false;

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n").filter((line) => line.trim() !== "" && !line.startsWith(":"));

          for (const line of lines) {
            if (line === "data: [DONE]") {
              done = true;
              break;
            }

            if (line.startsWith("data: ")) {
              try {
                const event = JSON.parse(line.replace("data: ", ""));
                if (event.error) {
                  setError(event.error);
                  setLoading(false);
                  return;
                }

                if (event.percent) setProgress(event.percent);
                if (event.message) setCurrentMessage(event.message);
                if (event.detail) setCurrentDetail(event.detail);
              } catch {
                console.warn("Invalid SSE event:", line);
              }
            }
          }
        }
      }

      // ✅ Save only once after full generation is complete
      setCurrentMessage("Finalizing infographic...");
      setCurrentDetail("Saving your generated infographic...");

      const saveRes = await fetch(`${API_BASE_URL}/api/dynamicInfographic`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: description, viewMode: orientation }),
      });

      if (!saveRes.ok) throw new Error(`Failed to save infographic (${saveRes.status})`);

      const saveData = await saveRes.json();

      if (saveData?.success && saveData?.infographic?._id) {
        setCurrentMessage("✅ Infographic successfully created!");
        setCurrentDetail("Redirecting to your infographic...");
        setInfographicId(saveData.infographic._id);
        router.push(`/infographic/${saveData.infographic._id}`);
      } else {
        throw new Error("Invalid response from save endpoint");
      }
    } catch (err: any) {
      console.error("Infographic generation error:", err);
      if (err.name === "AbortError") {
        setError("Infographic generation was cancelled.");
      } else {
        setError(err.message || "Something went wrong during generation.");
      }
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
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
          Prompt-to-eBook
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
            backgroundColor: "rgba(251, 250, 255, 1)",
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
            placeholder="The advantages of Artificial Intelligence"
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

              {/* Tone Selector */}
              <FormControl
                variant="outlined"
                sx={{
                  display: "flex",
                  width: { xs: "100%", sm: "130px" },
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
                  mb: 4,
                }}
              >
                <InputLabel
                  sx={{
                    fontSize: "14px",
                    fontFamily: "Raleway",
                  }}
                >
                  Select Tone
                </InputLabel>
                <Select
                  //   value={tone}
                  label="Select Tone"
                  //   onChange={(e) => setTone(e.target.value)}
                  disabled={loading}
                  sx={{
                    backgroundColor: "#fff",
                    height: "44px",
                    fontSize: "14px",
                  }}
                >
                  <MenuItem value="professional">Professional</MenuItem>
                  <MenuItem value="casual">Casual</MenuItem>
                  <MenuItem value="inspirational">Inspirational</MenuItem>
                </Select>
              </FormControl>
              {/* Visual Style Selector */}
              <FormControl
                variant="outlined"
                sx={{
                  display: "flex",
                  width: { xs: "100%", sm: "231px" },
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
                <InputLabel
                  sx={{
                    fontSize: "14px",
                    fontFamily: "Raleway",
                  }}
                >
                  Select Visual Style
                </InputLabel>
                <Select
                  //   value={visualStyle}
                  label="Select Visual Style"
                  //   onChange={(e) => setVisualStyle(e.target.value)}
                  disabled={loading}
                  sx={{
                    backgroundColor: "#fff",
                    height: "44px",
                    fontSize: "14px",
                  }}
                >
                  {TEXT_ART_STYLES.map((style) => (
                    <MenuItem key={style.value} value={style.value}>
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
