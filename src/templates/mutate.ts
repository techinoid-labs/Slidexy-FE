/**
 * Structural edits to a SlideSpec.
 *
 * `applyEdit.ts` handles the text case (rewriting a RichText.text). This
 * handles everything else the inspector needs: arbitrary field values, and
 * adding, removing and reordering items inside a block.
 *
 * All operations are immutable and clone only the nodes along the changed
 * path, so React re-renders exactly the block that changed.
 */

import type { Block, RichText, SlideSpec } from "./types";

const uid = () => Math.random().toString(36).slice(2, 9);

export const richText = (text: string): RichText => ({ id: uid(), text });

// ─────────────────────────────────────────────────────────────────────────────

function getAtPath(node: any, segments: string[]): any {
  return segments.reduce((acc, seg) => (acc == null ? acc : acc[seg]), node);
}

function updateAtPath(node: any, segments: string[], update: (v: any) => any): any {
  if (segments.length === 0) return update(node);

  const [head, ...rest] = segments;

  if (Array.isArray(node)) {
    const i = Number(head);
    if (!Number.isInteger(i) || i < 0 || i >= node.length) return node;
    const next = node.slice();
    next[i] = updateAtPath(node[i], rest, update);
    return next;
  }

  if (node && typeof node === "object") {
    return { ...node, [head]: updateAtPath(node[head] ?? {}, rest, update) };
  }

  return node;
}

function withBlock(spec: SlideSpec, blockId: string, fn: (b: Block) => Block): SlideSpec {
  const i = spec.blocks.findIndex((b) => b.id === blockId);
  if (i === -1) return spec;
  const next = fn(spec.blocks[i]);
  if (next === spec.blocks[i]) return spec;
  const blocks = spec.blocks.slice();
  blocks[i] = next;
  return { ...spec, blocks };
}

// ─────────────────────────────────────────────────────────────────────────────
// Field values
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Sets any non-text value inside a block: a chart number, an icon name, an
 * image url, a style enum. `path` is dotted and relative to the block.
 */
export function setBlockValue(
  spec: SlideSpec,
  blockId: string,
  path: string,
  value: unknown
): SlideSpec {
  const segments = path.split(".").filter(Boolean);
  if (!segments.length) return spec;
  return withBlock(spec, blockId, (b) => updateAtPath(b, segments, () => value) as Block);
}

export function getBlockValue(spec: SlideSpec, blockId: string, path: string): any {
  const block = spec.blocks.find((b) => b.id === blockId);
  if (!block) return undefined;
  return getAtPath(block, path.split(".").filter(Boolean));
}

export function getBlock(spec: SlideSpec, blockId: string): Block | undefined {
  return spec.blocks.find((b) => b.id === blockId);
}

/** Resolves a `blk-{slideIndex}-{blockId}-{path}` element id back to its parts. */
export function parseBlockElementId(
  elementId: string | null | undefined
): { slideIndex: number; blockId: string; path: string } | null {
  if (!elementId || !elementId.startsWith("blk-")) return null;
  // blockId is generated as `<prefix>-<n>` and path may itself contain dashes
  // after the helper converts dots, so split positionally instead of greedily.
  const rest = elementId.slice(4);
  const firstDash = rest.indexOf("-");
  if (firstDash === -1) return null;
  const slideIndex = Number(rest.slice(0, firstDash));
  const tail = rest.slice(firstDash + 1);

  // Block ids are `<letters>-<digits>`; the remainder is the field path.
  const m = tail.match(/^([a-z]+-\d+)-(.+)$/i);
  if (!m) return null;
  return { slideIndex, blockId: m[1], path: m[2] };
}

// ─────────────────────────────────────────────────────────────────────────────
// Lists
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Appends an item to a list inside a block, cloning the last item as a
 * template so the new row carries the same shape (and therefore renders).
 * Text fields are blanked and every RichText gets a fresh id.
 */
export function addBlockItem(
  spec: SlideSpec,
  blockId: string,
  listPath = "items"
): SlideSpec {
  return withBlock(spec, blockId, (b) => {
    const segments = listPath.split(".").filter(Boolean);
    const list = getAtPath(b, segments);
    if (!Array.isArray(list) || list.length === 0) return b;

    const template = list[list.length - 1];
    const fresh = freshenItem(template, list.length);
    return updateAtPath(b, segments, (arr: any[]) => [...arr, fresh]) as Block;
  });
}

