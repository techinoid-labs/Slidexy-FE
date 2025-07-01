"use client";

import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  IconButton,
  Button,
  Typography,
  useTheme,
  alpha,
} from "@mui/material";
import Image from "next/image";
import InputModeSelector from "./InputModeSelector";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

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
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  console.log(slides);

  const theme = useTheme();

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
  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setSlides([]);

    const payload =
      inputMode === "Youtube"
        ? { source: "youtube", inputUrl: inputValue }
        : inputMode === "Website"
        ? { source: "website", inputWebsiteUrl: inputValue }
        : { source: "text", textContent: inputValue };
    console.log(payload);
    // return;
    try {
      const res = await fetch(`${API_BASE_URL}/generate-slides`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to generate slides");
      }

      const data = await res.json();
      setSlides(data.slides);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mt: 6,
        width: "100%",
      }}
    >
      <InputModeSelector onModeChange={(mode) => setInputMode(mode)} />

      <div className="w-full">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#fff",
            borderRadius: "999px",
            border: "2px solid #8E2DE2",
            boxShadow: "4px 5px 0px 0px #8E2DE2",
            width: { xs: "100%", md: 660 },
            height: 72,
            px: 2,
            mb: 3,
          }}
        >
          <TextField
            fullWidth
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
          disableElevation
          disabled={loading}
        >
          <Typography>
            {loading ? "Generating..." : "Generate Outlines"}
          </Typography>
          <Image
            src="/images/create-presentation/generate-presentation-btn-ico.svg"
            alt="Magic Wand"
            width={22}
            height={22}
            style={{ marginLeft: "8px" }}
          />
        </Button>
      </div>

      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
}
