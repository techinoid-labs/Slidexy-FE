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
    Chip,
    Stack,
    Alert,
    AlertTitle,
    LinearProgress,
    IconButton,
} from "@mui/material";
import GenerationOverlay from "@/app/components/shared/GenerationOverlay";
import { AutoAwesome, Close as CloseIcon } from "@mui/icons-material";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const WEB_STYLES = [
    "Minimal & Clean",
    "Modern Glassmorphism",
    "Bold & Colorful",
    "Corporate Professional",
    "Dark Mode Elegant",
    "Creative Agency",
    "E-commerce Store",
    "SaaS Landing Page",
];

export default function UrlToWebsite() {
    const [mode, setMode] = useState<"static" | "dynamic">("static");
    const [url, setUrl] = useState("");
    const [prompt, setPrompt] = useState("");
    const [webStyle, setWebStyle] = useState("Minimal & Clean");

    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentMessage, setCurrentMessage] = useState("Testing");
    const [currentDetail, setCurrentDetail] = useState("");
    const [error, setError] = useState("");

    const router = useRouter();
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const startProgressSimulation = () => {
        setProgress(0);
        let p = 0;
        const startTime = Date.now();

        intervalRef.current = setInterval(() => {
            // Asymptotic progress: fast initially, then slows down as it approaches 98%
            // This ensures it never truly "stops" updating until we hit ~60s+
            const elapsed = Date.now() - startTime;

            // Formula: p = target * (1 - e^(-elapsed / time_constant))
            // We aim for 95% at 60 seconds (60000ms)
            // 0.95 = 1 - e^(-60000 / k) => 0.05 = e^(-60000/k) => ln(0.05) = -60000/k => k = -60000 / ln(0.05) ≈ 20000

            // We can mix a linear component for the start to make it feel responsive
            if (p < 30) {
                p += Math.random() * 5 + 2; // Fast start
            } else if (p < 70) {
                p += Math.random() * 2 + 0.5; // Medium pace
            } else if (p < 95) {
                p += Math.random() * 0.5 + 0.1; // Slow crawl to 95%
            } else {
                // Super slow crawl above 95%
                if (p < 99) p += 0.05;
            }

            setProgress(Math.min(p, 99));
        }, 800);
    };

    const stopProgressSimulation = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
    };

    useEffect(() => {
        return () => stopProgressSimulation();
    }, []);


    const handleSubmit = async () => {
        if (mode === "static" && !url.trim()) {
            setError("Please enter a website URL.");
            return;
        }
        if (mode === "dynamic" && !url.trim()) {
            setError("Please enter a website URL.");
            return;
        }

        setLoading(true);
        setError("");
        setProgress(0);
        setCurrentMessage("Initializing AI engine...");
        setCurrentDetail("Preparing your website generation...");
        startProgressSimulation();

        try {
            let endpoint: string;
            const payload: any = {};

            if (mode === "static") {
                let formattedUrl = url.trim();
                if (formattedUrl && !/^https?:\/\//i.test(formattedUrl)) {
                    formattedUrl = "https://" + formattedUrl;
                }
                endpoint = `${API_BASE_URL}/api/website-generator/smart-generate`;
                payload.url = formattedUrl;
            } else {
                let formattedUrl = url.trim();
                if (formattedUrl && !/^https?:\/\//i.test(formattedUrl)) {
                    formattedUrl = "https://" + formattedUrl;
                }
                endpoint = `${API_BASE_URL}/api/website-generator/clone-generate`;
                payload.url = formattedUrl;
            }

            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const err = await response.json().catch(() => ({}));
                throw new Error(err.error || "Generation failed");
            }

            const data = await response.json();
            console.log("🔥 DEBUG: Full Backend Response:", data);

            const presentationId =
                data.data?.id || data.data?.presentationId || data.presentationId || data.id || data.data?._id;

            console.log("🔥 DEBUG: Extracted ID:", presentationId);

            if (!presentationId) throw new Error("No website ID returned");

            stopProgressSimulation();
            setProgress(100);
            setCurrentMessage("Website generated successfully!");
            setCurrentDetail("Redirecting to editor...");

            setTimeout(() => {
                router.push(`/tools/url-to-website/editor?id=${presentationId}`);
            }, 1200);
        } catch (err: any) {
            stopProgressSimulation();
            setError(err.message || "Something went wrong. Please try again.");
            setProgress(0);
            setCurrentMessage("");
            setCurrentDetail("");
        } finally {
            setTimeout(() => setLoading(false), 1000);
        }
    };

    const quickSuggestions = mode === "static" || "dynamic"
        ? [
            "techinoid.com",
            "stripe.com",
            "github.com",
            "vercel.com",
            "tailwindcss.com",
            "nextjs.org",
        ]
        : [
            "Modern portfolio with dark mode",
            "SaaS landing page with pricing",
            "E-commerce store for sneakers",
            "Restaurant website with menu",
            "AI startup hero section",
            "Personal blog with Tailwind",
        ];

    return (
        <Box sx={{ position: "relative", width: "100%" }}>
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
                {/* white radial wash replaces video */}
                <Box
                    sx={{
                        position: "absolute",
                        inset: 0,
                        background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(142,45,226,0.07) 0%, transparent 60%)",
                        pointerEvents: "none",
                    }}
                />
            </Box>

            <Box
                sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    py: { xs: 4, md: 5 },
                    px: { xs: 2, md: 6 },
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
                        p: { xs: 3, md: 5 },
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
                        minRows={5}
                        placeholder={
                            mode === "static"
                                ? "Paste the website link here e.g., www.techinoid.com"
                                : "Paste the website link for dynamic website e.g., www.techinoid.com"
                        }
                        variant="outlined"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        disabled={loading}
                        sx={{
                            mb: 2,
                            "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                            borderBottom: "1px solid rgba(242, 240, 255, 1)",
                            "& .MuiInputBase-input": { fontSize: "15px", lineHeight: 1.7 },
                        }}
                    />
                    {/* Controls Row */}
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: 2,
                            mt: 2,
                        }}
                    >
                        {/* ONLY Mode Selector */}
                        <FormControl
                            sx={{
                                minWidth: 180,
                                height: 55,
                                backgroundColor: "#fff",
                                borderRadius: "10px",
                                boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
                                "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                            }}
                        >
                            <InputLabel
                                shrink
                                sx={{
                                    fontSize: "20px",
                                    top: "-15px",
                                }}
                            >
                                Select Input Mode
                            </InputLabel>

                            <Select
                                value={mode}
                                label="Select Input Mode"
                                onChange={(e) => setMode(e.target.value as "static" | "dynamic")}
                                disabled={loading}
                                sx={{ alignItems: "center", height: "200px" }}
                            >
                                <MenuItem value="static">Static Website</MenuItem>
                                <MenuItem value="dynamic">Dynamic Website</MenuItem>
                            </Select>
                        </FormControl>

                        {/* Generate Button (same row) */}
                        <Button
                            variant="contained"
                            size="large"
                            onClick={handleSubmit}
                            disabled={loading}
                            startIcon={<AutoAwesome />}
                            sx={{ width: "160px" }}
                        >
                            {loading ? "Generating..." : "Generate"}
                        </Button>
                    </Box>


                    {error && (
                        <Alert severity="error" sx={{ mt: 2 }} action={
                            <IconButton size="small" onClick={() => setError("")}><CloseIcon /></IconButton>
                        }>
                            <AlertTitle>Error</AlertTitle>
                            {error}
                        </Alert>
                    )}
                </Box>

                {loading && (
                    <GenerationOverlay
                        open={loading}
                        progress={progress}
                        message={currentMessage || "Generating your website"}
                        detail={currentDetail}
                    />
                )}


                {/* Quick Suggestions */}
                <Box sx={{ textAlign: "center", maxWidth: 900, mt: 4 }}>
                    <Stack direction="row" flexWrap="wrap" justifyContent="center" gap={2}>
                        {quickSuggestions.map((item) => (
                            <Chip
                                key={item}
                                label={item}
                                onClick={() => !loading && setUrl(item)}
                                disabled={loading}
                                sx={{
                                    bgcolor: "rgba(248, 248, 248, 0.2)",
                                    border: "1px solid rgba(240, 240, 240, 1)",
                                    borderRadius: "30px",
                                    fontWeight: 500,
                                    px: 2,
                                    py: 2.5,
                                    cursor: "pointer",
                                    "&:hover": { bgcolor: "rgba(108, 43, 217, 0.1)" },
                                }}
                            />
                        ))}
                    </Stack>
                </Box>
            </Box>
        </Box>
    );
}