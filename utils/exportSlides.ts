import jsPDF from "jspdf";

// EXPORT CANVAS AS PDF
export const exportSlidesAsPDF = async (
  canvasRefs: (HTMLCanvasElement | null)[]
) => {
  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "px",
    format: [920, 430],
  });

  for (let i = 0; i < canvasRefs.length; i++) {
    const canvas = canvasRefs[i];
    if (!canvas) continue;
    const dataUrl = canvas.toDataURL("image/png");
    if (i > 0) pdf.addPage();
    pdf.addImage(dataUrl, "PNG", 0, 0, 920, 430);
  }

  pdf.save("slides.pdf");
};
