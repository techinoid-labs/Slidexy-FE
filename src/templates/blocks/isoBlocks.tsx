"use client";

import React from "react";
import { Text, useBlockEdit, useTokens } from "./primitives";
import { withAlpha } from "../tokens";
import { ASSETS_3D, asset3d, asset3dHeight } from "../assets3d";
import type { Iso3dBlock } from "../types";

/**
 * A row of 3D objects, each with a label.
 *
 * Two modes, and the difference matters more than it looks:
 *
 *   DIVIDED (the band). Columns separated by hairlines, anchored to both
 *   margins, each one a small object over a caps label over a line of body.
 *   This is the content half of the editorial frame, and it is what stops a
 *   slide reading as three things floating in the middle of nowhere. Objects
 *   stay small here, because the headline is the composition.
 *
 *   PLAIN (a hero row). Larger objects, centred, no rules. For a slide whose
 *   whole job is the three figures.
 *
 * The objects come from `assets3d.tsx`, so they are flat divs in the browser
 * and real PowerPoint geometry on export. Nothing here may wrap them in a
 * gradient, a shadow or a clip-path, or the slide stops being editable at
 * exactly the point a customer looks closest.
 */
export const Iso3dBlockView: React.FC<{ block: Iso3dBlock }> = ({ block }) => {
  const t = useTokens();
  const divided = !!block.divided;
  const columns = block.style?.columns ?? block.items.length ?? 1;
  const { slideLayout } = useBlockEdit();

  // A showcase slide gives the object the middle band rather than half
  // the slide, so a tall object sized by width runs into the headline
  // above it. Clamp by rendered height, which is the dimension that is
  // actually short, and which only the asset knows.
  const asked = block.scale ?? (divided ? 86 : 150);
  const aspect = Math.max(...block.items.map((it) => asset3dHeight(it.asset, 1)));
  const size =
    slideLayout === "showcase" ? Math.min(asked, Math.round(196 / (aspect || 1))) : asked;

  // In the band the column is read left to right like a paragraph; a hero
  // row is a display of objects and centres.
  const centred = (block.style?.align ?? (divided ? "left" : "center")) === "center";

  // One ground line for the whole row. Objects differ in height at the same
  // width, so without a shared box a mixed row staggers and the labels step
  // down the slide, which is the first thing that reads as unfinished.
  const rowHeight = Math.max(...block.items.map((it) => asset3dHeight(it.asset, size)));

  // In a band the objects also share a cap height. Sized by width, a column
  // next to a hex tile is twice the height of it and the row reads ragged
  // along the top; matched on height they read as one set of objects.
  const widthFor = (asset: string) =>
    divided ? Math.round(rowHeight / (asset3dHeight(asset, 1) || 1)) : size;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${Math.max(1, columns)}, minmax(0, 1fr))`,
        gap: divided ? 0 : t.space(5),
        alignItems: "start",
        alignContent: divided ? "end" : "center",
        width: "100%",
        height: divided ? undefined : "100%",
      }}
    >
      {block.items.map((item, i) => {
        const Asset = asset3d(item.asset);
        const colour = t.accent(item.accent ?? i + 1);
        const first = i === 0;

        return (
          <div
            key={item.id}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: centred ? "center" : "flex-start",
              textAlign: centred ? "center" : "left",
              gap: divided ? t.space(2) : t.space(3),
              minWidth: 0,
              // The hairline between columns. A rule rather than a gap is
              // what makes the row read as one band instead of three cards.
              borderLeft: divided && !first ? `1px solid ${withAlpha(t.palette.text, 0.16)}` : undefined,
              paddingLeft: divided && !first ? t.space(5) : undefined,
              paddingRight: divided ? t.space(5) : undefined,
            }}
          >
            {/* The object stands on the floor of a fixed box, so every object
                in the row rests on the same line. */}
            <div
              style={{
                height: rowHeight,
                display: "flex",
                alignItems: "flex-end",
                justifyContent: centred ? "center" : "flex-start",
                marginBottom: divided ? t.space(1) : 0,
              }}
            >
              <Asset palette={t.palette} color={colour} size={widthFor(item.asset)} />
            </div>

            {item.value?.text && (
              <Text
                blockId={block.id}
                path={`items.${i}.value`}
                value={item.value}
                token={divided ? "h1" : "stat"}
                color={divided ? t.palette.text : colour}
                align={centred ? "center" : "left"}
              />
            )}

            <Text
              blockId={block.id}
              path={`items.${i}.title`}
              value={item.title}
              token={divided ? "label" : "h3"}
              color={t.palette.text}
              align={centred ? "center" : "left"}
              uppercase={divided}
            />

            {item.body?.text && (
              <Text
                blockId={block.id}
                path={`items.${i}.body`}
                value={item.body}
                token="small"
                color={t.palette.textMuted}
                align={centred ? "center" : "left"}
                clamp={4}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

/** Names a template author can pass as `asset`, for editor pickers. */
export const ISO_ASSET_OPTIONS = Object.entries(ASSETS_3D).map(([key, v]) => ({
  key,
  label: v.meta.name,
  use: v.meta.use,
}));
