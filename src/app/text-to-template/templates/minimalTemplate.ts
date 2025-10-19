import type { Slide, BackendSlide } from "../types/presentation";

// Vibrant, minimalist color palette with bold gradients
const palette = {
  primary: "#4C1D95", // Deep violet
  secondary: "#6B5B95", // Soft amethyst
  accent: "#F59E0B", // Warm peach
  accent2: "#10B981", // Emerald green
  bg: "#FEFCE8", // Pale yellow
  surface: "#F5F5F4", // Light ash
  text: "#1C2526", // Dark charcoal
  textSecondary: "#6B7280", // Slate gray
  gradientStart: "#F3E8FF", // Light violet gradient
  gradientEnd: "#FEFCE8", // Pale yellow gradient
  shapeFill: "#FDE68A", // Soft amber
  border: "#E7E5E4", // Subtle border
} ;

// Utility: Abstract background pattern with shapes
const abstractBackground = (): string => `
  <div style="
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(145deg, ${palette.gradientStart}, ${palette.gradientEnd});
    z-index: 0;
    overflow: hidden;
  ">
    <div style="
      position: absolute;
      top: 10%;
      left: 85%;
      width: 80px;
      height: 80px;
      background: ${palette.shapeFill};
      border-radius: 50%;
      opacity: 0.3;
      transform: translate(-50%, -50%);
    "></div>
    <div style="
      position: absolute;
      bottom: 15%;
      left: 20%;
      width: 120px;
      height: 120px;
      border: 1px solid ${palette.accent};
      border-radius: 50%;
      opacity: 0.2;
    "></div>
    <div style="
      position: absolute;
      top: 25%;
      right: 10%;
      width: 60px;
      height: 2px;
      background: ${palette.accent2};
      opacity: 0.4;
      transform: rotate(45deg);
    "></div>
    <div style="
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: radial-gradient(circle at 70% 20%, rgba(255, 255, 255, 0.3), transparent 50%);
      opacity: 0.5;
    "></div>
  </div>
`;

// Utility: Floating arc accent
const arcAccent = (
  top: string,
  left: string,
  size = "40px",
  color = palette.accent,
  opacity = 0.4
): string => `
  <div style="
    position: absolute;
    top: ${top};
    left: ${left};
    width: ${size};
    height: ${size};
    border: 1px solid ${color};
    border-radius: 50%;
    clip-path: polygon(0 0, 100% 0, 100% 50%, 0 50%);
    opacity: ${opacity};
    z-index: 1;
    transform: translate(-50%, -50%) rotate(30deg);
  "></div>
`;

// Utility: Minimalist badge with gradient
const minimalBadge = (text: string): string => `
  <div style="
    display: inline-block;
    padding: 0.3rem 1rem;
    background: linear-gradient(90deg, ${palette.accent}, ${palette.accent2});
    color: ${palette.bg};
    font-family: 'Inter', sans-serif;
    font-size: 0.7rem;
    font-weight: 500;
    text-transform: uppercase;
    border-radius: 12px;
    letter-spacing: 0.06em;
    margin-bottom: 0.75rem;
  ">${text}</div>
`;

// Inline utility: Extract text content
const extractTextContent = (block: BackendSlide["textBlock"]): string[] => {
  if (!block?.elements) return [];
  return block.elements
    .map((el) => el.text || "")
    .filter((text) => text.trim().length > 0);
};

// Inline utility: Extract images
const extractImages = (backendSlide: BackendSlide): string[] => {
  const images: string[] = [];
  if (backendSlide.image_url?.trim()) images.push(backendSlide.image_url.trim());
  if (backendSlide.imageBlock?.elements) {
    backendSlide.imageBlock.elements.forEach((el) => {
      if (el.properties?.imageSrc?.trim()) images.push(el.properties.imageSrc.trim());
    });
  }
  return images;
};

