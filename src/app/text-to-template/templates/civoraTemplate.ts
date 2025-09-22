import type { Slide, BackendSlide } from "../types/presentation";

// Corporate, minimal color palette with color-blocking
const palette = {
    primary: "#114B5F", // Midnight Green
    secondary: "#FFD23F", // Amber Gold
    neutral: "#F9F7F3", // Ivory White
    dark: "#121212", // Onyx Black
    border: "#E0E0E0", // Light gray border
    text: "#121212", // Onyx Black
    textSecondary: "#3A4F50", // Muted green
    textLight: "#F9F7F3", // Ivory White for dark backgrounds
};
const icons = {
    abstract: `...`,
    problem: `...`,
    method: `...`,
    finding: `...`,
    conclusion: `...`,
} as const;

type IconType = keyof typeof icons;

// Utility: Line-art icon (simple geometric shapes)
const lineArtIcon = (type: IconType, size = 24): string => {
    const icons = {
        abstract: `
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${palette.secondary}" stroke-width="1.5">
        <path d="M12 2L2 12L12 22L22 12L12 2Z" stroke-linejoin="round"/>
      </svg>
    `,
        problem: `
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${palette.secondary}" stroke-width="1.5">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 8v8M8 12h8"/>
      </svg>
    `,
        method: `
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${palette.secondary}" stroke-width="1.5">
        <path d="M4 12h16M12 4v16"/>
      </svg>
    `,
        finding: `
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${palette.secondary}" stroke-width="1.5">
        <path d="M3 3l18 18M3 21L21 3"/>
      </svg>
    `,
        conclusion: `
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${palette.secondary}" stroke-width="1.5">
        <circle cx="12" cy="12" r="8"/>
        <path d="M12 6v6h6"/>
      </svg>
    `,
    };
    return icons[type] || icons.abstract;
};

// Utility: Modular block with color-blocking
const modularBlock = (content: string, bgColor = palette.neutral, width = "100%", textColor = palette.text): string => `
  <div style="
    background: ${bgColor};
    padding: 1rem;
    border-radius: 6px;
    border: 1px solid ${palette.border};
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
    width: ${width};
    position: relative;
    z-index: 2;
    transition: transform 0.3s ease;
    color: ${bgColor === palette.primary || bgColor === palette.dark ? palette.textLight : textColor};
  ">
    ${content}
    <style>
      div[style*="background: ${bgColor}"]:hover {
        transform: translateY(-3px);
      }
    </style>
  </div>
`;

