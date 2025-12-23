import type { Slide, BackendSlide } from "../types/presentation";

// Futuristic, vibrant color palette with gradients
const palette = {
    primary: "#4B00FF", // Electric Indigo
    secondary: "#FF6B35", // Coral Orange
    neutral: "#FFF8F0", // Soft Cream
    dark: "#1A1A1A", // Deep Slate
    gradientStart: "#4B00FF", // Indigo gradient
    gradientEnd: "#FF6B35", // Coral gradient
    shapeFill: "#FFE4D6", // Light coral
    border: "#EDEDED", // Subtle cream border
    text: "#1A1A1A", // Deep Slate
    textSecondary: "#4B5EAA", // Muted indigo
};

// Utility: Abstract background with shapes and gradients
const abstractBackground = (index: number): string => {
    const shapes = [
        // Slide 0: Floating arcs
        `
      <div style="
        position: absolute;
        top: 10%;
        left: 90%;
        width: 80px;
        height: 80px;
        border: 2px solid ${palette.secondary};
        border-radius: 50%;
        clip-path: polygon(0 0, 100% 0, 100% 50%, 0 50%);
        opacity: 0.3;
        transform: rotate(30deg);
      "></div>
      <div style="
        position: absolute;
        bottom: 15%;
        left: 5%;
        width: 100px;
        height: 100px;
        background: ${palette.shapeFill};
        border-radius: 50%;
        opacity: 0.25;
      "></div>
      <div style="
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle at 75% 25%, rgba(255, 255, 255, 0.3), transparent 50%);
        opacity: 0.5;
      "></div>
    `,
        // Slide 1: Curved lines
        `
      <div style="
        position: absolute;
        top: 15%;
        right: 10%;
        width: 70px;
        height: 70px;
        border: 2px solid ${palette.primary};
        border-radius: 50%;
        clip-path: polygon(0 0, 100% 0, 100% 50%, 0 50%);
        opacity: 0.3;
        transform: rotate(45deg);
      "></div>
      <div style="
        position: absolute;
        bottom: 10%;
        left: 20%;
        width: 120px;
        height: 2px;
        background: ${palette.secondary};
        opacity: 0.4;
        transform: rotate(-45deg);
      "></div>
    `,
        // Slide 2: Scattered circles
        `
      <div style="
        position: absolute;
        top: 20%;
        left: 85%;
        width: 25px;
        height: 25px;
        background: ${palette.primary};
        border-radius: 50%;
        opacity: 0.4;
      "></div>
      <div style="
        position: absolute;
        bottom: 15%;
        left: 10%;
        width: 35px;
        height: 35px;
        background: ${palette.secondary};
        border-radius: 50%;
        opacity: 0.3;
      "></div>
      <div style="
        position: absolute;
        top: 10%;
        right: 15%;
        width: 20px;
        height: 20px;
        background: ${palette.shapeFill};
        border-radius: 50%;
        opacity: 0.4;
      "></div>
    `,
        // Slide 3: Overlapping arcs
        `
      <div style="
        position: absolute;
        top: 25%;
        left: 90%;
        width: 60px;
        height: 60px;
        border: 1px solid ${palette.secondary};
        border-radius: 50%;
        clip-path: polygon(0 0, 100% 0, 100% 50%, 0 50%);
        opacity: 0.3;
        transform: rotate(60deg);
      "></div>
      <div style="
        position: absolute;
        bottom: 20%;
        left: 5%;
        width: 80px;
        height: 80px;
        background: ${palette.shapeFill};
        border-radius: 50%;
        opacity: 0.2;
      "></div>
    `,
        // Slide 4: Diagonal wave
        `
      <div style="
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, transparent 40%, ${palette.shapeFill}20 60%, transparent 80%);
        opacity: 0.3;
      "></div>
      <div style="
        position: absolute;
        bottom: 10%;
        right: 5%;
        width: 50px;
        height: 50px;
        border: 1px solid ${palette.primary};
        border-radius: 50%;
        opacity: 0.3;
      "></div>
    `,
    ];
    return `
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
      ${shapes[index % 5]}
    </div>
  `;
};

