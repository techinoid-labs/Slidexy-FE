import type { Slide, BackendSlide } from "../types/presentation";

/*
 * Neon — cyberpunk-inspired dark slides with glowing neon accents.
 * Deep black bg, cyan/magenta/violet neon grid lines and glows.
 */

const palette = {
  bg:        "#050508",
  surface:   "#0D0D14",
  card:      "#12121C",
  cyan:      "#00F5FF",
  magenta:   "#FF00FF",
  violet:    "#9B59B6",
  green:     "#00FF88",
  yellow:    "#FFE600",
  text:      "#EEEEFF",
  textMuted: "#888AAA",
  border:    "rgba(0,245,255,0.18)",
  glow:      "rgba(0,245,255,0.12)",
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

const gridLines = `
  <div style="position:absolute;inset:0;
    background-image:linear-gradient(rgba(0,245,255,0.04) 1px,transparent 1px),
      linear-gradient(90deg,rgba(0,245,255,0.04) 1px,transparent 1px);
    background-size:40px 40px;pointer-events:none;z-index:0;"></div>
`;

const glowBlob = (top: string, left: string, color: string, size = "300px") =>
  `<div style="position:absolute;top:${top};left:${left};width:${size};height:${size};
    background:radial-gradient(circle,${color}30 0%,transparent 70%);
    border-radius:50%;pointer-events:none;z-index:0;transform:translate(-50%,-50%);"></div>`;

export const createNeonTemplate = (backendSlide: BackendSlide, slideIndex: number): Slide => {
  const { slide_id, slide_title, textBlock, titleBlock } = backendSlide;
  const textContent = getTextContent(textBlock);
  const titleText = titleBlock?.elements?.[0]?.text || slide_title?.text || `Slide ${slideIndex + 1}`;
  const images = getImages(backendSlide);
  const layout = slideIndex % 4;

  let htmlTemplate = "";

  switch (layout) {
    case 0: /* ── Hero: glowing title on dark ── */
      htmlTemplate = `
        <div style="width:100%;height:100%;background:${palette.bg};position:relative;overflow:hidden;
          font-family:'Inter',system-ui,sans-serif;display:flex;align-items:center;">
          ${gridLines}
          ${glowBlob("30%", "20%", palette.cyan)}
          ${glowBlob("70%", "80%", palette.magenta, "250px")}
          <!-- Content left -->
          <div style="width:55%;padding:3rem;position:relative;z-index:2;box-sizing:border-box;">
            <div style="display:inline-flex;align-items:center;gap:8px;margin-bottom:1.5rem;
              padding:4px 14px;border:1px solid ${palette.cyan}44;border-radius:20px;
              background:${palette.cyan}0D;">
              <div style="width:6px;height:6px;border-radius:50%;background:${palette.cyan};
                box-shadow:0 0 8px ${palette.cyan};"></div>
              <span style="font-size:0.7rem;font-weight:700;letter-spacing:0.12em;
                text-transform:uppercase;color:${palette.cyan};">SLIDE ${slideIndex + 1}</span>
            </div>
            <h2 style="font-size:2.6rem;font-weight:900;color:${palette.text};margin:0 0 1rem;
              line-height:1.05;letter-spacing:-0.02em;
              text-shadow:0 0 40px ${palette.cyan}44;">
              ${titleText}
            </h2>
            ${textContent.slice(0, 2).map(t => `
              <p style="color:${palette.textMuted};font-size:0.95rem;line-height:1.7;margin:0 0 0.6rem;">
                ${t}
              </p>`).join("")}
            <div style="margin-top:1.5rem;height:2px;width:80px;
              background:linear-gradient(90deg,${palette.cyan},${palette.magenta});
              box-shadow:0 0 10px ${palette.cyan}88;border-radius:2px;"></div>
          </div>
          <!-- Right visual panel -->
          <div style="width:45%;height:100%;position:relative;flex-shrink:0;z-index:2;">
            ${images[0]
              ? `<img src="${images[0]}" style="width:100%;height:100%;object-fit:cover;opacity:0.6;mix-blend-mode:lighten;" />
                 <div style="position:absolute;inset:0;background:linear-gradient(to right,${palette.bg},transparent 40%);"></div>`
              : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;">
                   <div style="width:180px;height:180px;border:1px solid ${palette.cyan}44;border-radius:50%;
                     display:flex;align-items:center;justify-content:center;position:relative;">
                     <div style="width:120px;height:120px;border:1px solid ${palette.magenta}44;border-radius:50%;
                       box-shadow:0 0 30px ${palette.cyan}22,inset 0 0 30px ${palette.magenta}22;"></div>
                     <div style="position:absolute;width:8px;height:8px;border-radius:50%;background:${palette.cyan};
                       box-shadow:0 0 16px ${palette.cyan},0 0 32px ${palette.cyan}88;"></div>
                   </div>
                 </div>`}
          </div>
        </div>`;
      break;

    case 1: /* ── Feature cards with neon borders ── */
      htmlTemplate = `
        <div style="width:100%;height:100%;background:${palette.bg};position:relative;overflow:hidden;
          font-family:'Inter',system-ui,sans-serif;padding:2.5rem;box-sizing:border-box;
          display:flex;flex-direction:column;gap:1.25rem;">
          ${gridLines}
          ${glowBlob("0%", "100%", palette.violet, "200px")}
          <div style="position:relative;z-index:2;">
            <div style="height:2px;width:50px;background:linear-gradient(90deg,${palette.cyan},transparent);
              margin-bottom:0.75rem;box-shadow:0 0 10px ${palette.cyan}88;border-radius:2px;"></div>
            <h2 style="font-size:1.8rem;font-weight:800;color:${palette.text};margin:0;
              letter-spacing:-0.02em;text-shadow:0 0 20px ${palette.cyan}33;">${titleText}</h2>
          </div>
          <div style="display:grid;grid-template-columns:repeat(${Math.min(textContent.length || 1, 3)},1fr);
            gap:0.875rem;flex:1;z-index:2;position:relative;">
            ${textContent.slice(0, 3).map((t, i) => {
              const colors = [palette.cyan, palette.magenta, palette.green];
              const c = colors[i % 3];
              return `
                <div style="padding:1.25rem;border-radius:10px;
                  background:${palette.card};
                  border:1px solid ${c}30;
                  position:relative;overflow:hidden;">
                  <div style="position:absolute;top:0;left:0;right:0;height:2px;
                    background:linear-gradient(90deg,${c},transparent);
                    box-shadow:0 0 8px ${c}88;"></div>
                  <div style="width:32px;height:32px;border-radius:8px;
                    background:${c}15;border:1px solid ${c}33;
                    display:flex;align-items:center;justify-content:center;
                    margin-bottom:0.75rem;">
                    <span style="font-size:0.85rem;font-weight:800;color:${c};">${i + 1}</span>
                  </div>
                  <p style="font-size:0.82rem;line-height:1.65;color:${palette.textMuted};margin:0;">
                    ${t}
                  </p>
                </div>`;
            }).join("")}
          </div>
        </div>`;
      break;

    case 2: /* ── Quote / highlight ── */
      htmlTemplate = `
        <div style="width:100%;height:100%;background:${palette.bg};position:relative;overflow:hidden;
          font-family:'Inter',system-ui,sans-serif;display:flex;align-items:center;justify-content:center;">
          ${gridLines}
          ${glowBlob("50%", "50%", palette.magenta, "400px")}
          <div style="max-width:75%;text-align:center;position:relative;z-index:2;">
            <div style="font-size:5rem;line-height:1;color:${palette.cyan};opacity:0.3;
              font-family:Georgia,serif;margin-bottom:-1rem;">"</div>
            <h2 style="font-size:2.2rem;font-weight:800;color:${palette.text};margin:0 0 1.5rem;
              line-height:1.2;text-shadow:0 0 30px ${palette.magenta}44;">
              ${titleText}
            </h2>
            ${textContent[0] ? `
            <p style="color:${palette.textMuted};font-size:1rem;line-height:1.7;margin:0 0 2rem;">
              ${textContent[0]}
            </p>` : ""}
            <div style="display:flex;align-items:center;justify-content:center;gap:8px;">
              <div style="height:1px;width:40px;background:linear-gradient(90deg,transparent,${palette.cyan});"></div>
              <div style="width:8px;height:8px;border-radius:50%;background:${palette.cyan};
                box-shadow:0 0 12px ${palette.cyan};"></div>
              <div style="height:1px;width:40px;background:linear-gradient(90deg,${palette.cyan},transparent);"></div>
            </div>
          </div>
        </div>`;
      break;

    case 3: /* ── Data / stats ── */
      htmlTemplate = `
        <div style="width:100%;height:100%;background:${palette.bg};position:relative;overflow:hidden;
          font-family:'Inter',system-ui,sans-serif;padding:2.5rem;box-sizing:border-box;
          display:flex;gap:2rem;align-items:stretch;">
          ${gridLines}
          ${glowBlob("100%", "0%", palette.cyan, "200px")}
          <!-- Left: title + bullets -->
          <div style="flex:1;display:flex;flex-direction:column;gap:1.25rem;z-index:2;position:relative;">
            <div>
              <div style="height:3px;width:40px;background:${palette.cyan};
                box-shadow:0 0 8px ${palette.cyan};border-radius:2px;margin-bottom:0.75rem;"></div>
              <h2 style="font-size:1.9rem;font-weight:800;color:${palette.text};margin:0;line-height:1.15;">${titleText}</h2>
            </div>
            ${textContent.slice(0, 4).map((t, i) => `
              <div style="display:flex;gap:10px;align-items:flex-start;">
                <div style="width:20px;height:20px;border-radius:50%;border:1.5px solid ${palette.cyan}55;
                  display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:2px;">
                  <div style="width:6px;height:6px;border-radius:50%;background:${palette.cyan};
                    box-shadow:0 0 6px ${palette.cyan};"></div>
                </div>
                <p style="font-size:0.87rem;line-height:1.6;color:${palette.textMuted};margin:0;">${t}</p>
              </div>`).join("")}
          </div>
          <!-- Right: image or stat cards -->
          <div style="width:40%;display:flex;flex-direction:column;gap:0.75rem;z-index:2;position:relative;">
            ${images[0]
              ? `<div style="flex:1;border-radius:12px;overflow:hidden;border:1px solid ${palette.border};">
                   <img src="${images[0]}" style="width:100%;height:100%;object-fit:cover;opacity:0.7;" />
                 </div>`
              : ["FAST", "SMART", "SECURE"].map((word, i) => {
                  const c = [palette.cyan, palette.magenta, palette.green][i];
                  return `<div style="flex:1;border-radius:10px;background:${palette.card};
                    border:1px solid ${c}25;padding:1rem;display:flex;align-items:center;gap:0.75rem;">
                    <div style="width:3px;height:100%;min-height:24px;border-radius:2px;background:${c};
                      box-shadow:0 0 6px ${c};"></div>
                    <span style="font-size:0.8rem;font-weight:700;color:${c};letter-spacing:0.06em;">${word}</span>
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
