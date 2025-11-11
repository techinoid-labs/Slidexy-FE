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
} from "@mui/material";
import { AutoAwesome, Close as CloseIcon } from "@mui/icons-material";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTemplateSlides } from "@/app/context/TemplateSlidesContext";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const viewMode = [
    { value: "landscape", label: "Landscape" },
    { value: "portrait", label: "Portrait" },
];

export default function TextToInfographics() {
    const { setInfographicId } = useTemplateSlides();
    const [goal, setGoal] = useState("pitch");
    const [orientation, setOrientation] = useState("landscape");
    const [description, setDescription] = useState("");

    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentMessage, setCurrentMessage] = useState("");
    const [currentDetail, setCurrentDetail] = useState("");
    const [error, setError] = useState("");

    const router = useRouter();
    const abortControllerRef = useRef<AbortController | null>(null);

    const handleSubmit = async () => {
        if (!description.trim()) {
            setError("Please enter a description for the infographic.");
            return;
        }

        setLoading(true);
        setError("");
        setProgress(0);
        setCurrentMessage("Starting AI generation...");
        setCurrentDetail("");

        abortControllerRef.current = new AbortController();
        const payload = {
            prompt: description,
            viewMode: orientation,
            useReferences: true,
        };

        try {
            const res = await fetch(`${API_BASE_URL}/generate-poster-template`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "text/event-stream",
                },
                body: JSON.stringify(payload),
                signal: abortControllerRef.current.signal,
            });

            if (!res.ok) {
                const msg = await res.text();
                throw new Error(msg || "Failed to start infographic generation");
            }

            if (!res.body) throw new Error("No response body received.");

            const reader = res.body.getReader();
            const decoder = new TextDecoder("utf-8");
            let done = false;

            while (!done) {
                const { value, done: readerDone } = await reader.read();
                done = readerDone;
                if (value) {
                    const chunk = decoder.decode(value, { stream: true });
                    const lines = chunk.split("\n").filter((line) => line.trim() !== "" && !line.startsWith(":"));

                    for (const line of lines) {
                        if (line === "data: [DONE]") {
                            done = true;
                            break;
                        }

                        if (line.startsWith("data: ")) {
                            try {
                                const event = JSON.parse(line.replace("data: ", ""));
                                if (event.error) {
                                    setError(event.error);
                                    setLoading(false);
                                    return;
                                }

                                if (event.percent) setProgress(event.percent);
                                if (event.message) setCurrentMessage(event.message);
                                if (event.detail) setCurrentDetail(event.detail);
                            } catch {
                                console.warn("Invalid SSE event:", line);
                            }
                        }
                    }
                }
            }

            // ✅ Save only once after full generation is complete
            setCurrentMessage("Finalizing infographic...");
            setCurrentDetail("Saving your generated infographic...");

            const saveRes = await fetch(`${API_BASE_URL}/api/dynamicInfographic`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: description, viewMode: orientation }),
            });

            if (!saveRes.ok) throw new Error(`Failed to save infographic (${saveRes.status})`);

            const saveData = await saveRes.json();

            if (saveData?.success && saveData?.infographic?._id) {
                setCurrentMessage("✅ Infographic successfully created!");
                setCurrentDetail("Redirecting to your infographic...");
                setInfographicId(saveData.infographic._id);
                router.push(`/infographic/${saveData.infographic._id}`);
            } else {
                throw new Error("Invalid response from save endpoint");
            }
        } catch (err: any) {
            console.error("Infographic generation error:", err);
            if (err.name === "AbortError") {
                setError("Infographic generation was cancelled.");
            } else {
                setError(err.message || "Something went wrong during generation.");
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
        <Box
            sx={{
                width: "100%",
                minHeight: "100vh",
                bgcolor: "#fff",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                py: { xs: 8, md: 10 },
                px: { xs: 2, md: 6 },
            }}
        >
            <Typography variant="h2" sx={{ fontWeight: 700, mb: 1, color: "rgba(26, 26, 26, 1)" }}>
                Text-to-Infographics
            </Typography>

            <Typography sx={{ color: "rgba(109, 109, 109, 1)", maxWidth: 520, mb: 6 }}>
                Elevate your presentations with our AI-powered tool—create polished, professional slides in just seconds.
            </Typography>

            <Box
                sx={{
                    width: "100%",
                    maxWidth: "926px",
                    bgcolor: "rgba(251, 250, 255, 1)",
                    borderRadius: 1,
                    boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
                    border: "1px solid rgba(232, 228, 255, 1)",
                    p: { xs: 3, md: 4 },
                    mb: 4,
                }}
            >
                <FormControl
                    sx={{
                        mb: 2,
                        width: "142px",
                        backgroundColor: "white",
                        "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                    }}
                >
                    <InputLabel>Select Goal</InputLabel>
                    <Select value={goal} onChange={(e) => setGoal(e.target.value)} disabled={loading}>
                        <MenuItem value="pitch">Pitch Deck</MenuItem>
                        <MenuItem value="education">Educational Deck</MenuItem>
                        <MenuItem value="marketing">Marketing Presentation</MenuItem>
                    </Select>
                </FormControl>

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

                <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems="center">
                    <FormControl
                        variant="outlined"
                        sx={{
                            display: "flex",
                            width: { xs: "100%", sm: "231px" },
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
                        }}>
                        <InputLabel>Select Orientation</InputLabel>
                        <Select value={orientation} onChange={(e) => setOrientation(e.target.value)} disabled={loading}>
                            {viewMode.map((v) => (
                                <MenuItem key={v.value} value={v.value}>
                                    {v.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

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

                    {loading && (
                        <Button color="error" onClick={cancelGeneration}>
                            Cancel
                        </Button>
                    )}
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
            )}

            <Box sx={{ textAlign: "center", maxWidth: 800, mt: 4 }}>
                <Typography sx={{ fontWeight: 500, mb: 2, color: "#6D6D6D" }}>
                    Quick Prompt Generator:
                </Typography>
                <Stack direction="row" flexWrap="wrap" justifyContent="center" gap={2}>
                    {quickPrompts.map((prompt, i) => (
                        <Chip
                            key={i}
                            label={prompt}
                            onClick={() => setDescription(prompt)}
                            sx={{
                                bgcolor: "rgba(242, 240, 255, 1)",
                                "&:hover": { bgcolor: "rgba(230, 226, 255, 1)" },
                            }}
                        />
                    ))}
                </Stack>
            </Box>
        </Box>
    );
}
