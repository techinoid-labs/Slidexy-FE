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
    Chip,
    Backdrop,
} from "@mui/material";
import { AutoAwesome, Close as CloseIcon } from "@mui/icons-material";
import { useState, useEffect, useRef } from "react";
import { useSlides } from "@/app/context/SlidesContext";
import { useTemplateSlides } from "@/app/context/TemplateSlidesContext";
import { useUser } from "@/app/context/AuthContext";
import { useVideoJob } from "@/app/context/ExplainerVideoContext";
import { useRouter } from "next/navigation";

const API_BASE_URL = process.env.NEXT_PUBLIC_EXPLAINER_API_BASE_URL;
const DEFAULT_TARGET_DURATION = 10;

export default function PromptToVideo() {
    const [prompt, setPrompt] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();
    const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
    // const [jobId, setJobId] = useState<string | null>(null);
    // const [progress, setProgress] = useState<number>(0);
    // const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [downloadName, setDownloadName] = useState<string>("generated_video.mp4");
    const [colorScheme, setColorScheme] = useState("techBlue");
    const { jobId, progress, videoUrl, setJobId, setProgress, setVideoUrl, resetJob } = useVideoJob();

    const pollingRef = useRef<NodeJS.Timeout | null>(null);

    const { setSlides } = useSlides();
    const { setPresentationId } = useTemplateSlides();
    const { user } = useUser();

    const quickPrompts = [
        "Artificial Intelligence",
        "Healthy Diet",
        "UX UI Guidelines",
        "Design Systems",
        "Cybersecurity",
    ];

    const loadingMessages = [
        "Analyzing your prompt",
        "Generating video scenes",
        "Designing visual layout",
        "Rendering animations",
        "Finalizing your video",
    ];

    useEffect(() => {
        if (!loading) return;

        const interval = setInterval(() => {
            setLoadingMessageIndex((prev) => (prev + 1) % loadingMessages.length);
        }, 2500);

        return () => clearInterval(interval);
    }, [loading]);

    useEffect(() => {
        const savedUrl = localStorage.getItem("savedVideoUrl");
        const savedName = localStorage.getItem("savedDownloadName");
        if (savedUrl) {
            setVideoUrl(savedUrl);
            setDownloadName(savedName || "generated_video.mp4");
        }
    }, []);

    useEffect(() => {
        if (videoUrl) {
            localStorage.setItem("savedVideoUrl", videoUrl);
            localStorage.setItem("savedDownloadName", downloadName);
        }
    }, [videoUrl, downloadName]);

    const handleDownload = async () => {
        if (!videoUrl) return;

        try {
            const response = await fetch(videoUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const cleanName = downloadName.split("?")[0];
            const a = document.createElement("a");
            a.href = url;
            a.download = cleanName;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Download failed", err);
        }
    };

    // Poll job status
    const pollStatus = async (id: string) => {
        try {
            const res = await fetch(`${API_BASE_URL}/status/${id}`, {
                headers: { accept: "application/json" },
            });

            if (!res.ok) throw new Error("Failed to get status");

            const data = await res.json();
            setProgress(data.progress || 0);

            if (data.status === "success" && data.video_path) {
                setVideoUrl(data.video_path);
                setLoading(false);

                router.push(`/tools/prompt-to-video/${id}`);
                setDownloadName(data.video_path.split("/").pop() || "generated_video.mp4");
                setLoading(false);
                if (pollingRef.current) clearInterval(pollingRef.current);
            } else if (data.status === "failed") {
                setError(data.message || "Video generation failed");
                setLoading(false);
                if (pollingRef.current) clearInterval(pollingRef.current);
            }
        } catch (err: any) {
            setError(err.message || "Network error");
            setLoading(false);
            if (pollingRef.current) clearInterval(pollingRef.current);
        }
    };


    const handleSubmit = async () => {
        resetJob();
        setError("");
        setProgress(0);
        setVideoUrl(null);
        localStorage.removeItem("savedVideoUrl");
        localStorage.removeItem("savedDownloadName");
        if (!prompt.trim()) {
            setError("Please enter a prompt.");
            return;
        }

        setLoading(true);

        try {
            const payload = {
                prompt: prompt.trim(),
                target_duration: DEFAULT_TARGET_DURATION,
                color_scheme: colorScheme,
                userData: user,
            };

            const res = await fetch(`${API_BASE_URL}/generate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.error || "Failed to start job");
            }

            const data = await res.json();
            if (data.job_id) {
                setJobId(data.job_id);
                // Start polling every 10 seconds
                if (pollingRef.current) clearInterval(pollingRef.current);
                pollingRef.current = setInterval(() => pollStatus(data.job_id), 10000);
            } else {
                throw new Error("Job ID not returned");
            }
        } catch (err: any) {
            setError(err.message || "Network error");
            setLoading(false);
        }
    };

    useEffect(() => {
        return () => {
            if (pollingRef.current) clearInterval(pollingRef.current);
        };
    }, []);

    return (
        <Box sx={{ position: "relative", width: "100%", minHeight: "100vh" }}>
            {/* Background video */}
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
                    style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.1 }}
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
                    Enter a prompt and get video explaining the Topic mentioned.
                </Typography>

                <Box
                    sx={{
                        width: "100%",
                        maxWidth: "926px",
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
                            mt: -3,
                            mb: 1.5,
                            "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                            borderBottom: "1px solid rgba(242,240,255,1)",
                            "& .MuiInputBase-input": { fontSize: "15px", lineHeight: 1.6 },
                            minHeight: 224,
                        }}
                    />

                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: { xs: "column", md: "row" },
                            justifyContent: "space-between",
                            alignItems: { xs: "stretch", md: "center" },
                            gap: 2,
                            width: "100%",
                        }}
                    >

                        <FormControl
                            sx={{
                                display: "flex",
                                width: { xs: "100%", sm: "170px" },
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
                            <InputLabel sx={{ fontSize: "14px", fontFamily: "Raleway", top: "-12px", }}>
                                Color Scheme
                            </InputLabel>
                            <Select
                                value={colorScheme}
                                onChange={(e) => setColorScheme(e.target.value)}
                                disabled={loading}
                                sx={{ fontSize: "16px", backgroundColor: "#fff", height: "44px", color: "rgba(109, 109, 109, 1)", }}
                                MenuProps={{
                                    PaperProps: {
                                        sx: {
                                            mt: 1.8,
                                            borderRadius: "10px",
                                        },
                                    },
                                }}
                            >
                                <MenuItem sx={{ fontSize: "16px", color: "rgba(61, 61, 61, 1)", width: "147px" }} value="techBlue">Tech Blue</MenuItem>
                                <MenuItem sx={{ fontSize: "16px", color: "rgba(61, 61, 61, 1)", width: "147px" }} value="forestGreen">Forest Green</MenuItem>
                                <MenuItem sx={{ fontSize: "16px", color: "rgba(61, 61, 61, 1)", width: "147px" }} value="culinaryRed">Culinary Red</MenuItem>
                                <MenuItem sx={{ fontSize: "16px", color: "rgba(61, 61, 61, 1)", width: "147px" }} value="creativeViolet">Creative Violet</MenuItem>
                                <MenuItem sx={{ fontSize: "16px", color: "rgba(61, 61, 61, 1)", width: "147px" }} value="travelTeal">Travel Teal</MenuItem>
                                <MenuItem sx={{ fontSize: "16px", color: "rgba(61, 61, 61, 1)", width: "147px" }} value="academicYellow">Academic Yellow</MenuItem>
                                <MenuItem sx={{ fontSize: "16px", color: "rgba(61, 61, 61, 1)", width: "147px" }} value="scienceBlue">Science Blue</MenuItem>
                                <MenuItem sx={{ fontSize: "16px", color: "rgba(61, 61, 61, 1)", width: "147px" }} value="corporateGold">Corporate Gold</MenuItem>
                                <MenuItem sx={{ fontSize: "16px", color: "rgba(61, 61, 61, 1)", width: "147px" }} value="medicalBlue">Medical Blue</MenuItem>
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
                                px: 4,
                                py: 1.2,
                                height: "56px",
                                fontWeight: 600,
                                whiteSpace: "nowrap",
                                "&:hover": { backgroundColor: "#5B21B6" },
                            }}
                            startIcon={<AutoAwesome />}
                        >
                            Generate
                        </Button>
                    </Box>
                </Box>

                {loading && (
                    <Backdrop
                        open={loading}
                        sx={{
                            zIndex: (theme) => theme.zIndex.drawer + 1,
                            backgroundColor: "rgba(0, 0, 0, 0.5)", // dim screen
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                            }}
                        >
                            <img
                                src="/Loader.gif"
                                alt="Generating..."
                                style={{ width: 470, height: 160 }}
                            />

                            <Typography
                                sx={{
                                    fontFamily: "Raleway",
                                    fontSize: "24px",
                                    fontWeight: 700,
                                    color: "#fff",
                                    mt: 1,
                                }}
                            >
                                {loadingMessages[loadingMessageIndex]}.....
                            </Typography>
                        </Box>
                    </Backdrop>
                )}
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
                {/* Quick Prompts */}
                <Box sx={{ textAlign: "center", maxWidth: 800, mt: 4 }}>
                    <Stack direction="row" flexWrap="wrap" justifyContent="center" gap={2}>
                        {quickPrompts.map((text, i) => (
                            <Chip
                                key={i}
                                label={text}
                                onClick={() => setPrompt(text)}
                                sx={{
                                    border: "1px solid rgba(246, 246, 246, 1)",
                                    bgcolor: "rgba(248, 248, 248, 0.14)",
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
