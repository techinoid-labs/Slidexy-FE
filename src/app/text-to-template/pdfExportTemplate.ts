import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { Presentation } from './types/presentation';

interface ExportOptions {
  filename?: string;
  quality?: number;
  format?: 'a4' | 'letter' | 'presentation';
  orientation?: 'landscape' | 'portrait';
}

export const exportPresentationToPdf = async (
  presentation: Presentation,
  options: ExportOptions = {}
): Promise<void> => {
  const {
    filename = 'presentation.pdf',
    quality = 2,
    format = 'presentation',
    orientation = 'landscape'
  } = options;

  try {
    // Initialize jsPDF
    let pdf: jsPDF;
    
    if (format === 'presentation') {
      const width = orientation === 'landscape' ? 297 : 210;
      const height = orientation === 'landscape' ? 167 : 118;
      pdf = new jsPDF({
        orientation,
        unit: 'mm',
        format: [width, height]
      });
    } else {
      pdf = new jsPDF({
        orientation,
        unit: 'mm',
        format
      });
    }

    const slides = presentation.slides || [];
    
    if (slides.length === 0) {
      throw new Error('No slides found in presentation');
    }

    console.log(`Starting PDF export for ${slides.length} slides`);

    // Wait for all content to load
    await waitForContentLoad();

    // Process each slide
    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i];
      console.log(`Processing slide ${i + 1}/${slides.length}`);
      
      // Try to capture Konva stage directly
      let canvas = await captureKonvaStage(i);
      
      // Fallback to DOM element capture
      if (!canvas) {
        console.log(`Konva capture failed for slide ${i + 1}, trying DOM capture`);
        canvas = await captureSlideContainer(i, quality);
      }
      
      // Fallback to basic canvas with slide content
      if (!canvas) {
        console.log(`Both captures failed for slide ${i + 1}, creating fallback`);
        canvas = await createFallbackCanvas(slide, i);
      }
      
      if (!canvas) {
        console.warn(`Could not capture slide ${i + 1}, skipping`);
        continue;
      }

      // Add new page (except for first slide)
      if (i > 0) {
        pdf.addPage();
      }

      // Add canvas to PDF
      await addCanvasToPdf(pdf, canvas, i + 1);
    }

    // Save the PDF
    pdf.save(filename);
    console.log(`PDF exported successfully: ${filename}`);
    
  } catch (error) {
    console.error('PDF export failed:', error);
    throw new Error(`Failed to export PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

const captureKonvaStage = async (slideIndex: number): Promise<HTMLCanvasElement | null> => {
  return new Promise((resolve) => {
    try {
      // Access global Konva stages
      const stage = window.konvaStages?.[slideIndex];
      
      if (!stage) {
        console.log(`No Konva stage found for slide index ${slideIndex}`);
        resolve(null);
        return;
      }

      // Ensure stage is fully rendered
      stage.batchDraw();
      
      const canvas = stage.toCanvas({
        width: 960,
        height: 540,
        pixelRatio: 2
      });

      // Verify canvas content
      const ctx = canvas.getContext('2d');
      const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
      const hasContent = imageData?.data.some((value: number) => value !== 0);

      if (hasContent) {
        console.log(`Successfully captured Konva stage for slide ${slideIndex + 1}`);
        resolve(canvas);
      } else {
        console.log(`Captured canvas for slide ${slideIndex + 1} is empty`);
        resolve(null);
      }
    } catch (error) {
      console.error('Konva stage capture error:', error);
      resolve(null);
    }
  });
};

const captureSlideContainer = async (
  slideIndex: number,
  quality: number = 2
): Promise<HTMLCanvasElement | null> => {
  try {
    const slideContainer = document.querySelector(`.slide-container.slide-${slideIndex}`);
    
    if (!slideContainer) {
      console.log(`No slide container found for slide ${slideIndex}`);
      return null;
    }

    console.log(`Capturing container for slide ${slideIndex + 1}`);
    
    // Ensure container is visible
    (slideContainer as HTMLElement).style.display = 'block';
    (slideContainer as HTMLElement).style.visibility = 'visible';
    (slideContainer as HTMLElement).style.opacity = '1';
    
    // Scroll element into view
    slideContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Wait for rendering
    await new Promise(resolve => setTimeout(resolve, 500));

    const canvas = await html2canvas(slideContainer as HTMLElement, {
      allowTaint: true,
      useCORS: true,
      scale: quality,
      logging: true,
      width: 960,
      height: 540,
      backgroundColor: '#ffffff',
      foreignObjectRendering: true,
      removeContainer: false,
      onclone: (clonedDoc, element) => {
        console.log('html2canvas cloning element:', element);
        
        element.style.display = 'block';
        element.style.visibility = 'visible';
        element.style.opacity = '1';
        
        // Copy canvas content
        const canvases = element.querySelectorAll('canvas');
        const originalCanvases = slideContainer.querySelectorAll('canvas');
        
        canvases.forEach((clonedCanvas, idx) => {
          const originalCanvas = originalCanvases[idx] as HTMLCanvasElement;
          if (originalCanvas) {
            const ctx = clonedCanvas.getContext('2d');
            if (ctx) {
              clonedCanvas.width = originalCanvas.width;
              clonedCanvas.height = originalCanvas.height;
              ctx.drawImage(originalCanvas, 0, 0);
            }
          }
        });
      }
    });

    // Verify canvas content
    const ctx = canvas.getContext('2d');
    const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
    const hasContent = imageData?.data.some((value: number) => value !== 0);

    if (hasContent) {
      console.log(`Successfully captured DOM container for slide ${slideIndex + 1}`);
      return canvas;
    } else {
      console.log(`Captured DOM canvas for slide ${slideIndex + 1} is empty`);
      return null;
    }
  } catch (error) {
    console.error('DOM element capture error:', error);
    return null;
  }
};

const createFallbackCanvas = async (
  slide: any,
  slideIndex: number
): Promise<HTMLCanvasElement | null> => {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return null;
    
    canvas.width = 960;
    canvas.height = 540;
    
    // Fill with white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 960, 540);
    
    // Add slide title
    ctx.fillStyle = '#333333';
    ctx.font = 'bold 32px Arial, sans-serif';
    ctx.textAlign = 'center';
    const title = slide.title || `Slide ${slideIndex + 1}`;
    ctx.fillText(title, 480, 100);
    
    // Add slide content
    if (slide.elements && slide.elements.length > 0) {
      ctx.font = '18px Arial, sans-serif';
      ctx.textAlign = 'left';
      
      let yPosition = 180;
      slide.elements.forEach((element: any, idx: number) => {
        if (element.text && yPosition < 480) {
          ctx.fillText(element.text, 80, yPosition);
          yPosition += 30;
        }
      });
    } else {
      ctx.font = '18px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#666666';
      ctx.fillText('Slide content could not be captured', 480, 270);
    }
    
    // Add slide number
    ctx.font = '12px Arial, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillStyle = '#999999';
    ctx.fillText(`${slideIndex + 1}`, 920, 520);
    
    return canvas;
  } catch (error) {
    console.error('Fallback canvas creation error:', error);
    return null;
  }
};

const addCanvasToPdf = async (
  pdf: jsPDF,
  canvas: HTMLCanvasElement,
  slideNumber: number
): Promise<void> => {
  try {
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    // Convert canvas to data URL
    const imgData = canvas.toDataURL('image/png', 0.95);
    
    // Calculate scaling to fit page
    const canvasAspectRatio = canvas.width / canvas.height;
    const pdfAspectRatio = pdfWidth / pdfHeight;
    
    let scaledWidth: number;
    let scaledHeight: number;
    
    if (canvasAspectRatio > pdfAspectRatio) {
      scaledWidth = pdfWidth;
      scaledHeight = pdfWidth / canvasAspectRatio;
    } else {
      scaledHeight = pdfHeight;
      scaledWidth = pdfHeight * canvasAspectRatio;
    }
    
    // Center the image
    const x = (pdfWidth - scaledWidth) / 2;
    const y = (pdfHeight - scaledHeight) / 2;
    
    // Add image to PDF
    pdf.addImage(imgData, 'PNG', x, y, scaledWidth, scaledHeight);
    
    // Add slide number
    pdf.setFontSize(8);
    pdf.setTextColor(128, 128, 128);
    pdf.text(`${slideNumber}`, pdfWidth - 15, pdfHeight - 5);
    
    console.log(`Added slide ${slideNumber} to PDF`);
  } catch (error) {
    console.error('Error adding canvas to PDF:', error);
    throw error;
  }
};

export const waitForContentLoad = async (): Promise<void> => {
  return new Promise((resolve) => {
    // Wait for images to load
    const images = document.querySelectorAll('img');
    const imagePromises = Array.from(images).map((img) => {
      if (img.complete) return Promise.resolve();
      return new Promise((res) => {
        img.onload = res;
        img.onerror = res;
      });
    });
    
    // Wait for Konva stages to render
    const konvaPromises = Object.values(window.konvaStages || {}).map((stage: any) => {
      return new Promise((res) => {
        stage.batchDraw();
        setTimeout(res, 100);
      });
    });
    
    Promise.all([...imagePromises, ...konvaPromises]).then(() => {
      // Additional wait for any pending renders
      setTimeout(resolve, 1000);
    });
  });
};