"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Stack,
  Button,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
} from "@mui/material";
import { ArrowBack, Edit, Download, Refresh } from "@mui/icons-material";

// import CurrentPrompt from "../viewer/components/CurrentPrompt";
// import PromptHistory, { PromptHistoryItem } from "../viewer/components/PromptHistory";
import LoadingPanel from "../viewer/components/LoadingPanel";
import PDFViewer from "../viewer/components/PDFViewer";
import ProposalDataPanel from "../viewer/components/ProposalDataPanel";

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

export default function ViewerPage() {
  const router = useRouter();

  const [prompt, setPrompt] = useState("");
  const [editedPrompt, setEditedPrompt] = useState("");
  const [generatedPdfUrl, setGeneratedPdfUrl] = useState<string | null>(null);
  const [proposalTitle, setProposalTitle] = useState("");
  const [pageMap, setPageMap] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [error, setError] = useState("");
  const [regenerateDialogOpen, setRegenerateDialogOpen] = useState(false);
  // const [promptHistory, setPromptHistory] = useState<PromptHistoryItem[]>([]);
  const [historyExpanded, setHistoryExpanded] = useState(false);
  const [messageInterval, setMessageInterval] = useState<NodeJS.Timeout | null>(null);
  const [proposalData, setProposalData] = useState<any>(null);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  // Handle page index changes from PDFViewer
  const handlePageChange = (newIndex: number) => {
    setCurrentPageIndex(newIndex);
  };

  // Load session and history on mount
  useEffect(() => {
    const storedPrompt = sessionStorage.getItem("proposalPrompt");
    const storedPdfUrl = sessionStorage.getItem("proposalPdfUrl");
    const storedTitle = sessionStorage.getItem("proposalTitle");
    const storedHistory = localStorage.getItem("proposalHistory");
    const storedData = sessionStorage.getItem("proposalData");
    const storedPageMap = sessionStorage.getItem("pageMap");

    if (!storedPrompt) {
      router.push("/tools/prompt-to-proposal");
      return;
    }

    setPrompt(storedPrompt);
    setEditedPrompt(storedPrompt);
    if (storedPdfUrl) setGeneratedPdfUrl(storedPdfUrl);
    if (storedTitle) setProposalTitle(storedTitle);
    // if (storedHistory) setPromptHistory(JSON.parse(storedHistory));
    if (storedData) setProposalData(JSON.parse(storedData));
    if (storedPageMap) setPageMap(JSON.parse(storedPageMap));

  }, [router]);

  // // Save prompt to history
  // const saveToHistory = (promptText: string, pdfUrl?: string, title?: string) => {
  //   const newEntry: PromptHistoryItem = {
  //     id: Date.now().toString(),
  //     prompt: promptText,
  //     timestamp: Date.now(),
  //     pdfUrl,
  //     title,
  //   };
  //   const updatedHistory = [newEntry, ...promptHistory].slice(0, 10);
  //   setPromptHistory(updatedHistory);
  //   localStorage.setItem("proposalHistory", JSON.stringify(updatedHistory));
  // };

  // Cycle loading messages
  const cycleLoadingMessages = () => {
    let index = 0;
    setLoadingMessage(loadingMessages[0]);
    const interval = setInterval(() => {
      index = (index + 1) % loadingMessages.length;
      setLoadingMessage(loadingMessages[index]);
    }, 3000);
    setMessageInterval(interval);
  };

  // Generate proposal
  const generateProposal = async (promptText: string) => {
    setLoading(true);
    setError("");
    cycleLoadingMessages();

    try {
      const res = await fetch(`${API_BASE_URL}/generate-proposal`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: promptText }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to generate proposal.");
      }

      // Clear interval
      if (messageInterval) clearInterval(messageInterval);
      setMessageInterval(null);

      setGeneratedPdfUrl(data.pdfUrl);
      setProposalTitle(data.title);
      setPageMap(data.pageMap);
      setPrompt(promptText);

      sessionStorage.setItem("proposalPdfUrl", data.pdfUrl);
      sessionStorage.setItem("proposalPrompt", promptText);
      sessionStorage.setItem("proposalTitle", data.title);
      sessionStorage.setItem("pageMap", JSON.stringify(data.pageMap));

      // saveToHistory(promptText, data.pdfUrl, data.title);
      setLoading(false);
    } catch (err: any) {
      if (messageInterval) clearInterval(messageInterval);
      setMessageInterval(null);
      setError(err.message || "Something went wrong.");
      setLoading(false);
    }
  };

  const handleRegenerate = async () => {
    if (!proposalData) return;

    setRegenerateDialogOpen(false);
    setLoading(true);
    setError("");
    cycleLoadingMessages();

    try {
      // Assume you store the proposal ID somewhere, e.g., in sessionStorage
      const proposalId = sessionStorage.getItem("proposalId");
      if (!proposalId) throw new Error("Proposal ID not found.");

      const res = await fetch(`${API_BASE_URL}/${proposalId}/update-and-regenerate`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updatedData: proposalData }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to regenerate proposal.");
      }

      // Update PDF URL
      setGeneratedPdfUrl(data.pdfUrl);
      sessionStorage.setItem("proposalPdfUrl", data.pdfUrl);
      setLoading(false);

    } catch (err: any) {
      if (messageInterval) clearInterval(messageInterval);
      setMessageInterval(null);
      setError(err.message || "Something went wrong.");
      setLoading(false);
    }
  };

  // const handleLoadHistoryPrompt = (item: PromptHistoryItem) => {
  //   setPrompt(item.prompt);
  //   setEditedPrompt(item.prompt);
  //   if (item.pdfUrl) setGeneratedPdfUrl(item.pdfUrl);
  //   if (item.title) setProposalTitle(item.title);
  //   sessionStorage.setItem("proposalPrompt", item.prompt);
  //   if (item.pdfUrl) sessionStorage.setItem("proposalPdfUrl", item.pdfUrl);
  //   setHistoryExpanded(false);
  // };

  // const handleDeleteHistory = (id: string) => {
  //   const updatedHistory = promptHistory.filter((item) => item.id !== id);
  //   setPromptHistory(updatedHistory);
  //   localStorage.setItem("proposalHistory", JSON.stringify(updatedHistory));
  // };

  const handleCopyPrompt = (text: string) => {
    navigator.clipboard.writeText(text);
  };

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

  const currentSection = pageMap.find(
    (p) =>
      currentPageIndex + 1 >= p.startPage &&
      currentPageIndex + 1 <= p.endPage
  );


  return (
    <Box sx={{ minHeight: "100vh", py: 4, px: { xs: 2, md: 4 } }}>
      {/* Header */}
      <Box sx={{ maxWidth: "1600px", mx: "auto", mb: 4 }}>
        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "stretch", sm: "center" }} spacing={2}>
          <Button startIcon={<ArrowBack />} onClick={() => router.push("/tools/prompt-to-proposal")} sx={{ color: "#6C2BD9", fontWeight: 600 }}>
            Back to Tool
          </Button>

          <Stack direction="row" spacing={2} flexWrap="wrap">
            <Button variant="outlined" startIcon={<Edit />} onClick={handleRegenerate} disabled={loading} sx={{ borderColor: "#6C2BD9", color: "#6C2BD9", fontWeight: 600 }}>
              UPDATE
            </Button>

            {generatedPdfUrl && (
              <Button variant="contained" startIcon={<Download />} component="a" href={generatedPdfUrl} target="_blank" download={`${proposalTitle || "proposal"}.pdf`} sx={{ bgcolor: "#6C2BD9", fontWeight: 600 }}>
                Download PDF
              </Button>
            )}
          </Stack>
        </Stack>
      </Box>

      {/* Main Content */}
