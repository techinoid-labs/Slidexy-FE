"use client";

import {
  Box,
  Typography,
  Button,
  LinearProgress,
  Paper,
  IconButton,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Divider,
  Collapse,
  Tooltip,
  Stack,
} from "@mui/material";
import {
  ArrowBack,
  Download,
  Refresh,
  AutoAwesome,
  Fullscreen,
  FullscreenExit,
  Edit,
  History,
  ExpandMore,
  ExpandLess,
  DeleteOutline,
  ContentCopy,
} from "@mui/icons-material";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Chip from "@mui/material/Chip";

const API_BASE_URL = process.env.NEXT_PUBLIC_Proposal_API_BASE_URL;

const generationStages = [
  { message: "Initializing AI Engine", detail: "Setting up the proposal generation pipeline...", progress: 5 },
  { message: "Analyzing Your Prompt", detail: "Understanding requirements and context...", progress: 15 },
  { message: "Generating Content Structure", detail: "Creating proposal outline and sections...", progress: 30 },
  { message: "Writing Proposal Content", detail: "Generating detailed content for each section...", progress: 50 },
  { message: "Formatting Document", detail: "Applying professional styling and layout...", progress: 70 },
  { message: "Optimizing PDF", detail: "Finalizing document structure...", progress: 85 },
  { message: "Completing Generation", detail: "Preparing your proposal for download...", progress: 95 },
];

interface PromptHistory {
  id: string;
  prompt: string;
  timestamp: number;
  pdfUrl?: string;
}

