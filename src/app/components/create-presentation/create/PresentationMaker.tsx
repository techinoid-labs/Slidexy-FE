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
      case "Poster": // New case for Poster
        return "Describe your poster idea... e.g., 'A poster for a charity event'";
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
      // Standard YouTube URLs
      if (
        urlObj.hostname === "www.youtube.com" ||
        urlObj.hostname === "youtube.com"
      ) {
        return urlObj.searchParams.get("v");
      }
      if (urlObj.hostname === "youtu.be") {
        return urlObj.pathname.slice(1);
      }
      // googleusercontent.com YouTube URLs
      if (
        urlObj.hostname === "googleusercontent.com" &&
        urlObj.pathname.startsWith("/youtube.com/")
      ) {
        const videoIdFromQuery = urlObj.searchParams.get("v");
        if (videoIdFromQuery) {
          return videoIdFromQuery;
        }
        // This assumes the video ID is the last segment after /youtube.com/N/
        const parts = urlObj.pathname.split("/");
        if (
          parts.length > 3 &&
          parts[1] === "youtube.com" &&
          parts[2].match(/^\d+$/)
        ) {
          return parts[3]; // Returns VIDEO_ID from /youtube.com/N/VIDEO_ID
        }
      }
    } catch (error) {
      return null;
    }
    return null;
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
        : inputMode === "Poster" // Changed from "Infographic" to "Poster"
        ? { topic: inputValue } // Payload for poster, assuming it takes a topic
        : { source: "text", textContent: inputValue };

    const promptMeta = {
      goal,
      tone,
      audience,
      length,
    };

    const payload = { ...base, meta: promptMeta };
    console.log("[SlidesX] Payload to backend:", payload);
    try {
      const endpoint =
        inputMode === "Poster" // Changed from "Infographic" to "Poster"
          ? "/generate-poster-template" // Changed endpoint
          : "/generate-slides";

      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
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

      if (inputMode === "Poster") {
        // Changed from "Infographic" to "Poster"
        const { imageUrl } = data; // Assuming the response contains an imageUrl

        if (!imageUrl) {
          throw new Error("No poster image URL returned from backend.");
        }

        const posterPayload = {
          imageUrl: imageUrl,
        };

        // Store for retrieval on /poster-templates page
        
        localStorage.clear();
        
        localStorage.setItem(
          "posterTemplateData", // Changed localStorage key
          JSON.stringify(posterPayload)
        )

        router.push("/infographics"); // Changed redirection route
      } else {
        setSlides(data.slides);
        router.push("/presentation/outline");
      }
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
      {/* You might need to update InputModeSelector to include "Poster" and remove "Infographic" */}
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
          height: { xs: 57, md: 70 },
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
              fontSize: { xs: "1rem", md: "1rem" },
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
        <MuiBox sx={{ width: "100%", maxWidth: 600, mx: "auto", mb: 3 }}>
          <Card
            sx={{ position: "relative", borderRadius: 2, overflow: "hidden" }}
          >
            <CardMedia
              component="img"
              // Ensure this URL is correct for your thumbnail service
              image={`http://img.youtube.com/vi/${videoId}/hqdefault.jpg`} // Changed to a standard YouTube thumbnail URL
              alt="YouTube Thumbnail"
              sx={{ width: "100%", height: 300, objectFit: "cover" }}
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
        onClick={handleSubmit}
        disabled={loading}
        sx={{
          position: "relative",
          overflow: "hidden",
          textTransform: "none",
          borderRadius: "999px",
          px: 6,
          py: 1.75,
          fontSize: "1.125rem",
          fontWeight: 600,
          mb: 4,
          height: { xs: 57, md: 70 },
          border: "2px solid #8E2DE2",
          backgroundColor: "#fff",
          color: loading ? "#fff" : "#8E2DE2",
          transition: "color 0.6s ease",

          "&:hover": {
            backgroundColor: "#f3eaff",
          },

          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: loading ? "100%" : "0%",
            background: "linear-gradient(90deg, #8E2DE2 0%, #4A00E0 100%)",
            transition: "width 1.8s ease-in-out", // slowed down fill animation
            zIndex: 0,
          },

          "& span, & .icon": {
            position: "relative",
            zIndex: 1,
          },
        }}
      >
        <span
          style={{
            color: loading ? "#fff" : "#8E2DE2",
            transition: "color 0.6s ease",
          }}
        >
          {loading ? "Generating..." : "Generate Outlines"}
        </span>

        <Box
          className="icon"
          sx={{
            width: 22,
            height: 22,
            ml: 1,
            background: loading
              ? "#fff"
              : "linear-gradient(90deg, #8E2DE2 0%, #4A00E0 100%)",
            maskImage: 'url("/images/generate.svg")',
            WebkitMaskImage: 'url("/images/generate.svg")',
            maskSize: "cover",
            WebkitMaskSize: "cover",
            maskRepeat: "no-repeat",
            WebkitMaskRepeat: "no-repeat",
            maskPosition: "center",
            WebkitMaskPosition: "center",
            transition: "background 1s ease",
          }}
        />
      </Button>

      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      {/* Prompt Cards */}
      <Box sx={{ px: 2 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            mb: 2,
            gap: 70,
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 500,
              color: "#333",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              fontSize: 15,
            }}
          >
            Quick Prompt Generator:
          </Typography>

          <Image
            src="/quick-generate.svg"
            alt="Generator Icon"
            width={35}
            height={30}
            style={{ marginTop: 0, marginBottom: 4 }}
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" }, // Stack in column on mobile, row on desktop
            gap: 2,
            flexWrap: { xs: "wrap", sm: "nowrap" },
            width: { xs: "100%", md: 1000 }, // Responsive width
            //justifyContent: "center", // Center children horizontally
            alignItems: "center", // Center children vertically (for column)
          }}
        >
          {promptCards.map((card, index) => (
            <Box
              key={index}
              sx={{
                ":hover": {
                  transform: "scale(1.05)",
                  transition: "0.3s ease",
                },
                cursor: "pointer",
                backgroundColor: "#F7F5FD",
                borderRadius: "16px",
                padding: 2,
                position: "relative",
                minHeight: { xs: 100, sm: 180 },
                width: {
                  xs:
                    index === 0
                      ? 270
                      : index === 1
                      ? 270
                      : index === 2
                      ? 270
                      : 100,
                  sm:
                    index === 0
                      ? 250
                      : index === 1
                      ? 250
                      : index === 2
                      ? 250
                      : 200,
                },
              }}
              onClick={() => handlePromptClick(card.description)}
            >
              <Typography variant="subtitle1" fontWeight={600} mt={1} mb={1}>
                {card.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={4}>
                {card.description}
              </Typography>
              <Box
                sx={{
                  position: "absolute",
                  top: 16,
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
