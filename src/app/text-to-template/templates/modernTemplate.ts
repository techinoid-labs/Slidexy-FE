import type { Slide, BackendSlide } from "../types/presentation";

// Modern color palette inspired by Canva-like aesthetics
const palette = {
  primary: "#1A202C", // Deep navy
  secondary: "#4A5568", // Cool gray
  accent: "#00C4B4", // Vibrant teal
  accent2: "#7C3AED", // Electric purple
  highlight: "#F6E05E", // Warm yellow
  bg: "#F7FAFC", // Soft white
  surface: "#EDF2F7", // Light gray
  text: "#2D3748", // Dark gray text
  textLight: "#A0AEC0", // Light gray text
  gradientStart: "#00C4B4", // Teal gradient
  gradientEnd: "#7C3AED", // Purple gradient
};

// Utility for smooth wave background
const waveBackground = (color1: string, color2: string, opacity = 0.1): string => `
  <div style="
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, ${color1}${Math.round(opacity * 255).toString(16)} 0%, ${color2}${Math.round(opacity * 255).toString(16)} 100%);
    clip-path: polygon(0 0, 100% 0, 100% 85%, 80% 95%, 20% 85%, 0 95%);
    z-index: 0;
  "></div>
`;

// Utility for dynamic circle accents
const circleAccent = (top: string, left: string, size = "120px", color = palette.accent, opacity = 0.2): string => `
  <div style="
    position: absolute;
    top: ${top};
    left: ${left};
    width: ${size};
    height: ${size};
    background: ${color};
    border-radius: 50%;
    opacity: ${opacity};
    z-index: 1;
    transform: translate(-50%, -50%);
    transition: transform 0.3s ease;
  "></div>
`;

// Utility for modern icon SVGs
const iconTypes: ['growth', 'target', 'network'] = ['growth', 'target', 'network'];
const modernIcon = (type: 'growth' | 'target' | 'network' , size = 32, color = palette.accent): string => {
  const icons: Record<string, string> = {
    growth: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 21L21 3M21 3H9M21 3V15" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
    target: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke="${color}" stroke-width="2"/>
      <circle cx="12" cy="12" r="6" stroke="${color}" stroke-width="2"/>
      <circle cx="12" cy="12" r="2" fill="${color}"/>
    </svg>`,
    network: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 8C13.6569 8 15 6.65685 15 5C15 3.34315 13.6569 2 12 2C10.3431 2 9 3.34315 9 5C9 6.65685 10.3431 8 12 8ZM12 16C10.3431 16 9 17.3431 9 19C9 20.6569 10.3431 22 12 22C13.6569 22 15 20.6569 15 19C15 17.3431 13.6569 16 12 16ZM5 12C5 10.3431 6.34315 9 8 9C9.65685 9 11 10.3431 11 12C11 13.6569 9.65685 15 8 15C6.34315 15 5 13.6569 5 12ZM13 12C13 10.3431 14.3431 9 16 9C17.6569 9 19 10.3431 19 12C19 13.6569 17.6569 15 16 15C14.3431 15 13 13.6569 13 12Z" stroke="${color}" stroke-width="2"/>
    </svg>`,
  };
  return icons[type] || icons.growth;
};

// Extract text content
const getTextContent = (block: BackendSlide['textBlock']): string[] => {
  if (!block?.elements) return [];
  return block.elements
    .map((el) => el.text || '')
    .filter((text) => text.length > 0);
};

// Extract images
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
  return images;
};

