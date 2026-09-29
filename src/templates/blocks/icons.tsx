"use client";

import React from "react";

/**
 * Inline SVG icon set.
 *
 * Deliberately not an icon font or a runtime package import: html2canvas
 * rasterises what is in the DOM, so an icon that arrives over the network or
 * via a font ligature can export as a blank box. These are plain paths on a
 * 24x24 grid, stroke-based, and always present.
 */

export interface IconProps {
  size?: number;
  color?: string;
}

const svg =
  (children: React.ReactNode, filled = false) =>
  ({ size = 18, color = "currentColor" }: IconProps) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? color : "none"}
      stroke={filled ? "none" : color}
      strokeWidth={1.9}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: "block", flexShrink: 0 }}
      aria-hidden
    >
      {children}
    </svg>
  );

export const FallbackIcon = svg(
  <>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="3" />
  </>
);

export const ICONS: Record<string, React.FC<IconProps>> = {
  // ── growth & business ──────────────────────────────────────────────────
  trendingUp: svg(
    <>
      <polyline points="3 17 9 11 13 15 21 7" />
      <polyline points="15 7 21 7 21 13" />
    </>
  ),
  barChart: svg(
    <>
      <line x1="5" y1="20" x2="5" y2="12" />
      <line x1="12" y1="20" x2="12" y2="5" />
      <line x1="19" y1="20" x2="19" y2="9" />
    </>
  ),
  pieChart: svg(
    <>
      <path d="M21 15.5A9 9 0 1 1 8.5 3v9h12.5Z" />
      <path d="M21 8.5A9 9 0 0 0 15.5 3v5.5Z" />
    </>
  ),
  target: svg(
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.4" />
    </>
  ),
  rocket: svg(
    <>
      <path d="M5 15c-1 2-1 5-1 5s3 0 5-1" />
      <path d="M14.5 4.5C17 2 21 3 21 3s1 4-1.5 6.5L12 17l-5-5Z" />
      <circle cx="16" cy="8" r="1.4" />
    </>
  ),
  money: svg(
    <>
      <rect x="2.5" y="6" width="19" height="12" rx="2" />
      <circle cx="12" cy="12" r="2.6" />
    </>
  ),
  dollar: svg(
    <>
      <line x1="12" y1="2.5" x2="12" y2="21.5" />
      <path d="M16.5 6.5H10a3.25 3.25 0 0 0 0 6.5h4a3.25 3.25 0 0 1 0 6.5H7" />
    </>
  ),
  briefcase: svg(
    <>
      <rect x="2.5" y="7" width="19" height="13" rx="2" />
      <path d="M8.5 7V5a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v2" />
    </>
  ),
  building: svg(
    <>
      <rect x="4" y="3" width="16" height="18" rx="1.5" />
      <line x1="9" y1="7.5" x2="9" y2="7.5" />
      <line x1="15" y1="7.5" x2="15" y2="7.5" />
      <line x1="9" y1="12" x2="9" y2="12" />
      <line x1="15" y1="12" x2="15" y2="12" />
      <path d="M10 21v-4h4v4" />
    </>
  ),
  handshake: svg(
    <>
      <path d="M2.5 12.5 7 8l3 2.5 3-2.5 4.5 4.5" />
      <path d="M7 16.5 10 19l2-1.5 2 1.5 3-2.5" />
    </>
  ),

  // ── product & tech ─────────────────────────────────────────────────────
  bolt: svg(<polygon points="13 2 4 14 11 14 10 22 20 9 13 9 13 2" />, true),
  cpu: svg(
    <>
      <rect x="6" y="6" width="12" height="12" rx="1.5" />
      <rect x="9.5" y="9.5" width="5" height="5" rx="0.8" />
      <path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3" />
    </>
  ),
  cloud: svg(<path d="M7 18h9.5a3.5 3.5 0 0 0 .3-7A5.5 5.5 0 0 0 6.4 9.9 3.6 3.6 0 0 0 7 18Z" />),
  code: svg(
    <>
      <polyline points="8 6 3 12 8 18" />
      <polyline points="16 6 21 12 16 18" />
    </>
  ),
  layers: svg(
    <>
      <polygon points="12 2.5 22 8 12 13.5 2 8 12 2.5" />
      <polyline points="2 16 12 21.5 22 16" />
    </>
  ),
  smartphone: svg(
    <>
      <rect x="7" y="2.5" width="10" height="19" rx="2" />
      <line x1="11" y1="18.5" x2="13" y2="18.5" />
    </>
  ),
  monitor: svg(
    <>
      <rect x="2.5" y="4" width="19" height="12.5" rx="2" />
      <line x1="8" y1="20.5" x2="16" y2="20.5" />
      <line x1="12" y1="16.5" x2="12" y2="20.5" />
    </>
  ),
  settings: svg(
    <>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 2.5v3M12 18.5v3M21.5 12h-3M5.5 12h-3M18.7 5.3l-2.1 2.1M7.4 16.6l-2.1 2.1M18.7 18.7l-2.1-2.1M7.4 7.4 5.3 5.3" />
    </>
  ),
  shield: svg(<path d="M12 2.5 20 6v6c0 4.6-3.3 8.4-8 9.5-4.7-1.1-8-4.9-8-9.5V6Z" />),
  lock: svg(
    <>
      <rect x="4.5" y="10.5" width="15" height="10" rx="2" />
      <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
    </>
  ),
  database: svg(
    <>
      <ellipse cx="12" cy="6" rx="8" ry="3.2" />
      <path d="M4 6v12c0 1.8 3.6 3.2 8 3.2s8-1.4 8-3.2V6" />
      <path d="M4 12c0 1.8 3.6 3.2 8 3.2s8-1.4 8-3.2" />
    </>
  ),

  // ── people ─────────────────────────────────────────────────────────────
  users: svg(
    <>
      <circle cx="9" cy="8" r="3.4" />
      <path d="M2.8 20a6.2 6.2 0 0 1 12.4 0" />
      <path d="M16.5 5.2a3.4 3.4 0 0 1 0 6.6" />
      <path d="M18 20a6 6 0 0 0-2.3-4.7" />
    </>
  ),
  user: svg(
    <>
      <circle cx="12" cy="8" r="3.6" />
      <path d="M5 20a7 7 0 0 1 14 0" />
    </>
  ),
  userCheck: svg(
    <>
      <circle cx="10" cy="8" r="3.6" />
      <path d="M3 20a7 7 0 0 1 12.2-4.7" />
      <polyline points="16 17.5 18 19.5 21.5 15.5" />
    </>
  ),
  heart: svg(<path d="M12 20.5s-7.5-4.6-7.5-9.7A4.3 4.3 0 0 1 12 8.2a4.3 4.3 0 0 1 7.5 2.6c0 5.1-7.5 9.7-7.5 9.7Z" />),
  star: svg(<polygon points="12 2.8 14.9 9 21.5 9.8 16.6 14.3 17.9 21 12 17.7 6.1 21 7.4 14.3 2.5 9.8 9.1 9" />, true),
  award: svg(
    <>
      <circle cx="12" cy="9" r="5.5" />
      <polyline points="8.5 13.5 7.5 21.5 12 19 16.5 21.5 15.5 13.5" />
    </>
  ),
  megaphone: svg(
    <>
      <path d="M3.5 10v4a1.5 1.5 0 0 0 1.5 1.5h2L16 20V4L7 8.5H5A1.5 1.5 0 0 0 3.5 10Z" />
      <path d="M19 9.5a3.5 3.5 0 0 1 0 5" />
    </>
  ),

  // ── process & planning ─────────────────────────────────────────────────
  calendar: svg(
    <>
      <rect x="3.5" y="5" width="17" height="16" rx="2" />
      <line x1="3.5" y1="10" x2="20.5" y2="10" />
      <line x1="8" y1="2.8" x2="8" y2="6" />
      <line x1="16" y1="2.8" x2="16" y2="6" />
    </>
  ),
  clock: svg(
    <>
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 6.8 12 12 15.6 14" />
    </>
  ),
  checkCircle: svg(
    <>
      <circle cx="12" cy="12" r="9" />
      <polyline points="7.8 12.3 10.8 15.2 16.4 9.2" />
    </>
  ),
  check: svg(<polyline points="4.5 12.5 9.5 17.5 19.5 6.5" />),
  close: svg(
    <>
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </>
  ),
  minus: svg(<line x1="6" y1="12" x2="18" y2="12" />),
  clipboard: svg(
    <>
      <rect x="5" y="4.5" width="14" height="17" rx="2" />
      <path d="M9 4.5V3.6A1.6 1.6 0 0 1 10.6 2h2.8A1.6 1.6 0 0 1 15 3.6v.9Z" />
      <line x1="9" y1="11" x2="15" y2="11" />
      <line x1="9" y1="15" x2="13" y2="15" />
    </>
  ),
  flag: svg(
    <>
      <path d="M5 21V4.5s2-1 5-1 5 2 8 2v9c-3 0-5-2-8-2s-5 1-5 1" />
    </>
  ),
  map: svg(
    <>
      <polygon points="2.8 6.2 9 3.5 15 6.5 21.2 3.8 21.2 17.8 15 20.5 9 17.5 2.8 20.2" />
      <line x1="9" y1="3.5" x2="9" y2="17.5" />
      <line x1="15" y1="6.5" x2="15" y2="20.5" />
    </>
  ),
  pin: svg(
    <>
      <path d="M12 21.5s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11Z" />
      <circle cx="12" cy="10.5" r="2.6" />
    </>
  ),
  globe: svg(
    <>
      <circle cx="12" cy="12" r="9" />
      <ellipse cx="12" cy="12" rx="4" ry="9" />
      <line x1="3.2" y1="9.5" x2="20.8" y2="9.5" />
      <line x1="3.2" y1="14.5" x2="20.8" y2="14.5" />
    </>
  ),
  arrowRight: svg(
    <>
      <line x1="4" y1="12" x2="19" y2="12" />
      <polyline points="13.5 6.5 20 12 13.5 17.5" />
    </>
  ),
  refresh: svg(
    <>
      <path d="M20.5 12a8.5 8.5 0 1 1-2.6-6.1" />
      <polyline points="20.5 3.5 20.5 9 15 9" />
    </>
  ),

  // ── content & comms ────────────────────────────────────────────────────
  mail: svg(
    <>
      <rect x="2.5" y="5" width="19" height="14" rx="2" />
      <polyline points="3.5 7 12 13 20.5 7" />
    </>
  ),
  phone: svg(
    <path d="M6.5 3.5h3l1.5 4-2 1.5a12 12 0 0 0 5.5 5.5l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2Z" />
  ),
  link: svg(
    <>
      <path d="M10 13.5a4 4 0 0 0 5.7 0l3-3a4 4 0 1 0-5.7-5.7l-1.6 1.6" />
      <path d="M14 10.5a4 4 0 0 0-5.7 0l-3 3a4 4 0 1 0 5.7 5.7l1.6-1.6" />
    </>
  ),
  document: svg(
    <>
      <path d="M6 2.5h7l5 5v14H6Z" />
      <polyline points="13 2.5 13 7.5 18 7.5" />
      <line x1="9" y1="13" x2="15" y2="13" />
      <line x1="9" y1="16.5" x2="13" y2="16.5" />
    </>
  ),
  book: svg(
    <>
      <path d="M4 4.5A2 2 0 0 1 6 2.5h13v17H6a2 2 0 0 0-2 2Z" />
      <line x1="8" y1="7" x2="15" y2="7" />
    </>
  ),
  search: svg(
    <>
      <circle cx="11" cy="11" r="6.5" />
      <line x1="16" y1="16" x2="21" y2="21" />
    </>
  ),
  lightbulb: svg(
    <>
      <path d="M9 17.5a5.5 5.5 0 1 1 6 0v1.5a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 19Z" />
      <line x1="10" y1="22" x2="14" y2="22" />
    </>
  ),
  quote: svg(
    <path d="M9.5 5.5C6.5 6.8 5 9.3 5 13v5.5h6V12H8c0-2.2.8-3.7 2.5-4.5Zm9 0C15.5 6.8 14 9.3 14 13v5.5h6V12h-3c0-2.2.8-3.7 2.5-4.5Z" />,
    true
  ),
  play: svg(<polygon points="7 4.5 19.5 12 7 19.5" />, true),
  camera: svg(
    <>
      <rect x="2.5" y="6.5" width="19" height="13" rx="2" />
      <circle cx="12" cy="13" r="3.6" />
      <path d="M8.5 6.5 10 4h4l1.5 2.5" />
    </>
  ),
  palette: svg(
    <>
      <path d="M12 21a9 9 0 1 1 9-9c0 2-1.6 3-3.2 3H16a2 2 0 0 0-1.4 3.4A1.8 1.8 0 0 1 12 21Z" />
      <circle cx="7.8" cy="12" r="1.1" />
      <circle cx="10" cy="8" r="1.1" />
      <circle cx="14.5" cy="8" r="1.1" />
    </>
  ),

  // ── sector ─────────────────────────────────────────────────────────────
  health: svg(
    <>
      <path d="M3 12h4l2-4 3 8 2-4h7" />
    </>
  ),
  leaf: svg(
    <>
      <path d="M4 20c0-8 5-14 16-15 0 11-5 15-11 15a5 5 0 0 1-5-5Z" />
      <line x1="4" y1="20" x2="12" y2="12" />
    </>
  ),
  graduation: svg(
    <>
      <polygon points="12 3.5 22 8 12 12.5 2 8 12 3.5" />
      <path d="M6 10v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5" />
    </>
  ),
  scale: svg(
    <>
      <line x1="12" y1="3.5" x2="12" y2="20.5" />
      <line x1="6" y1="20.5" x2="18" y2="20.5" />
      <path d="M12 6 4 9l2.5 4.5a3.4 3.4 0 0 0 5 0L14 9Z" />
      <path d="M12 6l8 3-2.5 4.5a3.4 3.4 0 0 1-5 0" />
    </>
  ),
  home: svg(
    <>
      <polyline points="3.5 11 12 3.5 20.5 11" />
      <path d="M5.5 9.5V20.5h13V9.5" />
      <rect x="10" y="14" width="4" height="6.5" />
    </>
  ),
  cart: svg(
    <>
      <circle cx="9.5" cy="20" r="1.4" />
      <circle cx="17.5" cy="20" r="1.4" />
      <path d="M2.5 3.5h2.8l2.4 11.3h11l2.3-8.3H6.2" />
    </>
  ),
  plane: svg(<path d="M21 14.5 13.5 12V5.2a1.6 1.6 0 0 0-3.2 0V12L3 14.5v2l7.3-1.8v4l-2.3 1.6v1.2l3.9-1 3.9 1v-1.2L13.5 18.7v-4L21 16.5Z" />, true),
};

export type IconName = keyof typeof ICONS;
