import jsPDF from "jspdf";

// EXPORT CANVAS AS PDF
export const exportSlidesAsPDF = async (
  canvasRefs: (HTMLCanvasElement | null)[]
) => {
  const WIDTH = 920;
  const HEIGHT = 430;

  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "px",
    format: [WIDTH, HEIGHT],
  });

  for (let i = 0; i < canvasRefs.length; i++) {
    const canvas = canvasRefs[i];
    if (!canvas) continue;
    const dataUrl = canvas.toDataURL("image/png");
    if (i > 0) pdf.addPage();
    pdf.addImage(dataUrl, "PNG", 0, 0, WIDTH, HEIGHT);
  }

  pdf.save("slides.pdf");
};
