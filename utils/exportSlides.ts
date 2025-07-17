import jsPDF from "jspdf";

// EXPORT CANVAS AS PDF
export const exportSlidesAsPDF = async (
  canvasRefs: (HTMLCanvasElement | null)[]
) => {
  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "px",
    format: [1280, 720],
  });

  for (let i = 0; i < canvasRefs.length; i++) {
    const canvas = canvasRefs[i];
    if (!canvas) continue;
    const dataUrl = canvas.toDataURL("image/png");
    if (i > 0) pdf.addPage();
    pdf.addImage(dataUrl, "PNG", 0, 0, 1280, 720);
  }

  pdf.save("slides.pdf");
};
