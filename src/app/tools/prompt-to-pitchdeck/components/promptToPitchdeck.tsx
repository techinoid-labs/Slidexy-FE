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
    IconButton,
    Chip,
    Stack,
    LinearProgress,
    Alert,
    AlertTitle,
    Backdrop,
} from "@mui/material";
import {
    Add,
    Remove,
    AutoAwesome,
    Close as CloseIcon,
} from "@mui/icons-material";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSlides } from "@/app/context/SlidesContext";
import { useTemplateSlides } from "@/app/context/TemplateSlidesContext";
import { useUser } from "@/app/context/AuthContext";
import { usePitch } from "@/app/context/PitchContext";
import FileUploadZone from "@/app/components/shared/FileUploadZone";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const TEXT_ART_STYLES = [
    { value: "professional", label: "Professional" },
    { value: "modern", label: "Modern" },
    { value: "minimal", label: "Minimal" }
];

const quickPrompts = [
    "Creativity at Work",
    "Responsive design principles",
    "Healthy diet",
    "UX UI guidelines",
    "Accessibility best practices",
    "Design system components",
    "Responsive design principles",
];

export default function PromptToPitchdeck() {
    const { setPitch } = usePitch();
    const [count, setCount] = useState(7);
    const [designGuidelines, setDesignGuidelines] = useState("");
    const [visualStyle, setVisualStyle] = useState("Choose Visual Art Style");
    const [description, setDescription] = useState("");

    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentMessage, setCurrentMessage] = useState("");
    const [currentDetail, setCurrentDetail] = useState("");
    const [error, setError] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const router = useRouter();
    const { setSlides } = useSlides();
    const { setPresentationId } = useTemplateSlides();
    const { user } = useUser();

    const abortControllerRef = useRef<AbortController | null>(null);
    const handleFileChange = (file: File) => {
        setSelectedFile(file);
        setError("");
    };

    const handleSubmit = async () => {
        // Basic frontend validation
        if (!description.trim()) {
            setError("Please describe your idea/topic");
            return;
        }

        if (visualStyle === "Choose Visual Art Style") {
            setError("Please select a visual style");
            return;
        }

        setError("");
        setLoading(true);
        setProgress(0);
        setCurrentMessage("Generating pitch deck");

        abortControllerRef.current = new AbortController();

        try {
            const payload = {
                topic: description,                 // maps to backend "topic"
                slideCount: count,                  // backend expects 7–10
                theme: visualStyle,                 // must match availableThemes()
                designGuidelines: designGuidelines,
                customSystemPrompt: "",
                slideTypes: null,
            };

            const response = await fetch(
                `${API_BASE_URL}/api/generate`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                    signal: abortControllerRef.current.signal,
                }
            );

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || "Failed to generate pitch deck");
            }

            const result = await response.json();

            if (!result.success) {
                throw new Error("Pitch deck generation failed");
            }

            setPitch(result);

            const pitchId = result.id || result._id;
            if (pitchId) {
                router.push(`/pitch?id=${pitchId}`);
            } else {
                router.push("/pitch");
            }
        } catch (err: any) {
            if (err.name !== "AbortError") {
                setError(err.message || "Something went wrong");
            }
        } finally {
            setLoading(false);
            setCurrentMessage("");
            setProgress(0);
        }
    };

    const removeFile = () => {
        setSelectedFile(null);
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
                    justifyContent: "flex-start",
                    py: { xs: 8, md: 10 },
                    px: { xs: 2, md: 6 },
                    textAlign: "center",
                }}
            >
                {/* Title */}
                <Typography
                    variant="h2"
                    sx={{
                        fontWeight: 700,
                        mb: 1,
                        color: "rgba(26, 26, 26, 1)",
                        fontSize: { xs: "16px", md: "60px" },
                    }}
                >
                    Prompt-to-Pitchdeck
                </Typography>

                {/* Subtitle */}
                <Typography
                    sx={{
                        color: "rgba(109, 109, 109, 1)",
                        maxWidth: 520,
                        mb: 6,
                        fontSize: { xs: "1rem", md: "18px" },
                    }}
                >
                    Elevate your presentations with our AI-powered tool—create polished,
                    professional slides in just seconds.
                </Typography>

                {/* Input Section */}
                <Box
                    sx={{
                        width: "100%",
                        maxWidth: "926px",
                        maxHeight: { xs: "50%", md: "340px" },
                        bgcolor: "rgba(251, 250, 255, 0.5)",
                        borderRadius: 1,
                        boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
                        border: "1px solid rgba(232, 228, 255, 1)",
                        p: { xs: 3, md: 4 },
                        mb: 4,
                    }}
                >

                    {/* Description Field */}
                    <TextField
                        fullWidth
                        multiline
                        minRows={4}
                        placeholder="Describe your idea... e.g., 'Pitch for a new mental health app'"
                        variant="outlined"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        sx={{
                            mb: 1.5,
                            "& .MuiOutlinedInput-notchedOutline": {
                                border: "none",
                            },
                            borderBottom: "1px solid rgba(242, 240, 255, 0.5)",
                            "& .MuiInputBase-input": {
                                fontSize: "15px",
                                lineHeight: 1.6,
                            },
                        }}
                    />

                    {/* Control Row */}
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
                        <Stack
                            direction={{ xs: "column", sm: "row" }}
                            alignItems={{ xs: "stretch", sm: "center" }}
                            sx={{
                                flex: 1,
                            }}
                            spacing={1.5}
                        >
                            {/* <FileUploadZone
                                selectedFile={selectedFile}
                                onFileSelect={handleFileChange}
                                onFileRemove={removeFile}
                                onError={setError}
                                disabled={loading}
                            /> */}


                            {/* Visual Style Selector */}
                            <FormControl
                                variant="outlined"
                                sx={{
                                    display: "flex",
                                    width: { xs: "100%", sm: "231px" },
                                    height: "44px",
                                    borderRadius: "8px",
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
                                <Select
                                    value={visualStyle}
                                    onChange={(e) => setVisualStyle(e.target.value)}
                                    displayEmpty
                                    sx={{
                                        fontSize: "16px",
                                        backgroundColor: "#fff",
                                        height: "44px",
                                        color: "rgba(109, 109, 109, 1)",
                                    }}
                                    MenuProps={{
                                        PaperProps: {
                                            sx: {
                                                mt: 0.5,
                                                borderRadius: "10px",
                                                maxHeight: 300,
                                            },
                                        },
                                    }}
                                >
                                    <MenuItem value="Choose Visual Art Style" hidden>
                                        Choose Visual Art Style
                                    </MenuItem>

                                    {TEXT_ART_STYLES.map((style) => (
                                        <MenuItem
                                            key={style.value}
                                            value={style.value}
                                            sx={{ fontSize: "16px", color: "rgba(61,61,61,1)" }}
                                        >
                                            {style.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                        </Stack>

                        {/* Generate Button */}
                        <Button
                            variant="contained"
                            disabled={loading}
                            onClick={handleSubmit}
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
                                <IconButton
                                    size="small"
                                    onClick={() => setError("")}
                                    color="inherit"
                                >
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                            }
                        >
                            <AlertTitle>Error</AlertTitle>
                            {error}
                        </Alert>
                    )}
                </Box>
                <Box
                    sx={{
                        width: "100%",
                        maxWidth: "926px",
                        maxHeight: { xs: "25%", md: "120px" },
                        bgcolor: "rgba(251, 250, 255, 0.5)",
                        borderRadius: 1,
                        boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
                        border: "1px solid rgba(232, 228, 255, 1)",
                        pl: { xs: 3, md: 4 },
                        mb: 4,
                    }}
                >
                    {/* Design Guidelines Field */}
                    <TextField
                        fullWidth
                        multiline
                        minRows={3}
                        placeholder="Design guidelines..."
                        variant="outlined"
                        value={designGuidelines}
                        onChange={(e) => setDesignGuidelines(e.target.value)}
                        sx={{
                            mb: 2,
                            "& .MuiOutlinedInput-notchedOutline": {
                                border: "none",
                            },
                            borderBottom: "1px solid rgba(242, 240, 255, 0.5)",
                            "& .MuiInputBase-input": {
                                fontSize: "14px",
                                lineHeight: 1.6,
                                color: "rgba(61,61,61,1)",
                            },
                        }}
                    />
                </Box>

                {/* ---------- PROGRESS */}

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
                                {currentMessage}.....
                            </Typography>
                        </Box>
                    </Backdrop>
                )}

                <Box sx={{ textAlign: "center", maxWidth: 800 }}>

                    <Stack
                        display="flex"
                        flexDirection={{ xs: "column", md: "row" }}
                        flexWrap="wrap"
                        justifyContent="center"
                        gap={2.2}
                        alignItems="center"
                    >
                        {quickPrompts.map((prompt, index) => (
                            <Chip
                                key={index}
                                label={prompt}
                                onClick={() => setDescription(prompt)}
                                sx={{
                                    border: "1px solid rgba(246, 246, 246, 1)",
                                    bgcolor: "rgba(248, 248, 248, 0.14)",
                                    color: "#1A1A1A",
                                    fontWeight: 400,
                                    borderRadius: "20px",
                                    "&:hover": { bgcolor: "rgba(230, 226, 255, 1)" },
                                    px: 1.5,
                                }}
                            />
                        ))}
                    </Stack>
                </Box>
            </Box>
        </Box>
    );
}
