import type { Slide, ExportElement } from '../app/text-to-template/types/presentation';

const palette = {
  primary: "#1E293B",
  secondary: "#0F172A",
  accent: "#14B8A6",
  accent2: "#06B6D4",
  success: "#34D399",
  warning: "#FBBF24",
  bg: "#F9FAFB",
  surface: "#E5E7EB",
  surface2: "#D1D5DB",
  text: "#1E293B",
  textSecondary: "#64748B",
  gradientStart: "#14B8A6",
  gradientEnd: "#0F172A",
};

export function parseHtmlToJson(htmlContent: string, slideWidth = 960, slideHeight = 540): ExportElement[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');
  const exportElements: ExportElement[] = [];

  const toPoints = (value: string | undefined): number => {
    if (!value) return 0;
    if (value.includes('px')) return parseFloat(value);
    if (value.includes('%')) return (parseFloat(value) / 100) * slideWidth;
    return parseFloat(value) || 0;
  };

  const extractStyles = (element: HTMLElement, parentX = 0, parentY = 0) => {
    // Use getComputedStyle to get all computed styles
    const computedStyle = window.getComputedStyle(element);
    const rect = {
      x: toPoints(computedStyle.left || '0') + parentX,
      y: toPoints(computedStyle.top || '0') + parentY,
      width: toPoints(computedStyle.width || element.offsetWidth?.toString() || '0'),
      height: toPoints(computedStyle.height || element.offsetHeight?.toString() || '0'),
    };

    const zIndex = parseInt(computedStyle.zIndex) || 0;
    const opacity = parseFloat(computedStyle.opacity) || 1;
    const background = computedStyle.background || computedStyle.backgroundColor || 'transparent';
    const color = computedStyle.color || '#000000';
    const fontSize = toPoints(computedStyle.fontSize) || 16;
    const fontFamily = computedStyle.fontFamily || 'Inter, sans-serif';
    const fontWeight = computedStyle.fontWeight || 'normal';
    const textAlign = computedStyle.textAlign || 'left';
    const borderRadius = computedStyle.borderRadius || '0';

    return { rect, zIndex, opacity, background, color, fontSize, fontFamily, fontWeight, textAlign, borderRadius };
  };

  const processNode = (node: Node, parentX = 0, parentY = 0) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement;
      const tagName = element.tagName.toLowerCase();
      const styles = extractStyles(element, parentX, parentY);

      if (['h1', 'h2', 'h3', 'p', 'blockquote', 'cite'].includes(tagName)) {
        const textContent = element.textContent?.trim();
        if (textContent) {
          exportElements.push({
            type: 'text',
            content: textContent,
            properties: {
              x: styles.rect.x,
              y: styles.rect.y,
              width: styles.rect.width,
              height: styles.rect.height,
              fontSize: styles.fontSize,
              fontFamily: styles.fontFamily.replace(/['"]/g, ''),
              color: styles.color,
              opacity: styles.opacity,
            },
          });
        }
      }

      if (tagName === 'img') {
        const src = element.getAttribute('src');
        if (src) {
          exportElements.push({
            type: 'image',
            properties: {
              x: styles.rect.x,
              y: styles.rect.y,
              width: styles.rect.width,
              height: styles.rect.height,
              imageSrc: src,
              opacity: styles.opacity,
            },
          });
        }
      }

      if (tagName === 'div' && styles.background !== 'transparent') {
        let shapeType = 'rect';
        // Safely check for borderRadius
        if (
          styles.rect.width === styles.rect.height &&
          styles.borderRadius && // Check if borderRadius exists
          styles.borderRadius.includes('50%')
        ) {
          shapeType = 'circle';
        } else if (styles.borderRadius && styles.borderRadius.includes('%')) {
          shapeType = 'rect'; // Approximate complex shapes
        }
        const isBackground = styles.rect.width >= slideWidth * 0.9 && styles.rect.height >= slideHeight * 0.9;
        exportElements.push({
          type: isBackground ? 'background' : 'shape',
          properties: {
            x: styles.rect.x,
            y: styles.rect.y,
            width: styles.rect.width,
            height: styles.rect.height,
          },
        });
      }

      Array.from(element.children).forEach((child) =>
        processNode(child, styles.rect.x, styles.rect.y)
      );
    }
  };

  const root = doc.body.querySelector('div');
  if (root) {
    processNode(root);
  } else {
    console.warn('No root div found in HTML content');
  }

  return exportElements;
}

export function enhanceSlideWithExportElements(slide: Slide): Slide {
  if (!slide.htmlTemplate) {
    console.warn('No HTML template found for slide:', slide.slide_id);
    return { ...slide, exportElements: [] };
  }
  try {
    return {
      ...slide,
      exportElements: parseHtmlToJson(slide.htmlTemplate),
    };
  } catch (error) {
    console.error('Error enhancing slide with export elements:', slide.slide_id, error);
    return { ...slide, exportElements: [] };
  }
}