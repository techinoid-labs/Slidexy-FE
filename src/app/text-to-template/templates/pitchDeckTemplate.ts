import type { Slide, BackendSlide } from "../types/presentation";

// Retro-inspired color palette
const palette = {
  primary: "#2E2E2E", // Deep charcoal
  secondary: "#F4A261", // Warm orange
  accent: "#E76F51", // Coral red
  accent2: "#264653", // Dark teal
  highlight: "#E9C46A", // Soft mustard
  bg: "#F7EDE2", // Warm cream background
  surface: "#F5F5F5", // Light gray surface
  surface2: "#D9D9D9", // Medium gray
  text: "#2E2E2E", // Dark text
  textSecondary: "#6B7280", // Muted gray text
  gradientStart: "#E76F51", // Coral gradient start
  gradientEnd: "#264653", // Teal gradient end
};

// Utility function to generate retro pixelated shapes
const pixelShape = (
  color1: string,
  color2: string,
  top: string,
  left: string,
  size = "300px",
  opacity = 0.1,
  zIndex = 0
): string => `
  <div style="
    position: absolute;
    top: ${top};
    left: ${left};
    width: ${size};
    height: ${size};
    background: linear-gradient(45deg, ${color1} 0%, ${color2} 100%);
    border-radius: 8px;
    opacity: ${opacity};
    image-rendering: pixelated;
    z-index: ${zIndex};
    transform: translate(-50%, -50%);
    box-shadow: 4px 4px 0px rgba(0, 0, 0, 0.2);
  "></div>
`;

// Utility function to generate retro scanlines
const scanLine = (
  top: string,
  width = "100%",
  height = "4px",
  color = palette.accent,
  opacity = 0.3
): string => `
  <div style="
    position: absolute;
    top: ${top};
    width: ${width};
    height: ${height};
    background: ${color};
    opacity: ${opacity};
    z-index: 1;
  "></div>
`;

