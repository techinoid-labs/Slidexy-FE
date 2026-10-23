/**
 * Template themes.
 *
 * Each of the 50 templates owns one of these. Two templates can share every
 * block component and still look unrelated, because a theme controls palette,
 * type pairing, card treatment, icon treatment, heading treatment, cover
 * treatment and background motif.
 *
 * Font stacks are system/web-safe first — a template must never depend on a
 * webfont that hasn't loaded, or exports render in a fallback and the spacing
 * moves.
 */

import type { TemplateTheme, ThemePalette } from "./types";

// Font stacks point at the CSS variables declared in app/layout.tsx, which
// next/font self-hosts. The literal family name is kept as the first fallback
// so a theme still resolves if the variable is missing (e.g. a slide rendered
// outside the app shell), and a real system face closes every stack.
const SANS = "var(--font-inter, 'Inter'), 'Segoe UI', system-ui, sans-serif";
const GEOMETRIC = "var(--font-poppins, 'Poppins'), 'Century Gothic', system-ui, sans-serif";
const GROTESK = "var(--font-grotesk, 'Space Grotesk'), 'Segoe UI', system-ui, sans-serif";
const DISPLAY_SERIF = "var(--font-playfair, 'Playfair Display'), Georgia, serif";
const TEXT_SERIF = "var(--font-sourceserif, 'Source Serif 4'), Georgia, 'Times New Roman', serif";
const FRIENDLY = "var(--font-dm, 'DM Sans'), 'Segoe UI', system-ui, sans-serif";
const WIDE = "var(--font-archivo, 'Archivo'), 'Segoe UI', system-ui, sans-serif";
const OUTFIT = "var(--font-outfit, 'Outfit'), 'Segoe UI', system-ui, sans-serif";
const LORA = "var(--font-lora, 'Lora'), Georgia, serif";
const EXPRESSIVE = "var(--font-bricolage, 'Bricolage Grotesque'), 'Segoe UI', system-ui, sans-serif";
const PLEX = "var(--font-plex, 'IBM Plex Sans'), 'Segoe UI', system-ui, sans-serif";
const MANROPE = "var(--font-manrope, 'Manrope'), 'Segoe UI', system-ui, sans-serif";
const WORK = "var(--font-work, 'Work Sans'), 'Segoe UI', system-ui, sans-serif";
const FIGTREE = "var(--font-figtree, 'Figtree'), 'Segoe UI', system-ui, sans-serif";
const PUBLIC = "var(--font-public, 'Public Sans'), 'Segoe UI', system-ui, sans-serif";
const NUNITO = "var(--font-nunito, 'Nunito Sans'), 'Segoe UI', system-ui, sans-serif";
const KARLA = "var(--font-karla, 'Karla'), 'Segoe UI', system-ui, sans-serif";
const MONO = "var(--font-mono, 'JetBrains Mono'), Consolas, monospace";

interface PaletteInput {
  bg: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  text: string;
  textMuted: string;
  onAccent?: string;
  onImage?: string;
  accents: [string, string, string, string];
  positive?: string;
  negative?: string;
  warning?: string;
}

function palette(p: PaletteInput): ThemePalette {
  return {
    bg: p.bg,
    surface: p.surface,
    surfaceAlt: p.surfaceAlt,
    border: p.border,
    text: p.text,
    textMuted: p.textMuted,
    onAccent: p.onAccent ?? "#ffffff",
    onImage: p.onImage ?? "#ffffff",
    accent: p.accents[0],
    accent2: p.accents[1],
    accent3: p.accents[2],
    accent4: p.accents[3],
    positive: p.positive ?? "#16a34a",
    negative: p.negative ?? "#e11d48",
    warning: p.warning ?? "#f59e0b",
  };
}

type ThemeInput = Omit<TemplateTheme, "palette" | "typeScale" | "density"> & {
  palette: ThemePalette;
  typeScale?: number;
  density?: number;
};

function theme(t: ThemeInput): TemplateTheme {
  return { typeScale: 1, density: 1, ...t };
}

/** Neutral greys reused by most light themes. */
const LIGHT_NEUTRALS = {
  bg: "#ffffff",
  surface: "#ffffff",
  surfaceAlt: "#f6f8fb",
  border: "#e4e9f0",
  text: "#0f172a",
  textMuted: "#64748b",
};

