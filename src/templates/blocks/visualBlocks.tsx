"use client";

import React from "react";
import { Card, Icon, Text, useBlockEdit, useTokens } from "./primitives";
import { ImageEditAffordance } from "./inlineEdit";
import { readableOn, withAlpha } from "../tokens";
import { ImagePlaceholder } from "./mediaBlocks";
import type {
  BigStatBlock,
  CalloutBandBlock,
  MetricRowBlock,
  NumberedListBlock,
  SpotlightBlock,
} from "../types";

/**
 * Blocks that exist for visual range rather than new information.
 *
 * The earlier library could only say things one way — an icon beside a line
 * of text, in a card. These give a slide scale contrast, colour blocking,
 * depth and oversized numerals, which is most of what separates a designed
 * deck from a tidy one.
 */

// ─────────────────────────────────────────────────────────────────────────────

/** One number at display size, optionally echoed huge and faint behind it. */
export const BigStatBlockView: React.FC<{ block: BigStatBlock }> = ({ block }) => {
  const t = useTokens();
  const accent = t.accent(1 + (block.style?.accentIndex ?? 0));

  return (
    <div
      style={{
        position: "relative",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        // Clip the ghost at the block edge. Without this it runs past the
        // slide margin and the watermark reads as a rendering fault rather
        // than a deliberate oversized numeral.
        overflow: "hidden",
      }}
    >
      {block.ghost !== false && (
        <div
          aria-hidden
          style={{
            position: "absolute",
            right: -8,
            top: "50%",
            transform: "translateY(-50%)",
            fontFamily: t.theme.fonts.numeric ?? t.theme.fonts.display,
            fontSize: 150,
            fontWeight: 800,
            lineHeight: 1,
            color: withAlpha(accent, t.theme.mode === "dark" ? 0.1 : 0.07),
            pointerEvents: "none",
            userSelect: "none",
            whiteSpace: "nowrap",
          }}
        >
          {block.value.text}
        </div>
      )}

      <div style={{ position: "relative", display: "flex", alignItems: "baseline", gap: t.space(2) }}>
        <Text
          blockId={block.id}
          path="value"
          value={block.value}
          token="display"
          color={accent}
          style={{ fontFamily: t.theme.fonts.numeric ?? t.theme.fonts.display, lineHeight: 1 }}
        />
        {block.unit?.text && (
          <Text blockId={block.id} path="unit" value={block.unit} token="h2" color={accent} />
        )}
      </div>

      <div style={{ position: "relative", marginTop: t.space(2) }}>
        <Text blockId={block.id} path="label" value={block.label} token="h3" />
        {block.body?.text && (
          <Text
            blockId={block.id}
            path="body"
            value={block.body}
            token="body"
            color={t.palette.textMuted}
            style={{ marginTop: 4, maxWidth: 420 }}
          />
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────

/** Full-width accent band — the colour-blocking the deck was missing. */
export const CalloutBandBlockView: React.FC<{ block: CalloutBandBlock }> = ({ block }) => {
  const t = useTokens();
  const accent = t.accent(1 + (block.style?.accentIndex ?? 0));
  const solid = block.solid ?? false;
  const fg = solid ? readableOn(accent, t.palette) : t.palette.text;

  return (
    <div
      style={{
        position: "relative",
        background: solid ? accent : withAlpha(accent, t.theme.mode === "dark" ? 0.18 : 0.09),
        borderLeft: solid ? undefined : `4px solid ${accent}`,
        borderRadius: t.radius,
        padding: `${t.space(4)}px ${t.space(5)}px`,
        display: "flex",
        gap: t.space(4),
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {block.icon && (
        <Icon
          name={block.icon}
          accent={solid ? withAlpha(fg, 0.22) : accent}
          size={38}
          variant={solid ? "softSquare" : undefined}
          editBlockId={block.id}
          editPath="icon"
        />
      )}
      <div style={{ minWidth: 0 }}>
        <Text blockId={block.id} path="statement" value={block.statement} token="h2" color={fg} />
        {block.detail?.text && (
          <Text
            blockId={block.id}
            path="detail"
            value={block.detail}
            token="body"
            color={solid ? withAlpha(fg, 0.85) : t.palette.textMuted}
            style={{ marginTop: 4 }}
          />
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────

/** Image with a card overlapping it, so the slide has a foreground. */
export const SpotlightBlockView: React.FC<{ block: SpotlightBlock }> = ({ block }) => {
  const t = useTokens();
  const accent = t.accent(1);
  const { onValueChange } = useBlockEdit();
  const toggleDuotone = () => onValueChange?.(block.id, "duotone", !block.duotone);

  return (
    <div style={{ position: "relative", height: "100%", minHeight: 220 }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          right: 40,
          bottom: 34,
          borderRadius: t.radius,
          overflow: "hidden",
          background: t.palette.surfaceAlt,
        }}
      >
        {block.url ? (
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${block.url})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              // Duotone: desaturate the photograph, then wash it in the
              // theme accent so stock imagery stops fighting the palette.
              filter: block.duotone ? "grayscale(1) contrast(1.08)" : undefined,
            }}
          />
        ) : (
          <ImagePlaceholder prompt={block.prompt} showHint={false} />
        )}

        {block.duotone && block.url && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(135deg, ${withAlpha(accent, 0.62)}, ${withAlpha(t.accent(2), 0.45)})`,
              mixBlendMode: "multiply",
            }}
          />
        )}

        <ImageEditAffordance
          blockId={block.id}
          urlPath="url"
          promptPath="prompt"
          url={block.url}
          prompt={block.prompt}
          extra={[
            {
              label: block.duotone ? "Duotone: on" : "Duotone: off",
              onClick: () => toggleDuotone(),
            },
          ]}
        />
      </div>

      {/* Overlapping card, anchored bottom-right */}
      {(block.cardTitle?.text || block.stat) && (
        <div
          style={{
            position: "absolute",
            right: 0,
            bottom: 0,
            width: 260,
            ...t.card("elevated"),
            padding: t.space(4),
            display: "flex",
            flexDirection: "column",
            gap: t.space(2),
          }}
        >
          {block.stat && (
            <div>
              <Text
                blockId={block.id}
                path="stat.value"
                value={block.stat.value}
                token="stat"
                color={accent}
                style={{ fontFamily: t.theme.fonts.numeric ?? t.theme.fonts.display }}
              />
              <Text
                blockId={block.id}
                path="stat.label"
                value={block.stat.label}
                token="micro"
                color={t.palette.textMuted}
              />
            </div>
          )}
          {block.cardTitle?.text && (
            <Text blockId={block.id} path="cardTitle" value={block.cardTitle} token="h3" />
          )}
          {block.cardBody?.text && (
            <Text
              blockId={block.id}
              path="cardBody"
              value={block.cardBody}
              token="small"
              color={t.palette.textMuted}
              clamp={4}
            />
          )}
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────

/** Oversized index numerals — editorial weight without more chrome. */
export const NumberedListBlockView: React.FC<{ block: NumberedListBlock }> = ({ block }) => {
  const t = useTokens();
  const columns = block.style?.columns ?? 1;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gap: `${t.space(4)}px ${t.space(6)}px`,
        alignContent: "start",
      }}
    >
      {block.items.map((item, i) => {
        const accent = t.accent(i + 1);
        return (
          <div key={item.id} style={{ display: "flex", gap: t.space(4), alignItems: "flex-start" }}>
            <span
              style={{
                fontFamily: t.theme.fonts.numeric ?? t.theme.fonts.display,
                fontSize: 46,
                lineHeight: 0.9,
                fontWeight: 800,
                color: withAlpha(accent, 0.3),
                flexShrink: 0,
                minWidth: 48,
              }}
              aria-hidden
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <div style={{ minWidth: 0, paddingTop: 4 }}>
              <Text blockId={block.id} path={`items.${i}.title`} value={item.title} token="h3" />
              {item.body?.text && (
                <Text
                  blockId={block.id}
                  path={`items.${i}.body`}
                  value={item.body}
                  token="body"
                  color={t.palette.textMuted}
                  style={{ marginTop: 3 }}
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────

/** Inline figures separated by rules, for a strip across the slide. */
export const MetricRowBlockView: React.FC<{ block: MetricRowBlock }> = ({ block }) => {
  const t = useTokens();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "stretch",
        borderTop: `1px solid ${t.palette.border}`,
        borderBottom: `1px solid ${t.palette.border}`,
        padding: `${t.space(4)}px 0`,
      }}
    >
      {block.items.map((item, i) => (
        <div
          key={item.id}
          style={{
            flex: 1,
            paddingLeft: i === 0 ? 0 : t.space(5),
            paddingRight: t.space(3),
            borderLeft: i === 0 ? "none" : `1px solid ${t.palette.border}`,
            minWidth: 0,
          }}
        >
          <Text
            blockId={block.id}
            path={`items.${i}.value`}
            value={item.value}
            token="h1"
            color={t.accent(i + 1)}
            style={{ fontFamily: t.theme.fonts.numeric ?? t.theme.fonts.display }}
          />
          <Text
            blockId={block.id}
            path={`items.${i}.label`}
            value={item.label}
            token="small"
            color={t.palette.textMuted}
            clamp={2}
            style={{ marginTop: 2 }}
          />
        </div>
      ))}
    </div>
  );
};
