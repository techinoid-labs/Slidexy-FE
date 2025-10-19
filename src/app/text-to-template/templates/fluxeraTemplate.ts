import type { Slide, BackendSlide } from "../types/presentation";

// Dynamic, modular color palette with gradients
const palette = {
    primary: "#00D1C1", // Vivid Teal
    secondary: "#FF2D95", // Magenta Pink
    neutral: "#F5F5F5", // Soft Gray
    dark: "#1C1C1C", // Deep Charcoal
    gradientStart: "#00D1C1", // Teal gradient
    gradientEnd: "#FF2D95", // Magenta gradient
    shapeFill: "#FFE4E1", // Light pink for shapes
    border: "#E5E5E5", // Light gray border
    text: "#1C1C1C", // Deep Charcoal
    textSecondary: "#6B6B6B", // Muted gray
    textLight: "#F5F5F5", // Soft Gray for dark backgrounds
};

// Utility: Floating module with hover effect
const floatingModule = (content: string, width = "100%", bgColor = palette.neutral, textColor = palette.text): string => `
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
    color: ${bgColor === palette.dark || bgColor.includes('gradient') ? palette.textLight : textColor};
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

// Utility: Vibrant badge with gradient
const vibrantBadge = (text: string, bgColor = `linear-gradient(90deg, ${palette.gradientStart}, ${palette.gradientEnd})`): string => `
  <div style="
    display: inline-block;
    padding: 0.3rem 1rem;
    background: ${bgColor};
    color: ${palette.textLight};
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.7rem;
    font-weight: 500;
    text-transform: uppercase;
    border-radius: 12px;
    letter-spacing: 0.06em;
    margin-bottom: 0.5rem;
  ">${text}</div>
