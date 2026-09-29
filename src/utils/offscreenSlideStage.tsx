"use client";

import React from "react";
import { createRoot, Root } from "react-dom/client";
import { HTMLSlideRenderer } from "@/app/components/editor/HTMLSlideRenderer";

/**
 * Renders slides off-screen, one at a time, for export.
 *
 * The editor only mounts the slide you are currently looking at, so export can
 * no longer scrape `#slide-node-${i}` out of the page. This mounts its own copy
 * of each slide at full size, waits for fonts and images, and hands back the
 * node for html2canvas.
 *
 * Using a dedicated stage also means export no longer inherits editor-only
 * styling (selection rings, scale transforms, drop shadows) that previously had
 * to be stripped off a clone by hand.
 */
export class OffscreenSlideStage {
  private host: HTMLDivElement;
  private mount: HTMLDivElement;
  private root: Root;

  constructor(private width: number, private height: number) {
    this.host = document.createElement("div");
    // Kept on-screen dimensionally but pushed out of view: html2canvas cannot
    // capture `display:none`, and `visibility:hidden` breaks some layouts.
    this.host.style.cssText = [
      "position:fixed",
      "top:0",
      "left:-20000px",
      `width:${width}px`,
      `height:${height}px`,
      "overflow:hidden",
      "background:#ffffff",
      "z-index:-1",
    ].join(";");

    this.mount = document.createElement("div");
    this.mount.style.cssText = `width:${width}px;height:${height}px;position:relative;overflow:hidden;`;
    this.host.appendChild(this.mount);
    document.body.appendChild(this.host);

    this.root = createRoot(this.mount);
  }

  /**
   * Render one slide and resolve once it is visually settled.
   * `isEditing` is false so no contentEditable, selection outlines or
   * pointer affordances end up in the export.
   */
  async render(slide: any, theme: any): Promise<HTMLElement> {
    this.root.render(
      <HTMLSlideRenderer slide={slide} theme={theme} isEditing={false} />
    );

    // React's concurrent root commits asynchronously; two frames is enough for
    // the commit plus the browser's first layout/paint pass.
    await nextFrame();
    await nextFrame();

    if (document.fonts?.ready) {
      await document.fonts.ready;
    }

    await waitForImages(this.mount);

    return this.mount;
  }

  destroy() {
    try {
      this.root.unmount();
    } catch {
      /* already torn down */
    }
    this.host.remove();
  }
}

function nextFrame(): Promise<void> {
  return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}

/**
 * Waits for every <img> and every CSS `background-image` under `root`.
 * Slide layouts use both, and html2canvas will silently capture a blank box for
 * anything that has not finished loading.
 */
async function waitForImages(root: HTMLElement, timeoutMs = 8000): Promise<void> {
  const urls = new Set<string>();

  root.querySelectorAll("img").forEach((img) => {
    if (img.src) urls.add(img.src);
  });

  root.querySelectorAll<HTMLElement>("*").forEach((el) => {
    const bg = getComputedStyle(el).backgroundImage;
    if (!bg || bg === "none") return;
    // backgroundImage can hold several comma-separated layers, including gradients.
    for (const match of bg.matchAll(/url\(["']?(.*?)["']?\)/g)) {
      if (match[1]) urls.add(match[1]);
    }
  });

  if (urls.size === 0) return;

  const loads = Array.from(urls).map(
    (url) =>
      new Promise<void>((resolve) => {
        const probe = new Image();
        probe.crossOrigin = "anonymous";
        // Resolve either way — a broken image should not abort the whole export.
        probe.onload = () => resolve();
        probe.onerror = () => resolve();
        probe.src = url;
        if (probe.complete) resolve();
      })
  );

  await Promise.race([
    Promise.all(loads),
    new Promise<void>((resolve) => setTimeout(resolve, timeoutMs)),
  ]);
}