// Utility: Floating card with hover effect
const floatingCard = (content: string, width = "100%", bgColor = palette.neutral): string => `
  <div style="
    background: ${bgColor};
    padding: 1rem;
    border-radius: 8px;
    border: 1px solid ${palette.border};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    width: ${width};
    position: relative;
    z-index: 2;
  ">
    ${content}
    <style>
      div[style*="background: ${bgColor}"]:hover {
        transform: translateY(-5px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }
    </style>
  </div>
`;

// Utility: Diagonal divider
const diagonalDivider = (color = palette.secondary): string => `
  <div style="
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, ${color}20 10%, transparent 30%);
    z-index: 1;
    opacity: 0.5;
  "></div>
`;

// Utility: Vibrant badge with gradient
const vibrantBadge = (text: string): string => `
  <div style="
    display: inline-block;
    padding: 0.3rem 1rem;
    background: linear-gradient(90deg, ${palette.primary}, ${palette.secondary});
    color: ${palette.neutral};
    font-family: 'Fira Code', monospace;
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

export const createVyntraTemplate = (backendSlide: BackendSlide, slideIndex: number): Slide => {
    const { slide_id, slide_title, textBlock, titleBlock } = backendSlide;
    const elements: Slide["elements"] = [];

    const textContent = extractTextContent(textBlock);
    const titleText = titleBlock?.elements?.[0]?.text || slide_title?.text || `Slide ${slideIndex + 1}`;
    const images = extractImages(backendSlide);
    const layoutType = slideIndex % 5;
    let htmlTemplate = "";

    // Sticky header
    const header = `
    <div style="
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 48px;
      background: linear-gradient(90deg, ${palette.primary}cc, ${palette.secondary}cc);
      padding: 0.75rem 1.5rem;
      z-index: 3;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-family: 'Poppins', sans-serif;
      backdrop-filter: blur(4px);
    ">
      <div style="
        width: 36px;
        height: 36px;
        background: ${palette.shapeFill};
        clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
        opacity: 0.9;
      "></div>
    </div>
  `;

    switch (layoutType) {
        case 0: // Title & Abstract
            htmlTemplate = `
        <div style="
          position: relative;
          width: 960px;
          height: 540px;
          overflow: hidden;
          font-family: 'IBM Plex Sans', sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          ${abstractBackground(0)}
          ${header}
          ${diagonalDivider()}
          <div style="
            margin-top: 60px;
            max-height: 480px;
            text-align: center;
            max-width: 700px;
            z-index: 2;
          ">
            ${floatingCard(`
              ${vibrantBadge("Abstract")}
              <h2 style="
                font-family: 'Poppins', sans-serif;
                font-weight: 800;
                font-size: 2.25rem;
                color: ${palette.text};
                margin-bottom: 1rem;
                line-height: 1.3;
                text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              ">${titleText}</h2>
              <p style="
                font-size: 0.95rem;
                color: ${palette.textSecondary};
                line-height: 1.7;
                max-width: 600px;
                margin: 0 auto;
                text-align: justify;
              ">${textContent[0] || ""}</p>
            `)}
          </div>
        </div>`;
            break;

        case 1: // Research Problem
            htmlTemplate = `
        <div style="
          position: relative;
          width: 960px;
          height: 540px;
          overflow: hidden;
          font-family: 'IBM Plex Sans', sans-serif;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          padding: 1.5rem;
        ">
          ${abstractBackground(1)}
          ${header}
          ${diagonalDivider(palette.primary)}
          <div style="
            margin-top: 60px;
            max-height: 480px;
            z-index: 2;
          ">
            ${floatingCard(`
              ${vibrantBadge("Problem")}
              ${images.length > 0 ? `
                <div style="
                  width: 120px;
                  max-height: 160px;
                  border-radius: 8px;
                  overflow: hidden;
                  margin-bottom: 1rem;
                  border: 1px solid ${palette.border};
                  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                ">
                  <img src="${images[0]}" style="
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                  "/>
                </div>
              ` : ""}
              <h2 style="
                font-family: 'Poppins', sans-serif;
                font-weight: 800;
                font-size: 1.75rem;
                color: ${palette.text};
                margin-bottom: 1rem;
                line-height: 1.4;
              ">${titleText}</h2>
              <p style="
                font-size: 0.9rem;
                color: ${palette.textSecondary};
                line-height: 1.7;
                text-align: justify;
              ">${textContent[0] || ""}</p>
            `)}
          </div>
          <div style="
            margin-top: 60px;
            max-height: 480px;
            z-index: 2;
          ">
            ${floatingCard(`
              ${images.length > 1 ? `
                <div style="
                  width: 100%;
                  max-height: 160px;
                  border-radius: 8px;
                  overflow: hidden;
                  margin-bottom: 1rem;
                  border: 1px solid ${palette.border};
                ">
                  <img src="${images[1]}" style="
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                  "/>
                </div>
              ` : ""}
              <ul style="
                font-size: 0.85rem;
                color: ${palette.textSecondary};
                line-height: 1.6;
                padding-left: 1.5rem;
              ">
                ${textContent.slice(1, 4).map((t) => `<li style="margin-bottom: 0.5rem;">${t}</li>`).join("")}
              </ul>
            `)}
          </div>
        </div>`;
            break;

        case 2: // Methodology
            htmlTemplate = `
        <div style="
          position: relative;
          width: 960px;
          height: 540px;
          overflow: hidden;
          font-family: 'IBM Plex Sans', sans-serif;
          padding: 1.5rem;
        ">
          ${abstractBackground(2)}
          ${header}
          ${diagonalDivider()}
          <div style="
            margin-top: 60px;
            max-height: 480px;
            text-align: center;
            max-width: 800px;
            margin-left: auto;
            margin-right: auto;
            z-index: 2;
          ">
            ${floatingCard(`
              ${vibrantBadge("Methodology")}
              <h2 style="
                font-family: 'Poppins', sans-serif;
                font-weight: 800;
                font-size: 1.75rem;
                color: ${palette.text};
                margin-bottom: 1rem;
                line-height: 1.3;
              ">${titleText}</h2>
              <p style="
                font-size: 0.9rem;
                color: ${palette.textSecondary};
                line-height: 1.7;
                max-width: 600px;
                margin: 0 auto;
              ">${textContent[0] || ""}</p>
            `)}
            <div style="
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
              gap: 1rem;
              margin-top: 1rem;
            ">
              ${textContent.slice(1, 5).map((text, idx) => `
                ${floatingCard(`
                  <div style="
                    width: 48px;
                    height: 48px;
                    background: ${idx % 2 === 0 ? palette.primary : palette.secondary};
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 0.75rem;
                    color: ${palette.neutral};
                    font-size: 1.2rem;
                    font-family: 'Fira Code', monospace;
                  ">${idx + 1}</div>
                  <p style="
                    font-size: 0.85rem;
                    color: ${palette.textSecondary};
                    line-height: 1.5;
                  ">${text}</p>
                `, "100%", idx % 2 === 0 ? palette.neutral : `${palette.neutral}ee`)}
              `).join("")}
            </div>
          </div>
        </div>`;
            break;

        case 3: // Key Findings
            htmlTemplate = `
        <div style="
          position: relative;
          width: 960px;
          height: 540px;
          overflow: hidden;
          font-family: 'IBM Plex Sans', sans-serif;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          padding: 1.5rem;
        ">
          ${abstractBackground(3)}
          ${header}
          ${diagonalDivider(palette.primary)}
          <div style="
            margin-top: 60px;
            max-height: 480px;
            z-index: 2;
          ">
            ${floatingCard(`
              ${vibrantBadge("Findings")}
              <h2 style="
                font-family: 'Poppins', sans-serif;
                font-weight: 800;
                font-size: 1.75rem;
                color: ${palette.text};
                margin-bottom: 1rem;
                line-height: 1.4;
              ">${titleText}</h2>
              ${textContent.slice(0, 3).map((t, idx) => `
                <div style="
                  display: flex;
                  align-items: flex-start;
                  gap: 0.75rem;
                  margin-bottom: 1rem;
                ">
                  <div style="
                    width: 24px;
                    height: 24px;
                    background: ${idx % 2 === 0 ? palette.primary : palette.secondary};
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: ${palette.neutral};
                    font-family: 'Fira Code', monospace;
                    font-size: 0.8rem;
                    font-weight: 500;
                    flex-shrink: 0;
                  ">${idx + 1}</div>
                  <p style="
                    font-size: 0.85rem;
                    color: ${palette.textSecondary};
                    line-height: 1.5;
                  ">${t}</p>
                </div>
              `).join("")}
            `)}
          </div>
          <div style="
            margin-top: 60px;
            max-height: 480px;
            z-index: 2;
          ">
            ${floatingCard(`
              ${images.length > 0 ? `
                <div style="
                  width: 100%;
                  max-height: 160px;
                  border-radius: 8px;
                  overflow: hidden;
                  margin-bottom: 1rem;
                  border: 1px solid ${palette.border};
                ">
                  <img src="${images[0]}" style="
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                  "/>
                </div>
              ` : ""}
              <p style="
                font-size: 0.9rem;
                color: ${palette.textSecondary};
                line-height: 1.6;
                text-align: center;
              ">${textContent[3] || ""}</p>
            `)}
          </div>
       

        </div>`;
            break;

        case 4: // Conclusion & Future Work
            htmlTemplate = `
        <div style="
          position: relative;
          width: 960px;
          height: 540px;
          overflow: hidden;
          font-family: 'IBM Plex Sans', sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          ${abstractBackground(4)}
          ${header}
          ${diagonalDivider()}
          <div style="
            margin-top: 60px;
            max-height: 480px;
            max-width: 700px;
            z-index: 2;
          ">
            ${floatingCard(`
              ${vibrantBadge("Conclusion")}
              <h2 style="
                font-family: 'Poppins', sans-serif;
                font-weight: 800;
                font-size: 2.25rem;
                color: ${palette.text};
                margin-bottom: 1rem;
                line-height: 1.3;
                text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              ">${titleText}</h2>
              <p style="
                font-size: 0.95rem;
                color: ${palette.textSecondary};
                line-height: 1.7;
                max-width: 600px;
                margin: 0 auto;
                text-align: justify;
              ">${textContent[0] || ""}</p>
              <div style="
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 1rem;
                margin-top: 1rem;
                max-height: 300px;
                overflow: auto;
              ">
                <div style="
                  background: ${palette.neutral}ee;
                  padding: 1rem;
                  border-radius: 8px;
                  border: 1px solid ${palette.border};
                ">
                  <h3 style="
                    font-family: 'Poppins', sans-serif;
                    font-weight: 600;
                    font-size: 0.95rem;
                    color: ${palette.text};
                    margin-bottom: 0.75rem;
                  ">Implications</h3>
                  <ul style="
                    font-size: 0.85rem;
                    color: ${palette.textSecondary};
                    line-height: 1.6;
                    padding-left: 1.5rem;
                  ">
                    ${textContent.slice(1, 3).map((t) => `<li style="margin-bottom: 0.5rem;">${t}</li>`).join("")}
                  </ul>
                </div>
                <div style="
                  background: ${palette.neutral}ee;
                  padding: 1rem;
                  border-radius: 8px;
                  border: 1px solid ${palette.border};
                ">
                  <h3 style="
                    font-family: 'Poppins', sans-serif;
                    font-weight: 600;
                    font-size: 0.95rem;
                    color: ${palette.text};
                    margin-bottom: 0.75rem;
                  ">Next Steps</h3>
                  <ul style="
                    font-size: 0.85rem;
                    color: ${palette.textSecondary};
                    line-height: 1.6;
                    padding-left: 1.5rem;
                  ">
                    ${textContent.slice(3, 5).map((t) => `<li style="margin-bottom: 0.5rem;">${t}</li>`).join("")}
                  </ul>
                </div>
              </div>
            `)}
          </div>
          <div style="
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            background: linear-gradient(90deg, ${palette.primary}, ${palette.secondary});
            height: 3px;
            z-index: 3;
          "></div>
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
        id: `vyntra-html-template-${slide_id || slideIndex}`,
    });

    return {
        slide_id: slide_id || `vyntra-slide-${slideIndex}`,
        title: titleText,
        image_url: images[0],
        elements,
        htmlTemplate,
    };
};