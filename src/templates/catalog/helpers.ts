/**
 * Authoring helpers for template manifests.
 *
 * Template files are the bulk of this system, so they should read like the
 * slide they describe. These keep the ids stable and the noise down.
 */

import type {
  BarChartBlock,
  BigStatBlock,
  CalloutBandBlock,
  MetricRowBlock,
  NumberedListBlock,
  SpotlightBlock,
  Block,
  ChecklistBlock,
  ComparisonTableBlock,
  ContactFooterBlock,
  CtaButtonBlock,
  DeviceMockupBlock,
  DonutChartBlock,
  HeadingBlock,
  IconBulletsBlock,
  IconGridBlock,
  ImageBlock,
  ImageGridBlock,
  Iso3dBlock,
  LogoWallBlock,
  NestedCirclesBlock,
  ParagraphBlock,
  PillarsBlock,
  PricingTableBlock,
  ProcessFlowBlock,
  QuoteBlock,
  RichText,
  RoadmapPhasesBlock,
  ScatterQuadrantBlock,
  SlideSpec,
  StatCardsBlock,
  TeamCardsBlock,
  TimelineBlock,
  VennBlock,
} from "../types";

/** Shorthand for an editable text field. */
export const rt = (id: string, text: string): RichText => ({ id, text });

let seq = 0;
const nextId = (prefix: string) => `${prefix}-${++seq}`;

type Common = Pick<Block, "slot" | "grow" | "style">;

export const heading = (
  o: { kicker?: string; title: string; subtitle?: string } & Common
): HeadingBlock => {
  const id = nextId("h");
  return {
    id,
    type: "heading",
    slot: o.slot,
    grow: o.grow,
    style: o.style,
    kicker: o.kicker ? rt("kicker", o.kicker) : undefined,
    title: rt("title", o.title),
    subtitle: o.subtitle ? rt("subtitle", o.subtitle) : undefined,
  };
};

export const paragraph = (o: { body: string } & Common): ParagraphBlock => ({
  id: nextId("p"),
  type: "paragraph",
  slot: o.slot,
  grow: o.grow,
  style: o.style,
  body: rt("body", o.body),
});

export const iconBullets = (
  o: { items: Array<{ icon?: string; label: string; body?: string }> } & Common
): IconBulletsBlock => ({
  id: nextId("ib"),
  type: "iconBullets",
  slot: o.slot,
  grow: o.grow,
  style: o.style,
  items: o.items.map((it, i) => ({
    id: `i${i}`,
    icon: it.icon,
    label: rt("label", it.label),
    body: it.body ? rt("body", it.body) : undefined,
  })),
});

export const checklist = (o: { items: string[] } & Common): ChecklistBlock => ({
  id: nextId("cl"),
  type: "checklist",
  slot: o.slot,
  grow: o.grow,
  style: o.style,
  items: o.items.map((label, i) => ({ id: `i${i}`, label: rt("label", label) })),
});

export const quote = (
  o: { quote: string; author?: string; role?: string; avatarPrompt?: string } & Common
): QuoteBlock => ({
  id: nextId("q"),
  type: "quote",
  slot: o.slot,
  grow: o.grow,
  style: o.style,
  quote: rt("quote", o.quote),
  author: o.author ? rt("author", o.author) : undefined,
  role: o.role ? rt("role", o.role) : undefined,
  avatarPrompt: o.avatarPrompt,
});

export const statCards = (
  o: { items: Array<{ icon?: string; value: string; label: string; delta?: string }> } & Common
): StatCardsBlock => ({
  id: nextId("sc"),
  type: "statCards",
  slot: o.slot,
  grow: o.grow,
  style: o.style,
  items: o.items.map((it, i) => ({
    id: `i${i}`,
    icon: it.icon,
    value: rt("value", it.value),
    label: rt("label", it.label),
    delta: it.delta ? rt("delta", it.delta) : undefined,
  })),
});

export const chart = (
  o: {
    kind?: "barChart" | "lineChart" | "comboChart";
    categories: string[];
    series: Array<{ name: string; values: number[]; accent?: 1 | 2 | 3 | 4; kind?: "bar" | "line" }>;
    yFormat?: BarChartBlock["yFormat"];
    caption?: string;
  } & Common
): BarChartBlock => ({
  id: nextId("ch"),
  type: o.kind ?? "barChart",
  slot: o.slot,
  grow: o.grow,
  style: o.style,
  categories: o.categories,
  yFormat: o.yFormat,
  caption: o.caption ? rt("caption", o.caption) : undefined,
  series: o.series.map((s, i) => ({
    id: `s${i}`,
    name: s.name,
    values: s.values,
    accent: s.accent,
    kind: s.kind,
  })),
});

