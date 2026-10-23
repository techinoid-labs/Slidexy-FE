"use client";

import React from "react";
import { Card, Icon, Text, useBlockEdit, useTokens } from "./primitives";
import { ImageEditAffordance } from "./inlineEdit";
import { readableOn, withAlpha, RADII } from "../tokens";
import type {
  ContactFooterBlock,
  CtaButtonBlock,
  DeviceMockupBlock,
  ImageBlock,
  ImageGridBlock,
  LogoWallBlock,
  TeamCardsBlock,
} from "../types";

/**
 * Placeholder shown wherever a template declares an image slot that the image
 * pipeline has not filled yet. It is a deliberate, on-theme gradient rather
 * than a grey box, so an un-generated deck still looks composed.
 */
export const ImagePlaceholder: React.FC<{
  prompt?: string;
  radius?: number;
  showHint?: boolean;
}> = ({ prompt, radius, showHint = true }) => {
  const t = useTokens();
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: radius,
        background: `linear-gradient(135deg, ${withAlpha(t.palette.accent, 0.35)} 0%, ${withAlpha(
          t.palette.accent2,
          0.28
        )} 50%, ${withAlpha(t.palette.accent3, 0.22)} 100%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      {showHint && prompt && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: withAlpha(t.palette.bg, 0.55),
            borderRadius: 999,
            padding: "6px 12px",
            maxWidth: "88%",
          }}
        >
          <Icon name="camera" accent={t.palette.textMuted} size={16} variant="plainGlyph" />
          <span
            style={{
              ...t.type("micro"),
              color: t.palette.textMuted,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              textTransform: "none",
            }}
          >
            {prompt}
          </span>
        </div>
      )}
    </div>
  );
};

export const ImageBlockView: React.FC<{ block: ImageBlock }> = ({ block }) => {
  const t = useTokens();
  // A pill radius on a card is a style choice; on a photograph it is a
  // circle, and a grid of three circles reads as a fault rather than a
  // decision. Images cap at the large step.
  const radius = Math.min(t.radius, RADII.lg);
  const { onValueChange } = useBlockEdit();
  const setFit = (v: "cover" | "contain") => onValueChange?.(block.id, "fit", v);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: t.space(2), height: "100%" }}>
      <div
        style={{
          position: "relative",
          flex: 1,
          minHeight: 120,
          borderRadius: radius,
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
              backgroundSize: block.fit ?? "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />
        ) : (
          <ImagePlaceholder prompt={block.prompt} radius={radius} />
        )}

        <ImageEditAffordance
          blockId={block.id}
          urlPath="url"
          promptPath="prompt"
          url={block.url}
          prompt={block.prompt}
          extra={[
            { label: "Fit: cover", onClick: () => setFit("cover") },
            { label: "Fit: contain", onClick: () => setFit("contain") },
          ]}
        />

        {!!block.scrim && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(90deg, ${withAlpha("#000000", block.scrim)} 0%, ${withAlpha(
                "#000000",
                block.scrim * 0.35
              )} 100%)`,
            }}
          />
        )}
      </div>

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

export const ImageGridBlockView: React.FC<{ block: ImageGridBlock }> = ({ block }) => {
  const t = useTokens();
  const columns = block.style?.columns ?? 2;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gap: t.space(3),
      }}
    >
      {block.items.map((item, i) => {
        const accent = t.accent(i + 1);
        return (
          <Card
            key={item.id}
            accent={accent}
            // A pill radius on a card is a style choice; on a card that is
            // mostly photograph it turns the picture into a circle, and a
            // row of three circles reads as a fault rather than a decision.
            style={{ overflow: "hidden", borderRadius: Math.min(t.radius, RADII.lg) }}
          >
            <div style={{ position: "relative", height: 74 }}>
              {item.url ? (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: `url(${item.url})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
              ) : (
                <ImagePlaceholder prompt={item.prompt} showHint={false} />
              )}
            </div>
            <div style={{ padding: t.space(3), display: "flex", gap: t.space(3), alignItems: "flex-start" }}>
              {item.icon && (
                <Icon
                  name={item.icon}
                  accent={accent}
                  size={28}
                  editBlockId={block.id}
                  editPath={`items.${i}.icon`}
                />
              )}
              <div style={{ minWidth: 0 }}>
                {item.title && (
                  <Text
                    blockId={block.id}
                    path={`items.${i}.title`}
                    value={item.title}
                    token="h3"
                  />
                )}
                {item.body && (
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
          </Card>
        );
      })}
    </div>
  );
};

/** CSS-drawn device frames — no external asset to load or fail. */
export const DeviceMockupBlockView: React.FC<{ block: DeviceMockupBlock }> = ({ block }) => {
  const t = useTokens();
  const bezel = t.theme.mode === "dark" ? "#2a2a33" : "#1f2937";

  const screen = (radius: number) => (
    <div style={{ position: "relative", inset: 0, width: "100%", height: "100%", borderRadius: radius, overflow: "hidden" }}>
      {block.url ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${block.url})`,
            backgroundSize: "cover",
            backgroundPosition: "top center",
          }}
        />
      ) : (
        <ImagePlaceholder prompt={block.prompt} showHint={false} />
      )}
    </div>
  );

  if (block.device === "phone") {
    return (
      <div style={{ display: "flex", justifyContent: "center", height: "100%", alignItems: "center" }}>
        <div
          style={{
            width: 150,
            height: 300,
            borderRadius: 26,
            background: bezel,
            padding: 7,
            boxSizing: "border-box",
            boxShadow: `0 18px 40px ${withAlpha("#000", 0.28)}`,
          }}
        >
          <div style={{ position: "relative", width: "100%", height: "100%" }}>{screen(20)}</div>
        </div>
      </div>
    );
  }

  if (block.device === "laptop") {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}>
        <div
          style={{
            width: 320,
            height: 200,
            borderRadius: 10,
            background: bezel,
            padding: 8,
            boxSizing: "border-box",
            boxShadow: `0 16px 36px ${withAlpha("#000", 0.24)}`,
          }}
        >
          <div style={{ position: "relative", width: "100%", height: "100%" }}>{screen(5)}</div>
        </div>
        {/* Base */}
        <div style={{ width: 372, height: 9, borderRadius: "0 0 8px 8px", background: bezel, opacity: 0.9 }} />
      </div>
    );
  }

  // browser / tablet
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
      <div
        style={{
          width: 340,
          borderRadius: t.radius,
          overflow: "hidden",
          border: `1px solid ${t.palette.border}`,
          boxShadow: `0 14px 32px ${withAlpha("#000", 0.16)}`,
          background: t.palette.surface,
        }}
      >
        <div
          style={{
            height: 22,
            background: t.palette.surfaceAlt,
            display: "flex",
            alignItems: "center",
            gap: 5,
            paddingLeft: 9,
          }}
        >
          {["#ef4444", "#f59e0b", "#22c55e"].map((c) => (
            <span key={c} style={{ width: 7, height: 7, borderRadius: "50%", background: c }} />
          ))}
        </div>
        <div style={{ position: "relative", height: 190 }}>{screen(0)}</div>
      </div>
    </div>
  );
};

