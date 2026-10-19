"use client";

/**
 * Template gallery / preview.
 *
 * Renders every slide of a template at true 960x540 so designs can be reviewed
 * without going through the generate flow. `?t=<template-id>` selects one.
 */

import React, { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { set } from "idb-keyval";
import { SlideSpecRenderer } from "@/templates/SlideSpecRenderer";
import { TEMPLATES, templateSummaries } from "@/templates/catalog";
import { STAGE_HEIGHT, STAGE_WIDTH } from "@/templates/tokens";
import { templateToDeck } from "@/templates/toDeck";

function TemplatePreviewInner() {
  const summaries = templateSummaries();
  const searchParams = useSearchParams();
  // Deep link support, so /templates can send someone straight to the one
  // they picked instead of dropping them on the first in the list.
  const requested = searchParams.get("id");
  const [activeId, setActiveId] = useState(
    requested && summaries.some((s) => s.id === requested) ? requested : summaries[0]?.id
  );
  const [scale, setScale] = useState(0.62);

  const template = TEMPLATES.find((t) => t.id === activeId) ?? TEMPLATES[0];
  if (!template) return <div style={{ padding: 40 }}>No templates registered.</div>;

  return (
    <div style={{ minHeight: "100vh", background: "#0f1115", color: "#e8eaed", padding: 24 }}>
      <header style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 20, margin: 0, fontFamily: "Inter, system-ui, sans-serif" }}>
          Template preview
        </h1>
        <p style={{ fontSize: 13, color: "#9aa0a6", margin: "4px 0 0" }}>
          {summaries.length} template{summaries.length === 1 ? "" : "s"} registered ·{" "}
          {template.slides.length} slides in “{template.name}”
        </p>
      </header>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
        {summaries.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveId(s.id)}
            style={{
              padding: "6px 12px",
              borderRadius: 8,
              border: `1px solid ${s.id === activeId ? s.accent : "#2a2d33"}`,
              background: s.id === activeId ? s.accent : "transparent",
              color: s.id === activeId ? "#fff" : "#c8ccd2",
              fontSize: 12,
              cursor: "pointer",
              fontFamily: "Inter, system-ui, sans-serif",
            }}
          >
            {String(s.number).padStart(2, "0")} {s.name}
          </button>
        ))}

        <button
          id="use-template"
          onClick={async () => {
            // Seed the deck the editor reads, then hand over.
            await set("slidesX_slides", { slides: templateToDeck(template) });
            localStorage.setItem("fileName", template.name);
            window.location.href = "/editor";
          }}
          style={{
            padding: "6px 14px",
            borderRadius: 8,
            border: "none",
            background: "#16a34a",
            color: "#fff",
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "Inter, system-ui, sans-serif",
          }}
        >
          Use this template →
        </button>

        <label style={{ marginLeft: "auto", fontSize: 12, display: "flex", alignItems: "center", gap: 8 }}>
          Zoom
          <input
            type="range"
            min={0.35}
            max={1}
            step={0.01}
            value={scale}
            onChange={(e) => setScale(Number(e.target.value))}
          />
        </label>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(auto-fill, minmax(${STAGE_WIDTH * scale}px, 1fr))`,
          gap: 20,
          alignItems: "start",
        }}
      >
        {template.slides.map((spec, i) => (
          <figure key={spec.id} style={{ margin: 0 }}>
            <div
              style={{
                width: STAGE_WIDTH * scale,
                height: STAGE_HEIGHT * scale,
                overflow: "hidden",
                borderRadius: 8,
                boxShadow: "0 8px 30px rgba(0,0,0,0.5)",
              }}
            >
              <div
                data-preview-slide={i}
                style={{ transform: `scale(${scale})`, transformOrigin: "top left" }}
              >
                <SlideSpecRenderer
                  spec={spec}
                  theme={template.theme}
                  slideIndex={i}
                  slideNumber={i + 1}
                  isEditing={false}
                />
              </div>
            </div>
            <figcaption style={{ fontSize: 11, color: "#9aa0a6", marginTop: 6 }}>
              {String(i + 1).padStart(2, "0")} · {spec.name} · {spec.layout}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

/** useSearchParams requires a Suspense boundary in the app router. */
export default function TemplatePreviewPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40 }}>Loading…</div>}>
      <TemplatePreviewInner />
    </Suspense>
  );
}
