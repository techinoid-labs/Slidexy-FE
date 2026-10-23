import PptxGenJS from "pptxgenjs";
import { OffscreenSlideStage } from "./offscreenSlideStage";

/**
 * Native PowerPoint export.
 *
 * The old exporter screenshotted each slide and placed one full-bleed JPEG,
 * which produced a .pptx nobody could edit. This builds real PowerPoint
 * objects instead: text boxes you can retype, tables you can add rows to,
 * charts bound to their own data sheet, and shapes you can recolour.
 *
 * It works by measuring the slide the editor actually renders rather than
 * reimplementing the layout engine. Every position, colour and font size is
 * read off the live DOM, so the deck in PowerPoint matches what the user saw
 * without a second source of truth that can drift.
 *
 * Anything with no faithful PowerPoint equivalent -- a Venn diagram, nested
 * circles, a device mockup -- is rasterised as a single picture confined to
 * its own block, so one exotic visual costs that visual's editability rather
 * than the whole slide's.
 */

const STAGE_W = 960;
const STAGE_H = 540;

/** The stage is authored at 96 DPI, so 960px is exactly 10 inches. */
const PX_PER_IN = 96;
/** CSS pixels to PowerPoint points. */
const PX_TO_PT = 0.75;

const SLIDE_W_IN = STAGE_W / PX_PER_IN; // 10
const SLIDE_H_IN = STAGE_H / PX_PER_IN; // 5.625

/** Block types with no honest PowerPoint equivalent: rasterise just these. */
const RASTERISE = new Set([
  "venn",
  "nestedCircles",
  "deviceMockup",
  "scatterQuadrant",
  "logoWall",
]);

/** Block type -> pptxgenjs chart type. */
const CHART_KIND: Record<string, string> = {
  barChart: "bar",
  lineChart: "line",
  comboChart: "bar",
  donutChart: "doughnut",
};

const px = (v: number) => v / PX_PER_IN;

function toHex(colour: string | null | undefined): string | null {
  if (!colour) return null;
  const m = colour.match(/rgba?\(([^)]+)\)/);
  if (!m) {
    if (/^#[0-9a-f]{6}$/i.test(colour)) return colour.slice(1).toUpperCase();
    return null;
  }
  const parts = m[1].split(",").map((s) => parseFloat(s.trim()));
  const [r, g, b, a] = parts;
  if (a !== undefined && a < 0.04) return null; // effectively transparent
  const hex = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0");
  return (hex(r) + hex(g) + hex(b)).toUpperCase();
}

function alphaOf(colour: string | null | undefined): number {
  if (!colour) return 0;
  const m = colour.match(/rgba\(([^)]+)\)/);
  if (!m) return 1;
  const parts = m[1].split(",").map((s) => parseFloat(s.trim()));
  return parts[3] ?? 1;
}

