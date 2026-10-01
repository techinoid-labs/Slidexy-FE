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
const SANS = "var(--font-inter), Inter, 'Segoe UI', system-ui, sans-serif";
const GEOMETRIC = "var(--font-poppins), Poppins, 'Century Gothic', system-ui, sans-serif";
const GROTESK = "var(--font-grotesk), 'Space Grotesk', 'Segoe UI', system-ui, sans-serif";
const DISPLAY_SERIF = "var(--font-playfair), 'Playfair Display', Georgia, serif";
const TEXT_SERIF = "var(--font-serif), 'Source Serif 4', Georgia, 'Times New Roman', serif";
const FRIENDLY = "var(--font-dm), 'DM Sans', 'Segoe UI', system-ui, sans-serif";
const WIDE = "var(--font-archivo), Archivo, 'Segoe UI', system-ui, sans-serif";
const OUTFIT = "var(--font-outfit), Outfit, 'Segoe UI', system-ui, sans-serif";
const LORA = "var(--font-lora), Lora, Georgia, serif";
const EXPRESSIVE = "var(--font-bricolage), 'Bricolage Grotesque', 'Segoe UI', system-ui, sans-serif";
const MONO = "var(--font-mono), 'JetBrains Mono', Consolas, monospace";

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
  name: "Corporate Navy",
  mode: "light",
  palette: palette({
    ...LIGHT_NEUTRALS,
    surfaceAlt: "#f3f7fd",
    accents: ["#1e40af", "#0ea5e9", "#6366f1", "#0891b2"],
  }),
  fonts: { display: WIDE, body: SANS },
  radius: "md",
  cardStyle: "elevated",
  iconStyle: "softSquare",
  headingStyle: "numbered",
  coverStyle: "fullImage",
  motif: "arc",
  uppercaseKickers: true,
});

// ─────────────────────────────────────────────────────────────────────────────
// 02 — Startup Pitch. Violet, energetic, rounded, gradient cover.
// ─────────────────────────────────────────────────────────────────────────────
export const startupViolet = theme({
  id: "startup-violet",
  name: "Startup Violet",
  mode: "light",
  palette: palette({
    ...LIGHT_NEUTRALS,
    surfaceAlt: "#f8f6ff",
    border: "#e9e4fb",
    accents: ["#7c3aed", "#ec4899", "#06b6d4", "#f59e0b"],
  }),
  fonts: { display: GEOMETRIC, body: FRIENDLY },
  radius: "lg",
  cardStyle: "outlined",
  iconStyle: "filledCircle",
  headingStyle: "plain",
  coverStyle: "splitImage",
  motif: "blob",
  typeScale: 1.04,
});

// ─────────────────────────────────────────────────────────────────────────────
// 03 — Investor / Fundraising. Dark, high-contrast, confident.
// ─────────────────────────────────────────────────────────────────────────────
export const investorMidnight = theme({
  id: "investor-midnight",
  name: "Investor Midnight",
  mode: "dark",
  palette: palette({
    bg: "#0b1020",
    surface: "#151b32",
    surfaceAlt: "#1d2542",
    border: "#2a3358",
    text: "#f1f5f9",
    textMuted: "#94a3b8",
    onAccent: "#ffffff",
    accents: ["#8b5cf6", "#22d3ee", "#f472b6", "#facc15"],
  }),
  fonts: { display: GROTESK, body: SANS, numeric: MONO },
  radius: "md",
  cardStyle: "outlined",
  iconStyle: "softSquare",
  headingStyle: "kickerRule",
  coverStyle: "fullImage",
  motif: "topography",
  typeScale: 0.99,
});

// ─────────────────────────────────────────────────────────────────────────────
// 04 — Sales. Warm, trustworthy, flat cards, strong CTAs.
// ─────────────────────────────────────────────────────────────────────────────
export const salesAmber = theme({
  id: "sales-amber",
  name: "Sales Amber",
  mode: "light",
  palette: palette({
    ...LIGHT_NEUTRALS,
    bg: "#fffdf9",
    surface: "#ffffff",
    surfaceAlt: "#fff6ec",
    border: "#f0e3d4",
    accents: ["#ea580c", "#0f766e", "#2563eb", "#be123c"],
  }),
  fonts: { display: DISPLAY_SERIF, body: SANS },
  radius: "md",
  cardStyle: "outlined",
  iconStyle: "filledCircle",
  headingStyle: "sideBar",
  coverStyle: "fullImage",
  motif: "none",
});