export default function ViewerPage() {
  const [prompt, setPrompt] = useState("");
  const [generatedPdfUrl, setGeneratedPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);
  const [error, setError] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [regenerateDialogOpen, setRegenerateDialogOpen] = useState(false);
  const [editedPrompt, setEditedPrompt] = useState("");
  const [promptHistory, setPromptHistory] = useState<PromptHistory[]>([]);
  const [historyExpanded, setHistoryExpanded] = useState(false);

  const router = useRouter();
  const animationRef = useRef<number | null>(null);
  const fullscreenRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedPrompt = sessionStorage.getItem("proposalPrompt");
    const storedPdfUrl = sessionStorage.getItem("proposalPdfUrl");
    const storedHistory = localStorage.getItem("proposalHistory");

    if (!storedPrompt) {
      router.push("/tools/prompt-to-proposal");
      return;
    }

    setPrompt(storedPrompt);
    setEditedPrompt(storedPrompt);
    if (storedPdfUrl) setGeneratedPdfUrl(storedPdfUrl);
    if (storedHistory) setPromptHistory(JSON.parse(storedHistory));
  }, [router]);

  const saveToHistory = (promptText: string, pdfUrl?: string) => {
    const newEntry: PromptHistory = {
      id: Date.now().toString(),
      prompt: promptText,
      timestamp: Date.now(),
      pdfUrl,
    };

    const updatedHistory = [newEntry, ...promptHistory].slice(0, 10); // Keep last 10
    setPromptHistory(updatedHistory);
    localStorage.setItem("proposalHistory", JSON.stringify(updatedHistory));
  };

  const startFakeProgress = (onComplete: () => void) => {
    const DURATION = 18000;
    const START = Date.now();

    const tick = () => {
      const elapsed = Date.now() - START;
      const ratio = Math.min(elapsed / DURATION, 1);
      const easeOutQuint = (t: number) => 1 - Math.pow(1 - t, 5);
      const eased = easeOutQuint(ratio);
      const fake = Math.min(eased * 98, 98);

      const thresholds = [5, 15, 30, 50, 70, 85, 95];
      let stage = 0;
      for (let i = 0; i < thresholds.length; i++) {
        if (fake >= thresholds[i]) stage = i;
      }

      setProgress(fake);
      setCurrentStage(stage);

      if (ratio < 1) {
        animationRef.current = requestAnimationFrame(tick);
      }
    };

    tick();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      setProgress(100);
      setCurrentStage(generationStages.length - 1);
      onComplete();
    };
  };

  const generateProposal = async (promptText: string) => {
    setLoading(true);
    setError("");
    setProgress(0);
    setCurrentStage(0);

    const completeProgress = startFakeProgress(() => {});

    try {
      const res = await fetch(`${API_BASE_URL}/generate-proposal`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: promptText }),
      });

      if (!res.ok) throw new Error("Failed to generate proposal.");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      completeProgress();

      setTimeout(() => {
        setGeneratedPdfUrl(url);
        setLoading(false);
        sessionStorage.setItem("proposalPdfUrl", url);
        sessionStorage.setItem("proposalPrompt", promptText);
        setPrompt(promptText);
        saveToHistory(promptText, url);
      }, 600);
    } catch (err: any) {
      completeProgress();
      setError(err.message || "Something went wrong.");
      setLoading(false);
    }
  };

  const handleRegenerate = () => {
    setRegenerateDialogOpen(false);
    generateProposal(editedPrompt);
  };

  const handleLoadHistoryPrompt = (historyItem: PromptHistory) => {
    setPrompt(historyItem.prompt);
    setEditedPrompt(historyItem.prompt);
    if (historyItem.pdfUrl) {
      setGeneratedPdfUrl(historyItem.pdfUrl);
    }
    sessionStorage.setItem("proposalPrompt", historyItem.prompt);
    setHistoryExpanded(false);
  };

  const handleDeleteHistory = (id: string) => {
    const updatedHistory = promptHistory.filter((item) => item.id !== id);
    setPromptHistory(updatedHistory);
    localStorage.setItem("proposalHistory", JSON.stringify(updatedHistory));
  };

  const handleCopyPrompt = (promptText: string) => {
    navigator.clipboard.writeText(promptText);
  };

  const handleFullscreen = () => {
    if (!isFullscreen) {
      fullscreenRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8f9fa", py: 4, px: { xs: 2, md: 4 } }}>
      {/* Header */}
      <Box sx={{ maxWidth: "1600px", mx: "auto", mb: 4 }}>
        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "stretch", sm: "center" }} spacing={2}>
          <Button 
            startIcon={<ArrowBack />} 
            onClick={() => router.push("/tools/prompt-to-proposal")} 
            sx={{ 
              color: "#6C2BD9", 
              fontWeight: 600,
              "&:hover": { bgcolor: "rgba(108, 43, 217, 0.04)" }
            }}
          >
            Back to Tool
          </Button>

          <Stack direction="row" spacing={2} flexWrap="wrap">
            <Button 
              variant="outlined" 
              startIcon={<Edit />} 
              onClick={() => setRegenerateDialogOpen(true)} 
              disabled={loading} 
              sx={{ 
                borderColor: "#6C2BD9", 
                color: "#6C2BD9", 
                fontWeight: 600,
                "&:hover": { borderColor: "#5B21B6", bgcolor: "rgba(108, 43, 217, 0.04)" }
              }}
            >
              Regenerate
            </Button>
            {generatedPdfUrl && (
              <Button 
                variant="contained" 
                startIcon={<Download />} 
                href={generatedPdfUrl} 
                download="proposal.pdf" 
                sx={{ 
                  bgcolor: "#6C2BD9", 
                  fontWeight: 600,
                  boxShadow: "0 4px 12px rgba(108, 43, 217, 0.2)",
                  "&:hover": { bgcolor: "#5B21B6", boxShadow: "0 6px 16px rgba(108, 43, 217, 0.3)" }
                }}
              >
                Download PDF
              </Button>
            )}
          </Stack>
        </Stack>
      </Box>

      <Box sx={{ maxWidth: "1600px", mx: "auto" }}>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "420px 1fr" }, gap: 3 }}>
          {/* Left Sidebar */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Current Prompt */}
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                borderRadius: 3, 
                border: "1px solid #e8e4ff", 
                bgcolor: "white",
                transition: "all 0.3s ease",
                "&:hover": { boxShadow: "0 4px 20px rgba(108, 43, 217, 0.08)" }
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Box sx={{ 
                  width: 40, 
                  height: 40, 
                  borderRadius: 2, 
                  bgcolor: "rgba(108, 43, 217, 0.1)", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  mr: 2
                }}>
                  <AutoAwesome sx={{ color: "#6C2BD9", fontSize: 20 }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: "#1a1a1a" }}>
                  Current Prompt
                </Typography>
              </Box>
              <Typography 
                variant="body2" 
                sx={{ 
                  p: 2.5, 
                  bgcolor: "#fafbfc", 
                  borderRadius: 2, 
                  border: "1px solid #f0f0f5", 
                  maxHeight: "200px", 
                  overflowY: "auto",
                  lineHeight: 1.6,
                  color: "#4a4a4a",
                  "&::-webkit-scrollbar": { width: "6px" },
                  "&::-webkit-scrollbar-thumb": { bgcolor: "#e0e0e0", borderRadius: "3px" }
                }}
              >
                {prompt}
              </Typography>
            </Paper>

            {/* Prompt History */}
            <Paper 
              elevation={0} 
              sx={{ 
                borderRadius: 3, 
                border: "1px solid #e8e4ff", 
                bgcolor: "white",
                overflow: "hidden",
                transition: "all 0.3s ease",
                "&:hover": { boxShadow: "0 4px 20px rgba(108, 43, 217, 0.08)" }
              }}
            >
              <ListItemButton onClick={() => setHistoryExpanded(!historyExpanded)} sx={{ p: 3 }}>
                <Box sx={{ 
                  width: 40, 
                  height: 40, 
                  borderRadius: 2, 
                  bgcolor: "rgba(108, 43, 217, 0.1)", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  mr: 2
                }}>
                  <History sx={{ color: "#6C2BD9", fontSize: 20 }} />
                </Box>
                <ListItemText 
                  primary={
                    <Typography variant="h6" sx={{ fontWeight: 700, color: "#1a1a1a" }}>
                      Prompt History
                    </Typography>
                  }
                  secondary={
                    <Typography variant="caption" sx={{ color: "#6d6d6d" }}>
                      {promptHistory.length} saved prompts
                    </Typography>
                  }
                />
                {historyExpanded ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              
              <Collapse in={historyExpanded}>
                <Divider />
                <List sx={{ maxHeight: "400px", overflowY: "auto", p: 0 }}>
                  {promptHistory.length === 0 ? (
                    <Box sx={{ p: 4, textAlign: "center" }}>
                      <Typography variant="body2" sx={{ color: "#9e9e9e" }}>
                        No prompt history yet
                      </Typography>
                    </Box>
                  ) : (
                    promptHistory.map((item, index) => (
                      <Box key={item.id}>
                        {index > 0 && <Divider />}
                        <ListItem
                          sx={{ 
                            py: 2, 
                            px: 3,
                            "&:hover": { bgcolor: "#fafbfc" },
                            transition: "background-color 0.2s"
                          }}
                          secondaryAction={
                            <Stack direction="row" spacing={0.5}>
                              <Tooltip title="Copy">
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleCopyPrompt(item.prompt)}
                                  sx={{ "&:hover": { bgcolor: "rgba(108, 43, 217, 0.08)" } }}
                                >
                                  <ContentCopy fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleDeleteHistory(item.id)}
                                  sx={{ "&:hover": { bgcolor: "rgba(244, 67, 54, 0.08)", color: "#f44336" } }}
                                >
                                  <DeleteOutline fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          }
                        >
                          <ListItemButton 
                            onClick={() => handleLoadHistoryPrompt(item)}
                            sx={{ borderRadius: 1, p: 1, mr: 1 }}
                          >
                            <ListItemText
                              primary={
                                <Typography 
                                  variant="body2" 
                                  sx={{ 
                                    fontWeight: 500,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                    color: "#2a2a2a"
                                  }}
                                >
                                  {item.prompt}
                                </Typography>
                              }
                              secondary={
                                <Typography variant="caption" sx={{ color: "#9e9e9e", mt: 0.5, display: "block" }}>
                                  {formatDate(item.timestamp)}
                                </Typography>
                              }
                            />
                          </ListItemButton>
                        </ListItem>
                      </Box>
                    ))
                  )}
                </List>
              </Collapse>
            </Paper>

            {/* Loading State */}
            {loading && (
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 4, 
                  borderRadius: 3, 
                  border: "2px solid #6C2BD9", 
                  bgcolor: "white",
                  boxShadow: "0 4px 20px rgba(108, 43, 217, 0.15)"
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <Box sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    bgcolor: "rgba(108, 43, 217, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mr: 2,
                    animation: "pulse 2s infinite",
                    "@keyframes pulse": {
                      "0%,100%": { transform: "scale(1)" },
                      "50%": { transform: "scale(1.05)" }
                    }
                  }}>
                    <AutoAwesome sx={{ color: "#6C2BD9", fontSize: 24 }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: "#6C2BD9", mb: 0.5 }}>
                      {generationStages[currentStage]?.message || "Finalizing..."}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#6d6d6d" }}>
                      {generationStages[currentStage]?.detail || "Almost ready!"}
                    </Typography>
                  </Box>
                </Box>

                <LinearProgress 
                  variant="determinate" 
                  value={progress} 
                  sx={{ 
                    height: 10, 
                    borderRadius: 5, 
                    mb: 2, 
                    bgcolor: "#f0ebff", 
                    "& .MuiLinearProgress-bar": { 
                      bgcolor: "#6C2BD9",
                      borderRadius: 5,
                      transition: "transform 0.4s ease"
                    } 
                  }} 
                />

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="body2" sx={{ color: "#6C2BD9", fontWeight: 700, fontSize: 16 }}>
                    {Math.round(progress)}%
                  </Typography>
                  <Chip 
                    label="Processing" 
                    size="small"
                    sx={{ 
                      bgcolor: "rgba(108, 43, 217, 0.1)", 
                      color: "#6C2BD9",
                      fontWeight: 600,
                      animation: "fade 1.5s infinite",
                      "@keyframes fade": {
                        "0%,100%": { opacity: 1 },
                        "50%": { opacity: 0.6 }
                      }
                    }} 
                  />
                </Box>
              </Paper>
            )}

            {error && (
              <Alert 
                severity="error" 
                action={
                  <Button 
                    startIcon={<Refresh />} 
                    onClick={() => generateProposal(prompt)}
                    sx={{ fontWeight: 600 }}
                  >
                    Retry
                  </Button>
                }
                sx={{ borderRadius: 2 }}
              >
                {error}
              </Alert>
            )}

            {!loading && generatedPdfUrl && !error && (
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 3, 
                  borderRadius: 3, 
                  border: "2px solid #4CAF50", 
                  bgcolor: "rgba(76,175,80,0.03)",
                  boxShadow: "0 4px 20px rgba(76, 175, 80, 0.15)"
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5, color: "#2e7d32" }}>
                      ✓ Proposal Ready!
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#6d6d6d" }}>
                      Your document is ready to download
                    </Typography>
                  </Box>
                  <Chip 
                    label="Complete" 
                    sx={{ 
                      bgcolor: "#4CAF50", 
                      color: "white", 
                      fontWeight: 600,
                      boxShadow: "0 2px 8px rgba(76, 175, 80, 0.3)"
                    }} 
                  />
                </Box>
              </Paper>
            )}
          </Box>

          {/* PDF Viewer */}
          <Paper 
            ref={fullscreenRef} 
            elevation={0} 
            sx={{ 
              borderRadius: 3, 
              overflow: "hidden", 
              border: "1px solid #e8e4ff", 
              bgcolor: "white", 
              minHeight: "calc(100vh - 200px)", 
              position: "relative",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)"
            }}
          >
            {generatedPdfUrl && (
              <Tooltip title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}>
                <IconButton 
                  onClick={handleFullscreen} 
                  sx={{ 
                    position: "absolute", 
                    top: 16, 
                    right: 16, 
                    zIndex: 10, 
                    bgcolor: "rgba(255,255,255,0.95)", 
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                    "&:hover": { 
                      bgcolor: "white",
                      transform: "scale(1.05)",
                      transition: "all 0.2s"
                    } 
                  }}
                >
                  {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
                </IconButton>
              </Tooltip>
            )}

            {loading && (
              <Box 
                sx={{ 
                  display: "flex", 
                  flexDirection: "column", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  height: "100%", 
                  minHeight: "600px", 
                  p: 4 
                }}
              >
                <Box 
                  sx={{ 
                    width: 140, 
                    height: 140, 
                    borderRadius: "50%", 
                    bgcolor: "rgba(108, 43, 217, 0.08)", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center", 
                    mb: 4, 
                    animation: "pulse 2s infinite", 
                    "@keyframes pulse": { 
                      "0%,100%": { transform: "scale(1)", opacity: 1 }, 
                      "50%": { transform: "scale(1.1)", opacity: 0.8 } 
                    } 
                  }}
                >
                  <AutoAwesome sx={{ fontSize: 70, color: "#6C2BD9" }} />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: "#1a1a1a" }}>
                  Generating Your Proposal
                </Typography>
                <Typography variant="body1" sx={{ color: "#6d6d6d", textAlign: "center", maxWidth: "400px" }}>
                  Please wait while we create your professional document with AI-powered content...
                </Typography>
              </Box>
            )}

            {!generatedPdfUrl && !loading && (
              <Box 
                sx={{ 
                  display: "flex", 
                  flexDirection: "column", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  height: "100%", 
                  minHeight: "600px", 
                  p: 4 
                }}
              >
                <AutoAwesome sx={{ fontSize: 80, color: "#e0e0e0", mb: 3 }} />
                <Typography variant="h5" sx={{ fontWeight: 600, color: "#9e9e9e", mb: 1 }}>
                  No Proposal Generated Yet
                </Typography>
                <Typography variant="body2" sx={{ color: "#bdbdbd" }}>
                  Click "Regenerate" to create your proposal
                </Typography>
              </Box>
            )}

            {generatedPdfUrl && !loading && (
              <iframe 
                src={generatedPdfUrl} 
                style={{ width: "100%", height: "100%", border: "none", minHeight: "calc(100vh - 200px)" }} 
                title="Proposal" 
              />
            )}
          </Paper>
        </Box>
      </Box>

      {/* Regenerate Dialog */}
      <Dialog 
        open={regenerateDialogOpen} 
        onClose={() => setRegenerateDialogOpen(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, fontSize: 24, pb: 1 }}>
          Regenerate Proposal
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography variant="body2" sx={{ mb: 3, color: "#6d6d6d" }}>
            Edit your prompt below and regenerate with updated requirements.
          </Typography>
          <TextField 
            fullWidth 
            multiline 
            minRows={6} 
            value={editedPrompt} 
            onChange={(e) => setEditedPrompt(e.target.value)} 
            placeholder="Enter your updated prompt..." 
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                "&:hover fieldset": { borderColor: "#6C2BD9" },
                "&.Mui-focused fieldset": { borderColor: "#6C2BD9", borderWidth: 2 }
              }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button 
            onClick={() => setRegenerateDialogOpen(false)}
            sx={{ fontWeight: 600, color: "#6d6d6d" }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleRegenerate} 
            variant="contained" 
            startIcon={<Refresh />} 
            disabled={!editedPrompt.trim()} 
            sx={{ 
              bgcolor: "#6C2BD9", 
              fontWeight: 600,
              px: 3,
              boxShadow: "0 4px 12px rgba(108, 43, 217, 0.3)",
              "&:hover": { 
                bgcolor: "#5B21B6",
                boxShadow: "0 6px 16px rgba(108, 43, 217, 0.4)"
              },
              "&:disabled": {
                bgcolor: "#e0e0e0"
              }
            }}
          >
            Regenerate
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}