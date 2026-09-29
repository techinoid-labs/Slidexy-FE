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
    IconButton,
} from "@mui/material";
import GenerationOverlay from "@/app/components/shared/GenerationOverlay";
import { AutoAwesome, Close as CloseIcon } from "@mui/icons-material";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import AnimatedOrb from "@/app/components/shared/AnimatedOrb";
import { fadeUp, staggerContainer } from "@/lib/motion";

const API_BASE_URL = process.env.NEXT_PUBLIC_LATEX_API_BASE_URL;

const ENGINES = ["pdflatex", "xelatex", "lualatex"];

const QUICK_PROMPTS = [
    "Professional resume for a software engineer",
    "One-page cover letter for a data scientist role",
    "Academic research paper on machine learning",
    "Business proposal for startup funding",
    "Technical report on blockchain technology",
    "Festive holiday card with greetings",
];

export default function PromptToPdf() {
    const [prompt, setPrompt] = useState("");
    const [context, setContext] = useState("");
    const [outputFilename, setOutputFilename] = useState("");
    const [latexEngine, setLatexEngine] = useState("");
    const [saveTex, setSaveTex] = useState(true);
    const [retryOnError, setRetryOnError] = useState(true);

    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentMessage, setCurrentMessage] = useState("");
    const [error, setError] = useState("");

    const router = useRouter();
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const startProgressSimulation = () => {
        setProgress(0);
        let p = 0;

        intervalRef.current = setInterval(() => {
            if (p < 30) p += Math.random() * 5 + 2;
            else if (p < 70) p += Math.random() * 2 + 0.5;
            else if (p < 95) p += Math.random() * 0.5 + 0.1;
            else if (p < 99) p += 0.05;
            setProgress(Math.min(p, 99));
        }, 800);
    };

    const stopProgressSimulation = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
    };

    useEffect(() => {
        return () => stopProgressSimulation();
    }, []);

    const handleOneTimeGenerate = async () => {
        if (!prompt.trim()) {
            setError("Please enter a prompt.");
            return;
        }

        setLoading(true);
        setError("");
        setProgress(0);
        setCurrentMessage("Generating document...");
        startProgressSimulation();

        try {
            const payload = {
                prompt: prompt.trim(),
                context: context.trim() || undefined,
                output_filename: outputFilename.trim() || undefined,
                latex_engine: latexEngine || undefined,
                save_tex: saveTex,
                retry_on_error: retryOnError,
            };

            const response = await fetch(`${API_BASE_URL}/generate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const err = await response.json().catch(() => ({}));
                throw new Error(err.detail || "Generation failed");
            }

            const data = await response.json();

            stopProgressSimulation();
            setProgress(100);
            setCurrentMessage("Document ready!");

            setTimeout(() => {
                router.push(`/tools/prompt-to-pdf/editor?data=${encodeURIComponent(JSON.stringify(data))}`);
            }, 1200);
        } catch (err: any) {
            stopProgressSimulation();
            setError(err.message || "Failed to generate document");
            setProgress(0);
        } finally {
            setTimeout(() => setLoading(false), 1000);
        }
    };

    const handleStartSession = async () => {
        if (!prompt.trim()) {
            setError("Please enter a prompt.");
            return;
        }

        setLoading(true);
        setError("");
        setProgress(0);
        setCurrentMessage("Creating editable session...");
        startProgressSimulation();

        try {
            const payload = {
                prompt: prompt.trim(),
                document_name: outputFilename.trim() || undefined,
                context: context.trim() || undefined,
                latex_engine: latexEngine || undefined,
            };

            const response = await fetch(`${API_BASE_URL}/edit/sessions`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error("Failed to create session");

            const data = await response.json();

            stopProgressSimulation();
            setProgress(100);
            setCurrentMessage("Session created!");

            setTimeout(() => {
                router.push(`/tools/prompt-to-pdf/editor?session=${data.session_id}&initial=${encodeURIComponent(JSON.stringify(data))}`);
            }, 1200);
        } catch (err: any) {
            stopProgressSimulation();
            setError(err.message || "Failed to start session");
            setProgress(0);
        } finally {
            setTimeout(() => setLoading(false), 1000);
        }
    };

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
            <AnimatedOrb size={300} top="-5%" left="-5%" color="rgba(142, 45, 226, 0.15)" blur={60} />
            <AnimatedOrb size={260} bottom="10%" right="-5%" color="rgba(74, 0, 224, 0.12)" blur={50} delay={1} />

            <Box
                component={motion.div}
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    py: { xs: 3, md: 4 },
                    px: { xs: 2, md: 6 },
                    position: "relative",
                    zIndex: 1,
                }}
            >
                <Box
                    component={motion.div}
                    variants={fadeUp}
                    sx={{
                        position: "relative",
                        width: "100%",
                        maxWidth: 960,
                        bgcolor: "rgba(255,255,255,0.92)",
                        backdropFilter: "blur(12px)",
                        borderRadius: "24px",
                        border: "1px solid rgba(142, 45, 226, 0.14)",
                        boxShadow:
                            "0 28px 60px -20px rgba(142, 45, 226, 0.28), 0 8px 24px rgba(15, 10, 25, 0.04)",
                        p: { xs: 3, md: 4 },
                        mb: 4,
                        overflow: "hidden",
                        "&::before": {
                            content: '""',
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
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
                        placeholder="e.g. 'Resume for a Python developer with 5 years of experience'"
                        variant="outlined"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        disabled={loading}
                        sx={{
                            mb: 2.5,
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "14px",
                                bgcolor: "rgba(248, 246, 255, 0.5)",
                            },
                            "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: "rgba(142, 45, 226, 0.12)",
                            },
                            "& .MuiInputBase-input": {
                                fontSize: "1rem",
                                lineHeight: 1.65,
                            },
                        }}
                    />

                    <Stack spacing={2} direction={{ xs: "column", md: "row" }} mb={3}>
                        <TextField
                            fullWidth
                            label="Additional context (optional)"
                            multiline
                            rows={3}
                            placeholder="e.g. 'Use a one-page layout, include GitHub icons'"
                            value={context}
                            onChange={(e) => setContext(e.target.value)}
                            disabled={loading}
                        />

                        <Box sx={{ width: { xs: "100%", md: "50%" } }}>
                            <TextField
                                fullWidth
                                label="Output filename (optional)"
                                placeholder="e.g. my_resume_2026"
                                value={outputFilename}
                                onChange={(e) => setOutputFilename(e.target.value)}
                                disabled={loading}
                                sx={{ mb: 2 }}
                            />

                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel>LaTeX engine</InputLabel>
                                <Select value={latexEngine} onChange={(e) => setLatexEngine(e.target.value)} disabled={loading}>
                                    <MenuItem value="">Default (pdflatex)</MenuItem>
                                    {ENGINES.map((eng) => (
                                        <MenuItem key={eng} value={eng}>{eng}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <Stack direction="row" spacing={3}>
                                <Box
                                    component="label"
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 0.75,
                                        fontSize: "0.85rem",
                                        color: "#5B5568",
                                        cursor: "pointer",
                                    }}
                                >
                                    <input type="checkbox" checked={saveTex} onChange={(e) => setSaveTex(e.target.checked)} disabled={loading} />
                                    Save .tex file
                                </Box>
                                <Box
                                    component="label"
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 0.75,
                                        fontSize: "0.85rem",
                                        color: "#5B5568",
                                        cursor: "pointer",
                                    }}
                                >
                                    <input type="checkbox" checked={retryOnError} onChange={(e) => setRetryOnError(e.target.checked)} disabled={loading} />
                                    Retry on error
                                </Box>
                            </Stack>
                        </Box>
                    </Stack>

                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
                        <Button
                            variant="contained"
                            size="large"
                            onClick={handleOneTimeGenerate}
                            disabled={loading}
                            startIcon={<AutoAwesome />}
                            sx={{ flex: 1, py: 1.35 }}
                        >
                            Generate PDF
                        </Button>

                        <Button
                            variant="outlined"
                            size="large"
                            onClick={handleStartSession}
                            disabled={loading}
                            sx={{ flex: 1, py: 1.35 }}
                        >
                            Start editable session
                        </Button>
                    </Stack>

                    {error && (
                        <Alert
                            severity="error"
                            sx={{ mt: 2, borderRadius: "12px" }}
                            action={<IconButton size="small" onClick={() => setError("")}><CloseIcon fontSize="small" /></IconButton>}
                        >
                            <AlertTitle>Error</AlertTitle>
                            {error}
                        </Alert>
                    )}
                </Box>

                <Box component={motion.div} variants={fadeUp} sx={{ textAlign: "center", maxWidth: 900 }}>
                    <Typography sx={{ color: "text.secondary", fontSize: "0.9rem", fontWeight: 500, mb: 2 }}>
                        Not sure where to start? Try one of these
                    </Typography>
                    <Stack direction="row" flexWrap="wrap" justifyContent="center" gap={1.5}>
                        {QUICK_PROMPTS.map((item) => (
                            <Chip
                                key={item}
                                label={item}
                                onClick={() => !loading && setPrompt(item)}
                                disabled={loading}
                                sx={{
                                    border: "1px solid rgba(142, 45, 226, 0.14)",
                                    bgcolor: "rgba(255,255,255,0.8)",
                                    color: "#0F0A19",
                                    fontWeight: 450,
                                    borderRadius: "999px",
                                    cursor: loading ? "not-allowed" : "pointer",
                                    transition: "transform 0.2s ease, background 0.2s ease, border-color 0.2s ease",
                                    "&:hover": {
                                        bgcolor: "rgba(242, 240, 255, 1)",
                                        borderColor: "rgba(142, 45, 226, 0.35)",
                                        transform: "translateY(-2px)",
                                    },
                                    px: 1,
                                }}
                            />
                        ))}
                    </Stack>
                </Box>

                <GenerationOverlay
                    open={loading}
                    progress={progress}
                    message={currentMessage || "Formatting your document"}
                />
            </Box>
        </Box>
    );
}
