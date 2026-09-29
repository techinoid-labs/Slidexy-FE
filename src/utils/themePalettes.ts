// Shared quick-pick color palettes, used by both the left rail's Themes
// panel (Template.tsx) and the right property panel's theme picker
// (ThemePallete.tsx) — previously duplicated only in the latter.

export const palettes: string[][] = [
  // Lighter Purple (default/first applying)
  ["#F8F4FF", "#9575CD", "#E6D6FF", "#5E35B1"],
  // Original Purple
  ["#F3E5F5", "#7B1FA2", "#E1BEE7", "#4A148C"],
  // Red
  ["#FFF7F7", "#D32F2F", "#FFCDD2", "#B71C1C"],
  // Green
  ["#E8F5E8", "#2E7D32", "#C8E6C9", "#1B5E20"],
  // Black/White
  ["#ffffff", "#000000", "#333333", "#666666"],
  // Blue
  ["#E3F2FD", "#0D47A1", "#BBDEFB", "#01579B"],
  // Orange
  ["#FFF8E1", "#BF360C", "#FFE0B2", "#E65100"],
  // Pink
  ["#FCE4EC", "#C2185B", "#F8BBD9", "#880E4F"],
  // Teal
  ["#E0F2F1", "#00695C", "#B2DFDB", "#004D40"],
  // Pastel Yellow
  ["#FFFDE7", "#FBC02D", "#FFF59D", "#F57F17"],
  // Cool Grey
  ["#FAFAFA", "#757575", "#E0E0E0", "#424242"],
];

export const paletteToTheme = (palette: string[]) => ({
  font: "Raleway",
  primaryColor: palette[1],
  secondaryColor: palette[2],
  backgroundColor: palette[0],
  titleColor: palette[1],
  image_url: "",
  artPalette: [palette[1], palette[3] || palette[1], palette[1], palette[0], palette[0]],
});
