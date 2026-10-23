/**
 * Block-based slide templates.
 *
 * A slide is not hand-written JSX any more. It is a `SlideSpec`: a layout plus
 * an ordered list of typed blocks. Blocks render from data, read their styling
 * from the active `TemplateTheme`, and are individually editable.
 *
 * This is what makes 50 templates x ~15 slides tractable — the components are
 * written once, and each template is a manifest.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Theme
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Semantic colour roles. Deliberately NOT "artPalette[0..4]" — a block asks for
 * `accent` or `textMuted`, never "the third colour", so a theme swap can never
 * put dark text on a dark surface.
 */
export interface ThemePalette {
  /** Page background. */
  bg: string;
  /** Slightly raised background used for the body of cards. */
  surface: string;
  /** A second surface tone, for zebra rows and nested cards. */
  surfaceAlt: string;
  /** Hairlines, dividers, card outlines. */
  border: string;

  text: string;
  textMuted: string;
  /** Text placed on top of `accent`. */
  onAccent: string;
  /** Text placed on top of a photograph or dark scrim. */
  onImage: string;

  accent: string;
  accent2: string;
  accent3: string;
  accent4: string;

  /** Semantic feedback colours, used by comparison tables and status chips. */
  positive: string;
  negative: string;
  warning: string;
}

export type CardStyle =
  | "flat"        // filled surface, no border, no shadow
  | "outlined"    // surface + 1px border
  | "elevated"    // surface + soft shadow
  | "glass"       // translucent + blur (use sparingly: does not survive export)
  | "brutalist"   // hard 2px border + hard offset shadow
  | "tinted";     // accent-tinted wash

export type IconStyle =
  | "filledCircle"
  | "softSquare"
  | "outline"
  | "plainGlyph"
  | "none";

export type HeadingStyle =
  | "plain"
  | "kickerRule"   // small accent rule above the heading
  | "underline"    // accent underline beneath
  | "numbered"     // slide number chip beside the heading
  | "sideBar";     // vertical accent bar to the left

export type CoverStyle =
  | "fullImage"    // full-bleed photo + scrim
  | "splitImage"   // half type, half image
  | "gradient"     // gradient field, no photo
  | "typeLed"      // typography only, oversized
  | "geometric";   // shapes/motif driven

/**
 * Slide background decoration.
 *
 * The first six are the original CSS-based motifs: soft glows and tiled
 * grids. They are kept so existing themes keep rendering, but they read as
 * machine-made -- symmetrical, evenly weighted, fading to nothing.
 *
 * The names after them are drawn SVG assets in `decor.tsx`, built on the
 * opposite principles: hard edges, asymmetry, shapes cropped by the canvas.
 * Prefer those for new themes.
 */
export type Motif =
  // Original CSS motifs
  | "none"
  | "blob"
  | "grid"
  | "diagonal"
  | "dots"
  | "arc"
  | "topography"
  // Drawn SVG assets
  | "archStack"
  | "cornerWedge"
  | "ribbon"
  | "concentric"
  | "halfMoon"
  | "hatch"
  | "scatter"
  | "contour"
  | "blobCut"
  | "ruleMark"
  | "brokenFrame"
  | "isoFloor"
  // Mesh layers: depth behind the content rather than a shape on it.
  | "meshField"
  | "meshPlane"
  | "meshLattice"
  | "meshBands";

/**
 * A template's complete visual identity. Two templates sharing every block can
 * still look unrelated by differing here — which is how 50 visually distinct
 * templates are produced without 750 bespoke components.
 */
export interface TemplateTheme {
  id: string;
  name: string;
  mode: "light" | "dark";
  palette: ThemePalette;

  fonts: {
    /** Headings. */
    display: string;
    /** Body copy. */
    body: string;
    /** Optional: numerals in stat blocks and charts. */
    numeric?: string;
  };

  /** Multiplier applied to the base type scale. 1 = default. */
  typeScale: number;
  /** Multiplier applied to the base spacing scale. */
  density: number;

  radius: "none" | "sm" | "md" | "lg" | "pill";
  cardStyle: CardStyle;
  iconStyle: IconStyle;
  headingStyle: HeadingStyle;
  coverStyle: CoverStyle;
  motif: Motif;

