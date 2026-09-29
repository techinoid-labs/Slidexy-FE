import type { Slide, BackendSlide } from "../types/presentation";

/*
 * Sunrise — warm, optimistic gradient slides with soft coral/peach tones.
 * Friendly, modern, well-suited for consumer-facing decks.
 */

const palette = {
  bg:       "#FFFDF9",
  coral:    "#FF6B6B",
  peach:    "#FF8E72",
  amber:    "#FFC947",
  teal:     "#4ECDC4",
  dark:     "#2D1B00",
  text:     "#2D1B00",
  textMid:  "#6B4226",
  textMute: "#9E7B5A",
  surface:  "#FFF5EE",
  white:    "#FFFFFF",
  gradA:    "#FF6B6B",
  gradB:    "#FF8E72",
  gradC:    "#FFC947",
};

const getTextContent = (block: BackendSlide["textBlock"]): string[] => {
  if (!block?.elements) return [];
  return block.elements.map((el) => el.text || "").filter(Boolean);
};

const getImages = (slide: BackendSlide): string[] => {
  const imgs: string[] = [];
  if (slide.image_url) imgs.push(slide.image_url);
  slide.imageBlock?.elements?.forEach((el) => {
    if (el.properties?.imageSrc) imgs.push(el.properties.imageSrc);
  });
  return imgs;
};

const wave = (color: string, opacity = 0.08) =>
  `<div style="position:absolute;bottom:0;left:0;right:0;height:200px;
    background:${color};opacity:${opacity};
    clip-path:ellipse(120% 100% at 50% 100%);pointer-events:none;"></div>`;

