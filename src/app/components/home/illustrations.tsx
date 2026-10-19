"use client";

import React from "react";
import { motion } from "framer-motion";
import { ACCENT, INK, RULE } from "./editorial";

/**
 * Original line drawings for the marketing site.
 *
 * Drawn rather than sourced, for two reasons. Stock illustration is
 * instantly recognisable and dates a page within a year, and the usual
 * alternative (a screenshot of the product) is off the table while the
 * templates are still being redesigned.
 *
 * The style is technical drawing, not decoration: thin consistent strokes,
 * hard edges, one accent doing the emphasis, and every shape standing for
 * something real rather than being there to fill space. Nothing is
 * randomised, so these render identically every time.
 */

const STROKE = 1.4;

/**
 * Sentence to outline to deck.
 *
 * The three stages are drawn at the same scale so the growth in structure
 * is the point: one line becomes six, six become a grid.
 */
export const ProcessDrawing: React.FC<{ className?: string }> = ({ className }) => {
  // Draws itself in on scroll, left to right, in the same order the product
  // works: you type, it structures, you get slides. The motion is carrying
  // the sequence, which is the only reason it earns its place.
  const stage = (delay: number) => ({
    initial: { opacity: 0, y: 8 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.4 },
    transition: { delay, duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <motion.svg
      viewBox="0 0 1100 300"
      className={className}
      style={{ width: "100%", height: "auto", display: "block" }}
      role="img"
      aria-label="A sentence becomes an outline, and the outline becomes a deck"
      initial="rest"
      whileInView="go"
      viewport={{ once: true, amount: 0.4 }}
    >
      <defs>
        <marker id="pd-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0L10 5L0 10z" fill={INK} />
        </marker>
      </defs>

      {/* Stage 1: what you type */}
      <motion.g {...stage(0)}>
        <rect x="12" y="104" width="266" height="62" fill="none" stroke={INK} strokeWidth={STROKE} />
        <line x1="36" y1="128" x2="214" y2="128" stroke={INK} strokeWidth={STROKE} opacity="0.75" />
        <line x1="36" y1="144" x2="160" y2="144" stroke={INK} strokeWidth={STROKE} opacity="0.4" />
        <motion.line
          x1="166" y1="137" x2="166" y2="151" stroke={ACCENT} strokeWidth="2"
          animate={{ opacity: [1, 1, 0, 0, 1] }}
          transition={{ duration: 1.1, repeat: Infinity, times: [0, 0.45, 0.5, 0.95, 1] }}
        />
      </motion.g>

      <motion.path d="M292 135 H348" fill="none" stroke={INK} strokeWidth={STROKE} markerEnd="url(#pd-arrow)" {...stage(0.3)} />

      {/* Stage 2: the outline */}
      <motion.g {...stage(0.42)}>
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const y = 60 + i * 32;
          const w = [148, 196, 124, 176, 138, 168][i];
          return (
            <motion.g
              key={i}
              initial={{ opacity: 0, x: -6 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: 0.5 + i * 0.07, duration: 0.3 }}
            >
              <line x1="366" y1={y} x2="382" y2={y} stroke={ACCENT} strokeWidth={STROKE} />
              <line x1="396" y1={y} x2={396 + w} y2={y} stroke={INK} strokeWidth={STROKE} opacity={0.78} />
            </motion.g>
          );
        })}
        <path d="M350 48 H340 V204 H350" fill="none" stroke={RULE} strokeWidth={STROKE} />
      </motion.g>

      <motion.path d="M620 135 H676" fill="none" stroke={INK} strokeWidth={STROKE} markerEnd="url(#pd-arrow)" {...stage(0.95)} />

      {/* Stage 3: the deck */}
      <motion.g {...stage(1.05)}>
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const col = i % 3;
          const row = Math.floor(i / 3);
          const x = 694 + col * 134;
          const y = 70 + row * 92;
          const lead = i === 0;
          return (
            <motion.g
              key={i}
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: 1.12 + i * 0.06, duration: 0.3 }}
              style={{ transformOrigin: `${x + 59}px ${y + 34}px` }}
            >
              <rect x={x} y={y} width={118} height={68} fill="none" stroke={lead ? ACCENT : INK} strokeWidth={lead ? 2 : STROKE} opacity={lead ? 1 : 0.55} />
              <line x1={x + 12} y1={y + 22} x2={x + 74} y2={y + 22} stroke={lead ? ACCENT : INK} strokeWidth={STROKE} opacity={lead ? 0.9 : 0.5} />
              <line x1={x + 12} y1={y + 38} x2={x + 56} y2={y + 38} stroke={INK} strokeWidth={STROKE} opacity="0.28" />
              <line x1={x + 12} y1={y + 50} x2={x + 90} y2={y + 50} stroke={INK} strokeWidth={STROKE} opacity="0.28" />
            </motion.g>
          );
        })}
      </motion.g>
    </motion.svg>
  );
};

/**
 * Original line drawings for the marketing site.
 *
 * Drawn rather than sourced, for two reasons. Stock illustration is
 * instantly recognisable and dates a page within a year, and the usual
 * alternative (a screenshot of the product) is off the table while the
 * templates are still being redesigned.
 *
 * The style is technical drawing, not decoration: thin consistent strokes,
 * hard edges, one accent doing the emphasis, and every shape standing for
 * something real rather than being there to fill space. Nothing is
 * randomised, so these render identically every time.
 */

