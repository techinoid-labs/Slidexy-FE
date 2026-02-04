"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import jsPDF from "jspdf";
import PptxGenJS from "pptxgenjs";
import {
    Stage, Layer, Rect, Circle, Ellipse, Line, Text,
    TextPath, Image as KonvaImage, RegularPolygon, Star,
    Ring, Arc, Wedge, Arrow, Label, Tag, Group, Path
} from "react-konva";
import { getSlideDimensions } from "../../utils/slideUtils";
import { KonvaElement } from "./types";
import { usePitch } from "@/app/context/PitchContext";
import { processKonvaElements } from "../../utils/imageLoaderUtils";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function SlidePage() {
    return (
        <Suspense fallback={<div style={{ color: "white", padding: "24px" }}>Loading...</div>}>
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

    const handleExport = async (format: "pdf" | "pptx" | "png") => {
        if (!pitch || !stageRef.current) return;
        setExporting(true);

        try {
            if (format === "png") {
                const dataUrl = stageRef.current.toDataURL();
                const link = document.createElement("a");
                link.download = `slide-${currentIndex + 1}.png`;
                link.href = dataUrl;
                link.click();
            } else if (format === "pdf") {
                const pdf = new jsPDF({
                    orientation: "landscape",
                    unit: "px",
                    format: [1200, 600],
                });

                const originalIndex = currentIndex;
                for (let i = 0; i < pitch.slides.length; i++) {
                    setCurrentIndex(i);
                    await new Promise((r) => setTimeout(r, 150)); // Wait for render
                    const dataUrl = stageRef.current.toDataURL({ pixelRatio: 2 });
                    if (i > 0) pdf.addPage([1200, 600], "landscape");
                    pdf.addImage(dataUrl, "PNG", 0, 0, 1200, 600);
                }
                setCurrentIndex(originalIndex);
                pdf.save(`${pitch.topic || "presentation"}.pdf`);
            } else if (format === "pptx") {
                const pptx = new PptxGenJS();
                pptx.layout = "LAYOUT_16x9";

                const originalIndex = currentIndex;
                for (let i = 0; i < pitch.slides.length; i++) {
                    setCurrentIndex(i);
                    await new Promise((r) => setTimeout(r, 150)); // Wait for render
                    const dataUrl = stageRef.current.toDataURL({ pixelRatio: 2 });
                    const slide = pptx.addSlide();
                    slide.addImage({ data: dataUrl, x: 0, y: 0, w: 10, h: 5.625 });
                }
                setCurrentIndex(originalIndex);
                pptx.writeFile({ fileName: `${pitch.topic || "presentation"}.pptx` });
            }
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
            // slideNumber in backend seems to be 1-indexed or based on how you store it. 
            // Most likely it matches current slide index + 1 or the slideNumber property.
            const slideNumber = pitch?.slides[currentIndex].slideNumber || (currentIndex + 1);
            
            const response = await axios.patch(`${API_BASE_URL}/api/deck/${id}/slide/${slideNumber}`, {
                prompt: editPrompt
            });

            if (response.data.success && response.data.slide) {
                const updatedSlide = response.data.slide;
                
                // Process images if any in the new slide
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

    const { SLIDE_WIDTH, SLIDE_HEIGHT } = getSlideDimensions();

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
        return <div style={{ color: "white", padding: "24px" }}>Loading pitch deck...</div>;
    }

    if (!pitch || pitch.slides.length === 0) {
        return <div style={{ color: "white", padding: "24px" }}>No pitch data found</div>;
    }

    const slide = pitch.slides[currentIndex];

    const renderElement = (el: KonvaElement, idx: number) => {
        const baseProps = {
            key: idx,
            x: el.x,
            y: el.y,
            fill: el.fill,
            stroke: el.stroke,
            strokeWidth: el.strokeWidth,
            opacity: el.opacity,
            shadowColor: el.shadowColor,
            shadowBlur: el.shadowBlur,
            shadowOpacity: el.shadowOpacity,
            lineCap: el.lineCap,
            lineJoin: el.lineJoin,
            shadowOffset: el.shadowOffset,
            fillLinearGradientStartPoint: el.fillLinearGradientStartPoint,
            fillLinearGradientEndPoint: el.fillLinearGradientEndPoint,
            fillLinearGradientColorStops: el.fillLinearGradientColorStops,
        };

        switch (el.type) {
            case "Rect":
                return <Rect {...baseProps} width={el.width} height={el.height} cornerRadius={el.cornerRadius} />;

            case "Circle":
                return <Circle {...baseProps} radius={el.radius} />;

            case "Ellipse":
                return <Ellipse {...baseProps} radiusX={el.radiusX} radiusY={el.radiusY} />;

            case "Line":
                return <Line {...baseProps} points={el.points} />;

            case "Arrow":
                return <Arrow {...baseProps} points={el.points} pointerLength={el.pointerLength} pointerWidth={el.pointerWidth} />;

            case "Text":
                return (
                    <Text
                        {...baseProps}
                        text={el.text}
                        fontSize={el.fontSize}
                        fontFamily={el.fontFamily}
                        fontStyle={el.fontStyle}
                        align={el.align}
                        lineHeight={el.lineHeight}
                        letterSpacing={el.letterSpacing}
                        offsetY={el.offsetY}
                        width={el.width}
                    />
                );

            case "TextPath":
                return <TextPath {...baseProps} text={el.text} fontSize={el.fontSize} fontFamily={el.fontFamily} data={el.data} />;

            case "Image":
                return <KonvaImage {...baseProps} image={el.image} width={el.width} height={el.height} />;

            case "RegularPolygon":
                return <RegularPolygon {...baseProps} sides={el.sides} radius={el.radius} />;

            case "Star":
                return <Star {...baseProps} numPoints={el.numPoints} innerRadius={el.innerRadius} outerRadius={el.outerRadius} />;

            case "Ring":
                return <Ring {...baseProps} innerRadius={el.innerRadius} outerRadius={el.outerRadius} />;

            case "Arc":
                return <Arc {...baseProps} innerRadius={el.innerRadius} outerRadius={el.outerRadius} angle={el.angle} clockwise={el.clockwise} />;

            case "Wedge":
                return <Wedge {...baseProps} angle={el.angle} radius={el.radius} clockwise={el.clockwise} />;

            case "Path":
                return <Path {...baseProps} data={el.data} />;

            case "Label":
                return (
                    <Label {...baseProps}>
                        {el.tag && <Tag fill={el.tag.fill} stroke={el.tag.stroke} cornerRadius={el.tag.cornerRadius} />}
                        {el.text && (
                            <Text
                                text={el.text.text}
                                fontSize={el.text.fontSize}
                                fontFamily={el.text.fontFamily}
                                fontStyle={el.text.fontStyle}
                                align={el.text.align}
                                fill={el.text.fill}
                            />
                        )}
                    </Label>
                );

            case "Group":
                return (
                    <Group {...baseProps}>
                        {el.children?.map((child, i) => renderElement(child, i))}
                    </Group>
                );

            default:
                console.warn("Unknown Konva type:", el);
                return null;
        }
    };
    
    return (
        <div
            style={{
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                backgroundColor: "#1A1A1A",
                minHeight: "100vh",
                color: "white",
                fontFamily: "Arial, sans-serif",
            }}
        >
            {/* Slide Title */}
            <h1
                style={{
                    fontSize: "2rem",
                    fontWeight: 700,
                    marginBottom: "20px",
                    textAlign: "center",
                    color: "#F3F3F3",
                }}
            >
                {slide.title}
            </h1>

            {/* Konva Stage */}
            <div
                style={{
                    boxShadow: "0 8px 20px rgba(0,0,0,0.5)",
                    borderRadius: "12px",
                    overflow: "hidden",
                    marginBottom: "24px",
                }}
            >
                <Stage
                    width={1200}
                    height={600}
                    ref={stageRef}
                    style={{
                        border: "2px solid #555",
                        borderRadius: "12px",
                        backgroundColor: "#FFFFFF",
                    }}
                >
                    <Layer>{slide.konvaElements.map(renderElement)}</Layer>
                </Stage>
            </div>

            {/* Navigation & Export */}
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "20px",
                    width: "100%",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "16px",
                    }}
                >
                    <button
                        disabled={currentIndex === 0 || exporting}
                        onClick={() => setCurrentIndex((i) => i - 1)}
                        style={{
                            padding: "10px 20px",
                            fontSize: "16px",
                            fontWeight: 600,
                            borderRadius: "8px",
                            border: "none",
                            cursor: currentIndex === 0 || exporting ? "not-allowed" : "pointer",
                            backgroundColor: currentIndex === 0 || exporting ? "#555" : "#6C2BD9",
                            color: "white",
                            transition: "background-color 0.3s",
                        }}
                    >
                        Prev
                    </button>

                    <span style={{ fontSize: "16px", fontWeight: 500, color: "#DDD" }}>
                        {currentIndex + 1} / {pitch.slideCount}
                    </span>

                    <button
                        disabled={currentIndex === pitch.slideCount - 1 || exporting}
                        onClick={() => setCurrentIndex((i) => i + 1)}
                        style={{
                            padding: "10px 20px",
                            fontSize: "16px",
                            fontWeight: 600,
                            borderRadius: "8px",
                            border: "none",
                            cursor: currentIndex === pitch.slideCount - 1 || exporting ? "not-allowed" : "pointer",
                            backgroundColor:
                                currentIndex === pitch.slideCount - 1 || exporting ? "#555" : "#6C2BD9",
                            color: "white",
                            transition: "background-color 0.3s",
                        }}
                    >
                        Next
                    </button>
                </div>

                <div style={{ display: "flex", gap: "12px" }}>
                    <button
                        onClick={() => handleExport("png")}
                        disabled={exporting}
                        style={{
                            padding: "8px 16px",
                            backgroundColor: "#333",
                            color: "white",
                            border: "1px solid #555",
                            borderRadius: "6px",
                            cursor: exporting ? "not-allowed" : "pointer",
                            fontSize: "14px",
                        }}
                    >
                        Export PNG
                    </button>
                    <button
                        onClick={() => handleExport("pdf")}
                        disabled={exporting}
                        style={{
                            padding: "8px 16px",
                            backgroundColor: "#333",
                            color: "white",
                            border: "1px solid #555",
                            borderRadius: "6px",
                            cursor: exporting ? "not-allowed" : "pointer",
                            fontSize: "14px",
                        }}
                    >
                        {exporting ? "Exporting PDF..." : "Export PDF"}
                    </button>
                    <button
                        onClick={() => handleExport("pptx")}
                        disabled={exporting}
                        style={{
                            padding: "8px 16px",
                            backgroundColor: "#333",
                            color: "white",
                            border: "1px solid #555",
                            borderRadius: "6px",
                            cursor: exporting ? "not-allowed" : "pointer",
                            fontSize: "14px",
                        }}
                    >
                        {exporting ? "Exporting PPTX..." : "Export PPTX"}
                    </button>
                </div>
            </div>

            {/* Edit Prompt UI */}
            <div
                style={{
                    marginTop: "40px",
                    width: "100%",
                    maxWidth: "800px",
                    padding: "20px",
                    backgroundColor: "#2A2A2A",
                    borderRadius: "12px",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                }}
            >
                <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 600 }}>Modify this slide</h3>
                <p style={{ margin: 0, color: "#AAA", fontSize: "0.9rem" }}>
                    Describe how you want to change this specific slide (e.g., "Add more details about the revenue model" or "Change the layout to a 2-column list")
                </p>
                <div style={{ display: "flex", gap: "10px" }}>
                    <input
                        type="text"
                        value={editPrompt}
                        onChange={(e) => setEditPrompt(e.target.value)}
                        placeholder="Enter your instructions here..."
                        style={{
                            flex: 1,
                            padding: "12px 16px",
                            borderRadius: "8px",
                            border: "1px solid #444",
                            backgroundColor: "#1A1A1A",
                            color: "white",
                            fontSize: "16px",
                            outline: "none",
                        }}
                    />
                    <button
                        onClick={handleRegenerateSlide}
                        disabled={regenerating || !editPrompt}
                        style={{
                            padding: "12px 24px",
                            borderRadius: "8px",
                            border: "none",
                            backgroundColor: (regenerating || !editPrompt) ? "#555" : "#6C2BD9",
                            color: "white",
                            fontWeight: 600,
                            cursor: (regenerating || !editPrompt) ? "not-allowed" : "pointer",
                            transition: "background-color 0.2s",
                        }}
                    >
                        {regenerating ? "Regenerating..." : "Regenerate"}
                    </button>
                </div>
            </div>
        </div>
    );
}