// Utility: Accent badge with Playfair Display
const accentBadge = (text: string, bgColor = palette.primary): string => `
  <div style="
    display: inline-block;
    padding: 0.25rem 0.75rem;
    background: ${bgColor};
    color: ${bgColor === palette.primary || bgColor === palette.dark ? palette.secondary : palette.neutral};
    font-family: 'Playfair Display', serif;
    font-style: italic;
    font-size: 0.7rem;
    font-weight: 500;
    text-transform: uppercase;
    border-radius: 10px;
    margin-bottom: 0.5rem;
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

export const createCivoraTemplate = (backendSlide: BackendSlide, slideIndex: number): Slide => {
    const { slide_id, slide_title, textBlock, titleBlock } = backendSlide;
    const elements: Slide["elements"] = [];

    const textContent = extractTextContent(textBlock);
    const titleText = titleBlock?.elements?.[0]?.text || slide_title?.text || `Slide ${slideIndex + 1}`;
    const images = extractImages(backendSlide);
    const layoutType = slideIndex % 5;
    let htmlTemplate = "";

    // Vertical sidebar
    const sidebar = `
    <div style="
      position: absolute;
      top: 0;
      left: 0;
      width: 120px;
      height: 540px;
      background: ${palette.dark};
      padding: 1rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      z-index: 3;
      font-family: 'Inter', sans-serif;
    ">
      <div style="
        width: 32px;
        height: 32px;
        background: ${palette.secondary};
        clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
        margin-bottom: 2rem;
      "></div>
    </div>
  `;

    // Footer
    const footer = `
    <div style="
      position: absolute;
      bottom: 0;
      left: 120px;
      width: 840px;
      height: 48px;
      background: linear-gradient(90deg, ${palette.primary}, ${palette.dark});
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 1.5rem;
      z-index: 2;
      border-top: 1px solid ${palette.dark};
    ">
      <div style="
        width: 24px;
        height: 24px;
        background: ${palette.secondary};
        clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
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
          font-family: 'Inter', sans-serif;
          background: ${palette.neutral};
        ">
          ${sidebar}
          <div style="
            margin-left: 120px;
            width: 840px;
            height: 492px;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            z-index: 2;
          ">
            <div style="
              max-width: 700px;
              text-align: center;
            ">
              ${modularBlock(`
                ${accentBadge("Abstract", palette.neutral)}
                <h1 style="
                  font-family: 'Neue Haas Grotesk', sans-serif;
                  font-weight: 900;
                  font-size: 2.5rem;
                  color: ${palette.dark};
                  line-height: 1.2;
                  margin-bottom: 1rem;
                ">
                  ${titleText.split(" ").map((word, idx) => `
                    <span style="display: inline-block; animation-delay: ${idx * 0.1}s">${word}&nbsp;</span>
                  `).join("")}
                </h1>
                <p style="
                  font-size: 0.95rem;
                  color: ${palette.textSecondary};
                  line-height: 1.7;
                  max-width: 600px;
                  margin: 0 auto 1rem;
                  text-align: justify;
                ">${textContent[0] || ""}</p>
                ${images.length > 0 ? `
                  <div style="
                    width: 200px;
                    max-height: 200px;
                    border-radius: 6px;
                    overflow: hidden;
                    margin: 1rem auto;
                    border: 1px solid ${palette.border};
                    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
                  ">
                    <img src="${images[0]}" style="
                      width: 100%;
                      height: 100%;
                      object-fit: cover;
                    "/>
                  </div>
                ` : ""}
                <style>
                  @keyframes fadeIn {
                    0% { opacity: 0; transform: translateY(10px); }
                    100% { opacity: 1; transform: translateY(0); }
                  }
                  h1 span { animation: fadeIn 0.5s ease-in-out both; }
                </style>
              `)}
            </div>
            <div style="
              position: absolute;
              top: 10%;
              right: 10%;
              width: 60px;
              height: 60px;
              border: 2px solid ${palette.secondary};
              clip-path: polygon(50% 0%, 100% 100%, 0% 100%);
              opacity: 0.3;
              z-index: 1;
            "></div>
          </div>
          ${footer}
        </div>`;
            break;

        case 1: // Research Problem
            htmlTemplate = `
        <div style="
          position: relative;
          width: 960px;
          height: 540px;
          overflow: hidden;
          font-family: 'Inter', sans-serif;
          background: ${palette.neutral};
        ">
          ${sidebar}
          <div style="
            margin-left: 120px;
            width: 840px;
            height: 492px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
            padding: 1rem;
            z-index: 2;
          ">
            <div>
              ${modularBlock(`
                ${accentBadge("Problem", palette.primary)}
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                  ${lineArtIcon("problem", 20)}
                  <h2 style="
                    font-family: 'Neue Haas Grotesk', sans-serif;
                    font-weight: 900;
                    font-size: 1.75rem;
                    color: ${palette.textLight};
                    line-height: 1.3;
                  ">${titleText}</h2>
                </div>
                ${images.length > 0 ? `
                  <div style="
                    width: 120px;
                    max-height: 160px;
                    border-radius: 6px;
                    overflow: hidden;
                    margin-bottom: 1rem;
                    border: 1px solid ${palette.border};
                    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
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
                  color: ${palette.textLight};
                  line-height: 1.6;
                  text-align: justify;
                ">${textContent[0] || ""}</p>
              `, palette.primary, "100%", palette.textLight)}
            </div>
            <div>
              ${modularBlock(`
                ${images.length > 1 ? `
                  <div style="
                    width: 100%;
                    max-height: 160px;
                    border-radius: 6px;
                    overflow: hidden;
                    margin-bottom: 1rem;
                    border: 1px solid ${palette.border};
                    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
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
                  ${textContent.slice(1, 4).map((t) => `
                    <li style="margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
                      ${lineArtIcon("problem", 16)}
                      <span>${t}</span>
                    </li>
                  `).join("")}
                </ul>
              `, palette.neutral)}
            </div>
          </div>
          ${footer}
        </div>`;
            break;

        case 2: // Methodology
            htmlTemplate = `
        <div style="
          position: relative;
          width: 960px;
          height: 540px;
          overflow: hidden;
          font-family: 'Inter', sans-serif;
          background: ${palette.neutral};
        ">
          ${sidebar}
          <div style="
            margin-left: 120px;
            width: 840px;
            height: 492px;
            padding: 1rem;
            z-index: 2;
          ">
            ${modularBlock(`
              ${accentBadge("Methodology", palette.neutral)}
              <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                ${lineArtIcon("method", 20)}
                <h2 style="
                  font-family: 'Neue Haas Grotesk', sans-serif;
                  font-weight: 900;
                  font-size: 1.75rem;
                  color: ${palette.dark};
                  line-height: 1.3;
                ">${titleText}</h2>
              </div>
              ${images.length > 0 ? `
                <div style="
                  width: 120px;
                  max-height: 160px;
                  border-radius: 6px;
                  overflow: hidden;
                  margin-bottom: 1rem;
                  border: 1px solid ${palette.border};
                  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
                  margin-left: auto;
                  margin-right: auto;
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
                max-width: 600px;
                margin: 0 auto 1rem;
                text-align: justify;
              ">${textContent[0] || ""}</p>
              <div style="
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
                gap: 1rem;
              ">
                ${textContent.slice(1, 5).map((text, idx) => `
                  ${modularBlock(`
                    <div style="
                      width: 32px;
                      height: 32px;
                      background: ${idx % 2 === 0 ? palette.primary : palette.secondary};
                      border-radius: 50%;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      margin: 0 auto 0.5rem;
                      color: ${palette.textLight};
                      font-family: 'Inter', sans-serif;
                      font-size: 0.9rem;
                      font-weight: 600;
                    ">${idx + 1}</div>
                    <p style="
                      font-size: 0.85rem;
                      color: ${idx % 2 === 0 ? palette.textLight : palette.text};
                      line-height: 1.5;
                      text-align: center;
                    ">${text}</p>
                  `, idx % 2 === 0 ? palette.primary : palette.neutral, "100%", idx % 2 === 0 ? palette.textLight : palette.text)}
                `).join("")}
              </div>
            `)}
          </div>
          ${footer}
        </div>`;
            break;

        case 3: // Key Findings
            htmlTemplate = `
        <div style="
          position: relative;
          width: 960px;
          height: 540px;
          overflow: hidden;
          font-family: 'Inter', sans-serif;
          background: ${palette.neutral};
        ">
          ${sidebar}
          <div style="
            margin-left: 120px;
            width: 840px;
            height: 492px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
            padding: 1rem;
            z-index: 2;
          ">
            <div>
              ${modularBlock(`
                ${accentBadge("Findings", palette.primary)}
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                  ${lineArtIcon("finding", 20)}
                  <h2 style="
                    font-family: 'Neue Haas Grotesk', sans-serif;
                    font-weight: 900;
                    font-size: 1.75rem;
                    color: ${palette.textLight};
                    line-height: 1.3;
                  ">${titleText}</h2>
                </div>
                ${images.length > 1 ? `
                  <div style="
                    width: 120px;
                    max-height: 160px;
                    border-radius: 6px;
                    overflow: hidden;
                    margin-bottom: 1rem;
                    border: 1px solid ${palette.border};
                    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
                  ">
                    <img src="${images[1]}" style="
                      width: 100%;
                      height: 100%;
                      object-fit: cover;
                    "/>
                  </div>
                ` : ""}
                ${textContent.slice(0, 3).map((t, idx) => `
                  <div style="
                    display: flex;
                    align-items: flex-start;
                    gap: 0.5rem;
                    margin-bottom: 0.75rem;
                  ">
                    ${lineArtIcon("finding", 16)}
                    <p style="
                      font-size: 0.85rem;
                      color: ${palette.textLight};
                      line-height: 1.5;
                    ">${t}</p>
                  </div>
                `).join("")}
              `, palette.primary, "100%", palette.textLight)}
            </div>
            <div>
              ${modularBlock(`
                ${images.length > 0 ? `
                  <div style="
                    width: 100%;
                    max-height: 160px;
                    border-radius: 6px;
                    overflow: hidden;
                    margin-bottom: 1rem;
                    border: 1px solid ${palette.border};
                    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
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
                  text-align: justify;
                ">${textContent[3] || ""}</p>
              `, palette.neutral)}
            </div>
          </div>
          ${footer}
        </div>`;
            break;

        case 4: // Conclusion & Future Work
            htmlTemplate = `
        <div style="
          position: relative;
          width: 960px;
          height: 540px;
          overflow: hidden;
          font-family: 'Inter', sans-serif;
          background: ${palette.neutral};
        ">
          ${sidebar}
          <div style="
            margin-left: 120px;
            width: 840px;
            height: 492px;
            padding: 1rem;
            position: relative;
            z-index: 2;
          ">
            <div style="
              position: absolute;
              top: 50%;
              left: 50%;
              width: 600px;
              height: 600px;
              background: ${palette.secondary};
              opacity: 0.15;
              transform: translate(-50%, -50%) rotate(45deg);
              z-index: 1;
            "></div>
            ${modularBlock(`
              ${accentBadge("Conclusion", palette.primary)}
              <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
                ${lineArtIcon("conclusion", 20)}
                <h2 style="
                  font-family: 'Neue Haas Grotesk', sans-serif;
                  font-weight: 900;
                  font-size: 1.75rem;
                  color: ${palette.dark};
                  line-height: 1.3;
                ">${titleText}</h2>
              </div>
              <p style="
                font-size: 0.9rem;
                color: ${palette.textSecondary};
                line-height: 1.6;
                max-width: 600px;
                margin: 0 auto 0.75rem;
                text-align: justify;
              ">${textContent[0] || ""}</p>
              <div style="
                display: grid;
                grid-template-columns: ${images.length > 0 ? 'repeat(3, 1fr)' : '1fr 1fr'};
                gap: 1rem;
                max-height: 300px;
                overflow: hidden;
              ">
                ${images.length > 0 ? `
                  <div style="
                    background: ${palette.neutral};
                    padding: 0.75rem;
                    border-radius: 6px;
                    border: 1px solid ${palette.border};
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-start;
                  ">
                    ${images[0] ? `
                      <div style="
                        width: 100%;
                        max-height: 120px;
                        border-radius: 6px;
                        overflow: hidden;
                        margin-bottom: 0.5rem;
                        border: 1px solid ${palette.border};
                        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
                      ">
                        <img src="${images[0]}" style="
                          width: 100%;
                          height: 100%;
                          object-fit: cover;
                        "/>
                      </div>
                    ` : ""}
                    ${images[1] ? `
                      <div style="
                        width: 100%;
                        max-height: 120px;
                        border-radius: 6px;
                        overflow: hidden;
                        border: 1px solid ${palette.border};
                        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
                      ">
                        <img src="${images[1]}" style="
                          width: 100%;
                          height: 100%;
                          object-fit: cover;
                        "/>
                      </div>
                    ` : ""}
                  </div>
                ` : ""}
                <div style="
                  background: ${palette.primary};
                  padding: 0.75rem;
                  border-radius: 6px;
                  border: 1px solid ${palette.border};
                  color: ${palette.textLight};
                ">
                  <div style="
                    width: 32px;
                    height: 32px;
                    background: ${palette.secondary};
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 0.5rem;
                    color: ${palette.textLight};
                    font-family: 'Inter', sans-serif;
                    font-size: 0.9rem;
                    font-weight: 600;
                  ">1</div>
                  <h3 style="
                    font-family: 'Inter', sans-serif;
                    font-weight: 600;
                    font-size: 0.9rem;
                    color: ${palette.textLight};
                    margin-bottom: 0.5rem;
                    text-align: center;
                  ">Implications</h3>
                  <ul style="
                    font-size: 0.85rem;
                    color: ${palette.textLight};
                    line-height: 1.5;
                    padding-left: 1.5rem;
                    max-height: 200px;
                    overflow-y: auto;
                  ">
                    ${textContent.slice(1, 3).map((t) => `<li style="margin-bottom: 0.5rem;">${t}</li>`).join("")}
                  </ul>
                </div>
                <div style="
                  background: ${palette.primary};
                  padding: 0.75rem;
                  border-radius: 6px;
                  border: 1px solid ${palette.border};
                  color: ${palette.textLight};
                ">
                  <div style="
                    width: 32px;
                    height: 32px;
                    background: ${palette.secondary};
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 0.5rem;
                    color: ${palette.textLight};
                    font-family: 'Inter', sans-serif;
                    font-size: 0.9rem;
                    font-weight: 600;
                  ">2</div>
                  <h3 style="
                    font-family: 'Inter', sans-serif;
                    font-weight: 600;
                    font-size: 0.9rem;
                    color: ${palette.textLight};
                    margin-bottom: 0.5rem;
                    text-align: center;
                  ">Next Steps</h3>
                  <ul style="
                    font-size: 0.85rem;
                    color: ${palette.textLight};
                    line-height: 1.5;
                    padding-left: 1.5rem;
                    max-height: 200px;
                    overflow-y: auto;
                  ">
                    ${textContent.slice(3, 5).map((t) => `<li style="margin-bottom: 0.5rem;">${t}</li>`).join("")}
                  </ul>
                </div>
              </div>
            `, palette.neutral, "100%", palette.text)}
          </div>
          ${footer}
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
        id: `civora-html-template-${slide_id || slideIndex}`,
    });

    return {
        slide_id: slide_id || `civora-slide-${slideIndex}`,
        title: titleText,
        image_url: images[0],
        elements,
        htmlTemplate,
    };
};