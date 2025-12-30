import type { Slide, BackendSlide } from "../types/presentation";

// Enhanced corporate color palette with vibrant, gradient-friendly tones
const palette = {
  primary: "#1E3A8A", // Rich navy
  secondary: "#9A3412", // Deep terracotta
  accent: "#F43F5E", // Vibrant rose
  accent2: "#F59E0B", // Bright amber
  bg: "#F5F5F4", // Soft neutral
  surface: "#FEF3C7", // Warm cream
  text: "#111827", // Deep charcoal
  textSecondary: "#4B5563", // Muted gray
  gradientStart: "#F43F5E", // Rose gradient start
  gradientEnd: "#F59E0B", // Amber gradient end
  gradientMid: "#EC4899", // Pink gradient mid-tone
};

// Utility: Decorative arc shape
const decorativeArc = (
  top: string,
  left: string,
  size = "150px",
  color = palette.accent,
  opacity = 0.2
): string => `
  <div style="
    position: absolute;
    top: ${top};
    left: ${left};
    width: ${size};
    height: ${size};
    border: 4px solid ${color};
    border-radius: 50%;
    clip-path: circle(50% at 50% 50%);
    opacity: ${opacity};
    z-index: 1;
    transform: rotate(45deg);
  "></div>
`;

// Utility: Subtle grid pattern
const gridPattern = `
  <div style="
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background-image: 
      linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px);
    background-size: 20px 20px;
    z-index: 0;
    opacity: 0.1;
  "></div>
`;

// Utility: Modern badge with gradient
const modernBadge = (text: string): string => `
  <div style="
    display: inline-block;
    padding: 0.5rem 1.5rem;
    background: linear-gradient(90deg, ${palette.accent}, ${palette.accent2});
    color: ${palette.bg};
    font-family: 'Raleway', sans-serif;
    font-size: 0.85rem;
    font-weight: 600;
    text-transform: uppercase;
    border-radius: 20px;
    letter-spacing: 1px;
    margin-bottom: 1rem;
  ">${text}</div>
`;

// Utility: Extract text
const getTextContent = (block: BackendSlide["textBlock"]): string[] => {
  if (!block?.elements) return [];
  return block.elements.map((el) => el.text || "").filter((text) => text.length > 0);
};

// Utility: Extract images
const getImages = (backendSlide: BackendSlide): string[] => {
  const images: string[] = [];
  if (backendSlide.image_url?.trim()) images.push(backendSlide.image_url.trim());
  backendSlide.imageBlock?.elements?.forEach((el) => {
    if (el.properties?.imageSrc?.trim()) images.push(el.properties.imageSrc.trim());
  });
  return images;
};

