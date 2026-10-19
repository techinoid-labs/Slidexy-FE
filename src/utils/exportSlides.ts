import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { OffscreenSlideStage } from "./offscreenSlideStage";

/**
 * Export slides as PDF.
 *
 * Each slide is rendered into a dedicated off-screen stage rather than scraped
 * out of the editor's DOM — the editor only mounts the slide you are currently
 * viewing, and export should not depend on what happens to be on screen.
 */
/**
 * 2x gives 1920x1080 per slide — beyond what a projector or a PDF viewer
 * resolves, and a quarter of the pixels of the previous 3x.
 */
const EXPORT_SCALE = 2;
const EXPORT_JPEG_QUALITY = 0.92;

export interface PdfExportOptions {
  /**
   * "download" saves the file (the default). "blob" returns the bytes
   * instead, for callers that upload rather than save -- sharing the deck
   * to LinkedIn as a document carousel, for one.
   */
  output?: "download" | "blob";
  /** Render scale. 2 = 1920x1080. Higher is sharper and larger. */
  scale?: number;
  /** JPEG quality, 0..1. */
  jpegQuality?: number;
  onProgress?: (done: number, total: number) => void;
}

export const exportSlidesAsPDF = async (
  slides: any[],
  theme?: any,
  options?: PdfExportOptions
): Promise<boolean | Blob> => {
  const slidesCount = slides.length;
  const WIDTH = 960;
  const HEIGHT = 540;

  if (slidesCount === 0) {
    console.warn("[PDF Export] No slides to export");
    return false;
  }

  let stage: OffscreenSlideStage | null = null;

  try {
    const pdfFileName = localStorage.getItem("fileName") || "presentation";

    const resolvedTheme = theme ?? readPersistedTheme();

    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [WIDTH, HEIGHT],
      compress: true,
    });

    stage = new OffscreenSlideStage(WIDTH, HEIGHT);

    let addedPages = 0;

    for (let i = 0; i < slidesCount; i++) {
      try {
        const node = await stage.render(slides[i], resolvedTheme);

        const canvas = await html2canvas(node, {
          scale: options?.scale ?? EXPORT_SCALE,
          useCORS: true,
          width: WIDTH,
          height: HEIGHT,
          backgroundColor: "#ffffff",
          logging: false,
          onclone: (clonedDoc) => {
            const textNodes = clonedDoc.querySelectorAll(
              "p, div, h1, h2, h3, h4, span"
            );
            textNodes.forEach((node: any) => {
              if (node.style) {
                node.style.letterSpacing = "normal";
              }
            });
          },
        });

        // JPEG, not PNG. A full-bleed slide is photographic content: lossless
        // PNG pages were producing ~14 MB *per slide* (an 84 MB deck for six
        // slides), which is not something anyone can email.
        const imgData = canvas.toDataURL("image/jpeg", options?.jpegQuality ?? EXPORT_JPEG_QUALITY);

        if (addedPages > 0) {
          pdf.addPage([WIDTH, HEIGHT]);
        }

        pdf.addImage(imgData, "JPEG", 0, 0, WIDTH, HEIGHT, undefined, "FAST");
        addedPages++;
        options?.onProgress?.(addedPages, slidesCount);
        console.log(`[PDF Export] Processed slide ${i + 1}/${slidesCount}`);
      } catch (err) {
        console.error(`[PDF Export] Failed to capture slide ${i}`, err);
      }
    }

    if (addedPages === 0) {
      throw new Error("No slides were successfully exported");
    }

    if (options?.output === "blob") {
      return pdf.output("blob");
    }

    pdf.save(`${pdfFileName}.pdf`);
    return true;
  } catch (error) {
    console.error("[PDF Export] Fatal error:", error);
    alert("Failed to export PDF. Please try again.");
    return false;
  } finally {
    stage?.destroy();
  }
};

/**
 * The editor persists the active theme here; export falls back to it so callers
 * that predate the `theme` argument keep producing correctly themed output.
 */
function readPersistedTheme(): any {
  try {
    const raw = localStorage.getItem("slidesTheme");
    return raw ? JSON.parse(raw) : undefined;
  } catch {
    return undefined;
  }
}
