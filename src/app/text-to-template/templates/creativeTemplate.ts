import type { Slide, BackendSlide } from "../types/presentation";

const creativePalette = {
  primary: "#FF4757",
  secondary: "#3742FA",
  accent: "#2ED573",
  accent2: "#FFA502",
  accent3: "#FF6348",
  accent4: "#A55EEA",
  accent5: "#26D0CE",
  success: "#2ED573",
  warning: "#FFA502",
  bg: "#FFFFFF",
  surface: "#F1F2F6",
  surface2: "#DDD6FE",
  text: "#2F3542",
  textSecondary: "#57606F",
  gradientStart: "#FF4757",
  gradientEnd: "#3742FA",
  artistic: "#FF6B9D",
  creative: "#C44569",
};

// Utility function to generate organic blob shapes
const artisticBlob = (
  color1: string,
  color2: string,
  top: string,
  left: string,
  size = "300px",
  opacity = 0.2,
  blur = "20px",
  zIndex = 0,
  rotation = "0deg",
): string => `
  <div style="
    position: absolute;
    top: ${top};
    left: ${left};
    width: ${size};
    height: ${size};
    background: radial-gradient(ellipse at 30% 20%, ${color1} 0%, ${color2} 70%, transparent 100%);
    border-radius: 82% 18% 73% 27% / 35% 61% 39% 65%;
    opacity: ${opacity};
    filter: blur(${blur});
    z-index: ${zIndex};
    transform: translate(-50%, -50%) rotate(${rotation});
    animation: float 6s ease-in-out infinite;
  "></div>
  <style>
    @keyframes float {
      0%, 100% { transform: translate(-50%, -50%) rotate(${rotation}) translateY(0px); }
      50% { transform: translate(-50%, -50%) rotate(${rotation}) translateY(-10px); }
    }
  </style>
`;

// Utility function to generate paint stroke effects
const paintStroke = (
  color: string,
  position: "top" | "bottom" | "left" | "right",
  thickness = "60px",
  opacity = 0.15,
): string => {
  const positions = {
    top: `top: 0; left: 0; width: 100%; height: ${thickness}; clip-path: polygon(0 0, 100% 0, 95% 100%, 5% 100%);`,
    bottom: `bottom: 0; left: 0; width: 100%; height: ${thickness}; clip-path: polygon(5% 0, 95% 0, 100% 100%, 0 100%);`,
    left: `left: 0; top: 0; width: ${thickness}; height: 100%; clip-path: polygon(0 0, 100% 5%, 100% 95%, 0 100%);`,
    right: `right: 0; top: 0; width: ${thickness}; height: 100%; clip-path: polygon(0 5%, 100% 0, 100% 100%, 0 95%);`,
  };

  return `
    <div style="
      position: absolute;
      ${positions[position]}
      background: linear-gradient(45deg, ${color}, ${color}80);
      opacity: ${opacity};
      z-index: 1;
    "></div>
  `;
};

// Utility function to generate artistic elements
const artisticElement = (
  type: "splatter" | "brush" | "doodle" | "scribble",
  top: string,
  left: string,
  size = "40px",
  color = creativePalette.accent,
  opacity = 0.4,
): string => {
  const elements = {
    splatter: `
      <div style="
        position: absolute;
        top: ${top};
        left: ${left};
        width: ${size};
        height: ${size};
        background: ${color};
        opacity: ${opacity};
        z-index: 3;
        border-radius: 50% 20% 80% 30%;
        transform: rotate(45deg);
      ">
        <div style="
          position: absolute;
          top: -5px;
          right: -8px;
          width: 12px;
          height: 12px;
          background: ${color};
          border-radius: 50%;
        "></div>
        <div style="
          position: absolute;
          bottom: -3px;
          left: -6px;
          width: 8px;
          height: 8px;
          background: ${color};
          border-radius: 50%;
        "></div>
      </div>
    `,
    brush: `
      <div style="
        position: absolute;
        top: ${top};
        left: ${left};
        width: ${size};
        height: 8px;
        background: linear-gradient(90deg, ${color} 0%, transparent 100%);
        opacity: ${opacity};
        z-index: 3;
        border-radius: 4px 0 0 4px;
        transform: rotate(-15deg);
      "></div>
    `,
    doodle: `
      <div style="
        position: absolute;
        top: ${top};
        left: ${left};
        width: ${size};
        height: ${size};
        border: 3px solid ${color};
        opacity: ${opacity};
        z-index: 3;
        border-radius: 50%;
        border-style: dashed;
        animation: spin 8s linear infinite;
      "></div>
      <style>
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      </style>
    `,
    scribble: `
      <svg style="
        position: absolute;
        top: ${top};
        left: ${left};
        width: ${size};
        height: ${size};
        opacity: ${opacity};
        z-index: 3;
      " viewBox="0 0 40 40">
        <path d="M5,20 Q15,5 25,20 T35,20" stroke="${color}" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <path d="M10,25 Q20,15 30,25" stroke="${color}" strokeWidth="2" fill="none" strokeLinecap="round"/>
      </svg>
    `,
  };
  return elements[type] || elements.splatter;
};