// ─────────────────────────────────────────────────────────────────────────────
// 01 — Business & Corporate. Navy, restrained, elevated cards.
// ─────────────────────────────────────────────────────────────────────────────
export const corporateNavy = theme({
  id: "corporate-navy",
  name: "Boardroom Blue",
  mode: "light",
  palette: palette({
    bg: "#f7f8fb",
    surface: "#ffffff",
    surfaceAlt: "#eef1f7",
    border: "#dde3ec",
    text: "#0e1726",
    textMuted: "#5a667a",
    accents: ["#1d4ed8", "#4f78ef", "#15389f", "#8aa6f6"],
  }),
  fonts: { display: WIDE, body: PLEX },
  radius: "none",
  cardStyle: "outlined",
  iconStyle: "plainGlyph",
  headingStyle: "kickerRule",
  coverStyle: "typeLed",
  motif: "meshPlane",
  density: 1.04,
  uppercaseKickers: true,
});

// ─────────────────────────────────────────────────────────────────────────────
// 02 — Startup Pitch. Violet, energetic, rounded, gradient cover.
// ─────────────────────────────────────────────────────────────────────────────
export const startupViolet = theme({
  id: "startup-violet",
  name: "Launch Violet",
  mode: "dark",
  palette: palette({
    bg: "#141021",
    surface: "#1d1830",
    surfaceAlt: "#261f3e",
    border: "#342b52",
    text: "#f3efff",
    textMuted: "#9a93b5",
    accents: ["#7c5cff", "#9b84ff", "#5b3ae0", "#c0b2ff"],
  }),
  fonts: { display: GEOMETRIC, body: FIGTREE },
  radius: "md",
  cardStyle: "flat",
  iconStyle: "filledCircle",
  headingStyle: "kickerRule",
  coverStyle: "typeLed",
  motif: "meshField",
  typeScale: 1.02,
  density: 1.02,
  uppercaseKickers: true,
});

// ─────────────────────────────────────────────────────────────────────────────
// 03 — Investor / Fundraising. Dark, high-contrast, confident.
// ─────────────────────────────────────────────────────────────────────────────
export const investorMidnight = theme({
  id: "investor-midnight",
  name: "Capital Green",
  mode: "dark",
  palette: palette({
    bg: "#0f1412",
    surface: "#172019",
    surfaceAlt: "#1e2a21",
    border: "#2a3a2f",
    text: "#edf2ee",
    textMuted: "#8b9a90",
    accents: ["#2fbf71", "#5ad292", "#1f9256", "#9ae8bd"],
  }),
  fonts: { display: GROTESK, body: PLEX },
  radius: "none",
  cardStyle: "outlined",
  iconStyle: "outline",
  headingStyle: "plain",
  coverStyle: "typeLed",
  motif: "meshLattice",
  density: 1.02,
  uppercaseKickers: true,
});

// ─────────────────────────────────────────────────────────────────────────────
// 04 — Sales. Warm, trustworthy, flat cards, strong CTAs.
// ─────────────────────────────────────────────────────────────────────────────
export const salesAmber = theme({
  id: "sales-amber",
  name: "Pipeline Amber",
  mode: "light",
  palette: palette({
    bg: "#fffbf5",
    surface: "#ffffff",
    surfaceAlt: "#fff3e4",
    border: "#f2e2cd",
    text: "#1a1208",
    textMuted: "#7a6a55",
    accents: ["#ea580c", "#f5823f", "#c2410c", "#f9b98b"],
  }),
  fonts: { display: EXPRESSIVE, body: WORK },
  radius: "md",
  cardStyle: "flat",
  iconStyle: "softSquare",
  headingStyle: "sideBar",
  coverStyle: "typeLed",
  motif: "meshBands",
  typeScale: 1.02,
  uppercaseKickers: true,
});