  /** Uppercase + letterspace section kickers. */
  uppercaseKickers?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Blocks
// ─────────────────────────────────────────────────────────────────────────────

export type BlockType =
  // text
  | "heading"
  | "paragraph"
  | "iconBullets"
  | "checklist"
  | "quote"
  // data
  | "statCards"
  | "barChart"
  | "lineChart"
  | "comboChart"
  | "donutChart"
  | "scatterQuadrant"
  | "nestedCircles"
  | "venn"
  // structure
  | "pillars"
  | "processFlow"
  | "timeline"
  | "roadmapPhases"
  | "iconGrid"
  // tables
  | "comparisonTable"
  | "pricingTable"
  // people & brand
  | "teamCards"
  | "logoWall"
  | "contactFooter"
  | "ctaButton"
  // media
  | "image"
  | "imageGrid"
  | "deviceMockup"
  | "bigStat"
  | "calloutBand"
  | "spotlight"
  | "numberedList"
  | "metricRow"
  | "iso3d"
  | "spacer";

/** Where a block sits. Slots are resolved by the layout. */
export type SlotName = "main" | "aside" | "full" | "footer";

/**
 * Absolute placement on the 960x540 stage.
 *
 * A block with a frame leaves the layout engine entirely and is positioned,
 * sized, rotated and stacked by hand — the free-canvas mode. Without one it
 * flows in its slot as before, so a deck can mix both.
 */
export interface BlockFrame {
  x: number;
  y: number;
  w: number;
  h: number;
  /** Degrees, clockwise. */
  rotation?: number;
  /** Stacking order among framed blocks. */
  z?: number;
}

export interface BlockBase {
  id: string;
  type: BlockType;
  slot?: SlotName;
  /** Present once the block has been unlocked from the layout. */
  frame?: BlockFrame;
  /** Flex grow within its slot. Defaults to 0 (natural height). */
  grow?: number;
  /** Per-block style overrides, merged over the theme. */
  style?: Partial<{
    cardStyle: CardStyle;
    align: "left" | "center" | "right";
    columns: number;
    compact: boolean;
    accentIndex: number;
  }>;
}

/** An editable text field. `id` is stable so edits map back to the block. */
export interface RichText {
  id: string;
  text: string;
}

export interface HeadingBlock extends BlockBase {
  type: "heading";
  kicker?: RichText;
  title: RichText;
  subtitle?: RichText;
}

export interface ParagraphBlock extends BlockBase {
  type: "paragraph";
  body: RichText;
}

export interface IconBulletsBlock extends BlockBase {
  type: "iconBullets";
  items: Array<{
    id: string;
    icon?: string;
    label: RichText;
    body?: RichText;
  }>;
}

export interface ChecklistBlock extends BlockBase {
  type: "checklist";
  items: Array<{ id: string; label: RichText }>;
}

export interface QuoteBlock extends BlockBase {
  type: "quote";
  quote: RichText;
  author?: RichText;
  role?: RichText;
  avatarUrl?: string;
  /** Prompt hint for the image pipeline when `avatarUrl` is absent. */
  avatarPrompt?: string;
}

export interface StatCardsBlock extends BlockBase {
  type: "statCards";
  items: Array<{
    id: string;
    icon?: string;
    value: RichText;
    label: RichText;
    delta?: RichText;
  }>;
}

export interface ChartSeries {
  id: string;
  name: string;
  /** Which accent role to paint with. */
  accent?: 1 | 2 | 3 | 4;
  kind?: "bar" | "line";
  values: number[];
}

export interface BarChartBlock extends BlockBase {
  type: "barChart" | "lineChart" | "comboChart";
  categories: string[];
  series: ChartSeries[];
  yFormat?: "plain" | "compact" | "currency" | "percent";
  caption?: RichText;
}

export interface DonutChartBlock extends BlockBase {
  type: "donutChart";
  centerValue?: RichText;
  centerLabel?: RichText;
  items: Array<{ id: string; label: RichText; value: number }>;
}

export interface ScatterQuadrantBlock extends BlockBase {
  type: "scatterQuadrant";
  xAxis: { low: string; high: string };
  yAxis: { low: string; high: string };
  points: Array<{
    id: string;
    label: RichText;
    /** 0..1 within the plot area. */
    x: number;
    y: number;
    highlight?: boolean;
  }>;
}

export interface NestedCirclesBlock extends BlockBase {
  type: "nestedCircles";
  /** Outermost first, e.g. TAM -> SAM -> SOM. */
  items: Array<{ id: string; value: RichText; label: RichText }>;
}

export interface VennBlock extends BlockBase {
  type: "venn";
  items: Array<{ id: string; label: RichText; body?: RichText }>;
  centerLabel?: RichText;
}

export interface PillarsBlock extends BlockBase {
  type: "pillars";
  items: Array<{
    id: string;
    icon?: string;
    title: RichText;
    body?: RichText;
  }>;
}

export interface ProcessFlowBlock extends BlockBase {
  type: "processFlow";
  items: Array<{
    id: string;
    icon?: string;
    title: RichText;
    body?: RichText;
  }>;
  /** Text on the loop-back arrow, e.g. "Continuous Innovation". */
  loopLabel?: RichText;
  numbered?: boolean;
}

export interface TimelineBlock extends BlockBase {
  type: "timeline";
  orientation?: "horizontal" | "vertical";
  items: Array<{
    id: string;
    icon?: string;
    date: RichText;
    title: RichText;
    body?: RichText;
  }>;
}

export interface RoadmapPhasesBlock extends BlockBase {
  type: "roadmapPhases";
  items: Array<{
    id: string;
    icon?: string;
    phase: RichText;
    period: RichText;
    points: Array<{ id: string; label: RichText }>;
  }>;
}

export interface IconGridBlock extends BlockBase {
  type: "iconGrid";
  items: Array<{
    id: string;
    icon?: string;
    title: RichText;
    body?: RichText;
  }>;
}

export interface ComparisonTableBlock extends BlockBase {
  type: "comparisonTable";
  columns: Array<{ id: string; label: RichText; highlight?: boolean }>;
  rows: Array<{
    id: string;
    label: RichText;
    /** One cell per column: a mark or free text. */
    cells: Array<"yes" | "no" | "partial" | string>;
  }>;
}

export interface PricingTableBlock extends BlockBase {
  type: "pricingTable";
  plans: Array<{
    id: string;
    name: RichText;
    price: RichText;
    period?: RichText;
    badge?: RichText;
    features: Array<{ id: string; label: RichText }>;
    cta?: RichText;
    highlight?: boolean;
  }>;
}

export interface TeamCardsBlock extends BlockBase {
  type: "teamCards";
  items: Array<{
    id: string;
    name: RichText;
    role: RichText;
    bio?: RichText;
    photoUrl?: string;
    photoPrompt?: string;
    showSocial?: boolean;
  }>;
}

export interface LogoWallBlock extends BlockBase {
  type: "logoWall";
  items: Array<{ id: string; name: RichText; logoUrl?: string }>;
}

export interface ContactFooterBlock extends BlockBase {
  type: "contactFooter";
  items: Array<{ id: string; icon?: string; label: RichText }>;
}

export interface CtaButtonBlock extends BlockBase {
  type: "ctaButton";
  label: RichText;
}

export interface ImageBlock extends BlockBase {
  type: "image";
  url?: string;
  /** Fed to the backend image pipeline when `url` is absent. */
  prompt?: string;
  fit?: "cover" | "contain";
  /** Dark scrim strength for text placed over the image, 0..1. */
  scrim?: number;
  caption?: RichText;
}

export interface ImageGridBlock extends BlockBase {
  type: "imageGrid";
  items: Array<{
    id: string;
    url?: string;
    prompt?: string;
    icon?: string;
    title?: RichText;
    body?: RichText;
  }>;
}

export interface DeviceMockupBlock extends BlockBase {
  type: "deviceMockup";
  device: "phone" | "laptop" | "tablet" | "browser";
  url?: string;
  prompt?: string;
}

export interface SpacerBlock extends BlockBase {
  type: "spacer";
  size?: number;
}

export interface BigStatBlock extends BlockBase {
  type: "bigStat";
  value: RichText;
  unit?: RichText;
  label: RichText;
  body?: RichText;
  /** Draws the value again, oversized and faint, behind the block. */
  ghost?: boolean;
}

export interface CalloutBandBlock extends BlockBase {
  type: "calloutBand";
  icon?: string;
  statement: RichText;
  detail?: RichText;
  /** Solid accent fill rather than a tint. */
  solid?: boolean;
}

export interface SpotlightBlock extends BlockBase {
  type: "spotlight";
  url?: string;
  prompt?: string;
  /** Card that overlaps the image, giving the slide depth. */
  cardTitle?: RichText;
  cardBody?: RichText;
  stat?: { value: RichText; label: RichText };
  /** Tints the photograph into the theme palette. */
  duotone?: boolean;
}

export interface NumberedListBlock extends BlockBase {
  type: "numberedList";
  items: Array<{ id: string; title: RichText; body?: RichText }>;
}

export interface MetricRowBlock extends BlockBase {
  type: "metricRow";
  items: Array<{ id: string; value: RichText; label: RichText }>;
}

/**
 * A row of 3D objects from `assets3d.tsx`, each with a label.
 *
 * The objects are built from flat divs and carry an invisible export hull,
 * so they render as shaded faces in the browser and arrive in PowerPoint as
 * real cube, can and hexagon geometry the customer can still edit.
 */
export interface Iso3dBlock extends BlockBase {
  type: "iso3d";
  items: Array<{
    id: string;
    /** A key from ASSETS_3D. An unknown name falls back to a plain block. */
    asset: string;
    title: RichText;
    body?: RichText;
    /** Optional figure, set above the title. */
    value?: RichText;
    /** Accent role to paint the object with. Defaults to its position. */
    accent?: 1 | 2 | 3 | 4;
  }>;
  /** Object width in px on the 960x540 stage. */
  scale?: number;
  /** Hairline rules between the columns, as in the band layout. */
  divided?: boolean;
}

export type Block =
  | HeadingBlock
  | ParagraphBlock
  | IconBulletsBlock
  | ChecklistBlock
  | QuoteBlock
  | StatCardsBlock
  | BarChartBlock
  | DonutChartBlock
  | ScatterQuadrantBlock
  | NestedCirclesBlock
  | VennBlock
  | PillarsBlock
  | ProcessFlowBlock
  | TimelineBlock
  | RoadmapPhasesBlock
  | IconGridBlock
  | ComparisonTableBlock
  | PricingTableBlock
  | TeamCardsBlock
  | LogoWallBlock
  | ContactFooterBlock
  | CtaButtonBlock
  | ImageBlock
  | ImageGridBlock
  | DeviceMockupBlock
  | BigStatBlock
  | CalloutBandBlock
  | SpotlightBlock
  | NumberedListBlock
  | MetricRowBlock
  | Iso3dBlock
  | SpacerBlock;

// ─────────────────────────────────────────────────────────────────────────────
// Slides & templates
// ─────────────────────────────────────────────────────────────────────────────

export type SlideLayout =
  /** Cover treatment; driven by `theme.coverStyle`. */
  | "cover"
  /** Single column, content stacked. */
  | "stack"
  /** Content left, aside right (default 58/42). */
  | "splitRight"
  /** Aside left, content right. */
  | "splitLeft"
  /** Edge-to-edge single block, e.g. a full-bleed image with overlay text. */
  | "fullBleed"
  /** Editorial frame: a large headline over a divided row of columns. */
  | "band"
  /** Headline and copy on the left, one large object on the right. */
  | "hero"
  /** The mirror of hero: the object on the left, the words on the right. */
  | "split"
  /** One object at full size, headline above it and a line below. */
  | "showcase"
  /** Words only, at full volume, with no object at all. */
  | "statement"
  /** Closing slide treatment. */
  | "closing";

export interface SlideSpec {
  id: string;
  /** Human-readable slide purpose, shown in the slide-type picker. */
  name: string;
  layout: SlideLayout;
  blocks: Block[];
  /** Overrides the 58/42 default for split layouts. 0..1 = main's share. */
  split?: number;
  /** Background image for the whole slide. */
  background?: { url?: string; prompt?: string; scrim?: number };
  /**
   * Flips the field and the ink for this slide only.
   *
   * Used as a rhythm device: a long deck on one field colour reads as a
   * single block, and one flipped slide every few slides breaks it into
   * chapters without adding a second palette.
   */
  invert?: boolean;
  /**
   * Overrides the theme's background motif for this slide.
   *
   * A headline across the full width over a band across the full width
   * leaves nowhere for decoration to go, so content slides usually set
   * this to "none" and let the cover carry the motif.
   */
  motif?: Motif;
}

export interface SlideTemplate {
  id: string;
  /** Catalogue number, 1..50. */
  number: number;
  name: string;
  category: string;
  description: string;
  /** Archetype this template's structure derives from. */
  archetype: string;
  theme: TemplateTheme;
  slides: SlideSpec[];
  /** Prompt hint used to generate the catalogue thumbnail. */
  coverPrompt?: string;
}
