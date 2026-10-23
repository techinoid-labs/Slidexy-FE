"use client";

import React, { useEffect, useMemo } from "react";
import { STAGE_HEIGHT, STAGE_WIDTH, resolveTokens, withAlpha } from "./tokens";
import type { Block, BlockFrame, SlideSpec, TemplateTheme } from "./types";
import {
  BlockEditContext,
  BlockView,
  MotifLayer,
  TokensContext,
  useTokens,
} from "./blocks";
import { ImagePlaceholder } from "./blocks/mediaBlocks";
import { BlockToolbar } from "./blocks/inlineEdit";
import { FreeBlock } from "./blocks/freeCanvas";
import { clampFrame } from "./freeCanvasUtil";

export interface SlideSpecRendererProps {
  spec: SlideSpec;
  theme: TemplateTheme;
  isEditing?: boolean;
  slideIndex?: number;
  /** 1-based number shown by `headingStyle: "numbered"`. */
  slideNumber?: number;
  onTextChange?: (blockId: string, path: string, value: string) => void;
  /** Commit a non-text value edited directly on the slide. */
  onValueChange?: (blockId: string, path: string, value: unknown) => void;
  /** Commit a drag, resize or rotate of a free-positioned block. */
  onFrameChange?: (blockId: string, frame: BlockFrame) => void;
  /** Structural actions offered by the toolbar over the selected block. */
  onBlockAction?: (blockId: string, action: BlockAction) => void;
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
  onValueChange,
  onBlockAction,
  onFrameChange,
  onSelect,
  selectedElementId,
}) => {
  // Over a photographic background the theme's ink colours are not safe —
  // dark body text on a dark photo. Swap the text roles for the palette's
  // on-image colour so every block inside inherits readable values, rather
  // than each block having to know it is sitting on an image.
  const overImage =
    !!spec.background && (spec.layout === "cover" || spec.layout === "closing");

  // A slide may invert the palette. The studied decks use this as their
  // rhythm: four slides on the field colour, one flipped, which breaks a
  // long deck into chapters without introducing a second palette.
  const inverted = useMemo<TemplateTheme>(() => {
    const base = spec.motif ? { ...theme, motif: spec.motif } : theme;
    if (!spec.invert) return base;
    const p = base.palette;
    return {
      ...base,
      palette: {
        ...p,
        bg: p.text,
        text: p.bg,
        textMuted: withAlpha(p.bg, 0.62),
        surface: withAlpha(p.bg, 0.05),
        surfaceAlt: withAlpha(p.bg, 0.09),
        border: withAlpha(p.bg, 0.16),
      },
    };
  }, [theme, spec.invert, spec.motif]);

  const effectiveTheme = useMemo<TemplateTheme>(() => {
    if (!overImage) return inverted;
    const onImage = inverted.palette.onImage;
    return {
      ...inverted,
      palette: {
        ...inverted.palette,
        text: onImage,
        textMuted: withAlpha(onImage, 0.82),
        border: withAlpha(onImage, 0.3),
        surface: withAlpha(onImage, 0.12),
        surfaceAlt: withAlpha(onImage, 0.08),
      },
    };
  }, [theme, overImage, inverted]);

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
      onValueChange,
      onSelect,
    }),
    [isEditing, slideIndex, spec.layout, onTextChange, onValueChange, onSelect]
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
            background: effectiveTheme.palette.bg,
            color: effectiveTheme.palette.text,
            fontFamily: effectiveTheme.fonts.body,
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
            onBlockAction={onBlockAction}
            onSelectBlock={(id) => onSelect?.(`blk-${slideIndex}-${id}-__block`, "text")}
          />

          <FreeLayer
            spec={spec}
            slideNumber={slideNumber}
            isEditing={isEditing}
            selectedBlockId={selectedBlockId}
            onSelectBlock={(id) => onSelect?.(`blk-${slideIndex}-${id}-__block`, "text")}
            onBlockAction={onBlockAction}
            onFrameChange={onFrameChange}
          />
        </div>
      </BlockEditContext.Provider>
    </TokensContext.Provider>
  );
};

// ─────────────────────────────────────────────────────────────────────────────

/** Structural actions the toolbar can request. */
export type BlockAction =
  | "moveUp" | "moveDown" | "duplicate" | "delete"
  | "cycleCard" | "cycleAlign" | "cycleColumns" | "addItem"
  | "unlockPosition" | "lockToLayout" | "bringForward" | "sendBackward";