<Box
  sx={{
    display: "grid",
    gridTemplateColumns: { xs: "1fr", lg: "420px 1fr" },
    gap: 3,
  }}
>
  {/* LEFT PANEL */}
  {/* <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
    <CurrentPrompt prompt={prompt} title={proposalTitle} />

    <PromptHistory
      history={promptHistory}
      expanded={historyExpanded}
      onToggleExpand={() => setHistoryExpanded(!historyExpanded)}
      onLoadPrompt={handleLoadHistoryPrompt}
      onDeletePrompt={handleDeleteHistory}
      onCopyPrompt={handleCopyPrompt}
      formatDate={formatDate}
    />

    {loading && <LoadingPanel message={loadingMessage} />}

    {error && (
      <Alert
        severity="error"
        action={
          <Button startIcon={<Refresh />} onClick={() => generateProposal(prompt)}>
            Retry
          </Button>
        }
      >
        {error}
      </Alert>
    )}
  </Box> */}

  {/* CENTER: PDF VIEWER */}
  <Box sx={{ height: "80vh" }}>
    {generatedPdfUrl ? (
      <PDFViewer
        pdfUrl={generatedPdfUrl}
        currentPageIndex={currentPageIndex}
        onPageChange={handlePageChange}
      />
    ) : (
      !loading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            color: "#9e9e9e",
          }}
        >
          No Proposal Generated Yet.
        </Box>
      )
    )}
  </Box>

  {/* RIGHT PANEL: EDITABLE PROPOSAL DATA */}
  <Box>
    {proposalData && (
      <ProposalDataPanel
        currentSectionId={currentSection?.id}
        data={proposalData}
        onChange={(updated) => {
          setProposalData(updated);
          sessionStorage.setItem("proposalData", JSON.stringify(updated));
        }}
      />
    )}
  </Box>
</Box>
    </Box>
  );
}
