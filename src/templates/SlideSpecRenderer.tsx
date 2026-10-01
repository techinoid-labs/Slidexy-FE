"use client";

import React, { useMemo } from "react";
import { STAGE_HEIGHT, STAGE_WIDTH, resolveTokens, withAlpha } from "./tokens";
import type { Block, SlideSpec, TemplateTheme } from "./types";
import {
  BlockEditContext,
  BlockView,
  MotifLayer,
  TokensContext,
  useTokens,
} from "./blocks";
import { ImagePlaceholder } from "./blocks/mediaBlocks";

export interface SlideSpecRendererProps {
  spec: SlideSpec;
  theme: TemplateTheme;
  isEditing?: boolean;
  slideIndex?: number;
  /** 1-based number shown by `headingStyle: "numbered"`. */
  slideNumber?: number;
  onTextChange?: (blockId: string, path: string, value: string) => void;
  onSelect?: (elementId: string, kind: "text" | "image" | "shape") => void;
  /** Element id of the current selection, used to outline the active block. */
  selectedElementId?: string | null;
}

/**
 * Renders one `SlideSpec` at the fixed 960x540 stage size.
 *
 * Layout is resolved here; blocks never position themselves. That separation
 * is what lets the same block appear in a two-column corporate slide and a
 * full-bleed cover without being rewritten.
 */
export const SlideSpecRenderer: React.FC<SlideSpecRendererProps> = ({
  spec,
  theme,
  isEditing = false,
  slideIndex = 0,
  slideNumber,
  onTextChange,
  onSelect,
  selectedElementId,
}) => {
  // Over a photographic background the theme's ink colours are not safe —
  // dark body text on a dark photo. Swap the text roles for the palette's
  // on-image colour so every block inside inherits readable values, rather
  // than each block having to know it is sitting on an image.
  const overImage =
    !!spec.background && (spec.layout === "cover" || spec.layout === "closing");

  const effectiveTheme = useMemo<TemplateTheme>(() => {
    if (!overImage) return theme;
    const onImage = theme.palette.onImage;
    return {
      ...theme,
      palette: {
        ...theme.palette,
        text: onImage,
        textMuted: withAlpha(onImage, 0.82),
        border: withAlpha(onImage, 0.3),
        surface: withAlpha(onImage, 0.12),
        surfaceAlt: withAlpha(onImage, 0.08),
      },
    };
  }, [theme, overImage]);

  const tokens = useMemo(() => resolveTokens(effectiveTheme), [effectiveTheme]);

  // Every editable field's id embeds its block id, so the current selection
  // tells us which block to outline — whether the user clicked text inside it
  // or the block itself.
  const selectedBlockId = useMemo(() => {
    if (!selectedElementId?.startsWith("blk-")) return null;
    const m = selectedElementId.slice(4).match(/^\d+-([a-z]+-\d+)-/i);
    return m ? m[1] : null;
  }, [selectedElementId]);

  const editValue = useMemo(
    () => ({
      isEditing,
      slideIndex,
      slideLayout: spec.layout,
      onTextChange: onTextChange ?? (() => {}),
      onSelect,
    }),
    [isEditing, slideIndex, spec.layout, onTextChange, onSelect]
  );

  return (
    <TokensContext.Provider value={tokens}>
      <BlockEditContext.Provider value={editValue}>
        <div
          data-slide-spec={spec.id}
          style={{
            position: "relative",
            width: STAGE_WIDTH,
            height: STAGE_HEIGHT,
            background: theme.palette.bg,
            color: theme.palette.text,
            fontFamily: theme.fonts.body,
            overflow: "hidden",
            boxSizing: "border-box",
          }}
        >
          <SlideBackground spec={spec} />
          <MotifLayer />
          <SlideBody
            spec={spec}
            slideNumber={slideNumber}
            isEditing={isEditing}
            slideIndex={slideIndex}
            selectedBlockId={selectedBlockId}
            onSelectBlock={(id) => onSelect?.(`blk-${slideIndex}-${id}-__block`, "text")}
          />
        </div>
      </BlockEditContext.Provider>
    </TokensContext.Provider>
  );
};

// ─────────────────────────────────────────────────────────────────────────────