export const createModernTemplate = (backendSlide: BackendSlide, slideIndex: number): Slide => {
  const { slide_id, slide_title, textBlock, titleBlock } = backendSlide;
  const elements: Slide['elements'] = [];
  const textContent = getTextContent(textBlock);
  const titleText = titleBlock?.elements?.[0]?.text || slide_title?.text || `Slide ${slideIndex + 1}`;
  const images = getImages(backendSlide);
  const layoutType = slideIndex % 5;
  let htmlTemplate = '';

  switch (layoutType) {
    case 0: // Hero Intro Slide
      htmlTemplate = `
        <div style="
          display: flex;
          height: 100%;
          padding: 3rem;
          gap: 3rem;
          align-items: center;
          background: ${palette.bg};
          position: relative;
          overflow: hidden;
          font-family: 'Raleway', sans-serif;
        ">
          ${waveBackground(palette.gradientStart, palette.gradientEnd)}
          ${circleAccent('20%', '10%', '150px', palette.accent, 0.15)}
          ${circleAccent('80%', '90%', '100px', palette.accent2, 0.1)}
          <div style="
            flex: 1;
            z-index: 2;
            padding: 2rem;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 16px;
            box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease;
          ">
            <h2 style="
              font-size: 2rem;
              font-weight: 500;
              color: ${palette.primary};
              margin: 0 0 1.5rem;
              line-height: 1.2;
            ">
              ${titleText}
            </h2>
            ${textContent.slice(0, 2).map((text) => `
              <p style="
                font-size: 1.1rem;
                color: ${palette.textLight};
                line-height: 1.6;
                margin: 0 0 1rem;
              ">
                ${text}
              </p>
            `).join('')}
            <div style="
              display: flex;
              gap: 1rem;
              margin-top: 2rem;
            ">
              ${modernIcon('target', 28, palette.accent2)}
              <span style="
                font-size: 1rem;
                font-weight: 600;
                color: ${palette.accent2};
              ">Discover More</span>
            </div>
          </div>
          ${images.length > 0 ? `
            <div style="
              flex: 1;
              z-index: 2;
              display: flex;
              justify-content: center;
              align-items: center;
            ">
              <img src="${images[0]}" style="
                max-width: 100%;
                max-height: 400px;
                border-radius: 16px;
                box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
                object-fit: cover;
                transition: transform 0.3s ease;
              "/>
              <style>
                img:hover {
                  transform: scale(1.05);
                }
              </style>
            </div>
          ` : ''}
          <style>
            div[style*="background: rgba(255, 255, 255, 0.95)"]:hover {
              transform: translateY(-10px);
            }
          </style>
        </div>`;
      break;

    case 1: // Feature Showcase
      htmlTemplate = `
        <div style="
          display: grid;
          grid-template-columns: 1fr 1fr;
          height: 100%;
          padding: 2rem;
          gap: 2rem;
          background: ${palette.bg};
          position: relative;
          overflow: hidden;
          font-family: 'Raleway', sans-serif;
        ">
          ${waveBackground(palette.accent, palette.accent2, 0.08)}
          ${circleAccent('10%', '90%', '80px', palette.highlight, 0.2)}
          <div style="
            z-index: 2;
            padding: 2rem;
            display: flex;
            flex-direction: column;
            justify-content: center;
          ">
            <h2 style="
              font-size: 2.5rem;
              font-weight: 500;
              color: ${palette.primary};
              margin: 0 0 1.5rem;
            ">
              ${titleText}
            </h2>
            ${textContent.slice(0, 3).map((text, idx) => `
              <div style="
                display: flex;
                align-items: center;
                gap: 1rem;
                margin-bottom: 1rem;
              ">
                ${modernIcon(iconTypes[idx % 3], 24, palette.accent)}
                <p style="
                  font-size: 1rem;
                  color: ${palette.text};
                  line-height: 1.5;
                ">
                  ${text}
                </p>
              </div>
            `).join('')}
          </div>
          ${images.length > 0 ? `
            <div style="
              z-index: 2;
              display: grid;
              grid-template-columns: ${images.length > 1 ? '1fr 1fr' : '1fr'};
              gap: 1rem;
              align-content: center;
            ">
              ${images.slice(0, 2).map((img) => `
                <img src="${img}" style="
                  width: 100%;
                  height: ${images.length === 1 ? '350px' : '180px'};
                  object-fit: cover;
                  border-radius: 12px;
                  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
                  transition: transform 0.3s ease;
                "/>
              `).join('')}
              <style>
                img:hover {
                  transform: scale(1.03);
                }
              </style>
            </div>
          ` : ''}
        </div>`;
      break;

    case 2: // Highlight Quote
      htmlTemplate = `
        <div style="
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: 3rem;
          background: linear-gradient(135deg, ${palette.primary} 0%, ${palette.secondary} 100%);
          position: relative;
          overflow: hidden;
          font-family: 'Raleway', sans-serif;
        ">
          ${waveBackground(palette.accent2, palette.accent, 0.15)}
          ${circleAccent('15%', '85%', '140px', palette.highlight, 0.1)}
          <div style="
            z-index: 2;
            text-align: center;
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            backdrop-filter: blur(10px);
            box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
            transition: transform 0.3s ease;
          ">
            <blockquote style="
              font-size: 1.8rem;
              font-weight: 300;
              color: ${palette.bg};
              line-height: 1.5;
              margin: 0 0 1.5rem;
              font-style: italic;
            ">
              ${textContent[0] || 'Empower your future with innovation.'}
            </blockquote>
            <cite style="
              font-size: 1.1rem;
              font-weight: 600;
              color: ${palette.accent};
            ">
              ${titleText}
            </cite>
          </div>
          ${images.length > 0 ? `
            <div style="
              z-index: 2;
              margin-top: 2rem;
              display: flex;
              justify-content: center;
              gap: 1rem;
            ">
              ${images.slice(0, 2).map((img) => `
                <img src="${img}" style="
                  width: 200px;
                  height: 200px;
                  object-fit: cover;
                  border-radius: 12px;
                  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
                  transition: transform 0.3s ease;
                "/>
              `).join('')}
              <style>
                img:hover {
                  transform: scale(1.05);
                }
              </style>
            </div>
          ` : ''}
          <style>
            div[style*="backdrop-filter"]:hover {
              transform: translateY(-10px);
            }
          </style>
        </div>`;
      break;

    case 3: // Card Grid Layout
      htmlTemplate = `
        <div style="
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: 2rem;
          background: ${palette.bg};
          position: relative;
          overflow: hidden;
          font-family: 'Raleway', sans-serif;
        ">
          ${waveBackground(palette.accent, palette.accent2, 0.08)}
          ${circleAccent('10%', '10%', '100px', palette.accent2, 0.15)}
          <h2 style="
            z-index: 2;
            font-size: 2.5rem;
            font-weight: 700;
            color: ${palette.primary};
            text-align: center;
            margin: 0 0 2rem;
          ">
            ${titleText}
          </h2>
          <div style="
            z-index: 2;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
          ">
            ${textContent.slice(0, 3).map((text, idx) => `
              <div style="
                background: ${palette.surface};
                padding: 1.5rem;
                border-radius: 12px;
                box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
                transition: transform 0.3s ease;
              ">
                ${images[idx] ? `
                  <img src="${images[idx]}" style="
                    width: 100%;
                    height: 150px;
                    object-fit: cover;
                    border-radius: 8px;
                    margin-bottom: 1rem;
                  "/>
                ` : ''}
                <h3 style="
                  font-size: 1.2rem;
                  font-weight: 600;
                  color: ${palette.primary};
                  margin: 0 0 0.5rem;
                ">
                  Key Point ${idx + 1}
                </h3>
                <p style="
                  font-size: 0.95rem;
                  color: ${palette.textLight};
                  line-height: 1.5;
                ">
                  ${text}
                </p>
              </div>
            `).join('')}
          </div>
          <style>
            div[style*="background: ${palette.surface}"]:hover {
              transform: translateY(-8px);
            }
          </style>
        </div>`;
      break;

    case 4: // Roadmap Timeline
      htmlTemplate = `
        <div style="
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: 2rem;
          background: ${palette.bg};
          position: relative;
          overflow: hidden;
          font-family: 'Raleway', sans-serif;
        ">
          ${waveBackground(palette.gradientStart, palette.gradientEnd, 0.1)}
          ${circleAccent('85%', '15%', '120px', palette.highlight, 0.12)}
          <h2 style="
            z-index: 2;
            font-size: 2.5rem;
            font-weight: 700;
            color: ${palette.primary};
            text-align: center;
            margin: 0 0 2rem;
          ">
            ${titleText}
          </h2>
          <div style="
            z-index: 2;
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 1rem;
          ">
            ${textContent.slice(0, 4).map((text, idx) => `
              <div style="
                background: ${palette.surface};
                padding: 1.5rem;
                border-radius: 12px;
                box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
                transition: transform 0.3s ease;
                text-align: center;
              ">
                <div style="
                  width: 48px;
                  height: 48px;
                  background: ${palette.accent};
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  margin: 0 auto 1rem;
                  color: ${palette.bg};
                  font-weight: 700;
                ">
                  ${String(idx + 1).padStart(2, '0')}
                </div>
                <h3 style="
                  font-size: 1rem;
                  font-weight: 600;
                  color: ${palette.primary};
                  margin: 0 0 0.5rem;
                ">
                  Step ${idx + 1}
                </h3>
                <p style="
                  font-size: 0.9rem;
                  color: ${palette.textLight};
                  line-height: 1.5;
                ">
                  ${text}
                </p>
              </div>
            `).join('')}
          </div>
          <style>
            div[style*="background: ${palette.surface}"]:hover {
              transform: translateY(-8px);
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
