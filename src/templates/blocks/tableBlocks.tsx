"use client";

import React from "react";
import { Icon, Text, useTokens } from "./primitives";
import { readableOn, withAlpha } from "../tokens";
import type { ComparisonTableBlock, PricingTableBlock } from "../types";

const MarkCell: React.FC<{ kind: "yes" | "no" | "partial" }> = ({ kind }) => {
  const t = useTokens();
  const map = {
    yes: { icon: "checkCircle", color: t.palette.positive },
    no: { icon: "close", color: t.palette.negative },
    partial: { icon: "minus", color: t.palette.warning },
  } as const;
  const { icon, color } = map[kind];
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Icon name={icon} accent={color} size={19} variant="plainGlyph" />
    </div>
  );
};

export const ComparisonTableBlockView: React.FC<{ block: ComparisonTableBlock }> = ({ block }) => {
  const t = useTokens();
  const cols = block.columns.length;

  return (
    <div
      style={{
        border: `1px solid ${t.palette.border}`,
        borderRadius: t.radius,
        overflow: "hidden",
        width: "100%",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `1.5fr repeat(${cols}, minmax(0, 1fr))`,
          background: t.palette.surfaceAlt,
          borderBottom: `1px solid ${t.palette.border}`,
        }}
      >
        <div style={{ padding: `${t.space(3)}px ${t.space(4)}px` }}>
          <span style={{ ...t.type("micro"), color: t.palette.textMuted }}>Feature</span>
        </div>
        {block.columns.map((c, ci) => (
          <div
            key={c.id}
            style={{
              padding: `${t.space(3)}px ${t.space(2)}px`,
              textAlign: "center",
              background: c.highlight ? withAlpha(t.palette.accent, 0.1) : undefined,
              borderLeft: `1px solid ${t.palette.border}`,
            }}
          >
            <Text
              blockId={block.id}
              path={`columns.${ci}.label`}
              value={c.label}
              token="micro"
              color={c.highlight ? t.palette.accent : t.palette.text}
              align="center"
            />
          </div>
        ))}
      </div>

      {/* Rows */}
      {block.rows.map((row, ri) => (
        <div
          key={row.id}
          style={{
            display: "grid",
            gridTemplateColumns: `1.5fr repeat(${cols}, minmax(0, 1fr))`,
            borderBottom: ri === block.rows.length - 1 ? "none" : `1px solid ${t.palette.border}`,
            background: ri % 2 === 1 ? withAlpha(t.palette.surfaceAlt, 0.55) : undefined,
          }}
        >
          <div style={{ padding: `${t.space(3)}px ${t.space(4)}px`, minWidth: 0 }}>
            <Text blockId={block.id} path={`rows.${ri}.label`} value={row.label} token="small" />
          </div>
          {row.cells.slice(0, cols).map((cell, ci) => (
            <div
              key={ci}
              style={{
                padding: `${t.space(3)}px ${t.space(2)}px`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderLeft: `1px solid ${t.palette.border}`,
                background: block.columns[ci]?.highlight
                  ? withAlpha(t.palette.accent, 0.06)
                  : undefined,
              }}
            >
              {cell === "yes" || cell === "no" || cell === "partial" ? (
                <MarkCell kind={cell} />
              ) : (
                <span style={{ ...t.type("small"), color: t.palette.text, textAlign: "center" }}>
                  {cell}
                </span>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export const PricingTableBlockView: React.FC<{ block: PricingTableBlock }> = ({ block }) => {
  const t = useTokens();

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${block.plans.length || 1}, minmax(0, 1fr))`,
        gap: t.space(3),
        alignItems: "stretch",
      }}
    >
      {block.plans.map((plan, pi) => {
        const accent = t.palette.accent;
        const highlighted = !!plan.highlight;
        return (
          <div
            key={plan.id}
            style={{
              position: "relative",
              borderRadius: t.radius,
              border: `${highlighted ? 2 : 1}px solid ${highlighted ? accent : t.palette.border}`,
              background: highlighted ? withAlpha(accent, 0.05) : t.palette.surface,
              padding: t.space(4),
              paddingTop: highlighted ? t.space(6) : t.space(4),
              display: "flex",
              flexDirection: "column",
              gap: t.space(3),
              boxSizing: "border-box",
            }}
          >
            {plan.badge?.text && (
              <div
                style={{
                  position: "absolute",
                  top: -10,
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: accent,
                  color: readableOn(accent, t.palette),
                  borderRadius: 999,
                  padding: "3px 10px",
                  whiteSpace: "nowrap",
                }}
              >
                <Text
                  blockId={block.id}
                  path={`plans.${pi}.badge`}
                  value={plan.badge}
                  token="micro"
                  color={readableOn(accent, t.palette)}
                />
              </div>
            )}

            <Text
              blockId={block.id}
              path={`plans.${pi}.name`}
              value={plan.name}
              token="h3"
              align="center"
            />

            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 3 }}>
              <Text
                blockId={block.id}
                path={`plans.${pi}.price`}
                value={plan.price}
                token="stat"
                color={highlighted ? accent : t.palette.text}
                align="center"
              />
              {plan.period?.text && (
                <Text
                  blockId={block.id}
                  path={`plans.${pi}.period`}
                  value={plan.period}
                  token="small"
                  color={t.palette.textMuted}
                />
              )}
            </div>

            <div style={{ height: 1, background: t.palette.border }} />

            <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
              {plan.features.map((f, fi) => (
                <div key={f.id} style={{ display: "flex", gap: t.space(2), alignItems: "center" }}>
                  <Icon name="check" accent={t.palette.positive} size={14} variant="plainGlyph" />
                  <Text
                    blockId={block.id}
                    path={`plans.${pi}.features.${fi}.label`}
                    value={f.label}
                    token="small"
                    color={t.palette.textMuted}
                  />
                </div>
              ))}
            </div>

            {plan.cta?.text && (
              <div
                style={{
                  borderRadius: t.theme.radius === "pill" ? 999 : t.radiusSm,
                  background: highlighted ? accent : "transparent",
                  border: `1px solid ${highlighted ? accent : t.palette.border}`,
                  padding: `${t.space(2)}px ${t.space(3)}px`,
                  textAlign: "center",
                }}
              >
                <Text
                  blockId={block.id}
                  path={`plans.${pi}.cta`}
                  value={plan.cta}
                  token="micro"
                  color={highlighted ? readableOn(accent, t.palette) : t.palette.text}
                  align="center"
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
