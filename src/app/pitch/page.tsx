"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import jsPDF from "jspdf";
import { Stage, Layer } from "react-konva";
import { usePitch } from "@/app/context/PitchContext";
import { processKonvaElements } from "../../utils/imageLoaderUtils";
import { motion, AnimatePresence } from "framer-motion";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { Typography } from "@mui/material";

// Components
import Header from "@/app/components/headers-navbar/Header";
import Footer from "@/app/components/home/Footer";
import SlideRenderer from "./components/SlideRenderer";
import SlideNavigation from "./components/SlideNavigation";
import SlideModifier from "./components/SlideModifier";

const API_BASE_URL = process.env.NEXT_PUBLIC_PITCH_DECK_BASE_URL;

export default function SlidePage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                    <p className="text-gray-500 font-medium text-lg">Loading presentation...</p>
                </div>
            </div>
        }>
            <SlideContent />
        </Suspense>
    );
}

function SlideContent() {
    const { pitch, setPitch } = usePitch();
    const [currentIndex, setCurrentIndex] = useState(0);
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const [loading, setLoading] = useState(false);
    const [regenerating, setRegenerating] = useState(false);
    const [editPrompt, setEditPrompt] = useState("");
    const [exporting, setExporting] = useState(false);
    const stageRef = useRef<any>(null);

    const handleExportPDF = async () => {
        if (!pitch || !stageRef.current) return;
        setExporting(true);

        try {
            const pdf = new jsPDF({
                orientation: "landscape",
                unit: "px",
                format: [1200, 600],
            });

            const originalIndex = currentIndex;
            for (let i = 0; i < pitch.slides.length; i++) {
                setCurrentIndex(i);
                await new Promise((r) => setTimeout(r, 150)); // Wait for render
                
                // Use JPEG with quality 0.8 to significantly reduce file size
                const dataUrl = stageRef.current.toDataURL({ 
                    pixelRatio: 1.5, // Reduced from 2 for better balance
                    mimeType: "image/jpeg",
                    quality: 0.8
                });

                if (i > 0) pdf.addPage([1200, 600], "landscape");
                
                // Add as JPEG with FAST compression
                pdf.addImage(dataUrl, "JPEG", 0, 0, 1200, 600, undefined, "FAST");
            }
            setCurrentIndex(originalIndex);
            pdf.save(`${pitch.topic || "presentation"}.pdf`);
        } catch (err) {
            console.error("Export failed:", err);
            alert("Export failed. Please try again.");
        } finally {
            setExporting(false);
        }
    };

    const handleRegenerateSlide = async () => {
        if (!id || !editPrompt) return;

        setRegenerating(true);
        try {
            const slideNumber = pitch?.slides[currentIndex].slideNumber || (currentIndex + 1);

            const response = await axios.patch(`${API_BASE_URL}/api/deck/${id}/slide/${slideNumber}`, {
                prompt: editPrompt
            });

            if (response.data.success && response.data.slide) {
                const updatedSlide = response.data.slide;
                await processKonvaElements(updatedSlide.konvaElements);

                const updatedPitch = {
                    ...pitch!,
                    slides: pitch!.slides.map((s, idx) =>
                        idx === currentIndex ? updatedSlide : s
                    )
                };
                setPitch(updatedPitch);
                setEditPrompt("");
                alert("Slide regenerated successfully!");
            }
        } catch (error) {
            console.error("Error regenerating slide:", error);
            alert("Failed to regenerate slide. Please try again.");
        } finally {
            setRegenerating(false);
        }
    };

    useEffect(() => {
        if (id && !pitch && !loading) {
            const fetchPitch = async () => {
                setLoading(true);
                try {
                    const response = await axios.get(`${API_BASE_URL}/api/deck/${id}`);
                    if (response.data) {
                        setPitch(response.data);
                    }
                } catch (error) {
                    console.error("Error fetching pitch deck:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchPitch();
        }
    }, [id, pitch, setPitch, loading]);

    useEffect(() => {
        const hasUnprocessedImages = (elements: any[]): boolean => {
            return elements.some(el => {
                if (el.type === 'Image' && el.image && typeof el.image === 'string') return true;
                if (el.type === 'Group' && el.children) return hasUnprocessedImages(el.children);
                return false;
            });
        };

        const needsProcessing = pitch?.slides.some(slide => hasUnprocessedImages(slide.konvaElements));

        if (pitch && needsProcessing) {
            (async () => {
                const newPitch = {
                    ...pitch,
                    slides: pitch.slides.map(slide => ({
                        ...slide,
                        konvaElements: slide.konvaElements.map((el: any) => ({ ...el }))
                    }))
                };

                let anImageFailed = false;

                for (const slide of newPitch.slides) {
                    try {
                        await processKonvaElements(slide.konvaElements);
                    } catch (err) {
                        anImageFailed = true;
                    }
                }

                if (anImageFailed) {
                    alert("Some images may not have loaded correctly. Check the console for details.");
                }
                setPitch(newPitch);
            })();
        }
    }, [pitch, setPitch]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 text-gray-500">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                    <p className="font-medium text-lg">Loading your pitch deck...</p>
                </div>
            </div>
        );
    }

    if (!pitch || pitch.slides.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
                    <p className="text-gray-500 text-lg font-medium">No pitch data found</p>
                    <button className="mt-4 text-purple-600 font-semibold" onClick={() => window.history.back()}>Go Back</button>
                </div>
            </div>
        );
    }

    const slide = pitch.slides[currentIndex];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center">
            <div className="w-full">
                <Header />
            </div>

            <main className="flex-1 flex flex-col gap-16 py-12 px-6 lg:p-12 max-w-[1300px] w-full items-center">
                {/* Top: Slide and Controls */}
                <div className="w-full flex flex-col items-center min-w-0">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full bg-white rounded-[3rem] shadow-2xl shadow-purple-500/10 border border-purple-50 overflow-hidden relative"
                    >
                        <div className="aspect-[16/8] w-full overflow-hidden flex items-center justify-center bg-gray-50/50">
                            {/* Scaled Stage Container with Better Responsiveness */}
                            <div className="flex items-center justify-center scale-[0.45] sm:scale-[0.55] md:scale-[0.75] lg:scale-[0.85] xl:scale-[1.0] transition-transform duration-500 ease-out">
                                <div className="shadow-2xl shadow-black/10 rounded-lg overflow-hidden border border-gray-200">
                                    <Stage
                                        width={1200}
                                        height={600}
                                        ref={stageRef}
                                        style={{ backgroundColor: "#FFFFFF" }}
                                    >
                                        <Layer>
                                            <AnimatePresence mode="wait">
                                                {slide.konvaElements.map((el: any, idx: number) => (
                                                    <SlideRenderer key={`${currentIndex}-${idx}`} element={el} />
                                                ))}
                                            </AnimatePresence>
                                        </Layer>
                                    </Stage>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Navigation and Info Bar */}
                    <div className="mt-10 flex flex-col lg:flex-row items-center justify-between w-full max-w-5xl px-6 gap-8">
                        <div className="flex items-center gap-4 min-w-[200px]">
                            <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 font-black text-xl">
                                {currentIndex + 1}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Active Slide</span>
                            </div>
                             <div className="flex-1 flex justify-center">
                            <SlideNavigation
                                currentIndex={currentIndex}
                                slideCount={pitch.slides.length}
                                exporting={exporting}
                                onPrev={() => setCurrentIndex((i) => i - 1)}
                                onNext={() => setCurrentIndex((i) => i + 1)}
                            />
                        </div>
                                                <button
                            onClick={handleExportPDF}
                            disabled={exporting}
                            className="flex items-center gap-3 px-8 py-4 bg-white text-gray-700 border-2 border-gray-100 rounded-[1.5rem] hover:border-purple-200 hover:bg-purple-50/30 transition-all duration-300 shadow-sm disabled:opacity-50 font-bold group min-w-[200px] justify-center"
                        >
                            <PictureAsPdfIcon className="text-red-500 transition-transform group-hover:scale-110" />
                            {exporting ? "Preparing..." : "Download PDF"}
                        </button>
                        </div>



                    </div>
                </div>

                {/* Bottom: AI Editor Panel */}
                <div className="w-full max-w-5xl flex flex-col items-center">
                    <Typography
                        variant="h2"
                        sx={{
                            fontWeight: 700,
                            mb: 1,
                            color: "rgba(26, 26, 26, 1)",
                            fontSize: { xs: "24px", md: "40px" },
                            textAlign: "center"
                        }}
                    >
                        AI Slide Editor
                    </Typography>

                    <Typography
                        sx={{
                            color: "rgba(109, 109, 109, 1)",
                            maxWidth: 600,
                            mb: 6,
                            fontSize: { xs: "0.875rem", md: "16px" },
                            textAlign: "center"
                        }}
                    >
                        Refine your slides instantly using AI. Just describe your changes or use our smart suggestions.
                    </Typography>

                    <div className="w-full flex flex-col md:flex-row gap-8 items-stretch">
                        <div className="flex-1 w-full">
                            <SlideModifier
                                editPrompt={editPrompt}
                                regenerating={regenerating}
                                setEditPrompt={setEditPrompt}
                                onRegenerate={handleRegenerateSlide}
                            />
                        </div>

                        {/* <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="w-full md:w-80 bg-gradient-to-br from-purple-50 to-indigo-50 p-8 rounded-[2rem] border border-purple-100 shadow-sm flex flex-col justify-center shrink-0"
                        >
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                                <h4 className="text-purple-900 font-extrabold text-sm uppercase tracking-wider">Editor Guide</h4>
                            </div>
                            <ul className="text-xs text-purple-700/70 space-y-4 font-medium">
                                <li className="flex items-start gap-3">
                                    <span className="text-purple-400 font-bold">01.</span>
                                    <span>Type specific instructions like "Add a 3-point list about market size"</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-purple-400 font-bold">02.</span>
                                    <span>Use "Smart Suggestions" for instant layout and color updates</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-purple-400 font-bold">03.</span>
                                    <span>Changes are applied instantly to the current slide</span>
                                </li>
                            </ul>
                        </motion.div> */}
                    </div>
                </div>
            </main>

            <div className="w-full">
                <Footer />
            </div>
        </div>
    );
}