// Refactored Corporate Template Generator
export const createCorporateTemplate = (
  backendSlide: BackendSlide,
  slideIndex: number
): Slide => {
  const { slide_id, slide_title, textBlock, titleBlock } = backendSlide;
  const elements: Slide["elements"] = [];

  const textContent = getTextContent(textBlock);
  const titleText =
    titleBlock?.elements?.[0]?.text || slide_title?.text || `Slide ${slideIndex + 1}`;
  const images = getImages(backendSlide);
  const layoutType = slideIndex % 5;
  let htmlTemplate = "";

  switch (layoutType) {
    case 0: // Enhanced Hero Title Slide
      htmlTemplate = `
        <div style="
          display: flex;
          flex-direction: ${images.length > 0 ? 'row' : 'column'};
          align-items: center;
          justify-content: center;
          height: 100%;
          padding: 2rem;
          background: linear-gradient(135deg, ${palette.gradientStart}20, ${palette.gradientEnd}20, ${palette.bg});
          position: relative;
          overflow: hidden;
          font-family: 'Raleway', sans-serif;
          gap: 1.5rem;
        ">
          ${gridPattern}
          ${decorativeArc("10%", "90%", "180px", palette.accent2, 0.15)}
          ${decorativeArc("80%", "20%", "120px", palette.accent, 0.1)}
          <div style="
            flex: ${images.length > 0 ? '1' : 'auto'};
            max-width: ${images.length > 0 ? '550px' : '800px'};
            text-align: ${images.length > 0 ? 'left' : 'center'};
            z-index: 2;
            padding: 1.5rem;
            background: ${palette.surface};
            border-radius: 12px;
            box-shadow: 0 8px 16px rgba(0,0,0,0.1);
            transition: transform 0.3s ease;
          ">
            ${modernBadge("Introduction")}
            <h2 style="
              font-size: 2rem;
              font-weight: 800;
              color: ${palette.text};
              margin: 0 0 1rem;
              line-height: 1.2;
              text-shadow: 0 2px 4px rgba(0,0,0,0.1);
            ">${titleText}</h2>
            ${textContent.slice(0, 3).map((t, idx) => `
              <div style="
                display: flex;
                align-items: center;
                gap: 0.75rem;
                margin-bottom: 0.75rem;
                padding: 0.5rem 1rem;
                background: linear-gradient(90deg, ${palette.gradientMid}10, transparent);
                border-radius: 8px;
              ">
                <div style="
                  width: 10px;
                  height: 10px;
                  background: ${palette.accent2};
                  border-radius: 50%;
                "></div>
                <p style="
                  font-size: 1rem;
                  color: ${palette.textSecondary};
                  line-height: 1.5;
                  font-weight: 500;
                ">${t}</p>
              </div>
            `).join("")}
          </div>
          ${images.length > 0 ? `
            <div style="
              flex: 1;
              display: flex;
              justify-content: center;
              align-items: center;
              z-index: 2;
            ">
              <div style="
                position: relative;
                width: 90%;
                max-height: 350px;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 12px 24px rgba(0,0,0,0.2);
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
                  transform: scale(1.05);
                }
              </style>
            </div>
          ` : ""}
          <style>
            div[style*="background: ${palette.surface}"]:hover {
              transform: translateY(-8px);
            }
          </style>
        </div>`;
      break;

    case 1: // Enhanced Split Content Layout
      htmlTemplate = `
        <div style="
          display: grid;
          grid-template-columns: ${images.length > 0 ? '1fr 1fr' : '1fr'};
          height: 100%;
          padding: 2rem;
          background: linear-gradient(120deg, ${palette.gradientStart}10, ${palette.gradientEnd}10, ${palette.bg});
          position: relative;
          overflow: hidden;
          font-family: 'Raleway', sans-serif;
          align-items: center;
          gap: 1.5rem;
        ">
          ${gridPattern}
          ${decorativeArc("15%", "85%", "140px", palette.accent, 0.2)}
          ${decorativeArc("85%", "10%", "100px", palette.accent2, 0.15)}
          <div style="
            padding: 1.5rem;
            background: ${palette.surface};
            border-radius: 12px;
            box-shadow: 0 8px 16px rgba(0,0,0,0.1);
            transition: transform 0.3s ease;
            z-index: 2;
            display: flex;
            flex-direction: column;
            justify-content: center;
            max-height: 480px;
overflow: hidden;
          ">
            ${modernBadge("Overview")}
            <h2 style="
              font-size: 1.5rem;
              font-weight: 700;
              color: ${palette.text};
              margin-bottom: 1rem;
            ">${titleText}</h2>
            <div style="
              display: grid;
              gap: 0.75rem;
            ">
              ${textContent.slice(0, 4).map((t) => `
                <div style="
                  display: flex;
                  align-items: flex-start;
                  gap: 0.75rem;
                  padding: 0.5rem 0.75rem;
                  border-radius: 8px;
                  background: linear-gradient(90deg, ${palette.gradientMid}10, transparent);
                  min-height: 60px;
                ">
                  <div style="
                    width: 20px;
                    height: 20px;
                    background: linear-gradient(45deg, ${palette.accent}, ${palette.accent2});
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: ${palette.bg};
                    font-size: 0.8rem;
                    font-weight: 600;
                  ">${textContent.indexOf(t) + 1}</div>
                  <p style="
                    font-size: 0.95rem;
                    color: ${palette.textSecondary};
                    line-height: 1.5;
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
              flex-direction: column;
              gap: 1rem;
              justify-content: center;
              align-items: center;
            ">
              ${images.slice(0, 2).map((img, idx) => `
                <div style="
                  position: relative;
                  width: ${idx === 0 ? '85%' : '65%'};
                  max-height: ${idx === 0 ? '280px' : '180px'};
                  border-radius: 12px;
                  overflow: hidden;
                  box-shadow: 0 10px 20px rgba(0,0,0,0.15);
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
              transform: translateY(-8px);
            }
          </style>
        </div>`;
      break;

    case 2: // Impactful Quote
      htmlTemplate = `
        <div style="
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: 3rem;
          background: linear-gradient(135deg, ${palette.gradientStart}20, ${palette.gradientEnd}20);
          position: relative;
          overflow: hidden;
          font-family: 'Raleway', sans-serif;
        ">
          ${gridPattern}
          ${decorativeArc("10%", "20%", "160px", palette.accent, 0.15)}
          ${decorativeArc("80%", "80%", "120px", palette.accent2, 0.1)}
          <div style="
            z-index: 2;
            max-width: 700px;
            margin: 0 auto;
            padding: 2rem;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            backdrop-filter: blur(10px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.15);
            transition: transform 0.3s ease;
            text-align: center;
          ">
            <blockquote style="
              font-size: 2rem;
              font-weight: 500;
              color: ${palette.text};
              font-family: 'Georgia', serif;
              line-height: 1.4;
              margin: 0 0 1.5rem;
            ">${textContent[0] || "Vision shapes the future."}</blockquote>
            <cite style="
              font-size: 1.1rem;
              font-weight: 600;
              color: ${palette.accent};
            ">${titleText}</cite>
          </div>
          ${images.length > 0 ? `
            <div style="
              z-index: 2;
              margin-top: 2rem;
              display: flex;
              justify-content: center;
              gap: 1.5rem;
            ">
              ${images.slice(0, 2).map((img) => `
                <img src="${img}" style="
                  width: 220px;
                  height: 220px;
                  object-fit: cover;
                  border-radius: 12px;
                  box-shadow: 0 8px 16px rgba(0,0,0,0.15);
                  transition: transform 0.3s ease;
                "/>
              `).join("")}
              <style>
                img:hover {
                  transform: scale(1.05);
                }
              </style>
            </div>
          ` : ""}
          <style>
            div[style*="backdrop-filter"]:hover {
              transform: translateY(-10px);
            }
          </style>
        </div>`;
      break;

    case 3: // Feature Highlights
      const cardImages = images.slice(0, 3);
      const cardTexts = textContent.slice(0, 3);
      const placeholdersNeeded = 3 - cardImages.length;

      htmlTemplate = `
        <div style="
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: 2.5rem;
          background: ${palette.bg};
          position: relative;
          overflow: hidden;
          font-family: 'Raleway', sans-serif;
        ">
          ${gridPattern}
          ${decorativeArc("20%", "80%", "140px", palette.accent2, 0.15)}
          ${modernBadge("Features")}
          <h2 style="
            font-size: 2rem;
            font-weight: 500;
            color: ${palette.text};
            text-align: center;
            margin-bottom: 2rem;
          ">${titleText}</h2>
          <div style="
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 1.5rem;
            max-height: 380px;
          ">
            ${cardImages.map((img, idx) => `
              <div style="
                background: ${palette.surface};
                border-radius: 16px;
                padding: 1.5rem;
                box-shadow: 0 8px 16px rgba(0,0,0,0.1);
                transition: transform 0.3s ease;
                text-align: center;
                max-height: 380px;
              ">
                <img src="${img}" style="
                  width: 100%;
                  height: 160px;
                  object-fit: cover;
                  border-radius: 12px;
                  margin-bottom: 1rem;
                "/>
                <h3 style="
                  font-size: 1.5rem;
                  font-weight: 600;
                  color: ${palette.text};
                ">Feature ${idx + 1}</h3>
                <p style="
                  font-size: 0.9rem;
                  color: ${palette.textSecondary};
                  line-height: 1;
                ">${cardTexts[idx] || "Description placeholder"}</p>
              </div>
            `).join("")}
            ${Array.from({ length: placeholdersNeeded }).map(() => `
              <div style="
                background: ${palette.surface};
                border-radius: 16px;
                padding: 1.5rem;
                box-shadow: 0 8px 16px rgba(0,0,0,0.1);
                transition: transform 0.3s ease;
                text-align: center;
                display: flex;
                align-items: center;
                justify-content: center;
                color: ${palette.textSecondary};
                font-size: 1rem;
                font-weight: 500;
              ">Coming Soon</div>
            `).join("")}
          </div>
          <style>
            div[style*="background: ${palette.surface}"]:hover {
              transform: translateY(-8px);
            }
          </style>
        </div>`;
      break;

    case 4: // Dynamic Timeline
      htmlTemplate = `
        <div style="
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: 3rem;
          background: linear-gradient(120deg, ${palette.bg}, ${palette.gradientEnd}20);
          position: relative;
          overflow: hidden;
          font-family: 'Raleway', sans-serif;
        ">
          ${gridPattern}
          ${decorativeArc("85%", "15%", "160px", palette.accent, 0.15)}
          ${modernBadge("Roadmap")}
          <h2 style="
            font-size: 2rem;
            font-weight: 700;
            color: ${palette.text};
            text-align: center;
            margin-bottom: 2rem;
          ">${titleText}</h2>
          <div style="
            position: relative;
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1.5rem;
          ">
            ${textContent.slice(0, 4).map((t, idx) => `
              <div style="
                background: ${palette.surface};
                border-radius: 12px;
                padding: 1.5rem;
                box-shadow: 0 8px 16px rgba(0,0,0,0.1);
                transition: transform 0.3s ease;
                display: flex;
                align-items: center;
                gap: 1rem;
              ">
                <div style="
                  width: 40px;
                  height: 40px;
                  background: ${palette.accent};
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  color: ${palette.bg};
                  font-weight: 700;
                  font-size: 1rem;
                ">${String(idx + 1).padStart(2, '0')}</div>
                <div>
                  <h3 style="
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: ${palette.text};
                    margin-bottom: 0.5rem;
                  ">Phase ${idx + 1}</h3>
                  <p style="
                    font-size: 0.95rem;
                    color: ${palette.textSecondary};
                    line-height: 1.5;
                  ">${t}</p>
                </div>
              </div>
            `).join("")}
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