export const createMinimalistTemplate = (backendSlide: BackendSlide, slideIndex: number): Slide => {
  const { slide_id, slide_title, textBlock, titleBlock } = backendSlide;
  const elements: Slide["elements"] = [];

  const textContent = extractTextContent(textBlock);
  const titleText = titleBlock?.elements?.[0]?.text || slide_title?.text || `Slide ${slideIndex + 1}`;
  const images = extractImages(backendSlide);
  const layoutType = slideIndex % 5;
  let htmlTemplate = "";

  switch (layoutType) {
    case 0: // Hero Split Slide
      htmlTemplate = `
        <div style="
          display: grid;
          grid-template-columns: ${images.length > 0 ? '1fr 1fr' : '1fr'};
          height: 100%;
          padding: 1.5rem;
          gap: 1.5rem;
          position: relative;
          overflow: hidden;
          font-family: 'Inter', sans-serif;
          align-items: center;
        ">
          ${abstractBackground()}
          ${arcAccent("10%", "90%", "50px", palette.accent2, 0.3)}
          <div style="
            z-index: 2;
            padding: 1.25rem;
            background: ${palette.surface};
            border-radius: 8px;
            border: 1px solid ${palette.border};
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
            transition: transform 0.3s ease;
            max-width: 460px;
          ">
            ${minimalBadge("Introduction")}
            <h1 style="
              font-size: 2.4rem;
              font-weight: 300;
              color: ${palette.text};
              margin: 0 0 0.75rem;
              line-height: 1.2;
              letter-spacing: -0.01em;
            ">${titleText}</h1>
            ${textContent.slice(0, 3).map((t, idx) => `
              <div style="
                display: flex;
                align-items: center;
                gap: 0.5rem;
                margin-bottom: 0.5rem;
                padding: 0.4rem 0.75rem;
                border-radius: 5px;
                background: linear-gradient(90deg, ${palette.gradientStart}70, transparent);
              ">
                <div style="
                  width: 8px;
                  height: 8px;
                  background: ${palette.accent};
                  border-radius: 50%;
                "></div>
                <p style="
                  font-size: 0.9rem;
                  color: ${palette.textSecondary};
                  line-height: 1.4;
                  font-weight: 400;
                ">${t}</p>
              </div>
            `).join("")}
          </div>
          ${images.length > 0 ? `
            <div style="
              z-index: 2;
              display: flex;
              justify-content: center;
              align-items: center;
            ">
              <div style="
                width: 90%;
                max-height: 360px;
                border-radius: 8px;
                overflow: hidden;
                border: 1px solid ${palette.border};
                box-shadow: 0 3px 12px rgba(0, 0, 0, 0.08);
                transition: transform 0.3s ease;
              ">
                <img src="${images[0]}" style="
                  width: 100%;
                  height: 100%;
                  object-fit: cover;
                "/>
              </div>
              <style>
                div[style*="overflow: hidden"]:hover {
                  transform: scale(1.03);
                }
              </style>
            </div>
          ` : ""}
          <style>
            div[style*="background: ${palette.surface}"]:hover {
              transform: translateY(-5px);
            }
          </style>
        </div>`;
      break;

    case 1: // Stacked Content Layout
      htmlTemplate = `
        <div style="
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: 1.5rem;
          position: relative;
          overflow: hidden;
          font-family: 'Inter', sans-serif;
          gap: 1rem;
        ">
          ${abstractBackground()}
          ${arcAccent("15%", "85%", "40px", palette.accent, 0.4)}
          <div style="
            z-index: 2;
            padding: 1.25rem;
            background: ${palette.surface};
            border-radius: 8px;
            border: 1px solid ${palette.border};
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
            transition: transform 0.3s ease;
            max-height: 360px;
          ">
            ${minimalBadge("Overview")}
            <h2 style="
              font-size: 2rem;
              font-weight: 300;
              color: ${palette.text};
              margin-bottom: 0.75rem;
              letter-spacing: -0.01em;
            ">${titleText}</h2>
            <div style="
              display: grid;
              gap: 0.5rem;
            ">
              ${textContent.slice(0, 4).map((t, idx) => `
                <div style="
                  display: flex;
                  align-items: flex-start;
                  gap: 0.5rem;
                  padding: 0.4rem 0.75rem;
                  border-radius: 5px;
                  background: linear-gradient(90deg, ${palette.gradientStart}70, transparent);
                  min-height: 48px;
                ">
                  <div style="
                    width: 16px;
                    height: 16px;
                    background: linear-gradient(45deg, ${palette.accent}, ${palette.accent2});
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: ${palette.bg};
                    font-size: 0.7rem;
                    font-weight: 500;
                  ">${idx + 1}</div>
                  <p style="
                    font-size: 0.85rem;
                    color: ${palette.textSecondary};
                    line-height: 1.4;
                    flex: 1;
                  ">${t}</p>
                </div>
              `).join("")}
            </div>
          </div>
          ${images.length > 0 ? `
            <div style="
              z-index: 2;
              display: flex;
              gap: 1rem;
              justify-content: center;
              align-items: center;
              max-height: 140px;
              overflow: hidden;
            ">
              ${images.slice(0, 2).map((img, idx) => `
                <div style="
                  width: ${idx === 0 ? '50%' : '30%'};
                  max-height: ${idx === 0 ? '130px' : '90px'};
                  border-radius: 8px;
                  overflow: hidden;
                  border: 1px solid ${palette.border};
                  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.08);
                  transition: transform 0.3s ease;
                ">
                  <img src="${img}" style="
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                  "/>
                </div>
              `).join("")}
              <style>
                div[style*="overflow: hidden"]:hover {
                  transform: scale(1.03);
                }
              </style>
            </div>
          ` : ""}
          <style>
            div[style*="background: ${palette.surface}"]:hover {
              transform: translateY(-5px);
            }
          </style>
        </div>`;
      break;

    case 2: // Centered Quote Layout
      htmlTemplate = `
        <div style="
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: 1.5rem;
          position: relative;
          overflow: hidden;
          font-family: 'Inter', sans-serif;
          justify-content: center;
          align-items: center;
        ">
          ${abstractBackground()}
          ${arcAccent("12%", "88%", "45px", palette.accent2, 0.3)}
          <div style="
            z-index: 2;
            max-width: 560px;
            padding: 1.5rem;
            background: ${palette.bg};
            border-radius: 8px;
            border: 1px solid ${palette.border};
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
            transition: transform 0.3s ease;
            text-align: center;
            position: relative;
            overflow: hidden;
          ">
            <div style="
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 3px;
              background: linear-gradient(90deg, ${palette.accent}, ${palette.accent2});
            "></div>
            ${minimalBadge("Quote")}
            <blockquote style="
              font-size: 1.6rem;
              font-weight: 300;
              color: ${palette.text};
              line-height: 1.4;
              margin: 0 0 0.75rem;
              font-family: 'Inter', sans-serif;
              letter-spacing: -0.01em;
            ">"${textContent[0] || "Minimalism is elegance."}"</blockquote>
            <cite style="
              font-size: 0.9rem;
              font-weight: 500;
              color: ${palette.accent};
              text-transform: uppercase;
              letter-spacing: 0.06em;
            ">${titleText}</cite>
          </div>
          ${images.length > 0 ? `
            <div style="
              z-index: 2;
              margin-top: 1rem;
              display: flex;
              justify-content: center;
              gap: 1rem;
              max-height: 130px;
              overflow: hidden;
            ">
              ${images.slice(0, 2).map((img) => `
                <div style="
                  width: 130px;
                  height: 130px;
                  border-radius: 8px;
                  overflow: hidden;
                  border: 1px solid ${palette.border};
                  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.08);
                  transition: transform 0.3s ease;
                ">
                  <img src="${img}" style="
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                  "/>
                </div>
              `).join("")}
              <style>
                div[style*="overflow: hidden"]:hover {
                  transform: scale(1.03);
                }
              </style>
            </div>
          ` : ""}
          <style>
            div[style*="background: ${palette.bg}"]:hover {
              transform: translateY(-5px);
            }
          </style>
        </div>`;
      break;

    case 3: // Feature Showcase Layout
      htmlTemplate = `
        <div style="
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: 1.5rem;
          gap: 1rem;
          position: relative;
          overflow: hidden;
          font-family: 'Inter', sans-serif;
        ">
          ${abstractBackground()}
          ${arcAccent("15%", "85%", "40px", palette.accent, 0.4)}
          <div style="
            z-index: 2;
            padding: 1.25rem;
            background: ${palette.surface};
            border-radius: 8px;
            border: 1px solid ${palette.border};
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
            margin-bottom: 1rem;
          ">
            ${minimalBadge("Features")}
            <h2 style="
              font-size: 2rem;
              font-weight: 300;
              color: ${palette.text};
              margin: 0;
              letter-spacing: -0.01em;
            ">${titleText}</h2>
          </div>
          <div style="
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 1rem;
            z-index: 2;
          ">
            ${textContent.slice(0, 3).map((text, idx) => `
              <div style="
                background: ${palette.bg};
                border-radius: 8px;
                padding: 1.25rem;
                border: 1px solid ${palette.border};
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
                transition: transform 0.3s ease;
                position: relative;
                overflow: hidden;
              ">
                ${images[idx] ? `
                  <div style="
                    width: 100%;
                    height: 100px;
                    border-radius: 6px;
                    overflow: hidden;
                    margin-bottom: 0.75rem;
                    border: 1px solid ${palette.border};
                  ">
                    <img src="${images[idx]}" style="
                      width: 100%;
                      height: 100%;
                      object-fit: cover;
                    "/>
                  </div>
                ` : ""}
                <div style="
                  position: absolute;
                  top: 0;
                  left: 0;
                  width: 100%;
                  height: 3px;
                  background: linear-gradient(90deg, ${palette.accent}, ${palette.accent2});
                "></div>
                <div style="
                  display: flex;
                  align-items: center;
                  gap: 0.5rem;
                  margin-bottom: 0.5rem;
                ">
                  <div style="
                    width: 16px;
                    height: 16px;
                    background: ${palette.accent};
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: ${palette.bg};
                    font-size: 0.7rem;
                    font-weight: 500;
                  "></div>
                  <h3 style="
                    font-size: 0.95rem;
                    font-weight: 500;
                    color: ${palette.text};
                    margin: 0;
                  ">Feature ${idx + 1}</h3>
                </div>
                <p style="
                  font-size: 0.85rem;
                  color: ${palette.textSecondary};
                  line-height: 1.4;
                  margin: 0;
                ">${text || "Elegant and functional design."}</p>
              </div>
            `).join("")}
          </div>
          <style>
            div[style*="background: ${palette.bg}"]:hover {
              transform: translateY(-5px);
            }
          </style>
        </div>`;
      break;

    case 4: // Timeline Flow Layout
      htmlTemplate = `
        <div style="
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: 1.5rem;
          position: relative;
          overflow: hidden;
          font-family: 'Inter', sans-serif;
        ">
          ${abstractBackground()}
          ${arcAccent("10%", "90%", "45px", palette.accent2, 0.3)}
          <div style="
            z-index: 2;
            padding: 1.25rem;
            background: ${palette.bg};
            border-radius: 8px;
            border: 1px solid ${palette.border};
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
            margin-bottom: 1rem;
          ">
            ${minimalBadge("Timeline")}
            <h2 style="
              font-size: 2rem;
              font-weight: 300;
              color: ${palette.text};
              margin: 0;
              letter-spacing: -0.01em;
            ">${titleText}</h2>
          </div>
          <div style="
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
            z-index: 2;
            max-height: 360px;
            overflow: auto;
          ">
            ${textContent.slice(0, 4).map((text, idx) => `
              <div style="
                background: ${palette.surface};
                border-radius: 8px;
                padding: 1rem;
                border: 1px solid ${palette.border};
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
                transition: transform 0.3s ease;
                display: flex;
                align-items: center;
                gap: 0.75rem;
                position: relative;
                overflow: hidden;
                min-height: 60px;
              ">
                <div style="
                  position: absolute;
                  left: 0;
                  top: 0;
                  width: 3px;
                  height: 100%;
                  background: linear-gradient(180deg, ${palette.accent}, ${palette.accent2});
                "></div>
                <div style="
                  width: 20px;
                  height: 20px;
                  background: ${palette.accent};
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  color: ${palette.bg};
                  font-size: 0.7rem;
                  font-weight: 500;
                ">${String(idx + 1).padStart(2, "0")}</div>
                <div>
                  <h3 style="
                    font-size: 0.95rem;
                    font-weight: 500;
                    color: ${palette.text};
                    margin: 0 0 0.25rem;
                  ">Step ${idx + 1}</h3>
                  <p style="
                    font-size: 0.85rem;
                    color: ${palette.textSecondary};
                    line-height: 1.4;
                    margin: 0;
                  ">${text}</p>
                </div>
              </div>
            `).join("")}
          </div>
          <style>
            div[style*="background: ${palette.surface}"]:hover {
              transform: translateY(-5px);
            }
          </style>
        </div>`;
      break;

    default:
      htmlTemplate = `<div>Error: Invalid layout type</div>`;
  }

  elements.push({
    element_type: "html",
    konva_component: "Konva.HTML",
    properties: {
      x: 0,
      y: 0,
      width: 960,
      height: 540,
      htmlContent: htmlTemplate,
      zIndex: 0,
    },
    id: `minimalist-html-template-${slide_id || slideIndex}`,
  });

  return {
    slide_id: slide_id || `minimalist-slide-${slideIndex}`,
    title: titleText,
    image_url: images[0],
    elements,
    htmlTemplate,
  };
};
