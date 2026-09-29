"use client";

/**
 * Property panel for block-template slides.
 *
 * The old TextPanel/ImagePanel target the legacy `slide.elements` model and
 * match element ids against a regex that block ids never satisfy, so they are
 * inert on template slides. This replaces them for those slides.
 *
 * It reads the block schema, so the controls it offers are derived from what
 * the selected block actually holds: chart data for a chart, plans for a
 * pricing table, items for anything list-shaped.
 */

import React from "react";
import { Box, IconButton, MenuItem, Select, Tooltip, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { PANEL } from "./panelTheme";
import { ICONS } from "@/templates/blocks/icons";
import {
  addBlockItem,
  addChartCategory,
  addChartSeries,
  getBlock,
  moveBlock,
  moveBlockItem,
  removeBlock,
  removeBlockItem,
  removeChartCategory,
  removeChartSeries,
  setBlockValue,
} from "@/templates/mutate";
import type { Block, SlideSpec } from "@/templates/types";

interface Props {
  spec: SlideSpec;
  blockId: string;
  onChange: (next: SlideSpec) => void;
}

const LIST_BLOCKS = new Set([
  "iconBullets",
  "checklist",
  "statCards",
  "pillars",
  "processFlow",
  "timeline",
  "roadmapPhases",
  "iconGrid",
  "teamCards",
  "logoWall",
  "contactFooter",
  "imageGrid",
  "donutChart",
  "nestedCircles",
  "venn",
  "scatterQuadrant",
]);

const BLOCK_LABELS: Record<string, string> = {
  heading: "Heading",
  paragraph: "Paragraph",
  iconBullets: "Icon bullets",
  checklist: "Checklist",
  quote: "Quote",
  statCards: "Stat cards",
  barChart: "Bar chart",
  lineChart: "Line chart",
  comboChart: "Combo chart",
  donutChart: "Donut chart",
  scatterQuadrant: "Quadrant chart",
  nestedCircles: "Nested circles",
  venn: "Venn diagram",
  pillars: "Pillars",
  processFlow: "Process flow",
  timeline: "Timeline",
  roadmapPhases: "Roadmap phases",
  iconGrid: "Icon grid",
  comparisonTable: "Comparison table",
  pricingTable: "Pricing table",
  teamCards: "Team cards",
  logoWall: "Logo wall",
  contactFooter: "Contact footer",
  ctaButton: "Button",
  image: "Image",
  imageGrid: "Image grid",
  deviceMockup: "Device mockup",
  spacer: "Spacer",
};

// ─────────────────────────────────────────────────────────────────────────────
// Small shared controls
// ─────────────────────────────────────────────────────────────────────────────

const Section: React.FC<React.PropsWithChildren<{ title: string; action?: React.ReactNode }>> = ({
  title,
  action,
  children,
}) => (
  <Box sx={{ mb: 2.5 }}>
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
      <Typography
        sx={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.5, color: PANEL.textMuted, textTransform: "uppercase" }}
      >
        {title}
      </Typography>
      {action}
    </Box>
    {children}
  </Box>
);

const fieldSx = {
  width: "100%",
  fontSize: 12,
  padding: "6px 8px",
  borderRadius: "6px",
  border: `1px solid ${PANEL.border}`,
  background: PANEL.surface,
  color: PANEL.text,
  outline: "none",
  boxSizing: "border-box" as const,
  fontFamily: "inherit",
};

const TextField: React.FC<{
  value: string;
  onCommit: (v: string) => void;
  placeholder?: string;
  type?: "text" | "number";
  width?: number | string;
}> = ({ value, onCommit, placeholder, type = "text", width = "100%" }) => {
  const [local, setLocal] = React.useState(value);
  React.useEffect(() => setLocal(value), [value]);
  return (
    <input
      type={type}
      value={local}
      placeholder={placeholder}
      onChange={(e) => setLocal(e.target.value)}
      onBlur={() => onCommit(local)}
      onKeyDown={(e) => {
        if (e.key === "Enter") (e.target as HTMLInputElement).blur();
      }}
      style={{ ...fieldSx, width }}
    />
  );
};