`;
const icons = {
    abstract: `...`,
    problem: `...`,
    method: `...`,
    finding: `...`,
    conclusion: `...`,
} as const;

type IconType = keyof typeof icons;
// Utility: Line-art icon for modular motion
const lineArtIcon = (type: IconType, size = 24): string => {
    const icons = {
        abstract: `
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${palette.secondary}" stroke-width="1.5">
        <path d="M3 12h18M12 3v18" stroke-linejoin="round"/>
      </svg>
    `,
        problem: `
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${palette.secondary}" stroke-width="1.5">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 6v12"/>
      </svg>
    `,
        method: `
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${palette.secondary}" stroke-width="1.5">
        <path d="M6 6l12 12M6 18L18 6"/>
      </svg>
    `,
        finding: `
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${palette.secondary}" stroke-width="1.5">
        <rect x="4" y="4" width="16" height="16" rx="2"/>
        <path d="M8 12h8"/>
      </svg>
    `,
        conclusion: `
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${palette.secondary}" stroke-width="1.5">
        <circle cx="12" cy="12" r="8"/>
        <path d="M12 8v8M8 12h8"/>
      </svg>
    `,
    };
    return icons[type] || icons.abstract;
};

// Utility: Abstract background patterns for motion
const abstractBackground = (slideIndex: number): string => {
    const patterns = [
        // Slide 0: Arcs
        `
      <div style="
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle at 50% 50%, ${palette.neutral} 50%, ${palette.shapeFill}40 70%);
        z-index: 1;
      ">
        <svg style="position: absolute; top: 10%; left: 10%; width: 80%; height: 80%; opacity: 0.3;">
          <path d="M0 100A100 100 0 0 1 100 0" fill="none" stroke="${palette.primary}" stroke-width="2"/>
          <path d="M0 120A120 120 0 0 1 120 0" fill="none" stroke="${palette.secondary}" stroke-width="2"/>
        </svg>
      </div>
    `,
        // Slide 1: Diagonal lines
        `
      <div style="
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: ${palette.neutral};
        z-index: 1;
      ">
        <svg style="width: 100%; height: 100%; opacity: 0.2;">
          <line x1="0" y1="0" x2="960" y2="540" stroke="${palette.primary}" stroke-width="2"/>
          <line x1="0" y1="50" x2="910" y2="540" stroke="${palette.secondary}" stroke-width="2"/>
        </svg>
      </div>
    `,
        // Slide 2: Circles
        `
      <div style="
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: ${palette.neutral};
        z-index: 1;
      ">
        <svg style="width: 100%; height: 100%; opacity: 0.25;">
          <circle cx="200" cy="100" r="80" fill="none" stroke="${palette.primary}" stroke-width="2"/>
          <circle cx="250" cy="150" r="60" fill="none" stroke="${palette.secondary}" stroke-width="2"/>
        </svg>
      </div>
    `,
        // Slide 3: Overlapping arcs
        `
      <div style="
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: ${palette.neutral};
        z-index: 1;
      ">
        <svg style="width: 100%; height: 100%; opacity: 0.3;">
          <path d="M0 300A200 200 0 0 1 200 100" fill="none" stroke="${palette.primary}" stroke-width="2"/>
          <path d="M50 350A200 200 0 0 1 250 150" fill="none" stroke="${palette.secondary}" stroke-width="2"/>
        </svg>
      </div>
    `,
        // Slide 4: Diagonal wave
        `
      <div style="
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle at 50% 50%, ${palette.neutral} 50%, ${palette.shapeFill}40 70%);
        z-index: 1;
      ">
        <svg style="width: 100%; height: 100%; opacity: 0.3;">
          <path d="M0 100C100 50, 200 150, 300 100C400 50, 500 150, 600 100C700 50, 800 150, 960 100" fill="none" stroke="${palette.secondary}" stroke-width="2"/>
        </svg>
      </div>
    `,
    ];
    return patterns[slideIndex];
};

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

export const createFluxeraTemplate = (backendSlide: BackendSlide, slideIndex: number): Slide => {
    const { slide_id, slide_title, textBlock, titleBlock } = backendSlide;
    const elements: Slide["elements"] = [];

    const textContent = extractTextContent(textBlock);
    const titleText = titleBlock?.elements?.[0]?.text || slide_title?.text || `Slide ${slideIndex + 1}`;
    const images = extractImages(backendSlide);
    const layoutType = slideIndex % 5;
    let htmlTemplate = "";

    // Overlay menu (hover to expand)


    switch (layoutType) {
        case 0: // Title & Abstract
            htmlTemplate = `
        <div style="
          position: relative;
          width: 960px;
          height: 540px;
          overflow: hidden;
          font-family: 'Public Sans', sans-serif;
          background: ${palette.neutral};
        ">
          ${abstractBackground(0)}
          <div style="
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
            padding: 1rem;
            height: 100%;
            align-items: center;
            z-index: 2;
          ">
            <div style="
              display: flex;
              flex-direction: column;
              justify-content: center;
            ">
              ${floatingModule(`
                ${vibrantBadge("Abstract")}
                <h1 style="
                  font-family: 'GT Walsheim Bold', sans-serif;
                  font-weight: 800;
                  font-size: 2.5rem;
                  color: ${palette.text};
                  line-height: 1.2;
                  margin-bottom: 0.5rem;
                  animation: fadeIn 1s ease-in-out;
                  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                ">
                  ${titleText.split(" ").map((word, idx) => `
                    <span style="display: inline-block; animation-delay: ${idx * 0.1}s">${word}&nbsp;</span>
                  `).join("")}
                </h1>
                <p style="
                  font-size: 0.95rem;
                  color: ${palette.textSecondary};
                  line-height: 1.7;
                  text-align: justify;
                ">${textContent[0] || ""}</p>
                <style>
                  @keyframes fadeIn {
                    0% { opacity: 0; transform: translateY(10px); }
                    100% { opacity: 1; transform: translateY(0); }
                  }
                  h1 span { animation: fadeIn 0.5s ease-in-out both; }
                </style>
              `)}
            </div>
            ${images.length > 0 ? `
              <div style="
                display: flex;
                justify-content: center;
                align-items: center;
                position: relative;
                z-index: 3;
              ">
                <div style="
                  width: 100%;
                  max-height: 300px;
                  border-radius: 8px;
                  overflow: hidden;
                  border: 1px solid ${palette.border};
                  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                  transition: transform 0.3s ease;
                ">
                  <img src="${images[0]}" style="
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                  "/>
                  <style>
                    div[style*="max-height: 300px"]:hover {
                      transform: scale(1.05);
                    }
                  </style>
                </div>
              </div>
            ` : ""}
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
          font-family: 'Public Sans', sans-serif;
          background: ${palette.neutral};
        ">
          ${abstractBackground(1)}
          <div style="
            display: flex;
            gap: 0.5rem;
            padding: 1rem;
            height: 100%;
            align-items: center;
            z-index: 2;
          ">
            <div style="flex: 1;">
              ${floatingModule(`
                ${vibrantBadge("Problem")}
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                  ${lineArtIcon("problem", 20)}
                  <h2 style="
                    font-family: 'GT Walsheim Bold', sans-serif;
                    font-weight: 800;
                    font-size: 1.75rem;
                    color: ${palette.textLight};
                    line-height: 1.3;
                  ">${titleText}</h2>
                </div>
                ${images.length > 0 ? `
                  <div style="
                    width: 100%;
                    max-height: 160px;
                    border-radius: 8px;
                    overflow: hidden;
                    margin-bottom: 0.5rem;
                    border: 1px solid ${palette.border};
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                    transition: transform 0.3s ease;
                  ">
                    <img src="${images[0]}" style="
                      width: 100%;
                      height: 100%;
                      object-fit: cover;
                    "/>
                    <style>
                      div[style*="max-height: 160px"]:hover {
                        transform: scale(1.05);
                      }
                    </style>
                  </div>
                ` : ""}
                <p style="
                  font-size: 0.9rem;
                  color: ${palette.textLight};
                  line-height: 1.6;
                  text-align: justify;
                ">${textContent[0] || ""}</p>
              `, "100%", `linear-gradient(90deg, ${palette.dark}80, ${palette.dark})`, palette.textLight)}
            </div>
            <div style="flex: 1; width: 20px ; height: 100%; display: flex; align-items: center; justify-content: center;">
              ${floatingModule(`
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
              `)}
            </div>
          </div>
        </div>`;
            break;

        case 2: // Methodology
            htmlTemplate = `
    <div style="
      position: relative;
      width: 100%;
      max-width: 1280px;
      height: 720px;
      margin: 0 auto;
      overflow: hidden;
      font-family: 'Public Sans', sans-serif;
      background: linear-gradient(135deg, ${palette.primary}15, ${palette.secondary}15, ${palette.neutral});
    ">
      ${abstractBackground(2)}
      <div style="
        padding: 2rem;
        max-width: 1000px;
        margin: 0 auto;
        z-index: 2;
      ">
        ${floatingModule(`
          ${vibrantBadge("Methodology")}
          <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem;">
            ${lineArtIcon("method", 24)}
            <h2 style="
              font-family: 'GT Walsheim Bold', sans-serif;
              font-weight: 800;
              font-size: 2.25rem;
              color: ${palette.text};
              line-height: 1.3;
            ">${titleText}</h2>
          </div>
          <p style="
            font-size: 1rem;
            color: ${palette.textSecondary};
            line-height: 1.7;
            text-align: justify;
            margin-bottom: 1rem;
          ">${textContent[0] || ""}</p>
          <div style="
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1.5rem;
          ">
            ${textContent.slice(1, 5).map((text, idx) => `
              ${floatingModule(`
                <div style="
                  width: 36px;
                  height: 36px;
                  background: linear-gradient(135deg, ${palette.primary}, ${palette.secondary});
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  margin: 0 auto 0.75rem;
                  color: ${palette.textLight};
                  font-family: 'Space Grotesk', sans-serif;
                  font-size: 0.9rem;
                  font-weight: 700;
                  box-shadow: 0 3px 10px rgba(0,0,0,0.2);
                ">${idx + 1}</div>
                <p style="
                  font-size: 0.9rem;
                  color: ${palette.textSecondary};
                  line-height: 1.6;
                  text-align: center;
                ">${text}</p>
              `, "100%", idx % 2 === 0 ? palette.neutral : `${palette.neutral}dd`)}
            `).join("")}
          </div>
        `)}
        ${images.length > 0 ? `
          <div style="
            width: 140px;
            max-height: 160px;
            border-radius: 12px;
            overflow: hidden;
            margin: 1rem auto 0;
            border: 1px solid ${palette.border};
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            transition: transform 0.3s ease;
          ">
            <img src="${images[0]}" style="
              width: 100%;
              height: 100%;
              object-fit: cover;
            "/>
            <style>
              div[style*="max-height: 160px"]:hover {
                transform: scale(1.08);
              }
            </style>
          </div>
        ` : ""}
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
          font-family: 'Public Sans', sans-serif;
          background: ${palette.neutral};
        ">
          ${abstractBackground(3)}
          <div style="
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
            padding: 1rem;
            height: 100%;
            align-items: center;
            z-index: 2;
          ">
            <div>
              ${floatingModule(`
                ${vibrantBadge("Findings")}
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                  ${lineArtIcon("finding", 20)}
                  <h2 style="
                    font-family: 'GT Walsheim Bold', sans-serif;
                    font-weight: 800;
                    font-size: 1.75rem;
                    color: ${palette.textLight};
                    line-height: 1.3;
                  ">${titleText}</h2>
                </div>
                ${textContent.slice(0, 3).map((t, idx) => `
                  <div style="
                    display: flex;
                    align-items: flex-start;
                    gap: 0.5rem;
                    margin-bottom: 0.5rem;
                  ">
                    ${lineArtIcon("finding", 16)}
                    <p style="
                      font-size: 0.8rem;
                      color: ${palette.textLight};
                      line-height: 1.5;
                    ">${t}</p>
                  </div>
                `).join("")}
              `, "100%", `linear-gradient(90deg, ${palette.dark}80, ${palette.dark})`, palette.textLight)}
            </div>
            <div>
              ${floatingModule(`
                ${images.length > 0 ? `
                  <div style="
                    width: 100%;
                    max-height: 300px;
                    border-radius: 8px;
                    overflow: hidden;
                    margin-bottom: 0.5rem;
                    border: 1px solid ${palette.border};
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                    transition: transform 0.3s ease;
                  ">
                    <img src="${images[0]}" style="
                      width: 100%;
                      height: 100%;
                      object-fit: cover;
                    "/>
                    <style>
                      div[style*="max-height: 300px"]:hover {
                        transform: scale(1.05);
                      }
                    </style>
                  </div>
                ` : ""}
                <p style="
                  font-size: 0.9rem;
                  color: ${palette.textSecondary};
                  line-height: 1.6;
                  text-align: justify;
                ">${textContent[3] || ""}</p>
              `)}
            </div>
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
          font-family: 'Public Sans', sans-serif;
          background: ${palette.neutral};
        ">
          ${abstractBackground(4)}
          <div style="
            max-width: 800px;
            margin: 0 auto;
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
            ${floatingModule(`
              ${vibrantBadge("Conclusion")}
              <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                ${lineArtIcon("conclusion", 20)}
                <h2 style="
                  font-family: 'GT Walsheim Bold', sans-serif;
                  font-weight: 800;
                  font-size: 1.75rem;
                  color: ${palette.text};
                  line-height: 1.3;
                ">${titleText}</h2>
              </div>
              <p style="
                font-size: 0.9rem;
                color: ${palette.textSecondary};
                line-height: 1.6;
                text-align: justify;
                margin-bottom: 0.5rem;
              ">${textContent[0] || ""}</p>
              <div style="
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 1rem;
                margin-bottom: 0.5rem;
              ">
                ${images.length > 0 ? `
                  <div style="
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    position: relative;
                    z-index: 3;
                  ">
                    <div style="
                      width: 100%;
                      max-height: 150px;
                      border-radius: 8px;
                      overflow: hidden;
                      border: 2px solid ${palette.secondary};
                      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                      transition: transform 0.3s ease;
                    ">
                      <img src="${images[0]}" style="
                        width: 100%;
                        height: 300px;
                        object-fit: cover;
                      "/>
                      <style>
                        div[style*="max-height: 180px"]:hover {
                          transform: scale(1.05);
                        }
                      </style>
                    </div>
                  </div>
                ` : `<div></div>`}
                ${images.length > 1 ? `
                  <div style="
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    position: relative;
                    z-index: 3;
                  ">
                    <div style="
                      width: 100%;
                      max-height: 150px;
                      border-radius: 8px;
                      overflow: hidden;
                      border: 1px solid ${palette.border};
                      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                      transition: transform 0.3s ease;
                    ">
                      <img src="${images[1]}" style="
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                      "/>
                      <style>
                        div[style*="max-height: 180px"]:hover {
                          transform: scale(1.05);
                        }
                      </style>
                    </div>
                  </div>
                ` : `
                  <div style="
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    position: relative;
                    z-index: 3;
                  ">
                    <div style="
                      width: 48px;
                      height: 48px;
                    ">
                      ${lineArtIcon("conclusion", 48)}
                    </div>
                  </div>
                `}
              </div>
              <div style="
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 1rem;
              ">
                ${floatingModule(`
                  <div style="
                    width: 24px;
                    height: 24px;
                    background: ${palette.primary};
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 0.5rem;
                    color: ${palette.textLight};
                    font-family: 'Space Grotesk', sans-serif;
                    font-size: 0.8rem;
                    font-weight: 600;
                  ">1</div>
                  <h3 style="
                    font-family: 'GT Walsheim Bold', sans-serif;
                    font-weight: 800;
                    font-size: 0.8rem;
                    color: ${palette.textLight};
                    margin-bottom: 0.5rem;
                    text-align: center;
                  ">Implications</h3>
                  <ul style="
                    font-size: 0.7rem;
                    color: ${palette.textLight};
                    line-height: 1.5;
                    padding-left: 1rem;
                    max-height: 100px;
                    overflow: hidden;
                  ">
                    ${textContent.slice(1, 3).map((t) => `<li style="margin-bottom: 0.5rem;">${t}</li>`).join("")}
                  </ul>
                `, "100%", `linear-gradient(90deg, ${palette.dark}80, ${palette.dark})`, palette.textLight)}
                ${floatingModule(`
                  <div style="
                    width: 24px;
                    height: 24px;
                    background: ${palette.secondary};
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 0.5rem;
                    color: ${palette.textLight};
                    font-family: 'Space Grotesk', sans-serif;
                    font-size: 0.8rem;
                    font-weight: 600;
                  ">2</div>
                  <h3 style="
                    font-family: 'GT Walsheim Bold', sans-serif;
                    font-weight: 800;
                    font-size: 0.85rem;
                    color: ${palette.textLight};
                    margin-bottom: 0.5rem;
                    text-align: center;
                  ">Next Steps</h3>
                  <ul style="
                    font-size: 0.8rem;
                    color: ${palette.textLight};
                    line-height: 1.5;
                    padding-left: 1rem;
                    max-height: 100px;
                    overflow: hidden;
                  ">
                    ${textContent.slice(3, 5).map((t) => `<li style="margin-bottom: 0.5rem;">${t}</li>`).join("")}
                  </ul>
                `, "100%", `linear-gradient(90deg, ${palette.dark}80, ${palette.dark})`, palette.textLight)}
              </div>
            `)}
          </div>
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
        id: `fluxera-html-template-${slide_id || slideIndex}`,
    });

    return {
        slide_id: slide_id || `fluxera-slide-${slideIndex}`,
        title: titleText,
        image_url: images[0],
        elements,
        htmlTemplate,
    };
};