export const TeamCardsBlockView: React.FC<{ block: TeamCardsBlock }> = ({ block }) => {
  const t = useTokens();
  const columns = block.style?.columns ?? Math.min(block.items.length, 3);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gap: t.space(3),
      }}
    >
      {block.items.map((item, i) => {
        const accent = t.accent(i + 1);
        return (
          <Card
            key={item.id}
            accent={accent}
            // A pill radius on a card is a style choice; on a card that is
            // mostly photograph it turns the picture into a circle, and a
            // row of three circles reads as a fault rather than a decision.
            style={{ overflow: "hidden", borderRadius: Math.min(t.radius, RADII.lg) }}
          >
            <div style={{ position: "relative", height: 96 }}>
              {item.photoUrl ? (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: `url(${item.photoUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "top center",
                  }}
                />
              ) : (
                <ImagePlaceholder prompt={item.photoPrompt} showHint={false} />
              )}
            </div>

            <div style={{ padding: t.space(3), display: "flex", flexDirection: "column", gap: 2 }}>
              <Text blockId={block.id} path={`items.${i}.name`} value={item.name} token="h3" />
              <Text
                blockId={block.id}
                path={`items.${i}.role`}
                value={item.role}
                token="micro"
                color={accent}
              />
              {item.bio?.text && (
                <Text
                  blockId={block.id}
                  path={`items.${i}.bio`}
                  value={item.bio}
                  token="small"
                  color={t.palette.textMuted}
                  clamp={3}
                  style={{ marginTop: 4 }}
                />
              )}
              {item.showSocial !== false && (
                <div style={{ marginTop: 6 }}>
                  <Icon name="link" accent={accent} size={20} variant="softSquare" />
                </div>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export const LogoWallBlockView: React.FC<{ block: LogoWallBlock }> = ({ block }) => {
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
      {block.items.map((item, i) => (
        <div
          key={item.id}
          style={{
            height: 54,
            borderRadius: t.radiusSm,
            border: `1px solid ${t.palette.border}`,
            background: t.palette.surface,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: `0 ${t.space(2)}px`,
            boxSizing: "border-box",
          }}
        >
          {item.logoUrl ? (
            <img
              src={item.logoUrl}
              alt={item.name.text}
              style={{ maxHeight: 26, maxWidth: "100%", objectFit: "contain" }}
            />
          ) : (
            <Text
              blockId={block.id}
              path={`items.${i}.name`}
              value={item.name}
              token="h3"
              color={t.palette.textMuted}
              align="center"
            />
          )}
        </div>
      ))}
    </div>
  );
};

export const ContactFooterBlockView: React.FC<{ block: ContactFooterBlock }> = ({ block }) => {
  const t = useTokens();
  return (
    <div style={{ display: "flex", gap: t.space(6), flexWrap: "wrap", alignItems: "center" }}>
      {block.items.map((item, i) => (
        <div key={item.id} style={{ display: "flex", gap: t.space(2), alignItems: "center" }}>
          {/* No icon means no icon. A page number in the corner was getting
              a fallback glyph next to it, which reads as a broken asset. */}
          {item.icon && (
            <Icon name={item.icon} accent={t.palette.textMuted} size={18} variant="plainGlyph" />
          )}
          <Text
            blockId={block.id}
            path={`items.${i}.label`}
            value={item.label}
            token="small"
            color={t.palette.textMuted}
          />
        </div>
      ))}
    </div>
  );
};

export const CtaButtonBlockView: React.FC<{ block: CtaButtonBlock }> = ({ block }) => {
  const t = useTokens();
  const accent = t.palette.accent;
  const align = block.style?.align ?? "left";

  return (
    <div style={{ display: "flex", justifyContent: align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start" }}>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: t.space(2),
          background: accent,
          borderRadius: t.theme.radius === "none" ? 0 : 999,
          padding: `${t.space(3)}px ${t.space(5)}px`,
        }}
      >
        <Text
          blockId={block.id}
          path="label"
          value={block.label}
          token="h3"
          color={readableOn(accent, t.palette)}
        />
        <Icon name="arrowRight" accent={readableOn(accent, t.palette)} size={18} variant="plainGlyph" />
      </div>
    </div>
  );
};