export const donut = (
  o: { centerValue?: string; centerLabel?: string; items: Array<{ label: string; value: number }> } & Common
): DonutChartBlock => ({
  id: nextId("dn"),
  type: "donutChart",
  slot: o.slot,
  grow: o.grow,
  style: o.style,
  centerValue: o.centerValue ? rt("centerValue", o.centerValue) : undefined,
  centerLabel: o.centerLabel ? rt("centerLabel", o.centerLabel) : undefined,
  items: o.items.map((it, i) => ({ id: `i${i}`, label: rt("label", it.label), value: it.value })),
});

export const scatter = (
  o: {
    xAxis: { low: string; high: string };
    yAxis: { low: string; high: string };
    points: Array<{ label: string; x: number; y: number; highlight?: boolean }>;
  } & Common
): ScatterQuadrantBlock => ({
  id: nextId("sq"),
  type: "scatterQuadrant",
  slot: o.slot,
  grow: o.grow,
  style: o.style,
  xAxis: o.xAxis,
  yAxis: o.yAxis,
  points: o.points.map((p, i) => ({
    id: `p${i}`,
    label: rt("label", p.label),
    x: p.x,
    y: p.y,
    highlight: p.highlight,
  })),
});

export const nestedCircles = (
  o: { items: Array<{ value: string; label: string }> } & Common
): NestedCirclesBlock => ({
  id: nextId("nc"),
  type: "nestedCircles",
  slot: o.slot,
  grow: o.grow,
  style: o.style,
  items: o.items.map((it, i) => ({
    id: `i${i}`,
    value: rt("value", it.value),
    label: rt("label", it.label),
  })),
});

export const venn = (
  o: { items: Array<{ label: string; body?: string }>; centerLabel?: string } & Common
): VennBlock => ({
  id: nextId("vn"),
  type: "venn",
  slot: o.slot,
  grow: o.grow,
  style: o.style,
  centerLabel: o.centerLabel ? rt("centerLabel", o.centerLabel) : undefined,
  items: o.items.map((it, i) => ({
    id: `i${i}`,
    label: rt("label", it.label),
    body: it.body ? rt("body", it.body) : undefined,
  })),
});

export const pillars = (
  o: { items: Array<{ icon?: string; title: string; body?: string }> } & Common
): PillarsBlock => ({
  id: nextId("pl"),
  type: "pillars",
  slot: o.slot,
  grow: o.grow,
  style: o.style,
  items: o.items.map((it, i) => ({
    id: `i${i}`,
    icon: it.icon,
    title: rt("title", it.title),
    body: it.body ? rt("body", it.body) : undefined,
  })),
});

export const processFlow = (
  o: {
    items: Array<{ icon?: string; title: string; body?: string }>;
    loopLabel?: string;
    numbered?: boolean;
  } & Common
): ProcessFlowBlock => ({
  id: nextId("pf"),
  type: "processFlow",
  slot: o.slot,
  grow: o.grow,
  style: o.style,
  numbered: o.numbered,
  loopLabel: o.loopLabel ? rt("loopLabel", o.loopLabel) : undefined,
  items: o.items.map((it, i) => ({
    id: `i${i}`,
    icon: it.icon,
    title: rt("title", it.title),
    body: it.body ? rt("body", it.body) : undefined,
  })),
});

export const timeline = (
  o: {
    orientation?: "horizontal" | "vertical";
    items: Array<{ icon?: string; date: string; title: string; body?: string }>;
  } & Common
): TimelineBlock => ({
  id: nextId("tl"),
  type: "timeline",
  slot: o.slot,
  grow: o.grow,
  style: o.style,
  orientation: o.orientation,
  items: o.items.map((it, i) => ({
    id: `i${i}`,
    icon: it.icon,
    date: rt("date", it.date),
    title: rt("title", it.title),
    body: it.body ? rt("body", it.body) : undefined,
  })),
});