/**
 * Direct manipulation: one block lifted out of the layout, with handles.
 *
 * Drawn from the actual behaviour in the editor rather than invented, so
 * the handle positions and the snap guide match what a user would see.
 */
export const EditDrawing: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 560 320"
    className={className}
    style={{ width: "100%", height: "auto", display: "block" }}
    role="img"
    aria-label="A block lifted out of the layout, with resize handles and a snap guide"
  >
    {/* slide frame */}
    <rect x="12" y="12" width="536" height="296" fill="none" stroke={INK} strokeWidth={STROKE} />

    {/* content still held by the layout */}
    <line x1="44" y1="62" x2="250" y2="62" stroke={INK} strokeWidth="3" opacity="0.8" />
    <line x1="44" y1="84" x2="196" y2="84" stroke={INK} strokeWidth={STROKE} opacity="0.3" />
    <line x1="44" y1="100" x2="222" y2="100" stroke={INK} strokeWidth={STROKE} opacity="0.3" />
    <line x1="44" y1="208" x2="170" y2="208" stroke={INK} strokeWidth={STROKE} opacity="0.3" />
    <line x1="44" y1="224" x2="208" y2="224" stroke={INK} strokeWidth={STROKE} opacity="0.3" />

    {/* snap guide: the vertical centre of the slide */}
    <line x1="280" y1="12" x2="280" y2="308" stroke={ACCENT} strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />

    {/* the unlocked block */}
    <rect x="280" y="126" width="208" height="124" fill="none" stroke={ACCENT} strokeWidth="2" />
    <line x1="300" y1="158" x2="400" y2="158" stroke={ACCENT} strokeWidth="2.5" opacity="0.85" />
    <line x1="300" y1="182" x2="446" y2="182" stroke={INK} strokeWidth={STROKE} opacity="0.35" />
    <line x1="300" y1="198" x2="412" y2="198" stroke={INK} strokeWidth={STROKE} opacity="0.35" />

    {/* eight handles, as the editor draws them */}
    {[
      [280, 126], [384, 126], [488, 126],
      [280, 188], [488, 188],
      [280, 250], [384, 250], [488, 250],
    ].map(([x, y]) => (
      <rect key={`${x}-${y}`} x={x - 4.5} y={y - 4.5} width="9" height="9" fill="#fff" stroke={ACCENT} strokeWidth="1.5" />
    ))}
  </svg>
);

/**
 * The export comparison: a flattened picture against real objects.
 *
 * The left file has one locked image inside it. The right has separate,
 * individually outlined pieces. The padlock is the only pictogram here,
 * and it is carrying the whole argument, so it earns its place.
 */
export const ExportDrawing: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 560 260"
    className={className}
    style={{ width: "100%", height: "auto", display: "block" }}
    role="img"
    aria-label="A flattened export next to one made of separate editable objects"
  >
    {/* left: flattened */}
    <g>
      <rect x="14" y="40" width="228" height="150" fill="none" stroke={INK} strokeWidth={STROKE} opacity="0.5" />
      {/* hatching: one sealed surface */}
      {Array.from({ length: 16 }).map((_, i) => (
        <line
          key={i}
          x1={22 + i * 14}
          y1={186}
          x2={22 + i * 14 + 40}
          y2={44}
          stroke={INK}
          strokeWidth="0.9"
          opacity="0.14"
        />
      ))}
      {/* padlock */}
      <g transform="translate(112 98)">
        <rect x="0" y="12" width="32" height="24" rx="2" fill="none" stroke={INK} strokeWidth={STROKE} opacity="0.6" />
        <path d="M7 12 V7 a9 9 0 0 1 18 0 V12" fill="none" stroke={INK} strokeWidth={STROKE} opacity="0.6" />
      </g>
    </g>

    {/* right: separate objects */}
    <g>
      <rect x="302" y="40" width="244" height="150" fill="none" stroke={INK} strokeWidth={STROKE} />
      {/* heading object */}
      <rect x="320" y="58" width="150" height="22" fill="none" stroke={ACCENT} strokeWidth="1.6" />
      {/* table object */}
      <rect x="320" y="94" width="118" height="78" fill="none" stroke={ACCENT} strokeWidth="1.6" />
      <line x1="320" y1="120" x2="438" y2="120" stroke={ACCENT} strokeWidth="1" opacity="0.5" />
      <line x1="320" y1="146" x2="438" y2="146" stroke={ACCENT} strokeWidth="1" opacity="0.5" />
      <line x1="379" y1="94" x2="379" y2="172" stroke={ACCENT} strokeWidth="1" opacity="0.5" />
      {/* chart object */}
      <rect x="454" y="94" width="74" height="78" fill="none" stroke={ACCENT} strokeWidth="1.6" />
      <rect x="464" y="140" width="12" height="22" fill={ACCENT} opacity="0.35" />
      <rect x="482" y="124" width="12" height="38" fill={ACCENT} opacity="0.55" />
      <rect x="500" y="110" width="12" height="52" fill={ACCENT} opacity="0.8" />
      {/* caret, showing it is editable */}
      <line x1="476" y1="62" x2="476" y2="76" stroke={ACCENT} strokeWidth="2" />
    </g>
  </svg>
);