/** Short name shown on the toolbar chip. */
const BLOCK_LABEL: Record<string, string> = {
  heading: "Heading", paragraph: "Text", iconBullets: "Bullets", checklist: "Checklist",
  quote: "Quote", statCards: "Stats", barChart: "Chart", lineChart: "Chart",
  comboChart: "Chart", donutChart: "Donut", scatterQuadrant: "Quadrant",
  nestedCircles: "Circles", venn: "Venn", pillars: "Pillars", processFlow: "Process",
  timeline: "Timeline", roadmapPhases: "Roadmap", iconGrid: "Grid",
  comparisonTable: "Table", pricingTable: "Pricing", teamCards: "Team",
  logoWall: "Logos", contactFooter: "Contact", ctaButton: "Button", image: "Image",
  imageGrid: "Images", deviceMockup: "Mockup", bigStat: "Big stat",
  calloutBand: "Callout", spotlight: "Spotlight", numberedList: "Numbered",
  metricRow: "Metrics", iso3d: "3D blocks",
};

const HAS_ITEMS = new Set([
  "iconBullets","checklist","statCards","pillars","processFlow","timeline",
  "roadmapPhases","iconGrid","teamCards","logoWall","contactFooter","imageGrid",
  "donutChart","nestedCircles","venn","numberedList","metricRow","iso3d",
]);

const HAS_CARD = new Set([
  "iconBullets","statCards","iconGrid","teamCards","imageGrid","quote","roadmapPhases",
]);

/**
 * Absolute layer holding every block that has been unlocked from the
 * layout. Sits above the flow content so a freely placed element can
 * overlap it, which is the point of unlocking in the first place.
 */