export const roadmapPhases = (
  o: { items: Array<{ icon?: string; phase: string; period: string; points: string[] }> } & Common
): RoadmapPhasesBlock => ({
  id: nextId("rp"),
  type: "roadmapPhases",
  slot: o.slot,
  grow: o.grow,
  style: o.style,
  items: o.items.map((it, i) => ({
    id: `i${i}`,
    icon: it.icon,
    phase: rt("phase", it.phase),
    period: rt("period", it.period),
    points: it.points.map((p, pi) => ({ id: `p${pi}`, label: rt("label", p) })),
  })),
});

export const iconGrid = (
  o: { items: Array<{ icon?: string; title: string; body?: string }> } & Common
): IconGridBlock => ({
  id: nextId("ig"),
  type: "iconGrid",
  slot: o.slot,
  grow: o.grow,
  style: o.style,
  items: o.items.map((it, i) => ({
    id: `i${i}`,
    icon: it.icon,
    title: rt("title", it.title),
    body: it.body ? rt("body", it.body) : undefined,
  })),
});

export const comparisonTable = (
  o: {
    columns: Array<{ label: string; highlight?: boolean }>;
    rows: Array<{ label: string; cells: Array<"yes" | "no" | "partial" | string> }>;
  } & Common
): ComparisonTableBlock => ({
  id: nextId("ct"),
  type: "comparisonTable",
  slot: o.slot,
  grow: o.grow,
  style: o.style,
  columns: o.columns.map((c, i) => ({ id: `c${i}`, label: rt("label", c.label), highlight: c.highlight })),
  rows: o.rows.map((r, i) => ({ id: `r${i}`, label: rt("label", r.label), cells: r.cells })),
});

export const pricingTable = (
  o: {
    plans: Array<{
      name: string;
      price: string;
      period?: string;
      badge?: string;
      features: string[];
      cta?: string;
      highlight?: boolean;
    }>;
  } & Common
): PricingTableBlock => ({
  id: nextId("pt"),
  type: "pricingTable",
  slot: o.slot,
  grow: o.grow,
  style: o.style,
  plans: o.plans.map((p, i) => ({
    id: `p${i}`,
    name: rt("name", p.name),
    price: rt("price", p.price),
    period: p.period ? rt("period", p.period) : undefined,
    badge: p.badge ? rt("badge", p.badge) : undefined,
    cta: p.cta ? rt("cta", p.cta) : undefined,
    highlight: p.highlight,
    features: p.features.map((f, fi) => ({ id: `f${fi}`, label: rt("label", f) })),
  })),
});

export const teamCards = (
  o: {
    items: Array<{
      name: string;
      role: string;
      bio?: string;
      /** A real photograph. Falls back to photoPrompt when absent. */
      photoUrl?: string;
      photoPrompt?: string;
    }>;
  } & Common
): TeamCardsBlock => ({
  id: nextId("tc"),
  type: "teamCards",
  slot: o.slot,
  grow: o.grow,
  style: o.style,
  items: o.items.map((it, i) => ({
    id: `i${i}`,
    name: rt("name", it.name),
    role: rt("role", it.role),
    bio: it.bio ? rt("bio", it.bio) : undefined,
    photoUrl: it.photoUrl,
    photoPrompt: it.photoPrompt,
  })),
});

export const logoWall = (o: { items: string[] } & Common): LogoWallBlock => ({
  id: nextId("lw"),
  type: "logoWall",
  slot: o.slot,
  grow: o.grow,
  style: o.style,
  items: o.items.map((n, i) => ({ id: `i${i}`, name: rt("name", n) })),
});

export const contactFooter = (
  o: { items: Array<{ icon?: string; label: string }> } & Common
): ContactFooterBlock => ({
  id: nextId("cf"),
  type: "contactFooter",
  slot: o.slot,
  grow: o.grow,
  style: o.style,
  items: o.items.map((it, i) => ({ id: `i${i}`, icon: it.icon, label: rt("label", it.label) })),
});

export const cta = (o: { label: string } & Common): CtaButtonBlock => ({
  id: nextId("cta"),
  type: "ctaButton",
  slot: o.slot,
  grow: o.grow,
  style: o.style,
  label: rt("label", o.label),
});

export const image = (
  o: { prompt?: string; url?: string; fit?: "cover" | "contain"; caption?: string; scrim?: number } & Common
): ImageBlock => ({
  id: nextId("img"),
  type: "image",
  slot: o.slot,
  grow: o.grow ?? 1,
  style: o.style,
  prompt: o.prompt,
  url: o.url,
  fit: o.fit,
  scrim: o.scrim,
  caption: o.caption ? rt("caption", o.caption) : undefined,
});

