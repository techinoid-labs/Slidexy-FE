"use client";

import React from "react";
import { ICONS } from "./icons";
import { useBlockEdit, useTokens } from "./primitives";
import { withAlpha } from "../tokens";

/**
 * Editing affordances that live on the slide itself.
 *
 * Text was already editable in place; everything else — icons, images, the
 * block's own styling — could only be reached from the side panel. These put
 * those controls where the thing is, which is how people expect a canvas to
 * behave.
 *
 * All of it is rendered only while `isEditing`, and it is deliberately
 * absolutely positioned and pointer-event scoped so it never affects layout
 * or shows up in an export.
 */

// Chrome colours are intentionally fixed rather than theme-derived: editing
// UI must stay legible on a dark template and a light one alike.
const CHROME = {
  bg: "#1c1c21",
  bgHover: "#2a2a31",
  border: "rgba(255,255,255,0.14)",
  text: "#f4f4f5",
  muted: "#a1a1aa",
  accent: "#8E2DE2",
  danger: "#f87171",
};

// ─────────────────────────────────────────────────────────────────────────────

/** Closes a popover on outside click or Escape. */
function useDismiss(open: boolean, close: () => void) {
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) close();
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    // Capture phase: the slide stops propagation on its own mousedown.
    document.addEventListener("mousedown", onDown, true);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown, true);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);
  return ref;
}

const Pop: React.FC<React.PropsWithChildren<{ width?: number }>> = ({ children, width = 230 }) => (
  <div
    style={{
      position: "absolute",
      top: "calc(100% + 6px)",
      left: 0,
      zIndex: 60,
      width,
      background: CHROME.bg,
      border: `1px solid ${CHROME.border}`,
      borderRadius: 10,
      boxShadow: "0 16px 40px rgba(0,0,0,0.45)",
      padding: 8,
      // The slide is CSS-scaled; keep chrome at a readable size regardless.
      fontFamily: "Inter, system-ui, sans-serif",
      color: CHROME.text,
    }}
    onMouseDown={(e) => e.stopPropagation()}
  >
    {children}
  </div>
);

const MiniButton: React.FC<
  React.PropsWithChildren<{ onClick: () => void; title: string; danger?: boolean }>
> = ({ onClick, title, danger, children }) => (
  <button
    title={title}
    onMouseDown={(e) => {
      e.stopPropagation();
      e.preventDefault();
    }}
    onClick={onClick}
    style={{
      width: 26,
      height: 26,
      display: "grid",
      placeItems: "center",
      borderRadius: 6,
      border: "none",
      background: "transparent",
      color: danger ? CHROME.danger : CHROME.text,
      cursor: "pointer",
      fontSize: 13,
      lineHeight: 1,
      padding: 0,
    }}
    onMouseEnter={(e) => (e.currentTarget.style.background = CHROME.bgHover)}
    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
  >
    {children}
  </button>
);

const miniInput: React.CSSProperties = {
  width: "100%",
  background: "#0f0f12",
  border: `1px solid ${CHROME.border}`,
  borderRadius: 6,
  color: CHROME.text,
  fontSize: 11,
  padding: "5px 7px",
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "inherit",
};

// ─────────────────────────────────────────────────────────────────────────────
// Icon — click the icon itself to change it
// ─────────────────────────────────────────────────────────────────────────────

