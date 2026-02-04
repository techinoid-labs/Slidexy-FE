"use client";

import { useEffect, useRef, useState } from "react";
import { Box, Button, Stack } from "@mui/material";

interface PDFViewerProps {
  pdfUrl: string;
  currentPageIndex: number;
  onPageChange: (newIndex: number) => void;
}

export default function PDFViewer({ pdfUrl, currentPageIndex, onPageChange }: PDFViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState(0);

  const renderTaskRef = useRef<any>(null);

  // Sync pageNumber with currentPageIndex (0-based to 1-based)
  useEffect(() => {
    setPageNumber(currentPageIndex + 1);
  }, [currentPageIndex]);

  useEffect(() => {
    let isMounted = true;

    const loadPdf = async () => {
      const pdfjs = await import("pdfjs-dist/build/pdf.mjs");
      const pdfjsWorker = await import("pdfjs-dist/build/pdf.worker.mjs");
      (pdfjs as any).GlobalWorkerOptions.workerSrc = pdfjsWorker.default || pdfjsWorker;

      const loadingTask = (pdfjs as any).getDocument(pdfUrl);
      const pdf = await loadingTask.promise;

      if (!isMounted) return;

      setPdfDoc(pdf);
      setNumPages(pdf.numPages);
      renderPage(1, pdf);
    };

    const renderPage = async (num: number, pdfInstance?: any) => {
      const pdfToUse = pdfInstance || pdfDoc;
      if (!pdfToUse || !canvasRef.current || !canvasContainerRef.current) return;

      if (renderTaskRef.current) renderTaskRef.current.cancel();

      const page = await pdfToUse.getPage(num);
      const viewport = page.getViewport({ scale: 1 });

      const containerWidth = canvasContainerRef.current.clientWidth;
      const scale = containerWidth / viewport.width;
      const scaledViewport = page.getViewport({ scale });

      const canvas = canvasRef.current;
      const context = canvas.getContext("2d")!;

      canvas.width = scaledViewport.width;
      canvas.height = scaledViewport.height;

      renderTaskRef.current = page.render({
        canvasContext: context,
        viewport: scaledViewport,
      });

      await renderTaskRef.current.promise;
      renderTaskRef.current = null;
    };

    loadPdf();

    return () => {
      isMounted = false;
      if (renderTaskRef.current) renderTaskRef.current.cancel();
    };
  }, [pdfUrl]);

  useEffect(() => {
    if (!pdfDoc) return;

    const renderCurrentPage = async () => {
      if (!pdfDoc || !canvasRef.current || !canvasContainerRef.current) return;

      if (renderTaskRef.current) renderTaskRef.current.cancel();

      const page = await pdfDoc.getPage(pageNumber);
      const viewport = page.getViewport({ scale: 1 });

      const containerWidth = canvasContainerRef.current.clientWidth;
      const scale = containerWidth / viewport.width;
      const scaledViewport = page.getViewport({ scale });

      const canvas = canvasRef.current;
      const context = canvas.getContext("2d")!;

      canvas.width = scaledViewport.width;
      canvas.height = scaledViewport.height;

      renderTaskRef.current = page.render({
        canvasContext: context,
        viewport: scaledViewport,
      });

      try {
        await renderTaskRef.current.promise;
      } catch (err: any) {
        if (err?.name !== "RenderingCancelledException") {
          console.error(err);
        }
      } finally {
        renderTaskRef.current = null;
      }
    };

    renderCurrentPage();
  }, [pageNumber, pdfDoc]);

  const handlePrev = () => {
    const newIndex = Math.max(currentPageIndex - 1, 0);
    onPageChange(newIndex);
  };

  const handleNext = () => {
    const newIndex = Math.min(currentPageIndex + 1, numPages - 1);
    onPageChange(newIndex);
  };

  return (
    <Box
      sx={{
        border: "1px solid #ccc",
        borderRadius: 2,
        p: 2,
        bgcolor: "#fff",
      }}
    >
      {/* Canvas container without padding */}
      <Box ref={canvasContainerRef} sx={{ width: "100%", overflow: "hidden" }}>
        <canvas
          ref={canvasRef}
          style={{ display: "block", maxWidth: "100%" }}
        />
      </Box>

      <Stack
        direction="row"
        spacing={2}
        justifyContent="center"
        alignItems="center"
        mt={2}
      >
        <Button
          onClick={handlePrev}
          disabled={currentPageIndex <= 0}
        >
          Prev
        </Button>

        <span>
          Page {pageNumber} of {numPages}
        </span>

        <Button
          onClick={handleNext}
          disabled={currentPageIndex >= numPages - 1}
        >
          Next
        </Button>
      </Stack>
    </Box>
  );
}
