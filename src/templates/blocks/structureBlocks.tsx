"use client";

import React from "react";
import { Card, Icon, Text, useTokens } from "./primitives";
import { readableOn, withAlpha } from "../tokens";
import type {
  IconGridBlock,
  PillarsBlock,
  ProcessFlowBlock,
  RoadmapPhasesBlock,
  TimelineBlock,
} from "../types";

/** Solid accent-filled columns, as in "Our Strategic Pillars". */
export const PillarsBlockView: React.FC<{ block: PillarsBlock }> = ({ block }) => {
  const t = useTokens();

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${block.items.length || 1}, minmax(0, 1fr))`,
        gap: t.space(2),
        // Stretch to whatever height the slot gives us rather than sitting at
        // a fixed 150px and leaving a gap under the row.
        height: "100%",
        alignItems: "stretch",
      }}
    >
      {block.items.map((item, i) => {
        const accent = t.accent(i + 1);
        const fg = readableOn(accent, t.palette);
        return (
          <div
            key={item.id}
            style={{
              background: accent,
              borderRadius: t.radius,
              padding: t.space(4),
              display: "flex",
              flexDirection: "column",
              gap: t.space(3),
              minHeight: 150,
              justifyContent: "flex-start",
              boxSizing: "border-box",
            }}
          >
            {item.icon && (
              <Icon name={item.icon} accent={withAlpha(fg, 0.2)} size={30} variant="softSquare" />
            )}
            <Text
              blockId={block.id}
              path={`items.${i}.title`}
              value={item.title}
              token="h3"
              color={fg}
            />
            {item.body?.text && (
              <Text
                blockId={block.id}
                path={`items.${i}.body`}
                value={item.body}
                token="small"
                color={withAlpha(fg, 0.85)}
                clamp={4}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

/** Numbered or icon steps with connecting arrows, plus an optional loop label. */
export const ProcessFlowBlockView: React.FC<{ block: ProcessFlowBlock }> = ({ block }) => {
  const t = useTokens();
  const numbered = block.numbered ?? false;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: t.space(4), width: "100%" }}>
      <div style={{ display: "flex", alignItems: "stretch", gap: t.space(2) }}>
        {block.items.map((item, i) => {
          const accent = t.accent(i + 1);
          return (
            <React.Fragment key={item.id}>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: t.space(2),
                  textAlign: "center",
                  minWidth: 0,
                }}
              >
                {numbered ? (
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: "50%",
                      background: accent,
                      color: readableOn(accent, t.palette),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      ...t.type("h3"),
                      flexShrink: 0,
                    }}
                  >
                    {i + 1}
                  </div>
                ) : (
                  <Icon name={item.icon} accent={accent} size={36} />
                )}

                <Text
                  blockId={block.id}
                  path={`items.${i}.title`}
                  value={item.title}
                  token="h3"
                  align="center"
                />
                {item.body?.text && (
                  <Text
                    blockId={block.id}
                    path={`items.${i}.body`}
                    value={item.body}
                    token="small"
                    color={t.palette.textMuted}
                    align="center"
                    clamp={3}
                  />
                )}
              </div>

              {i < block.items.length - 1 && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    paddingTop: 12,
                    color: t.palette.textMuted,
                    flexShrink: 0,
                  }}
                  aria-hidden
                >
                  <Icon name="arrowRight" accent={t.palette.textMuted} size={18} variant="plainGlyph" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {block.loopLabel?.text && (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: t.space(2) }}>
          <div style={{ height: 1, flex: 1, background: t.palette.border }} />
          <Text
            blockId={block.id}
            path="loopLabel"
            value={block.loopLabel}
            token="micro"
            color={t.palette.accent}
            uppercase={t.theme.uppercaseKickers}
          />
          <div style={{ height: 1, flex: 1, background: t.palette.border }} />
        </div>
      )}
    </div>
  );
};

export const TimelineBlockView: React.FC<{ block: TimelineBlock }> = ({ block }) => {
  const t = useTokens();
  const vertical = block.orientation === "vertical";

  if (vertical) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: t.space(4) }}>
        {block.items.map((item, i) => {
          const accent = t.accent(i + 1);
          const last = i === block.items.length - 1;
          return (
            <div key={item.id} style={{ display: "flex", gap: t.space(4) }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Icon name={item.icon} accent={accent} size={30} />
                {!last && <div style={{ width: 2, flex: 1, background: t.palette.border, marginTop: 4 }} />}
              </div>
              <div style={{ paddingBottom: last ? 0 : t.space(2), minWidth: 0 }}>
                <Text
                  blockId={block.id}
                  path={`items.${i}.date`}
                  value={item.date}
                  token="micro"
                  color={accent}
                />
                <Text blockId={block.id} path={`items.${i}.title`} value={item.title} token="h3" />
                {item.body?.text && (
                  <Text
                    blockId={block.id}
                    path={`items.${i}.body`}
                    value={item.body}
                    token="small"
                    color={t.palette.textMuted}
                    clamp={2}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div style={{ position: "relative", width: "100%", paddingTop: t.space(4) }}>
      {/* Rail sits behind the nodes, inset by half a column so it starts/ends on a node. */}
      <div
        style={{
          position: "absolute",
          top: t.space(4) + 15,
          left: `${100 / (block.items.length * 2)}%`,
          right: `${100 / (block.items.length * 2)}%`,
          height: 2,
          background: t.palette.border,
        }}
        aria-hidden
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${block.items.length || 1}, minmax(0, 1fr))`,
          position: "relative",
        }}
      >
        {block.items.map((item, i) => {
          const accent = t.accent(i + 1);
          return (
            <div
              key={item.id}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: t.space(2),
                textAlign: "center",
                padding: `0 ${t.space(1)}px`,
                minWidth: 0,
              }}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  background: accent,
                  border: `3px solid ${t.palette.bg}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Icon name={item.icon} accent={accent} size={18} variant="none" />
              </div>
              <Text
                blockId={block.id}
                path={`items.${i}.date`}
                value={item.date}
                token="h3"
                color={accent}
                align="center"
              />
              <Text
                blockId={block.id}
                path={`items.${i}.title`}
                value={item.title}
                token="small"
                align="center"
                clamp={2}
              />
              {item.body?.text && (
                <Text
                  blockId={block.id}
                  path={`items.${i}.body`}
                  value={item.body}
                  token="micro"
                  color={t.palette.textMuted}
                  align="center"
                  clamp={2}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/** Now / Next / Future rows, each with its own checklist. */
export const RoadmapPhasesBlockView: React.FC<{ block: RoadmapPhasesBlock }> = ({ block }) => {
  const t = useTokens();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: t.space(3) }}>
      {block.items.map((item, i) => {
        const accent = t.accent(i + 1);
        return (
          <Card key={item.id} accent={accent} style={{ padding: t.space(4) }}>
            <div style={{ display: "flex", gap: t.space(5), alignItems: "flex-start" }}>
              <div style={{ display: "flex", gap: t.space(3), alignItems: "center", width: 150, flexShrink: 0 }}>
                <Icon name={item.icon} accent={accent} size={32} />
                <div>
                  <Text blockId={block.id} path={`items.${i}.phase`} value={item.phase} token="h3" />
                  <Text
                    blockId={block.id}
                    path={`items.${i}.period`}
                    value={item.period}
                    token="small"
                    color={t.palette.textMuted}
                  />
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 5, flex: 1, minWidth: 0 }}>
                {item.points.map((p, pi) => (
                  <div key={p.id} style={{ display: "flex", gap: t.space(2), alignItems: "center" }}>
                    <Icon name="check" accent={accent} size={15} variant="plainGlyph" />
                    <Text
                      blockId={block.id}
                      path={`items.${i}.points.${pi}.label`}
                      value={p.label}
                      token="small"
                    />
                  </div>
                ))}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export const IconGridBlockView: React.FC<{ block: IconGridBlock }> = ({ block }) => {
  const t = useTokens();
  const columns = block.style?.columns ?? Math.min(block.items.length, 3);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gap: t.space(3),
        height: "100%",
        alignItems: "stretch",
      }}
    >
      {block.items.map((item, i) => {
        const accent = t.accent(i + 1);
        return (
          <Card key={item.id} accent={accent} style={{ padding: t.space(4) }}>
            {/* Centred because the grid stretches these cards to fill the
                slot; top-aligned content leaves a visible hole underneath. */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: t.space(2),
                height: "100%",
                justifyContent: "center",
              }}
            >
              <Icon name={item.icon} accent={accent} size={34} />
              <Text blockId={block.id} path={`items.${i}.title`} value={item.title} token="h3" />
              {item.body?.text && (
                <Text
                  blockId={block.id}
                  path={`items.${i}.body`}
                  value={item.body}
                  token="small"
                  color={t.palette.textMuted}
                  clamp={3}
                />
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
};