// Extract text content from block
const getTextContent = (block: BackendSlide["textBlock"]): string[] => {
  if (!block?.elements) return [];
  return block.elements.map((el) => el.text || "").filter((text) => text.length > 0);
};

// Extract images from backend slide
const getImages = (backendSlide: BackendSlide): string[] => {
  const images: string[] = [];
  if (backendSlide.image_url && typeof backendSlide.image_url === "string" && backendSlide.image_url.trim()) {
    images.push(backendSlide.image_url.trim());
  }
  if (backendSlide.imageBlock?.elements && Array.isArray(backendSlide.imageBlock.elements)) {
    backendSlide.imageBlock.elements.forEach((el) => {
      if (el.properties?.imageSrc && typeof el.properties.imageSrc === "string" && el.properties.imageSrc.trim()) {
        images.push(el.properties.imageSrc.trim());
      }
    });
  }
  if (images.length === 0) {
    console.warn(`No valid images found for slide ${backendSlide.slide_id || "unknown"}`);
  }
  return images;
};

export const createCreativeTemplate = (backendSlide: BackendSlide, slideIndex: number): Slide => {
  const { slide_id, slide_title, textBlock, imageBlock, titleBlock } = backendSlide;
  const elements: Slide['elements'] = [];

  const textContent = getTextContent(textBlock);
  const titleText = titleBlock?.elements?.[0]?.text || slide_title?.text || `Slide ${slideIndex + 1}`;
  const images = getImages(backendSlide);
  const layoutType = slideIndex % 5;
  let htmlTemplate = '';

  switch (layoutType) {
    case 0: // Full-width Hero with Text Overlay
      htmlTemplate = `
        <div style="
          position: relative;
          height: 100%;
          width: 100%;
          padding: 1.5rem;
          background: linear-gradient(135deg, ${creativePalette.bg} 0%, ${creativePalette.surface2} 50%, ${creativePalette.bg} 100%);
          overflow: hidden;
          box-sizing: border-box;
        ">
          ${artisticBlob(creativePalette.primary, creativePalette.accent, '20%', '80%', '250px', 0.15, '15px', 1, '0deg')}
          ${paintStroke(creativePalette.accent2, 'bottom', '40px', 0.1)}
          ${images.length > 0 ? `
            <div style="
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              z-index: 1;
            ">
              <img src="${images[0]}" style="
                width: 100%;
                height: 100%;
                object-fit: cover;
                opacity: 0.7;
              "/>
            </div>
          ` : ''}
          <div style="
            position: relative;
            z-index: 10;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100%;
            padding: 2rem;
            background: rgba(255, 255, 255, 0.9);
            border-radius: 15px;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
            max-width: 80%;
            margin: 0 auto;
            box-sizing: border-box;
          ">
            <h1 style="
              font-size: 2.5rem;
              font-weight: 800;
              color: ${creativePalette.text};
              font-family: 'Inter', sans-serif;
              margin: 0 0 1.5rem;
              text-align: center;
            ">
              ${titleText}
            </h1>
            ${textContent.slice(0, 2).map((text) => `
              <p style="
                font-size: 1rem;
                line-height: 1.6;
                color: ${creativePalette.textSecondary};
                font-family: 'Inter', sans-serif;
                margin: 0 0 0.5rem;
                text-align: center;
                max-width: 90%;
              ">
                ${text}
              </p>
            `).join('')}
          </div>
          <style>
            div[style*="border-radius: 15px"]:hover {
              transform: translateY(-5px);
              box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
            }
          </style>
        </div>`;
      break;

    case 1: // Top Image Grid (Two Images) with Bottom Text Block
      htmlTemplate = `
        <div style="
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: 1rem;
          background: linear-gradient(135deg, ${creativePalette.bg} 0%, ${creativePalette.surface} 50%, ${creativePalette.bg} 100%);
          position: relative;
          overflow: hidden;
          box-sizing: border-box;
        ">
          ${paintStroke(creativePalette.primary, 'top', '40px', 0.1)}
          <h2 style="
            font-size: 2rem;
            font-weight: 800;
            color: ${creativePalette.text};
            font-family: 'Inter', sans-serif;
            text-align: center;
            margin: 0 0 0.5rem;
            padding: 0.5rem;
            background: ${creativePalette.bg};
            border-bottom: 2px solid ${creativePalette.primary}20;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
            z-index: 10;
            box-sizing: border-box;
          ">
            ${titleText}
          </h2>
          <div style="
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0.5rem;
            position: relative;
            z-index: 10;
            max-height: 50%;
            padding: 0 0.5rem;
            box-sizing: border-box;
          ">
            ${images.slice(0, 2).map((img, idx) => `
              <div style="
                background: ${creativePalette.bg};
                border-radius: 8px;
                padding: 0.5rem;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                border: 1px solid ${[creativePalette.primary, creativePalette.secondary][idx % 2]}20;
                transition: box-shadow 0.3s ease;
                overflow: hidden;
                box-sizing: border-box;
              ">
                <img src="${img}" style="
                  width: 100%;
                  height: 200px;
                  object-fit: cover;
                  display: block;
                  border-radius: 6px;
                "/>
              </div>
            `).join('')}
          </div>
          <div style="
            flex: 1;
            position: relative;
            z-index: 10;
            margin-top: 0.5rem;
            padding: 0.5rem;
            background: ${creativePalette.bg};
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            border: 1px solid ${creativePalette.primary}20;
            max-height: 45%;
            overflow-y: auto;
            box-sizing: border-box;
          ">
          ${textContent.map((text, idx) => `
  <div style="
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    margin-bottom: ${idx < textContent.length - 1 ? '0.75rem' : '0'};
    padding: 0.5rem 0.75rem;
    background: linear-gradient(90deg, ${creativePalette.primary}10, transparent);
    border-radius: 6px;
    box-sizing: border-box;
  ">
    <div style="
      width: 22px;
      height: 22px;
      flex-shrink: 0;
      border-radius: 50%;
      background: linear-gradient(135deg, ${creativePalette.primary}, ${creativePalette.secondary});
      color: ${creativePalette.bg};
      font-size: 0.8rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 6px rgba(0,0,0,0.2);
    ">
      ${idx + 1}
    </div>
    <p style="
      font-size: 0.95rem;
      line-height: 1.5;
      color: ${creativePalette.textSecondary};
      font-family: 'Inter', sans-serif;
      margin: 0;
    ">
      ${text || 'Content placeholder'}
    </p>
  </div>
`).join('')}

          </div>
          <style>
            div[style*="border-radius: 8px"]:hover {
              box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
            }
            div[style*="overflow-y: auto"]::-webkit-scrollbar {
              width: 6px;
            }
            div[style*="overflow-y: auto"]::-webkit-scrollbar-track {
              background: ${creativePalette.surface};
              border-radius: 8px;
            }
            div[style*="overflow-y: auto"]::-webkit-scrollbar-thumb {
              background: ${creativePalette.primary}80;
              border-radius: 8px;
            }
          </style>
        </div>`;
      break;

    case 2: // Centered Quote with Circular Image Frame
      htmlTemplate = `
        <div style="
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: 1.5rem;
          background: linear-gradient(135deg, ${creativePalette.bg} 0%, ${creativePalette.surface} 70%, ${creativePalette.bg} 100%);
          position: relative;
          overflow: hidden;
          box-sizing: border-box;
        ">
          ${artisticElement('scribble', '10%', '10%', '60px', creativePalette.accent3, 0.3)}
          ${artisticElement('scribble', '90%', '90%', '60px', creativePalette.accent2, 0.3)}
          <div style="
            position: relative;
            z-index: 10;
            text-align: center;
            padding: 2rem;
            background: ${creativePalette.bg};
            border-radius: 15px;
            box-shadow: 0 8px 16px -4px rgba(0, 0, 0, 0.1);
            max-width: 70%;
            margin: 2rem auto 1rem;
            box-sizing: border-box;
          ">
            <h2 style="
              font-size: 2rem;
              font-weight: 800;
              color: ${creativePalette.text};
              font-family: 'Inter', sans-serif;
              margin: 0 0 1rem;
            ">
              ${titleText}
            </h2>
            <blockquote style="
              font-size: 1.5rem;
              line-height: 1.4;
              font-weight: 600;
              color: ${creativePalette.textSecondary};
              font-family: 'Inter', sans-serif;
              font-style: italic;
              margin: 0;
              max-height: 150px;
              overflow: hidden;
              text-overflow: ellipsis;
            ">
              ${textContent[0] || 'Creativity is intelligence having fun.'}
            </blockquote>
          </div>
          ${images.length > 0 ? `
            <div style="
              position: relative;
              z-index: 10;
              display: flex;
              justify-content: center;
              align-items: center;
              max-height: 200px;
              box-sizing: border-box;
            ">
              <div style="
                width: 180px;
                height: 180px;
                border-radius: 50%;
                overflow: hidden;
                border: 3px solid ${creativePalette.accent};
                box-shadow: 0 6px 12px -4px rgba(0, 0, 0, 0.1);
                transition: transform 0.3s ease;
              ">
                <img src="${images[0]}" style="
                  width: 100%;
                  height: 100%;
                  object-fit: cover;
                  display: block;
                "/>
              </div>
            </div>
          ` : ''}
          <style>
            div[style*="border-radius: 15px"]:hover,
            div[style*="border-radius: 50%"]:hover {
              transform: translateY(-5px);
              box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.15);
            }
          </style>
        </div>`;
      break;

    case 3: // Dual-column Layout
      htmlTemplate = `
        <div style="
          display: flex;
          height: 100%;
          padding: 1.5rem;
          background: linear-gradient(90deg, ${creativePalette.bg} 0%, ${creativePalette.surface} 50%, ${creativePalette.bg} 100%);
          position: relative;
          overflow: hidden;
          box-sizing: border-box;
        ">
          ${paintStroke(creativePalette.secondary, 'left', '40px', 0.1)}
          <div style="
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 1rem;
            padding: 1.5rem;
            background: ${creativePalette.bg};
            border-right: 2px solid ${creativePalette.primary}20;
            position: relative;
            z-index: 10;
            max-height: 80%;
            overflow-y: auto;
            box-sizing: border-box;
          ">
            <h2 style="
              font-size: 2rem;
              font-weight: 800;
              color: ${creativePalette.text};
              font-family: 'Inter', sans-serif;
              margin: 0 0 1rem;
              border-bottom: 2px solid ${creativePalette.secondary}20;
              padding-bottom: 0.5rem;
            ">
              ${titleText}
            </h2>
            ${textContent.slice(0, 3).map((text, idx) => `
              <div style="
                padding: 0.75rem;
                background: ${creativePalette.surface};
                border-radius: 8px;
                border-left: 4px solid ${[creativePalette.primary, creativePalette.secondary, creativePalette.accent][idx % 3]};
                max-height: 120px;
                overflow: hidden;
                box-sizing: border-box;
              ">
                <p style="
                  font-size: 0.95rem;
                  line-height: 1.5;
                  color: ${creativePalette.textSecondary};
                  font-family: 'Inter', sans-serif;
                  margin: 0;
                  overflow: hidden;
                  text-overflow: ellipsis;
                ">
                  ${text}
                </p>
              </div>
            `).join('')}
          </div>
          <div style="
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 1rem;
            padding: 1.5rem;
            position: relative;
            z-index: 10;
            max-height: 80%;
            overflow-y: auto;
            box-sizing: border-box;
          ">
            ${images.slice(0, 2).map((img, idx) => `
              <div style="
                background: ${creativePalette.bg};
                border-radius: 10px;
                padding: 1rem;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                border: 1px solid ${[creativePalette.primary, creativePalette.secondary][idx % 2]}20;
                transition: box-shadow 0.3s ease;
                max-height: 200px;
                overflow: hidden;
                box-sizing: border-box;
              ">
                <img src="${img}" style="
                  width: 100%;
                  height: 150px;
                  object-fit: cover;
                  display: block;
                  border-radius: 8px;
                "/>
              </div>
            `).join('')}
          </div>
          <style>
            div[style*="border-radius: 10px"]:hover,
            div[style*="border-radius: 8px"]:hover {
              box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
            }
            div[style*="overflow-y: auto"]::-webkit-scrollbar {
              width: 8px;
            }
            div[style*="overflow-y: auto"]::-webkit-scrollbar-track {
              background: ${creativePalette.surface};
              border-radius: 10px;
            }
            div[style*="overflow-y: auto"]::-webkit-scrollbar-thumb {
              background: ${creativePalette.primary}80;
              border-radius: 10px;
            }
          </style>
        </div>`;
      break;

    case 4: // Timeline-style Layout
      htmlTemplate = `
        <div style="
          display: flex;
          height: 100%;
          padding: 1.5rem;
          background: linear-gradient(90deg, ${creativePalette.bg} 0%, ${creativePalette.surface} 70%, ${creativePalette.bg} 100%);
          position: relative;
          overflow: hidden;
          box-sizing: border-box;
        ">
          ${artisticBlob(creativePalette.accent2, creativePalette.accent, '20%', '80%', '180px', 0.1, '15px', 1, '0deg')}
          ${artisticElement('doodle', '80%', '10%', '50px', creativePalette.accent3, 0.3)}
          <div style="
            flex: 2;
            display: flex;
            flex-direction: column;
            gap: 1rem;
            padding: 1.5rem;
            background: ${creativePalette.bg};
            border-radius: 12px;
            box-shadow: 0 8px 16px -4px rgba(0, 0, 0, 0.1);
            border: 2px solid ${creativePalette.accent}20;
            position: relative;
            z-index: 10;
            max-height: 80%;
            overflow-y: auto;
            box-sizing: border-box;
          ">
            <h2 style="
              font-size: 2rem;
              font-weight: 800;
              color: ${creativePalette.text};
              font-family: 'Inter', sans-serif;
              margin: 0 0 1rem;
            ">
              ${titleText}
            </h2>
            ${textContent.slice(0, 4).map((text, idx) => `
              <div style="
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 0.75rem;
                background: ${creativePalette.surface};
                border-radius: 8px;
                border-left: 4px solid ${[creativePalette.accent, creativePalette.accent2, creativePalette.accent4, creativePalette.primary][idx % 4]};
                max-height: 100px;
                overflow: hidden;
                box-sizing: border-box;
              ">
                <div style="
                  width: 30px;
                  height: 30px;
                  background: ${[creativePalette.accent, creativePalette.accent2, creativePalette.accent4, creativePalette.primary][idx % 4]};
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  color: ${creativePalette.bg};
                  font-weight: 700;
                  font-size: 1rem;
                ">
                  ${idx + 1}
                </div>
                <p style="
                  font-size: 0.95rem;
                  line-height: 1.5;
                  color: ${creativePalette.textSecondary};
                  font-family: 'Inter', sans-serif;
                  margin: 0;
                  overflow: hidden;
                  text-overflow: ellipsis;
                ">
                  ${text}
                </p>
              </div>
            `).join('')}
          </div>
          ${images.length > 0 ? `
            <div style="
              flex: 1;
              display: flex;
              justify-content: center;
              align-items: center;
              padding: 1rem;
              max-height: 80%;
              overflow: hidden;
              box-sizing: border-box;
            ">
              <div style="
                width: 100%;
                max-height: 400px;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 6px 12px -4px rgba(0, 0, 0, 0.1);
                border: 2px solid ${creativePalette.accent2}20;
                transition: transform 0.3s ease;
              ">
                <img src="${images[0]}" style="
                  width: 100%;
                  height: 100%;
                  object-fit: cover;
                  display: block;
                "/>
              </div>
            </div>
          ` : ''}
          <style>
            div[style*="border-radius: 12px"]:hover {
              transform: translateY(-5px);
              box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.15);
            }
            div[style*="overflow-y: auto"]::-webkit-scrollbar {
              width: 8px;
            }
            div[style*="overflow-y: auto"]::-webkit-scrollbar-track {
              background: ${creativePalette.surface};
              border-radius: 10px;
            }
            div[style*="overflow-y: auto"]::-webkit-scrollbar-thumb {
              background: ${creativePalette.accent}80;
              border-radius: 10px;
            }
          </style>
        </div>`;
      break;

    default:
      htmlTemplate = `<div style="font-family: 'Inter', sans-serif; color: ${creativePalette.text}; text-align: center;">Error: Invalid layout type</div>`;
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
    id: `creative-html-template-${slide_id || slideIndex}`,
  });

  return {
    slide_id: slide_id || `creative-slide-${slideIndex}`,
    title: titleText,
    image_url: images[0],
    elements,
    htmlTemplate,
  };
};