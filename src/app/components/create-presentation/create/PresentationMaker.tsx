"use client";

import { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  InputAdornment,
  Avatar,
} from "@mui/material";
import Image from "next/image";
import InputModeSelector from "./InputModeSelector";
import PromptAttributeSelector from "./PromptAttributeSelector";
import { useRouter } from "next/navigation";
import { useSlides } from "@/app/context/SlidesContext";
import { useSearchParams } from "next/navigation";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import { Card, CardMedia, Box as MuiBox } from "@mui/material";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
console.log("[SlidesX] API_BASE_URL:", API_BASE_URL);

export default function PresentationMaker({
  promptCards,
}: {
  promptCards: {
    title: string;
    description: string;
    icon: string;
  }[];
}) {
  const [inputMode, setInputMode] = useState("Text");
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setSlides } = useSlides();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [goal, setGoal] = useState("");
  const [tone, setTone] = useState("");
  const [audience, setAudience] = useState("");
  const [length, setLength] = useState("");

  const getPlaceholder = () => {
    switch (inputMode) {
      case "Youtube":
        return "Paste a YouTube video URL...";
      case "Website":
        return "Paste a website link to summarize...";
      default:
        return "Describe your idea... e.g., 'Pitch for a new mental health app'";
    }
  };

  const handlePromptClick = (description: string) => {
    setInputMode("Text");
    setInputValue(description);
  };

  // Helper to extract YouTube video ID
  const extractVideoId = (inputUrl: string) => {
    try {
      const urlObj = new URL(inputUrl);
      if (urlObj.hostname.includes("youtube.com")) {
        return urlObj.searchParams.get("v");
      } else if (urlObj.hostname === "youtu.be") {
        return urlObj.pathname.slice(1);
      }
    } catch (error) {
      return null;
    }
  };

  // Helper to validate YouTube URL
  const isValidYoutubeUrl = (inputUrl: string) => {
    const id = extractVideoId(inputUrl);
    return Boolean(id);
  };

  // Helper to extract favicon URL for website
  const getFaviconUrl = (inputUrl: string) => {
    try {
      const domain = new URL(inputUrl).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    } catch (error) {
      return "";
    }
  };

  const faviconUrl =
    inputMode === "Website" && inputValue ? getFaviconUrl(inputValue) : "";

  const videoId = inputMode === "Youtube" ? extractVideoId(inputValue) : null;
  const showYoutubeError =
    inputMode === "Youtube" && inputValue && !isValidYoutubeUrl(inputValue);

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    if (inputMode === "Website") {
      try {
        const url = new URL(inputValue);
        if (!["http:", "https:"].includes(url.protocol)) throw new Error();
      } catch {
        setError("Please enter a valid website URL.");
        setLoading(false);
        return;
      }
    }

    // Build payload
    const base =
      inputMode === "Youtube"
        ? { source: "youtube", inputUrl: inputValue }
        : inputMode === "Website"
        ? { source: "website", inputWebsiteUrl: inputValue }
        : { source: "text", textContent: inputValue };

    const promptMeta = {
      goal,
      tone,
      audience,
      length,
    };

    const payload = { ...base, meta: promptMeta };
    console.log("[SlidesX] Payload to backend:", payload);
    // console.log("[SlidesX] Prompt meta (not sent):", promptMeta);
    // return;
    try {
      const res = await fetch(`${API_BASE_URL}/generate-slides`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      console.log("[SlidesX] Raw response:", res);

      if (!res.ok) {
        let errorData: any = {};
        try {
          errorData = await res.json();
        } catch (e) {
          errorData = { error: "Unknown error" };
        }
        console.error("[SlidesX] Error response from backend:", errorData);
        throw new Error(errorData.error || "Failed to generate slides");
      }

      const data = await res.json();
      console.log("[SlidesX] Parsed slides data:", data);
      setSlides(data.slides);
      router.push(`/presentation/outline`);
    } catch (err: any) {
      console.error("[SlidesX] Exception in handleSubmit:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const prompt = searchParams.get("prompt");

    if (prompt) {
      setInputValue(prompt);

      const params = new URLSearchParams(Array.from(searchParams.entries()));
      params.delete("prompt");

      const newQuery = params.toString();
      const pathname = window.location.pathname;

      const newUrl = newQuery ? `${pathname}?${newQuery}` : pathname;

      router.replace(newUrl, { scroll: false });
    }
  }, []);

  return (
    <Box sx={{ mx: "auto", mt: 6, width: { xs: "100%", md: "70%" } }}>
      <InputModeSelector onModeChange={setInputMode} />

      <PromptAttributeSelector
        goal={goal}
        tone={tone}
        audience={audience}
        length={length}
        setGoal={setGoal}
        setTone={setTone}
        setAudience={setAudience}
        setLength={setLength}
      />

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "#fff",
          borderRadius: "999px",
          border: "2px solid #8E2DE2",
          boxShadow: "4px 5px 0px 0px #8E2DE2",
          height: 72,
          px: 2,
          mb: 3,
        }}
      >
        <TextField
          fullWidth
          type="url"
          variant="outlined"
          placeholder={getPlaceholder()}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          InputProps={{
            sx: {
              height: "100%",
              border: "none",
              "& fieldset": { border: "none" },
              fontSize: "1.125rem",
              px: 2,
            },
            endAdornment:
              inputMode === "Website" && faviconUrl ? (
                <InputAdornment position="end">
                  <Avatar
                    src={faviconUrl}
                    alt="Favicon"
                    sx={{ width: 32, height: 32, bgcolor: "transparent" }}
                  />
                </InputAdornment>
              ) : undefined,
          }}
        />
      </Box>

      {/* Show YouTube thumbnail if mode is Youtube and valid videoId */}
      {inputMode === "Youtube" && videoId && !showYoutubeError && (
        <MuiBox
          sx={{ width: "100%", maxWidth: 600, mx: "auto", mb: 3 }} // Increase maxWidth here for larger card
        >
          <Card
            sx={{ position: "relative", borderRadius: 2, overflow: "hidden" }}
          >
            <CardMedia
              component="img"
              image={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
              alt="YouTube Thumbnail"
              sx={{ width: "100%", height: 300, objectFit: "cover" }} // Increase height here for larger image
            />
            <MuiBox
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                pointerEvents: "none",
              }}
            >
              <PlayCircleOutlineIcon
                sx={{
                  fontSize: 80,
                  color: "white",
                  opacity: 0.85,
                  filter: "drop-shadow(0 2px 8px #000)",
                }}
              />
            </MuiBox>
          </Card>
        </MuiBox>
      )}
      {/* Show error if YouTube URL is invalid */}
      {showYoutubeError && (
        <Typography color="error" sx={{ mt: 1, mb: 2, textAlign: "center" }}>
          Please enter a valid YouTube URL.
        </Typography>
      )}

      <Button
        fullWidth
        variant="contained"
        onClick={handleSubmit}
        disabled={loading}
        sx={{
          textTransform: "none",
          background: "linear-gradient(90deg, #8E2DE2 0%, #4A00E0 100%)",
          borderRadius: "999px",
          px: 6,
          py: 1.75,
          fontSize: "1.125rem",
          fontWeight: 600,
          mb: 4,
          color: "#fff", // Ensure text is white
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          "& .MuiButton-label": {
            color: "#fff !important",
          },
          "&:hover": {
            background: "linear-gradient(90deg, #7a23c2 0%, #3e00c2 100%)",
          },
        }}
      >
        <span style={{ color: "#fff" }}>
          {loading ? "Generating..." : "Generate Outlines"}
        </span>
        <Image
          src="/images/generate.svg"
          alt="Magic Wand"
          width={22}
          height={22}
          style={{ marginLeft: "8px", filter: "brightness(0) invert(1)" }} // Make sure icon stays white
        />
      </Button>

      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      {/* Prompt Cards */}
      <Box sx={{ px: 2 }}>
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 600, mb: 2, color: "#333" }}
        >
          Quick Prompt Generator:
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "col", md: "row" },
            gap: 2,
            flexWrap: { xs: "wrap", sm: "nowrap" },
          }}
        >
          {promptCards.map((card, index) => (
            <Box
              key={index}
              sx={{
                ":hover": {
                  scale: "1.1 ",
                },
                cursor: "pointer",
                backgroundColor: "#F7F5FD",
                borderRadius: "16px",
                padding: 2,
                flex: "col",
                flexWrap: "wrap",

                position: "relative",
              }}
              onClick={() => handlePromptClick(card.description)}
            >
              <Typography variant="subtitle1" fontWeight={600} mt={3} mb={3}>
                {card.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={6}>
                {card.description}
              </Typography>
              <Box
                sx={{
                  position: "absolute",
                  top: 43,
                  right: 16,
                  cursor: "pointer",
                }}
              >
                <Image
                  src={card.icon}
                  alt="Prompt icon"
                  width={20}
                  height={20}
                />
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