const SlideBackground: React.FC<{ spec: SlideSpec }> = ({ spec }) => {
  const bg = spec.background;
  if (!bg) return null;

  return (
    <div style={{ position: "absolute", inset: 0 }} aria-hidden>
      {bg.url ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${bg.url})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      ) : (
        <ImagePlaceholder prompt={bg.prompt} showHint={false} />
      )}
      {!!bg.scrim && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(105deg, ${withAlpha("#050810", bg.scrim)} 0%, ${withAlpha(
              "#050810",
              bg.scrim * 0.75
            )} 45%, ${withAlpha("#050810", bg.scrim * 0.25)} 100%)`,
          }}
        />
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────

const SlideBody: React.FC<{
  spec: SlideSpec;
  slideNumber?: number;
  isEditing: boolean;
  slideIndex: number;
  selectedBlockId?: string | null;
  onSelectBlock: (blockId: string) => void;
}> = ({ spec, slideNumber, isEditing, selectedBlockId, onSelectBlock }) => {
  const t = useTokens();

  const bySlot = (slot: string) =>
    spec.blocks.filter((b) => (b.slot ?? "main") === slot);

  const main = bySlot("main");
  const aside = bySlot("aside");
  const full = bySlot("full");
  const footer = bySlot("footer");

  const padding = `${t.pad.y}px ${t.pad.x}px`;

  /**
   * `fill` is opt-in. Previously every stack took `flex: 1`, so a heading in
   * the `full` slot absorbed all the free height and pushed the body of the
   * slide to the bottom.
   *
   * A block that asks to grow is wrapped in a grid rather than a flex item:
   * a lone grid item stretches on both axes automatically, so charts, images
   * and pillar columns fill their space without each block re-implementing
   * `height: 100%`.
   */
  const renderStack = (blocks: Block[], gap = t.space(5), fill = false) => {
    // When a slot fills its column but nothing inside asks to grow, centre the
    // content. Otherwise fixed-height blocks (a 2x2 stat grid, a short bullet
    // list) pin to the top and leave an obvious hole under them.
    const anyGrows = blocks.some((b) => !!b.grow);
    return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: fill && !anyGrows ? "center" : "flex-start",
        gap,
        minWidth: 0,
        minHeight: 0,
        ...(fill ? { flex: 1 } : {}),
      }}
    >
      {blocks.map((b) => {
        const selected = isEditing && selectedBlockId === b.id;
        return (
          <div
            key={b.id}
            data-block-id={b.id}
            // Click-to-select so blocks that contain no editable text — a
            // chart without a caption, an image, a device mockup — can still
            // be reached by the inspector.
            onMouseDown={isEditing ? () => onSelectBlock(b.id) : undefined}
            style={{
              ...(b.grow
                ? { flex: b.grow, display: "grid", minHeight: 0, minWidth: 0 }
                : { minWidth: 0 }),
              ...(isEditing
                ? {
                    outline: selected ? `2px solid ${t.palette.accent}` : "none",
                    outlineOffset: 4,
                    borderRadius: t.radiusSm,
                    cursor: "default",
                  }
                : {}),
            }}
          >
            <BlockView block={b} slideNumber={slideNumber} />
          </div>
        );
      })}
    </div>
    );
  };

  // ── Cover / closing: full-bleed, content bottom-left over the background ──
  if (spec.layout === "cover" || spec.layout === "closing") {
    const overImage = !!spec.background;
    return (
      <div
        style={{
          position: "relative",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: `${t.pad.y + 12}px ${t.pad.x + 8}px`,
          boxSizing: "border-box",
          gap: t.space(5),
          // Keep cover text off the right edge so a portrait subject stays visible.
          maxWidth: overImage ? "70%" : "100%",
          // Palette roles are already swapped upstream for the over-image case;
          // the shadow is what keeps type legible over a busy photograph.
          textShadow: overImage ? `0 1px 14px ${withAlpha("#000000", 0.45)}` : undefined,
        }}
      >
        {renderStack([...full, ...main], t.space(4))}
        {footer.length > 0 && (
          <div style={{ position: "absolute", left: t.pad.x + 8, bottom: t.pad.y }}>
            {renderStack(footer, t.space(2))}
          </div>
        )}
      </div>
    );
  }

  // ── Full bleed: a single block owns the slide ───────────────────────────
  if (spec.layout === "fullBleed") {
    return (
      <div style={{ position: "relative", height: "100%", padding, boxSizing: "border-box" }}>
        {renderStack([...full, ...main], t.space(5), true)}
      </div>
    );
  }

  // ── Split ───────────────────────────────────────────────────────────────
  if (spec.layout === "splitRight" || spec.layout === "splitLeft") {
    const mainShare = spec.split ?? 0.58;
    const asideShare = 1 - mainShare;
    const reversed = spec.layout === "splitLeft";

    return (
      <div
        style={{
          position: "relative",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding,
          boxSizing: "border-box",
          gap: t.space(4),
        }}
      >
        {full.length > 0 && renderStack(full, t.space(3))}

        <div
          style={{
            display: "flex",
            flexDirection: reversed ? "row-reverse" : "row",
            gap: t.space(6),
            flex: 1,
            minHeight: 0,
          }}
        >
          <div style={{ flex: mainShare, display: "flex", flexDirection: "column", minWidth: 0, minHeight: 0 }}>
            {renderStack(main, t.space(5), true)}
          </div>
          <div style={{ flex: asideShare, display: "flex", flexDirection: "column", minWidth: 0, minHeight: 0 }}>
            {renderStack(aside, t.space(3), true)}
          </div>
        </div>

        {footer.length > 0 && renderStack(footer, t.space(2))}
      </div>
    );
  }

  // ── Stack (default) ─────────────────────────────────────────────────────
  return (
    <div
      style={{
        position: "relative",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding,
        boxSizing: "border-box",
        gap: t.space(5),
      }}
    >
      {renderStack([...full, ...main], t.space(5), true)}
      {aside.length > 0 && renderStack(aside, t.space(3))}
      {footer.length > 0 && renderStack(footer, t.space(2))}
    </div>
  );
};

