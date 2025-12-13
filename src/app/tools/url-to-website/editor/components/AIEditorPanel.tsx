"use client";
import React, { useState, useRef, useEffect } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    Stack,
    CircularProgress,
    Chip,
    IconButton
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';

interface ChatMessage {
    role: 'user' | 'model';
    content: string;
}

interface AIEditorPanelProps {
    history: ChatMessage[];
    isLoading: boolean;
    clickedElementId: string | null;
    onClearSelection: () => void;
    onSubmit: (prompt: string, image?: File) => void;
    selectionMode: boolean;
    onToggleSelection: () => void;
}

export default function AIEditorPanel({
    history,
    isLoading,
    clickedElementId,
    onClearSelection,
    onSubmit,
    selectionMode,
    onToggleSelection
}: AIEditorPanelProps) {
    // Inside component function
    const [prompt, setPrompt] = useState("");
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [history]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedImage(e.target.files[0]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim() && !selectedImage) return;

        // Pass optional image to onSubmit. 
        // Note: Props interface defines: onSubmit: (prompt: string, image?: File) => void;
        if (selectedImage) {
            onSubmit(prompt, selectedImage);
        } else {
            onSubmit(prompt);
        }

        setPrompt("");
        setSelectedImage(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const [minimized, setMinimized] = useState(false);

    if (minimized) {
        return (
            <Paper
                elevation={3}
                onClick={() => setMinimized(false)}
                sx={{
                    position: 'fixed',
                    bottom: 24,
                    right: 24,
                    width: 60,
                    height: 60,
                    borderRadius: '30px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1300,
                    bgcolor: '#6C2BD9',
                    color: '#fff',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 12px rgba(108, 43, 217, 0.4)',
                    '&:hover': {
                        transform: 'scale(1.05)',
                        bgcolor: '#5B21B6'
                    }
                }}
            >
                <AutoFixHighIcon />
            </Paper>
        );
    }

    return (
        <Paper
            elevation={3}
            sx={{
                position: 'fixed',
                bottom: 24,
                right: 24,
                width: 380,
                height: 500,
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '16px',
                overflow: 'hidden',
                zIndex: 1300,
                bgcolor: '#fff',
                border: '1px solid rgba(0,0,0,0.08)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                transition: 'all 0.3s ease'
            }}
        >
            {/* Header */}
            <Box sx={{ p: 2, bgcolor: '#6C2BD9', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AutoFixHighIcon />
                    <Typography variant="subtitle1" fontWeight={600}>AI Editor</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    {/* Selection Toggle */}
                    <IconButton
                        size="small"
                        onClick={onToggleSelection}
                        sx={{
                            color: selectionMode ? '#fff' : 'rgba(255,255,255,0.6)',
                            bgcolor: selectionMode ? 'rgba(255,255,255,0.2)' : 'transparent',
                            border: selectionMode ? '1px solid rgba(255,255,255,0.5)' : '1px solid transparent',
                            '&:hover': { color: '#fff', bgcolor: 'rgba(255,255,255,0.1)' }
                        }}
                        title={selectionMode ? "Disable Click-to-Edit" : "Enable Click-to-Edit"}
                    >
                        <TouchAppIcon fontSize="small" />
                    </IconButton>

                    <IconButton size="small" onClick={() => setMinimized(true)} sx={{ color: 'rgba(255,255,255,0.8)', '&:hover': { color: '#fff', bgcolor: 'rgba(255,255,255,0.1)' } }}>
                        <CloseIcon />
                    </IconButton>
                </Box>
            </Box>

            {/* Chat History */}
            <Box sx={{ flex: 1, p: 2, overflowY: 'auto', bgcolor: '#F9FAFB' }}>
                {history.length === 0 && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4, opacity: 0.6 }}>
                        <AutoFixHighIcon sx={{ fontSize: 40, mb: 1, color: '#6C2BD9' }} />
                        <Typography variant="body2" textAlign="center">
                            Hello! Select an element to edit <br /> or just ask me to change something.
                        </Typography>
                    </Box>
                )}

                <Stack spacing={2}>
                    {history.map((msg, i) => (
                        <Box
                            key={i}
                            sx={{
                                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                maxWidth: '85%'
                            }}
                        >
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 1.5,
                                    borderRadius: 2,
                                    bgcolor: msg.role === 'user' ? '#6C2BD9' : '#fff',
                                    color: msg.role === 'user' ? '#fff' : '#1F2937',
                                    border: msg.role === 'user' ? 'none' : '1px solid #E5E7EB',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                                }}
                            >
                                <Typography variant="body2">{msg.content}</Typography>
                            </Paper>
                        </Box>
                    ))}
                    {isLoading && (
                        <Box sx={{ alignSelf: 'flex-start' }}>
                            <Paper elevation={0} sx={{ p: 1.5, bgcolor: '#fff', border: '1px solid #E5E7EB', borderRadius: 2 }}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <CircularProgress size={14} color="secondary" />
                                    <Typography variant="caption" color="text.secondary">Thinking...</Typography>
                                </Stack>
                            </Paper>
                        </Box>
                    )}
                    <div ref={messagesEndRef} />
                </Stack>
            </Box>

            {/* Context Indicator (Click-to-Edit) */}
            {clickedElementId && (
                <Box sx={{ px: 2, py: 1, bgcolor: '#F3E8FF', borderTop: '1px solid #E9D5FF', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="caption" sx={{ color: '#6B21A8', fontWeight: 600 }}>
                        Targeting: #{clickedElementId}
                    </Typography>
                    <IconButton size="small" onClick={onClearSelection}>
                        <CloseIcon fontSize="small" sx={{ color: '#6B21A8' }} />
                    </IconButton>
                </Box>
            )}

            {/* Image Preview Chip */}
            {selectedImage && (
                <Box sx={{ px: 2, py: 1, bgcolor: '#EFF6FF', borderTop: '1px solid #DBEAFE', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ImageOutlinedIcon sx={{ fontSize: 16, color: '#2563EB' }} />
                    <Typography variant="caption" sx={{ flex: 1, color: '#1E40AF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {selectedImage.name}
                    </Typography>
                    <IconButton size="small" onClick={() => {
                        setSelectedImage(null);
                        if (fileInputRef.current) fileInputRef.current.value = "";
                    }}>
                        <CloseIcon fontSize="small" sx={{ color: '#1E40AF' }} />
                    </IconButton>
                </Box>
            )}

            {/* Input Area */}
            <Box component="form" onSubmit={handleSubmit} sx={{ p: 2, bgcolor: '#fff', borderTop: '1px solid #eee' }}>
                <input
                    type="file"
                    accept="image/*"
                    hidden
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                />

                <TextField
                    fullWidth
                    size="small"
                    placeholder="Type instruction..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    disabled={isLoading}
                    InputProps={{
                        sx: { borderRadius: '20px', bgcolor: '#F9FAFB', '& fieldset': { border: 'none' } },
                        startAdornment: (
                            <IconButton
                                size="small"
                                onClick={() => fileInputRef.current?.click()}
                                sx={{ mr: 0.5, color: '#6C2BD9', '&:hover': { color: '#6C2BD9', bgcolor: '#F3E8FF' } }}
                                title="Attach Image"
                            >
                                <AttachFileIcon fontSize="small" />
                            </IconButton>
                        ),
                        endAdornment: (
                            <IconButton
                                type="submit"
                                disabled={(!prompt.trim() && !selectedImage) || isLoading}
                                sx={{ color: '#6C2BD9', bgcolor: (prompt.trim() || selectedImage) ? '#F3E8FF' : 'transparent', '&:hover': { bgcolor: '#E9D5FF' } }}
                            >
                                <SendIcon />
                            </IconButton>
                        )
                    }}
                />
            </Box>
        </Paper>
    );
}
