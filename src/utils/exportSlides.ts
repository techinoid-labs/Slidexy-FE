import jsPDF from "jspdf";

// EXPORT CANVAS AS PDF with improved quality and correct scale
export const exportSlidesAsPDF = async (
  canvasRefs: (HTMLCanvasElement | null)[]
) => {
  const WIDTH = 800;
  const HEIGHT = 400;
  const pdfFileName = localStorage.getItem("fileName");

  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "px",
    format: [WIDTH, HEIGHT],
  });

  const scaleFactor = 2; // higher = better quality

  for (let i = 0; i < canvasRefs.length; i++) {
    const canvas = canvasRefs[i];
    if (!canvas) continue;

    // Create a high-res copy of the canvas
    const offscreenCanvas = document.createElement("canvas");
    offscreenCanvas.width = WIDTH * scaleFactor;
    offscreenCanvas.height = HEIGHT * scaleFactor;

    const offCtx = offscreenCanvas.getContext("2d");
    if (!offCtx) continue;

    // Copy original canvas content using drawImage, which automatically scales
    offCtx.drawImage(
      canvas,
      0,
      0,
      offscreenCanvas.width,
      offscreenCanvas.height
    );

    const dataUrl = offscreenCanvas.toDataURL("image/png");

    if (i > 0) pdf.addPage();
    pdf.addImage(
      dataUrl,
      "PNG",
      0,
      0,
      WIDTH, // keep PDF size fixed
      HEIGHT
    );
  }

  pdf.save(`${pdfFileName}.pdf` || "slides.pdf");
};
 
