"use client";

import React from "react";
import { Box } from "@mui/material";
import { SlideSpecRenderer } from "@/templates/SlideSpecRenderer";
import { STAGE_HEIGHT, STAGE_WIDTH } from "@/templates/tokens";
import type { SlideTemplate } from "@/templates/types";

/**
 * A real miniature of a template, rendered by the same renderer that draws
 * the slide.
 *
 * The picker used to show four coloured squares and two grey bars standing
 * in for a headline. That tells you a template's palette and nothing about
 * its typography, its composition or whether it carries 3D artwork, which
 * is most of what distinguishes one template from another here. Choosing
 * blind meant applying a template to find out, and applying rewrites the
 * whole deck.
 *
 * Rendering the actual spec is affordable because the whole catalogue is
 * eleven covers, the panel only mounts when it is opened, and the result is
 * memoised. Pointer events are off so a click lands on the card, not on a
 * block inside the slide.
 */
export interface TemplateThumbnailProps {
  template: SlideTemplate;
  /** Rendered width in px. Height follows the 16:9 stage. */
  width: number;
  /**
   * Which slide of the template to show. The cover says the most about a
   * template, so it is the default.
   */
  slideIndex?: number;
}

function TemplateThumbnailInner({ template, width, slideIndex = 0 }: TemplateThumbnailProps) {
  const spec = template.slides[slideIndex] ?? template.slides[0];
  const scale = width / STAGE_WIDTH;

  if (!spec) {
    return (
      <Box
        sx={{
          width,
          height: width * (STAGE_HEIGHT / STAGE_WIDTH),
          background: template.theme.palette.bg,
        }}
      />
    );
  }

  return (
    <Box
      aria-hidden
      sx={{
        width,
        height: Math.round(width * (STAGE_HEIGHT / STAGE_WIDTH)),
        overflow: "hidden",
        position: "relative",
        background: template.theme.palette.bg,
        // The slide inside is decorative here. Without this a click could
        // land on a text block and start an edit on a template the user has
        // not even applied yet.
        pointerEvents: "none",
        userSelect: "none",
      }}
    >
      <Box
        sx={{
          width: STAGE_WIDTH,
          height: STAGE_HEIGHT,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        <SlideSpecRenderer
          spec={spec}
          theme={template.theme}
          slideIndex={slideIndex}
          slideNumber={slideIndex + 1}
          isEditing={false}
        />
      </Box>
    </Box>
  );
}

/**
 * Memoised on the three things that change what is drawn. Without this
 * every keystroke elsewhere in the editor would re-render eleven slides.
 */
const TemplateThumbnail = React.memo(
  TemplateThumbnailInner,
  (a, b) =>
    a.template.id === b.template.id &&
    a.width === b.width &&
    a.slideIndex === b.slideIndex
);

TemplateThumbnail.displayName = "TemplateThumbnail";

export default TemplateThumbnail;
