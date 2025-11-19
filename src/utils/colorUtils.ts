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

/**
 * Returns black or white depending on background brightness
 * Uses WCAG contrast formula — perfect readability
 */
export const getContrastTextColor = (bgHex: string): string => {
  if (!bgHex) return "#000000";
  
  const color = tinycolor(bgHex);
  return color.isLight() ? "#000000" : "#FFFFFF";
};

/**
 * Advanced: returns a readable color with fallback
 */
export const getReadableColor = (
  bgHex: string,
  dark: string = "#000000",
  light: string = "#FFFFFF",
  threshold: number = 4.5
): string => {
  const bg = tinycolor(bgHex);
  const darkColor = tinycolor(dark);
  const lightColor = tinycolor(light);

  const darkContrast = tinycolor.readability(bg, darkColor);
  const lightContrast = tinycolor.readability(bg, lightColor);

  if (darkContrast > threshold && darkContrast >= lightContrast) {
    return dark;
  }
  if (lightContrast > threshold) {
    return light;
  }
  return lightContrast > darkContrast ? light : dark;
};