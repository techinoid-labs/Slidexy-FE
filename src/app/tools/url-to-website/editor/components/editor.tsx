"use client";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { Box, Paper, Stack, Typography, IconButton, Drawer, Button, CircularProgress, Alert } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import FolderIcon from "@mui/icons-material/Folder";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DownloadIcon from "@mui/icons-material/Download";
import AIEditorPanel from './AIEditorPanel';
import { useAIEditor } from './useAIEditor';
import { CLICK_LISTENER_SCRIPT } from './clickInjector';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface FileData {
    type: string;
    content: string;
}

interface WebsiteData {
    presentationId: string;
    topic: string;
    sourceUrl: string;
    folderName: string;
    files: FileData[];
    zipUrl?: string;
}

interface EditorProps {
    presentationId: string;
}

export default function RightPanel({ presentationId }: EditorProps) {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selected, setSelected] = useState<string>("code");
    const [websiteData, setWebsiteData] = useState<WebsiteData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedFile, setSelectedFile] = useState<FileData | null>(null);
    const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(["root"]));
    const [fullPreview, setFullPreview] = useState(false);
    const [selectionMode, setSelectionMode] = useState(false); // Default OFF
    const iframeWindowRef = React.useRef<Window | null>(null); // Store active iframe window from handshake

    // AI Editor Hook
    const {
        loading: aiLoading,
        history,
        clickedElementId,
        setClickedElementId,
        editWebsite,
        handleIframeMessage
    } = useAIEditor({
        presentationId,
        onSuccess: (newFiles) => {
            // Optimistically update file content if returned, or re-fetch
            if (newFiles && newFiles.length > 0) {
                // We need to merge new files into existing websiteData
                setWebsiteData(prev => {
                    if (!prev) return null;
                    return { ...prev, files: newFiles };
                });
                // Also update selected file if it was modified
                if (selectedFile) {
                    const updated = newFiles.find((f: FileData) => f.type === selectedFile.type);
                    if (updated) setSelectedFile(updated);
                }
            } else {
                fetchWebsiteData();
            }
        }
    });

    // Listen for iframe messages (Click-to-Edit & Handshake)
    useEffect(() => {
        const onMessage = (event: MessageEvent) => {
            // Handshake: If iframe script says it's ready, send current mode
            if (event.data && event.data.type === 'NEURO_EDITOR_READY') {
                console.log("⚡ Iframe Ready received. Syncing Selection Mode:", selectionMode);
                // Store the window reference for future toggles
                iframeWindowRef.current = event.source as Window;
                // Reply immediately
                iframeWindowRef.current?.postMessage({ type: 'TOGGLE_SELECTION', enabled: selectionMode }, '*');
            }
            // Delegate other messages to the hook logic
            handleIframeMessage(event);
        };

        window.addEventListener('message', onMessage);
        return () => window.removeEventListener('message', onMessage);
    }, [handleIframeMessage, selectionMode]);

    // Sync Selection Mode with Iframe (User Toggles)
    useEffect(() => {
        if (iframeWindowRef.current) {
            console.log("⚡ Sending Toggle to tracked iframe window:", selectionMode);
            iframeWindowRef.current.postMessage({ type: 'TOGGLE_SELECTION', enabled: selectionMode }, '*');
        } else {
            // Fallback to DOM query if handshake missed (e.g. reload)
            const iframe = document.querySelector('iframe');
            if (iframe && iframe.contentWindow) {
                iframe.contentWindow.postMessage({ type: 'TOGGLE_SELECTION', enabled: selectionMode }, '*');
            }
        }
    }, [selectionMode]);

    useEffect(() => {
        if (presentationId) {
            fetchWebsiteData();
        }
    }, [presentationId]);

    const fetchWebsiteData = async () => {
        try {
            setLoading(true);
            // Try fetching from the Website Generator endpoint (CEO New Feature) first
            // If that fails, we could try dynamic-website, but for now let's switch to the one the generator uses.
            const response = await fetch(`${API_BASE_URL}/api/website-generator/${presentationId}`);

            if (!response.ok) {
                throw new Error("Failed to fetch website data");
            }

            const result = await response.json();
            const actualData = result.data || result;

            if (!actualData.files || !Array.isArray(actualData.files)) {
                throw new Error("Invalid website data: missing files");
            }

            setWebsiteData(actualData);

            const htmlFile = actualData.files.find((f: FileData) => f.type === "html");
            if (htmlFile) {
                setSelectedFile(htmlFile);
            }
        } catch (err: any) {
            console.error("Error fetching website data:", err);
            setError(err.message || "Failed to load website data");
        } finally {
            setLoading(false);
        }
    };

    // NEW: Generate complete HTML with inline CSS and JS
    const generateCompleteHTML = () => {
        if (!websiteData) return "";

        const htmlFile = websiteData.files.find(f => f.type === "html");
        const cssFile = websiteData.files.find(f => f.type === "css");
        const jsFile = websiteData.files.find(f => f.type === "js");

        if (!htmlFile) return "";

        let htmlContent = htmlFile.content;

        // --- DETERMINISTIC ID INJECTION (Frontend Match) ---
        // We must apply the EXACT same logic as the backend to ensure IDs match.
        // Backend: websiteEditorService.js -> cheerio
        // Frontend: DOMParser
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlContent, "text/html");
            let idCounter = 1;

            // Selector MUST match backend exactly:
            // 'section, div, header, footer, nav, main, article, aside, h1, h2, h3, h4, h5, h6, p, ul, ol, li, form, table, img, span, a, button, i, strong, em, svg, path'
            const tags = ['section', 'div', 'header', 'footer', 'nav', 'main', 'article', 'aside', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'ul', 'ol', 'li', 'form', 'table', 'img', 'span', 'a', 'button', 'i', 'strong', 'em', 'svg', 'path'];
            const selector = tags.join(', ');

            const elements = doc.querySelectorAll(selector);
            elements.forEach((el) => {
                if (!el.id) {
                    const tagName = el.tagName.toLowerCase();
                    el.id = `neuro-${tagName}-${idCounter++}`;
                }
            });

            htmlContent = doc.documentElement.outerHTML;
        } catch (e) {
            console.warn("Frontend ID injection failed, falling back to raw HTML", e);
        }
        // ---------------------------------------------------

        let html = htmlContent;

        // Inject CSS inline
        if (cssFile) {
            html = html.replace(
                '<link rel="stylesheet" href="styles.css">',
                `<style>${cssFile.content}</style>`
            );
        }

        // Inject JS inline
        if (jsFile) {
            html = html.replace(
                '<script src="app.js"></script>',
                `<script>${jsFile.content}</script>`
            );
        }

        // Inject Click Listener Script for AI Editing
        if (selected === 'preview' || fullPreview) {
            if (html.includes('</body>')) {
                html = html.replace('</body>', CLICK_LISTENER_SCRIPT + '</body>');
            } else {
                html += CLICK_LISTENER_SCRIPT;
            }
        }

        return html;
    };

    const handleDownload = async () => {
        if (!websiteData?.zipUrl) {
            setError("Download URL not available");
            return;
        }

        try {
            window.open(websiteData.zipUrl, '_blank');
        } catch (err: any) {
            console.error("Download error:", err);
            setError("Failed to download website files");
        }
    };

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    const handleChange = (
        event: React.MouseEvent<HTMLElement>,
        newValue: string | null
    ) => {
        if (newValue !== null) setSelected(newValue);
    };

    const toggleFolder = (folderName: string) => {
        const newExpanded = new Set(expandedFolders);
        if (newExpanded.has(folderName)) {
            newExpanded.delete(folderName);
        } else {
            newExpanded.add(folderName);
        }
        setExpandedFolders(newExpanded);
    };

    const getFileIcon = (type: string) => {
        const icons: { [key: string]: string } = {
            html: "📄",
            css: "🎨",
            js: "⚡",
            readme: "📖",
        };
        return icons[type] || "📄";
    };

    const getFileName = (type: string) => {
        const names: { [key: string]: string } = {
            html: "index.html",
            css: "styles.css",
            js: "app.js",
            readme: "README.md",
        };
        return names[type] || `file.${type}`;
    };

    const ExplorerContent = (
        <Box sx={{ width: 260, bgcolor: "#fff", p: 2, height: "100%" }}>
            <Typography variant="subtitle1" fontWeight={600} mb={2}>
                Explorer
            </Typography>

            {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                    <CircularProgress size={30} />
                </Box>
            ) : websiteData ? (
                <Box sx={{ pl: 1 }}>
                    <Box>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                cursor: "pointer",
                                "&:hover": { bgcolor: "rgba(0,0,0,0.05)" },
                                p: 0.5,
                                borderRadius: 1,
                            }}
                            onClick={() => toggleFolder("root")}
                        >
                            {expandedFolders.has("root") ? <ExpandMoreIcon fontSize="small" /> : <ChevronRightIcon fontSize="small" />}
                            <FolderIcon fontSize="small" sx={{ mx: 0.5, color: "#FDB800" }} />
                            <Typography fontWeight={600}>{websiteData.topic || "website"}</Typography>
                        </Box>

                        {expandedFolders.has("root") && (
                            <Box sx={{ pl: 3, mt: 1 }}>
                                {websiteData.files.map((file, index) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            cursor: "pointer",
                                            p: 0.5,
                                            borderRadius: 1,
                                            bgcolor: selectedFile === file ? "rgba(108, 43, 217, 0.1)" : "transparent",
                                            "&:hover": { bgcolor: "rgba(0,0,0,0.05)" },
                                        }}
                                        onClick={() => setSelectedFile(file)}
                                    >
                                        <Typography sx={{ mr: 0.5 }}>{getFileIcon(file.type)}</Typography>
                                        <Typography fontSize={14}>{getFileName(file.type)}</Typography>
                                    </Box>
                                ))}
                            </Box>
                        )}
                    </Box>
                </Box>
            ) : (
                <Typography color="text.secondary">No files available</Typography>
            )}
        </Box>
    );

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <CircularProgress />
            </Box>
        );
    }

    // Full Preview Mode
    if (fullPreview) {
        return (
            <Box
                sx={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    bgcolor: "#000",
                    zIndex: 9999,
                }}
            >
                {/* Full Preview Header */}
                <Box
                    sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        p: 2,
                        bgcolor: "rgba(0, 0, 0, 0.8)",
                        backdropFilter: "blur(10px)",
                        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                        zIndex: 10000,
                    }}
                >
                    <Typography sx={{ color: "#fff", fontWeight: 600, fontSize: "18px" }}>
                        Full Preview Mode
                    </Typography>
                    <Button
                        onClick={() => setFullPreview(false)}
                        sx={{
                            color: "#fff",
                            textTransform: "none",
                            fontWeight: 600,
                            fontSize: "16px",
                            "&:hover": {
                                bgcolor: "rgba(255, 255, 255, 0.1)",
                            },
                        }}
                    >
                        ✕ Exit Preview
                    </Button>
                </Box>

                {/* Full Preview Iframe */}
                <Box sx={{ width: "100%", height: "100%", pt: "64px" }}>
                    {websiteData?.files.find(f => f.type === "html") ? (
                        <iframe
                            srcDoc={generateCompleteHTML()}
                            style={{
                                width: "100%",
                                height: "100%",
                                border: "none",
                            }}
                            title="Full Website Preview"
                            sandbox="allow-scripts allow-same-origin"
                        />
                    ) : (
                        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                            <Typography color="#fff">No preview available</Typography>
                        </Box>
                    )}
                </Box>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                maxWidth: "calc(100% - 48px)",
                height: "100vh",
                bgcolor: "#fff",
                p: 3,
                border: "1px solid rgba(231, 231, 231, 1)",
                mx: 3,
                mb: 2,
            }}
        >
            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
                    {error}
                </Alert>
            )}

            <Stack
                direction={{ xs: "row", sm: "row" }}
                justifyContent="space-between"
                alignItems="center"
                spacing={{ xs: 1, sm: 0 }}
                mb={3}
            >
                <ToggleButtonGroup
                    value={selected}
                    exclusive
                    onChange={handleChange}
                    sx={{
                        bgcolor: "rgba(246, 246, 246, 1)",
                        borderRadius: "8px",
                        p: 0.5,
                        mb: { xs: 1, sm: 0 },
                        width: { xs: "100%", sm: "auto" },
                    }}
                >
                    <ToggleButton
                        value="code"
                        sx={{
                            textTransform: "none",
                            borderRadius: "10px",
                            border: "none",
                            px: 2,
                            py: 1,
                            fontWeight: 500,
                            width: { xs: "50%", sm: "auto" },
                            "&.Mui-selected": {
                                bgcolor: "rgba(160,140,255,0.2)",
                            },
                        }}
                    >
                        {"Code </>"}
                    </ToggleButton>
                    <ToggleButton
                        value="preview"
                        sx={{
                            textTransform: "none",
                            borderRadius: "10px",
                            border: "none",
                            px: 2,
                            py: 1,
                            fontWeight: 500,
                            color: "grey.600",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 1,
                            width: { xs: "50%", sm: "auto" },
                            "&.Mui-selected": {
                                bgcolor: "rgba(160,140,255,0.2)",
                                color: "black",
                            },
                        }}
                    >
                        Preview
                        <Image src="/eye-icon.svg" alt="Preview Icon" width={18} height={18} />
                    </ToggleButton>
                </ToggleButtonGroup>

                {/* Action Buttons Group */}
                <Stack direction="row" spacing={1.5}>
                    <Button
                        variant="outlined"
                        onClick={handleDownload}
                        disabled={!websiteData?.zipUrl}
                        sx={{
                            textTransform: "none",
                            borderRadius: "30px",
                            border: "none",
                            px: { xs: 1, sm: 3 },
                            py: 1,
                            fontWeight: 500,
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            bgcolor: "rgba(242, 240, 255, 1)",
                            minWidth: { xs: 40, sm: "auto" },
                            justifyContent: "center",
                            "&:hover": {
                                bgcolor: "rgba(230, 226, 255, 1)",
                            },
                        }}
                    >
                        <Typography sx={{ display: { xs: "none", sm: "inline" } }}>
                            Download
                        </Typography>
                        <Image
                            src="/down-arrow.svg"
                            alt="Download Icon"
                            width={12}
                            height={12}
                        />
                    </Button>

                    <Button
                        variant="outlined"
                        onClick={() => setFullPreview(true)}
                        sx={{
                            textTransform: "none",
                            borderRadius: "30px",
                            border: "1px solid rgba(108, 43, 217, 0.3)",
                            px: { xs: 1, sm: 3 },
                            py: 1,
                            fontWeight: 500,
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            color: "rgba(108, 43, 217, 1)",
                            minWidth: { xs: 40, sm: "auto" },
                            justifyContent: "center",
                            "&:hover": {
                                bgcolor: "rgba(108, 43, 217, 0.05)",
                                borderColor: "rgba(108, 43, 217, 0.5)",
                            },
                        }}
                    >
                        <Typography sx={{ display: { xs: "none", sm: "inline" } }}>
                            Full Preview
                        </Typography>
                        <span style={{ fontSize: "18px" }}>⛶</span>
                    </Button>
                </Stack>
            </Stack>

            <Paper
                elevation={1}
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    width: "100%",
                    height: "78vh",
                    overflow: "hidden",
                    borderRadius: "16px",
                }}
            >
                <Box sx={{ display: { xs: "flex", sm: "none" }, p: 1 }}>
                    <IconButton onClick={toggleDrawer}>
                        <MenuIcon />
                    </IconButton>
                    <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer}>
                        {ExplorerContent}
                    </Drawer>
                </Box>

                <Box sx={{ display: { xs: "none", sm: "block" } }}>{ExplorerContent}</Box>

                <Box
                    sx={{
                        flex: 1,
                        bgcolor: "rgba(251, 250, 255, 1)",
                        border: "1px solid rgba(232, 228, 255, 1)",
                        overflow: "auto",
                    }}
                >
                    {selected === "code" ? (
                        <Box sx={{ p: 3 }}>
                            {selectedFile ? (
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary" mb={2}>
                                        {getFileName(selectedFile.type)}
                                    </Typography>
                                    <Box
                                        component="pre"
                                        sx={{
                                            bgcolor: "#1e1e1e",
                                            color: "#d4d4d4",
                                            p: 2,
                                            borderRadius: 2,
                                            overflow: "auto",
                                            fontSize: "14px",
                                            fontFamily: "monospace",
                                            maxHeight: "calc(78vh - 100px)",
                                        }}
                                    >
                                        <code>{selectedFile.content}</code>
                                    </Box>
                                </Box>
                            ) : (
                                <Typography color="text.secondary" textAlign="center" mt={4}>
                                    Select a file to view its content
                                </Typography>
                            )}
                        </Box>
                    ) : (
                        <Box sx={{ width: "100%", height: "100%" }}>
                            {websiteData?.files.find(f => f.type === "html") ? (
                                <iframe
                                    srcDoc={generateCompleteHTML()}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        border: "none",
                                    }}
                                    title="Website Preview"
                                    sandbox="allow-scripts allow-same-origin"
                                />
                            ) : (
                                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                                    <Typography color="text.secondary">No preview available</Typography>
                                </Box>
                            )}
                        </Box>
                    )}
                </Box>
            </Paper>
            {/* AI Editor Panel */}
            <AIEditorPanel
                history={history}
                isLoading={aiLoading}
                clickedElementId={clickedElementId}
                onClearSelection={() => setClickedElementId(null)}
                onSubmit={(prompt, image) => editWebsite(prompt, image)}
                selectionMode={selectionMode}
                onToggleSelection={() => setSelectionMode(!selectionMode)}
            />
        </Box>
    );
}