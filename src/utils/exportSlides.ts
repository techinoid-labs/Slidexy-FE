import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/**
 * Export slides as PDF by capturing the HTML elements directly.
 * Works for both visible and hidden slides by cloning them to a temporary container.
 */
export const exportSlidesAsPDF = async (
  slidesCount: number
) => {
  try {
    const WIDTH = 960;
    const HEIGHT = 540;
    const pdfFileName = localStorage.getItem("fileName") || "presentation";

    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [WIDTH, HEIGHT],
    });

    // Create a temporary container for rendering slides "off-screen" but visible
    // html2canvas requires elements to be in the DOM and visible (not display:none)
    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.top = "0";
    container.style.left = "-10000px";
    container.style.width = `${WIDTH}px`;
    container.style.height = `${HEIGHT}px`;
    container.style.overflow = "hidden";
    document.body.appendChild(container);

    let addedPages = 0;

    for (let i = 0; i < slidesCount; i++) {
      // Find the actual slide node in the DOM
      const sourceNode = document.getElementById(`slide-node-${i}`);
      if (!sourceNode) {
        console.warn(`[PDF Export] Could not find DOM node for slide ${i}`);
        continue;
      }

      // Clone the node deeply
      const clone = sourceNode.cloneNode(true) as HTMLElement;

      // Reset any transform/positioning styles that might interfere
      clone.style.transform = "none";
      clone.style.position = "absolute";
      clone.style.top = "0";
      clone.style.left = "0";
      clone.style.visibility = "visible";
      clone.style.opacity = "1";
      clone.style.border = "none"; // Remove selection borders if any
      clone.style.boxShadow = "none";

      // Append to our temp container
      container.innerHTML = ""; // Clear previous
      container.appendChild(clone);

      // Wait a moment for images/fonts to be ready in the clone could help, 
      // but usually immediate capture works if source was already loaded.
      // If issues arise, we can await document.fonts.ready or image loading.

      try {
        const canvas = await html2canvas(container, {
          scale: 2, // Higher quality
          useCORS: true, // For cross-origin images
          width: WIDTH,
          height: HEIGHT,
          backgroundColor: "#ffffff",
          logging: false
        });

        const imgData = canvas.toDataURL("image/png");

        if (addedPages > 0) {
          pdf.addPage([WIDTH, HEIGHT]);
        }

        pdf.addImage(imgData, "PNG", 0, 0, WIDTH, HEIGHT);
        addedPages++;
        console.log(`[PDF Export] Processed slide ${i + 1}/${slidesCount}`);

      } catch (err) {
        console.error(`[PDF Export] Failed to capture slide ${i}`, err);
      }
    }

    // Cleanup
    document.body.removeChild(container);

    if (addedPages === 0) {
      throw new Error("No slides were successfully exported");
    }

    pdf.save(`${pdfFileName}.pdf`);
    return true;

  } catch (error) {
    console.error("[PDF Export] Fatal error:", error);
    alert("Failed to export PDF. Please try again.");
    return false;
  }
};