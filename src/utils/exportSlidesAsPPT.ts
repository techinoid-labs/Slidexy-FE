import PptxGenJS from "pptxgenjs";
import html2canvas from "html2canvas";

/**
 * Export slides as PowerPoint by capturing HTML visual state.
 * Uses html2canvas to screenshot each slide and places it as a full-slide image in PPT.
 * This ensures 100% visual fidelity (WYSIWYG).
 */
export async function exportSlidesAsPPT(slidesCount: number) {
  try {
    const pptx = new PptxGenJS();
    const pptFileName = localStorage.getItem("fileName") || "Presentation";

    // Set layout to match our 960x540 aspect ratio (16:9)
    pptx.defineLayout({ name: "WIDE", width: 10, height: 5.625 });
    pptx.layout = "WIDE";

    console.log(`[PPT Export] Starting export for ${slidesCount} slides...`);

    // Create a temporary container for rendering slides "off-screen"
    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.top = "0";
    container.style.left = "-10000px";
    container.style.width = "960px";
    container.style.height = "540px";
    container.style.overflow = "hidden";
    document.body.appendChild(container);

    let exportedCount = 0;

    for (let i = 0; i < slidesCount; i++) {
      // Find the actual slide node in the DOM
      const sourceNode = document.getElementById(`slide-node-${i}`);
      if (!sourceNode) {
        console.warn(`[PPT Export] Could not find DOM node for slide ${i}`);
        continue;
      }

      // Clone the node deeply
      const clone = sourceNode.cloneNode(true) as HTMLElement;

      // Reset styles for capture
      clone.style.transform = "none";
      clone.style.position = "absolute";
      clone.style.top = "0";
      clone.style.left = "0";
      clone.style.visibility = "visible";
      clone.style.opacity = "1";
      clone.style.border = "none";
      clone.style.boxShadow = "none";

      // Append to temp container
      container.innerHTML = "";
      container.appendChild(clone);

      try {
        const canvas = await html2canvas(container, {
          scale: 2, // 2x scale for better quality
          useCORS: true,
          width: 960,
          height: 540,
          backgroundColor: "#ffffff",
          logging: false,
        });

        const imgData = canvas.toDataURL("image/png");

        // Add slide to PPT
        const slide = pptx.addSlide();

        // Add the captured image covering the entire slide
        slide.addImage({
          data: imgData,
          x: 0,
          y: 0,
          w: 10,
          h: 5.625,
        });

        exportedCount++;
        console.log(`[PPT Export] Processed slide ${i + 1}/${slidesCount}`);

      } catch (err) {
        console.error(`[PPT Export] Failed to capture slide ${i}`, err);
      }
    }

    // Cleanup
    document.body.removeChild(container);

    if (exportedCount === 0) {
      throw new Error("No slides were successfully exported");
    }

    // Save file
    await pptx.writeFile({ fileName: `${pptFileName}.pptx` });
    console.log(`[PPT Export] Successfully saved ${pptFileName}.pptx`);

    return true;

  } catch (error) {
    console.error("[PPT Export] Fatal error:", error);
    alert("Failed to export PowerPoint. Please try again.");
    return false;
  }
}
