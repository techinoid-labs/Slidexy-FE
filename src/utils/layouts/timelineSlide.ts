import { v4 as uuidv4 } from "uuid";
const hexToRgba = (hex: string, alpha: number): string => {
const normalized = hex.startsWith('#') ? hex : `#${hex}`;
const r = parseInt(normalized.slice(1, 3), 16);
const g = parseInt(normalized.slice(3, 5), 16);
const b = parseInt(normalized.slice(5, 7), 16);
return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
export const createTimelineSlide = {
variant1: (slide: any, colors: any, textColor: string, SLIDE_WIDTH: number = 960, SLIDE_HEIGHT: number = 540) => {
const bullets = slide.elements?.filter((el: any) => el.element_type === "bullet_point") || [];
return {
...slide,
slide_title: {
text: slide.slide_title?.text || "Journey Timeline",
konva_component: "Text",
properties: {
x: 60, y: 40, width: SLIDE_WIDTH - 120, height: 60,
fontSize: 36, fontFamily: "Raleway, sans-serif", fontWeight: "800",
fill: textColor, align: "center", lineHeight: 1.2,
shadowColor: hexToRgba(textColor, 0.2), shadowBlur: 10
}
},
elements: [
{ element_type: "shape", konva_component: "Rect", shape_id: uuidv4(),
properties: { x: 0, y: 0, width: SLIDE_WIDTH, height: SLIDE_HEIGHT, fill: colors.background }
},
// Thick timeline line with cap
{
element_type: "shape", konva_component: "Rect", shape_id: uuidv4(),
properties: {
x: SLIDE_WIDTH/2 - 3, y: 120, width: 6, height: SLIDE_HEIGHT - 200,
fill: colors.primary, cornerRadius: [3, 3, 0, 0],
shadowColor: hexToRgba(colors.primary, 0.25), shadowBlur: 8
}
},
// Enhanced timeline nodes
...bullets.slice(0, 4).map((bullet: any, index: number) => [
{
element_type: "shape", konva_component: "Circle", shape_id: uuidv4(),
properties: {
x: SLIDE_WIDTH/2, y: 150 + (index * 100), radius: 10,
fill: colors.accent, stroke: colors.primary, strokeWidth: 3,
shadowColor: hexToRgba(colors.accent, 0.3), shadowBlur: 12
}
},
{
element_type: "bullet_point", text: bullet.text,
konva_component: "Text", properties: {
x: 60, y: 140 + (index * 100), width: SLIDE_WIDTH - 120, height: 60,
fontSize: 16, fontFamily: "Raleway, sans-serif", fontWeight: "500",
fill: textColor, align: "center", lineHeight: 1.3
}
}
]).flat()
]
};
},
variant2: (slide: any, colors: any, textColor: string, SLIDE_WIDTH: number = 960, SLIDE_HEIGHT: number = 540) => {
const bullets = slide.elements?.filter((el: any) => el.element_type === "bullet_point") || [];
return {
...slide,
slide_title: {
text: slide.slide_title?.text || "Project Milestones",
konva_component: "Text",
properties: {
x: 80, y: 60, width: SLIDE_WIDTH - 160, height: 50,
fontSize: 32, fontFamily: "Raleway, sans-serif", fontWeight: "700",
fill: textColor, align: "center", lineHeight: 1.1
}
},
elements: [
{ element_type: "shape", konva_component: "Rect", shape_id: uuidv4(),
properties: { x: 0, y: 0, width: SLIDE_WIDTH, height: SLIDE_HEIGHT, fill: colors.background }
},
// Horizontal timeline with markers
{
element_type: "shape", konva_component: "Rect", shape_id: uuidv4(),
properties: {
x: 100, y: SLIDE_HEIGHT/2 - 2, width: SLIDE_WIDTH - 200, height: 4,
fill: colors.secondary, cornerRadius: 2,
shadowColor: hexToRgba(colors.secondary, 0.2), shadowBlur: 6
}
},
// Date markers
...bullets.slice(0, 5).map((bullet: any, index: number) => ({
element_type: "shape", konva_component: "Rect", shape_id: uuidv4(),
properties: {
x: 120 + (index * (SLIDE_WIDTH - 240) / 4), y: SLIDE_HEIGHT/2 - 20, width: 20, height: 40,
fill: colors.primary, cornerRadius: 10
}
})),
// Bullet descriptions
...bullets.slice(0, 5).map((bullet: any, index: number) => ({
element_type: "bullet_point", text: bullet.text,
konva_component: "Text", properties: {
x: 100 + (index * (SLIDE_WIDTH - 200) / 4), y: SLIDE_HEIGHT/2 + 10, width: 40, height: 60,
fontSize: 14, fontFamily: "Raleway, sans-serif", fontWeight: "400",
fill: textColor, align: "center", lineHeight: 1.2
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
text: slide.slide_title?.text || "Key Milestones",
konva_component: "Text",
properties: {
x: 100, y: 80, width: SLIDE_WIDTH - 200, height: 40,
fontSize: 28, fontFamily: "Raleway, sans-serif", fontWeight: "700",
fill: textColor, align: "center", lineHeight: 1.1
}
},
elements: [
{ element_type: "shape", konva_component: "Rect", shape_id: uuidv4(),
properties: { x: 0, y: 0, width: SLIDE_WIDTH, height: SLIDE_HEIGHT, fill: colors.background }
},
// Dotted timeline with enhanced dash
{
element_type: "shape", konva_component: "Rect", shape_id: uuidv4(),
properties: {
x: 120, y: 200, width: SLIDE_WIDTH - 240, height: 3,
fill: colors.primary, dash: [8, 8], lineCap: "round",
shadowColor: hexToRgba(colors.primary, 0.15), shadowBlur: 4
}
},
// Milestone diamonds
...bullets.slice(0, 4).map((bullet: any, index: number) => ({
element_type: "shape", konva_component: "RegularPolygon", shape_id: uuidv4(),
properties: {
x: 140 + (index * (SLIDE_WIDTH - 280) / 3), y: 195, radius: 12, sides: 4, rotation: 45,
fill: colors.accent, stroke: textColor, strokeWidth: 2
}
})),
// Bullet labels
...bullets.slice(0, 4).map((bullet: any, index: number) => ({
element_type: "bullet_point", text: bullet.text,
konva_component: "Text", properties: {
x: 120 + (index * (SLIDE_WIDTH - 240) / 3), y: 220, width: 60, height: 80,
fontSize: 14, fontFamily: "Raleway, sans-serif", fontWeight: "400",
fill: textColor, align: "center", lineHeight: 1.2
}
}))
]
};
},
variant4: (slide: any, colors: any, textColor: string, SLIDE_WIDTH: number = 960, SLIDE_HEIGHT: number = 540) => {
const bullets = slide.elements?.filter((el: any) => el.element_type === "bullet_point") || [];
return {
...slide,
slide_title: {
text: slide.slide_title?.text || "Historical Progression",
konva_component: "Text",
properties: {
x: 60, y: 70, width: SLIDE_WIDTH - 120, height: 60,
fontSize: 34, fontFamily: "Raleway, sans-serif", fontWeight: "800",
fill: textColor, align: "center", lineHeight: 1.2
}
},
elements: [
{ element_type: "shape", konva_component: "Rect", shape_id: uuidv4(),
properties: { x: 0, y: 0, width: SLIDE_WIDTH, height: SLIDE_HEIGHT, fill: colors.background }
},
// Curved path with tension
{
element_type: "shape", konva_component: "Line", shape_id: uuidv4(),
properties: {
points: [100, 300, SLIDE_WIDTH/2, 200, SLIDE_WIDTH - 100, 300],
stroke: colors.accent, strokeWidth: 4, tension: 0.6, lineCap: "round",
shadowColor: hexToRgba(colors.accent, 0.3), shadowBlur: 10
}
},
// Curved nodes
...bullets.slice(0, 3).map((bullet: any, index: number) => ({
element_type: "shape", konva_component: "Ellipse", shape_id: uuidv4(),
properties: {
x: 100 + (index * (SLIDE_WIDTH - 200) / 2), y: 250 + (index % 2 * 50), radiusX: 15, radiusY: 10,
fill: colors.primary, stroke: colors.accent, strokeWidth: 2
}
})),
// Descriptive texts
...bullets.slice(0, 3).map((bullet: any, index: number) => ({
element_type: "bullet_point", text: bullet.text,
konva_component: "Text", properties: {
x: 80 + (index * (SLIDE_WIDTH - 160) / 2), y: 280 + (index % 2 * 50), width: 100, height: 60,
fontSize: 16, fontFamily: "Raleway, sans-serif", fontWeight: "500",
fill: textColor, align: "center", lineHeight: 1.3
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
text: slide.slide_title?.text || "Forward Momentum",
konva_component: "Text",
properties: {
x: 80, y: 90, width: SLIDE_WIDTH - 160, height: 50,
fontSize: 30, fontFamily: "Raleway, sans-serif", fontWeight: "800",
fill: textColor, align: "center", lineHeight: 1.1
}
},
elements: [
{ element_type: "shape", konva_component: "Rect", shape_id: uuidv4(),
properties: { x: 0, y: 0, width: SLIDE_WIDTH, height: SLIDE_HEIGHT, fill: colors.background }
},
// Multi-stop gradient timeline
{
element_type: "shape", konva_component: "Rect", shape_id: uuidv4(),
properties: {
x: 150, y: 250, width: SLIDE_WIDTH - 300, height: 5,
fillLinearGradientStartPoint: { x: 0, y: 0 },
fillLinearGradientEndPoint: { x: SLIDE_WIDTH - 300, y: 0 },
fillLinearGradientColorStops: [0, colors.primary, 0.3, hexToRgba(colors.accent, 0.8), 0.7, colors.secondary, 1, hexToRgba(colors.primary, 0.7)],
cornerRadius: 3
}
},
// Progress indicators
...bullets.slice(0, 4).map((bullet: any, index: number) => ({
element_type: "shape", konva_component: "Rect", shape_id: uuidv4(),
properties: {
x: 160 + (index * (SLIDE_WIDTH - 320) / 3), y: 240, width: 20, height: 20,
fill: colors.accent, cornerRadius: 10,
shadowColor: hexToRgba(colors.accent, 0.25), shadowBlur: 8
}
})),
// Bullet progress notes
...bullets.slice(0, 4).map((bullet: any, index: number) => ({
element_type: "bullet_point", text: bullet.text,
konva_component: "Text", properties: {
x: 150 + (index * (SLIDE_WIDTH - 300) / 3), y: 270, width: 40, height: 80,
fontSize: 14, fontFamily: "Raleway, sans-serif", fontWeight: "400",
fill: textColor, align: "center", lineHeight: 1.2
}
}))
]
};
}
};