export const createSunriseTemplate = (backendSlide: BackendSlide, slideIndex: number): Slide => {
  const { slide_id, slide_title, textBlock, titleBlock } = backendSlide;
  const textContent = getTextContent(textBlock);
  const titleText = titleBlock?.elements?.[0]?.text || slide_title?.text || `Slide ${slideIndex + 1}`;
  const images = getImages(backendSlide);
  const layout = slideIndex % 4;

  let htmlTemplate = "";

  switch (layout) {
    case 0: /* ── Hero: warm gradient left, image right ── */
      htmlTemplate = `
        <div style="width:100%;height:100%;display:flex;overflow:hidden;
          font-family:'Inter',system-ui,sans-serif;">
          <!-- Gradient left -->
          <div style="width:55%;height:100%;position:relative;overflow:hidden;
            background:linear-gradient(140deg,${palette.gradA} 0%,${palette.gradB} 55%,${palette.gradC} 100%);
            padding:3.5rem;box-sizing:border-box;display:flex;flex-direction:column;justify-content:center;gap:1.25rem;">
            <!-- Decorative circles -->
            <div style="position:absolute;top:-60px;right:-60px;width:240px;height:240px;
              border-radius:50%;background:rgba(255,255,255,0.1);pointer-events:none;"></div>
            <div style="position:absolute;bottom:-40px;left:-40px;width:160px;height:160px;
              border-radius:50%;background:rgba(255,255,255,0.08);pointer-events:none;"></div>
            <!-- Slide number pill -->
            <div style="display:inline-flex;align-items:center;gap:6px;
              background:rgba(255,255,255,0.2);padding:4px 12px;border-radius:20px;
              width:fit-content;">
              <span style="font-size:0.7rem;font-weight:700;letter-spacing:0.1em;
                text-transform:uppercase;color:${palette.white};opacity:0.9;">
                ${String(slideIndex + 1).padStart(2, "0")}
              </span>
            </div>
            <h2 style="font-size:2.5rem;font-weight:900;color:${palette.white};
              margin:0;line-height:1.1;letter-spacing:-0.02em;">
              ${titleText}
            </h2>
            ${textContent[0] ? `
            <p style="color:rgba(255,255,255,0.88);font-size:0.95rem;line-height:1.7;margin:0;
              font-weight:400;">
              ${textContent[0]}
            </p>` : ""}
            ${textContent[1] ? `
            <div style="display:flex;align-items:center;gap:8px;">
              <div style="width:20px;height:2px;background:rgba(255,255,255,0.6);border-radius:2px;"></div>
              <p style="color:rgba(255,255,255,0.75);font-size:0.85rem;margin:0;">${textContent[1]}</p>
            </div>` : ""}
          </div>
          <!-- Right image -->
          <div style="flex:1;position:relative;background:${palette.surface};">
            ${images[0]
              ? `<img src="${images[0]}" style="width:100%;height:100%;object-fit:cover;" />`
              : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;">
                   <div style="width:150px;height:150px;border-radius:30px;
                     background:linear-gradient(140deg,${palette.gradA}30,${palette.gradC}30);
                     display:flex;align-items:center;justify-content:center;">
                     <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                       <circle cx="32" cy="22" r="12" stroke="${palette.coral}" stroke-width="2"/>
                       <path d="M16 56c0-8.837 7.163-16 16-16s16 7.163 16 16" stroke="${palette.coral}" stroke-width="2"/>
                     </svg>
                   </div>
                 </div>`}
          </div>
        </div>`;
      break;

    case 1: /* ── Cards with soft shadows ── */
      htmlTemplate = `
        <div style="width:100%;height:100%;background:${palette.bg};
          font-family:'Inter',system-ui,sans-serif;padding:2.75rem;box-sizing:border-box;
          display:flex;flex-direction:column;gap:1.5rem;position:relative;">
          ${wave(palette.coral)}
          <!-- Header -->
          <div style="display:flex;align-items:center;gap:1rem;position:relative;z-index:2;">
            <div style="width:8px;height:8px;border-radius:50%;background:${palette.coral};flex-shrink:0;"></div>
            <h2 style="font-size:2rem;font-weight:800;color:${palette.text};margin:0;letter-spacing:-0.02em;">
              ${titleText}
            </h2>
          </div>
          <!-- Cards grid -->
          <div style="display:grid;grid-template-columns:repeat(${Math.min(textContent.length || 1, 3)},1fr);
            gap:1rem;flex:1;position:relative;z-index:2;">
            ${textContent.slice(0, 3).map((t, i) => {
              const gradients = [
                `linear-gradient(135deg,${palette.coral}18,${palette.peach}10)`,
                `linear-gradient(135deg,${palette.amber}18,${palette.coral}10)`,
                `linear-gradient(135deg,${palette.teal}18,${palette.amber}10)`,
              ];
              const accents = [palette.coral, palette.amber, palette.teal];
              return `
                <div style="padding:1.5rem;border-radius:14px;background:${palette.white};
                  box-shadow:0 4px 24px rgba(255,107,107,0.08),0 1px 4px rgba(0,0,0,0.04);
                  border:1px solid rgba(255,107,107,0.08);position:relative;overflow:hidden;">
                  <div style="position:absolute;top:0;left:0;right:0;bottom:0;
                    background:${gradients[i % 3]};z-index:0;"></div>
                  <div style="position:relative;z-index:1;">
                    <div style="width:36px;height:36px;border-radius:10px;
                      background:${accents[i % 3]}20;
                      display:flex;align-items:center;justify-content:center;margin-bottom:0.875rem;">
                      <span style="font-size:1rem;font-weight:800;color:${accents[i % 3]};">${i + 1}</span>
                    </div>
                    <p style="font-size:0.85rem;line-height:1.68;color:${palette.textMute};margin:0;">
                      ${t}
                    </p>
                  </div>
                </div>`;
            }).join("")}
          </div>
        </div>`;
      break;

    case 2: /* ── Full-bleed image with caption overlay ── */
      htmlTemplate = `
        <div style="width:100%;height:100%;position:relative;overflow:hidden;
          font-family:'Inter',system-ui,sans-serif;">
          ${images[0]
            ? `<img src="${images[0]}" style="width:100%;height:100%;object-fit:cover;position:absolute;inset:0;" />`
            : `<div style="position:absolute;inset:0;background:linear-gradient(140deg,${palette.gradA},${palette.gradB},${palette.gradC});"></div>`}
          <!-- Gradient overlay -->
          <div style="position:absolute;inset:0;background:linear-gradient(to top,
            rgba(45,27,0,0.85) 0%,rgba(45,27,0,0.3) 50%,transparent 100%);"></div>
          <!-- Content at bottom -->
          <div style="position:absolute;bottom:0;left:0;right:0;padding:3rem;box-sizing:border-box;">
            <div style="display:flex;gap:6px;align-items:center;margin-bottom:0.75rem;">
              ${[palette.coral, palette.amber, palette.teal].map(c =>
                `<div style="width:6px;height:6px;border-radius:50%;background:${c};opacity:0.9;"></div>`
              ).join("")}
            </div>
            <h2 style="font-size:2.6rem;font-weight:900;color:${palette.white};
              margin:0 0 1rem;line-height:1.1;max-width:70%;">
              ${titleText}
            </h2>
            ${textContent[0] ? `
            <p style="color:rgba(255,255,255,0.8);font-size:0.95rem;line-height:1.65;
              margin:0;max-width:65%;">
              ${textContent[0]}
            </p>` : ""}
          </div>
        </div>`;
      break;

    case 3: /* ── Timeline / steps ── */
      htmlTemplate = `
        <div style="width:100%;height:100%;background:${palette.bg};
          font-family:'Inter',system-ui,sans-serif;padding:3rem;box-sizing:border-box;
          display:flex;flex-direction:column;gap:1.75rem;">
          <!-- Header -->
          <div>
            <div style="display:inline-flex;align-items:center;gap:6px;
              padding:3px 12px;border-radius:20px;
              background:linear-gradient(90deg,${palette.coral}20,${palette.amber}10);
              border:1px solid ${palette.coral}20;margin-bottom:0.75rem;">
              <span style="font-size:0.65rem;font-weight:700;letter-spacing:0.12em;
                text-transform:uppercase;color:${palette.coral};">Steps</span>
            </div>
            <h2 style="font-size:2rem;font-weight:800;color:${palette.text};margin:0;
              letter-spacing:-0.02em;">${titleText}</h2>
          </div>
          <!-- Timeline steps -->
          <div style="display:flex;flex-direction:column;gap:0;flex:1;">
            ${textContent.slice(0, 4).map((t, i) => {
              const colors = [palette.coral, palette.peach, palette.amber, palette.teal];
              const c = colors[i % 4];
              const isLast = i === Math.min(textContent.length, 4) - 1;
              return `
                <div style="display:flex;gap:1.25rem;align-items:flex-start;
                  padding-bottom:${isLast ? "0" : "1.25rem"};
                  ${isLast ? "" : `border-left:none;`}
                  position:relative;">
                  <!-- Step marker + connector line -->
                  <div style="display:flex;flex-direction:column;align-items:center;flex-shrink:0;width:28px;">
                    <div style="width:28px;height:28px;border-radius:50%;
                      background:linear-gradient(135deg,${c},${c}AA);
                      display:flex;align-items:center;justify-content:center;
                      box-shadow:0 4px 12px ${c}33;flex-shrink:0;">
                      <span style="font-size:0.75rem;font-weight:800;color:${palette.white};">${i + 1}</span>
                    </div>
                    ${!isLast ? `<div style="width:2px;flex:1;min-height:16px;
                      background:linear-gradient(to bottom,${c}40,${colors[(i+1)%4]}40);
                      margin-top:4px;border-radius:2px;"></div>` : ""}
                  </div>
                  <!-- Text -->
                  <div style="flex:1;padding-top:4px;">
                    <p style="font-size:0.88rem;line-height:1.65;color:${palette.textMute};margin:0;">
                      ${t}
                    </p>
                  </div>
                </div>`;
            }).join("")}
          </div>
        </div>`;
      break;
  }

  return {
    slide_id: slide_id || `slide-${slideIndex}`,
    slide_title: slide_title || { text: titleText },
    layout_type: "cover-hero",
    elements: [],
    htmlTemplate,
  } as unknown as Slide;
};