export function removeBlockItem(
  spec: SlideSpec,
  blockId: string,
  index: number,
  listPath = "items"
): SlideSpec {
  return withBlock(spec, blockId, (b) => {
    const segments = listPath.split(".").filter(Boolean);
    const list = getAtPath(b, segments);
    if (!Array.isArray(list) || list.length <= 1) return b; // never empty a block
    return updateAtPath(b, segments, (arr: any[]) =>
      arr.filter((_, i) => i !== index)
    ) as Block;
  });
}

export function moveBlockItem(
  spec: SlideSpec,
  blockId: string,
  from: number,
  to: number,
  listPath = "items"
): SlideSpec {
  return withBlock(spec, blockId, (b) => {
    const segments = listPath.split(".").filter(Boolean);
    const list = getAtPath(b, segments);
    if (!Array.isArray(list)) return b;
    if (to < 0 || to >= list.length || from === to) return b;
    return updateAtPath(b, segments, (arr: any[]) => {
      const next = arr.slice();
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    }) as Block;
  });
}

/** Deep-copies an item, giving every RichText a new id and empty-ish text. */
function freshenItem(item: any, index: number): any {
  if (Array.isArray(item)) return item.map((x) => freshenItem(x, index));
  if (item && typeof item === "object") {
    // A RichText node.
    if (typeof item.text === "string" && typeof item.id === "string" && Object.keys(item).length <= 2) {
      return { id: uid(), text: "New item" };
    }
    const out: any = {};
    for (const [k, v] of Object.entries(item)) {
      if (k === "id") {
        out[k] = `i${index}-${uid()}`;
      } else if (k === "url" || k === "photoUrl" || k === "avatarUrl") {
        out[k] = undefined;
      } else {
        out[k] = freshenItem(v, index);
      }
    }
    return out;
  }
  return item;
}

// ─────────────────────────────────────────────────────────────────────────────
// Charts
// ─────────────────────────────────────────────────────────────────────────────

/** Adds a category to a chart, extending every series so they stay aligned. */
export function addChartCategory(spec: SlideSpec, blockId: string): SlideSpec {
  return withBlock(spec, blockId, (b: any) => {
    if (!Array.isArray(b.categories)) return b;
    return {
      ...b,
      categories: [...b.categories, `C${b.categories.length + 1}`],
      series: b.series.map((s: any) => ({ ...s, values: [...s.values, 0] })),
    };
  });
}

export function removeChartCategory(spec: SlideSpec, blockId: string, index: number): SlideSpec {
  return withBlock(spec, blockId, (b: any) => {
    if (!Array.isArray(b.categories) || b.categories.length <= 2) return b;
    return {
      ...b,
      categories: b.categories.filter((_: string, i: number) => i !== index),
      series: b.series.map((s: any) => ({
        ...s,
        values: s.values.filter((_: number, i: number) => i !== index),
      })),
    };
  });
}

export function addChartSeries(spec: SlideSpec, blockId: string): SlideSpec {
  return withBlock(spec, blockId, (b: any) => {
    if (!Array.isArray(b.series)) return b;
    const len = b.categories?.length ?? 0;
    return {
      ...b,
      series: [
        ...b.series,
        {
          id: `s${uid()}`,
          name: `Series ${b.series.length + 1}`,
          accent: ((b.series.length % 4) + 1) as 1 | 2 | 3 | 4,
          kind: b.type === "lineChart" ? "line" : "bar",
          values: Array.from({ length: len }, () => 0),
        },
      ],
    };
  });
}

export function removeChartSeries(spec: SlideSpec, blockId: string, index: number): SlideSpec {
  return withBlock(spec, blockId, (b: any) => {
    if (!Array.isArray(b.series) || b.series.length <= 1) return b;
    return { ...b, series: b.series.filter((_: unknown, i: number) => i !== index) };
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Blocks within a slide
// ─────────────────────────────────────────────────────────────────────────────

export function moveBlock(spec: SlideSpec, blockId: string, delta: number): SlideSpec {
  const i = spec.blocks.findIndex((b) => b.id === blockId);
  const to = i + delta;
  if (i === -1 || to < 0 || to >= spec.blocks.length) return spec;
  const blocks = spec.blocks.slice();
  const [moved] = blocks.splice(i, 1);
  blocks.splice(to, 0, moved);
  return { ...spec, blocks };
}

export function removeBlock(spec: SlideSpec, blockId: string): SlideSpec {
  if (spec.blocks.length <= 1) return spec;
  return { ...spec, blocks: spec.blocks.filter((b) => b.id !== blockId) };
}
