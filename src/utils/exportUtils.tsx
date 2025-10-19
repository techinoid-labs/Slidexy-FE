import { Presentation } from "../app/text-to-template/types/presentation";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import PptxGenJS from "pptxgenjs";  // Direct import from pptxgenjs

export const exportPresentationToPptx = async (presentation: Presentation) => {
  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_16x9";  // 16:9 aspect ratio for slides

  for (const slide of presentation.slides) {
    const pptSlide = pptx.addSlide();
    const slideElement = document.querySelector(`#slide-${slide.slide_id}`);
    if (slideElement) {
      // Capture the slide as a high-res canvas image
      const canvas = await html2canvas(slideElement as HTMLElement, {
        scale: 2,  // Higher DPI for quality
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',  // Ensure white background for export
      });
      const imgData = canvas.toDataURL("image/png");
      // Add the image to the PPT slide (units in inches; 10x5.625 for 16:9)
      pptSlide.addImage({ data: imgData, x: 0, y: 0, w: 10, h: 5.625 });
    } else {
      console.warn(`Slide element #slide-${slide.slide_id} not found for export.`);
    }
  }

  // Download the PPTX file
  pptx.writeFile({ fileName: `${presentation.id || "presentation"}.pptx` });
};

export const exportPresentationToPDF = async (presentation: Presentation) => {
  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "in",
    format: [10, 5.625],  // 16:9 aspect ratio
  });

  for (let i = 0; i < presentation.slides.length; i++) {
    const slide = presentation.slides[i];
    const slideElement = document.querySelector(`#slide-${slide.slide_id}`);
    if (slideElement) {
      const canvas = await html2canvas(slideElement as HTMLElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
      });
      const imgData = canvas.toDataURL("image/png");
      if (i > 0) pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, 0, 10, 5.625);
    } else {
      console.warn(`Slide element #slide-${slide.slide_id} not found for export.`);
    }
  }

  pdf.save(`${presentation.id || "presentation"}.pdf`);
};
