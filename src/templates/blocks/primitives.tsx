"use client";

import React, { createContext, useContext } from "react";
import { EditableElement } from "@/app/components/editor/EditableElement";
import type { ResolvedTokens } from "../tokens";
import { BACKGROUND_DECOR } from "../decor";
import { withAlpha } from "../tokens";
import type { CardStyle, RichText } from "../types";
import { ICONS, FallbackIcon } from "./icons";
import { IconEditAffordance } from "./inlineEdit";

// ─────────────────────────────────────────────────────────────────────────────
// Edit plumbing
// ─────────────────────────────────────────────────────────────────────────────

export interface BlockEditContextValue {
  isEditing: boolean;
  /** Commit a text edit. `path` addresses the field inside the block. */
  onTextChange: (blockId: string, path: string, value: string) => void;
  /**
   * Commit a NON-text value from the canvas — an icon name, an image url, a
   * card style. Text goes through onTextChange; everything else arrives
   * here, so a block can be edited in place rather than only from the side
   * panel.
   */
  onValueChange?: (blockId: string, path: string, value: unknown) => void;
  /** Tell the editor chrome which element is selected. */
  onSelect?: (elementId: string, kind: "text" | "image" | "shape") => void;
  slideIndex: number;
  /** Lets a block adapt to where it sits, e.g. headings on a cover. */
  slideLayout?: string;
}

export const BlockEditContext = createContext<BlockEditContextValue>({
  isEditing: false,
  onTextChange: () => {},
  slideIndex: 0,
});

export const useBlockEdit = () => useContext(BlockEditContext);

export const TokensContext = createContext<ResolvedTokens | null>(null);
export const useTokens = (): ResolvedTokens => {
  const t = useContext(TokensContext);
  if (!t) throw new Error("useTokens must be used inside a TokensContext provider");
  return t;
};

// ─────────────────────────────────────────────────────────────────────────────
// Text
// ─────────────────────────────────────────────────────────────────────────────

type TypeTokenName = Parameters<ResolvedTokens["type"]>[0];

interface TextProps {
  blockId: string;
  path: string;
  value: RichText | undefined;
  token: TypeTokenName;
  color?: string;
  align?: "left" | "center" | "right";
  tag?: "h1" | "h2" | "h3" | "p" | "div" | "span" | "blockquote";
  style?: React.CSSProperties;
  /** Clamp to N lines so long AI copy can't blow the slide out. */
  clamp?: number;
  uppercase?: boolean;
}

/**
 * Editable text inside a block.
 *
 * Wraps the shared EditableElement so blocks inherit the debounced-commit
 * behaviour rather than each re-implementing contentEditable.
 */
