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
} from "@mui/material";
import { Add, Remove, AutoAwesome, Edit, Language } from "@mui/icons-material";
import { useState } from "react";
import { fontStyle } from "html2canvas/dist/types/css/property-descriptors/font-style";

export default function PromptToDeck() {
    const [count, setCount] = useState(1);
    const [goal, setGoal] = useState("");
    const [tone, setTone] = useState("");

    const quickPrompts = [
        "Creativity at Work",
        "Responsive design principles",
        "Healthy diet",
        "UX UI guidelines",
        "Accessibility best practices",
        "Design system components",
        "Responsive design principles",
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
                }}
            >
                Prompt-to-Deck
            </Typography>

            {/* Subtitle */}
            <Typography
                sx={{
                    color: "rgba(109, 109, 109, 1)",
                    maxWidth: 520,
                    mb: 6,
                    fontSize: { xs: "1rem", md: "1.1rem" },
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
                    maxHeight: {xs:"50%",md:"340px"},
                    backgroundColor: "rgba(251, 250, 255, 1)",
                    borderRadius: 1,
                    boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
                    border: "1px solid rgba(232, 228, 255, 1)",
                    p: { xs: 3, md: 4 },
                    mb: 4,
                }}
            >
                {/* Goal Selector */}
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
                                py: "8px", 
                            },
                        }}
                    >
                        <InputLabel
                            sx={{
                                fontSize: "14px",
                                fontFamily: "Raleway",
                            }}
                        >
                            Select Goal
                        </InputLabel>
                        <Select
                            value={goal}
                            label="Select Goal"
                            onChange={(e) => setGoal(e.target.value)}
                            sx={{
                                backgroundColor: "#fff",
                                height: "44px",
                                fontSize: "14px",
                            }}
                        >
                            <MenuItem value="pitch">Pitch Deck</MenuItem>
                            <MenuItem value="education">Educational Deck</MenuItem>
                            <MenuItem value="marketing">Marketing Presentation</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                {/* Description Field */}
                <TextField
                    fullWidth
                    multiline
                    minRows={4}
                    placeholder="Describe your idea... e.g., 'Pitch for a new mental health app'"
                    variant="outlined"
                    sx={{
                        mb: 1.5,
                        "& .MuiOutlinedInput-notchedOutline": {
                            border: "none",
                        },
                        borderBottom: "1px solid rgba(242, 240, 255, 1)",
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
                        spacing={1.5}>
                        {/* <IconButton>
                            <img
                                src="/images/voice-icon-input.svg"
                                alt="Custom icon"
                                style={{ width: 20, height: 20 }}
                            />
                        </IconButton>
                        <IconButton>
                            <img
                                src="/images/file-icon.svg"
                                alt="Custom icon"
                                style={{ width: 18, height: 18 }}
                            />
                        </IconButton> */}

                        {/* Counter */}
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                overflow: "hidden",
                                width: "100px",
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
                            <IconButton
                                size="small"
                                onClick={() => setCount(Math.max(1, count - 1))}
                            >
                                <Remove />
                            </IconButton>
                            <Typography sx={{ px: 1 }}>{count}</Typography>
                            <IconButton size="small" onClick={() => setCount(count + 1)}>
                                <Add />
                            </IconButton>
                        </Box>

                        {/* Tone Selector */}
                        <FormControl
                            variant="outlined"
                            sx={{
                                display: "flex",
                                width: { xs: "100%", sm: "130px" },
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
                                mb: 4,
                            }}
                        >
                            <InputLabel sx={{
                                fontSize: "14px", fontFamily: "Raleway",
                            }}>Select Tone</InputLabel>
                            <Select
                                value={tone}
                                label="Select Tone"
                                onChange={(e) => setTone(e.target.value)}
                                sx={{
                                    backgroundColor: "#fff",
                                    height: "44px",
                                    fontSize: "14px",
                                }}
                            >
                                <MenuItem value="professional">Professional</MenuItem>
                                <MenuItem value="casual">Casual</MenuItem>
                                <MenuItem value="inspirational">Inspirational</MenuItem>
                            </Select>
                        </FormControl>
                        {/* Visual Style Selector */}
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
                            }}
                        >
                            <InputLabel sx={{
                                fontSize: "14px", fontFamily: "Raleway",
                            }}>Select Visual Style</InputLabel>
                            <Select
                                value={tone}
                                label="Select Visual Style"
                                onChange={(e) => setTone(e.target.value)}
                                sx={{
                                    backgroundColor: "#fff",
                                    height: "44px",
                                    fontSize: "14px",
                                }}
                            >
                                <MenuItem value="professional">Concept Art</MenuItem>
                                <MenuItem value="professional">3D Render / CGI</MenuItem>
                                <MenuItem value="professional">Watercolor Illustration</MenuItem>
                                <MenuItem value="professional">AI Collage / Mixed Media</MenuItem>
                                <MenuItem value="professional">Digital Painting</MenuItem>
                                <MenuItem value="casual">Fantasy / Sci-Fi Style</MenuItem>
                                <MenuItem value="inspirational">Minimal Abstract</MenuItem>
                            </Select>
                        </FormControl>
                    </Stack>

                    {/* Generate Button */}
                    <Button
                        variant="contained"
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
            </Box>


            {/* Quick Prompt Generator */}
            <Box sx={{ textAlign: "center", maxWidth: 800 }}>
                <Typography
                    sx={{
                        fontWeight: 500,
                        mb: 2,
                        color: "#6D6D6D",
                        fontSize: "1rem",
                    }}
                >
                    Quick Prompt Generator:
                </Typography>

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
                            sx={{
                                bgcolor: "rgba(242, 240, 255, 1)",
                                color: "#1A1A1A",
                                fontWeight: 400,
                                borderRadius: "20px",
                                "&:hover": { bgcolor: "rgba(230, 226, 255, 1)" },
                                px: 1.5
                            }}
                        />
                    ))}
                </Stack>
            </Box>
        </Box>
    );
}