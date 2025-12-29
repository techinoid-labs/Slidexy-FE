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
    Backdrop,
} from "@mui/material";
import { AutoAwesome, Close as CloseIcon } from "@mui/icons-material";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

const API_BASE_URL = process.env.NEXT_PUBLIC_LATEX_API_BASE_URL;

const ENGINES = ["pdflatex", "xelatex", "lualatex"];

const QUICK_PROMPTS = [
    "Professional resume for a software engineer",
    "One-page cover letter for data scientist role",
    "Academic research paper on machine learning",
    "Business proposal for startup funding",
    "Technical report on blockchain technology",
    "Festive Christmas card with greetings",
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
        const startTime = Date.now();

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
                context: context.trim() || null,
                output_filename: outputFilename.trim() || null,
                latex_engine: latexEngine || null,
                save_tex: saveTex,
                retry_on_error: retryOnError,
            };

            const response = await fetch(`${API_BASE_URL}/generate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
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
                document_name: outputFilename.trim() || null,
                context: context.trim() || null,
                latex_engine: latexEngine || null,
            };

            const response = await fetch(`${API_BASE_URL}/edit/sessions`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
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
        <Box sx={{ position: "relative", width: "100%", minHeight: "100vh" }}>
            <Box sx={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", overflow: "hidden", zIndex: -1 }}>
                <video autoPlay muted loop playsInline style={{ width: "100%", height: "100%", objectFit: "cover", opacity: "0.1" }}>
                    <source src="/services-background.mp4" type="video/mp4" />
                </video>
            </Box>

            <Box sx={{ width: "100%", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", py: { xs: 8, md: 10 }, px: { xs: 2, md: 6 } }}>
                <Typography variant="h2" sx={{ fontWeight: 700, mb: 1, color: "rgba(26, 26, 26, 1)", fontSize: "60px" }}>
                    Prompt to PDF
                </Typography>

                <Typography sx={{ color: "rgba(109, 109, 109, 1)", maxWidth: 680, mb: 6, fontSize: { xs: "16px", md: "18px" }, textAlign: "center" }}>
                    Generate beautiful LaTeX documents using Gemini AI — resumes, reports, letters, cards, and more.
                </Typography>

                <Box sx={{ width: "100%", maxWidth: "926px", bgcolor: "rgba(251, 250, 255, 0.5)", borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.06)", border: "1px solid rgba(232, 228, 255, 1)", p: { xs: 3, md: 5 }, mb: 4 }}>
                    <TextField
                        fullWidth
                        multiline
                        minRows={6}
                        placeholder="e.g., Create a professional resume for a Python developer with 5 years experience..."
                        variant="outlined"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        disabled={loading}
                        sx={{ mb: 3, "& .MuiOutlinedInput-notchedOutline": { border: "none" }, borderBottom: "1px solid rgba(242, 240, 255, 1)" }}
                    />

                    <Stack spacing={2} direction={{ xs: "column", md: "row" }} mb={3}>
                        <TextField
                            fullWidth
                            label="Additional Context (Optional)"
                            multiline
                            rows={3}
                            placeholder="e.g., Use moderncv template, one page, include GitHub icons..."
                            value={context}
                            onChange={(e) => setContext(e.target.value)}
                            disabled={loading}
                        />

                        <Box sx={{ width: { xs: "100%", md: "50%" } }}>
                            <TextField
                                fullWidth
                                 label="Output Filename (Optional)"
                                placeholder="e.g., my_resume_2025"
                                value={outputFilename}
                                onChange={(e) => setOutputFilename(e.target.value)}
                                disabled={loading}
                                sx={{ mb: 2 }}
                            />

                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel>LaTeX Engine</InputLabel>
                                <Select value={latexEngine} onChange={(e) => setLatexEngine(e.target.value)} disabled={loading}>
                                    <MenuItem value="">Default (pdflatex)</MenuItem>
                                    {ENGINES.map((eng) => (
                                        <MenuItem key={eng} value={eng}>{eng}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <Stack direction="row" spacing={3}>
                                <label className="hint">
                                    <input type="checkbox" checked={saveTex} onChange={(e) => setSaveTex(e.target.checked)} disabled={loading} />
                                    Save .tex file
                                </label>
                                <label className="hint">
                                    <input type="checkbox" checked={retryOnError} onChange={(e) => setRetryOnError(e.target.checked)} disabled={loading} />
                                    Retry on error
                                </label>
                            </Stack>
                        </Box>
                    </Stack>

                    <Stack direction="row" spacing={2} justifyContent="center">
                        <Button
                            variant="contained"
                            onClick={handleOneTimeGenerate}
                            disabled={loading}
                            startIcon={<AutoAwesome />}
                            sx={{ flex: 1, height: 56, borderRadius: "32px", bgcolor: "#6C2BD9", "&:hover": { bgcolor: "#5B21B6" } }}
                        >
                            Generate PDF (One-Time)
                        </Button>

                        <Button
                            variant="outlined"
                            onClick={handleStartSession}
                            disabled={loading}
                            sx={{ flex: 1, height: 56, borderRadius: "32px", border: "2px solid #6C2BD9", color: "#6C2BD9", "&:hover": { bgcolor: "rgba(108,43,217,0.05)" } }}
                        >
                            Start Editable Session
                        </Button>
                    </Stack>

                    {error && (
                        <Alert severity="error" sx={{ mt: 2 }} action={<IconButton size="small" onClick={() => setError("")}><CloseIcon /></IconButton>}>
                            <AlertTitle>Error</AlertTitle>
                            {error}
                        </Alert>
                    )}
                </Box>

                <Box sx={{ textAlign: "center", maxWidth: 900, mt: 4 }}>
                    <Typography variant="subtitle1" sx={{ mb: 2, color: "rgba(109, 109, 109, 1)" }}>
                        Quick Prompts
                    </Typography>
                    <Stack direction="row" flexWrap="wrap" justifyContent="center" gap={2}>
                        {QUICK_PROMPTS.map((item) => (
                            <Chip
                                key={item}
                                label={item}
                                onClick={() => !loading && setPrompt(item)}
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

                {loading && (
                    <Backdrop open={loading} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <img src="/Loader.gif" alt="Generating..." style={{ width: 470, height: 160 }} />
                            <Typography sx={{ fontFamily: "Raleway", fontSize: "24px", fontWeight: 700, color: "#fff", mt: 1 }}>
                                {currentMessage}
                            </Typography>
                        </Box>
                    </Backdrop>
                )}
            </Box>
        </Box>
    );
}