// ─────────────────────────────────────────────────────────────────────────────
// 05 — Marketing Strategy. Saturated, playful, pill radii.
// ─────────────────────────────────────────────────────────────────────────────
export const marketingMagenta = theme({
  id: "marketing-magenta",
  name: "Signal Magenta",
  mode: "light",
  palette: palette({
    bg: "#fff6fa",
    surface: "#ffffff",
    surfaceAlt: "#ffeaf4",
    border: "#f6d8e6",
    text: "#2a0a1e",
    textMuted: "#8a607a",
    accents: ["#db2777", "#ef5f9b", "#b01760", "#f7a8ca"],
  }),
  fonts: { display: EXPRESSIVE, body: KARLA },
  radius: "pill",
  cardStyle: "flat",
  iconStyle: "filledCircle",
  headingStyle: "underline",
  coverStyle: "typeLed",
  motif: "meshField",
  typeScale: 1.03,
  uppercaseKickers: true,
});

// ─────────────────────────────────────────────────────────────────────────────
// Additional archetype themes, used across the remaining catalogue entries.
// ─────────────────────────────────────────────────────────────────────────────

export const productIndigo = theme({
  id: "product-indigo",
  name: "Ship Indigo",
  mode: "dark",
  palette: palette({
    bg: "#0d0f1f",
    surface: "#161930",
    surfaceAlt: "#1e2240",
    border: "#2b3058",
    text: "#eceeff",
    textMuted: "#8f94bb",
    accents: ["#6366f1", "#8b8df5", "#474ad4", "#b4b6fa"],
  }),
  fonts: { display: OUTFIT, body: FIGTREE },
  radius: "lg",
  cardStyle: "flat",
  iconStyle: "softSquare",
  headingStyle: "kickerRule",
  coverStyle: "typeLed",
  motif: "meshLattice",
  typeScale: 1.02,
  uppercaseKickers: true,
});

export const consultingSlate = theme({
  id: "consulting-slate",
  name: "Blueprint Slate",
  mode: "light",
  palette: palette({
    bg: "#f4f6f8",
    surface: "#ffffff",
    surfaceAlt: "#e9edf1",
    border: "#d7dee5",
    text: "#111827",
    textMuted: "#5d6b7a",
    accents: ["#0f766e", "#2a9d94", "#0a564f", "#7fc9c2"],
  }),
  fonts: { display: WIDE, body: PLEX },
  radius: "none",
  cardStyle: "outlined",
  iconStyle: "outline",
  headingStyle: "numbered",
  coverStyle: "typeLed",
  motif: "meshPlane",
  density: 1.03,
  uppercaseKickers: true,
});

export const dataCyan = theme({
  id: "data-cyan",
  name: "Data Cyan",
  mode: "dark",
  palette: palette({
    bg: "#0a1117",
    surface: "#111c26",
    surfaceAlt: "#16242f",
    border: "#23394a",
    text: "#e6f1f7",
    textMuted: "#8aa6b8",
    accents: ["#06b6d4", "#38bdf8", "#a78bfa", "#34d399"],
  }),
  fonts: { display: GROTESK, body: SANS, numeric: MONO },
  radius: "sm",
  cardStyle: "outlined",
  iconStyle: "outline",
  headingStyle: "kickerRule",
  coverStyle: "geometric",
  motif: "grid",
  uppercaseKickers: true,
});

export const academicInk = theme({
  id: "academic-ink",
  name: "Academic Ink",
  mode: "light",
  palette: palette({
    bg: "#fdfcf9",
    surface: "#ffffff",
    surfaceAlt: "#f5f2ea",
    border: "#e2dccd",
    text: "#1c1917",
    textMuted: "#6b6255",
    accents: ["#7f1d1d", "#1e3a5f", "#78350f", "#3f6212"],
  }),
  fonts: { display: DISPLAY_SERIF, body: TEXT_SERIF },
  radius: "none",
  cardStyle: "outlined",
  iconStyle: "plainGlyph",
  headingStyle: "underline",
  coverStyle: "typeLed",
  motif: "none",
  typeScale: 0.97,
});

export const healthTeal = theme({
  id: "health-teal",
  name: "Health Teal",
  mode: "light",
  palette: palette({
    ...LIGHT_NEUTRALS,
    bg: "#fbfeff",
    surfaceAlt: "#eefaf9",
    border: "#d4eeeb",
    accents: ["#0d9488", "#0284c7", "#7c3aed", "#f59e0b"],
  }),
  fonts: { display: FRIENDLY, body: SANS },
  radius: "lg",
  cardStyle: "flat",
  iconStyle: "filledCircle",
  headingStyle: "plain",
  coverStyle: "splitImage",
  motif: "arc",
});