export const IconEditAffordance: React.FC<{
  blockId: string;
  path: string;
  current?: string;
  children: React.ReactNode;
}> = ({ blockId, path, current, children }) => {
  const { isEditing, onValueChange } = useBlockEdit();
  const [open, setOpen] = React.useState(false);
  const [q, setQ] = React.useState("");
  const ref = useDismiss(open, () => setOpen(false));

  if (!isEditing || !onValueChange) return <>{children}</>;

  const names = Object.keys(ICONS).filter((n) =>
    q ? n.toLowerCase().includes(q.toLowerCase()) : true
  );

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-flex", flexShrink: 0 }}>
      <div
        role="button"
        title="Change icon"
        onMouseDown={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
        onClick={() => setOpen((o) => !o)}
        style={{ cursor: "pointer", borderRadius: 8, outline: open ? `2px solid ${CHROME.accent}` : "none", outlineOffset: 2 }}
      >
        {children}
      </div>

      {open && (
        <Pop>
          <input
            autoFocus
            value={q}
            placeholder="Search icons"
            onChange={(e) => setQ(e.target.value)}
            style={{ ...miniInput, marginBottom: 6 }}
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(6, 1fr)",
              gap: 3,
              maxHeight: 170,
              overflowY: "auto",
            }}
          >
            {names.map((n) => {
              const G = ICONS[n];
              return (
                <div
                  key={n}
                  title={n}
                  onClick={() => {
                    onValueChange(blockId, path, n);
                    setOpen(false);
                  }}
                  style={{
                    width: 30,
                    height: 30,
                    display: "grid",
                    placeItems: "center",
                    borderRadius: 6,
                    cursor: "pointer",
                    background: n === current ? withAlpha(CHROME.accent, 0.3) : "transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (n !== current) e.currentTarget.style.background = CHROME.bgHover;
                  }}
                  onMouseLeave={(e) => {
                    if (n !== current) e.currentTarget.style.background = "transparent";
                  }}
                >
                  <G size={15} color={CHROME.text} />
                </div>
              );
            })}
            {names.length === 0 && (
              <span style={{ gridColumn: "1/-1", fontSize: 11, color: CHROME.muted, padding: 6 }}>
                No icon matches “{q}”.
              </span>
            )}
          </div>
        </Pop>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Image — hover controls over the picture
// ─────────────────────────────────────────────────────────────────────────────

export const ImageEditAffordance: React.FC<{
  blockId: string;
  /** Paths for the url and the generation prompt on this block. */
  urlPath: string;
  promptPath?: string;
  url?: string;
  prompt?: string;
  /** Extra controls, e.g. object-fit for a plain image block. */
  extra?: Array<{ label: string; onClick: () => void }>;
}> = ({ blockId, urlPath, promptPath, url, prompt, extra }) => {
  const { isEditing, onValueChange } = useBlockEdit();
  const [open, setOpen] = React.useState(false);
  const [hover, setHover] = React.useState(false);
  const [urlDraft, setUrlDraft] = React.useState(url ?? "");
  const [promptDraft, setPromptDraft] = React.useState(prompt ?? "");
  const ref = useDismiss(open, () => setOpen(false));

  React.useEffect(() => setUrlDraft(url ?? ""), [url]);
  React.useEffect(() => setPromptDraft(prompt ?? ""), [prompt]);

  if (!isEditing || !onValueChange) return null;

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ position: "absolute", inset: 0, zIndex: 40 }}
    >
      {/* A hover scrim makes it obvious the picture is interactive. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: hover || open ? "rgba(0,0,0,0.28)" : "transparent",
          transition: "background 120ms ease",
          pointerEvents: "none",
        }}
      />

      {(hover || open) && (
        <div style={{ position: "absolute", top: 8, right: 8, display: "flex", gap: 2, background: CHROME.bg, border: `1px solid ${CHROME.border}`, borderRadius: 8, padding: 2 }}>
          <MiniButton title="Change image" onClick={() => setOpen((o) => !o)}>
            ⟳
          </MiniButton>
          {url && (
            <MiniButton title="Remove image" danger onClick={() => onValueChange(blockId, urlPath, undefined)}>
              ✕
            </MiniButton>
          )}
        </div>
      )}

      {open && (
        <div style={{ position: "absolute", top: 40, right: 8 }}>
          <Pop width={250}>
            <div style={{ fontSize: 10, color: CHROME.muted, marginBottom: 4 }}>Image URL</div>
            <input
              value={urlDraft}
              placeholder="Paste an image URL"
              onChange={(e) => setUrlDraft(e.target.value)}
              onBlur={() => onValueChange(blockId, urlPath, urlDraft || undefined)}
              onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
              style={miniInput}
            />

            {promptPath && (
              <>
                <div style={{ fontSize: 10, color: CHROME.muted, margin: "8px 0 4px" }}>
                  Generation prompt
                </div>
                <textarea
                  value={promptDraft}
                  rows={3}
                  onChange={(e) => setPromptDraft(e.target.value)}
                  onBlur={() => onValueChange(blockId, promptPath, promptDraft)}
                  style={{ ...miniInput, resize: "vertical" }}
                />
              </>
            )}

            {extra && extra.length > 0 && (
              <div style={{ display: "flex", gap: 4, marginTop: 8, flexWrap: "wrap" }}>
                {extra.map((x) => (
                  <button
                    key={x.label}
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={x.onClick}
                    style={{
                      fontSize: 10,
                      padding: "4px 8px",
                      borderRadius: 6,
                      border: `1px solid ${CHROME.border}`,
                      background: "transparent",
                      color: CHROME.text,
                      cursor: "pointer",
                    }}
                  >
                    {x.label}
                  </button>
                ))}
              </div>
            )}
          </Pop>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Block toolbar — appears above whichever block is selected
// ─────────────────────────────────────────────────────────────────────────────

export interface BlockToolbarActions {
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  onCycleCard?: () => void;
  onCycleAlign?: () => void;
  onCycleColumns?: () => void;
  onAddItem?: () => void;
  onUnlockPosition?: () => void;
  onLockToLayout?: () => void;
  onBringForward?: () => void;
  onSendBackward?: () => void;
}

export const BlockToolbar: React.FC<{ actions: BlockToolbarActions; label: string }> = ({
  actions,
  label,
}) => {
  const t = useTokens();
  return (
    <div
      onMouseDown={(e) => e.stopPropagation()}
      style={{
        position: "absolute",
        top: -34,
        left: 0,
        zIndex: 70,
        display: "flex",
        alignItems: "center",
        gap: 1,
        background: CHROME.bg,
        border: `1px solid ${CHROME.border}`,
        borderRadius: 8,
        padding: "2px 4px",
        boxShadow: "0 8px 22px rgba(0,0,0,0.4)",
        fontFamily: "Inter, system-ui, sans-serif",
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ fontSize: 10, color: CHROME.muted, padding: "0 6px 0 2px" }}>{label}</span>

      {actions.onAddItem && (
        <MiniButton title="Add item" onClick={actions.onAddItem}>＋</MiniButton>
      )}
      {actions.onCycleColumns && (
        <MiniButton title="Columns" onClick={actions.onCycleColumns}>▦</MiniButton>
      )}
      {actions.onCycleAlign && (
        <MiniButton title="Align" onClick={actions.onCycleAlign}>⇥</MiniButton>
      )}
      {actions.onCycleCard && (
        <MiniButton title="Card style" onClick={actions.onCycleCard}>◧</MiniButton>
      )}
      {actions.onUnlockPosition && (
        <MiniButton title="Unlock position — place freely" onClick={actions.onUnlockPosition}>⤢</MiniButton>
      )}
      {actions.onLockToLayout && (
        <MiniButton title="Return to layout" onClick={actions.onLockToLayout}>⇲</MiniButton>
      )}
      {actions.onBringForward && (
        <MiniButton title="Bring forward" onClick={actions.onBringForward}>⬆</MiniButton>
      )}
      {actions.onSendBackward && (
        <MiniButton title="Send backward" onClick={actions.onSendBackward}>⬇</MiniButton>
      )}
      {actions.onMoveUp && <MiniButton title="Move up" onClick={actions.onMoveUp}>↑</MiniButton>}
      {actions.onMoveDown && (
        <MiniButton title="Move down" onClick={actions.onMoveDown}>↓</MiniButton>
      )}
      {actions.onDuplicate && (
        <MiniButton title="Duplicate" onClick={actions.onDuplicate}>⧉</MiniButton>
      )}
      {actions.onDelete && (
        <MiniButton title="Delete block" danger onClick={actions.onDelete}>✕</MiniButton>
      )}
    </div>
  );
};
