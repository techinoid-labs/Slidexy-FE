import PptxGenJS from "pptxgenjs";
import html2canvas from "html2canvas";
import { OffscreenSlideStage } from "./offscreenSlideStage";

/**
 * Export slides as PowerPoint.
 *
 * Each slide is rendered into a dedicated off-screen stage and placed as a
 * full-bleed image, so the .pptx matches the editor exactly.
 *
 * Note: this produces a picture-per-slide deck. Text is not editable in
 * PowerPoint. A native-shape export is tracked separately.
 */
/** Matches the PDF exporter: 1920x1080 per slide, JPEG rather than PNG. */
const EXPORT_SCALE = 2;
const EXPORT_JPEG_QUALITY = 0.92;

export async function exportSlidesAsPPT(slides: any[], theme?: any) {
  const slidesCount = slides.length;
  const WIDTH = 960;
  const HEIGHT = 540;

  if (slidesCount === 0) {
    console.warn("[PPT Export] No slides to export");
    return false;
  }

  let stage: OffscreenSlideStage | null = null;

  try {
    const pptx = new PptxGenJS();
    const pptFileName = localStorage.getItem("fileName") || "Presentation";

    const resolvedTheme = theme ?? readPersistedTheme();

    pptx.defineLayout({ name: "WIDE", width: 10, height: 5.625 });
    pptx.layout = "WIDE";

    console.log(`[PPT Export] Starting export for ${slidesCount} slides...`);

    stage = new OffscreenSlideStage(WIDTH, HEIGHT);

    let exportedCount = 0;

    for (let i = 0; i < slidesCount; i++) {
      try {
        const node = await stage.render(slides[i], resolvedTheme);

        const canvas = await html2canvas(node, {
          scale: EXPORT_SCALE,
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

        const imgData = canvas.toDataURL("image/jpeg", EXPORT_JPEG_QUALITY);

        const pptSlide = pptx.addSlide();
        pptSlide.addImage({
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

    if (exportedCount === 0) {
      throw new Error("No slides were successfully exported");
    }

    await pptx.writeFile({ fileName: `${pptFileName}.pptx` });
    console.log(`[PPT Export] Successfully saved ${pptFileName}.pptx`);

    return true;
  } catch (error) {
    console.error("[PPT Export] Fatal error:", error);
    alert("Failed to export PowerPoint. Please try again.");
    return false;
  } finally {
    stage?.destroy();
  }
}

function readPersistedTheme(): any {
  try {
    const raw = localStorage.getItem("slidesTheme");
    return raw ? JSON.parse(raw) : undefined;
  } catch {
    return undefined;
  }
}
