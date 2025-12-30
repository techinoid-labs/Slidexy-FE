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
    const [prompt, setPrompt] = useState("");
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [minimized, setMinimized] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<null | HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

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

    const handleSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!prompt.trim() && !selectedImage) return;

        onSubmit(prompt, selectedImage || undefined);

        setPrompt("");
        setSelectedImage(null);
        if (fileInputRef.current) fileInputRef.current.value = "";

        // Refocus input after submit
        setTimeout(() => inputRef.current?.focus(), 100);
    };

    // Keyboard shortcut: Cmd/Ctrl + Enter to submit
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
            e.preventDefault();
            handleSubmit();
        }
    };

    if (minimized) {
        return (
            <Paper
                elevation={0}
                onClick={() => setMinimized(false)}
                sx={{
                    position: 'fixed',
                    bottom: 24,
                    right: 24,
                    width: 64,
                    height: 64,
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1300,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: '#fff',
                    cursor: 'pointer',
                    transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    boxShadow: '0 8px 32px rgba(102, 126, 234, 0.4), 0 0 0 1px rgba(255,255,255,0.2)',
                    '&:hover': {
                        transform: 'scale(1.1) rotate(5deg)',
                        boxShadow: '0 12px 48px rgba(102, 126, 234, 0.6)'
                    },
                    '&:active': {
                        transform: 'scale(0.95)'
                    }
                }}
            >
                <AutoFixHighIcon sx={{ fontSize: 28 }} />
            </Paper>
        );
    }

    return (
        <Paper
            elevation={0}
            sx={{
                position: 'fixed',
                bottom: 24,
                right: 24,
                width: 420,
                height: 600,
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '24px',
                overflow: 'hidden',
                zIndex: 1300,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px) saturate(180%)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 24px 64px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255,255,255,0.1)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                    boxShadow: '0 32px 80px rgba(0, 0, 0, 0.2)'
                }
            }}
        >
            {/* Header with Gradient */}
            <Box sx={{
                p: 2.5,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                position: 'relative',
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '1px',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)'
                }
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{
                        p: 0.8,
                        borderRadius: '12px',
                        bgcolor: 'rgba(255,255,255,0.15)',
                        backdropFilter: 'blur(10px)',
                        display: 'flex'
                    }}>
                        <AutoFixHighIcon sx={{ fontSize: 20 }} />
                    </Box>
                    <Box>
                        <Typography variant="subtitle1" fontWeight={700} sx={{ letterSpacing: '-0.02em' }}>
                            AI Editor
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.85, fontSize: '0.7rem' }}>
                            Pixel-perfect editing
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                    {/* Selection Toggle */}
                    <IconButton
                        size="small"
                        onClick={onToggleSelection}
                        sx={{
                            color: '#fff',
                            bgcolor: selectionMode ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)',
                            border: selectionMode ? '2px solid rgba(255,255,255,0.6)' : '2px solid transparent',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                bgcolor: 'rgba(255,255,255,0.2)',
                                transform: 'scale(1.05)'
                            }
                        }}
                        title={selectionMode ? "Disable Click-to-Edit" : "Enable Click-to-Edit"}
                    >
                        <TouchAppIcon fontSize="small" />
                    </IconButton>

                    <IconButton
                        size="small"
                        onClick={() => setMinimized(true)}
                        sx={{
                            color: '#fff',
                            bgcolor: 'rgba(255,255,255,0.1)',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                bgcolor: 'rgba(255,255,255,0.2)',
                                transform: 'rotate(90deg)'
                            }
                        }}
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Box>
            </Box>

            {/* Chat History */}
            <Box sx={{ flex: 1, p: 2.5, overflowY: 'auto', bgcolor: '#fafbfc' }}>
                {history.length === 0 && (
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mt: 8,
                        opacity: 0.5
                    }}>
                        <Box sx={{
                            p: 3,
                            borderRadius: '50%',
                            bgcolor: 'rgba(102, 126, 234, 0.1)',
                            mb: 2
                        }}>
                            <AutoFixHighIcon sx={{ fontSize: 48, color: '#667eea' }} />
                        </Box>
                        <Typography variant="body2" textAlign="center" color="text.secondary" fontWeight={500}>
                            Start editing with AI
                        </Typography>
                        <Typography variant="caption" textAlign="center" color="text.secondary" sx={{ mt: 0.5, maxWidth: 240 }}>
                            Select an element or describe what you'd like to change
                        </Typography>
                    </Box>
                )}

                <Stack spacing={1.5}>
                    {history.map((msg, i) => (
                        <Box
                            key={i}
                            sx={{
                                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                maxWidth: '85%',
                                animation: 'slideIn 0.3s ease-out',
                                '@keyframes slideIn': {
                                    from: { opacity: 0, transform: 'translateY(10px)' },
                                    to: { opacity: 1, transform: 'translateY(0)' }
                                }
                            }}
                        >
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 2,
                                    borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                                    background: msg.role === 'user'
                                        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                        : '#fff',
                                    color: msg.role === 'user' ? '#fff' : '#1F2937',
                                    border: msg.role === 'user' ? 'none' : '1px solid #E5E7EB',
                                    boxShadow: msg.role === 'user'
                                        ? '0 4px 12px rgba(102, 126, 234, 0.25)'
                                        : '0 2px 8px rgba(0,0,0,0.04)',
                                    position: 'relative',
                                    '&::before': msg.role === 'model' ? {
                                        content: '""',
                                        position: 'absolute',
                                        left: -1,
                                        top: 0,
                                        bottom: 0,
                                        width: '3px',
                                        background: 'linear-gradient(180deg, #667eea, #764ba2)',
                                        borderRadius: '0 0 0 18px'
                                    } : {}
                                }}
                            >
                                <Typography
                                    variant="body2"
                                    sx={{
                                        lineHeight: 1.6,
                                        fontSize: '0.9rem',
                                        wordBreak: 'break-word'
                                    }}
                                >
                                    {msg.content}
                                </Typography>
                            </Paper>
                        </Box>
                    ))}
                    {isLoading && (
                        <Box sx={{ alignSelf: 'flex-start', ml: 1 }}>
                            <Paper elevation={0} sx={{
                                p: 2,
                                bgcolor: '#fff',
                                border: '1px solid #E5E7EB',
                                borderRadius: '18px 18px 18px 4px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                            }}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <CircularProgress size={16} sx={{ color: '#667eea' }} />
                                    <Typography variant="caption" color="text.secondary" fontWeight={500}>
                                        AI is thinking...
                                    </Typography>
                                </Stack>
                            </Paper>
                        </Box>
                    )}
                    <div ref={messagesEndRef} />
                </Stack>
            </Box>

            {/* Context Indicator (Click-to-Edit) */}
            {clickedElementId && (
                <Box sx={{
                    px: 2.5,
                    py: 1.5,
                    background: 'linear-gradient(90deg, rgba(102, 126, 234, 0.08), rgba(118, 75, 162, 0.08))',
                    borderTop: '1px solid rgba(102, 126, 234, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backdropFilter: 'blur(10px)'
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            bgcolor: '#667eea',
                            animation: 'pulse 2s infinite',
                            '@keyframes pulse': {
                                '0%, 100%': { opacity: 1 },
                                '50%': { opacity: 0.5 }
                            }
                        }} />
                        <Typography variant="caption" sx={{ color: '#667eea', fontWeight: 700, fontSize: '0.75rem' }}>
                            Targeting: <Box component="span" sx={{ fontFamily: 'monospace', bgcolor: 'rgba(102, 126, 234, 0.1)', px: 0.8, py: 0.3, borderRadius: '6px' }}>#{clickedElementId}</Box>
                        </Typography>
                    </Box>
                    <IconButton size="small" onClick={onClearSelection} sx={{ '&:hover': { bgcolor: 'rgba(102, 126, 234, 0.1)' } }}>
                        <CloseIcon fontSize="small" sx={{ color: '#667eea' }} />
                    </IconButton>
                </Box>
            )}

            {/* Image Preview Chip */}
            {selectedImage && (
                <Box sx={{
                    px: 2.5,
                    py: 1.5,
                    background: 'linear-gradient(90deg, rgba(59, 130, 246, 0.08), rgba(147, 197, 253, 0.08))',
                    borderTop: '1px solid rgba(59, 130, 246, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    backdropFilter: 'blur(10px)'
                }}>
                    <Box sx={{
                        p: 0.8,
                        borderRadius: '10px',
                        bgcolor: 'rgba(59, 130, 246, 0.1)',
                        display: 'flex'
                    }}>
                        <ImageOutlinedIcon sx={{ fontSize: 18, color: '#3b82f6' }} />
                    </Box>
                    <Typography variant="caption" sx={{
                        flex: 1,
                        color: '#1e40af',
                        fontWeight: 600,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                    }}>
                        {selectedImage.name}
                    </Typography>
                    <IconButton size="small" onClick={() => {
                        setSelectedImage(null);
                        if (fileInputRef.current) fileInputRef.current.value = "";
                    }} sx={{ '&:hover': { bgcolor: 'rgba(59, 130, 246, 0.1)' } }}>
                        <CloseIcon fontSize="small" sx={{ color: '#3b82f6' }} />
                    </IconButton>
                </Box>
            )}

            {/* Input Area */}
            <Box component="form" onSubmit={handleSubmit} sx={{
                p: 2.5,
                bgcolor: '#fff',
                borderTop: '1px solid rgba(0,0,0,0.06)',
                boxShadow: '0 -4px 12px rgba(0,0,0,0.03)'
            }}>
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
                    placeholder="Type your AI instruction... (⌘+↵)"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isLoading}
                    inputRef={inputRef}
                    InputProps={{
                        sx: {
                            borderRadius: '16px',
                            bgcolor: '#fafbfc',
                            border: '2px solid transparent',
                            transition: 'all 0.2s ease',
                            '& fieldset': { border: 'none' },
                            '&:hover': {
                                bgcolor: '#f5f6f7',
                                borderColor: 'rgba(102, 126, 234, 0.2)'
                            },
                            '&.Mui-focused': {
                                bgcolor: '#fff',
                                borderColor: '#667eea',
                                boxShadow: '0 0 0 4px rgba(102, 126, 234, 0.1)'
                            }
                        },
                        startAdornment: (
                            <IconButton
                                size="small"
                                onClick={() => fileInputRef.current?.click()}
                                sx={{
                                    mr: 0.5,
                                    color: '#667eea',
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        bgcolor: 'rgba(102, 126, 234, 0.1)',
                                        transform: 'scale(1.1)'
                                    }
                                }}
                                title="Attach Image"
                            >
                                <AttachFileIcon fontSize="small" />
                            </IconButton>
                        ),
                        endAdornment: (
                            <IconButton
                                type="submit"
                                disabled={(!prompt.trim() && !selectedImage) || isLoading}
                                sx={{
                                    background: (prompt.trim() || selectedImage)
                                        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                        : 'transparent',
                                    color: (prompt.trim() || selectedImage) ? '#fff' : '#9ca3af',
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        transform: (prompt.trim() || selectedImage) ? 'scale(1.05)' : 'none',
                                        boxShadow: (prompt.trim() || selectedImage) ? '0 4px 12px rgba(102, 126, 234, 0.3)' : 'none'
                                    },
                                    '&:active': {
                                        transform: 'scale(0.95)'
                                    },
                                    '&.Mui-disabled': {
                                        background: 'transparent',
                                        color: '#d1d5db'
                                    }
                                }}
                            >
                                <SendIcon fontSize="small" />
                            </IconButton>
                        )
                    }}
                />
            </Box>
        </Paper>
    );
}