export const creativeSunset = theme({
  id: "creative-sunset",
  name: "Creative Sunset",
  mode: "dark",
  palette: palette({
    bg: "#16091c",
    surface: "#241030",
    surfaceAlt: "#30183f",
    border: "#452259",
    text: "#fdf4ff",
    textMuted: "#c4a6d4",
    accents: ["#f43f5e", "#fb923c", "#a855f7", "#22d3ee"],
  }),
  fonts: { display: GEOMETRIC, body: SANS },
  radius: "lg",
  cardStyle: "glass",
  iconStyle: "filledCircle",
  headingStyle: "plain",
  coverStyle: "gradient",
  motif: "blob",
  typeScale: 1.06,
});

export const educationSky = theme({
  id: "education-sky",
  name: "Studio Sky",
  mode: "light",
  palette: palette({
    bg: "#f5faff",
    surface: "#ffffff",
    surfaceAlt: "#e8f3fd",
    border: "#d3e5f4",
    text: "#0c2231",
    textMuted: "#5a7489",
    accents: ["#0284c7", "#34a6e0", "#02648f", "#8fd0f0"],
  }),
  fonts: { display: FRIENDLY, body: NUNITO },
  radius: "lg",
  cardStyle: "flat",
  iconStyle: "filledCircle",
  headingStyle: "kickerRule",
  coverStyle: "typeLed",
  motif: "meshLattice",
  typeScale: 1.02,
  density: 1.04,
  uppercaseKickers: true,
});

export const reportGraphite = theme({
  id: "report-graphite",
  name: "Ledger Paper",
  mode: "light",
  palette: palette({
    bg: "#fbfaf7",
    surface: "#ffffff",
    surfaceAlt: "#f1efe9",
    border: "#e0ddd3",
    text: "#14181c",
    textMuted: "#6b7076",
    accents: ["#0e7490", "#3597b0", "#0a5368", "#86cbdc"],
  }),
  fonts: { display: DISPLAY_SERIF, body: PUBLIC },
  radius: "none",
  cardStyle: "outlined",
  iconStyle: "plainGlyph",
  headingStyle: "underline",
  coverStyle: "typeLed",
  motif: "meshBands",
  density: 1.02,
  uppercaseKickers: true,
});

export const peopleCoral = theme({
  id: "people-coral",
  name: "People Coral",
  mode: "light",
  palette: palette({
    ...LIGHT_NEUTRALS,
    bg: "#fffcfb",
    surfaceAlt: "#fff1ee",
    border: "#fbdcd5",
    accents: ["#f43f5e", "#8b5cf6", "#0ea5e9", "#f59e0b"],
  }),
  fonts: { display: FRIENDLY, body: SANS },
  radius: "lg",
  cardStyle: "flat",
  iconStyle: "filledCircle",
  headingStyle: "plain",
  coverStyle: "splitImage",
  motif: "blob",
});

export const impactGreen = theme({
  id: "impact-green",
  name: "Evidence Forest",
  mode: "dark",
  palette: palette({
    bg: "#0d1a14",
    surface: "#14261d",
    surfaceAlt: "#1b3326",
    border: "#264534",
    text: "#eaf2ec",
    textMuted: "#8aa394",
    accents: ["#22c55e", "#55d683", "#179447", "#95eab4"],
  }),
  fonts: { display: LORA, body: WORK },
  radius: "sm",
  cardStyle: "outlined",
  iconStyle: "outline",
  headingStyle: "sideBar",
  coverStyle: "typeLed",
  motif: "meshPlane",
  uppercaseKickers: true,
});

export const govStone = theme({
  id: "gov-stone",
  name: "Government Stone",
  mode: "light",
  palette: palette({
    bg: "#fcfcfb",
    surface: "#ffffff",
    surfaceAlt: "#f2f2ef",
    border: "#dedeD6",
    text: "#1c1917",
    textMuted: "#6f6a63",
    accents: ["#1e3a8a", "#7f1d1d", "#166534", "#78350f"],
  }),
  fonts: { display: DISPLAY_SERIF, body: SANS },
  radius: "none",
  cardStyle: "outlined",
  iconStyle: "outline",
  headingStyle: "underline",
  coverStyle: "typeLed",
  motif: "none",
  typeScale: 0.97,
  uppercaseKickers: true,
});

