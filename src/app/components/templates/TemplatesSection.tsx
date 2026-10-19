"use client";

import React, { useMemo, useState } from "react";
import { Box, Container, Typography } from "@mui/material";
import Link from "next/link";
import { LuArrowRight } from "react-icons/lu";
import { TEMPLATES } from "@/templates/catalog";
import {
  ACCENT,
  INK,
  MONO,
  MUTED,
  RULE,
} from "@/app/components/home/editorial";

/**
 * The template catalogue.
 *
 * What was here before: eleven static SVG pictures that had nothing to do
 * with the templates the product actually ships, and no way to use any of
 * them. Someone landing here could look and then leave, which is the one
 * thing a catalogue page must not allow.
 *
 * This reads the real catalogue, so it cannot drift, and every row has an
 * action. There are no slide screenshots because the slide designs are
 * mid-revision; a palette and the type pairing describe a template honestly
 * without showing work that is about to change.
 */

type Row = {
  id: string;
  name: string;
  category: string;
  description: string;
  slides: number;
  mode: string;
  swatch: string[];
  display: string;
  body: string;
};

/** "var(--font-archivo, 'Archivo'), sans-serif" becomes "Archivo". */
function familyName(stack?: string): string {
  if (!stack) return "";
  const quoted = stack.match(/['"]([^'"]+)['"]/);
  if (quoted) return quoted[1];
  return (stack.split(",")[0] || "").replace(/var\(|\)|--font-/g, "").trim();
}

const ROWS: Row[] = TEMPLATES.map((t) => {
  const p: any = t.theme?.palette ?? {};
  return {
    id: t.id,
    name: t.name,
    category: t.category,
    description: t.description ?? "",
    slides: t.slides.length,
    mode: (t.theme as any)?.mode === "dark" ? "Dark" : "Light",
    swatch: [p.accent, p.accent2, p.accent3, p.surfaceAlt].filter(Boolean),
    display: familyName(t.theme?.fonts?.display),
    body: familyName(t.theme?.fonts?.body),
  };
});

const CATEGORIES = ["All", ...Array.from(new Set(ROWS.map((r) => r.category)))];

export default function TemplatesSection() {
  const [filter, setFilter] = useState("All");
  const rows = useMemo(
    () => (filter === "All" ? ROWS : ROWS.filter((r) => r.category === filter)),
    [filter]
  );

  return (
    <Box component="section" sx={{ bgcolor: "#fff", pb: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        {/* Filters as plain tabs on a rule, not pill chips */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, borderBottom: `1px solid ${RULE}`, mb: 1 }}>
          {CATEGORIES.map((c) => (
            <Box
              key={c}
              onClick={() => setFilter(c)}
              sx={{
                pb: 1.4,
                cursor: "pointer",
                fontSize: "0.9rem",
                fontWeight: filter === c ? 600 : 500,
                color: filter === c ? INK : MUTED,
                borderBottom: `2px solid ${filter === c ? ACCENT : "transparent"}`,
                mb: "-1px",
                transition: "color 0.15s ease",
                "&:hover": { color: INK },
              }}
            >
              {c}
              <Box component="span" sx={{ fontFamily: MONO, fontSize: "0.68rem", color: "#B4AEC0", ml: 0.75 }}>
                {c === "All" ? ROWS.length : ROWS.filter((r) => r.category === c).length}
              </Box>
            </Box>
          ))}
        </Box>

        {/* Each template is a row with an action, not a picture you cannot use */}
        <Box>
          {rows.map((r) => (
            <Box
              key={r.id}
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "auto 1fr auto auto" },
                alignItems: { md: "center" },
                gap: { xs: 1.5, md: 4 },
                py: { xs: 3, md: 3.25 },
                borderBottom: `1px solid ${RULE}`,
                transition: "background 0.12s ease",
                "&:hover": { bgcolor: "#FAFAFB", "& .go": { color: ACCENT, gap: "10px" } },
              }}
            >
              {/* Palette: what the template looks like, without a screenshot */}
              <Box sx={{ display: "flex", gap: 0.5 }}>
                {r.swatch.map((c, i) => (
                  <Box
                    key={i}
                    sx={{
                      width: 14,
                      height: 42,
                      bgcolor: c,
                      border: i === r.swatch.length - 1 ? `1px solid ${RULE}` : "none",
                    }}
                  />
                ))}
              </Box>

              <Box>
                <Typography
                  sx={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.15rem",
                    fontWeight: 600,
                    color: INK,
                    letterSpacing: "-0.015em",
                  }}
                >
                  {r.name}
                </Typography>
                {r.description && (
                  <Typography sx={{ fontSize: "0.9rem", color: MUTED, mt: 0.3 }}>
                    {r.description}
                  </Typography>
                )}
              </Box>

              <Typography
                sx={{
                  fontFamily: MONO,
                  fontSize: "0.7rem",
                  letterSpacing: "0.07em",
                  color: "#9A94A6",
                  lineHeight: 1.7,
                  whiteSpace: "nowrap",
                }}
              >
                {r.slides} slides · {r.mode}
                <br />
                {r.display} / {r.body}
              </Typography>

              <Link href={`/template-preview?id=${r.id}`} style={{ textDecoration: "none" }}>
                <Box
                  className="go"
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "0.92rem",
                    fontWeight: 600,
                    color: INK,
                    whiteSpace: "nowrap",
                    transition: "color 0.15s ease, gap 0.15s ease",
                  }}
                >
                  Use this template
                  <LuArrowRight size={15} />
                </Box>
              </Link>
            </Box>
          ))}
        </Box>

        <Typography sx={{ mt: 4, fontSize: "0.88rem", color: "#9A94A6" }}>
          Every template carries 25 swappable themes. Picking one now does not
          lock you in.
        </Typography>
      </Container>
    </Box>
  );
}