const SmallSelect: React.FC<{
  value: string | number;
  options: Array<{ value: string | number; label: string }>;
  onChange: (v: any) => void;
}> = ({ value, options, onChange }) => (
  <Select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    size="small"
    sx={{
      width: "100%",
      fontSize: 12,
      "& .MuiSelect-select": { py: 0.75 },
      "& fieldset": { borderColor: PANEL.border },
    }}
  >
    {options.map((o) => (
      <MenuItem key={o.value} value={o.value} sx={{ fontSize: 12 }}>
        {o.label}
      </MenuItem>
    ))}
  </Select>
);

const IconPicker: React.FC<{ value?: string; onChange: (name: string) => void }> = ({
  value,
  onChange,
}) => {
  const [open, setOpen] = React.useState(false);
  const names = React.useMemo(() => Object.keys(ICONS), []);
  const Current = (value && ICONS[value]) || null;

  return (
    <Box sx={{ position: "relative" }}>
      <Box
        onClick={() => setOpen((o) => !o)}
        sx={{
          width: 32,
          height: 32,
          borderRadius: "6px",
          border: `1px solid ${PANEL.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          "&:hover": { borderColor: PANEL.accentBorder },
        }}
      >
        {Current ? <Current size={16} color={PANEL.text} /> : <span style={{ fontSize: 10, color: PANEL.textFaint }}>—</span>}
      </Box>

      {open && (
        <Box
          sx={{
            position: "absolute",
            zIndex: 30,
            top: 36,
            left: 0,
            width: 216,
            maxHeight: 210,
            overflowY: "auto",
            background: PANEL.surface,
            border: `1px solid ${PANEL.border}`,
            borderRadius: "8px",
            boxShadow: "0 12px 28px rgba(0,0,0,0.14)",
            p: 1,
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
            gap: 0.5,
          }}
        >
          {names.map((n) => {
            const G = ICONS[n];
            return (
              <Tooltip key={n} title={n} placement="top">
                <Box
                  onClick={() => {
                    onChange(n);
                    setOpen(false);
                  }}
                  sx={{
                    width: 30,
                    height: 30,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "5px",
                    cursor: "pointer",
                    background: n === value ? PANEL.accentBg : "transparent",
                    "&:hover": { background: PANEL.surfaceHover },
                  }}
                >
                  <G size={15} color={PANEL.text} />
                </Box>
              </Tooltip>
            );
          })}
        </Box>
      )}
    </Box>
  );
};

const RowActions: React.FC<{
  onUp?: () => void;
  onDown?: () => void;
  onRemove?: () => void;
  canRemove?: boolean;
}> = ({ onUp, onDown, onRemove, canRemove = true }) => (
  <Box sx={{ display: "flex", gap: 0.25 }}>
    {onUp && (
      <IconButton size="small" onClick={onUp} sx={{ p: 0.25 }}>
        <ArrowUpwardIcon sx={{ fontSize: 13, color: PANEL.textFaint }} />
      </IconButton>
    )}
    {onDown && (
      <IconButton size="small" onClick={onDown} sx={{ p: 0.25 }}>
        <ArrowDownwardIcon sx={{ fontSize: 13, color: PANEL.textFaint }} />
      </IconButton>
    )}
    {onRemove && (
      <IconButton size="small" onClick={onRemove} disabled={!canRemove} sx={{ p: 0.25 }}>
        <DeleteOutlineIcon sx={{ fontSize: 14, color: canRemove ? PANEL.danger : PANEL.textFaint }} />
      </IconButton>
    )}
  </Box>
);

const AddButton: React.FC<{ onClick: () => void; label?: string }> = ({ onClick, label = "Add" }) => (
  <Box
    onClick={onClick}
    sx={{
      display: "inline-flex",
      alignItems: "center",
      gap: 0.5,
      px: 1,
      py: 0.4,
      borderRadius: "6px",
      border: `1px dashed ${PANEL.border}`,
      cursor: "pointer",
      fontSize: 11,
      color: PANEL.textMuted,
      "&:hover": { borderColor: PANEL.accentBorder, color: PANEL.accent },
    }}
  >
    <AddIcon sx={{ fontSize: 13 }} /> {label}
  </Box>
);

// ─────────────────────────────────────────────────────────────────────────────

export const BlockInspector: React.FC<Props> = ({ spec, blockId, onChange }) => {
  const block = getBlock(spec, blockId) as any;

  if (!block) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography sx={{ fontSize: 12, color: PANEL.textMuted }}>
          Select something on the slide to edit it.
        </Typography>
      </Box>
    );
  }

  const set = (path: string, value: unknown) => onChange(setBlockValue(spec, blockId, path, value));
  const isList = LIST_BLOCKS.has(block.type);
  const isChart = block.type === "barChart" || block.type === "lineChart" || block.type === "comboChart";

  return (
    <Box sx={{ p: 2, overflowY: "auto", height: "100%" }}>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
        <Typography sx={{ fontSize: 13, fontWeight: 700, color: PANEL.text }}>
          {BLOCK_LABELS[block.type] ?? block.type}
        </Typography>
        <RowActions
          onUp={() => onChange(moveBlock(spec, blockId, -1))}
          onDown={() => onChange(moveBlock(spec, blockId, 1))}
          onRemove={() => onChange(removeBlock(spec, blockId))}
          canRemove={spec.blocks.length > 1}
        />
      </Box>

      {/* ── Layout options ─────────────────────────────────────────────── */}
      <Section title="Layout">
        <Box sx={{ display: "flex", gap: 1 }}>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontSize: 10, color: PANEL.textFaint, mb: 0.5 }}>Align</Typography>
            <SmallSelect
              value={block.style?.align ?? "left"}
              options={[
                { value: "left", label: "Left" },
                { value: "center", label: "Center" },
                { value: "right", label: "Right" },
              ]}
              onChange={(v) => set("style.align", v)}
            />
          </Box>
          {(isList || block.type === "checklist") && (
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontSize: 10, color: PANEL.textFaint, mb: 0.5 }}>Columns</Typography>
              <SmallSelect
                value={block.style?.columns ?? 1}
                options={[1, 2, 3, 4].map((n) => ({ value: n, label: String(n) }))}
                onChange={(v) => set("style.columns", Number(v))}
              />
            </Box>
          )}
        </Box>

        <Box sx={{ mt: 1 }}>
          <Typography sx={{ fontSize: 10, color: PANEL.textFaint, mb: 0.5 }}>Card style</Typography>
          <SmallSelect
            value={block.style?.cardStyle ?? "theme"}
            options={[
              { value: "theme", label: "Follow theme" },
              { value: "flat", label: "Flat" },
              { value: "outlined", label: "Outlined" },
              { value: "elevated", label: "Elevated" },
              { value: "tinted", label: "Tinted" },
              { value: "brutalist", label: "Hard shadow" },
            ]}
            onChange={(v) => set("style.cardStyle", v === "theme" ? undefined : v)}
          />
        </Box>
      </Section>

      {/* ── Chart data ─────────────────────────────────────────────────── */}
      {isChart && (
        <>
          <Section
            title="Categories"
            action={<AddButton onClick={() => onChange(addChartCategory(spec, blockId))} />}
          >
            {block.categories.map((c: string, i: number) => (
              <Box key={i} sx={{ display: "flex", gap: 0.5, alignItems: "center", mb: 0.5 }}>
                <TextField value={c} onCommit={(v) => set(`categories.${i}`, v)} />
                <RowActions
                  onRemove={() => onChange(removeChartCategory(spec, blockId, i))}
                  canRemove={block.categories.length > 2}
                />
              </Box>
            ))}
          </Section>

          <Section
            title="Series"
            action={<AddButton onClick={() => onChange(addChartSeries(spec, blockId))} />}
          >
            {block.series.map((s: any, si: number) => (
              <Box
                key={s.id}
                sx={{ mb: 1.5, p: 1, border: `1px solid ${PANEL.border}`, borderRadius: "8px" }}
              >
                <Box sx={{ display: "flex", gap: 0.5, alignItems: "center", mb: 0.75 }}>
                  <TextField value={s.name} onCommit={(v) => set(`series.${si}.name`, v)} />
                  <RowActions
                    onRemove={() => onChange(removeChartSeries(spec, blockId, si))}
                    canRemove={block.series.length > 1}
                  />
                </Box>

                <Box sx={{ display: "flex", gap: 1, mb: 0.75 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontSize: 10, color: PANEL.textFaint }}>Colour</Typography>
                    <SmallSelect
                      value={s.accent ?? 1}
                      options={[1, 2, 3, 4].map((n) => ({ value: n, label: `Accent ${n}` }))}
                      onChange={(v) => set(`series.${si}.accent`, Number(v))}
                    />
                  </Box>
                  {block.type === "comboChart" && (
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ fontSize: 10, color: PANEL.textFaint }}>Type</Typography>
                      <SmallSelect
                        value={s.kind ?? "bar"}
                        options={[
                          { value: "bar", label: "Bars" },
                          { value: "line", label: "Line" },
                        ]}
                        onChange={(v) => set(`series.${si}.kind`, v)}
                      />
                    </Box>
                  )}
                </Box>

                <Typography sx={{ fontSize: 10, color: PANEL.textFaint, mb: 0.5 }}>Values</Typography>
                <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0.5 }}>
                  {s.values.map((v: number, vi: number) => (
                    <Box key={vi}>
                      <Typography sx={{ fontSize: 9, color: PANEL.textFaint }}>
                        {block.categories[vi] ?? `#${vi + 1}`}
                      </Typography>
                      <TextField
                        type="number"
                        value={String(v)}
                        onCommit={(nv) => set(`series.${si}.values.${vi}`, Number(nv) || 0)}
                      />
                    </Box>
                  ))}
                </Box>
              </Box>
            ))}
          </Section>

          <Section title="Value format">
            <SmallSelect
              value={block.yFormat ?? "plain"}
              options={[
                { value: "plain", label: "Plain" },
                { value: "compact", label: "Compact (12K)" },
                { value: "currency", label: "Currency ($12K)" },
                { value: "percent", label: "Percent" },
              ]}
              onChange={(v) => set("yFormat", v)}
            />
          </Section>
        </>
      )}

      {/* ── Donut values ───────────────────────────────────────────────── */}
      {block.type === "donutChart" && (
        <Section
          title="Segments"
          action={<AddButton onClick={() => onChange(addBlockItem(spec, blockId))} />}
        >
          {block.items.map((it: any, i: number) => (
            <Box key={it.id} sx={{ display: "flex", gap: 0.5, alignItems: "center", mb: 0.5 }}>
              <TextField value={it.label.text} onCommit={(v) => set(`items.${i}.label.text`, v)} />
              <TextField
                type="number"
                width={64}
                value={String(it.value)}
                onCommit={(v) => set(`items.${i}.value`, Number(v) || 0)}
              />
              <RowActions
                onRemove={() => onChange(removeBlockItem(spec, blockId, i))}
                canRemove={block.items.length > 1}
              />
            </Box>
          ))}
        </Section>
      )}

      {/* ── Quadrant points ────────────────────────────────────────────── */}
      {block.type === "scatterQuadrant" && (
        <Section
          title="Points"
          action={<AddButton onClick={() => onChange(addBlockItem(spec, blockId, "points"))} />}
        >
          {block.points.map((p: any, i: number) => (
            <Box key={p.id} sx={{ mb: 1, p: 1, border: `1px solid ${PANEL.border}`, borderRadius: "8px" }}>
              <Box sx={{ display: "flex", gap: 0.5, alignItems: "center", mb: 0.5 }}>
                <TextField value={p.label.text} onCommit={(v) => set(`points.${i}.label.text`, v)} />
                <RowActions
                  onRemove={() => onChange(removeBlockItem(spec, blockId, i, "points"))}
                  canRemove={block.points.length > 1}
                />
              </Box>
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <Typography sx={{ fontSize: 10, color: PANEL.textFaint }}>X</Typography>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.02}
                  value={p.x}
                  onChange={(e) => set(`points.${i}.x`, Number(e.target.value))}
                  style={{ flex: 1 }}
                />
                <Typography sx={{ fontSize: 10, color: PANEL.textFaint }}>Y</Typography>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.02}
                  value={p.y}
                  onChange={(e) => set(`points.${i}.y`, Number(e.target.value))}
                  style={{ flex: 1 }}
                />
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
                <input
                  type="checkbox"
                  checked={!!p.highlight}
                  onChange={(e) => set(`points.${i}.highlight`, e.target.checked)}
                />
                <Typography sx={{ fontSize: 11, color: PANEL.textMuted }}>Highlight</Typography>
              </Box>
            </Box>
          ))}

          <Box sx={{ display: "flex", gap: 0.5, mt: 1 }}>
            <TextField value={block.xAxis.low} onCommit={(v) => set("xAxis.low", v)} placeholder="X low" />
            <TextField value={block.xAxis.high} onCommit={(v) => set("xAxis.high", v)} placeholder="X high" />
          </Box>
          <Box sx={{ display: "flex", gap: 0.5, mt: 0.5 }}>
            <TextField value={block.yAxis.low} onCommit={(v) => set("yAxis.low", v)} placeholder="Y low" />
            <TextField value={block.yAxis.high} onCommit={(v) => set("yAxis.high", v)} placeholder="Y high" />
          </Box>
        </Section>
      )}

      {/* ── Comparison table ───────────────────────────────────────────── */}
      {block.type === "comparisonTable" && (
        <>
          <Section title="Columns" action={<AddButton onClick={() => onChange(addBlockItem(spec, blockId, "columns"))} />}>
            {block.columns.map((c: any, i: number) => (
              <Box key={c.id} sx={{ display: "flex", gap: 0.5, alignItems: "center", mb: 0.5 }}>
                <TextField value={c.label.text} onCommit={(v) => set(`columns.${i}.label.text`, v)} />
                <input
                  type="checkbox"
                  checked={!!c.highlight}
                  title="Highlight column"
                  onChange={(e) => set(`columns.${i}.highlight`, e.target.checked)}
                />
                <RowActions
                  onRemove={() => onChange(removeBlockItem(spec, blockId, i, "columns"))}
                  canRemove={block.columns.length > 1}
                />
              </Box>
            ))}
          </Section>

          <Section title="Rows" action={<AddButton onClick={() => onChange(addBlockItem(spec, blockId, "rows"))} />}>
            {block.rows.map((r: any, ri: number) => (
              <Box key={r.id} sx={{ mb: 1, p: 1, border: `1px solid ${PANEL.border}`, borderRadius: "8px" }}>
                <Box sx={{ display: "flex", gap: 0.5, alignItems: "center", mb: 0.5 }}>
                  <TextField value={r.label.text} onCommit={(v) => set(`rows.${ri}.label.text`, v)} />
                  <RowActions
                    onRemove={() => onChange(removeBlockItem(spec, blockId, ri, "rows"))}
                    canRemove={block.rows.length > 1}
                  />
                </Box>
                <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 0.5 }}>
                  {block.columns.map((c: any, ci: number) => (
                    <Box key={c.id}>
                      <Typography sx={{ fontSize: 9, color: PANEL.textFaint }}>{c.label.text}</Typography>
                      <SmallSelect
                        value={["yes", "no", "partial"].includes(r.cells[ci]) ? r.cells[ci] : "text"}
                        options={[
                          { value: "yes", label: "✓ Yes" },
                          { value: "no", label: "✗ No" },
                          { value: "partial", label: "– Partial" },
                          { value: "text", label: "Text…" },
                        ]}
                        onChange={(v) => set(`rows.${ri}.cells.${ci}`, v === "text" ? "" : v)}
                      />
                      {!["yes", "no", "partial"].includes(r.cells[ci]) && (
                        <TextField
                          value={r.cells[ci] ?? ""}
                          onCommit={(v) => set(`rows.${ri}.cells.${ci}`, v)}
                        />
                      )}
                    </Box>
                  ))}
                </Box>
              </Box>
            ))}
          </Section>
        </>
      )}

      {/* ── Generic list items ─────────────────────────────────────────── */}
      {isList && block.type !== "donutChart" && block.type !== "scatterQuadrant" && (
        <Section
          title="Items"
          action={<AddButton onClick={() => onChange(addBlockItem(spec, blockId))} />}
        >
          {block.items.map((it: any, i: number) => (
            <Box key={it.id} sx={{ mb: 1, p: 1, border: `1px solid ${PANEL.border}`, borderRadius: "8px" }}>
              <Box sx={{ display: "flex", gap: 0.5, alignItems: "center", mb: 0.5 }}>
                {"icon" in it && (
                  <IconPicker value={it.icon} onChange={(n) => set(`items.${i}.icon`, n)} />
                )}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontSize: 11, color: PANEL.textMuted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {it.label?.text ?? it.title?.text ?? it.name?.text ?? it.value?.text ?? it.phase?.text ?? `Item ${i + 1}`}
                  </Typography>
                </Box>
                <RowActions
                  onUp={i > 0 ? () => onChange(moveBlockItem(spec, blockId, i, i - 1)) : undefined}
                  onDown={
                    i < block.items.length - 1
                      ? () => onChange(moveBlockItem(spec, blockId, i, i + 1))
                      : undefined
                  }
                  onRemove={() => onChange(removeBlockItem(spec, blockId, i))}
                  canRemove={block.items.length > 1}
                />
              </Box>

              {/* Image prompt / url for item types that carry one. */}
              {("prompt" in it || "photoPrompt" in it) && (
                <Box sx={{ mt: 0.5 }}>
                  <Typography sx={{ fontSize: 9, color: PANEL.textFaint }}>Image URL</Typography>
                  <TextField
                    value={it.url ?? it.photoUrl ?? ""}
                    placeholder="Paste an image URL"
                    onCommit={(v) =>
                      set("photoPrompt" in it ? `items.${i}.photoUrl` : `items.${i}.url`, v || undefined)
                    }
                  />
                  <Typography sx={{ fontSize: 9, color: PANEL.textFaint, mt: 0.5 }}>
                    Generation prompt
                  </Typography>
                  <TextField
                    value={it.prompt ?? it.photoPrompt ?? ""}
                    onCommit={(v) =>
                      set("photoPrompt" in it ? `items.${i}.photoPrompt` : `items.${i}.prompt`, v)
                    }
                  />
                </Box>
              )}
            </Box>
          ))}
        </Section>
      )}

      {/* ── Image blocks ───────────────────────────────────────────────── */}
      {(block.type === "image" || block.type === "deviceMockup") && (
        <Section title="Image">
          <Typography sx={{ fontSize: 10, color: PANEL.textFaint, mb: 0.5 }}>Image URL</Typography>
          <TextField
            value={block.url ?? ""}
            placeholder="Paste an image URL"
            onCommit={(v) => set("url", v || undefined)}
          />

          <Typography sx={{ fontSize: 10, color: PANEL.textFaint, mt: 1, mb: 0.5 }}>
            Generation prompt
          </Typography>
          <TextField value={block.prompt ?? ""} onCommit={(v) => set("prompt", v)} />

          {block.type === "image" && (
            <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontSize: 10, color: PANEL.textFaint, mb: 0.5 }}>Fit</Typography>
                <SmallSelect
                  value={block.fit ?? "cover"}
                  options={[
                    { value: "cover", label: "Cover" },
                    { value: "contain", label: "Contain" },
                  ]}
                  onChange={(v) => set("fit", v)}
                />
              </Box>
            </Box>
          )}

          {block.type === "deviceMockup" && (
            <Box sx={{ mt: 1 }}>
              <Typography sx={{ fontSize: 10, color: PANEL.textFaint, mb: 0.5 }}>Device</Typography>
              <SmallSelect
                value={block.device}
                options={[
                  { value: "phone", label: "Phone" },
                  { value: "laptop", label: "Laptop" },
                  { value: "browser", label: "Browser" },
                  { value: "tablet", label: "Tablet" },
                ]}
                onChange={(v) => set("device", v)}
              />
            </Box>
          )}
        </Section>
      )}

      {/* ── Process flow / timeline options ────────────────────────────── */}
      {block.type === "processFlow" && (
        <Section title="Options">
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
            <input
              type="checkbox"
              checked={!!block.numbered}
              onChange={(e) => set("numbered", e.target.checked)}
            />
            <Typography sx={{ fontSize: 11, color: PANEL.textMuted }}>Numbered steps</Typography>
          </Box>
        </Section>
      )}

      {block.type === "timeline" && (
        <Section title="Options">
          <SmallSelect
            value={block.orientation ?? "horizontal"}
            options={[
              { value: "horizontal", label: "Horizontal" },
              { value: "vertical", label: "Vertical" },
            ]}
            onChange={(v) => set("orientation", v)}
          />
        </Section>
      )}

      <Typography sx={{ fontSize: 10, color: PANEL.textFaint, mt: 2, lineHeight: 1.5 }}>
        Type directly on the slide to edit wording. Fonts, sizes and colours come
        from the template theme so the deck stays consistent.
      </Typography>
    </Box>
  );
};

export default BlockInspector;