// Utility function to generate retro icons
const retroIcon = (type: 'disk' | 'play' | 'check', size = 24, color = palette.accent): string => {
  const icons: Record<string, string> = {
    disk: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="20" height="20" rx="2" fill="${color}"/>
      <circle cx="12" cy="12" r="4" fill="${palette.bg}"/>
    </svg>`,
    play: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 5V19L19 12L8 5Z" fill="${color}"/>
    </svg>`,
    check: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 11L12 14L20 6" stroke="${color}" stroke-width="2"/>
    </svg>`,
  };
  return icons[type] || icons.disk;
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

export const createPitchDeckTemplate = (backendSlide: BackendSlide, slideIndex: number): Slide => {
  const { slide_id, slide_title, textBlock, imageBlock, titleBlock } = backendSlide;
  const elements: Slide['elements'] = [];
  
  const textContent = getTextContent(textBlock);
  const titleText = titleBlock?.elements?.[0]?.text || slide_title?.text || `Slide ${slideIndex + 1}`;
  const images = getImages(backendSlide);
  const layoutType = slideIndex % 5;
  let htmlTemplate = '';

  switch (layoutType) {
    case 0:
      htmlTemplate = `
        <div style="
          display: flex;
          height: 100%;
          padding: 2rem;
          gap: 2rem;
          background: linear-gradient(135deg, ${palette.bg} 0%, ${palette.gradientStart} 50%, ${palette.gradientEnd} 100%);
          position: relative;
          overflow: hidden;
        ">
          ${pixelShape(palette.accent, palette.accent2, '20%', '80%', '360px', 0.15)}
          ${pixelShape(palette.secondary, palette.highlight, '80%', '20%', '280px', 0.1)}
          ${scanLine('10%', '100%', '3px', palette.accent2, 0.2)}
          ${scanLine('90%', '100%', '3px', palette.accent2, 0.2)}
          <div style="
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
            padding: 2rem;
            background: ${palette.surface};
            border-radius: 8px;
            border: 2px solid ${palette.accent};
            box-shadow: 4px 4px 0px ${palette.secondary};
            position: relative;
            z-index: 10;
          ">
            <h2 style="
              font-weight: 700;
              font-size: 2.8rem;
              line-height: 1.2;
              font-family: 'Press Start 2P', monospace;
              margin: 0 0 1rem;
              color: ${palette.primary};
              text-shadow: 2px 2px ${palette.accent2};
            ">
              ${titleText}
            </h2>
            ${textContent.slice(0, 2).map((text) => `
              <p style="
                font-size: 1rem;
                line-height: 1.5;
                font-family: 'Courier New', monospace;
                font-weight: 400;
                color: ${palette.textSecondary};
                margin: 0 0 0.8rem;
              ">
                ${text}
              </p>
            `).join('')}
            ${retroIcon('disk', 32, palette.accent)}
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
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 4px 4px 0px ${palette.accent2};
                border: 2px solid ${palette.primary};
              ">
                <img src="${images[0]}" style="
                  width: 100%;
                  height: 100%;
                  object-fit: cover;
                  display: block;
                  image-rendering: pixelated;
                "/>
              </div>
            </div>
          ` : ''}
        </div>`;
      break;

    case 1: // Retro Content Split
      htmlTemplate = `
        <div style="
          display: flex;
          height: 100%;
          padding: 2rem;
          gap: 2rem;
          align-items: center;
          background: ${palette.bg};
          position: relative;
          overflow: hidden;
        ">
          ${pixelShape(palette.accent, palette.secondary, '30%', '20%', '300px', 0.12)}
          ${pixelShape(palette.highlight, palette.accent2, '70%', '80%', '240px', 0.08)}
          ${scanLine('15%', '100%', '3px', palette.accent, 0.25)}
          ${scanLine('85%', '100%', '3px', palette.accent, 0.25)}
          <div style="
            flex: ${images.length > 0 ? '2' : '1'};
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
            padding: 2rem;
            background: ${palette.surface};
            border-radius: 8px;
            border: 2px solid ${palette.accent};
            box-shadow: 4px 4px 0px ${palette.secondary};
            position: relative;
            z-index: 10;
          ">
            <h2 style="
              font-size: 2rem;
              font-weight: 700;
              margin: 0 0 1rem;
              color: ${palette.primary};
              font-family: 'Press Start 2P', monospace;
              text-shadow: 2px 2px ${palette.accent2};
            ">
              ${titleText}
            </h2>
            ${textContent.map((text) => `
              <p style="
                font-size: 0.95rem;
                line-height: 1.6;
                color: ${palette.textSecondary};
                font-family: 'Courier New', monospace;
                margin: 0 0 0.8rem;
              ">
                » ${text}
              </p>
            `).join('')}
            ${retroIcon('check', 24, palette.accent2)}
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
                  border-radius: 8px;
                  overflow: hidden;
                  box-shadow: 4px 4px 0px ${palette.accent2};
                  border: 2px solid ${palette.primary};
                  ${images.length === 1 ? 'grid-column: 1 / -1;' : ''}
                ">
                  <img src="${img}" style="
                    width: 100%;
                    height: ${images.length === 1 ? '280px' : '140px'};
                    object-fit: cover;
                    display: block;
                    image-rendering: pixelated;
                  "/>
                </div>
              `).join('')}
            </div>
          ` : ''}
        </div>`;
      break;

    case 2: // Retro Quote Layout
      htmlTemplate = `
        <div style="
          display: flex;
          height: 100%;
          padding: 2rem;
          gap: 2rem;
          align-items: center;
          background: linear-gradient(135deg, ${palette.primary} 0%, ${palette.secondary} 60%, ${palette.bg} 100%);
          position: relative;
          overflow: hidden;
        ">
          ${pixelShape(palette.accent, palette.accent2, '25%', '25%', '320px', 0.1)}
          ${pixelShape(palette.highlight, palette.secondary, '75%', '75%', '280px', 0.08)}
          ${scanLine('20%', '100%', '3px', palette.accent2, 0.2)}
          ${scanLine('80%', '100%', '3px', palette.accent2, 0.2)}
          <div style="
            flex: 1;
            padding: 2rem;
            background: ${palette.surface};
            border-radius: 8px;
            border: 2px solid ${palette.accent};
            box-shadow: 4px 4px 0px ${palette.secondary};
            position: relative;
            z-index: 10;
            display: flex;
            flex-direction: column;
            justify-content: center;
          ">
            <blockquote style="
              font-size: 1.6rem;
              line-height: 1.4;
              font-weight: 400;
              color: ${palette.primary};
              font-family: 'Courier New', monospace;
              margin: 1rem 0;
              text-align: center;
              text-shadow: 1px 1px ${palette.accent2};
            ">
              ${textContent[0] || 'Retro vibes, modern ideas.'}
            </blockquote>
            <cite style="
              font-size: 0.9rem;
              color: ${palette.textSecondary};
              font-family: 'Press Start 2P', monospace;
              font-weight: 500;
              text-align: center;
              display: block;
            ">
              ${titleText}
            </cite>
            ${retroIcon('play', 28, palette.accent)}
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
                  border-radius: 8px;
                  overflow: hidden;
                  box-shadow: 4px 4px 0px ${palette.accent2};
                  border: 2px solid ${palette.primary};
                  ${images.length === 1 ? 'grid-column: 1 / -1;' : ''}
                ">
                  <img src="${img}" style="
                    width: 100%;
                    height: ${images.length === 1 ? '280px' : '140px'};
                    object-fit: cover;
                    display: block;
                    image-rendering: pixelated;
                  "/>
                </div>
              `).join('')}
            </div>
          ` : ''}
        </div>`;
      break;

    case 3: // Retro Feature Grid
      htmlTemplate = `
        <div style="
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: 2rem;
          gap: 1.5rem;
          background: ${palette.bg};
          position: relative;
          overflow: hidden;
        ">
          ${pixelShape(palette.accent, palette.secondary, '20%', '80%', '260px', 0.12)}
          ${pixelShape(palette.highlight, palette.accent2, '80%', '20%', '220px', 0.1)}
          ${scanLine('25%', '100%', '3px', palette.accent, 0.25)}
          <div style="
            padding: 1.5rem;
            background: ${palette.surface};
            border-radius: 8px;
            border: 2px solid ${palette.accent};
            box-shadow: 4px 4px 0px ${palette.secondary};
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
              font-family: 'Press Start 2P', monospace;
              text-shadow: 2px 2px ${palette.accent2};
            ">
              ${titleText}
            </h2>
            ${retroIcon('disk', 28, palette.accent)}
          </div>
          <div style="
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 1rem;
            position: relative;
            z-index: 10;
          ">
            ${textContent.slice(0, 3).map((text, idx) => `
              <div style="
                background: ${palette.surface};
                border-radius: 8px;
                padding: 1.5rem;
                border: 2px solid ${palette.accent};
                box-shadow: 4px 4px 0px ${palette.secondary};
                display: flex;
                flex-direction: column;
                gap: 0.8rem;
              ">
                ${images[idx] ? `
                  <div style="
                    border-radius: 6px;
                    overflow: hidden;
                    box-shadow: 2px 2px 0px ${palette.accent2};
                    border: 2px solid ${palette.primary};
                  ">
                    <img src="${images[idx]}" style="
                      width: 100%;
                      height: 100px;
                      object-fit: cover;
                      display: block;
                      image-rendering: pixelated;
                    "/>
                  </div>
                ` : ''}
                <h3 style="
                  font-size: 1rem;
                  font-weight: 600;
                  color: ${palette.primary};
                  margin: 0;
                  font-family: 'Press Start 2P', monospace;
                ">
                  Feature ${idx + 1}
                </h3>
                <p style="
                  font-size: 0.9rem;
                  line-height: 1.4;
                  color: ${palette.textSecondary};
                  margin: 0;
                  font-family: 'Courier New', monospace;
                ">
                  ${text || 'Showcase retro-inspired features.'}
                </p>
              </div>
            `).join('')}
          </div>
        </div>`;
      break;

    case 4: // Retro Timeline
      htmlTemplate = `
        <div style="
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: 2rem;
          background: linear-gradient(120deg, ${palette.bg} 0%, ${palette.surface2} 60%, ${palette.bg} 100%);
          position: relative;
          overflow: hidden;
        ">
          ${pixelShape(palette.accent, palette.accent2, '15%', '85%', '280px', 0.1)}
          ${pixelShape(palette.secondary, palette.highlight, '85%', '15%', '240px', 0.08)}
          ${scanLine('20%', '100%', '3px', palette.accent2, 0.2)}
          <div style="
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 1.5rem;
            padding: 1.5rem;
            background: ${palette.surface};
            border-radius: 8px;
            border: 2px solid ${palette.accent};
            box-shadow: 4px 4px 0px ${palette.secondary};
            position: relative;
            z-index: 10;
          ">
            <h2 style="
              font-size: 1.8rem;
              font-weight: 700;
              margin: 0;
              color: ${palette.primary};
              font-family: 'Press Start 2P', monospace;
              text-shadow: 2px 2px ${palette.accent2};
            ">
              ${titleText}
            </h2>
            ${retroIcon('disk', 28, palette.accent)}
          </div>
          <div style="
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
            position: relative;
            z-index: 10;
          ">
            ${textContent.slice(0, 4).map((text, idx) => `
              <div style="
                background: ${palette.surface};
                border-radius: 8px;
                padding: 1.5rem;
                border: 2px solid ${palette.accent};
                box-shadow: 4px 4px 0px ${palette.secondary};
              ">
                <div style="
                  display: flex;
                  align-items: center;
                  gap: 0.8rem;
                  margin-bottom: 0.8rem;
                ">
                  <div style="
                    width: 28px;
                    height: 28px;
                    border-radius: 4px;
                    background: ${palette.accent};
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: ${palette.bg};
                    font-weight: 600;
                    font-size: 0.9rem;
                    font-family: 'Press Start 2P', monospace;
                    box-shadow: 2px 2px ${palette.accent2};
                  ">
                    ${String(idx + 1).padStart(2, '0')}
                  </div>
                  <div style="
                    flex: 1;
                    height: 3px;
                    background: ${palette.accent}50;
                    border-radius: 2px;
                  "></div>
                </div>
                <h3 style="
                  font-size: 1rem;
                  font-weight: 600;
                  color: ${palette.primary};
                  margin: 0 0 0.5rem;
                  font-family: 'Press Start 2P', monospace;
                ">
                  Step ${idx + 1}
                </h3>
                <p style="
                  font-size: 0.9rem;
                  color: ${palette.textSecondary};
                  margin: 0;
                  line-height: 1.4;
                  font-family: 'Courier New', monospace;
                ">
                  ${text}
                </p>
              </div>
            `).join('')}
          </div>
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
