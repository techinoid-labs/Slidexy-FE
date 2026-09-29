import type { Slide, BackendSlide } from "../types/presentation";

/*
 * Dark Mode — premium dark-background slides with neon accents and glass cards.
 * Uses a deep navy/charcoal palette with electric blue/violet highlights.
 */

const palette = {
  bg:           "#0B0F1A",
  surface:      "#131929",
  card:         "#1A2235",
  border:       "rgba(99,179,237,0.15)",
  glow:         "rgba(99,179,237,0.06)",
  accent:       "#63B3ED",
  accent2:      "#9F7AEA",
  green:        "#68D391",
  text:         "#EDF2F7",
  textMuted:    "#A0AEC0",
  textDim:      "#718096",
  gradientA:    "#63B3ED",
  gradientB:    "#9F7AEA",
};

const glassBg = (opacity = 0.06) =>
  `rgba(99,179,237,${opacity})`;

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

export const createDarkTemplate = (backendSlide: BackendSlide, slideIndex: number): Slide => {
  const { slide_id, slide_title, textBlock, titleBlock } = backendSlide;
  const textContent = getTextContent(textBlock);
  const titleText = titleBlock?.elements?.[0]?.text || slide_title?.text || `Slide ${slideIndex + 1}`;
  const images = getImages(backendSlide);
  const layout = slideIndex % 4;

  let htmlTemplate = "";

  switch (layout) {
    case 0: /* ── Hero: big title + accent glow ── */
      htmlTemplate = `
        <div style="
          width:100%;height:100%;
          background:${palette.bg};
          display:flex;align-items:center;
          position:relative;overflow:hidden;
          font-family:'Inter',system-ui,sans-serif;
        ">
          <!-- Ambient glow blobs -->
          <div style="position:absolute;top:-80px;left:-80px;width:320px;height:320px;
            background:radial-gradient(circle,${palette.accent}22 0%,transparent 70%);
            border-radius:50%;pointer-events:none;"></div>
          <div style="position:absolute;bottom:-60px;right:80px;width:260px;height:260px;
            background:radial-gradient(circle,${palette.accent2}22 0%,transparent 70%);
            border-radius:50%;pointer-events:none;"></div>
          <!-- Content -->
          <div style="flex:1;padding:3rem;z-index:2;">
            <div style="display:inline-block;padding:4px 14px;border-radius:20px;
              background:${glassBg(0.1)};border:1px solid ${palette.border};
              color:${palette.accent};font-size:0.75rem;font-weight:600;
              letter-spacing:0.1em;text-transform:uppercase;margin-bottom:1.5rem;">
              Slide ${slideIndex + 1}
            </div>
            <h2 style="font-size:2.8rem;font-weight:800;color:${palette.text};
              margin:0 0 1.25rem;line-height:1.1;">
              ${titleText}
            </h2>
            ${textContent.slice(0, 2).map((t) => `
              <p style="color:${palette.textMuted};font-size:1rem;line-height:1.65;margin:0 0 0.75rem;">
                ${t}
              </p>`).join("")}
          </div>
          <!-- Image panel -->
          ${images[0] ? `
          <div style="width:44%;height:100%;position:relative;flex-shrink:0;">
            <img src="${images[0]}" style="width:100%;height:100%;object-fit:cover;opacity:0.75;" />
            <div style="position:absolute;inset:0;background:linear-gradient(to right,${palette.bg},transparent);"></div>
          </div>` : `
          <div style="width:44%;height:100%;flex-shrink:0;
            background:linear-gradient(135deg,${palette.accent}18,${palette.accent2}18);
            border-left:1px solid ${palette.border};display:flex;align-items:center;justify-content:center;">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
              <rect x="8" y="8" width="64" height="64" rx="12" stroke="${palette.accent}" stroke-width="1.5" stroke-dasharray="6 4"/>
              <path d="M40 25v30M25 40h30" stroke="${palette.accent2}" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>`}
        </div>`;
      break;

    case 1: /* ── Features grid ── */
      htmlTemplate = `
        <div style="
          width:100%;height:100%;padding:2.5rem;box-sizing:border-box;
          background:${palette.bg};position:relative;overflow:hidden;
          font-family:'Inter',system-ui,sans-serif;
          display:flex;flex-direction:column;gap:1.5rem;
        ">
          <div style="position:absolute;top:0;right:0;width:300px;height:300px;
            background:radial-gradient(circle,${palette.accent2}15 0%,transparent 70%);
            pointer-events:none;"></div>
          <!-- Top accent line -->
          <div style="height:3px;width:60px;border-radius:2px;
            background:linear-gradient(90deg,${palette.gradientA},${palette.gradientB});"></div>
          <h2 style="font-size:2rem;font-weight:700;color:${palette.text};margin:0;line-height:1.2;">
            ${titleText}
          </h2>
          <!-- Feature cards -->
          <div style="display:grid;grid-template-columns:repeat(${Math.min(textContent.length,3)},1fr);gap:1rem;flex:1;">
            ${textContent.slice(0, 3).map((t, i) => `
              <div style="background:${palette.card};border:1px solid ${palette.border};
                border-radius:12px;padding:1.25rem;position:relative;overflow:hidden;">
                <div style="position:absolute;top:0;left:0;right:0;height:2px;
                  background:linear-gradient(90deg,${[palette.accent,palette.accent2,palette.green][i % 3]},transparent);"></div>
                <div style="width:28px;height:28px;border-radius:8px;margin-bottom:0.75rem;
                  background:${glassBg(0.12)};border:1px solid ${palette.border};
                  display:flex;align-items:center;justify-content:center;
                  color:${[palette.accent,palette.accent2,palette.green][i % 3]};font-weight:700;font-size:0.85rem;">
                  ${i + 1}
                </div>
                <p style="color:${palette.textMuted};font-size:0.85rem;line-height:1.6;margin:0;">${t}</p>
              </div>`).join("")}
          </div>
        </div>`;
      break;

    case 2: /* ── Quote / highlight ── */
      htmlTemplate = `
        <div style="
          width:100%;height:100%;
          background:${palette.bg};
          display:flex;align-items:center;justify-content:center;
          position:relative;overflow:hidden;
          font-family:'Inter',system-ui,sans-serif;
        ">
          <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
            width:600px;height:600px;
            background:radial-gradient(circle,${palette.accent}0d 0%,transparent 65%);
            pointer-events:none;"></div>
          <div style="max-width:700px;text-align:center;padding:3rem;z-index:2;">
            <div style="font-size:4rem;color:${palette.accent};line-height:1;margin-bottom:1rem;
              opacity:0.6;">"</div>
            <h2 style="font-size:2.2rem;font-weight:700;color:${palette.text};line-height:1.25;
              margin:0 0 1.5rem;">
              ${titleText}
            </h2>
            ${textContent[0] ? `
            <p style="color:${palette.textMuted};font-size:1rem;line-height:1.65;margin:0 0 1.5rem;">${textContent[0]}</p>` : ""}
            <div style="display:flex;gap:0.5rem;justify-content:center;">
              ${[0,1,2].map((i) => `
                <div style="width:${i===1?'28':'8'}px;height:8px;border-radius:4px;
                  background:${i===1?`linear-gradient(90deg,${palette.gradientA},${palette.gradientB})`:palette.card};"></div>`).join("")}
            </div>
          </div>
        </div>`;
      break;

    default: /* ── Data / stats layout ── */
      htmlTemplate = `
        <div style="
          width:100%;height:100%;padding:2.5rem;box-sizing:border-box;
          background:${palette.bg};
          display:grid;grid-template-columns:1fr 1fr;gap:2rem;
          font-family:'Inter',system-ui,sans-serif;
        ">
          <!-- Left: title + description -->
          <div style="display:flex;flex-direction:column;justify-content:center;gap:1rem;">
            <div style="height:3px;width:50px;border-radius:2px;
              background:linear-gradient(90deg,${palette.gradientA},${palette.gradientB});"></div>
            <h2 style="font-size:2rem;font-weight:700;color:${palette.text};margin:0;line-height:1.2;">
              ${titleText}
            </h2>
            ${textContent[0] ? `<p style="color:${palette.textMuted};font-size:0.95rem;line-height:1.65;margin:0;">${textContent[0]}</p>` : ""}
          </div>
          <!-- Right: stat cards -->
          <div style="display:flex;flex-direction:column;gap:0.85rem;justify-content:center;">
            ${textContent.slice(1, 4).map((t, i) => `
              <div style="background:${palette.card};border:1px solid ${palette.border};
                border-radius:10px;padding:1rem 1.25rem;
                display:flex;align-items:center;gap:0.75rem;">
                <div style="width:6px;height:6px;border-radius:50%;flex-shrink:0;
                  background:${[palette.accent,palette.accent2,palette.green][i % 3]};"></div>
                <p style="color:${palette.textMuted};font-size:0.85rem;line-height:1.5;margin:0;">${t}</p>
              </div>`).join("")}
          </div>
        </div>`;
  }

  return { slide_id, htmlTemplate };
};
