import type { Slide, BackendSlide } from "../types/presentation";

/*
 * Vibrant — high-energy gradient slides with bold color-blocking.
 * Inspired by modern SaaS/startup pitch decks.
 */

const palette = {
  bg:        "#FFFBF7",
  surface:   "#FFF0E6",
  accent:    "#FF5733",
  accent2:   "#FF9F40",
  accent3:   "#FFC300",
  blue:      "#3B82F6",
  purple:    "#8B5CF6",
  dark:      "#1A0A00",
  text:      "#1A0A00",
  textLight: "#FFFFFF",
  muted:     "#78716C",
  gradA:     "#FF5733",
  gradB:     "#FF9F40",
  gradC:     "#FFC300",
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

export const createVibrantTemplate = (backendSlide: BackendSlide, slideIndex: number): Slide => {
  const { slide_id, slide_title, textBlock, titleBlock } = backendSlide;
  const textContent = getTextContent(textBlock);
  const titleText = titleBlock?.elements?.[0]?.text || slide_title?.text || `Slide ${slideIndex + 1}`;
  const images = getImages(backendSlide);
  const layout = slideIndex % 4;

  let htmlTemplate = "";

  switch (layout) {
    case 0: /* ── Hero: bold gradient left + image right ── */
      htmlTemplate = `
        <div style="
          width:100%;height:100%;display:flex;overflow:hidden;
          font-family:'Inter',system-ui,sans-serif;
        ">
          <!-- Gradient panel -->
          <div style="
            width:52%;height:100%;padding:3rem 2.5rem;box-sizing:border-box;
            background:linear-gradient(135deg,${palette.gradA} 0%,${palette.gradB} 60%,${palette.gradC} 100%);
            display:flex;flex-direction:column;justify-content:center;gap:1.25rem;
            position:relative;overflow:hidden;
          ">
            <div style="position:absolute;bottom:-40px;left:-40px;width:200px;height:200px;
              background:rgba(255,255,255,0.1);border-radius:50%;pointer-events:none;"></div>
            <div style="position:absolute;top:-30px;right:-30px;width:140px;height:140px;
              background:rgba(255,255,255,0.08);border-radius:50%;pointer-events:none;"></div>
            <span style="font-size:0.7rem;font-weight:700;letter-spacing:0.12em;
              text-transform:uppercase;color:rgba(255,255,255,0.75);">
              Slide ${slideIndex + 1}
            </span>
            <h2 style="font-size:2.4rem;font-weight:900;color:${palette.textLight};
              margin:0;line-height:1.1;letter-spacing:-0.02em;">
              ${titleText}
            </h2>
            ${textContent[0] ? `
            <p style="color:rgba(255,255,255,0.88);font-size:0.95rem;line-height:1.65;margin:0;">
              ${textContent[0]}
            </p>` : ""}
          </div>
          <!-- Image panel -->
          <div style="flex:1;position:relative;overflow:hidden;background:${palette.surface};">
            ${images[0]
              ? `<img src="${images[0]}" style="width:100%;height:100%;object-fit:cover;" />`
              : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:${palette.surface};">
                   <div style="width:120px;height:120px;border-radius:60px;background:linear-gradient(135deg,${palette.gradA},${palette.gradC});opacity:0.3;"></div>
                 </div>`}
          </div>
        </div>`;
      break;

    case 1: /* ── Cards grid with colorful badges ── */
      htmlTemplate = `
        <div style="
          width:100%;height:100%;padding:2.5rem;box-sizing:border-box;
          background:${palette.bg};
          font-family:'Inter',system-ui,sans-serif;
          display:flex;flex-direction:column;gap:1.5rem;
        ">
          <div style="display:flex;align-items:center;gap:1rem;">
            <div style="height:4px;width:44px;border-radius:2px;
              background:linear-gradient(90deg,${palette.gradA},${palette.gradB});"></div>
            <h2 style="font-size:2rem;font-weight:800;color:${palette.text};margin:0;">
              ${titleText}
            </h2>
          </div>
          <div style="display:grid;grid-template-columns:repeat(${Math.min(textContent.length,3)},1fr);gap:1rem;flex:1;">
            ${textContent.slice(0, 3).map((t, i) => {
              const colors = [[palette.gradA,"#fff"],[palette.blue,"#fff"],[palette.purple,"#fff"]];
              const [bg, fg] = colors[i % 3];
              return `
              <div style="background:${palette.bg};border:2px solid ${bg}22;border-radius:16px;padding:1.5rem;
                display:flex;flex-direction:column;gap:0.75rem;position:relative;overflow:hidden;">
                <div style="position:absolute;top:0;left:0;right:0;height:4px;
                  background:linear-gradient(90deg,${bg},transparent);"></div>
                <div style="display:inline-flex;align-items:center;justify-content:center;
                  width:36px;height:36px;border-radius:10px;background:${bg};color:${fg};
                  font-weight:800;font-size:1rem;">
                  ${i + 1}
                </div>
                <p style="color:${palette.muted};font-size:0.875rem;line-height:1.6;margin:0;">${t}</p>
              </div>`;
            }).join("")}
          </div>
        </div>`;
      break;

    case 2: /* ── Full-bleed image + bold bottom caption ── */
      htmlTemplate = `
        <div style="
          width:100%;height:100%;position:relative;overflow:hidden;
          font-family:'Inter',system-ui,sans-serif;
        ">
          ${images[0]
            ? `<img src="${images[0]}" style="width:100%;height:100%;object-fit:cover;" />`
            : `<div style="width:100%;height:100%;background:linear-gradient(135deg,${palette.gradA},${palette.gradB},${palette.gradC});"></div>`}
          <!-- Bottom gradient overlay -->
          <div style="position:absolute;inset:0;
            background:linear-gradient(to top,rgba(26,10,0,0.92) 0%,rgba(26,10,0,0) 55%);"></div>
          <!-- Caption -->
          <div style="position:absolute;bottom:0;left:0;right:0;padding:2.5rem;">
            <h2 style="font-size:2.4rem;font-weight:900;color:${palette.textLight};
              margin:0 0 0.75rem;line-height:1.1;">
              ${titleText}
            </h2>
            ${textContent[0] ? `<p style="color:rgba(255,255,255,0.8);font-size:0.95rem;margin:0;">${textContent[0]}</p>` : ""}
            <!-- Tag chips -->
            <div style="display:flex;gap:0.5rem;margin-top:1rem;flex-wrap:wrap;">
              ${textContent.slice(1, 4).map((t) => `
                <span style="background:rgba(255,255,255,0.12);color:rgba(255,255,255,0.9);
                  font-size:0.72rem;font-weight:600;padding:4px 12px;border-radius:20px;
                  border:1px solid rgba(255,255,255,0.2);">
                  ${t.slice(0, 28)}${t.length > 28 ? "…" : ""}
                </span>`).join("")}
            </div>
          </div>
        </div>`;
      break;

    default: /* ── Timeline / steps ── */
      htmlTemplate = `
        <div style="
          width:100%;height:100%;padding:2.5rem;box-sizing:border-box;
          background:${palette.bg};
          font-family:'Inter',system-ui,sans-serif;
          display:grid;grid-template-columns:2fr 3fr;gap:2.5rem;
        ">
          <!-- Left column: title -->
          <div style="display:flex;flex-direction:column;justify-content:center;gap:1rem;">
            <div style="height:4px;width:44px;border-radius:2px;
              background:linear-gradient(90deg,${palette.gradA},${palette.gradC});"></div>
            <h2 style="font-size:2rem;font-weight:800;color:${palette.text};margin:0;line-height:1.15;">
              ${titleText}
            </h2>
          </div>
          <!-- Right column: numbered steps -->
          <div style="display:flex;flex-direction:column;gap:0.85rem;justify-content:center;">
            ${textContent.slice(0, 4).map((t, i) => `
              <div style="display:flex;align-items:flex-start;gap:1rem;padding:0.75rem 1rem;
                background:${i % 2 === 0 ? `${palette.gradA}0a` : "transparent"};
                border-radius:10px;border-left:3px solid ${[palette.gradA,palette.accent2,palette.gradC,palette.blue][i % 4]};">
                <span style="color:${[palette.gradA,palette.accent2,palette.gradC,palette.blue][i % 4]};
                  font-weight:900;font-size:1.1rem;min-width:24px;line-height:1.4;">
                  ${String(i + 1).padStart(2,"0")}
                </span>
                <p style="color:${palette.muted};font-size:0.875rem;line-height:1.55;margin:0;">${t}</p>
              </div>`).join("")}
          </div>
        </div>`;
  }

  return { slide_id, htmlTemplate };
};
