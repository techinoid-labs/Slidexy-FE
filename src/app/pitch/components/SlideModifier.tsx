import React from "react";
import {
    Box,
    Typography,
    Button,
    TextField,
    Chip,
    Stack,
} from "@mui/material";
import { AutoAwesome } from "@mui/icons-material";

interface SlideModifierProps {
    editPrompt: string;
    regenerating: boolean;
    setEditPrompt: (value: string) => void;
    onRegenerate: () => void;
}

const SlideModifier: React.FC<SlideModifierProps> = ({
    editPrompt,
    regenerating,
    setEditPrompt,
    onRegenerate,
}) => {
    const suggestions = [
        "Change to 2 columns",
        "Make colors professional",
        "Summarize text",
        "Add data chart",
    ];

    return (
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
            {/* Description Field */}
            <TextField
                fullWidth
                multiline
                minRows={4}
                placeholder="What would you like to change? (e.g. 'Add a section about our competitive advantage')"
                variant="outlined"
                value={editPrompt}
                onChange={(e) => setEditPrompt(e.target.value)}
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
                    justifyContent: "space-between",
                    alignItems: { xs: "stretch", md: "center" },
                    gap: 2,
                    width: "100%",
                }}
            >
                <Stack
                    direction="row"
                    flexWrap="wrap"
                    gap={1.5}
                    sx={{ flex: 1 }}
                >
                    {suggestions.map((suggestion) => (
                        <Chip
                            key={suggestion}
                            label={suggestion}
                            onClick={() => setEditPrompt(suggestion)}
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

                <Button
                    variant="contained"
                    disabled={regenerating || !editPrompt}
                    onClick={onRegenerate}
                    sx={{
                        backgroundColor: "#6C2BD9",
                        color: "#fff",
                        borderRadius: "32px",
                        width: { xs: "100%", sm: "auto" },
                        height: "44px",
                        px: 4,
                        py: 1.2,
                        fontWeight: 600,
                        boxShadow: "0 3px 10px rgba(108,43,217,0.3)",
                        textTransform: "none",
                        "&:hover": { backgroundColor: "#5B21B6" },
                    }}
                    startIcon={regenerating ? null : <AutoAwesome />}
                >
                    {regenerating ? "Processing..." : "Regenerate"}
                </Button>
            </Box>
        </Box>
    );
};

export default SlideModifier;