export const imageGrid = (
  o: {
    items: Array<{ url?: string; prompt?: string; icon?: string; title?: string; body?: string }>;
  } & Common
): ImageGridBlock => ({
  id: nextId("igr"),
  type: "imageGrid",
  slot: o.slot,
  grow: o.grow,
  style: o.style,
  items: o.items.map((it, i) => ({
    id: `i${i}`,
    url: it.url,
    prompt: it.prompt,
    icon: it.icon,
    title: it.title ? rt("title", it.title) : undefined,
    body: it.body ? rt("body", it.body) : undefined,
  })),
});

export const device = (
  o: { device: DeviceMockupBlock["device"]; prompt?: string } & Common
): DeviceMockupBlock => ({
  id: nextId("dev"),
  type: "deviceMockup",
  slot: o.slot,
  grow: o.grow ?? 1,
  style: o.style,
  device: o.device,
  prompt: o.prompt,
});

export const slide = (o: SlideSpec): SlideSpec => o;

// ─────────────────────────────────────────────────────────────────────────────
// Visual blocks
// ─────────────────────────────────────────────────────────────────────────────

export const bigStat = (
  o: { value: string; unit?: string; label: string; body?: string; ghost?: boolean } & Common
): BigStatBlock => ({
  id: nextId("bs"),
  type: "bigStat",
  slot: o.slot,
  grow: o.grow,
  style: o.style,
  value: rt("value", o.value),
  unit: o.unit ? rt("unit", o.unit) : undefined,
  label: rt("label", o.label),
  body: o.body ? rt("body", o.body) : undefined,
  ghost: o.ghost,
});

export const callout = (
  o: { icon?: string; statement: string; detail?: string; solid?: boolean } & Common
): CalloutBandBlock => ({
  id: nextId("cb"),
  type: "calloutBand",
  slot: o.slot,
  grow: o.grow,
  style: o.style,
  icon: o.icon,
  statement: rt("statement", o.statement),
  detail: o.detail ? rt("detail", o.detail) : undefined,
  solid: o.solid,
});

export const spotlight = (
  o: {
    prompt?: string;
    url?: string;
    cardTitle?: string;
    cardBody?: string;
    stat?: { value: string; label: string };
    duotone?: boolean;
  } & Common
): SpotlightBlock => ({
  id: nextId("sp"),
  type: "spotlight",
  slot: o.slot,
  grow: o.grow ?? 1,
  style: o.style,
  prompt: o.prompt,
  url: o.url,
  duotone: o.duotone,
  cardTitle: o.cardTitle ? rt("cardTitle", o.cardTitle) : undefined,
  cardBody: o.cardBody ? rt("cardBody", o.cardBody) : undefined,
  stat: o.stat ? { value: rt("value", o.stat.value), label: rt("label", o.stat.label) } : undefined,
});

export const numbered = (
  o: { items: Array<{ title: string; body?: string }> } & Common
): NumberedListBlock => ({
  id: nextId("nl"),
  type: "numberedList",
  slot: o.slot,
  grow: o.grow,
  style: o.style,
  items: o.items.map((it, i) => ({
    id: `i${i}`,
    title: rt("title", it.title),
    body: it.body ? rt("body", it.body) : undefined,
  })),
});

export const metricRow = (
  o: { items: Array<{ value: string; label: string }> } & Common
): MetricRowBlock => ({
  id: nextId("mr"),
  type: "metricRow",
  slot: o.slot,
  grow: o.grow,
  style: o.style,
  items: o.items.map((it, i) => ({
    id: `i${i}`,
    value: rt("value", it.value),
    label: rt("label", it.label),
  })),
});

export const iso3d = (
  o: {
    items: Array<{
      asset: string;
      title: string;
      body?: string;
      value?: string;
      accent?: 1 | 2 | 3 | 4;
    }>;
    scale?: number;
    divided?: boolean;
  } & Common
): Iso3dBlock => ({
  id: nextId("iso"),
  type: "iso3d",
  slot: o.slot,
  grow: o.grow,
  style: o.style,
  scale: o.scale,
  divided: o.divided,
  items: o.items.map((it, i) => ({
    id: `i${i}`,
    asset: it.asset,
    accent: it.accent,
    title: rt("title", it.title),
    body: it.body ? rt("body", it.body) : undefined,
    value: it.value ? rt("value", it.value) : undefined,
  })),
});
