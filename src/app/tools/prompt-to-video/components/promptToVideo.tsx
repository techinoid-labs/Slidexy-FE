"use client";

import {
    Box,
    Typography,
    Button,
    TextField,
    Stack,
    IconButton,
    Alert,
    AlertTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
} from "@mui/material";
import { AutoAwesome, Close as CloseIcon } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useSlides } from "@/app/context/SlidesContext";
import { useTemplateSlides } from "@/app/context/TemplateSlidesContext";
import { useUser } from "@/app/context/AuthContext";

const API_BASE_URL = process.env.NEXT_PUBLIC_EXPLAINER_API_BASE_URL;
const DEFAULT_TARGET_DURATION = 10;
const DEFAULT_COLOR_SCHEME = "techBlue";

export default function PromptToVideo() {
    const [prompt, setPrompt] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [downloadName, setDownloadName] = useState<string>("generated_video.mp4");
    const [colorScheme, setColorScheme] = useState("techBlue");

    const { setSlides } = useSlides();
    const { setPresentationId } = useTemplateSlides();
    const { user } = useUser();

    const handleDownload = async () => {
        if (!videoUrl) return;

        try {
            // Fetch the video
            const response = await fetch(videoUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            // Clean the filename by removing query params
            let cleanName = downloadName.split("?")[0];

            // Create download link
            const a = document.createElement("a");
            a.href = url;
            a.download = cleanName; // use cleaned filename
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Download failed", err);
        }
    };

    useEffect(() => {
        return () => {
            if (videoUrl) {
                try {
                    URL.revokeObjectURL(videoUrl);
                } catch { }
            }
        };
    }, [videoUrl]);

    const handleSubmit = async () => {
        setError("");
        if (!prompt.trim()) {
            setError("Please enter a prompt.");
            return;
        }

        setLoading(true);
        setSlides([]);
        setVideoUrl(null);

        const payload = {
            prompt: prompt.trim(),
            target_duration: DEFAULT_TARGET_DURATION,
            color_scheme: colorScheme,
            userData: user,
        };

        try {
            const res = await fetch(`${API_BASE_URL}/generate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.error || "Something went wrong");
            }

            const data = await res.json();

            if (data.status === "success" && data.video_path) {
                setVideoUrl(data.video_path);
                setDownloadName(data.video_path.split("/").pop() || "generated_video.mp4");
            } else {
                throw new Error(data.message || "Video generation failed");
            }
        } catch (err: any) {
            setError(err.message || "Network error");
        } finally {
            setLoading(false);
        }
    };

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
                        opacity: 0.06,
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
                <Typography variant="h2" sx={{ fontWeight: 700, mb: 1, fontSize: "48px" }}>
                    Prompt-to-Video
                </Typography>

                <Typography sx={{ color: "rgba(109,109,109,1)", maxWidth: 520, mb: 6 }}>
                    Enter a single prompt and get a short video.
                </Typography>

                <Box
                    sx={{
                        width: "100%",
                        maxWidth: 926,
                        backgroundColor: "rgba(251,250,255,0.5)",
                        borderRadius: 1,
                        boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
                        border: "1px solid rgba(232,228,255,1)",
                        p: { xs: 3, md: 4 },
                        mb: 4,
                    }}
                >
                    <TextField
                        fullWidth
                        multiline
                        minRows={4}
                        placeholder="Enter your prompt"
                        variant="outlined"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        sx={{
                            mb: 1.5,
                            "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                            borderBottom: "1px solid rgba(242,240,255,1)",
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
                            width: "100%",
                        }}
                    >
                        <Stack direction="row" spacing={1.5} sx={{ flex: 1,gap: 400 }} />
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
                            }}
                        >
                            <InputLabel
                                sx={{
                                    fontSize: "14px",
                                    fontFamily: "Raleway",
                                }}
                            >
                                Color Scheme
                            </InputLabel>
                            <Select
                                value={colorScheme}
                                label="Select Color Scheme"
                                onChange={(e) => setColorScheme(e.target.value)}
                                disabled={loading}
                                sx={{
                                    backgroundColor: "#fff",
                                    height: "44px",
                                    fontSize: "14px",
                                }}
                            >
                                <MenuItem value="techBlue">Tech Blue</MenuItem>
                                <MenuItem value="forestGreen">Forest Green</MenuItem>
                                <MenuItem value="culinaryRed">Culinary Red</MenuItem>
                                <MenuItem value="creativeViolet">Creative Violet</MenuItem>
                                <MenuItem value="travelTeal">Travel Teal</MenuItem>
                                <MenuItem value="academicYellow">Academic Yellow</MenuItem>
                                <MenuItem value="scienceBlue">Science Blue</MenuItem>
                                <MenuItem value="corporateGold">Corporate Gold</MenuItem>
                                <MenuItem value="medicalBlue">Medical Blue</MenuItem>
                            </Select>
                        </FormControl>
                        <Button
                            variant="contained"
                            disabled={loading}
                            onClick={handleSubmit}
                            sx={{
                                backgroundColor: "#6C2BD9",
                                color: "#fff",
                                borderRadius: "32px",
                                width: { xs: "100%", sm: "160px" },
                                height: "44px",
                                px: 4,
                                fontWeight: 600,
                                boxShadow: "0 3px 10px rgba(108,43,217,0.3)",
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

                {loading && (
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        Generating video...
                    </Typography>
                )}

                {videoUrl && (
                    <Box sx={{ width: "100%", maxWidth: 900, mt: 2 }}>
                        <Typography variant="h6" sx={{ mb: 1 }}>
                            Generated Video
                        </Typography>
                        <Box sx={{ bgcolor: "#fff", p: 2, borderRadius: 2, boxShadow: 2 }}>
                            <video src={videoUrl} controls style={{ width: "100%", borderRadius: 8 }} />
                            <Stack direction="row" spacing={2} sx={{ mt: 2, justifyContent: "flex-end" }}>
                                <Button
                                    onClick={handleDownload}
                                    variant="contained"
                                    sx={{ backgroundColor: "#4A00E0", "&:hover": { backgroundColor: "#3a00b8" } }}
                                >
                                    Download
                                </Button>

                            </Stack>
                        </Box>
                    </Box>
                )}
            </Box>
        </Box>
    );
}
