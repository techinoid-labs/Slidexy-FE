"use client";

import React from "react";
import { Card, Icon, Text, useTokens } from "./primitives";
import { withAlpha, readableOn } from "../tokens";
import type {
  BarChartBlock,
  DonutChartBlock,
  NestedCirclesBlock,
  ScatterQuadrantBlock,
  StatCardsBlock,
  VennBlock,
} from "../types";

/**
 * Charts are hand-rolled inline SVG rather than a charting library.
 * Three reasons: the export path rasterises the DOM (a canvas-based chart lib
 * would need its own capture), we need them to read colours from the theme,
 * and a 960x540 slide needs far less than a full charting engine provides.
 */

function formatValue(v: number, format: BarChartBlock["yFormat"]): string {
  switch (format) {
    case "compact":
      if (Math.abs(v) >= 1_000_000) return `${(v / 1_000_000).toFixed(v % 1_000_000 ? 1 : 0)}M`;
      if (Math.abs(v) >= 1_000) return `${(v / 1_000).toFixed(v % 1_000 ? 1 : 0)}K`;
      return String(v);
    case "currency":
      if (Math.abs(v) >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
      if (Math.abs(v) >= 1_000) return `$${(v / 1_000).toFixed(0)}K`;
      return `$${v}`;
    case "percent":
      return `${v}%`;
    default:
      return String(v);
  }
}

/** "Nice" axis maximum so gridlines land on round numbers. */
function niceMax(raw: number): number {
  if (raw <= 0) return 1;
  const exp = Math.floor(Math.log10(raw));
  const base = Math.pow(10, exp);
  const n = raw / base;
  const step = n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10;
  return step * base;
}

// ─────────────────────────────────────────────────────────────────────────────

export const StatCardsBlockView: React.FC<{ block: StatCardsBlock }> = ({ block }) => {
  const t = useTokens();
  const columns = block.style?.columns ?? Math.min(block.items.length, 4);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gap: t.space(3),
      }}
    >
      {block.items.map((item, i) => {
        const accent = t.accent(i + 1 + (block.style?.accentIndex ?? 0));
        return (
          <Card key={item.id} accent={accent} style={{ padding: t.space(4) }}>
            <div style={{ display: "flex", gap: t.space(3), alignItems: "center" }}>
              {item.icon && <Icon name={item.icon} accent={accent} size={30} />}
              <div style={{ minWidth: 0 }}>
                <Text
                  blockId={block.id}
                  path={`items.${i}.value`}
                  value={item.value}
                  token="stat"
                  color={t.theme.mode === "dark" ? t.palette.text : accent}
                  style={{ fontFamily: t.theme.fonts.numeric ?? t.theme.fonts.display }}
                />
                <Text
                  blockId={block.id}
                  path={`items.${i}.label`}
                  value={item.label}
                  token="small"
                  color={t.palette.textMuted}
                  clamp={2}
                />
                {item.delta?.text && (
                  <Text
                    blockId={block.id}
                    path={`items.${i}.delta`}
                    value={item.delta}
                    token="micro"
                    color={t.palette.positive}
                  />
                )}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────

export const ChartBlockView: React.FC<{ block: BarChartBlock }> = ({ block }) => {
  const t = useTokens();

  const W = 520;
  const H = 210;
  const padLeft = 38;
  const padBottom = 24;
  const padTop = 14;
  const plotW = W - padLeft - 8;
  const plotH = H - padBottom - padTop;

  const all = block.series.flatMap((s) => s.values);
  const max = niceMax(Math.max(...all, 1) * 1.1);
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => max * f);

  const n = block.categories.length;
  const bandW = plotW / Math.max(n, 1);

  const barSeries = block.series.filter(
    (s) => (block.type === "barChart" ? true : s.kind === "bar")
  );
  const lineSeries = block.series.filter(
    (s) => (block.type === "lineChart" ? true : s.kind === "line")
  );

  const barCount = Math.max(barSeries.length, 1);
  const barGroupW = bandW * 0.62;
  const barW = barGroupW / barCount;

  const y = (v: number) => padTop + plotH - (v / max) * plotH;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: t.space(2), width: "100%" }}>
      {/* Legend */}
      <div style={{ display: "flex", gap: t.space(4), flexWrap: "wrap" }}>
        {block.series.map((s, i) => (
          <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span
              style={{
                width: 9,
                height: 9,
                borderRadius: (s.kind ?? (block.type === "lineChart" ? "line" : "bar")) === "line" ? 9 : 2,
                background: t.accent(s.accent ?? i + 1),
                display: "inline-block",
              }}
            />
            <span style={{ ...t.type("small"), color: t.palette.textMuted }}>{s.name}</span>
          </div>
        ))}
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block" }}>
        {/* Gridlines + y labels */}
        {ticks.map((tick, i) => (
          <g key={i}>
            <line
              x1={padLeft}
              x2={W - 8}
              y1={y(tick)}
              y2={y(tick)}
              stroke={t.palette.border}
              strokeWidth={1}
            />
            <text
              x={padLeft - 7}
              y={y(tick) + 3.5}
              textAnchor="end"
              fill={t.palette.textMuted}
              style={{ fontSize: 9, fontFamily: t.theme.fonts.body }}
            >
              {formatValue(Math.round(tick), block.yFormat)}
            </text>
          </g>
        ))}

        {/* Bars */}
        {barSeries.map((s, si) =>
          s.values.slice(0, n).map((v, ci) => {
            const x =
              padLeft + ci * bandW + (bandW - barGroupW) / 2 + si * barW;
            const h = Math.max(((v / max) * plotH) || 0, 1.5);
            return (
              <rect
                key={`${s.id}-${ci}`}
                x={x}
                y={padTop + plotH - h}
                width={Math.max(barW - 3, 2)}
                height={h}
                rx={3}
                fill={t.accent(s.accent ?? si + 1)}
              />
            );
          })
        )}

        {/* Lines */}
        {lineSeries.map((s, si) => {
          const pts = s.values
            .slice(0, n)
            .map((v, ci) => `${padLeft + ci * bandW + bandW / 2},${y(v)}`)
            .join(" ");
          const color = t.accent(s.accent ?? barSeries.length + si + 1);
          return (
            <g key={s.id}>
              <polyline points={pts} fill="none" stroke={color} strokeWidth={2.4} strokeLinejoin="round" />
              {s.values.slice(0, n).map((v, ci) => (
                <circle
                  key={ci}
                  cx={padLeft + ci * bandW + bandW / 2}
                  cy={y(v)}
                  r={3.2}
                  fill={color}
                  stroke={t.palette.surface}
                  strokeWidth={1.4}
                />
              ))}
            </g>
          );
        })}

        {/* X labels */}
        {block.categories.map((c, i) => (
          <text
            key={i}
            x={padLeft + i * bandW + bandW / 2}
            y={H - 7}
            textAnchor="middle"
            fill={t.palette.textMuted}
            style={{ fontSize: 9.5, fontFamily: t.theme.fonts.body }}
          >
            {c}
          </text>
        ))}
      </svg>

      {block.caption?.text && (
        <Text
          blockId={block.id}
          path="caption"
          value={block.caption}
          token="small"
          color={t.palette.textMuted}
        />
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────

export const DonutChartBlockView: React.FC<{ block: DonutChartBlock }> = ({ block }) => {
  const t = useTokens();
  const total = block.items.reduce((s, i) => s + i.value, 0) || 1;

  const R = 54;
  const STROKE = 22;
  const C = 2 * Math.PI * R;
  let offset = 0;

  return (
    <div style={{ display: "flex", gap: t.space(6), alignItems: "center" }}>
      <div style={{ position: "relative", width: 150, height: 150, flexShrink: 0 }}>
        <svg viewBox="0 0 150 150" style={{ width: 150, height: 150, transform: "rotate(-90deg)" }}>
          <circle cx="75" cy="75" r={R} fill="none" stroke={t.palette.surfaceAlt} strokeWidth={STROKE} />
          {block.items.map((item, i) => {
            const frac = item.value / total;
            const dash = frac * C;
            const el = (
              <circle
                key={item.id}
                cx="75"
                cy="75"
                r={R}
                fill="none"
                stroke={t.accent(i + 1)}
                strokeWidth={STROKE}
                strokeDasharray={`${dash} ${C - dash}`}
                strokeDashoffset={-offset}
              />
            );
            offset += dash;
            return el;
          })}
        </svg>
        {(block.centerValue?.text || block.centerLabel?.text) && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              blockId={block.id}
              path="centerValue"
              value={block.centerValue}
              token="h2"
              align="center"
              style={{ fontFamily: t.theme.fonts.numeric ?? t.theme.fonts.display }}
            />
            <Text
              blockId={block.id}
              path="centerLabel"
              value={block.centerLabel}
              token="micro"
              color={t.palette.textMuted}
              align="center"
            />
          </div>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: t.space(3), minWidth: 0, flex: 1 }}>
        {block.items.map((item, i) => (
          <div key={item.id} style={{ display: "flex", alignItems: "center", gap: t.space(3) }}>
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: t.accent(i + 1),
                flexShrink: 0,
              }}
            />
            <span
              style={{
                ...t.type("h3"),
                color: t.palette.text,
                minWidth: 46,
                fontFamily: t.theme.fonts.numeric ?? t.theme.fonts.display,
              }}
            >
              {Math.round((item.value / total) * 100)}%
            </span>
            <Text
              blockId={block.id}
              path={`items.${i}.label`}
              value={item.label}
              token="body"
              color={t.palette.textMuted}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────

export const ScatterQuadrantBlockView: React.FC<{ block: ScatterQuadrantBlock }> = ({ block }) => {
  const t = useTokens();
  const W = 360;
  const H = 240;
  const pad = 26;

  const px = (x: number) => pad + x * (W - pad * 2);
  const py = (y: number) => H - pad - y * (H - pad * 2);

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block" }}>
        {/* Axes */}
        <line x1={W / 2} y1={pad - 8} x2={W / 2} y2={H - pad + 8} stroke={t.palette.border} strokeWidth={1.2} />
        <line x1={pad - 8} y1={H / 2} x2={W - pad + 8} y2={H / 2} stroke={t.palette.border} strokeWidth={1.2} />

        {/* Axis labels */}
        <text x={W / 2} y={10} textAnchor="middle" fill={t.palette.textMuted} style={{ fontSize: 9.5 }}>
          {block.yAxis.high}
        </text>
        <text x={W / 2} y={H - 2} textAnchor="middle" fill={t.palette.textMuted} style={{ fontSize: 9.5 }}>
          {block.yAxis.low}
        </text>
        <text x={2} y={H / 2 - 4} fill={t.palette.textMuted} style={{ fontSize: 9.5 }}>
          {block.xAxis.low}
        </text>
        <text x={W - 2} y={H / 2 - 4} textAnchor="end" fill={t.palette.textMuted} style={{ fontSize: 9.5 }}>
          {block.xAxis.high}
        </text>

        {/* Points */}
        {block.points.map((p) => {
          const color = p.highlight ? t.accent(1) : t.palette.textMuted;
          return (
            <g key={p.id}>
              <circle
                cx={px(p.x)}
                cy={py(p.y)}
                r={p.highlight ? 8 : 5}
                fill={color}
                opacity={p.highlight ? 1 : 0.55}
              />
              {p.highlight && (
                <circle
                  cx={px(p.x)}
                  cy={py(p.y)}
                  r={13}
                  fill="none"
                  stroke={withAlpha(color, 0.3)}
                  strokeWidth={2}
                />
              )}
              <text
                x={px(p.x) + (p.x > 0.7 ? -12 : 13)}
                y={py(p.y) + 3.5}
                textAnchor={p.x > 0.7 ? "end" : "start"}
                fill={p.highlight ? t.palette.text : t.palette.textMuted}
                style={{ fontSize: 9.5, fontWeight: p.highlight ? 700 : 400 }}
              >
                {p.label.text}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────

/** Concentric circles for TAM / SAM / SOM. */
export const NestedCirclesBlockView: React.FC<{ block: NestedCirclesBlock }> = ({ block }) => {
  const t = useTokens();
  const SIZE = 230;
  const count = block.items.length || 1;

  return (
    <div style={{ position: "relative", width: SIZE, height: SIZE, margin: "0 auto" }}>
      {block.items.map((item, i) => {
        const shrink = i / count;
        const d = SIZE * (1 - shrink * 0.62);
        const accent = t.accent(i + 1);
        return (
          <div
            key={item.id}
            style={{
              position: "absolute",
              width: d,
              height: d,
              left: (SIZE - d) / 2,
              // Nest toward the bottom so every ring's label stays visible.
              top: SIZE - d,
              borderRadius: "50%",
              background: withAlpha(accent, t.theme.mode === "dark" ? 0.5 : 0.85),
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              paddingTop: Math.max(d * 0.07, 8),
              boxSizing: "border-box",
            }}
          >
            <Text
              blockId={block.id}
              path={`items.${i}.value`}
              value={item.value}
              token={i === 0 ? "h2" : "h3"}
              color={readableOn(accent, t.palette)}
              align="center"
            />
            <Text
              blockId={block.id}
              path={`items.${i}.label`}
              value={item.label}
              token="micro"
              color={withAlpha(readableOn(accent, t.palette), 0.85)}
              align="center"
              style={{ maxWidth: d * 0.8 }}
            />
          </div>
        );
      })}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────

export const VennBlockView: React.FC<{ block: VennBlock }> = ({ block }) => {
  const t = useTokens();
  const SIZE = 250;
  const r = 78;

  // Three overlapping circles: top, bottom-left, bottom-right.
  const positions = [
    { cx: SIZE / 2, cy: 84 },
    { cx: SIZE / 2 - 56, cy: 168 },
    { cx: SIZE / 2 + 56, cy: 168 },
  ];

  return (
    <div style={{ position: "relative", width: SIZE, height: 250, margin: "0 auto" }}>
      <svg viewBox={`0 0 ${SIZE} 250`} style={{ width: SIZE, height: 250 }}>
        {block.items.slice(0, 3).map((item, i) => (
          <circle
            key={item.id}
            cx={positions[i].cx}
            cy={positions[i].cy}
            r={r}
            fill={withAlpha(t.accent(i + 1), 0.4)}
          />
        ))}
      </svg>

      {block.items.slice(0, 3).map((item, i) => (
        <div
          key={item.id}
          style={{
            position: "absolute",
            left: positions[i].cx - 62,
            top: positions[i].cy - (i === 0 ? 46 : 8),
            width: 124,
            textAlign: "center",
          }}
        >
          <Text
            blockId={block.id}
            path={`items.${i}.label`}
            value={item.label}
            token="h3"
            align="center"
          />
          {item.body?.text && (
            <Text
              blockId={block.id}
              path={`items.${i}.body`}
              value={item.body}
              token="micro"
              color={t.palette.textMuted}
              align="center"
            />
          )}
        </div>
      ))}

      {block.centerLabel?.text && (
        <div
          style={{
            position: "absolute",
            left: SIZE / 2 - 44,
            top: 118,
            width: 88,
            height: 52,
            borderRadius: "50%",
            background: t.palette.text,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            blockId={block.id}
            path="centerLabel"
            value={block.centerLabel}
            token="micro"
            color={t.palette.bg}
            align="center"
          />
        </div>
      )}
    </div>
  );
};
