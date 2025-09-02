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
import { useTemplateSlides } from "@/app/context/TemplateSlidesContext";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
// console.log("[SlidesX] API_BASE_URL:", API_BASE_URL);

const getProgressMessage = (progress: number) => {
  if (progress < 8) return "Initializing...";
  if (progress < 17) return "Analyzing data...";
  if (progress < 24) return "Thinking...";
  if (progress < 43) return "Generating text ...";
  if (progress < 76) return "Generating images...";
  return "Finalizing...";
};

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
  const [progress, setProgress] = useState(0);
  const { setSlides, slides } = useSlides();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [templatePrompt, setTemplatePrompt] = useState("");

  // console.log(slides);

  const [goal, setGoal] = useState("");
  const [tone, setTone] = useState("");
  const [audience, setAudience] = useState("");
  const [slideCount, setSlideCount] = useState("");
  const { setSlideTemplates, slideTemplates, setPresentationId } =
    useTemplateSlides();
  // console.log({ slideTemplates });
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

  const extractVideoId = (inputUrl: string): string | null => {
    try {
      const urlObj = new URL(inputUrl);
      const host = urlObj.hostname.replace("www.", "");

      // youtu.be short link
      if (host === "youtu.be") {
        return urlObj.pathname.slice(1);
      }

      // Standard YouTube domains (desktop, mobile, music, no-cookie embeds)
      if (
        host.endsWith("youtube.com") ||
        host.endsWith("youtube-nocookie.com")
      ) {
        // Shorts
        if (urlObj.pathname.startsWith("/shorts/")) {
          return urlObj.pathname.split("/")[2];
        }

        // Embed
        if (urlObj.pathname.startsWith("/embed/")) {
          return urlObj.pathname.split("/")[2];
        }

        // Live
        if (urlObj.pathname.startsWith("/live/")) {
          return urlObj.pathname.split("/")[2];
        }

        // Standard watch
        return urlObj.searchParams.get("v");
      }

      return null;
    } catch {
      return null;
    }
  };

  const isValidYoutubeUrl = (inputUrl: string) => {
    const id = extractVideoId(inputUrl);
    return Boolean(id);
  };

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

  //No Streaming submit
  // const handleSubmit = async () => {
  //   setLoading(true);
  //   setError("");
  //   setProgress(0);

  //   let interval: NodeJS.Timeout | null = null;

  //   // Progress animation
  //   interval = setInterval(() => {
  //     setProgress((prev) => {
  //       if (prev >= 95) return prev;
  //       return prev + Math.random() * 0.8;
  //     });
  //   }, 200);

  //   // Validate website URL
  //   if (inputMode === "Website") {
  //     try {
  //       const url = new URL(inputValue);
  //       if (!["http:", "https:"].includes(url.protocol)) throw new Error();
  //     } catch {
  //       setError("Please enter a valid website URL.");
  //       setLoading(false);
  //       if (interval) clearInterval(interval);
  //       return;
  //     }
  //   }

  //   // Build payload
  //   const base =
  //     inputMode === "Youtube"
  //       ? { source: "youtube", inputUrl: inputValue }
  //       : inputMode === "Website"
  //       ? { source: "website", inputWebsiteUrl: inputValue }
  //       : { source: "text", textContent: inputValue };

  //   const promptMeta = { goal, tone, audience };
  //   const payload = {
  //     ...base,
  //     meta: promptMeta,
  //     slideCount: slideCount === "" ? 3 : slideCount,
  //   };

  //   try {
  //     const res = await fetch(`${API_BASE_URL}/generate-slides`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(payload),
  //     });

  //     let data: any;
  //     try {
  //       data = await res.json(); // ✅ parse once
  //     } catch {
  //       throw new Error("Invalid JSON response");
  //     }

  //     if (!res.ok) {
  //       throw new Error(data.error || "Failed to generate slides");
  //     }

  //     // ✅ stop animation before navigation
  //     if (interval) clearInterval(interval);

  //     setProgress(100);
  //     setSlides(data.slides);

  //     router.push(`/presentation/outline`);
  //   } catch (err: any) {
  //     setError(err.message || "Something went wrong");
  //     if (interval) clearInterval(interval);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  //Streaming submit

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setProgress(1);
    setSlides([]);

    // Validate website URL
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

    const promptMeta = { goal, tone, audience };
    const payload = {
      ...base,
      meta: promptMeta,
      slideCount: slideCount === "" ? 3 : slideCount,
    };

    try {
      const res = await fetch(`${API_BASE_URL}/generate-slides`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/event-stream",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok || !res.body) {
        throw new Error("Failed to connect to server");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
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

            if (event.percent !== undefined) {
              setProgress(event.percent); // 🔥 directly set from backend
            }

            if (event.error) {
              setError(event.error);
              setLoading(false);
              return;
            }

            if (event.complete) {
              setProgress(100);
              if (event.slides) {
                setSlides(event.slides);
              }
              setLoading(false);
              router.push(`/presentation/outline`);
              return;
            }
          } catch (err) {
            console.error("Bad JSON chunk:", jsonStr);
          }
        }
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      setLoading(false);
      setProgress(0);
    }
  };

  const handleTemplateSubmit = async () => {
    setLoading(true);
    setError("");
    setProgress(0);
    let interval: NodeJS.Timeout | null = null;

    interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return prev;
        return prev + Math.random() * 0.4;
      });
    }, 200);

    const meta = { goal, tone, audience };
    const payload = {
      topic: templatePrompt,
      meta,
      slideCount: slideCount == "" ? 3 : slideCount,
    };
    console.log("TEMPLATE CLICKED", payload);

    try {
      const res = await fetch(`${API_BASE_URL}/generate-ppt-template`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      let data: any;
      try {
        data = await res.json(); // ✅ parse once
      } catch {
        throw new Error("Invalid JSON response");
      }

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate template");
      }

      console.log("POST Response:", data);

      setProgress(100);
      setSlideTemplates(data.slides);
      setPresentationId(data.presentation_id);
      router.push(`/text-to-template?pid=${data.presentation_id}`);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      if (interval) clearInterval(interval);
      setLoading(false);
      setProgress(0);
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
        slideCount={slideCount}
        setGoal={setGoal}
        setTone={setTone}
        setAudience={setAudience}
        setSlideCount={setSlideCount}
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
          disabled={loading ? true : false}
          variant="outlined"
          placeholder={getPlaceholder()}
          value={inputMode == "Template" ? templatePrompt : inputValue}
          onChange={(e) =>
            inputMode == "Template"
              ? setTemplatePrompt(e.target.value)
              : setInputValue(e.target.value)
          }
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

      {inputMode === "Youtube" && videoId && !showYoutubeError && (
        <MuiBox sx={{ width: "100%", maxWidth: 600, mx: "auto", mb: 3 }}>
          <Card
            sx={{ position: "relative", borderRadius: 2, overflow: "hidden" }}
          >
            <CardMedia
              component="img"
              image={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
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

      {showYoutubeError && (
        <Typography color="error" sx={{ mt: 1, mb: 2, textAlign: "center" }}>
          Please enter a valid YouTube URL.
        </Typography>
      )}
      <Button
        fullWidth
        onClick={inputMode === "Template" ? handleTemplateSubmit : handleSubmit}
        disabled={
          loading ||
          (inputMode === "Template"
            ? !templatePrompt.trim()
            : !inputValue.trim() || Boolean(showYoutubeError))
        }
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
          border: `2px solid ${
            inputMode === "Template"
              ? !templatePrompt.trim()
                ? "grey"
                : "#8E2DE2"
              : !inputValue.trim() || Boolean(showYoutubeError)
              ? "grey"
              : "#8E2DE2"
          }`,
          backgroundColor: "#fff",
          color: loading ? "#fff" : "#8E2DE2",
          transition: "color 0.6s ease",
          opacity:
            inputMode === "Template"
              ? !templatePrompt.trim()
                ? 0.7
                : 1
              : !inputValue.trim() || Boolean(showYoutubeError)
              ? 0.7
              : 1,
          "&:hover": { backgroundColor: "#f3eaff" },
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: `${progress}%`,
            background: "linear-gradient(90deg, #8E2DE2 0%, #4A00E0 100%)",
            transition: "width 0.2s ease-out",
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
            color: loading
              ? "#fff"
              : inputMode === "Template"
              ? !templatePrompt.trim()
                ? "grey"
                : "#8E2DE2"
              : !inputValue.trim() || Boolean(showYoutubeError)
              ? "grey"
              : "#8E2DE2",
            textShadow: loading ? `0 0 10px #8E2DE2, 0 0 5px #4A00E0` : "none",
            transition: "color 0.6s ease, text-shadow 0.6s ease",
            fontWeight: 600,
          }}
        >
          {loading
            ? `${getProgressMessage(progress)} ${Math.round(progress)}%`
            : inputMode === "Template"
            ? "Generate Template"
            : "Generate Outlines"}
        </span>

        <Box
          className="icon"
          sx={{
            width: 22,
            height: 22,
            ml: 1,
            background: loading
              ? "linear-gradient(90deg, #ffffff 0%, #f5f0ff 100%)"
              : inputMode === "Template"
              ? !templatePrompt.trim()
                ? "linear-gradient(90deg, #e0e0e0 0%, #c0c0c0 100%)"
                : "linear-gradient(90deg, #8E2DE2 0%, #4A00E0 100%)"
              : !inputValue.trim() || Boolean(showYoutubeError)
              ? "linear-gradient(90deg, #e0e0e0 0%, #c0c0c0 100%)"
              : "linear-gradient(90deg, #8E2DE2 0%, #4A00E0 100%)",
            maskImage: 'url("/images/generate.svg")',
            WebkitMaskImage: 'url("/images/generate.svg")',
            maskSize: "cover",
            WebkitMaskSize: "cover",
            maskRepeat: "no-repeat",
            WebkitMaskRepeat: "no-repeat",
            maskPosition: "center",
            WebkitMaskPosition: "center",
            transition: "background 0.4s ease, box-shadow 0.4s ease",
            boxShadow: loading ? "0 0 10px #8E2DE2, 0 0 5px #4A00E0" : "none",
          }}
        />
      </Button>

      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

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
            paddingRight: { md: 25 },
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
            flexWrap: { xs: "wrap", sm: "nowrap" },
            width: { xs: "100%", md: 1000 },
            alignItems: "center",
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
                width: index === 0 || index === 1 || index === 2 ? 250 : 100,
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
