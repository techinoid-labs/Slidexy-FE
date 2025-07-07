"use client";

import { useEffect, useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import Image from "next/image";
import InputModeSelector from "./InputModeSelector";
import PromptAttributeSelector from "./PromptAttributeSelector";
import { useRouter } from "next/navigation";
import { useSlides } from "@/app/context/SlidesContext";

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

  // New: Prompt metadata state
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

    // const payload = { ...base, ...promptMeta };
    const payload = { ...base };
    console.log("[SlidesX] Payload to backend:", payload);
    console.log("[SlidesX] Prompt meta (not sent):", promptMeta);
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
      // localStorage.setItem("slides", JSON.stringify(data.slides)); // Ensure persistence before navigation
      router.push(`/presentation/outline`);
    } catch (err: any) {
      console.error("[SlidesX] Exception in handleSubmit:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ mx: "auto", mt: 6, width: { xs: "100%", md: "70%" } }}>
      <InputModeSelector onModeChange={setInputMode} />

      {/* <PromptAttributeSelector
        goal={goal}
        tone={tone}
        audience={audience}
        length={length}
        setGoal={setGoal}
        setTone={setTone}
        setAudience={setAudience}
        setLength={setLength}
      /> */}

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
          }}
        />
      </Box>

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
          "&:hover": {
            background: "linear-gradient(90deg, #7a23c2 0%, #3e00c2 100%)",
          },
        }}
      >
        {loading ? "Generating..." : "Generate Outlines"}
        <Image
          src="/images/create-presentation/generate-presentation-btn-ico.svg"
          alt="Magic Wand"
          width={22}
          height={22}
          style={{ marginLeft: "8px" }}
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
            flexDirection: "row",
            gap: 2,
            flexWrap: { xs: "wrap", sm: "nowrap" },
          }}
        >
          {promptCards.map((card, index) => (
            <Box
              key={index}
              sx={{
                backgroundColor: "#F7F5FD",
                borderRadius: "16px",
                padding: 2,
                flex: "1 1 30%",
                position: "relative",
              }}
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
                onClick={() => handlePromptClick(card.description)}
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
