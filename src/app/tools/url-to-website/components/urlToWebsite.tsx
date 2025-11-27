"use client";
import {
    Box,
    Typography,
    Button,
    TextField,
    IconButton,
    Chip,
    Stack,
    Alert,
    AlertTitle,
    CircularProgress,
} from "@mui/material";
import { AutoAwesome, Close as CloseIcon } from "@mui/icons-material";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function UrlToWebsite() {
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentMessage, setCurrentMessage] = useState("");
    const [currentDetail, setCurrentDetail] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();
    const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Smooth progress simulation
    const startProgressSimulation = () => {
        setProgress(0);
        let currentProgress = 0;

        progressIntervalRef.current = setInterval(() => {
            currentProgress += Math.random() * 3; // Increment by 1-3% randomly
            
            // Cap at 90% until actual completion
            if (currentProgress >= 90) {
                currentProgress = 90;
                if (progressIntervalRef.current) {
                    clearInterval(progressIntervalRef.current);
                }
            }
            
            setProgress(Math.min(currentProgress, 90));

            // Update messages based on progress
            if (currentProgress < 20) {
                setCurrentMessage("Analyzing URL...");
                setCurrentDetail("Fetching website content...");
            } else if (currentProgress < 40) {
                setCurrentMessage("Scraping website content...");
                setCurrentDetail("Extracting text, images, and structure...");
            } else if (currentProgress < 60) {
                setCurrentMessage("Processing with AI...");
                setCurrentDetail("Generating HTML, CSS, and JavaScript...");
            } else if (currentProgress < 80) {
                setCurrentMessage("Creating files...");
                setCurrentDetail("Building website structure...");
            } else {
                setCurrentMessage("Finalizing website...");
                setCurrentDetail("Almost done, preparing your files...");
            }
        }, 200); // Update every 200ms for smooth animation
    };

    const stopProgressSimulation = () => {
        if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
            progressIntervalRef.current = null;
        }
    };

    useEffect(() => {
        // Cleanup on unmount
        return () => {
            stopProgressSimulation();
        };
    }, []);

    const handleSubmit = async () => {
        if (!url.trim()) {
            setError("Please enter a website URL.");
            return;
        }

        // Basic URL validation
        const urlPattern = /^(https?:\/\/)?(www\.)?[\w\-]+(\.[\w\-]+)+[/#?]?.*$/;
        if (!urlPattern.test(url)) {
            setError("Please enter a valid URL (e.g., www.example.com or https://example.com)");
            return;
        }

        setLoading(true);
        setError("");
        startProgressSimulation(); // Start smooth progress

        try {
            // Add https:// if not present
            let formattedUrl = url.trim();
            if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
                formattedUrl = 'https://' + formattedUrl;
            }

            const response = await fetch(`${API_BASE_URL}/api/website-generator/generate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ url: formattedUrl }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to generate website");
            }

            const responseData = await response.json();

            // Stop simulation and jump to 100%
            stopProgressSimulation();
            setProgress(100);
            setCurrentMessage("✅ Website generated successfully!");
            setCurrentDetail("Redirecting to editor...");

            const presentationId = responseData.data?.id || responseData.data?.presentationId || responseData.presentationId;
            
            if (presentationId) {
                setTimeout(() => {
                    router.push(`/tools/url-to-website/editor?id=${presentationId}`);
                }, 1000);
            } else {
                throw new Error("No presentation ID received");
            }

        } catch (err: any) {
            console.error("Website generation error:", err);
            stopProgressSimulation();
            setError(err.message || "Something went wrong during generation.");
            setProgress(0);
            setCurrentMessage("");
            setCurrentDetail("");
        } finally {
            setTimeout(() => {
                if (!error) {
                    setLoading(false);
                }
            }, 1500);
        }
    };

    const quickPrompts = [
        "www.techinoid.com",
        "nodejs.org/en/download",
        "github.com",
        "stripe.com",
        "vercel.com",
        "tailwindcss.com",
    ];

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
                        opacity: "0.1"
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
                    py: { xs: 8, md: 10 },
                    px: { xs: 2, md: 6 },
                }}
            >
                <Typography variant="h2" sx={{ fontWeight: 700, mb: 1, color: "rgba(26, 26, 26, 1)", fontSize: "60px" }}>
                    Url-to-Website
                </Typography>
                <Typography sx={{
                    color: "rgba(109, 109, 109, 1)", maxWidth: 580, mb: 6, fontSize: { xs: "16px", md: "18px" },
                    textAlign: "center"
                }}>
                    Elevate your presentations with our AI-powered tool—create&nbsp;polished,
                    professional slides in just seconds.
                </Typography>

                <Box
                    sx={{
                        width: "100%",
                        maxWidth: "926px",
                        height: "340px",
                        bgcolor: "rgba(251, 250, 255, 0.5)",
                        borderRadius: 1,
                        boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
                        border: "1px solid rgba(232, 228, 255, 1)",
                        p: { xs: 3, md: 4 },
                    }}>

                    <TextField
                        fullWidth
                        multiline
                        minRows={4}
                        placeholder="Paste the website link here e.g., www.techinoid.com"
                        variant="outlined"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        disabled={loading}
                        sx={{
                            mt: -3,
                            mb: 15,
                            "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                        }}
                    />

                    <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems="center" justifyContent="flex-end">
                        <Button
                            variant="contained"
                            onClick={handleSubmit}
                            disabled={loading}
                            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <AutoAwesome />}
                            sx={{
                                backgroundColor: "#6C2BD9",
                                color: "#fff",
                                borderRadius: "32px",
                                width: { xs: "100%", sm: "130px" },
                                height: "44px",
                                px: 4,
                                py: 1.2,
                                fontWeight: 600,
                                boxShadow: "0 3px 10px rgba(108,43,217,0.3)",
                                alignSelf: { xs: "stretch", md: "center" },
                                "&:hover": { backgroundColor: "#5B21B6" },
                                "&:disabled": { backgroundColor: "#9E9E9E" },
                            }}
                        >
                            {loading ? "Generating..." : "Generate"}
                        </Button>
                    </Stack>

                    {error && (
                        <Alert
                            severity="error"
                            sx={{ mt: 2 }}
                            action={
                                <IconButton onClick={() => setError("")} color="inherit">
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
                    <Box
                        sx={{
                            mt: 4,
                            p: 3,
                            borderRadius: 2,
                            bgcolor: "white",
                            boxShadow: "0 4px 20px rgba(142, 45, 226, 0.1)",
                            border: "1px solid #f0f0f0",
                            width: "100%",
                            maxWidth: 800,
                        }}
                    >
                        <Typography variant="h6" color="#8E2DE2" sx={{ mb: 1 }}>
                            {currentMessage}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {currentDetail}
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <Box sx={{ flex: 1, bgcolor: "#f0f0f0", borderRadius: 1, height: 8 }}>
                                <Box
                                    sx={{
                                        width: `${progress}%`,
                                        height: "100%",
                                        bgcolor: "#8E2DE2",
                                        borderRadius: 1,
                                        transition: "width 0.3s ease",
                                    }}
                                />
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                                {Math.round(progress)}%
                            </Typography>
                        </Box>
                    </Box>
                )}

                <Box sx={{ textAlign: "center", maxWidth: 800, mt: 4 }}>
                    <Stack direction="row" flexWrap="wrap" justifyContent="center" gap={2}>
                        {quickPrompts.map((prompt, i) => (
                            <Chip
                                key={i}
                                label={prompt}
                                onClick={() => !loading && setUrl(prompt)}
                                disabled={loading}
                                sx={{
                                    border: "1px solid rgba(246, 246, 246, 1)",
                                    bgcolor: "rgba(248, 248, 248, 0.14)",
                                    "&:hover": { bgcolor: "rgba(230, 226, 255, 1)" },
                                    cursor: loading ? "not-allowed" : "pointer",
                                }}
                            />
                        ))}
                    </Stack>
                </Box>
            </Box>
        </Box>
    );
}