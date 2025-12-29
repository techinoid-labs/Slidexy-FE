"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  CircularProgress,
  Alert,
  IconButton,
} from "@mui/material";
import {
  AutoAwesome,
  Download as DownloadIcon,
  Close as CloseIcon,
} from "@mui/icons-material";

const API_BASE_URL = process.env.NEXT_PUBLIC_LATEX_API_BASE_URL;

interface SessionData {
  session_id: string;
  document_name: string;
  current_version: number;
  versions: Array<{
    version: number;
    change_description: string;
    timestamp: string;
  }>;
}

interface EditorProps {
  sessionId: string;
}

export default function Editor({ sessionId }: EditorProps) {
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [prompt, setPrompt] = useState("");
  const [context, setContext] = useState("");
  const [latexCode, setLatexCode] = useState("");
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [error, setError] = useState("");
  const [pdfKey, setPdfKey] = useState(0); // Forces iframe reload

  // Main function to load session + LaTeX code
  const fetchSessionData = async () => {
    setLoading(true);
    setError("");
    try {
      // Step 1: Get session info (includes current_version)
      const sessionRes = await fetch(`${API_BASE_URL}/edit/sessions/${sessionId}`);
      if (!sessionRes.ok) {
        const err = await sessionRes.json().catch(() => ({}));
        throw new Error(err.detail || "Failed to fetch session");
      }
      const session: SessionData = await sessionRes.json();
      setSessionData(session);

      const currentVersion = session.current_version;

      // Step 2: Get full version details → contains latex_code
      const versionRes = await fetch(
        `${API_BASE_URL}/edit/sessions/${sessionId}/versions/${currentVersion}`
      );
      if (!versionRes.ok) {
        const err = await versionRes.json().catch(() => ({}));
        throw new Error(err.detail || "Failed to fetch version details");
      }
      const versionData = await versionRes.json();

      // Set LaTeX code
      setLatexCode(versionData.latex_code || "No LaTeX code available");

      // If version data includes download_url or pdf_url, use it
      if (versionData.download_url || versionData.pdf_url) {
        const newUrl = versionData.download_url || versionData.pdf_url;
        setPdfUrl(newUrl);
        setPdfKey((prev) => prev + 1);
      }
      // If not, keep existing pdfUrl (important after page refresh)

    } catch (err: any) {
      console.error("Fetch error:", err);
      setError(err.message || "Failed to load document session");
      setLatexCode("");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sessionId) {
      fetchSessionData();
    }
  }, [sessionId]);

  const handleModify = async () => {
    if (!prompt.trim()) {
      setError("Please enter a modification request.");
      return;
    }

    setRegenerating(true);
    setError("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/edit/sessions/${sessionId}/modify`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            modification_request: prompt.trim(),
            context: context.trim() || null,
          }),
        }
      );

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || "Modification failed");
      }

      const data = await response.json(); // Contains { version, download_url }

      // THIS IS KEY: /modify returns download_url → use it immediately for preview
      if (data.download_url) {
        setPdfUrl(data.download_url);
        setPdfKey((prev) => prev + 1);
      }

      // Refresh LaTeX code and session info
      await fetchSessionData();

      // Clear inputs
      setPrompt("");
      setContext("");
    } catch (err: any) {
      console.error("Modify error:", err);
      setError(err.message || "Failed to apply changes");
    } finally {
      setRegenerating(false);
    }
  };

  const handleDownload = () => {
    if (pdfUrl) {
      window.open(pdfUrl, "_blank");
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "70vh",
        }}
      >
        <CircularProgress size={60} />
        <Typography sx={{ ml: 2 }}>Loading document...</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        maxWidth: "calc(100% - 48px)",
        mx: "auto",
        p: 3,
        bgcolor: "#fff",
      }}
    >
      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          action={
            <IconButton size="small" onClick={() => setError("")}>
              <CloseIcon />
            </IconButton>
          }
        >
          {error}
        </Alert>
      )}

      {/* Header with session name and download button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="subtitle1" color="text.secondary">
          Session: {sessionData?.document_name || "Untitled"} (Version{" "}
          {sessionData?.current_version})
        </Typography>

        <Button
          variant="outlined"
          onClick={handleDownload}
          disabled={!pdfUrl || regenerating}
          startIcon={<DownloadIcon />}
          sx={{
            borderRadius: "30px",
            px: 3,
            py: 1,
            fontWeight: 500,
            bgcolor: "rgba(242, 240, 255, 1)",
            "&:hover": { bgcolor: "rgba(230, 226, 255, 1)" },
          }}
        >
          Download PDF
        </Button>
      </Box>

      {/* Three-column layout */}
      <Paper
        elevation={2}
        sx={{
          display: "flex",
          flexDirection: "row",
          height: "calc(100vh - 280px)",
          borderRadius: "16px",
          overflow: "hidden",
        }}
      >
        {/* Left: Modification Panel */}
        <Box
          sx={{
            width: "30%",
            bgcolor: "rgba(251, 250, 255, 1)",
            borderRight: "1px solid rgba(232, 228, 255, 1)",
            p: 3,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography variant="h6" gutterBottom fontWeight={600}>
            Modify Document
          </Typography>

          <TextField
            fullWidth
            multiline
            rows={10}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={regenerating}
            placeholder="e.g., Add a certifications section, change font to Arial, make it two columns..."
            sx={{ mb: 2 }}
          />

          {/* <TextField
            fullWidth
            multiline
            rows={4}
            value={context}
            onChange={(e) => setContext(e.target.value)}
            disabled={regenerating}
            label="Additional Context (Optional)"
            placeholder="e.g., Use modern styling, keep it professional..."
            sx={{ mb: 3 }}
          /> */}

          <Button
            fullWidth
            variant="contained"
            onClick={handleModify}
            disabled={regenerating || !prompt.trim()}
            startIcon={<AutoAwesome />}
            sx={{
              bgcolor: "#6C2BD9",
              height: 48,
              borderRadius: "32px",
              fontWeight: 600,
              boxShadow: "0 4px 12px rgba(108,43,217,0.3)",
              "&:hover": { bgcolor: "#5B21B6" },
            }}
          >
            {regenerating ? "Applying Changes..." : "Apply Changes"}
          </Button>
        </Box>

        {/* Center: LaTeX Code */}
        <Box
          sx={{
            width: "35%",
            bgcolor: "rgba(251, 250, 255, 1)",
            borderRight: "1px solid rgba(232, 228, 255, 1)",
            p: 3,
          }}
        >
          <Typography variant="h6" gutterBottom fontWeight={600}>
            LaTeX Code
          </Typography>
          <Box
            component="pre"
            sx={{
              bgcolor: "#1e1e1e",
              color: "#d4d4d4",
              p: 2,
              borderRadius: 2,
              overflow: "auto",
              height: "calc(100% - 48px)",
              fontSize: "13px",
              fontFamily: "monospace",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            <code>{latexCode || "Loading LaTeX code..."}</code>
          </Box>
        </Box>

        {/* Right: PDF Preview */}
        <Box sx={{ width: "35%", bgcolor: "rgba(251, 250, 255, 1)", p: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight={600}>
            Preview
          </Typography>
          <Box
            sx={{
              width: "100%",
              height: "calc(100% - 48px)",
              bgcolor: "#fff",
              borderRadius: 2,
              overflow: "hidden",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
          >
            {regenerating ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <CircularProgress />
                <Typography sx={{ mt: 2 }}>Compiling PDF...</Typography>
              </Box>
            ) : pdfUrl ? (
              <iframe
                key={pdfKey}
                src={pdfUrl}
                style={{ width: "100%", height: "100%", border: "none" }}
                title="PDF Preview"
              />
            ) : (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  color: "text.secondary",
                }}
              >
                <Typography>
                  PDF preview will appear after first modification or generation.
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}