/** The first font family in a CSS stack, stripped of quotes. */
function firstFamily(stack: string): string {
  const first = (stack || "").split(",")[0] || "Arial";
  return first.replace(/["']/g, "").trim() || "Arial";
}

interface Rect { x: number; y: number; w: number; h: number }

function rectOf(el: Element, origin: DOMRect): Rect {
  const r = el.getBoundingClientRect();
  return { x: r.left - origin.left, y: r.top - origin.top, w: r.width, h: r.height };
}

/**
 * Elements that carry visible text and contain no deeper text-bearing
 * element. One text box per leaf keeps PowerPoint's own text layout from
 * fighting the measured geometry.
 */
function textLeaves(scope: Element): HTMLElement[] {
  const out: HTMLElement[] = [];
  const walk = (el: Element) => {
    const children = Array.from(el.children);
    const deeper = children.filter((c) => (c.textContent || "").trim().length > 0);
    const own = (el.textContent || "").trim();
    if (own.length === 0) return;
    if (deeper.length === 0) {
      out.push(el as HTMLElement);
      return;
    }
    // A node whose text is not fully accounted for by its children (e.g. a
    // label beside a nested span) still contributes its own run.
    deeper.forEach(walk);
  };
  Array.from(scope.children).forEach(walk);
  return out;
}

function alignOf(cs: CSSStyleDeclaration): "left" | "center" | "right" {
  const a = cs.textAlign;
  if (a === "center") return "center";
  if (a === "right" || a === "end") return "right";
  return "left";
}

/** Rasterises one element and returns a data URL, or null if it fails. */
async function snapshot(el: HTMLElement, scale = 2): Promise<string | null> {
  try {
    const html2canvas = (await import("html2canvas")).default;
    const canvas = await html2canvas(el, {
      scale,
      useCORS: true,
      backgroundColor: null,
      logging: false,
    });
    return canvas.toDataURL("image/png");
  } catch (err) {
    console.warn("[PPTX] raster fallback failed", err);
    return null;
  }
}

function addTextBox(pptSlide: any, el: HTMLElement, r: Rect) {
  const cs = getComputedStyle(el);
  const text = (el.textContent || "").replace(/\s+/g, " ").trim();
  if (!text) return;

  const sizePt = parseFloat(cs.fontSize) * PX_TO_PT;
  const weight = parseInt(cs.fontWeight, 10) || 400;
  const colour = toHex(cs.color) || "111111";

  // Give the box a little slack: PowerPoint measures text differently from
  // the browser, and a box sized to the exact browser metrics clips the
  // last line often enough to be noticeable.
  const padW = 0.06;
  const padH = 0.05;

  pptSlide.addText(text, {
    x: Math.max(0, px(r.x) - padW / 2),
    y: Math.max(0, px(r.y) - padH / 2),
    w: Math.min(SLIDE_W_IN, px(r.w) + padW),
    h: Math.min(SLIDE_H_IN, px(r.h) + padH),
    fontSize: Math.round(sizePt * 10) / 10,
    fontFace: firstFamily(cs.fontFamily),
    color: colour,
    bold: weight >= 600,
    italic: cs.fontStyle === "italic",
    align: alignOf(cs),
    valign: "middle",
    margin: 0,
    // Browser line-height is already baked into the measured rect; letting
    // PowerPoint add its own spacing would overflow the box.
    lineSpacingMultiple: 0.9,
    shrinkText: true,
    isTextBox: true,
  });
}

/**
 * PowerPoint preset geometries an element may ask for by name, via
 * `data-ppt-shape`. Everything outside this list falls back to a plain
 * rectangle, so a typo degrades instead of producing a corrupt deck.
 *
 * This is what lets the 3D asset library (templates/assets3d.tsx) draw a
 * cube as three flat faces in the browser and still export as a real
 * PowerPoint cube that a customer can recolour and resize.
 */
const PRESET_SHAPES = new Set([
  // Solids
  "cube",
  "can",
  "hexagon",
  "parallelogram",
  "trapezoid",
  "diamond",
  "triangle",

  "ellipse",
  "roundRect",
  // Extruded objects
  "star5",
  "star6",
  "star8",
  "rightArrow",
  "upArrow",
  "bentArrow",
  "chevron",
  "gear6",
  "gear9",
  "lightningBolt",
  "pie",
  "donut",
  "blockArc",
  "teardrop",
  "cloud",
  "heart",
  "pentagon",
  "octagon",
  "plaque",
  "bevel",
  "sun",
  "moon",
]);

/** Panels, cards, bands and rules: anything with a visible fill or border. */
function addDecoration(pptSlide: any, el: HTMLElement, r: Rect) {
  if (r.w < 2 || r.h < 2) return;
  // An element inside a composed asset: its parent already emitted the one
  // shape that represents the whole thing, so drawing it again would stack
  // flat faces on top of the real geometry.
  if (el.dataset.pptSkip) return;

  const cs = getComputedStyle(el);

  const fill = toHex(cs.backgroundColor);
  const fillAlpha = alphaOf(cs.backgroundColor);
  const borderW = parseFloat(cs.borderTopWidth) || 0;
  const borderCol = toHex(cs.borderTopColor);
  const hasBorder = borderW > 0 && !!borderCol && alphaOf(cs.borderTopColor) > 0.05;

  if (!fill && !hasBorder) return;

  const radius = parseFloat(cs.borderTopLeftRadius) || 0;

  const asked = el.dataset.pptShape;
  const preset = asked && PRESET_SHAPES.has(asked) ? asked : null;
  const shape = preset ?? (radius > 3 ? "roundRect" : "rect");

  // Degrees clockwise. The DOM rect of a rotated element is its bounding
  // box, which is wider than the element, so a rotation is only carried for
  // elements that opt in and are sized for it.
  const rotate = parseFloat(el.dataset.pptRotate ?? "") || 0;

  pptSlide.addShape(shape, {
    x: px(r.x),
    y: px(r.y),
    w: px(r.w),
    h: px(r.h),
    fill: fill ? { color: fill, transparency: Math.round((1 - fillAlpha) * 100) } : { type: "none" },
    line: hasBorder ? { color: borderCol!, width: borderW * PX_TO_PT } : { type: "none" },
    ...(!preset && radius > 3 ? { rectRadius: Math.min(0.2, px(radius)) } : {}),
    ...(rotate ? { rotate } : {}),
  });
}

function addTable(pptSlide: any, tableEl: HTMLElement, r: Rect) {
  const rows: any[][] = [];
  const trs = Array.from(tableEl.querySelectorAll("tr"));

  // The block renderer does not always use a <table>; fall back to the
  // measured grid children when there is no real table markup.
  const source = trs.length
    ? trs.map((tr) => Array.from(tr.children) as HTMLElement[])
    : null;
  if (!source) return false;

  for (const cells of source) {
    rows.push(
      cells.map((cell) => {
        const cs = getComputedStyle(cell);
        return {
          text: (cell.textContent || "").trim(),
          options: {
            fontSize: Math.round(parseFloat(cs.fontSize) * PX_TO_PT * 10) / 10,
            fontFace: firstFamily(cs.fontFamily),
            color: toHex(cs.color) || "111111",
            bold: (parseInt(cs.fontWeight, 10) || 400) >= 600,
            fill: toHex(cs.backgroundColor) ? { color: toHex(cs.backgroundColor)! } : undefined,
            align: alignOf(cs),
            valign: "middle",
          },
        };
      })
    );
  }

  if (rows.length === 0) return false;

  pptSlide.addTable(rows, {
    x: px(r.x),
    y: px(r.y),
    w: px(r.w),
    h: px(r.h),
    border: { type: "solid", pt: 0.5, color: "DDDDDD" },
    autoPage: false,
  });
  return true;
}

/** A native, data-bound chart. Returns false if the block data is unusable. */
function addChart(pptSlide: any, block: any, r: Rect): boolean {
  const kind = CHART_KIND[block?.type];
  if (!kind) return false;

  try {
    if (block.type === "donutChart") {
      const segs = block.segments || block.items || [];
      if (!segs.length) return false;
      pptSlide.addChart(
        "doughnut",
        [
          {
            name: block.title?.text || "Series",
            labels: segs.map((s: any) => String(s.label ?? "")),
            values: segs.map((s: any) => Number(s.value) || 0),
          },
        ],
        { x: px(r.x), y: px(r.y), w: px(r.w), h: px(r.h), showLegend: true, legendPos: "r" }
      );
      return true;
    }

    const categories: string[] = (block.categories || []).map((c: any) => String(c));
    const series = block.series || [];
    if (!categories.length || !series.length) return false;

    pptSlide.addChart(
      kind as any,
      series.map((s: any) => ({
        name: String(s.name ?? "Series"),
        labels: categories,
        values: (s.values || []).map((v: any) => Number(v) || 0),
      })),
      {
        x: px(r.x),
        y: px(r.y),
        w: px(r.w),
        h: px(r.h),
        showLegend: series.length > 1,
        legendPos: "b",
        barDir: block.type === "barChart" ? "col" : undefined,
        catAxisLabelFontSize: 9,
        valAxisLabelFontSize: 9,
      } as any
    );
    return true;
  } catch (err) {
    console.warn("[PPTX] native chart failed, will rasterise", err);
    return false;
  }
}

export interface BlockPptExportResult {
  ok: boolean;
  slidesExported: number;
  rasterisedBlocks: number;
  /** Slides that had no block spec and fell back to a picture. */
  pictureSlides: number;
}

export async function exportBlockDeckAsPPT(
  slides: any[],
  theme?: any,
  opts?: { fileName?: string; onProgress?: (done: number, total: number) => void }
): Promise<BlockPptExportResult> {
  const result: BlockPptExportResult = {
    ok: false,
    slidesExported: 0,
    rasterisedBlocks: 0,
    pictureSlides: 0,
  };
  if (!slides?.length) return result;

  const pptx = new PptxGenJS();
  pptx.defineLayout({ name: "SLIDEXY_WIDE", width: SLIDE_W_IN, height: SLIDE_H_IN });
  pptx.layout = "SLIDEXY_WIDE";

  const fileName =
    opts?.fileName || localStorage.getItem("fileName") || "Presentation";
  pptx.title = fileName;

  const stage = new OffscreenSlideStage(STAGE_W, STAGE_H);

  try {
    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i];
      const node = await stage.render(slide, theme);
      const origin = node.getBoundingClientRect();
      const pptSlide = pptx.addSlide();

      const spec = slide?.blockSpec;

      // ---- Slide background -------------------------------------------
      const stageEl = node.querySelector("[data-slide-spec]") as HTMLElement | null;
      if (stageEl) {
        const bg = toHex(getComputedStyle(stageEl).backgroundColor);
        if (bg) pptSlide.background = { color: bg };
      }
      if (spec?.background) {
        const bgLayer = node.querySelector("[data-slide-spec] > div") as HTMLElement | null;
        if (bgLayer) {
          const data = await snapshot(bgLayer, 1.5);
          if (data) {
            pptSlide.addImage({ data, x: 0, y: 0, w: SLIDE_W_IN, h: SLIDE_H_IN });
          }
        }
      }

      // ---- Slides with no block spec keep the old picture behaviour ----
      if (!spec || !Array.isArray(spec.blocks)) {
        const data = await snapshot(node, 2);
        if (data) pptSlide.addImage({ data, x: 0, y: 0, w: SLIDE_W_IN, h: SLIDE_H_IN });
        result.pictureSlides++;
        result.slidesExported++;
        opts?.onProgress?.(i + 1, slides.length);
        continue;
      }

      const byId = new Map<string, any>();
      for (const b of spec.blocks) byId.set(b.id, b);

      const blockEls = Array.from(
        node.querySelectorAll("[data-block-id]")
      ) as HTMLElement[];

      for (const el of blockEls) {
        const id = el.getAttribute("data-block-id")!;
        const block = byId.get(id);
        if (!block) continue;

        const r = rectOf(el, origin);
        if (r.w < 1 || r.h < 1) continue;

        // 1. Exotic visuals: one picture, scoped to the block.
        if (RASTERISE.has(block.type)) {
          const data = await snapshot(el);
          if (data) {
            pptSlide.addImage({ data, x: px(r.x), y: px(r.y), w: px(r.w), h: px(r.h) });
            result.rasterisedBlocks++;
          }
          continue;
        }

        // 2. Charts: native and data-bound where possible.
        if (CHART_KIND[block.type]) {
          if (addChart(pptSlide, block, r)) continue;
          const data = await snapshot(el);
          if (data) {
            pptSlide.addImage({ data, x: px(r.x), y: px(r.y), w: px(r.w), h: px(r.h) });
            result.rasterisedBlocks++;
          }
          continue;
        }

        // 3. Tables: native, so rows and cells stay editable.
        const tableEl = el.querySelector("table") as HTMLElement | null;
        if (tableEl && addTable(pptSlide, tableEl, rectOf(tableEl, origin))) {
          continue;
        }

        // 4. Everything else: decoration, then images, then text.
        addDecoration(pptSlide, el, r);

        for (const card of Array.from(el.querySelectorAll("*")) as HTMLElement[]) {
          const cs = getComputedStyle(card);
          const isCard =
            (toHex(cs.backgroundColor) && alphaOf(cs.backgroundColor) > 0.05) ||
            (parseFloat(cs.borderTopWidth) || 0) > 0;
          if (isCard) addDecoration(pptSlide, card, rectOf(card, origin));
        }

        for (const img of Array.from(el.querySelectorAll("img")) as HTMLImageElement[]) {
          const ir = rectOf(img, origin);
          if (ir.w < 4 || ir.h < 4) continue;
          try {
            pptSlide.addImage({
              path: img.src,
              x: px(ir.x),
              y: px(ir.y),
              w: px(ir.w),
              h: px(ir.h),
            });
          } catch {
            /* a broken image should not abort the deck */
          }
        }

        // SVG icons have no PowerPoint equivalent; a small picture each.
        //
        // Unless the SVG is marked skip. The 3D assets draw themselves as
        // true isometric artwork for the screen and declare an invisible
        // hull for the export, so snapshotting the artwork too would lay a
        // flat picture over the real, editable geometry.
        for (const svg of Array.from(el.querySelectorAll("svg")) as unknown as HTMLElement[]) {
          if ((svg as HTMLElement).dataset?.pptSkip) continue;
          const sr = rectOf(svg, origin);
          if (sr.w < 6 || sr.h < 6) continue;
          const data = await snapshot(svg, 3);
          if (data) pptSlide.addImage({ data, x: px(sr.x), y: px(sr.y), w: px(sr.w), h: px(sr.h) });
        }

        for (const leaf of textLeaves(el)) {
          addTextBox(pptSlide, leaf, rectOf(leaf, origin));
        }
      }

      result.slidesExported++;
      opts?.onProgress?.(i + 1, slides.length);
    }

    if (result.slidesExported === 0) return result;

    await pptx.writeFile({ fileName: `${fileName}.pptx` });
    result.ok = true;
    return result;
  } catch (err) {
    console.error("[PPTX] export failed", err);
    return result;
  } finally {
    stage.destroy();
  }
}
