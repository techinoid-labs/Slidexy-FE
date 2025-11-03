import { v4 as uuidv4 } from "uuid";
const hexToRgba = (hex: string, alpha: number): string => {
const normalized = hex.startsWith('#') ? hex : `#${hex}`;
const r = parseInt(normalized.slice(1, 3), 16);
const g = parseInt(normalized.slice(3, 5), 16);
const b = parseInt(normalized.slice(5, 7), 16);
return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
export const createFullImageTextOverlaySlide = {
variant1: (slide: any, colors: any, textColor: string, SLIDE_WIDTH: number = 960, SLIDE_HEIGHT: number = 540) => ({
...slide,
slide_title: {
text: slide.slide_title?.text || "Immersive Impact",
konva_component: "Text",
properties: {
x: 60, y: 60, width: SLIDE_WIDTH - 120, height: 80,
fontSize: 44, fontFamily: "Raleway, sans-serif", fontWeight: "800",
fill: "#ffffff", align: "left", lineHeight: 1.1,
shadowColor: "rgba(0,0,0,0.5)", shadowBlur: 20, shadowOffsetY: 10
}
},
elements: [
// Optimized overlay for readability with vignette
{
element_type: "shape", konva_component: "Rect", shape_id: uuidv4(),
properties: {
x: 0, y: 0, width: SLIDE_WIDTH, height: SLIDE_HEIGHT,
fillRadialGradientStartPoint: { x: SLIDE_WIDTH/2, y: SLIDE_HEIGHT/2 },
fillRadialGradientEndPoint: { x: SLIDE_WIDTH/2, y: SLIDE_HEIGHT/2 },
fillRadialGradientStartRadius: 0,
fillRadialGradientEndRadius: Math.max(SLIDE_WIDTH, SLIDE_HEIGHT),
fillRadialGradientColorStops: [0, "transparent", 0.8, hexToRgba("#000000", 0.45), 1, hexToRgba("#000000", 0.6)]
}
},
// Subtle bottom fade
{
element_type: "shape", konva_component: "Rect", shape_id: uuidv4(),
properties: {
x: 0, y: SLIDE_HEIGHT - 150, width: SLIDE_WIDTH, height: 150,
fillLinearGradientStartPoint: { x: 0, y: SLIDE_HEIGHT - 150 },
fillLinearGradientEndPoint: { x: 0, y: SLIDE_HEIGHT },
fillLinearGradientColorStops: [0, "transparent", 1, "rgba(0,0,0,0.7)"]
}
}
]
}),
variant2: (slide: any, colors: any, textColor: string, SLIDE_WIDTH: number = 960, SLIDE_HEIGHT: number = 540) => ({
...slide,
slide_title: {
text: slide.slide_title?.text || "Narrative Closure",
konva_component: "Text",
properties: {
x: 60, y: SLIDE_HEIGHT - 180, width: SLIDE_WIDTH - 120, height: 60,
fontSize: 38, fontFamily: "Raleway, sans-serif", fontWeight: "700",
fill: "#ffffff", align: "left", lineHeight: 1.2,
shadowColor: "rgba(0,0,0,0.4)", shadowBlur: 15, shadowOffsetY: 8
}
},
elements: [
// Enhanced bottom gradient with color infusion
{
element_type: "shape", konva_component: "Rect", shape_id: uuidv4(),
properties: {
x: 0, y: SLIDE_HEIGHT - 220, width: SLIDE_WIDTH, height: 220,
fillLinearGradientStartPoint: { x: 0, y: SLIDE_HEIGHT - 220 },
fillLinearGradientEndPoint: { x: 0, y: SLIDE_HEIGHT },
fillLinearGradientColorStops: [0, "transparent", 0.3, hexToRgba(colors.primary, 0.2), 1, hexToRgba("#000000", 0.75)]
}
},
// Call-to-action accent line
{
element_type: "shape", konva_component: "Rect", shape_id: uuidv4(),
properties: {
x: 60, y: SLIDE_HEIGHT - 130, width: SLIDE_WIDTH - 120, height: 2,
fill: hexToRgba(colors.accent, 0.8), cornerRadius: 1
}
}
]
}),
variant3: (slide: any, colors: any, textColor: string, SLIDE_WIDTH: number = 960, SLIDE_HEIGHT: number = 540) => ({
...slide,
slide_title: {
text: slide.slide_title?.text || "Centered Reflection",
konva_component: "Text",
properties: {
x: SLIDE_WIDTH/2 - 250, y: SLIDE_HEIGHT/2 - 40, width: 500, height: 80,
fontSize: 40, fontFamily: "Raleway, sans-serif", fontWeight: "800",
fill: "#ffffff", align: "center", lineHeight: 1.1,
shadowColor: "rgba(0,0,0,0.6)", shadowBlur: 25, shadowOffsetY: 12
}
},
elements: [
// Circular vignette overlay
{
element_type: "shape", konva_component: "Ellipse", shape_id: uuidv4(),
properties: {
x: SLIDE_WIDTH/2, y: SLIDE_HEIGHT/2, radiusX: 250, radiusY: 150,
fill: hexToRgba("#000000", 0.55),
shadowColor: "rgba(0,0,0,0.3)", shadowBlur: 30
}
},
// Inner glow ring
{
element_type: "shape", konva_component: "Ellipse", shape_id: uuidv4(),
properties: {
x: SLIDE_WIDTH/2, y: SLIDE_HEIGHT/2, radiusX: 220, radiusY: 130,
fill: "transparent", stroke: hexToRgba(colors.accent, 0.3), strokeWidth: 4
}
}
]
}),
variant4: (slide: any, colors: any, textColor: string, SLIDE_WIDTH: number = 960, SLIDE_HEIGHT: number = 540) => ({
...slide,
slide_title: {
text: slide.slide_title?.text || "Lateral Emphasis",
konva_component: "Text",
properties: {
x: 60, y: 100, width: SLIDE_WIDTH/2 - 80, height: 120,
fontSize: 36, fontFamily: "Raleway, sans-serif", fontWeight: "700",
fill: "#ffffff", align: "left", lineHeight: 1.2,
shadowColor: "rgba(0,0,0,0.4)", shadowBlur: 18, shadowOffsetY: 9
}
},
elements: [
// Horizontal gradient overlay
{
element_type: "shape", konva_component: "Rect", shape_id: uuidv4(),
properties: {
x: 0, y: 0, width: SLIDE_WIDTH/2 + 50, height: SLIDE_HEIGHT,
fillLinearGradientStartPoint: { x: SLIDE_WIDTH/2 + 50, y: 0 },
fillLinearGradientEndPoint: { x: 0, y: 0 },
fillLinearGradientColorStops: [0, hexToRgba("#000000", 0.65), 1, "transparent"],
cornerRadius: [0, 40, 40, 0]
}
},
// Content divider line
{
element_type: "shape", konva_component: "Rect", shape_id: uuidv4(),
properties: {
x: SLIDE_WIDTH/2 - 1, y: 0, width: 2, height: SLIDE_HEIGHT,
fill: hexToRgba(colors.primary, 0.3)
}
}
]
}),
variant5: (slide: any, colors: any, textColor: string, SLIDE_WIDTH: number = 960, SLIDE_HEIGHT: number = 540) => ({
...slide,
slide_title: {
text: slide.slide_title?.text || "Dynamic Overlay",
konva_component: "Text",
properties: {
x: 80, y: 80, width: SLIDE_WIDTH - 160, height: 100,
fontSize: 46, fontFamily: "Raleway, sans-serif", fontWeight: "900",
fill: "#ffffff", align: "center", lineHeight: 1.1,
shadowColor: "rgba(0,0,0,0.5)", shadowBlur: 30, shadowOffsetY: 15
}
},
elements: [
// Diagonal overlay with rotation
{
element_type: "shape", konva_component: "Rect", shape_id: uuidv4(),
properties: {
x: -100, y: -100, width: 1160, height: 740,
fill: hexToRgba("#000000", 0.35), rotation: 8,
shadowColor: "rgba(0,0,0,0.2)", shadowBlur: 40
}
},
// Accent curve
{
element_type: "shape", konva_component: "Line", shape_id: uuidv4(),
properties: {
points: [0, SLIDE_HEIGHT, SLIDE_WIDTH, 0],
stroke: hexToRgba(colors.accent, 0.4), strokeWidth: 4, tension: 0.6, lineCap: "round"
}
}
]
})
};