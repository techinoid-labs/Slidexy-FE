import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/**
 * Export slides as PDF by capturing the HTML elements directly.
 * Works for both visible and hidden slides by cloning them to a temporary container.
 */
export const exportSlidesAsPDF = async (
  slides: any[]
) => {
  const slidesCount = slides.length;
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

      // CRITICAL: Wait for fonts to be ready before each capture
      if (document.fonts) {
        await document.fonts.ready;
      }

      // Small delay to ensure layout stabilizer
      await new Promise(r => setTimeout(r, 100));

      try {
        const canvas = await html2canvas(container, {
          scale: 2, // Sufficient quality while reducing file size
          useCORS: true,
          width: WIDTH,
          height: HEIGHT,
          backgroundColor: "#ffffff",
          logging: false,
          onclone: (clonedDoc) => {
            // Ensure all text elements in the clone have explicitly handled line-height
            const textNodes = clonedDoc.querySelectorAll('p, div, h1, h2, h3, h4, span');
            textNodes.forEach((node: any) => {
              if (node.style) {
                // Force better rendering for html2canvas
                node.style.letterSpacing = 'normal';
              }
            });
          }
        });

        // Use JPEG with 0.75 quality to significantly reduce file size
        const imgData = canvas.toDataURL("image/jpeg", 0.75);

        if (addedPages > 0) {
          pdf.addPage([WIDTH, HEIGHT]);
        }

        // Add as JPEG with FAST compression
        pdf.addImage(imgData, "JPEG", 0, 0, WIDTH, HEIGHT, undefined, 'FAST');
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