export const Text: React.FC<TextProps> = ({
  blockId,
  path,
  value,
  token,
  color,
  align = "left",
  tag = "div",
  style,
  clamp,
  uppercase,
}) => {
  const t = useTokens();
  const { isEditing, onTextChange, onSelect, slideIndex } = useBlockEdit();

  if (!value || (!value.text && !isEditing)) return null;

  const typeStyle = t.type(token);
  const elementId = `blk-${slideIndex}-${blockId}-${path}`;

  const clampStyle: React.CSSProperties = clamp
    ? {
        display: "-webkit-box",
        WebkitLineClamp: clamp,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
      }
    : {};

  return (
    <EditableElement
      id={elementId}
      text={value.text}
      isEditing={isEditing}
      tagName={tag}
      onChange={(next) => onTextChange(blockId, path, next)}
      onSelectElement={() => onSelect?.(elementId, "text")}
      style={{
        ...typeStyle,
        color: color ?? t.palette.text,
        textAlign: align,
        margin: 0,
        textTransform: uppercase ? "uppercase" : undefined,
        ...clampStyle,
        ...style,
      }}
    />
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Card
// ─────────────────────────────────────────────────────────────────────────────

export const Card: React.FC<
  React.PropsWithChildren<{
    override?: CardStyle;
    accent?: string;
    style?: React.CSSProperties;
  }>
> = ({ children, override, accent, style }) => {
  const t = useTokens();
  const base = t.card(override);

  // A tinted card takes its wash from the accent it was given, not the theme's.
  const tinted =
    (override ?? t.theme.cardStyle) === "tinted" && accent
      ? {
          background: withAlpha(accent, t.theme.mode === "dark" ? 0.16 : 0.08),
          border: `1px solid ${withAlpha(accent, 0.22)}`,
        }
      : {};

  return <div style={{ ...base, ...tinted, ...style }}>{children}</div>;
};

// ─────────────────────────────────────────────────────────────────────────────
// Icon
// ─────────────────────────────────────────────────────────────────────────────

export const Icon: React.FC<{
  name?: string;
  accent: string;
  size?: number;
  /** Overrides the theme's icon treatment. */
  variant?: "filledCircle" | "softSquare" | "outline" | "plainGlyph" | "none";
  /**
   * Where this icon's name lives on its block. Supplying it makes the icon
   * clickable on the slide, opening a picker — so icons are changed where
   * they are rather than only from the side panel.
   */
  editBlockId?: string;
  editPath?: string;
}> = ({ name, accent, size = 34, variant, editBlockId, editPath }) => {
  const t = useTokens();
  const style = variant ?? t.theme.iconStyle;
  if (style === "none") return null;

  const Glyph = (name && ICONS[name]) || FallbackIcon;
  const glyphSize = Math.round(size * 0.52);

  const shell: React.CSSProperties = {
    width: size,
    height: size,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    boxSizing: "border-box",
  };

  const rendered = (() => {
  switch (style) {
    case "filledCircle":
      return (
        <div style={{ ...shell, background: accent, borderRadius: "50%" }}>
          <Glyph size={glyphSize} color={t.palette.onAccent} />
        </div>
      );
    case "softSquare":
      return (
        <div
          style={{
            ...shell,
            background: withAlpha(accent, t.theme.mode === "dark" ? 0.22 : 0.12),
            borderRadius: Math.max(t.radiusSm, 8),
          }}
        >
          <Glyph size={glyphSize} color={accent} />
        </div>
      );
    case "outline":
      return (
        <div
          style={{
            ...shell,
            border: `1.5px solid ${withAlpha(accent, 0.5)}`,
            borderRadius: t.theme.radius === "none" ? 0 : "50%",
          }}
        >
          <Glyph size={glyphSize} color={accent} />
        </div>
      );
    case "plainGlyph":
    default:
      return (
        <div style={{ ...shell, width: glyphSize + 4, height: glyphSize + 4 }}>
          <Glyph size={glyphSize} color={accent} />
        </div>
      );
  }
  })();

  // Given a path, the icon becomes a click target on the slide that opens a
  // picker — so icons are changed where they are, not only from the panel.
  if (!editBlockId || !editPath) return rendered;
  return (
    <IconEditAffordance blockId={editBlockId} path={editPath} current={name}>
      {rendered}
    </IconEditAffordance>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Section heading
// ─────────────────────────────────────────────────────────────────────────────

export const SectionHeading: React.FC<{
  blockId: string;
  kicker?: RichText;
  title?: RichText;
  subtitle?: RichText;
  slideNumber?: number;
  align?: "left" | "center";
  /** Cover headings drop the numbering chip and use the display size. */
  variant?: "section" | "cover";
}> = ({ blockId, kicker, title, subtitle, slideNumber, align = "left", variant = "section" }) => {
  const t = useTokens();
  const isCover = variant === "cover";
  // On a cover the slide-number chip is noise, and the accent may not have
  // enough contrast against a photograph — so kickers use the ink colour.
  const style = isCover && t.theme.headingStyle === "numbered" ? "plain" : t.theme.headingStyle;
  const accent = isCover ? t.palette.text : t.palette.accent;

  const titleRow = (
    <div style={{ display: "flex", alignItems: "center", gap: t.space(4) }}>
      {style === "numbered" && typeof slideNumber === "number" && (
        <div
          style={{
            background: accent,
            color: t.palette.onAccent,
            borderRadius: t.radiusSm,
            padding: "3px 9px",
            ...t.type("micro"),
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          {String(slideNumber).padStart(2, "0")}
        </div>
      )}
      <Text
        blockId={blockId}
        path="title"
        value={title}
        token={isCover ? "display" : "h1"}
        tag={isCover ? "h1" : "h2"}
        align={align}
      />
    </div>
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: t.space(2),
        alignItems: align === "center" ? "center" : "flex-start",
        borderLeft: style === "sideBar" ? `4px solid ${accent}` : undefined,
        paddingLeft: style === "sideBar" ? t.space(4) : undefined,
      }}
    >
      {style === "kickerRule" && (
        <div style={{ width: 40, height: 3, background: accent, borderRadius: 2 }} />
      )}

      {kicker?.text && (
        <Text
          blockId={blockId}
          path="kicker"
          value={kicker}
          token="micro"
          color={accent}
          align={align}
          uppercase={t.theme.uppercaseKickers}
        />
      )}

      {titleRow}

      {style === "underline" && (
        <div style={{ width: 64, height: 2, background: accent, marginTop: 2 }} />
      )}

      {subtitle?.text && (
        <Text
          blockId={blockId}
          path="subtitle"
          value={subtitle}
          token={isCover ? "h3" : "bodyLg"}
          color={t.palette.textMuted}
          align={align}
          clamp={2}
          style={isCover ? { fontWeight: 400, maxWidth: 520 } : undefined}
        />
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Background motifs
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Decorative slide background. Purely presentational and pointer-transparent,
 * so it never interferes with selecting a block.
 */
export const MotifLayer: React.FC = () => {
  const t = useTokens();
  const { motif, palette } = t.theme;
  if (motif === "none") return null;

  // Drawn SVG assets take precedence. They live in decor.tsx rather than
  // here because they are artwork, not layout primitives.
  const Drawn = (BACKGROUND_DECOR as Record<string, React.FC<any>>)[motif];
  if (Drawn) {
    return (
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }} aria-hidden>
        <Drawn palette={palette} dark={t.theme.mode === "dark"} />
      </div>
    );
  }

  const soft = withAlpha(palette.accent, t.theme.mode === "dark" ? 0.16 : 0.07);
  const soft2 = withAlpha(palette.accent2, t.theme.mode === "dark" ? 0.14 : 0.06);

  const base: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    overflow: "hidden",
  };

  switch (motif) {
    case "blob":
      return (
        <div style={base} aria-hidden>
          <div
            style={{
              position: "absolute",
              width: 420,
              height: 420,
              right: -140,
              top: -160,
              borderRadius: "50%",
              background: `radial-gradient(circle at 30% 30%, ${soft}, transparent 70%)`,
            }}
          />
          <div
            style={{
              position: "absolute",
              width: 320,
              height: 320,
              left: -120,
              bottom: -150,
              borderRadius: "50%",
              background: `radial-gradient(circle at 60% 40%, ${soft2}, transparent 70%)`,
            }}
          />
        </div>
      );
    case "arc":
      return (
        <div style={base} aria-hidden>
          <div
            style={{
              position: "absolute",
              width: 520,
              height: 520,
              right: -230,
              top: -210,
              borderRadius: "50%",
              border: `1.5px solid ${withAlpha(palette.accent, 0.14)}`,
            }}
          />
          <div
            style={{
              position: "absolute",
              width: 360,
              height: 360,
              right: -150,
              top: -130,
              borderRadius: "50%",
              background: soft,
            }}
          />
        </div>
      );
    case "grid":
      return (
        <div
          style={{
            ...base,
            backgroundImage: `linear-gradient(${withAlpha(palette.border, 0.8)} 1px, transparent 1px), linear-gradient(90deg, ${withAlpha(palette.border, 0.8)} 1px, transparent 1px)`,
            backgroundSize: "44px 44px",
            opacity: t.theme.mode === "dark" ? 0.35 : 0.5,
            maskImage: "radial-gradient(ellipse at 70% 0%, #000 0%, transparent 70%)",
            WebkitMaskImage: "radial-gradient(ellipse at 70% 0%, #000 0%, transparent 70%)",
          }}
          aria-hidden
        />
      );
    case "dots":
      return (
        <div
          style={{
            ...base,
            backgroundImage: `radial-gradient(${withAlpha(palette.accent, 0.18)} 1.5px, transparent 1.5px)`,
            backgroundSize: "20px 20px",
            maskImage: "linear-gradient(135deg, #000 0%, transparent 45%)",
            WebkitMaskImage: "linear-gradient(135deg, #000 0%, transparent 45%)",
          }}
          aria-hidden
        />
      );
    case "diagonal":
      return (
        <div
          style={{
            ...base,
            backgroundImage: `repeating-linear-gradient(45deg, ${withAlpha(palette.accent, 0.08)} 0 8px, transparent 8px 20px)`,
            maskImage: "linear-gradient(200deg, transparent 55%, #000 100%)",
            WebkitMaskImage: "linear-gradient(200deg, transparent 55%, #000 100%)",
          }}
          aria-hidden
        />
      );
    case "topography":
      return (
        <div style={base} aria-hidden>
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                right: -260 + i * 26,
                top: -220 + i * 30,
                width: 560 - i * 34,
                height: 560 - i * 34,
                borderRadius: "48% 52% 44% 56% / 52% 44% 56% 48%",
                border: `1px solid ${withAlpha(palette.accent, 0.1)}`,
              }}
            />
          ))}
        </div>
      );
    default:
      return null;
  }
};
