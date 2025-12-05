"use client";
import Header from '@/app/components/headers-navbar/Header'
import { useSearchParams } from "next/navigation";
import { Box, Button, Typography } from "@mui/material";

export default function Viewer() {
    const searchParams = useSearchParams();
    const title = searchParams.get("title") || "Untitled eBook";
    const pdfUrl = typeof window !== "undefined" ? sessionStorage.getItem("ebookPdfUrl") : null;
    // const pdfUrl = '/major_ai_companies_ebook.pdf';

    return (
        <>
            <Header />
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    p: 4,
                    width: "100%",
                    minHeight: "90vh",
                }}
            >
                {pdfUrl ? (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            // alignItems: "flex-start",
                            width: "100%",
                            maxWidth: "1200px", // adjust for wider layout
                            gap: 4,
                        }}
                    >
                        {/* Left side: Title + Download */}
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                minWidth: "250px",
                            }}
                        >
                            <Typography
                                variant="h3"
                                sx={{
                                    fontWeight: 700,
                                    mb: 2,
                                    color: "#2C2C2C",
                                    lineHeight: 1.2,
                                }}
                            >                                
                            {title}
                            </Typography>
                            <Button
                                variant="contained"
                                sx={{ borderRadius: "30px", minWidth: "200px" }}
                                onClick={() => {
                                    const a = document.createElement("a");
                                    a.href = pdfUrl;
                                    a.download = `${title}.pdf`;
                                    a.click();
                                }}
                            >
                                Download PDF
                            </Button>
                        </Box>

                        {/* Right side: PDF */}
                        <Box
                            sx={{
                                flex: 1,
                                display: "flex",
                                justifyContent: "center",
                                bgcolor: "transparent",
                            }}
                        >
                            <iframe
                                src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0&zoom=page-fit`}
                                style={{
                                    width: "100%",
                                    height: "90vh",
                                    border: "none",
                                    overflow: "hidden",
                                    display: "block",
                                }}
                            />
                        </Box>
                    </Box>
                ) : (
                    <p>No PDF available</p>
                )}
            </Box>
        </>
    );
}