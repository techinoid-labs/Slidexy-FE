/**
 * Immutable text edits against a SlideSpec.
 *
 * Blocks address their editable fields by a dotted path relative to the block
 * (`title`, `items.2.label`, `plans.1.features.0.label`). This walks that path
 * and rewrites only the `RichText.text` at the end of it, cloning just the
 * nodes along the way — so React sees new references exactly where something
 * changed and nowhere else.
 */

import type { Block, SlideSpec } from "./types";

function setAtPath(node: any, segments: string[], value: string): any {
  const [head, ...rest] = segments;

  if (Array.isArray(node)) {
    const index = Number(head);
    if (!Number.isInteger(index) || index < 0 || index >= node.length) return node;
    const next = node.slice();
    next[index] = rest.length
      ? setAtPath(node[index], rest, value)
      : { ...node[index], text: value };
    return next;
  }

  if (node && typeof node === "object") {
    if (!(head in node)) return node;
    return {
      ...node,
      [head]: rest.length
        ? setAtPath(node[head], rest, value)
        : { ...node[head], text: value },
    };
  }

  return node;
}

export function applyBlockTextEdit(
  spec: SlideSpec,
  blockId: string,
  path: string,
  value: string
): SlideSpec {
  const index = spec.blocks.findIndex((b) => b.id === blockId);
  if (index === -1) return spec;

  const segments = path.split(".").filter(Boolean);
  if (segments.length === 0) return spec;

  const updated = setAtPath(spec.blocks[index], segments, value) as Block;
  if (updated === spec.blocks[index]) return spec;

  const blocks = spec.blocks.slice();
  blocks[index] = updated;
  return { ...spec, blocks };
}

/** Collects every editable string in a spec — used by search and by export. */
export function collectSpecText(spec: SlideSpec): string[] {
  const out: string[] = [];
  const walk = (node: any) => {
    if (!node || typeof node !== "object") return;
    if (Array.isArray(node)) return node.forEach(walk);
    if (typeof node.text === "string" && typeof node.id === "string") {
      out.push(node.text);
      return;
    }
    Object.values(node).forEach(walk);
  };
  spec.blocks.forEach(walk);
  return out;
}

/**
 * Replaces the prompt-only image slots with generated URLs.
 * The backend image pipeline returns one URL per prompt slot; this maps them
 * back onto the spec in the same order `collectImagePrompts` produced them.
 */
export function collectImagePrompts(spec: SlideSpec): Array<{ path: string; prompt: string }> {
  const out: Array<{ path: string; prompt: string }> = [];

  if (spec.background?.prompt && !spec.background.url) {
    out.push({ path: "background", prompt: spec.background.prompt });
  }

  spec.blocks.forEach((b, bi) => {
    const anyB = b as any;
    if ((b.type === "image" || b.type === "deviceMockup") && anyB.prompt && !anyB.url) {
      out.push({ path: `blocks.${bi}`, prompt: anyB.prompt });
    }
    if (Array.isArray(anyB.items)) {
      anyB.items.forEach((item: any, ii: number) => {
        const p = item.prompt ?? item.photoPrompt ?? item.avatarPrompt;
        const hasUrl = item.url ?? item.photoUrl ?? item.avatarUrl;
        if (p && !hasUrl) out.push({ path: `blocks.${bi}.items.${ii}`, prompt: p });
      });
    }
    if (b.type === "quote" && anyB.avatarPrompt && !anyB.avatarUrl) {
      out.push({ path: `blocks.${bi}`, prompt: anyB.avatarPrompt });
    }
  });

  return out;
}

export function applyImageUrls(
  spec: SlideSpec,
  urls: Record<string, string>
): SlideSpec {
  let next: SlideSpec = spec;

  if (urls["background"] && next.background) {
    next = { ...next, background: { ...next.background, url: urls["background"] } };
  }

  const blocks = next.blocks.map((b, bi) => {
    const anyB = b as any;
    let block = b;

    const own = urls[`blocks.${bi}`];
    if (own) {
      if (b.type === "quote") block = { ...anyB, avatarUrl: own };
      else block = { ...anyB, url: own };
    }

    if (Array.isArray((block as any).items)) {
      const items = (block as any).items.map((item: any, ii: number) => {
        const u = urls[`blocks.${bi}.items.${ii}`];
        if (!u) return item;
        if ("photoPrompt" in item) return { ...item, photoUrl: u };
        return { ...item, url: u };
      });
      block = { ...(block as any), items };
    }

    return block;
  });

  return { ...next, blocks };
}
