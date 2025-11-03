import { v4 as uuidv4 } from "uuid";
const hexToRgba = (hex: string, alpha: number): string => {
const normalized = hex.startsWith('#') ? hex : `#${hex}`;
const r = parseInt(normalized.slice(1, 3), 16);
const g = parseInt(normalized.slice(3, 5), 16);
const b = parseInt(normalized.slice(5, 7), 16);
return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
export const createComparisonSlide = {
variant1: (slide: any, colors: any, textColor: string, SLIDE_WIDTH: number = 960, SLIDE_HEIGHT: number = 540) => {
const leftBullets = slide.elements?.filter((el: any) => el.element_type === "left_bullet") || [];
const rightBullets = slide.elements?.filter((el: any) => el.element_type === "right_bullet") || [];
return {
...slide,
slide_title: {
text: slide.slide_title?.text || "Feature Comparison",
konva_component: "Text",
properties: {
x: 60, y: 40, width: SLIDE_WIDTH - 120, height: 60,
fontSize: 36, fontFamily: "Raleway, sans-serif", fontWeight: "700",
fill: textColor, align: "center", lineHeight: 1.2,
shadowColor: hexToRgba(textColor, 0.15), shadowBlur: 8, shadowOffsetY: 4
}
},
elements: [
{ element_type: "shape", konva_component: "Rect", shape_id: uuidv4(),
properties: { x: 0, y: 0, width: SLIDE_WIDTH, height: SLIDE_HEIGHT, fill: colors.background }
},
// Enhanced two-column layout with subtle shadows
{
element_type: "shape", konva_component: "Rect", shape_id: uuidv4(),
properties: {
x: 80, y: 120, width: SLIDE_WIDTH/2 - 120, height: SLIDE_HEIGHT - 200,
fill: hexToRgba(colors.primary, 0.08), cornerRadius: 16,
shadowColor: hexToRgba(colors.primary, 0.1), shadowBlur: 12, shadowOffsetY: 6
}
},
{
element_type: "shape", konva_component: "Rect", shape_id: uuidv4(),
properties: {
x: SLIDE_WIDTH/2 + 40, y: 120, width: SLIDE_WIDTH/2 - 120, height: SLIDE_HEIGHT - 200,
fill: hexToRgba(colors.secondary, 0.08), cornerRadius: 16,
shadowColor: hexToRgba(colors.secondary, 0.1), shadowBlur: 12, shadowOffsetY: 6
}
},
// Professional column labels with icons
{
element_type: "text", text: "Option A",
konva_component: "Text", properties: {
x: 80 + 20, y: 90, width: SLIDE_WIDTH/2 - 140, height: 30,
fontSize: 20, fontFamily: "Raleway, sans-serif", fontWeight: "600",
fill: colors.primary, align: "center"
}
},
{
element_type: "text", text: "Option B",
konva_component: "Text", properties: {
x: SLIDE_WIDTH/2 + 40 + 20, y: 90, width: SLIDE_WIDTH/2 - 140, height: 30,
fontSize: 20, fontFamily: "Raleway, sans-serif", fontWeight: "600",
fill: colors.secondary, align: "center"
}
},
// Left bullets
...leftBullets.slice(0, 4).map((bullet: any, index: number) => ({
element_type: "bullet_point", text: bullet.text,
konva_component: "Text", properties: {
x: 100, y: 130 + (index * 60), width: SLIDE_WIDTH/2 - 140, height: 50,
fontSize: 16, fontFamily: "Raleway, sans-serif", fontWeight: "400",
fill: textColor, align: "left", lineHeight: 1.3,
shadowColor: hexToRgba(textColor, 0.1), shadowBlur: 4
}
})),
// Right bullets
...rightBullets.slice(0, 4).map((bullet: any, index: number) => ({
element_type: "bullet_point", text: bullet.text,
konva_component: "Text", properties: {
x: SLIDE_WIDTH/2 + 60, y: 130 + (index * 60), width: SLIDE_WIDTH/2 - 140, height: 50,
fontSize: 16, fontFamily: "Raleway, sans-serif", fontWeight: "400",
fill: textColor, align: "left", lineHeight: 1.3,
shadowColor: hexToRgba(textColor, 0.1), shadowBlur: 4
}
})),
// Elegant divider
{
element_type: "shape", konva_component: "Rect", shape_id: uuidv4(),
properties: {
x: SLIDE_WIDTH/2 - 2, y: 100, width: 4, height: SLIDE_HEIGHT - 180,
fillLinearGradientStartPoint: { x: 0, y: 0 },
fillLinearGradientEndPoint: { x: 0, y: SLIDE_HEIGHT - 180 },
fillLinearGradientColorStops: [0, colors.primary, 1, colors.accent],
shadowColor: hexToRgba(colors.primary, 0.2), shadowBlur: 6
}
}
]
};
},
variant2: (slide: any, colors: any, textColor: string, SLIDE_WIDTH: number = 960, SLIDE_HEIGHT: number = 540) => {
const leftBullets = slide.elements?.filter((el: any) => el.element_type === "left_bullet") || [];
const rightBullets = slide.elements?.filter((el: any) => el.element_type === "right_bullet") || [];
return {
...slide,
slide_title: {
text: slide.slide_title?.text || "Pros vs Cons",
konva_component: "Text",
properties: {
x: 60, y: 60, width: SLIDE_WIDTH - 120, height: 50,
fontSize: 32, fontFamily: "Raleway, sans-serif", fontWeight: "700",
fill: textColor, align: "center", lineHeight: 1.1
}
},
elements: [
{ element_type: "shape", konva_component: "Rect", shape_id: uuidv4(),
properties: { x: 0, y: 0, width: SLIDE_WIDTH, height: SLIDE_HEIGHT, fill: colors.background }
},
// Wave divider for modern feel
{
element_type: "shape", konva_component: "Line", shape_id: uuidv4(),
properties: {
points: [SLIDE_WIDTH/2, 80, SLIDE_WIDTH/2 + 20, 120, SLIDE_WIDTH/2, 160, SLIDE_WIDTH/2 - 20, 200, SLIDE_WIDTH/2, SLIDE_HEIGHT - 100],
stroke: colors.accent, strokeWidth: 3, tension: 0.4, lineCap: "round"
}
},
// Left pros icons
...leftBullets.slice(0, 3).map((bullet: any, index: number) => ({
element_type: "shape", konva_component: "Path", shape_id: uuidv4(),
properties: {
x: 80, y: 130 + (index * 80), data: "M0 0L10 5L0 10Z", fill: colors.primary, scaleX: 2
}
})),
// Right cons icons
...rightBullets.slice(0, 3).map((bullet: any, index: number) => ({
element_type: "shape", konva_component: "Path", shape_id: uuidv4(),
properties: {
x: SLIDE_WIDTH/2 + 40, y: 130 + (index * 80), data: "M0 10L10 0M0 0L10 10", stroke: colors.secondary, strokeWidth: 3
}
})),
// Bullets with improved spacing
...leftBullets.slice(0, 3).map((bullet: any, index: number) => ({
element_type: "bullet_point", text: bullet.text,
konva_component: "Text", properties: {
x: 110, y: 120 + (index * 80), width: SLIDE_WIDTH/2 - 150, height: 60,
fontSize: 16, fontFamily: "Raleway, sans-serif", fontWeight: "400",
fill: textColor, align: "left", lineHeight: 1.4
}
})),
...rightBullets.slice(0, 3).map((bullet: any, index: number) => ({
element_type: "bullet_point", text: bullet.text,
konva_component: "Text", properties: {
x: SLIDE_WIDTH/2 + 70, y: 120 + (index * 80), width: SLIDE_WIDTH/2 - 150, height: 60,
fontSize: 16, fontFamily: "Raleway, sans-serif", fontWeight: "400",
fill: textColor, align: "left", lineHeight: 1.4
}
}))
]
};
},
variant3: (slide: any, colors: any, textColor: string, SLIDE_WIDTH: number = 960, SLIDE_HEIGHT: number = 540) => {
const bullets = slide.elements?.filter((el: any) => el.element_type === "bullet_point") || [];
return {
...slide,
slide_title: {
text: slide.slide_title?.text || "Side-by-Side Analysis",
konva_component: "Text",
properties: {
x: 80, y: 80, width: SLIDE_WIDTH - 160, height: 40,
fontSize: 28, fontFamily: "Raleway, sans-serif", fontWeight: "600",
fill: textColor, align: "center", lineHeight: 1.1
}
},
elements: [
{ element_type: "shape", konva_component: "Rect", shape_id: uuidv4(),
properties: { x: 0, y: 0, width: SLIDE_WIDTH, height: SLIDE_HEIGHT, fill: colors.background }
},
// Table-like grid with borders
...[0,1,2].map(row => ({
element_type: "shape", konva_component: "Rect", shape_id: uuidv4(),
properties: {
x: 80, y: 140 + (row * 120), width: SLIDE_WIDTH - 160, height: 2,
fill: hexToRgba(textColor, 0.15)
}
})),
// Vertical dividers
{
element_type: "shape", konva_component: "Rect", shape_id: uuidv4(),
properties: {
x: SLIDE_WIDTH/2 - 1, y: 120, width: 2, height: SLIDE_HEIGHT - 200,
fill: hexToRgba(textColor, 0.2)
}
},
// Bullets in table format
...bullets.slice(0, 6).map((bullet: any, index: number) => ({
element_type: "bullet_point", text: bullet.text,
konva_component: "Text", properties: {
x: index % 2 === 0 ? 100 : SLIDE_WIDTH/2 + 20,
y: 130 + (Math.floor(index / 2) * 120),
width: SLIDE_WIDTH/2 - 120, height: 100,
fontSize: 14, fontFamily: "Raleway, sans-serif", fontWeight: "400",
fill: textColor, align: "left", lineHeight: 1.3
}
}))
]
};
},
variant4: (slide: any, colors: any, textColor: string, SLIDE_WIDTH: number = 960, SLIDE_HEIGHT: number = 540) => {
const leftBullets = slide.elements?.filter((el: any) => el.element_type === "left_bullet") || [];
const rightBullets = slide.elements?.filter((el: any) => el.element_type === "right_bullet") || [];
return {
...slide,
slide_title: {
text: slide.slide_title?.text || "Balanced Comparison",
konva_component: "Text",
properties: {
x: 60, y: 70, width: SLIDE_WIDTH - 120, height: 60,
fontSize: 34, fontFamily: "Raleway, sans-serif", fontWeight: "700",
fill: textColor, align: "center", lineHeight: 1.2
}
},
elements: [
{ element_type: "shape", konva_component: "Rect", shape_id: uuidv4(),
properties: { x: 0, y: 0, width: SLIDE_WIDTH, height: SLIDE_HEIGHT, fill: colors.background }
},
// Card-based comparison with hover-like shadows
{
element_type: "shape", konva_component: "Rect", shape_id: uuidv4(),
properties: {
x: 80, y: 150, width: SLIDE_WIDTH/2 - 120, height: 300,
fill: colors.surface, cornerRadius: 20,
shadowColor: hexToRgba(colors.primary, 0.15), shadowBlur: 20, shadowOffsetY: 10
}
},
{
element_type: "shape", konva_component: "Rect", shape_id: uuidv4(),
properties: {
x: SLIDE_WIDTH/2 + 40, y: 150, width: SLIDE_WIDTH/2 - 120, height: 300,
fill: colors.surface, cornerRadius: 20,
shadowColor: hexToRgba(colors.secondary, 0.15), shadowBlur: 20, shadowOffsetY: 10
}
},
// Header underlines
{
element_type: "shape", konva_component: "Rect", shape_id: uuidv4(),
properties: {
x: 100, y: 130, width: SLIDE_WIDTH/2 - 140, height: 3,
fill: colors.primary, cornerRadius: 2
}
},
{
element_type: "shape", konva_component: "Rect", shape_id: uuidv4(),
properties: {
x: SLIDE_WIDTH/2 + 60, y: 130, width: SLIDE_WIDTH/2 - 140, height: 3,
fill: colors.secondary, cornerRadius: 2
}
},
// Bullets inside cards
...leftBullets.slice(0, 4).map((bullet: any, index: number) => ({
element_type: "bullet_point", text: bullet.text,
konva_component: "Text", properties: {
x: 100, y: 160 + (index * 65), width: SLIDE_WIDTH/2 - 140, height: 55,
fontSize: 16, fontFamily: "Raleway, sans-serif", fontWeight: "400",
fill: textColor, align: "left", lineHeight: 1.4
}
})),
...rightBullets.slice(0, 4).map((bullet: any, index: number) => ({
element_type: "bullet_point", text: bullet.text,
konva_component: "Text", properties: {
x: SLIDE_WIDTH/2 + 60, y: 160 + (index * 65), width: SLIDE_WIDTH/2 - 140, height: 55,
fontSize: 16, fontFamily: "Raleway, sans-serif", fontWeight: "400",
fill: textColor, align: "left", lineHeight: 1.4
}
}))
]
};
},
variant5: (slide: any, colors: any, textColor: string, SLIDE_WIDTH: number = 960, SLIDE_HEIGHT: number = 540) => {
const bullets = slide.elements?.filter((el: any) => el.element_type === "bullet_point") || [];
return {
...slide,
slide_title: {
text: slide.slide_title?.text || "Visual Side-by-Side",
konva_component: "Text",
properties: {
x: 80, y: 90, width: SLIDE_WIDTH - 160, height: 50,
fontSize: 30, fontFamily: "Raleway, sans-serif", fontWeight: "600",
fill: textColor, align: "center", lineHeight: 1.1
}
},
elements: [
{ element_type: "shape", konva_component: "Rect", shape_id: uuidv4(),
properties: { x: 0, y: 0, width: SLIDE_WIDTH, height: SLIDE_HEIGHT, fill: colors.background }
},
// Asymmetrical balanced icons with connection lines
{
element_type: "shape", konva_component: "Line", shape_id: uuidv4(),
properties: {
points: [200, 150, SLIDE_WIDTH - 200, 150],
stroke: hexToRgba(colors.accent, 0.4), strokeWidth: 2, dash: [5, 5], lineCap: "round"
}
},
{
element_type: "shape", konva_component: "Circle", shape_id: uuidv4(),
properties: {
x: 200, y: 150, radius: 25, fill: hexToRgba(colors.primary, 0.3),
shadowColor: hexToRgba(colors.primary, 0.2), shadowBlur: 10
}
},
{
element_type: "shape", konva_component: "Circle", shape_id: uuidv4(),
properties: {
x: SLIDE_WIDTH - 200, y: 150, radius: 25, fill: hexToRgba(colors.secondary, 0.3),
shadowColor: hexToRgba(colors.secondary, 0.2), shadowBlur: 10
}
},
// Bullets positioned around icons
...bullets.slice(0, 4).map((bullet: any, index: number) => ({
element_type: "bullet_point", text: bullet.text,
konva_component: "Text", properties: {
x: index < 2 ? 80 : SLIDE_WIDTH - 400,
y: 120 + (index % 2 * 120),
width: 200, height: 100,
fontSize: 15, fontFamily: "Raleway, sans-serif", fontWeight: "400",
fill: textColor, align: "left", lineHeight: 1.3
}
}))
]
};
}
};