// ─────────────────────────────────────────────────────────────────────────────
// 05 — Marketing Strategy. Saturated, playful, pill radii.
// ─────────────────────────────────────────────────────────────────────────────
export const marketingMagenta = theme({
  id: "marketing-magenta",
  name: "Marketing Magenta",
  mode: "light",
  palette: palette({
    ...LIGHT_NEUTRALS,
    surfaceAlt: "#fdf4ff",
    border: "#f0e2f7",
    accents: ["#c026d3", "#7c3aed", "#f59e0b", "#14b8a6"],
  }),
  fonts: { display: EXPRESSIVE, body: FRIENDLY },
  radius: "lg",
  cardStyle: "elevated",
  iconStyle: "filledCircle",
  headingStyle: "plain",
  coverStyle: "gradient",
  motif: "blob",
  typeScale: 1.04,
});

// ─────────────────────────────────────────────────────────────────────────────
// Additional archetype themes, used across the remaining catalogue entries.
// ─────────────────────────────────────────────────────────────────────────────

export const productIndigo = theme({
  id: "product-indigo",
  name: "Product Indigo",
  mode: "light",
  palette: palette({
    ...LIGHT_NEUTRALS,
    surfaceAlt: "#f1f5ff",
    border: "#e0e7ff",
    accents: ["#4f46e5", "#0ea5e9", "#14b8a6", "#f97316"],
  }),
  fonts: { display: OUTFIT, body: SANS },
  radius: "lg",
  cardStyle: "outlined",
  iconStyle: "softSquare",
  headingStyle: "plain",
  coverStyle: "splitImage",
  motif: "grid",
});

export const consultingSlate = theme({
  id: "consulting-slate",
  name: "Consulting Slate",
  mode: "light",
  palette: palette({
    bg: "#ffffff",
    surface: "#ffffff",
    surfaceAlt: "#f4f5f7",
    border: "#dfe3e8",
    text: "#111827",
    textMuted: "#6b7280",
    accents: ["#0f766e", "#1e3a8a", "#b45309", "#9333ea"],
  }),
  fonts: { display: SANS, body: TEXT_SERIF },
  radius: "sm",
  cardStyle: "outlined",
  iconStyle: "outline",
  headingStyle: "kickerRule",
  coverStyle: "typeLed",
  motif: "grid",
  typeScale: 0.98,
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
  name: "Education Sky",
  mode: "light",
  palette: palette({
    ...LIGHT_NEUTRALS,
    bg: "#fcfdff",
    surfaceAlt: "#eff6ff",
    border: "#dbeafe",
    accents: ["#2563eb", "#f59e0b", "#16a34a", "#db2777"],
  }),
  fonts: { display: FRIENDLY, body: SANS },
  radius: "lg",
  cardStyle: "flat",
  iconStyle: "softSquare",
  headingStyle: "numbered",
  coverStyle: "geometric",
  motif: "dots",
});

export const reportGraphite = theme({
  id: "report-graphite",
  name: "Report Graphite",
  mode: "light",
  palette: palette({
    bg: "#ffffff",
    surface: "#ffffff",
    surfaceAlt: "#f7f7f8",
    border: "#e3e3e6",
    text: "#18181b",
    textMuted: "#71717a",
    accents: ["#3f3f46", "#2563eb", "#0d9488", "#c2410c"],
  }),
  fonts: { display: LORA, body: SANS, numeric: MONO },
  radius: "sm",
  cardStyle: "outlined",
  iconStyle: "outline",
  headingStyle: "sideBar",
  coverStyle: "typeLed",
  motif: "none",
  typeScale: 0.96,
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
  name: "Impact Green",
  mode: "light",
  palette: palette({
    ...LIGHT_NEUTRALS,
    bg: "#fbfdfa",
    surfaceAlt: "#eefbf1",
    border: "#d3f0dc",
    accents: ["#15803d", "#0d9488", "#65a30d", "#0369a1"],
  }),
  fonts: { display: TEXT_SERIF, body: SANS },
  radius: "md",
  cardStyle: "outlined",
  iconStyle: "softSquare",
  headingStyle: "kickerRule",
  coverStyle: "fullImage",
  motif: "arc",
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
  ].map((t) => [t.id, t])
);

export const DEFAULT_THEME = corporateNavy;