export const techNoir = theme({
  id: "tech-noir",
  name: "Tech Noir",
  mode: "dark",
  palette: palette({
    bg: "#09090b",
    surface: "#141417",
    surfaceAlt: "#1c1c21",
    border: "#2c2c33",
    text: "#fafafa",
    textMuted: "#a1a1aa",
    accents: ["#22d3ee", "#a3e635", "#f472b6", "#fbbf24"],
  }),
  fonts: { display: GROTESK, body: SANS, numeric: MONO },
  radius: "sm",
  cardStyle: "outlined",
  iconStyle: "outline",
  headingStyle: "kickerRule",
  coverStyle: "geometric",
  motif: "grid",
  uppercaseKickers: true,
});

export const retailPlum = theme({
  id: "retail-plum",
  name: "Retail Plum",
  mode: "light",
  palette: palette({
    ...LIGHT_NEUTRALS,
    bg: "#fffbfe",
    surfaceAlt: "#faf0f7",
    border: "#f0dcea",
    accents: ["#9d174d", "#7c3aed", "#0891b2", "#ea580c"],
  }),
  fonts: { display: GEOMETRIC, body: SANS },
  radius: "lg",
  cardStyle: "elevated",
  iconStyle: "filledCircle",
  headingStyle: "plain",
  coverStyle: "splitImage",
  motif: "dots",
});

export const realEstateBrass = theme({
  id: "realestate-brass",
  name: "Real Estate Brass",
  mode: "light",
  palette: palette({
    bg: "#fefdfb",
    surface: "#ffffff",
    surfaceAlt: "#f7f3ec",
    border: "#e8dfd0",
    text: "#1c1917",
    textMuted: "#78706690",
    accents: ["#a16207", "#1e3a5f", "#4d7c0f", "#9a3412"],
  }),
  fonts: { display: DISPLAY_SERIF, body: SANS },
  radius: "sm",
  cardStyle: "outlined",
  iconStyle: "outline",
  headingStyle: "underline",
  coverStyle: "fullImage",
  motif: "none",
});

export const eventElectric = theme({
  id: "event-electric",
  name: "Event Electric",
  mode: "dark",
  palette: palette({
    bg: "#0d0620",
    surface: "#1a0e35",
    surfaceAlt: "#241448",
    border: "#382066",
    text: "#f5f3ff",
    textMuted: "#b4a5d6",
    accents: ["#a855f7", "#f43f5e", "#22d3ee", "#facc15"],
  }),
  fonts: { display: GEOMETRIC, body: SANS },
  radius: "pill",
  cardStyle: "glass",
  iconStyle: "filledCircle",
  headingStyle: "plain",
  coverStyle: "gradient",
  motif: "blob",
  typeScale: 1.08,
});

export const minimalMono = theme({
  id: "minimal-mono",
  name: "Minimal Mono",
  mode: "light",
  palette: palette({
    bg: "#ffffff",
    surface: "#ffffff",
    surfaceAlt: "#fafafa",
    border: "#e5e5e5",
    text: "#0a0a0a",
    textMuted: "#737373",
    accents: ["#0a0a0a", "#525252", "#a3a3a3", "#2563eb"],
  }),
  fonts: { display: SANS, body: SANS },
  radius: "none",
  cardStyle: "outlined",
  iconStyle: "plainGlyph",
  headingStyle: "plain",
  coverStyle: "typeLed",
  motif: "none",
  typeScale: 0.98,
  density: 1.06,
});

export const legalOxblood = theme({
  id: "legal-oxblood",
  name: "Legal Oxblood",
  mode: "light",
  palette: palette({
    bg: "#fdfcfc",
    surface: "#ffffff",
    surfaceAlt: "#f6f1f1",
    border: "#e5d9d9",
    text: "#1a1414",
    textMuted: "#6b5a5a",
    accents: ["#7f1d1d", "#1f2937", "#78350f", "#334155"],
  }),
  fonts: { display: DISPLAY_SERIF, body: TEXT_SERIF },
  radius: "none",
  cardStyle: "outlined",
  iconStyle: "plainGlyph",
  headingStyle: "underline",
  coverStyle: "typeLed",
  motif: "none",
  typeScale: 0.96,
});

