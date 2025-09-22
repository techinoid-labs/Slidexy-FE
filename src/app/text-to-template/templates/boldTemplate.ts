import type { Slide, BackendSlide } from "../types/presentation";

// Updated color palette inspired by the brand manual
const palette = {
  primary: "#1E293B", // Dark teal base
  secondary: "#0F172A", // Deeper dark shade
  accent: "#14B8A6", // Teal accent
  accent2: "#06B6D4", // Cyan accent
  success: "#34D399", // Soft green
  warning: "#FBBF24", // Warm yellow
  bg: "#F9FAFB", // Light cream background
  surface: "#E5E7EB", // Light gray surface
  surface2: "#D1D5DB", // Medium gray
  text: "#1E293B", // Dark text
  textSecondary: "#64748B", // Soft gray text
  gradientStart: "#14B8A6", // Teal gradient start
  gradientEnd: "#0F172A", // Dark gradient end
} ;

// Utility function to generate organic blob shapes
const modernBlob = (
  color1: string,
  color2: string,
  top: string,
  left: string,
  size = "320px",
  opacity = 0.08,
  blur = "50px",
  zIndex = 0
): string => `
  <div style="
    position: absolute;
    top: ${top};
    left: ${left};
    width: ${size};
    height: ${size};
    background: linear-gradient(135deg, ${color1} 0%, ${color2} 100%);
    border-radius: 63% 37% 54% 46% / 55% 48% 52% 45%;
    opacity: ${opacity};
    filter: blur(${blur});
    z-index: ${zIndex};
    transform: translate(-50%, -50%);
  "></div>
`;

// Utility function to generate geometric accent lines
const geometricLine = (
  top: string,
  left: string,
  width = "140px",
  height = "2px",
  angle = "0deg",
  gradient = `linear-gradient(90deg, ${palette.accent}, ${palette.accent2})`,
  opacity = 0.5
): string => `
  <div style="
    position: absolute;
    top: ${top};
    left: ${left};
    width: ${width};
    height: ${height};
    background: ${gradient};
    border-radius: 1px;
    opacity: ${opacity};
    transform: rotate(${angle});
    z-index: 1;
  "></div>
`;

// Utility function to generate floating geometric shapes
const floatingShape = (
  shape: 'circle' | 'square' | 'triangle',
  top: string,
  right: string,
  size = "18px",
  color = palette.accent,
  opacity = 0.25
): string => {
  const shapes = {
    circle: `border-radius: 50%; background: ${color};`,
    square: `border-radius: 3px; background: ${color};`,
    triangle: `width: 0; height: 0; border-left: ${parseInt(size) / 2}px solid transparent; border-right: ${parseInt(size) / 2}px solid transparent; border-bottom: ${size} solid ${color};`,
  };

  return `
    <div style="
      position: absolute;
      top: ${top};
      right: ${right};
      width: ${shape === 'triangle' ? parseInt(size) : size};
      height: ${shape === 'triangle' ? parseInt(size) : size};
      ${shapes[shape]}
      opacity: ${opacity};
      z-index: 1;
    "></div>
  `;
};

