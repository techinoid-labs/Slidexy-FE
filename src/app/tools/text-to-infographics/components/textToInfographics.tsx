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
    Alert,
    AlertTitle,
    Backdrop,
} from "@mui/material";
import { AutoAwesome, Close as CloseIcon } from "@mui/icons-material";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTemplateSlides } from "@/app/context/TemplateSlidesContext";
import FileUploadZone from "@/app/components/shared/FileUploadZone";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const viewMode = [
    { value: "landscape", label: "Landscape" },
    { value: "portrait", label: "Portrait" },
];

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

        // Optional user prompt (acts as title/focus hint)
        if (description.trim()) {
            formData.append("prompt", description.trim());
        }

        // View mode
        formData.append("viewMode", orientation.toLowerCase()); // "landscape" or "portrait"

        // File upload if present
        if (selectedFile) {
            formData.append("file", selectedFile);
            setCurrentDetail("Extracting and summarizing uploaded file...");
        }

        // Direct call to the unified V2 endpoint
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

        // Update UI with success
        setCurrentMessage("✅ Infographic created successfully!");
        setCurrentDetail("Redirecting to your design...");
        setProgress(100);
        setInfographicId(infographicId);

        // Small delay for nice UX before redirect
        setTimeout(() => {
            router.push(`/infographic/${infographicId}`);
        }, 800);

    } catch (err: any) {
        console.error("Infographic generation error:", err);

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
        "Creativity at Work",
        "Responsive design principles",
        "Healthy diet",
        "UX UI guidelines",
        "Accessibility best practices",
        "Design system components",
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


                <Box
                    sx={{
                        width: "100%",
                        maxWidth: "926px",
                        bgcolor: "rgba(251, 250, 255, 0.5)",
                        borderRadius: 1,
                        boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
                        border: "1px solid rgba(232, 228, 255, 1)",
                        p: { xs: 3, md: 4 },
                        mb: 4,
                    }}
                >

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "flex-start",
                            mb: 1,
                        }}
                    >
                        <FormControl
                            variant="outlined"
                            sx={{
                                backgroundColor: " rgba(255, 255, 255, 1)",
                                width: "142px",
                                height: "44px",
                                borderRadius: "10px",
                                boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
                                "& .MuiOutlinedInput-notchedOutline": {
                                    border: "none",
                                },
                                "& .MuiSelect-select": {
                                    py: "6px",
                                },
                                gap: 4,
                            }}
                        >
                            {/* <InputLabel
                sx={{
                  fontSize: "16px",
                  fontFamily: "Raleway",
                  top: "-10px",
                }}
              >
                Select Goal
              </InputLabel> */}
                            <Select
                                value={goal}
                                onChange={(e) => setGoal(e.target.value)}
                                disabled={loading}
                                sx={{ fontSize: "16px", backgroundColor: "#fff", height: "44px", color: "rgba(109, 109, 109, 1)", }}
                                MenuProps={{
                                    PaperProps: {
                                        sx: {
                                            mt: 0.5,
                                            borderRadius: "10px",
                                        },
                                    },
                                }}
                            >
                                <MenuItem sx={{ fontSize: "12px", color: "rgba(109, 109, 109, 1)" }} value="Select Goal" hidden>
                                    Select Goal
                                </MenuItem>

                                <MenuItem sx={{ fontSize: "16px", color: "rgba(109, 109, 109, 1)", }} value="pitch">Pitch Deck</MenuItem>
                                <MenuItem sx={{ fontSize: "16px", color: "rgba(109, 109, 109, 1)" }} value="education">Educational</MenuItem>
                                <MenuItem sx={{ fontSize: "16px", color: "rgba(109, 109, 109, 1)" }} value="marketing">Marketing</MenuItem>
                            </Select>

                        </FormControl>
                    </Box>



                    <TextField
                        fullWidth
                        multiline
                        minRows={4}
                        placeholder="Describe your idea..."
                        variant="outlined"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        sx={{
                            mb: 2,
                            "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                            borderBottom: "1px solid rgba(242, 240, 255, 1)",
                        }}
                    />


                    <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems="center" justifyContent="space-between">
                        <Box
                            sx={{
                                display: 'flex',
                                gap: 2,
                            }}
                        >
                            <FileUploadZone
                                selectedFile={selectedFile}
                                onFileSelect={handleFileChange}
                                onFileRemove={removeFile}
                                onError={setError}
                                disabled={loading}
                            />
                            <Stack direction="row" spacing={2} alignItems="center" sx={{ width: { xs: "100%", md: "auto" } }}>
                                <FormControl
                                    variant="outlined"
                                    sx={{
                                        display: "flex",
                                        width: { xs: "100%", sm: "193px" },
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
                                    }}>

                                    {/* <InputLabel>Select Orientation</InputLabel> */}
                                    <Select value={orientation} onChange={(e) => setOrientation(e.target.value)} disabled={loading}
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
                        </Box>
                        <Button
                            variant="contained"
                            onClick={handleSubmit}
                            disabled={loading}
                            startIcon={<AutoAwesome />}
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
                        >
                            {loading ? "Generating..." : "Generate"}
                        </Button>

                        {/* {loading && (
                            <Button color="error" onClick={cancelGeneration}>
                                Cancel
                            </Button>
                        )} */}
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

                {/* {loading && (
                    <Box
                        sx={{
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
                        <Typography variant="body2" color="text.secondary">
                            Progress: {Math.round(progress)}%
                        </Typography>
                    </Box>
                )} */}
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
                                {currentMessage}...
                            </Typography>
                        </Box>
                    </Backdrop>
                )}

                <Box sx={{ textAlign: "center", maxWidth: 800, mt: 4 }}>
                    <Stack direction="row" flexWrap="wrap" justifyContent="center" gap={2}>
                        {quickPrompts.map((prompt, i) => (
                            <Chip
                                key={i}
                                label={prompt}
                                onClick={() => setDescription(prompt)}
                                sx={{
                                    border: "1px solid rgba(246, 246, 246, 1)",
                                    bgcolor: "rgba(248, 248, 248, 0.14)",
                                    "&:hover": { bgcolor: "rgba(230, 226, 255, 1)" }
                                }}
                            />
                        ))}
                    </Stack>
                </Box>
            </Box>
        </Box>
    );
}