export const travelAzure = theme({
  id: "travel-azure",
  name: "Travel Azure",
  mode: "light",
  palette: palette({
    ...LIGHT_NEUTRALS,
    bg: "#fbfeff",
    surfaceAlt: "#e8f6fd",
    border: "#c9e9f7",
    accents: ["#0284c7", "#f59e0b", "#0d9488", "#e11d48"],
  }),
  fonts: { display: FRIENDLY, body: SANS },
  radius: "lg",
  cardStyle: "elevated",
  iconStyle: "filledCircle",
  headingStyle: "plain",
  coverStyle: "fullImage",
  motif: "arc",
});

export const portfolioCanvas = theme({
  id: "portfolio-canvas",
  name: "Portfolio Canvas",
  mode: "light",
  palette: palette({
    bg: "#faf9f7",
    surface: "#ffffff",
    surfaceAlt: "#f1efeb",
    border: "#e2ded7",
    text: "#171717",
    textMuted: "#6d6a65",
    accents: ["#171717", "#c2410c", "#0f766e", "#4338ca"],
  }),
  fonts: { display: DISPLAY_SERIF, body: SANS },
  radius: "sm",
  cardStyle: "flat",
  iconStyle: "plainGlyph",
  headingStyle: "kickerRule",
  coverStyle: "typeLed",
  motif: "none",
  density: 1.08,
});

export const brutalistLime = theme({
  id: "brutalist-lime",
  name: "Brutalist Lime",
  mode: "light",
  palette: palette({
    bg: "#fefce8",
    surface: "#ffffff",
    surfaceAlt: "#fef9c3",
    border: "#0a0a0a",
    text: "#0a0a0a",
    textMuted: "#3f3f46",
    accents: ["#0a0a0a", "#65a30d", "#e11d48", "#2563eb"],
  }),
  fonts: { display: GROTESK, body: SANS },
  radius: "none",
  cardStyle: "brutalist",
  iconStyle: "outline",
  headingStyle: "sideBar",
  coverStyle: "geometric",
  motif: "diagonal",
  typeScale: 1.04,
});

// ─────────────────────────────────────────────────────────────────────────────
// 26 — Dimensional. Porcelain field, one vermilion block standing on every slide.
// ─────────────────────────────────────────────────────────────────────────────
export const dimensionalClay = theme({
  id: "dimensional-clay",
  name: "Dimensional",
  mode: "dark",
  // Two colours and one object colour. The decks this was drawn from carry
  // a whole deck on a field and a tint, and get their variety from scale
  // and weight instead of hue. A fourth colour is almost always a retreat
  // from making the type work.
  palette: palette({
    bg: "#17181c",
    surface: "#1f2127",
    surfaceAlt: "#262930",
    border: "#32363f",
    text: "#f2ece3",
    textMuted: "#948f86",
    // Four tints of the one device colour, not four hues. Several
    // blocks cycle through the accent roles, and on a two-colour
    // template that turns a checklist into traffic lights.
    accents: ["#e4572e", "#ef7f5a", "#c2451f", "#f3a98c"],
  }),
  fonts: { display: WIDE, body: FIGTREE },
  radius: "none",
  cardStyle: "flat",
  iconStyle: "plainGlyph",
  headingStyle: "kickerRule",
  coverStyle: "typeLed",
  motif: "isoFloor",
  density: 1.05,
  uppercaseKickers: true,
});

/** Every theme, addressable by id. */
export const THEMES: Record<string, TemplateTheme> = Object.fromEntries(
  [
    corporateNavy,
    startupViolet,
    investorMidnight,
    salesAmber,
    marketingMagenta,
    productIndigo,
    consultingSlate,
    dataCyan,
    academicInk,
    healthTeal,
    creativeSunset,
    educationSky,
    reportGraphite,
    peopleCoral,
    impactGreen,
    govStone,
    techNoir,
    retailPlum,
    realEstateBrass,
    eventElectric,
    minimalMono,
    legalOxblood,
    travelAzure,
    portfolioCanvas,
    brutalistLime,
    dimensionalClay,
  ].map((t) => [t.id, t])
);

export const DEFAULT_THEME = corporateNavy;
