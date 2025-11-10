"use client";

import { useEffect, useState } from "react";

import {
  Box,
  TextField,
  Button,
  Typography,
  InputAdornment,
  Avatar,
  LinearProgress,
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

import { useUser } from "@/app/context/AuthContext";

import { Alert, AlertTitle, IconButton } from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";

import PresentaionErrorAlert from "./PresentationErrorAlert";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const FE_URL = process.env.NEXT_PUBLIC_FE_BASE_URL;

// Progress tracker to ensure monotonic progress (never decreases)
class FrontendProgressTracker {
  private currentProgress: number = 0;
  private lastUpdateTime: number = Date.now();

  update(newProgress: number): number {
    // Always ensure progress only increases
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

export default function PresentationMaker({
  promptCards,
}: {
  promptCards: {
    title: string;
    description: string;
    icon: string;
  }[];
}) {
  const { user } = useUser();

  type InputMode = "Text" | "Website" | "Youtube" | "Template" | "TextToInfographics";

  const [inputMode, setInputMode] = useState<InputMode>("Text");

  const [orientation, setOrientation] = useState<"portrait" | "landscape">("landscape");

  const [inputValue, setInputValue] = useState("");

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const [progress, setProgress] = useState(0);

  const [currentMessage, setCurrentMessage] = useState("");

  const [currentDetail, setCurrentDetail] = useState("");

  const { setSlides, slides } = useSlides();

  const router = useRouter();

  const searchParams = useSearchParams();

  const [templatePrompt, setTemplatePrompt] = useState("");

  const [goal, setGoal] = useState("");

  const [tone, setTone] = useState("");

  const [audience, setAudience] = useState("");

  const [slideCount, setSlideCount] = useState("7");

  const [artStyle, setArtStyle] = useState("");

  const {
    setSlideTemplates,
    slideTemplates,
    setPresentationId,
    setInfographicId,
  } = useTemplateSlides();

  // Progress tracker instance
  const progressTracker = new FrontendProgressTracker();

  // Auto-suggest default art style based on input mode
  useEffect(() => {
    const defaults = {
      Text: "Concept Art",
      Website: "Flat Illustration",
      Youtube: "Cinematic Still Frame",
      Template: "",
      TextToInfographics: "",
    };

    setArtStyle(defaults[inputMode] || "");

    if (inputMode === "TextToInfographics") {
      setOrientation("landscape");
    }
  }, [inputMode]);

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

      if (host === "youtu.be") {
        return urlObj.pathname.slice(1);
      }

      if (
        host.endsWith("youtube.com") ||
        host.endsWith("youtube-nocookie.com")
      ) {
        if (urlObj.pathname.startsWith("/shorts/")) {
          return urlObj.pathname.split("/")[2];
        }

        if (urlObj.pathname.startsWith("/embed/")) {
          return urlObj.pathname.split("/")[2];
        }

        if (urlObj.pathname.startsWith("/live/")) {
          return urlObj.pathname.split("/")[2];
        }

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

  //Streaming submit for presentations
  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setProgress(0);
    setSlides([]);
    setCurrentMessage("");
    setCurrentDetail("");
    progressTracker.reset();

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

    console.log(slideCount);

    const payload = {
      ...base,
      meta: promptMeta,
      artStyle,
      slideCount: slideCount === "" ? 3 : slideCount,
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
      });

      if (!res.ok) {
        let errMsg = "Something went wrong";
        try {
          const errJson = await res.json();
          errMsg = errJson.error || errMsg;
        } catch {
          // non-JSON error
        }

        throw new Error(errMsg);
      }

      if (!res.body) {
        throw new Error("No response body received from server.");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      const onEvent = (event: any) => {
        // Ensure progress never decreases using tracker
        if (event.percent !== undefined) {
          const trackedProgress = progressTracker.update(event.percent);
          setProgress(trackedProgress);
        }

        // Update messages and details
        if (event.message !== undefined) {
          setCurrentMessage(event.message);
        }

        if (event.detail !== undefined) {
          setCurrentDetail(event.detail);
        }

        if (event.error) {
          setError(event.error);
          setLoading(false);
          return;
        }

        if (event.complete) {
          const finalProgress = progressTracker.update(100);
          setProgress(finalProgress);
          setCurrentMessage(event.message || "✅ Presentation successfully created!");
          setCurrentDetail(event.detail || "All slides and visuals are ready for viewing");

          if (event.slides) {
            setSlides(event.slides);
          }

          if (event.presentation_id) {
            setPresentationId(event.presentation_id);
          }

          setLoading(false);
          router.push(`/presentation/outline?pid=${event.presentation_id}`);
        }
      };

      await handleStream(reader, decoder, onEvent);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      setLoading(false);
      setProgress(0);
      progressTracker.reset();
    }
  };

  const handleInfographicSubmit = async () => {
    setLoading(true);
    setError("");
    setProgress(0);
    setCurrentMessage("");
    setCurrentDetail("");
    progressTracker.reset();

    const payload = {
      prompt: inputValue,
      viewMode: orientation,
      useReferences: true
    };

    // Frontend progress simulation to prevent stuck feeling
    let frontendProgress = 0;
    let lastBackendProgress = 0;
    let progressInterval: NodeJS.Timeout | null = null;
    let isCompleted = false;

    const startProgressSimulation = () => {
      progressInterval = setInterval(() => {
        if (!isCompleted && frontendProgress < 85) {
          const increment = Math.random() * 2 + 0.5;
          frontendProgress = Math.min(
            frontendProgress + increment,
            Math.max(lastBackendProgress, 85)
          );
          const trackedProgress = progressTracker.update(Math.round(frontendProgress));
          setProgress(trackedProgress);
        }
      }, 600);
    };

    const stopProgressSimulation = () => {
      if (progressInterval) {
        clearInterval(progressInterval);
        progressInterval = null;
      }
    };

    try {
      startProgressSimulation();

      const res = await fetch(`${API_BASE_URL}/generate-poster-template`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/event-stream",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        stopProgressSimulation();
        let errMsg = "Failed to generate infographic";
        try {
          const errJson = await res.json();
          errMsg = errJson.error || errMsg;
        } catch {
          // non-JSON error
        }

        throw new Error(errMsg);
      }

      if (!res.body) {
        stopProgressSimulation();
        throw new Error("No response body received from server.");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      const onEvent = (event: any) => {
        if (event.percent !== undefined) {
          lastBackendProgress = event.percent;
          if (event.percent > frontendProgress) {
            frontendProgress = event.percent;
            const trackedProgress = progressTracker.update(event.percent);
            setProgress(trackedProgress);
          }
        }

        if (event.message !== undefined) {
          setCurrentMessage(event.message);
        }

        if (event.detail !== undefined) {
          setCurrentDetail(event.detail);
        }

        if (event.error) {
          stopProgressSimulation();
          setError(event.error);
          setLoading(false);
          return;
        }

        if (event.complete) {
          isCompleted = true;
          stopProgressSimulation();
          const finalProgress = progressTracker.update(100);
          setProgress(finalProgress);
          setCurrentMessage(event.message || "✅ Infographic successfully created!");
          setCurrentDetail(event.detail || "Your infographic is ready!");

          (async () => {
            try {
              const saveRes = await fetch(`${API_BASE_URL}/api/dynamicInfographic`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: inputValue, viewMode: orientation })
              });

              if (!saveRes.ok) {
                throw new Error(`Failed to save infographic (${saveRes.status})`);
              }

              const saveData = await saveRes.json();

              if (saveData?.success && saveData?.infographic?._id) {
                setInfographicId(saveData.infographic._id);
                router.push(`/infographic/${saveData.infographic._id}`);
              } else {
                throw new Error("Invalid save response");
              }
            } catch (e: any) {
              console.error("Persisting infographic failed:", e);
              setError(e.message || "Failed to save infographic. Please try again.");
            } finally {
              setLoading(false);
            }
          })();
        }
      };

      await handleStream(reader, decoder, onEvent);
    } catch (err: any) {
      stopProgressSimulation();
      console.error("Infographic generation error:", err);
      setError(err.message || "Something went wrong");
      setLoading(false);
      progressTracker.reset();
    }
  };

  const handleTemplateSubmit = async () => {
    setLoading(true);
    setError("");
    setProgress(0);
    setCurrentMessage("");
    setCurrentDetail("");
    progressTracker.reset();

    const meta = { goal, tone, audience };

    const payload = {
      topic: templatePrompt,
      meta,
      slideCount: slideCount == "" ? 3 : slideCount,
      userData: user,
    };

    let frontendProgress = 0;
    let lastBackendProgress = 0;
    let progressInterval: NodeJS.Timeout | null = null;
    let isCompleted = false;

    const startProgressSimulation = () => {
      progressInterval = setInterval(() => {
        if (!isCompleted && frontendProgress < 85) {
          const increment = Math.random() * 2 + 0.5;
          frontendProgress = Math.min(
            frontendProgress + increment,
            Math.max(lastBackendProgress, 85)
          );
          const trackedProgress = progressTracker.update(Math.round(frontendProgress));
          setProgress(trackedProgress);
        }
      }, 800);
    };

    const stopProgressSimulation = () => {
      if (progressInterval) {
        clearInterval(progressInterval);
        progressInterval = null;
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
      });

      if (!res.ok) {
        stopProgressSimulation();
        let errMsg = "Failed to generate template";
        try {
          const errJson = await res.json();
          errMsg = errJson.error || errMsg;
        } catch {
          // non-JSON error
        }

        throw new Error(errMsg);
      }

      if (!res.body) {
        stopProgressSimulation();
        throw new Error("No response body received from server.");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      const onEvent = (event: any) => {
        if (event.percent !== undefined) {
          lastBackendProgress = event.percent;
          if (event.percent > frontendProgress) {
            frontendProgress = event.percent;
            const trackedProgress = progressTracker.update(event.percent);
            setProgress(trackedProgress);
          }
        }

        if (event.message !== undefined) {
          setCurrentMessage(event.message);
        }

        if (event.detail !== undefined) {
          setCurrentDetail(event.detail);
        }

        if (event.error) {
          stopProgressSimulation();
          setError(event.error);
          setLoading(false);
          return;
        }

        if (event.complete) {
          isCompleted = true;
          stopProgressSimulation();
          const finalProgress = progressTracker.update(100);
          setProgress(finalProgress);
          setCurrentMessage(event.message || "✅ Template successfully created!");
          setCurrentDetail(event.detail || "Your template is ready!");

          if (event.slides) {
            setSlideTemplates(event.slides);
          }

          if (event.presentation_id) {
            setPresentationId(event.presentation_id);
            router.push(`/text-to-template/${event.presentation_id}`);
          }

          setLoading(false);
        }
      };

      await handleStream(reader, decoder, onEvent);
    } catch (err: any) {
      stopProgressSimulation();
      console.error("Template generation error:", err);
      setError(err.message || "Something went wrong");
      setLoading(false);
      progressTracker.reset();
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
        artStyle={artStyle}
        inputMode={inputMode}
        setGoal={setGoal}
        setTone={setTone}
        setAudience={setAudience}
        setSlideCount={setSlideCount}
        setArtStyle={setArtStyle}
        orientation={orientation}
        setOrientation={setOrientation}
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
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (inputMode === "Template") {
                if (templatePrompt.trim()) handleTemplateSubmit();
              } else if (inputMode === "TextToInfographics") {
                if (inputValue.trim()) handleInfographicSubmit();
              } else {
                if (inputValue.trim() && !showYoutubeError) handleSubmit();
              }
            }
          }}
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

      {loading && (
        <Box
          sx={{
            mb: { xs: 2, md: 4 },
            p: { xs: 2, sm: 3, md: 4 },
            minHeight: { xs: "auto", sm: 200, md: "auto" },
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
              mb: 2,
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
                fontSize: { xs: "1.1rem", sm: "1.3rem", md: "1.5rem" },
                mb: { xs: 0.5, sm: 0 },
              }}
            >
              {currentMessage || "Generating your presentation..."}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mt: { xs: 0, sm: 0 },
                minWidth: { sm: "50px" },
                textAlign: { xs: "left", sm: "right" },
                fontWeight: 600,
                fontSize: "1rem",
                color: "#8E2DE2",
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
              lineHeight: 1.7,
              wordBreak: "break-word",
              fontSize: { xs: "0.9rem", sm: "1rem" },
              color: "#666",
            }}
          >
            {currentDetail || "Please wait while we generate your presentation..."}
          </Typography>

        </Box>
      )}

      <Button
        fullWidth
        onClick={
          inputMode === "Template"
            ? handleTemplateSubmit
            : inputMode === "TextToInfographics"
              ? handleInfographicSubmit
              : handleSubmit
        }
        disabled={
          loading ||
          (inputMode === "Template"
            ? !templatePrompt.trim()
            : inputMode === "TextToInfographics"
              ? !inputValue.trim()
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
            transition: "width 0.3s ease-out",
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
            textShadow: loading
              ? `0 0 10px #8E2DE2, 0 0 5px #4A00E0`
              : "none",
            transition: "color 0.6s ease, text-shadow 0.6s ease",
            fontWeight: 600,
          }}
        >
          {loading
            ? `Generating... ${Math.round(progress)}%`
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
            boxShadow: loading
              ? "0 0 10px #8E2DE2, 0 0 5px #4A00E0"
              : "none",
          }}
        />
      </Button>

      {error && (
        <PresentaionErrorAlert error={error} onClose={() => setError("")} />
      )}

      <Box sx={{ px: 2 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "flex-start", sm: "center" },
            mb: 2,
            gap: { xs: 1, md: 70 },
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