const FreeLayer: React.FC<{
  spec: SlideSpec;
  slideNumber?: number;
  isEditing: boolean;
  selectedBlockId?: string | null;
  onSelectBlock: (blockId: string) => void;
  onBlockAction?: (blockId: string, action: BlockAction) => void;
  onFrameChange?: (blockId: string, frame: BlockFrame) => void;
}> = ({ spec, slideNumber, isEditing, selectedBlockId, onSelectBlock, onBlockAction, onFrameChange }) => {
  const framed = spec.blocks.filter((b) => !!b.frame);

  // Arrow keys nudge the selected free block: 1px, or 10px with Shift.
  // Skipped while the caret is in text, otherwise arrowing through a
  // sentence would drag the block out from under the cursor.
  const selectedFrame = framed.find((b) => b.id === selectedBlockId)?.frame;
  useEffect(() => {
    if (!isEditing || !selectedBlockId || !selectedFrame || !onFrameChange) return;
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      const step = e.shiftKey ? 10 : 1;
      let dx = 0;
      let dy = 0;
      if (e.key === "ArrowLeft") dx = -step;
      else if (e.key === "ArrowRight") dx = step;
      else if (e.key === "ArrowUp") dy = -step;
      else if (e.key === "ArrowDown") dy = step;
      else return;
      e.preventDefault();
      onFrameChange(
        selectedBlockId,
        clampFrame({ ...selectedFrame, x: selectedFrame.x + dx, y: selectedFrame.y + dy })
      );
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isEditing, selectedBlockId, selectedFrame, onFrameChange]);

  if (framed.length === 0) return null;

  const peers = framed.map((b) => b.frame!);

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {framed.map((b) => {
        const selected = isEditing && selectedBlockId === b.id;
        const inner = (
          <>
            {selected && onBlockAction && (
              <BlockToolbar
                label={BLOCK_LABEL[b.type] ?? b.type}
                actions={{
                  onAddItem: HAS_ITEMS.has(b.type) ? () => onBlockAction(b.id, "addItem") : undefined,
                  onCycleColumns: HAS_ITEMS.has(b.type) ? () => onBlockAction(b.id, "cycleColumns") : undefined,
                  onCycleAlign: () => onBlockAction(b.id, "cycleAlign"),
                  onCycleCard: HAS_CARD.has(b.type) ? () => onBlockAction(b.id, "cycleCard") : undefined,
                  onBringForward: () => onBlockAction(b.id, "bringForward"),
                  onSendBackward: () => onBlockAction(b.id, "sendBackward"),
                  onLockToLayout: () => onBlockAction(b.id, "lockToLayout"),
                  onDuplicate: () => onBlockAction(b.id, "duplicate"),
                  onDelete: () => onBlockAction(b.id, "delete"),
                }}
              />
            )}
            <BlockView block={b} slideNumber={slideNumber} />
          </>
        );

        if (!isEditing) {
          const f = b.frame!;
          return (
            <div
              key={b.id}
              data-block-id={b.id}
              style={{
                position: "absolute",
                left: f.x,
                top: f.y,
                width: f.w,
                height: f.h,
                transform: f.rotation ? `rotate(${f.rotation}deg)` : undefined,
                transformOrigin: "center center",
                zIndex: 10 + (f.z ?? 0),
                overflow: "hidden",
              }}
            >
              <BlockView block={b} slideNumber={slideNumber} />
            </div>
          );
        }

        return (
          <div key={b.id} data-block-id={b.id} style={{ pointerEvents: "auto" }}>
            <FreeBlock
              frame={b.frame!}
              selected={selected}
              peers={peers.filter((p) => p !== b.frame)}
              onSelect={() => onSelectBlock(b.id)}
              onChange={(next) => onFrameChange?.(b.id, next)}
            >
              {inner}
            </FreeBlock>
          </div>
        );
      })}
    </div>
  );
};

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
  onBlockAction?: (blockId: string, action: BlockAction) => void;
  onFrameChange?: (blockId: string, frame: BlockFrame) => void;
}> = ({
  spec,
  slideNumber,
  isEditing,
  selectedBlockId,
  onSelectBlock,
  onBlockAction,
  onFrameChange,
}) => {
  const t = useTokens();

  // A block carrying a frame has been unlocked from the layout and is placed
  // by hand, so it draws on an absolute layer rather than flowing in a slot.
  const framed = spec.blocks.filter((b) => !!b.frame);
  const framedPeers = framed.map((b) => b.frame!);

  const bySlot = (slot: string) =>
    spec.blocks.filter((b) => !b.frame && (b.slot ?? "main") === slot);

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
        // A stack that is not filling its slot keeps its natural height.
        // Left shrinkable, a headline stack gets squeezed by whatever sits
        // under it and spills its text over the top of it.
        ...(fill ? { flex: 1 } : { flexShrink: 0 }),
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
              // A block that is not asking to grow must not shrink below
              // its own content either. Flex children shrink by default,
              // and a headline squeezed under its natural height spills
              // its text onto whatever is sitting beneath it.
              ...(b.grow
                ? { flex: b.grow, display: "grid", minHeight: 0, minWidth: 0 }
                : { minWidth: 0, flexShrink: 0 }),
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
            {selected && onBlockAction && (
              <BlockToolbar
                label={BLOCK_LABEL[b.type] ?? b.type}
                actions={{
                  onAddItem: HAS_ITEMS.has(b.type) ? () => onBlockAction(b.id, "addItem") : undefined,
                  onCycleColumns: HAS_ITEMS.has(b.type)
                    ? () => onBlockAction(b.id, "cycleColumns")
                    : undefined,
                  onCycleAlign: () => onBlockAction(b.id, "cycleAlign"),
                  onCycleCard: HAS_CARD.has(b.type) ? () => onBlockAction(b.id, "cycleCard") : undefined,
                  onUnlockPosition: () => onBlockAction(b.id, "unlockPosition"),
                  onMoveUp: () => onBlockAction(b.id, "moveUp"),
                  onMoveDown: () => onBlockAction(b.id, "moveDown"),
                  onDuplicate: () => onBlockAction(b.id, "duplicate"),
                  onDelete: () => onBlockAction(b.id, "delete"),
                }}
              />
            )}
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

  // ── Hero: a 3D object owns the right half ──────────────────────────────
  //
  // The band carries three small objects. This carries one large one, and
  // a deck needs both: a run of band slides with nothing bigger in it
  // flattens out, however good the band is.
  //
  //   full   → the headline, stacked over the body copy on the left
  //   main   → the body copy and anything else in the left column
  //   aside  → the object, given the whole right half and centred in it
  //   footer → corner meta
  if (spec.layout === "hero") {
    const leftShare = spec.split ?? 0.52;
    return (
      <div
        style={{
          position: "relative",
          height: "100%",
          display: "flex",
          padding,
          boxSizing: "border-box",
          gap: t.space(6),
        }}
      >
        <div
          style={{
            flex: leftShare,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: t.space(4),
          }}
        >
          {renderStack(full, t.space(3))}
          {main.length > 0 && renderStack(main, t.space(4))}
        </div>

        <div
          style={{
            flex: 1 - leftShare,
            minWidth: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {renderStack(aside, t.space(3))}
        </div>

        {/* Corner meta belongs in the corner, not inline under a centred
            column where it reads as a stray line of copy. */}
        {footer.length > 0 && (
          <div style={{ position: "absolute", left: t.pad.x, bottom: t.pad.y }}>
            {renderStack(footer, t.space(2))}
          </div>
        )}
      </div>
    );
  }

  // ── Split: the object takes the left, the words the right ──────────────
  //
  // The mirror of hero. A deck that only ever puts the object on the right
  // develops a rhythm you stop seeing after four slides, and the whole
  // thing starts to read as one slide repeated.
  if (spec.layout === "split") {
    const rightShare = spec.split ?? 0.5;
    return (
      <div
        style={{
          position: "relative",
          height: "100%",
          display: "flex",
          padding,
          boxSizing: "border-box",
          gap: t.space(6),
        }}
      >
        <div
          style={{
            flex: 1 - rightShare,
            minWidth: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {renderStack(aside, t.space(3))}
        </div>
        <div
          style={{
            flex: rightShare,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: t.space(4),
          }}
        >
          {renderStack(full, t.space(3))}
          {main.length > 0 && renderStack(main, t.space(4))}
        </div>

        {footer.length > 0 && (
          <div style={{ position: "absolute", left: t.pad.x, bottom: t.pad.y }}>
            {renderStack(footer, t.space(2))}
          </div>
        )}
      </div>
    );
  }

  // ── Showcase: the object owns the slide ────────────────────────────────
  //
  // One object at full size in the middle, the headline above it and the
  // supporting line below. Used once or twice a deck, where the object is
  // the argument rather than an illustration of it.
  if (spec.layout === "showcase") {
    return (
      <div
        style={{
          position: "relative",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding,
          boxSizing: "border-box",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "76%" }}>{renderStack(full, t.space(2))}</div>
        <div
          style={{
            flex: 1,
            minHeight: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {renderStack(aside, t.space(2))}
        </div>
        {main.length > 0 && (
          <div style={{ maxWidth: "62%", marginBottom: t.space(4) }}>
            {renderStack(main, t.space(3))}
          </div>
        )}
        {footer.length > 0 && (
          <div style={{ position: "absolute", left: t.pad.x, bottom: t.pad.y }}>
            {renderStack(footer, t.space(2))}
          </div>
        )}
      </div>
    );
  }

  // ── Statement: words only, at full volume ──────────────────────────────
  //
  // No object at all. A deck of objects needs a slide without one, or the
  // objects stop meaning anything.
  if (spec.layout === "statement") {
    return (
      <div
        style={{
          position: "relative",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: `${t.pad.y}px ${t.pad.x * 1.6}px`,
          boxSizing: "border-box",
          gap: t.space(5),
        }}
      >
        {renderStack(full, t.space(3))}
        {main.length > 0 && <div style={{ maxWidth: "68%" }}>{renderStack(main, t.space(3))}</div>}
        {footer.length > 0 && (
          <div style={{ position: "absolute", left: t.pad.x, bottom: t.pad.y }}>
            {renderStack(footer, t.space(2))}
          </div>
        )}
      </div>
    );
  }

  // ── Band: the editorial frame ───────────────────────────────────────────
  //
  // A headline that owns the top of the slide, and a row of columns sitting
  // on the bottom margin divided by hairlines. Both of the decks this was
  // drawn from run this skeleton under completely different skins, which is
  // why it is a layout rather than one template's hand positioning.
  //
  //   full   → the headline, at display-extra-large
  //   aside  → an optional line under it, kept short
  //   main   → the band itself, normally one block with several items
  //   footer → corner meta, page number and mark
  if (spec.layout === "band") {
    return (
      <div
        style={{
          position: "relative",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding,
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            flex: 1,
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
            // No content row means this is a cover or a closing slide, and
            // a headline pinned to the top margin with nothing under it
            // reads as a page that failed to load.
            justifyContent: main.length > 0 ? "flex-start" : "center",
          }}
        >
          {renderStack(full, t.space(3))}
          {aside.length > 0 && (
            <div style={{ marginTop: t.space(4), maxWidth: "52%" }}>
              {renderStack(aside, t.space(2))}
            </div>
          )}
        </div>

        {main.length > 0 && renderStack(main, t.space(4))}

        {footer.length > 0 && (
          <div style={{ marginTop: t.space(5) }}>{renderStack(footer, t.space(2))}</div>
        )}
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

