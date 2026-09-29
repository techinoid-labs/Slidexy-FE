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
} from "@mui/material";
import GenerationOverlay from "@/app/components/shared/GenerationOverlay";
import { AutoAwesome, Close as CloseIcon } from "@mui/icons-material";
import { motion } from "framer-motion";
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
        "Product feature walkthrough",
        "Onboarding guide for new users",
        "Company culture and values",
        "Quarterly results explainer",
        "How-to tutorial for a tool",
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
            <Box
                component={motion.div}
                animate={{ y: [0, -24, 0], x: [0, 16, 0], scale: [1, 1.08, 1] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                sx={{
                    position: "absolute",
                    top: "-5%",
                    left: "-5%",
                    width: 300,
                    height: 300,
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(142,45,226,0.15) 0%, transparent 70%)",
                    filter: "blur(60px)",
                    pointerEvents: "none",
                }}
            />
            <Box
                component={motion.div}
                animate={{ y: [0, -24, 0], x: [0, 16, 0], scale: [1, 1.08, 1] }}
                transition={{ duration: 10, delay: 1, repeat: Infinity, ease: "easeInOut" }}
                sx={{
                    position: "absolute",
                    bottom: "10%",
                    right: "-5%",
                    width: 260,
                    height: 260,
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(74,0,224,0.12) 0%, transparent 70%)",
                    filter: "blur(50px)",
                    pointerEvents: "none",
                }}
            />

            <Box
                sx={{
                    width: "100%",
                    minHeight: "60vh",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    py: { xs: 8, md: 10 },
                    px: { xs: 2, md: 6 },
                    textAlign: "center",
                }}
            >


                <Box
                    sx={{
                        width: "100%",
                        maxWidth: "926px",
                        bgcolor: "rgba(255,255,255,0.92)",
                        backdropFilter: "blur(12px)",
                        borderRadius: "24px",
                        border: "1px solid rgba(142, 45, 226, 0.14)",
                        boxShadow: "0 28px 60px -20px rgba(142, 45, 226, 0.28), 0 8px 24px rgba(15, 10, 25, 0.04)",
                        p: { xs: 3, md: 4 },
                        mb: 4,
                        position: "relative",
                        overflow: "hidden",
                        "&::before": {
                            content: '""',
                            position: "absolute",
                            top: 0, left: 0, right: 0,
                            height: 4,
                            background: "linear-gradient(90deg, #8E2DE2, #C084FC, #4A00E0)",
                            backgroundSize: "200% 100%",
                            animation: "sx-gradient-shift 4s ease infinite",
                        },
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
                            size="large"
                            disabled={loading}
                            onClick={handleSubmit}
                            sx={{ width: { xs: "100%", sm: "160px" }, whiteSpace: "nowrap" }}
                            startIcon={<AutoAwesome />}
                        >
                            Generate
                        </Button>
                    </Box>
                </Box>

                {loading && (
                    <GenerationOverlay
                        open={loading}
                        progress={progress}
                        message={loadingMessages[loadingMessageIndex] || "Creating your video"}
                    />
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
