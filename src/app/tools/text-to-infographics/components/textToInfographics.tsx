"use client";

import {
    Box,
    Typography,
    Button,
    TextField,
    Select,
    MenuItem,
    FormControl,
    IconButton,
    Chip,
    Stack,
    Alert,
    AlertTitle,
} from "@mui/material";
import GenerationOverlay from "@/app/components/shared/GenerationOverlay";
import { AutoAwesome, Close as CloseIcon } from "@mui/icons-material";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useTemplateSlides } from "@/app/context/TemplateSlidesContext";
import FileUploadZone from "@/app/components/shared/FileUploadZone";
import AnimatedOrb from "@/app/components/shared/AnimatedOrb";
import { fadeUp, staggerContainer } from "@/lib/motion";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const viewMode = [
    { value: "landscape", label: "Landscape" },
    { value: "portrait", label: "Portrait" },
];

const controlSx = {
    height: 44,
    borderRadius: "12px",
    bgcolor: "rgba(248, 246, 255, 1)",
    border: "1px solid rgba(142, 45, 226, 0.1)",
    "& .MuiOutlinedInput-notchedOutline": { border: "none" },
    "& .MuiSelect-select": { py: "10px", fontSize: "0.9rem" },
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
    "&:hover": { borderColor: "rgba(142, 45, 226, 0.3)" },
    "&.Mui-focused, &:focus-within": {
        borderColor: "#8E2DE2",
        boxShadow: "0 0 0 3px rgba(142, 45, 226, 0.1)",
    },
};

export default function TextToInfographics() {
    const { setInfographicId } = useTemplateSlides();
    const [goal, setGoal] = useState("Select Goal");
    const [orientation, setOrientation] = useState("Choose Orientation");
    const [description, setDescription] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentMessage, setCurrentMessage] = useState("");
    const [currentDetail, setCurrentDetail] = useState("");
    const [error, setError] = useState("");

    const router = useRouter();
    const abortControllerRef = useRef<AbortController | null>(null);

    const handleFileChange = (file: File) => {
        setSelectedFile(file);
        setError("");
    };

    const removeFile = () => {
        setSelectedFile(null);
    };

    const handleSubmit = async () => {
        if (!description.trim() && !selectedFile) {
            setError("Please enter a description or upload a file for the infographic.");
            return;
        }
        if (orientation === "Choose Orientation") {
            setError("Please select the orientation");
            return;
        }

        setLoading(true);
        setError("");
        setProgress(0);
        setCurrentMessage("Generating your infographic...");
        setCurrentDetail("Processing content and designing layout...");

        abortControllerRef.current = new AbortController();

        try {
            const formData = new FormData();

            if (description.trim()) {
                formData.append("prompt", description.trim());
            }

            formData.append("viewMode", orientation.toLowerCase());

            if (selectedFile) {
                formData.append("file", selectedFile);
                setCurrentDetail("Extracting and summarizing uploaded file...");
            }

            const res = await fetch(`${API_BASE_URL}/api/infographic`, {
                method: "POST",
                body: formData,
                signal: abortControllerRef.current.signal,
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || "Failed to generate infographic");
            }

            const data = await res.json();

            if (!data.success || !data.infographic?._id) {
                throw new Error("Invalid response: Infographic not created properly");
            }

            const infographicId = data.infographic._id;

            setCurrentMessage("Infographic created!");
            setCurrentDetail("Redirecting to your design...");
            setProgress(100);
            setInfographicId(infographicId);

            setTimeout(() => {
                router.push(`/infographic/${infographicId}`);
            }, 800);

        } catch (err: any) {
            if (err.name === "AbortError") {
                setError("Generation was cancelled.");
            } else {
                setError(err.message || "Failed to generate infographic. Please try again.");
            }
        } finally {
            setLoading(false);
            abortControllerRef.current = null;
        }
    };

    const cancelGeneration = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
        setLoading(false);
        setProgress(0);
        setCurrentMessage("");
        setCurrentDetail("");
    };

    const quickPrompts = [
        "Q3 growth metrics for the team",
        "5 stats on remote work productivity",
        "Coffee vs. tea health comparison",
        "Steps in our onboarding process",
        "Climate impact of everyday choices",
        "Social media usage by age group",
    ];

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
                        maxWidth: 920,
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
                    <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 1.5 }}>
                        <FormControl variant="outlined" sx={{ ...controlSx, minWidth: 150 }}>
                            <Select
                                value={goal}
                                onChange={(e) => setGoal(e.target.value)}
                                disabled={loading}
                                sx={{ height: 44, color: "#5B5568" }}
                            >
                                <MenuItem value="Select Goal" hidden>
                                    Select Goal
                                </MenuItem>
                                <MenuItem value="pitch">Pitch Deck</MenuItem>
                                <MenuItem value="education">Educational</MenuItem>
                                <MenuItem value="marketing">Marketing</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>

                    <TextField
                        fullWidth
                        multiline
                        minRows={4}
                        placeholder="Paste your data or describe what to visualize…"
                        variant="outlined"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        sx={{
                            mb: 2,
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

                    <Stack
                        direction={{ xs: "column", md: "row" }}
                        spacing={2}
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ width: { xs: "100%", md: "auto" } }}>
                            <FileUploadZone
                                selectedFile={selectedFile}
                                onFileSelect={handleFileChange}
                                onFileRemove={removeFile}
                                onError={setError}
                                disabled={loading}
                            />
                            <FormControl variant="outlined" sx={{ ...controlSx, minWidth: { xs: "100%", sm: 193 } }}>
                                <Select
                                    value={orientation}
                                    onChange={(e) => setOrientation(e.target.value)}
                                    disabled={loading}
                                    displayEmpty
                                    sx={{ height: 44, color: "#5B5568" }}
                                >
                                    <MenuItem value="Choose Orientation" hidden>
                                        Choose Orientation
                                    </MenuItem>
                                    {viewMode.map((v) => (
                                        <MenuItem key={v.value} value={v.value}>
                                            {v.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Stack>

                        <Button
                            variant="contained"
                            size="large"
                            onClick={handleSubmit}
                            disabled={loading}
                            startIcon={<AutoAwesome />}
                            sx={{
                                minWidth: { xs: "100%", sm: 150 },
                                py: 1.35,
                                alignSelf: { xs: "stretch", md: "center" },
                            }}
                        >
                            {loading ? "Generating…" : "Generate"}
                        </Button>
                    </Stack>

                    {error && (
                        <Alert
                            severity="error"
                            sx={{ mt: 2, borderRadius: "12px" }}
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

                <GenerationOverlay
                    open={loading}
                    progress={progress}
                    message={currentMessage || "Designing your infographic"}
                    detail={currentDetail}
                    onCancel={cancelGeneration}
                />

                <Box component={motion.div} variants={fadeUp} sx={{ textAlign: "center", maxWidth: 820, mt: 1 }}>
                    <Typography sx={{ color: "text.secondary", fontSize: "0.9rem", fontWeight: 500, mb: 2 }}>
                        Not sure what to paste? Try one of these
                    </Typography>
                    <Stack direction="row" flexWrap="wrap" justifyContent="center" gap={1.5}>
                        {quickPrompts.map((prompt, i) => (
                            <Chip
                                key={i}
                                label={prompt}
                                onClick={() => setDescription(prompt)}
                                sx={{
                                    border: "1px solid rgba(142, 45, 226, 0.14)",
                                    bgcolor: "rgba(255,255,255,0.8)",
                                    color: "#0F0A19",
                                    fontWeight: 450,
                                    borderRadius: "999px",
                                    cursor: "pointer",
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
            </Box>
        </Box>
    );
}