// Utility function to generate professional icons
const modernIcon = (type: 'star' | 'arrow' | 'check', size = 24, color = palette.accent): string => {
  const icons: Record<string, string> = {
    star: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="${color}"/>
    </svg>`,
    arrow: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 17L17 7M17 7H7M17 7V17" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
    check: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 6L9 17L4 12" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
  };
  return icons[type] || icons.star;
};

// Extract text content from block
const getTextContent = (block: BackendSlide['textBlock']): string[] => {
  if (!block?.elements) return [];
  return block.elements
    .map((el) => el.text || '')
    .filter((text) => text.length > 0);
};

// Extract images from backend slide
const getImages = (backendSlide: BackendSlide): string[] => {
  const images: string[] = [];
  if (backendSlide.image_url && typeof backendSlide.image_url === 'string' && backendSlide.image_url.trim()) {
    images.push(backendSlide.image_url.trim());
  }
  if (backendSlide.imageBlock?.elements && Array.isArray(backendSlide.imageBlock.elements)) {
    backendSlide.imageBlock.elements.forEach((el) => {
      if (el.properties?.imageSrc && typeof el.properties.imageSrc === 'string' && el.properties.imageSrc.trim()) {
        images.push(el.properties.imageSrc.trim());
      }
    });
  }
  if (images.length === 0) {
    console.warn(`No valid images found for slide ${backendSlide.slide_id || 'unknown'}`);
  }
  return images;
};

export const createBoldTemplate = (backendSlide: BackendSlide, slideIndex: number): Slide => {
  const { slide_id, slide_title, textBlock, imageBlock, titleBlock } = backendSlide;
  const elements: Slide['elements'] = [];
  
  const textContent = getTextContent(textBlock);
  const titleText = titleBlock?.elements?.[0]?.text || slide_title?.text || `Slide ${slideIndex + 1}`;
  const images = getImages(backendSlide);
  const layoutType = slideIndex % 5;
  let htmlTemplate = '';

  switch (layoutType) {
    case 0: // Hero Layout
      htmlTemplate = `
        <div style="
          display: flex;
          height: 100%;
          padding: 2rem;
          gap: 2rem;
          background: linear-gradient(135deg, ${palette.gradientStart} 0%, ${palette.gradientEnd} 70%, ${palette.bg}20 100%);
          position: relative;
          overflow: hidden;
        ">
          ${modernBlob(palette.accent, palette.accent2, '18%', '88%', '380px', 0.12)}
          ${modernBlob(palette.success, palette.bg, '82%', '12%', '280px', 0.06)}
          ${modernBlob(palette.warning, palette.accent2, '50%', '50%', '200px', 0.05, '40px')}
          ${geometricLine('22%', '8%', '120px', '3px', '20deg', 'linear-gradient(45deg, ${palette.bg}30, ${palette.bg}15)')}
          ${geometricLine('68%', '85%', '100px', '2px', '-12deg', 'linear-gradient(45deg, ${palette.accent}25, transparent)')}
          ${geometricLine('40%', '20%', '80px', '2px', '45deg', 'linear-gradient(45deg, ${palette.success}20, transparent)')}
          ${floatingShape('circle', '15%', '15%', '24px', palette.bg, 0.15)}
          ${floatingShape('square', '28%', '28%', '16px', palette.accent2, 0.12)}
          <div style="
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
            padding: 2rem;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            border: 1px solid ${palette.accent}20;
            box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease;
            position: relative;
            z-index: 10;
          ">
            <h1 style="
              font-weight: 700;
              font-size: 2.5rem;
              line-height: 1.2;
              font-family: 'Inter', sans-serif;
              margin: 0 0 1rem;
              color: ${palette.bg};
              text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
            ">
              ${titleText}
            </h1>
            ${textContent.slice(0, 2).map((text) => `
              <p style="
                font-size: 1rem;
                line-height: 1.5;
                font-family: 'Inter', sans-serif;
                font-weight: 400;
                color: ${palette.bg}CC;
                margin: 0 0 0.8rem;
              ">
                ${text}
              </p>
            `).join('')}
          </div>
          ${images.length > 0 ? `
            <div style="
              flex: 1;
              display: flex;
              justify-content: center;
              align-items: center;
              position: relative;
              z-index: 5;
            ">
              <div style="
                width: 70%;
                height: 80%;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.15);
                border: 1px solid ${palette.accent}20;
                transition: transform 0.3s ease;
              ">
                <img src="${images[0]}" style="
                  width: 100%;
                  height: 100%;
                  object-fit: cover;
                  display: block;
                "/>
              </div>
              <style>
                div[style*="width: 70%"]:hover {
                  transform: scale(1.05);
                  box-shadow: 0 15px 30px -8px rgba(0, 0, 0, 0.25);
                }
              </style>
            </div>
          ` : ''}
          <style>
            div[style*="background: rgba(255, 255, 255, 0.1)"]:hover {
              transform: scale(1.02);
              box-shadow: 0 15px 30px -8px rgba(0, 0, 0, 0.2);
            }
          </style>
        </div>`;
      break;

    case 1: // Content Split Layout
      htmlTemplate = `
        <div style="
          display: flex;
          height: 100%;
          padding: 2rem;
          gap: 2rem;
          align-items: center;
          background: linear-gradient(120deg, ${palette.bg} 0%, ${palette.surface} 70%, ${palette.surface2}20 100%);
          position: relative;
          overflow: hidden;
        ">
          ${modernBlob(palette.accent, palette.accent2, '25%', '15%', '320px', 0.06)}
          ${modernBlob(palette.success, palette.warning, '75%', '85%', '260px', 0.05, '30px')}
          ${geometricLine('30%', '50%', '120px', '2px', '35deg')}
          ${geometricLine('60%', '25%', '80px', '2px', '-25deg', `linear-gradient(45deg, ${palette.accent2}, transparent)`)}
          ${geometricLine('10%', '90%', '100px', '2px', '60deg', `linear-gradient(45deg, ${palette.success}20, transparent)`)}
          <div style="
            flex: ${images.length > 0 ? '3' : '1'};
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
            padding: 2rem;
            background: ${palette.surface};
            border-radius: 12px;
            box-shadow: 0 8px 16px -5px rgba(0, 0, 0, 0.05);
            border: 1px solid ${palette.accent}20;
            transition: transform 0.3s ease;
            position: relative;
            z-index: 10;
          ">
            <h2 style="
              font-size: 2rem;
              font-weight: 700;
              margin: 0 0 1rem;
              color: ${palette.primary};
              font-family: 'Inter', sans-serif;
            ">
              ${titleText}
            </h2>
            ${textContent.map((text) => `
              <p style="
                font-size: 0.95rem;
                line-height: 1.6;
                color: ${palette.textSecondary};
                font-family: 'Inter', sans-serif;
                margin: 0 0 0.8rem;
              ">
                • ${text}
              </p>
            `).join('')}
          </div>
          ${images.length > 0 ? `
            <div style="
              flex: 2;
              position: relative;
              z-index: 10;
              display: grid;
              grid-template-columns: ${images.length > 1 ? '1fr 1fr' : '1fr'};
              gap: 1rem;
            ">
              ${images.slice(0, 2).map((img) => `
                <div style="
                  border-radius: 12px;
                  overflow: hidden;
                  box-shadow: 0 8px 16px -5px rgba(0, 0, 0, 0.05);
                  border: 1px solid ${palette.accent}20;
                  transition: transform 0.3s ease;
                  ${images.length === 1 ? 'grid-column: 1 / -1;' : ''}
                ">
                  <img src="${img}" style="
                    width: 100%;
                    height: ${images.length === 1 ? '300px' : '160px'};
                    object-fit: cover;
                    display: block;
                  "/>
                </div>
              `).join('')}
              <style>
                div[style*="border-radius: 12px"]:hover {
                  transform: scale(1.05);
                  box-shadow: 0 12px 24px -6px rgba(0, 0, 0, 0.1);
                }
              </style>
            </div>
          ` : ''}
          <style>
            div[style*="background: ${palette.surface}"]:hover {
              transform: scale(1.02);
              box-shadow: 0 12px 24px -6px rgba(0, 0, 0, 0.1);
            }
          </style>
        </div>`;
      break;

    case 2: // Enhanced Quote Layout
      htmlTemplate = `
        <div style="
          display: flex;
          height: 100%;
          padding: 2rem;
          gap: 2rem;
          align-items: center;
          background: linear-gradient(135deg, ${palette.primary} 0%, ${palette.secondary} 60%, ${palette.bg}10 100%);
          position: relative;
          overflow: hidden;
        ">
          ${modernBlob(palette.accent, palette.accent2, '20%', '20%', '280px', 0.04)}
          ${modernBlob(palette.accent2, palette.success, '80%', '80%', '320px', 0.06)}
          ${modernBlob(palette.warning, palette.bg, '50%', '8%', '180px', 0.03)}
          ${geometricLine('25%', '25%', '160px', '2px', '25deg', 'linear-gradient(45deg, ${palette.bg}15, transparent)')}
          ${geometricLine('75%', '75%', '120px', '2px', '-35deg', 'linear-gradient(45deg, ${palette.bg}12, transparent)')}
          ${geometricLine('10%', '10%', '90px', '2px', '70deg', 'linear-gradient(45deg, ${palette.accent}20, transparent)')}
          ${floatingShape('circle', '12%', '25%', '28px', palette.bg, 0.08)}
          ${floatingShape('square', '82%', '20%', '20px', palette.accent2, 0.06)}
          <div style="
            flex: 1;
            padding: 2rem;
            background: rgba(255, 255, 255, 0.08);
            border-radius: 12px;
            border: 1px solid ${palette.accent}20;
            box-shadow: 0 8px 16px -5px rgba(0, 0, 0, 0.05);
            transition: transform 0.3s ease;
            position: relative;
            z-index: 10;
            display: flex;
            flex-direction: column;
            justify-content: center;
          ">
            <blockquote style="
              font-size: 1.5rem;
              line-height: 1.4;
              font-weight: 300;
              color: ${palette.bg};
              font-family: 'Georgia', serif;
              margin: 1rem 0;
              font-style: italic;
              text-align: center;
            ">
              ${textContent[0] || 'Innovation drives progress.'}
            </blockquote>
            <cite style="
              font-size: 0.9rem;
              color: ${palette.bg}CC;
              font-family: 'Inter', sans-serif;
              font-weight: 500;
              text-align: center;
              display: block;
            ">
              ${titleText}
            </cite>
          </div>
          ${images.length > 0 ? `
            <div style="
              flex: 1;
              position: relative;
              z-index: 10;
              display: grid;
              grid-template-columns: ${images.length > 1 ? '1fr 1fr' : '1fr'};
              gap: 1rem;
            ">
              ${images.slice(0, 2).map((img) => `
                <div style="
                  border-radius: 12px;
                  overflow: hidden;
                  box-shadow: 0 8px 16px -5px rgba(0, 0, 0, 0.05);
                  border: 1px solid ${palette.accent}20;
                  transition: transform 0.3s ease;
                  ${images.length === 1 ? 'grid-column: 1 / -1;' : ''}
                ">
                  <img src="${img}" style="
                    width: 100%;
                    height: ${images.length === 1 ? '300px' : '160px'};
                    object-fit: cover;
                    display: block;
                  "/>
                </div>
              `).join('')}
              <style>
                div[style*="border-radius: 12px"]:hover {
                  transform: scale(1.05);
                  box-shadow: 0 12px 24px -6px rgba(0, 0, 0, 0.1);
                }
              </style>
            </div>
          ` : ''}
          <style>
            div[style*="background: rgba(255, 255, 255, 0.08)"]:hover {
              transform: scale(1.02);
              box-shadow: 0 12px 24px -6px rgba(0, 0, 0, 0.1);
            }
          </style>
        </div>`;
      break;

    case 3: // Feature Highlight Layout
      htmlTemplate = `
        <div style="
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: 2rem;
          gap: 1.5rem;
          background: linear-gradient(135deg, ${palette.surface} 0%, ${palette.bg} 70%, ${palette.surface2}10 100%);
          position: relative;
          overflow: hidden;
        ">
          ${modernBlob(palette.accent, palette.accent2, '25%', '75%', '240px', 0.06, '35px', 1)}
          ${modernBlob(palette.success, palette.warning, '75%', '25%', '200px', 0.05, '50px', 1)}
          ${geometricLine('20%', '15%', '120px', '2px', '15deg')}
          ${geometricLine('50%', '50%', '90px', '2px', '-30deg', `linear-gradient(45deg, ${palette.accent2}20, transparent)`)}
          ${floatingShape('circle', '15%', '15%', '20px', palette.accent2, 0.2)}
          <div style="
            padding: 1.5rem;
            background: ${palette.surface};
            border-radius: 12px;
            box-shadow: 0 8px 16px -5px rgba(0, 0, 0, 0.05);
            border: 1px solid ${palette.accent}20;
            transition: transform 0.3s ease;
            position: relative;
            z-index: 10;
            display: flex;
            align-items: center;
            gap: 1rem;
          ">
            <h2 style="
              font-size: 2rem;
              font-weight: 700;
              margin: 0;
              color: ${palette.primary};
              font-family: 'Inter', sans-serif;
            ">
              ${titleText}
            </h2>
          </div>
          <div style="
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            position: relative;
            z-index: 10;
          ">
            ${textContent.slice(0, 3).map((text, idx) => `
              <div style="
                background: ${palette.surface};
                border-radius: 12px;
                padding: 1.5rem;
                box-shadow: 0 8px 16px -5px rgba(0, 0, 0, 0.05);
                border: 1px solid ${palette.accent}20;
                transition: transform 0.3s ease;
                display: flex;
                flex-direction: column;
                gap: 0.8rem;
              ">
                ${images[idx] ? `
                  <div style="
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 6px 12px -4px rgba(0, 0, 0, 0.05);
                    transition: transform 0.3s ease;
                  ">
                    <img src="${images[idx]}" style="
                      width: 100%;
                      height: 120px;
                      object-fit: cover;
                      display: block;
                    "/>
                  </div>
                ` : ''}
                <h3 style="
                  font-size: 1.1rem;
                  font-weight: 600;
                  color: ${palette.primary};
                  margin: 0;
                  font-family: 'Inter', sans-serif;
                ">
                  Feature ${idx + 1}
                </h3>
                <p style="
                  font-size: 0.9rem;
                  line-height: 1.4;
                  color: ${palette.textSecondary};
                  margin: 0;
                  font-family: 'Inter', sans-serif;
                ">
                  ${text || 'Highlight key aspects of your project.'}
                </p>
              </div>
            `).join('')}
          </div>
          <style>
            div[style*="background: ${palette.surface}"]:hover {
              transform: scale(1.02);
              box-shadow: 0 12px 24px -6px rgba(0, 0, 0, 0.1);
            }
            div[style*="border-radius: 8px"]:hover {
              transform: scale(1.05);
              box-shadow: 0 10px 20px -6px rgba(0, 0, 0, 0.1);
            }
          </style>
        </div>`;
      break;

    case 4: // Timeline Layout
      htmlTemplate = `
        <div style="
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: 2rem;
          background: linear-gradient(120deg, ${palette.bg} 0%, ${palette.surface2} 60%, ${palette.bg}10 100%);
          position: relative;
          overflow: hidden;
        ">
          ${modernBlob(palette.accent, palette.accent2, '15%', '85%', '280px', 0.05)}
          ${modernBlob(palette.success, palette.warning, '85%', '15%', '240px', 0.04)}
          ${geometricLine('10%', '10%', '110px', '2px', '30deg', `linear-gradient(45deg, ${palette.accent}20, transparent)`)}
          <div style="
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 1.5rem;
            padding: 1.5rem;
            background: ${palette.surface};
            border-radius: 12px;
            box-shadow: 0 8px 16px -5px rgba(0, 0, 0, 0.05);
            border: 1px solid ${palette.accent}20;
            transition: transform 0.3s ease;
            position: relative;
            z-index: 10;
          ">
            <h2 style="
              font-size: 1.8rem;
              font-weight: 700;
              margin: 0;
              color: ${palette.primary};
              font-family: 'Inter', sans-serif;
            ">
              ${titleText}
            </h2>
          </div>
          <div style="
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            grid-template-rows: repeat(2, auto);
            gap: 1rem;
            position: relative;
            z-index: 10;
          ">
            ${textContent.slice(0, 4).map((text, idx) => `
              <div style="
                background: ${palette.surface};
                border-radius: 12px;
                padding: 1.5rem;
                box-shadow: 0 8px 16px -5px rgba(0, 0, 0, 0.05);
                border: 1px solid ${palette.accent}20;
                transition: transform 0.3s ease;
              ">
                <div style="
                  display: flex;
                  align-items: center;
                  gap: 0.8rem;
                  margin-bottom: 0.8rem;
                ">
                  <div style="
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background: ${palette.accent};
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: ${palette.bg};
                    font-weight: 600;
                    font-size: 0.9rem;
                    box-shadow: 0 4px 8px rgba(20, 184, 166, 0.2);
                  ">
                    ${String(idx + 1).padStart(2, '0')}
                  </div>
                  <div style="
                    flex: 1;
                    height: 2px;
                    background: ${palette.accent}30;
                    border-radius: 1px;
                  "></div>
                </div>
                <h3 style="
                  font-size: 1rem;
                  font-weight: 600;
                  color: ${palette.primary};
                  margin: 0 0 0.5rem;
                  font-family: 'Inter', sans-serif;
                ">
                  Phase ${idx + 1}
                </h3>
                <p style="
                  font-size: 0.9rem;
                  color: ${palette.textSecondary};
                  margin: 0;
                  line-height: 1.4;
                  font-family: 'Inter', sans-serif;
                ">
                  ${text}
                </p>
              </div>
            `).join('')}
          </div>
          <style>
            div[style*="background: ${palette.surface}"]:hover {
              transform: scale(1.02);
              box-shadow: 0 12px 24px -6px rgba(0, 0, 0, 0.1);
            }
          </style>
        </div>`;
      break;

    default:
      htmlTemplate = `<div>Error: Invalid layout type</div>`;
  }

  elements.push({
    element_type: 'html',
    konva_component: 'Konva.HTML',
    properties: {
      x: 0,
      y: 0,
      width: 960,
      height: 540,
      htmlContent: htmlTemplate,
      zIndex: 0,
    },
    id: `html-template-${slide_id || slideIndex}`,
  });

  return {
    slide_id: slide_id || `slide-${slideIndex}`,
    title: titleText,
    image_url: images[0],
    elements,
    htmlTemplate,
  };
};

