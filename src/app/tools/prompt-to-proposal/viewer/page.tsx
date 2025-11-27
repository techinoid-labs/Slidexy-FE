"use client";
import {
  Box,
  Typography,
  Button,
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
  CircularProgress,
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

const loadingMessages = [
  "Analyzing your prompt and extracting key requirements...",
  "Understanding context and identifying proposal objectives...",
  "Generating comprehensive proposal structure and outline...",
  "Researching relevant information and gathering insights...",
  "Writing executive summary and introduction sections...",
  "Crafting detailed content for methodology and approach...",
  "Developing timeline, deliverables, and project scope...",
  "Creating budget breakdown and resource allocation...",
  "Writing conclusion and call-to-action sections...",
  "Applying professional formatting and styling...",
  "Optimizing document layout and visual hierarchy...",
  "Adding final touches and quality enhancements...",
  "Finalizing your professional proposal document...",
];

interface PromptHistory {
  id: string;
  prompt: string;
  timestamp: number;
  pdfUrl?: string;
  proposalId?: string;
  title?: string;
}

export default function ViewerPage() {
  const [prompt, setPrompt] = useState("");
  const [generatedPdfUrl, setGeneratedPdfUrl] = useState<string | null>(null);
  const [proposalTitle, setProposalTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [error, setError] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [regenerateDialogOpen, setRegenerateDialogOpen] = useState(false);
  const [editedPrompt, setEditedPrompt] = useState("");
  const [promptHistory, setPromptHistory] = useState<PromptHistory[]>([]);
  const [historyExpanded, setHistoryExpanded] = useState(false);
  const router = useRouter();
  const fullscreenRef = useRef<HTMLDivElement>(null);
  const messageIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const storedPrompt = sessionStorage.getItem("proposalPrompt");
    const storedPdfUrl = sessionStorage.getItem("proposalPdfUrl");
    const storedTitle = sessionStorage.getItem("proposalTitle");
    const storedHistory = localStorage.getItem("proposalHistory");

    if (!storedPrompt) {
      router.push("/tools/prompt-to-proposal");
      return;
    }

    setPrompt(storedPrompt);
    setEditedPrompt(storedPrompt);
    if (storedPdfUrl) setGeneratedPdfUrl(storedPdfUrl);
    if (storedTitle) setProposalTitle(storedTitle);
    if (storedHistory) setPromptHistory(JSON.parse(storedHistory));
  }, [router]);

  const saveToHistory = (promptText: string, pdfUrl?: string, proposalId?: string, title?: string) => {
    const newEntry: PromptHistory = {
      id: Date.now().toString(),
      prompt: promptText,
      timestamp: Date.now(),
      pdfUrl,
      proposalId,
      title,
    };
    const updatedHistory = [newEntry, ...promptHistory].slice(0, 10);
    setPromptHistory(updatedHistory);
    localStorage.setItem("proposalHistory", JSON.stringify(updatedHistory));
  };

  const cycleLoadingMessages = () => {
    let index = 0;
    setLoadingMessage(loadingMessages[0]);

    const interval = setInterval(() => {
      index = (index + 1) % loadingMessages.length;
      setLoadingMessage(loadingMessages[index]);
    }, 3000);

    messageIntervalRef.current = interval;
    return interval;
  };

  const generateProposal = async (promptText: string) => {
    setLoading(true);
    setError("");

    const messageInterval = cycleLoadingMessages();

    try {
      const res = await fetch(`${API_BASE_URL}/generate-proposal`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: promptText }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to generate proposal.");
      }

      // Parse JSON response instead of blob
      const data = await res.json();

      clearInterval(messageInterval);

      if (data.success && data.pdfUrl) {
        // Use the S3 URL directly
        setGeneratedPdfUrl(data.pdfUrl);
        setProposalTitle(data.title);
        setLoading(false);

        // Update session storage
        sessionStorage.setItem("proposalPdfUrl", data.pdfUrl);
        sessionStorage.setItem("proposalPrompt", promptText);
        sessionStorage.setItem("proposalId", data.proposalId);
        sessionStorage.setItem("proposalTitle", data.title);

        setPrompt(promptText);
        saveToHistory(promptText, data.pdfUrl, data.proposalId, data.title);
      } else {
        throw new Error(data.error || "Failed to generate proposal.");
      }
    } catch (err: any) {
      clearInterval(messageInterval);
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
    if (historyItem.title) {
      setProposalTitle(historyItem.title);
    }
    sessionStorage.setItem("proposalPrompt", historyItem.prompt);
    if (historyItem.pdfUrl) {
      sessionStorage.setItem("proposalPdfUrl", historyItem.pdfUrl);
    }
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
    return () => {
      document.removeEventListener("fullscreenchange", handler);
      if (messageIntervalRef.current) {
        clearInterval(messageIntervalRef.current);
      }
    };
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
                component="a"
                href={generatedPdfUrl}
                target="_blank"
                download={`${proposalTitle || 'proposal'}.pdf`}
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
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
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
              {proposalTitle && (
                <Box sx={{ mt: 2, p: 2, bgcolor: "#f8f9ff", borderRadius: 2 }}>
                  <Typography variant="caption" sx={{ color: "#6d6d6d", fontWeight: 600 }}>
                    Generated Title:
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#1a1a1a", fontWeight: 500, mt: 0.5 }}>
                    {proposalTitle}
                  </Typography>
                </Box>
              )}
            </Paper>

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
                <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 3 }}>
                  <CircularProgress size={52} sx={{ color: "#6C2BD9" }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: "#6C2BD9", mb: 0.5 }}>
                      {loadingMessage}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#6d6d6d" }}>
                      Please wait while we craft your professional proposal
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{
                  p: 2.5,
                  bgcolor: "#fafbfc",
                  borderRadius: 2,
                  border: "1px solid #f0f0f5",
                }}>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
                    <Typography variant="body2" sx={{ color: "#4a4a4a", fontWeight: 600 }}>
                      ⏱️ Estimated completion time
                    </Typography>
                    <Chip
                      label="20-30 seconds"
                      size="small"
                      sx={{
                        bgcolor: "rgba(108, 43, 217, 0.1)",
                        color: "#6C2BD9",
                        fontWeight: 600
                      }}
                    />
                  </Box>
                  <Typography variant="caption" sx={{ color: "#8b6fbf", display: "block" }}>
                    🤖 AI is analyzing your requirements and generating custom content tailored to your needs
                  </Typography>
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
                <CircularProgress size={80} sx={{ color: "#6C2BD9", mb: 4 }} />
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: "#1a1a1a", textAlign: "center" }}>
                  Generating Your Proposal
                </Typography>
                <Typography variant="h6" sx={{ color: "#6C2BD9", textAlign: "center", maxWidth: "500px", mb: 2, fontWeight: 600 }}>
                  {loadingMessage}
                </Typography>
                <Typography variant="body1" sx={{ color: "#6d6d6d", textAlign: "center", maxWidth: "400px", mb: 1 }}>
                  Our AI is carefully analyzing your requirements and crafting a professional, comprehensive proposal document.
                </Typography>
                <Typography variant="body2" sx={{ color: "#9e9e9e", textAlign: "center" }}>
                  ⏱️ Estimated time: 20-30 seconds
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
              <Box sx={{ width: "100%", height: "100%", minHeight: "calc(100vh - 200px)" }}>
                <iframe
                  src={`https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(generatedPdfUrl)}#zoom=page-fit`}
                  style={{ width: "100%", height: "100%", border: "none" }}
                  title="PDF Viewer"
                />
              </Box>
            )}
          </Paper>
        </Box>
      </Box>

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