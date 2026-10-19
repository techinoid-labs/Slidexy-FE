"use client";

import React from "react";
import { Box, Container, Typography } from "@mui/material";
import TextFieldsRounded from "@mui/icons-material/TextFieldsRounded";
import TableChartRounded from "@mui/icons-material/TableChartRounded";
import BarChartRounded from "@mui/icons-material/BarChartRounded";
import PhotoRounded from "@mui/icons-material/PhotoRounded";
import Mosaic from "./Mosaic";
import Gutter, { PURPOSE_GUTTER } from "./Gutter";
import { ACCENT, BONE_DEEP, Display, Hairline, INK, Lede, MONO, MUTED, RULE, SectionHead } from "./editorial";

/**
 * The handover.
 *
 * This section used to be a bento grid of purple cards: sparkle icons in
 * tinted circles, invented UI mockups, floating file-type badges, and a
 * panel for "AI Voice Assistance", a feature that does not exist.
 *
 * It now makes the one claim that is both true and hard for competitors to
 * match, and makes it concretely. Most AI deck tools export a picture of a
 * slide; this one writes real PowerPoint objects. That is worth a section,
 * and it is worth stating without decoration.
 */

const OBJECTS = [
  {
    icon: <TextFieldsRounded />,
    name: "Text boxes",
    detail: "Real, selectable, with the typeface and size intact. Click and retype.",
  },
  {
    icon: <TableChartRounded />,
    name: "Tables",
    detail: "Native PowerPoint tables. Add a row, change a cell, restyle it.",
  },
  {
    icon: <BarChartRounded />,
    name: "Charts",
    detail: "Bound to their own data sheet, so the numbers stay editable.",
  },
  {
    icon: <PhotoRounded />,
    name: "Images",
    detail: "Placed as images, because that is what they are.",
  },
];

export default function Purpose() {
  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        overflow: "hidden",
        bgcolor: BONE_DEEP,
        py: { xs: 8, md: 14 },
      }}
    >
      <Gutter items={PURPOSE_GUTTER} />

      <Container maxWidth="lg" sx={{ position: "relative" }}>
        <SectionHead index="02" label="The handover" />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.25fr 1fr" },
            gap: { xs: 3, md: 8 },
            alignItems: "end",
            mb: { xs: 5, md: 8 },
          }}
        >
          <Display>
            A PowerPoint file,<br />not a picture of one.
          </Display>
          <Lede sx={{ pb: 1 }}>
            Export from most AI deck tools and you get a flat image per slide.
            It opens, and nothing in it can be touched. Slidexy writes the
            actual objects, so the person you send it to can work.
          </Lede>
        </Box>

        {/* The comparison. Two columns, a rule between them, no cards. */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            borderTop: `1px solid ${RULE}`,
            mb: { xs: 6, md: 9 },
          }}
        >
          <Box
            sx={{
              py: { xs: 3, md: 4 },
              pr: { md: 6 },
              borderBottom: `1px solid ${RULE}`,
              borderRight: { xs: "none", md: `1px solid ${RULE}` },
            }}
          >
            <Typography
              sx={{
                fontFamily: MONO,
                fontSize: "0.7rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: MUTED,
                mb: 1.5,
              }}
            >
              Typical AI export
            </Typography>
            <Typography sx={{ fontSize: "1.05rem", color: INK, lineHeight: 1.55, mb: 1 }}>
              One flattened image per slide.
            </Typography>
            <Typography sx={{ fontSize: "0.92rem", color: MUTED, lineHeight: 1.6, maxWidth: 420 }}>
              Your client opens it six months later to change a number, and
              finds a photograph. The deck goes back to whoever made it, or
              gets rebuilt by hand.
            </Typography>
          </Box>

          <Box sx={{ py: { xs: 3, md: 4 }, pl: { md: 6 }, borderBottom: `1px solid ${RULE}` }}>
            <Typography
              sx={{
                fontFamily: MONO,
                fontSize: "0.7rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: ACCENT,
                mb: 1.5,
              }}
            >
              Slidexy export
            </Typography>
            <Typography sx={{ fontSize: "1.05rem", color: INK, lineHeight: 1.55, mb: 1 }}>
              Native objects, editable like anything else.
            </Typography>
            <Typography sx={{ fontSize: "0.92rem", color: MUTED, lineHeight: 1.6, maxWidth: 420 }}>
              Open it in PowerPoint, click a headline, and a cursor appears.
              Nothing about the file says it came from somewhere else.
            </Typography>
          </Box>
        </Box>

        {/* Cubes on the left for the palette, the type specimen on the
            right for the typeface. It sits between two dense ruled lists,
            so both halves are kept slow and quiet. */}
        <Box sx={{ borderTop: `1px solid ${RULE}`, pt: 3, mb: { xs: 5, md: 8 } }}>
          <Typography
            sx={{
              fontFamily: MONO,
              fontSize: "0.68rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: MUTED,
              mb: 2,
            }}
          >
            A theme is a palette and a way of setting type
          </Typography>
          <Mosaic />
        </Box>

        {/* What comes across, as a ruled spec list */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 2,
            alignItems: "start",
          }}
        >
          <Typography
            sx={{
              fontFamily: MONO,
              fontSize: "0.72rem",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: MUTED,
            }}
          >
            What comes across
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              borderTop: `1px solid ${RULE}`,
            }}
          >
            {OBJECTS.map((o, i) => (
              <Box
                key={o.name}
                sx={{
                  display: "flex",
                  gap: 2,
                  alignItems: "start",
                  py: 3,
                  pr: 3,
                  pl: { sm: i % 2 === 1 ? 4 : 0 },
                  borderBottom: `1px solid ${RULE}`,
                  borderRight: { xs: "none", sm: i % 2 === 0 ? `1px solid ${RULE}` : "none" },
                }}
              >
                <Box sx={{ color: INK, fontSize: 18, pt: 0.3, flexShrink: 0 }}>{o.icon}</Box>
                <Box>
                  <Typography sx={{ fontSize: "1rem", fontWeight: 600, color: INK, mb: 0.5 }}>
                    {o.name}
                  </Typography>
                  <Typography sx={{ fontSize: "0.9rem", color: MUTED, lineHeight: 1.55 }}>
                    {o.detail}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        <Hairline sx={{ mt: { xs: 5, md: 8 }, mb: 3 }} />

        <Typography sx={{ fontSize: "0.88rem", color: MUTED, maxWidth: 680, lineHeight: 1.6 }}>
          A handful of visuals have no honest PowerPoint equivalent: a Venn
          diagram, a device mockup. Those export as a picture of that one
          element, never the whole slide.
        </Typography>
      </Container>
    </Box>
  );
}
