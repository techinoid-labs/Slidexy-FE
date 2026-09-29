import type { Slide, BackendSlide } from "../types/presentation";

/*
 * Elevate — premium luxury aesthetic with gold/cream palette.
 * Clean white space, refined serif-like typography, gold accents.
 */

const palette = {
  bg:        "#FAFAF8",
  cream:     "#F5F0E8",
  gold:      "#B8972A",
  gold2:     "#D4AF37",
  goldLight: "#F0D060",
  dark:      "#1C1917",
  charcoal:  "#292524",
  text:      "#1C1917",
  textMuted: "#78716C",
  border:    "rgba(184,151,42,0.2)",
  surface:   "#FFFFFF",
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

export const createElevateTemplate = (backendSlide: BackendSlide, slideIndex: number): Slide => {
  const { slide_id, slide_title, textBlock, titleBlock } = backendSlide;
  const textContent = getTextContent(textBlock);
  const titleText = titleBlock?.elements?.[0]?.text || slide_title?.text || `Slide ${slideIndex + 1}`;
  const images = getImages(backendSlide);
  const layout = slideIndex % 4;

  let htmlTemplate = "";

  switch (layout) {
    case 0: /* ── Hero: luxury split with gold accent ── */
      htmlTemplate = `
        <div style="width:100%;height:100%;display:flex;overflow:hidden;
          font-family:'Georgia',serif;background:${palette.bg};">
          <!-- Left dark panel with gold bar -->
          <div style="width:48%;height:100%;background:${palette.charcoal};position:relative;
            display:flex;flex-direction:column;justify-content:center;padding:3.5rem;box-sizing:border-box;">
            <!-- Gold vertical accent -->
            <div style="position:absolute;top:0;left:0;width:4px;height:100%;
              background:linear-gradient(to bottom,${palette.gold2},${palette.goldLight},${palette.gold2});"></div>
            <!-- Subtle corner ornament -->
            <div style="position:absolute;bottom:2.5rem;right:2.5rem;opacity:0.12;">
              <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                <rect x="2" y="2" width="56" height="56" rx="2" stroke="${palette.gold2}" stroke-width="0.75" stroke-dasharray="4 3"/>
                <rect x="10" y="10" width="40" height="40" rx="1" stroke="${palette.gold2}" stroke-width="0.5"/>
              </svg>
            </div>
            <div style="font-size:0.65rem;font-weight:400;letter-spacing:0.2em;text-transform:uppercase;
              color:${palette.gold};font-family:'Inter',sans-serif;margin-bottom:1.25rem;">
              ${String(slideIndex + 1).padStart(2, "0")} / PRESENTATION
            </div>
            <h2 style="font-size:2.5rem;font-weight:400;color:#FAFAF8;margin:0 0 1.5rem;
              line-height:1.15;letter-spacing:-0.01em;">
              ${titleText}
            </h2>
            <div style="height:1px;width:50px;background:${palette.gold};opacity:0.6;margin-bottom:1.25rem;"></div>
            ${textContent[0] ? `
            <p style="color:rgba(250,250,248,0.65);font-size:0.9rem;line-height:1.75;
              margin:0;font-family:'Inter',sans-serif;font-weight:300;">
              ${textContent[0]}
            </p>` : ""}
          </div>
          <!-- Right image/content panel -->
          <div style="flex:1;position:relative;background:${palette.cream};">
            ${images[0]
              ? `<img src="${images[0]}" style="width:100%;height:100%;object-fit:cover;opacity:0.9;" />`
              : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;">
                   <div style="text-align:center;opacity:0.25;">
                     <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                       <rect x="4" y="4" width="72" height="72" rx="4" stroke="${palette.gold2}" stroke-width="1"/>
                       <path d="M20 56L34 38L44 50L54 40L68 56" stroke="${palette.gold2}" stroke-width="1.5" stroke-linejoin="round"/>
                       <circle cx="28" cy="28" r="8" stroke="${palette.gold2}" stroke-width="1"/>
                     </svg>
                   </div>
                 </div>`}
          </div>
        </div>`;
      break;

    case 1: /* ── Elegant content grid ── */
      htmlTemplate = `
        <div style="width:100%;height:100%;background:${palette.bg};
          font-family:'Inter',sans-serif;padding:3rem;box-sizing:border-box;
          display:flex;flex-direction:column;gap:1.75rem;">
          <!-- Top: title section -->
          <div style="display:flex;align-items:flex-end;justify-content:space-between;">
            <div>
              <div style="font-size:0.65rem;letter-spacing:0.18em;text-transform:uppercase;
                color:${palette.gold};font-weight:600;margin-bottom:0.6rem;">
                ${String(slideIndex + 1).padStart(2, "0")} — Overview
              </div>
              <h2 style="font-size:2.1rem;font-weight:300;color:${palette.dark};margin:0;
                letter-spacing:-0.02em;font-family:'Georgia',serif;">${titleText}</h2>
            </div>
            <div style="height:1px;width:80px;background:linear-gradient(to right,${palette.gold},transparent);
              margin-bottom:0.5rem;"></div>
          </div>
          <!-- Card grid -->
          <div style="display:grid;grid-template-columns:repeat(${Math.min(textContent.length || 1, 3)},1fr);
            gap:1rem;flex:1;">
            ${textContent.slice(0, 3).map((t, i) => `
              <div style="padding:1.5rem;background:${palette.surface};
                border:1px solid rgba(184,151,42,0.12);border-radius:4px;
                position:relative;overflow:hidden;">
                <div style="position:absolute;top:0;left:0;right:0;height:2px;
                  background:linear-gradient(90deg,${palette.gold},transparent);"></div>
                <div style="font-size:1.75rem;font-weight:300;color:${palette.gold};
                  font-family:'Georgia',serif;margin-bottom:0.5rem;opacity:0.5;">
                  ${String(i + 1).padStart(2, "0")}
                </div>
                <p style="font-size:0.85rem;line-height:1.7;color:${palette.textMuted};margin:0;">
                  ${t}
                </p>
              </div>`).join("")}
          </div>
        </div>`;
      break;

    case 2: /* ── Centered quote / statement ── */
      htmlTemplate = `
        <div style="width:100%;height:100%;background:${palette.charcoal};
          font-family:'Georgia',serif;display:flex;align-items:center;justify-content:center;
          position:relative;overflow:hidden;">
          <!-- Gold corner ornaments -->
          <div style="position:absolute;top:2rem;left:2rem;opacity:0.15;">
            <svg width="50" height="50" viewBox="0 0 50 50"><path d="M2 2h16M2 2v16" stroke="${palette.gold2}" stroke-width="1.5" stroke-linecap="round"/></svg>
          </div>
          <div style="position:absolute;bottom:2rem;right:2rem;opacity:0.15;">
            <svg width="50" height="50" viewBox="0 0 50 50"><path d="M48 48h-16M48 48v-16" stroke="${palette.gold2}" stroke-width="1.5" stroke-linecap="round"/></svg>
          </div>
          <!-- Content -->
          <div style="max-width:72%;text-align:center;">
            <div style="width:40px;height:1px;background:${palette.gold};margin:0 auto 2rem;opacity:0.5;"></div>
            <h2 style="font-size:2.4rem;font-weight:400;color:#FAFAF8;margin:0 0 1.75rem;
              line-height:1.25;letter-spacing:-0.01em;">
              ${titleText}
            </h2>
            ${textContent[0] ? `
            <p style="color:rgba(250,250,248,0.55);font-size:0.95rem;line-height:1.8;
              font-family:'Inter',sans-serif;font-weight:300;margin:0 0 2rem;">
              ${textContent[0]}
            </p>` : ""}
            <div style="width:40px;height:1px;background:${palette.gold};margin:0 auto;opacity:0.5;"></div>
          </div>
        </div>`;
      break;

    case 3: /* ── Feature list with gold bullets ── */
      htmlTemplate = `
        <div style="width:100%;height:100%;background:${palette.bg};display:flex;overflow:hidden;
          font-family:'Inter',sans-serif;">
          <!-- Left: title bar -->
          <div style="width:38%;background:${palette.cream};padding:3rem 2.5rem;box-sizing:border-box;
            display:flex;flex-direction:column;justify-content:center;gap:1rem;
            border-right:1px solid ${palette.border};">
            <div style="font-size:0.65rem;letter-spacing:0.18em;text-transform:uppercase;
              color:${palette.gold};font-weight:600;">${String(slideIndex + 1).padStart(2, "0")}</div>
            <h2 style="font-size:1.85rem;font-weight:300;color:${palette.dark};margin:0;
              line-height:1.2;font-family:'Georgia',serif;">${titleText}</h2>
            <div style="height:1px;background:linear-gradient(to right,${palette.gold},transparent);opacity:0.5;"></div>
          </div>
          <!-- Right: bullet list -->
          <div style="flex:1;padding:3rem;box-sizing:border-box;display:flex;flex-direction:column;justify-content:center;gap:1rem;">
            ${textContent.slice(0, 5).map((t, i) => `
              <div style="display:flex;gap:1rem;align-items:flex-start;
                padding:0.875rem 0;border-bottom:1px solid rgba(184,151,42,0.08);">
                <div style="width:20px;height:20px;flex-shrink:0;border:1px solid ${palette.gold};
                  border-radius:50%;display:flex;align-items:center;justify-content:center;margin-top:2px;">
                  <div style="width:6px;height:6px;border-radius:50%;background:${palette.gold};"></div>
                </div>
                <p style="font-size:0.87rem;line-height:1.65;color:${palette.textMuted};margin:0;">
                  ${t}
                </p>
              </div>`).join("")}
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
