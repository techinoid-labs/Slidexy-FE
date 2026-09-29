"use client";

import React from "react";
import { Card, Icon, SectionHeading, Text, useBlockEdit, useTokens } from "./primitives";
import { withAlpha } from "../tokens";
import type {
  ChecklistBlock,
  HeadingBlock,
  IconBulletsBlock,
  ParagraphBlock,
  QuoteBlock,
} from "../types";

export const HeadingBlockView: React.FC<{ block: HeadingBlock; slideNumber?: number }> = ({
  block,
  slideNumber,
}) => {
  const { slideLayout } = useBlockEdit();
  const isCover = slideLayout === "cover" || slideLayout === "closing";
  return (
    <SectionHeading
      blockId={block.id}
      kicker={block.kicker}
      title={block.title}
      subtitle={block.subtitle}
      slideNumber={slideNumber}
      variant={isCover ? "cover" : "section"}
      align={block.style?.align === "center" ? "center" : "left"}
    />
  );
};

export const ParagraphBlockView: React.FC<{ block: ParagraphBlock }> = ({ block }) => {
  const t = useTokens();
  return (
    <Text
      blockId={block.id}
      path="body"
      value={block.body}
      token="bodyLg"
      tag="p"
      color={t.palette.textMuted}
      align={block.style?.align ?? "left"}
    />
  );
};

/**
 * The workhorse block: icon + bold label + supporting line.
 * Renders as rows (1 column) or a grid, and drops the card chrome when the
 * block is marked compact.
 */
export const IconBulletsBlockView: React.FC<{ block: IconBulletsBlock }> = ({ block }) => {
  const t = useTokens();
  const columns = block.style?.columns ?? 1;
  const compact = block.style?.compact ?? false;
  const accentOffset = block.style?.accentIndex ?? 0;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gap: t.space(compact ? 3 : 4),
        alignContent: "start",
      }}
    >
      {block.items.map((item, i) => {
        const accent = t.accent(i + 1 + accentOffset);
        const body = (
          <div style={{ display: "flex", gap: t.space(4), alignItems: "flex-start" }}>
            <Icon name={item.icon} accent={accent} size={compact ? 28 : 34} />
            <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
              <Text
                blockId={block.id}
                path={`items.${i}.label`}
                value={item.label}
                token="h3"
              />
              {item.body?.text && (
                <Text
                  blockId={block.id}
                  path={`items.${i}.body`}
                  value={item.body}
                  token="body"
                  color={t.palette.textMuted}
                  clamp={3}
                />
              )}
            </div>
          </div>
        );

        if (compact) return <div key={item.id}>{body}</div>;

        return (
          <Card
            key={item.id}
            accent={accent}
            style={{ padding: t.space(4) }}
          >
            {body}
          </Card>
        );
      })}
    </div>
  );
};

export const ChecklistBlockView: React.FC<{ block: ChecklistBlock }> = ({ block }) => {
  const t = useTokens();
  const columns = block.style?.columns ?? 1;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gap: t.space(3),
        alignContent: "start",
      }}
    >
      {block.items.map((item, i) => (
        <div
          key={item.id}
          style={{ display: "flex", gap: t.space(3), alignItems: "center" }}
        >
          <Icon name="checkCircle" accent={t.accent(i + 1)} size={22} variant="plainGlyph" />
          <Text
            blockId={block.id}
            path={`items.${i}.label`}
            value={item.label}
            token="body"
          />
        </div>
      ))}
    </div>
  );
};

export const QuoteBlockView: React.FC<{ block: QuoteBlock }> = ({ block }) => {
  const t = useTokens();
  const accent = t.accent(1);

  return (
    <Card style={{ padding: t.space(6), position: "relative", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          top: t.space(3),
          right: t.space(4),
          opacity: 0.16,
          color: accent,
        }}
        aria-hidden
      >
        <Icon name="quote" accent={accent} size={44} variant="plainGlyph" />
      </div>

      <div style={{ display: "flex", gap: t.space(5), alignItems: "center" }}>
        {(block.avatarUrl || block.avatarPrompt) && (
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              flexShrink: 0,
              overflow: "hidden",
              background: block.avatarUrl
                ? `url(${block.avatarUrl}) center/cover`
                : `linear-gradient(140deg, ${withAlpha(accent, 0.35)}, ${withAlpha(
                    t.accent(2),
                    0.35
                  )})`,
              border: `2px solid ${t.palette.surface}`,
              boxShadow: `0 0 0 2px ${withAlpha(accent, 0.25)}`,
            }}
          />
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: t.space(3), minWidth: 0 }}>
          <Text
            blockId={block.id}
            path="quote"
            value={block.quote}
            token="bodyLg"
            tag="blockquote"
            style={{ fontStyle: "italic" }}
            clamp={4}
          />
          <div>
            {block.author?.text && (
              <Text blockId={block.id} path="author" value={block.author} token="h3" />
            )}
            {block.role?.text && (
              <Text
                blockId={block.id}
                path="role"
                value={block.role}
                token="small"
                color={t.palette.textMuted}
              />
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
