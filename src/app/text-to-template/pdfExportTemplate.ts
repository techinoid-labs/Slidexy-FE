import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { Presentation } from './types/presentation';

interface ExportOptions {
  filename: string;
  quality?: number;
  format?: 'presentation' | 'a4';
  orientation?: 'landscape' | 'portrait';
  pixelRatio?: number;
}

export const exportPresentationToPdf = async (
  presentation: Presentation,
  options: ExportOptions
): Promise<void> => {
  const {
    filename,
    quality = 5.0,
    format = 'presentation',
    orientation = 'landscape',
    pixelRatio = 500,
  } = options;

  const STAGE_WIDTH = 1280; // Increased from 960
  const STAGE_HEIGHT = 720; // Increased from 540

  const pdf = new jsPDF({
    orientation,
    unit: 'px',
    format: format === 'presentation' ? [STAGE_WIDTH, STAGE_HEIGHT] : 'a4',
    compress: false,
  });

  // Wait for all images to load
  const waitForImages = async (): Promise<void> => {
    const images = document.querySelectorAll('img');
    console.log(`Found ${images.length} images to load`);
    const loadPromises = Array.from(images).map(
      (img) =>
        new Promise((resolve) => {
          if (img.complete) {
            console.log(`Image already loaded: ${img.src}`);
            resolve(true);
          } else {
            img.onload = () => {
              console.log(`Image loaded: ${img.src}`);
              resolve(true);
            };
            img.onerror = () => {
              console.warn(`Failed to load image: ${img.src}`);
              resolve(false);
            };
          }
        })
    );
    await Promise.all(loadPromises);
  };

  // Ensure all slides are visible and within bounds
  const ensureSlideVisibility = () => {
    const slides = document.querySelectorAll('.slide-container');
    slides.forEach((slide, index) => {
      const slideElement = slide as HTMLElement;
      slideElement.style.visibility = 'visible';
      slideElement.style.opacity = '1';
      slideElement.style.display = 'block';
      slideElement.style.position = 'relative';
      slideElement.style.width = `${STAGE_WIDTH}px`;
      slideElement.style.height = `${STAGE_HEIGHT}px`;
      slideElement.style.overflow = 'hidden'; // Prevent content overflow
      console.log(`Ensured visibility for slide ${index}`);
    });
  };

  console.log('Starting PDF export process...');
  await waitForImages();
  ensureSlideVisibility();
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const slides = document.querySelectorAll('.slide-container');
  console.log(`Found ${slides.length} slide containers`);

  if (slides.length === 0) {
    throw new Error('No slides found for export');
  }

  for (let i = 0; i < slides.length; i++) {
    try {
      const slide = slides[i] as HTMLElement;
      const canvasElement = slide.querySelector('canvas');
      const htmlElement = slide.querySelector('[data-konva-html]');

      console.log(`Processing slide ${i}:`, {
        slideId: slide.getAttribute('data-slide-id') || `slide-${i}`,
        hasCanvas: !!canvasElement,
        hasHtml: !!htmlElement,
        stageAvailable: !!window.konvaStages?.[i],
      });

      if (!canvasElement && !htmlElement) {
        console.warn(`Slide ${i} has no renderable content`);
        continue;
      }

      let imgData: string;
      let imgWidth: number;
      let imgHeight: number;

      if (canvasElement && window.konvaStages?.[i]) {
        const stage = window.konvaStages[i];
        console.log(`Attempting Konva stage export for slide ${i}`);
        try {
          stage.batchDraw();
          imgData = stage.toDataURL({
            mimeType: 'image/png',
            quality: 1.0,
            pixelRatio,
          });
          console.log(`Konva stage export successful for slide ${i}, data length: ${imgData.length}`);
          const stageWidth = stage.width();
          const stageHeight = stage.height();
          imgWidth = pdf.internal.pageSize.getWidth();
          imgHeight = (stageHeight * imgWidth) / stageWidth;
        } catch (error) {
          console.error(`Konva stage export failed for slide ${i}:`, error);
          console.log(`Falling back to html2canvas for slide ${i}`);
          const canvas = await html2canvas(slide, {
            scale: pixelRatio,
            useCORS: true,
            backgroundColor: '#ffffff',
            logging: true,
            windowWidth: STAGE_WIDTH,
            windowHeight: STAGE_HEIGHT,
          });
          imgData = canvas.toDataURL('image/png', 1.0);
          imgWidth = pdf.internal.pageSize.getWidth();
          imgHeight = (canvas.height * imgWidth) / canvas.width;
        }
      } else {
        console.log(`Using html2canvas for slide ${i}`);
        const canvas = await html2canvas(slide, {
          scale: pixelRatio,
          useCORS: true,
          backgroundColor: '#ffffff',
          logging: true,
          windowWidth: STAGE_WIDTH,
          windowHeight: STAGE_HEIGHT,
        });
        imgData = canvas.toDataURL('image/png', 1.0);
        imgWidth = pdf.internal.pageSize.getWidth();
        imgHeight = (canvas.height * imgWidth) / canvas.width;
      }

      if (imgData && imgData !== 'data:,') {
        if (i > 0) {
          pdf.addPage();
        }
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight, undefined, 'SLOW');
        console.log(`Added slide ${i} to PDF`);
      } else {
        console.warn(`No valid image data for slide ${i}`);
      }
    } catch (error) {
      console.error(`Error processing slide ${i}:`, error);
      continue;
    }
  }

  console.log('Saving PDF...');
  try {
    pdf.save(filename);
    console.log(`PDF saved successfully: ${filename}`);
  } catch (error) {
    console.error('Failed to save PDF:', error);
    throw new Error('Failed to save PDF');
  }
};
