// utils/colorUtils.ts
import tinycolor from "tinycolor2";

export function getContrastingBackground(hexColor: string): string {
  const base = tinycolor(hexColor);

  const darkest = base.clone().darken(50).toHexString();
  const lightest = base.clone().lighten(50).toHexString();

  return `
    radial-gradient(circle at top left, ${lightest}, transparent 40%),
    radial-gradient(circle at bottom right, ${darkest}, transparent 40%),
    linear-gradient(135deg, ${darkest}, ${base.toHexString()}, ${lightest})
  `;
}
